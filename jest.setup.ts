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
// Provide a minimal global.fetch implementation for the Jest environment so
// components that call fetch() (image uploads, reorder APIs, etc.) don't
// throw during tests. Prefer undici.fetch if available, otherwise use a
// lightweight jest.fn that resolves with a simple ok/json shape.
if (typeof (global as any).fetch === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const undici = require('undici')
    if (undici && undici.fetch) {
      ;(global as any).fetch = undici.fetch
    } else {
      ;(global as any).fetch = jest.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({}),
        text: async () => '',
      }))
    }
  } catch (e) {
    ;(global as any).fetch = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({}),
      text: async () => '',
    }))
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

// Globally mock useNavigationWithLoading hook - used by components that need loading states during navigation
// This returns the same interface as the real hook but with mocked functions
const mockNavigationPush = jest.fn()
const mockNavigationReplace = jest.fn()
const mockNavigationPrefetch = jest.fn()
const mockNavigationBack = jest.fn()
const mockNavigationForward = jest.fn()
const mockNavigationRefresh = jest.fn()
const mockIsElementLoading = jest.fn().mockReturnValue(false)
const mockIsNavigating = false
const mockUseNavigationWithLoading = jest.fn(() => ({
  push: mockNavigationPush,
  replace: mockNavigationReplace,
  prefetch: mockNavigationPrefetch,
  back: mockNavigationBack,
  forward: mockNavigationForward,
  refresh: mockNavigationRefresh,
  isElementLoading: mockIsElementLoading,
  isNavigating: mockIsNavigating,
}))
jest.mock('@app/hooks/useNavigationWithLoading', () => ({
  __esModule: true,
  useNavigationWithLoading: mockUseNavigationWithLoading,
}))
;(globalThis as any).mockUseNavigationWithLoading = mockUseNavigationWithLoading
;(globalThis as any).mockNavigationPush = mockNavigationPush
;(globalThis as any).mockNavigationReplace = mockNavigationReplace
;(globalThis as any).mockNavigationBack = mockNavigationBack
;(globalThis as any).mockIsElementLoading = mockIsElementLoading
// Expose refresh mock for tests that assert router refresh behavior
;(globalThis as any).mockNavigationRefresh = mockNavigationRefresh

// Mock NavigationLoadingContext to prevent errors when components use the context
const mockNavigationLoadingState = {
  isNavigating: false,
  targetPath: null,
  elementId: null,
  navId: null,
}
jest.mock('@context/NavigationLoadingContext', () => ({
  __esModule: true,
  useNavigationLoading: jest.fn(() => ({
    startNavigation: jest.fn(),
    endNavigation: jest.fn(),
    state: mockNavigationLoadingState,
    isElementLoading: jest.fn().mockReturnValue(false),
  })),
  NavigationLoadingProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}))

// Centralized service mocks - commonly used across multiple test suites
// These can be overridden in individual tests using require() and mockResolvedValue/mockImplementation

// Mock poseService - used in create/edit/delete pose tests
jest.mock('@lib/poseService', () => ({
  __esModule: true,
  createPose: jest.fn().mockResolvedValue({
    id: 'test-pose-id',
    sort_english_name: 'Test Pose',
  }),
  updatePose: jest.fn().mockResolvedValue({
    id: 'test-pose-id',
    sort_english_name: 'Updated Pose',
  }),
  fetchWithTimeout: jest
    .fn()
    .mockImplementation(async (input: any, init?: any) => {
      // Use the global fetch mock so tests can override behavior per-suite
      return await (global as any).fetch(input, init)
    }),
  deletePose: jest.fn().mockResolvedValue({ success: true }),
  getPoseById: jest.fn().mockResolvedValue({
    id: 'test-pose-id',
    sort_english_name: 'Test Pose',
  }),
  getAllPoses: jest.fn().mockResolvedValue([]),
  getUserPoses: jest.fn().mockResolvedValue([]),
  getAccessiblePoses: jest.fn().mockResolvedValue([]),
  getPoseByName: jest.fn().mockResolvedValue({
    id: 'test-pose-id',
    sort_english_name: 'Test Pose',
  }),
  getPose: jest.fn().mockResolvedValue({
    id: 'test-pose-id',
    sort_english_name: 'Test Pose',
  }),
  getPoseIdByName: jest.fn().mockResolvedValue('test-pose-id'),
}))

// Mock imageService - used in pose view and image management tests
jest.mock('@lib/imageService', () => ({
  __esModule: true,
  getUserPoseImages: jest.fn().mockResolvedValue({
    images: [],
    total: 0,
  }),
  uploadPoseImage: jest.fn().mockResolvedValue({
    imageId: 'test-image-id',
    url: 'https://example.com/image.jpg',
  }),
  deletePoseImage: jest.fn().mockResolvedValue({ success: true }),
}))

// Mock asanaActivityClientService - used in pose activity tracking tests
jest.mock('@lib/asanaActivityClientService', () => ({
  __esModule: true,
  checkActivityExists: jest.fn().mockResolvedValue(false),
  createActivity: jest.fn().mockResolvedValue({
    id: 'test-activity-id',
    poseId: 'test-pose-id',
  }),
  updateActivity: jest.fn().mockResolvedValue({
    id: 'test-activity-id',
    completed: true,
  }),
}))

// Mock seriesService - used in series creation/edit tests
jest.mock('@lib/seriesService', () => ({
  __esModule: true,
  createSeries: jest.fn().mockResolvedValue({
    id: 'test-series-id',
    name: 'Test Series',
  }),
  updateSeries: jest.fn().mockResolvedValue({
    id: 'test-series-id',
    name: 'Updated Series',
  }),
  deleteSeries: jest.fn().mockResolvedValue({ success: true }),
  // Ensure getAllSeries is mocked by default but calls global.fetch so tests that
  // assert fetch was called still work (matches real implementation behavior)
  getAllSeries: jest.fn().mockImplementation(async () => {
    // Debug log to help diagnose test-only behavior
    // eslint-disable-next-line no-console
    const timestamp = Date.now()
    // Use the global fetch (which individual tests may override)
    const res = await (global as any).fetch(`/api/series?ts=${timestamp}`, {
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
    if (!res.ok) return []
    try {
      return await res.json()
    } catch {
      return []
    }
  }),
  getSeriesById: jest.fn().mockResolvedValue({
    id: 'test-series-id',
    name: 'Test Series',
  }),
}))

// Mock alphaUsers - used to control feature flag behavior in tests
jest.mock('@app/lib/alphaUsers', () => ({
  __esModule: true,
  isAlphaUser: jest.fn().mockReturnValue(false),
  alphaUsers: [],
}))

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
