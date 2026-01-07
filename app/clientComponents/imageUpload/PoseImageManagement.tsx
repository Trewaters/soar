'use client'
import React, { useState } from 'react'
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material'
import PoseImageUpload from './PoseImageUpload'
import PoseImageGallery from './PoseImageGallery'
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

interface PoseImageManagementProps {
  title?: string
  poseId?: string
  poseName?: string
  showUploadButton?: boolean
  showGallery?: boolean
  variant?: 'full' | 'upload-only' | 'gallery-only'
}

/**
 * Pose-specific image management component that ensures images are associated with specific asanas
 * Only displays images that belong to the specified pose
 */
export default function PoseImageManagement({
  title = 'Pose Images',
  poseId,
  poseName,
  showUploadButton = true,
  showGallery = true,
  variant = 'full',
}: PoseImageManagementProps) {
  const [tabValue, setTabValue] = useState(0)
  const [refreshGallery, setRefreshGallery] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleImageUploaded = (image: PoseImageData) => {
    console.log('Image uploaded for pose:', {
      poseId,
      poseName,
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
        <PoseImageUpload
          onImageUploaded={handleImageUploaded}
          variant="dropzone"
          poseId={poseId}
          poseName={poseName}
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
        <PoseImageGallery
          key={refreshGallery}
          poseId={poseId}
          poseName={poseName}
          enableManagement={true}
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
          <PoseImageUpload
            onImageUploaded={handleImageUploaded}
            variant="dropzone"
            poseId={poseId}
            poseName={poseName}
          />
        </TabPanel>
      )}

      {showGallery && (
        <TabPanel value={tabValue} index={showUploadButton ? 1 : 0}>
          <PoseImageGallery
            key={refreshGallery}
            poseId={poseId}
            poseName={poseName}
            enableManagement={true}
          />
        </TabPanel>
      )}
    </Paper>
  )
}
