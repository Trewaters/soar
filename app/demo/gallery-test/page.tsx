'use client'
import React from 'react'
import { Container, Typography, Box, Alert } from '@mui/material'
import { useSession } from 'next-auth/react'
import EnhancedImageGallery from '../../clientComponents/imageUpload/EnhancedImageGallery'

export default function GalleryTestPage() {
  const { data: session, status } = useSession()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        🖼️ Gallery Display Test
      </Typography>

      <Typography variant="body1" paragraph color="text.secondary">
        Testing image gallery display with both cloud and local images.
      </Typography>

      {status === 'loading' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Loading session...
        </Alert>
      )}

      {status === 'unauthenticated' && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please sign in to test the gallery functionality.
        </Alert>
      )}

      {status === 'authenticated' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Authenticated as {session?.user?.email || session?.user?.name}. Check
          browser console for debug logs.
        </Alert>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Enhanced Image Gallery (with debug logging)
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This gallery shows both cloud and local images. Check the browser
          console for detailed debug information about image loading and
          display.
        </Typography>
        <EnhancedImageGallery />
      </Box>

      <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Debug Instructions
        </Typography>
        <Typography variant="body2" component="div">
          <strong>To debug image display issues:</strong>
          <ol>
            <li>Open browser developer tools (F12)</li>
            <li>Go to the Console tab</li>
            <li>Look for logs starting with 🎨, 🖼️, ☁️, ✅, ❌</li>
            <li>
              Check if displayUrl values are valid (data: URLs or https: URLs)
            </li>
            <li>Try uploading a new image to see real-time logs</li>
            <li>Verify that CardMedia gets proper image prop values</li>
          </ol>
        </Typography>
      </Box>
    </Container>
  )
}
