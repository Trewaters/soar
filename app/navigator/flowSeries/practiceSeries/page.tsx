'use client'
import { FlowSeriesData } from '@context/AsanaSeriesContext'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Image from 'next/image'
import { ChangeEvent, useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HelpIcon from '@mui/icons-material/Help'

// export const getServerSideProps: GetServerSideProps = async () => {
//   const baseUrl =
//     process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
//   const url = new URL('/api/series/', baseUrl)
//   const res = await fetch(url.toString())
//   const data = await res.json()
//   const seriesData = Array.isArray(data) ? data : [data]

//   return {
//     props: {
//       initialSeries: JSON.parse(JSON.stringify(seriesData)),
//     },
//   }
// }

export default function Page() {
  const [series, setSeries] = useState<FlowSeriesData[]>([])
  const [flow, setFlow] = useState<FlowSeriesData>()

  useEffect(() => {
    async function fetchData() {
      // const baseUrl =
      //   process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      // const url = new URL('/api/series/', baseUrl)
      // const response = await fetch(url)
      const response = await fetch('/api/series')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      // const data = await response.json()
      // const seriesData = Array.isArray(data) ? data : [data]
      // setSeries(JSON.parse(JSON.stringify(seriesData)))
      setSeries(await response.json())
    }

    fetchData()
  }, [])

  function handleSelect(event: ChangeEvent<{}>, value: FlowSeriesData | null) {
    // Logs the type of event (e.g., 'click')
    // Logs the element that triggered the event
    event.preventDefault()
    if (value) {
      setFlow(value)
    }
  }

  function handleInfoClick() {
    alert(
      'Select a series to view the postures and description. Click on the back button to return to the flow series.'
    )
  }

  return (
    // <Box
    //   sx={{
    //     backgroundColor: '#f5f5f5',
    //     width: '600px',
    //     margin: '0 auto',
    //     padding: 0,
    //   }}
    // >
    <Stack
      spacing={2}
      sx={{ marginX: 3, marginY: 3, background: 'white', mb: '1em' }}
    >
      <Typography variant="h2" textAlign="center">
        Practice Yoga Series
      </Typography>
      <Stack
        direction={'row'}
        gap={2}
        justifyContent={'space-between'}
        sx={{ px: 4 }}
      >
        <Button
          variant="text"
          href="/navigator/flowSeries"
          LinkComponent="a"
          sx={{
            my: 3,
            alignSelf: 'flex-start',
            color: 'primary.contrastText',
            '&:hover': {
              backgroundColor: 'transparent',
              boxShadow: 'none',
            },
          }}
          startIcon={<ArrowBackIcon />}
          disableRipple
        >
          Back to flow
        </Button>
        <IconButton disableRipple onClick={handleInfoClick}>
          <HelpIcon sx={{ color: 'info.light' }} />
        </IconButton>
      </Stack>
      <Stack sx={{ px: 4, pb: 2 }}>
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
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderRadius: '12px',
              borderColor: 'primary.main',
              boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
              width: 'auto',
            },
          }}
          renderInput={(params) => (
            <TextField
              sx={{ '& .MuiInputBase-input': { color: 'primary.main' } }}
              {...params}
              placeholder="Search for a Series"
            />
          )}
          onChange={handleSelect}
        />
      </Stack>
      {flow && (
        <Box width="100%" key={flow.id}>
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Typography variant="h3" sx={{ marginY: 3 }}>
              {flow.seriesName}
            </Typography>
            <Stack className="list">
              {flow.seriesPostures.map((pose) => (
                <div key={pose} className="lines">
                  <Box key={pose} className="listLine">
                    <Typography textAlign={'left'} variant="body1">
                      {pose.split(',')[0]}
                    </Typography>
                    <Typography textAlign={'left'} variant="body2">
                      {pose.split(',')[1]}
                    </Typography>
                  </Box>
                </div>
              ))}
              <Typography variant="h3" sx={{ marginTop: 3 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {flow.description}
              </Typography>
            </Stack>
          </Box>
        </Box>
      )}
    </Stack>
    // </Box>
  )
}
