'use client'
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  Fragment,
  ChangeEvent,
} from 'react'
import { useSession } from 'next-auth/react'
import { FEATURES } from '@app/FEATURES'
import { FlowSeriesData } from '@context/AsanaSeriesContext'
import { orderPosesForSearch } from '@app/utils/search/orderPosesForSearch'
import getAlphaUserIds from '@app/lib/alphaUsers'
import {
  Autocomplete,
  Box,
  Drawer,
  Stack,
  Typography,
  useTheme,
  ListSubheader,
  Card,
  CardMedia,
} from '@mui/material'
import { getPoseNavigationUrlSync } from '@app/utils/navigation/poseNavigation'
import SplashHeader from '@app/clientComponents/splash-header'
import Image from 'next/image'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import { AutocompleteInput } from '@app/clientComponents/form'
import PoseShareButton from '@app/clientComponents/poseShareButton'
import { getAllSeries, deleteSeries, updateSeries } from '@lib/seriesService'
import SeriesActivityTracker from '@app/clientComponents/seriesActivityTracker/SeriesActivityTracker'
import SeriesWeeklyActivityTracker from '@app/clientComponents/seriesActivityTracker/SeriesWeeklyActivityTracker'
import { useSearchParams, useRouter } from 'next/navigation'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import EditSeriesDialog, {
  Series as EditSeriesShape,
  Asana as EditAsanaShape,
} from '@app/navigator/flows/editSeries/EditSeriesDialog'
import { splitSeriesPoseEntry } from '@app/utils/asana/seriesPoseLabels'
import SeriesPoseList from '@app/clientComponents/SeriesPoseList'

