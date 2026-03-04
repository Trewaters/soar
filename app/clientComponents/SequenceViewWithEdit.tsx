'use client'

import React, { useMemo, useState, useEffect, useContext } from 'react'
import {
  Box,
  Stack,
  Typography,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Button,
  CircularProgress,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useSession } from 'next-auth/react'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import NAV_PATHS from '@app/utils/navigation/constants'
import { UserStateContext } from '@context/UserContext'
import EditSequence, { EditableSequence } from '@clientComponents/EditSequence'
import { getAllSeries } from '@lib/seriesService'
import SequenceFlowCard from '@clientComponents/SequenceFlowCard'
import HelpButton from '@app/clientComponents/HelpButton'
import HelpDrawer from '@app/clientComponents/HelpDrawer'
import { HELP_PATHS } from '@app/utils/helpLoader'
import { getPoseNavigationUrlSync } from '@app/utils/navigation/poseNavigation'
import { normalizeSeriesPoses } from '@app/utils/asana/normalizeSeriesPoses'
import Image from 'next/image'
import ImageCarousel from '@app/clientComponents/imageUpload/ImageCarousel'
import ActivityTracker from '@app/clientComponents/ActivityTracker'
import WeeklyActivityViewer from '@app/clientComponents/WeeklyActivityViewer'
import {
  checkSequenceActivityExists,
  createSequenceActivity,
  deleteSequenceActivity,
} from '@lib/sequenceActivityClientService'
import CustomPaginationCircles from '@app/clientComponents/pagination-circles'
import { PoseImageData } from 'types/images'

export type Props = {
  sequence: EditableSequence
  defaultShowEdit?: boolean
  defaultView?: 'list' | 'scroll'
}

type SequenceViewMode = 'list' | 'scroll'

