'use client'
import React from 'react'
import { useFlowSeries } from '@app/context/AsanaSeriesContext'
import { FEATURES } from '@app/FEATURES'
import PostureData from '@app/interfaces/postureData'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormGroup,
  Grid,
  Icon,
  IconButton,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import NavigationIcon from '@mui/icons-material/Navigation'

export default function Page() {
  const { data: session } = useSession()
  // console.log('session', session)
  const { state, dispatch } = useFlowSeries()
  const { seriesName, seriesPostures, breath, description, duration, image } =
    state.flowSeries

  // posture data
  const [postures, setPostures] = useState<PostureData[]>([])
  // const [singlePosture, setSinglePosture] = useState<PostureData>()
  // const [postureName, setPostureName] = useState('')

  useEffect(() => {
    async function fetchData() {
      // const baseUrl =
      //   process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      // const url = new URL('/api/series/', baseUrl)
      // const res = await fetch(url.toString())
      // const data = await res.json()
      // const seriesData = Array.isArray(data) ? data : [data]
      // setSeries(JSON.parse(JSON.stringify(seriesData)))
      try {
        const response = await fetch('/api/poses')
        // console.log('response', response)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        setPostures(await response.json())
      } catch (error: Error | any) {
        error.message
      }
    }

    fetchData()
  }, [session])

  function handleSelect(event: ChangeEvent<{}>, value: PostureData | null) {
    // Logs the type of event (e.g., 'click')
    // console.log('Event type:', event.type)
    // Logs the element that triggered the event
    // console.log('Event target:', event.target)
    // console.log('Selected value:', value)
    event.preventDefault()
    if (value) {
      // console.log('value', value)
      // setSinglePosture(value)
      // console.log('singlePosture', singlePosture)

      // setPostureName(value.english_name)
      // console.log('postureName', postureName)

      dispatch({
        type: 'SET_FLOW_SERIES',
        payload: {
          ...state.flowSeries,
          seriesPostures: [
            ...state.flowSeries.seriesPostures,
            value.english_name,
          ],
        },
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const updatedSeries = {
      ...state.flowSeries,
      seriesName,
      seriesPostures,
      breath,
      description,
      duration,
      image,
    }
    dispatch({ type: 'SET_FLOW_SERIES', payload: updatedSeries })

    try {
      const response = await fetch('/api/series/createSeries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSeries),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      console.log('handleSubmit', data)
    } catch (error: Error | any) {
      error.message
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    dispatch({
      type: 'SET_FLOW_SERIES',
      payload: {
        ...state.flowSeries,
        [name]: value,
      },
    })
  }

  return (
    <Stack
      spacing={2}
      flexDirection={'column'}
      sx={{ marginX: 3, marginY: 3, background: 'white', mb: '1em' }}
    >
      <>
        {FEATURES.SHOW_CREATE_SERIES && (
          <>
            <Stack flexDirection={'column'}>
              <Typography variant="h2" textAlign="center">
                Create a Series
              </Typography>
              <Button
                variant="outlined"
                href="/navigator/flowSeries"
                LinkComponent="a"
                sx={{ my: 3, display: 'block' }}
              >
                Back to flow
              </Button>
            </Stack>

            <Grid container flexDirection={'column'}>
              <FormGroup>
                <FormControl>
                  <Grid item xs={12} sx={{ mb: 2 }}>
                    <TextField
                      sx={{ width: '100%' }}
                      id="outlined-basic"
                      label="Series Name"
                      variant="outlined"
                      name="seriesName"
                      value={seriesName}
                      onChange={handleChange}
                    />
                  </Grid>
                </FormControl>

                <Grid
                  item
                  xs={12}
                  display={'flex'}
                  direction={'column'}
                  sx={{ mb: 2 }}
                >
                  <FormControl>
                    {/* 
                    <TextField
                      id="outlined-basic"
                      label="Series Postures"
                      variant="outlined"
                      name="seriesPostures"
                      value={seriesPostures}
                      onChange={handleChange}
                      disabled
                    />
 */}

                    <Stack
                      spacing={1}
                      direction={'row'}
                      flexWrap={'wrap'}
                      display={'flex'}
                      sx={{
                        mx: 4,
                        mb: 2,
                      }}
                    >
                      {seriesPostures.map((word, index) => (
                        <Box
                          key={`${word}+${index}`}
                          display={'flex'}
                          sx={{
                            alignItems: 'center',
                            // border: '1px solid #ccc',
                            pl: 2,
                          }}
                        >
                          <Typography key={word} variant="h3">
                            {word}
                          </Typography>
                          <IconButton
                            disabled
                            sx={{
                              transform: 'rotate(90deg)',
                            }}
                          >
                            <NavigationIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </Stack>
                  </FormControl>
                </Grid>
                <FormControl>
                  <Autocomplete
                    sx={{ mb: 2 }}
                    disablePortal
                    id="combo-box-series-search"
                    options={postures}
                    getOptionLabel={(option: PostureData) =>
                      option.english_name
                    }
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.english_name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Flow Series" />
                    )}
                    onChange={handleSelect}
                  />
                </FormControl>
                {/* 
              <Grid item xs={12} sx={{ mb: 2 }}>
                <FormControl>
                  <TextField
                    id="outlined-basic"
                    label="Breath"
                    variant="outlined"
                    name="breath"
                    value={breath}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>
 */}
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <FormControl>
                    <TextField
                      id="outlined-basic"
                      label="Description"
                      multiline
                      variant="outlined"
                      name="description"
                      value={description}
                      // onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      //   setDescription(event.currentTarget.value)
                      // }
                      onChange={handleChange}
                    />
                  </FormControl>
                </Grid>
                {/* 
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <FormControl>
                    <TextField
                      id="outlined-basic"
                      label="Duration"
                      variant="outlined"
                      name="duration"
                      value={duration}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Grid>
 */}
                {/* 
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <FormControl>
                    <TextField
                      id="outlined-basic"
                      label="Image"
                      variant="outlined"
                      name="image"
                      value={image}
                      // onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      //   setImage(event.currentTarget.value)
                      // }
                      onChange={handleChange}
                    />
                  </FormControl>
                </Grid>
 */}
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={session === null}
                    >
                      Submit
                    </Button>
                    <Button variant="outlined" color="secondary">
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
              </FormGroup>
            </Grid>
          </>
        )}
      </>
    </Stack>
  )
}
