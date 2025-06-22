'use client'
import React from 'react'
import { Container, Typography, Box, Paper, Alert } from '@mui/material'
import { useSession } from 'next-auth/react'
import ImageUploadWithFallback from '../../clientComponents/imageUpload/ImageUploadWithFallback'

export default function ImageUploadFallbackDemo() {
  const { data: session, status } = useSession()

  const handleImageUploaded = (image: any) => {
    console.log('✅ Demo: Image uploaded/saved:', image)
    alert(
      `✅ Image saved successfully: ${image.fileName} (${image.storageType || 'CLOUD'} storage)`
    )
  }

  // Force a test error for debugging
  const handleTestError = () => {
    console.log('🧪 Triggering test upload error...')
    // This will help us test the fallback without needing an actual file
    const testUpload = async () => {
      try {
        const response = await fetch('/api/images/upload', {
          method: 'POST',
          // Send empty form data to trigger an error
          body: new FormData(),
        })
        const data = await response.json()
        console.log('Test error response:', { response: response.status, data })
      } catch (error) {
        console.log('Test error caught:', error)
      }
    }
    testUpload()
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        🔄 Image Upload Fallback Demo
      </Typography>

      <Typography variant="body1" paragraph color="text.secondary">
        Test the fallback system when cloud upload fails.
      </Typography>

      <Alert
        severity={status === 'authenticated' ? 'success' : 'warning'}
        sx={{ mb: 3 }}
      >
        <strong>Auth Status:</strong> {status}
        {session?.user && (
          <span> - User: {session.user.email || session.user.name}</span>
        )}
      </Alert>

      <Paper sx={{ p: 3 }}>
        <ImageUploadWithFallback
          variant="dropzone"
          onImageUploaded={handleImageUploaded}
        />
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          🧪 Test Instructions
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          1. Try uploading an image with your invalid Cloudflare token
          <br />
          2. The upload should fail and show a fallback dialog
          <br />
          3. Choose `&quot;`Save Locally`&quot;` to test the fallback
          functionality
        </Typography>

        <Paper sx={{ p: 2, bgcolor: 'grey.100', mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            🔧 Debug Tools
          </Typography>
          <button
            onClick={handleTestError}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            🧪 Test API Error Response
          </button>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Click to test API error handling (check browser console)
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
}
