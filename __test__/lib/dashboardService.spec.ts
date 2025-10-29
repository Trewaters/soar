import '@testing-library/jest-dom'
import {
  calculateLoginStreak,
  calculateActivityStreak,
  calculateLongestStreak,
  getPracticeHistory,
  getMostCommonAsanas,
  getMostCommonSeries,
  getMostCommonSequences,
  getDashboardStats,
} from '../../app/lib/dashboardService'

// Mock Prisma client
const mockPrisma = {
  userLogin: {
    findMany: jest.fn(),
  },
  asanaActivity: {
    findMany: jest.fn(),
    groupBy: jest.fn(),
  },
  seriesActivity: {
    findMany: jest.fn(),
    groupBy: jest.fn(),
  },
  sequenceActivity: {
    findMany: jest.fn(),
    groupBy: jest.fn(),
  },
}

jest.mock('../../prisma/generated/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}))

describe('Dashboard Service', () => {
  const testUserId = 'test-user-123'

  beforeEach(() => {
    jest.clearAllMocks()
    // Set a fixed date for testing: October 29, 2025
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-10-29T12:00:00.000Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  describe('calculateLoginStreak', () => {
    it('should return 0 when there are no logins', async () => {
      mockPrisma.userLogin.findMany.mockResolvedValue([])

      const streak = await calculateLoginStreak(testUserId)

      expect(streak).toBe(0)
      expect(mockPrisma.userLogin.findMany).toHaveBeenCalledWith({
        where: { userId: testUserId },
        orderBy: { loginDate: 'desc' },
        select: { loginDate: true },
      })
    })

    it('should return 0 when last login was more than 1 day ago', async () => {
      const threeDaysAgo = new Date('2025-10-26T10:00:00.000Z')

      mockPrisma.userLogin.findMany.mockResolvedValue([
        { loginDate: threeDaysAgo },
      ])

      const streak = await calculateLoginStreak(testUserId)

      expect(streak).toBe(0)
    })

    it('should calculate streak correctly for consecutive days', async () => {
      const today = new Date('2025-10-29T10:00:00.000Z')
      const yesterday = new Date('2025-10-28T15:00:00.000Z')
      const twoDaysAgo = new Date('2025-10-27T09:00:00.000Z')

      mockPrisma.userLogin.findMany.mockResolvedValue([
        { loginDate: today },
        { loginDate: yesterday },
        { loginDate: twoDaysAgo },
      ])

      const streak = await calculateLoginStreak(testUserId)

      expect(streak).toBe(3)
    })

    it('should handle multiple logins on the same day', async () => {
      const today1 = new Date('2025-10-29T08:00:00.000Z')
      const today2 = new Date('2025-10-29T12:00:00.000Z')
      const today3 = new Date('2025-10-29T18:00:00.000Z')
      const yesterday = new Date('2025-10-28T10:00:00.000Z')

      mockPrisma.userLogin.findMany.mockResolvedValue([
        { loginDate: today1 },
        { loginDate: today2 },
        { loginDate: today3 },
        { loginDate: yesterday },
      ])

      const streak = await calculateLoginStreak(testUserId)

      expect(streak).toBe(2)
    })

    it('should stop streak count when a day is skipped', async () => {
      const today = new Date('2025-10-29T10:00:00.000Z')
      const yesterday = new Date('2025-10-28T10:00:00.000Z')
      const threeDaysAgo = new Date('2025-10-26T10:00:00.000Z')

      mockPrisma.userLogin.findMany.mockResolvedValue([
        { loginDate: today },
        { loginDate: yesterday },
        { loginDate: threeDaysAgo },
      ])

      const streak = await calculateLoginStreak(testUserId)

      expect(streak).toBe(2)
    })

    it('should allow 1-day grace period (yesterday counts)', async () => {
      const yesterday = new Date('2025-10-28T10:00:00.000Z')
      const twoDaysAgo = new Date('2025-10-27T10:00:00.000Z')

      mockPrisma.userLogin.findMany.mockResolvedValue([
        { loginDate: yesterday },
        { loginDate: twoDaysAgo },
      ])

      const streak = await calculateLoginStreak(testUserId)

      expect(streak).toBe(2)
    })
  })

  describe('calculateActivityStreak', () => {
    it('should return 0 when there are no activities', async () => {
      mockPrisma.asanaActivity.findMany.mockResolvedValue([])
      mockPrisma.seriesActivity.findMany.mockResolvedValue([])
      mockPrisma.sequenceActivity.findMany.mockResolvedValue([])

      const streak = await calculateActivityStreak(testUserId)

      expect(streak).toBe(0)
    })

    it('should calculate streak from asana activities', async () => {
      const today = new Date('2025-10-29T10:00:00.000Z')
      const yesterday = new Date('2025-10-28T10:00:00.000Z')

      mockPrisma.asanaActivity.findMany.mockResolvedValue([
        { datePerformed: today },
        { datePerformed: yesterday },
      ])
      mockPrisma.seriesActivity.findMany.mockResolvedValue([])
      mockPrisma.sequenceActivity.findMany.mockResolvedValue([])

      const streak = await calculateActivityStreak(testUserId)

      expect(streak).toBe(2)
    })

    it('should calculate streak from multiple activity types', async () => {
      const today = new Date('2025-10-29T10:00:00.000Z')
      const yesterday = new Date('2025-10-28T10:00:00.000Z')
      const twoDaysAgo = new Date('2025-10-27T10:00:00.000Z')

      mockPrisma.asanaActivity.findMany.mockResolvedValue([
        { datePerformed: today },
      ])
      mockPrisma.seriesActivity.findMany.mockResolvedValue([
        { datePerformed: yesterday },
      ])
      mockPrisma.sequenceActivity.findMany.mockResolvedValue([
        { datePerformed: twoDaysAgo },
      ])

      const streak = await calculateActivityStreak(testUserId)

      expect(streak).toBe(3)
    })

    it('should handle multiple activities on same day', async () => {
      const today1 = new Date('2025-10-29T08:00:00.000Z')
      const today2 = new Date('2025-10-29T12:00:00.000Z')
      const yesterday = new Date('2025-10-28T10:00:00.000Z')

      mockPrisma.asanaActivity.findMany.mockResolvedValue([
        { datePerformed: today1 },
        { datePerformed: today2 },
      ])
      mockPrisma.seriesActivity.findMany.mockResolvedValue([
        { datePerformed: yesterday },
      ])
      mockPrisma.sequenceActivity.findMany.mockResolvedValue([])

      const streak = await calculateActivityStreak(testUserId)

      expect(streak).toBe(2)
    })

    it('should return 0 when last activity was more than 1 day ago', async () => {
      const threeDaysAgo = new Date('2025-10-26T10:00:00.000Z')

      mockPrisma.asanaActivity.findMany.mockResolvedValue([
        { datePerformed: threeDaysAgo },
      ])
      mockPrisma.seriesActivity.findMany.mockResolvedValue([])
      mockPrisma.sequenceActivity.findMany.mockResolvedValue([])

      const streak = await calculateActivityStreak(testUserId)

      expect(streak).toBe(0)
    })
  })

  describe('calculateLongestStreak', () => {
    it('should return 0 when there are no activities', async () => {
      mockPrisma.asanaActivity.findMany.mockResolvedValue([])
      mockPrisma.seriesActivity.findMany.mockResolvedValue([])
      mockPrisma.sequenceActivity.findMany.mockResolvedValue([])

      const streak = await calculateLongestStreak(testUserId)

      expect(streak).toBe(0)
    })

    it('should return 1 for single activity day', async () => {
      const today = new Date('2025-10-29T10:00:00.000Z')

      mockPrisma.asanaActivity.findMany.mockResolvedValue([
        { datePerformed: today },
      ])
      mockPrisma.seriesActivity.findMany.mockResolvedValue([])
      mockPrisma.sequenceActivity.findMany.mockResolvedValue([])

      const streak = await calculateLongestStreak(testUserId)

      expect(streak).toBe(1)
    })

    it('should calculate longest streak correctly', async () => {
      const activities = [
        new Date('2025-10-20T10:00:00.000Z'), // Day 1
        new Date('2025-10-21T10:00:00.000Z'), // Day 2
        new Date('2025-10-22T10:00:00.000Z'), // Day 3
        // Gap
        new Date('2025-10-25T10:00:00.000Z'), // Day 1
        new Date('2025-10-26T10:00:00.000Z'), // Day 2
        new Date('2025-10-27T10:00:00.000Z'), // Day 3
        new Date('2025-10-28T10:00:00.000Z'), // Day 4
        new Date('2025-10-29T10:00:00.000Z'), // Day 5
      ]

      mockPrisma.asanaActivity.findMany.mockResolvedValue(
        activities.map((datePerformed) => ({ datePerformed }))
      )
      mockPrisma.seriesActivity.findMany.mockResolvedValue([])
      mockPrisma.sequenceActivity.findMany.mockResolvedValue([])

      const streak = await calculateLongestStreak(testUserId)

      expect(streak).toBe(5)
    })

    it('should handle multiple activities on the same day', async () => {
      const day1a = new Date('2025-10-27T08:00:00.000Z')
      const day1b = new Date('2025-10-27T12:00:00.000Z')
      const day2 = new Date('2025-10-28T10:00:00.000Z')
      const day3 = new Date('2025-10-29T10:00:00.000Z')

      mockPrisma.asanaActivity.findMany.mockResolvedValue([
        { datePerformed: day1a },
        { datePerformed: day1b },
      ])
      mockPrisma.seriesActivity.findMany.mockResolvedValue([
        { datePerformed: day2 },
      ])
      mockPrisma.sequenceActivity.findMany.mockResolvedValue([
        { datePerformed: day3 },
      ])

      const streak = await calculateLongestStreak(testUserId)

      expect(streak).toBe(3)
    })

    it('should find longest streak among multiple streaks', async () => {
      const activities = [
        new Date('2025-10-01T10:00:00.000Z'), // Streak 1: 2 days
        new Date('2025-10-02T10:00:00.000Z'),
        // Gap
        new Date('2025-10-10T10:00:00.000Z'), // Streak 2: 4 days (longest)
        new Date('2025-10-11T10:00:00.000Z'),
        new Date('2025-10-12T10:00:00.000Z'),
        new Date('2025-10-13T10:00:00.000Z'),
        // Gap
        new Date('2025-10-20T10:00:00.000Z'), // Streak 3: 3 days
        new Date('2025-10-21T10:00:00.000Z'),
        new Date('2025-10-22T10:00:00.000Z'),
      ]

      mockPrisma.asanaActivity.findMany.mockResolvedValue(
        activities.map((datePerformed) => ({ datePerformed }))
      )
      mockPrisma.seriesActivity.findMany.mockResolvedValue([])
      mockPrisma.sequenceActivity.findMany.mockResolvedValue([])

      const streak = await calculateLongestStreak(testUserId)

      expect(streak).toBe(4)
    })
  })

  describe('getPracticeHistory', () => {
    it('should return 12 months of history with zero days when no activities', async () => {
      mockPrisma.asanaActivity.findMany.mockResolvedValue([])
      mockPrisma.seriesActivity.findMany.mockResolvedValue([])
      mockPrisma.sequenceActivity.findMany.mockResolvedValue([])

      const history = await getPracticeHistory(testUserId)

      expect(history).toHaveLength(12)
      expect(history[0].month).toBe('Nov 24')
      expect(history[11].month).toBe('Oct 25')
      expect(history.every((item) => item.days === 0)).toBe(true)
    })

    it('should count unique practice days per month', async () => {
      const activities = [
        // November 2024
        new Date('2024-11-05T10:00:00.000Z'),
        new Date('2024-11-10T10:00:00.000Z'),
        new Date('2024-11-15T10:00:00.000Z'),
        // December 2024
        new Date('2024-12-01T10:00:00.000Z'),
        new Date('2024-12-01T15:00:00.000Z'), // Same day
        new Date('2024-12-02T10:00:00.000Z'),
        // October 2025
        new Date('2025-10-20T10:00:00.000Z'),
        new Date('2025-10-21T10:00:00.000Z'),
        new Date('2025-10-22T10:00:00.000Z'),
        new Date('2025-10-23T10:00:00.000Z'),
      ]

      mockPrisma.asanaActivity.findMany.mockResolvedValue(
        activities.map((datePerformed) => ({ datePerformed }))
      )
      mockPrisma.seriesActivity.findMany.mockResolvedValue([])
      mockPrisma.sequenceActivity.findMany.mockResolvedValue([])

      const history = await getPracticeHistory(testUserId)

      expect(history).toHaveLength(12)

      const novHistory = history.find((h) => h.month === 'Nov 24')
      expect(novHistory?.days).toBe(3)

      const decHistory = history.find((h) => h.month === 'Dec 24')
      expect(decHistory?.days).toBe(2)

      const octHistory = history.find((h) => h.month === 'Oct 25')
      expect(octHistory?.days).toBe(4)
    })

    it('should aggregate activities from all types', async () => {
      mockPrisma.asanaActivity.findMany.mockResolvedValue([
        { datePerformed: new Date('2025-10-15T10:00:00.000Z') },
      ])
      mockPrisma.seriesActivity.findMany.mockResolvedValue([
        { datePerformed: new Date('2025-10-16T10:00:00.000Z') },
      ])
      mockPrisma.sequenceActivity.findMany.mockResolvedValue([
        { datePerformed: new Date('2025-10-17T10:00:00.000Z') },
      ])

      const history = await getPracticeHistory(testUserId)

      const octHistory = history.find((h) => h.month === 'Oct 25')
      expect(octHistory?.days).toBe(3)
    })

    it('should format month labels correctly', async () => {
      mockPrisma.asanaActivity.findMany.mockResolvedValue([])
      mockPrisma.seriesActivity.findMany.mockResolvedValue([])
      mockPrisma.sequenceActivity.findMany.mockResolvedValue([])

      const history = await getPracticeHistory(testUserId)

      expect(history.map((h) => h.month)).toEqual([
        'Nov 24',
        'Dec 24',
        'Jan 25',
        'Feb 25',
        'Mar 25',
        'Apr 25',
        'May 25',
        'Jun 25',
        'Jul 25',
        'Aug 25',
        'Sep 25',
        'Oct 25',
      ])
    })
  })

  describe('getMostCommonAsanas', () => {
    it('should return empty array when no asana activities', async () => {
      mockPrisma.asanaActivity.groupBy.mockResolvedValue([])

      const result = await getMostCommonAsanas(testUserId)

      expect(result).toEqual([])
    })

    it('should return top 3 most common asanas', async () => {
      mockPrisma.asanaActivity.groupBy.mockResolvedValue([
        { poseName: 'Downward Dog', _count: { poseName: 45 } },
        { poseName: 'Warrior II', _count: { poseName: 38 } },
        { poseName: 'Tree Pose', _count: { poseName: 32 } },
      ])

      const result = await getMostCommonAsanas(testUserId)

      expect(result).toEqual([
        { name: 'Downward Dog', count: 45 },
        { name: 'Warrior II', count: 38 },
        { name: 'Tree Pose', count: 32 },
      ])

      expect(mockPrisma.asanaActivity.groupBy).toHaveBeenCalledWith({
        by: ['poseName'],
        where: { userId: testUserId },
        _count: { poseName: true },
        orderBy: { _count: { poseName: 'desc' } },
        take: 3,
      })
    })

    it('should handle less than 3 results', async () => {
      mockPrisma.asanaActivity.groupBy.mockResolvedValue([
        { poseName: 'Downward Dog', _count: { poseName: 10 } },
      ])

      const result = await getMostCommonAsanas(testUserId)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({ name: 'Downward Dog', count: 10 })
    })
  })

  describe('getMostCommonSeries', () => {
    it('should return empty array when no series activities', async () => {
      mockPrisma.seriesActivity.groupBy.mockResolvedValue([])

      const result = await getMostCommonSeries(testUserId)

      expect(result).toEqual([])
    })

    it('should return top 3 most common series', async () => {
      mockPrisma.seriesActivity.groupBy.mockResolvedValue([
        { seriesName: 'Sun Salutation A', _count: { seriesName: 25 } },
        { seriesName: 'Standing Series', _count: { seriesName: 18 } },
        { seriesName: 'Core Strength', _count: { seriesName: 15 } },
      ])

      const result = await getMostCommonSeries(testUserId)

      expect(result).toEqual([
        { name: 'Sun Salutation A', count: 25 },
        { name: 'Standing Series', count: 18 },
        { name: 'Core Strength', count: 15 },
      ])
    })
  })

  describe('getMostCommonSequences', () => {
    it('should return empty array when no sequence activities', async () => {
      mockPrisma.sequenceActivity.groupBy.mockResolvedValue([])

      const result = await getMostCommonSequences(testUserId)

      expect(result).toEqual([])
    })

    it('should return top 3 most common sequences', async () => {
      mockPrisma.sequenceActivity.groupBy.mockResolvedValue([
        { sequenceName: 'Morning Flow', _count: { sequenceName: 30 } },
        { sequenceName: 'Evening Wind Down', _count: { sequenceName: 22 } },
        { sequenceName: 'Power Vinyasa', _count: { sequenceName: 18 } },
      ])

      const result = await getMostCommonSequences(testUserId)

      expect(result).toEqual([
        { name: 'Morning Flow', count: 30 },
        { name: 'Evening Wind Down', count: 22 },
        { name: 'Power Vinyasa', count: 18 },
      ])
    })
  })

  describe('getDashboardStats', () => {
    beforeEach(() => {
      // Mock all dependencies
      mockPrisma.userLogin.findMany.mockResolvedValue([
        { loginDate: new Date('2025-10-29T10:00:00.000Z') },
        { loginDate: new Date('2025-10-28T10:00:00.000Z') },
        { loginDate: new Date('2025-10-27T10:00:00.000Z') },
      ])

      mockPrisma.asanaActivity.findMany.mockResolvedValue([
        { datePerformed: new Date('2025-10-29T10:00:00.000Z') },
        { datePerformed: new Date('2025-10-28T10:00:00.000Z') },
        { datePerformed: new Date('2025-10-15T10:00:00.000Z') },
      ])

      mockPrisma.seriesActivity.findMany.mockResolvedValue([])
      mockPrisma.sequenceActivity.findMany.mockResolvedValue([])

      mockPrisma.asanaActivity.groupBy.mockResolvedValue([
        { poseName: 'Downward Dog', _count: { poseName: 10 } },
      ])

      mockPrisma.seriesActivity.groupBy.mockResolvedValue([
        { seriesName: 'Sun Salutation', _count: { seriesName: 5 } },
      ])

      mockPrisma.sequenceActivity.groupBy.mockResolvedValue([
        { sequenceName: 'Morning Flow', _count: { sequenceName: 3 } },
      ])
    })

    it('should return complete dashboard stats', async () => {
      const stats = await getDashboardStats(testUserId)

      expect(stats).toHaveProperty('loginStreak')
      expect(stats).toHaveProperty('activityStreak')
      expect(stats).toHaveProperty('longestStreak')
      expect(stats).toHaveProperty('practiceHistory')
      expect(stats).toHaveProperty('mostCommonAsanas')
      expect(stats).toHaveProperty('mostCommonSeries')
      expect(stats).toHaveProperty('mostCommonSequences')
      expect(stats).toHaveProperty('nextGoal')

      expect(stats.practiceHistory).toHaveLength(12)
      expect(Array.isArray(stats.mostCommonAsanas)).toBe(true)
      expect(Array.isArray(stats.mostCommonSeries)).toBe(true)
      expect(Array.isArray(stats.mostCommonSequences)).toBe(true)
    })

    it('should calculate next goal based on current month practice', async () => {
      const stats = await getDashboardStats(testUserId)

      expect(stats.nextGoal).toHaveProperty('text')
      expect(stats.nextGoal).toHaveProperty('current')
      expect(stats.nextGoal).toHaveProperty('target')
      expect(stats.nextGoal).toHaveProperty('progress')
      expect(stats.nextGoal.target).toBe(30)
    })

    it('should show goal achieved when current >= target', async () => {
      // Mock 30+ days of practice in current month
      const activities = Array.from({ length: 30 }, (_, i) => ({
        datePerformed: new Date(
          `2025-10-${String(i + 1).padStart(2, '0')}T10:00:00.000Z`
        ),
      }))

      mockPrisma.asanaActivity.findMany.mockResolvedValue(activities)

      const stats = await getDashboardStats(testUserId)

      expect(stats.nextGoal.text).toBe('Goal Achieved! 🎉')
      expect(stats.nextGoal.progress).toBe(100)
    })

    it('should calculate progress percentage correctly', async () => {
      // Mock 15 days of practice (50% of 30)
      const activities = Array.from({ length: 15 }, (_, i) => ({
        datePerformed: new Date(
          `2025-10-${String(i + 1).padStart(2, '0')}T10:00:00.000Z`
        ),
      }))

      mockPrisma.asanaActivity.findMany.mockResolvedValue(activities)

      const stats = await getDashboardStats(testUserId)

      expect(stats.nextGoal.current).toBe(15)
      expect(stats.nextGoal.progress).toBe(50)
      expect(stats.nextGoal.text).toBe('Practice 15 More Days')
    })

    it('should handle singular day in goal text', async () => {
      // Mock 29 days of practice (1 day remaining)
      const activities = Array.from({ length: 29 }, (_, i) => ({
        datePerformed: new Date(
          `2025-10-${String(i + 1).padStart(2, '0')}T10:00:00.000Z`
        ),
      }))

      mockPrisma.asanaActivity.findMany.mockResolvedValue(activities)

      const stats = await getDashboardStats(testUserId)

      expect(stats.nextGoal.text).toBe('Practice 1 More Day')
    })
  })
})
