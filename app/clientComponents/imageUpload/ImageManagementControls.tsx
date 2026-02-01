/**
 * Image Management Controls Component for Soar Yoga Application
 * Provides delete functionality with confirmation dialogs for image creators
 */

'use client'
/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
  Stack,
  Chip,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'
import { PoseImageData } from '../../../types/images'

interface ImageManagementControlsProps {
  image: PoseImageData
  onDelete: (imageId: string) => Promise<void>
  canDelete?: boolean
  isCurrentImage?: boolean
  totalImages?: number
  disabled?: boolean
}

export default function ImageManagementControls({
  image,
  onDelete,
  canDelete = false,
  isCurrentImage = false,
  totalImages = 1,
  disabled = false,
}: ImageManagementControlsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleFirstConfirm = () => {
    setDeleteDialogOpen(false)
    setConfirmDeleteOpen(true)
  }

  const handleFinalConfirm = async () => {
    setDeleting(true)
    setError(null)

    try {
      await onDelete(image.id)
      setConfirmDeleteOpen(false)
      setShowSuccess(true)
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to delete image'
      )
    } finally {
      setDeleting(false)
    }
  }

  const handleCancel = () => {
    setDeleteDialogOpen(false)
    setConfirmDeleteOpen(false)
    setError(null)
  }

  // Don't show delete button if user can't delete
  if (!canDelete) {
    return null
  }

  return (
    <>
      <Tooltip
        title={
          isCurrentImage && totalImages === 1
            ? 'Cannot delete the only image'
            : 'Delete this image'
        }
      >
        <span>
          <IconButton
            onClick={handleDeleteClick}
            disabled={disabled || (isCurrentImage && totalImages === 1)}
            color="error"
            size="small"
            sx={{
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'error.contrastText',
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </span>
      </Tooltip>

      {/* First Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          Delete Image?
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography>Are you sure you want to delete this image?</Typography>

            {image.fileName && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  File: {image.fileName}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {isCurrentImage && (
                <Chip
                  label="Currently displayed"
                  color="primary"
                  size="small"
                />
              )}
              <Chip
                label={`${totalImages} total image${totalImages === 1 ? '' : 's'}`}
                variant="outlined"
                size="small"
              />
            </Box>

            {isCurrentImage && totalImages > 1 && (
              <Alert severity="info">
                This is the currently displayed image. The carousel will switch
                to the next available image.
              </Alert>
            )}

            {totalImages === 1 && (
              <Alert severity="warning">
                This is the only image for this asana. The asana will have no
                images after deletion.
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleFirstConfirm} color="error" variant="outlined">
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Final Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          Final Confirmation
        </DialogTitle>
        <DialogContent>
          <Typography>
            This action cannot be undone. Are you absolutely sure you want to
            delete this image?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit" disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleFinalConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={
              deleting ? <CircularProgress size={16} /> : <DeleteIcon />
            }
          >
            {deleting ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Display */}
      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="error" variant="filled">
            {error}
          </Alert>
        </Snackbar>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" icon={<CheckCircleIcon />}>
          Image deleted successfully!
        </Alert>
      </Snackbar>
    </>
  )
}
