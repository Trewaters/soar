'use client'
import { FlowSeriesData } from '@app/context/AsanaSeriesContext'
import { useSequence } from '@app/context/SequenceContext'
import { FEATURES } from '@app/FEATURES'
import {
  Autocomplete,
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

async function fetchSequence() {
  try {
    const res = await fetch('/api/sequences')
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await res.json()
    console.log('fetchSequence-data', data)
    return data
  } catch (error) {
    console.error('Error fetching sequence data:', error)
  }
}
console.log('fetchSequence', fetchSequence())

async function fetchSeries() {
  try {
    const res = await fetch('/api/series')
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await res.json()
    console.log('fetchSeries-data', data)
    return data
  } catch (error) {
    console.error('Error fetching sequence data:', error)
  }
}

export default function Page() {
  const { data: session } = useSession()
  // console.log('session', session)
  const { state, dispatch } = useSequence()
  const [flowSeries, setFlowSeries] = useState<FlowSeriesData[]>([])
  const {
    nameSequence,
    sequencesSeries,
    description,
    duration,
    image,
    breath_direction,
  } = state.sequences

  useEffect(() => {
    async function getData() {
      const seriesData = await fetchSeries()
      const sequenceData = await fetchSequence()

      if (seriesData) {
        setFlowSeries(seriesData)
      }
      if (sequenceData) {
        dispatch({ type: 'SET_SEQUENCES', payload: sequenceData })
      }
    }
    getData()
  }, [dispatch])

  function handleSelect(event: ChangeEvent<{}>, value: FlowSeriesData | null) {
    // Logs the type of event (e.g., 'click')
    // console.log('Event type:', event.type)
    // Logs the element that triggered the event
    // console.log('Event target:', event.target)
    // console.log('Selected value:', value)
    event.preventDefault()
    if (value) {
      setFlowSeries([value])
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const updatedSequence = {
      ...state.sequences,
      nameSequence,
      sequencesSeries,
      description,
      duration,
      image,
      breath_direction,
    }

    dispatch({ type: 'SET_SEQUENCES', payload: updatedSequence })

    try {
      const response = await fetch('/api/series/createSequence', {
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
      console.log('handleSubmit', data)
    } catch (error: Error | any) {
      error.message
    }
  }

  return (
    <>
      {FEATURES.SHOW_CREATE_SEQUENCE && (
        <>
          <Stack
            direction="row"
            spacing={5}
            sx={{ mt: 4 }}
            justifyContent={'space-between'}
          >
            <Typography variant="h2" textAlign="center">
              Create a Sequence
            </Typography>
            <Button
              variant="outlined"
              href="/flowSeries"
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
                id="nameSequence"
                variant="outlined"
                value={nameSequence}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_SEQUENCES',
                    payload: {
                      ...state.sequences,
                      nameSequence: e.target.value,
                    },
                  })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Series Name</FormLabel>
              <TextField
                id="seriesName"
                variant="outlined"
                // value={sequencesSeries[0].seriesName}
              />
            </FormControl>
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
                <TextField {...params} label="Series Postures" />
              )}
              onChange={handleSelect}
            />
            <FormControl>
              <FormLabel>Series Postures</FormLabel>
              <TextField
                id={`seriesPostures`}
                variant="outlined"
                // value={sequencesSeries[0].seriesPostures.join(',')}
                // onChange={(e) => {
                //   const updatedPostures = e.target.value.split(', ')
                //   const updatedSequencesSeries = sequencesSeries.map(
                //     (series, index) =>
                //       index === 0
                //         ? { ...series, seriesPostures: updatedPostures }
                //         : series
                //   )
                //   dispatch({
                //     type: 'SET_SEQUENCES',
                //     payload: {
                //       ...state.sequences,
                //       sequencesSeries: updatedSequencesSeries,
                //     },
                //   })
                // }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <TextField
                id="description"
                variant="outlined"
                value={description}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_SEQUENCES',
                    payload: {
                      ...state.sequences,
                      description: e.target.value,
                    },
                  })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Duration</FormLabel>
              <TextField
                id="duration"
                variant="outlined"
                value={duration}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_SEQUENCES',
                    payload: {
                      ...state.sequences,
                      duration: e.target.value,
                    },
                  })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Image</FormLabel>
              <TextField
                id="image"
                variant="outlined"
                value={image}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_SEQUENCES',
                    payload: {
                      ...state.sequences,
                      image: e.target.value,
                    },
                  })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Breath Direction</FormLabel>
              <TextField
                id="breath_direction"
                variant="outlined"
                value={breath_direction}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_SEQUENCES',
                    payload: {
                      ...state.sequences,
                      breath_direction: e.target.value,
                    },
                  })
                }
              />
            </FormControl>

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
  )
}
