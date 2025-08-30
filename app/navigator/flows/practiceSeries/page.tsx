'use client'
import { useSession } from 'next-auth/react'
import { FEATURES } from '@app/FEATURES'
import { FlowSeriesData } from '@context/AsanaSeriesContext'
import { orderPosturesForSearch } from '@app/utils/search/orderPosturesForSearch'
import getAlphaUserIds from '@app/lib/alphaUsers'
import {
  Autocomplete,
  Box,
  Drawer,
  Link,
  Stack,
  TextField,
  Typography,
  useTheme,
  ListSubheader,
} from '@mui/material'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import SplashHeader from '@app/clientComponents/splash-header'
import Image from 'next/image'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import SearchIcon from '@mui/icons-material/Search'
import PostureShareButton from '@app/clientComponents/postureShareButton'
import { getAllSeries, deleteSeries, updateSeries } from '@lib/seriesService'
import SeriesActivityTracker from '@app/clientComponents/seriesActivityTracker/SeriesActivityTracker'
import SeriesWeeklyActivityTracker from '@app/clientComponents/seriesActivityTracker/SeriesWeeklyActivityTracker'
import { useSearchParams } from 'next/navigation'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import EditSeriesDialog, {
  Series as EditSeriesShape,
  Asana as EditAsanaShape,
} from '@app/navigator/flows/editSeries/EditSeriesDialog'

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

  // Partitioned, grouped search data using centralized ordering utility
  const enrichedSeries = useMemo(
    () =>
      (series || []).map((s) => ({
        ...s,
        createdBy: (s as any).createdBy ?? (s as any).created_by ?? undefined,
        canonicalAsanaId: (s as any).canonicalAsanaId ?? (s as any).id,
      })),
    [series]
  )

  // Partition/group using the new utility (user/alpha at top, deduped, then others alpha)
  const currentUserId = session?.user?.id || session?.user?.email || ''
  const alphaUserIds = useMemo(() => getAlphaUserIds(), [])
  // Ordered options for Autocomplete: user/alpha-created first, deduped, then others alphabetical
  // Partition ordered options for section headers
  const orderedSeriesOptions = useMemo(() => {
    // Filter series to only show those created by current user or alpha users
    const authorizedSeries = enrichedSeries.filter((s) => {
      const createdBy = (s as any).createdBy
      const userIdentifiers = [currentUserId, session?.user?.email].filter(
        Boolean
      )
      // Allow series created by current user or alpha users only
      return (
        (createdBy && userIdentifiers.includes(createdBy)) ||
        (createdBy && alphaUserIds.includes(createdBy))
      )
    })

    if (!FEATURES.PRIORITIZE_USER_ENTRIES_IN_SEARCH)
      return authorizedSeries.map((s) => ({
        ...s,
        id: s.id ? String(s.id) : '',
      }))
    const validSeries = authorizedSeries
      .filter((s) => !!s.id && !!s.seriesName && !!s.seriesPostures)
      .map((s) => ({
        ...s,
        id: s.id ? String(s.id) : '',
      }))
    const allOrdered = orderPosturesForSearch(
      validSeries,
      currentUserId,
      alphaUserIds,
      (item) => String((item as FlowSeriesData).seriesName || '')
    ) as FlowSeriesData[]
    // Partition for section headers: Mine, Alpha (no Others since we filtered them out)
    const mine: (FlowSeriesData & { id: string })[] = []
    const alpha: (FlowSeriesData & { id: string })[] = []
    // Accept both user id and email for matching "Mine"
    const userIdentifiers = [currentUserId, session?.user?.email].filter(
      Boolean
    )
    allOrdered.forEach((item) => {
      const createdBy = (item as any).createdBy
      // Ensure id is always a string
      const itemWithId: FlowSeriesData & { id: string } = {
        ...item,
        id: (item as any).id ? String((item as any).id) : '',
      }
      if (createdBy && userIdentifiers.includes(createdBy)) {
        mine.push(itemWithId)
      } else if (createdBy && alphaUserIds.includes(createdBy)) {
        alpha.push(itemWithId)
      }
    })
    // Compose with section header markers (no Others section)
    const result: Array<
      | (FlowSeriesData & { id: string })
      | { section: 'Mine' | 'Alpha' | 'Others' }
    > = []
    if (mine.length > 0) {
      result.push({ section: 'Mine' })
      mine.forEach((item) => result.push(item))
    }
    if (alpha.length > 0) {
      result.push({ section: 'Alpha' })
      alpha.forEach((item) => result.push(item))
    }
    return result
  }, [enrichedSeries, currentUserId, alphaUserIds, session?.user?.email])

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
          <Autocomplete
            disablePortal
            freeSolo={false}
            id="combo-box-series-search"
            open={acOpen}
            onOpen={() => {
              setAcOpen(true)
              fetchSeries()
            }}
            onClose={() => setAcOpen(false)}
            loading={loading}
            loadingText="Loading series..."
            noOptionsText={loading ? 'Loading series...' : 'No series found'}
            options={orderedSeriesOptions}
            getOptionLabel={(option) => {
              const opt = option as any
              if ('section' in opt) return ''
              return opt.seriesName
            }}
            // We need to render section headers only once per group. Since MUI's renderOption doesn't provide the full options array,
            // we precompute a map of option indices to section headers.
            renderOption={(() => {
              // Build a map of option indices to section labels
              let lastSection: string | null = null
              const sectionHeaderMap: Record<number, string> = {}
              orderedSeriesOptions.forEach((opt, idx) => {
                const o = opt as any
                if ('section' in o) {
                  lastSection = o.section
                } else if (lastSection) {
                  sectionHeaderMap[idx] = lastSection
                  lastSection = null
                }
              })
              interface SectionOption {
                section: 'Mine' | 'Alpha' | 'Others'
              }

              interface SeriesOption extends FlowSeriesData {
                id: string
                seriesName: string
              }

              type AutocompleteOption = SeriesOption | SectionOption

              interface RenderOptionProps {
                key?: string
                [key: string]: any
              }

              interface RenderOptionState {
                index: number
              }

              const renderOptionFn = (
                props: RenderOptionProps,
                option: AutocompleteOption,
                { index }: RenderOptionState
              ) => {
                const opt = option as AutocompleteOption
                if ('section' in opt) {
                  // Never render section as an option (handled below)
                  return null
                }
                const sectionLabel = sectionHeaderMap[index] || null
                return (
                  <>
                    {sectionLabel && (
                      <ListSubheader
                        key={sectionLabel + '-header'}
                        component="div"
                        disableSticky
                        role="presentation"
                      >
                        {sectionLabel}
                      </ListSubheader>
                    )}
                    <li {...props} key={opt.id}>
                      {opt.seriesName}
                    </li>
                  </>
                )
              }
              renderOptionFn.displayName = 'SeriesAutocompleteRenderOption'
              return renderOptionFn
            })()}
            filterOptions={(options, state) => {
              // Partition options into groups by section
              const groups: Record<string, any[]> = {}
              let currentSection: 'Mine' | 'Alpha' | null = null
              for (const option of options) {
                const opt = option as any
                if ('section' in opt) {
                  currentSection = opt.section as 'Mine' | 'Alpha'
                  if (!groups[currentSection]) groups[currentSection] = []
                } else if (currentSection) {
                  if (!groups[currentSection]) groups[currentSection] = []
                  // Only add if matches search
                  if (
                    opt.seriesName &&
                    opt.seriesName
                      .toLowerCase()
                      .includes(state.inputValue.toLowerCase())
                  ) {
                    groups[currentSection].push(opt)
                  }
                }
              }
              // Flatten back to options array, inserting section header if group has any items
              const filtered: typeof options = []
              const sectionOrder: Array<'Mine' | 'Alpha'> = ['Mine', 'Alpha']
              for (const section of sectionOrder) {
                if (groups[section] && groups[section].length > 0) {
                  filtered.push({
                    section: section as 'Mine' | 'Alpha' | 'Others',
                  })
                  filtered.push(...groups[section])
                }
              }
              return filtered
            }}
            isOptionEqualToValue={(option, value) => {
              const opt = option as any
              const val = value as any
              if ('section' in opt || 'section' in val) return false
              return opt.id === val.id
            }}
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
                InputProps={{
                  ...params.InputProps,
                  onClick: () => setAcOpen(true),
                  startAdornment: (
                    <>
                      <SearchIcon sx={{ color: 'primary.main', mr: 1 }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            onChange={(event, value) => {
              const val = value as any
              // Ignore section header clicks
              if (val && 'section' in val) return
              handleSelect(event as any, value as FlowSeriesData | null)
            }}
          />
          {/* GroupedAutocompleteSections removed: UI now uses flat ordered list only */}
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
