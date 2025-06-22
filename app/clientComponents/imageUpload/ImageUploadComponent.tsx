'use client'
import React, { useState, useRef } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  IconButton,
} from '@mui/material'
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Image as ImageIcon,
} from '@mui/icons-material'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface ImageUploadProps {
  onUploadSuccess?: (imageData: UploadedImageData) => void
  onClose?: () => void
  open?: boolean
}

interface UploadedImageData {
  id: string
  url: string
  altText?: string
  fileName?: string
  fileSize?: number
  uploadedAt: string
}

export default function ImageUploadComponent({
  onUploadSuccess,
  onClose,
  open = false,
}: ImageUploadProps) {
  const { data: session } = useSession()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [altText, setAltText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }

      setSelectedFile(file)
      setError(null)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !session?.user?.id) {
      setError('Please select a file and ensure you are logged in')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('altText', altText)
      formData.append('userId', session.user.id)

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const uploadedImage: UploadedImageData = await response.json()

      // Reset form
      setSelectedFile(null)
      setAltText('')
      setPreviewUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Call success callback
      onUploadSuccess?.(uploadedImage)

      // Close dialog if controlled
      onClose?.()
    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null)
      setAltText('')
      setPreviewUrl(null)
      setError(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onClose?.()
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ImageIcon color="primary" />
          <Typography variant="h6">Upload Yoga Pose Image</Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={uploading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* File Selection Area */}
          <Paper
            sx={{
              border: '2px dashed',
              borderColor: selectedFile ? 'primary.main' : 'grey.300',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
            onClick={handleButtonClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            {previewUrl && typeof previewUrl === 'string' ? (
              <Box sx={{ position: 'relative' }}>
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={200}
                  height={200}
                  style={{
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {selectedFile?.name}
                </Typography>
              </Box>
            ) : (
              <Box>
                <CloudUploadIcon
                  sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Click to select an image
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supports: JPG, PNG, GIF, WebP (Max 10MB)
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Alt Text Input */}
          <TextField
            label="Image Description (Alt Text)"
            placeholder="Describe this yoga pose for accessibility..."
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            multiline
            rows={3}
            fullWidth
            helperText="This helps make your image accessible to screen readers"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} disabled={uploading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          variant="contained"
          startIcon={
            uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />
          }
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
