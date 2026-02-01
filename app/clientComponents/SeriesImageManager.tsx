'use client'
import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  Fab,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useSession } from 'next-auth/react'

interface SeriesImageManagerProps {
  seriesId: string
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  onImagesChange?: (_images: string[]) => void
  disabled?: boolean
}

export default function SeriesImageManager({
  seriesId,
  onImagesChange,
  disabled = false,
}: SeriesImageManagerProps) {
  const { data: session } = useSession()
  // theme/media queries removed — not currently used

  const [_images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<string | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Fetch series images (memoized)
  const fetchImages = useCallback(async () => {
    if (!seriesId) return

    try {
      setLoading(true)
      setError(null)

      if (typeof fetch !== 'function') {
        setImages([])
        onImagesChange?.([])
        return
      }

      const response = await fetch(`/api/series/${seriesId}/images`)

      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }

      const data = await response.json()
      setImages(data.images || [])
      onImagesChange?.(data.images || [])
    } catch (err) {
      console.error('Error fetching series images:', err)
      setError('Failed to load images')
    } finally {
      setLoading(false)
    }
  }, [seriesId, onImagesChange])

  useEffect(() => {
    if (session?.user?.email && seriesId) {
      fetchImages()
    }
  }, [session?.user?.email, seriesId, fetchImages])

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, and WebP are allowed.')
      return
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 10MB.')
      return
    }

    setSelectedFile(file)
    setUploadDialogOpen(true)
    setError(null)
  }

  // Handle image upload
  const handleUpload = async () => {
    if (!selectedFile || !seriesId) return

    try {
      setUploading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch(`/api/series/${seriesId}/images`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      setImages(data.images || [])
      onImagesChange?.(data.images || [])
      handleCloseUploadDialog()
    } catch (error) {
      console.error('Error uploading image:', error)
      setError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  // Handle image deletion
  const handleDeleteClick = (imageUrl: string) => {
    setImageToDelete(imageUrl)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!imageToDelete || !seriesId) return

    try {
      setError(null)

      const response = await fetch(
        `/api/series/${seriesId}/images?imageUrl=${encodeURIComponent(imageToDelete)}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Delete failed')
      }

      const data = await response.json()
      setImages(data.images || [])
      onImagesChange?.(data.images || [])
      setDeleteDialogOpen(false)
      setImageToDelete(null)
    } catch (error) {
      console.error('Error deleting image:', error)
      setError(error instanceof Error ? error.message : 'Delete failed')
    }
  }

  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false)
    setSelectedFile(null)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Series Images
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {_images.length === 0 && !error ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No images uploaded yet. Add images to showcase your series.
        </Alert>
      ) : null}

      {/* Image Grid */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {_images.map((imageUrl, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="200"
                image={imageUrl}
                alt={`Series image ${index + 1}`}
                sx={{ objectFit: 'cover' }}
              />
              {!disabled && (
                <CardActions
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    p: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: 1,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(imageUrl)}
                    sx={{ color: 'white' }}
                    aria-label="Delete image"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Upload Button */}
      {!disabled && (
        <>
          {/* Desktop Upload Button */}
          <Box sx={{ display: { xs: 'none', sm: 'block' }, mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              disabled={uploading}
            >
              Add Image
              <input
                type="file"
                hidden
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
              />
            </Button>
          </Box>

          {/* Mobile FAB */}
          <Fab
            color="primary"
            aria-label="add image"
            component="label"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              display: { xs: 'flex', sm: 'none' },
            }}
            disabled={uploading}
          >
            <AddIcon />
            <input
              type="file"
              hidden
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
            />
          </Fab>
        </>
      )}

      {/* Upload Confirmation Dialog */}
      <Dialog open={uploadDialogOpen} onClose={handleCloseUploadDialog}>
        <DialogTitle>Upload Image</DialogTitle>
        <DialogContent>
          {selectedFile && (
            <Typography>
              Upload &quot;{selectedFile.name}&quot; (
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Image</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this image? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
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
