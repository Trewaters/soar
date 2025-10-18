'use client'
import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import { Box, Button, FormControl, TextField, Paper } from '@mui/material'
import { useAsanaPose } from '@app/context/AsanaPoseContext'
import { createPose } from '@lib/poseService'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ImageManagement from '@app/clientComponents/imageUpload/ImageManagement'
import type { PoseImageData } from '@app/clientComponents/imageUpload/ImageUpload'
import ImageIcon from '@mui/icons-material/Image'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function CreateAsanaWithImages() {
  const { data: session } = useSession()
  const { state, dispatch } = useAsanaPose()
  const [uploadedImages, setUploadedImages] = useState<PoseImageData[]>([])
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
    // optional extended fields
    sanskrit_names?: string[]
    dristi?: string
    setup_cues?: string
    deepening_cues?: string
    breath?: string[]
  }>({
    sort_english_name: '',
    english_names: [],
    description: '',
    category: '',
    difficulty: '',
    breath_direction_default: '',
    preferred_side: '',
    sideways: '',
    sanskrit_names: [],
    dristi: '',
    setup_cues: '',
    deepening_cues: '',
    breath: [],
    // created_by should be the user's email (project convention)
    created_by: session?.user?.email ?? 'error-undefined-user',
  })

  const router = useRouter()

  useEffect(() => {
    if (session === null) {
      router.push('/navigator/asanaPoses')
    }
  }, [router, session])

  // Debug effect to monitor uploadedImages state changes
  useEffect(() => {
    console.log('📸 uploadedImages state changed:', uploadedImages)
  }, [uploadedImages])

  // Handle image upload callback
  const handleImageUploaded = (image: PoseImageData) => {
    console.log('📸 Image uploaded callback received:', image)
    setUploadedImages((prev) => {
      const updated = [...prev, image]
      console.log('📸 Updated images array:', updated)
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
      preferred_side: formData.preferred_side,
      sideways: formData.sideways,
      created_by: session?.user?.email ?? 'unknown',
    }

    try {
      const data = await createPose(updatedAsana)

      // Clear the form
      setFormData({
        sort_english_name: '',
        english_names: [],
        description: '',
        category: '',
        difficulty: '',
        breath_direction_default: '',
        preferred_side: '',
        sideways: '',
        created_by: 'alpha users',
      })
      setEnglishVariationsInput('')
      setUploadedImages([])

      // Redirect to the new asana using the returned data
      router.push(`/navigator/asanaPoses/${data.id}`)
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
                        label="Description"
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
                        label="Category"
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
                        label="Difficulty"
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

                  <Grid size={6}>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <TextField
                        select
                        label="Breath Direction Default"
                        name="breath_direction_default"
                        value={formData.breath_direction_default}
                        onChange={handleChange}
                        required
                        SelectProps={{ native: true }}
                      >
                        <option value=""></option>
                        <option value="Neutral">Neutral</option>
                        <option value="Inhale">Inhale</option>
                        <option value="Exhale">Exhale</option>
                      </TextField>
                    </FormControl>
                  </Grid>

                  <Grid size={6}>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <TextField
                        label="Preferred Side"
                        name="preferred_side"
                        placeholder='e.g. "Right" or "Left"'
                        value={formData.preferred_side}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>

                  <Grid size={12}>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <input
                          type="checkbox"
                          name="sideways"
                          checked={formData.sideways === 'true'}
                          onChange={(e) => {
                            const { checked } = e.target
                            setFormData({
                              ...formData,
                              sideways: checked ? 'true' : 'false',
                            })
                          }}
                        />
                        Sideways pose (practiced on both sides)
                      </label>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Submit Section */}
            <Grid size={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => router.push('/navigator/asanaPoses')}
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
