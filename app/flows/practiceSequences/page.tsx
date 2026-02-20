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
} from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'

import { getPoseNavigationUrlSync } from '@app/utils/navigation/poseNavigation'
import EditIcon from '@mui/icons-material/Edit'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ViewStreamIcon from '@mui/icons-material/ViewStream'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import CloseIcon from '@mui/icons-material/Close'
import SplashHeader from '@app/clientComponents/splash-header'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import HelpButton from '@app/clientComponents/HelpButton'
import HelpDrawer from '@app/clientComponents/HelpDrawer'
import { HELP_PATHS } from '@app/utils/helpLoader'
import { AutocompleteInput } from '@app/clientComponents/form'
import { SequenceData, getAllSequences } from '@lib/sequenceService'
import { getAllSeries } from '@lib/seriesService'
import React from 'react'
import Image from 'next/image'
import CustomPaginationCircles from '@app/clientComponents/pagination-circles'
import { useSearchParams } from 'next/navigation'
import NAV_PATHS from '@app/utils/navigation/constants'
import ActivityTracker from '@app/clientComponents/ActivityTracker'
import {
  checkSequenceActivityExists,
  createSequenceActivity,
  deleteSequenceActivity,
} from '@lib/sequenceActivityClientService'
import WeeklyActivityViewer from '@app/clientComponents/WeeklyActivityViewer'
import { useSession } from 'next-auth/react'
import { useIsAdmin } from '@app/hooks/useCanEditContent'
import getAlphaUserIds from '@app/lib/alphaUsers'
import { orderPosesForSearch } from '@app/utils/search/orderPosesForSearch'

