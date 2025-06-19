import { logServiceError } from './errorLogger'

export interface FullAsanaData {
  id: number
  english_names: string[]
  sanskrit_names: string
  sort_english_name: string
  description: string
  benefits: string
  category: string
  difficulty: string
  lore: string
  breath_direction_default: string
  dristi: string
  variations: string[]
  modifications: string[]
  suggested_postures: string[]
  preparatory_postures: string[]
  preferred_side: string
  sideways: boolean
  image: string
  created_on: string
  updated_on: string
  activity_completed: boolean
  activity_practice: boolean
  posture_intent: string
  breath_series: string[]
  duration_asana: string
  transition_cues_out: string
  transition_cues_in: string
  setup_cues: string
  deepening_cues: string
  customize_asana: string
  additional_cues: string
  joint_action: string
  muscle_action: string
  created_by: string
}

export type CreatePostureInput = {
  sort_english_name: string
  english_names: string[]
  description: string
  category: string
  difficulty: string
  breath_direction_default: string
  preferred_side: string
  sideways: string
  created_by: string
}

/**
 * Get all postures
 */
export async function getAllPostures(): Promise<FullAsanaData[]> {
  try {
    const response = await fetch('/api/poses', { cache: 'no-store' })
    if (!response.ok) {
      throw new Error('Failed to fetch postures')
    }
    return await response.json()
  } catch (error) {
    logServiceError(error, 'postureService', 'getAllPostures', {
      operation: 'fetch_all_postures',
    })
    throw error
  }
}

/**
 * Get posture by sort_english_name
 */
export async function getPostureByName(name: string): Promise<FullAsanaData> {
  try {
    const response = await fetch(
      `/api/poses/?sort_english_name=${encodeURIComponent(name)}`,
      { cache: 'no-store' }
    )
    if (!response.ok) {
      throw new Error('Failed to fetch posture')
    }
    return await response.json()
  } catch (error) {
    logServiceError(error, 'postureService', 'getPostureByName', {
      operation: 'fetch_posture_by_name',
      name,
    })
    throw error
  }
}

/**
 * Create a new posture
 */
export async function createPosture(
  input: CreatePostureInput
): Promise<FullAsanaData> {
  try {
    const response = await fetch('/api/poses/createAsana', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cache: 'no-store',
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      throw new Error('Failed to create posture')
    }

    const data = await response.json()
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Received empty data object')
    }

    return data
  } catch (error) {
    logServiceError(error, 'postureService', 'createPosture', {
      operation: 'create_posture',
      input,
    })
    throw error
  }
}
