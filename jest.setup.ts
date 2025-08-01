import '@testing-library/jest-dom'
import { configureAxe, toHaveNoViolations } from 'jest-axe'
import type { JestAxeConfigureOptions } from 'jest-axe'

// Mock browser audio APIs that are not available in JSDOM
beforeAll(() => {
  // Mock AudioContext
  ;(global as any).AudioContext = jest.fn().mockImplementation(() => ({
    createOscillator: jest.fn().mockReturnValue({
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      frequency: {
        value: 0,
        setValueAtTime: jest.fn(),
      },
      type: 'sine',
    }),
    createGain: jest.fn().mockReturnValue({
      connect: jest.fn(),
      gain: {
        value: 0,
        setValueAtTime: jest.fn(),
        linearRampToValueAtTime: jest.fn(),
        exponentialRampToValueAtTime: jest.fn(),
      },
    }),
    destination: {},
    currentTime: 0,
    resume: jest.fn().mockResolvedValue(undefined),
  }))

  // Mock webkitAudioContext for Safari
  ;(global as any).webkitAudioContext = (global as any).AudioContext

  // Mock HTMLAudioElement
  ;(global as any).Audio = jest.fn().mockImplementation(() => ({
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn(),
    volume: 1,
    currentTime: 0,
    duration: NaN,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }))
})

// Configure axe-core for accessibility testing
const axeConfig: JestAxeConfigureOptions = {
  rules: {
    // Disable rules that may conflict with test environment
    region: { enabled: false },
    'landmark-one-main': { enabled: false },
    // Enable important accessibility rules
    'color-contrast': { enabled: true },
  },
}

const axe = configureAxe(axeConfig)

// Add custom Jest matchers for accessibility testing
expect.extend(toHaveNoViolations)

// Make axe available globally for tests
;(globalThis as any).axe = axe

// Extend global types for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var axe: ReturnType<typeof configureAxe>

  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R
    }
  }
}

// Export to ensure this file is treated as a module
export {}
