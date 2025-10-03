'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Stack,
  Typography,
  Drawer,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from '@mui/material'
import { createPosture } from '@lib/postureService'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import SplashHeader from '@app/clientComponents/splash-header'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import AsanaDetailsEdit from '@app/clientComponents/asanaUi/AsanaDetailsEdit'
import type { AsanaEditFieldProps } from '@app/clientComponents/asanaUi/AsanaDetailsEdit'
import ImageUploadWithFallback from '@app/clientComponents/imageUpload/ImageUploadWithFallback'
import type { PoseImageData } from '@app/clientComponents/imageUpload/ImageUploadWithFallback'
import { deletePoseImage } from '@lib/imageService'
import {
  FreemiumNotification,
  useFreemiumNotification,
} from '@app/clientComponents/freemiumNotification'

export default function Page() {
  const { data: session } = useSession()
  const router = useRouter()
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

  const [formData, setFormData] = useState<{
    sort_english_name: string
    english_names: string[]
    description: string
    category: string
    difficulty: string
    breath_direction_default: string
    preferred_side: string
    sideways: string
    created_by: string
    dristi?: string
  }>({
    sort_english_name: '',
    english_names: [],
    description: '',
    category: '',
    difficulty: '',
    breath_direction_default: 'Neutral',
    preferred_side: '',
    sideways: 'No',
    // created_by should be the user's email (project convention)
    created_by: session?.user?.email ?? 'error-undefined-user',
    dristi: '',
  })

  // Create field configurations for AsanaDetailsEdit
  const formFields: AsanaEditFieldProps[] = [
    {
      type: 'text',
      label: 'Asana Posture Name',
      value: formData.sort_english_name,
      onChange: (value: string) =>
        setFormData({ ...formData, sort_english_name: value }),
      required: true,
      placeholder: 'Enter the name of the asana',
    },
    {
      type: 'autocomplete',
      label: 'Category',
      value: formData.category,
      options: categories,
      onChange: (value: string) =>
        setFormData({ ...formData, category: value }),
      placeholder: 'Select a Category',
      freeSolo: true,
    },
    {
      type: 'variations',
      label: 'Name Variations',
      value: formData.english_names,
      onChange: (value: string[]) =>
        setFormData({ ...formData, english_names: value }),
      placeholder: 'e.g. "Downward Dog, Adho Mukha Svanasana"',
      helperText: 'Separate name variants with commas',
    },
    {
      type: 'multiline',
      label: 'Description',
      value: formData.description,
      onChange: (value: string) =>
        setFormData({ ...formData, description: value }),
      placeholder: 'Enter a detailed description...',
      rows: 4,
    },
    {
      type: 'buttonGroup',
      label: 'Difficulty Level',
      value: formData.difficulty,
      options: ['Easy', 'Average', 'Difficult'],
      onChange: (value: string) =>
        setFormData({ ...formData, difficulty: value }),
      helperText: 'Select the difficulty level for this asana',
    },
    {
      type: 'text',
      label: 'Breath Action',
      value: formData.breath_direction_default,
      onChange: (value: string) =>
        setFormData({ ...formData, breath_direction_default: value }),
      placeholder: 'e.g. Inhale, Exhale, Neutral',
    },
    {
      type: 'text',
      label: 'Dristi (Gaze Point)',
      value: formData.dristi || '',
      onChange: (value: string) => setFormData({ ...formData, dristi: value }),
      placeholder:
        'e.g. "Tip of the nose", "Between the eyebrows", "Hand", "Toes", "Upward to the sky"',
      helperText:
        'Type your own or use suggestions like: Tip of the nose, Between the eyebrows, Hand, Toes, Upward to the sky',
    },
  ]

  const handleImageUploaded = (image: PoseImageData) => {
    console.log('Image uploaded for asana creation:', image)
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
      sort_english_name: formData.sort_english_name,
      english_names: formData.english_names,
      description: formData.description,
      category: formData.category,
      difficulty: formData.difficulty,
      breath_direction_default: formData.breath_direction_default,
      preferred_side: formData.preferred_side,
      sideways: formData.sideways,
      // created_by should be the user's email
      created_by: session?.user?.email ?? 'unknown',
    }

    try {
      const data = await createPosture(updatedAsana)
      console.log('Posture created successfully:', data)

      // Link uploaded images to the newly created posture
      if (initialUploadedImages.length > 0) {
        console.log('Linking uploaded images to new posture:', data.id)

        try {
          const linkPromises = initialUploadedImages.map(async (image) => {
            const response = await fetch(`/api/images/link`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                imageId: image.id,
                postureId: data.id.toString(),
                postureName: data.sort_english_name,
              }),
            })

            if (!response.ok) {
              console.error(
                `Failed to link image ${image.id} to posture ${data.id}`
              )
            } else {
              console.log(`✅ Linked image ${image.id} to posture ${data.id}`)
            }
          })

          await Promise.allSettled(linkPromises)
          console.log('Image linking process completed')
        } catch (linkError) {
          console.error('Error linking images to posture:', linkError)
          // Don't fail the entire creation process for image linking issues
        }
      }

      // Clear uploaded images state since posture was created successfully
      setUploadedImages([])

      // Show success toast
      setSuccessState({
        showToast: true,
        message: `"${data.sort_english_name}" has been created successfully!`,
        isNavigating: true,
      })

      // Navigate immediately to show the new posture
      router.push(`/navigator/asanaPostures/${data.id}`)
    } catch (error: Error | any) {
      console.error('Error creating posture:', error.message)

      // Check if this is a duplicate name error
      const isDuplicateName =
        error.message?.includes('Unique constraint failed') &&
        error.message?.includes('AsanaPosture_sort_english_name_key')

      if (isDuplicateName) {
        const suggestedName = generateAlternativeName(
          formData.sort_english_name
        )
        setErrorState({
          showToast: true,
          message: `An asana with the name "${formData.sort_english_name}" already exists. Try "${suggestedName}" instead, or choose a different name.`,
          isDuplicateName: true,
        })
      } else {
        setErrorState({
          showToast: true,
          message: `Failed to create asana: ${error.message || 'Unknown error occurred'}`,
          isDuplicateName: false,
        })
      }

      // If posture creation failed and we have uploaded images, clean them up
      if (initialUploadedImages.length > 0) {
        console.log(
          'Cleaning up uploaded images due to posture creation failure...'
        )

        // Use Promise.allSettled to attempt deletion of all images even if some fail
        const deletePromises = initialUploadedImages.map(async (image) => {
          try {
            await deletePoseImage(image.id)
            console.log(`✅ Deleted orphaned image: ${image.id}`)
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
      router.push('/navigator/asanaPostures')
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
      <Stack spacing={2} sx={{ marginX: 3, mb: '1em', width: 'fit-content' }}>
        <SubNavHeader
          title="Asana"
          link="/navigator/asanaPostures"
          onClick={handleInfoClick}
        />
        <Stack sx={{ px: 4 }} spacing={3}>
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
              postureName={formData.sort_english_name}
            />
          </Box>

          {/* Action Buttons: Create and Cancel */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              onClick={handleSubmit}
              variant="contained"
              size="large"
              disabled={isSubmitting || successState.isNavigating}
              sx={{
                borderRadius: '12px',
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
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
                setFormData({
                  sort_english_name: '',
                  english_names: [],
                  description: '',
                  category: '',
                  difficulty: '',
                  breath_direction_default: 'Neutral',
                  preferred_side: '',
                  sideways: 'No',
                  created_by: session?.user?.email ?? 'error-undefined-user',
                  dristi: '',
                })
                setUploadedImages([])

                // Redirect to Practice Asana (search) page
                router.push('/navigator/asanaPostures')
              }}
              variant="outlined"
              size="large"
              sx={{
                borderRadius: '12px',
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
        <Typography variant="body1" sx={{ p: 2 }}>
          Fill out the form to create a new asana posture. All fields are
          required except for preferred side.
        </Typography>
      </Drawer>

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
