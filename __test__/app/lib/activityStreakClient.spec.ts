import '@testing-library/jest-dom'
import { fetchUserActivityStreakSummary } from '@app/lib/activityStreakClient'

describe('activityStreakClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should fetch and merge all activity sources to compute streak summary', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { datePerformed: '2026-02-25T10:00:00.000Z' },
          { datePerformed: '2026-02-24T10:00:00.000Z' },
          { datePerformed: '2026-02-23T10:00:00.000Z' },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

    const summary = await fetchUserActivityStreakSummary('user-123', 0)

    expect(global.fetch).toHaveBeenCalledTimes(3)
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      '/api/asanaActivity?userId=user-123'
    )
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      '/api/seriesActivity?userId=user-123'
    )
    expect(global.fetch).toHaveBeenNthCalledWith(
      3,
      '/api/sequenceActivity?userId=user-123'
    )

    expect(summary.status.currentStreak).toBe(3)
    expect(summary.longestStreak).toBe(3)
    expect(summary.nextGoal.current).toBe(3)
  })

  it('should treat failed source responses as empty and continue', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ datePerformed: '2026-02-25T10:00:00.000Z' }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

    const summary = await fetchUserActivityStreakSummary('user-123', 0)

    expect(summary.status.currentStreak).toBe(1)
    expect(summary.longestStreak).toBe(1)
  })
})
