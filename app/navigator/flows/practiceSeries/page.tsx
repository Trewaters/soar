'use client'
import { FlowSeriesData } from '@context/AsanaSeriesContext'
import {
  Autocomplete,
  Box,
  Drawer,
  Link,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import SplashHeader from '@app/clientComponents/splash-header'
import Image from 'next/image'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import SearchIcon from '@mui/icons-material/Search'
import NavBottom from '@serverComponents/navBottom'

export default function Page() {
  const theme = useTheme()
  const [series, setSeries] = useState<FlowSeriesData[]>([])
  const [flow, setFlow] = useState<FlowSeriesData>()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/series', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
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
    setOpen(!open)
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
          src={'/icons/designImages/practice-series-color.png'}
          alt={'Practice Series'}
          title="Practice Series"
        />
        <SubNavHeader
          title="Flows"
          link="/navigator/flows"
          onClick={handleInfoClick}
        />
        <Stack sx={{ px: 2 }}>
          <Autocomplete
            disablePortal
            freeSolo={false}
            id="combo-box-series-search"
            options={series.sort((a, b) =>
              a.seriesName.localeCompare(b.seriesName)
            )}
            getOptionLabel={(option: FlowSeriesData) => option.seriesName}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.seriesName}
              </li>
            )}
            filterOptions={(options, state) =>
              options.filter((option) =>
                option.seriesName
                  .toLowerCase()
                  .includes(state.inputValue.toLowerCase())
              )
            }
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '12px',
                borderColor: 'primary.main',
                boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                {
                  borderColor: 'primary.light', // Ensure border color does not change on hover
                },
              '& .MuiAutocomplete-endAdornment': {
                display: 'none',
              },
            }}
            renderInput={(params) => (
              <TextField
                sx={{ '& .MuiInputBase-input': { color: 'primary.main' } }}
                {...params}
                placeholder="Search for a Series"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <SearchIcon sx={{ color: 'primary.main', mr: 1 }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  },
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
                  sx={{
                    marginTop: 2,
                    color: `${theme.palette.primary.main}`,
                  }}
                >
                  {flow.seriesName}
                </Typography>
                <Stack>
                  {flow.seriesPostures.map((pose) => (
                    <Box key={pose} className="lines">
                      <Box key={pose} className="journalLine">
                        <Typography textAlign={'left'} variant="body1">
                          <Link
                            underline="hover"
                            color="primary.contrastText"
                            href={`/navigator/asanaPostures/${pose.split(';')[0]}`}
                          >
                            {pose.split(';')[0]}
                          </Link>
                        </Typography>
                        <Typography textAlign={'left'} variant="body2">
                          {pose.split(';')[1]}
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
      <Drawer
        // sx={{ width: '50%' }}
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Typography variant="body1">Pick a Series to practice.</Typography>
      </Drawer>
      <Box height={'72px'} />

      <NavBottom subRoute="/navigator/flows" />
    </Box>
  )
}
