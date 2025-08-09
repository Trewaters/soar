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
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import SplashHeader from '@app/clientComponents/splash-header'
import Image from 'next/image'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import SearchIcon from '@mui/icons-material/Search'
import NavBottom from '@serverComponents/navBottom'
import PostureShareButton from '@app/clientComponents/postureShareButton'
import { getAllSeries } from '@lib/seriesService'
import SeriesActivityTracker from '@app/clientComponents/seriesActivityTracker/SeriesActivityTracker'
import SeriesWeeklyActivityTracker from '@app/clientComponents/seriesActivityTracker/SeriesWeeklyActivityTracker'
import { useSearchParams } from 'next/navigation'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import EditSeriesDialog, {
  Series as EditSeriesShape,
  Asana as EditAsanaShape,
} from '@app/navigator/flows/editSeries/EditSeriesDialog'
import { useSession } from 'next-auth/react'
import { deleteSeries, updateSeries } from '@lib/seriesService'

export default function Page() {
  const { data: session } = useSession()
  const theme = useTheme()
  const searchParams = useSearchParams()
  const seriesId = searchParams.get('id')
  const [series, setSeries] = useState<FlowSeriesData[]>([])
  const [flow, setFlow] = useState<FlowSeriesData>()
  const [open, setOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [loading, setLoading] = useState(false)
  const [acOpen, setAcOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const fetchSeries = useCallback(
    async (selectId?: string) => {
      setLoading(true)
      try {
        const seriesData = await getAllSeries()
        setSeries(seriesData as FlowSeriesData[])
        // If there's a series ID in the URL, auto-select that series
        if (seriesData.length > 0) {
          if (seriesId) {
            const selectedSeries = seriesData.find((s) => s.id === seriesId)
            if (selectedSeries) setFlow(selectedSeries)
          } else if (selectId) {
            const selectedSeries = seriesData.find((s) => s.id === selectId)
            if (selectedSeries) setFlow(selectedSeries)
          } else if (flow?.id) {
            const selectedSeries = seriesData.find((s) => s.id === flow.id)
            if (selectedSeries) setFlow(selectedSeries)
          }
        }
      } catch (error) {
        console.error('Error fetching series:', error)
      } finally {
        setLoading(false)
      }
    },
    [seriesId, flow?.id]
  )

  useEffect(() => {
    // initial load
    fetchSeries()
  }, [fetchSeries])

  function handleSelect(
    event: ChangeEvent<object>,
    value: FlowSeriesData | null
  ) {
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

  // Determine if current user owns the selected series
  const isOwner = useMemo(() => {
    if (!flow || !session?.user?.email) return false
    // createdBy added by API normalization
    return (flow as any).createdBy === session.user.email
  }, [flow, session?.user?.email])

  // Map FlowSeriesData to EditSeriesDialog expected shape
  const dialogSeries: EditSeriesShape | null = useMemo(() => {
    if (!flow) return null
    const asanas: EditAsanaShape[] = (flow.seriesPostures || []).map(
      (sp, idx) => {
        const parts = sp.split(';')
        const name = (parts[0] || '').trim()
        const simplified = (parts[1] || '').trim()
        return {
          id: `${idx}-${name}`,
          name,
          difficulty: simplified || 'unknown',
        }
      }
    )
    return {
      id: flow.id || '',
      name: flow.seriesName,
      description: flow.description || '',
      difficulty: 'beginner',
      asanas,
      created_by: (flow as any).createdBy || '',
    }
  }, [flow])

  const handleEditSave = async (updated: EditSeriesShape) => {
    try {
      await updateSeries(updated.id, updated)
      // refresh list and reselect the updated series so UI reflects changes immediately
      await fetchSeries(updated.id)
      setEditOpen(false)
    } catch (e) {
      console.error('Failed to save series update', e)
    }
  }

  const handleEditDelete = async (id: string) => {
    try {
      await deleteSeries(id)
      // Clear selection and refresh
      setFlow(undefined)
      await fetchSeries()
      setEditOpen(false)
    } catch (e) {
      console.error('Failed to delete series', e)
    }
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
            disablePortal
            freeSolo={false}
            id="combo-box-series-search"
            open={acOpen}
            onOpen={() => {
              setAcOpen(true)
              // Refresh list when user opens the dropdown to avoid stale data
              fetchSeries()
            }}
            onClose={() => setAcOpen(false)}
            loading={loading}
            loadingText="Loading series..."
            noOptionsText={loading ? 'Loading series...' : 'No series found'}
            options={
              series && series.length > 0
                ? series.sort((a, b) =>
                    a.seriesName.localeCompare(b.seriesName)
                  )
                : []
            }
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
                  borderColor: 'primary.light',
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
              {/* Title + optional Edit button for owners */}
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
                {isOwner && (
                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}
                  >
                    <IconButton
                      aria-label="Edit series"
                      onClick={() => setEditOpen(true)}
                      color="primary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                )}
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

              <PostureShareButton
                content={{
                  contentType: 'series',
                  data: flow,
                }}
              />
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
      {dialogSeries && (
        <EditSeriesDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          series={dialogSeries}
          onSave={handleEditSave}
          onDelete={handleEditDelete}
        />
      )}
    </Box>
  )
}
