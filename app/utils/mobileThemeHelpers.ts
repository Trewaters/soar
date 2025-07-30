/**
 * Mobile Theme Helpers for Soar Yoga Application
 *
 * Provides theme utilities specifically optimized for mobile devices
 * to prevent input zoom and improve mobile user experience.
 */

import { SxProps, Theme } from '@mui/material/styles'
import { isMobileDevice } from './mobileInputHelpers'

/**
 * Mobile-optimized input styling that prevents iOS zoom
 * and improves touch interaction
 */
export const getMobileInputTheme = (): SxProps<Theme> => ({
  '& .MuiInputBase-root': {
    fontSize: '16px', // Prevents iOS zoom
    borderRadius: '12px',
    boxShadow: '0 4px 4px 0 #CBCBCB',
    minHeight: '48px', // Minimum touch target size

    // Enhanced touch targets for mobile
    ...(isMobileDevice() && {
      padding: '12px 16px',
      fontSize: '16px',
      lineHeight: '1.5',
    }),
  },

  '& .MuiInputBase-input': {
    fontSize: '16px', // Critical for preventing zoom
    padding: '12px 16px',

    // Mobile-specific optimizations
    ...(isMobileDevice() && {
      fontSize: '16px !important',
      WebkitAppearance: 'none',
      WebkitTextSizeAdjust: '100%',
    }),
  },

  '& .MuiFormLabel-root': {
    fontSize: '16px',

    // Larger labels for mobile readability
    ...(isMobileDevice() && {
      fontSize: '18px',
      fontWeight: 500,
    }),
  },

  // Focused state optimizations
  '& .MuiInputBase-root.Mui-focused': {
    '& .MuiInputBase-input': {
      fontSize: '16px !important', // Maintains size when focused
    },
  },
})

/**
 * Mobile-optimized button styling for better touch interaction
 */
export const getMobileButtonTheme = (): SxProps<Theme> => ({
  minHeight: '48px', // WCAG minimum touch target
  minWidth: '48px',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: 600,

  // Enhanced for mobile devices
  ...(isMobileDevice() && {
    padding: '14px 20px',
    fontSize: '18px',
    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',

    '&:active': {
      transform: 'translateY(1px)',
      boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.25)',
    },
  }),
})

/**
 * Mobile-optimized form container styling
 */
export const getMobileFormContainerTheme = (): SxProps<Theme> => ({
  // Prevent viewport jumping on iOS
  ...(isMobileDevice() && {
    paddingBottom: '20px', // Extra space for virtual keyboard
    minHeight: 'calc(100vh - 200px)', // Account for keyboard
  }),
})

/**
 * Mobile-optimized modal/dialog styling
 */
export const getMobileModalTheme = (): SxProps<Theme> => ({
  '& .MuiDialog-paper': {
    // Full-screen on small devices
    ...(isMobileDevice() && {
      margin: '8px',
      maxHeight: 'calc(100% - 16px)',
      maxWidth: 'calc(100% - 16px)',
      borderRadius: '12px',
    }),
  },
})

/**
 * Global mobile theme enhancements
 */
export const getMobileGlobalTheme = () => ({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          // Prevent zoom on iOS
          '& input': {
            fontSize: '16px !important',
            WebkitAppearance: 'none',
          },
          '& textarea': {
            fontSize: '16px !important',
            WebkitAppearance: 'none',
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          // Enhanced touch targets
          minHeight: '48px',
          minWidth: '48px',

          // Mobile-specific enhancements
          ...(isMobileDevice() && {
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '12px',
          }),
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          // WCAG AA compliant touch targets
          minHeight: '48px',
          minWidth: '48px',
          padding: '12px',
        },
      },
    },
  },
})

/**
 * Helper to check if device needs mobile optimizations
 */
export const shouldUseMobileTheme = (): boolean => {
  if (typeof window === 'undefined') return false
  return isMobileDevice() || window.innerWidth <= 768
}

/**
 * Responsive typography that prevents zoom issues
 */
export const getMobileTypographyTheme = () => ({
  typography: {
    // Ensure all text is 16px+ on mobile to prevent zoom
    body1: {
      fontSize: '16px',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '16px',
      lineHeight: 1.4,
    },
    caption: {
      fontSize: '14px', // Small text that won't trigger zoom
    },

    // Form-specific typography
    h6: {
      fontSize: '18px', // Good for form labels
      fontWeight: 600,
    },
  },
})

const mobileThemeHelpers = {
  getMobileInputTheme,
  getMobileButtonTheme,
  getMobileFormContainerTheme,
  getMobileModalTheme,
  getMobileGlobalTheme,
  getMobileTypographyTheme,
  shouldUseMobileTheme,
}

export default mobileThemeHelpers
