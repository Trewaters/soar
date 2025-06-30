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
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { FullAsanaData } from '@context/AsanaPostureContext'
import { FEATURES } from '@app/FEATURES'
import { useRouter } from 'next/navigation'
import AsanaDetails from '@app/clientComponents/asanaUi/asanaDetails'
import PostureShareButton from '@app/clientComponents/exportPoses'
import ActivityTracker from '@app/clientComponents/activityTracker/ActivityTracker'
import { useSession } from 'next-auth/react'
import {
  checkActivityExists,
  createAsanaActivity,
  deleteAsanaActivity,
} from '@lib/asanaActivityClientService'
import { getUserPoseImages, type PoseImageData } from '@lib/imageService'
import PostureImageUpload from '@app/clientComponents/imageUpload/PostureImageUpload'
import EditPostureDialog from '@app/navigator/asanaPostures/editAsana/EditPostureDialog'

const yogaMatWoman = '/yogaMatWoman.svg'

interface PostureCardProps {
  postureCardProp: FullAsanaData
}

// Custom hook to fetch posture images
const usePostureImages = (postureId?: string, postureName?: string) => {
  const [images, setImages] = useState<PoseImageData[]>([])
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchImages = async () => {
      if (!session?.user?.id || (!postureId && !postureName)) return

      try {
        setLoading(true)
        const response = await getUserPoseImages(50, 0, postureId, postureName)
        setImages(response.images)
      } catch (error) {
        console.error('Error fetching posture images:', error)
        setImages([])
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [session?.user?.id, postureId, postureName])

  return { images, loading }
}

export default function PostureActivityDetail({
  postureCardProp,
}: PostureCardProps) {
  const posture = postureCardProp
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
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // Fetch uploaded images for this posture
  const { images: postureImages, loading: imagesLoading } = usePostureImages(
    posture?.id?.toString(),
    posture?.sort_english_name
  )

  // Cycle through images every 10 seconds if multiple images exist
  useEffect(() => {
    if (!postureImages || postureImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % postureImages.length)
    }, 10000) // Change image every 10 seconds

    return () => clearInterval(interval)
  }, [postureImages])

  // Handle manual image cycling
  const handleImageCycle = () => {
    if (postureImages && postureImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % postureImages.length)
    }
  }

  // Check if activity already exists on component mount
  useEffect(() => {
    const checkExistingActivity = async () => {
      if (session?.user?.id && postureCardProp.id) {
        try {
          const result = await checkActivityExists(
            session.user.id,
            postureCardProp.id.toString()
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
  }, [session?.user?.id, postureCardProp.id])

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
      postureId: postureCardProp.id,
      postureName: postureCardProp.sort_english_name,
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
      postureId: postureCardProp.id.toString(),
      postureName: postureCardProp.sort_english_name,
      sort_english_name: postureCardProp.sort_english_name,
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
          postureId: postureCardProp.id,
        }

        console.log('Deleting activity with data:', deleteData)

        await deleteAsanaActivity(
          session.user.id,
          postureCardProp.id.toString()
        )

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
          postureId: postureCardProp.id,
          postureName: postureCardProp.sort_english_name,
          isChecked,
          requestData: isChecked
            ? requestData
            : { userId: session.user.id, postureId: postureCardProp.id },
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

  const getAsanaIconUrl = (category: string) => {
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
  const getAsanaBackgroundUrl = (category: string) => {
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
  const getPostureBackgroundImage = () => {
    // Always use category-based background pattern since uploaded images are displayed separately
    return getAsanaBackgroundUrl(posture?.category)
  }

  function handleClick() {
    router.push(
      `../../views/viewAsanaPractice/${encodeURIComponent(posture?.sort_english_name || '')}/`
    )
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
          backgroundImage: getPostureBackgroundImage(),
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          alignContent: 'space-around',
          display: 'flex',
          flexDirection: 'column',
          pb: 4,
          position: 'relative',
          transition: 'background-image 0.5s ease-in-out',
        }}
      >
        {/* Display uploaded image prominently when available */}
        {postureImages &&
        postureImages.length > 0 &&
        postureImages[currentImageIndex] &&
        postureImages[currentImageIndex].url &&
        !postureImages[currentImageIndex].url.startsWith('local://') ? (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: '500px',
              height: '300px',
              alignSelf: 'center',
              mt: 3,
              mb: 2,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              zIndex: 1,
            }}
          >
            <Image
              key={postureImages[currentImageIndex].url}
              src={postureImages[currentImageIndex].url}
              alt={`${posture?.sort_english_name} user image`}
              fill
              style={{
                objectFit: 'cover',
                transition: 'all 0.5s ease-in-out',
              }}
            />

            {/* Posture name overlay on image */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
                p: 2,
                zIndex: 2,
              }}
            >
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                }}
              >
                {posture?.sort_english_name}
              </Typography>

              {/* Category badge on image */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -40,
                  right: 16,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '12px',
                  px: 2,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Image
                  alt={`${posture?.category} icon`}
                  height={24}
                  width={24}
                  src={getAsanaIconUrl(posture?.category)}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 'medium',
                  }}
                >
                  {posture?.category}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          // Fallback to text layout when no images available
          <Stack
            direction={'column'}
            alignSelf={'center'}
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <Stack>
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
                    src={getAsanaIconUrl(posture?.category)}
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
                    {posture?.category}
                  </Typography>
                </Box>
              </Paper>
            </Stack>
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
                {posture?.sort_english_name}
              </Typography>
            </Stack>
          </Stack>
        )}

        {/* Image cycling indicator - positioned over image or at top when using uploaded images */}
        {postureImages &&
          postureImages.length > 0 &&
          postureImages[currentImageIndex] &&
          postureImages[currentImageIndex].url &&
          !postureImages[currentImageIndex].url.startsWith('local://') && (
            <Box
              onClick={handleImageCycle}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                px: 1.5,
                py: 0.5,
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: postureImages.length > 1 ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                '&:hover':
                  postureImages.length > 1
                    ? {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        transform: 'scale(1.05)',
                      }
                    : {},
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'primary.main',
                  fontWeight: 'medium',
                  fontSize: '0.75rem',
                }}
              >
                Your Image
                {postureImages.length > 1 && (
                  <span style={{ marginLeft: '4px' }}>
                    {currentImageIndex + 1}/{postureImages.length}
                  </span>
                )}
              </Typography>
            </Box>
          )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mt: 3,
          px: { xs: 0, sm: 2 }, // Remove padding on mobile for full width
        }}
      >
        <Stack direction={'column'} spacing={0}>
          <AsanaDetails
            details={posture?.sort_english_name}
            label="English Variant Names"
            sx={{
              mb: '32px',
            }}
          />
          <AsanaDetails
            details={posture?.description}
            label="Description"
            sx={{
              mb: '32px',
            }}
          />
          {/* <AsanaDetails
            details={posture?.sanskrit_names[0] ?? 'Sanskrit Name not-found'}
            label="Sanskrit Name"
            sx={{ mb: '32px' }}
          /> 
          <AsanaDetails
            details={posture?.posture_intent ?? 'Feel into the asana.'}
            label="Meaning of Posture"
            sx={{ mb: '32px' }}
          />
          <AsanaDetails
            details={posture?.benefits}
            label="Benefits"
            sx={{ mb: '32px' }}
          />
          <AsanaDetails
            details={posture?.dristi ?? 'optimal gaze'}
            label="Dristi"
            sx={{ mb: '32px' }}
          />
          <AsanaDetails
            details={posture?.dristi ?? 'optimal gaze'}
            label="Activities"
            sx={{ mb: '32px' }}
          />
          */}
          <AsanaDetails
            details={`${posture?.category}`}
            label="Category"
            sx={{ mb: '32px' }}
          />
          <AsanaDetails
            details={posture?.difficulty}
            label="Difficulty"
            sx={{ mb: '32px' }}
          />
          <AsanaDetails
            details={posture?.breath_direction_default ?? 'Inhale/Exhale'}
            label="Breath (default)"
            sx={{ mb: '32px' }}
          />
          <AsanaDetails
            details={posture?.preferred_side ?? 'No preferred side'}
            label="Preferred Side"
            sx={{ mb: '32px' }}
          />
          <AsanaDetails
            details={posture?.sideways ? 'True' : 'False'}
            label="Sideways"
            // sx={{ mb: '32px' }}
          />

          {/* Activity Tracker Component */}
          {posture && posture.id && (
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
                posture={posture}
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
      {posture && FEATURES.SHOW_PRACTICE_VIEW_ASANA && (
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
            <PostureShareButton postureData={posture} />
          </Stack>
        </ButtonGroup>
      )}

      {/* Image Management Section */}
      {session && posture && (
        <Box sx={{ mt: 3, px: 2, pb: 3 }}>
          <PostureImageUpload
            acceptedTypes={[
              'image/jpeg',
              'image/png',
              'image/gif',
              'image/svg',
            ]}
            maxFileSize={5} // 5 MB
            postureId={posture.id?.toString()}
            postureName={posture.sort_english_name}
          />
        </Box>
      )}

      {/* Edit Posture Button - Shown only to authenticated users who created the posture */}
      {/* Debug information */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: '#f0f0f0', borderRadius: 1 }}>
          <Typography variant="caption" component="div">
            Debug - Edit Button Visibility:
          </Typography>
          <Typography variant="caption" component="div">
            Session exists: {session ? 'Yes' : 'No'}
          </Typography>
          <Typography variant="caption" component="div">
            User email: {session?.user?.email || 'None'}
          </Typography>
          <Typography variant="caption" component="div">
            Posture created_by: {posture?.created_by || 'None'}
          </Typography>
          <Typography variant="caption" component="div">
            Can edit:{' '}
            {session?.user?.email === posture?.created_by ? 'Yes' : 'No'}
          </Typography>
        </Box>
      )}

      {session &&
        session.user &&
        (session.user.email === posture?.created_by ||
          posture?.created_by === 'alpha users') && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 1,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => setEditDialogOpen(true)}
              startIcon={<EditIcon />}
              sx={{
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                textTransform: 'none',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              Edit Posture
            </Button>
          </Box>
        )}

      {/* Edit Posture Dialog */}
      <EditPostureDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        posture={posture}
        onSave={() => {
          // Refresh the page to show updated data
          window.location.reload()
        }}
      />
    </Paper>
  )
}
