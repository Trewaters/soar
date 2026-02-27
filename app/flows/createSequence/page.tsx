'use client'
import { FlowSeriesData } from '@context/AsanaSeriesContext'
import { SequenceData } from '@context/SequenceContext'
import {
  Box,
  Button,
  IconButton,
  FormGroup,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react'
// removed unused icon imports to silence lint warnings
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import SplashHeader from '@app/clientComponents/splash-header'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import HelpButton from '@app/clientComponents/HelpButton'
import HelpDrawer from '@app/clientComponents/HelpDrawer'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { ArrowBack, ArrowForward } from '@mui/icons-material'
import Image from 'next/image'
import { AppText } from '@app/constants/Strings'
import { splitSeriesPoseEntry } from '@app/utils/asana/seriesPoseLabels'
import GroupedDataAssetSearch from '@clientComponents/GroupedDataAssetSearch'
import { getAllSeries } from '@lib/seriesService'
import ImageUpload from '@clientComponents/imageUpload/ImageUpload'
import { HELP_PATHS } from '@app/utils/helpLoader'

export default function Page() {
  const { data: session, status } = useSession()

  const [sequences, setSequences] = useState<SequenceData>({
    id: 0,
    nameSequence: '',
    sequencesSeries: [],
    description: '',
    durationSequence: '',
    image: '',
  })

  const [nameSequence, setNameSequence] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('')
  const [image, setImage] = useState('')

  const [flowSeries, setFlowSeries] = useState<FlowSeriesData[]>([])
  const [seriesNameSet, setSeriesNameSet] = useState<string[]>([])
  const [poses, setPoses] = useState<Array<string | any>>([])
  const [open, setOpen] = useState(false)

  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(
    seriesNameSet.length - 1
  )

  const router = useNavigationWithLoading()

  // Throttling refs to prevent rapid/overlapping API calls
  const lastFetchKeyRef = useRef<string | null>(null)
  const lastFetchTimeRef = useRef<number>(0)
  const fetchInFlightRef = useRef<boolean>(false)

  // Enrich series data with normalized createdBy field like in practiceSeries
  const enrichedSeries = useMemo(
    () =>
      (flowSeries || []).map((s) => ({
        ...s,
        createdBy: (s as any).createdBy ?? (s as any).created_by ?? undefined,
      })),
    [flowSeries]
  )

  const fetchSeries = useCallback(async () => {
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
      const seriesData = await getAllSeries()

      if (seriesData) {
        setFlowSeries(seriesData as FlowSeriesData[])
      }
    } catch (error: Error | any) {
      console.error('[CreateSequence] Error fetching series:', error.message)
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
      fetchSeries()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.email])

  // Ensure poses are updated when a new series is added
  function handleSelect(value: FlowSeriesData | null) {
    if (value) {
      setSeriesNameSet((prevSeriesNameSet) => [
        ...prevSeriesNameSet,
        value.seriesName,
      ])
      setPoses(value.seriesPoses)
      setSequences({
        ...sequences,
        sequencesSeries: [...sequences.sequencesSeries, value],
      })
      const newIndex = seriesNameSet.length // Update index when a new series is added
      setCurrentSeriesIndex(newIndex)
      updatePoses(newIndex)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const updatedSequence = {
      ...sequences,
      nameSequence,
      sequencesSeries: sequences.sequencesSeries,
      description,
      duration,
      image,
    }

    try {
      const response = await fetch('/api/sequences/createSequence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
        body: JSON.stringify(updatedSequence),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()

      // Ensure the sequence was created successfully before navigating
      if (data.sequence) {
        // Navigate to the newly created sequence detail page
        router.push(`/sequences/${data.sequence.id}`)
      } else {
        throw new Error('Sequence creation returned no sequence data')
      }
    } catch (error: Error | any) {
      console.error('Error creating sequence:', error.message)
    }
    handleCancel()
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    switch (name) {
      case 'nameSequence':
        setNameSequence(value)
        setIsDirtyName(value.length > 0)
        break
      case 'seriesName':
        setSeriesNameSet((prev) => [...prev, value])
        break
      case 'description':
        setDescription(value)
        setIsDirtyDescription(event.target.value.length > 0)
        break
      case 'duration':
        setDuration(value)
        break
      case 'image':
        setImage(value)
        break
    }
  }

  function handleCancel() {
    // Navigate to Sequence search view
    router.push('/flows/practiceSequences')
  }

  // open state toggled inline where needed (HelpButton / HelpDrawer)

  // Function to update poses based on the current series index
  const updatePoses = (index: number) => {
    const seriesName = seriesNameSet[index]
    const series = flowSeries.find((s) => s.seriesName === seriesName)
    if (series) {
      setPoses(series.seriesPoses)
    }
  }

  // Update handleNextSeries to call updatePoses
  const handleNextSeries = () => {
    setCurrentSeriesIndex((prevIndex) => {
      const newIndex = Math.min(prevIndex + 1, seriesNameSet.length - 1)
      updatePoses(newIndex)
      return newIndex
    })
  }

  // Update handlePreviousSeries to call updatePoses
  const handlePreviousSeries = () => {
    setCurrentSeriesIndex((prevIndex) => {
      const newIndex = Math.max(prevIndex - 1, 0)
      updatePoses(newIndex)
      return newIndex
    })
  }

  const currentSeriesName = seriesNameSet[currentSeriesIndex] || ''
  const [isDirtyName, setIsDirtyName] = useState(false)
  const [isDirtyDescription, setIsDirtyDescription] = useState(false)

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
        <Stack sx={{ marginX: 3, marginY: 3, mb: '1em' }}>
          <SplashHeader
            src={'/images/header-create-sequences.png'}
            alt={'Create Sequences'}
            title="Create Sequences"
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
            <SubNavHeader mode="back" link="/flows" />
            <HelpButton onClick={() => setOpen(!open)} />
          </Stack>
          <Box sx={{ px: 2, pb: 20 }}>
            <>
              <FormGroup sx={{ mt: 4 }}>
                {/* Sequence Name Input - Primary field with improved visibility */}
                <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="primary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    Sequence Name *
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="sequence-name"
                    name="nameSequence"
                    value={nameSequence}
                    onChange={handleChange}
                    placeholder="Give your Sequence a name..."
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                      '& .MuiInputBase-input': {
                        color: 'primary.contrastText',
                      },
                    }}
                    InputProps={{
                      endAdornment: isDirtyName ? (
                        <CheckCircleIcon sx={{ color: 'success.main' }} />
                      ) : null,
                    }}
                  />
                </Paper>

                {/* Add Series to Sequence */}
                <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="primary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    Add Series to Sequence
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Search and select series (flows) to add to your sequence
                  </Typography>
                  <GroupedDataAssetSearch<FlowSeriesData>
                    items={enrichedSeries}
                    myLabel="My Flows"
                    publicLabel="Public Flows"
                    searchField={(item) => item.seriesName}
                    displayField={(item) => item.seriesName}
                    placeholderText="Search for a Series to add..."
                    getCreatedBy={(item) => (item as any).createdBy}
                    onSelect={(selectedFlow) => {
                      handleSelect(selectedFlow)
                    }}
                  />
                </Paper>

                {/* List of Series in this Sequence */}
                <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="primary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    Your Sequence{' '}
                    {seriesNameSet.length > 0 &&
                      `(${seriesNameSet.length} series)`}
                  </Typography>
                  {seriesNameSet.length === 0 ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ py: 2, textAlign: 'center' }}
                    >
                      No series added yet. Use the search above to add series to
                      your sequence.
                    </Typography>
                  ) : (
                    <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
                      {seriesNameSet.map((series, index) => (
                        <Box
                          key={`${series}+${index}`}
                          display="flex"
                          alignItems="center"
                          sx={{
                            pl: 2,
                            py: 1,
                            borderRadius: '8px',
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              mr: 2,
                              fontWeight: 'bold',
                              color: 'primary.main',
                            }}
                          >
                            {index + 1}.
                          </Typography>
                          <Typography sx={{ flex: 1 }}>{series}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSeriesNameSet((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                              setSequences({
                                ...sequences,
                                sequencesSeries:
                                  sequences.sequencesSeries.filter(
                                    (_, i) => i !== index
                                  ),
                              })
                            }}
                            sx={{ color: 'error.light' }}
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Paper>

                {/* Poses Preview Section - Show poses from selected series */}
                {poses?.length > 0 && (
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
                      {currentSeriesName} - Poses Preview
                    </Typography>
                    <List dense>
                      {poses.map((series, index) => {
                        const { name, secondary } = splitSeriesPoseEntry(series)
                        const alignmentCues =
                          typeof series === 'object' &&
                          series !== null &&
                          series.alignment_cues
                            ? String(series.alignment_cues).split('\n')[0]
                            : ''
                        const itemKey =
                          typeof series === 'string'
                            ? `${series}-${index}`
                            : `${series.id || series.name || name}-${index}`

                        return (
                          <ListItem key={itemKey} sx={{ py: 0.5 }}>
                            <ListItemText
                              primary={
                                <Typography variant="body1">
                                  {name}
                                  {alignmentCues && (
                                    <Typography
                                      component="span"
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ ml: 1 }}
                                    >
                                      ({alignmentCues})
                                    </Typography>
                                  )}
                                </Typography>
                              }
                              secondary={
                                secondary && (
                                  <Typography
                                    variant="body2"
                                    sx={{ fontStyle: 'italic' }}
                                  >
                                    {secondary}
                                  </Typography>
                                )
                              }
                            />
                          </ListItem>
                        )
                      })}
                    </List>
                    {seriesNameSet.length > 1 && (
                      <Stack
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center"
                        sx={{ mt: 2 }}
                      >
                        <IconButton
                          onClick={handlePreviousSeries}
                          disabled={currentSeriesIndex === 0}
                        >
                          <ArrowBack />
                        </IconButton>
                        <Typography sx={{ mx: 2 }}>
                          {currentSeriesIndex + 1} of {seriesNameSet.length}
                        </Typography>
                        <IconButton
                          onClick={handleNextSeries}
                          disabled={
                            currentSeriesIndex === seriesNameSet.length - 1
                          }
                        >
                          <ArrowForward />
                        </IconButton>
                      </Stack>
                    )}
                  </Paper>
                )}

                {/* Description Section */}
                <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="primary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Image
                      src={'/icons/flows/leaf-3.svg'}
                      alt=""
                      height={21}
                      width={21}
                    />
                    Description
                  </Typography>
                  <TextField
                    id="description"
                    fullWidth
                    placeholder="Add an optional description for your sequence..."
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
                </Paper>

                {/* Image Upload Section */}
                <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="primary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Image
                      src={'/icons/flows/leaf-3.svg'}
                      alt=""
                      height={21}
                      width={21}
                    />
                    Sequence Image
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Upload an optional image to represent your sequence
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <ImageUpload
                      uploadTitle="Upload Sequence Image"
                      uploadSubtitle="Drag and drop an image here, or click to select"
                      onImageUploaded={(imageData) => {
                        setImage(imageData.url)
                        setSequences((prev) => ({
                          ...prev,
                          image: imageData.url,
                        }))
                      }}
                      onImageDeleted={() => {
                        setImage('')
                        setSequences((prev) => ({
                          ...prev,
                          image: '',
                        }))
                      }}
                      variant="dropzone"
                    />
                  </Box>
                  {image && (
                    <Box
                      sx={{
                        mt: 2,
                        width: '100%',
                        maxWidth: '400px',
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}
                    >
                      <Image
                        src={image}
                        alt="Sequence preview"
                        width={400}
                        height={300}
                        style={{
                          width: '100%',
                          height: 'auto',
                          objectFit: 'contain',
                        }}
                      />
                    </Box>
                  )}
                </Paper>

                {/* Action Bar - In document flow above bottom navigation */}
                <Box
                  data-testid="action-bar"
                  sx={{
                    position: 'relative',
                    mt: 3,
                    py: 2.5,
                    px: 3,
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
                      onClick={handleSubmit}
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
              </FormGroup>
            </>
          </Box>
        </Stack>
      </Box>

      <HelpDrawer
        content={HELP_PATHS.sequences.createSequences}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
