'use client'
import React from 'react'
import { useFlowSeries } from '@app/context/AsanaSeriesContext'
import {
  Alert,
  Box,
  Button,
  FormControl,
  MenuItem,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { ChangeEvent, useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import { getAccessiblePoses } from '@lib/poseService'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import SplashHeader from '@app/clientComponents/splash-header'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import GroupedDataAssetSearch from '@app/clientComponents/GroupedDataAssetSearch'
import { AppText } from '@app/constants/Strings'
import {
  formatSeriesPoseEntry,
  splitSeriesPoseEntry,
} from '@app/utils/asana/seriesPoseLabels'
import { AsanaPose } from 'types/asana'
import ImageManagement from '@app/clientComponents/imageUpload/ImageManagement'
import type { PoseImageData } from '@app/clientComponents/imageUpload/ImageUpload'
import ImageIcon from '@mui/icons-material/Image'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
import HelpButton from '@app/clientComponents/HelpButton'
import HelpDrawer from '@app/clientComponents/HelpDrawer'
import { HELP_PATHS } from '@app/utils/helpLoader'

const BREATH_SERIES_OPTIONS = [
  'Inhale',
  'Hold full',
  'Exhale',
  'Hold empty',
] as const

export default function Page() {
  const { data: session, status } = useSession()
  const { state, dispatch } = useFlowSeries()
  const { seriesName, seriesPoses, breath, description, duration, image } =
    state.flowSeries
  const [poses, setPoses] = useState<AsanaPose[]>([])
  const [uploadedImages, setUploadedImages] = useState<PoseImageData[]>([])
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const router = useNavigationWithLoading()
  const [open, setOpen] = React.useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [isDirtyDescription, setIsDirtyDescription] = useState(false)
  const [isDirtyDuration, setIsDirtyDuration] = useState(false)
  const [acOpen, setAcOpen] = useState(false)
  const [searchInputValue, setSearchInputValue] = useState('')
  // Debug + throttling refs to prevent rapid refetch loops
  const lastFetchKeyRef = useRef<string | null>(null)
  const lastFetchTimeRef = useRef<number>(0)
  const fetchInFlightRef = useRef<boolean>(false)

  const fetchPoses = React.useCallback(async () => {
    const emailKey = session?.user?.email || 'guest'
    const now = Date.now()
    const throttleMs = 1500

    // Guard: avoid overlapping/in-flight fetches
    if (fetchInFlightRef.current) {
      return
    }

    // Guard: throttle repeated fetches with same key within window
    if (
      lastFetchKeyRef.current === emailKey &&
      now - lastFetchTimeRef.current < throttleMs
    ) {
      return
    }

    try {
      fetchInFlightRef.current = true
      lastFetchKeyRef.current = emailKey
      lastFetchTimeRef.current = now
      const poses = await getAccessiblePoses(session?.user?.email || undefined)
      setPoses(poses)
    } catch (error: Error | any) {
      console.error('[CreateSeries] Error fetching poses:', error.message)
    } finally {
      fetchInFlightRef.current = false
    }
  }, [session?.user?.email])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/flows')
      return
    }

    if (status === 'authenticated') {
      fetchPoses()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.email])

  // Refetch poses when the page becomes visible (e.g., when returning from create asana page)
  // This ensures that newly created asanas appear in the autocomplete search
  // Note: We only use visibilitychange, not focus, to avoid excessive API calls
  const handleVisibilityChange = React.useCallback(() => {
    const hidden = document.hidden
    if (!hidden) {
      // Only refetch when visible and not throttled/in-flight
      fetchPoses()
    }
  }, [fetchPoses])

  React.useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [handleVisibilityChange])

  function handleSelect(pose: AsanaPose) {
    const simplifiedName =
      Array.isArray(pose.sanskrit_names) && pose.sanskrit_names[0]
        ? pose.sanskrit_names[0]
        : ''
    dispatch({
      type: 'SET_FLOW_SERIES',
      payload: {
        ...state.flowSeries,
        seriesPoses: [
          ...state.flowSeries.seriesPoses,
          {
            poseId: pose.id,
            sort_english_name: pose.sort_english_name,
            secondary: simplifiedName,
            alignment_cues: '',
            breathSeries: '',
          },
        ],
      },
    })
    // Clear search input after selection
    setSearchInputValue('')
    setAcOpen(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmissionError(null)

    // Validate required fields
    if (!seriesName.trim()) {
      setSubmissionError('Flow name is required')
      return
    }

    if (seriesPoses.length === 0) {
      setSubmissionError('At least one pose is required')
      return
    }

    const updatedSeries = {
      ...state.flowSeries,
      seriesName,
      seriesPoses,
      breath,
      description,
      duration,
      durationSeries: duration,
      image,
    }
    dispatch({ type: 'SET_FLOW_SERIES', payload: updatedSeries })
    dispatch({
      type: 'RESET_FLOW_SERIES',
      payload: {
        seriesName: '',
        seriesPoses: [],
        breath: '',
        description: '',
        duration: '',
        image: '',
      },
    })

    try {
      const response = await fetch('/api/series/createSeries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cache: 'no-store',
        },
        body: JSON.stringify(updatedSeries),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to create flow')
      }
      const data = await response.json()

      // Redirect to the series detail page if we got an ID back
      if (data.id) {
        router.push(`/flows/practiceSeries?id=${data.id}`)
        return
      }

      setSubmissionError('Flow created but could not retrieve ID')
    } catch (error: Error | any) {
      const errorMsg =
        error instanceof Error ? error.message : 'Error creating flow'
      console.error('Error creating flow:', errorMsg)
      setSubmissionError(errorMsg)
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    dispatch({
      type: 'SET_FLOW_SERIES',
      payload: {
        ...state.flowSeries,
        [name]: value,
      },
    })
    switch (name) {
      case 'seriesName':
        setIsDirty(value.length > 0)

        break
      case 'description':
        setIsDirtyDescription(event.target.value.length > 0)

        break
      case 'duration':
        setIsDirtyDuration(event.target.value.length > 0)

        break
      default:
        break
    }
  }

  const handleImageUploaded = React.useCallback(
    (img: PoseImageData) => {
      // Flows are limited to ONE image - replace the array instead of appending
      // Prevent multiple uploads by clearing error and updating state
      setSubmissionError(null)
      setUploadedImages([img])
      dispatch({
        type: 'SET_FLOW_SERIES_IMAGE',
        payload: img.url,
      })
    },
    [dispatch]
  )

  function handleCancel() {
    // Navigate to Flow search view
    router.push('/flows')
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <SplashHeader
          src={'/icons/designImages/header-create-series.png'}
          alt={'Create Flow'}
          title="Create Flow"
        />
        <Stack
          spacing={2}
          sx={{
            mx: { xs: 0, sm: 3 },
            mb: '1em',
            width: '100%',
            maxWidth: 1200,
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
            <HelpButton onClick={() => setOpen(!open)} />
          </Stack>
          <form onSubmit={handleSubmit}>
            <Stack
              sx={{ px: { xs: 2, sm: 4 }, pb: 12 }}
              spacing={3}
              alignItems="center"
            >
              {submissionError && (
                <Alert
                  severity="error"
                  onClose={() => setSubmissionError(null)}
                  sx={{ mb: 1, width: '100%', maxWidth: 900 }}
                >
                  {submissionError}
                </Alert>
              )}

              <Box sx={{ width: '100%', maxWidth: 900 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: 'primary.main',
                    mb: 1,
                    alignSelf: 'flex-start',
                  }}
                >
                  Flow Name *
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="series-name"
                  placeholder="Give your Flow a name..."
                  name="seriesName"
                  value={seriesName}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    },
                    '& .MuiInputBase-input': {
                      color: 'primary.contrastText',
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'background.text',
                      opacity: 1,
                    },
                    width: '100%',
                  }}
                  InputProps={{
                    endAdornment: isDirty ? (
                      <CheckCircleIcon sx={{ color: 'success.main' }} />
                    ) : null,
                  }}
                />
              </Box>

              <Box sx={{ width: '100%', maxWidth: 900 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: 'primary.main',
                    mb: 1,
                  }}
                >
                  Flow Duration
                </Typography>
                <TextField
                  id="flow-duration"
                  fullWidth
                  placeholder="e.g. 20 min"
                  variant="outlined"
                  name="duration"
                  value={duration}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    },
                    '& .MuiInputBase-input': {
                      color: 'primary.contrastText',
                    },
                  }}
                  InputProps={{
                    endAdornment: isDirtyDuration ? (
                      <CheckCircleIcon
                        sx={{
                          color: 'success.main',
                        }}
                      />
                    ) : null,
                  }}
                />
              </Box>

              <Box sx={{ width: '100%', maxWidth: 900 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: 'primary.main',
                    mb: 1,
                  }}
                >
                  Add Poses to Flow
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Search and select poses to add to your flow. You can add as
                  many poses as you like, and rearrange or edit them later.
                </Typography>
                <FormControl
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <GroupedDataAssetSearch<AsanaPose>
                    items={poses.sort((a, b) =>
                      a.sort_english_name.localeCompare(b.sort_english_name)
                    )}
                    myLabel="My Poses"
                    publicLabel="Public Poses"
                    searchField={(pose) => pose.sort_english_name}
                    displayField={(pose) => pose.sort_english_name}
                    placeholderText="Search for a pose to add..."
                    getCreatedBy={(pose) => pose.created_by || undefined}
                    onSelect={handleSelect}
                    open={acOpen}
                    onOpen={() => setAcOpen(true)}
                    onClose={() => setAcOpen(false)}
                    inputValue={searchInputValue}
                    onInputChange={setSearchInputValue}
                    fullWidth
                  />
                </FormControl>
              </Box>

              <Box className="journal" sx={{ width: '100%', maxWidth: 900 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: 'primary.main',
                    mb: 1,
                  }}
                >
                  Your Flow Sequence{' '}
                  {seriesPoses.length > 0 && `(${seriesPoses.length} poses)`}
                </Typography>
                {seriesPoses.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 2, textAlign: 'center' }}
                  >
                    No poses added yet. Use the search above to add poses to
                    your flow.
                  </Typography>
                ) : (
                  <Stack className="lines" spacing={1} sx={{ mt: 2 }}>
                    {seriesPoses.map((entry, index) => {
                      // entry may be legacy string or new object
                      let name = ''
                      let secondary = ''
                      let alignmentCues = ''
                      let breathSeries = ''

                      if (typeof entry === 'string') {
                        const split = splitSeriesPoseEntry(entry)
                        name = split.name
                        secondary = split.secondary
                      } else if (entry && typeof entry === 'object') {
                        name = (entry as any).sort_english_name || ''
                        secondary = (entry as any).secondary || ''
                        alignmentCues = (entry as any).alignment_cues || ''
                        breathSeries = (entry as any).breathSeries || ''
                      }

                      const handleRemove = () => {
                        dispatch({
                          type: 'SET_FLOW_SERIES',
                          payload: {
                            ...state.flowSeries,
                            seriesPoses: state.flowSeries.seriesPoses.filter(
                              (_, i) => i !== index
                            ),
                          },
                        })
                      }

                      const handleCueChange = (e: React.ChangeEvent<any>) => {
                        const newVal = e.target.value.slice(0, 1000)
                        const newSeries = state.flowSeries.seriesPoses.map(
                          (it, i) => {
                            if (i !== index) return it
                            if (typeof it === 'string') {
                              // convert legacy string to object when user edits cues
                              const s = splitSeriesPoseEntry(it)
                              return {
                                poseId: undefined,
                                sort_english_name: s.name,
                                secondary: s.secondary,
                                alignment_cues: newVal,
                                breathSeries: '',
                              }
                            }
                            return {
                              ...(it as any),
                              alignment_cues: newVal,
                            }
                          }
                        )
                        dispatch({
                          type: 'SET_FLOW_SERIES',
                          payload: {
                            ...state.flowSeries,
                            seriesPoses: newSeries,
                          },
                        })
                      }

                      return (
                        <Stack
                          className="journalLine"
                          key={`${String(name)}+${index}`}
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 2,
                          }}
                        >
                          <Stack>
                            <IconButton
                              disableRipple
                              sx={{ color: 'error.light' }}
                              onClick={handleRemove}
                            >
                              <DeleteForeverIcon />
                            </IconButton>
                          </Stack>
                          <Stack sx={{ flex: 1 }}>
                            <Typography
                              variant="body1"
                              sx={{
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {name}
                            </Typography>
                            {secondary && (
                              <Typography
                                variant="body2"
                                sx={{
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  fontWeight: 'bold',
                                  fontStyle: 'italic',
                                }}
                              >
                                {secondary}
                              </Typography>
                            )}

                            <TextField
                              select
                              placeholder="Breath cue"
                              variant="standard"
                              value={breathSeries}
                              onChange={(e) => {
                                const newVal = e.target.value
                                const newSeries =
                                  state.flowSeries.seriesPoses.map((it, i) => {
                                    if (i !== index) return it
                                    if (typeof it === 'string') {
                                      const s = splitSeriesPoseEntry(it)
                                      return {
                                        poseId: undefined,
                                        sort_english_name: s.name,
                                        secondary: s.secondary,
                                        alignment_cues: '',
                                        breathSeries: newVal,
                                      }
                                    }
                                    return {
                                      ...(it as any),
                                      breathSeries: newVal,
                                    }
                                  })

                                dispatch({
                                  type: 'SET_FLOW_SERIES',
                                  payload: {
                                    ...state.flowSeries,
                                    seriesPoses: newSeries,
                                  },
                                })
                              }}
                              inputProps={{
                                'aria-label': `Breath cue for ${name}`,
                              }}
                              sx={{ mt: 1 }}
                            >
                              <MenuItem value="">(none)</MenuItem>
                              {BREATH_SERIES_OPTIONS.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </TextField>

                            <TextField
                              placeholder="Optional alignment cues (max 1000 characters)"
                              variant="standard"
                              multiline
                              minRows={1}
                              value={alignmentCues}
                              onChange={handleCueChange}
                              inputProps={{
                                maxLength: 1000,
                                'data-testid': `alignment-cues-${index}`,
                                'aria-label': `Alignment cues for ${name}`,
                              }}
                              sx={{ mt: 1 }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: 'text.secondary' }}
                            >
                              {alignmentCues.length}/1000
                            </Typography>
                          </Stack>
                        </Stack>
                      )
                    })}
                  </Stack>
                )}
              </Box>

              <Box sx={{ width: '100%', maxWidth: 900 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: 'primary.main',
                    mb: 1,
                  }}
                >
                  Description
                </Typography>
                <TextField
                  id="outlined-basic"
                  fullWidth
                  placeholder="Add an optional description for your flow..."
                  multiline
                  minRows={4}
                  variant="outlined"
                  name="description"
                  value={description}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    },
                    '& .MuiInputBase-input': {
                      color: 'primary.contrastText',
                    },
                  }}
                  InputProps={{
                    endAdornment: isDirtyDescription ? (
                      <CheckCircleIcon
                        sx={{
                          color: 'success.main',
                          alignSelf: 'flex-start',
                          mt: 1,
                        }}
                      />
                    ) : null,
                  }}
                />
              </Box>

              <Box sx={{ width: '100%', maxWidth: 900 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: 'primary.main',
                    mb: 1,
                  }}
                >
                  Flow Image
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Upload one image to represent this flow. Something
                  inspirational that captures the essence of your Flow.
                </Typography>

                {uploadedImages.length === 0 ? (
                  <ImageManagement
                    title=""
                    variant="upload-only"
                    onImageUploaded={handleImageUploaded}
                    uploadTitle="Upload Flow Image"
                    uploadSubtitle="Drag and drop an image here, or click to select (one image only)"
                  />
                ) : (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="body2"
                      color="success.main"
                      gutterBottom
                    >
                      <CheckCircleIcon
                        sx={{
                          fontSize: 16,
                          mr: 0.5,
                          verticalAlign: 'middle',
                        }}
                      />
                      Flow image uploaded successfully
                    </Typography>
                    <Box
                      sx={{
                        mt: 2,
                        maxWidth: 300,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '2px solid',
                        borderColor: 'success.light',
                      }}
                    >
                      <Box
                        component="img"
                        src={uploadedImages[0].url}
                        alt={uploadedImages[0].altText || 'Flow image'}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: 'success.lighter',
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <ImageIcon sx={{ fontSize: 14 }} />
                          {uploadedImages[0].fileName || 'Flow Image'}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => {
                        setUploadedImages([])
                        dispatch({
                          type: 'SET_FLOW_SERIES',
                          payload: {
                            ...state.flowSeries,
                            image: '',
                          },
                        })
                      }}
                      sx={{ mt: 2 }}
                    >
                      Remove Image
                    </Button>
                  </Box>
                )}
              </Box>

              <Box
                data-testid="action-bar"
                sx={{
                  position: 'sticky',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  py: 2,
                  px: 2,
                  mt: 4,
                  width: '100%',
                  boxSizing: 'border-box',
                  zIndex: 10,
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={session === null}
                    startIcon={<SaveIcon />}
                    sx={{
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      width: { xs: '100%', sm: 'auto' },
                      minWidth: { sm: '200px' },
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    {AppText.APP_BUTTON_CREATE_FLOW}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<CloseIcon />}
                    sx={{
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      width: { xs: '100%', sm: 'auto' },
                      minWidth: { sm: '160px' },
                    }}
                    onClick={handleCancel}
                  >
                    {AppText.APP_BUTTON_CANCEL}
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </form>
        </Stack>
      </Box>

      <HelpDrawer
        content={HELP_PATHS.flows.createFlow}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
