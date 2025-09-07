import '@testing-library/jest-dom'
import { configureAxe, toHaveNoViolations } from 'jest-axe'
import type { JestAxeConfigureOptions } from 'jest-axe'
// Globally mock next-auth/react to avoid ESM import issues in Jest and allow tests to override session state
const mockUseSession = jest.fn(() => ({
  data: null,
  status: 'unauthenticated',
}))
jest.mock('next-auth/react', () => ({
  __esModule: true,
  useSession: mockUseSession,
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  signIn: jest.fn(),
  signOut: jest.fn(),
}))
;(globalThis as any).mockUseSession = mockUseSession

// Globally mock next/navigation hooks used by many components (useRouter, usePathname)
const mockUsePathname = jest.fn(() => '/')
const mockUseRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
}))
jest.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: mockUsePathname,
  useRouter: mockUseRouter,
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))
;(globalThis as any).mockUsePathname = mockUsePathname
;(globalThis as any).mockUseRouter = mockUseRouter

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
