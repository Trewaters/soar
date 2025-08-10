import { FullAsanaData } from '@app/context/AsanaPostureContext'
import { logServiceError } from './errorLogger'

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

export type UpdatePostureInput = {
  sort_english_name: string
  english_names: string[]
  description: string
  category: string
  difficulty: string
  breath_direction_default: string
  preferred_side: string
  sideways: string
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

/**
 * Update an existing posture
 */
export async function updatePosture(
  id: string,
  input: UpdatePostureInput
): Promise<FullAsanaData> {
  try {
    console.log('Updating posture with ID:', id)
    console.log('Update input:', input)

    const response = await fetch(`/api/poses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(input),
    })

    console.log('Update posture response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Update posture failed:', errorData)
      throw new Error(
        `Failed to update posture: ${errorData.error || response.statusText}`
      )
    }

    const data = await response.json()
    console.log('Updated posture response:', data)

    if (!data || Object.keys(data).length === 0) {
      throw new Error('Received empty data object')
    }

    if (!data.sort_english_name) {
      throw new Error('Invalid posture data: missing sort_english_name')
    }

    return data
  } catch (error) {
    logServiceError(error, 'postureService', 'updatePosture', {
      operation: 'update_posture',
      id,
      input,
    })
    throw error
  }
}

/**
 * Delete an existing posture by ID
 */
export async function deletePosture(id: string): Promise<{ success: boolean }> {
  try {
    console.log('Deleting posture with ID:', id)

    const response = await fetch(`/api/poses/${id}`, {
      method: 'DELETE',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })

    console.log('Delete posture response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Delete posture failed:', errorData)
      throw new Error(
        `Failed to delete posture: ${errorData.error || response.statusText}`
      )
    }

    const data = await response.json()
    console.log('Deleted posture response:', data)
    return data
  } catch (error) {
    logServiceError(error, 'postureService', 'deletePosture', {
      operation: 'delete_posture',
      id,
    })
    throw error
  }
}
