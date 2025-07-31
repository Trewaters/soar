// ProfileImageManagerWithContext wires up UserContext and API
function ProfileImageManagerWithContext() {
  const { state, dispatch } = UseUser()
  const images = state.userData.profileImages || []
  const active = state.userData.activeProfileImage || null
  const placeholder = state.userData.image || '/images/profile-placeholder.png'

  // Upload, delete, and set active handlers
  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/profileImage/route', {
      method: 'POST',
      body: formData,
    })
    if (res.ok) {
      const data = await res.json()
      dispatch({
        type: 'SET_PROFILE_IMAGES',
        payload: {
          images: data.images,
          active: data.images[data.images.length - 1] || null,
        },
      })
    }
  }

  const handleDelete = async (url: string) => {
    const res = await fetch('/api/profileImage/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    if (res.ok) {
      const data = await res.json()
      dispatch({
        type: 'SET_PROFILE_IMAGES',
        payload: { images: data.images, active: data.activeProfileImage },
      })
    }
  }

  const handleSelect = async (url: string) => {
    const res = await fetch('/api/profileImage/setActive', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    if (res.ok) {
      const data = await res.json()
      dispatch({
        type: 'SET_PROFILE_IMAGES',
        payload: { images, active: data.activeProfileImage },
      })
    }
  }

  return (
    <ProfileImageManager
      images={images}
      active={active}
      placeholder={placeholder}
      onChange={(imgs, act) =>
        dispatch({
          type: 'SET_PROFILE_IMAGES',
          payload: { images: imgs, active: act },
        })
      }
      // @ts-ignore
      onUpload={handleUpload}
      onDelete={handleDelete}
      onSelect={handleSelect}
    />
  )
}
;('use client')
import React, { useState } from 'react'
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material'
import ImageUpload from './ImageUpload'
import ImageGallery from './ImageGallery'
import { ProfileImageManager } from '../ProfileImage/ProfileImageManager'
import { UseUser } from '../../context/UserContext'
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
        <Tab label="Profile Image" />
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

      <TabPanel
        value={tabValue}
        index={(showUploadButton ? 1 : 0) + (showGallery ? 1 : 0)}
      >
        <ProfileImageManagerWithContext />
      </TabPanel>
    </Paper>
  )
}
