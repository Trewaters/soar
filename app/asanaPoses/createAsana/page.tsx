'use client'
import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Button,
  Stack,
  Typography,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  IconButton,
} from '@mui/material'
import { createPose } from '@lib/poseService'
import { useSession } from 'next-auth/react'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import NAV_PATHS from '@app/utils/navigation/constants'
import SplashHeader from '@app/clientComponents/splash-header'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import HelpButton from '@app/clientComponents/HelpButton'
import HelpDrawer from '@app/clientComponents/HelpDrawer'
import { HELP_PATHS } from '@app/utils/helpLoader'
import AsanaDetailsEdit from '@app/clientComponents/asanaUi/AsanaDetailsEdit'
import {
  type AsanaFieldKey,
  type AsanaFormData,
  createEmptyAsanaFormData,
  createAsanaFields,
} from '@app/clientComponents/asanaUi/asanaFieldConstants'
import ImageUploadWithFallback from '@app/clientComponents/imageUpload/ImageUploadWithFallback'
import type { PoseImageData } from '@app/clientComponents/imageUpload/ImageUploadWithFallback'
import { deletePoseImage } from '@lib/imageService'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  FreemiumNotification,
  useFreemiumNotification,
} from '@app/clientComponents/freemiumNotification'
import { AsanaActivity, ASANA_CATEGORIES } from 'types/asana'
import { AsanaCreatePayloadValidator } from '@app/utils/validation/schemas/asana'
import { formatValidationError } from '@app/utils/validation/errorFormatter'

// Available categories for autocomplete
const categories: string[] = [...ASANA_CATEGORIES]

type CreateAsanaFormState = AsanaFormData & {
  created_by: string
  poseImages: PoseImageData[]
  activity_completed?: boolean
  asanaActivities: AsanaActivity[]
  activity_practice?: boolean
  breath?: string[]
}

