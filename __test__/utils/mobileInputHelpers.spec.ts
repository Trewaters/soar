/**
 * @jest-environment jsdom
 */

import {
  isMobileDevice,
  preventMobileKeyboardDismiss,
  getMobileInputStyles,
} from '@app/utils/mobileInputHelpers'

// Mock window and navigator objects
const mockNavigator = {
  userAgent: '',
  maxTouchPoints: 0,
}

const mockWindow = {
  screen: { width: 1024 },
  innerWidth: 1024,
  ontouchstart: undefined as any,
}

Object.defineProperty(global, 'navigator', {
  value: mockNavigator,
  writable: true,
})

Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true,
})

// Mock setTimeout
global.setTimeout = jest.fn((fn) => {
  fn()
  return 1 as any
}) as any

describe('Mobile Input Helpers', () => {
  beforeEach(() => {
    // Reset mocks
    mockNavigator.userAgent = ''
    mockNavigator.maxTouchPoints = 0
    mockWindow.innerWidth = 1024
    mockWindow.ontouchstart = undefined
  })

  describe('isMobileDevice', () => {
    it('should return false for desktop user agents', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      expect(isMobileDevice()).toBe(false)
    })

    it('should return true for iPhone user agents with small screen', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
      mockWindow.innerWidth = 400
      mockWindow.ontouchstart = null
      expect(isMobileDevice()).toBe(true)
    })

    it('should return true for Android user agents with touch support', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36'
      mockNavigator.maxTouchPoints = 2
      mockWindow.innerWidth = 600
      expect(isMobileDevice()).toBe(true)
    })

    it('should return false for desktop with large screen and no touch', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      mockWindow.innerWidth = 1200
      mockNavigator.maxTouchPoints = 0
      expect(isMobileDevice()).toBe(false)
    })
  })

  describe('preventMobileKeyboardDismiss', () => {
    let mockEvent: FocusEvent
    let mockInput: HTMLInputElement

    beforeEach(() => {
      // Create a mock input element that can receive focus
      mockInput = document.createElement('input')
      document.body.appendChild(mockInput)

      mockEvent = new FocusEvent('blur', {
        relatedTarget: null,
        bubbles: true,
        cancelable: true,
      })

      // Mock the currentTarget to be our input
      Object.defineProperty(mockEvent, 'currentTarget', {
        value: mockInput,
        writable: true,
      })

      // Mock focus method
      mockInput.focus = jest.fn()
    })

    afterEach(() => {
      document.body.removeChild(mockInput)
    })

    it('should return false on desktop devices', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

      const callback = jest.fn()
      const result = preventMobileKeyboardDismiss(mockEvent, callback)

      expect(result).toBe(false)
      expect(callback).toHaveBeenCalled()
    })

    it('should return true when no related target on mobile', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
      mockWindow.innerWidth = 400
      mockWindow.ontouchstart = null

      const result = preventMobileKeyboardDismiss(mockEvent)

      expect(result).toBe(true)
      // Focus is restored immediately without setTimeout
      expect(mockInput.focus).toHaveBeenCalled()
    })

    it('should allow blur when related target exists on mobile', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
      mockWindow.innerWidth = 400
      mockWindow.ontouchstart = null

      const relatedTarget = document.createElement('button')
      const eventWithTarget = new FocusEvent('blur', {
        relatedTarget,
        bubbles: true,
        cancelable: true,
      })

      Object.defineProperty(eventWithTarget, 'currentTarget', {
        value: mockInput,
        writable: true,
      })

      const callback = jest.fn()
      const result = preventMobileKeyboardDismiss(eventWithTarget, callback)

      expect(result).toBe(false)
      expect(callback).toHaveBeenCalled()
    })
  })

  describe('getMobileInputStyles', () => {
    it('should return mobile-optimized styles on mobile devices', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
      mockWindow.innerWidth = 400
      mockWindow.ontouchstart = null

      const styles = getMobileInputStyles() as any

      // Check that the styles object exists and has the expected structure
      expect(styles).toBeDefined()
      expect(typeof styles).toBe('object')

      // Check for the MUI class structure
      const muiClass = '& .MuiOutlinedInput-root'
      expect(styles[muiClass]).toBeDefined()
      expect(styles[muiClass].minHeight).toBe('48px')
      expect(styles[muiClass].borderRadius).toBe('12px')
      expect(styles[muiClass]['& input'].fontSize).toBe('16px')
      expect(styles[muiClass]['& input'].touchAction).toBe('manipulation')
    })

    it('should return standard styles on desktop', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

      const styles = getMobileInputStyles()

      expect(styles).toEqual({})
    })
  })
})

describe('Integration Tests', () => {
  it('should work together for complete mobile optimization', () => {
    // Set up mobile environment
    mockNavigator.userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
    mockNavigator.maxTouchPoints = 5
    mockWindow.innerWidth = 400
    mockWindow.ontouchstart = null

    // Test device detection
    expect(isMobileDevice()).toBe(true)

    // Test style generation
    const styles = getMobileInputStyles() as any
    expect(styles['& .MuiOutlinedInput-root']['& input'].fontSize).toBe('16px')
    expect(styles['& .MuiOutlinedInput-root'].minHeight).toBe('48px')

    // Test event handling
    const mockInput = document.createElement('input')
    mockInput.focus = jest.fn()
    document.body.appendChild(mockInput)

    const blurEvent = new FocusEvent('blur', { relatedTarget: null })
    Object.defineProperty(blurEvent, 'currentTarget', {
      value: mockInput,
      writable: true,
    })

    const shouldPrevent = preventMobileKeyboardDismiss(blurEvent)
    expect(shouldPrevent).toBe(true)
    // Focus is restored immediately without setTimeout
    expect(mockInput.focus).toHaveBeenCalled()

    document.body.removeChild(mockInput)
  })
})
