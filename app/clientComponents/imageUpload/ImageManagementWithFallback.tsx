/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
'use client'
import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Alert,
  Chip,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  CloudUpload as CloudUploadIcon,
  Photo as PhotoIcon,
  Info as InfoIcon,
} from '@mui/icons-material'
import ImageUploadWithFallback from './ImageUploadWithFallback'
import EnhancedImageGallery from './EnhancedImageGallery'
import { getLocalStorageInfo } from '@lib/imageService'

export interface PoseImageData {
  id: string
  url: string
  altText?: string | null
  fileName?: string | null
  fileSize?: number | null
  uploadedAt: string
  storageType?: 'CLOUD' | 'LOCAL' | 'HYBRID'
  isOffline?: boolean
  localStorageId?: string | null
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
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

interface ImageManagementWithFallbackProps {
  title?: string
  showUploadButton?: boolean
  showGallery?: boolean
  variant?: 'full' | 'upload-only' | 'gallery-only'
  showStorageInfo?: boolean
}

/**
 * Enhanced image management component with local storage fallback
 * Provides seamless experience when cloud upload fails
 */
export default function ImageManagementWithFallback({
  title = 'Pose Images',
  showUploadButton = true,
  showGallery = true,
  variant = 'full',
  showStorageInfo = true,
}: ImageManagementWithFallbackProps) {
  const [tabValue, setTabValue] = useState(0)
  const [refreshGallery, setRefreshGallery] = useState(0)
  const [storageInfoOpen, setStorageInfoOpen] = useState(false)
  const [storageInfo, setStorageInfo] = useState<{
    used: number
    available: number
    quota: number
  } | null>(null)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleImageUploaded = (image: PoseImageData) => {
    // Refresh the gallery
    setRefreshGallery((prev) => prev + 1)
    // Switch to gallery tab to show the new image
    if (showGallery) {
      setTabValue(showUploadButton ? 1 : 0)
    }
  }

  const handleShowStorageInfo = async () => {
    try {
      const info = await getLocalStorageInfo()
      setStorageInfo(info)
      setStorageInfoOpen(true)
    } catch (error) {
      console.error('Failed to get storage info:', error)
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (variant === 'upload-only') {
    return (
      <Paper elevation={1} sx={{ p: 3, borderRadius: '16px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6">{title}</Typography>
          {showStorageInfo && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<InfoIcon />}
              onClick={handleShowStorageInfo}
            >
              Storage Info
            </Button>
          )}
        </Box>

        <Alert severity="info" sx={{ mb: 2 }}>
          Images will be uploaded to cloud storage. If upload fails,
          you`&apos;`ll have the option to save locally.
        </Alert>

        <ImageUploadWithFallback
          onImageUploaded={handleImageUploaded}
          variant="dropzone"
        />
      </Paper>
    )
  }

  if (variant === 'gallery-only') {
    return (
      <Paper elevation={1} sx={{ p: 3, borderRadius: '16px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6">{title}</Typography>
          {showStorageInfo && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<InfoIcon />}
              onClick={handleShowStorageInfo}
            >
              Storage Info
            </Button>
          )}
        </Box>
        <EnhancedImageGallery key={refreshGallery} />
      </Paper>
    )
  }

  return (
    <Paper elevation={1} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3,
          pb: 0,
        }}
      >
        <Typography variant="h6">{title}</Typography>
        {showStorageInfo && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<InfoIcon />}
            onClick={handleShowStorageInfo}
          >
            Storage Info
          </Button>
        )}
      </Box>

      {/* Info alert about fallback functionality */}
      <Box sx={{ px: 3, pt: 1 }}>
        <Alert severity="info" variant="outlined">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">
              Images are saved to cloud storage with local fallback for offline
              access.
            </Typography>
            <Chip
              icon={<CloudUploadIcon />}
              label="Cloud First"
              size="small"
              color="primary"
              variant="outlined"
            />
          </Stack>
        </Alert>
      </Box>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}
      >
        {showUploadButton && (
          <Tab icon={<CloudUploadIcon />} label="Upload" iconPosition="start" />
        )}
        {showGallery && (
          <Tab icon={<PhotoIcon />} label="Gallery" iconPosition="start" />
        )}
      </Tabs>

      {showUploadButton && (
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <ImageUploadWithFallback
              onImageUploaded={handleImageUploaded}
              variant="dropzone"
            />
          </Box>
        </TabPanel>
      )}

      {showGallery && (
        <TabPanel value={tabValue} index={showUploadButton ? 1 : 0}>
          <EnhancedImageGallery key={refreshGallery} />
        </TabPanel>
      )}

      {/* Storage Info Dialog */}
      <Dialog
        open={storageInfoOpen}
        onClose={() => setStorageInfoOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Storage Information</DialogTitle>
        <DialogContent>
          {storageInfo && (
            <Stack spacing={2}>
              <Alert severity="info">
                Your browser`&apos;`s local storage quota and usage for image
                fallback.
              </Alert>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Local Storage Usage
                </Typography>
                <Stack spacing={1}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="body2">Used:</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formatBytes(storageInfo.used)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="body2">Available:</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formatBytes(storageInfo.available)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="body2">Total Quota:</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formatBytes(storageInfo.quota)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Alert severity="warning" variant="outlined">
                <Typography variant="body2">
                  Local images are automatically synced to cloud when connection
                  is available. They serve as a fallback when cloud upload
                  fails.
                </Typography>
              </Alert>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStorageInfoOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
