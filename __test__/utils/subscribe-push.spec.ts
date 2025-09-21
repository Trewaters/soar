/**
 * Test suite for push notification utilities
 * Tests browser support detection, permission handling, and subscription management
 */

// Mock browser APIs - must be defined before imports
const mockServiceWorkerRegistration = {
  pushManager: {
    subscribe: jest.fn(),
    getSubscription: jest.fn(),
  },
  showNotification: jest.fn(),
}

const mockServiceWorker = {
  register: jest.fn().mockResolvedValue(mockServiceWorkerRegistration),
  ready: Promise.resolve(mockServiceWorkerRegistration),
}

const mockPushSubscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/test123',
  getKey: jest.fn(),
  unsubscribe: jest.fn(),
}

// Create a global Notification mock that can be reconfigured
class MockNotification {
  static permission: NotificationPermission = 'default'
  static requestPermission = jest
    .fn()
    .mockResolvedValue('granted' as NotificationPermission)
  constructor(
    public title: string,
    public options?: NotificationOptions
  ) {}
}

// Create PushManager mock
class MockPushManager {
  subscribe = jest.fn()
  getSubscription = jest.fn()
}

// Set up comprehensive browser API mocks
const windowMock = {
  PushManager: MockPushManager,
  Notification: MockNotification,
  atob: jest.fn().mockImplementation((str: string) => {
    // Simple base64 decode mock for testing
    return Buffer.from(str, 'base64').toString('binary')
  }),
}

// Create navigator mock with proper property descriptor
const navigatorMock = {
  serviceWorker: mockServiceWorker,
}

// Set up global mocks for both global and globalThis
Object.defineProperty(global, 'window', {
  value: {
    ...windowMock,
    PushManager: MockPushManager,
    Notification: MockNotification,
    atob: windowMock.atob,
  },
  writable: true,
  configurable: true,
})

Object.defineProperty(global, 'navigator', {
  value: navigatorMock,
  writable: true,
  configurable: true,
})

Object.defineProperty(global, 'Notification', {
  value: MockNotification,
  writable: true,
  configurable: true,
})

Object.defineProperty(global, 'PushManager', {
  value: MockPushManager,
  writable: true,
  configurable: true,
})

Object.defineProperty(global, 'fetch', {
  value: jest.fn(),
  writable: true,
  configurable: true,
})

// Also set on globalThis for compatibility
Object.defineProperty(globalThis, 'window', {
  value: {
    ...windowMock,
    PushManager: MockPushManager,
    Notification: MockNotification,
    atob: windowMock.atob,
  },
  writable: true,
  configurable: true,
})

Object.defineProperty(globalThis, 'navigator', {
  value: navigatorMock,
  writable: true,
  configurable: true,
})

Object.defineProperty(globalThis, 'Notification', {
  value: MockNotification,
  writable: true,
  configurable: true,
})

Object.defineProperty(globalThis, 'PushManager', {
  value: MockPushManager,
  writable: true,
  configurable: true,
})

Object.defineProperty(globalThis, 'fetch', {
  value: jest.fn(),
  writable: true,
  configurable: true,
})

// Mock environment variable
Object.defineProperty(process.env, 'NEXT_PUBLIC_VAPID_PUBLIC_KEY', {
  value: 'test-vapid-key',
  writable: true,
})

import {
  isPushSupported,
  getNotificationPermission,
  enablePushNotifications,
  disablePushNotifications,
  getExistingSubscription,
} from '../../app/utils/subscribe-push'

