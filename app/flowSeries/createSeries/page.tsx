'use client'
import React from 'react'
import { useFlowSeries } from '@app/context/AsanaSeriesContext'
import { FEATURES } from '@app/FEATURES'
import { FlowSeriesData } from '@app/context/AsanaSeriesContext'
import PostureData from '@app/interfaces/postureData'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function Page() {
  const { data: session } = useSession()
  console.log('session', session)
  const { state, dispatch } = useFlowSeries()
  const {
    seriesName,
    seriesPostures,
    breath_duration,
    description,
    duration,
    image,
  } = state.flowSeries

  // posture data
  const [postures, setPostures] = useState<PostureData[]>([])
  const [singlePosture, setSinglePosture] = useState<PostureData>()
  const [postureName, setPostureName] = useState('')

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
  }, [])

  function handleSelect(event: ChangeEvent<{}>, value: PostureData | null) {
    // Logs the type of event (e.g., 'click')
    // console.log('Event type:', event.type)
    // Logs the element that triggered the event
    // console.log('Event target:', event.target)
    // console.log('Selected value:', value)
    event.preventDefault()
    if (value) {
      // console.log('value', value)
      setSinglePosture(value)
      console.log('singlePosture', singlePosture)

      setPostureName(value.english_name)
      console.log('postureName', postureName)

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
      breath_duration,
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
    <>
      {FEATURES.SHOW_CREATE_SERIES && (
        <>
          <Typography variant="h2" textAlign="center">
            Create a Series
          </Typography>
          <form>
            <Grid container spacing={3}>
              <FormControl>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-basic"
                    label="Series Name"
                    variant="outlined"
                    name="seriesName"
                    value={seriesName}
                    // onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    //   setSeriesName(event.currentTarget.value)
                    // }
                    onChange={handleChange}
                  />
                </Grid>
              </FormControl>

              <Grid item xs={12} display={'flex'} direction={'column'}>
                <FormControl>
                  <TextField
                    id="outlined-basic"
                    label="Series Postures"
                    variant="outlined"
                    name="seriesPostures"
                    value={seriesPostures}
                    // onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    //   setSeriesPostures(event.currentTarget.value)
                    // }
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <Autocomplete
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
                    sx={{ width: '50%', mt: 3 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Flow Series" />
                    )}
                    onChange={handleSelect}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl>
                  <TextField
                    id="outlined-basic"
                    label="Breath Duration"
                    variant="outlined"
                    name="breath_duration"
                    value={breath_duration}
                    // onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    //   setBreathDuration(event.currentTarget.value)
                    // }
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
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

              <Grid item xs={12}>
                <FormControl>
                  <TextField
                    id="outlined-basic"
                    label="Duration"
                    variant="outlined"
                    name="duration"
                    value={duration}
                    // onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    //   setDuration(event.currentTarget.value)
                    // }
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
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

              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={!session}
                  >
                    Submit
                  </Button>
                  <Button variant="outlined" color="secondary">
                    Cancel
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
          {/* {flowSeries.map((flow) => (
        <Accordion
          key={flow.id}
          sx={{
            pb: '1em',
            borderWidth: '3px',
            margin: 3,
            borderColor: 'primary.main',
            borderStyle: 'solid',
          }}
          disableGutters
        >
          <AccordionSummary sx={{ ml: 2, pt: 3 }}>
            <Typography variant="h3">{flow.seriesName}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack rowGap={3} alignItems="center">
              {flow.seriesPostures.map((pose) => (
                <Card
                  key={pose}
                  sx={{
                    width: '80%',
                    boxShadow: 3,
                    textAlign: 'center',
                    borderColor: 'primary.light',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                >
                  <CardContent>
                    <Typography key={pose} variant="body1" textAlign={'left'}>
                      {pose}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))} */}
        </>
      )}
    </>
  )
}
