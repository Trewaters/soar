import { useMemo } from 'react'
import { UseUser } from '@app/context/UserContext'

/**
 * Custom hook to get the user's active profile image
 * Returns the active profile image URL, or fallback to session image, or placeholder
 */
export function useActiveProfileImage() {
  const { state } = UseUser()

  const activeImage = useMemo(() => {
    // Priority order:
    // 1. Active profile image from user's uploaded images
    // 2. Default session image (from OAuth provider)
    // 3. Placeholder image

    const userData = state.userData

    if (userData.activeProfileImage) {
      // Verify the active image exists in the profileImages array
      const profileImages = userData.profileImages || []
      if (profileImages.includes(userData.activeProfileImage)) {
        return userData.activeProfileImage
      }
    }

    // Fallback to first uploaded image if activeProfileImage is invalid
    if (userData.profileImages && userData.profileImages.length > 0) {
      return userData.profileImages[0]
    }

    // Fallback to session image (OAuth provider image)
    if (userData.image) {
      return userData.image
    }

    // Default placeholder
    return '/images/profile-placeholder.png'
  }, [state.userData])

  const hasCustomImage = useMemo(() => {
    return Boolean(
      state.userData.activeProfileImage ||
        (state.userData.profileImages &&
          state.userData.profileImages.length > 0)
    )
  }, [state.userData])

  const imageCount = state.userData.profileImages?.length || 0

  return {
    /**
     * The URL of the active profile image
     */
    activeImage,
    /**
     * Whether the user has uploaded custom profile images
     */
    hasCustomImage,
    /**
     * Number of uploaded profile images
     */
    imageCount,
    /**
     * Whether the current active image is the default from OAuth provider
     */
    isDefaultImage: !hasCustomImage && Boolean(state.userData.image),
    /**
     * Whether using the placeholder image
     */
    isPlaceholder: activeImage === '/images/profile-placeholder.png',
  }
}