export default function Page() {
  const { data: session } = useSession()
  const router = useNavigationWithLoading()
  const { userAuthState, checkFeatureAccess, handleCtaAction } =
    useFreemiumNotification()
  const imageUploadRef = useRef<{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    saveStagedImages: (poseId?: string, poseName?: string) => Promise<void>
  }>(null)

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

  const [formFullAsanaPoseData, setFormFullAsanaPoseData] =
    useState<CreateAsanaFormState>({
      ...createEmptyAsanaFormData(),
      // created_by should be the user's email (project convention)
      created_by: session?.user?.email ?? 'error-undefined-user',
      poseImages: [],
      activity_completed: false,
      asanaActivities: [],
      activity_practice: false,
    })

  // Create field configurations for AsanaDetailsEdit (memoized to avoid
  // recreating handlers/objects every render which can cause extra updates)
  // Stable setter that avoids updating state when the value hasn't changed
  // and includes a short-lived guard to detect runaway updates.
  const setFieldCallCount = React.useRef(0)

  const setField = React.useCallback((key: AsanaFieldKey, value: any) => {
    setFieldCallCount.current += 1
    if (setFieldCallCount.current > 200) {
      console.error(
        'setField called >200 times rapidly; skipping update for key:',
        key
      )
      console.trace()
      return
    }

    setFormFullAsanaPoseData((prev) => {
      const current = prev[key]
      const isEqual =
        Array.isArray(current) && Array.isArray(value)
          ? JSON.stringify(current) === JSON.stringify(value)
          : current === value
      if (isEqual) return prev
      return { ...prev, [key]: value }
    })
  }, [])

  const formFields = React.useMemo(
    () => createAsanaFields(formFullAsanaPoseData, setField, categories),
    [formFullAsanaPoseData, setField]
  )

  const handleImageUploaded = (image: PoseImageData) => {
    setUploadedImages((prev) => {
      if (prev.length >= 3) {
        console.warn('Image skip: already have 3 images')
        return prev
      }
      return [...prev, image]
    })
  }

  // Generate alternative name suggestions for duplicates
  const generateAlternativeName = (originalName: string): string => {
    const timestamp = new Date().getTime().toString().slice(-4)
    return `${originalName} (${timestamp})`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear any previous error states
    setErrorState({
      showToast: false,
      message: '',
      isDuplicateName: false,
    })

    const validationPayload = {
      sort_english_name: formFullAsanaPoseData.sort_english_name,
      english_names: formFullAsanaPoseData.english_names,
      alternative_english_names:
        formFullAsanaPoseData.alternative_english_names,
      description: formFullAsanaPoseData.description,
      category: formFullAsanaPoseData.category,
      difficulty: formFullAsanaPoseData.difficulty,
      sanskrit_names: formFullAsanaPoseData.sanskrit_names,
      dristi: formFullAsanaPoseData.dristi,
      setup_cues: formFullAsanaPoseData.setup_cues,
      deepening_cues: formFullAsanaPoseData.deepening_cues,
      breath: formFullAsanaPoseData.breath ?? undefined,
    }

    const validationResult =
      AsanaCreatePayloadValidator.validate(validationPayload)
    if (!validationResult.isValid) {
      const validationMessage = Object.entries(validationResult.errors)
        .flatMap(([field, reasons]) =>
          reasons.map((reason) => formatValidationError(field, reason))
        )
        .join(' | ')

      setErrorState({
        showToast: true,
        message:
          validationMessage || 'Please fix the highlighted validation errors.',
        isDuplicateName: false,
      })
      return
    }

    setIsSubmitting(true)

    // Track initial uploaded images for cleanup if needed
    const initialUploadedImages = [...uploadedImages]

    const updatedAsana = {
      ...validationResult.normalizedData,
      // created_by should be the user's email
      created_by: session?.user?.email ?? 'unknown',
    }

    try {
      const data = await createPose(updatedAsana)

      // Save any staged images to the newly created pose
      if (imageUploadRef.current) {
        try {
          await imageUploadRef.current.saveStagedImages(
            data.id.toString(),
            data.sort_english_name
          )
        } catch (error) {
          console.error('Error saving staged images:', error)
          // Don't fail the entire operation if images fail to save
        }
      }

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

      // Navigate immediately to show the new pose (practice page accepts ?id=)
      router.push(`${NAV_PATHS.PRACTICE_ASANAS}?id=${data.id}`)
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
      router.push(NAV_PATHS.ASANA_POSES)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Clear uploaded images and reset form when component mounts (fresh start)
  useEffect(() => {
    // Clear cloud-staged images
    setUploadedImages([])

    setFormFullAsanaPoseData({
      ...createEmptyAsanaFormData(),
      created_by: session?.user?.email ?? 'error-undefined-user',
      poseImages: [],
      activity_completed: false,
      asanaActivities: [],
      activity_practice: false,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          <SubNavHeader mode="back" link={NAV_PATHS.ASANA_POSES} />
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
              Image Upload
            </Typography>
            <ImageUploadWithFallback
              ref={imageUploadRef}
              maxFileSize={5}
              acceptedTypes={['image/jpeg', 'image/png', 'image/svg']}
              variant="dropzone"
              onImageUploaded={handleImageUploaded}
              poseName={formFullAsanaPoseData.sort_english_name}
              shouldClearStaged={true}
              maxImages={3}
              currentCount={uploadedImages.length}
            />
          </Box>

          {/* Uploaded Images Gallery */}
          {uploadedImages.length > 0 && (
            <Box sx={{ pl: 4, width: '100%', pb: 20 }}>
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
                Uploaded Images ({uploadedImages.length}/3)
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: 2,
                  mt: 2,
                  maxHeight: '400px',
                  overflowY: 'auto',
                  pr: 2,
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
                    <IconButton
                      onClick={() => {
                        setUploadedImages((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'error.main',
                          color: 'white',
                          transform: 'scale(1.1)',
                        },
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        padding: '6px',
                        zIndex: 10,
                      }}
                      aria-label="Delete image"
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
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
              py: 2,
              px: 2,
              mt: 4,
              // Keep within content width on mobile to avoid side cut-offs
              width: '100%',
              boxSizing: 'border-box',
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
                  // Forward to search asana view
                  router.push(NAV_PATHS.ASANA_POSES)
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
