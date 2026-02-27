'use client'
/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import React, {
  forwardRef,
  useRef,
  useCallback,
  useMemo,
  useImperativeHandle,
  FocusEvent,
  ChangeEvent,
} from 'react'
import { TextField, TextFieldProps } from '@mui/material'
import {
  isMobileDevice,
  getMobileInputStyles,
  MOBILE_INPUT_CONFIG,
} from '@app/utils/mobileInputHelpers'

// Enhanced props interface for mobile optimization
export interface TextInputFieldProps extends Omit<TextFieldProps, 'onChange'> {
  // Standard TextField props are inherited

  // Mobile-specific props
  /** Enable mobile-specific optimizations */
  mobileOptimized?: boolean

  /** Custom onChange handler with enhanced typing */
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    value: string
  ) => void

  /** Custom onBlur handler for mobile keyboard management */
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void

  /** Callback for intentional blur (when mobile keyboard should dismiss) */
  onIntentionalBlur?: () => void

  /** Callback for accidental blur (when mobile keyboard should stay open) */
  onAccidentalBlur?: () => void

  /** Prevent keyboard dismissal on mobile devices */
  preventKeyboardDismiss?: boolean
}

// Forward ref type for TextInputField
export type TextInputFieldRef = {
  focus: () => void
  blur: () => void
  getValue: () => string
  setValue: (value: string) => void
}

/**
 * Enhanced TextInputField component optimized for mobile keyboard stability
 * and focus management in the Soar yoga application.
 *
 * Features:
 * - Mobile keyboard dismissal prevention
 * - Stable component rendering to prevent re-mounting
 * - Touch-friendly sizing and styling
 * - Accessibility preservation
 * - Yoga app-specific styling integration
 */
