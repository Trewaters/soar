'use client'

import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import GroupedDataAssetSearch from '@app/clientComponents/GroupedDataAssetSearch'

import { getPoseNavigationUrlSync } from '@app/utils/navigation/poseNavigation'
import { normalizeSeriesPoses } from '@app/utils/asana/normalizeSeriesPoses'
import SequenceFlowCard from '@app/clientComponents/SequenceFlowCard'
import SequenceViewWithEdit from '@app/clientComponents/SequenceViewWithEdit'
import type { EditableSequence } from '@app/clientComponents/EditSequence'
import EditIcon from '@mui/icons-material/Edit'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ViewStreamIcon from '@mui/icons-material/ViewStream'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SplashHeader from '@app/clientComponents/splash-header'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import HelpButton from '@app/clientComponents/HelpButton'
import HelpDrawer from '@app/clientComponents/HelpDrawer'
import { HELP_PATHS } from '@app/utils/helpLoader'
import { SequenceData, getAllSequences } from '@lib/sequenceService'
import { getAllSeries } from '@lib/seriesService'
import React from 'react'
import CustomPaginationCircles from '@app/clientComponents/pagination-circles'
import { useSearchParams } from 'next/navigation'
import NAV_PATHS from '@app/utils/navigation/constants'
import ImageCarousel from '@app/clientComponents/imageUpload/ImageCarousel'
import ActivityTracker from '@app/clientComponents/ActivityTracker'
import {
  checkSequenceActivityExists,
  createSequenceActivity,
  deleteSequenceActivity,
} from '@lib/sequenceActivityClientService'
import WeeklyActivityViewer from '@app/clientComponents/WeeklyActivityViewer'
import { useSession } from 'next-auth/react'
import { useIsAdmin } from '@app/hooks/useCanEditContent'
import { PoseImageData } from 'types/images'

