'use client'
import { FlowSeriesData } from '@app/interfaces/flowSeries'
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Image from 'next/image'
import { ChangeEvent, useEffect, useState } from 'react'

export default function Page() {
  const [series, setSeries] = useState<FlowSeriesData[]>([])
  const [flow, setFlow] = useState<FlowSeriesData>()

  async function fetchData() {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
    const url = new URL('/api/series/', baseUrl)
    const res = await fetch(url.toString())
    const data = await res.json()
    // console.log('fetchData seriesMany data', data)
    /* console.log(
      'fetchData seriesMany parse',
      JSON.parse(JSON.stringify(data[0]))
    ) */
    // console.log('fetchData seriesMany', JSON.stringify(data))
    // console.log('fetchData seriesMany stringify', JSON.stringify(data))

    const seriesData = Array.isArray(data) ? data : [data]
    // console.log('fetchData seriesData', JSON.stringify(seriesData))

    // setSeries(data)
    // setSeries(JSON.parse(data))
    // setSeries(JSON.parse(JSON.stringify(data[0])))
    setSeries(JSON.parse(JSON.stringify(seriesData)))
    // console.log('series', series)

    // return JSON.parse(JSON.stringify(data[0]))
  }

  useEffect(() => {
    fetchData()
  }, [])

  function handleSelect(event: ChangeEvent<{}>, value: FlowSeriesData | null) {
    // Logs the type of event (e.g., 'click')
    // console.log('Event type:', event.type)
    // Logs the element that triggered the event
    // console.log('Event target:', event.target)
    // console.log('Selected value:', value)
    event.preventDefault()
    if (value) {
      setFlow(value)
    }
  }

  return (
    <Stack
      spacing={2}
      sx={{ marginX: 3, marginY: 3, background: 'white', mb: '1em' }}
    >
      <Autocomplete
        disablePortal
        id="combo-box-series-search"
        options={series}
        getOptionLabel={(option: FlowSeriesData) => option.seriesName}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.seriesName}
          </li>
        )}
        sx={{ width: '50%' }}
        renderInput={(params) => <TextField {...params} label="Flow Series" />}
        // renderInput={(params) => (
        //   <>
        //     {series.map((item, index) => (
        //       <TextField {...params} label={item.seriesName} key={index} />
        //     ))}
        //   </>
        // )}
        onChange={handleSelect}
      />
      {flow && (
        <Box width="100%" textAlign="center" marginTop={4} key={flow.id}>
          <Typography variant="h2">Practice Series</Typography>
          <Typography variant="h3">{flow.seriesName}</Typography>
          <Stack rowGap={3} alignItems="center" marginTop={4}>
            {flow.seriesPostures.map((pose) => (
              <Card
                key={pose}
                sx={{
                  width: '100%',
                  boxShadow: 3,
                  display: 'flex',
                  flexDirection: 'row',
                  borderColor: 'primary.light',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    width: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    src="/stick-tree-pose-400x400.png"
                    alt="Yoga Posture Image"
                    width={100}
                    height={100}
                    priority={true}
                  />
                </CardMedia>
                <CardContent sx={{ flex: '1 1 auto' }}>
                  <Typography textAlign={'left'} variant="body1">
                    {pose}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  )
}
