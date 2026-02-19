import { type ValidationResult } from './core'

export function formatValidationError(field: string, reason: string): string {
  return `${field}: ${reason}`
}

export function formatAsValidationResponse<T extends Record<string, unknown>>(
  result: ValidationResult<T>
) {
  const fieldErrors = Object.entries(result.errors).flatMap(
    ([field, reasons]) =>
      reasons.map((reason) => formatValidationError(field, reason))
  )

  return {
    error: 'Validation failed',
    message:
      fieldErrors.length > 0
        ? `Validation failed: ${fieldErrors.join('; ')}`
        : 'Validation failed',
    validation: {
      isValid: result.isValid,
      errors: result.errors,
      formErrors: fieldErrors,
    },
  }
}
