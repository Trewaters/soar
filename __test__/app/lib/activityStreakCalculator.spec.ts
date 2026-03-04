import {
  buildNextGoalFromActivityStreak,
  calculateActivityStreakSummaryFromDateKeys,
  calculateCurrentActivityStreakFromDateKeys,
  calculateLongestActivityStreakFromDateKeys,
  getTodayDateKey,
  getUniqueActivityDateKeys,
} from '@app/lib/activityStreakCalculator'

describe('activityStreakCalculator', () => {
  describe('getTodayDateKey', () => {
    it('should compute the same local day for a positive timezone offset', () => {
      const now = new Date('2026-02-25T04:30:00.000Z')

      // UTC-8 (Pacific): local date should be previous day
      const dateKey = getTodayDateKey(480, now)

      expect(dateKey).toBe('2026-02-24')
    })
  })

  describe('getUniqueActivityDateKeys', () => {
    it('should de-duplicate multiple activities on the same local day', () => {
      const keys = getUniqueActivityDateKeys(
        [
          '2026-02-25T02:15:00.000Z',
          '2026-02-25T03:00:00.000Z',
          '2026-02-24T22:00:00.000Z',
        ],
        0
      )

      expect(keys).toEqual(['2026-02-25', '2026-02-24'])
    })

    it('should honor timezone offsets when grouping day keys', () => {
      const keys = getUniqueActivityDateKeys(
        [
          // Same UTC day but should span two local days in UTC-8
          '2026-02-25T00:30:00.000Z',
          '2026-02-25T20:30:00.000Z',
        ],
        480
      )

      expect(keys).toEqual(['2026-02-25', '2026-02-24'])
    })
  })

  describe('calculateCurrentActivityStreakFromDateKeys', () => {
    it('should return zero when no days exist', () => {
      const result = calculateCurrentActivityStreakFromDateKeys(
        [],
        0,
        new Date('2026-02-25T12:00:00.000Z')
      )

      expect(result).toEqual({
        currentStreak: 0,
        isActiveToday: false,
        isAtRisk: false,
      })
    })

    it('should keep a streak active when last activity was yesterday', () => {
      const result = calculateCurrentActivityStreakFromDateKeys(
        ['2026-02-24', '2026-02-23', '2026-02-22'],
        0,
        new Date('2026-02-25T12:00:00.000Z')
      )

      expect(result).toEqual({
        currentStreak: 3,
        isActiveToday: false,
        isAtRisk: true,
      })
    })

    it('should break streak when gap exceeds one day', () => {
      const result = calculateCurrentActivityStreakFromDateKeys(
        ['2026-02-22', '2026-02-21'],
        0,
        new Date('2026-02-25T12:00:00.000Z')
      )

      expect(result).toEqual({
        currentStreak: 0,
        isActiveToday: false,
        isAtRisk: false,
      })
    })
  })

  describe('calculateLongestActivityStreakFromDateKeys', () => {
    it('should calculate longest run from non-contiguous date keys', () => {
      const longest = calculateLongestActivityStreakFromDateKeys([
        '2026-02-25',
        '2026-02-24',
        '2026-02-21',
        '2026-02-20',
        '2026-02-19',
        '2026-02-17',
      ])

      expect(longest).toBe(3)
    })
  })

  describe('buildNextGoalFromActivityStreak', () => {
    it('should generate expected next-goal payload for early streaks', () => {
      const nextGoal = buildNextGoalFromActivityStreak(7)

      expect(nextGoal).toEqual({
        text: 'Practice 23 More Days',
        current: 7,
        target: 30,
        progress: 23,
        tiersAchieved: 0,
        tierName: 'Get started!',
        ultimateGoalsCompleted: 0,
      })
    })
  })

  describe('calculateActivityStreakSummaryFromDateKeys', () => {
    it('should return centralized status, longest streak, and next goal together', () => {
      const summary = calculateActivityStreakSummaryFromDateKeys(
        ['2026-02-25', '2026-02-24', '2026-02-23', '2026-02-21'],
        0,
        new Date('2026-02-25T12:00:00.000Z')
      )

      expect(summary.status).toEqual({
        currentStreak: 3,
        isActiveToday: true,
        isAtRisk: false,
      })
      expect(summary.longestStreak).toBe(3)
      expect(summary.nextGoal.text).toBe('Practice 27 More Days')
      expect(summary.nextGoal.current).toBe(3)
      expect(summary.nextGoal.target).toBe(30)
    })
  })
})
