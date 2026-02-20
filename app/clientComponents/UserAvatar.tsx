import React, { useRef, useState } from 'react'
import { Avatar, AvatarProps, Box, Chip, CircularProgress } from '@mui/material'
import { useActiveProfileImage } from '@app/hooks/useActiveProfileImage'
import Image from 'next/image'
import { UseUser } from '@app/context/UserContext'
import { useSession } from 'next-auth/react'

export interface UserAvatarProps extends Omit<AvatarProps, 'src' | 'alt'> {
  /**
   * Size variant for quick styling
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Whether to show an indicator if using a placeholder image
   */
  showPlaceholderIndicator?: boolean
  /**
   * Custom alt text - if not provided, defaults to "User profile image"
   */
  alt?: string
  /**
   * Enable clicking avatar to upload a new profile image
   */
  enableUpload?: boolean
}

const sizeMap = {
  small: { width: 40, height: 40 },
  medium: { width: 64, height: 64 },
  large: { width: 120, height: 120 },
} as const

/**
 * UserAvatar component that automatically shows the user's active profile image
 * Falls back to OAuth provider image or placeholder if no custom image is set
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  size = 'medium',
  showPlaceholderIndicator = false,
  alt = 'User profile image',
  sx,
  // When true, clicking the avatar opens a file picker and uploads the chosen image
  enableUpload = false,
  ...avatarProps
}) => {
  const { activeImage, isPlaceholder } = useActiveProfileImage()
  const { dispatch } = UseUser()
  const { data: session } = useSession()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)

  const sizeStyles = sizeMap[size]

  const iconSize = sizeStyles ? sizeStyles.width * 0.6 : 32

  // Only allow upload when the default placeholder avatar is showing.
  // If there is at least one image (uploaded or provider image) disable upload even if enableUpload prop is true.
  const effectiveEnableUpload = enableUpload && isPlaceholder

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      {/* Hidden file input used when upload is enabled */}
      {effectiveEnableUpload && (
        <input
          aria-label="upload profile image input"
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={async (e) => {
            const file = e.target.files && e.target.files[0]
            if (!file) return
            if (!session?.user?.email) {
              window.alert('You must be logged in to upload a profile image.')
              return
            }
            try {
              setUploading(true)
              const formData = new FormData()
              formData.append('file', file)
              const res = await fetch('/api/profileImage', {
                method: 'POST',
                body: formData,
              })
              if (res.ok) {
                const data = await res.json()
                dispatch({
                  type: 'SET_PROFILE_IMAGES',
                  payload: {
                    images: data.images,
                    active: data.activeProfileImage || null,
                  },
                })
                // Optionally notify user
              } else {
                const err = await res.json()
                // eslint-disable-next-line no-console
                console.error('Upload failed', err)
                window.alert(err?.error || 'Upload failed')
              }
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error('Upload error', err)
              window.alert('Upload error')
            } finally {
              setUploading(false)
              // Clear input so same file can be selected again if needed
              if (inputRef.current) inputRef.current.value = ''
            }
          }}
        />
      )}

      <Avatar
        // Only set src when there is a real image (not the placeholder path)
        src={isPlaceholder ? undefined : activeImage}
        alt={alt}
        sx={{
          ...sizeStyles,
          ...sx,
          cursor: effectiveEnableUpload ? 'pointer' : undefined,
        }}
        onClick={() => {
          if (effectiveEnableUpload && inputRef.current) {
            inputRef.current.click()
          }
        }}
        {...avatarProps}
      >
        {isPlaceholder && (
          // Render an <img> inside Avatar for the placeholder so tests can find it by alt
          <Image
            src="/icons/profile/profile-person.svg"
            width={iconSize}
            height={iconSize}
            alt="Default profile icon"
          />
        )}
        {uploading && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255,255,255,0.6)',
              borderRadius: '50%',
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}
      </Avatar>

      {showPlaceholderIndicator && isPlaceholder && (
        <Chip
          label="Add Photo"
          size="small"
          color="primary"
          sx={{
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.6rem',
            height: 16,
          }}
        />
      )}
    </Box>
  )
}

/**
 * Hook to get avatar-related information without rendering
 */
export function useUserAvatarInfo() {
  return useActiveProfileImage()
}
