/**
 * Mobile Input Helpers - Utilities for handling mobile-specific input behaviors
 * in the Soar yoga application. These utilities help prevent keyboard dismissal
 * and provide better mobile user experience.
 */

/**
 * Detect if the current device is a mobile device
 * @returns boolean indicating if the device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false

  // Check for touch capability and screen size
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const isSmallScreen = window.innerWidth <= 768
  const isMobileUserAgent =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )

  return isTouchDevice && (isSmallScreen || isMobileUserAgent)
}

/**
 * Prevent mobile keyboard dismissal on blur events
 * This function checks if the blur is intentional or accidental
 * @param event - The blur event
 * @param callback - Optional callback to execute if blur should proceed
 * @returns boolean indicating if the blur should be prevented
 */
export function preventMobileKeyboardDismiss(
  event: FocusEvent,
  callback?: () => void
): boolean {
  if (!isMobileDevice()) {
    callback?.()
    return false
  }

  // Check if the blur is caused by clicking on another input element
  const relatedTarget = event.relatedTarget as HTMLElement

  // If focus is moving to another input, allow the blur
  if (
    relatedTarget &&
    (relatedTarget.tagName === 'INPUT' ||
      relatedTarget.tagName === 'TEXTAREA' ||
      relatedTarget.contentEditable === 'true')
  ) {
    callback?.()
    return false
  }

  // Check if blur is caused by clicking on a button or interactive element
  if (
    relatedTarget &&
    (relatedTarget.tagName === 'BUTTON' ||
      relatedTarget.role === 'button' ||
      relatedTarget.onclick !== null ||
      relatedTarget.closest('button'))
  ) {
    callback?.()
    return false
  }

  // For mobile devices, prevent accidental blur by returning focus
  const currentTarget = event.currentTarget as HTMLInputElement
  if (currentTarget && document.activeElement !== currentTarget) {
    currentTarget.focus()
  }

  return true
}

/**
 * Maintain input focus for mobile devices
 * @param inputRef - React ref to the input element
 * @param isActive - Whether the input should maintain focus
 * @returns Cleanup function or undefined
 */
export function maintainInputFocus(
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>,
  isActive: boolean = true
): (() => void) | undefined {
  if (!isMobileDevice() || !isActive || !inputRef.current) return

  const element = inputRef.current

  // Prevent focus loss during virtual keyboard changes
  const handleVisibilityChange = () => {
    if (!document.hidden && element) {
      if (document.activeElement !== element) {
        element.focus()
      }
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Cleanup function - call this when component unmounts
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
}

/**
 * Handle intentional blur events vs accidental ones
 * @param event - The blur event
 * @param onIntentionalBlur - Callback for intentional blur
 * @param onAccidentalBlur - Callback for accidental blur
 */
export function handleIntentionalBlur(
  event: FocusEvent,
  onIntentionalBlur?: () => void,
  onAccidentalBlur?: () => void
): void {
  const isIntentional = !preventMobileKeyboardDismiss(event)

  if (isIntentional) {
    onIntentionalBlur?.()
  } else {
    onAccidentalBlur?.()
  }
}

/**
 * Prevent input zoom on mobile devices by ensuring minimum font size
 * @returns CSS styles object for preventing zoom
 */
export function preventInputZoom(): React.CSSProperties {
  if (!isMobileDevice()) return {}

  return {
    fontSize: '16px', // iOS Safari requires 16px to prevent zoom
    transformOrigin: 'left top',
  }
}

/**
 * Get mobile-optimized styling for input components
 * @param variant - MUI variant type
 * @returns Styling object optimized for mobile
 */
export function getMobileInputStyles(
  variant: 'outlined' | 'filled' | 'standard' = 'outlined'
) {
  if (!isMobileDevice()) return {}

  const baseStyles = {
    ...preventInputZoom(),
    touchAction: 'manipulation', // Disable double-tap zoom
    WebkitTapHighlightColor: 'transparent', // Remove tap highlight
  }

  const variantStyles = {
    outlined: {
      '& .MuiOutlinedInput-root': {
        minHeight: '48px', // Ensure touch-friendly height
        borderRadius: '12px',
        '& input': baseStyles,
        '& textarea': baseStyles,
      },
    },
    filled: {
      '& .MuiFilledInput-root': {
        minHeight: '48px',
        '& input': baseStyles,
        '& textarea': baseStyles,
      },
    },
    standard: {
      '& .MuiInput-root': {
        minHeight: '48px',
        '& input': baseStyles,
        '& textarea': baseStyles,
      },
    },
  }

  return variantStyles[variant]
}

/**
 * Detect if virtual keyboard is open
 * @returns boolean indicating if virtual keyboard is likely open
 */
export function isVirtualKeyboardOpen(): boolean {
  if (typeof window === 'undefined' || !isMobileDevice()) return false

  // Use Visual Viewport API if available
  if ('visualViewport' in window) {
    const viewport = window.visualViewport as VisualViewport
    return viewport.height < window.innerHeight * 0.75
  }

  // Fallback method: check for significant height reduction
  const globalWindow = window as Window & typeof globalThis
  const heightReduction = globalWindow.screen.height - globalWindow.innerHeight
  return heightReduction > globalWindow.screen.height * 0.25
}

/**
 * Handle keyboard appearance and layout changes
 * @param onKeyboardShow - Callback when keyboard shows
 * @param onKeyboardHide - Callback when keyboard hides
 * @returns Cleanup function
 */
export function handleKeyboardAppearance(
  onKeyboardShow?: () => void,
  onKeyboardHide?: () => void
): (() => void) | void {
  if (!isMobileDevice()) return

  let isKeyboardOpen = isVirtualKeyboardOpen()

  const checkKeyboardState = () => {
    const currentKeyboardState = isVirtualKeyboardOpen()

    if (currentKeyboardState !== isKeyboardOpen) {
      isKeyboardOpen = currentKeyboardState

      if (isKeyboardOpen) {
        onKeyboardShow?.()
      } else {
        onKeyboardHide?.()
      }
    }
  }

  // Listen for viewport changes
  if ('visualViewport' in window) {
    window.visualViewport?.addEventListener('resize', checkKeyboardState)

    return () => {
      window.visualViewport?.removeEventListener('resize', checkKeyboardState)
    }
  } else {
    // Fallback for browsers without Visual Viewport API
    const globalWindow = window as Window & typeof globalThis
    globalWindow.addEventListener('resize', checkKeyboardState)

    return () => {
      globalWindow.removeEventListener('resize', checkKeyboardState)
    }
  }
}

/**
 * Create stable key for input components to prevent re-mounting
 * @param baseKey - Base identifier for the field
 * @param userId - Optional user ID for user-specific keys
 * @returns Stable key string
 */
export function createStableInputKey(baseKey: string, userId?: string): string {
  return userId ? `${baseKey}-${userId}` : `${baseKey}-stable`
}

/**
 * Mobile input configuration object with all optimizations
 */
export const MOBILE_INPUT_CONFIG = {
  // Prevent keyboard dismissal
  preventKeyboardDismiss: true,

  // Touch-friendly sizing
  minTouchTarget: 48,

  // Font size to prevent zoom
  minFontSize: 16,

  // Debounce delay for blur events
  blurDebounceMs: 100,

  // Focus retention timeout
  focusRetentionMs: 150,
} as const

export type MobileInputConfig = typeof MOBILE_INPUT_CONFIG
