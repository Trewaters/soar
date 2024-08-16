'use client'
import React from 'react'
import { FEATURES } from '@app/FEATURES'
import { FlowSeriesData } from '@app/interfaces/flowSeries'
// import { FlowSeriesData } from '@app/interfaces/flowSeries'
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

export default function Page() {
  // const [series, setSeries] = useState<FlowSeriesData[]>([])

  // full series data
  const [singleSeries, setSingleSeries] = useState<FlowSeriesData>(
    {} as FlowSeriesData
  )
  // series properties
  const [seriesName, setSeriesName] = useState('')
  const [seriesPostures, setSeriesPostures] = useState<string[]>([])
  const [breathDuration, setBreathDuration] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('')
  const [image, setImage] = useState('')

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

      setSeriesPostures((prevPostures) => [...prevPostures, value.english_name])
      console.log('seriesPostures', seriesPostures)
    }
  }

  // function handleChange(event: ChangeEvent<HTMLInputElement>) {}

  async function handleSubmit(e: React.FormEvent) {
    // console.log('series', series)
    e.preventDefault()
    // setSingleSeries()
    setSingleSeries({
      ...singleSeries,
      ['seriesPostures']: seriesPostures,
    })

    try {
      const response = await fetch('/api/series/createSeries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(singleSeries),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      setSingleSeries(await response.json())
    } catch (error: Error | any) {
      error.message
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    // console.log('event', event)
    const { name, value } = event.target

    switch (name) {
      case 'id':
      case 'seriesName':
        setSeriesName(value)
        // console.log('seriesName', seriesName)
        setSingleSeries({
          ...singleSeries,
          [name]: value,
        })
        break
      case 'seriesPostures':
        setSeriesPostures((prevPostures) => [...prevPostures, value])

        console.log('seriesPostures', seriesPostures)

        setSingleSeries({
          ...singleSeries,
          ['seriesPostures']: seriesPostures,
        })
        break
      case 'breath_duration':
        setBreathDuration(value)
        setSingleSeries({
          ...singleSeries,
          [name]: value,
        })
        break
      case 'description':
        setDescription(value)
        setSingleSeries({
          ...singleSeries,
          [name]: value,
        })
        break
      case 'duration':
        setDuration(value)
        setSingleSeries({
          ...singleSeries,
          [name]: value,
        })
        break
      case 'image':
        setImage(value)
        setSingleSeries({
          ...singleSeries,
          [name]: value,
        })
        break
      // case 'createdAt':
      // case 'updatedAt':
      default:
        console.warn(`Unhandled input value: ${name}`)
    }

    // setSingleSeries({
    //   ...singleSeries,
    //   [name]: value,
    // })
    // interface PrevState {
    //   [key: string]: FlowSeriesData[keyof FlowSeriesData]
    // }
    // setSingleSeries((prevState: PrevState) => {
    //   let checkArray = prevState[name]
    //   // Check if the field is an array
    //   if (Array.isArray(checkArray)) {
    //     // Assuming you want to update the entire array or a specific index
    //     // For example, updating the entire array
    //     return {
    //       ...prevState,
    //       [name]: [...value.split(',')], // Assuming value is a comma-separated string
    //     }
    //   } else {
    //     // Update the field normally
    //     return {
    //       ...prevState,
    //       [name]: value,
    //     }
    //   }
    // })
    // const setSingleSeries = (name: string, value: string) => {
    //   setSingleSeries((prevState: PrevState) => {
    //     let checkArray = prevState[name]
    //     // Check if the field is an array
    //     if (Array.isArray(checkArray)) {
    //       // Assuming you want to update the entire array
    //       return {
    //         ...prevState,
    //         [name]: [...value.split(',')], // Assuming value is a comma-separated string
    //       }
    //     } else {
    //       // Update the field normally
    //       return {
    //         ...prevState,
    //         [name]: value,
    //       }
    //     }
    //   })
    // }

    console.log('singleSeries', singleSeries)
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
                    value={breathDuration}
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
