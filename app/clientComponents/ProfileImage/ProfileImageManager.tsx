import React from 'react'
import { Box, Typography, CircularProgress, Alert } from '@mui/material'
import { ProfileImageDisplay } from './ProfileImageDisplay'
import { ProfileImageUpload } from './ProfileImageUpload'

interface ProfileImageManagerProps {
  images: string[]
  active: string | null
  placeholder: string
  onChange: (images: string[], active: string | null) => void
  onUpload: (file: File) => Promise<void>
  onDelete: (url: string) => Promise<void>
  onSelect: (url: string) => Promise<void> | void
  loading: boolean
  maxImages?: number
  showHeader?: boolean
}

export const ProfileImageManager: React.FC<ProfileImageManagerProps> = ({
  images,
  active,
  placeholder,
  onUpload,
  onDelete,
  onSelect,
  loading,
  maxImages = 3,
  showHeader = true,
}) => {
  const [error, setError] = React.useState<string | null>(null)

  const handleUpload = async (file: File) => {
    setError(null)
    if (images.length >= maxImages) {
      setError(`You can only upload up to ${maxImages} images.`)
      return
    }
    try {
      await onUpload(file)
    } catch (e: any) {
      setError(e.message || 'Upload failed')
    }
  }

  const handleDelete = async (url: string) => {
    setError(null)
    try {
      await onDelete(url)
    } catch (e: any) {
      setError(e.message || 'Delete failed')
    }
  }

  const handleSelect = async (url: string) => {
    setError(null)
    try {
      await onSelect(url)
    } catch (e: any) {
      setError(e.message || 'Select failed')
    }
  }

  return (
    <Box>
      {showHeader && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Profile Images
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Upload up to {maxImages} profile images. Click on any image to set
            it as your active profile picture that will be displayed throughout
            the app.
          </Typography>
        </>
      )}

      <ProfileImageUpload
        onUpload={handleUpload}
        disabled={loading || images.length >= maxImages}
      />
      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <ProfileImageDisplay
        images={images}
        active={active}
        onSelect={handleSelect}
        onDelete={handleDelete}
        placeholder={placeholder}
        showSubtitle={showHeader}
      />
      <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
        {images.length}/{maxImages} images uploaded
        {active &&
          ` • Active: ${images.indexOf(active) + 1} of ${images.length}`}
      </Typography>
    </Box>
  )
}
