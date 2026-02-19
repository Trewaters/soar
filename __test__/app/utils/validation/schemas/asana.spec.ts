import {
  AsanaCreatePayloadValidator,
  AsanaUpdatePayloadValidator,
} from '@app/utils/validation/schemas/asana'

describe('validation/schemas/asana', () => {
  const validCreatePayload = {
    sort_english_name: ' Warrior II ',
    english_names: [' Warrior II ', 'Virabhadrasana II'],
    alternative_english_names: [' Strong Warrior ', ' '],
    sanskrit_names: [' Virabhadrasana II '],
    description: '  A standing pose  ',
    category: 'Standing',
    difficulty: 'Easy',
    dristi: 'Front hand',
    setup_cues: ' Ground through feet ',
    deepening_cues: ' Extend arms ',
    breath: [' inhale ', ' exhale ', ' '],
  }

  describe('create validator', () => {
    it('accepts valid create payload and normalizes strings/arrays', () => {
      const result = AsanaCreatePayloadValidator.validate(validCreatePayload)

      expect(result.isValid).toBe(true)
      expect(result.normalizedData.sort_english_name).toBe('Warrior II')
      expect(result.normalizedData.english_names).toEqual([
        'Warrior II',
        'Virabhadrasana II',
      ])
      expect(result.normalizedData.alternative_english_names).toEqual([
        'Strong Warrior',
      ])
      expect(result.normalizedData.breath).toEqual(['inhale', 'exhale'])
    })

    it('fails when required create fields are missing/invalid', () => {
      const result = AsanaCreatePayloadValidator.validate({
        sort_english_name: ' ',
        english_names: [],
        difficulty: 'Hard',
      })

      expect(result.isValid).toBe(false)
      expect(result.errors.sort_english_name).toBeDefined()
      expect(result.errors.english_names).toBeDefined()
      expect(result.errors.category).toBeDefined()
      expect(result.errors.difficulty).toBeDefined()
    })

    it('rejects non-string array members', () => {
      const result = AsanaCreatePayloadValidator.validate({
        ...validCreatePayload,
        english_names: ['Warrior', 123],
      })

      expect(result.isValid).toBe(false)
      expect(result.errors.english_names).toContain(
        'Must be an array of strings'
      )
    })

    it('normalizes optional empty strings to null', () => {
      const result = AsanaCreatePayloadValidator.validate({
        ...validCreatePayload,
        description: ' ',
        dristi: ' ',
      })

      expect(result.isValid).toBe(true)
      expect(result.normalizedData.description).toBeNull()
      expect(result.normalizedData.dristi).toBeNull()
    })
  })

  describe('update validator', () => {
    it('allows partial updates with only provided fields', () => {
      const result = AsanaUpdatePayloadValidator.validate({
        sort_english_name: '  Chair Pose ',
      })

      expect(result.isValid).toBe(true)
      expect(result.normalizedData).toEqual({ sort_english_name: 'Chair Pose' })
    })

    it('treats category and difficulty as optional on update', () => {
      const result = AsanaUpdatePayloadValidator.validate({
        english_names: ['Chair Pose'],
      })

      expect(result.isValid).toBe(true)
      expect(result.errors.category).toBeUndefined()
      expect(result.errors.difficulty).toBeUndefined()
    })

    it('fails invalid enum and invalid field types on update', () => {
      const result = AsanaUpdatePayloadValidator.validate({
        difficulty: 'expert',
        english_names: ['ok', 42],
      })

      expect(result.isValid).toBe(false)
      expect(result.errors.difficulty).toBeDefined()
      expect(result.errors.english_names).toBeDefined()
    })

    it('normalizes string arrays by trimming and removing empty values', () => {
      const result = AsanaUpdatePayloadValidator.validate({
        breath: [' inhale ', ' ', 'exhale  '],
      })

      expect(result.isValid).toBe(true)
      expect(result.normalizedData.breath).toEqual(['inhale', 'exhale'])
    })
  })
})
