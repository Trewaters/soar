'use client'

import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Link,
  Stack,
  Typography,
  ListSubheader,
  IconButton,
  Drawer,
} from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { getPoseNavigationUrlSync } from '@app/utils/navigation/poseNavigation'
import EditIcon from '@mui/icons-material/Edit'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SplashHeader from '@app/clientComponents/splash-header'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import { AutocompleteInput } from '@app/clientComponents/form'
import { SequenceData, getAllSequences } from '@lib/sequenceService'
import { getAllSeries } from '@lib/seriesService'
import React from 'react'
import Image from 'next/image'
import CustomPaginationCircles from '@app/clientComponents/pagination-circles'
import { useSearchParams } from 'next/navigation'
import SequenceActivityTracker from '@app/clientComponents/sequenceActivityTracker/SequenceActivityTracker'
import { FEATURES } from '@app/FEATURES'
import { useSession } from 'next-auth/react'
import getAlphaUserIds from '@app/lib/alphaUsers'
import { orderPosesForSearch } from '@app/utils/search/orderPosesForSearch'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sequenceId = searchParams.get('sequenceId')
  const { data: session } = useSession()
  // const userId = session?.user?.id ?? null // no longer used
  const [sequences, setSequences] = useState<SequenceData[]>([])
  // Centralized ordering: user/alpha-created at top, deduped, then others alphabetical
  const alphaUserIds = getAlphaUserIds()
  const enrichedSequences = React.useMemo(
    () =>
      (sequences || []).map((s) => ({
        ...s,
        createdBy: (s as any).createdBy ?? (s as any).created_by ?? undefined,
      })),
    [sequences]
  )
  // Partition/group using the new utility (user/alpha at top, deduped, then others alpha)
  const currentUserId = session?.user?.id || session?.user?.email || ''
  const userIdentifiers = [session?.user?.id, session?.user?.email].filter(
    Boolean
  ) as string[]
  const orderedSequenceOptions = React.useMemo(() => {
    // Filter sequences to only show those created by current user or alpha users
    const authorizedSequences = enrichedSequences.filter((s) => {
      const createdBy = (s as any).createdBy
      // Allow sequences created by current user or alpha users only
      return (
        (createdBy && userIdentifiers.includes(createdBy)) ||
        (createdBy && alphaUserIds.includes(createdBy))
      )
    })

    if (!FEATURES.PRIORITIZE_USER_ENTRIES_IN_SEARCH) return authorizedSequences

    // Convert id to string for ordering, then map back to SequenceData
    const validSequences = authorizedSequences
      .filter(
        (s) =>
          typeof s.id !== 'undefined' && !!s.nameSequence && !!s.sequencesSeries
      )
      .map((s) => ({ ...s, id: String(s.id) }))
    const allOrdered = orderPosesForSearch(
      validSequences,
      currentUserId,
      alphaUserIds,
      (item) => String(item.nameSequence || '')
    )
    // Partition for section headers: Mine, Alpha (no Others since we filtered them out)
    const mine: typeof allOrdered = []
    const alpha: typeof allOrdered = []
    allOrdered.forEach((item) => {
      const createdBy = (item as any).createdBy
      if (createdBy && userIdentifiers.includes(createdBy)) {
        mine.push(item)
      } else if (createdBy && alphaUserIds.includes(createdBy)) {
        alpha.push(item)
      }
    })
    // Compose with section header markers (no Others section)
    const result: Array<
      (typeof allOrdered)[number] | { section: 'Mine' | 'Alpha' | 'Others' }
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
  }, [enrichedSequences, currentUserId, alphaUserIds, userIdentifiers])
  const [singleSequence, setSingleSequence] = useState<SequenceData>({
    id: 0,
    nameSequence: '',
    sequencesSeries: [],
    description: '',
    duration: '',
    image: '',
    breath_direction: '',
    createdAt: '',
    updatedAt: '',
  })
  const [, setIsLoadingFreshSeriesData] = useState<boolean>(false)
  const [, setRefreshTrigger] = useState(0)

  const [page, setPage] = useState(1)
  const itemsPerPage = 1

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const paginatedData = singleSequence.sequencesSeries.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  useEffect(() => {
    // Consolidated function to fetch sequences
    const fetchSequences = async (debugContext = 'unknown') => {
      try {
        console.log(`Fetching sequences from ${debugContext}`)
        const newSequences = await getAllSequences()
        console.log(
          `Successfully fetched ${newSequences.length} sequences from ${debugContext}`
        )
        setSequences(newSequences)

        // If there's a sequence ID in the URL, auto-select that sequence
        if (sequenceId && newSequences.length > 0) {
          const selectedSequence = newSequences.find(
            (s) => s.id?.toString() === sequenceId
          )
          if (selectedSequence) {
            setSingleSequence(selectedSequence)
          }
        }
      } catch (error) {
        console.error(`Error fetching sequences from ${debugContext}:`, error)
      }
    }

    fetchSequences('initial load')

    const handleFocus = () => {
      console.log('Practice sequences page focused, refreshing sequences...')
      fetchSequences('focus')
    }

    window.addEventListener('focus', handleFocus)

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, refetch data
        fetchSequences('visibility change')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    const handlePopState = () => {
      console.log('Navigation detected, refreshing pose data...')
      fetchSequences('popstate')
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [sequenceId]) // Add sequenceId as dependency

  // Fetch fresh series data to ensure sequences show current series content
  useEffect(() => {
    const refreshSeriesData = async () => {
      if (
        !singleSequence ||
        !singleSequence.sequencesSeries ||
        singleSequence.sequencesSeries.length === 0 ||
        singleSequence.id === 0
      ) {
        return
      }

      setIsLoadingFreshSeriesData(true)
      try {
        // Get all current series data from the database
        const allSeries = await getAllSeries()

        // For each series in the sequence, find the matching current series data
        const refreshedSeriesData = singleSequence.sequencesSeries.map(
          (sequenceSeries: any) => {
            // Find the matching series by name (series names should be unique)
            const currentSeriesData = allSeries.find(
              (dbSeries) => dbSeries.seriesName === sequenceSeries.seriesName
            )

            if (currentSeriesData) {
              // Use current series data from database
              return {
                ...sequenceSeries, // Keep sequence-specific fields like id
                seriesName: currentSeriesData.seriesName,
                seriesPoses: currentSeriesData.seriesPoses,
                description: currentSeriesData.description,
                duration: currentSeriesData.duration,
                image: currentSeriesData.image,
                // Add timestamp to track freshness
                lastRefreshed: new Date().toISOString(),
              }
            } else {
              // If series no longer exists, keep original data but mark as stale
              console.warn(
                `Series "${sequenceSeries.seriesName}" not found in current database`
              )
              return {
                ...sequenceSeries,
                isStale: true,
              }
            }
          }
        )

        // Update the singleSequence with fresh series data
        setSingleSequence((prevSequence) => ({
          ...prevSequence,
          sequencesSeries: refreshedSeriesData,
        }))
      } catch (error) {
        console.error(
          'Failed to fetch fresh series data for practice sequences:',
          error
        )
        // On error, keep using original sequence data (no action needed)
      } finally {
        setIsLoadingFreshSeriesData(false)
      }
    }

    refreshSeriesData()
  }, [singleSequence]) // Only re-run when sequence ID changes

  // Helper function to resolve series ID and navigate
  const handleSeriesNavigation = async (seriesMini: any) => {
    try {
      console.log('=== PRACTICE SEQUENCES - SERIES NAVIGATION DEBUG ===')
      console.log('Series data from sequence:', seriesMini)
      console.log('Series ID (likely pagination ID):', seriesMini.id)
      console.log('Series name to resolve:', seriesMini.seriesName)

      if (!seriesMini.seriesName) {
        console.error('No series name available for resolution')
        alert('Cannot navigate: Series name is missing')
        return
      }

      console.log('Fetching all series to find match...')
      const allSeries = await getAllSeries()
      console.log(`Found ${allSeries.length} total series in database`)

      // Try to find matching series by name
      const matchingSeries = allSeries.find(
        (series) =>
          series.seriesName === seriesMini.seriesName ||
          series.seriesName.toLowerCase() ===
            seriesMini.seriesName.toLowerCase() ||
          series.seriesName.trim().toLowerCase() ===
            seriesMini.seriesName.trim().toLowerCase()
      )

      if (matchingSeries?.id) {
        console.log('✅ SUCCESS: Found matching series!')
        console.log('Series name:', matchingSeries.seriesName)
        console.log('MongoDB ObjectId:', matchingSeries.id)
        router.push(`/navigator/flows/practiceSeries?id=${matchingSeries.id}`)
      } else {
        console.error('❌ FAILED: Could not resolve series by name')
        console.error('Looking for series name:', seriesMini.seriesName)
        console.error(
          'Available series names:',
          allSeries.map((s) => s.seriesName)
        )
        alert(`Cannot find series named "${seriesMini.seriesName}"`)
      }
    } catch (error) {
      console.error('❌ ERROR during series resolution:', error)
      alert(
        `Error loading series: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    } finally {
      console.log('=== END PRACTICE SEQUENCES - SERIES NAVIGATION DEBUG ===')
    }
  }

  // Resolve asana IDs for navigation
  function handleSelect(
    event: ChangeEvent<object>,
    value: SequenceData | null
  ) {
    // Logs the type of event (e.g., 'click')
    // Logs the element that triggered the event
    event.preventDefault()
    if (value) {
      // Restore original behavior: select sequence locally for practice UI
      setSingleSequence(value)
    }
  }

  function handleActivityToggle(isTracked: boolean) {
    console.log('Sequence activity tracked:', isTracked)
    // Trigger refresh of any activity components that might be listening
    setRefreshTrigger((prev) => prev + 1)
  }

  const [open, setOpen] = useState(false)
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '100vw',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <SplashHeader
          src={'/icons/designImages/header-practice-sequence.png'}
          alt={'Practice Sequences'}
          title="Practice Sequences"
        />
        <Stack
          spacing={2}
          sx={{
            mb: '1em',
            width: '100%',
            maxWidth: '600px',
            alignItems: 'center',
            alignSelf: 'center',
          }}
        >
          <SubNavHeader
            title="Flows"
            link="/navigator/flows"
            onClick={() => setOpen(!open)}
            sx={{
              width: '100%',
              maxWidth: '600px',
              alignSelf: 'center',
              mb: 2,
            }}
          />
          <Stack
            sx={{
              px: 4,
              width: '100%',
              maxWidth: '600px',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'flex-start',
                width: '100%',
                maxWidth: '600px',
              }}
            >
              <Autocomplete
                key={`autocomplete-${orderedSequenceOptions.length}-${orderedSequenceOptions.map((s: any) => s.id ?? s.section).join('-')}`}
                disablePortal
                id="combo-box-sequence-search"
                options={orderedSequenceOptions}
                getOptionLabel={(option) => {
                  if ('section' in option) return ''
                  return option.nameSequence
                }}
                // Section headers logic
                renderOption={(() => {
                  let lastSection: string | null = null
                  const sectionHeaderMap: Record<number, string> = {}
                  orderedSequenceOptions.forEach((opt, idx) => {
                    if ('section' in opt) {
                      lastSection = opt.section
                    } else if (lastSection) {
                      sectionHeaderMap[idx] = lastSection
                      lastSection = null
                    }
                  })
                  const renderOptionFn = (
                    props: React.HTMLAttributes<HTMLLIElement>,
                    option: any,
                    { index }: { index: number }
                  ) => {
                    if ('section' in option) return null

                    const sectionLabel = sectionHeaderMap[index] || null

                    // Use props directly; avoid extracting 'key' which is unused
                    const otherProps = props as any

                    return (
                      <React.Fragment key={option.id ?? `option-${index}`}>
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
                        <li
                          key={option.id ?? `option-${index}`}
                          {...otherProps}
                        >
                          {option.nameSequence}
                        </li>
                      </React.Fragment>
                    )
                  }
                  renderOptionFn.displayName =
                    'SequenceAutocompleteRenderOption'
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
                      if (
                        opt.nameSequence &&
                        opt.nameSequence
                          .toLowerCase()
                          .includes(state.inputValue.toLowerCase())
                      ) {
                        groups[currentSection].push(opt)
                      }
                    }
                  }
                  // Flatten back to options array, inserting section header if group has any items
                  const filtered: typeof options = []
                  const sectionOrder: Array<'Mine' | 'Alpha'> = [
                    'Mine',
                    'Alpha',
                  ]
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
                  width: '100%',
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
                    placeholder="Search for a Sequence"
                    sx={{ '& .MuiInputBase-input': { color: 'primary.main' } }}
                  />
                )}
                onChange={(event, value) => {
                  const val = value as any
                  if (val && 'section' in val) return
                  handleSelect(event as any, value as SequenceData | null)
                }}
              />
            </Box>

            <React.Fragment key={singleSequence.id}>
              <Box
                sx={{
                  mt: 4,
                }}
              >
                <Typography
                  variant="body1"
                  component="h3"
                  textAlign="center"
                  sx={{
                    backgroundColor: 'primary.main',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px',
                    width: '100%',
                    maxWidth: '600px',
                    alignSelf: 'center',
                    pr: 7,
                    pl: 2,
                    fontWeight: 'bold',
                  }}
                >
                  {singleSequence.nameSequence}
                </Typography>
                {singleSequence?.id ? (
                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: '600px',
                      alignSelf: 'center',
                      mt: 1,
                    }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => {
                        const editUrl = `/navigator/sequences/${singleSequence.id}?edit=true`
                        router.push(editUrl)
                      }}
                      aria-label={`Edit ${singleSequence.nameSequence}`}
                      sx={{ minWidth: 0, p: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                ) : null}
              </Box>
              {singleSequence?.id ? (
                <Stack rowGap={3} alignItems="center">
                  {paginatedData.map((seriesMini, i) => (
                    <Card
                      key={i}
                      sx={{
                        width: '100%',
                        maxWidth: '600px',
                        boxShadow: 3,
                        textAlign: 'center',
                        borderColor: 'primary.main',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                      }}
                      className="journal"
                    >
                      <CardHeader
                        className="journalTitle"
                        title={
                          <Box width={'100%'}>
                            <Stack
                              flexDirection={'row'}
                              justifyContent={'space-between'}
                              alignItems={'center'}
                              sx={{ mb: 1 }}
                            >
                              <Button
                                disableRipple
                                onClick={() =>
                                  setPage((prev) => Math.max(prev - 1, 1))
                                }
                                disabled={page === 1}
                                startIcon={<ChevronLeftIcon />}
                                sx={{
                                  fontSize: '0.875rem',
                                  '&:hover': {
                                    backgroundColor: 'transparent',
                                    boxShadow: 'none',
                                  },
                                  '&.Mui-disabled': {
                                    opacity: 0.3,
                                  },
                                }}
                              >
                                {singleSequence.sequencesSeries[page - 2]
                                  ?.seriesName || 'Previous'}
                              </Button>

                              <Button
                                disableRipple
                                onClick={() =>
                                  setPage((prev) =>
                                    Math.min(
                                      prev + 1,
                                      Math.ceil(
                                        singleSequence.sequencesSeries.length /
                                          itemsPerPage
                                      )
                                    )
                                  )
                                }
                                disabled={
                                  page ===
                                  Math.ceil(
                                    singleSequence.sequencesSeries.length /
                                      itemsPerPage
                                  )
                                }
                                endIcon={<ChevronRightIcon />}
                                sx={{
                                  fontSize: '0.875rem',
                                  '&:hover': {
                                    backgroundColor: 'transparent',
                                    boxShadow: 'none',
                                  },
                                  '&.Mui-disabled': {
                                    opacity: 0.3,
                                  },
                                }}
                              >
                                {singleSequence.sequencesSeries[page]
                                  ?.seriesName || 'Next'}
                              </Button>
                            </Stack>
                            <Stack>
                              <Typography
                                variant="h6"
                                onClick={() =>
                                  handleSeriesNavigation(seriesMini)
                                }
                                sx={{
                                  color: 'primary.main',
                                  cursor: 'pointer',
                                  '&:hover': {
                                    textDecoration: 'underline',
                                  },
                                }}
                              >
                                {seriesMini.seriesName}
                              </Typography>
                            </Stack>
                          </Box>
                        }
                      />
                      <CardContent className="lines" sx={{ p: 0 }}>
                        {seriesMini.seriesPoses?.map((asana, asanaIndex) => {
                          // asana may be a legacy string reference or an object with metadata
                          let poseName = ''
                          let href = '#'
                          let alignmentCues = ''

                          if (typeof asana === 'string') {
                            poseName = asana.split(';')[0]
                            href = getPoseNavigationUrlSync(asana)
                          } else {
                            poseName = (asana as any).sort_english_name || ''
                            alignmentCues = (asana as any).alignment_cues || ''
                            // Prefer poseId if available, otherwise use the name
                            const poseRef = String(
                              (asana as any).poseId ?? poseName
                            )
                            href = getPoseNavigationUrlSync(poseRef)
                          }

                          // Extract first line of alignment cue for inline display
                          const alignmentCuesInline = alignmentCues
                            ? String(alignmentCues).split('\n')[0]
                            : ''

                          return (
                            <Box
                              key={asanaIndex}
                              alignItems={'center'}
                              display={'flex'}
                              flexDirection={'row'}
                              flexWrap={'nowrap'}
                              className="journalLine"
                              sx={{
                                maxWidth: '100%',
                                width: '100%',
                                minWidth: 'unset',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                gap: 2,
                              }}
                            >
                              <Typography
                                variant="body1"
                                fontWeight="bold"
                                sx={{
                                  width: '35px',
                                  textAlign: 'right',
                                  flexShrink: 0,
                                  lineHeight: 1.5,
                                }}
                              >
                                {asanaIndex + 1}.
                              </Typography>
                              <Typography
                                textAlign={'left'}
                                variant="body1"
                                sx={{
                                  flex: '1 1 auto',
                                  minWidth: 0,
                                  lineHeight: 1.5,
                                  display: 'flex',
                                  alignItems: 'baseline',
                                  gap: 1,
                                  flexWrap: 'wrap',
                                }}
                              >
                                <Link
                                  underline="hover"
                                  color="primary.contrastText"
                                  href={href}
                                  sx={{
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    hyphens: 'auto',
                                    display: 'inline',
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {poseName}
                                </Link>
                                {alignmentCuesInline && (
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      fontStyle: 'normal',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      maxWidth: '60%',
                                    }}
                                  >
                                    ({alignmentCuesInline})
                                  </Typography>
                                )}
                              </Typography>
                            </Box>
                          )
                        })}
                      </CardContent>
                    </Card>
                  ))}

                  {/* Navigation with pagination circles */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      mt: 2,
                      width: '100%',
                      maxWidth: '600px',
                    }}
                  >
                    <CustomPaginationCircles
                      count={Math.ceil(
                        singleSequence.sequencesSeries.length / itemsPerPage
                      )}
                      page={page}
                      onChange={handleChange}
                    />
                  </Box>

                  {/* Sequence Image */}
                  {singleSequence.image && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        px: 2,
                        mt: 2,
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          width: { xs: '100%', sm: '400px' },
                          height: 200,
                          borderRadius: 2,
                          overflow: 'hidden',
                          boxShadow: 3,
                        }}
                      >
                        <Image
                          src={singleSequence.image}
                          alt={singleSequence.nameSequence || 'Sequence image'}
                          fill
                          sizes="(max-width: 600px) 100vw, 400px"
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                    </Box>
                  )}

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
                        src={'/icons/flows/leaf-3.svg'}
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
                      {singleSequence.description}
                    </Typography>
                  </Box>

                  {/* Sequence Activity Tracker */}
                  {singleSequence.id && singleSequence.id !== 0 && (
                    <Box sx={{ mt: 3 }}>
                      <SequenceActivityTracker
                        sequenceId={singleSequence.id.toString()}
                        sequenceName={singleSequence.nameSequence}
                        onActivityToggle={handleActivityToggle}
                      />
                    </Box>
                  )}
                </Stack>
              ) : null}
            </React.Fragment>
          </Stack>
        </Stack>
      </Box>

      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            maxWidth: '100vw',
          },
        }}
        disablePortal={false}
        disableScrollLock={true}
      >
        <Typography variant="body1" sx={{ p: 2 }}>
          Browse and practice yoga sequences. Use the search to find specific
          sequences or scroll through the collection. Select a sequence to view
          details and track your practice progress.
        </Typography>
      </Drawer>
    </>
  )
}
