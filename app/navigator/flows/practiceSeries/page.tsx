'use client'
import { FlowSeriesData } from '@context/AsanaSeriesContext'
import {
  Autocomplete,
  Box,
  Drawer,
  IconButton,
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
import PostureShareButton from '@app/clientComponents/exportPoses'
import { getAllSeries } from '@lib/seriesService'
import SeriesActivityTracker from '@app/clientComponents/seriesActivityTracker/SeriesActivityTracker'
import SeriesWeeklyActivityTracker from '@app/clientComponents/seriesActivityTracker/SeriesWeeklyActivityTracker'

export default function Page() {
  const theme = useTheme()
  const [series, setSeries] = useState<FlowSeriesData[]>([])
  const [flow, setFlow] = useState<FlowSeriesData>()
  const [open, setOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const fetchData = async () => {
    try {
      const seriesData = await getAllSeries()
      setSeries(seriesData as FlowSeriesData[])
    } catch (error) {
      console.error('Error fetching series:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  function handleSelect(
    event: ChangeEvent<object>,
    value: FlowSeriesData | null
  ) {
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

  function handleActivityToggle(isTracked: boolean) {
    console.log('Series activity tracked:', isTracked)
    // Trigger refresh of any activity components that might be listening
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack spacing={2} sx={{ marginX: 3, mb: '1em', width: 'fit-content' }}>
        <SplashHeader
          src={'/images/series/series-practice-splash-header.png'}
          alt={'Practice Series'}
          title="Practice Series"
        />
        <SubNavHeader
          title="Flows"
          link="/navigator/flows"
          onClick={handleInfoClick}
        />
        <Stack sx={{ px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: 'primary.main', mr: 2 }}>
              Practice Series
            </Typography>
          </Box>
          <Autocomplete
            key={`series-autocomplete-${series.length}-${Date.now()}`} // Force re-render when data changes
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
                sx={{
                  marginTop: '32px',
                  p: 4,
                  color: 'primary.main',
                  backgroundColor: 'navSplash.dark',
                }}
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
                <Typography
                  color="primary.contrastText"
                  variant="body1"
                  sx={{ whiteSpace: 'pre-line' }}
                >
                  {flow.description}
                </Typography>
              </Box>

              {/* Series Activity Tracker */}
              <Box sx={{ mt: 3 }}>
                <SeriesActivityTracker
                  seriesId={flow.id?.toString() || ''}
                  seriesName={flow.seriesName}
                  onActivityToggle={handleActivityToggle}
                />
              </Box>

              {/* Series Weekly Activity Tracker */}
              <Box sx={{ mt: 3 }}>
                <SeriesWeeklyActivityTracker
                  seriesId={flow.id?.toString() || ''}
                  seriesName={flow.seriesName}
                  variant="detailed"
                  refreshTrigger={refreshTrigger}
                />
              </Box>

              <PostureShareButton seriesData={flow} />
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
