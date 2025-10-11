import { logServiceError } from './errorLogger'
import { getAlphaUserIds } from '@app/lib/alphaUsers'
import { AsanaPose } from 'types/asana'

export type CreatePostureInput = {
  sort_english_name: string
  english_names: string[]
  description: string
  category: string
  difficulty: string
  // breath_direction_default: string
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
  breath: string[]
  preferred_side: string
  sideways: string
}

/**
 * Get all postures
 */
export async function getAllPostures(): Promise<AsanaPose[]> {
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
 * Get postures created by a specific user
 */
export async function getUserPostures(createdBy: string): Promise<AsanaPose[]> {
  try {
    // Add timestamp to ensure fresh data
    const timestamp = Date.now()
    const response = await fetch(
      `/api/poses?createdBy=${encodeURIComponent(createdBy)}&t=${timestamp}`,
      {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    )
    if (!response.ok) {
      throw new Error('Failed to fetch user postures')
    }
    return await response.json()
  } catch (error) {
    logServiceError(error, 'postureService', 'getUserPostures', {
      operation: 'fetch_user_postures',
      createdBy,
    })
    throw error
  }
}

/**
 * Get postures that are accessible to the current user
 * Includes user's own postures and alpha user postures
 */
export async function getAccessiblePostures(
  currentUserEmail?: string
): Promise<AsanaPose[]> {
  try {
    // Get alpha user IDs
    const alphaUserIds = getAlphaUserIds()

    // If no current user, only show alpha user postures
    if (!currentUserEmail) {
      if (alphaUserIds.length === 0) {
        return []
      }

      // Fetch all alpha user postures in parallel
      const alphaPosturePromises = alphaUserIds.map(async (alphaUserId) => {
        try {
          const response = await fetch(
            `/api/poses?createdBy=${encodeURIComponent(alphaUserId)}&t=${Date.now()}`,
            {
              cache: 'no-store',
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                Pragma: 'no-cache',
                Expires: '0',
              },
            }
          )
          if (response.ok) {
            return await response.json()
          }
          return []
        } catch (error) {
          console.warn(
            `Failed to fetch postures for alpha user ${alphaUserId}:`,
            error
          )
          return []
        }
      })

      const alphaPostureArrays = await Promise.all(alphaPosturePromises)
      return alphaPostureArrays.flat()
    }

    // For authenticated users, fetch both user postures and alpha postures in parallel
    const fetchPromises: Promise<AsanaPose[]>[] = []

    // Add user postures promise
    fetchPromises.push(getUserPostures(currentUserEmail))

    // Add alpha user postures promises (excluding current user if they're an alpha user)
    const relevantAlphaUserIds = alphaUserIds.filter(
      (alphaUserId) => alphaUserId !== currentUserEmail
    )

    const alphaPosturePromises = relevantAlphaUserIds.map(
      async (alphaUserId) => {
        try {
          const response = await fetch(
            `/api/poses?createdBy=${encodeURIComponent(alphaUserId)}&t=${Date.now()}`,
            {
              cache: 'no-store',
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                Pragma: 'no-cache',
                Expires: '0',
              },
            }
          )
          if (response.ok) {
            return await response.json()
          }
          return []
        } catch (error) {
          console.warn(
            `Failed to fetch postures for alpha user ${alphaUserId}:`,
            error
          )
          return []
        }
      }
    )

    fetchPromises.push(...alphaPosturePromises)

    // Wait for all requests to complete in parallel
    const allPostureArrays = await Promise.all(fetchPromises)
    const allPostures = allPostureArrays.flat()

    // Deduplicate postures by sort_english_name
    const uniquePostures = allPostures.filter(
      (posture, index, arr) =>
        arr.findIndex(
          (p) => p.sort_english_name === posture.sort_english_name
        ) === index
    )

    return uniquePostures
  } catch (error) {
    logServiceError(error, 'postureService', 'getAccessiblePostures', {
      operation: 'fetch_accessible_postures',
      currentUserEmail,
    })
    throw error
  }
}

/**
 * Get posture by ID (ObjectId)
 */
export async function getPostureById(id: string): Promise<AsanaPose> {
  try {
    const response = await fetch(`/api/poses/?id=${encodeURIComponent(id)}`, {
      cache: 'no-store',
    })
    if (!response.ok) {
      throw new Error('Failed to fetch posture')
    }
    return await response.json()
  } catch (error) {
    logServiceError(error, 'postureService', 'getPostureById', {
      operation: 'fetch_posture_by_id',
      id,
    })
    throw error
  }
}

/**
 * Get posture by sort_english_name
 */
export async function getPostureByName(name: string): Promise<AsanaPose> {
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
 * Get posture by ID or name (flexible lookup)
 */
export async function getPosture(idOrName: string): Promise<AsanaPose> {
  try {
    // First try by ID (if it looks like an ObjectId)
    if (idOrName.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        return await getPostureById(idOrName)
      } catch (idError) {
        console.log('ID lookup failed, falling back to name lookup')
      }
    }

    // Fall back to name lookup
    return await getPostureByName(idOrName)
  } catch (error) {
    logServiceError(error, 'postureService', 'getPosture', {
      operation: 'fetch_posture_flexible',
      idOrName,
    })
    throw error
  }
}

/**
 * Get posture ID by name (for navigation purposes)
 * Used to convert pose names from series data to ObjectIds for navigation
 */
export async function getPostureIdByName(name: string): Promise<string | null> {
  try {
    const posture = await getPostureByName(name)
    return posture.id
  } catch (error) {
    // If posture not found, return null instead of throwing
    console.warn(`Posture not found for name: ${name}`)
    return null
  }
}

/**
 * Create a new posture
 */
export async function createPosture(
  input: CreatePostureInput
): Promise<AsanaPose> {
  try {
    const response = await fetch('/api/poses/createAsana', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Failed to create posture: ${errorData.error || response.statusText}`
      )
    }

    const data = await response.json()

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
): Promise<AsanaPose> {
  try {
    const response = await fetch(`/api/poses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Update posture failed:', errorData)
      throw new Error(
        `Failed to update posture: ${errorData.error || response.statusText}`
      )
    }

    const data = await response.json()

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
    const response = await fetch(`/api/poses/${id}`, {
      method: 'DELETE',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Delete posture failed:', errorData)
      throw new Error(
        `Failed to delete posture: ${errorData.error || response.statusText}`
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    logServiceError(error, 'postureService', 'deletePosture', {
      operation: 'delete_posture',
      id,
    })
    throw error
  }
}
