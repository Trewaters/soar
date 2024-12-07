"use client"
import React, { useState, useEffect } from "react"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid2"
import { Box, Button, FormControl, Stack, TextField } from "@mui/material"
import { useAsanaPosture } from "@app/context/AsanaPostureContext"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import NavBottom from "@serverComponents/navBottom"

export default function Page() {
  const { data: session } = useSession()
  const { state, dispatch } = useAsanaPosture()
  const {
    sort_english_name,
    english_names,
    description,
    category,
    difficulty,
    breath_direction_default,
    preferred_side,
    sideways,
  } = state.postures
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
  }>({
    sort_english_name: "",
    english_names: [],
    description: "",
    category: "",
    difficulty: "",
    breath_direction_default: "",
    preferred_side: "",
    sideways: "",
    created_by: session?.user?.email ?? "error-undefined-user",
    // created_by: "alpha users",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    dispatch({
      type: "SET_POSTURES",
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
      preferred_side,
      sideways,
      created_by: session?.user?.email ?? "unknown",
    }
    dispatch({ type: "SET_POSTURES", payload: updatedAsana })

    try {
      const response = await fetch("/api/poses/createAsana", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cache: "no-store",
        },
        body: JSON.stringify(updatedAsana),
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      // eslint-disable-next-line no-unused-vars
      const data = await response.json()
      if (!data || Object.keys(data).length === 0) {
        throw new Error("Received empty data object")
      }
    } catch (error: Error | any) {
      error.message
    } finally {
      // clear the form
      setFormData({
        sort_english_name: "",
        english_names: [],
        description: "",
        category: "",
        difficulty: "",
        breath_direction_default: "",
        preferred_side: "",
        sideways: "",
        created_by: "alpha users",
      })
    }
  }
  const router = useRouter()

  useEffect(() => {
    if (session === null) {
      router.push("/navigator/asanaPostures")
    }
  }, [router, session])
  return (
    <>
      <Box sx={{ px: 2, pb: 7 }}>
        <Typography variant="h1">Create Asana</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <FormControl sx={{ width: "100%", mb: 3 }}>
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
              <FormControl sx={{ width: "100%", mb: 3 }}>
                <TextField
                  label="English Names"
                  name="english_names"
                  value={formData.english_names.join(",")}
                  onChange={(e) => {
                    const { value } = e.target
                    setFormData({
                      ...formData,
                      english_names: value.split(",").map((name) => name),
                    })
                  }}
                  onBlur={(e) => {
                    const { value } = e.target
                    dispatch({
                      type: "SET_POSTURES",
                      payload: {
                        ...state.postures,
                        english_names: value.split(",").map((name) => name),
                      },
                    })
                  }}
                  helperText="Separate names with commas"
                  required
                />
              </FormControl>
            </Grid>
            <Grid size={12}>
              <FormControl sx={{ width: "100%", mb: 3 }}>
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
              <FormControl sx={{ width: "100%", mb: 3 }}>
                <TextField
                  select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value=""></option>
                  <option value="Arm Leg Support">Arm Leg Support</option>
                  <option value="Backbend">Backbend</option>
                  <option value="Balance">Balance</option>
                  <option value="Bandha">Bandha</option>
                  <option value="Core">Core</option>
                  <option value="Forward Bend">Forward Bend</option>
                  <option value="Hip Opener">Hip Opener</option>
                  <option value="Inversion">Inversion</option>
                  <option value="Lateral Bend">Lateral Bend</option>
                  <option value="Mudra">Mudra</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Prone">Prone</option>
                  <option value="Restorative">Restorative</option>
                  <option value="Seated">Seated</option>
                  <option value="Standing">Standing</option>
                  <option value="Supine">Supine</option>
                  <option value="Twist">Twist</option>
                </TextField>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <FormControl sx={{ width: "100%", mb: 3 }}>
                <TextField
                  select
                  label="Difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  required
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value=""></option>
                  <option value="Easy">Easy</option>
                  <option value="Average">Average</option>
                  <option value="Difficult">Difficult</option>
                </TextField>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <FormControl sx={{ width: "100%", mb: 3 }}>
                <TextField
                  select
                  label="Breath Direction Default"
                  name="breath_direction_default"
                  value={formData.breath_direction_default}
                  onChange={handleChange}
                  required
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value=""></option>
                  <option value="Neutral">Neutral</option>
                  <option value="Inhale">Inhale</option>
                  <option value="Exhale">Exhale</option>
                </TextField>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <FormControl sx={{ width: "100%", mb: 3 }}>
                <TextField
                  label="Preferred Side"
                  name="preferred_side"
                  placeholder='e.g. "Right"'
                  value={formData.preferred_side}
                  onChange={handleChange}
                  required
                />
              </FormControl>
            </Grid>
            <Grid size={12}>
              <FormControl sx={{ width: "100%", mb: 3 }}>
                <label>
                  <input
                    type="checkbox"
                    name="sideways"
                    checked={formData.sideways === "true"}
                    onChange={(e) => {
                      const { checked } = e.target
                      setFormData({
                        ...formData,
                        sideways: checked ? "true" : "false",
                      })
                      dispatch({
                        type: "SET_POSTURES",
                        payload: {
                          ...state.postures,
                          sideways: checked ? true : false,
                        },
                      })
                    }}
                  />
                  Sideways?
                </label>
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
      <Stack sx={{ position: "fixed", bottom: 0 }}>
        <NavBottom subRoute="/navigator/asanaPostures" />
      </Stack>
    </>
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
    //   </Grid>
    // </Box>
  )
}
