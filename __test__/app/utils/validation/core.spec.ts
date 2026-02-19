import {
  composeValidators,
  createValidator,
  normalizeValidationErrors,
  validateObject,
  type ValidationResult,
} from '@app/utils/validation/core'

describe('validation/core', () => {
  describe('ValidationResult structure', () => {
    it('contains expected keys', () => {
      const result: ValidationResult<{ name: string }> = {
        isValid: true,
        errors: {},
        normalizedData: { name: 'Tree' },
      }

      expect(result).toEqual({
        isValid: true,
        errors: {},
        normalizedData: { name: 'Tree' },
      })
    })
  })

  describe('createValidator', () => {
    it('returns a functioning validator', () => {
      const validator = createValidator<string>({
        normalize: (value) => String(value).trim(),
        validate: (value) => (String(value).length > 0 ? [] : ['Required']),
      })

      expect(validator('  ok ').isValid).toBe(true)
      expect(validator('   ').isValid).toBe(false)
    })
  })

  describe('composeValidators', () => {
    const trim = createValidator<string>({
      normalize: (value) => String(value).trim(),
    })

    const required = createValidator<string>({
      validate: (value) => (String(value).length > 0 ? [] : ['Required']),
    })

    const max5 = createValidator<string>({
      validate: (value) => (String(value).length <= 5 ? [] : ['Too long']),
    })

    it('passes when all validators pass', () => {
      const validator = composeValidators(trim, required, max5)
      expect(validator(' pose ').isValid).toBe(true)
    })

    it('returns partial failures when one validator fails', () => {
      const validator = composeValidators(trim, required, max5)
      const result = validator('       ')

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Required')
    })

    it('returns all failures when multiple validators fail', () => {
      const validator = composeValidators(required, max5)
      const result = validator('toolongname')

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Too long')
    })
  })

  describe('validateObject', () => {
    it('applies field validators and aggregates errors by field', () => {
      const requiredString = createValidator<string>({
        normalize: (value) => String(value ?? '').trim(),
        validate: (value) => (String(value).length > 0 ? [] : ['Required']),
      })

      const result = validateObject(
        { name: ' Tree ', category: ' ' },
        {
          name: requiredString,
          category: requiredString,
        }
      )

      expect(result.isValid).toBe(false)
      expect(result.errors.category).toEqual(['Required'])
      expect(result.normalizedData.name).toBe('Tree')
    })
  })

  describe('normalizeValidationErrors', () => {
    it('removes empty messages and keeps consistent format', () => {
      const normalized = normalizeValidationErrors({
        name: ['Required', ''],
        category: [],
      })

      expect(normalized).toEqual({
        name: ['Required'],
      })
    })
  })
})
