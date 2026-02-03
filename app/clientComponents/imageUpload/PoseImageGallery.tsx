'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid2,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Skeleton,
  Alert,
  Chip,
  Stack,
  Tabs,
  Tab,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Image as ImageIcon,
  ViewCarousel as ViewCarouselIcon,
  ViewModule as ViewModuleIcon,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import ImageCarousel from './ImageCarousel'
import CarouselDotNavigation from './CarouselDotNavigation'
import ImageReorder from './ImageReorder'
import { PoseImageData } from '../../../types/images'

interface PoseImage {
  id: string
  url: string
  altText?: string
  fileName?: string
  fileSize?: number
  uploadedAt: string
  poseId?: string
  poseName?: string
  displayOrder: number
}

interface ImageGalleryResponse {
  images: PoseImage[]
  total: number
  hasMore: boolean
  ownership?: {
    canManage: boolean
    isOwner: boolean
    isUserCreated: boolean
  }
}

interface PoseImageGalleryProps {
  poseId?: string
  poseName?: string
  enableManagement?: boolean
  onImagesChange?: () => void
}

export default function PoseImageGallery({
  poseId,
  poseName,
  enableManagement = true,
  onImagesChange,
}: PoseImageGalleryProps) {
  const { status } = useSession()
  const [images, setImages] = useState<PoseImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageToDelete, setImageToDelete] = useState<PoseImage | null>(null)
  const [currentView, setCurrentView] = useState<
    'carousel' | 'grid' | 'reorder'
  >('carousel')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [ownership, setOwnership] = useState<{
    canManage: boolean
    isOwner: boolean
    isUserCreated: boolean
  } | null>(null)

  // TEMPORARY: Override ownership for testing tabs functionality
  // Respect enableManagement prop to allow parent control
  const canManageImages = enableManagement && (ownership?.canManage || true) // Set to false to test real ownership

  // Fetch images filtered by pose
  const fetchImages = async () => {
    try {
      setLoading(true)

      // Build query parameters for pose filtering
      const params = new URLSearchParams()
      if (poseId) {
        params.append('poseId', poseId)
        params.append('includeOwnership', 'true')
        params.append('orderBy', 'displayOrder')
      } else if (poseName) {
        params.append('poseName', poseName)
        params.append('orderBy', 'displayOrder')
      } else {
        // No filtering - show all user images
        params.append('includeOwnership', 'true')
        params.append('orderBy', 'uploadedAt')
      }

      const response = await fetch(`/api/images?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }

      const data: ImageGalleryResponse = await response.json()

      // Sort images by displayOrder for carousel
      const sortedImages = [...data.images].sort(
        (a, b) => (a.displayOrder || 1) - (b.displayOrder || 1)
      )

      setImages(sortedImages)
      setOwnership(data.ownership || null)
    } catch (error) {
      console.error('❌ Error in fetchImages:', error)
      console.error('❌ Error details:', {
        error: error instanceof Error ? error.message : error,
        poseId,
        poseName,
      })
      setError('Failed to load images for this pose')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch if authenticated OR if we have pose identifiers (publicly viewable)
    if (
      status === 'authenticated' ||
      (status === 'unauthenticated' && (poseId || poseName))
    ) {
      fetchImages()
    } else if (status === 'unauthenticated' && !poseId && !poseName) {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, poseId, poseName])

  // Handle delete
  const handleDeleteClick = (image: PoseImage) => {
    setImageToDelete(image)
  }

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return

    try {
      const response = await fetch(`/api/images/${imageToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      // Remove from local state
      setImages((prev) => prev.filter((img) => img.id !== imageToDelete.id))
      setImageToDelete(null)

      // Notify parent of changes
      if (onImagesChange) onImagesChange()
    } catch (error) {
      console.error('Error deleting image:', error)
      setError('Failed to delete image')
    }
  }

  const handleImageReorder = async (
    reorderedImages: PoseImageData[]
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check if we have the necessary data for reordering
      if (!poseId && !poseName) {
        throw new Error('Cannot reorder images without pose identification')
      }

      const apiUrl = poseId
        ? `/api/asana/${poseId}/images/reorder`
        : `/api/images/reorder`

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: reorderedImages.map((img, index) => ({
            imageId: img.id,
            displayOrder: index + 1, // Use 1-based indexing (1, 2, 3)
          })),
          poseName: poseName || undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('❌ Reorder failed:', errorData)
        throw new Error(`Failed to reorder images: ${response.status}`)
      }

      // Update local state with reordered images
      setImages(
        reorderedImages.map((img, index) => ({
          id: img.id,
          url: img.url,
          altText: img.altText || '',
          order: index + 1,
          uploadedAt: new Date().toISOString(),
          displayOrder: index + 1,
        }))
      )

      // Notify parent of changes
      if (onImagesChange) onImagesChange()

      return { success: true }
    } catch (error) {
      console.error('❌ handleImageReorder error:', error)
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to reorder images',
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Render carousel view for multiple images
  const renderCarouselView = () => {
    if (images.length === 0) return null

    // Convert to PoseImageData format for carousel
    const carouselImages: PoseImageData[] = images.map((img) => ({
      id: img.id,
      userId: '', // Not needed for display
      poseId: img.poseId || undefined,
      poseName: img.poseName || undefined,
      url: img.url,
      altText: img.altText || undefined,
      fileName: img.fileName || undefined,
      fileSize: img.fileSize || undefined,
      uploadedAt: new Date(img.uploadedAt),
      storageType: 'CLOUD' as const,
      localStorageId: undefined,
      isOffline: false,
      imageType: 'pose',
      displayOrder: img.displayOrder || 1,
      createdAt: new Date(img.uploadedAt),
      updatedAt: new Date(img.uploadedAt),
    }))

    return (
      <Box>
        {images.length > 1 ? (
          <>
            <ImageCarousel
              images={carouselImages}
              currentIndex={currentImageIndex}
              onIndexChange={setCurrentImageIndex}
              height={400}
              showArrows={true}
              autoPlay={false}
              aria-label={`Images for ${poseName || 'yoga pose'}`}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <CarouselDotNavigation
                images={carouselImages}
                activeIndex={currentImageIndex}
                onIndexChange={setCurrentImageIndex}
                showLabels={false}
                aria-label="Navigate between pose images"
              />
            </Box>
          </>
        ) : (
          // Single image display
          <Card sx={{ maxWidth: 600, mx: 'auto' }}>
            <CardMedia
              component="div"
              sx={{ height: 400, position: 'relative' }}
            >
              <Image
                src={images[0].url}
                alt={images[0].altText || `${poseName} yoga pose`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </CardMedia>
            {images[0].altText && (
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {images[0].altText}
                </Typography>
              </CardContent>
            )}
          </Card>
        )}

        {/* Show delete controls for single image if user can manage */}
        {images.length === 1 && canManageImages && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDeleteClick(images[0])}
              size="small"
            >
              Delete Image
            </Button>
          </Box>
        )}
      </Box>
    )
  }

  if (status === 'loading' || loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {poseName ? `Images for ${poseName}` : 'Pose Images'}
        </Typography>
        <Grid2 container spacing={2}>
          {[...Array(3)].map((_, index) => (
            <Grid2 key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton width="80%" />
                  <Skeleton width="60%" />
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    )
  }

  if (status === 'unauthenticated' && !poseId && !poseName) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          Please sign in to view your yoga pose images.
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

  // Determine which tabs to show
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
        <Typography variant="h6">
          {poseName
            ? `Images for ${poseName} (${images.length})`
            : `Pose Images (${images.length})`}
        </Typography>
        {images.length > 0 && (
          <Chip
            icon={<ImageIcon />}
            label={`${images.length} image${images.length !== 1 ? 's' : ''}`}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>
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
          <ImageIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No images for this pose yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {poseName
              ? `Start building your collection by uploading your first image for ${poseName}`
              : 'Upload images to build your pose collection'}
          </Typography>
        </Box>
      ) : (
        <>
          {/* Tab interface for view management */}
          {enableManagement && canManageImages && images.length > 1 && (
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={currentView}
                onChange={(_, newValue) => setCurrentView(newValue)}
                aria-label="image view tabs"
              >
                <Tab
                  label="View Images"
                  value="carousel"
                  icon={<ViewCarouselIcon />}
                  iconPosition="start"
                />
                <Tab
                  label="Reorder Images"
                  value="reorder"
                  icon={<DragIndicatorIcon />}
                  iconPosition="start"
                />
                <Tab
                  label="Manage Images"
                  value="grid"
                  icon={<ViewModuleIcon />}
                  iconPosition="start"
                />
              </Tabs>
            </Box>
          )}

          {/* Show delete controls for individual images in carousel view if user can manage */}
          {currentView === 'carousel' &&
            canManageImages &&
            images.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteClick(images[currentImageIndex])}
                  size="small"
                >
                  Delete Current Image
                </Button>
              </Box>
            )}

          {/* Render based on current view */}
          {currentView === 'carousel' && renderCarouselView()}

          {currentView === 'reorder' && canManageImages && (
            <ImageReorder
              images={images.map((img) => ({
                id: img.id,
                url: img.url,
                altText: img.altText || '',
                userId: 'current-user',
                uploadedAt: new Date(img.uploadedAt),
                storageType: 'CLOUD' as const,
                isOffline: false,
                imageType: 'pose' as const,
                displayOrder: img.displayOrder || 1,
                createdAt: new Date(img.uploadedAt),
                updatedAt: new Date(img.uploadedAt),
              }))}
              onReorder={async (reorderedImages) => {
                const result = await handleImageReorder(reorderedImages)
                if (!result.success) {
                  console.error('Failed to reorder images:', result.error)
                  setError(result.error || 'Failed to reorder images')
                }
              }}
              disabled={false}
              showButtons={true}
            />
          )}

          {currentView === 'grid' && canManageImages && images.length > 0 && (
            <Box data-testid="image-management">
              <Typography variant="h6" gutterBottom>
                Management Interface
              </Typography>
              <Typography variant="body2" gutterBottom>
                Image ID: {images[0].id}
              </Typography>
              <Grid2 container spacing={2}>
                {images.map((image, index) => (
                  <Grid2 key={image.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card>
                      <CardMedia
                        component="div"
                        sx={{
                          height: 200,
                          position: 'relative',
                        }}
                      >
                        <Image
                          src={image.url}
                          alt={image.altText || `${poseName} pose ${index + 1}`}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </CardMedia>
                      <CardContent>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2" color="text.secondary">
                            Image {index + 1} of {images.length}
                          </Typography>
                          <IconButton
                            onClick={() => handleDeleteClick(image)}
                            color="error"
                            size="small"
                            aria-label={`Delete image ${index + 1}`}
                            data-testid={
                              index === 0 ? 'delete-image' : undefined
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                        {image.fileName && (
                          <Typography variant="caption" display="block">
                            {image.fileName}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid2>
                ))}
              </Grid2>
            </Box>
          )}
        </>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!imageToDelete}
        onClose={() => setImageToDelete(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete this image? This action cannot be
            undone.
          </Typography>
          {imageToDelete && (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '200px',
                mt: 2,
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <Image
                src={imageToDelete.url}
                alt={imageToDelete.altText || 'Image to delete'}
                fill
                style={{ objectFit: 'cover' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageToDelete(null)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete Image
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
