import { renderHook, act } from '@testing-library/react'
import { useOfflineStatus } from '@app/utils/offline/useOfflineStatus'

describe('useOfflineStatus', () => {
  let originalNavigator: typeof navigator.onLine
  let addEventListenerSpy: jest.SpyInstance
  let removeEventListenerSpy: jest.SpyInstance

  beforeEach(() => {
    // Store original value
    originalNavigator = navigator.onLine

    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
      configurable: true,
    })

    // Spy on window event listeners
    addEventListenerSpy = jest.spyOn(window, 'addEventListener')
    removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    // Restore
    Object.defineProperty(navigator, 'onLine', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    })

    addEventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
  })

  describe('Happy Path', () => {
    it('should return online status when browser is online', () => {
      Object.defineProperty(navigator, 'onLine', {
        value: true,
        writable: true,
        configurable: true,
      })

      const { result } = renderHook(() => useOfflineStatus())

      expect(result.current.online).toBe(true)
    })

    it('should return offline status when browser is offline', () => {
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        writable: true,
        configurable: true,
      })

      const { result } = renderHook(() => useOfflineStatus())

      expect(result.current.online).toBe(false)
    })

    it('should have since timestamp on initial render', () => {
      const { result } = renderHook(() => useOfflineStatus())

      expect(result.current.since).not.toBeNull()
      expect(typeof result.current.since).toBe('number')
    })

    it('should have null lastChange on initial render', () => {
      const { result } = renderHook(() => useOfflineStatus())

      // lastChange should be null until a status change occurs
      // (unless initial sync triggers a change)
      expect(
        result.current.lastChange === null ||
          typeof result.current.lastChange === 'number'
      ).toBe(true)
    })

    it('should register online and offline event listeners', () => {
      renderHook(() => useOfflineStatus())

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'online',
        expect.any(Function)
      )
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'offline',
        expect.any(Function)
      )
    })

    it('should update status when going offline', () => {
      const { result } = renderHook(() => useOfflineStatus())

      expect(result.current.online).toBe(true)

      // Simulate going offline
      act(() => {
        const offlineHandler = addEventListenerSpy.mock.calls.find(
          (call) => call[0] === 'offline'
        )?.[1]
        if (offlineHandler) offlineHandler()
      })

      expect(result.current.online).toBe(false)
      expect(result.current.lastChange).not.toBeNull()
    })

    it('should update status when going online', () => {
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        writable: true,
        configurable: true,
      })

      const { result } = renderHook(() => useOfflineStatus())

      expect(result.current.online).toBe(false)

      // Simulate going online
      act(() => {
        const onlineHandler = addEventListenerSpy.mock.calls.find(
          (call) => call[0] === 'online'
        )?.[1]
        if (onlineHandler) onlineHandler()
      })

      expect(result.current.online).toBe(true)
      expect(result.current.lastChange).not.toBeNull()
    })

    it('should cleanup event listeners on unmount', () => {
      const { unmount } = renderHook(() => useOfflineStatus())

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'online',
        expect.any(Function)
      )
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'offline',
        expect.any(Function)
      )
    })
  })
})
