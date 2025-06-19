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
import { FullAsanaData } from '@context/AsanaPostureContext'
import { FEATURES } from '@app/FEATURES'
import { useRouter } from 'next/navigation'
import AsanaDetails from '@app/clientComponents/asanaUi/asanaDetails'
import PostureShareButton from '@app/clientComponents/exportPoses'
import ActivityTracker from '@app/clientComponents/activityTracker/ActivityTracker'
import { useSession } from 'next-auth/react'

const yogaMatWoman = '/yogaMatWoman.svg'

interface PostureCardProps {
  postureCardProp: FullAsanaData
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
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activityRefreshTrigger, setActivityRefreshTrigger] = useState(0)

  // Check if activity already exists on component mount
  useEffect(() => {
    const checkExistingActivity = async () => {
      if (session?.user?.id && postureCardProp.id) {
        try {
          const response = await fetch(
            `/api/asanaActivity?userId=${session.user.id}&postureId=${postureCardProp.id}`
          )

          if (response.ok) {
            const data = await response.json()
            setChecked(data.exists)
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
    setEasyChipVariant((prev) => (prev === 'outlined' ? 'filled' : 'outlined'))
  }

  const handleAverageChipClick = () => {
    setAverageChipVariant((prev) =>
      prev === 'outlined' ? 'filled' : 'outlined'
    )
  }

  const handleDifficultChipClick = () => {
    setDifficultChipVariant((prev) =>
      prev === 'outlined' ? 'filled' : 'outlined'
    )
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
      postureId: postureCardProp.id,
      postureName: postureCardProp.sort_english_name,
      duration: 0,
      datePerformed: new Date(),
      completionStatus: 'complete',
    }

    try {
      if (isChecked) {
        // Create new activity
        console.log('Creating activity with data:', requestData)

        const response = await fetch('/api/asanaActivity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          const errorMessage = errorData.error || 'Failed to record activity'

          console.error('API Error - Create Activity:', {
            status: response.status,
            statusText: response.statusText,
            errorData,
            requestData,
            timestamp: new Date().toISOString(),
          })

          throw new Error(errorMessage)
        }

        const result = await response.json()
        console.log('Activity recorded successfully:', {
          result,
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

        const response = await fetch('/api/asanaActivity', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(deleteData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          const errorMessage = errorData.error || 'Failed to remove activity'

          console.error('API Error - Delete Activity:', {
            status: response.status,
            statusText: response.statusText,
            errorData,
            deleteData,
            timestamp: new Date().toISOString(),
          })

          throw new Error(errorMessage)
        }

        const result = await response.json()
        console.log('Activity removed successfully:', {
          result,
          deleteData,
          timestamp: new Date().toISOString(),
        })

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

  function handleClick() {
    router.push(`../../views/viewAsanaPractice/${posture?.sort_english_name}/`)
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
          backgroundImage: `${getAsanaBackgroundUrl(posture?.category)}`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          alignContent: 'space-around',
          display: 'flex',
          flexDirection: 'column',
          pb: 4,
        }}
      >
        <Stack direction={'column'} alignSelf={'center'}>
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
                  overflow: 'hidden', // Ensure the box does not overflow
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
                ></Image>
                <Typography
                  variant="h5"
                  component={'p'}
                  sx={{
                    color: 'secondary.contrastText',
                    flexShrink: 1, // Prevent the text from growing beyond the container
                    overflow: 'hidden', // Hide overflow text
                    textOverflow: 'ellipsis', // Add ellipsis for overflow text
                    whiteSpace: 'nowrap', // Prevent text from wrapping
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

              {/* <Typography
                variant="subtitle1"
                component={'p'}
                color={'primary.contrastText'}
              >
                {posture?.sanskrit_names ?? 'Sanskrit Name not-found'}
              </Typography> */}
            </Typography>
          </Stack>
        </Stack>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mt: 3,
        }}
      >
        <Stack direction={'column'}>
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
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <ActivityTracker
                posture={posture}
                variant="detailed"
                refreshTrigger={activityRefreshTrigger}
              />
            </Box>
          )}

          <Stack
            flexDirection={'row'}
            gap={2}
            sx={{
              p: 2,
              ml: { xs: 2, md: '23%' },
              opacity: 0.75, // 25% transparency
              width: 'auto', // Make the width responsive
              borderRadius: '12px',
              backdropFilter: 'blur(48%)', // Add blur effect
              overflow: 'hidden', // Prevent overflow
              justifyContent: 'center',
            }}
          >
            <Stack>
              <Chip
                label="Easy"
                variant={easyChipVariant}
                onClick={handleEasyChipClick}
              />
            </Stack>
            <Stack>
              <Chip
                label="Average"
                variant={averageChipVariant}
                onClick={handleAverageChipClick}
              />
            </Stack>
            <Stack>
              <Chip
                label="Difficult"
                variant={difficultChipVariant}
                onClick={handleDifficultChipClick}
              />
            </Stack>
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
    </Paper>
  )
}