export default function Page() {
  const router = useNavigationWithLoading()
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
    durationSequence: '',
    image: '',
    createdAt: '',
    updatedAt: '',
  })

  // Determine if current user owns the selected sequence or is admin
  const isAdmin = useIsAdmin()
  const isSequenceOwner = React.useMemo(() => {
    if (!singleSequence || !session?.user?.email) return false
    // createdBy added by API normalization
    return (singleSequence as any).createdBy === session.user.email || isAdmin
  }, [singleSequence, session?.user?.email, isAdmin])

  const [, setIsLoadingFreshSeriesData] = useState<boolean>(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [searchInputValue, setSearchInputValue] = useState('')
  const [sequenceNotFoundError, setSequenceNotFoundError] = useState<
    string | null
  >(null)

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
        const newSequences = await getAllSequences()
        setSequences(newSequences)
        setSequenceNotFoundError(null)

        // If there's a sequence ID in the URL, auto-select that sequence
        if (sequenceId && newSequences.length > 0) {
          const selectedSequence = newSequences.find(
            (s) => s.id?.toString() === sequenceId
          )
          if (selectedSequence) {
            setSingleSequence(selectedSequence)
            setSequenceNotFoundError(null)
          } else {
            // Sequence ID in URL doesn't exist
            setSingleSequence({
              id: 0,
              nameSequence: '',
              sequencesSeries: [],
              description: '',
              durationSequence: '',
              image: '',
              createdAt: '',
              updatedAt: '',
            })
            setSequenceNotFoundError(
              `The yoga sequence you were looking for is no longer available. It may have been deleted or the link is invalid.`
            )
          }
        }
      } catch (error) {
        console.error(`Error fetching sequences from ${debugContext}:`, error)
        if (sequenceId) {
          setSequenceNotFoundError(
            'Failed to load the requested sequence. Please try again.'
          )
        }
      }
    }

    fetchSequences('initial load')

    const handleFocus = () => {
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

        // Only update state if refreshed data is meaningfully different to avoid loops
        try {
          const prev = JSON.stringify(singleSequence.sequencesSeries || [])
          const next = JSON.stringify(refreshedSeriesData || [])
          if (prev !== next) {
            setSingleSequence((prevSequence) => ({
              ...prevSequence,
              sequencesSeries: refreshedSeriesData,
            }))
          }
        } catch (e) {
          // Fallback: if serialization fails, still update once
          setSingleSequence((prevSequence) => ({
            ...prevSequence,
            sequencesSeries: refreshedSeriesData,
          }))
        }
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
      if (!seriesMini.seriesName) {
        console.error('No series name available for resolution')
        alert('Cannot navigate: Series name is missing')
        return
      }

      const allSeries = await getAllSeries()

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
        router.push(
          `${NAV_PATHS.FLOWS_PRACTICE_SERIES}?id=${matchingSeries.id}`
        )
        return
      }

      const tryNormalize = (s: string) =>
        decodeURIComponent(String(s || ''))
          .trim()
          .toLowerCase()
          .replace(/\s+/g, ' ')

      const targetNorm = tryNormalize(seriesMini.seriesName)

      const fuzzyMatch = allSeries.find((series) => {
        const nameNorm = tryNormalize(series.seriesName)
        return (
          nameNorm === targetNorm ||
          nameNorm.includes(targetNorm) ||
          targetNorm.includes(nameNorm) ||
          nameNorm.startsWith(targetNorm) ||
          targetNorm.startsWith(nameNorm)
        )
      })

      if (fuzzyMatch?.id) {
        router.push(`${NAV_PATHS.FLOWS_PRACTICE_SERIES}?id=${fuzzyMatch.id}`)
        return
      }

      const maybeId = String(seriesMini.id || '')
      if (/^[0-9a-fA-F]{24}$/.test(maybeId)) {
        router.push(`${NAV_PATHS.FLOWS_PRACTICE_SERIES}?id=${maybeId}`)
        return
      }

      console.error('❌ FAILED: Could not resolve series by name')
      console.error('Looking for series name:', seriesMini.seriesName)
      console.error(
        'Available series names:',
        allSeries.map((s) => s.seriesName)
      )
      // Final fallback: navigate to series list with a helpful missing hint
      router.push(
        `${NAV_PATHS.FLOWS_PRACTICE_SERIES}?missing=series&name=${encodeURIComponent(
          seriesMini.seriesName
        )}`
      )
    } catch (error) {
      console.error('❌ ERROR during series resolution:', error)
      alert(
        `Error loading series: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
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
      // Update the url to include the sequenceId as a search param so the page
      // can be linked to directly. Use replace to avoid creating history entries
      // for each selection.
      try {
        const sid = String(value.id)
        router.replace(
          `/flows/practiceSequences?sequenceId=${encodeURIComponent(sid)}`
        )
      } catch (e) {
        // ignore router errors in client-side navigation
        console.error('Failed to update sequenceId in URL', e)
      }
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
        {!sequenceId && (
          <SplashHeader
            src={'/icons/designImages/header-practice-sequence.png'}
            alt={'Practice Sequences'}
            title="Practice Sequences"
          />
        )}
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
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              width: '87%',
              maxWidth: '384px',
              alignSelf: 'center',
            }}
          >
            <SubNavHeader mode="back" link="/sequences" />
            <HelpButton onClick={() => setOpen(!open)} />
          </Stack>
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
                inputValue={searchInputValue}
                onInputChange={(event, newInputValue) => {
                  setSearchInputValue(newInputValue)
                }}
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

                    // Extract key from props to avoid spreading it into JSX
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
                    const { key, ...otherProps } = props as any

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
                    inputValue={searchInputValue}
                    onClear={() => setSearchInputValue('')}
                  />
                )}
                onChange={(event, value) => {
                  const val = value as any
                  if (val && 'section' in val) return
                  handleSelect(event as any, value as SequenceData | null)
                }}
              />
            </Box>

            {/* Display error message if the requested sequence is not available */}
            {sequenceNotFoundError && (
              <Box
                sx={{
                  width: '100%',
                  maxWidth: '600px',
                  p: 3,
                  mt: 2,
                  backgroundColor: 'error.light',
                  border: '1px solid',
                  borderColor: 'error.main',
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h5" sx={{ color: 'error.dark', mb: 1 }}>
                  Sequence Not Available
                </Typography>
                <Typography variant="body2" sx={{ color: 'error.dark', mb: 2 }}>
                  {sequenceNotFoundError}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setSequenceNotFoundError(null)
                    router.push('/flows/practiceSequences')
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  Clear and Browse Sequences
                </Button>
              </Box>
            )}

            <React.Fragment key={singleSequence.id}>
              {/* Only show sequence content when a sequence is selected.
                  This covers two cases used in tests:
                  - A sequenceId is present in the URL (even '0')
                  - Or a non-zero singleSequence.id has been selected locally
              */}
              {sequenceId !== null ||
              (!!singleSequence?.id && singleSequence.id !== 0) ? (
                <Box
                  sx={{
                    mt: 4,
                    width: '100%',
                    maxWidth: '600px',
                    alignSelf: 'center',
                  }}
                >
                  {/* Sequence title with inline edit icon to the right */}
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      gap: 2,
                      px: 6,
                    }}
                  >
                    {/* Title block - orange tab widened and includes edit icon */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        backgroundColor: 'primary.main',
                        borderTopLeftRadius: '12px',
                        borderTopRightRadius: '12px',
                        minWidth: { xs: '80%', sm: 240 },
                        maxWidth: '85%',
                        px: 2,
                        py: 0.75,
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          color: 'primary.contrastText',
                          fontWeight: 'bold',
                          textAlign: 'left',
                        }}
                      >
                        {singleSequence.nameSequence}
                      </Typography>

                      {/* Inline edit icon inside the orange tab on the right - only show for owners */}
                      {isSequenceOwner && (
                        <IconButton
                          onClick={() => {
                            try {
                              const editUrl = `/sequences/${singleSequence.id}?edit=true`
                              const viewUrl = `/sequences/${singleSequence.id}`
                              const isEditing =
                                typeof window !== 'undefined' &&
                                window.location.search.includes('edit=true') &&
                                window.location.pathname.includes(
                                  `/sequences/${singleSequence.id}`
                                )

                              if (isEditing) {
                                router.replace(viewUrl)
                              } else {
                                // Use replace so toggling doesn't create many history entries
                                router.replace(editUrl)
                              }
                            } catch (e) {
                              // ignore navigation errors
                            }
                          }}
                          aria-label={`Edit ${singleSequence.nameSequence}`}
                          sx={{
                            ml: 'auto',
                            color: 'primary.contrastText',
                            p: 0.5,
                          }}
                          title="Edit Sequence"
                          size="small"
                        >
                          {typeof window !== 'undefined' &&
                          window.location.search.includes('edit=true') &&
                          window.location.pathname.includes(
                            `/sequences/${singleSequence.id}`
                          ) ? (
                            <CloseIcon fontSize="small" />
                          ) : (
                            <EditIcon fontSize="small" />
                          )}
                        </IconButton>
                      )}
                    </Box>

                    {/* Action buttons: View toggle, Edit */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      {/* View toggle icons */}
                      <IconButton
                        onClick={() => {
                          router.push(`/sequences/${singleSequence.id}`)
                        }}
                        aria-label={`Switch to list view for ${singleSequence.nameSequence}`}
                        sx={{
                          color: 'grey.500',
                          p: 1,
                          minWidth: 0,
                        }}
                        title="List View"
                      >
                        <FormatListBulletedIcon />
                      </IconButton>

                      <IconButton
                        aria-label="Currently in scroll view"
                        sx={{
                          color: 'primary.main',
                          p: 1,
                          minWidth: 0,
                          pointerEvents: 'none',
                        }}
                        title="Scroll View (current)"
                      >
                        <ViewStreamIcon />
                      </IconButton>

                      {/* Edit icon moved into the title tab */}
                    </Box>
                  </Box>
                </Box>
              ) : null}
              {sequenceId !== null ||
              (!!singleSequence?.id && singleSequence.id !== 0) ? (
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
                                {(
                                  singleSequence.sequencesSeries[
                                    page - 2
                                  ] as any
                                )?.seriesName || 'Previous'}
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
                                {(singleSequence.sequencesSeries[page] as any)
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
                                      display: 'block',
                                      mt: 0.5,
                                      whiteSpace: 'normal',
                                      overflowWrap: 'break-word',
                                      wordBreak: 'break-word',
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
                          width: { xs: '100%', sm: '400px' },
                          maxHeight: '400px',
                          borderRadius: 2,
                          overflow: 'hidden',
                          boxShadow: 3,
                          '& img': {
                            width: '100%',
                            height: 'auto',
                            maxHeight: '400px',
                            objectFit: 'contain',
                          },
                        }}
                      >
                        <Image
                          src={singleSequence.image}
                          alt={singleSequence.nameSequence || 'Sequence image'}
                          width={400}
                          height={400}
                          sizes="(max-width: 600px) 100vw, 400px"
                          style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '400px',
                            objectFit: 'contain',
                          }}
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
                      <ActivityTracker
                        entityId={singleSequence.id.toString()}
                        entityName={singleSequence.nameSequence}
                        entityType="sequence"
                        variant="card"
                        checkActivity={checkSequenceActivityExists}
                        createActivity={createSequenceActivity}
                        deleteActivity={deleteSequenceActivity}
                        onActivityToggle={handleActivityToggle}
                      />
                    </Box>
                  )}

                  {singleSequence.id && singleSequence.id !== 0 && (
                    <Box sx={{ mt: 3 }}>
                      <WeeklyActivityViewer
                        entityId={singleSequence.id.toString()}
                        entityName={singleSequence.nameSequence}
                        entityType="sequence"
                        variant="detailed"
                        refreshTrigger={refreshTrigger}
                      />
                    </Box>
                  )}
                </Stack>
              ) : null}
            </React.Fragment>
          </Stack>
        </Stack>
      </Box>

      <HelpDrawer
        content={HELP_PATHS.sequences.practiceSequences}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
