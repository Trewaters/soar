'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual'
import CloudDoneIcon from '@mui/icons-material/CloudDone'
import { useSession } from 'next-auth/react'
import { getImageUploadStatus, type ImageStatus } from '@lib/imageStatus'
import PoseImageGallery from './PoseImageGallery'
import PoseImageUpload from './PoseImageUpload'

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

export interface PoseImageManagementProps {
  title?: string
  poseId?: string
  poseName?: string
  showUploadButton?: boolean
  showGallery?: boolean
  enableManagement?: boolean
  onImagesChange?: () => void
  variant?: 'full' | 'upload-only' | 'gallery-only'
  refreshTrigger?: any
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
  enableManagement = true,
  onImagesChange,
  variant = 'full',
  refreshTrigger,
}: PoseImageManagementProps) {
  const { data: session } = useSession()
  const [tabValue, setTabValue] = useState(0)
  const [refreshGallery, setRefreshGallery] = useState(0)
  const [imageStatus, setImageStatus] = useState<ImageStatus | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      if (poseId && session?.user?.email) {
        const result = await getImageUploadStatus(poseId, session.user.email)
        if (!result.error) {
          setImageStatus(result.status)
        }
      }
    }
    fetchStatus()
  }, [poseId, session?.user?.email, refreshGallery, refreshTrigger])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleGalleryChange = () => {
    // Refresh status when gallery changes (e.g. image deleted)
    setRefreshGallery((prev) => prev + 1)
    if (onImagesChange) {
      onImagesChange()
    }
  }

  const handleImageUploaded = () => {
    setRefreshGallery((prev) => prev + 1)
    if (onImagesChange) {
      onImagesChange()
    }
  }

  const renderHeader = () => (
    <Box
      sx={{
        p: 3,
        pb: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Typography variant="h6" sx={{ color: 'primary.main' }}>
        {title}
      </Typography>
      {showUploadButton && enableManagement && (
        <PoseImageUpload
          poseId={poseId}
          poseName={poseName}
          variant="icon-button"
          onImageUploaded={handleImageUploaded}
          iconSize="small"
          refreshTrigger={refreshGallery}
        />
      )}
    </Box>
  )

  const renderInfoContent = () => (
    <Box>
      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        Image Guidelines
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Manage and view images for this yoga pose. Use the upload icon button at
        the top right of this panel to add new images.
      </Typography>

      <List dense>
        <ListItem>
          <ListItemIcon>
            <PhotoSizeSelectActualIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Accepted Formats"
            secondary="JPEG, PNG, and WebP are supported."
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <InfoIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="File Size Limit"
            secondary="Maximum 10MB per image."
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CloudDoneIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Usage Limit"
            secondary={
              imageStatus
                ? `${imageStatus.currentCount} of ${imageStatus.maxAllowed} images currently used.`
                : 'Up to 3 images allowed per asana.'
            }
          />
        </ListItem>
      </List>

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" spacing={1} alignItems="center">
        <CheckCircleIcon color="success" fontSize="small" />
        <Typography variant="body2">
          Click the <strong>Upload</strong> icon next to this panel title in
          edit mode to manage content.
        </Typography>
      </Stack>
    </Box>
  )

  if (variant === 'upload-only') {
    return (
      <Paper elevation={1} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        {renderHeader()}
        {renderInfoContent()}
      </Paper>
    )
  }

  if (variant === 'gallery-only') {
    return (
      <Paper elevation={1} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        {renderHeader()}
        <PoseImageGallery
          key={refreshGallery}
          poseId={poseId}
          poseName={poseName}
          enableManagement={enableManagement}
          onImagesChange={handleGalleryChange}
          refreshTrigger={refreshTrigger}
        />
      </Paper>
    )
  }

  return (
    <Paper elevation={1} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
      {renderHeader()}

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {showUploadButton && <Tab label="Info" />}
        {showGallery && <Tab label="Gallery" />}
      </Tabs>

      {showUploadButton && (
        <TabPanel value={tabValue} index={0}>
          {renderInfoContent()}
        </TabPanel>
      )}

      {showGallery && (
        <TabPanel value={tabValue} index={showUploadButton ? 1 : 0}>
          <PoseImageGallery
            key={refreshGallery}
            poseId={poseId}
            poseName={poseName}
            enableManagement={enableManagement}
            onImagesChange={handleGalleryChange}
            refreshTrigger={refreshTrigger}
          />
        </TabPanel>
      )}
    </Paper>
  )
}
