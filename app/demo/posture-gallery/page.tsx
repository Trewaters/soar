'use client'
import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import PostureImageManagement from '@app/clientComponents/imageUpload/PostureImageManagement'

export default function PostureGalleryDemo() {
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Posture Image Gallery Demo
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        This demo shows the PostureImageGallery with tabs functionality. Upload
        multiple images for the same asana to see the tabs appear.
      </Typography>

      <PostureImageManagement
        title="All Your Uploaded Images (No Filter)"
        variant="full"
      />

      <Paper sx={{ p: 2, mt: 3, bgcolor: 'info.light' }}>
        <Typography variant="h6" gutterBottom>
          Debug Info:
        </Typography>
        <Typography variant="body2">
          • To see tabs: Upload 2+ images for the same asana <br />• Tabs only
          show for asanas you created (ownership.canManage = true) <br />• Check
          browser console for debug output
        </Typography>
      </Paper>
    </Box>
  )
}
