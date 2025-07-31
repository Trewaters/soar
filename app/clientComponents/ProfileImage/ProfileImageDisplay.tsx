import React from 'react'
import { Box, Avatar, IconButton, Typography } from '@mui/material'

interface ProfileImageDisplayProps {
  images: string[]
  active: string | null
  onSelect: (url: string) => void
  onDelete: (url: string) => void
  placeholder: string
}

export const ProfileImageDisplay: React.FC<ProfileImageDisplayProps> = ({
  images,
  active,
  onSelect,
  onDelete,
  placeholder,
}) => {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      {images.length === 0 ? (
        <Avatar
          src={placeholder}
          alt="Profile placeholder"
          sx={{ width: 80, height: 80 }}
        />
      ) : (
        images.map((url) => (
          <Box
            key={url}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Avatar
              src={url}
              alt="Profile image"
              sx={{
                width: 80,
                height: 80,
                border:
                  active === url
                    ? '2px solid #1976d2'
                    : '2px solid transparent',
                cursor: 'pointer',
              }}
              onClick={() => onSelect(url)}
              aria-label={
                active === url ? 'Active profile image' : 'Profile image'
              }
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelect(url)
              }}
            />
            <IconButton
              aria-label="Delete profile image"
              onClick={() => onDelete(url)}
              size="small"
            >
              <span role="img" aria-label="delete">
                🗑️
              </span>
            </IconButton>
            {active === url && (
              <Typography variant="caption" color="primary">
                Active
              </Typography>
            )}
          </Box>
        ))
      )}
    </Box>
  )
}
