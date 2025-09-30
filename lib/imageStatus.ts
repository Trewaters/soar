/**
 * Service functions for checking image status and limits for yoga postures
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
 * Get image upload status for a specific posture
 */
export async function getImageUploadStatus(
  postureId: string,
  userId: string
): Promise<ImageStatusResponse> {
  try {
    const response = await fetch(
      `/api/images/status?postureId=${postureId}&userId=${userId}`,
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
