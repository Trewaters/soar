import { createValidator, type Validator } from './core'

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function required(fieldName: string): Validator<unknown> {
  return createValidator({
    validate: (value) => {
      if (value === null || value === undefined) {
        return [`${fieldName} is required`]
      }

      if (typeof value === 'string' && value.trim().length === 0) {
        return [`${fieldName} is required`]
      }

      if (Array.isArray(value) && normalizeStringList(value).length === 0) {
        return [`${fieldName} is required`]
      }

      return []
    },
  })
}

export function string(): Validator<string | null | undefined> {
  return createValidator({
    validate: (value) => {
      if (value === null || value === undefined) return []
      return typeof value === 'string' ? [] : ['Must be a string']
    },
  })
}

export function stringArray(): Validator<string[] | null | undefined> {
  return createValidator({
    normalize: (value) => {
      if (value === null || value === undefined) return value
      if (!Array.isArray(value)) return value as any

      return value
        .map((item) =>
          typeof item === 'string' ? item.trim() : (item as unknown)
        )
        .filter(
          (item) => !(typeof item === 'string' && item.length === 0)
        ) as any
    },
    validate: (value) => {
      if (value === null || value === undefined) return []
      if (!Array.isArray(value)) return ['Must be an array of strings']

      const hasNonString = value.some((item) => typeof item !== 'string')
      return hasNonString ? ['Must be an array of strings'] : []
    },
  })
}

export function enumValue(
  allowedValues: string[],
  fieldName: string
): Validator<string | null | undefined> {
  return createValidator({
    validate: (value) => {
      if (value === null || value === undefined || value === '') return []
      return allowedValues.includes(String(value))
        ? []
        : [`${fieldName} must be one of: ${allowedValues.join(', ')}`]
    },
  })
}

export function minLength(min: number, fieldName: string): Validator<unknown> {
  return createValidator({
    validate: (value) => {
      if (value === null || value === undefined) return []

      if (typeof value === 'string') {
        return normalizeString(value).length >= min
          ? []
          : [`${fieldName} must be at least ${min} characters`]
      }

      if (Array.isArray(value)) {
        return value.length >= min
          ? []
          : [`${fieldName} must include at least ${min} item(s)`]
      }

      return []
    },
  })
}

export function maxLength(max: number, fieldName: string): Validator<unknown> {
  return createValidator({
    validate: (value) => {
      if (value === null || value === undefined) return []

      if (typeof value === 'string') {
        return normalizeString(value).length <= max
          ? []
          : [`${fieldName} must be at most ${max} characters`]
      }

      if (Array.isArray(value)) {
        return value.length <= max
          ? []
          : [`${fieldName} must include no more than ${max} item(s)`]
      }

      return []
    },
  })
}

export function uniqueArrayItems(
  fieldName = 'Field'
): Validator<string[] | null | undefined> {
  return createValidator({
    validate: (value) => {
      if (!Array.isArray(value)) return []
      const uniqueCount = new Set(value).size
      return uniqueCount === value.length
        ? []
        : [`${fieldName} contains duplicate values`]
    },
  })
}

export function stringNormalizer(): Validator<string | null | undefined> {
  return createValidator({
    normalize: (value) => {
      if (value === null || value === undefined) return value
      if (typeof value !== 'string') return value as any

      const trimmed = value.trim()
      return trimmed.length > 0 ? trimmed : null
    },
  })
}

export function stringArrayNormalizer(): Validator<
  string[] | null | undefined
> {
  return createValidator({
    normalize: (value) => {
      if (value === null || value === undefined) return value
      if (!Array.isArray(value)) return value as any
      return normalizeStringList(value)
    },
  })
}
