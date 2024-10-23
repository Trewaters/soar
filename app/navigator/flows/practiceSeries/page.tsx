'use client'
import { FlowSeriesData } from '@context/AsanaSeriesContext'
import { Autocomplete, Box, Stack, TextField, Typography } from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import SplashHeader from '@app/clientComponents/splash-header'
import Image from 'next/image'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import SearchIcon from '@mui/icons-material/Search'

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
      }}
    >
      <Stack
        spacing={2}
        sx={{ marginX: 3, marginY: 3, mb: '1em', width: 'fit-content' }}
      >
        <SplashHeader
          src={'/icons/designImages/splash-flows-2.png'}
          alt={'Practice Series'}
          title="Practice Series"
        />
        <SubNavHeader
          title="Flows"
          link="/navigator/flows"
          onClick={handleInfoClick}
        />
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
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <SearchIcon sx={{ color: 'primary.main', mr: 1 }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            onChange={handleSelect}
          />
        </Stack>
        {flow && (
          <Box width="100%" sx={{ p: 2 }} key={flow.id}>
            <Box
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
            >
              <Box className="journal">
                <Typography
                  variant="h3"
                  className="journalTitle"
                  textAlign={'center'}
                  sx={{ marginTop: 2 }}
                >
                  {flow.seriesName}
                </Typography>
                <Stack>
                  {flow.seriesPostures.map((pose) => (
                    <Box key={pose} className="lines">
                      <Box key={pose} className="journalLine">
                        <Typography textAlign={'left'} variant="body1">
                          {pose.split(',')[0]}
                        </Typography>
                        <Typography textAlign={'left'} variant="body2">
                          {pose.split(',')[1]}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Box
                className={'journal'}
                sx={{ marginTop: '32px', p: 4, color: 'primary.main' }}
              >
                <Stack flexDirection={'row'} alignItems={'center'}>
                  <Typography variant="h3" sx={{ mr: 2 }}>
                    Description
                  </Typography>
                  <Image
                    src={'/icons/designImages/leaf-2.svg'}
                    alt={'leaf icon'}
                    height={21}
                    width={21}
                  ></Image>
                </Stack>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {flow.description}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Stack>
    </Box>
  )
}
