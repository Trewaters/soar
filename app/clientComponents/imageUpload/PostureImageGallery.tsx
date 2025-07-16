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
} from '@mui/material'
import {
  Delete as DeleteIcon,
  ZoomIn as ZoomInIcon,
  Image as ImageIcon,
} from '@mui/icons-material'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface PoseImage {
  id: string
  url: string
  altText?: string
  fileName?: string
  fileSize?: number
  uploadedAt: string
  postureId?: string
  postureName?: string
}

interface ImageGalleryResponse {
  images: PoseImage[]
  total: number
  hasMore: boolean
}

interface PostureImageGalleryProps {
  postureId?: string
  postureName?: string
}

export default function PostureImageGallery({
  postureId,
  postureName,
}: PostureImageGalleryProps) {
  const { status } = useSession()
  const [images, setImages] = useState<PoseImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<PoseImage | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<PoseImage | null>(null)

  // Fetch images filtered by posture
  const fetchImages = async () => {
    try {
      setLoading(true)

      // Build query parameters for posture filtering
      const params = new URLSearchParams()
      if (postureId) {
        params.append('postureId', postureId)
      } else if (postureName) {
        params.append('postureName', postureName)
      }

      const response = await fetch(`/api/images/upload?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }

      const data: ImageGalleryResponse = await response.json()

      console.log('Fetched images for posture:', {
        postureId,
        postureName,
        imageCount: data.images.length,
        images: data.images.map((img) => ({
          id: img.id,
          fileName: img.fileName,
        })),
      })

      setImages(data.images)
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

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setImageToDelete(null)
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
        <Grid2 container spacing={2}>
          {images.map((image) => (
            <Grid2 key={image.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
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
                      overflow: 'hidden',
                    }}
                    onClick={() => handleImageClick(image)}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || 'Yoga pose image'}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleImageClick(image)
                        }}
                        sx={{
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                      >
                        <ZoomInIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(image)
                        }}
                        sx={{
                          backgroundColor: 'rgba(255, 0, 0, 0.5)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.7)',
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardMedia>
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {image.fileName || 'Untitled'}
                  </Typography>

                  {image.altText && (
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {image.altText}
                    </Typography>
                  )}

                  <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                    <Chip
                      label={formatDate(image.uploadedAt)}
                      size="small"
                      variant="outlined"
                    />
                    {image.fileSize && (
                      <Chip
                        label={formatFileSize(image.fileSize)}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      )}

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

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Image?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this image? This action cannot be
            undone.
          </Typography>
          {imageToDelete?.fileName && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              File: {imageToDelete.fileName}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
