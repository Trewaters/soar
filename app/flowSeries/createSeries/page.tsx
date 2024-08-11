'use client'
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

// const flowSeries: FlowSeriesData[] = [
//   {
//     id: 1,
//     seriesName: 'Integration Series',
//     seriesPostures: [
//       'Stand at Attention, Samsthiti',
//       'Ragdoll, Uttanasana',
//       'Downward Facing Dog, Adho Mukha Svanasana',
//       "Child's Pose Balasana",
//     ],
//   },
//   {
//     id: 2,
//     seriesName: 'Sun Salutation A Series',
//     seriesPostures: [
//       'Mountain Pose, Tadasana',
//       'Standing Forward Fold, Uttanasana',
//       'Halfway Lift Ardha, Uttanasana',
//       'High to Low Plank, Chaturanga Dandasana',
//       'Upward Facing Dog, Urdhva Mukha Svanasana',
//       'Downward Facing Dog, Adho Mukha Svanasana',
//     ],
//   },
//   {
//     id: 3,
//     seriesName: 'Sun Salutation B Series',
//     seriesPostures: [
//       'Chair Pose, Utkatasana',
//       'Standing Forward Fold, Uttanasana',
//       'Halfway Lift, Ardha Uttanasana',
//       'High to Low Plank, Chaturanga Dandasana',
//       'Upward Facing Dog, Urdhva Mukha Svanasana',
//       'Downward Facing Dog, Adho Mukha Svanasana',
//       'Warrior Two, Virabhadrasana II',
//       'Extended Side Angle, Utthita Parsvakonasana',
//       'Reverse Warrior, Parivrtta Virabhadrasana II',
//       'High to Low Plank, Chaturanga Dandasana',
//     ],
//   },
//   {
//     id: 4,
//     seriesName: 'Core Series',
//     seriesPostures: [
//       'Reclined Bound Angle Sit Ups, Supta Baddha Konasana Sit Ups',
//       'Bicycle Twists',
//       'Boat Pose, Navasana',
//     ],
//   },
//   {
//     id: 5,
//     seriesName: 'Crescent Lunge Series',
//     seriesPostures: [
//       'Crescent Lunge, Anjanayesana',
//       'Revolved Crescent Lunge, Parivrtta Anjanayesana',
//       "Runner's Lunge, Anjaneyasana",
//       'Side Plank, Vasisthasana',
//       'Prayer Twist, Parivrtta Utkatasana',
//       'Gorilla Pose, Padahastasana',
//       'Crow Pose, Bakasana',
//     ],
//   },
//   {
//     id: 6,
//     seriesName: 'Balancing Series',
//     seriesPostures: [
//       'Eagle Pose, Garudasana',
//       "Dancer's Pose, Natarajasana",
//       'Tree Pose, Vrksasana',
//     ],
//   },
//   {
//     id: 7,
//     seriesName: 'Triangle Series',
//     seriesPostures: [
//       'Warrior One, Virabhadrasana I',
//       'Warrior Two, Virabhadrasana II',
//       'Triangle Pose, Trikonasana',
//       'Wide Leg Forward Fold, Paschimottansana',
//     ],
//   },
//   {
//     id: 8,
//     seriesName: 'Hip Series',
//     seriesPostures: ['Half Pigeon Eka Pada Rajakapotasana'],
//   },
//   {
//     id: 9,
//     seriesName: 'Spine Series',
//     seriesPostures: [
//       'Cobra Pose, Bhujangasana',
//       'Bow Pose, Dhanurasana',
//       'Camel Pose, Ustrasana',
//       'Bridge Pose, Setu Bandha Sarvangasana',
//       'Reclined Bound Angle Pose, Supta Baddha Konasana',
//     ],
//   },
//   {
//     id: 10,
//     seriesName: 'Surrender Series',
//     seriesPostures: [
//       'Seated Forward Fold, Paschimittonasana',
//       'Happy Baby, Ananda Balasana',
//       'Supine Twist, Jathara Parivartanasana',
//       'Corpse Pose, Savasana',
//       'Easy Pose, Sukhasana',
//     ],
//   },
// ]

export default function Page() {
  // const [series, setSeries] = useState<FlowSeriesData[]>([])
  const [singleSeries, setSingleSeries] = useState<FlowSeriesData>(
    {} as FlowSeriesData
  )

  const [seriesName, setSeriesName] = useState('')
  const [seriesPostures, setSeriesPostures] = useState('')
  const [breathDuration, setBreathDuration] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('')
  const [image, setImage] = useState('')

  const [postureName, setPostureName] = useState<String>('')
  const [postures, setPostures] = useState<PostureData[]>([])
  const [singlePosture, setSinglePosture] = useState<PostureData>()

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
      setPostureName(value.english_name)
    }
  }

  async function handleSubmit(series: FlowSeriesData) {
    // console.log('series', series)
    try {
      const response = await fetch('/api/createSeries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(series),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      // setSingleSeries(await response.json())
    } catch (error: Error | any) {
      error.message
    }
  }

  return (
    <>
      {FEATURES.SHOW_CREATE_SERIES && (
        <>
          <Typography variant="h2" textAlign="center">
            Create a Series
          </Typography>
          <form>
            <FormControl>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-basic"
                    label="Series Name"
                    variant="outlined"
                    value={seriesName}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setSeriesName(event.currentTarget.value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-basic"
                    label="Series Postures"
                    variant="outlined"
                    value={postureName}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setSeriesPostures(event.currentTarget.value)
                    }
                  />
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
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-basic"
                    label="Breath Duration"
                    variant="outlined"
                    value={breathDuration}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setBreathDuration(event.currentTarget.value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-basic"
                    label="Description"
                    multiline
                    variant="outlined"
                    value={description}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setDescription(event.currentTarget.value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-basic"
                    label="Duration"
                    variant="outlined"
                    value={duration}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setDuration(event.currentTarget.value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-basic"
                    label="Image"
                    variant="outlined"
                    value={image}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setImage(event.currentTarget.value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSubmit(singleSeries)}
                    >
                      Submit
                    </Button>
                    <Button variant="outlined" color="secondary">
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </FormControl>
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
