'use client'
import React, { useState } from 'react'
import {
  Box,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Alert,
} from '@mui/material'
import SeriesImageManager from '@app/clientComponents/SeriesImageManager'

// Demo component to test the Series Image Management functionality
export default function SeriesImageManagementDemo() {
  const [testDialogOpen, setTestDialogOpen] = useState(false)

  // Demo series data - in real app this would come from the database
  const demoSeries = {
    id: '507f1f77bcf86cd799439011', // Example MongoDB ObjectId
    name: 'Sun Salutation A',
    description: 'A flowing sequence of poses',
    difficulty: 'beginner',
    asanas: [],
    created_by: 'demo@example.com',
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Series Image Management Demo
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Features
        </Typography>
        <Typography variant="body1" paragraph>
          This demo showcases the new Series Image Management feature:
        </Typography>
        <ul>
          <li>Upload multiple images to a series</li>
          <li>Delete specific images with confirmation</li>
          <li>Responsive grid layout for image display</li>
          <li>Mobile-friendly interface</li>
          <li>Secure access control (only series creators)</li>
        </ul>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Instructions
        </Typography>
        <Typography variant="body1" paragraph>
          To test this feature:
        </Typography>
        <ol>
          <li>Make sure you&apos;re logged in as a series creator</li>
          <li>Click &quot;Open Demo Dialog&quot; below</li>
          <li>Try uploading images (JPEG, PNG, WebP formats)</li>
          <li>Delete images using the delete button on each image</li>
          <li>Test on both desktop and mobile devices</li>
        </ol>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> This demo uses a placeholder series ID. In the
          real application, this would be integrated into the EditSeriesDialog
          component and work with actual user data.
        </Typography>
      </Alert>

      <Button
        variant="contained"
        onClick={() => setTestDialogOpen(true)}
        size="large"
      >
        Open Demo Dialog
      </Button>

      {/* Demo Dialog */}
      <Dialog
        open={testDialogOpen}
        onClose={() => setTestDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Flow: {demoSeries.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <SeriesImageManager seriesId={demoSeries.id} disabled={false} />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