export default function Page() {
  const router = useNavigationWithLoading()
  const searchParams = useSearchParams()
  const sequenceId = searchParams.get('id') ?? searchParams.get('sequenceId')
  const editMode = searchParams.get('edit') === 'true'
  const { data: session } = useSession()
  // const userId = session?.user?.id ?? null // no longer used
  const [sequences, setSequences] = useState<SequenceData[]>([])
  // Centralized ordering: user/alpha-created at top, deduped, then others alphabetical
  const enrichedSequences = React.useMemo(
    () =>
      (sequences || []).map((s) => ({
        ...s,
        createdBy: (s as any).createdBy ?? (s as any).created_by ?? undefined,
      })),
    [sequences]
  )
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

  const emptySequence: SequenceData = React.useMemo(
    () => ({
      id: 0,
      nameSequence: '',
      sequencesSeries: [],
      description: '',
      durationSequence: '',
      image: '',
      createdAt: '',
      updatedAt: '',
    }),
    []
  )

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

  const [viewMode, setViewMode] = useState<'scroll' | 'list'>('scroll')
  const [page, setPage] = useState(1)
  const itemsPerPage = 1

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const paginatedData = singleSequence.sequencesSeries.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )
  const isSequencePendingLoad =
    sequenceId !== null &&
    singleSequence.id === 0 &&
    !sequenceNotFoundError &&
    !searchInputValue

  useEffect(() => {
    // Consolidated function to fetch sequences
    const fetchSequences = async (debugContext = 'unknown') => {
      try {
        const newSequences = await getAllSequences()
        setSequences(newSequences)
        setSequenceNotFoundError(null)

        // If there's a sequence ID in the URL, auto-select that sequence
        if (sequenceId) {
          const selectedSequence = newSequences.find(
            (s) => s.id?.toString() === sequenceId
          )
          if (selectedSequence) {
            setSingleSequence(selectedSequence)
            setSequenceNotFoundError(null)
          } else {
            // Sequence ID in URL doesn't exist (or list is empty)
            setSingleSequence(emptySequence)
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
  }, [sequenceId, editMode, emptySequence]) // Re-fetch when editMode changes so view is fresh after edit

  // When URL no longer has an id, ensure selected sequence state is reset.
  useEffect(() => {
    if (!sequenceId) {
      setSingleSequence(emptySequence)
      setPage(1)
      setViewMode('scroll')
      setSequenceNotFoundError(null)
    }
  }, [sequenceId, emptySequence])

  // Fetch fresh flow data to ensure sequences show current flow content
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
        // Get all current flow data from the database
        const allSeries = await getAllSeries()

        // For each flow in the sequence, find the matching current flow data
        const refreshedSeriesData = singleSequence.sequencesSeries.map(
          (sequenceSeries: any) => {
            // Match by ID only
            const currentSeriesData = allSeries.find(
              (dbSeries) =>
                dbSeries.id &&
                sequenceSeries.id &&
                String(dbSeries.id) === String(sequenceSeries.id)
            )

            if (currentSeriesData) {
              // Use current flow data from database
              return {
                ...sequenceSeries, // Keep sequence-specific fields like id
                seriesName: currentSeriesData.seriesName,
                seriesPoses: currentSeriesData.seriesPoses,
                description: currentSeriesData.description,
                duration: currentSeriesData.duration,
                image: currentSeriesData.image,
              }
            } else {
              // If flow no longer exists, keep original data but mark as stale
              console.warn(
                `Flow "${sequenceSeries.seriesName}" not found in current database`
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
          'Failed to fetch fresh flow data for practice sequences:',
          error
        )
        // On error, keep using original sequence data (no action needed)
      } finally {
        setIsLoadingFreshSeriesData(false)
      }
    }

    refreshSeriesData()
  }, [singleSequence]) // Only re-run when sequence ID changes

  // Helper function to resolve flow ID and navigate
  const handleSeriesNavigation = async (seriesMini: any) => {
    try {
      if (!seriesMini.seriesName) {
        console.error('No flow name available for resolution')
        alert('Cannot navigate: Flow name is missing')
        return
      }

      const allSeries = await getAllSeries()

      // Try to find matching flow by name
      const matchingSeries = allSeries.find(
        (flow) =>
          flow.seriesName === seriesMini.seriesName ||
          flow.seriesName.toLowerCase() ===
            seriesMini.seriesName.toLowerCase() ||
          flow.seriesName.trim().toLowerCase() ===
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

      const fuzzyMatch = allSeries.find((flow) => {
        const nameNorm = tryNormalize(flow.seriesName)
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

      console.error('❌ FAILED: Could not resolve flow by name')
      console.error('Looking for flow name:', seriesMini.seriesName)
      console.error(
        'Available flow names:',
        allSeries.map((s) => s.seriesName)
      )
      // Final fallback: navigate to flow list with a helpful missing hint
      router.push(
        `${NAV_PATHS.FLOWS_PRACTICE_SERIES}?missing=series&name=${encodeURIComponent(
          seriesMini.seriesName
        )}`
      )
    } catch (error) {
      console.error('❌ ERROR during flow resolution:', error)
      alert(
        `Error loading flow: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  // Resolve asana IDs for navigation
  function handleSelect(value: SequenceData | null) {
    if (value) {
      // Match other data assets: select in-page and keep detail below search.
      try {
        const sid = String(value.id)
        setSingleSequence(value)
        setSequenceNotFoundError(null)
        setPage(1)
        setOpen(false)

        router.push(
          `/sequences/practiceSequences?id=${encodeURIComponent(sid)}`,
          undefined,
          { scroll: false }
        )
      } catch (e) {
        // ignore router errors in client-side navigation
        console.error('Failed to navigate to selected sequence', e)
      }
    }
  }

  function handleActivityToggle() {
    // Trigger refresh of any activity components that might be listening
    setRefreshTrigger((prev) => prev + 1)
  }

  const [open, setOpen] = useState(false)

  // Edit mode: bypass page chrome and render SequenceViewWithEdit directly.
  // This matches the original /sequences/[id]?edit=true design pattern — a clean
  // full-page edit view without the search bar and splash header overhead.
  if (editMode) {
    if (singleSequence.id !== 0) {
      return (
        <Box sx={{ p: 2 }}>
          <SequenceViewWithEdit
            sequence={
              {
                id: singleSequence.id,
                nameSequence: singleSequence.nameSequence,
                sequencesSeries: singleSequence.sequencesSeries ?? [],
                description: singleSequence.description ?? undefined,
                image: singleSequence.image ?? undefined,
                created_by: (singleSequence as any).createdBy ?? null,
              } as EditableSequence
            }
            defaultShowEdit={true}
          />
        </Box>
      )
    }
    // Sequence not yet loaded — show a spinner
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

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
              <GroupedDataAssetSearch<SequenceData>
                items={enrichedSequences}
                myLabel="My Sequences"
                publicLabel="Public Sequences"
                searchField={(item) => item.nameSequence}
                displayField={(item) => item.nameSequence}
                placeholderText="Search for a Sequence"
                getCreatedBy={(item) => (item as any).createdBy}
                inputValue={searchInputValue}
                onInputChange={setSearchInputValue}
                onSelect={(selectedSequence) => {
                  handleSelect(selectedSequence)
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
                    router.push('/sequences/practiceSequences')
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  Clear and Browse Sequences
                </Button>
              </Box>
            )}

            {/* Only show sequence content when a sequence is selected.
                This covers two cases used in tests:
                - A sequenceId is present in the URL (even '0')
                - Or a non-zero singleSequence.id has been selected locally
            */}
            {(sequenceId !== null ||
              (!!singleSequence?.id && singleSequence.id !== 0)) && (
              <Paper
                elevation={0}
                sx={{
                  mt: 4,
                  width: '100%',
                  maxWidth: '600px',
                  alignSelf: 'center',
                  p: 3,
                  backgroundColor: 'navSplash.dark',
                  borderRadius: 2,
                }}
              >
                {isSequencePendingLoad ? (
                  <Box
                    sx={{
                      py: 6,
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'primary.contrastText',
                        textAlign: 'center',
                      }}
                    >
                      Loading sequence…
                    </Typography>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <>
                    {/* Sequence title with inline edit icon to the right */}
                    <Box
                      flexDirection={'column'}
                      sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        px: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <Typography
                          variant="h1"
                          component="h1"
                          sx={{
                            m: 0,
                            textAlign: 'left',
                            minWidth: 0,
                            overflowWrap: 'anywhere',
                          }}
                        >
                          {singleSequence.nameSequence}
                        </Typography>

                        {isSequenceOwner && (
                          <IconButton
                            onClick={() => {
                              try {
                                router.replace(
                                  `/sequences/practiceSequences?id=${singleSequence.id}&edit=true`
                                )
                              } catch (e) {
                                // ignore navigation errors
                              }
                            }}
                            aria-label={`Edit ${singleSequence.nameSequence}`}
                            sx={{
                              p: 1,
                              minWidth: 0,
                            }}
                            title="Edit Sequence"
                            size="small"
                          >
                            <EditIcon fontSize="small" color="primary" />
                          </IconButton>
                        )}
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <IconButton
                          onClick={() => setViewMode('list')}
                          disabled={viewMode === 'list'}
                          aria-label={`Switch to list view for ${singleSequence.nameSequence}`}
                          aria-pressed={viewMode === 'list'}
                          sx={{
                            color:
                              viewMode === 'list' ? 'primary.main' : 'grey.500',
                            p: 1.25,
                            minWidth: 0,
                            '&.Mui-disabled': { color: 'primary.main' },
                          }}
                          title="List View"
                        >
                          <FormatListBulletedIcon />
                        </IconButton>

                        <IconButton
                          onClick={() => setViewMode('scroll')}
                          disabled={viewMode === 'scroll'}
                          aria-label={`Switch to scroll view for ${singleSequence.nameSequence}`}
                          aria-pressed={viewMode === 'scroll'}
                          sx={{
                            color:
                              viewMode === 'scroll'
                                ? 'primary.main'
                                : 'grey.500',
                            p: 1.25,
                            minWidth: 0,
                            '&.Mui-disabled': { color: 'primary.main' },
                          }}
                          title="Scroll View"
                        >
                          <ViewStreamIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Sequence Activity Tracker (moved to top after title per asana pattern) */}
                    {singleSequence.id && singleSequence.id !== 0 && (
                      <Box
                        sx={{
                          mt: 3,
                          width: '100%',
                          maxWidth: '600px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            mb: 2,
                            mx: 'auto',
                            width: '100%',
                            maxWidth: '600px',
                          }}
                        >
                          <ActivityTracker
                            entityId={singleSequence.id.toString()}
                            entityName={singleSequence.nameSequence}
                            entityType="sequence"
                            variant="chips"
                            checkActivity={checkSequenceActivityExists}
                            createActivity={createSequenceActivity}
                            deleteActivity={deleteSequenceActivity}
                            onActivityToggle={handleActivityToggle}
                          />
                        </Box>

                        <Accordion
                          elevation={0}
                          sx={{
                            mb: 2,
                            mx: 'auto',
                            width: '100%',
                            maxWidth: '600px',
                            backgroundColor: 'navSplash.dark',
                            '&:before': {
                              display: 'none',
                            },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="weekly-activity-content"
                            id="weekly-activity-header"
                          >
                            <Typography variant="subtitle1">
                              Weekly Activity
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <WeeklyActivityViewer
                              entityId={singleSequence.id.toString()}
                              entityName={singleSequence.nameSequence}
                              entityType="sequence"
                              variant="detailed"
                              refreshTrigger={refreshTrigger}
                            />
                          </AccordionDetails>
                        </Accordion>
                      </Box>
                    )}

                    <Stack rowGap={3} alignItems="center">
                      {viewMode === 'list' ? (
                        // List view: all flows at once, no pagination
                        singleSequence.sequencesSeries.map(
                          (seriesMini: any, i: number) => (
                            <SequenceFlowCard
                              key={`list-${seriesMini.id ?? i}`}
                              seriesName={seriesMini.seriesName}
                              seriesPoses={normalizeSeriesPoses(
                                seriesMini.seriesPoses
                              )}
                              isStale={Boolean(seriesMini.isStale)}
                              onSeriesClick={
                                seriesMini.isStale
                                  ? undefined
                                  : () => handleSeriesNavigation(seriesMini)
                              }
                              titleColor="primary.main"
                              linkColor="primary.contrastText"
                              getPoseHref={(poseName, poseId) =>
                                getPoseNavigationUrlSync(
                                  String(poseId || poseName)
                                )
                              }
                              cardSx={{
                                maxWidth: '600px',
                              }}
                              poseSx={{
                                px: 3,
                                py: 1,
                              }}
                              dataTestIdPrefix={`practice-sequence-list-flow-${i}`}
                            />
                          )
                        )
                      ) : (
                        // Scroll view: one flow at a time with pagination
                        <>
                          {paginatedData.map((seriesMini, i) => (
                            <SequenceFlowCard
                              key={i}
                              seriesName={seriesMini.seriesName}
                              seriesPoses={normalizeSeriesPoses(
                                seriesMini.seriesPoses
                              )}
                              onSeriesClick={() =>
                                handleSeriesNavigation(seriesMini)
                              }
                              titleColor="primary.main"
                              linkColor="primary.contrastText"
                              getPoseHref={(poseName, poseId) =>
                                getPoseNavigationUrlSync(
                                  String(poseId || poseName)
                                )
                              }
                              headerTopContent={
                                <Stack
                                  flexDirection={'row'}
                                  justifyContent={'space-between'}
                                  alignItems={'center'}
                                >
                                  <Button
                                    disableRipple
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      setPage((prev) => Math.max(prev - 1, 1))
                                    }}
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
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      setPage((prev) =>
                                        Math.min(
                                          prev + 1,
                                          Math.ceil(
                                            singleSequence.sequencesSeries
                                              .length / itemsPerPage
                                          )
                                        )
                                      )
                                    }}
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
                                    {(
                                      singleSequence.sequencesSeries[
                                        page
                                      ] as any
                                    )?.seriesName || 'Next'}
                                  </Button>
                                </Stack>
                              }
                              cardSx={{
                                maxWidth: '600px',
                              }}
                              poseSx={{
                                px: 3,
                                py: 1,
                              }}
                              dataTestIdPrefix={`practice-sequence-flow-${i}`}
                            />
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
                                singleSequence.sequencesSeries.length /
                                  itemsPerPage
                              )}
                              page={page}
                              onChange={handleChange}
                            />
                          </Box>
                        </>
                      )}

                      {/* Sequence Image */}
                      {singleSequence.image && (
                        <Box sx={{ width: '100%', mt: 3 }}>
                          <Typography
                            variant="h4"
                            sx={{
                              mb: 1,
                              color: 'primary.main',
                            }}
                          >
                            Sequence Image
                          </Typography>
                          <Box
                            sx={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                          >
                            <Box sx={{ width: '100%', maxWidth: '500px' }}>
                              <ImageCarousel
                                images={[
                                  {
                                    id: 'legacy-sequence-image',
                                    userId: '',
                                    url: singleSequence.image,
                                    altText: `${singleSequence.nameSequence || 'Sequence'} image`,
                                    displayOrder: 1,
                                    uploadedAt: new Date(),
                                    storageType: 'CLOUD',
                                    isOffline: false,
                                    imageType: 'sequence',
                                  } as PoseImageData,
                                ]}
                                height={400}
                                showArrows={false}
                                aria-label={`${singleSequence.nameSequence || 'Sequence'} image`}
                              />
                            </Box>
                          </Box>
                        </Box>
                      )}

                      <Box
                        className={'journal'}
                        sx={{
                          marginTop: '32px',
                          p: 4,
                          color: 'primary.main',
                          backgroundColor: 'transparent',
                        }}
                      >
                        <Stack flexDirection={'row'} alignItems={'center'}>
                          <Typography variant="h3" sx={{ mr: 2 }}>
                            Description
                          </Typography>
                        </Stack>
                        <Typography
                          variant="body1"
                          sx={{ whiteSpace: 'pre-line' }}
                        >
                          {singleSequence.description}
                        </Typography>
                      </Box>

                      {isSequenceOwner && (
                        <Box
                          sx={{
                            width: '100%',
                            mt: 3,
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<EditIcon />}
                            onClick={() => {
                              try {
                                router.replace(
                                  `/sequences/practiceSequences?id=${singleSequence.id}&edit=true`
                                )
                              } catch (e) {
                                // ignore navigation errors
                              }
                            }}
                            aria-label="Edit sequence"
                            sx={{ color: 'primary.contrastText' }}
                          >
                            Edit Text
                          </Button>
                        </Box>
                      )}
                    </Stack>
                  </>
                )}
              </Paper>
            )}
          </Stack>
        </Stack>
      </Box>

      <HelpDrawer
        content={
          sequenceId !== null ||
          (!!singleSequence?.id && singleSequence.id !== 0)
            ? HELP_PATHS.sequences.detailsSequences
            : HELP_PATHS.sequences.practiceSequences
        }
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
