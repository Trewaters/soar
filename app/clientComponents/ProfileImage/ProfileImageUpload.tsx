import React, { useRef, useState } from 'react'
import { Box, Button, Typography, Alert } from '@mui/material'

interface ProfileImageUploadProps {
  onUpload: (file: File) => Promise<void>
  disabled?: boolean
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  onUpload,
  disabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Only JPEG and PNG images are allowed.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be under 2MB.')
      return
    }
    try {
      await onUpload(file)
      if (inputRef.current) inputRef.current.value = ''
    } catch (err: any) {
      setError(err.message || 'Upload failed.')
    }
  }

  return (
    <Box>
      <Button
        variant="contained"
        component="label"
        disabled={disabled}
        aria-label="Upload profile image"
      >
        Upload Image
        {/* keep input in DOM but visually hidden so user-event can target it directly */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          style={{ display: 'none' }}
          aria-label="Upload Image"
          onChange={handleFileChange}
        />
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
        JPEG/PNG, max 2MB, up to 3 images
      </Typography>
    </Box>
  )
}
