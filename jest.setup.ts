import '@testing-library/jest-dom'
import { configureAxe, toHaveNoViolations } from 'jest-axe'
import type { JestAxeConfigureOptions } from 'jest-axe'
// Provide minimal global Request/Response shims for Jest environment so Next/server imports don't throw
if (typeof (global as any).Request === 'undefined') {
  try {
    // Prefer undici's WHATWG Request if available
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const undici = require('undici')
    if (undici && undici.Request) {
      ;(global as any).Request = undici.Request
      ;(global as any).Response = undici.Response
    }
  } catch (e) {
    // Lightweight fallback shim
    ;(global as any).Request = class {
      url: string
      method: string
      headers: any
      constructor(url: string, init?: any) {
        this.url = url
        this.method = (init && init.method) || 'GET'
        this.headers = (init && init.headers) || {}
      }
      clone() {
        return this
      }
    }
    ;(global as any).Response = class {
      status: number
      body: any
      constructor(body?: any, init?: any) {
        this.body = body
        this.status = init?.status || 200
      }
      async json() {
        try {
          return JSON.parse(this.body)
        } catch {
          return this.body
        }
      }
    }
  }
}

// Provide TextEncoder/TextDecoder for packages that depend on Web API globals (undici, busboy)
if (
  typeof (global as any).TextEncoder === 'undefined' ||
  typeof (global as any).TextDecoder === 'undefined'
) {
  try {
    // Node >= 11 has util.TextEncoder/TextDecoder
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { TextEncoder, TextDecoder } = require('util')
    ;(global as any).TextEncoder = TextEncoder
    ;(global as any).TextDecoder = TextDecoder
  } catch (e) {
    // Lightweight fallback implementations
    ;(global as any).TextEncoder = class TextEncoder {
      encode(input: string) {
        return Buffer.from(input, 'utf-8')
      }
    }
    ;(global as any).TextDecoder = class TextDecoder {
      decode(input: Uint8Array | Buffer) {
        // If running in Node and input is already a Buffer, return directly.
        if (typeof Buffer !== 'undefined' && Buffer.isBuffer(input)) {
          return input.toString('utf-8')
        }

        // If input is a Uint8Array, construct a Buffer from its underlying ArrayBuffer
        // using byteOffset/byteLength to avoid type overload issues.
        if (typeof Buffer !== 'undefined' && input instanceof Uint8Array) {
          return Buffer.from(
            input.buffer,
            input.byteOffset,
            input.byteLength
          ).toString('utf-8')
        }

        // Fallback: coerce to string safely
        try {
          return String(input)
        } catch {
          return ''
        }
      }
    }
  }
}
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
