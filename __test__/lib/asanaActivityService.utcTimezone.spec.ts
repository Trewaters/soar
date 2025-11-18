/**
 * Tests for UTC timezone handling in activity service
 * Ensures calendar day tracking works consistently regardless of server/client timezone
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

describe('asanaActivityService - UTC Timezone Handling', () => {
  const mockFindFirst = prisma.asanaActivity.findFirst as jest.MockedFunction<
    typeof prisma.asanaActivity.findFirst
  >
  const userId = 'test-user-123'
  const asanaId = 'test-asana-456'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('checkExistingActivity', () => {
    it('should query for activities using UTC date boundaries', async () => {
      // Mock current time: November 18, 2025, 10:30 AM UTC
      const mockNow = new Date('2025-11-18T10:30:00.000Z')
      const RealDate = Date
      global.Date = class extends RealDate {
        constructor() {
          super()
          return mockNow
        }
        static UTC = RealDate.UTC
        static now = () => mockNow.getTime()
      } as any

      // Expected start of today in UTC: November 18, 2025, 00:00:00.000 UTC
      const expectedStartOfToday = new Date('2025-11-18T00:00:00.000Z')

      // Expected end of today in UTC: November 18, 2025, 23:59:59.999 UTC
      const expectedEndOfToday = new Date('2025-11-18T23:59:59.999Z')

      mockFindFirst.mockResolvedValue(null)

      await checkExistingActivity(userId, asanaId)

      // Verify the query uses UTC date boundaries
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

      // Restore Date implementation
      global.Date = RealDate
    })

    it('should handle timezone-independent calendar day detection', async () => {
      // Mock current time: November 18, 2025, 11:59 PM UTC (just before midnight)
      const mockNow = new Date('2025-11-18T23:59:00.000Z')
      const RealDate = Date
      global.Date = class extends RealDate {
        constructor() {
          super()
          return mockNow
        }
        static UTC = RealDate.UTC
        static now = () => mockNow.getTime()
      } as any

      // Activity performed on the same UTC day should be found
      const activityOnSameDay = {
        id: '1',
        userId,
        asanaId,
        asanaName: 'Test Pose',
        sort_english_name: 'Test Pose',
        datePerformed: new RealDate('2025-11-18T00:01:00.000Z'), // Early morning UTC
        completionStatus: 'complete',
        duration: 60,
        notes: null,
        sensations: null,
        difficulty: 'easy',
        createdAt: new RealDate(),
        updatedAt: new RealDate(),
      }

      mockFindFirst.mockResolvedValue(activityOnSameDay as any)

      const result = await checkExistingActivity(userId, asanaId)

      expect(result).toEqual(activityOnSameDay)

      // Restore Date implementation
      global.Date = RealDate
    })

    it('should correctly handle date boundary at midnight UTC', async () => {
      // Mock current time: November 19, 2025, 00:01 AM UTC (just after midnight)
      const mockNow = new Date('2025-11-19T00:01:00.000Z')
      const RealDate = Date
      global.Date = class extends RealDate {
        constructor() {
          super()
          return mockNow
        }
        static UTC = RealDate.UTC
        static now = () => mockNow.getTime()
      } as any

      // Expected boundaries for November 19
      const expectedStartOfToday = new Date('2025-11-19T00:00:00.000Z')
      const expectedEndOfToday = new Date('2025-11-19T23:59:59.999Z')

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

      // Restore Date implementation
      global.Date = RealDate
    })

    it('should use UTC for consistent calendar day across all timezones', async () => {
      // Scenario: Server in PST (UTC-8), user in JST (UTC+9)
      // Both should see the same "today" based on UTC

      // Mock current time: November 18, 2025, 2:00 PM UTC
      // PST: November 18, 2025, 6:00 AM (morning)
      // JST: November 18, 2025, 11:00 PM (evening)
      const mockNow = new Date('2025-11-18T14:00:00.000Z')
      const RealDate = Date
      global.Date = class extends RealDate {
        constructor() {
          super()
          return mockNow
        }
        static UTC = RealDate.UTC
        static now = () => mockNow.getTime()
      } as any

      // Both users should see the same UTC day boundaries
      const expectedStartOfToday = new Date('2025-11-18T00:00:00.000Z')
      const expectedEndOfToday = new Date('2025-11-18T23:59:59.999Z')

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

      // Restore Date implementation
      global.Date = RealDate
    })
  })
})
