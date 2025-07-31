import React, { useState } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import { ProfileImageDisplay } from './ProfileImageDisplay'
import { ProfileImageUpload } from './ProfileImageUpload'

interface ProfileImageManagerProps {
  images: string[]
  active: string | null
  placeholder: string
  onChange: (images: string[], active: string | null) => void
}

export const ProfileImageManager: React.FC<ProfileImageManagerProps> = ({
  images,
  active,
  placeholder,
  onChange,
}) => {
  const [loading, setLoading] = useState(false)

  const handleUpload = async (file: File) => {
    setLoading(true)
    // TODO: Implement upload logic (call API)
    setTimeout(() => setLoading(false), 1000)
  }

  const handleDelete = async (url: string) => {
    setLoading(true)
    // TODO: Implement delete logic (call API)
    setTimeout(() => setLoading(false), 1000)
  }

  const handleSelect = async (url: string) => {
    setLoading(true)
    // TODO: Implement set active logic (call API)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Profile Images
      </Typography>
      <ProfileImageUpload
        onUpload={handleUpload}
        disabled={loading || images.length >= 3}
      />
      {loading && <CircularProgress sx={{ mt: 2 }} />}
      <ProfileImageDisplay
        images={images}
        active={active}
        onSelect={handleSelect}
        onDelete={handleDelete}
        placeholder={placeholder}
      />
    </Box>
  )
}
