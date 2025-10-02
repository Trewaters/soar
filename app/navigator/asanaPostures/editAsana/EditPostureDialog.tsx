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
import { FullAsanaData } from '@app/context/AsanaPostureContext'
import {
  updatePosture,
  type UpdatePostureInput,
  deletePosture,
} from '@lib/postureService'
import { useSession } from 'next-auth/react'
import DeleteIcon from '@mui/icons-material/Delete'
import ImageGallery from '@app/clientComponents/imageUpload/ImageGallery'

/* eslint-disable @typescript-eslint/no-unused-vars */
interface EditPostureDialogProps {
  open: boolean
  onClose: () => void
  posture: FullAsanaData
  onSave: () => void
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export default function EditPostureDialog({
  open,
  onClose,
  posture,
  onSave,
}: EditPostureDialogProps) {
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
    breath_direction_default: string
    preferred_side: string
    sideways: string
  }>({
    sort_english_name: '',
    english_names: [],
    description: '',
    category: '',
    difficulty: '',
    breath_direction_default: 'Neutral',
    preferred_side: '',
    sideways: 'No',
  })

  // Initialize form data when posture changes
  useEffect(() => {
    if (posture && open) {
      setFormData({
        sort_english_name: posture.sort_english_name || '',
        english_names: posture.english_names || [],
        description: posture.description || '',
        category: posture.category || '',
        difficulty: posture.difficulty || '',
        breath_direction_default: posture.breath_direction_default || 'Neutral',
        preferred_side: posture.preferred_side || '',
        sideways: posture.sideways ? 'Yes' : 'No',
      })
      setImages(posture.poseImages || [])
      setEnglishVariationsInput(
        Array.isArray(posture.english_names)
          ? posture.english_names.join(', ')
          : ''
      )
      setDifficulty(posture.difficulty || '')
      setSideways(posture.sideways ? 'Yes' : 'No')
      setError(null)
    }
  }, [posture, open])

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
      setError('You must be logged in to edit postures')
      setIsSubmitting(false)
      return
    }

    if (posture.created_by !== session.user.email) {
      setError('You can only edit postures you created')
      setIsSubmitting(false)
      return
    }

    const updatedAsana: UpdatePostureInput = {
      sort_english_name: formData.sort_english_name,
      english_names: formData.english_names,
      description: formData.description,
      category: formData.category,
      difficulty: formData.difficulty,
      breath_direction_default: formData.breath_direction_default,
      preferred_side: formData.preferred_side,
      sideways: formData.sideways,
    }

    try {
      // 1. Update the posture text data
      const updatedPostureData = await updatePosture(posture.id, updatedAsana)
      console.log('Posture updated successfully:', updatedPostureData)

      // 2. Update the image order
      const imageReorderPayload = images.map((image) => ({
        imageId: image.id,
        displayOrder: image.displayOrder,
      }))

      const reorderResponse = await fetch(
        `/api/asana/${posture.id}/images/reorder`,
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
      console.error('Error updating posture:', error.message)
      setError(error.message || 'Failed to update posture')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!session?.user?.email) {
      setError('You must be logged in to delete postures')
      return
    }

    if (posture.created_by !== session.user.email) {
      setError('You can only delete postures you created')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await deletePosture(posture.id)
      console.log('Posture deleted successfully')
      onSave() // This will trigger a refetch in the parent
      onClose()
    } catch (error: Error | any) {
      console.error('Error deleting posture:', error.message)
      setError(error.message || 'Failed to delete posture')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if user can edit this posture
  const canEdit = session?.user?.email === posture?.created_by

  if (!canEdit && open) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Cannot Edit Posture</DialogTitle>
        <DialogContent>
          <Typography>
            You can only edit postures you created. This posture was created by{' '}
            {posture.created_by || 'another user'}.
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
      <DialogTitle>Edit Posture</DialogTitle>
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
                          helperText="This is the primary name for the posture"
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
                          placeholder="Describe the posture alignment, position, and key characteristics..."
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
                    asanaId={posture.id}
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
                          name="breath_direction_default"
                          value={formData.breath_direction_default}
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
                          Is this a sideways posture?
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
          Delete Posture
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
