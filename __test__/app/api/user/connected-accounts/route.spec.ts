// Mock dependencies BEFORE importing the route module
jest.mock('../../../../../auth', () => ({
  __esModule: true,
  auth: jest.fn(),
}))

jest.mock('../../../../../prisma/generated/client', () => {
  // Create a shared mock prisma instance so both the test file and the route
  // module (which calls `new PrismaClient()` at import time) receive the same
  // mocked object.
  const mockPrisma = {
    userData: {
      findUnique: jest.fn(),
    },
    providerAccount: {
      delete: jest.fn(),
    },
    $disconnect: jest.fn(),
  }

  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
  }
})

import '@testing-library/jest-dom'
import { GET, DELETE } from '@app/api/user/connected-accounts/route'
import { NextRequest } from 'next/server'
import { auth } from '../../../../../auth'
import { PrismaClient } from '../../../../../prisma/generated/client'

const mockAuth = auth as jest.Mock
const prisma = new PrismaClient()

// Helper to create mock request
function createMockRequest(body: any): NextRequest {
  return {
    json: jest.fn().mockResolvedValue(body),
  } as any
}

describe('Connected Accounts API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/user/connected-accounts', () => {
    it('should return 401 if no session exists', async () => {
      mockAuth.mockResolvedValue(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should return 401 if session has no user email', async () => {
      mockAuth.mockResolvedValue({
        user: {},
        expires: new Date().toISOString(),
      } as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should return 404 if user is not found', async () => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data).toEqual({ error: 'User not found' })
      expect(prisma.userData.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: { providerAccounts: true },
      })
    })

    it('should return connected accounts successfully with google and github', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        providerAccounts: [
          {
            id: 'account-1',
            provider: 'google',
            providerAccountId: 'google-123',
            createdAt: new Date('2024-01-01'),
          },
          {
            id: 'account-2',
            provider: 'github',
            providerAccountId: 'github-456',
            createdAt: new Date('2024-01-02'),
          },
        ],
      }

      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUser)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        accounts: [
          {
            provider: 'google',
            providerAccountId: 'google-123',
            connectedAt: new Date('2024-01-01').toISOString(),
            hasPassword: false,
          },
          {
            provider: 'github',
            providerAccountId: 'github-456',
            connectedAt: new Date('2024-01-02').toISOString(),
            hasPassword: false,
          },
        ],
        totalCount: 2,
      })
    })

    it('should return empty accounts array for user with no provider accounts', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        providerAccounts: [],
      }

      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUser)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        accounts: [],
        totalCount: 0,
      })
    })

    it('should return 500 on database error', async () => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      )

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch connected accounts' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching connected accounts:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })
  })

  describe('DELETE /api/user/connected-accounts', () => {
    it('should return 401 if no session exists', async () => {
      mockAuth.mockResolvedValue(null)
      const request = createMockRequest({ provider: 'google' })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should return 401 if session has no user email', async () => {
      mockAuth.mockResolvedValue({
        user: {},
        expires: new Date().toISOString(),
      } as any)
      const request = createMockRequest({ provider: 'google' })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should return 400 if provider is missing', async () => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      const request = createMockRequest({})

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        error: 'Invalid provider. Must be "google", "github", or "credentials"',
      })
    })

    it('should return 400 if provider is invalid', async () => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      const request = createMockRequest({ provider: 'facebook' })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        error: 'Invalid provider. Must be "google", "github", or "credentials"',
      })
    })

    it('should return 404 if user is not found', async () => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(null)
      const request = createMockRequest({ provider: 'google' })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data).toEqual({ error: 'User not found' })
      expect(prisma.userData.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: { providerAccounts: true },
      })
    })

    it('should return 404 if provider account is not connected', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        providerAccounts: [
          {
            id: 'account-1',
            provider: 'github',
            providerAccountId: 'github-456',
            createdAt: new Date('2024-01-01'),
          },
        ],
      }

      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUser)
      const request = createMockRequest({ provider: 'google' })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data).toEqual({ error: 'google account not connected' })
    })

    it('should return 400 if trying to disconnect the only authentication method', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        providerAccounts: [
          {
            id: 'account-1',
            provider: 'google',
            providerAccountId: 'google-123',
            createdAt: new Date('2024-01-01'),
          },
        ],
      }

      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUser)
      const request = createMockRequest({ provider: 'google' })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        error: 'Cannot disconnect your only authentication method',
      })
    })

    it('should successfully disconnect google account when user has multiple providers', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        providerAccounts: [
          {
            id: 'account-1',
            provider: 'google',
            providerAccountId: 'google-123',
            createdAt: new Date('2024-01-01'),
          },
          {
            id: 'account-2',
            provider: 'github',
            providerAccountId: 'github-456',
            createdAt: new Date('2024-01-02'),
          },
        ],
      }

      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.providerAccount.delete as jest.Mock).mockResolvedValue({
        id: 'account-1',
        provider: 'google',
      })
      const request = createMockRequest({ provider: 'google' })

      const deleteResponse = await DELETE(request)
      const data = await deleteResponse.json()

      expect(deleteResponse.status).toBe(200)
      expect(data).toEqual({
        message: 'google account disconnected successfully',
        provider: 'google',
      })
      expect(prisma.providerAccount.delete).toHaveBeenCalledWith({
        where: { id: 'account-1' },
      })
    })

    it('should successfully disconnect github account when user has multiple providers', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        providerAccounts: [
          {
            id: 'account-1',
            provider: 'google',
            providerAccountId: 'google-123',
            createdAt: new Date('2024-01-01'),
          },
          {
            id: 'account-2',
            provider: 'github',
            providerAccountId: 'github-456',
            createdAt: new Date('2024-01-02'),
          },
        ],
      }

      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.providerAccount.delete as jest.Mock).mockResolvedValue({
        id: 'account-2',
        provider: 'github',
      })
      const request = createMockRequest({ provider: 'github' })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        message: 'github account disconnected successfully',
        provider: 'github',
      })
      expect(prisma.providerAccount.delete).toHaveBeenCalledWith({
        where: { id: 'account-2' },
      })
    })

    it('should return 500 on database error during delete', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        providerAccounts: [
          {
            id: 'account-1',
            provider: 'google',
            providerAccountId: 'google-123',
            createdAt: new Date('2024-01-01'),
          },
          {
            id: 'account-2',
            provider: 'github',
            providerAccountId: 'github-456',
            createdAt: new Date('2024-01-02'),
          },
        ],
      }

      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.providerAccount.delete as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )
      const request = createMockRequest({ provider: 'google' })

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to disconnect account' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error disconnecting account:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })

    it('should return 500 on JSON parse error', async () => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      const request = {
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as any

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to disconnect account' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error disconnecting account:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Happy Path - Complete User Journey', () => {
    it('should handle complete user journey: fetch accounts, then disconnect one', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        providerAccounts: [
          {
            id: 'account-1',
            provider: 'google',
            providerAccountId: 'google-123',
            createdAt: new Date('2024-01-01'),
          },
          {
            id: 'account-2',
            provider: 'github',
            providerAccountId: 'github-456',
            createdAt: new Date('2024-01-02'),
          },
        ],
      }

      const mockUserAfterDelete = {
        id: 'user-123',
        email: 'test@example.com',
        providerAccounts: [
          {
            id: 'account-2',
            provider: 'github',
            providerAccountId: 'github-456',
            createdAt: new Date('2024-01-02'),
          },
        ],
      }

      // Step 1: Fetch accounts
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUser)

      const getResponse = await GET()
      const getData = await getResponse.json()

      expect(getResponse.status).toBe(200)
      expect(getData.totalCount).toBe(2)
      expect(getData.accounts).toHaveLength(2)

      // Step 2: Disconnect one account
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.providerAccount.delete as jest.Mock).mockResolvedValue({
        id: 'account-1',
        provider: 'google',
      })

      const deleteRequest = createMockRequest({ provider: 'google' })
      const deleteResponse = await DELETE(deleteRequest)
      const deleteData = await deleteResponse.json()

      expect(deleteResponse.status).toBe(200)
      expect(deleteData).toEqual({
        message: 'google account disconnected successfully',
        provider: 'google',
      })

      // Step 3: Verify account was removed
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(
        mockUserAfterDelete
      )

      const getResponseAfter = await GET()
      const getDataAfter = await getResponseAfter.json()

      expect(getResponseAfter.status).toBe(200)
      expect(getDataAfter.totalCount).toBe(1)
      expect(getDataAfter.accounts).toHaveLength(1)
      expect(getDataAfter.accounts[0].provider).toBe('github')
    })

    it('should handle user with three providers disconnecting one', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        providerAccounts: [
          {
            id: 'account-1',
            provider: 'google',
            providerAccountId: 'google-123',
            createdAt: new Date('2024-01-01'),
          },
          {
            id: 'account-2',
            provider: 'github',
            providerAccountId: 'github-456',
            createdAt: new Date('2024-01-02'),
          },
        ],
      }

      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.providerAccount.delete as jest.Mock).mockResolvedValue({
        id: 'account-2',
        provider: 'github',
      })

      const request = createMockRequest({ provider: 'github' })
      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        message: 'github account disconnected successfully',
        provider: 'github',
      })
      expect(prisma.providerAccount.delete).toHaveBeenCalledWith({
        where: { id: 'account-2' },
      })
    })
  })
})
