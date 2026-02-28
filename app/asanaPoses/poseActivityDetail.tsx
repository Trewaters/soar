'use client'
import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Image from 'next/image'
import {
  Box,
  Button,
  IconButton,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Alert,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import AsanaDetails from '@app/clientComponents/asanaUi/asanaDetails'
import AsanaDetailsEdit from '@app/clientComponents/asanaUi/AsanaDetailsEdit'
import {
  ASANA_FIELD_DEFINITIONS_BY_KEY,
  type AsanaFieldKey,
  type AsanaFormData,
  createEmptyAsanaFormData,
  createAsanaFields,
} from '@app/clientComponents/asanaUi/asanaFieldConstants'
import WeeklyActivityViewer from '@app/clientComponents/WeeklyActivityViewer'
import ActivityTracker from '@app/clientComponents/ActivityTracker'
import { useSession } from 'next-auth/react'
import { useCanEditContent } from '@app/hooks/useCanEditContent'
import {
  checkActivityExists,
  createAsanaActivity,
  deleteAsanaActivity,
} from '@lib/asanaActivityClientService'
import ImageCarousel from '@app/clientComponents/imageUpload/ImageCarousel'
import CarouselDotNavigation from '@app/clientComponents/imageUpload/CarouselDotNavigation'
import { getUserPoseImages, type PoseImageData } from '@lib/imageService'
import { deletePose, updatePose, type UpdatePoseInput } from '@lib/poseService'
import PoseImageManagement from '@app/clientComponents/imageUpload/PoseImageManagement'
import PoseImageUpload from '@app/clientComponents/imageUpload/PoseImageUpload'
import HelpDrawer from '@app/clientComponents/HelpDrawer'
import { AsanaPose, ASANA_CATEGORIES } from 'types/asana'
import { HELP_PATHS } from '@app/utils/helpLoader'
import NAV_PATHS from '@app/utils/navigation/constants'
import { AsanaUpdatePayloadValidator } from '@app/utils/validation/schemas/asana'
import { formatValidationError } from '@app/utils/validation/errorFormatter'

const yogaMatWoman = '/yogaMatWoman.svg'

/*  
Developer Notes:
Prioritized Details...

1. Name of Asana
2. Picture of Asana
3. Description of Asana
4. Category of Asana
5. Difficulty of Asana
6. Activity Streaks, Mark Asana as Complete
7. Dristi

*/

export interface PoseCardProps {
  poseCardProp: AsanaPose
  initialEditMode?: boolean
  showActions?: boolean
  showInlineEditIcon?: boolean
  onSaveSuccess?: () => void
}

// Custom hook to fetch pose images
const usePoseImages = (poseId?: string, poseName?: string) => {
  const [images, setImages] = useState<PoseImageData[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { data: session } = useSession()

  const refresh = React.useCallback(() => {
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  const addImage = React.useCallback((image: PoseImageData) => {
    setImages((prev) => {
      if (prev.some((img) => img.id === image.id)) return prev
      return [image, ...prev]
    })
  }, [])

  useEffect(() => {
    const fetchImages = async () => {
      // Fetch images when we have either a poseId or poseName.
      // Do not require a logged-in session — public pose images should be visible.
      if (!poseId && !poseName) {
        return
      }

      try {
        setLoading(true)
        const response = await getUserPoseImages(50, 0, poseId, poseName)
        setImages(response.images)
      } catch (error) {
        console.error('[usePoseImages] Error fetching images:', error)
        setImages([])
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [session?.user?.id, poseId, poseName, refreshTrigger])

  return { images, loading, refresh, addImage }
}

export default function PoseActivityDetail({
  poseCardProp,
  initialEditMode = false,
  showInlineEditIcon = true,
  onSaveSuccess,
}: PoseCardProps) {
  const pose = poseCardProp
  const router = useNavigationWithLoading()
  const { data: session } = useSession()
  const { canEdit } = useCanEditContent(pose?.created_by)
  const [activityRefreshTrigger, setActivityRefreshTrigger] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleImageUploaded = (image: PoseImageData) => {
    addImage(image)
    refreshImages()
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [open, setOpen] = useState(false)

  // Inline Edit Mode State
  const [isEditing, setIsEditing] = useState(initialEditMode)

  const [formData, setFormData] = useState<AsanaFormData>(
    createEmptyAsanaFormData()
  )

  // Stable setter for form fields to avoid extra re-renders
  const setField = React.useCallback((key: AsanaFieldKey, value: any) => {
    setFormData((prev) => {
      if (prev[key] === value) return prev
      return { ...prev, [key]: value }
    })
  }, [])

  const formFields = React.useMemo(
    () => createAsanaFields(formData, setField, [...ASANA_CATEGORIES]),
    [formData, setField]
  )

  // Fetch uploaded images for this pose
  const {
    images: poseImages,
    refresh: refreshImages,
    addImage,
  } = usePoseImages(pose?.id?.toString(), pose?.sort_english_name)

  // Ensure carousel index is valid when images change (e.g. after deletion)
  useEffect(() => {
    if (poseImages.length > 0 && currentImageIndex >= poseImages.length) {
      setCurrentImageIndex(Math.max(0, poseImages.length - 1))
    } else if (poseImages.length === 0 && currentImageIndex !== 0) {
      setCurrentImageIndex(0)
    }
  }, [poseImages.length, currentImageIndex])

  // Handle carousel image index changes
  const handleCarouselIndexChange = (index: number) => {
    setCurrentImageIndex(index)
  }

  const getAsanaBackgroundUrl = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'prone':
        return `url('/images/asana/AsanaBackground.png')`
      case 'standing':
        return `url('/images/asana/AsanaBackground.png')`
      case 'seated':
        return `url('/images/asana/AsanaBackground.png')`
      case 'supine':
        return `url('/images/asana/AsanaBackground.png')`
      case 'inversion':
        return `url('/images/asana/AsanaBackground.png')`
      case 'arm_leg_support':
        return `url('/images/asana/AsanaBackground.png')`
      case 'arm_balance_and_inversion':
        return `url('/images/asana/AsanaBackground.png')`
      default:
        return `url('/images/asana/AsanaBackground.png')`
    }
  }

  // Get background image for display - only use patterns when no uploaded images
  const getPoseBackgroundImage = () => {
    // Always use category-based background pattern since uploaded images are displayed separately
    return getAsanaBackgroundUrl(pose?.category)
  }

  function handleClick() {
    if (!pose?.sort_english_name) return

    const posePath = encodeURIComponent(pose.sort_english_name)
    router.push(`${NAV_PATHS.VIEW_ASANA_PRACTICE}/${posePath}`, undefined, {
      scroll: false,
    })
  }

  // Initialize form data when entering edit mode
  useEffect(() => {
    if (isEditing && pose) {
      setFormData({
        sort_english_name: pose.sort_english_name || '',
        english_names: pose.english_names || [],
        sanskrit_names: pose.sanskrit_names || [],
        alternative_english_names: pose.alternative_english_names || [],
        description: pose.description || '',
        category: pose.category || '',
        difficulty: pose.difficulty || '',
        dristi: pose.dristi || '',
        setup_cues: pose.setup_cues || '',
        deepening_cues: pose.deepening_cues || '',
      })
      setError(null)
    }
  }, [isEditing, pose])

  // Keep local edit state in sync with parent-provided initialEditMode
  useEffect(() => {
    setIsEditing(initialEditMode)
  }, [initialEditMode])

  // Keep the URL query param `edit=true` in sync so refreshing the page
  // preserves whether the user was editing.
  const syncEditQueryParam = (edit: boolean) => {
    try {
      const url = new URL(window.location.href)
      if (edit) {
        url.searchParams.set('edit', 'true')
      } else {
        url.searchParams.delete('edit')
      }
      // Replace state to avoid adding history entries when toggling edit
      window.history.replaceState({}, '', url.toString())
    } catch (e) {
      // ignore in non-browser environments
    }
  }

  const handleEditToggle = () => {
    if (!session?.user?.email) {
      setError('You must be logged in to edit poses')
      return
    }

    // Check if user can edit (either owner or admin)
    if (!canEdit) {
      setError('You do not have permission to edit this pose')
      return
    }

    const nextEdit = !isEditing
    setIsEditing(nextEdit)
    syncEditQueryParam(nextEdit)
    if (!nextEdit) {
      // Canceling edit - clear error
      setError(null)
    }
  }

  const handleDeletePose = async () => {
    if (!pose?.id) return
    const confirmed = window.confirm(
      `Do you really want to delete ${pose?.sort_english_name}?`
    )
    if (!confirmed) return

    try {
      await deletePose(pose.id)
      router.refresh()
      router.replace(`${NAV_PATHS.PRACTICE_ASANAS}?refresh=true`)
    } catch (e: any) {
      setError(e?.message || 'Failed to delete pose')
    }
  }

  const handleSaveEdit = async () => {
    setError(null)

    if (!session?.user?.email) {
      setError('You must be logged in to edit poses')
      return
    }

    // Check if user can edit (either owner or admin)
    if (!canEdit) {
      setError('You do not have permission to edit this pose')
      return
    }

    const updatedAsana: UpdatePoseInput = {
      sort_english_name: formData.sort_english_name,
      english_names: formData.english_names,
      description: formData.description || '',
      category: formData.category || '',
      difficulty: formData.difficulty || '',
      sanskrit_names: formData.sanskrit_names,
      dristi: formData.dristi || '',
      setup_cues: formData.setup_cues || '',
      deepening_cues: formData.deepening_cues || '',
      alternative_english_names: formData.alternative_english_names,
    }

    const validationResult = AsanaUpdatePayloadValidator.validate(updatedAsana)
    if (!validationResult.isValid) {
      const validationMessage = Object.entries(validationResult.errors)
        .flatMap(([field, reasons]) =>
          reasons.map((reason) => formatValidationError(field, reason))
        )
        .join(' | ')

      setError(
        validationMessage || 'Please fix validation errors before saving'
      )
      return
    }

    try {
      // Update the pose text data
      await updatePose(
        pose.id,
        validationResult.normalizedData as UpdatePoseInput
      )

      // Exit edit mode and refresh the page data
      setIsEditing(false)
      syncEditQueryParam(false)
      // If parent provided a refresh handler, call it so the parent can re-fetch
      // its data (this avoids needing a full browser reload). Fall back to
      // router.refresh() for backward compatibility.
      if (typeof onSaveSuccess === 'function') {
        try {
          onSaveSuccess()
        } catch (e) {
          console.error('onSaveSuccess handler threw:', e)
          router.refresh()
        }
      } else {
        router.refresh()
      }
    } catch (error: Error | any) {
      setError(error.message || 'Failed to update pose')
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    syncEditQueryParam(false)
    setError(null)
  }

  return (
    <Paper
      sx={{
        mt: '-2.2px',
        backgroundColor: 'navSplash.dark',
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          backgroundImage: getPoseBackgroundImage(),
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          alignContent: 'space-around',
          display: 'flex',
          flexDirection: 'column',
          pb: 4,
          position: 'relative',
          transition: 'background-image 0.5s ease-in-out',
          width: '100%',
          maxWidth: '600px', // Match practice series page width
          mx: 'auto',
        }}
      >
        {/* Display image carousel when uploaded images are available */}
        {poseImages && poseImages.length > 0 ? (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: '500px',
              alignSelf: 'center',
              mt: 3,
              mb: 2,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              zIndex: 1,
            }}
          >
            {/* Convert PoseImageData for carousel */}
            <ImageCarousel
              images={poseImages.map((img) => ({
                id: img.id,
                userId: '',
                poseId: pose?.id?.toString(),
                poseName: pose?.sort_english_name,
                url: img.url,
                altText: img.altText || undefined,
                fileName: img.fileName || undefined,
                fileSize: img.fileSize || undefined,
                uploadedAt: new Date(img.uploadedAt),
                storageType: 'CLOUD' as const,
                localStorageId: undefined,
                isOffline: false,
                imageType: 'pose',
                displayOrder: (img as any).displayOrder ?? 1,
                createdAt: new Date(img.uploadedAt),
                updatedAt: new Date(img.uploadedAt),
              }))}
              currentIndex={currentImageIndex}
              onIndexChange={handleCarouselIndexChange}
              height={300}
              showArrows={poseImages.length > 1}
              aria-label={`Images for ${pose?.sort_english_name} pose`}
            />

            {/* Action Icons Overlay */}
            {showInlineEditIcon && session && session.user && canEdit && (
              <>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    zIndex: 4,
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  {!isEditing ? (
                    <IconButton
                      aria-label="Edit pose"
                      title="Edit pose"
                      onClick={handleEditToggle}
                      sx={{
                        color: 'primary.main',
                        backgroundColor: 'rgba(255, 255, 255, 0.6)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      }}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  ) : (
                    <>
                      <IconButton
                        aria-label="Save changes"
                        title="Save changes"
                        onClick={handleSaveEdit}
                        sx={{
                          color: 'primary.main',
                          backgroundColor: 'rgba(255, 255, 255, 0.6)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          },
                        }}
                        size="small"
                      >
                        <SaveIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="Cancel editing"
                        title="Cancel editing"
                        onClick={handleCancelEdit}
                        sx={{
                          color: 'primary.contrastText',
                          backgroundColor: 'rgba(255, 255, 255, 0.6)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          },
                        }}
                        size="small"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Box>

                {isEditing && (
                  <>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 5, // Higher than carousel dots
                      }}
                    >
                      <IconButton
                        aria-label="Delete pose"
                        title="Delete pose"
                        onClick={handleDeletePose}
                        sx={{
                          color: 'error.main',
                          backgroundColor: 'rgba(255, 255, 255, 0.6)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          },
                        }}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        zIndex: 5,
                      }}
                    >
                      <PoseImageUpload
                        poseId={pose?.id?.toString() || ''}
                        poseName={pose?.sort_english_name}
                        variant="icon-button"
                        onImageUploaded={handleImageUploaded}
                        iconSize="small"
                        refreshTrigger={poseImages.length}
                      />
                    </Box>
                  </>
                )}
              </>
            )}

            {/* Pose name overlay on image */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
                p: 2,
                zIndex: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                }}
              >
                {pose?.sort_english_name}
              </Typography>

              {/* Dot navigation for multiple images - moved to center below name */}
              {poseImages.length > 1 && (
                <Box sx={{ mt: 0.5, mb: 0.5 }}>
                  <CarouselDotNavigation
                    images={poseImages.map((img) => ({
                      id: img.id,
                      userId: '',
                      poseId: pose?.id?.toString(),
                      poseName: pose?.sort_english_name,
                      url: img.url,
                      altText: img.altText || undefined,
                      fileName: img.fileName || undefined,
                      fileSize: img.fileSize || undefined,
                      uploadedAt: new Date(img.uploadedAt),
                      storageType: 'CLOUD' as const,
                      localStorageId: undefined,
                      isOffline: false,
                      imageType: 'pose',
                      displayOrder: (img as any).displayOrder ?? 1,
                      createdAt: new Date(img.uploadedAt),
                      updatedAt: new Date(img.uploadedAt),
                    }))}
                    activeIndex={currentImageIndex}
                    onIndexChange={handleCarouselIndexChange}
                    size="small"
                    color="secondary"
                  />
                </Box>
              )}
            </Box>
          </Box>
        ) : null}

        {/* Header when no images are available */}
        {(!poseImages || poseImages.length === 0) && (
          <Stack alignItems="center" sx={{ mt: 3 }}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: '100%', sm: '400px' },
                height: '200px',
                backgroundColor: 'info.contrastText',
                borderRadius: '12px',
                boxShadow: '0 2px 2px 2px rgba(211, 211, 211, 0.5)',
                px: 2,
              }}
            >
              <Typography
                variant="h1"
                component={'h2'}
                sx={{
                  color: 'primary.main',
                  textAlign: 'center',
                }}
              >
                {pose?.sort_english_name}
              </Typography>

              {/* Action Icons Overlay for No Image */}
              {showInlineEditIcon && session && session.user && canEdit && (
                <>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      zIndex: 4,
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    {!isEditing ? (
                      <IconButton
                        aria-label="Edit pose"
                        title="Edit pose"
                        onClick={handleEditToggle}
                        sx={{
                          color: 'primary.main',
                          backgroundColor: 'rgba(0, 0, 0, 0.05)',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          },
                        }}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <>
                        <IconButton
                          aria-label="Save changes"
                          title="Save changes"
                          onClick={handleSaveEdit}
                          sx={{
                            color: 'primary.main',
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            },
                          }}
                          size="small"
                        >
                          <SaveIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="Cancel editing"
                          title="Cancel editing"
                          onClick={handleCancelEdit}
                          sx={{
                            color: 'primary.contrastText',
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            },
                          }}
                          size="small"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </Box>

                  {isEditing && (
                    <>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          zIndex: 4,
                        }}
                      >
                        <IconButton
                          aria-label="Delete pose"
                          title="Delete pose"
                          onClick={handleDeletePose}
                          sx={{
                            color: 'error.main',
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            },
                          }}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 16,
                          left: 16,
                          zIndex: 4,
                        }}
                      >
                        <PoseImageUpload
                          poseId={pose?.id?.toString() || ''}
                          poseName={pose?.sort_english_name}
                          variant="icon-button"
                          onImageUploaded={handleImageUploaded}
                          iconSize="small"
                          refreshTrigger={poseImages.length}
                        />
                      </Box>
                    </>
                  )}
                </>
              )}
            </Box>
          </Stack>
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '600px', // Match practice series page width
          mx: 'auto',
          px: { xs: 0, sm: 2 }, // Remove padding on mobile for full width
        }}
      >
        <Stack direction={'column'} spacing={0}>
          {/* Activity Tracker and Action Buttons (Moved to top for better accessibility) */}
          {pose && pose.id && (
            <Box
              sx={{
                mt: 1,
                mb: 1,
                width: '100%',
                px: { xs: 0, sm: 2 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: { xs: 'stretch', sm: 'center' },
                alignItems: 'center',
                '@media (max-width: 384px)': {
                  px: 0,
                  justifyContent: 'stretch',
                },
              }}
            >
              {/* Mark as Complete control moved higher up per design instructions */}
              <Box
                sx={{
                  mb: 2,
                  mx: 'auto',
                  width: '100%',
                  maxWidth: '600px',
                }}
              >
                <ActivityTracker
                  entityId={pose.id.toString()}
                  entityName={pose.sort_english_name}
                  entityType="asana"
                  variant="chips"
                  checkActivity={checkActivityExists}
                  createActivity={createAsanaActivity}
                  deleteActivity={deleteAsanaActivity}
                  onActivityRefresh={() =>
                    setActivityRefreshTrigger((prev) => prev + 1)
                  }
                  additionalActivityData={{
                    sort_english_name: pose.sort_english_name,
                    duration: 0,
                  }}
                />
              </Box>

              <Accordion
                elevation={0}
                sx={{
                  mb: 2,
                  mx: 'auto',
                  width: '100%',
                  maxWidth: '600px',
                  backgroundColor: 'navSplash.dark',
                  '&:before': {
                    display: 'none',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="weekly-activity-content"
                  id="weekly-activity-header"
                >
                  <Typography variant="subtitle1">Weekly Activity</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <WeeklyActivityViewer
                    entityId={pose.id.toString()}
                    entityName={pose.english_names[0] || pose.sort_english_name}
                    entityType="asana"
                    variant="detailed"
                    refreshTrigger={activityRefreshTrigger}
                  />
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
          {!isEditing ? (
            <>
              {/* View Mode */}
              <AsanaDetails
                details={
                  Array.isArray(pose?.sanskrit_names)
                    ? pose.sanskrit_names.join(', ')
                    : (pose?.sanskrit_names as any) || ''
                }
                label={ASANA_FIELD_DEFINITIONS_BY_KEY.sanskrit_names.label}
                sx={{ mb: '32px' }}
              />
              <AsanaDetails
                details={pose?.english_names?.join(', ')}
                label={ASANA_FIELD_DEFINITIONS_BY_KEY.english_names.label}
                sx={{
                  mb: '32px',
                }}
              />
              <AsanaDetails
                details={pose?.alternative_english_names?.join(', ')}
                label={
                  ASANA_FIELD_DEFINITIONS_BY_KEY.alternative_english_names.label
                }
                sx={{
                  mb: '32px',
                }}
              />
              <AsanaDetails
                details={pose?.description}
                label={ASANA_FIELD_DEFINITIONS_BY_KEY.description.label}
                sx={{
                  mb: '32px',
                }}
              />
              <AsanaDetails
                details={`${pose?.category}`}
                label={ASANA_FIELD_DEFINITIONS_BY_KEY.category.label}
                showCategoryIcon
                sx={{ mb: '32px' }}
              />
              <AsanaDetails
                details={pose?.difficulty}
                label={ASANA_FIELD_DEFINITIONS_BY_KEY.difficulty.label}
                sx={{ mb: '32px' }}
              />
              <AsanaDetails
                details={pose?.dristi}
                label={ASANA_FIELD_DEFINITIONS_BY_KEY.dristi.label}
                sx={{ mb: '32px' }}
              />
              <AsanaDetails
                details={pose?.setup_cues}
                label={ASANA_FIELD_DEFINITIONS_BY_KEY.setup_cues.label}
                sx={{ mb: '32px' }}
              />
              <AsanaDetails
                details={pose?.deepening_cues}
                label={ASANA_FIELD_DEFINITIONS_BY_KEY.deepening_cues.label}
                sx={{ mb: '32px' }}
              />
            </>
          ) : (
            <>
              {/* Consolidated Edit Mode */}
              <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Pose Information
                </Typography>
                <AsanaDetailsEdit fields={formFields} sx={{ mt: 2 }} />
              </Paper>
            </>
          )}

          {/* Enhanced Image Gallery */}
          {pose && (
            <Box sx={{ mt: 4, mb: 4, mx: { xs: 0, sm: 2 } }}>
              <PoseImageManagement
                title={`Images for ${pose.sort_english_name}`}
                poseId={pose.id?.toString()}
                poseName={pose.sort_english_name}
                variant={isEditing ? 'full' : 'gallery-only'}
                showUploadButton={isEditing}
                enableManagement={isEditing}
                onImagesChange={refreshImages}
                refreshTrigger={poseImages.length}
              />
            </Box>
          )}
        </Stack>
      </Box>

      {showInlineEditIcon && session?.user && canEdit && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            px: 2,
            mt: 1,
            mb: 1,
            width: '100%',
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              alignItems: 'stretch',
            }}
          >
            {!isEditing ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditToggle}
                startIcon={<EditIcon fontSize="small" />}
                sx={{ textTransform: 'none', borderRadius: '10px' }}
                aria-label="Edit pose"
              >
                Edit
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveEdit}
                  startIcon={<SaveIcon fontSize="small" />}
                  sx={{ textTransform: 'none', borderRadius: '10px' }}
                  aria-label="Save changes"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleCancelEdit}
                  startIcon={<CloseIcon fontSize="small" />}
                  sx={{ textTransform: 'none', borderRadius: '10px' }}
                  aria-label="Cancel editing"
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDeletePose}
                  startIcon={<DeleteIcon fontSize="small" />}
                  sx={{ textTransform: 'none', borderRadius: '10px' }}
                  aria-label="Delete pose"
                >
                  Delete
                </Button>
              </>
            )}
          </Stack>
        </Box>
      )}

      {pose && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 2,
            mb: 3,
            px: 2,
            width: '100%',
          }}
        >
          <Stack
            direction={'column'}
            spacing={2}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              alignItems: 'stretch',
              mb: 4,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleClick}
              startIcon={
                <Image src={yogaMatWoman} alt="" width={20} height={20} />
              }
              sx={{
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                textTransform: 'none',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                width: { xs: '100%', sm: 'auto' },
                minWidth: { sm: '180px' },
              }}
              aria-label="Open practice view"
            >
              Practice View
            </Button>
          </Stack>
        </Box>
      )}

      {/* Sticky Bottom Action Bar - Removed redundant buttons per request */}
      <HelpDrawer
        content={HELP_PATHS.asanas.practice}
        open={open}
        onClose={() => setOpen(false)}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  )
}
