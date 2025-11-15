/**
 * Unit tests for asana activity weekly tracking service functions
 * Tests Monday-Sunday calendar week calculation logic
 * @jest-environment node
 */
import {
  getPoseWeeklyCount,
  getAllPosesWeeklyCount,
} from '../../lib/asanaActivityService'
import { prisma } from '../../lib/prismaClient'

// Mock dependencies
jest.mock('../../lib/prismaClient', () => ({
  prisma: {
    asanaActivity: {
      findMany: jest.fn(),
    },
  },
}))

jest.mock('../../lib/errorLogger', () => ({
  logServiceError: jest.fn(),
  logDatabaseError: jest.fn(),
}))

describe('Asana Activity Service - Weekly Tracking (Monday-Sunday)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('getPoseWeeklyCount - Monday-Sunday Calendar Week', () => {
    /**
     * Test the happy path: Verify that the date range calculation
     * correctly identifies Monday as the start of the week
     */
    it('should calculate Monday-Sunday week range starting from Monday', async () => {
      // Arrange: Set up a specific date (Wednesday, Nov 13, 2024)
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-11-13T14:30:00.000Z'))

      const userId = 'user-123'
      const poseId = 'pose-456'

      const mockActivities = [
        {
          id: 'activity-1',
          userId: userId,
          poseId: poseId,
          poseName: 'Warrior I',
          sort_english_name: 'Warrior I',
          datePerformed: new Date('2024-11-11T10:00:00.000Z'), // Monday
          duration: 300,
          completionStatus: 'complete',
          notes: null,
          sensations: null,
          difficulty: 'average',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'activity-2',
          userId: userId,
          poseId: poseId,
          poseName: 'Warrior I',
          sort_english_name: 'Warrior I',
          datePerformed: new Date('2024-11-13T15:00:00.000Z'), // Wednesday (today)
          duration: 360,
          completionStatus: 'complete',
          notes: null,
          sensations: null,
          difficulty: 'easy',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      ;(prisma.asanaActivity.findMany as jest.Mock).mockResolvedValue(
        mockActivities
      )

      // Act: Call the function
      const result = await getPoseWeeklyCount(userId, poseId)

      // Assert: Verify the results
      expect(result.count).toBe(2)
      expect(result.activities).toHaveLength(2)
      expect(result.dateRange.start.getDay()).toBe(1) // Monday
      expect(result.dateRange.end.getDay()).toBe(0) // Sunday

      // Verify date range calculation
      // Expected: Monday Nov 11 00:00:00 to Sunday Nov 17 23:59:59
      expect(result.dateRange.start.getDate()).toBe(11)
      expect(result.dateRange.end.getDate()).toBe(17)

      // Verify prisma was called with correct date range
      expect(prisma.asanaActivity.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          poseId,
          datePerformed: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
        },
        orderBy: { datePerformed: 'desc' },
      })
    })

    /**
     * Test when "today" is Sunday - should still use current week's Monday
     */
    it('should handle Sunday as end of week correctly', async () => {
      // Arrange: Set up date as Sunday, Nov 17, 2024
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-11-17T14:30:00.000Z'))

      const userId = 'user-123'
      const poseId = 'pose-456'

      ;(prisma.asanaActivity.findMany as jest.Mock).mockResolvedValue([])

      // Act
      const result = await getPoseWeeklyCount(userId, poseId)

      // Assert: Week should start from Monday Nov 11
      expect(result.dateRange.start.getDay()).toBe(1) // Monday
      expect(result.dateRange.start.getDate()).toBe(11) // Nov 11
      expect(result.dateRange.end.getDay()).toBe(0) // Sunday
      expect(result.dateRange.end.getDate()).toBe(17) // Nov 17
    })

    /**
     * Test when "today" is Monday - should use today as start of week
     */
    it('should handle Monday as start of week correctly', async () => {
      // Arrange: Set up date as Monday, Nov 11, 2024
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-11-11T14:30:00.000Z'))

      const userId = 'user-123'
      const poseId = 'pose-456'

      ;(prisma.asanaActivity.findMany as jest.Mock).mockResolvedValue([])

      // Act
      const result = await getPoseWeeklyCount(userId, poseId)

      // Assert: Week should start from today (Monday Nov 11)
      expect(result.dateRange.start.getDay()).toBe(1) // Monday
      expect(result.dateRange.start.getDate()).toBe(11) // Nov 11
      expect(result.dateRange.end.getDay()).toBe(0) // Sunday
      expect(result.dateRange.end.getDate()).toBe(17) // Nov 17 (next Sunday)
    })

    /**
     * Test with no activities in the current week
     */
    it('should return zero count when no activities exist in current week', async () => {
      // Arrange
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-11-13T14:30:00.000Z'))

      const userId = 'user-123'
      const poseId = 'pose-456'

      ;(prisma.asanaActivity.findMany as jest.Mock).mockResolvedValue([])

      // Act
      const result = await getPoseWeeklyCount(userId, poseId)

      // Assert
      expect(result.count).toBe(0)
      expect(result.activities).toHaveLength(0)
      expect(result.dateRange.start.getDay()).toBe(1) // Monday
      expect(result.dateRange.end.getDay()).toBe(0) // Sunday
    })
  })

  describe('getAllPosesWeeklyCount - Monday-Sunday Calendar Week', () => {
    /**
     * Test the happy path: Multiple poses with activities in current week
     */
    it('should aggregate weekly counts for all poses using Monday-Sunday week', async () => {
      // Arrange: Set up date as Wednesday, Nov 13, 2024
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-11-13T14:30:00.000Z'))

      const userId = 'user-123'

      const mockActivities = [
        {
          id: 'activity-1',
          userId: userId,
          poseId: 'pose-warrior1',
          poseName: 'Warrior I',
          sort_english_name: 'Warrior I',
          datePerformed: new Date('2024-11-11T10:00:00.000Z'), // Monday
          duration: 300,
          completionStatus: 'complete',
          notes: null,
          sensations: null,
          difficulty: 'average',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'activity-2',
          userId: userId,
          poseId: 'pose-warrior1',
          poseName: 'Warrior I',
          sort_english_name: 'Warrior I',
          datePerformed: new Date('2024-11-13T15:00:00.000Z'), // Wednesday
          duration: 360,
          completionStatus: 'complete',
          notes: null,
          sensations: null,
          difficulty: 'easy',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'activity-3',
          userId: userId,
          poseId: 'pose-downdog',
          poseName: 'Downward Dog',
          sort_english_name: 'Downward Dog',
          datePerformed: new Date('2024-11-12T09:00:00.000Z'), // Tuesday
          duration: 180,
          completionStatus: 'complete',
          notes: null,
          sensations: null,
          difficulty: 'easy',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      ;(prisma.asanaActivity.findMany as jest.Mock).mockResolvedValue(
        mockActivities
      )

      // Act
      const result = await getAllPosesWeeklyCount(userId)

      // Assert
      expect(result.totalActivities).toBe(3)
      expect(Object.keys(result.poseStats)).toHaveLength(2)

      // Verify Warrior I stats
      expect(result.poseStats['pose-warrior1'].count).toBe(2)
      expect(result.poseStats['pose-warrior1'].poseName).toBe('Warrior I')
      expect(result.poseStats['pose-warrior1'].activities).toHaveLength(2)

      // Verify Downward Dog stats
      expect(result.poseStats['pose-downdog'].count).toBe(1)
      expect(result.poseStats['pose-downdog'].poseName).toBe('Downward Dog')
      expect(result.poseStats['pose-downdog'].activities).toHaveLength(1)

      // Verify date range is Monday-Sunday
      expect(result.dateRange.start.getDay()).toBe(1) // Monday
      expect(result.dateRange.end.getDay()).toBe(0) // Sunday

      // Verify specific dates
      expect(result.dateRange.start.getDate()).toBe(11) // Nov 11
      expect(result.dateRange.end.getDate()).toBe(17) // Nov 17

      // Verify prisma was called with correct parameters
      expect(prisma.asanaActivity.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          datePerformed: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
        },
        orderBy: { datePerformed: 'desc' },
      })
    })

    /**
     * Test when activities span across week boundary
     */
    it('should only include activities within Monday-Sunday week range', async () => {
      // Arrange: Set up date as Monday, Nov 11, 2024
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-11-11T14:30:00.000Z'))

      const userId = 'user-123'

      // Mock activities: some in current week, some from previous week
      const mockActivities = [
        {
          id: 'activity-current',
          userId: userId,
          poseId: 'pose-warrior1',
          poseName: 'Warrior I',
          sort_english_name: 'Warrior I',
          datePerformed: new Date('2024-11-11T10:00:00.000Z'), // Monday (current week)
          duration: 300,
          completionStatus: 'complete',
          notes: null,
          sensations: null,
          difficulty: 'average',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      ;(prisma.asanaActivity.findMany as jest.Mock).mockResolvedValue(
        mockActivities
      )

      // Act
      const result = await getAllPosesWeeklyCount(userId)

      // Assert: Only current week's activities should be included
      expect(result.totalActivities).toBe(1)

      // Verify the query was made with correct date range
      const callArgs = (prisma.asanaActivity.findMany as jest.Mock).mock
        .calls[0][0]
      expect(callArgs.where.datePerformed.gte.getDay()).toBe(1) // Monday
      expect(callArgs.where.datePerformed.lte.getDay()).toBe(0) // Sunday
    })

    /**
     * Test with no activities in current week
     */
    it('should return empty stats when no activities in current week', async () => {
      // Arrange
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-11-13T14:30:00.000Z'))

      const userId = 'user-123'

      ;(prisma.asanaActivity.findMany as jest.Mock).mockResolvedValue([])

      // Act
      const result = await getAllPosesWeeklyCount(userId)

      // Assert
      expect(result.totalActivities).toBe(0)
      expect(Object.keys(result.poseStats)).toHaveLength(0)
      expect(result.dateRange.start.getDay()).toBe(1) // Monday
      expect(result.dateRange.end.getDay()).toBe(0) // Sunday
    })

    /**
     * Test tracking last performed date within the week
     */
    it('should track most recent activity date for each pose', async () => {
      // Arrange
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-11-13T14:30:00.000Z'))

      const userId = 'user-123'

      const mockActivities = [
        {
          id: 'activity-1',
          userId: userId,
          poseId: 'pose-warrior1',
          poseName: 'Warrior I',
          sort_english_name: 'Warrior I',
          datePerformed: new Date('2024-11-11T10:00:00.000Z'), // Monday (older)
          duration: 300,
          completionStatus: 'complete',
          notes: null,
          sensations: null,
          difficulty: 'average',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'activity-2',
          userId: userId,
          poseId: 'pose-warrior1',
          poseName: 'Warrior I',
          sort_english_name: 'Warrior I',
          datePerformed: new Date('2024-11-13T15:00:00.000Z'), // Wednesday (newer)
          duration: 360,
          completionStatus: 'complete',
          notes: null,
          sensations: null,
          difficulty: 'easy',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      ;(prisma.asanaActivity.findMany as jest.Mock).mockResolvedValue(
        mockActivities
      )

      // Act
      const result = await getAllPosesWeeklyCount(userId)

      // Assert: Should track the most recent date (Wednesday)
      const warriorStats = result.poseStats['pose-warrior1']
      expect(warriorStats.lastPerformed.toISOString()).toBe(
        new Date('2024-11-13T15:00:00.000Z').toISOString()
      )
    })
  })

  describe('Edge Cases - Week Boundary Transitions', () => {
    /**
     * Test transition from Saturday to Sunday (end of week)
     */
    it('should handle Saturday correctly (day before week end)', async () => {
      // Arrange: Set up date as Saturday, Nov 16, 2024
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-11-16T14:30:00.000Z'))

      const userId = 'user-123'
      const poseId = 'pose-456'

      ;(prisma.asanaActivity.findMany as jest.Mock).mockResolvedValue([])

      // Act
      const result = await getPoseWeeklyCount(userId, poseId)

      // Assert: Week should be Mon Nov 11 to Sun Nov 17
      expect(result.dateRange.start.getDay()).toBe(1) // Monday
      expect(result.dateRange.start.getDate()).toBe(11)
      expect(result.dateRange.end.getDay()).toBe(0) // Sunday
      expect(result.dateRange.end.getDate()).toBe(17)
    })

    /**
     * Test month boundary crossing
     */
    it('should handle week spanning across month boundary', async () => {
      // Arrange: Set up date as Wednesday, Oct 30, 2024
      // Week should be Mon Oct 28 to Sun Nov 3
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-10-30T14:30:00.000Z'))

      const userId = 'user-123'
      const poseId = 'pose-456'

      ;(prisma.asanaActivity.findMany as jest.Mock).mockResolvedValue([])

      // Act
      const result = await getPoseWeeklyCount(userId, poseId)

      // Assert
      expect(result.dateRange.start.getDay()).toBe(1) // Monday
      expect(result.dateRange.start.getDate()).toBe(28) // Oct 28
      expect(result.dateRange.start.getMonth()).toBe(9) // October (0-indexed)

      expect(result.dateRange.end.getDay()).toBe(0) // Sunday
      expect(result.dateRange.end.getDate()).toBe(3) // Nov 3
      expect(result.dateRange.end.getMonth()).toBe(10) // November (0-indexed)
    })
  })
})