describe('Push Notification Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Reset notification permission on the mock class
    MockNotification.permission = 'default'
    MockNotification.requestPermission.mockResolvedValue('granted')

    // Reset navigator service worker mock
    mockServiceWorker.register.mockResolvedValue(mockServiceWorkerRegistration)

    // Reset push manager mocks
    mockServiceWorkerRegistration.pushManager.subscribe.mockResolvedValue(
      mockPushSubscription
    )
    mockServiceWorkerRegistration.pushManager.getSubscription.mockResolvedValue(
      null
    )

    // Reset push subscription mocks
    mockPushSubscription.getKey.mockImplementation((keyName: string) => {
      if (keyName === 'p256dh') return new Uint8Array([1, 2, 3])
      if (keyName === 'auth') return new Uint8Array([4, 5, 6])
      return null
    })

    // Reset fetch mock
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Success' }),
    })

    // Ensure environment variable is set
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY = 'test-vapid-key'
  })

  describe('Browser Support Detection', () => {
    it('should detect push support when all APIs are available', () => {
      expect(isPushSupported()).toBe(true)
    })

    it('should detect lack of support when ServiceWorker is missing', () => {
      const originalNavigator = global.navigator
      delete (global as any).navigator.serviceWorker

      expect(isPushSupported()).toBe(false)

      global.navigator = originalNavigator
    })

    it('should detect lack of support when PushManager is missing', () => {
      const originalPushManager = global.window.PushManager
      delete (global.window as any).PushManager

      expect(isPushSupported()).toBe(false)

      global.window.PushManager = originalPushManager
    })

    it('should detect lack of support when Notification is missing', () => {
      const originalNotification = global.window.Notification
      delete (global.window as any).Notification

      expect(isPushSupported()).toBe(false)

      global.window.Notification = originalNotification
    })
  })

  describe('Notification Permission', () => {
    it('should return current permission status', () => {
      // Update permission values directly on the mock
      MockNotification.permission = 'granted'
      expect(getNotificationPermission()).toBe('granted')

      MockNotification.permission = 'denied'
      expect(getNotificationPermission()).toBe('denied')

      MockNotification.permission = 'default'
      expect(getNotificationPermission()).toBe('default')
    })

    it('should return denied when Notification is not supported', () => {
      const originalNotification = (global as any).Notification
      const originalWindowNotification = (global as any).window?.Notification

      delete (global as any).Notification
      delete (global as any).window?.Notification

      expect(getNotificationPermission()).toBe('denied')
      ;(global as any).Notification = originalNotification
      if (originalWindowNotification) {
        ;(global as any).window.Notification = originalWindowNotification
      }
    })
  })

  describe('Enable Push Notifications', () => {
    beforeEach(() => {
      // Reset mock values instead of redefining properties
      MockNotification.permission = 'default'
      MockNotification.requestPermission = jest
        .fn()
        .mockResolvedValue('granted')

      // Reset mock functions
      jest.clearAllMocks()
      mockServiceWorkerRegistration.pushManager.subscribe.mockClear()
      mockServiceWorkerRegistration.pushManager.getSubscription.mockClear()
      mockPushSubscription.unsubscribe.mockClear()
    })

    it('should successfully enable push notifications', async () => {
      mockServiceWorkerRegistration.pushManager.subscribe.mockResolvedValue(
        mockPushSubscription
      )
      ;(globalThis.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      })

      const result = await enablePushNotifications()

      expect(result.success).toBe(true)
      expect(result.subscription).toBe(mockPushSubscription)

      // Verify service worker registration
      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js', {
        scope: '/',
      })

      // Verify permission request
      expect(globalThis.Notification.requestPermission).toHaveBeenCalled()

      // Verify push subscription
      expect(
        mockServiceWorkerRegistration.pushManager.subscribe
      ).toHaveBeenCalledWith({
        userVisibleOnly: true,
        applicationServerKey: expect.any(Uint8Array),
      })

      // Verify API call to save subscription
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining(
          'https://fcm.googleapis.com/fcm/send/test123'
        ),
      })
    })

    it('should handle permission denied', async () => {
      MockNotification.requestPermission.mockResolvedValue('denied')

      const result = await enablePushNotifications()

      expect(result.success).toBe(false)
      expect(result.error).toContain('denied')
    })

    it('should handle service worker registration failure', async () => {
      mockServiceWorker.register.mockRejectedValue(
        new Error('SW registration failed')
      )

      const result = await enablePushNotifications()

      expect(result.success).toBe(false)
      expect(result.error).toContain('Failed to register service worker')
    })

    it('should handle push subscription failure', async () => {
      mockServiceWorkerRegistration.pushManager.subscribe.mockRejectedValue(
        new Error('Push subscription failed')
      )

      const result = await enablePushNotifications()

      expect(result.success).toBe(false)
      expect(result.error).toContain(
        'Failed to subscribe to push notifications'
      )
    })

    it('should handle API save failure', async () => {
      mockServiceWorkerRegistration.pushManager.subscribe.mockResolvedValue(
        mockPushSubscription
      )
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'API Error' }),
      })

      const result = await enablePushNotifications()

      expect(result.success).toBe(false)
      expect(result.error).toContain('API Error')
    })

    it('should handle missing VAPID key', async () => {
      const originalVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY = ''

      const result = await enablePushNotifications()

      expect(result.success).toBe(false)
      expect(result.error).toContain('VAPID public key not configured')

      // Restore for other tests
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY =
        originalVapidKey || 'test-vapid-key'
    })
  })

  describe('Disable Push Notifications', () => {
    it('should successfully disable push notifications', async () => {
      mockServiceWorkerRegistration.pushManager.getSubscription.mockResolvedValue(
        mockPushSubscription
      )
      mockPushSubscription.unsubscribe.mockResolvedValue(true)

      const result = await disablePushNotifications()

      expect(result.success).toBe(true)
      expect(mockPushSubscription.unsubscribe).toHaveBeenCalled()
    })

    it('should handle no existing subscription', async () => {
      mockServiceWorkerRegistration.pushManager.getSubscription.mockResolvedValue(
        null
      )

      const result = await disablePushNotifications()

      expect(result.success).toBe(true) // Still success, already unsubscribed
    })

    it('should handle unsubscribe failure', async () => {
      mockServiceWorkerRegistration.pushManager.getSubscription.mockResolvedValue(
        mockPushSubscription
      )
      mockPushSubscription.unsubscribe.mockResolvedValue(false)

      const result = await disablePushNotifications()

      expect(result.success).toBe(false)
      expect(result.error).toContain('Failed to unsubscribe')
    })
  })

  describe('Get Existing Subscription', () => {
    it('should return existing subscription', async () => {
      mockServiceWorkerRegistration.pushManager.getSubscription.mockResolvedValue(
        mockPushSubscription
      )

      const subscription = await getExistingSubscription()

      expect(subscription).toBe(mockPushSubscription)
    })

    it('should return null when no subscription exists', async () => {
      mockServiceWorkerRegistration.pushManager.getSubscription.mockResolvedValue(
        null
      )

      const subscription = await getExistingSubscription()

      expect(subscription).toBe(null)
    })

    it('should return null when push is not supported', async () => {
      const originalPushManager = global.window.PushManager
      delete (global.window as any).PushManager

      const subscription = await getExistingSubscription()

      expect(subscription).toBe(null)

      global.window.PushManager = originalPushManager
    })

    it('should handle errors gracefully', async () => {
      mockServiceWorkerRegistration.pushManager.getSubscription.mockRejectedValue(
        new Error('Get subscription failed')
      )

      const subscription = await getExistingSubscription()

      expect(subscription).toBe(null)
    })
  })

  describe('VAPID Key Conversion', () => {
    it('should handle base64url conversion correctly', () => {
      // This tests the internal urlBase64ToUint8Array function indirectly
      // by testing the full enablePushNotifications flow
      const testKey = 'BG6HjJDgLHjjZhfx4RvNDdj3_Oe8Y4Q8PVfJ0X7r8uR-QQ'
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY = testKey

      mockServiceWorkerRegistration.pushManager.subscribe.mockResolvedValue(
        mockPushSubscription
      )

      return enablePushNotifications().then(() => {
        expect(
          mockServiceWorkerRegistration.pushManager.subscribe
        ).toHaveBeenCalledWith({
          userVisibleOnly: true,
          applicationServerKey: expect.any(Uint8Array),
        })
      })
    })
  })
})
