'use client'
import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import { Box, Button, FormControl, TextField, Paper } from '@mui/material'
import { useSafeAsanaPose as useAsanaPose } from '@app/context/AsanaPoseContext'
import { createPose } from '@lib/poseService'
import { useSession } from 'next-auth/react'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import NAV_PATHS from '@app/utils/navigation/constants'
import ImageManagement from '@app/clientComponents/imageUpload/ImageManagement'
import type { PoseImageData } from '@app/clientComponents/imageUpload/ImageUpload'
import {
  ASANA_FIELD_DEFINITIONS_BY_KEY,
  createEmptyAsanaFormData,
  type AsanaFormData,
} from '@app/clientComponents/asanaUi/asanaFieldConstants'
import ImageIcon from '@mui/icons-material/Image'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

type CreateAsanaWithImagesFormData = AsanaFormData & {
  breath_direction_default: string
  created_by: string
  breath: string[]
}

export default function CreateAsanaWithImages() {
  const { data: session } = useSession()
  const { state, dispatch } = useAsanaPose()
  const [uploadedImages, setUploadedImages] = useState<PoseImageData[]>([])
  const [englishVariationsInput, setEnglishVariationsInput] = useState('')
  const [formData, setFormData] = useState<CreateAsanaWithImagesFormData>({
    ...createEmptyAsanaFormData(),
    breath_direction_default: '',
    breath: [],
    created_by: session?.user?.email ?? 'error-undefined-user',
  })

  const router = useNavigationWithLoading()

  useEffect(() => {
    if (session === null) {
      router.push(NAV_PATHS.ASANA_POSES)
    }
  }, [router, session])

  // Debug effect to monitor uploadedImages state changes
  useEffect(() => {}, [uploadedImages])

  // Handle image upload callback
  const handleImageUploaded = (image: PoseImageData) => {
    setUploadedImages((prev) => {
      const updated = [...prev, image]
      return updated
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    dispatch({
      type: 'SET_POSES',
      payload: {
        ...state.poses,
        [name]: value,
      },
    })
  }

  // uploadedImages state is updated by child ImageManagement component when variant="upload-only"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const updatedAsana = {
      sort_english_name: formData.sort_english_name,
      english_names: formData.english_names,
      alternative_english_names: formData.alternative_english_names,
      description: formData.description,
      category: formData.category,
      difficulty: formData.difficulty,
      // include extended fields if provided
      sanskrit_names: formData.sanskrit_names,
      dristi: formData.dristi,
      setup_cues: formData.setup_cues,
      deepening_cues: formData.deepening_cues,
      breath: formData.breath,
      breath_direction_default: formData.breath_direction_default,
      created_by: session?.user?.email ?? 'unknown',
    }

    try {
      const data = await createPose(updatedAsana)

      // Link uploaded images with the newly created asana
      if (uploadedImages.length > 0) {
        try {
          for (const image of uploadedImages) {
            const response = await fetch(`/api/images/${image.id}/link`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                poseId: data.id,
                poseName: data.sort_english_name,
              }),
            })

            if (!response.ok) {
              console.warn(
                '[CreateAsanaWithImages] Failed to link image:',
                image.id
              )
            }
          }
        } catch (linkError) {
          console.error(
            '[CreateAsanaWithImages] Error linking images:',
            linkError
          )
          // Don't throw - the asana was created successfully, just the linking failed
        }
      }

      // Clear the form
      setFormData({
        ...createEmptyAsanaFormData(),
        breath_direction_default: '',
        breath: [],
        created_by: 'alpha users',
      })
      setEnglishVariationsInput('')
      setUploadedImages([])

      // Redirect to the new asana using the returned data (practice page accepts ?id=)
      router.push(`${NAV_PATHS.PRACTICE_ASANAS}?id=${data.id}`)
    } catch (error: Error | any) {
      console.error('Error creating pose:', error.message)
    }
  }

  return (
    <>
      <Box sx={{ px: 2, pb: 7 }}>
        <Typography variant="h1" gutterBottom>
          Create Asana
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Basic Information Section */}
            <Grid size={12}>
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
                      />
                    </FormControl>
                  </Grid>

                  <Grid size={12}>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <TextField
                        label="English Names"
                        name="english_names"
                        value={englishVariationsInput}
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
                          setEnglishVariationsInput(
                            cleanedVariations.join(', ')
                          )
                          setFormData({
                            ...formData,
                            english_names: cleanedVariations,
                          })
                        }}
                        helperText="Separate names with commas"
                        required
                        placeholder="Tree Pose, Vrikshasana"
                      />
                    </FormControl>
                  </Grid>

                  <Grid size={12}>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <TextField
                        label={ASANA_FIELD_DEFINITIONS_BY_KEY.description.label}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        required
                        placeholder="Describe the pose, its alignment, and key characteristics..."
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Reference Images Section */}
            <Grid size={12}>
              <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Reference Images
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Upload images to help illustrate this pose. These will be
                  associated with your user profile.
                </Typography>

                <ImageManagement
                  title=""
                  variant="upload-only"
                  onImageUploaded={handleImageUploaded}
                />

                {/* Debug: Always show this section to verify state */}
                <Box
                  sx={{ mt: 2, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Debug: Uploaded images count: {uploadedImages.length}
                  </Typography>
                </Box>

                {uploadedImages.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography
                      variant="body2"
                      color="success.main"
                      gutterBottom
                    >
                      <CheckCircleIcon
                        sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }}
                      />
                      {uploadedImages.length} image(s) uploaded for this session
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {uploadedImages.map((img, index) => (
                        <Grid
                          size={{ xs: 6, sm: 4, md: 3 }}
                          key={img.id || index}
                        >
                          <Paper
                            elevation={2}
                            sx={{
                              borderRadius: '8px',
                              overflow: 'hidden',
                              border: '2px solid',
                              borderColor: 'success.light',
                            }}
                          >
                            <Box
                              component="img"
                              src={img.url}
                              alt={img.altText || `Uploaded image ${index + 1}`}
                              sx={{
                                width: '100%',
                                height: 120,
                                objectFit: 'cover',
                                display: 'block',
                              }}
                            />
                            <Box sx={{ p: 1, bgcolor: 'success.lighter' }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                }}
                              >
                                <ImageIcon sx={{ fontSize: 14 }} />
                                {img.fileName || `Image ${index + 1}`}
                              </Typography>
                              {img.altText && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    display: 'block',
                                    mt: 0.5,
                                    fontSize: '0.7rem',
                                  }}
                                >
                                  {img.altText}
                                </Typography>
                              )}
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Pose Details Section */}
            <Grid size={12}>
              <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Pose Details
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={6}>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <TextField
                        select
                        label={ASANA_FIELD_DEFINITIONS_BY_KEY.category.label}
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        SelectProps={{ native: true }}
                      >
                        <option value=""></option>
                        <option value="Standing">Standing</option>
                        <option value="Seated">Seated</option>
                        <option value="Supine">Supine</option>
                        <option value="Prone">Prone</option>
                        <option value="Backbend">Backbend</option>
                        <option value="Forward Bend">Forward Bend</option>
                        <option value="Twist">Twist</option>
                        <option value="Inversion">Inversion</option>
                        <option value="Balance">Balance</option>
                        <option value="Hip Opener">Hip Opener</option>
                        <option value="Core">Core</option>
                        <option value="Arm Support">Arm Support</option>
                      </TextField>
                    </FormControl>
                  </Grid>

                  <Grid size={6}>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <TextField
                        select
                        label={ASANA_FIELD_DEFINITIONS_BY_KEY.difficulty.label}
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                        required
                        SelectProps={{ native: true }}
                      >
                        <option value=""></option>
                        <option value="Easy">Easy</option>
                        <option value="Average">Average</option>
                        <option value="Difficult">Difficult</option>
                      </TextField>
                    </FormControl>
                  </Grid>

                  {/* preferred_side and sideways removed from Create form */}
                </Grid>
              </Paper>
            </Grid>

            {/* Submit Section */}
            <Grid size={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => router.push(NAV_PATHS.ASANA_POSES)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Create Asana
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  )
}
