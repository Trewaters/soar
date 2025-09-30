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
import ImageManagementControls from './ImageManagementControls'
import { PoseImageData } from '../../../types/images'

interface PoseImage {
  id: string
  url: string
  altText?: string
  fileName?: string
  fileSize?: number
  uploadedAt: string
  postureId?: string
  postureName?: string
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

interface PostureImageGalleryProps {
  postureId?: string
  postureName?: string
  viewMode?: 'carousel' | 'grid' | 'auto'
  enableManagement?: boolean
}

export default function PostureImageGallery({
  postureId,
  postureName,
  viewMode = 'auto',
  enableManagement = true,
}: PostureImageGalleryProps) {
  const { status, data: session } = useSession()
  const [images, setImages] = useState<PoseImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<PoseImage | null>(null)
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

  // Fetch images filtered by posture
  const fetchImages = async () => {
    try {
      setLoading(true)

      // Build query parameters for posture filtering
      const params = new URLSearchParams()
      if (postureId) {
        params.append('postureId', postureId)
        params.append('includeOwnership', 'true')
        params.append('orderBy', 'displayOrder')
      } else if (postureName) {
        params.append('postureName', postureName)
        params.append('orderBy', 'displayOrder')
      }

      const response = await fetch(`/api/images?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }

      const data: ImageGalleryResponse = await response.json()

      console.log('Fetched images for posture:', {
        postureId,
        postureName,
        imageCount: data.images.length,
        ownership: data.ownership,
        images: data.images.map((img) => ({
          id: img.id,
          fileName: img.fileName,
          displayOrder: img.displayOrder,
        })),
      })

      // Sort images by displayOrder for carousel
      const sortedImages = [...data.images].sort(
        (a, b) => (a.displayOrder || 1) - (b.displayOrder || 1)
      )

      setImages(sortedImages)
      setOwnership(data.ownership || null)
    } catch (error) {
      console.error('Error fetching posture images:', error)
      setError('Failed to load images for this posture')
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
  }, [status, postureId, postureName])

  // Handle delete
  const handleDeleteClick = (image: PoseImage) => {
    setImageToDelete(image)
  }

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return

    try {
      const response = await fetch(
        `/api/images/upload?id=${imageToDelete.id}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      // Remove from local state
      setImages((prev) => prev.filter((img) => img.id !== imageToDelete.id))
      setImageToDelete(null)

      console.log('Deleted image from posture:', {
        imageId: imageToDelete.id,
        postureId,
        postureName,
      })
    } catch (error) {
      console.error('Error deleting image:', error)
      setError('Failed to delete image')
    }
  }

  const handleImageReorder = async (
    reorderedImages: PoseImageData[]
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/api/asana/${postureId}/images/reorder`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: reorderedImages.map((img, index) => ({
            id: img.id,
            order: index,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to reorder images')
      }

      // Update local state with reordered images
      setImages(
        reorderedImages.map((img, index) => ({
          id: img.id,
          url: img.url,
          altText: img.altText || '',
          order: index,
          uploadedAt: new Date().toISOString(),
          displayOrder: index,
        }))
      )

      return { success: true }
    } catch (error) {
      console.error('Error reordering images:', error)
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to reorder images',
      }
    }
  }

  // Handle image click for zoom
  const handleImageClick = (image: PoseImage) => {
    setSelectedImage(image)
  }

  const handleCloseZoom = () => {
    setSelectedImage(null)
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
      postureId: img.postureId || undefined,
      postureName: img.postureName || undefined,
      url: img.url,
      altText: img.altText || undefined,
      fileName: img.fileName || undefined,
      fileSize: img.fileSize || undefined,
      uploadedAt: new Date(img.uploadedAt),
      storageType: 'CLOUD' as const,
      localStorageId: undefined,
      isOffline: false,
      imageType: 'posture',
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
              aria-label={`Images for ${postureName || 'yoga pose'}`}
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
                alt={images[0].altText || `${postureName} yoga pose`}
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
      </Box>
    )
  }

  if (status === 'loading' || loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {postureName ? `Images for ${postureName}` : 'Posture Images'}
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

  if (status === 'unauthenticated') {
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
          {postureName
            ? `Images for ${postureName} (${images.length})`
            : `Posture Images (${images.length})`}
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
            No images for this posture yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {postureName
              ? `Start building your collection by uploading your first image for ${postureName}`
              : 'Upload images to build your pose collection'}
          </Typography>
        </Box>
      ) : (
        <>
          {/* Tab interface for view management */}
          {enableManagement && ownership?.canManage && images.length > 1 && (
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

          {/* Render based on current view */}
          {currentView === 'carousel' && renderCarouselView()}

          {currentView === 'reorder' && (
            <ImageReorder
              images={images.map((img) => ({
                id: img.id,
                url: img.url,
                altText: img.altText || '',
                userId: 'current-user',
                uploadedAt: new Date(img.uploadedAt),
                storageType: 'CLOUD' as const,
                isOffline: false,
                imageType: 'posture' as const,
                displayOrder: img.displayOrder || 1,
                createdAt: new Date(img.uploadedAt),
                updatedAt: new Date(img.uploadedAt),
              }))}
              onReorder={async (reorderedImages) => {
                const result = await handleImageReorder(reorderedImages)
                if (!result.success) {
                  console.error('Failed to reorder images:', result.error)
                }
              }}
              disabled={false}
              showButtons={true}
            />
          )}

          {currentView === 'grid' && images[0] && (
            <ImageManagementControls
              image={{
                id: images[0].id,
                url: images[0].url,
                altText: images[0].altText || '',
                userId: 'current-user',
                uploadedAt: new Date(images[0].uploadedAt),
                storageType: 'CLOUD' as const,
                isOffline: false,
                imageType: 'posture' as const,
                displayOrder: images[0].displayOrder || 1,
                createdAt: new Date(images[0].uploadedAt),
                updatedAt: new Date(images[0].uploadedAt),
              }}
              onDelete={async (imageId: string) => {
                const imageToDelete = images.find((img) => img.id === imageId)
                if (imageToDelete) {
                  // Call delete directly with the image
                  try {
                    const response = await fetch(
                      `/api/images/upload?id=${imageId}`,
                      {
                        method: 'DELETE',
                      }
                    )

                    if (!response.ok) {
                      throw new Error('Failed to delete image')
                    }

                    // Remove from local state
                    setImages((prev) =>
                      prev.filter((img) => img.id !== imageId)
                    )

                    console.log('Deleted image from posture:', {
                      imageId: imageId,
                      postureId,
                      postureName,
                    })
                  } catch (error) {
                    console.error('Error deleting image:', error)
                    setError('Failed to delete image')
                  }
                }
              }}
              canDelete={ownership?.canManage || false}
              isCurrentImage={true}
              totalImages={images.length}
              disabled={false}
            />
          )}
        </>
      )}{' '}
      {/* Image zoom dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseZoom}
        maxWidth="md"
        fullWidth
      >
        {selectedImage && (
          <>
            <DialogTitle>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  {selectedImage.fileName || 'Image Preview'}
                </Typography>
                <IconButton
                  onClick={() => handleDeleteClick(selectedImage)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '400px',
                  mb: 2,
                }}
              >
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.altText || 'Yoga pose image'}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </Box>
              {selectedImage.altText && (
                <Typography variant="body1" gutterBottom>
                  {selectedImage.altText}
                </Typography>
              )}
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Chip
                  label={`Uploaded ${formatDate(selectedImage.uploadedAt)}`}
                  variant="outlined"
                />
                {selectedImage.fileSize && (
                  <Chip
                    label={formatFileSize(selectedImage.fileSize)}
                    variant="outlined"
                  />
                )}
                {postureName && (
                  <Chip
                    label={postureName}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseZoom}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}
