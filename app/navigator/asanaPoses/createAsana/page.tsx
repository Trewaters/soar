'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Stack,
  Typography,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from '@mui/material'
import { createPose } from '@lib/poseService'
import { useSession } from 'next-auth/react'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import SplashHeader from '@app/clientComponents/splash-header'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import HelpButton from '@app/clientComponents/HelpButton'
import HelpDrawer from '@app/clientComponents/HelpDrawer'
import { HELP_PATHS } from '@app/utils/helpLoader'
import AsanaDetailsEdit from '@app/clientComponents/asanaUi/AsanaDetailsEdit'
import type { AsanaEditFieldProps } from '@app/clientComponents/asanaUi/AsanaDetailsEdit'
import ImageUploadWithFallback from '@app/clientComponents/imageUpload/ImageUploadWithFallback'
import type { PoseImageData } from '@app/clientComponents/imageUpload/ImageUploadWithFallback'
import { deletePoseImage } from '@lib/imageService'
import {
  FreemiumNotification,
  useFreemiumNotification,
} from '@app/clientComponents/freemiumNotification'
import { AsanaActivity } from 'types/asana'

export default function Page() {
  const { data: session } = useSession()
  const router = useNavigationWithLoading()
  const { userAuthState, checkFeatureAccess, handleCtaAction } =
    useFreemiumNotification()

  // State for notification management
  const [notificationState, setNotificationState] = useState({
    isOpen: false,
  })

  // State for success feedback
  const [successState, setSuccessState] = useState({
    showToast: false,
    message: '',
    isNavigating: false,
  })

  // State for error feedback
  const [errorState, setErrorState] = useState({
    showToast: false,
    message: '',
    isDuplicateName: false,
  })

  const [open, setOpen] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<PoseImageData[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const [formFullAsanaPoseData, setFormFullAsanaPoseData] = useState<{
    sort_english_name: string
    english_names: string[]
    alternative_english_names: string[] // Custom names for asana
    description: string
    category: string
    difficulty: string
    created_by: string
    dristi?: string
    sanskrit_names: string[] // use first element for primary sanskrit name
    poseImages: PoseImageData[] // Relation to PoseImage
    activity_completed?: boolean
    asanaActivities: AsanaActivity[] // Relation to AsanaActivity
    activity_practice?: boolean
    setup_cues?: string
    deepening_cues?: string
  }>({
    sort_english_name: '',
    english_names: [],
    alternative_english_names: [],
    description: '',
    category: '',
    difficulty: '',
    // created_by should be the user's email (project convention)
    created_by: session?.user?.email ?? 'error-undefined-user',
    dristi: '',
    sanskrit_names: [], // use first element for primary sanskrit name
    poseImages: [],
    activity_completed: false,
    asanaActivities: [],
    activity_practice: false,
    setup_cues: '',
    deepening_cues: '',
  })

  // Create field configurations for AsanaDetailsEdit
  const formFields: AsanaEditFieldProps[] = [
    {
      type: 'text',
      label: 'Asana Pose Name',
      value: formFullAsanaPoseData.sort_english_name,
      onChange: (value: string) =>
        setFormFullAsanaPoseData({
          ...formFullAsanaPoseData,
          sort_english_name: value,
        }),
      required: true,
      placeholder: 'Enter the name of the asana',
    },
    {
      type: 'autocomplete',
      label: 'Category',
      value: formFullAsanaPoseData.category,
      options: categories,
      onChange: (value: string) =>
        setFormFullAsanaPoseData({ ...formFullAsanaPoseData, category: value }),
      placeholder: 'Select a Category',
      freeSolo: true,
    },
    {
      type: 'variations',
      label: 'Name Variations',
      value: formFullAsanaPoseData.english_names,
      onChange: (value: string[]) =>
        setFormFullAsanaPoseData({
          ...formFullAsanaPoseData,
          english_names: value,
        }),
      placeholder: 'e.g. "Downward Dog, Adho Mukha Svanasana"',
      helperText: 'Separate name variants with commas',
    },
    {
      type: 'multiline',
      label: 'Description',
      value: formFullAsanaPoseData.description,
      onChange: (value: string) =>
        setFormFullAsanaPoseData({
          ...formFullAsanaPoseData,
          description: value,
        }),
      placeholder: 'Enter a detailed description...',
      rows: 4,
    },
    {
      type: 'buttonGroup',
      label: 'Difficulty Level',
      value: formFullAsanaPoseData.difficulty,
      options: ['Easy', 'Average', 'Difficult'],
      onChange: (value: string) =>
        setFormFullAsanaPoseData({
          ...formFullAsanaPoseData,
          difficulty: value,
        }),
      helperText: 'Select the difficulty level for this asana',
    },
    {
      type: 'text',
      label: 'Sanskrit Name(s)',
      value: formFullAsanaPoseData.sanskrit_names[0] || '',
      onChange: (value: string) =>
        setFormFullAsanaPoseData({
          ...formFullAsanaPoseData,
          sanskrit_names: [value],
        }),
      placeholder: 'e.g. Tadasana, Vrikshasana',
    },
    {
      type: 'text',
      label: 'Dristi (Gaze Point)',
      value: formFullAsanaPoseData.dristi || '',
      onChange: (value: string) =>
        setFormFullAsanaPoseData({ ...formFullAsanaPoseData, dristi: value }),
      placeholder:
        'e.g. "Tip of the nose", "Between the eyebrows", "Hand", "Toes", "Upward to the sky"',
      helperText:
        'Type your own or use suggestions like: Tip of the nose, Between the eyebrows, Hand, Toes, Upward to the sky',
    },
    {
      type: 'multiline',
      label: 'Setup Cues',
      value: formFullAsanaPoseData.setup_cues || '',
      onChange: (value: string) =>
        setFormFullAsanaPoseData({
          ...formFullAsanaPoseData,
          setup_cues: value,
        }),
      placeholder: 'Enter a detailed description...',
      rows: 4,
    },
    {
      type: 'multiline',
      label: 'Deepening Cues',
      value: formFullAsanaPoseData.deepening_cues || '',
      onChange: (value: string) =>
        setFormFullAsanaPoseData({
          ...formFullAsanaPoseData,
          deepening_cues: value,
        }),
      placeholder: 'Enter a detailed description...',
      rows: 4,
    },
    {
      type: 'variations',
      label: 'Alternative Names (Custom/Nicknames)',
      value: formFullAsanaPoseData.alternative_english_names,
      onChange: (value: string[]) =>
        setFormFullAsanaPoseData({
          ...formFullAsanaPoseData,
          alternative_english_names: value,
        }),
      placeholder: 'e.g. "My favorite twist, Pretzel pose"',
      helperText: 'Add your own custom names or nicknames for this pose',
    },
  ]

  const handleImageUploaded = (image: PoseImageData) => {
    setUploadedImages((prev) => [...prev, image])
  }

  // Generate alternative name suggestions for duplicates
  const generateAlternativeName = (originalName: string): string => {
    const timestamp = new Date().getTime().toString().slice(-4)
    return `${originalName} (${timestamp})`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Clear any previous error states
    setErrorState({
      showToast: false,
      message: '',
      isDuplicateName: false,
    })

    // Track initial uploaded images for cleanup if needed
    const initialUploadedImages = [...uploadedImages]

    const updatedAsana = {
      sort_english_name: formFullAsanaPoseData.sort_english_name,
      english_names: formFullAsanaPoseData.english_names,
      alternative_english_names:
        formFullAsanaPoseData.alternative_english_names,
      description: formFullAsanaPoseData.description,
      category: formFullAsanaPoseData.category,
      difficulty: formFullAsanaPoseData.difficulty,
      // Include optional, more detailed fields
      sanskrit_names: formFullAsanaPoseData.sanskrit_names,
      dristi: formFullAsanaPoseData.dristi,
      setup_cues: formFullAsanaPoseData.setup_cues,
      deepening_cues: formFullAsanaPoseData.deepening_cues,
      breath: (formFullAsanaPoseData as any).breath ?? undefined,
      // created_by should be the user's email
      created_by: session?.user?.email ?? 'unknown',
    }

    try {
      const data = await createPose(updatedAsana)

      // Link uploaded images to the newly created pose
      if (initialUploadedImages.length > 0) {
        try {
          const linkPromises = initialUploadedImages.map(async (image) => {
            const response = await fetch(`/api/images/link`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                imageId: image.id,
                poseId: data.id.toString(),
                poseName: data.sort_english_name,
              }),
            })

            if (!response.ok) {
              console.error(
                `Failed to link image ${image.id} to pose ${data.id}`
              )
            }
          })

          await Promise.allSettled(linkPromises)
        } catch (linkError) {
          console.error('Error linking images to pose:', linkError)
          // Don't fail the entire creation process for image linking issues
        }
      }

      // Clear uploaded images state since pose was created successfully
      setUploadedImages([])

      // Show success toast
      setSuccessState({
        showToast: true,
        message: `"${data.sort_english_name}" has been created successfully!`,
        isNavigating: true,
      })

      // Navigate immediately to show the new pose
      router.push(`/navigator/asanaPoses/${data.id}`)
    } catch (error: Error | any) {
      console.error('Error creating pose:', error.message)

      // Check if this is a duplicate name error
      const isDuplicateName =
        error.message?.includes('Unique constraint failed') &&
        error.message?.includes('AsanaPose_sort_english_name_key')

      if (isDuplicateName) {
        const suggestedName = generateAlternativeName(
          formFullAsanaPoseData.sort_english_name
        )
        setErrorState({
          showToast: true,
          message: `An asana with the name "${formFullAsanaPoseData.sort_english_name}" already exists. Try "${suggestedName}" instead, or choose a different name.`,
          isDuplicateName: true,
        })
      } else {
        setErrorState({
          showToast: true,
          message: `Failed to create asana: ${error.message || 'Unknown error occurred'}`,
          isDuplicateName: false,
        })
      }

      // If pose creation failed and we have uploaded images, clean them up
      if (initialUploadedImages.length > 0) {
        // Use Promise.allSettled to attempt deletion of all images even if some fail
        const deletePromises = initialUploadedImages.map(async (image) => {
          try {
            await deletePoseImage(image.id)
            return { success: true, imageId: image.id }
          } catch (deleteError) {
            console.error(
              `❌ Failed to delete orphaned image ${image.id}:`,
              deleteError
            )
            return { success: false, imageId: image.id, error: deleteError }
          }
        })

        const results = await Promise.allSettled(deletePromises)
        const successful = results.filter(
          (result) => result.status === 'fulfilled' && result.value.success
        ).length
        const failed = results.length - successful

        console.log(
          `🧹 Cleanup complete: ${successful} images deleted, ${failed} failed`
        )

        // Clear the state regardless of individual deletion results
        setUploadedImages([])
      }
    } finally {
      // Only reset submitting if we're not navigating
      if (!successState.isNavigating) {
        setIsSubmitting(false)
      }
    }
  }

  const handleInfoClick = () => {
    setOpen(!open)
  }

  // Freemium access control
  useEffect(() => {
    const accessResult = checkFeatureAccess('createAsana')

    if (!accessResult.hasAccess) {
      // Show notification and redirect immediately
      setNotificationState({ isOpen: true })
      router.push('/navigator/asanaPoses')
    }
  }, [checkFeatureAccess, router])

  // Close notification handler
  const handleCloseNotification = () => {
    setNotificationState({ isOpen: false })
  }

  // Handle CTA click in notification
  const handleNotificationCtaClick = () => {
    handleCtaAction('createAsana', window.location.pathname)
  }

  // Handle success toast close
  const handleSuccessToastClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setSuccessState((prev) => ({ ...prev, showToast: false }))
  }

  // Handle error toast close
  const handleErrorToastClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setErrorState((prev) => ({ ...prev, showToast: false }))
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <SplashHeader
        src={
          '/icons/designImages/beautiful-young-woman-practices-yoga-asana.png'
        }
        alt={'Create an Asana'}
        title="Create an Asana"
      />
      <Stack
        spacing={2}
        sx={{ mx: { xs: 0, sm: 3 }, mb: '1em', width: '100%', maxWidth: 1200 }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            width: '87%',
            maxWidth: '384px',
            alignSelf: 'center',
          }}
        >
          <SubNavHeader mode="back" link="/navigator/asanaPoses" />
          <HelpButton onClick={handleInfoClick} />
        </Stack>
        <Stack sx={{ px: { xs: 2, sm: 4 } }} spacing={3} alignItems="center">
          {/* Asana Form Fields using AsanaDetailsEdit */}
          <AsanaDetailsEdit fields={formFields} />

          {/* Image Upload Component */}
          <Box sx={{ pl: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                component="img"
                src="/icons/asanas/label_name_leaf.png"
                alt=""
                sx={{ width: 16, height: 20 }}
              />
              Image Upload
            </Typography>
            <ImageUploadWithFallback
              maxFileSize={5}
              acceptedTypes={['image/jpeg', 'image/png', 'image/svg']}
              variant="dropzone"
              onImageUploaded={handleImageUploaded}
              poseName={formFullAsanaPoseData.sort_english_name}
            />
          </Box>

          {/* Uploaded Images Gallery */}
          {uploadedImages.length > 0 && (
            <Box sx={{ pl: 4 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  component="img"
                  src="/icons/asanas/label_name_leaf.png"
                  alt=""
                  sx={{ width: 16, height: 20 }}
                />
                Uploaded Images ({uploadedImages.length})
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: 2,
                  mt: 2,
                }}
              >
                {uploadedImages.map((image, index) => (
                  <Box
                    key={image.id || index}
                    sx={{
                      position: 'relative',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '2px solid',
                      borderColor: 'primary.light',
                      aspectRatio: '1',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box
                      component="img"
                      src={image.url}
                      alt={image.altText || `Uploaded image ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        p: 0.5,
                        fontSize: '0.75rem',
                        textAlign: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {image.fileName || `Image ${index + 1}`}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Action Buttons: Create and Cancel - Sticky Bottom Bar */}
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
              mt: 4,
              // Keep within content width on mobile to avoid side cut-offs
              width: '100%',
              boxSizing: 'border-box',
              boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)',
              zIndex: 10,
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}
            >
              <Button
                onClick={handleSubmit}
                variant="contained"
                size="large"
                disabled={isSubmitting || successState.isNavigating}
                sx={{
                  borderRadius: '12px',
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  width: { xs: '100%', sm: 'auto' },
                  minWidth: { sm: '200px' },
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                }}
              >
                {successState.isNavigating
                  ? 'Redirecting to your new asana...'
                  : isSubmitting
                    ? 'Creating Asana...'
                    : 'Create Asana'}
              </Button>

              <Button
                onClick={() => {
                  // Clear form inputs and uploaded images
                  setFormFullAsanaPoseData({
                    sort_english_name: '',
                    english_names: [],
                    alternative_english_names: [],
                    description: '',
                    category: '',
                    difficulty: '',
                    created_by: session?.user?.email ?? 'error-undefined-user',
                    dristi: '',
                    sanskrit_names: [],
                    poseImages: [],
                    activity_completed: false,
                    asanaActivities: [],
                    activity_practice: false,
                    setup_cues: '',
                    deepening_cues: '',
                  })
                  setUploadedImages([])

                  // Redirect to Practice Asana (search) page
                  router.push('/navigator/asanaPoses')
                }}
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: '12px',
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  width: { xs: '100%', sm: 'auto' },
                  minWidth: { sm: '160px' },
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Stack>

      <HelpDrawer
        content={HELP_PATHS.asanas.create}
        open={open}
        onClose={() => setOpen(false)}
      />

      {/* Freemium Notification */}
      <FreemiumNotification
        featureType="createAsana"
        userAuthState={userAuthState}
        isOpen={notificationState.isOpen}
        onClose={handleCloseNotification}
        onCtaClick={handleNotificationCtaClick}
      />

      {/* Success Toast */}
      <Snackbar
        open={successState.showToast}
        autoHideDuration={6000}
        onClose={handleSuccessToastClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSuccessToastClose}
          severity="success"
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: '12px',
            fontSize: '1rem',
          }}
        >
          {successState.message}
        </Alert>
      </Snackbar>

      {/* Error Toast */}
      <Snackbar
        open={errorState.showToast}
        autoHideDuration={8000}
        onClose={handleErrorToastClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleErrorToastClose}
          severity="error"
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: '12px',
            fontSize: '1rem',
          }}
        >
          {errorState.message}
        </Alert>
      </Snackbar>

      {/* Loading Overlay */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
        open={successState.isNavigating}
      >
        <Stack
          spacing={3}
          alignItems="center"
          sx={{
            textAlign: 'center',
          }}
        >
          <CircularProgress color="primary" size={60} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Taking you to your new asana...
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Just a moment while we prepare everything
          </Typography>
        </Stack>
      </Backdrop>
    </Box>
  )
}
