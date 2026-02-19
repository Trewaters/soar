'use client'
import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react'
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
  CircularProgress,
  Card,
  CardMedia,
  IconButton,
  Snackbar,
} from '@mui/material'
import {
  CloudUpload as CloudUploadIcon,
  Save as SaveIcon,
  Warning as WarningIcon,
  WifiOff as WifiOffIcon,
} from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
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
  // eslint-disable-next-line no-unused-vars
  onStagedImagesChange?: (count: number) => void
  maxFileSize?: number // in MB
  acceptedTypes?: string[]
  variant?: 'button' | 'dropzone'
  poseId?: string
  poseName?: string
  shouldClearStaged?: boolean
  maxImages?: number
  currentCount?: number
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
function ImageUploadWithFallbackComponent(
  {
    onImageUploaded,
    onStagedImagesChange,
    maxFileSize = 10,
    acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    variant = 'button',
    poseId,
    poseName,
    shouldClearStaged = false,
    maxImages = 3,
    currentCount = 0,
  }: ImageUploadWithFallbackProps,
  ref: React.Ref<{ saveStagedImages: () => Promise<void> }>
) {
  const { data: session } = useSession()
  type StagedImage = { name: string; size: number; dataUrl: string }
  const [stagedImages, setStagedImages] = useState<StagedImage[]>([])
  const STAGED_KEY = 'soar:staged-asana-images'
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fallbackDialog, setFallbackDialog] = useState<FallbackDialogState>({
    open: false,
    error: '',
    file: null,
    altText: '',
    preview: null,
  })
  const [successMessage, setSuccessMessage] = useState<string>('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Expose saveStagedImages method via ref
  useImperativeHandle(
    ref,
    () => ({
      saveStagedImages: async (newPoseId?: string, newPoseName?: string) => {
        if (stagedImages.length === 0) return

        if (!session?.user?.id) {
          setError('Please ensure you are logged in')
          return
        }

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
            formData.append(
              'imageType',
              newPoseId || poseId || newPoseName || poseName
                ? 'pose'
                : 'gallery'
            )
            // Use provided poseId/poseName or fall back to component props
            if (newPoseId) {
              formData.append('poseId', newPoseId)
            } else if (poseId) {
              formData.append('poseId', poseId)
            }

            if (newPoseName) {
              formData.append('poseName', newPoseName)
            } else if (poseName) {
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
              data = {
                error: 'Network error occurred',
                canFallbackToLocal: true,
              }
            }

            if (!response.ok) {
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

          setSuccessMessage(`${stagedImages.length} images saved to assets`)
        } catch (error) {
          console.error('Batch upload error:', error)
          setError(
            error instanceof Error ? error.message : 'Failed to save images'
          )
        } finally {
          setUploading(false)
        }
      },
    }),
    [stagedImages, session, poseId, poseName, onImageUploaded]
  )

  // Initialize local storage for image operations
  React.useEffect(() => {
    const initStorage = async () => {
      try {
        await localImageStorage.init()
      } catch (error) {
        console.warn('Failed to initialize local storage:', error)
      }
    }
    initStorage()
  }, [])

  // Load staged images when creating a new asana (no poseId)
  React.useEffect(() => {
    if (poseId) return

    // Explicitly clear if requested
    if (shouldClearStaged) {
      setStagedImages([])
      try {
        localStorage.removeItem(STAGED_KEY)
      } catch (e) {}
      return
    }

    try {
      const raw = localStorage.getItem(STAGED_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as StagedImage[]
        setStagedImages(parsed)
      }
    } catch (e) {
      // ignore
    }
  }, [poseId, shouldClearStaged, onStagedImagesChange])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    // Global limit check
    if (activeCount >= maxImages) {
      setError(`Maximum of ${maxImages} images already reached`)
      return
    }

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

    setError(null)
  }

  const processSelectedFilesForStaging = async (files: File[]) => {
    // Check total count including existing staged images and already uploaded images
    const totalExisting = stagedImages.length + currentCount
    if (totalExisting >= maxImages) {
      setError(`Maximum of ${maxImages} images allowed for this asana`)
      return
    }

    // filter/validate and limit new files
    const valid: File[] = []
    const remainingSlots = maxImages - totalExisting

    for (const file of files) {
      if (valid.length >= remainingSlots) break
      if (!acceptedTypes.includes(file.type)) continue
      if (file.size > maxFileSize * 1024 * 1024) continue
      valid.push(file)
    }

    if (!valid.length) {
      if (files.length > maxImages - totalExisting) {
        setError(`Maximum of ${maxImages} images allowed for this asana`)
      }
      return
    }

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
      // Images now visible directly in dropzone - no need to open dialog
    } catch (e) {
      console.warn('Staging failed', e)
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
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // Clear success message
    setSuccessMessage('')
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
      const totalExisting = stagedImages.length + currentCount
      const remainingSlots = maxImages - totalExisting
      const validFiles = files
        .filter(
          (f) =>
            acceptedTypes.includes(f.type) &&
            f.size <= maxFileSize * 1024 * 1024
        )
        .slice(0, remainingSlots)

      if (validFiles.length > 0) {
        processSelectedFilesForStaging(validFiles)
        setSuccessMessage(
          `${validFiles.length} image${validFiles.length > 1 ? 's' : ''} will be added when you save the asana.`
        )
      }
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

    setError(null)

    // Show success feedback
    setSuccessMessage('Image ready to upload!')
  }

  const UploadButton = () => (
    <Button
      variant="contained"
      startIcon={<CloudUploadIcon />}
      onClick={() => fileInputRef.current?.click()}
      sx={{
        borderRadius: '12px',
        textTransform: 'none',
        fontWeight: 600,
      }}
    >
      Upload Image
    </Button>
  )

  const activeCount = stagedImages.length + currentCount

  // Rendered staged images component (reusable)
  const StagedImagesPreviews = () => (
    <>
      {!poseId && stagedImages.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: 2,
            }}
          >
            {stagedImages.map((s, i) => (
              <Card key={`staged-${i}`} sx={{ position: 'relative' }}>
                <Box sx={{ position: 'relative', paddingBottom: '100%' }}>
                  <CardMedia
                    component="img"
                    image={s.dataUrl}
                    alt={s.name}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      const next = stagedImages.filter((_, idx) => idx !== i)
                      setStagedImages(next)
                      try {
                        localStorage.setItem(STAGED_KEY, JSON.stringify(next))
                      } catch (e) {}
                    }}
                    sx={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      color: 'error.main',
                      '&:hover': {
                        bgcolor: 'error.main',
                        color: 'white',
                      },
                      zIndex: 1,
                      padding: '4px',
                    }}
                    size="small"
                    title="Remove image"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: 'block', mb: 2 }}
          >
            Staged images will be saved when you save this asana. Click the
            dropzone above to add more images.
          </Typography>
        </Box>
      )}
    </>
  )

  const DropzoneArea = () => (
    <Box>
      <Box
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => activeCount < maxImages && fileInputRef.current?.click()}
        sx={{
          border: '2px dashed',
          borderColor: activeCount >= maxImages ? 'grey.300' : 'primary.main',
          borderRadius: '12px',
          p: 4,
          textAlign: 'center',
          cursor: activeCount >= maxImages ? 'default' : 'pointer',
          transition: 'all 0.2s ease',
          backgroundColor: activeCount >= maxImages ? 'grey.50' : 'transparent',
          '&:hover':
            activeCount >= maxImages
              ? {}
              : {
                  borderColor: 'primary.dark',
                  backgroundColor: 'primary.light',
                  opacity: 0.8,
                },
        }}
      >
        <CloudUploadIcon
          sx={{
            fontSize: 48,
            color: activeCount >= maxImages ? 'grey.400' : 'primary.main',
            mb: 2,
          }}
        />
        <Typography
          variant="h6"
          color={activeCount >= maxImages ? 'text.secondary' : 'primary.main'}
          gutterBottom
        >
          {activeCount >= maxImages
            ? 'Maximum Images Reached'
            : `Upload Yoga Pose Image (${activeCount}/${maxImages})`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {activeCount >= maxImages
            ? `You have already added the maximum of ${maxImages} images.`
            : 'Drag and drop an image here, or click to select'}
        </Typography>
        {/* helper: allow multiple selection when creating a new asana */}
        {!poseId && activeCount < maxImages && (
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mt={1}
          >
            You can select multiple images (up to {maxImages} total) while
            creating a new asana. They will be staged locally until you save the
            asana.
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
      </Box>

      {/* Show staged images directly in the dropzone area */}
      <StagedImagesPreviews />
    </Box>
  )

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        multiple={!poseId}
        style={{ display: 'none' }}
      />

      {variant === 'button' ? <UploadButton /> : <DropzoneArea />}

      {/* Success Toast */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessMessage('')}
          severity="success"
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: '12px',
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Toast */}
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: '12px',
          }}
        >
          {error}
        </Alert>
      </Snackbar>

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

const ImageUploadWithFallback = forwardRef(ImageUploadWithFallbackComponent)
export default ImageUploadWithFallback
