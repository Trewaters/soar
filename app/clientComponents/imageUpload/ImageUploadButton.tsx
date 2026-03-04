'use client'
import React, { useState } from 'react'
import { Button, Snackbar, Alert } from '@mui/material'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import ImageUploadComponent from './ImageUploadComponent'

export interface ImageUploadButtonProps {
  variant?: 'contained' | 'outlined' | 'text'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  fullWidth?: boolean
  // eslint-disable-next-line no-unused-vars
  onUploadSuccess?: (imageData: any) => void
  asanaId?: string
}

export default function ImageUploadButton({
  variant = 'contained',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  onUploadSuccess,
  asanaId,
}: ImageUploadButtonProps) {
  const [open, setOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleUploadSuccess = (imageData: any) => {
    setShowSuccess(true)
    onUploadSuccess?.(imageData)
    setOpen(false)
  }

  const handleSnackbarClose = () => {
    setShowSuccess(false)
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        fullWidth={fullWidth}
        startIcon={<CloudUploadIcon />}
        onClick={handleClick}
        sx={{
          borderRadius: '12px',
          textTransform: 'none',
        }}
      >
        Upload Image
      </Button>

      <ImageUploadComponent
        open={open}
        onClose={handleClose}
        onUploadSuccess={handleUploadSuccess}
        asanaId={asanaId}
      />

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Image uploaded successfully!
        </Alert>
      </Snackbar>
    </>
  )
}
