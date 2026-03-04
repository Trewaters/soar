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
import { COLORS } from '../../styles/theme'

/** The type of data asset whose images are being managed. */
export type DataAssetType = 'series' | 'sequence'

/** Maps each asset type to its REST API base path. */
const ASSET_API_PATH: Record<DataAssetType, string> = {
  series: 'series',
  sequence: 'sequences',
}

/** Default section titles shown in the component heading. */
const DEFAULT_TITLES: Record<DataAssetType, string> = {
  series: 'Flow Images',
  sequence: 'Sequence Images',
}

export interface DataAssetImageManagerProps {
  /** The type of data asset (series / sequence). */
  assetType: DataAssetType
  /** The ID of the asset whose images are managed. */
  assetId: string
  /** Called whenever the image list changes. */
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  onImagesChange?: (_images: string[]) => void
  /** When true, upload and delete controls are hidden. */
  disabled?: boolean
  /** Maximum number of images allowed. Defaults to no limit. */
  maxImages?: number
  /** Override the section heading. Defaults to a sensible label per asset type. */
  title?: string
}

/**
 * Unified image manager for data assets (flows/series, sequences).
 *
 * Replaces the asset-specific `SeriesImageManager` and `SequenceImageManager`
 * components with a single, prop-driven implementation. The correct API
 * endpoint is derived automatically from the `assetType` prop.
 *
 * @example
 * // Series (flow) images
 * <DataAssetImageManager assetType="series" assetId={series.id} maxImages={1} />
 *
 * @example
 * // Sequence images
 * <DataAssetImageManager assetType="sequence" assetId={sequence.id} maxImages={1} disabled={!isOwner} />
 */
export default function DataAssetImageManager({
  assetType,
  assetId,
  onImagesChange,
  disabled = false,
  maxImages = Infinity,
  title,
}: DataAssetImageManagerProps) {
  const { data: session } = useSession()

  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<string | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const apiBase = `/api/${ASSET_API_PATH[assetType]}/${assetId}/images`
  const sectionTitle = title ?? DEFAULT_TITLES[assetType]

  const fetchImages = useCallback(async () => {
    if (!assetId) return

    try {
      setLoading(true)
      setError(null)

      if (typeof fetch !== 'function') {
        setImages([])
        onImagesChange?.([])
        return
      }

      const response = await fetch(apiBase)

      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }

      const data = await response.json()
      setImages(data.images || [])
      onImagesChange?.(data.images || [])
    } catch (err) {
      console.error(`Error fetching ${assetType} images:`, err)
      setError('Failed to load images')
    } finally {
      setLoading(false)
    }
  }, [assetId, assetType, apiBase, onImagesChange])

  useEffect(() => {
    if (session?.user?.email && assetId) {
      fetchImages()
    }
  }, [session?.user?.email, assetId, fetchImages])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, and WebP are allowed.')
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 5MB.')
      return
    }

    setSelectedFile(file)
    setUploadDialogOpen(true)
    setError(null)
  }

  const handleUpload = async () => {
    if (!selectedFile || !assetId) return

    try {
      setUploading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch(apiBase, {
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
    } catch (err) {
      console.error(`Error uploading ${assetType} image:`, err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteClick = (imageUrl: string) => {
    setImageToDelete(imageUrl)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!imageToDelete || !assetId) return

    try {
      setError(null)

      const response = await fetch(
        `${apiBase}?imageUrl=${encodeURIComponent(imageToDelete)}`,
        { method: 'DELETE' }
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
    } catch (err) {
      console.error(`Error deleting ${assetType} image:`, err)
      setError(err instanceof Error ? err.message : 'Delete failed')
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
        {sectionTitle}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {images.length === 0 && !error ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No images uploaded yet. Add an image to showcase your{' '}
          {assetType === 'series' ? 'flow' : assetType}.
        </Alert>
      ) : null}

      {images.length >= maxImages && maxImages < Infinity ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          Maximum of {maxImages} image{maxImages !== 1 ? 's' : ''} allowed.
          Remove the image to add another.
        </Alert>
      ) : null}

      {/* Image Grid */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {images.map((imageUrl, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="200"
                image={imageUrl}
                alt={`${assetType} image ${index + 1}`}
                sx={{ objectFit: 'cover' }}
              />
              {!disabled && (
                <CardActions
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    p: 0,
                    backgroundColor: COLORS.overlayDarkFullest,
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

      {/* Upload Controls */}
      {!disabled && images.length < maxImages && (
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
