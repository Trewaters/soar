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
  Card,
  CardContent,
  CardMedia,
  IconButton,
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
  // eslint-disable-next-line no-unused-vars
  onImageUploaded?: (image: PoseImageData) => void
  // eslint-disable-next-line no-unused-vars
  onImageDeleted?: (imageId: string) => void
  maxFileSize?: number // in MB
  acceptedTypes?: string[]
  variant?: 'button' | 'dropzone'
  poseId?: string
  poseName?: string
}

interface FallbackDialogState {
  open: boolean
  error: string
  file: File | null
  altText: string
  preview: string | null
}

/**
 * ImageUploadWithFallback is a React component for uploading images with robust fallback support.
 *
 * This component allows users to upload images (JPEG, PNG, WebP) to a cloud endpoint, with automatic
 * fallback to local storage if the cloud upload fails (e.g., due to network issues or server errors).
 * It provides a user-friendly UI with drag-and-drop or button-based upload, image preview, alt text input,
 * and visual feedback for errors and upload progress.
 *
 * Features:
 * - Drag-and-drop or button-triggered file selection.
 * - File type and size validation.
 * - Image preview and automatic alt text suggestion.
 * - Upload to cloud with progress indication.
 * - Fallback dialog for saving images locally if cloud upload fails.
 * - Local storage quota and usage display.
 * - Accessibility-friendly alt text input.
 * - Debug information for development.
 *
 * @component
 * @param {ImageUploadWithFallbackProps} props - Component props.
 * @param {(image: any) => void} [props.onImageUploaded] - Callback invoked when an image is successfully uploaded (cloud or local).
 * @param {number} [props.maxFileSize=10] - Maximum allowed file size in MB.
 * @param {string[]} [props.acceptedTypes=['image/jpeg', 'image/png', 'image/webp']] - Accepted MIME types for image files.
 * @param {'button' | 'dropzone'} [props.variant='button'] - UI variant: 'button' for a button trigger, 'dropzone' for drag-and-drop area.
 *
 * @example
 * <ImageUploadWithFallback
 *   onImageUploaded={(img) => console.log('Uploaded:', img)}
 *   maxFileSize={5}
 *   acceptedTypes={['image/jpeg', 'image/png']}
 *   variant="dropzone"
 * />
 *
 * @remarks
 * Requires a valid user session (via useSession) and a localImageStorage utility for local fallback.
 * The component is designed for Next.js/React applications and uses Material UI for styling.
 */
