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
import { ChangeEvent, useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HelpIcon from '@mui/icons-material/Help'
import SplashHeader from '@app/clientComponents/splash-header'

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 4,
        width: '100%',
      }}
    >
      <Stack spacing={2} sx={{ marginX: 3, marginY: 3, mb: '1em' }}>
        <SplashHeader
          src={'/icons/designImages/splash-flows-2.png'}
          alt={'Practice Series'}
          title="Practice Series"
        />
        <Stack
          direction={'row'}
          gap={2}
          justifyContent={'space-between'}
          sx={{ px: 4, mt: 3 }}
        >
          <Button
            variant="text"
            href="/navigator/flows"
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
            <Box
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
            >
              <Typography variant="h3" sx={{ marginY: 3 }}>
                {flow.seriesName}
              </Typography>
              <Box
                className="journal"
                sx={{
                  padding: 2,
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                  width: '100%',
                }}
              >
                <Stack>
                  {flow.seriesPostures.map((pose) => (
                    <div key={pose} className="lines">
                      <Box key={pose} className="journalLine">
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
          </Box>
        )}
      </Stack>
    </Box>
  )
}
