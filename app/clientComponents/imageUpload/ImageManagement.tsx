'use client'
import React, { useState } from 'react'
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material'
import ImageUpload from './ImageUpload'
import ImageGallery from './ImageGallery'
import type { PoseImageData } from './ImageUpload'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`image-tabpanel-${index}`}
      aria-labelledby={`image-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

interface ImageManagementProps {
  title?: string
  showUploadButton?: boolean
  showGallery?: boolean
  variant?: 'full' | 'upload-only' | 'gallery-only'
}

/**
 * Comprehensive image management component that combines upload and gallery functionality
 * Perfect for user profiles, asana creation, or any page where users need to manage images
 */
export default function ImageManagement({
  title = 'Pose Images',
  showUploadButton = true,
  showGallery = true,
  variant = 'full',
}: ImageManagementProps) {
  const [tabValue, setTabValue] = useState(0)
  const [refreshGallery, setRefreshGallery] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleImageUploaded = (image: PoseImageData) => {
    console.log('Image uploaded:', image)
    // Refresh the gallery
    setRefreshGallery((prev) => prev + 1)
    // Switch to gallery tab to show the new image
    if (showGallery) {
      setTabValue(1)
    }
  }

  if (variant === 'upload-only') {
    return (
      <Paper elevation={1} sx={{ p: 3, borderRadius: '16px' }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <ImageUpload onImageUploaded={handleImageUploaded} variant="dropzone" />
      </Paper>
    )
  }

  if (variant === 'gallery-only') {
    return (
      <Paper elevation={1} sx={{ p: 3, borderRadius: '16px' }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <ImageGallery key={refreshGallery} />
      </Paper>
    )
  }

  return (
    <Paper elevation={1} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
      <Typography variant="h6" sx={{ p: 3, pb: 0 }}>
        {title}
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {showUploadButton && <Tab label="Upload" />}
        {showGallery && <Tab label="Gallery" />}
      </Tabs>

      {showUploadButton && (
        <TabPanel value={tabValue} index={0}>
          <ImageUpload
            onImageUploaded={handleImageUploaded}
            variant="dropzone"
          />
        </TabPanel>
      )}

      {showGallery && (
        <TabPanel value={tabValue} index={showUploadButton ? 1 : 0}>
          <ImageGallery key={refreshGallery} />
        </TabPanel>
      )}
    </Paper>
  )
}
