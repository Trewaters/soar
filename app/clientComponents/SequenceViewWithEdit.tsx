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
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import ViewStreamIcon from '@mui/icons-material/ViewStream'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import { useSession } from 'next-auth/react'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import NAV_PATHS from '@app/utils/navigation/constants'
import { UserStateContext } from '@context/UserContext'
import EditSequence, { EditableSequence } from '@clientComponents/EditSequence'
import { getAllSeries } from '@lib/seriesService'
import SeriesPoseList from '@clientComponents/SeriesPoseList'
import { getPoseNavigationUrlSync } from '@app/utils/navigation/poseNavigation'
import Image from 'next/image'
import ActivityTracker from '@app/clientComponents/ActivityTracker'
import WeeklyActivityViewer from '@app/clientComponents/WeeklyActivityViewer'
import {
  checkSequenceActivityExists,
  createSequenceActivity,
  deleteSequenceActivity,
} from '@lib/sequenceActivityClientService'

export type Props = {
  sequence: EditableSequence
  defaultShowEdit?: boolean
}

export default function SequenceViewWithEdit({
  sequence,
  defaultShowEdit = false,
}: Props) {
  const { data: session } = useSession()
  const { state: userState } = useContext(UserStateContext)
  const navigation = useNavigationWithLoading()
  const [showEdit, setShowEdit] = useState<boolean>(defaultShowEdit)
  const [model, setModel] = useState<EditableSequence>(sequence)
  const [isLoadingFreshData, setIsLoadingFreshData] = useState<boolean>(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Sync showEdit with defaultShowEdit prop changes
  useEffect(() => {
    setShowEdit(defaultShowEdit)
  }, [defaultShowEdit])

  // When edit mode is toggled we want to keep the URL in sync so
  // that `?edit=true` is present when editing and removed when not.
  const handleToggleEdit = (open?: boolean) => {
    const next = typeof open === 'boolean' ? open : !showEdit
    setShowEdit(next)

    try {
      if (next && model.id) {
        navigation.replace(`/navigator/sequences/${model.id}?edit=true`)
      } else if (model.id) {
        navigation.replace(`/navigator/sequences/${model.id}`)
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
      console.log('[SequenceViewWithEdit] isOwner result: true (admin)')
      return true
    }

    if (!createdBy || !email) return false
    // Compare case-insensitively and ignore stray whitespace
    const isMatch =
      createdBy.trim().toLowerCase() === email.trim().toLowerCase()
    console.log('[SequenceViewWithEdit] isOwner result:', isMatch)
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
    // Exit edit mode only after successful save
    setShowEdit(false)
    // Don't navigate away automatically - let user decide when to leave
    // The user can use the back button or navigate manually
  }

  const handleBackNavigation = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()

    // Navigate back to scroll view practice sequences page
    if (model.id) {
      navigation.push(
        `/navigator/flows/practiceSequences?sequenceId=${model.id}`
      )
    } else {
      // Fallback to general navigation back
      navigation.back()
    }
  }

  function handleActivityToggle(isTracked: boolean) {
    console.log('Sequence activity tracked:', isTracked)
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
            aria-label={`Navigate back to ${model.nameSequence} sequence practice`}
          >
            Back to {model.nameSequence}
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
            }}
          >
            <Box
              component="h1"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: 'primary.main',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                minWidth: { xs: '80%', sm: 240 },
                maxWidth: '85%',
                ml: 5,
                pr: 3,
                pl: 2,
                py: 1,
              }}
            >
              <Typography
                variant="body1"
                component="span"
                sx={{
                  color: 'primary.contrastText',
                }}
              >
                {model.nameSequence}
              </Typography>

              {/* place an edit (pencil) icon to the right inside the orange tab */}
              {isOwner && (
                <IconButton
                  aria-label={showEdit ? 'close edit' : 'show edit'}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleToggleEdit()
                  }}
                  sx={{ ml: 'auto', color: 'primary.contrastText' }}
                  size="small"
                  title={showEdit ? 'Close editor' : 'Edit Sequence'}
                >
                  {showEdit ? (
                    <CloseIcon fontSize="small" />
                  ) : (
                    <EditIcon fontSize="small" />
                  )}
                </IconButton>
              )}
            </Box>

            {/* View toggle icons */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <IconButton
                aria-label="Currently in list view"
                sx={{
                  color: 'primary.main',
                  p: 1,
                  minWidth: 0,
                  pointerEvents: 'none',
                }}
                title="List View (current)"
              >
                <FormatListBulletedIcon />
              </IconButton>

              <IconButton
                onClick={() => {
                  if (model.id) {
                    navigation.push(
                      `/navigator/flows/practiceSequences?sequenceId=${model.id}`
                    )
                  }
                }}
                aria-label={`Switch to scroll view for ${model.nameSequence}`}
                sx={{
                  color: 'grey.500',
                  p: 1,
                  minWidth: 0,
                }}
                title="Scroll View"
              >
                <ViewStreamIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Edit toggle moved into the orange header tab for owners */}
        </Box>

        {/* Image Section */}
        {model.image && (
          <Box sx={{ display: 'flex', justifyContent: 'center', px: 2 }}>
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
                src={model.image}
                alt={model.nameSequence || 'Sequence image'}
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
            {isLoadingFreshData && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Refreshing series data...
                </Typography>
              </Box>
            )}
            {model.sequencesSeries?.length ? (
              <Stack spacing={3} alignItems="center">
                {model.sequencesSeries.map((seriesMini, i) => {
                  const isStale = Boolean((seriesMini as any).isStale)
                  return (
                    <Card
                      key={`${seriesMini.seriesName}-${i}`}
                      sx={{
                        width: '100%',
                        maxWidth: '85%',
                        boxShadow: 3,
                        textAlign: 'center',
                        borderColor: 'primary.main',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        cursor: isStale ? 'not-allowed' : 'pointer',
                        opacity: isStale ? 0.6 : 1,
                        '&:hover': isStale
                          ? {}
                          : {
                              boxShadow: 6,
                              transform: 'translateY(-1px)',
                              transition: 'all 0.2s ease-in-out',
                            },
                      }}
                      className="journal"
                      onClick={
                        isStale
                          ? undefined
                          : () => handleSeriesNavigation(seriesMini)
                      }
                      aria-disabled={isStale ? 'true' : 'false'}
                    >
                      <CardHeader
                        className="journalTitle"
                        title={
                          <Box width={'100%'}>
                            <Stack
                              flexDirection={'row'}
                              justifyContent={'center'}
                              alignItems={'center'}
                              sx={{ mb: 1 }}
                            >
                              <Typography variant="h6">
                                {seriesMini.seriesName}
                              </Typography>
                              {isStale && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ ml: 1 }}
                                >
                                  (Removed — no longer available)
                                </Typography>
                              )}
                            </Stack>
                          </Box>
                        }
                      />
                      <CardContent className="lines" sx={{ p: 0 }}>
                        {seriesMini.seriesPoses?.length ? (
                          <SeriesPoseList
                            seriesPoses={seriesMini.seriesPoses}
                            getHref={(poseName) =>
                              getPoseNavigationUrlSync(poseName)
                            }
                            linkColor="primary.main"
                            containerSx={{ width: '100%' }}
                            poseSx={{
                              px: 3,
                              py: 1,
                              '&:hover': {
                                backgroundColor: '#f0f0f0',
                                transition: 'all 0.2s',
                              },
                            }}
                            dataTestIdPrefix={`sequence-series-${i}-pose`}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ p: 2 }}
                          >
                            No poses in this series
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </Stack>
            ) : !isLoadingFreshData ? (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
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
              <Image
                src={'/icons/flows/leaf-3.svg'}
                alt={'leaf icon'}
                height={21}
                width={21}
              />
            </Stack>
            <Typography
              color="primary.contrastText"
              variant="body1"
              sx={{ whiteSpace: 'pre-line' }}
            >
              {model.description}
            </Typography>
          </Box>
        )}

        {/* Sequence Activity Tracker - Only show when NOT in edit mode */}
        {!showEdit && model.id && model.id !== 0 && (
          <Box sx={{ mt: 3 }}>
            <ActivityTracker
              entityId={model.id.toString()}
              entityName={model.nameSequence}
              entityType="sequence"
              variant="card"
              checkActivity={checkSequenceActivityExists}
              createActivity={createSequenceActivity}
              deleteActivity={deleteSequenceActivity}
              onActivityToggle={handleActivityToggle}
            />
          </Box>
        )}

        {/* Sequence Weekly Activity Tracker - Only show when NOT in edit mode */}
        {!showEdit && model.id && model.id !== 0 && (
          <Box sx={{ mt: 3 }}>
            <WeeklyActivityViewer
              entityId={model.id.toString()}
              entityName={model.nameSequence}
              entityType="sequence"
              variant="detailed"
              refreshTrigger={refreshTrigger}
            />
          </Box>
        )}
      </Stack>
    </Box>
  )
}
