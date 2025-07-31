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
}

export const ProfileImageManager: React.FC<ProfileImageManagerProps> = ({
  images,
  active,
  placeholder,
  onChange,
  onUpload,
  onDelete,
  onSelect,
  loading,
  maxImages = 3,
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
      <Typography variant="h6" sx={{ mb: 2 }}>
        Profile Images
      </Typography>
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
      />
      <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
        {images.length}/{maxImages} images uploaded
      </Typography>
    </Box>
  )
}
