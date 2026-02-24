import { logServiceError } from './errorLogger'
import { AsanaPose } from 'types/asana'

export async function fetchWithTimeout(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const controller = new AbortController()
  const signal = controller.signal
  try {
    const response = await fetch(input, { ...(init || {}), signal })
    return response
  } catch (err: any) {
    if (err && (err.name === 'AbortError' || err.code === 'ABORT_ERR')) {
      throw new Error('Request timed out')
    }
    throw err
  }
}

export type CreatePoseInput = {
  sort_english_name: string
  english_names: string[]
  description?: string | null
  category?: string | null
  difficulty?: string | null
  // Optional extended fields to match Prisma and app types
  breath?: string[]
  sanskrit_names?: string[]
  dristi?: string | null
  setup_cues?: string | null
  deepening_cues?: string | null
  created_by: string
}

export type UpdatePoseInput = {
  sort_english_name: string
  english_names: string[]
  description?: string | null
  category?: string
  difficulty?: string
  // make breath optional on update to match create semantics
  breath?: string[]
  sanskrit_names?: string[]
  dristi?: string | null
  setup_cues?: string | null
  deepening_cues?: string | null
  // Additional optional fields accepted by the update endpoint
  breath_direction_default?: string
  // preferred_side and sideways deprecated and removed
  alternative_english_names?: string[]
}

/**
 * Get all poses
 */
export async function getAllPoses(): Promise<AsanaPose[]> {
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
      throw new Error('Failed to fetch poses')
    }
    return await response.json()
  } catch (error) {
    logServiceError(error, 'poseService', 'getAllPoses', {
      operation: 'fetch_all_poses',
    })
    throw error
  }
}

/**
 * Get poses created by a specific user
 */
export async function getUserPoses(createdBy: string): Promise<AsanaPose[]> {
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
      throw new Error('Failed to fetch user poses')
    }
    return await response.json()
  } catch (error) {
    logServiceError(error, 'poseService', 'getUserPoses', {
      operation: 'fetch_user_poses',
      createdBy,
    })
    throw error
  }
}

/**
 * Get poses that are accessible to the current user
 * Includes user's own poses and alpha user poses
 */
export async function getAccessiblePoses(
  currentUserEmail?: string
): Promise<AsanaPose[]> {
  try {
    // Request the default listing (no createdBy filter) letting the server
    // use the session (if present) to return PUBLIC, alpha users, and
    // the authenticated user's personal poses.
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
      throw new Error('Failed to fetch accessible poses')
    }

    const data = await response.json()

    // Deduplicate poses by sort_english_name to ensure clean search results
    const uniquePoses = Array.isArray(data)
      ? data.filter(
          (pose, index, arr) =>
            arr.findIndex(
              (p) => p.sort_english_name === pose.sort_english_name
            ) === index
        )
      : []

    return uniquePoses
  } catch (error) {
    logServiceError(error, 'poseService', 'getAccessiblePoses', {
      operation: 'fetch_accessible_poses',
      currentUserEmail,
    })
    throw error
  }
}

/**
 * Get pose by ID (ObjectId)
 */
export async function getPoseById(id: string): Promise<AsanaPose> {
  try {
    const response = await fetch(`/api/poses?id=${encodeURIComponent(id)}`, {
      cache: 'no-store',
    })
    if (!response.ok) {
      throw new Error('Failed to fetch pose')
    }
    return await response.json()
  } catch (error) {
    logServiceError(error, 'poseService', 'getPoseById', {
      operation: 'fetch_pose_by_id',
      id,
    })
    throw error
  }
}

/**
 * Get pose by sort_english_name
 */
export async function getPoseByName(name: string): Promise<AsanaPose> {
  try {
    const response = await fetch(
      `/api/poses?sort_english_name=${encodeURIComponent(name)}`,
      { cache: 'no-store' }
    )
    if (!response.ok) {
      // Don't log 404s as errors - they're expected when poses are deleted or don't exist
      if (response.status === 404) {
        throw new Error(`Pose not found: ${name}`)
      }
      throw new Error('Failed to fetch pose')
    }
    return await response.json()
  } catch (error) {
    // Only log errors that aren't 404s
    if (
      !(error instanceof Error && error.message.includes('Pose not found:'))
    ) {
      logServiceError(error, 'poseService', 'getPoseByName', {
        operation: 'fetch_pose_by_name',
        name,
      })
    }
    throw error
  }
}

/**
 * Get pose by ID or name (flexible lookup)
 */
export async function getPose(idOrName: string): Promise<AsanaPose> {
  try {
    // First try by ID (if it looks like an ObjectId)
    if (idOrName.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        return await getPoseById(idOrName)
      } catch (idError) {
        console.error('ID lookup failed, falling back to name lookup')
      }
    }

    // Fall back to name lookup
    return await getPoseByName(idOrName)
  } catch (error) {
    logServiceError(error, 'poseService', 'getPose', {
      operation: 'fetch_pose_flexible',
      idOrName,
    })
    throw error
  }
}

/**
 * Get pose ID by name (for navigation purposes)
 * Used to convert pose names from series data to ObjectIds for navigation
 * Returns null if pose doesn't exist (e.g., deleted poses in series)
 */
export async function getPoseIdByName(name: string): Promise<string | null> {
  try {
    const pose = await getPoseByName(name)
    return pose.id
  } catch (error) {
    // If pose not found, silently return null - this is expected behavior
    // for deleted poses that are still referenced in series
    if (error instanceof Error && error.message.includes('Pose not found:')) {
      return null
    }
    // Log unexpected errors
    console.error(`Unexpected error fetching pose by name "${name}":`, error)
    return null
  }
}

/**
 * Create a new pose
 */
export async function createPose(input: CreatePoseInput): Promise<AsanaPose> {
  try {
    const response = await fetchWithTimeout('/api/poses/createAsana', {
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
        `Failed to create pose: ${errorData.error || response.statusText}`
      )
    }

    const data = await response.json()

    if (!data || Object.keys(data).length === 0) {
      throw new Error('Received empty data object')
    }

    if (!data.sort_english_name) {
      throw new Error('Invalid pose data: missing sort_english_name')
    }

    return data
  } catch (error) {
    logServiceError(error, 'poseService', 'createPose', {
      operation: 'create_pose',
      input,
    })
    throw error
  }
}

/**
 * Update an existing pose
 */
export async function updatePose(
  id: string,
  input: UpdatePoseInput
): Promise<AsanaPose> {
  try {
    const response = await fetchWithTimeout(`/api/poses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Update pose failed:', errorData)
      throw new Error(
        `Failed to update pose: ${errorData.error || response.statusText}`
      )
    }

    const data = await response.json()

    if (!data || Object.keys(data).length === 0) {
      throw new Error('Received empty data object')
    }

    if (!data.sort_english_name) {
      throw new Error('Invalid pose data: missing sort_english_name')
    }

    return data
  } catch (error) {
    logServiceError(error, 'poseService', 'updatePose', {
      operation: 'update_pose',
      id,
      input,
    })
    throw error
  }
}

/**
 * Delete an existing pose by ID
 */
export async function deletePose(id: string): Promise<{ success: boolean }> {
  try {
    const response = await fetchWithTimeout(`/api/poses/${id}`, {
      method: 'DELETE',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Delete pose failed:', errorData)
      throw new Error(
        `Failed to delete pose: ${errorData.error || response.statusText}`
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    logServiceError(error, 'poseService', 'deletePose', {
      operation: 'delete_pose',
      id,
    })
    throw error
  }
}
