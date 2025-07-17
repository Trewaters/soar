import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals'
import {
  startTimer,
  stopTimer,
  clearAllTimers,
  formatDuration,
  msToSeconds,
} from '@lib/timerUtils'

// Mock marky to avoid issues in test environment
jest.mock('marky', () => ({
  mark: jest.fn(),
  stop: jest.fn(() => ({
    entryType: 'measure',
    startTime: 1000,
    duration: 5000, // 5 seconds
    name: 'test-timer',
  })),
  clear: jest.fn(),
  getEntries: jest.fn(() => []),
}))

describe('Timer Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    clearAllTimers()
  })

  describe('formatDuration', () => {
    it('should format seconds correctly (MM:SS)', () => {
      expect(formatDuration(65)).toBe('01:05')
      expect(formatDuration(125)).toBe('02:05')
      expect(formatDuration(30)).toBe('00:30')
    })

    it('should format hours correctly (HH:MM:SS)', () => {
      expect(formatDuration(3665)).toBe('01:01:05')
      expect(formatDuration(7200)).toBe('02:00:00')
      expect(formatDuration(3600)).toBe('01:00:00')
    })

    it('should handle zero duration', () => {
      expect(formatDuration(0)).toBe('00:00')
    })

    it('should handle fractional seconds by flooring', () => {
      expect(formatDuration(65.9)).toBe('01:05')
    })
  })

  describe('msToSeconds', () => {
    it('should convert milliseconds to seconds correctly', () => {
      expect(msToSeconds(1000)).toBe(1)
      expect(msToSeconds(5000)).toBe(5)
      expect(msToSeconds(1500)).toBe(1) // Should floor
      expect(msToSeconds(999)).toBe(0)
    })
  })

  describe('timer functions', () => {
    it('should start and stop timers', () => {
      startTimer('test-timer')
      const result = stopTimer('test-timer')

      expect(result).toBeDefined()
      expect(result?.name).toBe('test-timer')
      expect(result?.duration).toBe(5000)
    })

    it('should handle timer errors gracefully', () => {
      // Should not throw even if timer operations fail
      expect(() => {
        startTimer('test')
        stopTimer('non-existent')
        clearAllTimers()
      }).not.toThrow()
    })
  })
})
