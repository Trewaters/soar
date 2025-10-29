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
    $disconnect: jest.fn(),
  }

  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
  }
})

jest.mock('../../../../app/lib/dashboardService', () => ({
  getDashboardStats: jest.fn(),
}))

import '@testing-library/jest-dom'
import { GET } from '@app/api/dashboard/stats/route'
import { auth } from '../../../../../auth'
import { PrismaClient } from '../../../../../prisma/generated/client'
import { getDashboardStats } from '@app/lib/dashboardService'

const mockAuth = auth as jest.Mock
const mockGetDashboardStats = getDashboardStats as jest.Mock
const prisma = new PrismaClient()

describe('Dashboard Stats API Route', () => {
  const mockDashboardData = {
    loginStreak: 7,
    activityStreak: 5,
    longestStreak: 14,
    practiceHistory: [
      { month: 'Nov 24', days: 12 },
      { month: 'Dec 24', days: 15 },
      { month: 'Jan 25', days: 18 },
      { month: 'Feb 25', days: 14 },
      { month: 'Mar 25', days: 20 },
      { month: 'Apr 25', days: 16 },
      { month: 'May 25', days: 19 },
      { month: 'Jun 25', days: 22 },
      { month: 'Jul 25', days: 17 },
      { month: 'Aug 25', days: 21 },
      { month: 'Sep 25', days: 18 },
      { month: 'Oct 25', days: 15 },
    ],
    mostCommonAsanas: [
      { name: 'Downward-Facing Dog', count: 45 },
      { name: 'Warrior II', count: 38 },
      { name: 'Tree Pose', count: 32 },
    ],
    mostCommonSeries: [
      { name: 'Sun Salutation A', count: 25 },
      { name: 'Standing Series', count: 18 },
      { name: 'Core Strength', count: 15 },
    ],
    mostCommonSequences: [
      { name: 'Morning Flow', count: 30 },
      { name: 'Evening Wind Down', count: 22 },
      { name: 'Power Vinyasa', count: 18 },
    ],
    nextGoal: {
      text: '30 Day Streak',
      current: 7,
      target: 30,
      progress: 23.33,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/dashboard/stats', () => {
    it('should return 401 if no session exists', async () => {
      mockAuth.mockResolvedValue(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized - Please sign in' })
      expect(prisma.$disconnect).toHaveBeenCalled()
    })

    it('should return 401 if session has no user', async () => {
      mockAuth.mockResolvedValue({
        expires: new Date().toISOString(),
      } as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized - Please sign in' })
      expect(prisma.$disconnect).toHaveBeenCalled()
    })

    it('should return 401 if session user has no email', async () => {
      mockAuth.mockResolvedValue({
        user: {},
        expires: new Date().toISOString(),
      } as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized - Please sign in' })
      expect(prisma.$disconnect).toHaveBeenCalled()
    })

    it('should return 404 if user data is not found', async () => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data).toEqual({ error: 'User data not found' })
      expect(prisma.userData.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      })
      expect(prisma.$disconnect).toHaveBeenCalled()
    })

    it('should return dashboard stats successfully', async () => {
      const mockUserData = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      }

      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUserData)
      mockGetDashboardStats.mockResolvedValue(mockDashboardData)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        success: true,
        data: mockDashboardData,
      })
      expect(prisma.userData.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      })
      expect(mockGetDashboardStats).toHaveBeenCalledWith('user-123')
      expect(prisma.$disconnect).toHaveBeenCalled()
    })

    it('should include all dashboard data properties', async () => {
      const mockUserData = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      }

      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUserData)
      mockGetDashboardStats.mockResolvedValue(mockDashboardData)

      const response = await GET()
      const data = await response.json()

      expect(data.data).toHaveProperty('loginStreak')
      expect(data.data).toHaveProperty('activityStreak')
      expect(data.data).toHaveProperty('longestStreak')
      expect(data.data).toHaveProperty('practiceHistory')
      expect(data.data).toHaveProperty('mostCommonAsanas')
      expect(data.data).toHaveProperty('mostCommonSeries')
      expect(data.data).toHaveProperty('mostCommonSequences')
      expect(data.data).toHaveProperty('nextGoal')

      expect(data.data.practiceHistory).toHaveLength(12)
      expect(data.data.mostCommonAsanas).toHaveLength(3)
      expect(data.data.mostCommonSeries).toHaveLength(3)
      expect(data.data.mostCommonSequences).toHaveLength(3)
    })

    it('should return 500 on database error', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      )

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch dashboard statistics' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching dashboard stats:',
        expect.any(Error)
      )
      expect(prisma.$disconnect).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })

    it('should return 500 on getDashboardStats error', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      const mockUserData = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      }

      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUserData)
      mockGetDashboardStats.mockRejectedValue(
        new Error('Stats calculation failed')
      )

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch dashboard statistics' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching dashboard stats:',
        expect.any(Error)
      )
      expect(prisma.$disconnect).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })

    it('should always disconnect from Prisma', async () => {
      mockAuth.mockResolvedValue(null)

      await GET()

      expect(prisma.$disconnect).toHaveBeenCalled()
    })

    it('should disconnect from Prisma even on error', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {})

      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockRejectedValue(
        new Error('Test error')
      )

      await GET()

      expect(prisma.$disconnect).toHaveBeenCalled()

      jest.restoreAllMocks()
    })

    it('should handle empty practice history', async () => {
      const emptyHistoryData = {
        ...mockDashboardData,
        practiceHistory: [],
      }

      const mockUserData = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      }

      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUserData)
      mockGetDashboardStats.mockResolvedValue(emptyHistoryData)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.practiceHistory).toEqual([])
    })

    it('should handle zero streaks', async () => {
      const zeroStreaksData = {
        ...mockDashboardData,
        loginStreak: 0,
        activityStreak: 0,
        longestStreak: 0,
      }

      const mockUserData = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      }

      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUserData)
      mockGetDashboardStats.mockResolvedValue(zeroStreaksData)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.loginStreak).toBe(0)
      expect(data.data.activityStreak).toBe(0)
      expect(data.data.longestStreak).toBe(0)
    })

    it('should handle empty most common lists', async () => {
      const emptyListsData = {
        ...mockDashboardData,
        mostCommonAsanas: [],
        mostCommonSeries: [],
        mostCommonSequences: [],
      }

      const mockUserData = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      }

      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any)
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue(mockUserData)
      mockGetDashboardStats.mockResolvedValue(emptyListsData)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.mostCommonAsanas).toEqual([])
      expect(data.data.mostCommonSeries).toEqual([])
      expect(data.data.mostCommonSequences).toEqual([])
    })
  })
})
