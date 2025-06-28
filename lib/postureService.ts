import { logServiceError } from './errorLogger'

export interface FullAsanaData {
  id: string
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
    // Add timestamp to ensure fresh data
    const timestamp = Date.now()
    const response = await fetch(`/api/poses?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
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
    console.log('Creating posture with input:', input)

    const response = await fetch('/api/poses/createAsana', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(input),
    })

    console.log('Create posture response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Create posture failed:', errorData)
      throw new Error(
        `Failed to create posture: ${errorData.error || response.statusText}`
      )
    }

    const data = await response.json()
    console.log('Created posture response:', data)

    if (!data || Object.keys(data).length === 0) {
      throw new Error('Received empty data object')
    }

    if (!data.sort_english_name) {
      throw new Error('Invalid posture data: missing sort_english_name')
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
