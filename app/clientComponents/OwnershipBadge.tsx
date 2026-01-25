'use client'

import { Chip, type SxProps, type Theme } from '@mui/material'
import PublicIcon from '@mui/icons-material/Public'
import PersonIcon from '@mui/icons-material/Person'

export interface OwnershipBadgeProps {
  /**
   * The creator ID - 'PUBLIC' for system content or userId for user-owned content
   */
  created_by?: string | null

  /**
   * Optional current user ID to determine if content is owned by current user
   */
  currentUserId?: string

  /**
   * Size variant of the badge
   * @default 'small'
   */
  size?: 'small' | 'medium'

  /**
   * Optional additional styles
   */
  sx?: SxProps<Theme>

  /**
   * Optional data-testid for testing
   */
  'data-testid'?: string
}

/**
 * OwnershipBadge Component
 *
 * Displays a visual indicator of content ownership for yoga content (poses, series, sequences).
 * Shows "PUBLIC" badge for system content or "Personal" badge for user-created content.
 *
 * @example
 * ```tsx
 * // PUBLIC content
 * <OwnershipBadge created_by="PUBLIC" />
 *
 * // User-owned content
 * <OwnershipBadge created_by={userId} currentUserId={session.user.id} />
 * ```
 */
export default function OwnershipBadge({
  created_by,
  currentUserId,
  size = 'small',
  sx,
  'data-testid': dataTestId,
}: OwnershipBadgeProps) {
  // Don't render anything if no creator info
  if (!created_by) {
    return null
  }

  const isPublic = created_by === 'PUBLIC'
  const isCurrentUser = currentUserId && created_by === currentUserId

  // PUBLIC content badge
  if (isPublic) {
    return (
      <Chip
        icon={<PublicIcon />}
        label="PUBLIC"
        size={size}
        color="primary"
        variant="outlined"
        sx={{
          fontWeight: 600,
          borderWidth: 2,
          '& .MuiChip-icon': {
            color: 'primary.main',
          },
          ...sx,
        }}
        aria-label="Public system content"
        data-testid={dataTestId || 'ownership-badge-public'}
      />
    )
  }

  // Personal content badge
  return (
    <Chip
      icon={<PersonIcon />}
      label={isCurrentUser ? 'My Content' : 'Personal'}
      size={size}
      color="secondary"
      variant="filled"
      sx={{
        fontWeight: 500,
        backgroundColor: 'secondary.light',
        color: 'secondary.contrastText',
        '& .MuiChip-icon': {
          color: 'secondary.contrastText',
        },
        ...sx,
      }}
      aria-label={
        isCurrentUser
          ? 'Your personal content'
          : 'User-created personal content'
      }
      data-testid={dataTestId || 'ownership-badge-personal'}
    />
  )
}
