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
  enableManagement?: boolean
}

export default function PostureImageGallery({
  postureId,
  postureName,
  enableManagement = true,
}: PostureImageGalleryProps) {
  const { status } = useSession()
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

  // TEMPORARY: Override ownership for testing tabs functionality
  const canManageImages = ownership?.canManage || true // Set to false to test real ownership

  // Fetch images filtered by posture
  const fetchImages = async () => {
    console.log('🔄 fetchImages called with:', {
      postureId,
      postureName,
      enableManagement,
    })
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
      } else {
        // No filtering - show all user images
        params.append('includeOwnership', 'true')
        params.append('orderBy', 'uploadedAt')
      }

      const response = await fetch(`/api/images?${params.toString()}`)
      console.log('📡 API Response:', {
        status: response.status,
        ok: response.ok,
        url: `/api/images?${params.toString()}`,
      })

      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }

      const data: ImageGalleryResponse = await response.json()
      console.log('📦 API Data received:', data)

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

      // Debug tab visibility conditions
      console.log('🎯 Tab visibility debug:', {
        enableManagement,
        'ownership?.canManage': data.ownership?.canManage,
        'images.length': sortedImages.length,
        'images.length > 1': sortedImages.length > 1,
        shouldShowTabs:
          enableManagement &&
          data.ownership?.canManage &&
          sortedImages.length > 1,
      })
    } catch (error) {
      console.error('❌ Error in fetchImages:', error)
      console.error('❌ Error details:', {
        error: error instanceof Error ? error.message : error,
        postureId,
        postureName,
      })
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
      const response = await fetch(`/api/images/${imageToDelete.id}`, {
        method: 'DELETE',
      })

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
    console.log('🔄 handleImageReorder called:', {
      postureId,
      postureName,
      reorderedImagesCount: reorderedImages.length,
    })

    try {
      // Check if we have the necessary data for reordering
      if (!postureId && !postureName) {
        throw new Error('Cannot reorder images without posture identification')
      }

      const apiUrl = postureId
        ? `/api/asana/${postureId}/images/reorder`
        : `/api/images/reorder`

      console.log('📡 Reorder API call:', { apiUrl })

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: reorderedImages.map((img, index) => ({
            imageId: img.id,
            displayOrder: index,
          })),
          postureName: postureName || undefined,
        }),
      })

      console.log('📡 Reorder response:', {
        status: response.status,
        ok: response.ok,
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
          order: index,
          uploadedAt: new Date().toISOString(),
          displayOrder: index,
        }))
      )

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
              autoPlay={false}
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
            {/* Add zoom functionality for carousel images */}
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="text"
                size="small"
                onClick={() => handleImageClick(images[currentImageIndex])}
              >
                Click to zoom
              </Button>
            </Box>
          </>
        ) : (
          // Single image display with click-to-zoom functionality
          <Card
            sx={{ maxWidth: 600, mx: 'auto', cursor: 'pointer' }}
            onClick={() => handleImageClick(images[0])}
          >
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

  // Debug current render state
  console.log('🖼️ PostureImageGallery render:', {
    enableManagement,
    'ownership?.canManage': ownership?.canManage,
    canManageImages,
    'images.length': images.length,
    shouldShowTabs: enableManagement && canManageImages && images.length > 1,
    status,
    loading,
    error,
  })

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
                imageType: 'posture' as const,
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
                          cursor: 'pointer',
                        }}
                        onClick={() => handleImageClick(image)}
                      >
                        <Image
                          src={image.url}
                          alt={
                            image.altText || `${postureName} pose ${index + 1}`
                          }
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
                {canManageImages && (
                  <IconButton
                    onClick={() => handleDeleteClick(selectedImage)}
                    color="error"
                    aria-label="Delete image"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
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
