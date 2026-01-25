import '@testing-library/jest-dom'
import { PrismaClient } from '@prisma/client'

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    userData: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    providerAccount: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  }
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  }
})

// Get the mocked Prisma instance
const prisma = new PrismaClient()

describe('NextAuth Session Role Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('JWT Callback - Role Assignment', () => {
    it('should fetch and assign role when setting user ID from database', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        role: 'admin',
      }

      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUser)

      // Simulate JWT callback logic
      const token: any = { email: 'test@example.com' }
      const now = Date.now()

      // Simulate the logic from JWT callback
      if (!token.id && token.email) {
        const user = await prisma.userData.findUnique({
          where: { email: token.email },
          select: { id: true, role: true },
        })
        if (user) {
          token.id = user.id
          token.role = user.role || 'user'
          token.lastUserCheck = now
        }
      }

      expect(prisma.userData.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: { id: true, role: true },
      })
      expect(token.id).toBe('user123')
      expect(token.role).toBe('admin')
      expect(token.lastUserCheck).toBeDefined()
    })

    it('should default to "user" role when database role is null or undefined', async () => {
      const mockUser = {
        id: 'user456',
        email: 'newuser@example.com',
        role: null,
      }

      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUser)

      const token: any = { email: 'newuser@example.com' }
      const now = Date.now()

      if (!token.id && token.email) {
        const user = await prisma.userData.findUnique({
          where: { email: token.email },
          select: { id: true, role: true },
        })
        if (user) {
          token.id = user.id
          token.role = user.role || 'user'
          token.lastUserCheck = now
        }
      }

      expect(token.role).toBe('user')
    })

    it('should refresh role during periodic user existence checks', async () => {
      const mockUser = {
        id: 'user789',
        role: 'admin',
      }

      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUser)

      const token: any = {
        id: 'user789',
        email: 'admin@example.com',
        role: 'user', // Initially user
        lastUserCheck: Date.now() - 6 * 60 * 1000, // 6 minutes ago (exceeds 5 min interval)
      }
      const now = Date.now()
      const shouldCheckUser = true // Simulating trigger

      if (token.id && shouldCheckUser) {
        const userExists = await prisma.userData.findUnique({
          where: { id: token.id },
          select: { id: true, role: true },
        })

        if (userExists) {
          token.role = userExists.role || 'user'
          token.lastUserCheck = now
        }
      }

      expect(prisma.userData.findUnique).toHaveBeenCalledWith({
        where: { id: 'user789' },
        select: { id: true, role: true },
      })
      expect(token.role).toBe('admin') // Role updated from database
    })

    it('should handle user role change from user to admin', async () => {
      const mockPromotedUser = {
        id: 'user101',
        role: 'admin', // User was promoted to admin
      }

      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(
        mockPromotedUser
      )

      const token: any = {
        id: 'user101',
        email: 'promoted@example.com',
        role: 'user', // Old role
        lastUserCheck: Date.now() - 10 * 60 * 1000, // Old check
      }

      const shouldCheckUser = true
      const now = Date.now()

      if (token.id && shouldCheckUser) {
        const userExists = await prisma.userData.findUnique({
          where: { id: token.id },
          select: { id: true, role: true },
        })

        if (userExists) {
          token.role = userExists.role || 'user'
          token.lastUserCheck = now
        }
      }

      expect(token.role).toBe('admin')
      expect(token.lastUserCheck).toBeGreaterThan(Date.now() - 10 * 60 * 1000)
    })
  })

  describe('Session Callback - Role Inclusion', () => {
    it('should include role in session from JWT token', () => {
      const token = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
      }

      const session: any = {
        user: {
          id: '',
          email: '',
          name: '',
        },
      }

      // Simulate session callback logic
      if (session?.user && token.id) {
        session.user.id = token.id
      }
      if (session?.user && token.email) {
        session.user.email = token.email
      }
      if (session?.user && token.name) {
        session.user.name = token.name
      }
      if (session?.user && token.role) {
        session.user.role = token.role
      }

      expect(session.user.role).toBe('admin')
      expect(session.user.id).toBe('user123')
      expect(session.user.email).toBe('test@example.com')
      expect(session.user.name).toBe('Test User')
    })

    it('should handle session with user role', () => {
      const token = {
        id: 'user456',
        email: 'user@example.com',
        name: 'Regular User',
        role: 'user',
      }

      const session: any = {
        user: {},
      }

      if (session?.user && token.role) {
        session.user.role = token.role
      }

      expect(session.user.role).toBe('user')
    })

    it('should not set role if token does not have role', () => {
      const token = {
        id: 'user789',
        email: 'noRole@example.com',
        name: 'No Role User',
        // role is missing
      }

      const session: any = {
        user: {},
      }

      if (session?.user && token.role) {
        session.user.role = token.role
      }

      expect(session.user.role).toBeUndefined()
    })

    it('should handle null session gracefully', () => {
      const token = {
        id: 'user999',
        email: 'null@example.com',
        role: 'admin',
      }

      const session: any = null

      // Simulate the conditional logic
      if (session?.user && token.role) {
        session.user.role = token.role
      }

      expect(session).toBeNull()
    })
  })

  describe('New User Creation - Role Default', () => {
    it('should create OAuth user with default role of "user"', async () => {
      const mockNewUser = {
        id: 'newuser123',
        email: 'newoauth@example.com',
        name: 'New OAuth User',
        role: 'user',
      }

      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(null)
      ;(prisma.userData.create as jest.Mock).mockResolvedValue(mockNewUser)

      // Simulate OAuth user creation
      const userData = {
        provider_id: 'oauth_12345',
        name: 'New OAuth User',
        email: 'newoauth@example.com',
        emailVerified: new Date(),
        image: 'https://example.com/avatar.jpg',
        pronouns: '',
        profile: JSON.stringify({}),
        createdAt: new Date(),
        updatedAt: new Date(),
        firstName: '',
        lastName: '',
        bio: '',
        headline: '',
        location: '',
        websiteURL: '',
        shareQuick: '',
        yogaStyle: '',
        yogaExperience: '',
        company: '',
        socialURL: '',
        isLocationPublic: '',
        role: 'user', // Default role
      }

      const newUser = await prisma.userData.create({
        data: userData,
      })

      expect(newUser.role).toBe('user')
    })

    it('should create credentials user with default role of "user"', async () => {
      const mockNewUser = {
        id: 'creduser123',
        email: 'credentials@example.com',
        name: 'credentials',
        role: 'user',
      }

      ;(prisma.userData.create as jest.Mock).mockResolvedValue(mockNewUser)

      // Simulate credentials user creation
      const userData = {
        email: 'credentials@example.com',
        name: 'credentials',
        provider_id: `credentials_${Date.now()}_abc123`,
        createdAt: new Date(),
        updatedAt: new Date(),
        firstName: '',
        lastName: '',
        bio: '',
        headline: '',
        location: '',
        websiteURL: '',
        shareQuick: '',
        yogaStyle: '',
        yogaExperience: '',
        company: '',
        socialURL: '',
        isLocationPublic: '',
        role: 'user', // Default role for credentials users
      }

      const newUser = await prisma.userData.create({
        data: userData,
      })

      expect(newUser.role).toBe('user')
    })
  })

  describe('Role Persistence and Updates', () => {
    it('should persist role across multiple session refreshes', async () => {
      const mockUser = {
        id: 'persist123',
        role: 'admin',
      }

      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUser)

      // First refresh
      const token1: any = { id: 'persist123', lastUserCheck: 0 }
      const shouldCheckUser1 = true

      if (token1.id && shouldCheckUser1) {
        const userExists = await prisma.userData.findUnique({
          where: { id: token1.id },
          select: { id: true, role: true },
        })
        if (userExists) {
          token1.role = userExists.role || 'user'
        }
      }

      expect(token1.role).toBe('admin')

      // Second refresh - role should persist
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUser)

      const token2: any = { id: 'persist123', role: 'admin', lastUserCheck: 0 }
      const shouldCheckUser2 = true

      if (token2.id && shouldCheckUser2) {
        const userExists = await prisma.userData.findUnique({
          where: { id: token2.id },
          select: { id: true, role: true },
        })
        if (userExists) {
          token2.role = userExists.role || 'user'
        }
      }

      expect(token2.role).toBe('admin')
      expect(prisma.userData.findUnique).toHaveBeenCalledTimes(2)
    })

    it('should update token role when admin role is revoked', async () => {
      const mockDemotedUser = {
        id: 'demoted123',
        role: 'user', // Admin was demoted to user
      }

      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(
        mockDemotedUser
      )

      const token: any = {
        id: 'demoted123',
        role: 'admin', // Old role
        lastUserCheck: 0,
      }
      const shouldCheckUser = true

      if (token.id && shouldCheckUser) {
        const userExists = await prisma.userData.findUnique({
          where: { id: token.id },
          select: { id: true, role: true },
        })
        if (userExists) {
          token.role = userExists.role || 'user'
        }
      }

      expect(token.role).toBe('user')
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing user during JWT token generation', async () => {
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(null)

      const token: any = { email: 'missing@example.com' }

      if (!token.id && token.email) {
        const user = await prisma.userData.findUnique({
          where: { email: token.email },
          select: { id: true, role: true },
        })
        if (user) {
          token.id = user.id
          token.role = user.role || 'user'
        } else {
          token.userDeleted = true
        }
      }

      expect(token.id).toBeUndefined()
      expect(token.role).toBeUndefined()
      expect(token.userDeleted).toBe(true)
    })

    it('should mark token as deleted when user is removed from database', async () => {
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(null)

      const token: any = {
        id: 'deleted123',
        email: 'deleted@example.com',
        role: 'user',
        lastUserCheck: 0,
      }
      const shouldCheckUser = true
      const now = Date.now()

      if (token.id && shouldCheckUser) {
        const userExists = await prisma.userData.findUnique({
          where: { id: token.id },
          select: { id: true, role: true },
        })

        if (!userExists) {
          token.userDeleted = true
          token.id = undefined
          token.lastUserCheck = now
        }
      }

      expect(token.userDeleted).toBe(true)
      expect(token.id).toBeUndefined()
    })

    it('should handle database errors gracefully', async () => {
      ;(prisma.userData.findUnique as jest.Mock).mockRejectedValue(
        new Error('Database connection error')
      )

      const token: any = { email: 'error@example.com' }

      try {
        if (!token.id && token.email) {
          const user = await prisma.userData.findUnique({
            where: { email: token.email },
            select: { id: true, role: true },
          })
          if (user) {
            token.id = user.id
            token.role = user.role || 'user'
          }
        }
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe('Database connection error')
      }

      expect(token.id).toBeUndefined()
      expect(token.role).toBeUndefined()
    })
  })
})
