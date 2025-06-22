'use client'
import React, { useState, useRef } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Stack,
  Alert,
  Paper,
  TextField,
  CircularProgress,
  Chip,
  LinearProgress,
} from '@mui/material'
import {
  CloudUpload as CloudUploadIcon,
  Save as SaveIcon,
  Warning as WarningIcon,
  WifiOff as WifiOffIcon,
  Storage as StorageIcon,
} from '@mui/icons-material'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import {
  localImageStorage,
  formatFileSize,
  type LocalImageData,
} from '../../../lib/localImageStorage'

export interface PoseImageData {
  id: string
  url: string
  altText?: string | null
  fileName?: string | null
  fileSize?: number | null
  uploadedAt: string
  storageType?: 'CLOUD' | 'LOCAL' | 'HYBRID'
  isOffline?: boolean
  localStorageId?: string | null
}

interface ImageUploadWithFallbackProps {
  onImageUploaded?: (image: PoseImageData) => void
  onImageDeleted?: (imageId: string) => void
  maxFileSize?: number // in MB
  acceptedTypes?: string[]
  variant?: 'button' | 'dropzone'
}

interface FallbackDialogState {
  open: boolean
  error: string
  file: File | null
  altText: string
  preview: string | null
}

export default function ImageUploadWithFallback({
  onImageUploaded,
  maxFileSize = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  variant = 'button',
}: ImageUploadWithFallbackProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [altText, setAltText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fallbackDialog, setFallbackDialog] = useState<FallbackDialogState>({
    open: false,
    error: '',
    file: null,
    altText: '',
    preview: null,
  })

  // Add console log to track fallback dialog state changes
  React.useEffect(() => {
    console.log('🔄 Fallback dialog state changed:', {
      open: fallbackDialog.open,
      error: fallbackDialog.error,
      hasFile: !!fallbackDialog.file,
      hasPreview: !!fallbackDialog.preview,
    })
  }, [fallbackDialog])
  const [storageInfo, setStorageInfo] = useState<{
    available: number
    quota: number
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize local storage and check available space
  React.useEffect(() => {
    const initStorage = async () => {
      try {
        await localImageStorage.init()
        const info = await localImageStorage.getStorageInfo()
        setStorageInfo(info)
      } catch (error) {
        console.warn('Failed to initialize local storage:', error)
      }
    }
    initStorage()
  }, [])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

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

  const handleCloudUpload = async () => {
    if (!selectedFile || !session?.user?.id) {
      setError('Please select a file and ensure you are logged in')
      return
    }

    console.log('🚀 Starting cloud upload...', {
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      userId: session.user.id,
    })

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('altText', altText.trim() || '')
      formData.append('userId', session.user.id)

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      })

      let data: any
      try {
        data = await response.json()
      } catch (jsonError) {
        // If JSON parsing fails, treat as a network error eligible for fallback
        console.error('❌ Failed to parse response JSON:', jsonError)
        data = {
          error: 'Network error occurred',
          canFallbackToLocal: true,
          details:
            'Failed to communicate with cloud storage. You can save this image locally instead.',
        }
      }

      console.log('� Upload API Response:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        data,
      })

      // SUCCESS: Cloud upload worked
      if (response.ok) {
        console.log('✅ Cloud upload successful!')
        onImageUploaded?.(data)
        handleClose()
        return
      }

      // FAILURE: Cloud upload failed
      console.log('❌ Cloud upload failed with status:', response.status)

      // Check if we should offer fallback
      const shouldOfferFallback = data && data.canFallbackToLocal === true
      console.log('🔍 Fallback check:', {
        hasData: !!data,
        canFallbackValue: data?.canFallbackToLocal,
        shouldOfferFallback,
      })

      if (shouldOfferFallback) {
        console.log('✅ Showing fallback dialog...')
        setFallbackDialog({
          open: true,
          error: data.error || 'Cloud upload failed',
          file: selectedFile,
          altText: altText,
          preview: preview,
        })
        setUploading(false)
        return
      } else {
        console.log('❌ No fallback available, throwing error')
        throw new Error(data?.error || 'Upload failed')
      }
    } catch (error) {
      console.error('❌ Upload error caught:', error)

      // For network errors, offer fallback
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.log('🌐 Network error detected, showing fallback dialog')
        setFallbackDialog({
          open: true,
          error: 'Network connection failed',
          file: selectedFile,
          altText: altText,
          preview: preview,
        })
      } else {
        // For other errors, show as regular error
        setError(error instanceof Error ? error.message : 'Upload failed')
      }
    } finally {
      setUploading(false)
    }
  }

  const handleLocalSave = async () => {
    if (!fallbackDialog.file || !session?.user?.id) {
      return
    }

    try {
      setUploading(true)

      // Check if there's enough space
      const hasSpace = await localImageStorage.hasSpaceFor(
        fallbackDialog.file.size
      )
      if (!hasSpace) {
        setError('Not enough local storage space available')
        return
      }

      // Store image locally
      const localImage: LocalImageData = await localImageStorage.storeImage(
        fallbackDialog.file,
        session.user.id,
        fallbackDialog.altText.trim() || undefined
      )

      // Save metadata to database
      const response = await fetch('/api/images/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          localStorageId: localImage.id,
          fileName: localImage.fileName,
          fileSize: localImage.fileSize,
          altText: localImage.altText,
          url: `local://${localImage.id}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save local image metadata')
      }

      const savedImage = await response.json()

      // Update storage info
      const info = await localImageStorage.getStorageInfo()
      setStorageInfo(info)

      onImageUploaded?.(savedImage)
      handleClose()
      closeFallbackDialog()
    } catch (error) {
      console.error('Local save error:', error)
      setError(
        error instanceof Error ? error.message : 'Failed to save locally'
      )
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

  const closeFallbackDialog = () => {
    setFallbackDialog({
      open: false,
      error: '',
      file: null,
      altText: '',
      preview: null,
    })
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]

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

  const DropzoneArea = () => (
    <Box
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => setOpen(true)}
      sx={{
        border: '2px dashed',
        borderColor: 'primary.main',
        borderRadius: '12px',
        p: 4,
        textAlign: 'center',
        cursor: 'pointer',
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
      {storageInfo && (
        <Chip
          icon={<StorageIcon />}
          label={`Local: ${formatFileSize(storageInfo.available)} available`}
          size="small"
          variant="outlined"
          sx={{ mt: 1 }}
        />
      )}
    </Box>
  )

  return (
    <>
      {variant === 'button' ? <UploadButton /> : <DropzoneArea />}

      {/* Debug Info */}
      <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          🔍 Debug Info:
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          • Fallback Dialog Open: {fallbackDialog.open ? '✅ YES' : '❌ NO'}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          • Error: {fallbackDialog.error || 'none'}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          • Has File: {fallbackDialog.file ? '✅ YES' : '❌ NO'}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          • Session: {session?.user?.id ? '✅ Logged in' : '❌ Not logged in'}
        </Typography>
      </Box>

      {/* Main Upload Dialog */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloudUploadIcon color="primary" />
            <Typography variant="h5">Upload Yoga Pose Image</Typography>
          </Box>
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
                <Paper
                  sx={{
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CloudUploadIcon
                    sx={{ fontSize: 48, color: 'grey.400', mb: 2 }}
                  />
                  <Typography variant="body1" color="text.secondary">
                    Click to select an image
                  </Typography>
                </Paper>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                {preview && typeof preview === 'string' && (
                  <Image
                    src={preview}
                    alt="Preview"
                    width={200}
                    height={200}
                    style={{
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                )}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </Typography>
              </Box>
            )}

            {selectedFile && (
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
            )}

            {storageInfo && (
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Local Storage Available:{' '}
                  {formatFileSize(storageInfo.available)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    ((storageInfo.quota - storageInfo.available) /
                      storageInfo.quota) *
                    100
                  }
                  sx={{ mt: 1 }}
                />
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="inherit" disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleCloudUpload}
            variant="contained"
            disabled={!selectedFile || uploading}
            startIcon={
              uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />
            }
          >
            {uploading ? 'Uploading...' : 'Upload to Cloud'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fallback Dialog */}
      <Dialog
        open={fallbackDialog.open}
        onClose={closeFallbackDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '12px' },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="warning" />
            <Typography variant="h6">Upload Failed</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3}>
            <Alert severity="warning" icon={<WifiOffIcon />}>
              <Typography variant="body2">
                <strong>Cloud upload failed:</strong> {fallbackDialog.error}
              </Typography>
            </Alert>

            {fallbackDialog.preview &&
              typeof fallbackDialog.preview === 'string' && (
                <Box sx={{ textAlign: 'center' }}>
                  <Image
                    src={fallbackDialog.preview}
                    alt="Preview"
                    width={150}
                    height={150}
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
                    {fallbackDialog.file?.name} (
                    {formatFileSize(fallbackDialog.file?.size || 0)})
                  </Typography>
                </Box>
              )}

            <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography
                variant="body2"
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
              >
                <SaveIcon fontSize="small" />
                <strong>Save Locally Instead?</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your image will be saved on this device and automatically
                uploaded to the cloud when the connection is restored.
              </Typography>
              {storageInfo && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Available space: {formatFileSize(storageInfo.available)}
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={closeFallbackDialog}
            color="inherit"
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLocalSave}
            variant="contained"
            color="warning"
            disabled={uploading}
            startIcon={
              uploading ? <CircularProgress size={20} /> : <SaveIcon />
            }
          >
            {uploading ? 'Saving...' : 'Save Locally'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
