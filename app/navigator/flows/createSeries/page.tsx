'use client'
import React from 'react'
import { useFlowSeries } from '@app/context/AsanaSeriesContext'
import { FEATURES } from '@app/FEATURES'
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Paper,
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
import AutocompleteComponent from '@app/clientComponents/autocomplete-search'
import Image from 'next/image'
import { AppText } from '@app/navigator/constants/Strings'
import {
  formatSeriesPoseEntry,
  splitSeriesPoseEntry,
} from '@app/utils/asana/seriesPoseLabels'
import { AsanaPose } from 'types/asana'
import ImageManagement from '@app/clientComponents/imageUpload/ImageManagement'
import type { PoseImageData } from '@app/clientComponents/imageUpload/ImageUpload'
import ImageIcon from '@mui/icons-material/Image'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HelpButton from '@app/clientComponents/HelpButton'
import HelpDrawer from '@app/clientComponents/HelpDrawer'
import { HELP_PATHS } from '@app/utils/helpLoader'

export default function Page() {
  const { data: session } = useSession()
  const { state, dispatch } = useFlowSeries()
  const { seriesName, seriesPoses, breath, description, duration, image } =
    state.flowSeries
  const [poses, setPoses] = useState<AsanaPose[]>([])
  const [uploadedImages, setUploadedImages] = useState<PoseImageData[]>([])
  const router = useNavigationWithLoading()
  const [open, setOpen] = React.useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [isDirtyDescription, setIsDirtyDescription] = useState(false)
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
    if (session === null) {
      router.push('/navigator/flows')
      return
    }

    fetchPoses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, session?.user?.email])

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

  function handleSelect(
    event: React.SyntheticEvent<Element, Event>,
    value: AsanaPose | null
  ) {
    event.preventDefault()
    if (value) {
      const simplifiedName =
        Array.isArray(value.sanskrit_names) && value.sanskrit_names[0]
          ? value.sanskrit_names[0]
          : ''
      const formattedEntry = formatSeriesPoseEntry(
        value.sort_english_name,
        simplifiedName
      )
      dispatch({
        type: 'SET_FLOW_SERIES',
        payload: {
          ...state.flowSeries,
          seriesPoses: [...state.flowSeries.seriesPoses, formattedEntry],
        },
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const updatedSeries = {
      ...state.flowSeries,
      seriesName,
      seriesPoses,
      breath,
      description,
      duration,
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
        throw new Error('Network response was not ok')
      }
      const data = await response.json()

      // Redirect to the series detail page if we got an ID back
      if (data.id) {
        router.push(`/navigator/flows/practiceSeries?id=${data.id}`)
        return
      }

      return data
    } catch (error: Error | any) {
      console.error('Error creating series:', error.message)
    }
    // Fallback to flows page if something went wrong
    router.push('/navigator/flows')
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
      default:
        break
    }
  }

  const handleImageUploaded = React.useCallback(
    (img: PoseImageData) => {
      // Only keep one image - replace the array instead of appending
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
    router.push('/navigator/flows')
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 4,
          mb: 4,
        }}
      >
        <Stack spacing={2} sx={{ marginX: 3, mb: '1em', width: 'fit-content' }}>
          <SplashHeader
            src={'/icons/designImages/header-create-series.png'}
            alt={'Create Flow'}
            title="Create Flow"
          />
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              width: '87%',
              maxWidth: '384px',
              alignSelf: 'center',
            }}
          >
            <SubNavHeader mode="back" link="/navigator/flows" />
            <HelpButton onClick={() => setOpen(!open)} />
          </Stack>
          {FEATURES.SHOW_CREATE_SERIES && (
            <form onSubmit={handleSubmit}>
              <Box sx={{ px: 4, pb: 12 }}>
                {/* Flow Name Input - Primary field with improved visibility */}
                <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="primary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
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
                      },
                      '& .MuiInputBase-input': { color: 'primary.main' },
                    }}
                    InputProps={{
                      endAdornment: isDirty ? (
                        <CheckCircleIcon sx={{ color: 'success.main' }} />
                      ) : null,
                    }}
                  />
                </Paper>

                {/* Add Poses to Flow */}
                <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="primary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    Add Poses to Flow
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Search and select poses to add to your flow sequence
                  </Typography>
                  <FormControl sx={{ width: '100%' }}>
                    <AutocompleteComponent
                      options={poses.sort((a, b) =>
                        a.sort_english_name.localeCompare(b.sort_english_name)
                      )}
                      getOptionLabel={(option) =>
                        (option as AsanaPose).sort_english_name
                      }
                      renderOption={(props, option) => {
                        const poseOption = option as AsanaPose
                        return (
                          <li {...props} key={poseOption.id}>
                            {poseOption.sort_english_name}
                          </li>
                        )
                      }}
                      placeholder="Search for a pose to add..."
                      onChange={(event, value) =>
                        handleSelect(event, value as AsanaPose | null)
                      }
                      renderInput={() => (
                        <TextField placeholder="Search poses..." />
                      )}
                    />
                  </FormControl>
                </Paper>

                <Box className="journal">
                  {/* Series Image Section */}
                  <Paper
                    elevation={1}
                    sx={{ p: 3, mb: 3, borderRadius: '12px' }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      color="primary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      Series Image
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Upload one image to represent this series. This will help
                      identify your series in the library.
                    </Typography>

                    {uploadedImages.length === 0 ? (
                      <ImageManagement
                        title=""
                        variant="upload-only"
                        onImageUploaded={handleImageUploaded}
                        uploadTitle="Upload Series Image"
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
                          Series image uploaded successfully
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
                            alt={uploadedImages[0].altText || 'Series image'}
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
                              {uploadedImages[0].fileName || 'Series Image'}
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
                  </Paper>

                  {/* Pose List Section */}
                  <Paper
                    elevation={1}
                    sx={{ p: 3, mb: 3, borderRadius: '12px' }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      color="primary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      Your Flow Sequence{' '}
                      {seriesPoses.length > 0 &&
                        `(${seriesPoses.length} poses)`}
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

                          if (typeof entry === 'string') {
                            const split = splitSeriesPoseEntry(entry)
                            name = split.name
                            secondary = split.secondary
                          } else if (entry && typeof entry === 'object') {
                            name = (entry as any).sort_english_name || ''
                            secondary = (entry as any).secondary || ''
                            alignmentCues = (entry as any).alignment_cues || ''
                          }

                          const handleRemove = () => {
                            dispatch({
                              type: 'SET_FLOW_SERIES',
                              payload: {
                                ...state.flowSeries,
                                seriesPoses:
                                  state.flowSeries.seriesPoses.filter(
                                    (_, i) => i !== index
                                  ),
                              },
                            })
                          }

                          const handleCueChange = (
                            e: React.ChangeEvent<any>
                          ) => {
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
                  </Paper>

                  {/* Description Section */}
                  <Paper
                    elevation={1}
                    sx={{ p: 3, mb: 3, borderRadius: '12px' }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      color="primary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <Image
                        src={'/icons/designImages/leaf-2.svg'}
                        alt=""
                        height={21}
                        width={21}
                      />
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
                        },
                        '& .MuiInputBase-input': { color: 'primary.main' },
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
                  </Paper>
                </Box>

                {/* Action Bar - In document flow above bottom navigation */}
                <Box
                  data-testid="action-bar"
                  sx={{
                    position: 'relative',
                    mt: 3,
                    backgroundColor: 'background.paper',
                    border: '2px solid',
                    borderColor: 'primary.main',
                    py: 2.5,
                    px: 3,
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={session === null}
                      sx={{
                        borderRadius: '12px',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        minWidth: { xs: '100%', sm: '200px' },
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      {AppText.APP_BUTTON_SUBMIT}
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{
                        borderRadius: '12px',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        minWidth: { xs: '100%', sm: '160px' },
                      }}
                      onClick={handleCancel}
                    >
                      Start Over
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </form>
          )}
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
