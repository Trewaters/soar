import { ReactNode } from 'react'
/**
 * Asana Field Constants
 *
 * Single source of truth for all asana form field definitions.
 * Used by both AsanaDetailsEdit (edit mode) and createAsana/poseActivityDetail pages.
 */

/**
 * Field types for Asana configurations
 */
export type AsanaEditFieldType =
  | 'text'
  | 'multiline'
  | 'autocomplete'
  | 'buttonGroup'
  | 'variations'
  | 'custom'

/**
 * Base props shared across all field types
 */
interface BaseAsanaFieldProps {
  fieldKey?: string
  label: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  category?: string
  showCategoryIcon?: boolean
}

/**
 * Text field configuration
 */
export interface TextAsanaFieldProps extends BaseAsanaFieldProps {
  type: 'text'
  placeholder?: string
  value: string
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  onChange?: (value: any) => void
}

/**
 * Multiline field configuration
 */
export interface MultilineAsanaFieldProps extends BaseAsanaFieldProps {
  type: 'multiline'
  placeholder?: string
  rows?: number
  value: string
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  onChange?: (value: any) => void
}

/**
 * Autocomplete field configuration
 */
export interface AutocompleteAsanaFieldProps extends BaseAsanaFieldProps {
  type: 'autocomplete'
  options: string[]
  placeholder?: string
  freeSolo?: boolean
  value: string
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  onChange?: (value: any) => void
}

/**
 * Button group field configuration
 */
export interface ButtonGroupAsanaFieldProps extends BaseAsanaFieldProps {
  type: 'buttonGroup'
  options: string[]
  value: string
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  onChange?: (value: any) => void
}

/**
 * Variations field configuration
 */
export interface VariationsAsanaFieldProps extends BaseAsanaFieldProps {
  type: 'variations'
  placeholder?: string
  value: string[]
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  onChange?: (value: any) => void
}

/**
 * Custom field configuration
 */
export interface CustomAsanaFieldProps extends BaseAsanaFieldProps {
  type: 'custom'
  children: ReactNode
  value: any
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  onChange?: (value: any) => void
}

/**
 * Union type for all field configurations
 */
export type AsanaEditFieldProps =
  | TextAsanaFieldProps
  | MultilineAsanaFieldProps
  | AutocompleteAsanaFieldProps
  | ButtonGroupAsanaFieldProps
  | VariationsAsanaFieldProps
  | CustomAsanaFieldProps

/**
 * Helper to extract field display value for view mode
 */
export function getFieldDisplayValue(
  field: AsanaEditFieldProps
): string | string[] {
  const value = field.value ?? (field.type === 'variations' ? [] : '')

  if (field.type === 'variations' && Array.isArray(value)) {
    return value
  }

  return String(value ?? '')
}

/**
 * Common field styling
 */
export const fieldSxStyles = {
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: '12px',
    borderColor: 'primary.main',
    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'primary.light',
  },
} as const

export type AsanaFieldDefinitionShape = {
  fieldKey: string
  type: Exclude<AsanaEditFieldType, 'custom'>
  label: string
  helperText?: string
  required?: boolean
  placeholder?: string
  rows?: number
  freeSolo?: boolean
  options?: readonly string[]
  optionsSource?: 'categoryOptions'
}

export const ASANA_FIELD_DEFINITIONS = [
  {
    type: 'text',
    fieldKey: 'sort_english_name',
    label: 'Asana Pose Name',
    required: true,
    placeholder: 'Enter the name of the asana. Must be unique.',
  },
  {
    type: 'variations',
    fieldKey: 'sanskrit_names',
    label: 'Sanskrit Names',
    placeholder: 'e.g. Virabhadrasana I, ...',
    helperText: 'Separate multiple names with commas',
  },
  {
    type: 'variations',
    fieldKey: 'english_names',
    label: 'English Name Variations',
    required: true,
    placeholder: 'e.g. Downward Dog, Adho Mukha Svanasana',
    helperText: 'Separate variants with commas',
  },
  {
    type: 'variations',
    fieldKey: 'alternative_english_names',
    label: 'Alternative Names (Custom/Nicknames)',
    placeholder: 'e.g. My favorite twist, Pretzel pose',
    helperText: 'Multiple nicknames separated by commas',
  },
  {
    type: 'multiline',
    fieldKey: 'description',
    label: 'Description',
    placeholder:
      'Describe the pose alignment, position, and key characteristics...',
    rows: 4,
  },
  {
    type: 'autocomplete',
    fieldKey: 'category',
    label: 'Category',
    placeholder: 'Select or type category',
    freeSolo: true,
    optionsSource: 'categoryOptions',
  },
  {
    type: 'buttonGroup',
    fieldKey: 'difficulty',
    label: 'Difficulty',
    options: ['Easy', 'Average', 'Difficult'],
    helperText: 'Select the difficulty level for this asana',
  },
  {
    type: 'text',
    fieldKey: 'dristi',
    label: 'Dristi',
    placeholder: 'Gaze point',
    helperText: 'e.g. "Tip of the nose" or "Hand", "Toes"',
  },
  {
    type: 'multiline',
    fieldKey: 'setup_cues',
    label: 'Setup Cues',
    rows: 2,
    placeholder: 'Enter a detailed description…',
  },
  {
    type: 'multiline',
    fieldKey: 'deepening_cues',
    label: 'Deepening Cues',
    rows: 2,
    placeholder: 'Enter a detailed description…',
  },
] as const satisfies readonly AsanaFieldDefinitionShape[]

