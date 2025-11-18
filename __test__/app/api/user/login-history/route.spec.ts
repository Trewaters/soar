// Mock dependencies BEFORE importing the route module
jest.mock('../../../../../auth', () => ({
  __esModule: true,
  auth: jest.fn(),
}))

jest.mock('../../../../../prisma/generated/client', () => {
  const mockPrisma = {
    userData: {
      findUnique: jest.fn(),
    },
    userLogin: {
      findMany: jest.fn(),
    },
    $disconnect: jest.fn(),
  }

  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
  }
})

import '@testing-library/jest-dom'
import { GET } from '@app/api/user/login-history/route'
import { auth } from '../../../../../auth'
import { PrismaClient } from '../../../../../prisma/generated/client'

const mockAuth = auth as jest.Mock
const prisma = new PrismaClient()

describe('GET /api/user/login-history', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Authentication', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockAuth.mockResolvedValueOnce(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 401 if session has no email', async () => {
      mockAuth.mockResolvedValueOnce({ user: {} } as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('User Validation', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any)
    })

    it('should return 404 if user is not found', async () => {
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValueOnce(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('User not found')
    })
  })

  describe('Login History Retrieval', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
      })
    })

    it('should return empty array when no login history exists', async () => {
      ;(prisma.userLogin.findMany as jest.Mock).mockResolvedValueOnce([])

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.loginHistory).toEqual([])
      expect(data.totalLogins).toBe(0)
    })

    it('should return formatted login history with device information', async () => {
      const mockLogins = [
        {
          id: 'login1',
          userId: 'user123',
          loginDate: new Date('2024-01-15T10:30:00Z'),
          ipAddress: '192.168.1.1',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          provider: 'google',
          createdAt: new Date('2024-01-15T10:30:00Z'),
        },
        {
          id: 'login2',
          userId: 'user123',
          loginDate: new Date('2024-01-14T15:20:00Z'),
          ipAddress: '192.168.1.2',
          userAgent:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
          provider: 'credentials',
          createdAt: new Date('2024-01-14T15:20:00Z'),
        },
      ]
      ;(prisma.userLogin.findMany as jest.Mock).mockResolvedValueOnce(
        mockLogins
      )

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.loginHistory).toHaveLength(2)
      expect(data.totalLogins).toBe(2)

      // Check first login (Chrome on Windows)
      expect(data.loginHistory[0].id).toBe('login1')
      expect(data.loginHistory[0].device).toContain('Chrome')
      expect(data.loginHistory[0].device).toContain('Windows')
      expect(data.loginHistory[0].location).toBe('192.168.1.1')
      expect(data.loginHistory[0].provider).toBe('Google')

      // Check second login (Safari on iPhone)
      expect(data.loginHistory[1].id).toBe('login2')
      expect(data.loginHistory[1].device).toContain('Safari')
      expect(data.loginHistory[1].device).toContain('iOS')
      expect(data.loginHistory[1].location).toBe('192.168.1.2')
      expect(data.loginHistory[1].provider).toBe('Email/Password')
    })

    it('should query login history with correct parameters', async () => {
      ;(prisma.userLogin.findMany as jest.Mock).mockResolvedValueOnce([])

      await GET()

      expect(prisma.userLogin.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user123',
        },
        orderBy: {
          loginDate: 'desc',
        },
        take: 20,
      })
    })

    it('should handle missing userAgent gracefully', async () => {
      const mockLogins = [
        {
          id: 'login1',
          userId: 'user123',
          loginDate: new Date('2024-01-15T10:30:00Z'),
          ipAddress: '192.168.1.1',
          userAgent: null,
          provider: 'google',
          createdAt: new Date('2024-01-15T10:30:00Z'),
        },
      ]
      ;(prisma.userLogin.findMany as jest.Mock).mockResolvedValueOnce(
        mockLogins
      )

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.loginHistory[0].device).toBe('Unknown Device')
      expect(data.loginHistory[0].userAgent).toBe('')
    })

    it('should handle missing ipAddress gracefully', async () => {
      const mockLogins = [
        {
          id: 'login1',
          userId: 'user123',
          loginDate: new Date('2024-01-15T10:30:00Z'),
          ipAddress: null,
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          provider: 'google',
          createdAt: new Date('2024-01-15T10:30:00Z'),
        },
      ]
      ;(prisma.userLogin.findMany as jest.Mock).mockResolvedValueOnce(
        mockLogins
      )

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.loginHistory[0].location).toBe('Unknown location')
    })

    it('should handle missing provider gracefully', async () => {
      const mockLogins = [
        {
          id: 'login1',
          userId: 'user123',
          loginDate: new Date('2024-01-15T10:30:00Z'),
          ipAddress: '192.168.1.1',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          provider: null,
          createdAt: new Date('2024-01-15T10:30:00Z'),
        },
      ]
      ;(prisma.userLogin.findMany as jest.Mock).mockResolvedValueOnce(
        mockLogins
      )

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.loginHistory[0].provider).toBe('')
    })
  })

  describe('User Agent Parsing', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
      })
    })

    it('should parse Firefox user agent correctly', async () => {
      const mockLogins = [
        {
          id: 'login1',
          userId: 'user123',
          loginDate: new Date(),
          ipAddress: '192.168.1.1',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/120.0',
          provider: 'google',
          createdAt: new Date(),
        },
      ]
      ;(prisma.userLogin.findMany as jest.Mock).mockResolvedValueOnce(
        mockLogins
      )

      const response = await GET()
      const data = await response.json()

      expect(data.loginHistory[0].device).toContain('Firefox')
      expect(data.loginHistory[0].device).toContain('Windows')
    })

    it('should parse Safari on macOS user agent correctly', async () => {
      const mockLogins = [
        {
          id: 'login1',
          userId: 'user123',
          loginDate: new Date(),
          ipAddress: '192.168.1.1',
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
          provider: 'github',
          createdAt: new Date(),
        },
      ]
      ;(prisma.userLogin.findMany as jest.Mock).mockResolvedValueOnce(
        mockLogins
      )

      const response = await GET()
      const data = await response.json()

      expect(data.loginHistory[0].device).toContain('Safari')
      expect(data.loginHistory[0].device).toContain('macOS')
    })

    it('should parse Android Chrome user agent correctly', async () => {
      const mockLogins = [
        {
          id: 'login1',
          userId: 'user123',
          loginDate: new Date(),
          ipAddress: '192.168.1.1',
          userAgent:
            'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
          provider: 'google',
          createdAt: new Date(),
        },
      ]
      ;(prisma.userLogin.findMany as jest.Mock).mockResolvedValueOnce(
        mockLogins
      )

      const response = await GET()
      const data = await response.json()

      expect(data.loginHistory[0].device).toContain('Chrome')
      expect(data.loginHistory[0].device).toContain('Android')
    })

    it('should parse Edge user agent correctly', async () => {
      const mockLogins = [
        {
          id: 'login1',
          userId: 'user123',
          loginDate: new Date(),
          ipAddress: '192.168.1.1',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
          provider: 'credentials',
          createdAt: new Date(),
        },
      ]
      ;(prisma.userLogin.findMany as jest.Mock).mockResolvedValueOnce(
        mockLogins
      )

      const response = await GET()
      const data = await response.json()

      expect(data.loginHistory[0].device).toContain('Edge')
      expect(data.loginHistory[0].device).toContain('Windows')
    })
  })

  describe('Provider Formatting', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
      })
    })

    it('should format google provider correctly', async () => {
      const mockLogins = [
        {
          id: 'login1',
          userId: 'user123',
          loginDate: new Date(),
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
          provider: 'google',
          createdAt: new Date(),
        },
      ]
      ;(prisma.userLogin.findMany as jest.Mock).mockResolvedValueOnce(
        mockLogins
      )

      const response = await GET()
      const data = await response.json()

      expect(data.loginHistory[0].provider).toBe('Google')
    })

    it('should format github provider correctly', async () => {
      const mockLogins = [
        {
          id: 'login1',
          userId: 'user123',
          loginDate: new Date(),
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
          provider: 'github',
          createdAt: new Date(),
        },
      ]
      ;(prisma.userLogin.findMany as jest.Mock).mockResolvedValueOnce(
        mockLogins
      )

      const response = await GET()
      const data = await response.json()

      expect(data.loginHistory[0].provider).toBe('GitHub')
    })

    it('should format credentials provider correctly', async () => {
      const mockLogins = [
        {
          id: 'login1',
          userId: 'user123',
          loginDate: new Date(),
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
          provider: 'credentials',
          createdAt: new Date(),
        },
      ]
      ;(prisma.userLogin.findMany as jest.Mock).mockResolvedValueOnce(
        mockLogins
      )

      const response = await GET()
      const data = await response.json()

      expect(data.loginHistory[0].provider).toBe('Email/Password')
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any)
    })

    it('should return 500 if database query fails', async () => {
      ;(prisma.userData.findUnique as jest.Mock).mockRejectedValueOnce(
        new Error('Database error')
      )

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch login history')
    })

    it('should disconnect Prisma client after request', async () => {
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'user123',
        email: 'test@example.com',
      })
      ;(prisma.userLogin.findMany as jest.Mock).mockResolvedValueOnce([])

      await GET()

      expect(prisma.$disconnect).toHaveBeenCalled()
    })

    it('should disconnect Prisma client even when error occurs', async () => {
      ;(prisma.userData.findUnique as jest.Mock).mockRejectedValueOnce(
        new Error('Database error')
      )

      await GET()

      expect(prisma.$disconnect).toHaveBeenCalled()
    })
  })
})
