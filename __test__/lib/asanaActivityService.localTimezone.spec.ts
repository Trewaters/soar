/**
 * Tests for local timezone handling in activity service
 * Ensures calendar day tracking works based on user's local timezone
 */
import { checkExistingActivity } from '@lib/asanaActivityService'
import { prisma } from '@lib/prismaClient'

// Mock the Prisma client
jest.mock('@lib/prismaClient', () => ({
  prisma: {
    asanaActivity: {
      findFirst: jest.fn(),
    },
  },
}))

// Mock error loggers
jest.mock('@lib/errorLogger', () => ({
  logServiceError: jest.fn(),
  logDatabaseError: jest.fn(),
}))

describe('asanaActivityService - Local Timezone Handling', () => {
  const mockFindFirst = prisma.asanaActivity.findFirst as jest.MockedFunction<
    typeof prisma.asanaActivity.findFirst
  >
  const userId = 'test-user-123'
  const asanaId = 'test-asana-456'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('checkExistingActivity', () => {
    it('should query for activities using local date boundaries', async () => {
      // Use jest to mock the current time
      const mockNow = new Date(2025, 10, 18, 10, 30, 0, 0)
      jest.useFakeTimers()
      jest.setSystemTime(mockNow)

      // Expected start of today in local timezone
      const expectedStartOfToday = new Date(2025, 10, 18, 0, 0, 0, 0)
      // Expected end of today in local timezone
      const expectedEndOfToday = new Date(2025, 10, 18, 23, 59, 59, 999)

      mockFindFirst.mockResolvedValue(null)

      await checkExistingActivity(userId, asanaId)

      // Verify the query uses local date boundaries
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
          userId,
          asanaId,
          datePerformed: {
            gte: expectedStartOfToday,
            lte: expectedEndOfToday,
          },
        },
        orderBy: {
          datePerformed: 'desc',
        },
      })

      jest.useRealTimers()
    })

    it('should handle local calendar day detection', async () => {
      // Mock current time: November 18, 2025, 11:59 PM local time (just before midnight)
      const mockNow = new Date(2025, 10, 18, 23, 59, 0, 0)
      jest.useFakeTimers()
      jest.setSystemTime(mockNow)

      // Activity performed on the same local day should be found
      const activityOnSameDay = {
        id: '1',
        userId,
        asanaId,
        asanaName: 'Test Pose',
        sort_english_name: 'Test Pose',
        datePerformed: new Date(2025, 10, 18, 0, 1, 0, 0), // Early morning local time
        completionStatus: 'complete',
        duration: 60,
        notes: null,
        sensations: null,
        difficulty: 'easy',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockFindFirst.mockResolvedValue(activityOnSameDay as any)

      const result = await checkExistingActivity(userId, asanaId)

      expect(result).toEqual(activityOnSameDay)

      jest.useRealTimers()
    })

    it('should correctly handle date boundary at local midnight', async () => {
      // Mock current time: November 19, 2025, 00:01 AM local time (just after midnight)
      const mockNow = new Date(2025, 10, 19, 0, 1, 0, 0)
      jest.useFakeTimers()
      jest.setSystemTime(mockNow)

      // Expected boundaries for November 19 in local timezone
      const expectedStartOfToday = new Date(2025, 10, 19, 0, 0, 0, 0)
      const expectedEndOfToday = new Date(2025, 10, 19, 23, 59, 59, 999)

      mockFindFirst.mockResolvedValue(null)

      await checkExistingActivity(userId, asanaId)

      // Activity from November 18 should NOT be included
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
          userId,
          asanaId,
          datePerformed: {
            gte: expectedStartOfToday,
            lte: expectedEndOfToday,
          },
        },
        orderBy: {
          datePerformed: 'desc',
        },
      })

      jest.useRealTimers()
    })

    it('should use local timezone for user-centric calendar day tracking', async () => {
      // Scenario: User expects activity tracking to reset at their local midnight
      // regardless of UTC time

      // Mock current time: November 18, 2025, 2:00 PM local time
      const mockNow = new Date(2025, 10, 18, 14, 0, 0, 0)
      jest.useFakeTimers()
      jest.setSystemTime(mockNow)

      // User should see their local day boundaries
      const expectedStartOfToday = new Date(2025, 10, 18, 0, 0, 0, 0)
      const expectedEndOfToday = new Date(2025, 10, 18, 23, 59, 59, 999)

      mockFindFirst.mockResolvedValue(null)

      await checkExistingActivity(userId, asanaId)

      expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
          userId,
          asanaId,
          datePerformed: {
            gte: expectedStartOfToday,
            lte: expectedEndOfToday,
          },
        },
        orderBy: {
          datePerformed: 'desc',
        },
      })

      jest.useRealTimers()
    })
  })
})
