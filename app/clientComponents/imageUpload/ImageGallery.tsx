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
  Fab,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  ZoomIn as ZoomInIcon,
} from '@mui/icons-material'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import ImageUploadButton from './ImageUploadButton'

// Simple placeholder image data URL
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='

interface PoseImage {
  id: string
  url: string
  altText?: string
  fileName?: string
  fileSize?: number
  uploadedAt: string
}

interface ImageGalleryResponse {
  images: PoseImage[]
  total: number
  hasMore: boolean
}

export default function ImageGallery() {
  const { data: session, status } = useSession()
  const [images, setImages] = useState<PoseImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<PoseImage | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<PoseImage | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  // Fetch images
  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/images/upload')
      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }
      const data: ImageGalleryResponse = await response.json()
      setImages(data.images)
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
  }, [status])

  // Handle delete
  const handleDeleteClick = (image: PoseImage) => {
    setImageToDelete(image)
    setDeleteDialogOpen(true)
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
    setImages((prev) => [newImage, ...prev])
  }

  // Handle image click for zoom
  const handleImageClick = (image: PoseImage) => {
    setSelectedImage(image)
  }

  const handleCloseZoom = () => {
    setSelectedImage(null)
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
        <Typography variant="h5">
          My Yoga Pose Images ({images.length})
        </Typography>
        <ImageUploadButton onUploadSuccess={handleUploadSuccess} />
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
          <ImageUploadButton onUploadSuccess={handleUploadSuccess} />
        </Box>
      ) : (
        <Grid2 container spacing={2}>
          {images.map((image) => (
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
                    component="div"
                    sx={{
                      height: 200,
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleImageClick(image)}
                  >
                    {image.url && !image.url.startsWith('local://') && (
                      <Image
                        src={image.url}
                        alt={image.altText || 'Yoga pose'}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                    {(!image.url || image.url.startsWith('local://')) && (
                      <Image
                        src={PLACEHOLDER_IMAGE}
                        alt={image.altText || 'Yoga pose'}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </CardMedia>
                  <Box
                    className="image-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    <IconButton
                      sx={{ color: 'white' }}
                      onClick={() => handleImageClick(image)}
                    >
                      <ZoomInIcon />
                    </IconButton>
                  </Box>
                </Box>
                <CardContent sx={{ pb: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box sx={{ flex: 1, mr: 1 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {image.altText || image.fileName || 'Yoga pose'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(image.uploadedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(image)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      )}

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
              {selectedImage.altText || selectedImage.fileName || 'Yoga Pose'}
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ position: 'relative', width: '100%', height: 400 }}>
                {selectedImage.url &&
                  !selectedImage.url.startsWith('local://') && (
                    <Image
                      src={selectedImage.url}
                      alt={selectedImage.altText || 'Yoga pose'}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  )}
                {(!selectedImage.url ||
                  selectedImage.url.startsWith('local://')) && (
                  <Image
                    src={PLACEHOLDER_IMAGE}
                    alt={selectedImage.altText || 'Yoga pose'}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                )}
              </Box>
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