export default function SequenceViewWithEdit({
  sequence,
  defaultShowEdit = false,
  defaultView = 'list',
}: Props) {
  const { data: session } = useSession()
  const { state: userState } = useContext(UserStateContext)
  const navigation = useNavigationWithLoading()
  const [showEdit, setShowEdit] = useState<boolean>(defaultShowEdit)
  const [viewMode, setViewMode] = useState<SequenceViewMode>(defaultView)
  const [model, setModel] = useState<EditableSequence>(sequence)
  const [isLoadingFreshData, setIsLoadingFreshData] = useState<boolean>(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [page, setPage] = useState(1)
  const itemsPerPage = 1

  const totalPages = Math.max(
    1,
    Math.ceil((model.sequencesSeries?.length || 0) / itemsPerPage)
  )
  const paginatedSeries = (model.sequencesSeries || []).slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  // Sync showEdit with defaultShowEdit prop changes
  useEffect(() => {
    setShowEdit(defaultShowEdit)
  }, [defaultShowEdit])

  useEffect(() => {
    setViewMode(defaultView)
  }, [defaultView])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const getSequenceEditUrl = () => {
    const sequenceId = model.id
    if (!sequenceId) return null
    return `/sequences/practiceSequences?id=${sequenceId}&edit=true`
  }

  const getPracticeUrl = () => {
    const sequenceId = model.id
    if (!sequenceId) return NAV_PATHS.FLOWS_PRACTICE_SEQUENCES
    return `${NAV_PATHS.FLOWS_PRACTICE_SEQUENCES}?id=${sequenceId}`
  }

  // When edit mode is toggled we want to keep the URL in sync so
  // that `?edit=true` is present when editing and removed when not.
  const handleToggleEdit = (open?: boolean) => {
    const next = typeof open === 'boolean' ? open : !showEdit
    setShowEdit(next)

    try {
      if (next) {
        // Opening edit — update URL to practiceSequences?id=...&edit=true
        const target = getSequenceEditUrl()
        if (target) navigation.replace(target)
      } else {
        // Closing edit (cancel) — go back to practiceSequences
        navigation.replace(getPracticeUrl())
      }
    } catch (e) {
      // best-effort URL sync; ignore errors
    }
  }

  // Fetch fresh series data to ensure sequences show current series content
  useEffect(() => {
    const fetchFreshSeriesData = async () => {
      if (!sequence.sequencesSeries || sequence.sequencesSeries.length === 0) {
        return
      }

      setIsLoadingFreshData(true)
      try {
        // Get all current series data from the database
        const allSeries = await getAllSeries()

        // For each series in the sequence, find the matching current series data
        const refreshedData = sequence.sequencesSeries.map((sequenceSeries) => {
          // Match by ID only
          const currentSeriesData = allSeries.find(
            (dbSeries) =>
              dbSeries.id &&
              (sequenceSeries as any).id &&
              String(dbSeries.id) === String((sequenceSeries as any).id)
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
        })

        // Update the model with fresh data
        setModel((prevModel) => ({
          ...prevModel,
          sequencesSeries: refreshedData,
        }))
      } catch (error) {
        console.error('Failed to fetch fresh series data:', error)
        // On error, keep using original sequence data (no action needed)
      } finally {
        setIsLoadingFreshData(false)
      }
    }

    fetchFreshSeriesData()
  }, [sequence.id, sequence.sequencesSeries]) // Re-run when sequence changes

  const isOwner = useMemo(() => {
    const email = session?.user?.email ?? null
    const createdBy = model.created_by
    const userRole = userState?.userData?.role

    // Admin users can edit any sequence
    const isAdmin = userRole === 'admin'

    // Allow if admin OR if owner
    if (isAdmin) {
      return true
    }

    if (!createdBy || !email) return false
    // Compare case-insensitively and ignore stray whitespace
    const isMatch =
      createdBy.trim().toLowerCase() === email.trim().toLowerCase()
    return isMatch
  }, [model.created_by, session?.user?.email, userState?.userData?.role])

  // Helper function to resolve series ID and navigate
  // This ensures we NEVER use pagination IDs, only actual MongoDB ObjectIds
  const handleSeriesNavigation = async (seriesMini: any) => {
    try {
      // NEVER use seriesMini.id directly - it's likely a pagination ID like "2"
      // ALWAYS resolve by name to get the actual MongoDB ObjectId

      if (!seriesMini.seriesName) {
        console.error('No series name available for resolution')
        alert('Cannot navigate: Series name is missing')
        return
      }

      const allSeries = await getAllSeries()

      // Try exact name match first
      let matchingSeries = allSeries.find(
        (series) => series.seriesName === seriesMini.seriesName
      )

      // If no exact match, try case-insensitive match
      if (!matchingSeries) {
        matchingSeries = allSeries.find(
          (series) =>
            series.seriesName.toLowerCase() ===
            seriesMini.seriesName.toLowerCase()
        )
      }

      // If still no match, try trimmed comparison (handle whitespace)
      if (!matchingSeries) {
        matchingSeries = allSeries.find(
          (series) =>
            series.seriesName.trim().toLowerCase() ===
            seriesMini.seriesName.trim().toLowerCase()
        )
      }

      if (matchingSeries?.id) {
        navigation.push(
          `${NAV_PATHS.FLOWS_PRACTICE_SERIES}?id=${matchingSeries.id}`
        )
        return
      }

      // Additional tolerant matching strategies
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
        navigation.push(
          `${NAV_PATHS.FLOWS_PRACTICE_SERIES}?id=${fuzzyMatch.id}`
        )
        return
      }

      // If seriesMini.id looks like a MongoDB ObjectId, try using it directly
      const maybeId = String(seriesMini.id || '')
      if (/^[0-9a-fA-F]{24}$/.test(maybeId)) {
        navigation.push(`${NAV_PATHS.FLOWS_PRACTICE_SERIES}?id=${maybeId}`)
        return
      }

      // Final fallback: log details and navigate to the series list page with hint
      console.error('❌ FAILED: Could not resolve series by name')
      console.error('Looking for series name:', seriesMini.seriesName)
      console.error(
        'Available series names:',
        allSeries.map((s) => s.seriesName)
      )
      navigation.push(
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

  const handleSequenceUpdate = (updatedSequence: EditableSequence) => {
    // Update the model with the saved data
    setModel(updatedSequence)
    // Exit edit mode and navigate back to the practice view
    setShowEdit(false)
    const id = updatedSequence.id
    navigation.replace(
      id
        ? `${NAV_PATHS.FLOWS_PRACTICE_SEQUENCES}?id=${id}`
        : NAV_PATHS.FLOWS_PRACTICE_SEQUENCES
    )
  }

  const handleBackNavigation = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    navigation.replace(getPracticeUrl())
  }

  function handleActivityToggle(isTracked: boolean) {
    // Trigger refresh of any activity components that might be listening
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <Box component="section" aria-label="sequence-view" sx={{ mt: 4 }}>
      <Stack spacing={3}>
        {/* Back Navigation Button */}
        <Box sx={{ alignSelf: 'flex-start' }}>
          <Button
            variant="text"
            onClick={handleBackNavigation}
            startIcon={<ArrowBackIcon />}
            sx={{
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'transparent',
                boxShadow: 'none',
              },
            }}
            disableRipple
            aria-label="BACK"
          >
            BACK
          </Button>
        </Box>

        {/* Sequence Header with Soar styling */}
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              width: '100%',
              justifyContent: 'space-between',
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
                {model.nameSequence}
              </Typography>
            </Box>

            {/* View toggle icons */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                ml: 'auto',
              }}
            >
              <HelpButton onClick={() => setIsHelpOpen((prev) => !prev)} />
            </Box>
          </Box>

          {/* Edit toggle moved into the orange header tab for owners */}
        </Box>

        {isOwner && showEdit && (
          <Box id="sequence-edit-region" role="region" aria-label="edit-region">
            <Divider sx={{ my: 2 }} />
            <EditSequence
              sequence={model}
              onChange={handleSequenceUpdate}
              onCancel={() => handleToggleEdit(false)}
            />
          </Box>
        )}
        {/* Flow Series Cards - Following Soar pattern - Only show when NOT in edit mode */}
        {!showEdit && (
          <>
            {/* Sequence Activity Tracker + Weekly Activity (match asana/flow pattern) */}
            {model.id && model.id !== 0 && (
              <Box
                sx={{
                  mt: 1,
                  mb: 1,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
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
                    entityId={model.id.toString()}
                    entityName={model.nameSequence}
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
                    <Typography variant="subtitle1">Weekly Activity</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <WeeklyActivityViewer
                      entityId={model.id.toString()}
                      entityName={model.nameSequence}
                      entityType="sequence"
                      variant="detailed"
                      refreshTrigger={refreshTrigger}
                    />
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}

            {isLoadingFreshData && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Refreshing series data...
                </Typography>
              </Box>
            )}
            {viewMode === 'list' && model.sequencesSeries?.length ? (
              <Stack spacing={3} alignItems="center">
                {model.sequencesSeries.map((seriesMini, i) => {
                  const isStale = Boolean((seriesMini as any).isStale)
                  const normalizedSeriesPoses = normalizeSeriesPoses(
                    (seriesMini as any).seriesPoses || []
                  )

                  return (
                    <SequenceFlowCard
                      key={`${seriesMini.seriesName}-${i}`}
                      seriesName={seriesMini.seriesName}
                      seriesPoses={normalizedSeriesPoses}
                      isStale={isStale}
                      onSeriesClick={
                        isStale
                          ? undefined
                          : () => handleSeriesNavigation(seriesMini)
                      }
                      titleColor="text.primary"
                      linkColor="primary.main"
                      getPoseHref={(poseName) =>
                        getPoseNavigationUrlSync(poseName)
                      }
                      cardSx={{
                        maxWidth: '85%',
                      }}
                      poseSx={{
                        px: 3,
                        py: 1,
                        '&:hover': {
                          backgroundColor: (theme) =>
                            theme.palette.background.default,
                          transition: 'all 0.2s',
                        },
                      }}
                      dataTestIdPrefix={`sequence-series-${i}`}
                    />
                  )
                })}
              </Stack>
            ) : viewMode === 'scroll' && model.sequencesSeries?.length ? (
              <Stack spacing={3} alignItems="center">
                {paginatedSeries.map((seriesMini, i) => {
                  const isStale = Boolean((seriesMini as any).isStale)
                  const normalizedSeriesPoses = normalizeSeriesPoses(
                    (seriesMini as any).seriesPoses || []
                  )

                  return (
                    <SequenceFlowCard
                      key={`${seriesMini.seriesName}-${page}-${i}`}
                      seriesName={seriesMini.seriesName}
                      seriesPoses={normalizedSeriesPoses}
                      isStale={isStale}
                      onSeriesClick={
                        isStale
                          ? undefined
                          : () => handleSeriesNavigation(seriesMini)
                      }
                      titleColor="text.primary"
                      linkColor="primary.main"
                      getPoseHref={(poseName) =>
                        getPoseNavigationUrlSync(poseName)
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
                            {model.sequencesSeries?.[page - 2]?.seriesName ||
                              'Previous'}
                          </Button>

                          <Button
                            disableRipple
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setPage((prev) => Math.min(prev + 1, totalPages))
                            }}
                            disabled={page === totalPages}
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
                            {model.sequencesSeries?.[page]?.seriesName ||
                              'Next'}
                          </Button>
                        </Stack>
                      }
                      cardSx={{
                        maxWidth: '85%',
                      }}
                      poseSx={{
                        px: 3,
                        py: 1,
                        '&:hover': {
                          backgroundColor: (theme) =>
                            theme.palette.background.default,
                          transition: 'all 0.2s',
                        },
                      }}
                      dataTestIdPrefix={`sequence-series-scroll-${i}`}
                    />
                  )
                })}

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    mt: 1,
                    width: '100%',
                  }}
                >
                  <CustomPaginationCircles
                    count={totalPages}
                    page={page}
                    onChange={(_event, value) => setPage(value)}
                  />
                </Box>
              </Stack>
            ) : !isLoadingFreshData ? (
              <Typography variant="body2" textAlign="center">
                No flow series added.
              </Typography>
            ) : null}
          </>
        )}

        {/* Description Section with Soar styling - Only show when NOT in edit mode */}
        {!showEdit && model.description && (
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
            </Stack>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {model.description}
            </Typography>
          </Box>
        )}

        {/* Sequence Image - reusable component, shown at bottom for both list and scroll views */}
        {!showEdit && model.image && (
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
                      url: model.image,
                      altText: `${model.nameSequence || 'Sequence'} image`,
                      displayOrder: 1,
                      uploadedAt: new Date(),
                      storageType: 'CLOUD',
                      isOffline: false,
                      imageType: 'sequence',
                    } as PoseImageData,
                  ]}
                  height={400}
                  showArrows={false}
                  aria-label={`${model.nameSequence || 'Sequence'} image`}
                />
              </Box>
            </Box>
          </Box>
        )}

        <HelpDrawer
          content={
            showEdit
              ? HELP_PATHS.sequences.editSequences
              : HELP_PATHS.sequences.detailsSequences
          }
          open={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
        />
      </Stack>
    </Box>
  )
}
