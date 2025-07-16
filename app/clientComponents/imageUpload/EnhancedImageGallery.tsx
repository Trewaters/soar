'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Grid2,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Fab,
  Tooltip,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  ZoomIn as ZoomInIcon,
  CloudOff as CloudOffIcon,
  Cloud as CloudIcon,
  MoreVert as MoreVertIcon,
  Sync as SyncIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import {
  localImageStorage,
  formatFileSize,
  isLocalImageId,
  type LocalImageData,
} from '../../../lib/localImageStorage'
import ImageUploadWithFallback from './ImageUploadWithFallback'

// Simple placeholder image data URL (1x1 gray pixel)
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='

interface PoseImage {
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

interface ImageGalleryResponse {
  images: PoseImage[]
  total: number
  hasMore: boolean
}

interface CombinedImage extends PoseImage {
  localData?: LocalImageData
  displayUrl: string
}

export default function EnhancedImageGallery() {
  const { data: session, status } = useSession()
  const [images, setImages] = useState<CombinedImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<CombinedImage | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<CombinedImage | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncResults, setSyncResults] = useState<{
    synced: number
    failed: string[]
  } | null>(null)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedImageMenu, setSelectedImageMenu] =
    useState<CombinedImage | null>(null)

  // Fetch images from database and combine with local storage
  const fetchImages = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch from database
      const response = await fetch('/api/images/upload')
      if (!response.ok) {
        throw new Error('Failed to fetch images from database')
      }
      const data: ImageGalleryResponse = await response.json()
      const dbImages = data.images

      // Fetch local images
      let localImages: LocalImageData[] = []
      try {
        if (session?.user?.id) {
          localImages = await localImageStorage.getUserImages(session.user.id)
        }
      } catch (error) {
        console.warn('Failed to fetch local images:', error)
      }

      // Combine and deduplicate images
      const combinedImages: CombinedImage[] = []

      // Add database images
      for (const dbImage of dbImages) {
        let displayUrl = ''
        let localData: LocalImageData | undefined

        console.log('🖼️ Processing dbImage:', {
          id: dbImage.id,
          storageType: dbImage.storageType,
          url: dbImage.url,
          localStorageId: dbImage.localStorageId,
          fileName: dbImage.fileName,
        })

        // If it's a local image, get the actual data URL
        if (dbImage.storageType === 'LOCAL' && dbImage.localStorageId) {
          try {
            const localImage = await localImageStorage.getImage(
              dbImage.localStorageId
            )
            if (localImage) {
              displayUrl = localImage.dataUrl || PLACEHOLDER_IMAGE
              localData = localImage
              console.log('✅ Local image found:', {
                localStorageId: dbImage.localStorageId,
                hasDataUrl: !!localImage.dataUrl,
                dataUrlLength: localImage.dataUrl?.length || 0,
              })
            } else {
              // Local image not found, use placeholder
              displayUrl = PLACEHOLDER_IMAGE
              console.log('❌ Local image not found:', dbImage.localStorageId)
            }
          } catch (error) {
            console.warn(
              `Failed to get local image ${dbImage.localStorageId}:`,
              error
            )
            displayUrl = PLACEHOLDER_IMAGE
          }
        } else {
          // For cloud images, use the URL directly or placeholder if invalid
          displayUrl =
            dbImage.url && !dbImage.url.startsWith('local://')
              ? dbImage.url
              : PLACEHOLDER_IMAGE
          console.log('☁️ Cloud image:', {
            url: dbImage.url,
            displayUrl: displayUrl,
            isPlaceholder: displayUrl === PLACEHOLDER_IMAGE,
          })
        }

        // Final safety check - ensure displayUrl is never empty or local://
        if (!displayUrl || displayUrl.startsWith('local://')) {
          displayUrl = PLACEHOLDER_IMAGE
          console.log('⚠️ Using placeholder for safety:', {
            originalDisplayUrl: displayUrl,
            imageId: dbImage.id,
          })
        }

        console.log('📸 Final image data:', {
          id: dbImage.id,
          displayUrl:
            displayUrl.substring(0, 50) + (displayUrl.length > 50 ? '...' : ''),
          storageType: dbImage.storageType,
        })

        combinedImages.push({
          ...dbImage,
          displayUrl,
          localData,
        })
      }

      // Add purely local images that aren't in database yet
      for (const localImage of localImages) {
        const existsInDb = dbImages.some(
          (img) => img.localStorageId === localImage.id
        )
        if (!existsInDb) {
          combinedImages.push({
            id: localImage.id,
            url: `local://${localImage.id}`,
            displayUrl: localImage.dataUrl || PLACEHOLDER_IMAGE,
            altText: localImage.altText || null,
            fileName: localImage.fileName,
            fileSize: localImage.fileSize,
            uploadedAt: localImage.uploadedAt,
            storageType: 'LOCAL',
            isOffline: true,
            localStorageId: localImage.id,
            localData: localImage,
          })
        }
      }

      // Sort by upload date
      combinedImages.sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )

      setImages(combinedImages)
    } catch (error) {
      console.error('Error fetching images:', error)
      setError('Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchImages()
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.id])

  // Handle delete
  const handleDeleteClick = (image: CombinedImage) => {
    setImageToDelete(image)
    setDeleteDialogOpen(true)
    handleMenuClose()
  }

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return

    try {
      // Delete from database if it exists there
      if (!isLocalImageId(imageToDelete.id)) {
        const response = await fetch(
          `/api/images/upload?id=${imageToDelete.id}`,
          { method: 'DELETE' }
        )
        if (!response.ok) {
          throw new Error('Failed to delete image from database')
        }
      }

      // Delete from local storage if it exists there
      if (imageToDelete.localStorageId || isLocalImageId(imageToDelete.id)) {
        const localId = imageToDelete.localStorageId || imageToDelete.id
        await localImageStorage.deleteImage(localId)
      }

      // Remove from local state
      setImages((prev) => prev.filter((img) => img.id !== imageToDelete.id))
      setDeleteDialogOpen(false)
      setImageToDelete(null)
    } catch (error) {
      console.error('Error deleting image:', error)
      setError('Failed to delete image')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setImageToDelete(null)
  }

  // Sync local images to cloud
  const handleSyncToCloud = async () => {
    if (!session?.user?.id) return

    try {
      setSyncing(true)
      const results = await localImageStorage.syncToCloud(session.user.id)
      setSyncResults(results)

      // Refresh the gallery after sync
      await fetchImages()
    } catch (error) {
      console.error('Sync error:', error)
      setError('Failed to sync images to cloud')
    } finally {
      setSyncing(false)
    }
  }

  // Handle upload success
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const handleUploadSuccess = (newImage: PoseImage) => {
    // Refresh the gallery
    fetchImages()
  }

  // Handle image click for zoom
  const handleImageClick = (image: CombinedImage) => {
    setSelectedImage(image)
  }

  const handleCloseZoom = () => {
    setSelectedImage(null)
  }

  // Menu handlers
  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    image: CombinedImage
  ) => {
    setMenuAnchor(event.currentTarget)
    setSelectedImageMenu(image)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
    setSelectedImageMenu(null)
  }

  if (status === 'loading' || loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          My Yoga Pose Images
        </Typography>
        <Grid2 container spacing={2}>
          {[...Array(6)].map((_, index) => (
            <Grid2 key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          Please sign in to view and upload your yoga pose images.
        </Alert>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchImages}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    )
  }

  const localImageCount = images.filter(
    (img) => img.storageType === 'LOCAL'
  ).length
  const cloudImageCount = images.filter(
    (img) => img.storageType === 'CLOUD'
  ).length

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5">
            My Yoga Pose Images ({images.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip
              icon={<CloudIcon />}
              label={`${cloudImageCount} Cloud`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<CloudOffIcon />}
              label={`${localImageCount} Local`}
              size="small"
              color="warning"
              variant="outlined"
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {localImageCount > 0 && (
            <Tooltip title="Sync local images to cloud">
              <Button
                variant="outlined"
                size="small"
                startIcon={
                  syncing ? (
                    <RefreshIcon className="animate-spin" />
                  ) : (
                    <SyncIcon />
                  )
                }
                onClick={handleSyncToCloud}
                disabled={syncing}
                sx={{ minWidth: 'auto' }}
              >
                {syncing ? 'Syncing...' : 'Sync'}
              </Button>
            </Tooltip>
          )}
          <ImageUploadWithFallback
            onImageUploaded={handleUploadSuccess}
            variant="button"
          />
        </Box>
      </Box>

      {syncResults && (
        <Alert
          severity={syncResults.failed.length > 0 ? 'warning' : 'success'}
          onClose={() => setSyncResults(null)}
          sx={{ mb: 2 }}
        >
          Sync completed: {syncResults.synced} images uploaded to cloud
          {syncResults.failed.length > 0 &&
            `, ${syncResults.failed.length} failed`}
        </Alert>
      )}

      {images.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            border: '2px dashed',
            borderColor: 'grey.300',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No images uploaded yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start building your yoga pose collection by uploading your first
            image
          </Typography>
          <ImageUploadWithFallback
            onImageUploaded={handleUploadSuccess}
            variant="button"
          />
        </Box>
      ) : (
        <Grid2 container spacing={2}>
          {images.map((image) => {
            // Debug logging for image display
            console.log('🎨 Rendering image card:', {
              id: image.id,
              fileName: image.fileName,
              storageType: image.storageType,
              url: image.url,
              displayUrlPreview: image.displayUrl?.substring(0, 50) + '...',
              isPlaceholder: image.displayUrl === PLACEHOLDER_IMAGE,
            })

            return (
              <Grid2 key={image.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    position: 'relative',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      '& .image-overlay': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      src={
                        image.displayUrl &&
                        !image.displayUrl.startsWith('local://')
                          ? image.displayUrl
                          : PLACEHOLDER_IMAGE
                      }
                      alt={image.altText || 'Yoga pose'}
                      sx={{ cursor: 'pointer', objectFit: 'cover' }}
                      onClick={() => handleImageClick(image)}
                    />

                    {/* Storage type indicator */}
                    <Chip
                      icon={
                        image.storageType === 'LOCAL' ? (
                          <CloudOffIcon />
                        ) : (
                          <CloudIcon />
                        )
                      }
                      label={image.storageType === 'LOCAL' ? 'Local' : 'Cloud'}
                      size="small"
                      color={
                        image.storageType === 'LOCAL' ? 'warning' : 'primary'
                      }
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        fontSize: '0.75rem',
                      }}
                    />

                    {/* Action overlay */}
                    <Box
                      className="image-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        p: 1,
                        opacity: 0,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white' }}
                        onClick={(e) => handleMenuClick(e, image)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <CardContent sx={{ pb: 1 }}>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {image.fileName || 'Untitled'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(image.fileSize || 0)} •{' '}
                      {new Date(image.uploadedAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ pt: 0, justifyContent: 'space-between' }}>
                    <Button
                      size="small"
                      startIcon={<ZoomInIcon />}
                      onClick={() => handleImageClick(image)}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(image)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid2>
            )
          })}
        </Grid2>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() =>
            selectedImageMenu && handleImageClick(selectedImageMenu)
          }
        >
          <ZoomInIcon sx={{ mr: 1 }} />
          View Full Size
        </MenuItem>
        <MenuItem
          onClick={() =>
            selectedImageMenu && handleDeleteClick(selectedImageMenu)
          }
        >
          <DeleteIcon sx={{ mr: 1 }} color="error" />
          Delete Image
        </MenuItem>
      </Menu>

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add image"
        onClick={() => setUploadDialogOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' },
        }}
      >
        <AddIcon />
      </Fab>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Image</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this image? This action cannot be
            undone.
          </Typography>
          {imageToDelete?.storageType === 'LOCAL' && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This image is stored locally and hasn&apos;t been uploaded to the
              cloud yet.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Zoom Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseZoom}
        maxWidth="md"
        fullWidth
      >
        {selectedImage && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6">
                  {selectedImage.fileName || 'Yoga Pose Image'}
                </Typography>
                <Chip
                  icon={
                    selectedImage.storageType === 'LOCAL' ? (
                      <CloudOffIcon />
                    ) : (
                      <CloudIcon />
                    )
                  }
                  label={
                    selectedImage.storageType === 'LOCAL' ? 'Local' : 'Cloud'
                  }
                  size="small"
                  color={
                    selectedImage.storageType === 'LOCAL'
                      ? 'warning'
                      : 'primary'
                  }
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center' }}>
                {selectedImage.displayUrl && (
                  <Image
                    src={
                      selectedImage.displayUrl &&
                      !selectedImage.displayUrl.startsWith('local://')
                        ? selectedImage.displayUrl
                        : PLACEHOLDER_IMAGE
                    }
                    alt={selectedImage.altText || 'Yoga pose'}
                    width={600}
                    height={400}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: 8,
                    }}
                  />
                )}
                {selectedImage.altText && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    {selectedImage.altText}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ mt: 1 }}
                >
                  {formatFileSize(selectedImage.fileSize || 0)} • Uploaded{' '}
                  {new Date(selectedImage.uploadedAt).toLocaleDateString()}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseZoom}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
      >
        <DialogContent>
          <ImageUploadWithFallback
            onImageUploaded={(image) => {
              handleUploadSuccess(image)
              setUploadDialogOpen(false)
            }}
            variant="dropzone"
          />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