export default function Page() {
  const { data: session } = useSession()
  const theme = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const seriesId = searchParams.get('id')
  const [series, setSeries] = useState<FlowSeriesData[]>([])
  const [flow, setFlow] = useState<FlowSeriesData>()
  const flowRef = React.useRef<FlowSeriesData | undefined>(flow)

  useEffect(() => {
    flowRef.current = flow
  }, [flow])
  const [open, setOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [loading, setLoading] = useState(false)
  const [acOpen, setAcOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [searchInputValue, setSearchInputValue] = useState('')

  // Partitioned, grouped search data using centralized ordering utility
  const enrichedSeries = useMemo(
    () =>
      (series || []).map((s) => ({
        ...s,
        createdBy: (s as any).createdBy ?? (s as any).created_by ?? undefined,
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
      .filter((s) => !!s.id && !!s.seriesName && !!s.seriesPoses)
      .map((s) => ({
        ...s,
        id: s.id ? String(s.id) : '',
      }))
    const allOrdered = orderPosesForSearch(
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

  // We intentionally omit `flow` from the dependency array to avoid a
  // feedback loop where setting `flow` (even to an equivalent id) would
  // re-trigger fetchSeries. We use `flowRef` to read the current value.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSeries = useCallback(
    async (selectId?: string) => {
      setLoading(true)
      try {
        const seriesData = await getAllSeries()
        setSeries(seriesData as FlowSeriesData[])
        // If there's a series ID in the URL, auto-select that series
        if (seriesData.length > 0) {
          if (seriesId) {
            const selectedSeries = seriesData.find(
              (s) => String(s.id) === String(seriesId)
            )
            if (selectedSeries) {
              // Only update flow if the selected id differs from current to avoid
              // re-render loops where setting an equivalent object repeatedly
              // would recreate `flow` and retrigger this effect.
              if (String(selectedSeries.id) !== String(flowRef.current?.id)) {
                setFlow(selectedSeries)
              }
            }
          } else if (selectId) {
            const selectedSeries = seriesData.find((s) => s.id === selectId)
            if (selectedSeries) {
              if (String(selectedSeries.id) !== String(flowRef.current?.id)) {
                setFlow(selectedSeries)
              }
            }
          } else if (flow?.id) {
            const selectedSeries = seriesData.find((s) => s.id === flow.id)
            if (selectedSeries) {
              if (String(selectedSeries.id) !== String(flowRef.current?.id)) {
                setFlow(selectedSeries)
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching series:', error)
      } finally {
        setLoading(false)
      }
    },
    [seriesId]
  )

  useEffect(() => {
    // initial load
    fetchSeries()
  }, [fetchSeries])

  // Handle series ID changes after series data is loaded
  useEffect(() => {
    if (seriesId && series.length > 0 && !flow) {
      const selectedSeries = series.find(
        (s) => String(s.id) === String(seriesId)
      )
      if (selectedSeries) {
        setFlow(selectedSeries)
      }
    }
  }, [seriesId, series, flow])

  // Fetch images array for the selected series (prefer images[0] over legacy flow.image)
  useEffect(() => {
    let mounted = true
    const abortController = new AbortController()

    async function fetchImages() {
      if (!flow?.id) {
        if (mounted) setImages([])
        return
      }
      try {
        const res = await fetch(`/api/series/${flow.id}/images`, {
          signal: abortController.signal,
        })
        if (!res.ok) {
          // Silently handle 404 - series may not have images or may not exist
          if (mounted) setImages([])
          return
        }
        const data = await res.json()
        if (mounted) setImages(Array.isArray(data.images) ? data.images : [])
      } catch (e: any) {
        // Ignore aborted requests
        if (e.name === 'AbortError') {
          return
        }
        // Silently handle other errors
        if (mounted) setImages([])
      }
    }
    fetchImages()
    return () => {
      mounted = false
      abortController.abort()
    }
  }, [flow?.id])

  const imageUrl = useMemo(() => {
    if (images && images.length > 0) return images[0]
    return flow?.image || ''
  }, [images, flow?.image])

  function handleSelect(
    event: ChangeEvent<object>,
    value: FlowSeriesData | null
  ) {
    event.preventDefault()
    if (value) {
      setFlow(value)
      setOpen(false)
      setAcOpen(false)
      // Update URL to show the series ID
      router.push(`/navigator/flows/practiceSeries?id=${value.id}`, {
        scroll: false,
      })
    }
  }

  function handleInfoClick() {
    setOpen(!open)
  }

  function handleActivityToggle() {
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
    const asanas: EditAsanaShape[] = (flow.seriesPoses || []).map(
      (entry, idx) => {
        // Handle both string and object formats
        let name = ''
        let secondary = ''
        let alignmentCues = ''

        if (typeof entry === 'string') {
          const split = splitSeriesPoseEntry(entry)
          name = split.name
          secondary = split.secondary
        } else if (entry && typeof entry === 'object') {
          name = (entry as any).sort_english_name || ''
          secondary = (entry as any).secondary || ''
          alignmentCues = (entry as any).alignment_cues || ''
        }

        const resolvedName = name || `asana-${idx}`

        return {
          id: `${idx}-${resolvedName}`,
          name: resolvedName,
          difficulty: secondary,
          alignment_cues: alignmentCues,
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
      // Transform asanas array to seriesPoses format to preserve alignment_cues
      const seriesPoses = updated.asanas.map((asana) => ({
        sort_english_name: asana.name,
        secondary: asana.difficulty,
        alignment_cues: asana.alignment_cues || '',
      }))

      // Send with seriesPoses instead of asanas to preserve alignment_cues
      const payload = {
        ...updated,
        seriesPoses,
      }

      await updateSeries(updated.id, payload as any)
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
      // Force refresh and navigate back to series list to prevent showing stale data
      router.refresh()
      router.replace('/navigator/flows/practiceSeries')
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
      <SplashHeader
        src={'/images/series/series-practice-splash-header.png'}
        alt={'Practice Series'}
        title="Practice Series"
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          marginX: 3,
          mb: '1em',
        }}
      >
        <SubNavHeader
          title="Flows"
          link="/navigator/flows"
          onClick={handleInfoClick}
          sx={{
            width: '100%',
            maxWidth: '384px', // Match SplashHeader width
            alignSelf: 'center',
            mb: 2, // Add bottom margin for spacing
          }}
        />
        <Stack sx={{ px: 4, width: '100%', maxWidth: '600px' }}>
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
            inputValue={searchInputValue}
            onInputChange={(event, newInputValue) => {
              setSearchInputValue(newInputValue)
            }}
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
                  <Fragment key={opt.id ?? `option-${index}`}>
                    {sectionLabel && (
                      <ListSubheader
                        key={`${sectionLabel}-header-${index}`}
                        component="div"
                        disableSticky
                        role="presentation"
                      >
                        {sectionLabel}
                      </ListSubheader>
                    )}
                    <li {...props} key={opt.id ?? `option-${index}`}>
                      {opt.seriesName}
                    </li>
                  </Fragment>
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
              <AutocompleteInput
                params={params}
                placeholder="Search for a Series"
                sx={{ '& .MuiInputBase-input': { color: 'primary.main' } }}
                onClick={() => setAcOpen(true)}
                inputValue={searchInputValue}
                onClear={() => setSearchInputValue('')}
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
          <Box width="100%" sx={{ p: 2, maxWidth: '600px' }} key={flow.id}>
            {/* If editing, render the EditSeriesDialog inline here so the editor replaces the series content */}
            {editOpen ? (
              <EditSeriesDialog
                inline
                open={editOpen}
                onClose={() => setEditOpen(false)}
                series={dialogSeries!}
                onSave={handleEditSave}
                onDelete={handleEditDelete}
              />
            ) : (
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
              >
                {/* Title + optional Edit button for owners */}
                <Box className="journal">
                  <Box className="journalTitleContainer">
                    <Typography
                      variant="h3"
                      textAlign={'center'}
                      sx={{
                        color: `${theme.palette.primary.main}`,
                      }}
                    >
                      {flow.seriesName}
                    </Typography>
                    {isOwner && (
                      <IconButton
                        aria-label="Edit series"
                        onClick={() => setEditOpen(true)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </Box>
                  <SeriesPoseList
                    seriesPoses={flow.seriesPoses}
                    getHref={(poseName) => getPoseNavigationUrlSync(poseName)}
                    linkColor="primary.contrastText"
                    dataTestIdPrefix="practice-series-pose"
                  />
                  {/* Series image (if uploaded) - shown between pose list and description */}
                  {imageUrl ? (
                    <Box sx={{ width: '100%', maxWidth: 600, mt: 2 }}>
                      <Card
                        sx={{
                          position: 'relative',
                          boxShadow: 'none',
                          backgroundColor: 'transparent',
                        }}
                      >
                        <CardMedia
                          component="img"
                          height={300}
                          image={imageUrl}
                          alt={`${flow.seriesName} image`}
                          sx={{ objectFit: 'cover', borderRadius: 2 }}
                        />
                      </Card>
                    </Box>
                  ) : null}
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

                <PoseShareButton
                  content={{
                    contentType: 'series',
                    data: flow,
                  }}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
      <Drawer
        // sx={{ width: '50%' }}
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Typography variant="body1">Pick a Series to practice.</Typography>
      </Drawer>

      {/* Dialog rendering removed to keep editor inline only. */}
    </Box>
  )
}
