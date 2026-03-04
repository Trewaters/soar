// Profile Image Service
// Functions for managing user profile images

export interface ProfileImageData {
  url: string
  isActive: boolean
  uploadedAt?: string
}

export interface ProfileImageResponse {
  images: string[]
  activeImage: string | null
  success: boolean
  error?: string
}

/**
 * Get user's profile images
 */
export async function getUserProfileImages(): Promise<ProfileImageResponse> {
  try {
    const response = await fetch('/api/profileImage/get', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch profile images: ${response.status}`)
    }

    const data = await response.json()
    return {
      images: data.images || [],
      activeImage: data.activeImage || null,
      success: true,
    }
  } catch (error) {
    console.error('Error fetching profile images:', error)
    return {
      images: [],
      activeImage: null,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Upload a new profile image
 */
export async function uploadProfileImage(
  file: File
): Promise<ProfileImageResponse> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/profileImage', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Upload failed: ${response.status}`)
    }

    const data = await response.json()
    return {
      images: data.images || [],
      activeImage: data.activeProfileImage || null,
      success: true,
    }
  } catch (error) {
    console.error('Error uploading profile image:', error)
    return {
      images: [],
      activeImage: null,
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

/**
 * Set an image as the active profile image
 */
export async function setActiveProfileImage(
  url: string
): Promise<ProfileImageResponse> {
  try {
    const response = await fetch('/api/profileImage/setActive', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        errorData.error || `Failed to set active image: ${response.status}`
      )
    }

    const data = await response.json()
    return {
      images: [], // We don't get updated images list from this endpoint
      activeImage: data.activeProfileImage || null,
      success: true,
    }
  } catch (error) {
    console.error('Error setting active profile image:', error)
    return {
      images: [],
      activeImage: null,
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to set active image',
    }
  }
}

/**
 * Delete a profile image
 */
export async function deleteProfileImage(
  url: string
): Promise<ProfileImageResponse> {
  try {
    const response = await fetch('/api/profileImage/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Delete failed: ${response.status}`)
    }

    const data = await response.json()
    return {
      images: data.images || [],
      activeImage: data.activeProfileImage || null,
      success: true,
    }
  } catch (error) {
    console.error('Error deleting profile image:', error)
    return {
      images: [],
      activeImage: null,
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    }
  }
}
