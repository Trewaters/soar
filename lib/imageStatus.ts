/**
 * Service functions for checking image status and limits for yoga poses
 */

export interface ImageStatus {
  currentCount: number
  remainingSlots: number
  maxAllowed: number
  canUpload: boolean
  isUserCreated: boolean
}

export interface ImageStatusResponse {
  status: ImageStatus
  error?: string
}

/**
 * Get image upload status for a specific pose
 */
export async function getImageUploadStatus(
  poseId: string,
  userId: string
): Promise<ImageStatusResponse> {
  try {
    const response = await fetch(
      `/api/images/status?poseId=${poseId}&userId=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return {
        status: {
          currentCount: 0,
          remainingSlots: 0,
          maxAllowed: 0,
          canUpload: false,
          isUserCreated: false,
        },
        error: errorData.error || 'Failed to get image status',
      }
    }

    const data = await response.json()
    return { status: data }
  } catch (error) {
    return {
      status: {
        currentCount: 0,
        remainingSlots: 0,
        maxAllowed: 0,
        canUpload: false,
        isUserCreated: false,
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
