'use client'
import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import { Box, Button, FormControl, TextField } from '@mui/material'
import { useAsanaPosture } from '@app/context/AsanaPostureContext'

export default function Page() {
  const { state, dispatch } = useAsanaPosture()
  const {
    sort_english_name,
    english_names,
    description,
    category,
    difficulty,
    breath_direction_default,
  } = state.postures
  const [formData, setFormData] = useState<{
    sort_english_name: string
    english_names: string[]
    description: string
    category: string
    difficulty: string
    breath_direction_default: string
  }>({
    sort_english_name: '',
    english_names: [],
    description: '',
    category: '',
    difficulty: '',
    breath_direction_default: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    dispatch({
      type: 'SET_POSTURES',
      payload: {
        ...state.postures,
        [name]: value,
      },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const updatedAsana = {
      ...state.postures,
      sort_english_name,
      english_names,
      description,
      category,
      difficulty,
      breath_direction_default,
    }
    dispatch({ type: 'SET_POSTURES', payload: updatedAsana })

    try {
      const response = await fetch('/api/poses/createAsana', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAsana),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      // eslint-disable-next-line no-unused-vars
      const data = await response.json()
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Received empty data object')
      }
    } catch (error: Error | any) {
      error.message
    }
  }
  return (
    <Box sx={{ px: 2 }}>
      <Typography variant="h1">Create Asana</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <FormControl sx={{ width: '100%', mb: 3 }}>
              <TextField
                label="Sort English Name"
                name="sort_english_name"
                value={formData.sort_english_name}
                onChange={handleChange}
                required
              />
            </FormControl>
          </Grid>
          <Grid size={12}>
            <FormControl sx={{ width: '100%', mb: 3 }}>
              <TextField
                label="English Names"
                name="english_names"
                value={formData.english_names.join(',')}
                onChange={(e) => {
                  const { value } = e.target
                  setFormData({
                    ...formData,
                    english_names: value.split(',').map((name) => name),
                  })
                }}
                onBlur={(e) => {
                  const { value } = e.target
                  dispatch({
                    type: 'SET_POSTURES',
                    payload: {
                      ...state.postures,
                      english_names: value.split(',').map((name) => name),
                    },
                  })
                }}
                helperText="Separate names with commas"
                required
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
              />
            </FormControl>
          </Grid>
          <Grid size={12}>
            <FormControl sx={{ width: '100%', mb: 3 }}>
              <TextField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </FormControl>
          </Grid>
          <Grid size={12}>
            <FormControl sx={{ width: '100%', mb: 3 }}>
              <TextField
                label="Difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
              />
            </FormControl>
          </Grid>
          <Grid size={12}>
            <FormControl sx={{ width: '100%', mb: 3 }}>
              <TextField
                label="Breath Direction Default"
                name="breath_direction_default"
                value={formData.breath_direction_default}
                onChange={handleChange}
                required
              />
            </FormControl>
          </Grid>
          <Grid size={12}>
            <Button type="submit" variant="contained" color="primary">
              Create Asana
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
    // <Box sx={{ px: 2 }}>
    //   <Grid container>
    //     <Grid size={12}>
    //       <Typography variant="h1">Create Asana</Typography>
    //     </Grid>
    //     <Grid size={12}>
    //       <FormControl sx={{ width: '100%', mb: 3 }}>
    //         sort_english_name (must be unique)
    //       </FormControl>
    //     </Grid>
    //     <Grid size={12}>
    //       <FormControl sx={{ width: '100%', mb: 3 }}>english_names</FormControl>
    //     </Grid>
    //     <Grid size={12}>
    //       <FormControl sx={{ width: '100%', mb: 3 }}>description</FormControl>
    //     </Grid>
    //     <Grid size={12}>
    //       <FormControl sx={{ width: '100%', mb: 3 }}>category</FormControl>
    //     </Grid>
    //     <Grid size={12}>
    //       <FormControl sx={{ width: '100%', mb: 3 }}>difficulty</FormControl>
    //     </Grid>
    //     <Grid size={12}>
    //       <FormControl sx={{ width: '100%', mb: 3 }}>
    //         breath_direction_default
    //       </FormControl>
    //     </Grid>
    //     <Grid size={12}>
    //       <FormControl sx={{ width: '100%', mb: 3 }}>
    //         preferred_side
    //       </FormControl>
    //     </Grid>
    //     <Grid size={12}>
    //       <FormControl sx={{ width: '100%', mb: 3 }}>sideways</FormControl>
    //     </Grid>
    //   </Grid>
    // </Box>
  )
}
