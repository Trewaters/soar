import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material'
import ImageUpload from './ImageUpload'
import ImageGallery from './ImageGallery'
import { ProfileImageManager } from '../ProfileImage/ProfileImageManager'
import { UseUser } from '../../context/UserContext'
import { getUserProfileImages } from '@lib/profileImageService'
import { useSession } from 'next-auth/react'
import type { PoseImageData } from './ImageUpload'
import { PoseImage } from './types'

function ProfileImageManagerWithContext() {
  const { state, dispatch } = UseUser()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  const images = state.userData.profileImages || []
  const active = state.userData.activeProfileImage || null
  const placeholder = state.userData.image || '/images/profile-placeholder.png'

  // Load initial profile images when component mounts
  useEffect(() => {
    const loadInitialImages = async () => {
      if (!session?.user?.email) return

      // Only load if we don't already have images in context
      if (images.length === 0) {
        setLoading(true)
        try {
          const response = await getUserProfileImages()
          if (response.success) {
            dispatch({
              type: 'SET_PROFILE_IMAGES',
              payload: {
                images: response.images,
                active: response.activeImage,
              },
            })
          }
        } catch (error) {
          console.error('Failed to load profile images:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadInitialImages()
  }, [session?.user?.email, images.length, dispatch])

  // Upload, delete, and set active handlers
  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/profileImage', {
      method: 'POST',
      body: formData,
    })
    if (res.ok) {
      const data = await res.json()
      dispatch({
        type: 'SET_PROFILE_IMAGES',
        payload: {
          images: data.images,
          active: data.activeProfileImage || null,
        },
      })
    } else {
      const errorData = await res.json()
      console.error('Upload failed:', errorData)
      throw new Error(
        errorData.error || `Upload failed with status ${res.status}`
      )
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
      loading={loading}
      showHeader={false}
      onChange={(imgs, act) =>
        dispatch({
          type: 'SET_PROFILE_IMAGES',
          payload: { images: imgs, active: act },
        })
      }
      onUpload={handleUpload}
      onDelete={handleDelete}
      onSelect={handleSelect}
    />
  )
}
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
  variant?: 'full' | 'upload-only' | 'gallery-only' | 'profile-only'
  asanaId?: string
}

/**
 * Comprehensive image management component that combines upload and gallery functionality
 * Perfect for user profiles, asana creation, or any page where users need to manage images
 */
export default function ImageManagement({
  title = 'Profile Images',
  showUploadButton = false,
  showGallery = false,
  variant = 'full',
  asanaId,
}: ImageManagementProps) {
  const [tabValue, setTabValue] = useState(0)
  const [refreshGallery, setRefreshGallery] = useState(0)
  const [images, setImages] = useState<PoseImage[]>([])

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

  useEffect(() => {
    if (asanaId) {
      const fetchImages = async () => {
        try {
          const res = await fetch(`/api/asana/${asanaId}/images`)
          if (res.ok) {
            const data = await res.json()
            setImages(data.images)
          }
        } catch (error) {
          console.error('Failed to fetch asana images:', error)
        }
      }
      fetchImages()
    }
  }, [asanaId, refreshGallery])

  const handleImagesChange = (updatedImages: PoseImage[]) => {
    setImages(updatedImages)
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
        <ImageGallery
          key={refreshGallery}
          asanaId={asanaId || ''}
          initialImages={images}
          onImagesChange={handleImagesChange}
        />
      </Paper>
    )
  }

  if (variant === 'profile-only') {
    return (
      <Box sx={{ px: 3 }}>
        {title && (
          <Typography variant="h6" sx={{ mb: 2 }}>
            {title}
          </Typography>
        )}
        <ProfileImageManagerWithContext />
      </Box>
    )
  }

  return (
    <Paper elevation={1} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
      {title && (
        <Typography variant="h6" sx={{ p: 3, pb: 0 }}>
          {title}
        </Typography>
      )}

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
          <ImageGallery
            key={refreshGallery}
            asanaId={asanaId || ''}
            initialImages={images}
            onImagesChange={handleImagesChange}
          />
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
