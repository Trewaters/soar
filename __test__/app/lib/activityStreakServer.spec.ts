import '@testing-library/jest-dom'

jest.mock('@lib/prismaClient', () => ({
  prisma: {
    asanaActivity: {
      findMany: jest.fn() as any,
    },
    seriesActivity: {
      findMany: jest.fn() as any,
    },
    sequenceActivity: {
      findMany: jest.fn() as any,
    },
  },
}))

import { prisma } from '@lib/prismaClient'
import {
  extractActivityDatesFromSources,
  fetchUserActivitySourceRecords,
  mergeTypedServerActivityRecords,
} from '@app/lib/activityStreakServer'

describe('activityStreakServer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchUserActivitySourceRecords', () => {
    it('should fetch all three activity sources with default select shape', async () => {
      jest
        .mocked(prisma.asanaActivity.findMany)
        .mockResolvedValue([
          { datePerformed: new Date('2026-02-25T10:00:00Z') },
        ] as any)
      jest
        .mocked(prisma.seriesActivity.findMany)
        .mockResolvedValue([
          { datePerformed: new Date('2026-02-24T10:00:00Z') },
        ] as any)
      jest
        .mocked(prisma.sequenceActivity.findMany)
        .mockResolvedValue([
          { datePerformed: new Date('2026-02-23T10:00:00Z') },
        ] as any)

      const result = await fetchUserActivitySourceRecords('user-123')

      expect(prisma.asanaActivity.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        select: { datePerformed: true },
      })
      expect(prisma.seriesActivity.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        select: { datePerformed: true },
      })
      expect(prisma.sequenceActivity.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        select: { datePerformed: true },
      })

      expect(result.asanaActivities).toHaveLength(1)
      expect(result.seriesActivities).toHaveLength(1)
      expect(result.sequenceActivities).toHaveLength(1)
    })

    it('should apply fromDate, orderDesc, take, and includeCreatedAt options', async () => {
      const fromDate = new Date('2026-01-01T00:00:00Z')

      jest
        .mocked(prisma.asanaActivity.findMany)
        .mockResolvedValue([
          { datePerformed: new Date(), createdAt: new Date() },
        ] as any)
      jest.mocked(prisma.seriesActivity.findMany).mockResolvedValue([] as any)
      jest.mocked(prisma.sequenceActivity.findMany).mockResolvedValue([] as any)

      await fetchUserActivitySourceRecords('user-123', {
        fromDate,
        includeCreatedAt: true,
        orderDesc: true,
        take: 20,
      })

      const expectedArgs = {
        where: {
          userId: 'user-123',
          datePerformed: { gte: fromDate },
        },
        orderBy: { datePerformed: 'desc' },
        take: 20,
        select: { datePerformed: true, createdAt: true },
      }

      expect(prisma.asanaActivity.findMany).toHaveBeenCalledWith(expectedArgs)
      expect(prisma.seriesActivity.findMany).toHaveBeenCalledWith(expectedArgs)
      expect(prisma.sequenceActivity.findMany).toHaveBeenCalledWith(
        expectedArgs
      )
    })
  })

  describe('mergeTypedServerActivityRecords', () => {
    it('should merge activities and assign source types', () => {
      const merged = mergeTypedServerActivityRecords({
        asanaActivities: [{ datePerformed: new Date('2026-02-25T10:00:00Z') }],
        seriesActivities: [{ datePerformed: new Date('2026-02-24T10:00:00Z') }],
        sequenceActivities: [
          { datePerformed: new Date('2026-02-23T10:00:00Z') },
        ],
      })

      expect(merged).toHaveLength(3)
      expect(merged.map((item) => item.type)).toEqual([
        'asana',
        'series',
        'sequence',
      ])
    })

    it('should sort descending by date when sortDesc is true', () => {
      const merged = mergeTypedServerActivityRecords(
        {
          asanaActivities: [
            { datePerformed: new Date('2026-02-23T10:00:00Z') },
          ],
          seriesActivities: [
            { datePerformed: new Date('2026-02-25T10:00:00Z') },
          ],
          sequenceActivities: [
            { datePerformed: new Date('2026-02-24T10:00:00Z') },
          ],
        },
        { sortDesc: true }
      )

      expect(merged.map((item) => item.type)).toEqual([
        'series',
        'sequence',
        'asana',
      ])
    })
  })

  describe('extractActivityDatesFromSources', () => {
    it('should return flattened date list from all source arrays', () => {
      const dates = extractActivityDatesFromSources({
        asanaActivities: [{ datePerformed: new Date('2026-02-25T10:00:00Z') }],
        seriesActivities: [{ datePerformed: new Date('2026-02-24T10:00:00Z') }],
        sequenceActivities: [
          { datePerformed: new Date('2026-02-23T10:00:00Z') },
        ],
      })

      expect(dates).toHaveLength(3)
      expect(dates.every((d) => d instanceof Date)).toBe(true)
    })
  })
})
