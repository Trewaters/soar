'use client'
import React, { useState, useRef } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Stack,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSession } from 'next-auth/react'
import { uploadPoseImage } from '@lib/imageService'

export interface PoseImageData {
  id: string
  url: string
  altText?: string | null
  fileName?: string | null
  fileSize?: number | null
  uploadedAt: string
}

interface ImageUploadProps {
  onImageUploaded?: (image: PoseImageData) => void
  onImageDeleted?: (imageId: string) => void
  maxFileSize?: number // in MB
  acceptedTypes?: string[]
  variant?: 'button' | 'dropzone'
}

export default function ImageUpload({
  onImageUploaded,
  onImageDeleted,
  maxFileSize = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  variant = 'button',
}: ImageUploadProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [altText, setAltText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    processFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !session?.user?.id) {
      setError('Please select a file and ensure you are logged in')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const uploadedImage = await uploadPoseImage({
        file: selectedFile,
        altText: altText.trim() || undefined,
        userId: session.user.id,
      })

      onImageUploaded?.(uploadedImage)
      handleClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedFile(null)
    setPreview(null)
    setAltText('')
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      processFile(file)
    }
  }

  const UploadButton = () => (
    <Button
      variant="contained"
      startIcon={<CloudUploadIcon />}
      onClick={() => setOpen(true)}
      sx={{
        borderRadius: '12px',
        textTransform: 'none',
        fontWeight: 600,
      }}
    >
      Upload Image
    </Button>
  )

  // const handleDrop = (event: React.DragEvent) => {
  //   event.preventDefault()
  //   const files = event.dataTransfer.files
  //   if (files.length > 0) {
  //     const file = files[0]
  //     // Process dropped file directly
  //     processFile(file)
  //   }
  // }

  const processFile = (file: File) => {
    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError(
        `Invalid file type. Please select: ${acceptedTypes
          .map((type) => type.split('/')[1])
          .join(', ')}`
      )
      return
    }

    // Validate file size
    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`File size must be less than ${maxFileSize}MB`)
      return
    }

    setSelectedFile(file)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Auto-generate alt text from filename
    const baseName = file.name.split('.')[0]
    setAltText(baseName.replace(/[-_]/g, ' '))
  }

  const DropzoneArea = () => (
    <Box
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => setOpen(true)}
      sx={{
        border: '2px dashed',
        borderColor: 'grey.300',
        borderRadius: '12px',
        p: 6,
        textAlign: 'center',
        cursor: 'pointer',
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.dark',
          backgroundColor: 'primary.light',
          opacity: 0.8,
        },
      }}
    >
      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
      <Typography variant="h6" color="primary.main" gutterBottom>
        Upload Yoga Pose Image
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Drag and drop an image here, or click to select
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        mt={1}
      >
        Supported: JPEG, PNG, WebP (max {maxFileSize}MB)
      </Typography>
    </Box>
  )

  return (
    <>
      {variant === 'button' ? <UploadButton /> : <DropzoneArea />}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '12px' },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" component="h2">
            Upload Yoga Pose Image
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {!selectedFile ? (
              <Box>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={acceptedTypes.join(',')}
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <Box
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    borderRadius: '8px',
                    p: 6,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'grey.50',
                    },
                  }}
                >
                  <CloudUploadIcon
                    sx={{ fontSize: 64, color: 'grey.400', mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    Choose or drag an image
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supported formats:{' '}
                    {acceptedTypes.map((type) => type.split('/')[1]).join(', ')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Maximum size: {maxFileSize}MB
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box>
                <Card sx={{ mb: 2 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={preview || ''}
                    alt="Preview"
                    sx={{ objectFit: 'contain' }}
                  />
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          {selectedFile.name}
                        </Typography>
                        <Chip
                          label={`${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      <IconButton
                        onClick={() => {
                          setSelectedFile(null)
                          setPreview(null)
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ''
                          }
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>

                <TextField
                  fullWidth
                  label="Alt Text (for accessibility)"
                  placeholder="Describe the yoga pose..."
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  multiline
                  rows={2}
                  helperText="Provide a brief description of the pose for screen readers and SEO"
                />
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!selectedFile || uploading}
            startIcon={
              uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />
            }
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
