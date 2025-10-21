'use client'
import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Image from 'next/image'
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  IconButton,
  Stack,
  Checkbox,
  FormControlLabel,
  Drawer,
  TextField,
  FormControl,
  Autocomplete,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import { FEATURES } from '@app/FEATURES'
import { useRouter } from 'next/navigation'
import AsanaDetails from '@app/clientComponents/asanaUi/asanaDetails'
import PoseShareButton from '@app/clientComponents/poseShareButton'
import ActivityTracker from '@app/clientComponents/activityTracker/ActivityTracker'
import { useSession } from 'next-auth/react'
import {
  checkActivityExists,
  createAsanaActivity,
  deleteAsanaActivity,
} from '@lib/asanaActivityClientService'
import ImageCarousel from '@app/clientComponents/imageUpload/ImageCarousel'
import CarouselDotNavigation from '@app/clientComponents/imageUpload/CarouselDotNavigation'
import { getUserPoseImages, type PoseImageData } from '@lib/imageService'
import { deletePose, updatePose, type UpdatePoseInput } from '@lib/poseService'
import PoseImageUpload from '@app/clientComponents/imageUpload/PoseImageUpload'
import PoseImageManagement from '@app/clientComponents/imageUpload/PoseImageManagement'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import ImageGallery from '@app/clientComponents/imageUpload/ImageGallery'
import { AsanaPose } from 'types/asana'

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
}

