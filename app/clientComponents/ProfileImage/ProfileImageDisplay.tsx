/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import React from 'react'
import {
  Box,
  Avatar,
  IconButton,
  Typography,
  Chip,
  useTheme,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export interface ProfileImageDisplayProps {
  images: string[]
  active: string | null
  onSelect: (url: string) => void
  onDelete: (url: string) => void
  placeholder: string
  showSubtitle?: boolean
}

export const ProfileImageDisplay: React.FC<ProfileImageDisplayProps> = ({
  images,
  active,
  onSelect,
  onDelete,
  placeholder,
  showSubtitle = true,
}) => {
  const theme = useTheme()
  return (
    <Box sx={{ mt: 2 }}>
      {showSubtitle && (
        <Typography variant="subtitle2" gutterBottom>
          Your Profile Images
        </Typography>
      )}

      <Box display="flex" flexWrap="wrap" gap={2}>
        {images.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Avatar
              src={placeholder}
              alt="Profile placeholder"
              sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              No profile images uploaded yet
            </Typography>
          </Box>
        ) : (
          images.map((url) => (
            <Box
              key={url}
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={url}
                  alt="Profile image"
                  sx={{
                    width: 80,
                    height: 80,
                    border:
                      active === url
                        ? `3px solid ${theme.palette.info.main}`
                        : `2px solid ${theme.palette.background.default}`,
                    cursor: 'pointer',
                    boxShadow:
                      active === url
                        ? `0 0 0 2px ${theme.palette.info.main}33`
                        : 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor:
                        active === url
                          ? theme.palette.info.main
                          : theme.palette.text.disabled,
                      transform: 'scale(1.05)',
                    },
                  }}
                  onClick={() => onSelect(url)}
                  aria-label={
                    active === url
                      ? 'Active profile image'
                      : 'Click to set as active profile image'
                  }
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelect(url)
                    }
                  }}
                />

                {active === url && (
                  <CheckCircleIcon
                    sx={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      color: theme.palette.info.main,
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      fontSize: 20,
                    }}
                  />
                )}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                {active === url && (
                  <Chip
                    label="Active"
                    color="primary"
                    size="small"
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                )}

                <IconButton
                  aria-label="Delete profile image"
                  onClick={() => onDelete(url)}
                  size="small"
                  sx={{
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'error.light',
                      color: 'white',
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {images.length > 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 2 }}
        >
          Click on an image to set it as your active profile picture
        </Typography>
      )}
    </Box>
  )
}
