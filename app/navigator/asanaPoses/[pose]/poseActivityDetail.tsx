'use client'
import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Image from 'next/image'
import {
  Box,
  Button,
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
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import AsanaDetails from '@app/clientComponents/asanaUi/asanaDetails'
import PoseShareButton from '@app/clientComponents/poseShareButton'
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
// PoseImageUpload removed from this page; image upload is managed via PoseImageManagement
import PoseImageManagement from '@app/clientComponents/imageUpload/PoseImageManagement'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import HelpButton from '@app/clientComponents/HelpButton'
import HelpDrawer from '@app/clientComponents/HelpDrawer'
import ImageGallery from '@app/clientComponents/imageUpload/ImageGallery'
import { AsanaPose } from 'types/asana'
import { HELP_PATHS } from '@app/utils/helpLoader'

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
  onSaveSuccess?: () => void
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
  onSaveSuccess,
}: PoseCardProps) {
  const pose = poseCardProp
  const router = useNavigationWithLoading()
  const { data: session } = useSession()
  const { canEdit } = useCanEditContent(pose?.created_by)
  const [activityRefreshTrigger, setActivityRefreshTrigger] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [open, setOpen] = useState(false)

  // Inline Edit Mode State
  const [isEditing, setIsEditing] = useState(initialEditMode)
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
      const updatedPoseData = await updatePose(pose.id, updatedAsana)

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
            <Stack alignItems="center">
              <Typography
                variant="h1"
                component={'h2'}
                sx={{
                  pt: 2,
                  height: '200px',
                  width: { xs: '100%', sm: '400px' },
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
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            width: '100%',
            maxWidth: '600px',
            alignSelf: 'center',
          }}
        >
          <SubNavHeader mode="back" link="/navigator/asanaPoses" />
          <HelpButton onClick={handleInfoClick} />
        </Stack>
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
              <WeeklyActivityViewer
                entityId={pose.id.toString()}
                entityName={pose.english_names[0] || pose.sort_english_name}
                entityType="asana"
                variant="detailed"
                refreshTrigger={activityRefreshTrigger}
              />
            </Box>
          )}

          {/* Unified Activity Tracker Component */}
          {pose && pose.id && (
            <Box
              sx={{
                mt: 2,
                mx: 'auto',
                width: '100%',
                maxWidth: '600px',
              }}
            >
              <ActivityTracker
                entityId={pose.id.toString()}
                entityName={pose.sort_english_name}
                entityType="asana"
                variant="inline"
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

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <PoseShareButton
                content={{
                  contentType: 'asana',
                  data: pose,
                }}
              />
            </Box>
          </Stack>
        </Box>
      )}

      {/* Edit/Delete Pose Buttons - Only visible to creator or admin */}
      {/* Sticky Bottom Action Bar - Consistent with Create Asana page */}
      {session && session.user && canEdit && (
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            py: 2,
            px: 2,
            mt: 3,
            boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 10,
          }}
        >
          {/* Make edit/delete buttons stack vertically on xs and row on sm+ */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            {!isEditing ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditToggle}
                  startIcon={<EditIcon />}
                  sx={{
                    borderRadius: '12px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    minWidth: { xs: '100%', sm: '200px' },
                  }}
                >
                  Edit Pose
                </Button>
                {canEdit && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    sx={{
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      minWidth: { xs: '100%', sm: '160px' },
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
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    minWidth: { xs: '100%', sm: '200px' },
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
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    minWidth: { xs: '100%', sm: '160px' },
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

      <HelpDrawer
        content={HELP_PATHS.flows.practiceFlow}
        open={open}
        onClose={() => setOpen(false)}
      />
    </Paper>
  )
}
