export type ValidationErrors = Record<string, string[]>

export type FieldValidationResult<T = unknown> = {
  isValid: boolean
  errors: string[]
  normalizedValue: T
}

// TypeScript requires a parameter identifier in function type syntax.
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export type UnaryFunction<Input, Output> = (input: Input) => Output

export type Validator<T = unknown> = UnaryFunction<
  unknown,
  FieldValidationResult<T>
>

export type ValidationSchema<T extends Record<string, unknown>> = {
  [K in keyof T]?: Validator<T[K]>
}

export type ValidationResult<T extends Record<string, unknown>> = {
  isValid: boolean
  errors: ValidationErrors
  normalizedData: T
}

export function createValidator<T = unknown>(options: {
  validate?: UnaryFunction<unknown, string[]>
  normalize?: UnaryFunction<unknown, T>
}): Validator<T> {
  return (value: unknown) => {
    const normalizedValue = options.normalize
      ? options.normalize(value)
      : (value as T)
    const errors = options.validate ? options.validate(normalizedValue) : []

    return {
      isValid: errors.length === 0,
      errors,
      normalizedValue,
    }
  }
}

export function composeValidators<T = unknown>(
  ...validators: Array<Validator<T>>
): Validator<T> {
  return (initialValue: unknown) => {
    let currentValue = initialValue as T
    const errors: string[] = []

    for (const validator of validators) {
      const result = validator(currentValue)
      currentValue = result.normalizedValue

      if (!result.isValid) {
        errors.push(...result.errors)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      normalizedValue: currentValue,
    }
  }
}

export function validateObject<T extends Record<string, unknown>>(
  data: Record<string, unknown>,
  schema: ValidationSchema<T>
): ValidationResult<T> {
  const errors: ValidationErrors = {}
  const normalizedData = { ...data } as T

  for (const [field, validator] of Object.entries(schema)) {
    if (!validator) continue
    const result = validator(data[field])

    normalizedData[field as keyof T] = result.normalizedValue as T[keyof T]

    if (!result.isValid) {
      errors[field] = result.errors
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: normalizeValidationErrors(errors),
    normalizedData,
  }
}

export function normalizeValidationErrors(
  errors: ValidationErrors
): ValidationErrors {
  return Object.entries(errors).reduce<ValidationErrors>(
    (acc, [field, messages]) => {
      const normalizedMessages = messages.filter(Boolean)

      if (normalizedMessages.length > 0) {
        acc[field] = normalizedMessages
      }

      return acc
    },
    {}
  )
}
