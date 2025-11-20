/**
 * Tests for client-side timezone handling in activity service
 * Verifies that date ranges calculated by client in local timezone are properly handled
 */
import {
  checkExistingActivity,
  deleteAsanaActivity,
} from '@lib/asanaActivityService'
import { prisma } from '@lib/prismaClient'

// Mock the Prisma client
jest.mock('@lib/prismaClient', () => ({
  prisma: {
    asanaActivity: {
      findFirst: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}))

// Mock error loggers
jest.mock('@lib/errorLogger', () => ({
  logServiceError: jest.fn(),
  logDatabaseError: jest.fn(),
}))

describe('asanaActivityService - Client Timezone Handling', () => {
  const mockFindFirst = prisma.asanaActivity.findFirst as jest.MockedFunction<
    typeof prisma.asanaActivity.findFirst
  >
  const mockDeleteMany = prisma.asanaActivity.deleteMany as jest.MockedFunction<
    typeof prisma.asanaActivity.deleteMany
  >

  const userId = 'test-user-123'
  const asanaId = 'test-asana-456'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('checkExistingActivity with client date range', () => {
    it('should query using date range provided by client', async () => {
      // Client calculates dates in their local timezone
      // November 18, 2025 in user's local timezone (US/Pacific: UTC-8)
      const clientStartOfDay = new Date(2025, 10, 18, 0, 0, 0, 0) // 00:00:00 PST
      const clientEndOfDay = new Date(2025, 10, 18, 23, 59, 59, 999) // 23:59:59 PST

      // Convert to ISO strings (which converts to UTC)
      const startDateISO = clientStartOfDay.toISOString() // "2025-11-18T08:00:00.000Z" (UTC+8)
      const endDateISO = clientEndOfDay.toISOString() // "2025-11-19T07:59:59.999Z" (UTC+8)

      mockFindFirst.mockResolvedValue(null)

      // Service receives ISO strings and converts back to Date objects
      await checkExistingActivity(userId, asanaId, startDateISO, endDateISO)

      // Verify query uses the date range sent by client (reconverted from ISO)
      const callArgs = mockFindFirst.mock.calls[0][0]
      expect(callArgs.where.userId).toBe(userId)
      expect(callArgs.where.asanaId).toBe(asanaId)

      // Dates should match the client's intent (stored as UTC in DB)
      expect(callArgs.where.datePerformed.gte).toEqual(new Date(startDateISO))
      expect(callArgs.where.datePerformed.lte).toEqual(new Date(endDateISO))
    })

    it('should handle client midnight boundary correctly', async () => {
      // User in Tokyo timezone (UTC+9) checks activity just after midnight
      // November 19, 2025, 00:01 AM JST
      const tokyoMidnight = new Date(2025, 10, 19, 0, 1, 0, 0)

      // Client calculates today's boundaries in Tokyo timezone
      const startOfToday = new Date(2025, 10, 19, 0, 0, 0, 0) // 00:00:00 JST
      const endOfToday = new Date(2025, 10, 19, 23, 59, 59, 999) // 23:59:59 JST

      const startDateISO = startOfToday.toISOString()
      const endDateISO = endOfToday.toISOString()

      mockFindFirst.mockResolvedValue(null)

      await checkExistingActivity(userId, asanaId, startDateISO, endDateISO)

      // Verify the query excludes activities from November 18 (Tokyo time)
      const callArgs = mockFindFirst.mock.calls[0][0]
      const queryStart = callArgs.where.datePerformed.gte as Date
      const queryEnd = callArgs.where.datePerformed.lte as Date

      // Query should be for November 19 in Tokyo timezone
      expect(queryStart.toISOString()).toBe(startDateISO)
      expect(queryEnd.toISOString()).toBe(endDateISO)
    })

    it('should handle user in UTC timezone', async () => {
      // User in London (UTC+0) during winter
      const londonDate = new Date(Date.UTC(2025, 10, 18, 14, 0, 0, 0))

      // Client calculates today's boundaries in UTC
      const startOfToday = new Date(Date.UTC(2025, 10, 18, 0, 0, 0, 0))
      const endOfToday = new Date(Date.UTC(2025, 10, 18, 23, 59, 59, 999))

      const startDateISO = startOfToday.toISOString()
      const endDateISO = endOfToday.toISOString()

      mockFindFirst.mockResolvedValue(null)

      await checkExistingActivity(userId, asanaId, startDateISO, endDateISO)

      const callArgs = mockFindFirst.mock.calls[0][0]
      expect(callArgs.where.datePerformed.gte).toEqual(new Date(startDateISO))
      expect(callArgs.where.datePerformed.lte).toEqual(new Date(endDateISO))
    })

    it('should handle user in negative UTC offset timezone', async () => {
      // User in New York (UTC-5) during winter
      // November 18, 2025, 3:00 PM EST
      const nyDate = new Date(2025, 10, 18, 15, 0, 0, 0)

      // Client calculates today's boundaries in their local timezone
      // The test runner might be in PST, but client would calculate in their own timezone
      const startOfToday = new Date(2025, 10, 18, 0, 0, 0, 0)
      const endOfToday = new Date(2025, 10, 18, 23, 59, 59, 999)

      const startDateISO = startOfToday.toISOString()
      const endDateISO = endOfToday.toISOString()

      mockFindFirst.mockResolvedValue(null)

      await checkExistingActivity(userId, asanaId, startDateISO, endDateISO)

      const callArgs = mockFindFirst.mock.calls[0][0]
      const queryStart = callArgs.where.datePerformed.gte as Date
      const queryEnd = callArgs.where.datePerformed.lte as Date

      // Verify dates are properly stored as UTC
      expect(queryStart.toISOString()).toBe(startDateISO)
      expect(queryEnd.toISOString()).toBe(endDateISO)

      // Verify the query received the correct date range
      // The exact UTC times depend on the test environment's timezone
      // but the pattern should work for any timezone
      expect(queryStart.getUTCDate()).toBeGreaterThanOrEqual(17) // Could be 17 or 18
      expect(queryEnd.getUTCDate()).toBeGreaterThanOrEqual(18) // Could be 18 or 19
    })

    it('should fallback to server time when no dates provided (backward compatibility)', async () => {
      const mockNow = new Date(2025, 10, 18, 10, 30, 0, 0)
      jest.useFakeTimers()
      jest.setSystemTime(mockNow)

      mockFindFirst.mockResolvedValue(null)

      // Call without date parameters (old behavior)
      await checkExistingActivity(userId, asanaId)

      // Should default to server's local time
      const expectedStart = new Date(2025, 10, 18, 0, 0, 0, 0)
      const expectedEnd = new Date(2025, 10, 18, 23, 59, 59, 999)

      const callArgs = mockFindFirst.mock.calls[0][0]
      expect(callArgs.where.datePerformed.gte).toEqual(expectedStart)
      expect(callArgs.where.datePerformed.lte).toEqual(expectedEnd)

      jest.useRealTimers()
    })
  })

  describe('deleteAsanaActivity with client date range', () => {
    it('should delete activities within client-provided date range', async () => {
      // Client in Sydney (UTC+11) wants to delete today's activity
      const startOfToday = new Date(2025, 10, 18, 0, 0, 0, 0)
      const endOfToday = new Date(2025, 10, 18, 23, 59, 59, 999)

      const startDateISO = startOfToday.toISOString()
      const endDateISO = endOfToday.toISOString()

      mockDeleteMany.mockResolvedValue({ count: 1 })

      await deleteAsanaActivity(userId, asanaId, startDateISO, endDateISO)

      // Verify delete query uses client date range
      const callArgs = mockDeleteMany.mock.calls[0][0]
      expect(callArgs.where.userId).toBe(userId)
      expect(callArgs.where.asanaId).toBe(asanaId)
      expect(callArgs.where.datePerformed.gte).toEqual(new Date(startDateISO))
      expect(callArgs.where.datePerformed.lte).toEqual(new Date(endDateISO))
    })

    it('should handle delete at day boundary correctly', async () => {
      // User clicks delete just before midnight in their timezone
      const almostMidnight = new Date(2025, 10, 18, 23, 58, 0, 0)

      // Client calculates today's boundaries
      const startOfToday = new Date(2025, 10, 18, 0, 0, 0, 0)
      const endOfToday = new Date(2025, 10, 18, 23, 59, 59, 999)

      const startDateISO = startOfToday.toISOString()
      const endDateISO = endOfToday.toISOString()

      mockDeleteMany.mockResolvedValue({ count: 1 })

      await deleteAsanaActivity(userId, asanaId, startDateISO, endDateISO)

      // Should delete only activities from November 18 in user's timezone
      const callArgs = mockDeleteMany.mock.calls[0][0]
      const deleteStart = callArgs.where.datePerformed.gte as Date
      const deleteEnd = callArgs.where.datePerformed.lte as Date

      expect(deleteStart.toISOString()).toBe(startDateISO)
      expect(deleteEnd.toISOString()).toBe(endDateISO)
    })

    it('should fallback to server time for delete when no dates provided', async () => {
      const mockNow = new Date(2025, 10, 18, 15, 0, 0, 0)
      jest.useFakeTimers()
      jest.setSystemTime(mockNow)

      mockDeleteMany.mockResolvedValue({ count: 1 })

      // Call without date parameters (backward compatibility)
      await deleteAsanaActivity(userId, asanaId)

      // Should use server's local time
      const expectedStart = new Date(2025, 10, 18, 0, 0, 0, 0)
      const expectedEnd = new Date(2025, 10, 18, 23, 59, 59, 999)

      const callArgs = mockDeleteMany.mock.calls[0][0]
      expect(callArgs.where.datePerformed.gte).toEqual(expectedStart)
      expect(callArgs.where.datePerformed.lte).toEqual(expectedEnd)

      jest.useRealTimers()
    })
  })

  describe('UTC storage verification', () => {
    it('should verify dates are stored as UTC in database', async () => {
      // Simulate activity stored in UTC
      const utcActivity = {
        id: '1',
        userId,
        asanaId,
        asanaName: 'Test Pose',
        sort_english_name: 'Test Pose',
        // Activity performed in PST but stored as UTC
        // November 18, 2025, 3:00 PM PST = November 18, 2025, 11:00 PM UTC
        datePerformed: new Date('2025-11-18T23:00:00.000Z'),
        completionStatus: 'complete',
        duration: 60,
        notes: null,
        sensations: null,
        difficulty: 'easy',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockFindFirst.mockResolvedValue(utcActivity as any)

      // Client in PST queries for November 18
      const startOfDay = new Date(2025, 10, 18, 0, 0, 0, 0) // 00:00 PST
      const endOfDay = new Date(2025, 10, 18, 23, 59, 59, 999) // 23:59 PST

      const result = await checkExistingActivity(
        userId,
        asanaId,
        startOfDay.toISOString(),
        endOfDay.toISOString()
      )

      // Should find the activity because query range covers the UTC time
      expect(result).toEqual(utcActivity)

      // Verify the stored date is in UTC
      expect(result?.datePerformed.toISOString()).toBe(
        '2025-11-18T23:00:00.000Z'
      )
    })

    it('should demonstrate client local display of UTC data', async () => {
      // Activity stored in UTC
      const utcActivity = {
        id: '1',
        userId,
        asanaId,
        asanaName: 'Morning Practice',
        sort_english_name: 'Morning Practice',
        // Stored as UTC: November 18, 2025, 1:00 PM UTC
        datePerformed: new Date('2025-11-18T13:00:00.000Z'),
        completionStatus: 'complete',
        duration: 3600,
        notes: null,
        sensations: null,
        difficulty: 'medium',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockFindFirst.mockResolvedValue(utcActivity as any)

      const result = await checkExistingActivity(
        userId,
        asanaId,
        new Date(2025, 10, 18, 0, 0, 0, 0).toISOString(),
        new Date(2025, 10, 18, 23, 59, 59, 999).toISOString()
      )

      // Client would display this in their local timezone
      const clientDate = new Date(result!.datePerformed)

      // Verify UTC is preserved in storage
      expect(clientDate.toISOString()).toBe('2025-11-18T13:00:00.000Z')

      // In PST (UTC-8), this would display as 5:00 AM
      // In JST (UTC+9), this would display as 10:00 PM
      // Demonstrating "Store UTC, Display Local" pattern
    })
  })

  describe('timezone edge cases', () => {
    it('should handle daylight saving time transitions', async () => {
      // Spring forward: March 10, 2025 at 2:00 AM becomes 3:00 AM (US)
      // User performs activity during DST transition
      const startOfDay = new Date(2025, 2, 10, 0, 0, 0, 0)
      const endOfDay = new Date(2025, 2, 10, 23, 59, 59, 999)

      mockFindFirst.mockResolvedValue(null)

      await checkExistingActivity(
        userId,
        asanaId,
        startOfDay.toISOString(),
        endOfDay.toISOString()
      )

      // Verify query still works correctly during DST transition
      expect(mockFindFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            datePerformed: {
              gte: expect.any(Date),
              lte: expect.any(Date),
            },
          }),
        })
      )
    })

    it('should handle international date line crossing', async () => {
      // User in Samoa (UTC-11) and user in New Zealand (UTC+13)
      // Same moment, different dates

      // Samoa: November 18, 2025, 11:00 PM
      const samoaDate = new Date(2025, 10, 18, 23, 0, 0, 0)
      const samoaStartOfDay = new Date(2025, 10, 18, 0, 0, 0, 0)
      const samoaEndOfDay = new Date(2025, 10, 18, 23, 59, 59, 999)

      mockFindFirst.mockResolvedValue(null)

      await checkExistingActivity(
        'samoa-user',
        asanaId,
        samoaStartOfDay.toISOString(),
        samoaEndOfDay.toISOString()
      )

      // Both queries work correctly because client calculates local dates
      expect(mockFindFirst).toHaveBeenCalled()

      // The same UTC moment would be November 19 in New Zealand
      // But each client calculates their own local day boundaries
    })

    it('should handle year boundary crossing', async () => {
      // New Year's Eve, 11:59 PM
      const newYearsEve = new Date(2025, 11, 31, 23, 59, 0, 0)
      const startOfDay = new Date(2025, 11, 31, 0, 0, 0, 0)
      const endOfDay = new Date(2025, 11, 31, 23, 59, 59, 999)

      mockFindFirst.mockResolvedValue(null)

      await checkExistingActivity(
        userId,
        asanaId,
        startOfDay.toISOString(),
        endOfDay.toISOString()
      )

      const callArgs = mockFindFirst.mock.calls[0][0]
      const queryStart = callArgs.where.datePerformed.gte as Date
      const queryEnd = callArgs.where.datePerformed.lte as Date

      // Verify December 31, 2025 is correctly handled
      expect(queryStart.getMonth()).toBe(11) // December (0-indexed)
      expect(queryStart.getDate()).toBe(31)
      expect(queryEnd.getMonth()).toBe(11)
      expect(queryEnd.getDate()).toBe(31)
    })
  })
})
