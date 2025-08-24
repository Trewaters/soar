'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Stack,
  TextField,
  Autocomplete,
  Typography,
  Drawer,
} from '@mui/material'
import { createPosture } from '@lib/postureService'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import SplashHeader from '@app/clientComponents/splash-header'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import SearchIcon from '@mui/icons-material/Search'
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

  const [open, setOpen] = useState(false)
  const [difficulty, setDifficulty] = useState('')
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

  const [englishVariationsInput, setEnglishVariationsInput] = useState('')

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
    created_by: session?.user?.email ?? 'error-undefined-user',
    dristi: '',
  })

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

  const handleImageUploaded = (image: PoseImageData) => {
    console.log('Image uploaded for asana creation:', image)
    setUploadedImages((prev) => [...prev, image])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

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
      created_by: session?.user?.email ?? 'unknown',
    }

    try {
      const data = await createPosture(updatedAsana)
      console.log('Posture created successfully:', data)

      // Clear uploaded images state since posture was created successfully
      setUploadedImages([])
      setEnglishVariationsInput('')

      // Navigate to the newly created asana instead of just the list
      router.push(
        `/navigator/asanaPostures/${encodeURIComponent(data.sort_english_name)}`
      )
    } catch (error: Error | any) {
      console.error('Error creating posture:', error.message)

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
      setIsSubmitting(false)
    }
  }

  const handleInfoClick = () => {
    setOpen(!open)
  }

  // Freemium access control
  useEffect(() => {
    const accessResult = checkFeatureAccess('createAsana')

    if (!accessResult.hasAccess) {
      // Show notification and redirect to asana list
      setNotificationState({ isOpen: true })

      // Delay redirect to allow notification to show
      setTimeout(() => {
        router.push('/navigator/asanaPostures')
      }, 2000)
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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack spacing={2} sx={{ marginX: 3, mb: '1em', width: 'fit-content' }}>
        <SplashHeader
          src={
            '/icons/designImages/beautiful-young-woman-practices-yoga-asana.png'
          }
          alt={'Create an Asana'}
          title="Create an Asana"
        />
        <SubNavHeader
          title="Asana"
          link="/navigator/asanaPostures"
          onClick={handleInfoClick}
        />
        <Stack sx={{ px: 4 }} spacing={3}>
          {/* Name Input */}
          <TextField
            label="Asana Posture Name"
            name="sort_english_name"
            value={formData.sort_english_name}
            onChange={handleChange}
            required
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '12px',
                borderColor: 'primary.main',
                boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                {
                  borderColor: 'primary.light',
                },
            }}
          />

          {/* Category Search with Autocomplete */}
          <Autocomplete
            freeSolo
            id="combo-box-category-search"
            options={categories}
            value={formData.category}
            onChange={handleCategoryChange}
            onInputChange={(event, newInputValue) => {
              setFormData({
                ...formData,
                category: newInputValue,
              })
            }}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '12px',
                borderColor: 'primary.main',
                boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                {
                  borderColor: 'primary.light',
                },
              '& .MuiAutocomplete-endAdornment': {
                display: 'none',
              },
            }}
            renderInput={(params) => (
              <TextField
                sx={{ '& .MuiInputBase-input': { color: 'primary.main' } }}
                {...params}
                placeholder="Choose or Add a Category"
                helperText="Tap to add"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <SearchIcon sx={{ color: 'primary.main', mr: 1 }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />

          {/* English Variations Input */}
          <TextField
            label="Name Variations"
            name="english_names"
            value={englishVariationsInput}
            placeholder='e.g. "Downward Dog, Adho Mukha Svanasana"'
            onChange={(e) => {
              const { value } = e.target
              setEnglishVariationsInput(value)

              // Update the formData with parsed variations, but allow spaces within names
              const variations = value
                .split(',')
                .map((name) => name.trim())
                .filter((name) => name.length > 0)
              setFormData({
                ...formData,
                english_names: variations,
              })
            }}
            onBlur={(e) => {
              // Clean up the input on blur to ensure proper formatting
              const { value } = e.target
              const cleanedVariations = value
                .split(',')
                .map((name) => name.trim())
                .filter((name) => name.length > 0)

              // Update both the input display and form data
              setEnglishVariationsInput(cleanedVariations.join(', '))
              setFormData({
                ...formData,
                english_names: cleanedVariations,
              })
            }}
            helperText="Separate variant names with commas"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '12px',
                borderColor: 'primary.main',
                boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                {
                  borderColor: 'primary.light',
                },
            }}
          />

          {/* Description Text Field */}
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            placeholder="Enter a detailed description..."
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '12px',
                borderColor: 'primary.main',
                boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                {
                  borderColor: 'primary.light',
                },
            }}
          />

          {/* Select a Difficulty Level Button Group */}
          <Box>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
              Select a Difficulty Level
            </Typography>
            <ButtonGroup variant="outlined" sx={{ width: '100%' }}>
              {['Easy', 'Average', 'Difficult'].map((level) => (
                <Button
                  key={level}
                  onClick={() => handleDifficultyChange(level)}
                  variant={difficulty === level ? 'contained' : 'outlined'}
                  sx={{
                    flex: 1,
                    borderRadius: '12px',
                    '&:not(:last-child)': {
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                    '&:not(:first-of-type)': {
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    },
                  }}
                >
                  {level}
                </Button>
              ))}
            </ButtonGroup>
          </Box>

          {/* Breath Input */}
          <TextField
            label="Breath (default)"
            name="breath_direction_default"
            value={formData.breath_direction_default}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '12px',
                borderColor: 'primary.main',
                boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                {
                  borderColor: 'primary.light',
                },
            }}
          />

          {/* Dristi Component */}
          <TextField
            label="Dristi (Gaze Point)"
            name="dristi"
            value={formData.dristi || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                dristi: e.target.value,
              })
            }
            placeholder='e.g. "Tip of the nose", "Between the eyebrows", "Hand", "Toes", "Upward to the sky"'
            helperText="Type your own or use suggestions like: Tip of the nose, Between the eyebrows, Hand, Toes, Upward to the sky"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '12px',
                borderColor: 'primary.main',
                boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                {
                  borderColor: 'primary.light',
                },
            }}
          />

          {/* Image Upload Component */}
          <ImageUploadWithFallback
            maxFileSize={5}
            acceptedTypes={['image/jpeg', 'image/png', 'image/svg']}
            variant="dropzone"
            onImageUploaded={handleImageUploaded}
          />

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{
              borderRadius: '12px',
              mt: 3,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            {isSubmitting ? 'Creating Asana...' : 'Create Asana'}
          </Button>
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
    </Box>
  )
}
