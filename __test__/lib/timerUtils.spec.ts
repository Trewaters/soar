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

// Mock react-use-precision-timer instead of marky
jest.mock('react-use-precision-timer', () => ({
  useTimer: jest.fn(),
  useStopwatch: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    isRunning: jest.fn(() => false),
    getElapsedRunningTime: jest.fn(() => 5000), // 5 seconds
    getElapsedPausedTime: jest.fn(() => 0),
  })),
  useDelay: jest.fn(),
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

  describe('legacy timer functions', () => {
    it('should handle timer operations gracefully', () => {
      // Should not throw even if timer operations are called
      expect(() => {
        startTimer('test')
        const result = stopTimer('test')
        clearAllTimers()

        expect(result).toBeDefined()
        expect(result?.name).toBe('test')
      }).not.toThrow()
    })
  })
})
