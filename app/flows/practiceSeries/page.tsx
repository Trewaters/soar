'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useIsAdmin } from '@app/hooks/useCanEditContent'
import { FlowSeriesData } from '@context/AsanaSeriesContext'
import GroupedDataAssetSearch from '@app/clientComponents/GroupedDataAssetSearch'
import {
  Box,
  Stack,
  Typography,
  useTheme,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EditIcon from '@mui/icons-material/Edit'
import { getPoseNavigationUrlSync } from '@app/utils/navigation/poseNavigation'
import SplashHeader from '@app/clientComponents/splash-header'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import HelpButton from '@app/clientComponents/HelpButton'
import HelpDrawer from '@app/clientComponents/HelpDrawer'
import { HELP_PATHS } from '@app/utils/helpLoader'
import {
  getAllSeries,
  deleteSeries,
  updateSeries,
  getSingleSeries,
} from '@lib/seriesService'
import ActivityTracker from '@app/clientComponents/ActivityTracker'
import {
  checkSeriesActivityExists,
  createSeriesActivity,
  deleteSeriesActivity,
} from '@lib/seriesActivityClientService'
import WeeklyActivityViewer from '@app/clientComponents/WeeklyActivityViewer'
import { useSearchParams } from 'next/navigation'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import Paper from '@mui/material/Paper'
import EditSeriesDialog, {
  Series as EditSeriesShape,
  Asana as EditAsanaShape,
} from '@app/flows/editSeries/EditSeriesDialog'
import { splitSeriesPoseEntry } from '@app/utils/asana/seriesPoseLabels'
import { getPoseIdByName } from '@lib/poseService'
import FlowTitlePoseListSection from '@app/clientComponents/FlowTitlePoseListSection'
import ImageCarousel from '@app/clientComponents/imageUpload/ImageCarousel'
import { PoseImageData } from 'types/images'

export default function Page() {
  const { data: session } = useSession()
  const theme = useTheme()
  const router = useNavigationWithLoading()
  const searchParams = useSearchParams()
  const seriesId = searchParams.get('id')
  const missing = searchParams.get('missing')
  const missingName = searchParams.get('name')
  const [series, setSeries] = useState<FlowSeriesData[]>([])
  const [flow, setFlow] = useState<FlowSeriesData>()
  const flowRef = React.useRef<FlowSeriesData | undefined>(flow)
  const [poseIds, setPoseIds] = useState<{
    [poseName: string]: string | null
  }>({})

  useEffect(() => {
    flowRef.current = flow
  }, [flow])
  const [open, setOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [loading, setLoading] = useState(false)
  const [acOpen, setAcOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [images, setImages] = useState<PoseImageData[]>([])
  const [searchInputValue, setSearchInputValue] = useState('')
  const [seriesNotFoundError, setSeriesNotFoundError] = useState<string | null>(
    null
  )

  // Normalise createdBy field so both createdBy and created_by are recognised
  const enrichedSeries = useMemo(
    () =>
      (series || []).map((s) => ({
        ...s,
        createdBy: (s as any).createdBy ?? (s as any).created_by ?? undefined,
      })),
    [series]
  )

  // We intentionally omit `flow` from the dependency array to avoid a
  // feedback loop where setting `flow` (even to an equivalent id) would
  // re-trigger fetchSeries. We use `flowRef` to read the current value.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSeries = useCallback(
    async (selectId?: string) => {
      setLoading(true)
      setSeriesNotFoundError(null)
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
              setSeriesNotFoundError(null)
            } else {
              // Series ID in URL doesn't exist in the database
              setFlow(undefined)
              setSeriesNotFoundError(
                `The flow you were looking for is no longer available. It may have been deleted or the link is invalid.`
              )
            }
          } else if (selectId) {
            // When explicitly refreshing a specific series (e.g., after save),
            // always update to show fresh data even if it's the same ID
            const selectedSeries = seriesData.find((s) => s.id === selectId)
            if (selectedSeries) {
              setFlow(selectedSeries)
              setSeriesNotFoundError(null)
            }
          } else if (flow?.id) {
            const selectedSeries = seriesData.find((s) => s.id === flow.id)
            if (selectedSeries) {
              if (String(selectedSeries.id) !== String(flowRef.current?.id)) {
                setFlow(selectedSeries)
              }
              setSeriesNotFoundError(null)
            } else {
              // Previously selected flow no longer exists (likely deleted); clear it
              setFlow(undefined)
              setSeriesNotFoundError(null)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching series:', error)
        if (seriesId) {
          setSeriesNotFoundError(
            'Failed to load the requested flow. Please try again.'
          )
        }
      } finally {
        setLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seriesId]
  )

  useEffect(() => {
    // initial load
    fetchSeries()
  }, [fetchSeries])

  // Handle series ID changes after series data is loaded.
  // This effect acts as a defensive safety net for cases where fetchSeries completes
  // but the flow wasn't properly selected (e.g., race conditions or timing issues).
  // It only triggers if a seriesId is in the URL and flow hasn't been set yet.
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

  // Fetch images array for the selected series
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
        if (mounted && Array.isArray(data.images)) {
          // Convert to ImageCarousel format
          const carouselImages = data.images.map(
            (url: string, index: number) =>
              ({
                id: `series-image-${index}`,
                userId: '',
                url,
                altText: `${flow.seriesName} image ${index + 1}`,
                displayOrder: index + 1,
                uploadedAt: new Date(),
                storageType: 'CLOUD' as const,
                isOffline: false,
                imageType: 'series' as any,
              }) as PoseImageData
          )
          setImages(carouselImages)
        }
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
  }, [flow?.id, flow?.seriesName])

  // Resolve asana IDs for navigation and deleted pose detection
  useEffect(() => {
    let mounted = true
    async function resolvePoseIds() {
      if (!flow?.seriesPoses?.length) {
        if (mounted) setPoseIds({})
        return
      }

      // Extract all pose names first
      const poseNames: string[] = []
      for (const pose of flow.seriesPoses) {
        let poseName = ''
        if (typeof pose === 'string') {
          const { name } = splitSeriesPoseEntry(pose)
          poseName = name
        } else if (pose && typeof pose === 'object') {
          poseName = (pose as any).sort_english_name || ''
        }
        if (poseName) poseNames.push(poseName)
      }

      // Fetch all pose IDs in parallel for faster resolution
      const idPromises = poseNames.map(async (poseName) => {
        try {
          const id = await getPoseIdByName(poseName)
          return { poseName, id }
        } catch (error) {
          console.warn(`Failed to resolve ID for pose: ${poseName}`, error)
          return { poseName, id: null }
        }
      })

      // Wait for all promises to complete and update state once with the full set
      try {
        const results = await Promise.all(idPromises)
        if (mounted) {
          const idsMap = results.reduce(
            (acc, { poseName, id }) => {
              acc[poseName] = id
              return acc
            },
            {} as { [poseName: string]: string | null }
          )
          setPoseIds(idsMap)
        }
      } catch (error) {
        console.error('Error resolving pose IDs:', error)
      }
    }

    resolvePoseIds()
    return () => {
      mounted = false
    }
  }, [flow?.seriesPoses])

  function handleInfoClick() {
    setOpen(!open)
  }

  function handleActivityToggle() {
    // Trigger refresh of any activity components that might be listening
    setRefreshTrigger((prev) => prev + 1)
  }

  // Determine if current user owns the selected series or is admin
  const isAdmin = useIsAdmin()
  const isOwner = useMemo(() => {
    if (!flow || !session?.user?.email) return false
    // createdBy added by API normalization
    return (flow as any).createdBy === session.user.email || isAdmin
  }, [flow, session?.user?.email, isAdmin])

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
      // Remove the asanas property to avoid confusion - the API uses seriesPoses
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      const { asanas, ...restOfUpdated } = updated
      const payload = {
        ...restOfUpdated,
        seriesPoses,
      }

      // Update series on server
      await updateSeries(updated.id, payload as any)

      // Optimistically update the UI immediately with the edited data
      // This provides instant feedback without waiting for the server
      const optimisticUpdate: FlowSeriesData = {
        id: updated.id,
        seriesName: updated.name,
        description: updated.description || '',
        seriesPoses: seriesPoses,
        // Keep existing fields
        breath: flow?.breath || '',
        duration: flow?.duration || '',
        image: flow?.image || '',
      }

      // Immediately update the flow state for instant UI feedback
      setFlow(optimisticUpdate)

      // Close dialog immediately
      setEditOpen(false)

      // Fetch fresh data from server in the background to ensure consistency
      // This runs asynchronously without blocking the UI
      Promise.all([getSingleSeries(updated.id), getAllSeries()])
        .then(([freshSeries, updatedSeriesList]) => {
          // Update with server data when it arrives
          setFlow({ ...freshSeries } as FlowSeriesData)
          setSeries(updatedSeriesList as FlowSeriesData[])
        })
        .catch((err) => {
          console.error('Failed to refresh series data:', err)
          // Keep the optimistic update on error
        })
    } catch (e) {
      console.error('Failed to save series update', e)
    }
  }

  const handleEditDelete = async (id: string) => {
    try {
      await deleteSeries(id)
      // Immediately clear the current flow so the deleted series is not rendered
      // Also remove the deleted series from the local series list so the
      // re-selection effect does not repopulate it when `flow` becomes undefined.
      setSeries((prev) => prev.filter((s) => String(s.id) !== String(id)))
      setFlow(undefined)
      // Force refresh and navigate back to series list page (no id param)
      router.refresh()
      router.replace('/flows/practiceSeries')
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
      {!seriesId && (
        <SplashHeader
          src={'/images/series/series-practice-splash-header.png'}
          alt={'Practice Flows'}
          title="Practice Flows"
        />
      )}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
          <SubNavHeader mode="back" link="/flows" />
          <HelpButton onClick={handleInfoClick} />
        </Stack>
        <Stack sx={{ px: 4, width: '100%', maxWidth: '600px' }}>
          {missing === 'series' && missingName && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <Typography color="error">
                The series &quot;{decodeURIComponent(missingName)}&quot; has
                been removed and is no longer available for display.
              </Typography>
            </Box>
          )}
          <GroupedDataAssetSearch<FlowSeriesData>
            items={enrichedSeries}
            myLabel="My Flows"
            publicLabel="Public Flows"
            searchField={(item) => item.seriesName}
            displayField={(item) => item.seriesName}
            placeholderText="Search for a Flow"
            getCreatedBy={(item) => (item as any).createdBy}
            loading={loading}
            open={acOpen}
            onOpen={() => {
              setAcOpen(true)
              fetchSeries()
            }}
            onClose={() => setAcOpen(false)}
            inputValue={searchInputValue}
            onInputChange={setSearchInputValue}
            onSelect={(selectedFlow) => {
              setFlow(selectedFlow)
              setOpen(false)
              setAcOpen(false)
              router.push(
                `/flows/practiceSeries?id=${selectedFlow.id}`,
                undefined,
                { scroll: false }
              )
            }}
          />
        </Stack>
      </Box>

      {/* Display error message if the requested series is not available */}
      {seriesNotFoundError && (
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
            Flow Not Available
          </Typography>
          <Typography variant="body2" sx={{ color: 'error.dark', mb: 2 }}>
            {seriesNotFoundError}
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setSeriesNotFoundError(null)
              router.push('/flows/practiceSeries')
            }}
            sx={{ textTransform: 'none' }}
          >
            Clear and Browse Flows
          </Button>
        </Box>
      )}

      {flow && (
        <Box
          width="100%"
          sx={{ display: 'flex', justifyContent: 'center' }}
          key={flow.id}
        >
          {/* If editing, render the EditSeriesDialog inline here so the editor replaces the series content */}
          {editOpen ? (
            <Box sx={{ width: '100%', maxWidth: '600px', p: 2 }}>
              <EditSeriesDialog
                inline
                open={editOpen}
                onClose={() => setEditOpen(false)}
                series={dialogSeries!}
                onSave={handleEditSave}
                onDelete={handleEditDelete}
              />
            </Box>
          ) : (
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                width: '100%',
                maxWidth: '600px',
                p: 3,
                backgroundColor: 'navSplash.dark',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Activity Tracker - displayed above the main container */}
              <Box
                sx={{
                  mb: 2,
                  mx: 'auto',
                  width: '100%',
                  maxWidth: '600px',
                }}
              >
                <ActivityTracker
                  entityId={flow.id?.toString() || ''}
                  entityName={flow.seriesName}
                  entityType="series"
                  variant="chips"
                  checkActivity={checkSeriesActivityExists}
                  createActivity={createSeriesActivity}
                  deleteActivity={deleteSeriesActivity}
                  onActivityToggle={handleActivityToggle}
                />
              </Box>

              {/* Weekly Activity Accordion - displayed above the main container */}
              {flow.id && flow.id !== '' && (
                <Accordion
                  elevation={0}
                  sx={{
                    mb: 2,
                    mx: 'auto',
                    width: '100%',
                    maxWidth: '600px',
                    backgroundColor: 'transparent',
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
                    <Typography variant="h6">Weekly Activity</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <WeeklyActivityViewer
                      entityId={flow.id.toString()}
                      entityName={flow.seriesName}
                      entityType="series"
                      variant="detailed"
                      refreshTrigger={refreshTrigger}
                    />
                  </AccordionDetails>
                </Accordion>
              )}

              {/* Main content */}
              <Box
                sx={{
                  width: '100%',
                }}
              >
                {/* Title + Edit button + Series Pose List - unified in one journal component */}
                <FlowTitlePoseListSection
                  title={flow.seriesName}
                  isOwner={isOwner}
                  onEditClick={() => setEditOpen(true)}
                  seriesPoses={flow.seriesPoses}
                  poseIds={poseIds}
                  getHref={(poseName) => getPoseNavigationUrlSync(poseName)}
                  linkColor="primary.contrastText"
                  dataTestIdPrefix="practice-series-pose"
                />

                {/* Series Image - Read-only carousel display */}
                {(images.length > 0 || flow?.image) && (
                  <Box
                    sx={{
                      mt: 3,
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Box sx={{ width: '100%', maxWidth: '500px' }}>
                      <ImageCarousel
                        images={
                          images.length > 0
                            ? images
                            : [
                                {
                                  id: 'legacy-image',
                                  userId: '',
                                  url: flow?.image || '',
                                  altText: `${flow?.seriesName} image`,
                                  displayOrder: 1,
                                  uploadedAt: new Date(),
                                  storageType: 'CLOUD' as const,
                                  isOffline: false,
                                  imageType: 'series' as any,
                                } as PoseImageData,
                              ]
                        }
                        height={400}
                        showArrows={false}
                        aria-label={`${flow?.seriesName} series image`}
                      />
                    </Box>
                  </Box>
                )}

                {/* Description */}
                {flow.description && (
                  <Box sx={{ width: '100%', mt: 3 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        mb: 1,
                        color: `${theme.palette.primary.main}`,
                      }}
                    >
                      Description
                    </Typography>
                    <Typography
                      color="primary.contrastText"
                      variant="body1"
                      sx={{ whiteSpace: 'pre-line' }}
                    >
                      {flow.description}
                    </Typography>
                  </Box>
                )}

                {isOwner && (
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
                      onClick={() => setEditOpen(true)}
                      aria-label="Edit text"
                      sx={{ color: 'primary.contrastText' }}
                    >
                      Edit Text
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>
          )}
        </Box>
      )}

      <HelpDrawer
        content={HELP_PATHS.flows.practiceFlow}
        open={open}
        onClose={() => setOpen(false)}
      />

      {/* Dialog rendering removed to keep editor inline only. */}
    </Box>
  )
}
