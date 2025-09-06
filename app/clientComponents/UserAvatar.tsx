import React from 'react'
import { Avatar, AvatarProps, Box, Chip } from '@mui/material'
import { useActiveProfileImage } from '@app/hooks/useActiveProfileImage'
import Image from 'next/image'

interface UserAvatarProps extends Omit<AvatarProps, 'src' | 'alt'> {
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
  ...avatarProps
}) => {
  const { activeImage, isPlaceholder, hasCustomImage, isDefaultImage } =
    useActiveProfileImage()

  const sizeStyles = sizeMap[size]

  const iconSize = sizeStyles ? sizeStyles.width * 0.6 : 32

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Avatar
        src={activeImage}
        alt={alt}
        sx={{
          ...sizeStyles,
          ...sx,
        }}
        {...avatarProps}
      >
        {isPlaceholder && (
          <Image
            src="/icons/profile/profile-person.svg"
            width={iconSize}
            height={iconSize}
            alt="Default profile icon"
          />
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
