'use client'
import React, { useState } from 'react'
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material'
import PostureImageUpload from './PostureImageUpload'
import PostureImageGallery from './PostureImageGallery'
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

interface PostureImageManagementProps {
  title?: string
  postureId?: string
  postureName?: string
  showUploadButton?: boolean
  showGallery?: boolean
  variant?: 'full' | 'upload-only' | 'gallery-only'
}

/**
 * Posture-specific image management component that ensures images are associated with specific asanas
 * Only displays images that belong to the specified posture
 */
export default function PostureImageManagement({
  title = 'Pose Images',
  postureId,
  postureName,
  showUploadButton = true,
  showGallery = true,
  variant = 'full',
}: PostureImageManagementProps) {
  const [tabValue, setTabValue] = useState(0)
  const [refreshGallery, setRefreshGallery] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleImageUploaded = (image: PoseImageData) => {
    console.log('Image uploaded for posture:', {
      postureId,
      postureName,
      image,
    })
    // Refresh the gallery to show the new image
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
        <PostureImageUpload
          onImageUploaded={handleImageUploaded}
          variant="dropzone"
          postureId={postureId}
          postureName={postureName}
        />
      </Paper>
    )
  }

  if (variant === 'gallery-only') {
    return (
      <Paper elevation={1} sx={{ p: 3, borderRadius: '16px' }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <PostureImageGallery
          key={refreshGallery}
          postureId={postureId}
          postureName={postureName}
        />
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
          <PostureImageUpload
            onImageUploaded={handleImageUploaded}
            variant="dropzone"
            postureId={postureId}
            postureName={postureName}
          />
        </TabPanel>
      )}

      {showGallery && (
        <TabPanel value={tabValue} index={showUploadButton ? 1 : 0}>
          <PostureImageGallery
            key={refreshGallery}
            postureId={postureId}
            postureName={postureName}
          />
        </TabPanel>
      )}
    </Paper>
  )
}
