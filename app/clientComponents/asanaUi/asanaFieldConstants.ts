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

/**
 * Factory function to create asana field configurations
 * Pass the current form data and setter function to create a complete field array
 */
export function createAsanaFields(
  formData: {
    sort_english_name: string
    english_names: string[]
    sanskrit_names: string[]
    alternative_english_names: string[]
    description?: string
    category?: string
    difficulty?: string
    dristi?: string
    setup_cues?: string
    deepening_cues?: string
  },
  // eslint-disable-next-line no-unused-vars
  setField: (key: string, value: any) => void,
  categoryOptions: string[]
): AsanaEditFieldProps[] {
  return [
    {
      type: 'text',
      fieldKey: 'sort_english_name',
      label: 'Asana Pose Name',
      value: formData.sort_english_name,
      required: true,
      placeholder: 'Enter the name of the asana. Must be unique.',
      onChange: (value: any) => setField('sort_english_name', value),
    },
    {
      type: 'variations',
      fieldKey: 'sanskrit_names',
      label: 'Sanskrit Names',
      value: formData.sanskrit_names || [],
      placeholder: 'e.g. Virabhadrasana I, ...',
      helperText: 'Separate multiple names with commas',
      onChange: (value: any) => setField('sanskrit_names', value),
    },
    {
      type: 'variations',
      fieldKey: 'english_names',
      label: 'English Name Variations',
      value: formData.english_names,
      placeholder: 'e.g. Downward Dog, Adho Mukha Svanasana',
      helperText: 'Separate variants with commas',
      onChange: (value: any) => setField('english_names', value),
    },
    {
      type: 'variations',
      fieldKey: 'alternative_english_names',
      label: 'Alternative Names (Custom/Nicknames)',
      value: formData.alternative_english_names || [],
      placeholder: 'e.g. My favorite twist, Pretzel pose',
      helperText: 'Multiple nicknames separated by commas',
      onChange: (value: any) => setField('alternative_english_names', value),
    },
    {
      type: 'multiline',
      fieldKey: 'description',
      label: 'Description',
      value: formData.description || '',
      placeholder:
        'Describe the pose alignment, position, and key characteristics...',
      rows: 4,
      onChange: (value: any) => setField('description', value),
    },
    {
      type: 'autocomplete',
      fieldKey: 'category',
      label: 'Category',
      value: formData.category || '',
      options: categoryOptions,
      placeholder: 'Select or type category',
      freeSolo: true,
      onChange: (value: any) => setField('category', value),
    },
    {
      type: 'buttonGroup',
      fieldKey: 'difficulty',
      label: 'Difficulty Level',
      value: formData.difficulty || '',
      options: ['Easy', 'Average', 'Difficult'],
      helperText: 'Select the difficulty level for this asana',
      onChange: (value: any) => setField('difficulty', value),
    },
    {
      type: 'text',
      fieldKey: 'dristi',
      label: 'Dristi',
      value: formData.dristi || '',
      placeholder: 'Gaze point',
      helperText: 'e.g. "Tip of the nose" or "Hand", "Toes"',
      onChange: (value: any) => setField('dristi', value),
    },
    {
      type: 'multiline',
      fieldKey: 'setup_cues',
      label: 'Setup Cues',
      value: formData.setup_cues || '',
      rows: 2,
      placeholder: 'Enter a detailed description…',
      onChange: (value: any) => setField('setup_cues', value),
    },
    {
      type: 'multiline',
      fieldKey: 'deepening_cues',
      label: 'Deepening Cues',
      value: formData.deepening_cues || '',
      rows: 2,
      placeholder: 'Enter a detailed description…',
      onChange: (value: any) => setField('deepening_cues', value),
    },
  ]
}
