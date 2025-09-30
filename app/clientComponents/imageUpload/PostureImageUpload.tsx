'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
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
  Chip,
  LinearProgress,
  Snackbar,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useSession } from 'next-auth/react'
import { uploadPoseImage } from '@lib/imageService'
import { getImageUploadStatus, ImageStatus } from '../../../lib/imageStatus'

export interface PoseImageData {
  id: string
  url: string
  altText?: string | null
  fileName?: string | null
  fileSize?: number | null
  uploadedAt: string
  remainingSlots?: number
  totalImages?: number
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
 * @property showSlotInfo - Optional flag to show remaining upload slots information.
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
  showSlotInfo?: boolean
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
  showSlotInfo = true,
}: PostureImageUploadProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [stagedImages, setStagedImages] = useState<
    {
      name: string
      size: number
      dataUrl: string
    }[]
  >([])
  // Key used to persist staged images while creating a new asana
  const STAGED_KEY = 'soar:staged-asana-images'
  const [altText, setAltText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [imageStatus, setImageStatus] = useState<ImageStatus | null>(null)
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadImageStatus = useCallback(async () => {
    // Use the session user's email as the canonical identifier for ownership checks
    if (!postureId || !session?.user?.email) return

    try {
      const result = await getImageUploadStatus(postureId, session.user.email)
      if (result.error) {
        console.warn('Failed to load image status:', result.error)
      } else {
        setImageStatus(result.status)
      }
    } catch (error) {
      console.warn('Error loading image status:', error)
    }
  }, [postureId, session?.user?.email])

  // Load image status when component mounts or postureId changes
  useEffect(() => {
    if (postureId && session?.user?.email && showSlotInfo) {
      loadImageStatus()
    }
  }, [postureId, session?.user?.email, showSlotInfo, loadImageStatus])

  // Load any staged images from localStorage when creating a new asana
  useEffect(() => {
    if (postureId) return
    try {
      const raw = localStorage.getItem(STAGED_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as {
          name: string
          size: number
          dataUrl: string
        }[]
        setStagedImages(parsed)
      }
    } catch (e) {
      // ignore
    }
  }, [postureId])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    // Respect remaining slots
    const maxToAdd = imageStatus ? imageStatus.remainingSlots : files.length
    const filesToAdd = files.slice(0, maxToAdd)
    processFiles(filesToAdd)
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select file(s)')
      return
    }

    // If postureId is not provided (creating a new asana), stage locally
    if (!postureId) {
      try {
        setUploading(true)
        // convert files to data URLs and persist to localStorage
        const fileToDataUrl = (file: File) =>
          new Promise<string>((resolve, reject) => {
            const fr = new FileReader()
            fr.onload = () => resolve(String(fr.result))
            fr.onerror = reject
            fr.readAsDataURL(file)
          })

        const converted = await Promise.all(
          selectedFiles.map(async (file) => ({
            name: file.name,
            size: file.size,
            dataUrl: await fileToDataUrl(file),
          }))
        )

        const next = [...stagedImages, ...converted]
        setStagedImages(next)
        try {
          localStorage.setItem(STAGED_KEY, JSON.stringify(next))
        } catch (e) {
          // ignore storage failures
        }

        setSuccessMessage(`${converted.length} image(s) staged locally.`)
        setShowSuccessSnackbar(true)
        // clear selection (but keep staged)
        setSelectedFiles([])
        setPreviews([])
        setAltText('')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Staging failed')
      } finally {
        setUploading(false)
      }

      return
    }

    if (!session?.user?.email) {
      setError('Please ensure you are logged in')
      return
    }

    // Check if upload is allowed
    if (imageStatus && !imageStatus.canUpload) {
      setError(
        `Upload limit reached. You can only upload ${imageStatus.maxAllowed} image(s) for this asana.`
      )
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const total = selectedFiles.length
      let completed = 0
      for (const file of selectedFiles) {
        // Optionally simulate small progress jump between files
        setUploadProgress((completed / total) * 100)

        const uploadedImage = await uploadPoseImage({
          file,
          altText: altText.trim() || undefined,
          userId: session.user.email,
          postureId,
          postureName,
        })

        completed += 1
        setUploadProgress((completed / total) * 100)

        onImageUploaded?.(uploadedImage)
      }

      setUploadProgress(100)

      const remainingSlots = imageStatus
        ? Math.max(
            0,
            imageStatus.maxAllowed -
              imageStatus.currentCount -
              selectedFiles.length
          )
        : 0

      setSuccessMessage(
        `Image(s) uploaded successfully! ${remainingSlots > 0 ? `${remainingSlots} slot${remainingSlots === 1 ? '' : 's'} remaining.` : 'Upload limit reached.'}`
      )
      setShowSuccessSnackbar(true)

      // Reload image status after successful upload
      await loadImageStatus()

      // Auto-close dialog after short delay for better UX
      setTimeout(() => {
        handleClose()
      }, 1000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed')
      setUploadProgress(0)
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedFiles([])
    setPreviews([])
    setAltText('')
    setError(null)
    setUploadProgress(0)
    setShowSuccessSnackbar(false)
    setSuccessMessage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Backwards-compatible single file processing removed (use processFiles)

  const processFiles = (files: File[]) => {
    const valid: File[] = []
    const newPreviews: string[] = []

    for (const file of files) {
      if (!acceptedTypes.includes(file.type)) {
        setError(
          `Invalid file type. Please select: ${acceptedTypes
            .map((type) => type.split('/')[1])
            .join(', ')}`
        )
        continue
      }

      if (file.size > maxFileSize * 1024 * 1024) {
        setError(`File too large. Maximum size is ${maxFileSize}MB`)
        continue
      }

      valid.push(file)
      try {
        newPreviews.push(URL.createObjectURL(file))
      } catch (e) {
        newPreviews.push('')
      }
    }

    if (valid.length === 0) return

    setSelectedFiles((prev) => [...prev, ...valid])
    setPreviews((prev) => [...prev, ...newPreviews])
    setError(null)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files || [])
    if (!files.length) return

    const maxToAdd = imageStatus ? imageStatus.remainingSlots : files.length
    const filesToAdd = files.slice(0, maxToAdd)
    processFiles(filesToAdd)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleFileInputClick = () => {
    fileInputRef.current?.click()
  }

  const removeSelectedFile = (index?: number) => {
    // remove single or all
    if (typeof index === 'number') {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
      setPreviews((prev) => prev.filter((_, i) => i !== index))
    } else {
      setSelectedFiles([])
      setPreviews([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Render slot information
  const renderSlotInfo = () => {
    if (!showSlotInfo || !imageStatus || !imageStatus.isUserCreated) {
      return null
    }

    const { currentCount, remainingSlots, maxAllowed, canUpload } = imageStatus

    return (
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <InfoIcon color="info" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {currentCount} of {maxAllowed} images uploaded
          </Typography>
          {remainingSlots > 0 && (
            <Chip
              label={`${remainingSlots} slot${remainingSlots === 1 ? '' : 's'} remaining`}
              color="success"
              size="small"
              variant="outlined"
            />
          )}
          {remainingSlots === 0 && (
            <Chip
              label="Upload limit reached"
              color="warning"
              size="small"
              variant="outlined"
            />
          )}
        </Stack>
        {!canUpload && (
          <Alert severity="info" sx={{ mt: 1 }}>
            You can upload up to {maxAllowed} images for user-created asanas.
            {remainingSlots === 0 &&
              ' Delete an existing image to upload a new one.'}
          </Alert>
        )}
      </Box>
    )
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

          {/* Render slot information */}
          {renderSlotInfo()}

          <Typography variant="body2" color="text.secondary">
            Drag and drop an image here, or click to select
          </Typography>
          {/* Helper text: multi-select available when creating a new asana */}
          {!imageStatus && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              You can select multiple images at once while creating a new asana.
              They&apos;ll be staged locally until you save the asana.
            </Typography>
          )}
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
          // Allow multiple selection when creating a new asana (imageStatus undefined)
          // or when there are more than 1 remaining slots. This makes the input
          // usable for batch uploads during creation.
          multiple={imageStatus ? imageStatus.remainingSlots > 1 : true}
          style={{ display: 'none' }}
        />

        {selectedFiles.length > 0 && (
          <Box sx={{ mt: 2, display: 'grid', gap: 2 }}>
            {selectedFiles.map((file, idx) => (
              <Card key={`${file.name}-${file.size}-${idx}`}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CloudUploadIcon color="primary" />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" noWrap>
                        {file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(file.size)}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() => removeSelectedFile(idx)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            ))}

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
                {uploading
                  ? 'Uploading...'
                  : `Upload ${selectedFiles.length} Image${selectedFiles.length === 1 ? '' : 's'}`}
              </Button>
              <Button variant="outlined" onClick={() => removeSelectedFile()}>
                Cancel
              </Button>
            </Box>

            {uploading && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Uploading... {Math.round(uploadProgress)}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
            )}

            {/* Show staged previews when creating a new asana */}
            {!postureId && stagedImages.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">
                  Staged images (not yet saved)
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1, overflowX: 'auto' }}>
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
                              } catch (e) {
                                /* ignore */
                              }
                            }}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}

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
        disabled={!session || (imageStatus ? !imageStatus.canUpload : false)}
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
            {/* Render slot information */}
            {renderSlotInfo()}

            <Box
              onClick={handleFileInputClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              sx={{
                border: '2px dashed',
                borderColor:
                  selectedFiles.length > 0 ? 'success.main' : 'grey.400',
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
                {selectedFiles.length > 0
                  ? `${selectedFiles.length} file${selectedFiles.length === 1 ? '' : 's'} selected`
                  : 'Choose file or drag here'}
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
              // When imageStatus is not yet available (e.g. new asana), allow
              // multiple file selection so creators can pick several images at once.
              multiple={imageStatus ? imageStatus.remainingSlots > 1 : true}
              style={{ display: 'none' }}
            />

            {previews.length > 0 && (
              <Box sx={{ display: 'grid', gap: 2 }}>
                {previews.map((p, idx) => (
                  <Card key={`preview-${idx}`}>
                    {p ? (
                      <CardMedia
                        component="img"
                        height="200"
                        image={p}
                        alt={`Preview ${idx + 1}`}
                        sx={{ objectFit: 'contain' }}
                      />
                    ) : null}
                    <CardContent>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="body2">
                            {selectedFiles[idx]?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {selectedFiles[idx] &&
                              formatFileSize(selectedFiles[idx].size)}
                          </Typography>
                        </Box>
                        <IconButton
                          onClick={() => removeSelectedFile(idx)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}

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

            {uploading && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Uploading... {Math.round(uploadProgress)}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{ height: 8, borderRadius: 1 }}
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
            disabled={
              selectedFiles.length === 0 ||
              uploading ||
              (imageStatus ? !imageStatus.canUpload : false)
            }
            startIcon={
              uploading ? <CircularProgress size={16} /> : <CloudUploadIcon />
            }
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccessSnackbar(false)}
          severity="success"
          variant="filled"
          icon={<CheckCircleIcon />}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