export default function ImageUploadWithFallback({
  onImageUploaded,
  maxFileSize = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  variant = 'button',
  poseId,
  poseName,
}: ImageUploadWithFallbackProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  type StagedImage = { name: string; size: number; dataUrl: string }
  const [stagedImages, setStagedImages] = useState<StagedImage[]>([])
  const STAGED_KEY = 'soar:staged-asana-images'
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

  // Load staged images when creating a new asana (no poseId)
  React.useEffect(() => {
    if (poseId) return
    try {
      const raw = localStorage.getItem(STAGED_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as StagedImage[]
        setStagedImages(parsed)
      }
    } catch (e) {
      // ignore
    }
  }, [poseId])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    // If no poseId, allow selecting multiple files and stage them
    if (!poseId) {
      processSelectedFilesForStaging(files)
      return
    }

    const file = files[0]
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

  const processSelectedFilesForStaging = async (files: File[]) => {
    // filter/validate
    const valid: File[] = []
    for (const file of files) {
      if (!acceptedTypes.includes(file.type)) continue
      if (file.size > maxFileSize * 1024 * 1024) continue
      valid.push(file)
    }
    if (!valid.length) return

    try {
      const fileToDataUrl = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const fr = new FileReader()
          fr.onload = () => resolve(String(fr.result))
          fr.onerror = reject
          fr.readAsDataURL(file)
        })

      const converted = await Promise.all(
        valid.map(async (f) => {
          return {
            name: f.name,
            size: f.size,
            dataUrl: await fileToDataUrl(f),
          }
        })
      )

      const next = [...stagedImages, ...converted]
      setStagedImages(next)
      try {
        localStorage.setItem(STAGED_KEY, JSON.stringify(next))
      } catch (e) {}
    } catch (e) {
      console.warn('Staging failed', e)
    }
  }

  const handleCloudUpload = async () => {
    if (!session?.user?.id) {
      setError('Please ensure you are logged in')
      return
    }

    // If there are staged images (creating a new asana), upload them in sequence
    if (!selectedFile && stagedImages.length > 0) {
      setUploading(true)
      setError(null)

      const dataUrlToFile = (dataUrl: string, filename: string) => {
        const arr = dataUrl.split(',')
        const mimeMatch = arr[0].match(/:(.*?);/)
        const mime = mimeMatch ? mimeMatch[1] : 'image/png'
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8 = new Uint8Array(n)
        while (n--) u8[n] = bstr.charCodeAt(n)
        return new File([u8], filename, { type: mime })
      }

      try {
        for (const s of stagedImages) {
          const file = dataUrlToFile(s.dataUrl, s.name)

          const formData = new FormData()
          formData.append('file', file)
          formData.append('altText', '')
          formData.append('userId', session.user.email || '')
          formData.append('imageType', poseId || poseName ? 'pose' : 'gallery')
          if (poseId) formData.append('poseId', poseId)
          if (poseName) formData.append('poseName', poseName)

          const response = await fetch('/api/images/upload', {
            method: 'POST',
            body: formData,
          })

          let data: any
          try {
            data = await response.json()
          } catch (jsonError) {
            data = { error: 'Network error occurred', canFallbackToLocal: true }
          }

          if (!response.ok) {
            // If any upload fails, surface an error and stop batch
            setError(data?.error || 'Upload failed')
            throw new Error(data?.error || 'Upload failed')
          }

          onImageUploaded?.(data)
        }

        // All uploaded successfully: clear staged images
        setStagedImages([])
        try {
          localStorage.removeItem(STAGED_KEY)
        } catch (e) {}

        handleClose()
        return
      } catch (error) {
        console.error('Batch upload error:', error)
      } finally {
        setUploading(false)
      }
    }

    console.log('🚀 Starting cloud upload...', {
      fileName: selectedFile ? selectedFile.name : null,
      fileSize: selectedFile ? selectedFile.size : null,
      userId: session.user.id,
    })

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      if (selectedFile) {
        formData.append('file', selectedFile)
      }
      formData.append('altText', altText.trim() || '')
      formData.append('userId', session.user.email || '')
      formData.append('imageType', poseId || poseName ? 'pose' : 'gallery') // Tag as pose image if pose info provided

      // Add pose information if available
      if (poseId) {
        formData.append('poseId', poseId)
      }
      if (poseName) {
        formData.append('poseName', poseName)
      }

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
    const files = Array.from(event.dataTransfer.files || [])
    if (!files.length) return

    if (!poseId) {
      processSelectedFilesForStaging(files)
      return
    }

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
      {/* helper: allow multiple selection when creating a new asana */}
      {!poseId && (
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={1}
        >
          You can select multiple images at once while creating a new asana.
          They will be staged locally until you save the asana.
        </Typography>
      )}
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
                  multiple={!poseId}
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
                {/* Show staged previews when creating a new asana */}
                {!poseId && stagedImages.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">
                      Staged images (not yet saved)
                    </Typography>
                    <Box
                      sx={{ display: 'flex', gap: 2, mt: 1, overflowX: 'auto' }}
                    >
                      {stagedImages.map((s, i) => (
                        <Card key={`staged-${i}`} sx={{ minWidth: 160 }}>
                          <CardMedia
                            component="img"
                            height="120"
                            image={s.dataUrl}
                            alt={s.name}
                            sx={{ objectFit: 'cover' }}
                          />
                          <CardContent>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Box>
                                <Typography variant="body2" noWrap>
                                  {s.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {formatFileSize(s.size)}
                                </Typography>
                              </Box>
                              <IconButton
                                onClick={() => {
                                  const next = stagedImages.filter(
                                    (_, idx) => idx !== i
                                  )
                                  setStagedImages(next)
                                  try {
                                    localStorage.setItem(
                                      STAGED_KEY,
                                      JSON.stringify(next)
                                    )
                                  } catch (e) {}
                                }}
                                color="error"
                                size="small"
                              >
                                <StorageIcon />
                              </IconButton>
                            </Stack>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}
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
            disabled={!(selectedFile || stagedImages.length > 0) || uploading}
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
