import { logServiceError } from './errorLogger'
import { localImageStorage, type LocalImageData } from './localImageStorage'

export interface PoseImageData {
  id: string
  url: string
  altText?: string | null
  fileName?: string | null
  fileSize?: number | null
  uploadedAt: string
  storageType?: 'CLOUD' | 'LOCAL' | 'HYBRID'
  isOffline?: boolean
  localStorageId?: string | null
  poseId?: string | null
  poseName?: string | null
}

export interface UploadImageInput {
  file: File
  altText?: string
  userId: string
  poseId?: string
  poseName?: string
}

export interface GetImagesResponse {
  images: PoseImageData[]
  total: number
  hasMore: boolean
}

async function getResponseErrorMessage(
  response: Response,
  fallbackMessage: string
): Promise<string> {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    try {
      const errorData = await response.json()
      const message =
        errorData?.error || errorData?.message || errorData?.details
      if (typeof message === 'string' && message.trim()) {
        return message
      }
    } catch {
      // Fall through to text parsing for malformed JSON responses
    }
  }

  let errorText = ''
  try {
    errorText = await response.text()
  } catch {
    errorText = ''
  }

  const payloadTooLarge =
    response.status === 413 ||
    /request entity too large|payload too large/i.test(errorText)

  if (payloadTooLarge) {
    return 'Image file is too large for this upload endpoint. Please choose a smaller image and try again.'
  }

  if (errorText.trim()) {
    return errorText.substring(0, 200)
  }

  return fallbackMessage
}

/**
 * Upload a pose image to Vercel Blob and save to database
 */
export async function uploadPoseImage(
  input: UploadImageInput
): Promise<PoseImageData> {
  try {
    const formData = new FormData()
    formData.append('file', input.file)
    formData.append('userId', input.userId)
    if (input.altText) {
      formData.append('altText', input.altText)
    }
    if (input.poseId) {
      formData.append('poseId', input.poseId)
    }
    if (input.poseName) {
      formData.append('poseName', input.poseName)
    }

    const response = await fetch('/api/images/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorMessage = await getResponseErrorMessage(
        response,
        `Failed to upload image (${response.status})`
      )
      console.error('[uploadPoseImage] Upload failed:', {
        errorMessage,
        status: response.status,
      })
      throw new Error(errorMessage)
    }

    try {
      const result = await response.json()
      return result
    } catch (parseError) {
      console.error('[uploadPoseImage] Failed to parse response:', parseError)
      throw new Error('Upload succeeded but returned an invalid response.')
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('[uploadPoseImage] Caught error:', {
      message: errorMsg,
      stack: error instanceof Error ? error.stack : undefined,
    })
    logServiceError(error, 'imageService', 'uploadPoseImage', {
      operation: 'upload_image',
      fileSize: input.file.size,
      fileType: input.file.type,
      userId: input.userId,
    })
    throw error
  }
}

/**
 * Get user's uploaded pose images
 */
export async function getUserPoseImages(
  limit: number = 10,
  offset: number = 0,
  poseId?: string,
  poseName?: string,
  showAll?: boolean
): Promise<GetImagesResponse> {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    })

    if (poseId) {
      params.append('poseId', poseId)
      params.append('includeOwnership', 'true')
      params.append('orderBy', 'displayOrder')
    }
    if (poseName) {
      params.append('poseName', poseName)
      params.append('orderBy', 'displayOrder')
    }
    if (showAll) {
      params.append('showAll', 'true')
    }

    const url = `/api/images?${params}`

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })

    if (!response.ok) {
      // Clone response before reading to avoid "body stream already read" error
      const clonedResponse = response.clone()
      let errorData: any
      try {
        errorData = await response.json()
      } catch {
        try {
          const errorText = await clonedResponse.text()
          throw new Error(
            `API returned non-JSON error (${response.status}): ${errorText.substring(0, 200)}`
          )
        } catch {
          throw new Error(`API error (${response.status})`)
        }
      }

      // If unauthorized, provide clearer guidance
      if (response.status === 401) {
        throw new Error(
          errorData.error || 'Authentication required to fetch images (401)'
        )
      }

      throw new Error(
        errorData.error || `Failed to fetch images (${response.status})`
      )
    }

    const result = await response.json()
    return result
  } catch (error) {
    logServiceError(error, 'imageService', 'getUserPoseImages', {
      operation: 'fetch_user_images',
      limit,
      offset,
      poseId,
      poseName,
    })
    throw error
  }
}

/**
 * Delete a pose image
 */
export async function deletePoseImage(imageId: string): Promise<void> {
  try {
    const response = await fetch(`/api/images/${encodeURIComponent(imageId)}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to delete image')
    }
  } catch (error) {
    logServiceError(error, 'imageService', 'deletePoseImage', {
      operation: 'delete_image',
      imageId,
    })
    throw error
  }
}

/**
 * Save image locally when cloud upload fails
 */
export async function saveImageLocally(
  input: UploadImageInput
): Promise<PoseImageData> {
  try {
    // Store image locally
    const localImage: LocalImageData = await localImageStorage.storeImage(
      input.file,
      input.userId,
      input.altText
    )

    // Save metadata to database
    const response = await fetch('/api/images/local', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        localStorageId: localImage.id,
        fileName: localImage.fileName,
        fileSize: localImage.fileSize,
        altText: localImage.altText,
        url: `local://${localImage.id}`,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to save local image metadata')
    }

    return await response.json()
  } catch (error) {
    logServiceError(error, 'imageService', 'saveImageLocally', {
      operation: 'save_local_image',
      fileSize: input.file.size,
      fileType: input.file.type,
      userId: input.userId,
    })
    throw error
  }
}

/**
 * Sync local images to cloud when connection is restored
 */
export async function syncLocalImagesToCloud(userId: string): Promise<{
  synced: number
  failed: string[]
}> {
  try {
    return await localImageStorage.syncToCloud(userId)
  } catch (error) {
    logServiceError(error, 'imageService', 'syncLocalImagesToCloud', {
      operation: 'sync_local_images',
      userId,
    })
    throw error
  }
}

/**
 * Get local storage information
 */
export async function getLocalStorageInfo(): Promise<{
  used: number
  available: number
  quota: number
}> {
  try {
    return await localImageStorage.getStorageInfo()
  } catch (error) {
    logServiceError(error, 'imageService', 'getLocalStorageInfo', {
      operation: 'get_storage_info',
    })
    return { used: 0, available: 0, quota: 0 }
  }
}

/**
 * Custom error class for cloud upload failures
 */
export class CloudUploadError extends Error {
  public readonly canFallbackToLocal: boolean
  public readonly details: string

  constructor(
    message: string,
    details: string,
    canFallbackToLocal: boolean = false
  ) {
    super(message)
    this.name = 'CloudUploadError'
    this.details = details
    this.canFallbackToLocal = canFallbackToLocal
  }
}
