'use client'
import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import {
  Box,
  Button,
  FormControl,
  Stack,
  TextField,
  Paper,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material'
import { updatePose, type UpdatePoseInput, deletePose } from '@lib/poseService'
import { useSession } from 'next-auth/react'
import DeleteIcon from '@mui/icons-material/Delete'
import ImageGallery from '@app/clientComponents/imageUpload/ImageGallery'
import { AsanaPose } from 'types/asana'

/* eslint-disable @typescript-eslint/no-unused-vars */
interface EditPoseDialogProps {
  open: boolean
  onClose: () => void
  pose: AsanaPose
  onSave: () => void
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export default function EditPoseDialog({
  open,
  onClose,
  pose,
  onSave,
}: EditPoseDialogProps) {
  const { data: session } = useSession()
  const [difficulty, setDifficulty] = useState('')
  const [sideways, setSideways] = useState('No')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const [formData, setFormData] = useState<{
    sort_english_name: string
    english_names: string[]
    description: string
    category: string
    difficulty: string
    breath: string[]
    preferred_side: string
    sideways: string
  }>({
    sort_english_name: '',
    english_names: [],
    description: '',
    category: '',
    difficulty: '',
    breath: [],
    preferred_side: '',
    sideways: 'No',
  })

  // Initialize form data when pose changes
  useEffect(() => {
    if (pose && open) {
      setFormData({
        sort_english_name: pose.sort_english_name || '',
        english_names: pose.english_names || [],
        description: pose.description || '',
        category: pose.category || '',
        difficulty: pose.difficulty || '',
        breath: pose.breath || [],
        preferred_side: pose.alignment_cues || '',
        sideways: pose.alignment_cues ? 'Yes' : 'No',
      })
      setImages(pose.poseImages || [])
      setEnglishVariationsInput(
        Array.isArray(pose.english_names) ? pose.english_names.join(', ') : ''
      )
      setDifficulty(pose.difficulty || '')
      setSideways(pose.alignment_cues ? 'Right' : 'Left')
      setError(null)
    }
  }, [pose, open])

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

  const handleSidewaysChange = (value: string) => {
    setSideways(value)
    setFormData({
      ...formData,
      sideways: value,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
      breath: formData.breath,
      preferred_side: formData.preferred_side,
      sideways: formData.sideways,
    }

    try {
      // 1. Update the pose text data
      const updatedPoseData = await updatePose(pose.id, updatedAsana)
      console.log('Pose updated successfully:', updatedPoseData)

      // 2. Update the image order
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

      onSave()
      onClose()
    } catch (error: Error | any) {
      console.error('Error updating pose:', error.message)
      setError(error.message || 'Failed to update pose')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!session?.user?.email) {
      setError('You must be logged in to delete poses')
      return
    }

    if (pose.created_by !== session.user.email) {
      setError('You can only delete poses you created')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await deletePose(pose.id)
      console.log('Pose deleted successfully')
      onSave() // This will trigger a refetch in the parent
      onClose()
    } catch (error: Error | any) {
      console.error('Error deleting pose:', error.message)
      setError(error.message || 'Failed to delete pose')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if user can edit this pose
  const canEdit = session?.user?.email === pose?.created_by

  if (!canEdit && open) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Cannot Edit Pose</DialogTitle>
        <DialogContent>
          <Typography>
            You can only edit poses you created. This pose was created by{' '}
            {pose.created_by || 'another user'}.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Edit Pose</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}
        <Box sx={{ pt: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
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
              </Grid>

              {/* Image Gallery Section */}
              <Grid size={12}>
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
                              color={
                                difficulty === level ? 'primary' : 'default'
                              }
                              onClick={() => handleDifficultyChange(level)}
                            />
                          ))}
                        </Stack>
                      </FormControl>
                    </Grid>

                    <Grid size={6}>
                      <FormControl sx={{ width: '100%', mb: 3 }}>
                        <TextField
                          label="Breath Direction (Default)"
                          name="breath"
                          value={formData.breath}
                          onChange={handleChange}
                          placeholder="e.g., Inhale, Exhale, Neutral"
                        />
                      </FormControl>
                    </Grid>

                    <Grid size={6}>
                      <FormControl sx={{ width: '100%', mb: 3 }}>
                        <TextField
                          label="Preferred Side"
                          name="preferred_side"
                          value={formData.preferred_side}
                          onChange={handleChange}
                          placeholder="e.g., Right, Left, None"
                        />
                      </FormControl>
                    </Grid>

                    <Grid size={12}>
                      <FormControl sx={{ width: '100%', mb: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Is this a sideways pose?
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          {['Yes', 'No'].map((option) => (
                            <Chip
                              key={option}
                              label={option}
                              clickable
                              variant={
                                sideways === option ? 'filled' : 'outlined'
                              }
                              color={
                                sideways === option ? 'primary' : 'default'
                              }
                              onClick={() => handleSidewaysChange(option)}
                            />
                          ))}
                        </Stack>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </form>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Button
          onClick={handleDelete}
          color="error"
          startIcon={<DeleteIcon />}
          disabled={isSubmitting}
        >
          Delete Pose
        </Button>
        <Box>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
