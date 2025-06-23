/**
 * Storage Provider Demo Page
 * Simple demonstration of modular storage system
 */

import React from 'react'
import { Box, Typography, Alert, Paper } from '@mui/material'

export default function StorageProviderDemo() {
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Storage Provider Demo
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This page demonstrates the modular storage system for image uploads.
      </Alert>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Modular Storage System
        </Typography>

        <Typography variant="body1" paragraph>
          Your existing ImageUploadWithFallback components now automatically
          work with any configured storage provider.
        </Typography>

        <Typography variant="body2" color="text.secondary">
          To configure storage providers, set environment variables:
        </Typography>

        <Box
          component="pre"
          sx={{
            bgcolor: 'grey.100',
            p: 2,
            borderRadius: 1,
            mt: 2,
            fontSize: '0.875rem',
            overflow: 'auto',
          }}
        >
          {`# For Vercel Blob
BLOB_READ_WRITE_TOKEN=your_token

# For Cloudflare Images  
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token`}
        </Box>

        <Alert severity="success" sx={{ mt: 2 }}>
          No code changes needed for existing upload components!
        </Alert>
      </Paper>
    </Box>
  )
}
