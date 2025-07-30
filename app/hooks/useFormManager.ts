/**
 * Custom hook for stable form state management with mobile keyboard optimization
 *
 * This hook provides a robust form management system that prevents keyboard
 * dismissal issues common in mobile React applications.
 */

import { useCallback, useRef, useState } from 'react'

export interface FormFieldState {
  value: string
  touched: boolean
  error?: string
}

export interface FormState {
  [key: string]: FormFieldState
}

export interface UseFormManagerOptions {
  initialValues: Record<string, string>
  enableMobileOptimizations?: boolean
  onSubmit?: (values: Record<string, string>) => void | Promise<void>
  validate?: (values: Record<string, string>) => Record<string, string>
}

export interface UseFormManagerReturn {
  values: Record<string, string>
  touched: Record<string, boolean>
  errors: Record<string, string>
  isSubmitting: boolean

  // Field management
  setValue: (name: string, value: string) => void
  setFieldError: (name: string, error: string) => void
  setFieldTouched: (name: string, touched: boolean) => void

  // Form operations
  handleSubmit: (e: React.FormEvent) => void
  resetForm: () => void

  // Mobile optimization
  registerField: (name: string) => (ref: HTMLElement | null) => void
  handleFieldFocus: (name: string) => void
  handleFieldBlur: (name: string) => void
}

/**
 * Custom hook for managing form state with mobile keyboard stability
 */
export const useFormManager = ({
  initialValues,
  enableMobileOptimizations = true,
  onSubmit,
  validate,
}: UseFormManagerOptions): UseFormManagerReturn => {
  const [formState, setFormState] = useState<FormState>(() => {
    const state: FormState = {}
    Object.keys(initialValues).forEach((key) => {
      state[key] = {
        value: initialValues[key] || '',
        touched: false,
        error: undefined,
      }
    })
    return state
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({})
  const currentField = useRef<string | null>(null)

  // Extract values, touched, and errors for easy access
  const values = Object.keys(formState).reduce(
    (acc, key) => {
      acc[key] = formState[key].value
      return acc
    },
    {} as Record<string, string>
  )

  const touched = Object.keys(formState).reduce(
    (acc, key) => {
      acc[key] = formState[key].touched
      return acc
    },
    {} as Record<string, boolean>
  )

  const errors = Object.keys(formState).reduce(
    (acc, key) => {
      if (formState[key].error) {
        acc[key] = formState[key].error
      }
      return acc
    },
    {} as Record<string, string>
  )

  /**
   * Update a field value with mobile keyboard protection
   */
  const setValue = useCallback((name: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        error: undefined, // Clear error when user types
      },
    }))
  }, [])

  /**
   * Set field error
   */
  const setFieldError = useCallback((name: string, error: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        error,
      },
    }))
  }, [])

  /**
   * Set field touched state
   */
  const setFieldTouched = useCallback((name: string, touched: boolean) => {
    setFormState((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched,
      },
    }))
  }, [])

  /**
   * Register a field ref for mobile optimizations
   */
  const registerField = useCallback((name: string) => {
    return (ref: HTMLElement | null) => {
      if (ref) {
        fieldRefs.current[name] = ref
      }
    }
  }, [])

  /**
   * Handle field focus with mobile optimizations
   */
  const handleFieldFocus = useCallback(
    (name: string) => {
      currentField.current = name

      if (enableMobileOptimizations) {
        const field = fieldRefs.current[name]
        if (field) {
          // Smooth scroll to field if needed
          setTimeout(() => {
            field.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
          }, 100)
        }
      }
    },
    [enableMobileOptimizations]
  )

  /**
   * Handle field blur
   */
  const handleFieldBlur = useCallback(
    (name: string) => {
      setFieldTouched(name, true)
      currentField.current = null

      // Run validation if provided
      if (validate) {
        const validationErrors = validate(values)
        if (validationErrors[name]) {
          setFieldError(name, validationErrors[name])
        }
      }
    },
    [validate, values, setFieldTouched, setFieldError]
  )

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (isSubmitting) return

      setIsSubmitting(true)

      try {
        // Mark all fields as touched
        Object.keys(formState).forEach((key) => {
          setFieldTouched(key, true)
        })

        // Run validation
        if (validate) {
          const validationErrors = validate(values)
          const hasErrors = Object.keys(validationErrors).length > 0

          if (hasErrors) {
            Object.keys(validationErrors).forEach((key) => {
              setFieldError(key, validationErrors[key])
            })
            return
          }
        }

        // Submit if onSubmit provided
        if (onSubmit) {
          await onSubmit(values)
        }
      } catch (error) {
        console.error('Form submission error:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [
      formState,
      values,
      validate,
      onSubmit,
      isSubmitting,
      setFieldTouched,
      setFieldError,
    ]
  )

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormState(() => {
      const state: FormState = {}
      Object.keys(initialValues).forEach((key) => {
        state[key] = {
          value: initialValues[key] || '',
          touched: false,
          error: undefined,
        }
      })
      return state
    })
    setIsSubmitting(false)
    currentField.current = null
  }, [initialValues])

  return {
    values,
    touched,
    errors,
    isSubmitting,
    setValue,
    setFieldError,
    setFieldTouched,
    handleSubmit,
    resetForm,
    registerField,
    handleFieldFocus,
    handleFieldBlur,
  }
}

export default useFormManager
