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

/**
 * Props for the `PostureImageUpload` component.
 *
 * @property onImageUploaded - Optional callback invoked when an image is successfully uploaded. Receives the uploaded image data as a parameter.
 * @property onImageDeleted - Optional callback invoked when an image is deleted. Receives the ID of the deleted image.
 * @property maxFileSize - Optional maximum file size allowed for uploads, in megabytes (MB).
 * @property acceptedTypes - Optional array of accepted MIME types for image uploads (e.g., ['image/jpeg', 'image/png']).
 * @property variant - Optional UI variant for the upload component. Can be either `'button'` or `'dropzone'`.
 * @property postureId - Optional identifier for the posture associated with the image upload.
 * @property postureName - Optional name of the posture associated with the image upload.
 */
interface PostureImageUploadProps {
  // eslint-disable-next-line no-unused-vars
  onImageUploaded?: (image: PoseImageData) => void
  // eslint-disable-next-line no-unused-vars
  onImageDeleted?: (imageId: string) => void
  maxFileSize?: number // in MB
  acceptedTypes?: string[]
  variant?: 'button' | 'dropzone'
  postureId?: string
  postureName?: string
}

/**
 * A React component for uploading images associated with a specific asana posture.
 *
 * Supports both "button" and "dropzone" variants for file selection, drag-and-drop,
 * file type and size validation, image preview, alt text input for accessibility,
 * and error handling. Integrates with user session and associates the uploaded image
 * with a posture by ID and name.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {(image: UploadedImage) => void} [props.onImageUploaded] - Callback invoked after a successful upload with the uploaded image data.
 * @param {number} [props.maxFileSize=10] - Maximum allowed file size in MB.
 * @param {string[]} [props.acceptedTypes=['image/jpeg', 'image/png', 'image/webp']] - Accepted MIME types for image files.
 * @param {'button' | 'dropzone'} [props.variant='button'] - UI variant for the uploader.
 * @param {string} props.postureId - The ID of the posture to associate the image with.
 * @param {string} props.postureName - The name of the posture for display and accessibility.
 *
 * @returns {JSX.Element} The image upload UI.
 *
 * @example
 * <PostureImageUpload
 *   postureId="123"
 *   postureName="Downward Dog"
 *   onImageUploaded={(img) => console.log(img)}
 *   variant="dropzone"
 * />
 */
export default function PostureImageUpload({
  onImageUploaded,
  maxFileSize = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  variant = 'button',
  postureId,
  postureName,
}: PostureImageUploadProps) {
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
      // Include posture association in upload
      const uploadedImage = await uploadPoseImage({
        file: selectedFile,
        altText: altText.trim() || undefined,
        userId: session.user.id,
        postureId,
        postureName,
      })

      console.log('Image uploaded and associated with posture:', {
        imageId: uploadedImage.id,
        postureId,
        postureName,
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
      setError(`File too large. Maximum size is ${maxFileSize}MB`)
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
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleFileInputClick = () => {
    fileInputRef.current?.click()
  }

  const removeSelectedFile = () => {
    setSelectedFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (variant === 'dropzone') {
    return (
      <>
        <Box
          onClick={handleFileInputClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          sx={{
            border: '2px dashed',
            borderColor: 'primary.main',
            borderRadius: '16px',
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: 'background.default',
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
          <CloudUploadIcon
            sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}
          />
          <Typography variant="h6" color="primary.main" gutterBottom>
            Upload Yoga Pose Image
            {postureName && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                for {postureName}
              </Typography>
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drag and drop an image here, or click to select
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, opacity: 0.7 }}
          >
            Supported:{' '}
            {acceptedTypes.map((type) => type.split('/')[1]).join(', ')} • Max:{' '}
            {maxFileSize}MB
          </Typography>
        </Box>

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {selectedFile && (
          <Box sx={{ mt: 2 }}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <CloudUploadIcon color="primary" />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" noWrap>
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(selectedFile.size)}
                    </Typography>
                  </Box>
                  <IconButton onClick={removeSelectedFile} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>

            <TextField
              fullWidth
              label="Alt Text (for accessibility)"
              placeholder={`Describe the yoga pose ${postureName ? `for ${postureName}` : ''}...`}
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              multiline
              rows={2}
              sx={{ mt: 2 }}
              helperText="Provide a brief description of the pose for screen readers and SEO"
            />

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={uploading}
                startIcon={
                  uploading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <CloudUploadIcon />
                  )
                }
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
              <Button variant="outlined" onClick={removeSelectedFile}>
                Cancel
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        )}
      </>
    )
  }

  // Button variant
  return (
    <>
      <Button
        variant="contained"
        startIcon={<CloudUploadIcon />}
        onClick={() => setOpen(true)}
        disabled={!session}
      >
        Upload Image
        {postureName && ` for ${postureName}`}
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Upload Yoga Pose Image
          {postureName && (
            <Typography variant="body2" color="text.secondary">
              for {postureName}
            </Typography>
          )}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3}>
            <Box
              onClick={handleFileInputClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              sx={{
                border: '2px dashed',
                borderColor: selectedFile ? 'success.main' : 'grey.400',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: 'grey.50',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              <CloudUploadIcon
                sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }}
              />
              <Typography variant="body1" gutterBottom>
                {selectedFile ? 'File selected' : 'Choose file or drag here'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {acceptedTypes.map((type) => type.split('/')[1]).join(', ')} •
                Max {maxFileSize}MB
              </Typography>
            </Box>

            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes.join(',')}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            {preview && (
              <Box>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={preview}
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
                        <Typography variant="body2">
                          {selectedFile?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {selectedFile && formatFileSize(selectedFile.size)}
                        </Typography>
                      </Box>
                      <IconButton onClick={removeSelectedFile} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>

                <TextField
                  fullWidth
                  label="Alt Text (for accessibility)"
                  placeholder={`Describe the yoga pose ${postureName ? `for ${postureName}` : ''}...`}
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  multiline
                  rows={2}
                  helperText="Provide a brief description of the pose for screen readers and SEO"
                />
              </Box>
            )}

            {error && <Alert severity="error">{error}</Alert>}
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
              uploading ? <CircularProgress size={16} /> : <CloudUploadIcon />
            }
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
