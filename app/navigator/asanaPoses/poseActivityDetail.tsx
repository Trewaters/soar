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
import { FEATURES } from '@app/FEATURES'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import AsanaDetails from '@app/clientComponents/asanaUi/asanaDetails'
import AsanaDetailsEdit, {
  AsanaEditFieldProps,
} from '@app/clientComponents/asanaUi/AsanaDetailsEdit'
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
import HelpDrawer from '@app/clientComponents/HelpDrawer'
import ImageGallery from '@app/clientComponents/imageUpload/ImageGallery'
import { AsanaPose, ASANA_CATEGORIES } from 'types/asana'
import { HELP_PATHS } from '@app/utils/helpLoader'
import NAV_PATHS from '@app/utils/navigation/constants'

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

interface PoseCardProps {
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
  const { data: session } = useSession()

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
        setImages([])
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [session?.user?.id, poseId, poseName])

  return { images, loading }
}

export default function PoseActivityDetail({
  poseCardProp,
  initialEditMode = false,
  showActions = true,
  showInlineEditIcon = true,
  onSaveSuccess,
}: PoseCardProps) {
  const pose = poseCardProp
  const router = useNavigationWithLoading()
  const { data: session } = useSession()
  const { canEdit } = useCanEditContent(pose?.created_by)
  const [activityRefreshTrigger, setActivityRefreshTrigger] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [showUndoSnackbar, setShowUndoSnackbar] = useState(false)
  const deleteTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current)
      }
    }
  }, [])

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [open, setOpen] = useState(false)

  // Inline Edit Mode State
  const [isEditing, setIsEditing] = useState(initialEditMode)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<any[]>([])

  const [formData, setFormData] = useState<{
    sort_english_name: string
    english_names: string[]
    description: string
    category: string
    difficulty: string
    sanskrit_names?: string[]
    alternative_english_names?: string[]
    dristi?: string
    setup_cues?: string
    deepening_cues?: string
    breath_direction_default?: string
  }>({
    sort_english_name: '',
    english_names: [],
    description: '',
    category: '',
    difficulty: '',
    sanskrit_names: [],
    alternative_english_names: [],
    dristi: '',
    setup_cues: '',
    deepening_cues: '',
    breath_direction_default: '',
  })

  // Stable setter for form fields to avoid extra re-renders
  const setField = React.useCallback((key: string, value: any) => {
    setFormData((prev) => {
      if ((prev as any)[key] === value) return prev
      return { ...prev, [key]: value }
    })
  }, [])

  const formFields: AsanaEditFieldProps[] = React.useMemo(
    () => [
      {
        type: 'text',
        fieldKey: 'sort_english_name',
        label: 'Asana Pose Name',
        value: formData.sort_english_name,
        required: true,
        placeholder: 'Enter the name of the asana',
        onChange: (value: any) => setField('sort_english_name', value),
      },
      {
        type: 'variations',
        fieldKey: 'english_names',
        label: 'Name Variations',
        value: formData.english_names,
        placeholder: 'e.g. Downward Dog, Adho Mukha Svanasana',
        helperText: 'Separate variants with commas',
        onChange: (value: any) => setField('english_names', value),
      },
      {
        type: 'variations',
        fieldKey: 'alternative_english_names',
        label: 'Alternative Names (Custom/Nicknames)',
        value: formData.alternative_english_names || [],
        placeholder: 'e.g. My favorite twist, Pretzel pose',
        helperText: 'Multiple nicknames separated by commas',
        onChange: (value: any) => setField('alternative_english_names', value),
      },
      {
        type: 'variations',
        fieldKey: 'sanskrit_names',
        label: 'Sanskrit Names',
        value: formData.sanskrit_names || [],
        placeholder: 'e.g. Virabhadrasana I, ...',
        helperText: 'Separate multiple names with commas',
        onChange: (value: any) => setField('sanskrit_names', value),
      },
      {
        type: 'multiline',
        fieldKey: 'description',
        label: 'Description',
        value: formData.description,
        placeholder:
          'Describe the pose alignment, position, and key characteristics...',
        required: true,
        rows: 4,
        onChange: (value: any) => setField('description', value),
      },
      {
        type: 'autocomplete',
        fieldKey: 'category',
        label: 'Category',
        value: formData.category,
        options: [...ASANA_CATEGORIES],
        placeholder: 'Select or type category',
        required: true,
        freeSolo: true,
        onChange: (value: any) => setField('category', value),
      },
      {
        type: 'buttonGroup',
        fieldKey: 'difficulty',
        label: 'Difficulty Level',
        value: formData.difficulty,
        options: ['Easy', 'Average', 'Difficult'],
        helperText: 'Select the difficulty level for this asana',
        onChange: (value: any) => setField('difficulty', value),
      },
      {
        type: 'text',
        fieldKey: 'dristi',
        label: 'Dristi',
        value: formData.dristi || '',
        placeholder: 'Gaze point',
        onChange: (value: any) => setField('dristi', value),
      },
      {
        type: 'multiline',
        fieldKey: 'setup_cues',
        label: 'Setup Cues',
        value: formData.setup_cues || '',
        rows: 2,
        onChange: (value: any) => setField('setup_cues', value),
      },
      {
        type: 'multiline',
        fieldKey: 'deepening_cues',
        label: 'Deepening Cues',
        value: formData.deepening_cues || '',
        rows: 2,
        onChange: (value: any) => setField('deepening_cues', value),
      },
    ],
    [formData, setField]
  )

  // Fetch uploaded images for this pose
  const { images: poseImages } = usePoseImages(
    pose?.id?.toString(),
    pose?.sort_english_name
  )

  // Handle carousel image index changes
  const handleCarouselIndexChange = (index: number) => {
    setCurrentImageIndex(index)
  }

  const getAsanaIconUrl = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'prone':
        return '/icons/designImages/asana-standing.svg'
      case 'standing':
        return '/icons/designImages/asana-standing.svg'
      case 'seated':
        return '/icons/designImages/asana-supine.svg'
      case 'supine':
        return '/icons/designImages/asana-supine.svg'
      case 'inversion':
        return '/icons/designImages/asana-inverted.svg'
      case 'arm_leg_support':
        return '/icons/designImages/asana-inverted.svg'
      case 'arm_balance_and_inversion':
        return '/icons/designImages/asana-inverted.svg'
      default:
        return '/stick-tree-pose-400x400.png'
    }
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
        return 'image/asana/AsanaBackground.png'
    }
  }

  // Get background image for display - only use patterns when no uploaded images
  const getPoseBackgroundImage = () => {
    // Always use category-based background pattern since uploaded images are displayed separately
    return getAsanaBackgroundUrl(pose?.category)
  }

  function handleClick() {
    const targetId = encodeURIComponent(
      (pose?.id && pose.id.toString && pose.id.toString()) ||
        pose?.sort_english_name ||
        ''
    )
    router.push(`${NAV_PATHS.PRACTICE_ASANAS}?id=${targetId}`)
  }

  // Initialize form data when entering edit mode
  useEffect(() => {
    if (isEditing && pose) {
      setFormData({
        sort_english_name: pose.sort_english_name || '',
        english_names: pose.english_names || [],
        alternative_english_names: pose.alternative_english_names || [],
        description: pose.description || '',
        category: pose.category || '',
        difficulty: pose.difficulty || '',
        sanskrit_names: pose.sanskrit_names || [],
        dristi: pose.dristi || '',
        setup_cues: pose.setup_cues || '',
        deepening_cues: pose.deepening_cues || '',
        breath_direction_default: (pose as any).breath_direction_default || '',
      })
      setImages(pose.poseImages || [])
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

  // Edit mode form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
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

    // Show undo snackbar and start countdown
    setShowUndoSnackbar(true)

    deleteTimeoutRef.current = setTimeout(async () => {
      try {
        await deletePose(pose.id)
        setShowUndoSnackbar(false)
        // Force refresh and navigate to practice asanas page
        router.refresh()
        router.replace(NAV_PATHS.PRACTICE_ASANAS)
      } catch (e: any) {
        setError(e?.message || 'Failed to delete pose')
        setShowUndoSnackbar(false)
      }
    }, 5000) // 5 second window for undo
  }

  const handleUndoDelete = () => {
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current)
      deleteTimeoutRef.current = null
    }
    setShowUndoSnackbar(false)
  }

  const handleSaveEdit = async () => {
    setIsSubmitting(true)
    setError(null)

    if (!session?.user?.email) {
      setError('You must be logged in to edit poses')
      setIsSubmitting(false)
      return
    }

    // Check if user can edit (either owner or admin)
    if (!canEdit) {
      setError('You do not have permission to edit this pose')
      setIsSubmitting(false)
      return
    }

    const updatedAsana: UpdatePoseInput = {
      sort_english_name: formData.sort_english_name,
      english_names: formData.english_names,
      description: formData.description,
      category: formData.category,
      difficulty: formData.difficulty,
      sanskrit_names: formData.sanskrit_names,
      dristi: formData.dristi,
      setup_cues: formData.setup_cues,
      deepening_cues: formData.deepening_cues,
      alternative_english_names: formData.alternative_english_names,
      breath_direction_default: formData.breath_direction_default,
    }

    try {
      // Update the pose text data
      await updatePose(pose.id, updatedAsana)

      // Update the image order if images were changed
      if (images.length > 0) {
        const imageReorderPayload = images.map((image) => ({
          id: image.id,
          displayOrder: Number(image.displayOrder),
        }))

        const reorderResponse = await fetch(
          `/api/asana/${pose.id}/images/reorder`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ images: imageReorderPayload }),
          }
        )

        if (!reorderResponse.ok) {
          const errorData = await reorderResponse.json()
          throw new Error(errorData.error || 'Failed to update image order')
        }
      }

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
    } finally {
      setIsSubmitting(false)
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
                altText: img.altText || `${pose?.sort_english_name} pose`,
                fileName: img.fileName || undefined,
                fileSize: img.fileSize || undefined,
                uploadedAt: new Date(img.uploadedAt),
                storageType: 'CLOUD' as const,
                localStorageId: undefined,
                isOffline: false,
                imageType: 'pose',
                displayOrder: 1,
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
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  }}
                >
                  {pose?.sort_english_name}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                }}
              >
                {pose?.category}
              </Typography>
            </Box>

            {/* Dot navigation for multiple images */}
            {poseImages.length > 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: isEditing ? 60 : 16, // Move down when delete button is in top right
                  right: 16,
                  zIndex: 4,
                }}
              >
                <CarouselDotNavigation
                  images={poseImages.map((img) => ({
                    id: img.id,
                    userId: '',
                    poseId: pose?.id?.toString(),
                    poseName: pose?.sort_english_name,
                    url: img.url,
                    altText: img.altText || `${pose?.sort_english_name} pose`,
                    fileName: img.fileName || undefined,
                    fileSize: img.fileSize || undefined,
                    uploadedAt: new Date(img.uploadedAt),
                    storageType: 'CLOUD' as const,
                    localStorageId: undefined,
                    isOffline: false,
                    imageType: 'pose',
                    displayOrder: 1,
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
        ) : null}

        {/* Category badge when no uploaded images are available */}
        {(!poseImages || poseImages.length === 0) && (
          <>
            <Paper
              elevation={1}
              sx={{
                borderRadius: '16px',
                backgroundColor: 'info.contrastText',
                mt: 3,
                mb: '-24px',
                mx: '25%',
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  borderRadius: '16px',
                  height: '50%',
                  display: 'flex',
                  flexDirection: 'row',
                  px: 4,
                  py: 1,
                  overflow: 'hidden',
                }}
                justifyContent={'space-around'}
                alignItems={'center'}
              >
                <Image
                  alt="Asana Standing"
                  height={36}
                  width={36}
                  style={{
                    alignContent: 'center',
                  }}
                  src={getAsanaIconUrl(pose?.category)}
                />
                <Typography
                  variant="h5"
                  component={'p'}
                  sx={{
                    color: 'secondary.contrastText',
                    flexShrink: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {pose?.category}
                </Typography>
              </Box>
            </Paper>
            <Stack alignItems="center">
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: '100%', sm: '400px' },
                }}
              >
                <Typography
                  variant="h1"
                  component={'h2'}
                  sx={{
                    pt: 2,
                    height: '200px',
                    width: '100%',
                    backgroundColor: 'info.contrastText',
                    color: 'primary.main',
                    borderRadius: '12px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 2px 2px rgba(211, 211, 211, 0.5)',
                    px: 2,
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
                    )}
                  </>
                )}
              </Box>
            </Stack>
          </>
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
                  <Typography variant="h6">Weekly Activity</Typography>
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
                details={pose?.english_names?.join(', ')}
                label={pose?.label ?? 'English Variant Names'}
                sx={{
                  mb: '32px',
                }}
              />
              <AsanaDetails
                details={pose?.alternative_english_names?.join(', ')}
                label={pose?.label ?? 'Alternative Names (Custom/Nicknames)'}
                sx={{
                  mb: '32px',
                }}
              />
              <AsanaDetails
                details={pose?.description}
                label="Description"
                sx={{
                  mb: '32px',
                }}
              />
              <AsanaDetails
                details={`${pose?.category}`}
                label="Category"
                sx={{ mb: '32px' }}
              />
              <AsanaDetails
                details={pose?.difficulty}
                label="Difficulty"
                sx={{ mb: '32px' }}
              />
              <AsanaDetails
                details={pose?.dristi}
                label="Dristi"
                sx={{ mb: '32px' }}
              />
              <AsanaDetails
                details={
                  Array.isArray(pose?.sanskrit_names)
                    ? pose.sanskrit_names.join(', ')
                    : (pose?.sanskrit_names as any) || ''
                }
                label="Sanskrit Names"
                sx={{ mb: '32px' }}
              />
              <AsanaDetails
                details={pose?.setup_cues}
                label="Setup Cues"
                sx={{ mb: '32px' }}
              />
              <AsanaDetails
                details={pose?.deepening_cues}
                label="Deepening Cues"
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

              {/* Image Gallery Section in Edit Mode */}
              <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Image Gallery
                </Typography>
                <ImageGallery
                  asanaId={pose.id}
                  initialImages={images}
                  onImagesChange={setImages}
                />
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
                variant="full"
              />
            </Box>
          )}
        </Stack>
      </Box>
      {pose && FEATURES.SHOW_PRACTICE_VIEW_ASANA && (
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

      {/* Undo Delete Snackbar */}
      <Snackbar
        open={showUndoSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="warning"
          variant="filled"
          action={
            <Button color="inherit" size="small" onClick={handleUndoDelete}>
              UNDO
            </Button>
          }
          sx={{
            width: '100%',
            fontWeight: 'bold',
            animation: 'flash 1s infinite',
            '@keyframes flash': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.8 },
              '100%': { opacity: 1 },
            },
          }}
        >
          Deleting {pose?.sort_english_name} in 5 seconds...
        </Alert>
      </Snackbar>
    </Paper>
  )
}
