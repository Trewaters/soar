import { POST } from '@app/api/user/connected-accounts/add-password/route'
import { NextRequest } from 'next/server'
import prisma from '@app/lib/prismaClient'
import { hashPassword } from '@app/utils/password'

// Mock dependencies
jest.mock('../../../../../../auth', () => ({
  auth: jest.fn(),
}))

jest.mock('@app/lib/prismaClient', () => ({
  __esModule: true,
  default: {
    providerAccount: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock('@app/utils/password', () => ({
  hashPassword: jest.fn(),
}))

const { auth } = require('../../../../../../auth')

describe('POST /api/user/connected-accounts/add-password', () => {
  const mockSession = {
    user: {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
    },
    expires: new Date().toISOString(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Authentication', () => {
    it('should return 401 if user is not authenticated', async () => {
      ;(auth as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest(
        'http://localhost:3000/api/user/connected-accounts/add-password',
        {
          method: 'POST',
          body: JSON.stringify({ password: 'TestPass123' }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('Request Validation', () => {
    beforeEach(() => {
      ;(auth as jest.Mock).mockResolvedValue(mockSession)
    })

    it('should return 400 if password is missing', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/user/connected-accounts/add-password',
        {
          method: 'POST',
          body: JSON.stringify({}),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Password is required')
    })

    it('should return 400 if password is too short', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/user/connected-accounts/add-password',
        {
          method: 'POST',
          body: JSON.stringify({ password: 'Short1' }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Password must be at least 8 characters long')
    })

    it('should return 400 if password has no uppercase letter', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/user/connected-accounts/add-password',
        {
          method: 'POST',
          body: JSON.stringify({ password: 'testpass123' }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe(
        'Password must contain at least one uppercase letter'
      )
    })

    it('should return 400 if password has no lowercase letter', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/user/connected-accounts/add-password',
        {
          method: 'POST',
          body: JSON.stringify({ password: 'TESTPASS123' }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe(
        'Password must contain at least one lowercase letter'
      )
    })

    it('should return 400 if password has no number', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/user/connected-accounts/add-password',
        {
          method: 'POST',
          body: JSON.stringify({ password: 'TestPassword' }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Password must contain at least one number')
    })
  })

  describe('Duplicate Check', () => {
    beforeEach(() => {
      ;(auth as jest.Mock).mockResolvedValue(mockSession)
    })

    it('should return 409 if user already has credentials provider', async () => {
      ;(prisma.providerAccount.findFirst as jest.Mock).mockResolvedValue({
        id: 'existing-credentials',
        userId: 'user-123',
        provider: 'credentials',
        providerAccountId: 'user-123',
      })

      const request = new NextRequest(
        'http://localhost:3000/api/user/connected-accounts/add-password',
        {
          method: 'POST',
          body: JSON.stringify({ password: 'TestPass123' }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('User already has a password set')
    })
  })

  describe('Successful Password Addition', () => {
    beforeEach(() => {
      ;(auth as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.providerAccount.findFirst as jest.Mock).mockResolvedValue(null)
      ;(hashPassword as jest.Mock).mockResolvedValue('hashed-password-123')
      ;(prisma.providerAccount.create as jest.Mock).mockResolvedValue({
        id: 'new-credentials',
        userId: 'user-123',
        provider: 'credentials',
        providerAccountId: 'user-123',
        type: 'credentials',
        credentials_password: 'hashed-password-123',
      })
    })

    it('should successfully add password for user without credentials', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/user/connected-accounts/add-password',
        {
          method: 'POST',
          body: JSON.stringify({ password: 'TestPass123' }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Password added successfully')
      expect(data.provider).toBe('credentials')

      // Verify password was hashed
      expect(hashPassword).toHaveBeenCalledWith('TestPass123')

      // Verify provider account was created
      expect(prisma.providerAccount.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          provider: 'credentials',
          providerAccountId: 'user-123',
          type: 'credentials',
          credentials_password: 'hashed-password-123',
        },
      })
    })

    it('should accept password with special characters', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/user/connected-accounts/add-password',
        {
          method: 'POST',
          body: JSON.stringify({ password: 'TestPass123!@#$' }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Password added successfully')
      expect(hashPassword).toHaveBeenCalledWith('TestPass123!@#$')
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      ;(auth as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.providerAccount.findFirst as jest.Mock).mockResolvedValue(null)
    })

    it('should return 500 if password hashing fails', async () => {
      ;(hashPassword as jest.Mock).mockRejectedValue(
        new Error('Hashing failed')
      )

      const request = new NextRequest(
        'http://localhost:3000/api/user/connected-accounts/add-password',
        {
          method: 'POST',
          body: JSON.stringify({ password: 'TestPass123' }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })

    it('should return 500 if database create fails', async () => {
      ;(hashPassword as jest.Mock).mockResolvedValue('hashed-password-123')
      ;(prisma.providerAccount.create as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      const request = new NextRequest(
        'http://localhost:3000/api/user/connected-accounts/add-password',
        {
          method: 'POST',
          body: JSON.stringify({ password: 'TestPass123' }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })
})
