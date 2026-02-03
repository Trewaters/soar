'use client'
/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
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
} from '@mui/material'
import {
  Delete as DeleteIcon,
  ZoomIn as ZoomInIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import ImageUploadButton from './ImageUploadButton'
import { PoseImage } from './types'

// Simple placeholder image data URL
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvcnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='

interface ImageGalleryProps {
  asanaId: string
  initialImages: PoseImage[]
  onImagesChange: (images: PoseImage[]) => void
  pageSize?: number
}

export default function ImageGallery({
  asanaId,
  initialImages,
  onImagesChange,
  pageSize = 6,
}: ImageGalleryProps) {
  const { status } = useSession()
  const [images, setImages] = useState<PoseImage[]>(initialImages)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<PoseImage | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<PoseImage | null>(null)

  useEffect(() => {
    // Sort initial images by displayOrder
    const sortedImages = [...initialImages].sort(
      (a, b) => a.displayOrder - b.displayOrder
    )
    setImages(sortedImages)
  }, [initialImages])

  // Pagination state
  const [page, setPage] = useState<number>(1)
  useEffect(() => {
    // Reset to first page when images change
    setPage(1)
  }, [images.length])

  const totalPages = Math.max(1, Math.ceil(images.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const visibleImages = images.slice(startIndex, endIndex)

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newImages.length) {
      return // Cannot move further
    }

    // Swap elements
    ;[newImages[index], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[index],
    ]

    // Update displayOrder for all images
    const updatedImagesWithOrder = newImages.map((image, idx) => ({
      ...image,
      displayOrder: idx + 1,
    }))

    setImages(updatedImagesWithOrder)
    onImagesChange(updatedImagesWithOrder)
  }

  // Handle delete
  const handleDeleteClick = (image: PoseImage) => {
    setImageToDelete(image)
    setDeleteDialogOpen(true)
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

      // Remove from local state and notify parent
      const updatedImages = images.filter((img) => img.id !== imageToDelete.id)
      setImages(updatedImages)
      onImagesChange(updatedImages)

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

  // Handle upload success
  const handleUploadSuccess = (newImage: PoseImage) => {
    const updatedImages = [...images, newImage]
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  // Handle image click for zoom
  const handleImageClick = (image: PoseImage) => {
    setSelectedImage(image)
  }

  const handleCloseZoom = () => {
    setSelectedImage(null)
  }

  if (status === 'loading') {
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
            <Button color="inherit" size="small" onClick={() => setError(null)}>
              Dismiss
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
        <Typography variant="h5">
          My Yoga Pose Images ({images.length})
        </Typography>
        <ImageUploadButton
          onUploadSuccess={handleUploadSuccess}
          asanaId={asanaId}
        />
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
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No images uploaded yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start building your yoga pose collection by uploading your first
            image
          </Typography>
          <ImageUploadButton
            onUploadSuccess={handleUploadSuccess}
            asanaId={asanaId}
          />
        </Box>
      ) : (
        <>
          <Grid2 container spacing={2}>
            {visibleImages.map((image, index) => (
              <Grid2 key={image.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ position: 'relative' }}>
                  <CardMedia
                    sx={{
                      height: 200,
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    onClick={() => handleImageClick(image)}
                  >
                    <Image
                      src={image.url || PLACEHOLDER_IMAGE}
                      alt={image.altText || `Pose image ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                      priority={index < 3} // Prioritize loading for first few images
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '4px',
                        padding: '2px',
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMove(index, 'up')
                        }}
                        disabled={index === 0}
                        sx={{ color: 'white' }}
                      >
                        <ArrowUpwardIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMove(index, 'down')
                        }}
                        disabled={index === images.length - 1}
                        sx={{ color: 'white' }}
                      >
                        <ArrowDownwardIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(image)
                        }}
                        sx={{ color: 'white' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardMedia>
                  <CardContent
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1,
                      '&:last-child': { pb: 1 },
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Order: {image.displayOrder + 1}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleImageClick(image)}
                    >
                      <ZoomInIcon fontSize="small" />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>

          {/* Pagination Controls */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              mt: 3,
            }}
          >
            <IconButton
              aria-label="Previous images page"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeftIcon />
            </IconButton>

            <Typography variant="body2">
              Page {page} of {totalPages}
            </Typography>

            <IconButton
              aria-label="Next images page"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </>
      )}

      {/* Zoom Dialog */}
      <Dialog open={!!selectedImage} onClose={handleCloseZoom} maxWidth="md">
        {selectedImage && (
          <>
            <DialogTitle>
              {selectedImage.altText || selectedImage.fileName || 'Yoga Pose'}
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ position: 'relative', width: '100%', height: 400 }}>
                <Image
                  src={selectedImage.url || PLACEHOLDER_IMAGE}
                  alt={selectedImage.altText || 'Yoga pose'}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseZoom}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this image? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