// Custom hook to fetch pose images
const usePoseImages = (poseId?: string, poseName?: string) => {
  const [images, setImages] = useState<PoseImageData[]>([])
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchImages = async () => {
      if (!session?.user?.id || (!poseId && !poseName)) {
        return
      }

      try {
        setLoading(true)
        const response = await getUserPoseImages(50, 0, poseId, poseName)
        setImages(response.images)
      } catch (error) {
        console.error('🔍 usePoseImages: Error fetching pose images:', error)
        setImages([])
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [session?.user?.id, poseId, poseName])

  return { images, loading }
}

export default function PoseActivityDetail({ poseCardProp }: PoseCardProps) {
  const pose = poseCardProp
  const router = useRouter()
  const { data: session } = useSession()
  const [easyChipVariant, setEasyChipVariant] = useState<'filled' | 'outlined'>(
    'outlined'
  )
  const [averageChipVariant, setAverageChipVariant] = useState<
    'filled' | 'outlined'
  >('outlined')
  const [difficultChipVariant, setDifficultChipVariant] = useState<
    'filled' | 'outlined'
  >('outlined')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  )
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activityRefreshTrigger, setActivityRefreshTrigger] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [open, setOpen] = useState(false)

  // Inline Edit Mode State
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<any[]>([])

  // Available categories for autocomplete
  const categories = [
    'Arm Leg Support',
    'Backbend',
    'Balance',
    'Bandha',
    'Core',
    'Forward Bend',
    'Hip Opener',
    'Inversion',
    'Lateral Bend',
    'Mudra',
    'Neutral',
    'Prone',
    'Restorative',
    'Seated',
    'Standing',
    'Supine',
    'Twist',
  ]

  const [englishVariationsInput, setEnglishVariationsInput] = useState('')
  const [alternativeNamesInput, setAlternativeNamesInput] = useState('')
  const [sanskritInput, setSanskritInput] = useState('')
  const [difficulty, setDifficulty] = useState('')

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

  const handleInfoClick = () => {
    setOpen(!open)
  }

  // Fetch uploaded images for this pose
  const { images: poseImages } = usePoseImages(
    pose?.id?.toString(),
    pose?.sort_english_name
  )

  // Handle carousel image index changes
  const handleCarouselIndexChange = (index: number) => {
    setCurrentImageIndex(index)
  }

  // Check if activity already exists on component mount
  useEffect(() => {
    const checkExistingActivity = async () => {
      if (session?.user?.id && poseCardProp.id) {
        try {
          const result = await checkActivityExists(
            session.user.id,
            poseCardProp.id.toString()
          )
          setChecked(result.exists)

          // Set difficulty state based on existing activity
          if (result.exists && result.activity?.difficulty) {
            setSelectedDifficulty(result.activity.difficulty)
            // Set the appropriate chip variant
            if (result.activity.difficulty === 'easy') {
              setEasyChipVariant('filled')
              setAverageChipVariant('outlined')
              setDifficultChipVariant('outlined')
            } else if (result.activity.difficulty === 'average') {
              setEasyChipVariant('outlined')
              setAverageChipVariant('filled')
              setDifficultChipVariant('outlined')
            } else if (result.activity.difficulty === 'difficult') {
              setEasyChipVariant('outlined')
              setAverageChipVariant('outlined')
              setDifficultChipVariant('filled')
            }
          } else {
            // Reset difficulty state if no activity or no difficulty stored
            setSelectedDifficulty(null)
            setEasyChipVariant('outlined')
            setAverageChipVariant('outlined')
            setDifficultChipVariant('outlined')
          }
        } catch (error) {
          console.error('Error checking existing activity:', error)
          // Don't show error to user for this check, just default to unchecked
        }
      }
    }

    checkExistingActivity()
  }, [session?.user?.id, poseCardProp.id])

  const handleEasyChipClick = () => {
    const newVariant = easyChipVariant === 'outlined' ? 'filled' : 'outlined'
    setEasyChipVariant(newVariant)

    if (newVariant === 'filled') {
      setSelectedDifficulty('easy')
      // Reset other chips
      setAverageChipVariant('outlined')
      setDifficultChipVariant('outlined')
    } else {
      setSelectedDifficulty(null)
    }
  }

  const handleAverageChipClick = () => {
    const newVariant = averageChipVariant === 'outlined' ? 'filled' : 'outlined'
    setAverageChipVariant(newVariant)

    if (newVariant === 'filled') {
      setSelectedDifficulty('average')
      // Reset other chips
      setEasyChipVariant('outlined')
      setDifficultChipVariant('outlined')
    } else {
      setSelectedDifficulty(null)
    }
  }

  const handleDifficultChipClick = () => {
    const newVariant =
      difficultChipVariant === 'outlined' ? 'filled' : 'outlined'
    setDifficultChipVariant(newVariant)

    if (newVariant === 'filled') {
      setSelectedDifficulty('difficult')
      // Reset other chips
      setEasyChipVariant('outlined')
      setAverageChipVariant('outlined')
    } else {
      setSelectedDifficulty(null)
    }
  }

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked
    await updateActivityState(isChecked)
  }

  const handleButtonToggle = async () => {
    await updateActivityState(!checked)
  }

  const updateActivityState = async (isChecked: boolean) => {
    setChecked(isChecked)

    // Enhanced logging for debugging
    console.log('Activity state change initiated:', {
      isChecked,
      sessionExists: !!session,
      userId: session?.user?.id,
      poseId: poseCardProp.id,
      poseName: poseCardProp.sort_english_name,
      timestamp: new Date().toISOString(),
    })

    if (!session?.user?.id) {
      const errorMessage = 'Please log in to track your activity'
      console.error('Authentication error:', {
        error: errorMessage,
        sessionData: session,
        operation: 'updateActivityState',
        timestamp: new Date().toISOString(),
      })
      setError(errorMessage)
      setChecked(false)
      return
    }

    setLoading(true)
    setError(null)

    const requestData = {
      userId: session.user.id,
      poseId: poseCardProp.id.toString(),
      poseName: poseCardProp.sort_english_name,
      sort_english_name: poseCardProp.sort_english_name,
      duration: 0,
      datePerformed: new Date(),
      completionStatus: 'complete',
      difficulty: selectedDifficulty || undefined,
    }

    try {
      if (isChecked) {
        // Create new activity
        console.log('Creating activity with data:', requestData)

        await createAsanaActivity(requestData)

        console.log('Activity recorded successfully:', {
          requestData,
          timestamp: new Date().toISOString(),
        })

        // Trigger refresh of ActivityTracker
        setActivityRefreshTrigger((prev) => prev + 1)
      } else {
        // Delete existing activity
        const deleteData = {
          userId: session.user.id,
          poseId: poseCardProp.id,
        }

        console.log('Deleting activity with data:', deleteData)

        await deleteAsanaActivity(session.user.id, poseCardProp.id.toString())

        console.log('Activity removed successfully:', {
          deleteData,
          timestamp: new Date().toISOString(),
        })

        // Reset difficulty selection when activity is removed
        setSelectedDifficulty(null)
        setEasyChipVariant('outlined')
        setAverageChipVariant('outlined')
        setDifficultChipVariant('outlined')

        // Trigger refresh of ActivityTracker
        setActivityRefreshTrigger((prev) => prev + 1)
      }
    } catch (e: any) {
      console.error('Error updating activity - Full Context:', {
        error: {
          message: e.message,
          name: e.name,
          stack: e.stack,
        },
        operation: isChecked ? 'create' : 'delete',
        context: {
          userId: session.user.id,
          poseId: poseCardProp.id,
          poseName: poseCardProp.sort_english_name,
          isChecked,
          requestData: isChecked
            ? requestData
            : { userId: session.user.id, poseId: poseCardProp.id },
        },
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      })

      setError(e.message || 'Failed to update activity')
      setChecked(!isChecked) // Revert checkbox state on error
    } finally {
      setLoading(false)
      console.log('Checkbox change completed:', {
        finalState: {
          checked: !loading ? checked : 'loading',
          loading: false,
          error: error || null,
        },
        timestamp: new Date().toISOString(),
      })
    }
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
        return `url('/icons/designImages/asana-back-pattern 1.svg')`
      case 'standing':
        return `url('/icons/designImages/asana-back-pattern 1.svg')`
      case 'seated':
        return `url('/icons/designImages/asana-back-pattern 2.svg')`
      case 'supine':
        return `url('/icons/designImages/asana-back-pattern 2.svg')`
      case 'inversion':
        return `url('/icons/designImages/asana-back-pattern 3.svg')`
      case 'arm_leg_support':
        return `url('/icons/designImages/asana-back-pattern 3.svg')`
      case 'arm_balance_and_inversion':
        return `url('/icons/designImages/asana-back-pattern 3.svg')`
      default:
        return '/stick-tree-pose-400x400.png'
    }
  }

  // Get background image for display - only use patterns when no uploaded images
  const getPoseBackgroundImage = () => {
    // Always use category-based background pattern since uploaded images are displayed separately
    return getAsanaBackgroundUrl(pose?.category)
  }

  function handleClick() {
    router.push(
      `../../views/viewAsanaPractice/${encodeURIComponent(pose?.sort_english_name || '')}/`
    )
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
      setEnglishVariationsInput(
        Array.isArray(pose.english_names) ? pose.english_names.join(', ') : ''
      )
      setAlternativeNamesInput(
        Array.isArray(pose.alternative_english_names)
          ? pose.alternative_english_names.join(', ')
          : ''
      )
      setSanskritInput(
        Array.isArray(pose.sanskrit_names) ? pose.sanskrit_names.join(', ') : ''
      )
      setDifficulty(pose.difficulty || '')
      setError(null)
    }
  }, [isEditing, pose])

  // Edit mode form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCategoryChange = (
    event: React.SyntheticEvent,
    value: string | null
  ) => {
    setFormData({
      ...formData,
      category: value || '',
    })
  }

  const handleDifficultyChange = (value: string) => {
    setDifficulty(value)
    setFormData({
      ...formData,
      difficulty: value,
    })
  }

  const handleVariationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEnglishVariationsInput(value)
    const variations = value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
    setFormData({
      ...formData,
      english_names: variations,
    })
  }

  const handleAlternativeNamesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    setAlternativeNamesInput(value)
    const arr = value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
    setFormData({
      ...formData,
      alternative_english_names: arr,
    })
  }

  const handleSanskritChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSanskritInput(value)
    const arr = value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
    setFormData({
      ...formData,
      sanskrit_names: arr,
    })
  }

  const handleEditToggle = () => {
    if (!session?.user?.email) {
      setError('You must be logged in to edit poses')
      return
    }

    if (pose.created_by !== session.user.email) {
      setError('You can only edit poses you created')
      return
    }

    setIsEditing(!isEditing)
    if (!isEditing) {
      // Entering edit mode - form data will be initialized by useEffect
    } else {
      // Canceling edit - clear error
      setError(null)
    }
  }

  const handleSaveEdit = async () => {
    setIsSubmitting(true)
    setError(null)

    if (!session?.user?.email) {
      setError('You must be logged in to edit poses')
      setIsSubmitting(false)
      return
    }

    if (pose.created_by !== session.user.email) {
      setError('You can only edit poses you created')
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
      const updatedPoseData = await updatePose(pose.id, updatedAsana)
      console.log('Pose updated successfully:', updatedPoseData)

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

        console.log('Image order updated successfully')
      }

      // Exit edit mode and refresh the page data
      setIsEditing(false)
      router.refresh()
    } catch (error: Error | any) {
      console.error('Error updating pose:', error.message)
      setError(error.message || 'Failed to update pose')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
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
                  top: 16,
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
            <Stack>
              <Typography
                variant="h1"
                component={'h2'}
                sx={{
                  pl: 2,
                  pt: 2,
                  height: '200px',
                  width: '400px',
                  backgroundColor: 'info.contrastText',
                  color: 'primary.main',
                  borderRadius: '12px',
                  alignContent: 'center',
                  boxShadow: '0 2px 2px 2px rgba(211, 211, 211, 0.5)',
                }}
              >
                {pose?.sort_english_name}
              </Typography>
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
        <SubNavHeader
          title="Asana"
          link="/navigator/asanaPoses"
          onClick={handleInfoClick}
        />
        <Stack direction={'column'} spacing={0}>
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
              {/* Edit Mode */}
              <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Basic Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={12}>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <TextField
                        label="Sort English Name"
                        name="sort_english_name"
                        value={formData.sort_english_name}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Tree Pose"
                        helperText="This is the primary name for the pose"
                      />
                    </FormControl>
                  </Grid>

                  <Grid size={12}>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <TextField
                        label="English Name Variations"
                        value={englishVariationsInput}
                        onChange={handleVariationsChange}
                        placeholder="e.g., Warrior I, Warrior One, High Lunge"
                        helperText="Separate multiple names with commas"
                        multiline
                        rows={2}
                      />
                    </FormControl>
                  </Grid>

                  <Grid size={12}>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <TextField
                        label="Custom name for asana"
                        name="alternative_english_names"
                        value={alternativeNamesInput}
                        onChange={handleAlternativeNamesChange}
                        placeholder="e.g., My favorite twist, Pretzel pose"
                        helperText="Multiple nicknames separated by commas"
                        multiline
                        rows={2}
                      />
                    </FormControl>
                  </Grid>

                  <Grid size={12}>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <TextField
                        label="Sanskrit Names"
                        value={sanskritInput}
                        onChange={handleSanskritChange}
                        placeholder="e.g., Virabhadrasana I, ..."
                        helperText="Separate multiple names with commas"
                        multiline
                        rows={2}
                      />
                    </FormControl>
                  </Grid>

                  <Grid size={12}>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <TextField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        multiline
                        rows={4}
                        placeholder="Describe the pose alignment, position, and key characteristics..."
                      />
                    </FormControl>
                  </Grid>
                </Grid>
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

              <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Pose Details
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={6}>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <Autocomplete
                        options={categories}
                        value={formData.category}
                        onChange={handleCategoryChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Category"
                            required
                            placeholder="Select or type category"
                          />
                        )}
                        freeSolo
                      />
                    </FormControl>
                  </Grid>

                  <Grid size={6}>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Difficulty Level
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        {['Easy', 'Average', 'Difficult'].map((level) => (
                          <Chip
                            key={level}
                            label={level}
                            clickable
                            variant={
                              difficulty === level ? 'filled' : 'outlined'
                            }
                            color={difficulty === level ? 'primary' : 'default'}
                            onClick={() => handleDifficultyChange(level)}
                          />
                        ))}
                      </Stack>
                    </FormControl>
                  </Grid>

                  <Grid size={12}>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <TextField
                        select
                        label="Breath Direction Default"
                        name="breath_direction_default"
                        value={formData.breath_direction_default || ''}
                        onChange={handleChange}
                        SelectProps={{ native: true }}
                      >
                        <option value=""></option>
                        <option value="Neutral">Neutral</option>
                        <option value="Inhale">Inhale</option>
                        <option value="Exhale">Exhale</option>
                      </TextField>
                    </FormControl>
                  </Grid>

                  <Grid size={12}>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <TextField
                        label="Dristi"
                        name="dristi"
                        value={formData.dristi || ''}
                        onChange={handleChange}
                        placeholder="Gaze point"
                      />
                    </FormControl>
                  </Grid>

                  <Grid size={12}>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <TextField
                        label="Setup Cues"
                        name="setup_cues"
                        value={formData.setup_cues || ''}
                        onChange={handleChange}
                        multiline
                        rows={2}
                      />
                    </FormControl>
                  </Grid>

                  <Grid size={12}>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <TextField
                        label="Deepening Cues"
                        name="deepening_cues"
                        value={formData.deepening_cues || ''}
                        onChange={handleChange}
                        multiline
                        rows={2}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
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

          {/* Activity Tracker Component */}
          {pose && pose.id && (
            <Box
              sx={{
                mt: 3,
                mb: 2,
                width: '100%',
                px: { xs: 0, sm: 2 }, // Remove padding on mobile for full width
                display: 'flex',
                justifyContent: { xs: 'stretch', sm: 'center' }, // Full width on mobile, centered on larger screens
                alignItems: 'center',
                '@media (max-width: 384px)': {
                  // Ensure full width container on screens 384px or smaller
                  px: 0,
                  justifyContent: 'stretch',
                },
              }}
            >
              <ActivityTracker
                pose={pose}
                variant="detailed"
                refreshTrigger={activityRefreshTrigger}
              />
            </Box>
          )}

          {/* Difficulty Chips */}
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{
              p: 2,
              mt: 2,
              mx: 'auto',
              maxWidth: 'fit-content',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
            }}
          >
            {[
              {
                label: 'Easy',
                variant: easyChipVariant,
                onClick: handleEasyChipClick,
                color:
                  easyChipVariant === 'filled'
                    ? ('success' as const)
                    : ('default' as const),
              },
              {
                label: 'Average',
                variant: averageChipVariant,
                onClick: handleAverageChipClick,
                color:
                  averageChipVariant === 'filled'
                    ? ('info' as const)
                    : ('default' as const),
              },
              {
                label: 'Difficult',
                variant: difficultChipVariant,
                onClick: handleDifficultChipClick,
                color:
                  difficultChipVariant === 'filled'
                    ? ('error' as const)
                    : ('default' as const),
              },
            ].map((chip) => (
              <Chip
                key={chip.label}
                label={chip.label}
                variant={chip.variant}
                color={chip.color}
                onClick={chip.onClick}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Stack>

          {/* Activity Tracker Toggle - Button and Checkbox */}
          <Stack sx={{ mt: 2, mb: 2, alignItems: 'center' }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant={checked ? 'contained' : 'outlined'}
                color={checked ? 'success' : 'primary'}
                onClick={handleButtonToggle}
                disabled={loading}
                sx={{
                  minWidth: '200px',
                  textTransform: 'none',
                }}
              >
                {loading
                  ? 'Saving...'
                  : checked
                    ? 'Tracked in Activity'
                    : 'Mark for Activity Tracker'}
              </Button>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={handleCheckboxChange}
                    disabled={loading}
                  />
                }
                label=""
                sx={{ m: 0 }}
              />
            </Stack>
          </Stack>

          {error && (
            <Typography color="error" sx={{ mt: 1, mb: 1 }}>
              {error}
            </Typography>
          )}
          {/* <Typography
            variant="body1"
            sx={{
              padding: 4,
              marginTop: 2,
              borderTopRightRadius: { xs: 0, sm: 75 },
              borderBottomRightRadius: { xs: 0, sm: 75 },
              ml: { xs: 0, md: '23%' },
            }}
          >
            <FormGroup>
              <FormControlLabel control={<Checkbox />} label="" />
              <FormControlLabel control={<Checkbox />} label="Difficult" />
            </FormGroup>
          </Typography> */}
        </Stack>
      </Box>
      {pose && FEATURES.SHOW_PRACTICE_VIEW_ASANA && (
        <ButtonGroup
          variant="outlined"
          aria-label="Basic button group"
          sx={{ mx: 2, display: 'flex', justifyContent: 'space-around' }}
        >
          <Stack sx={{ m: 2, border: '1px solid black', borderRadius: '12px' }}>
            <IconButton disableRipple onClick={handleClick}>
              <Image
                src={yogaMatWoman}
                alt="practice view"
                width={24}
                height={24}
              />
            </IconButton>
          </Stack>
          <Stack sx={{ m: 2, border: '1px solid black', borderRadius: '12px' }}>
            <PoseShareButton
              content={{
                contentType: 'asana',
                data: pose,
              }}
            />
          </Stack>
        </ButtonGroup>
      )}

      {/* Image Management Section */}
      {session && pose && (
        <Box sx={{ mt: 3, px: 2, pb: 3 }}>
          <PoseImageUpload
            acceptedTypes={[
              'image/jpeg',
              'image/png',
              'image/gif',
              'image/svg',
            ]}
            maxFileSize={5} // 5 MB
            poseId={pose.id?.toString()}
            poseName={pose.sort_english_name}
          />
        </Box>
      )}

      {/* Edit/Delete Pose Buttons - Edit visible to creator or 'alpha users'; Delete only to actual creator */}
      {session &&
        session.user &&
        (session.user.email === pose?.created_by ||
          pose?.created_by === 'alpha users') && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 3,
              mb: 2,
              px: 2,
            }}
          >
            <Stack direction="row" spacing={2}>
              {!isEditing ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEditToggle}
                    startIcon={<EditIcon />}
                    sx={{
                      borderRadius: '12px',
                      px: 3,
                      py: 1.5,
                      textTransform: 'none',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    Edit Pose
                  </Button>
                  {session.user.email === pose?.created_by && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      sx={{
                        borderRadius: '12px',
                        px: 3,
                        py: 1.5,
                        textTransform: 'none',
                      }}
                      onClick={async () => {
                        if (!pose?.id) return
                        const confirmed = window.confirm(
                          'Delete this asana? This cannot be undone.'
                        )
                        if (!confirmed) return
                        try {
                          await deletePose(pose.id)
                          // Force refresh and navigate to practice asanas page
                          router.refresh()
                          router.replace('/navigator/asanaPoses/practiceAsanas')
                        } catch (e: any) {
                          alert(e?.message || 'Failed to delete pose')
                        }
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSaveEdit}
                    startIcon={<SaveIcon />}
                    disabled={isSubmitting}
                    sx={{
                      borderRadius: '12px',
                      px: 3,
                      py: 1.5,
                      textTransform: 'none',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancelEdit}
                    startIcon={<CancelIcon />}
                    disabled={isSubmitting}
                    sx={{
                      borderRadius: '12px',
                      px: 3,
                      py: 1.5,
                      textTransform: 'none',
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        )}
      {/* EditPoseDialog removed - inline editing is now used */}
      {/*
      <EditPoseDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        pose={pose}
        onSave={() => {
          // Close dialog and redirect to practice asana page after save
          setEditDialogOpen(false)
          router.push('/navigator/asanaPoses/practiceAsanas')
        }}
      />
      */}

      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            maxWidth: '100vw',
          },
        }}
        disablePortal={false}
        disableScrollLock={true}
      >
        <Typography variant="body1" sx={{ p: 2 }}>
          View detailed information about this asana pose. You can track your
          practice activity, set difficulty levels, and access additional pose
          details and benefits. Use the practice view button to see the pose in
          action.
        </Typography>
      </Drawer>
    </Paper>
  )
}
