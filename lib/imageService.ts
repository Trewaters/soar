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
  postureId?: string | null
  postureName?: string | null
}

export interface UploadImageInput {
  file: File
  altText?: string
  userId: string
  postureId?: string
  postureName?: string
}

export interface GetImagesResponse {
  images: PoseImageData[]
  total: number
  hasMore: boolean
}

/**
 * Upload a pose image to Cloudflare and save to database
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
    if (input.postureId) {
      formData.append('postureId', input.postureId)
    }
    if (input.postureName) {
      formData.append('postureName', input.postureName)
    }

    const response = await fetch('/api/images/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()

      // Handle specific Cloudflare permission error
      if (errorData.errorCode === 5403) {
        throw new Error(`${errorData.error}\n\n${errorData.details}`)
      }

      throw new Error(errorData.error || 'Failed to upload image')
    }

    return await response.json()
  } catch (error) {
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
  postureId?: string,
  postureName?: string
): Promise<GetImagesResponse> {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    })

    if (postureId) {
      params.append('postureId', postureId)
    }
    if (postureName) {
      params.append('postureName', postureName)
    }

    const response = await fetch(`/api/images/upload?${params}`, {
      method: 'GET',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch images')
    }

    return await response.json()
  } catch (error) {
    logServiceError(error, 'imageService', 'getUserPoseImages', {
      operation: 'fetch_user_images',
      limit,
      offset,
      postureId,
      postureName,
    })
    throw error
  }
}

/**
 * Delete a pose image
 */
export async function deletePoseImage(imageId: string): Promise<void> {
  try {
    const response = await fetch(
      `/api/images/upload?id=${encodeURIComponent(imageId)}`,
      {
        method: 'DELETE',
      }
    )

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
