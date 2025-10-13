import { logServiceError } from './errorLogger'
import { getAlphaUserIds } from '@app/lib/alphaUsers'
import { AsanaPose } from 'types/asana'

export type CreatePoseInput = {
  sort_english_name: string
  english_names: string[]
  description: string
  category: string
  difficulty: string
  // Optional extended fields to match Prisma and app types
  breath?: string[]
  sanskrit_names?: string[]
  dristi?: string
  setup_cues?: string
  deepening_cues?: string
  // breath_direction_default: string
  preferred_side: string
  sideways: string
  created_by: string
}

export type UpdatePoseInput = {
  sort_english_name: string
  english_names: string[]
  description: string
  category: string
  difficulty: string
  breath: string[]
  sanskrit_names?: string[]
  dristi?: string
  setup_cues?: string
  deepening_cues?: string
  preferred_side: string
  sideways: string
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
    // Get alpha user IDs
    const alphaUserIds = getAlphaUserIds()

    // If no current user, only show alpha user poses
    if (!currentUserEmail) {
      if (alphaUserIds.length === 0) {
        return []
      }

      // Fetch all alpha user poses in parallel
      const alphaPosePromises = alphaUserIds.map(async (alphaUserId) => {
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
            `Failed to fetch poses for alpha user ${alphaUserId}:`,
            error
          )
          return []
        }
      })

      const alphaPoseArrays = await Promise.all(alphaPosePromises)
      return alphaPoseArrays.flat()
    }

    // For authenticated users, fetch both user poses and alpha poses in parallel
    const fetchPromises: Promise<AsanaPose[]>[] = []

    // Add user poses promise
    fetchPromises.push(getUserPoses(currentUserEmail))

    // Add alpha user poses promises (excluding current user if they're an alpha user)
    const relevantAlphaUserIds = alphaUserIds.filter(
      (alphaUserId) => alphaUserId !== currentUserEmail
    )

    const alphaPosePromises = relevantAlphaUserIds.map(async (alphaUserId) => {
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
          `Failed to fetch poses for alpha user ${alphaUserId}:`,
          error
        )
        return []
      }
    })

    fetchPromises.push(...alphaPosePromises)

    // Wait for all requests to complete in parallel
    const allPoseArrays = await Promise.all(fetchPromises)
    const allPoses = allPoseArrays.flat()

    // Deduplicate poses by sort_english_name
    const uniquePoses = allPoses.filter(
      (pose, index, arr) =>
        arr.findIndex((p) => p.sort_english_name === pose.sort_english_name) ===
        index
    )

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
    const response = await fetch(`/api/poses/?id=${encodeURIComponent(id)}`, {
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
      `/api/poses/?sort_english_name=${encodeURIComponent(name)}`,
      { cache: 'no-store' }
    )
    if (!response.ok) {
      throw new Error('Failed to fetch pose')
    }
    return await response.json()
  } catch (error) {
    logServiceError(error, 'poseService', 'getPoseByName', {
      operation: 'fetch_pose_by_name',
      name,
    })
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
        console.log('ID lookup failed, falling back to name lookup')
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
 */
export async function getPoseIdByName(name: string): Promise<string | null> {
  try {
    const pose = await getPoseByName(name)
    return pose.id
  } catch (error) {
    // If pose not found, return null instead of throwing
    console.warn(`Pose not found for name: ${name}`)
    return null
  }
}

/**
 * Create a new pose
 */
export async function createPose(input: CreatePoseInput): Promise<AsanaPose> {
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
    const response = await fetch(`/api/poses/${id}`, {
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
