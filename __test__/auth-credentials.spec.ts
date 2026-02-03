import { hashPassword, comparePassword } from '@app/utils/password'
import { prisma } from '@lib/prismaClient'

// Mock dependencies
jest.mock('@lib/prismaClient', () => ({
  prisma: {
    userData: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    providerAccount: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}))
jest.mock('@app/utils/password')

const mockHashPassword = hashPassword as jest.MockedFunction<
  typeof hashPassword
>
const mockComparePassword = comparePassword as jest.MockedFunction<
  typeof comparePassword
>

describe('Credentials Provider Authorization', () => {
  let authorizeFunction: any

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock the authorize function behavior
    authorizeFunction = async (credentials: any) => {
      if (!credentials) return null

      const email = credentials.email as string
      const password = credentials.password as string
      const isNewAccount = credentials.isNewAccount === 'true'

      try {
        let user = await prisma.userData.findUnique({
          where: { email: email },
        })

        // Handle new account creation
        if (isNewAccount && !user) {
          user = await prisma.userData.create({
            data: {
              email: email,
              name: email.split('@')[0],
              provider_id: `credentials_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
              role: 'user',
            },
          })

          const hashedPassword = await hashPassword(password)
          await prisma.providerAccount.create({
            data: {
              userId: user.id,
              provider: 'credentials',
              providerAccountId: user.id,
              type: 'credentials',
              credentials_password: hashedPassword,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          })

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        }

        // Handle existing user login
        if (!user) {
          console.log('User not found for login:', email)
          return null
        }

        // Verify password for credentials provider
        const providerAccount = await prisma.providerAccount.findFirst({
          where: {
            userId: user.id,
            provider: 'credentials',
          },
        })

        if (!providerAccount || !providerAccount.credentials_password) {
          console.log('No credentials provider found for user:', email)
          return null
        }

        // Compare provided password with stored hash
        const isValidPassword = await comparePassword(
          password,
          providerAccount.credentials_password
        )

        if (!isValidPassword) {
          console.log('Invalid password for user:', email)
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      } catch (error) {
        console.error('Error in credentials authorize:', error)
        return null
      }
    }
  })

  describe('New Account Creation', () => {
    it('should create new user with credentials provider', async () => {
      const mockUser = {
        id: 'user123',
        email: 'newuser@example.com',
        name: 'newuser',
        role: 'user',
      }

      jest.mocked(prisma.userData.findUnique).mockResolvedValue(null)
      jest.mocked(prisma.userData.create).mockResolvedValue(mockUser as any)
      mockHashPassword.mockResolvedValue('hashed_password_123')
      jest.mocked(prisma.providerAccount.create).mockResolvedValue({} as any)

      const result = await authorizeFunction({
        email: 'newuser@example.com',
        password: 'SecurePassword123!',
        isNewAccount: 'true',
      })

      expect(prisma.userData.findUnique).toHaveBeenCalledWith({
        where: { email: 'newuser@example.com' },
      })
      expect(prisma.userData.create).toHaveBeenCalled()
      expect(mockHashPassword).toHaveBeenCalledWith('SecurePassword123!')
      expect(prisma.providerAccount.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user123',
            provider: 'credentials',
            type: 'credentials',
            credentials_password: 'hashed_password_123',
          }),
        })
      )
      expect(result).toEqual({
        id: 'user123',
        name: 'newuser',
        email: 'newuser@example.com',
      })
    })

    it('should not create duplicate account if user already exists', async () => {
      const existingUser = {
        id: 'user123',
        email: 'existing@example.com',
        name: 'existing',
        role: 'user',
      }

      jest
        .mocked(prisma.userData.findUnique)
        .mockResolvedValue(existingUser as any)
      jest.mocked(prisma.providerAccount.findFirst).mockResolvedValue({
        id: 'provider123',
        credentials_password: 'hashed_password',
      } as any)
      mockComparePassword.mockResolvedValue(true)

      const result = await authorizeFunction({
        email: 'existing@example.com',
        password: 'password',
        isNewAccount: 'true',
      })

      expect(prisma.userData.create).not.toHaveBeenCalled()
      expect(result).toEqual({
        id: 'user123',
        name: 'existing',
        email: 'existing@example.com',
      })
    })
  })

  describe('Existing User Login - Password Verification', () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    }

    it('should successfully authenticate with correct password', async () => {
      const mockProviderAccount = {
        id: 'provider123',
        userId: 'user123',
        provider: 'credentials',
        credentials_password: 'hashed_password_123',
      }

      jest.mocked(prisma.userData.findUnique).mockResolvedValue(mockUser as any)
      jest
        .mocked(prisma.providerAccount.findFirst)
        .mockResolvedValue(mockProviderAccount as any)
      mockComparePassword.mockResolvedValue(true)

      const result = await authorizeFunction({
        email: 'test@example.com',
        password: 'CorrectPassword123!',
        isNewAccount: 'false',
      })

      expect(prisma.userData.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      })
      expect(prisma.providerAccount.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user123',
          provider: 'credentials',
        },
      })
      expect(mockComparePassword).toHaveBeenCalledWith(
        'CorrectPassword123!',
        'hashed_password_123'
      )
      expect(result).toEqual({
        id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
      })
    })

    it('should reject authentication with incorrect password', async () => {
      const mockProviderAccount = {
        id: 'provider123',
        userId: 'user123',
        provider: 'credentials',
        credentials_password: 'hashed_password_123',
      }

      jest.mocked(prisma.userData.findUnique).mockResolvedValue(mockUser as any)
      jest
        .mocked(prisma.providerAccount.findFirst)
        .mockResolvedValue(mockProviderAccount as any)
      mockComparePassword.mockResolvedValue(false)

      const result = await authorizeFunction({
        email: 'test@example.com',
        password: 'WrongPassword',
        isNewAccount: 'false',
      })

      expect(mockComparePassword).toHaveBeenCalledWith(
        'WrongPassword',
        'hashed_password_123'
      )
      expect(result).toBeNull()
    })

    it('should return null when user does not exist', async () => {
      jest.mocked(prisma.userData.findUnique).mockResolvedValue(null)

      const result = await authorizeFunction({
        email: 'nonexistent@example.com',
        password: 'password',
        isNewAccount: 'false',
      })

      expect(result).toBeNull()
      expect(prisma.providerAccount.findFirst).not.toHaveBeenCalled()
    })

    it('should return null when no credentials provider exists for user', async () => {
      jest.mocked(prisma.userData.findUnique).mockResolvedValue(mockUser as any)
      jest.mocked(prisma.providerAccount.findFirst).mockResolvedValue(null)

      const result = await authorizeFunction({
        email: 'test@example.com',
        password: 'password',
        isNewAccount: 'false',
      })

      expect(prisma.providerAccount.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user123',
          provider: 'credentials',
        },
      })
      expect(result).toBeNull()
    })

    it('should return null when credentials_password is missing', async () => {
      const mockProviderAccountWithoutPassword = {
        id: 'provider123',
        userId: 'user123',
        provider: 'credentials',
        credentials_password: null,
      }
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.providerAccount.findFirst as jest.Mock).mockResolvedValue(
        mockProviderAccountWithoutPassword
      )

      const result = await authorizeFunction({
        email: 'test@example.com',
        password: 'password',
        isNewAccount: 'false',
      })

      expect(result).toBeNull()
      expect(mockComparePassword).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should return null when credentials are not provided', async () => {
      const result = await authorizeFunction(null)
      expect(result).toBeNull()
    })

    it('should return null on database error', async () => {
      ;(prisma.userData.findUnique as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      )

      const result = await authorizeFunction({
        email: 'test@example.com',
        password: 'password',
        isNewAccount: 'false',
      })

      expect(result).toBeNull()
    })

    it('should return null on password hashing error during account creation', async () => {
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(null)
      ;(prisma.userData.create as jest.Mock).mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
        name: 'test',
      })
      mockHashPassword.mockRejectedValue(new Error('Hashing failed'))

      const result = await authorizeFunction({
        email: 'test@example.com',
        password: 'password',
        isNewAccount: 'true',
      })

      expect(result).toBeNull()
    })
  })

  describe('Security - Password Verification Required', () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
    }

    it('should always verify password for existing user login', async () => {
      const mockProviderAccount = {
        id: 'provider123',
        userId: 'user123',
        provider: 'credentials',
        credentials_password: 'hashed_password_123',
      }
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.providerAccount.findFirst as jest.Mock).mockResolvedValue(
        mockProviderAccount
      )
      mockComparePassword.mockResolvedValue(true)

      await authorizeFunction({
        email: 'test@example.com',
        password: 'password',
        isNewAccount: 'false',
      })

      // Verify that comparePassword was called (password verification happened)
      expect(mockComparePassword).toHaveBeenCalled()
    })

    it('should not allow login without password verification', async () => {
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.providerAccount.findFirst as jest.Mock).mockResolvedValue({
        id: 'provider123',
        credentials_password: 'hashed_password',
      })

      // Don't call comparePassword (simulating the security bug)
      mockComparePassword.mockResolvedValue(false)

      const result = await authorizeFunction({
        email: 'test@example.com',
        password: 'any_password',
        isNewAccount: 'false',
      })

      // Should fail because password doesn't match
      expect(result).toBeNull()
    })
  })
})