export type AsanaFieldKey = (typeof ASANA_FIELD_DEFINITIONS)[number]['fieldKey']
export type AsanaFieldDefinition = (typeof ASANA_FIELD_DEFINITIONS)[number]

export type AsanaFormData = {
  [Definition in AsanaFieldDefinition as Definition['fieldKey']]: Definition['type'] extends 'variations'
    ? string[]
    : string
}

const asanaFieldDefinitionsByKey: Partial<
  Record<AsanaFieldKey, AsanaFieldDefinition>
> = {}
for (const definition of ASANA_FIELD_DEFINITIONS) {
  asanaFieldDefinitionsByKey[definition.fieldKey] = definition
}

export const ASANA_FIELD_DEFINITIONS_BY_KEY: Readonly<
  Record<AsanaFieldKey, AsanaFieldDefinition>
> = asanaFieldDefinitionsByKey as Record<AsanaFieldKey, AsanaFieldDefinition>

export function createEmptyAsanaFormData(): AsanaFormData {
  const base: Partial<Record<AsanaFieldKey, string | string[]>> = {}
  for (const definition of ASANA_FIELD_DEFINITIONS) {
    base[definition.fieldKey] = definition.type === 'variations' ? [] : ''
  }
  return base as AsanaFormData
}

/**
 * Factory function to create asana field configurations
 * Pass the current form data and setter function to create a complete field array
 */
export function createAsanaFields(
  formData: AsanaFormData,
  // eslint-disable-next-line no-unused-vars
  setField: (key: AsanaFieldKey, value: any) => void,
  categoryOptions: string[]
): AsanaEditFieldProps[] {
  return ASANA_FIELD_DEFINITIONS.map((definition): AsanaEditFieldProps => {
    const normalizedDefinition: AsanaFieldDefinitionShape & {
      fieldKey: AsanaFieldKey
    } = definition
    const onChange = (value: any) =>
      setField(normalizedDefinition.fieldKey, value)

    if (normalizedDefinition.type === 'variations') {
      const rawValue = formData[normalizedDefinition.fieldKey]
      return {
        type: 'variations',
        fieldKey: normalizedDefinition.fieldKey,
        label: normalizedDefinition.label,
        helperText: normalizedDefinition.helperText,
        required: normalizedDefinition.required,
        placeholder: normalizedDefinition.placeholder,
        value: Array.isArray(rawValue) ? rawValue : [],
        onChange,
      }
    }

    const rawValue = formData[normalizedDefinition.fieldKey]
    const stringValue = typeof rawValue === 'string' ? rawValue : ''

    if (normalizedDefinition.type === 'multiline') {
      return {
        type: 'multiline',
        fieldKey: normalizedDefinition.fieldKey,
        label: normalizedDefinition.label,
        helperText: normalizedDefinition.helperText,
        required: normalizedDefinition.required,
        placeholder: normalizedDefinition.placeholder,
        rows: normalizedDefinition.rows,
        value: stringValue,
        onChange,
      }
    }

    if (normalizedDefinition.type === 'autocomplete') {
      return {
        type: 'autocomplete',
        fieldKey: normalizedDefinition.fieldKey,
        label: normalizedDefinition.label,
        helperText: normalizedDefinition.helperText,
        required: normalizedDefinition.required,
        placeholder: normalizedDefinition.placeholder,
        freeSolo: normalizedDefinition.freeSolo,
        options:
          normalizedDefinition.optionsSource === 'categoryOptions'
            ? categoryOptions
            : normalizedDefinition.options
              ? [...normalizedDefinition.options]
              : [],
        value: stringValue,
        onChange,
      }
    }

    if (normalizedDefinition.type === 'buttonGroup') {
      return {
        type: 'buttonGroup',
        fieldKey: normalizedDefinition.fieldKey,
        label: normalizedDefinition.label,
        helperText: normalizedDefinition.helperText,
        required: normalizedDefinition.required,
        options: normalizedDefinition.options
          ? [...normalizedDefinition.options]
          : [],
        value: stringValue,
        onChange,
      }
    }

    return {
      type: 'text',
      fieldKey: normalizedDefinition.fieldKey,
      label: normalizedDefinition.label,
      helperText: normalizedDefinition.helperText,
      required: normalizedDefinition.required,
      placeholder: normalizedDefinition.placeholder,
      value: stringValue,
      onChange,
    }
  })
}
