/**
 * Types for Asana Management in Soar Yoga Application
 * Consolidated type definitions for asana-related data structures
 */

import type { UserData } from './models/user'
import { PoseImageData } from './images'

// REPLACES AsanaPose, found in this file
export interface AsanaPose {
  // “Full”, Abbreviated Pose 1
  id: string
  sort_english_name: string
  sanskrit_names: string[] // use first element for primary sanskrit name
  english_names: string[]
  poseImages?: PoseImageData[] // Relation to PoseImage (optional when not included in queries)
  description?: string
  category?: string
  difficulty?: string
  activity_completed?: boolean
  asanaActivities?: AsanaActivity[] // Relation to AsanaActivity (optional)
  activity_practice?: boolean
  dristi?: string
  setup_cues?: string
  deepening_cues?: string
  alternative_english_names?: string[]
  // "Advance", Abbreviated Pose 2
  joint_action?: string
  muscle_action?: string
  transition_cues_out?: string
  transition_cues_in?: string
  additional_cues?: string
  benefits?: string
  customize_asana?: string
  // “Personal”, Abbreviated Pose 3
  pose_modifications?: string[]
  pose_variations?: string[]
  breath?: string[]
  duration_asana?: string
  lore?: string
  asana_intention?: string
  label?: string // verify how it is used
  suggested_poses?: string[] // verify how it is used
  preparatory_poses?: string[] // verify how it is used
  isUserCreated?: boolean // Flag to identify user-created asanas
  // Additional fields supported by the Create form
  breath_direction_default?: string
  // Timestamps may come as ISO strings from API responses or Dates in runtime
  created_on?: string | Date | null // default(now())
  updated_on?: string | Date | null // updatedAt
  // Creator may be nullable in some records
  created_by?: string | null // Should be the user email address when present
  // Cached image count (optional)
  imageCount?: number // default(0)
}

export interface AsanaActivity {
  id: string
  userId: string
  asanaId: string
  asanaName: string
  sort_english_name: string
  duration: number
  datePerformed: Date
  notes?: string
  sensations?: string
  completionStatus: string
  difficulty?: string
  user: UserData
  // pose: asanaPose
  pose: AsanaPose
  createdAt: Date
  updatedAt: Date
}

// Display interface for abbreviated pose data
export interface DisplayAsanaPose {
  id: number
  english_names: string[]
  sanskrit_names: string
  sort_english_name: string
  description: string
  benefits: string
  category: string
  difficulty: string
  lore: string
  dristi: string
  created_on: string
  updated_on: string
  activity_completed: boolean
  activity_practice: boolean
  pose_intent: string
  duration_asana: string
  created_by: string
}

// Interface for pose card display fields
export interface PoseCardFields {
  id: number
  description: string
  simplified_english_name: string
  english_name: string
  sanskrit_names: {
    simplified: string
  }[]
  pose_meaning: string
  benefits: string
  dristi: string
  difficulty: string
  category: string
  subcategory: string
  acitivity_completed: boolean
  acitivity_easy: boolean
  acitivity_difficult: boolean
  acitivity_practice: boolean
  pose_intent: string
}

// API Request/Response types for asana management
export interface CreateAsanaRequest {
  english_names: string[]
  sanskrit_names?: string
  sort_english_name: string
  description?: string
  benefits?: string
  category: string
  difficulty: string
  created_by: string
  // Additional optional fields for full asana data
  lore?: string
  breath_direction_default?: string
  dristi?: string
  variations?: string[]
  modifications?: string[]
  label?: string
  suggested_poses?: string[]
  preparatory_poses?: string[]
  pose_intent?: string
  breath_series?: string[]
  duration_asana?: string
  transition_cues_out?: string
  transition_cues_in?: string
  setup_cues?: string
  deepening_cues?: string
  customize_asana?: string
  additional_cues?: string
  joint_action?: string
  muscle_action?: string
}

export interface UpdateAsanaRequest extends Partial<CreateAsanaRequest> {
  id: string
}

export interface AsanaQueryParams {
  category?: string
  difficulty?: string
  created_by?: string
  isUserCreated?: boolean
  includeImages?: boolean
  orderBy?: 'sort_english_name' | 'created_on' | 'difficulty'
  limit?: number
  offset?: number
}

export interface AsanaQueryResponse {
  asanas: AsanaPose[]
  total: number
  hasMore: boolean
  filters: {
    categories: string[]
    difficulties: string[]
    creators: string[]
  }
}

// Multi-image context state interface
export interface AsanaImageState {
  currentImageIndex: number
  isReordering: boolean
  uploadProgress: number | null
  selectedImages: string[]
}

// Action types for asana management
export type AsanaAction =
  | { type: 'SET_ASANA'; payload: AsanaPose }
  | { type: 'UPDATE_ASANA'; payload: Partial<AsanaPose> }
  | { type: 'SET_CURRENT_IMAGE_INDEX'; payload: number }
  | { type: 'UPDATE_IMAGE_COUNT'; payload: number }
  | { type: 'ADD_POSE_IMAGE'; payload: PoseImageData }
  | { type: 'REMOVE_POSE_IMAGE'; payload: string }
  | { type: 'REORDER_IMAGES'; payload: PoseImageData[] }
  | { type: 'SET_REORDERING'; payload: boolean }
  | { type: 'SET_UPLOAD_PROGRESS'; payload: number | null }
  | { type: 'RESET_IMAGE_STATE' }

// Error types for asana operations
export interface AsanaError {
  code:
    | 'NOT_FOUND'
    | 'UNAUTHORIZED'
    | 'VALIDATION_ERROR'
    | 'DUPLICATE_NAME'
    | 'IMAGE_LIMIT_EXCEEDED'
  message: string
  field?: string
  details?: any
}

// Utility type guards
export function isAsanaPose(obj: any): obj is AsanaPose {
  return (
    obj &&
    typeof obj.id === 'string' &&
    Array.isArray(obj.english_names) &&
    typeof obj.sort_english_name === 'string' &&
    typeof obj.created_by === 'string'
  )
}

export function isUserCreatedAsana(asana: AsanaPose): boolean {
  return asana.isUserCreated === true
}

export function hasMultipleImages(asana: AsanaPose): boolean {
  return (asana.imageCount || 0) > 1
}

// Constants for asana management
export const ASANA_DIFFICULTIES = [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
] as const

export const ASANA_CATEGORIES = [
  'Arm Balance',
  'Arm Leg Support',
  'Backbend',
  'Balance',
  'Bandha',
  'Core',
  'Forward Bend',
  'Forward Fold',
  'Hip Opener',
  'Inversion',
  'Lateral Bend',
  'Mudra',
  'Neutral',
  'Pranayama',
  'Prone',
  'Reclining Asanas',
  'Restorative',
  'Seated',
  'Standing',
  'Supine',
  'Twist',
] as const

export type AsanaDifficulty = (typeof ASANA_DIFFICULTIES)[number]
export type AsanaCategory = (typeof ASANA_CATEGORIES)[number]

// Validation schemas (for use with validation libraries)
export const ASANA_VALIDATION_RULES = {
  english_names: {
    required: true,
    minLength: 1,
    maxLength: 5,
  },
  sort_english_name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  description: {
    maxLength: 2000,
  },
  benefits: {
    maxLength: 1000,
  },
  category: {
    required: true,
    enum: ASANA_CATEGORIES,
  },
  difficulty: {
    required: true,
    enum: ASANA_DIFFICULTIES,
  },
} as const
