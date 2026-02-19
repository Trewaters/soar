import {
  enumValue,
  maxLength,
  minLength,
  required,
  string,
  stringArray,
  stringArrayNormalizer,
  stringNormalizer,
  uniqueArrayItems,
} from '@app/utils/validation/rules'

describe('validation/rules', () => {
  describe('required', () => {
    it('passes non-empty strings and arrays', () => {
      expect(required('name')('Tree').isValid).toBe(true)
      expect(required('names')(['A', 'B']).isValid).toBe(true)
    })

    it('fails empty, null, and undefined values', () => {
      expect(required('name')('').isValid).toBe(false)
      expect(required('name')('   ').isValid).toBe(false)
      expect(required('name')(null).isValid).toBe(false)
      expect(required('name')(undefined).isValid).toBe(false)
      expect(required('names')([]).isValid).toBe(false)
    })
  })

  describe('string', () => {
    it('passes string values', () => {
      expect(string()('asana').isValid).toBe(true)
    })

    it('fails non-string values', () => {
      expect(string()(123).isValid).toBe(false)
      expect(string()([]).isValid).toBe(false)
      expect(string()({}).isValid).toBe(false)
    })
  })

  describe('stringArray', () => {
    it('passes arrays of strings and normalizes entries', () => {
      const result = stringArray()(['  one ', ' two', '   '])
      expect(result.isValid).toBe(true)
      expect(result.normalizedValue).toEqual(['one', 'two'])
    })

    it('fails for non-array or non-string members', () => {
      expect(stringArray()('not-array').isValid).toBe(false)
      expect(stringArray()(['ok', 2 as any]).isValid).toBe(false)
    })
  })

  describe('enumValue', () => {
    const validator = enumValue(['Easy', 'Average', 'Difficult'], 'difficulty')

    it('passes allowed values', () => {
      expect(validator('Easy').isValid).toBe(true)
    })

    it('fails disallowed and mixed-case values', () => {
      expect(validator('easy').isValid).toBe(false)
      expect(validator('Hard').isValid).toBe(false)
    })
  })

  describe('minLength and maxLength', () => {
    it('validates string lengths', () => {
      expect(minLength(2, 'field')('ab').isValid).toBe(true)
      expect(minLength(2, 'field')('a').isValid).toBe(false)
      expect(maxLength(3, 'field')('abc').isValid).toBe(true)
      expect(maxLength(3, 'field')('abcd').isValid).toBe(false)
    })

    it('validates array lengths', () => {
      expect(minLength(2, 'list')(['a', 'b']).isValid).toBe(true)
      expect(minLength(2, 'list')(['a']).isValid).toBe(false)
      expect(maxLength(2, 'list')(['a', 'b']).isValid).toBe(true)
      expect(maxLength(2, 'list')(['a', 'b', 'c']).isValid).toBe(false)
    })
  })

  describe('uniqueArrayItems', () => {
    it('passes unique arrays and fails duplicates', () => {
      expect(uniqueArrayItems('names')(['a', 'b']).isValid).toBe(true)
      expect(uniqueArrayItems('names')(['a', 'a']).isValid).toBe(false)
    })
  })

  describe('normalizers', () => {
    it('stringNormalizer trims strings and converts empty to null', () => {
      expect(stringNormalizer()('  pose ').normalizedValue).toBe('pose')
      expect(stringNormalizer()('   ').normalizedValue).toBeNull()
    })

    it('stringArrayNormalizer trims values and removes empty entries', () => {
      const result = stringArrayNormalizer()(['  one', ' ', 'two  '])
      expect(result.normalizedValue).toEqual(['one', 'two'])
    })
  })
})
