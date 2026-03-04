'use client'
import React, { forwardRef, useMemo } from 'react'
import {
  Button,
  ButtonProps,
  CircularProgress,
  alpha,
  useTheme,
} from '@mui/material'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

export interface NavigationButtonProps extends Omit<ButtonProps, 'onClick'> {
  href?: string
  elementId?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  navigateOptions?: {
    replace?: boolean
    shallow?: boolean
    scroll?: boolean
  }
  loadingText?: string
  preventMultipleTaps?: boolean
  showSpinner?: boolean
}

/**
 * Enhanced Button component with built-in navigation loading states.
 * Provides immediate visual feedback to prevent multiple taps on mobile devices.
 *
 * Features:
 * - Immediate visual feedback on tap/click
 * - Prevents multiple rapid taps
 * - Shows loading spinner during navigation
 * - Mobile-optimized touch feedback
 * - Maintains accessibility standards
 */
const NavigationButton = forwardRef<HTMLButtonElement, NavigationButtonProps>(
  (
    {
      href,
      elementId,
      onClick,
      navigateOptions = {},
      loadingText,
      preventMultipleTaps = true,
      showSpinner = true,
      children,
      disabled,
      variant = 'contained',
      sx = {},
      startIcon,
      endIcon,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const navigation = useNavigationWithLoading()

    // Generate unique element ID if not provided
    const uniqueElementId = useMemo(() => {
      return (
        elementId ||
        `nav-btn-${href || 'custom'}-${Math.random().toString(36).substr(2, 9)}`
      )
    }, [elementId, href])

    // Check if this specific button is loading
    const isThisButtonLoading = navigation.isElementLoading(uniqueElementId)
    const isGloballyNavigating = navigation.isNavigating

    // Determine if button should be disabled
    const isDisabled = disabled || (preventMultipleTaps && isGloballyNavigating)

    // Handle click events
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Prevent multiple rapid clicks
      if (isDisabled) {
        event.preventDefault()
        return
      }

      // If href is provided, handle navigation
      if (href) {
        event.preventDefault()
        navigation.push(href, uniqueElementId, navigateOptions)
        return
      }

      // Otherwise, call custom onClick handler
      if (onClick) {
        onClick(event)
      }
    }

    // Enhanced styling with loading states
    const enhancedSx = {
      // Base mobile-optimized touch styling
      minHeight: 48, // Minimum touch target size
      minWidth: 48,
      transition: theme.transitions.create(
        ['background-color', 'box-shadow', 'border-color', 'transform'],
        {
          duration: theme.transitions.duration.short,
        }
      ),

      // Loading state styling
      ...(isThisButtonLoading && {
        backgroundColor:
          variant === 'contained'
            ? alpha(theme.palette.primary.main, 0.8)
            : 'transparent',
        color:
          variant === 'contained'
            ? theme.palette.primary.contrastText
            : alpha(theme.palette.primary.main, 0.8),
        transform: 'scale(0.98)', // Slight scale down for visual feedback
        boxShadow: variant === 'contained' ? theme.shadows[1] : 'none',
      }),

      // Enhanced focus styles for accessibility
      '&:focus-visible': {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: '2px',
      },

      // Active/pressed state for touch feedback
      '&:active': {
        transform: 'scale(0.96)',
        transition: theme.transitions.create('transform', {
          duration: 100,
        }),
      },

      // Disabled state with visual clarity
      '&.Mui-disabled': {
        opacity: isGloballyNavigating ? 0.7 : 0.5,
        cursor: isGloballyNavigating ? 'wait' : 'not-allowed',
      },

      // Custom styles override
      ...sx,
    }

    // Determine content to display
    const buttonContent =
      isThisButtonLoading && loadingText ? loadingText : children

    // Determine icons to display
    const displayStartIcon =
      isThisButtonLoading && showSpinner ? (
        <CircularProgress
          size={16}
          color="inherit"
          sx={{
            mr: 1,
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': {
                transform: 'rotate(0deg)',
              },
              '100%': {
                transform: 'rotate(360deg)',
              },
            },
          }}
        />
      ) : (
        startIcon
      )

    const displayEndIcon = isThisButtonLoading ? undefined : endIcon

    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        onClick={handleClick}
        variant={variant}
        sx={enhancedSx}
        startIcon={displayStartIcon}
        endIcon={displayEndIcon}
        aria-label={
          props['aria-label'] ||
          (isThisButtonLoading
            ? `Loading: ${buttonContent}`
            : `Navigate to ${href || 'page'}`)
        }
        aria-pressed={isThisButtonLoading}
        {...props}
      >
        {buttonContent}
      </Button>
    )
  }
)

NavigationButton.displayName = 'NavigationButton'

export default NavigationButton
