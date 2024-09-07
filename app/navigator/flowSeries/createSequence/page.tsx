'use client'
import { FlowSeriesData } from '@app/context/AsanaSeriesContext'
import { SequenceData } from '@app/context/SequenceContext'
import { FEATURES } from '@app/FEATURES'
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

// async function fetchSequence() {
//   try {
//     const res = await fetch('/api/sequences')
//     if (!res.ok) {
//       throw new Error('Network response was not ok')
//     }
//     const data = await res.json()
//     // console.log('fetchSequence-data', data)
//     return data
//   } catch (error) {
//     console.error('Error fetching sequence data:', error)
//   }
// }

async function fetchSeries() {
  try {
    const res = await fetch('/api/series')
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await res.json()
    return data
  } catch (error) {
    throw new Error('Error fetching sequence data')
  }
}

export default function Page() {
  const { data: session } = useSession()
  // console.log('session', session)
  // const { state, dispatch } = useSequence()
  // const {
  //   nameSequence,
  //   sequencesSeries,
  //   description,
  //   duration,
  //   image,
  //   breath_direction,
  // } = state.sequences

  const [sequences, setSequences] = useState<SequenceData>({
    id: 0,
    nameSequence: '',
    sequencesSeries: [],
    description: '',
    duration: '',
    image: '',
    breath_direction: '',
  })

  const [nameSequence, setNameSequence] = useState('')
  // const [sequencesSeries, setSequenceSeries] = useState<FlowSeriesData[]>([])
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('')
  const [image, setImage] = useState('')
  const [breath_direction, setBreathDirection] = useState('')

  const [flowSeries, setFlowSeries] = useState<FlowSeriesData[]>([])
  const [seriesNameSet, setSeriesNameSet] = useState<string[]>([])
  const [postures, setPostures] = useState<string[]>([])

  useEffect(() => {
    async function getData() {
      const seriesData = await fetchSeries()
      // const sequenceData = await fetchSequence()

      if (seriesData) {
        setFlowSeries(seriesData)
      }
      // if (sequenceData) {
      //   dispatch({ type: 'SET_SEQUENCES', payload: sequenceData })
      // }
    }
    getData()
  }, [session])

  function handleSelect(event: ChangeEvent<{}>, value: FlowSeriesData | null) {
    // Logs the type of event (e.g., 'click')
    // console.log('Event type:', event.type)
    // Logs the element that triggered the event
    // console.log('Event target:', event.target)
    // console.log('Selected value:', value)
    event.preventDefault()
    if (value) {
      setSeriesNameSet((prevSeriesNameSet) => [
        ...prevSeriesNameSet,
        value.seriesName,
      ])
      // console.log('seriesNameSet', seriesNameSet)
      // console.log('value.seriesName', value.seriesName)

      setPostures(value.seriesPostures)
      // console.log('postures', postures)

      // setSequenceSeries((prevSeries) => [...prevSeries, value])
      // console.log('sequenceSeries', sequenceSeries)

      // dispatch({
      //   type: 'SET_SEQUENCES',
      //   payload: {
      //     ...state.sequences,
      //     sequencesSeries: [...state.sequences.sequencesSeries, value],
      //   },
      // })
      setSequences({
        ...sequences,
        sequencesSeries: [...sequences.sequencesSeries, value],
      })
      // setSequences({
      //   ...sequences,
      //   sequencesSeries: [...sequences.sequencesSeries, value],
      // })
      // console.log('state.sequences', state.sequences.sequencesSeries)
      // console.log('sequences', sequences)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    // const updatedSequence = {
    //   ...state.sequences,
    //   nameSequence,
    //   sequencesSeries,
    //   description,
    //   duration,
    //   image,
    //   breath_direction,
    // }
    // console.log('handleSubmit-sequences', sequences)
    const updatedSequence = {
      ...sequences,
      nameSequence,
      sequencesSeries: sequences.sequencesSeries,
      description,
      duration,
      image,
      breath_direction,
    }

    // dispatch({ type: 'SET_SEQUENCES', payload: updatedSequence })

    // console.log('handleSubmit-updatedSequence', updatedSequence)

    try {
      const response = await fetch('/api/sequences/createSequence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSequence),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      // console.log('handleSubmit', data)
    } catch (error: Error | any) {
      error.message
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    // console.log('handleChange', name, value)
    // console.log('handleChange state.sequences', state.sequences)
    // console.log('handleChange sequences', sequences)
    // dispatch({
    //   type: 'SET_SEQUENCES',
    //   payload: {
    //     ...state.sequences,
    //     [name]: value,
    //   },
    // })
    switch (name) {
      case 'nameSequence':
        setNameSequence(value)
        break
      // case 'sequencesSeries':
      //   setSequenceSeries(
      //     (prevValue) => [...prevValue, value] as FlowSeriesData[]
      //   )
      //   break
      case 'seriesName':
        // setSequenceSeries(
        //   (prevValue) => [...prevValue, value] as FlowSeriesData[]
        // )
        setSeriesNameSet((prev) => [...prev, value])
        break
      case 'description':
        setDescription(value)
        break
      case 'duration':
        setDuration(value)
        break
      case 'image':
        setImage(value)
        break
      case 'breath_direction':
        setBreathDirection(value)
        break
    }
  }

  return (
    <Stack
      spacing={2}
      flexDirection={'column'}
      sx={{ marginX: 3, marginY: 3, background: 'white', mb: '1em' }}
    >
      <>
        {FEATURES.SHOW_CREATE_SEQUENCE && (
          <>
            <Stack
              direction="column"
              spacing={5}
              sx={{ mt: 4 }}
              justifyContent={'space-between'}
            >
              <Typography variant="h2" textAlign="center">
                Create a Sequence
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                href="/navigator/flowSeries"
                LinkComponent="a"
                sx={{ my: 3, display: 'block' }}
              >
                Back to flow
              </Button>
            </Stack>
            <FormGroup sx={{ mt: 4 }}>
              <FormControl>
                <FormLabel>Sequence Name</FormLabel>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="nameSequence"
                  value={nameSequence}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Series Name</FormLabel>
                {/* 
                <TextField
                  id="seriesName"
                  variant="outlined"
                  name="seriesName"
                  value={seriesNameSet}
                  onChange={handleChange}
                  disabled
                />
                 */}
                <Stack
                  direction="column"
                  spacing={2}
                  justifyContent="flex-start"
                  sx={{ mt: 3 }}
                >
                  {seriesNameSet.map((series, index) => (
                    <Box
                      key={`${series}+${index}`}
                      display={'flex'}
                      sx={{ pl: 4 }}
                    >
                      <Typography sx={{ mr: 2 }} key={index}>
                        {index + 1}.
                      </Typography>
                      <Typography key={index}>{series}</Typography>
                    </Box>
                  ))}
                </Stack>
              </FormControl>

              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                sx={{ mt: 3 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setSeriesNameSet((prev) => prev.slice(0, -1))}
                >
                  <Typography>Remove One (-1)</Typography>
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setSeriesNameSet([])}
                >
                  Clear
                </Button>
              </Stack>

              <Autocomplete
                disablePortal
                id="combo-box-series-search"
                options={flowSeries}
                getOptionLabel={(option: FlowSeriesData) => option.seriesName}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.seriesName}
                  </li>
                )}
                sx={{ my: 3 }}
                renderInput={(params) => (
                  <TextField {...params} label="Pick Series" />
                )}
                onChange={handleSelect}
              />

              {postures?.length > 0 && (
                <>
                  <Typography variant="h3">
                    {seriesNameSet.slice(-1)[0]} Postures
                  </Typography>
                  <List>
                    {postures.map((series, index) => (
                      <ListItem key={`${series}${index}`}>
                        <ListItemText primary={series} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              <FormControl>
                <FormLabel>Description</FormLabel>
                <TextField
                  id="description"
                  variant="outlined"
                  name="description"
                  value={description}
                  onChange={handleChange}
                />
              </FormControl>
              {/* 
              <FormControl>
                <FormLabel>Duration</FormLabel>
                <TextField
                  id="duration"
                  variant="outlined"
                  name="duration"
                  value={duration}
                  onChange={handleChange}
                />
              </FormControl>
               */}
              {/* 
              <FormControl>
                <FormLabel>Image</FormLabel>
                <TextField
                  id="image"
                  variant="outlined"
                  name="image"
                  value={image}
                  onChange={handleChange}
                />
              </FormControl>
 */}
              {/* 
              <FormControl>
                <FormLabel>Breath Direction</FormLabel>
                <TextField
                  id="breath_direction"
                  variant="outlined"
                  name="breath_direction"
                  value={breath_direction}
                  onChange={handleChange}
                />
              </FormControl>
 */}
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                sx={{ mt: 4 }}
              >
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
            </FormGroup>
          </>
        )}
      </>
    </Stack>
  )
}
