import {
  composeValidators,
  type ValidationResult,
  type ValidationSchema,
  validateObject,
} from '../core'
import {
  enumValue,
  minLength,
  required,
  string,
  stringArray,
  stringArrayNormalizer,
  stringNormalizer,
  uniqueArrayItems,
} from '../rules'

const ASANA_DIFFICULTIES = ['Easy', 'Average', 'Difficult']

export type AsanaCreatePayload = {
  sort_english_name: string
  english_names: string[]
  alternative_english_names?: string[]
  sanskrit_names?: string[]
  description?: string | null
  category: string
  difficulty: string
  dristi?: string | null
  setup_cues?: string | null
  deepening_cues?: string | null
  breath?: string[]
}

export type AsanaUpdatePayload = Partial<AsanaCreatePayload>

function createAsanaSchema(
  isCreate: boolean
): ValidationSchema<Record<string, unknown>> {
  return {
    sort_english_name: composeValidators(
      stringNormalizer(),
      string(),
      required('sort_english_name'),
      minLength(1, 'sort_english_name')
    ),
    english_names: composeValidators(
      stringArray(),
      stringArrayNormalizer(),
      ...(isCreate ? [required('english_names')] : []),
      minLength(1, 'english_names'),
      uniqueArrayItems('english_names')
    ),
    alternative_english_names: composeValidators(
      stringArray(),
      stringArrayNormalizer(),
      uniqueArrayItems('alternative_english_names')
    ),
    sanskrit_names: composeValidators(
      stringArray(),
      stringArrayNormalizer(),
      uniqueArrayItems('sanskrit_names')
    ),
    description: composeValidators(stringNormalizer(), string()),
    category: composeValidators(
      stringNormalizer(),
      string(),
      required('category'),
      minLength(1, 'category')
    ),
    difficulty: composeValidators(
      stringNormalizer(),
      string(),
      required('difficulty'),
      enumValue(ASANA_DIFFICULTIES, 'difficulty')
    ),
    dristi: composeValidators(stringNormalizer(), string()),
    setup_cues: composeValidators(stringNormalizer(), string()),
    deepening_cues: composeValidators(stringNormalizer(), string()),
    breath: composeValidators(
      stringArray(),
      stringArrayNormalizer(),
      uniqueArrayItems('breath')
    ),
  }
}

function validateByMode(
  payload: unknown,
  isCreate: boolean
): ValidationResult<Record<string, unknown>> {
  const input = (payload ?? {}) as Record<string, unknown>
  const schema = createAsanaSchema(isCreate)

  const target: Record<string, unknown> = {}
  for (const key of Object.keys(schema)) {
    if (isCreate || Object.prototype.hasOwnProperty.call(input, key)) {
      target[key] = input[key]
    }
  }

  const activeSchema: ValidationSchema<Record<string, unknown>> = isCreate
    ? schema
    : Object.keys(target).reduce<ValidationSchema<Record<string, unknown>>>(
        (acc, key) => {
          acc[key] = schema[key]
          return acc
        },
        {}
      )

  const result = validateObject(target, activeSchema)

  return {
    ...result,
    normalizedData: Object.entries(result.normalizedData).reduce<
      Record<string, unknown>
    >((acc, [key, value]) => {
      if (!isCreate && !Object.prototype.hasOwnProperty.call(input, key)) {
        return acc
      }

      if (Array.isArray(value)) {
        acc[key] = value
        return acc
      }

      if (typeof value === 'string') {
        acc[key] = value
        return acc
      }

      if (value === null) {
        acc[key] = null
        return acc
      }

      if (value !== undefined) {
        acc[key] = value
      }

      return acc
    }, {}),
  }
}

export const AsanaCreatePayloadValidator = {
  validate(payload: unknown): ValidationResult<AsanaCreatePayload> {
    return validateByMode(payload, true) as ValidationResult<AsanaCreatePayload>
  },
}

export const AsanaUpdatePayloadValidator = {
  validate(payload: unknown): ValidationResult<AsanaUpdatePayload> {
    return validateByMode(
      payload,
      false
    ) as ValidationResult<AsanaUpdatePayload>
  },
}