/* eslint-disable react/prop-types */
const TextInputField = React.memo(
  forwardRef<TextInputFieldRef, TextInputFieldProps>(
    (
      {
        mobileOptimized = true,
        onChange,
        onBlur,
        onIntentionalBlur,
        onAccidentalBlur,
        preventKeyboardDismiss = true,
        variant = 'outlined',
        sx,
        ...props
      },
      ref
    ) => {
      const inputRef = useRef<HTMLDivElement>(null)
      const isMobile = useMemo(() => isMobileDevice(), [])

      // Expose methods via ref
      useImperativeHandle(
        ref,
        () => ({
          focus: () => {
            const input = inputRef.current?.querySelector('input, textarea')
            ;(input as HTMLInputElement | HTMLTextAreaElement)?.focus()
          },
          blur: () => {
            const input = inputRef.current?.querySelector('input, textarea')
            ;(input as HTMLInputElement | HTMLTextAreaElement)?.blur()
          },
          getValue: () => {
            const input = inputRef.current?.querySelector('input, textarea') as
              | HTMLInputElement
              | HTMLTextAreaElement
            return input?.value || ''
          },
          setValue: (value: string) => {
            const input = inputRef.current?.querySelector('input, textarea') as
              | HTMLInputElement
              | HTMLTextAreaElement
            if (input) {
              input.value = value
            }
          },
        }),
        []
      )

      // Memoized mobile styles to prevent recreation
      const mobileStyles = useMemo(() => {
        if (!mobileOptimized || !isMobile) return {}
        return getMobileInputStyles(variant)
      }, [mobileOptimized, isMobile, variant])

      // Memoized combined styles
      const combinedStyles = useMemo(() => {
        const soarStyles = {
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: '12px',
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
            {
              borderWidth: '2px',
            },
        }

        return {
          ...soarStyles,
          ...mobileStyles,
          ...sx,
        }
      }, [mobileStyles, sx])

      // Stable onChange handler
      const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const value = event.target.value
          onChange?.(event, value)
        },
        [onChange]
      )

      // Stable onBlur handler with mobile keyboard management
      const handleBlur = useCallback(
        (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          // Only apply mobile keyboard management if explicitly requested and on mobile
          if (isMobile && mobileOptimized && preventKeyboardDismiss) {
            const relatedTarget = event.relatedTarget as HTMLElement

            // Allow blur when moving to another input or button
            if (
              relatedTarget &&
              (relatedTarget.tagName === 'INPUT' ||
                relatedTarget.tagName === 'TEXTAREA' ||
                relatedTarget.tagName === 'BUTTON' ||
                relatedTarget.role === 'button' ||
                relatedTarget.closest('button'))
            ) {
              onIntentionalBlur?.()
              onBlur?.(event)
              return
            }

            // For accidental blur (clicking empty space), call accidental blur handler
            // but don't prevent the blur event - just notify
            onAccidentalBlur?.()
          }

          // Always call the onBlur handler
          onBlur?.(event)
        },
        [
          isMobile,
          mobileOptimized,
          preventKeyboardDismiss,
          onBlur,
          onIntentionalBlur,
          onAccidentalBlur,
        ]
      )

      // Enhanced input props with mobile optimizations
      const inputProps = useMemo(() => {
        const baseProps = props.InputProps || {}

        if (!mobileOptimized || !isMobile) {
          return baseProps
        }

        return {
          ...baseProps,
          style: {
            fontSize: `${MOBILE_INPUT_CONFIG.minFontSize}px`,
            minHeight: `${MOBILE_INPUT_CONFIG.minTouchTarget}px`,
            touchAction: 'manipulation',
            ...baseProps.style,
          },
        }
      }, [props.InputProps, mobileOptimized, isMobile])

      return (
        <TextField
          ref={inputRef}
          variant={variant}
          onChange={handleChange}
          onBlur={handleBlur}
          InputProps={inputProps}
          sx={combinedStyles}
          // Preserve accessibility attributes
          aria-label={
            typeof props['aria-label'] === 'string'
              ? props['aria-label']
              : typeof props.label === 'string'
                ? props.label
                : undefined
          }
          aria-describedby={props['aria-describedby']}
          // Enhanced mobile attributes
          autoComplete={props.autoComplete || 'off'}
          spellCheck={props.spellCheck !== false}
          {...props}
        />
      )
    }
  )
)

TextInputField.displayName = 'TextInputField'

export default TextInputField

/**
 * Hook for using TextInputField with common Soar patterns
 * @param fieldKey - Stable key for the input field
 * @param userId - User ID for personalization
 * @returns Enhanced props and utilities for TextInputField
 */
export function useTextInputField(fieldKey: string, userId?: string) {
  const ref = useRef<TextInputFieldRef>(null)

  const focusField = useCallback(() => {
    ref.current?.focus()
  }, [])

  const blurField = useCallback(() => {
    ref.current?.blur()
  }, [])

  const getValue = useCallback(() => {
    return ref.current?.getValue() || ''
  }, [])

  const setValue = useCallback((value: string) => {
    ref.current?.setValue(value)
  }, [])

  const defaultProps: Partial<TextInputFieldProps> = useMemo(
    () => ({
      fieldKey,
      userId,
      mobileOptimized: true,
      preventKeyboardDismiss: true,
      variant: 'outlined',
    }),
    [fieldKey, userId]
  )

  return {
    ref,
    defaultProps,
    focusField,
    blurField,
    getValue,
    setValue,
  }
}

/**
 * Preset configurations for common Soar input types
 */
export const SOAR_INPUT_PRESETS = {
  profile: {
    mobileOptimized: true,
    preventKeyboardDismiss: true,
    variant: 'outlined' as const,
    fullWidth: true,
  },
  search: {
    mobileOptimized: true,
    preventKeyboardDismiss: false, // Allow keyboard dismiss for search
    variant: 'outlined' as const,
  },
  form: {
    mobileOptimized: true,
    preventKeyboardDismiss: true,
    variant: 'outlined' as const,
    fullWidth: true,
  },
} as const
