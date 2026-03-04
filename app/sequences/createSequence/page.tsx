'use client'
import { FlowSeriesData } from '@context/AsanaSeriesContext'
import { SequenceData } from '@context/SequenceContext'
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
import { ArrowBack, ArrowForward } from '@mui/icons-material'
import EditableSeriesList from '@app/clientComponents/EditableSeriesList'
import Image from 'next/image'
import { AppText } from '@app/constants/Strings'
import GroupedDataAssetSearch from '@clientComponents/GroupedDataAssetSearch'
import { getAllSeries } from '@lib/seriesService'
import { getPoseById, getPoseByName } from '@lib/poseService'
import SeriesPoseList from '@app/clientComponents/SeriesPoseList'
import { normalizeSeriesPoses } from '@app/utils/asana/normalizeSeriesPoses'
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
  const [poseIds, setPoseIds] = useState<Record<string, string | null>>({})
  const [open, setOpen] = useState(false)
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(0)

  const router = useNavigationWithLoading()

  // Throttling refs to prevent rapid/overlapping API calls
  const lastFetchKeyRef = useRef<string | null>(null)
  const lastFetchTimeRef = useRef<number>(0)
  const fetchInFlightRef = useRef<boolean>(false)

  // Enrich flow data with normalized createdBy field like in practiceSeries
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
      console.error('[CreateSequence] Error fetching flow:', error.message)
    } finally {
      fetchInFlightRef.current = false
    }
  }, [session?.user?.email])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sequences')
      return
    }

    if (status === 'authenticated') {
      fetchSeries()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.email])

  // Add a flow to the sequence
  function handleSelect(value: FlowSeriesData | null) {
    if (value) {
      const newSeries = [...sequences.sequencesSeries, value]
      setSequences({ ...sequences, sequencesSeries: newSeries })
      setCurrentSeriesIndex(newSeries.length - 1)
    }
  }

  // Handle reorder/delete from EditableSeriesList
  function handleSeriesItemsChange(updatedItems: FlowSeriesData[]) {
    setSequences((prev) => ({ ...prev, sequencesSeries: updatedItems }))
    setCurrentSeriesIndex((prev) => Math.min(prev, updatedItems.length - 1))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmissionError(null)

    // Validate required fields
    if (!nameSequence.trim()) {
      setSubmissionError('Sequence name is required')
      return
    }

    if (sequences.sequencesSeries.length === 0) {
      setSubmissionError('At least one flow is required')
      return
    }

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
        router.push(`/sequences/practiceSequences?id=${data.sequence.id}`)
        return
      } else {
        throw new Error('Sequence creation returned no sequence data')
      }
    } catch (error: Error | any) {
      console.error('Error creating sequence:', error.message)
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    switch (name) {
      case 'nameSequence':
        setNameSequence(value)
        setIsDirtyName(value.length > 0)
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
    router.push('/sequences/practiceSequences')
  }

  // open state toggled inline where needed (HelpButton / HelpDrawer)

  const [isDirtyName, setIsDirtyName] = useState(false)
  const [isDirtyDescription, setIsDirtyDescription] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const currentSeriesName =
    sequences.sequencesSeries[currentSeriesIndex]?.seriesName ?? ''

  const normalizedPreviewPoses = useMemo(() => {
    const poses =
      sequences.sequencesSeries[currentSeriesIndex]?.seriesPoses ?? []
    return normalizeSeriesPoses(poses as any[])
  }, [sequences.sequencesSeries, currentSeriesIndex])

  useEffect(() => {
    let mounted = true

    async function resolvePreviewPoseIds() {
      if (!normalizedPreviewPoses.length) {
        if (mounted) {
          setPoseIds({})
        }
        return
      }

      const uniqueEntries = Array.from(
        new Map(
          normalizedPreviewPoses
            .map((pose) => ({
              poseName: String(pose.sort_english_name || '').trim(),
              poseId: String(pose.poseId || '').trim(),
            }))
            .filter((entry) => entry.poseName.length > 0)
            .map((entry) => [entry.poseName, entry])
        ).values()
      )

      const idPromises = uniqueEntries.map(async ({ poseName, poseId }) => {
        if (poseId) {
          try {
            const pose = await getPoseById(poseId)
            return { poseName, id: pose.id || poseId }
          } catch {
            // Continue to name-based lookup fallback only when stored id is stale.
          }
        }

        try {
          const pose = await getPoseByName(poseName)
          return { poseName, id: pose.id || null }
        } catch {
          return { poseName, id: null }
        }
      })

      const resolved = await Promise.all(idPromises)
      if (!mounted) {
        return
      }

      const idsMap = resolved.reduce(
        (acc, { poseName, id }) => {
          acc[poseName] = id
          return acc
        },
        {} as Record<string, string | null>
      )

      setPoseIds(idsMap)
    }

    resolvePreviewPoseIds()

    return () => {
      mounted = false
    }
  }, [normalizedPreviewPoses])

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
          src={'/images/header-create-sequences.png'}
          alt={'Create Sequences'}
          title="Create Sequences"
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
            <SubNavHeader mode="back" />
            <HelpButton onClick={() => setOpen(!open)} />
          </Stack>
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            justifyContent="space-around"
          >
            <Tooltip title="Save Sequence">
              <IconButton
                aria-label="Save sequence"
                size="small"
                onClick={handleSubmit as any}
                sx={{
                  color: 'primary.main',
                }}
              >
                <SaveIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton
                aria-label="Cancel"
                size="small"
                onClick={handleCancel}
                sx={{
                  color: 'primary.contrastText',
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
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

            {/* Sequence Name Input */}
            <Box sx={{ width: '100%', maxWidth: 900 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}
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
                InputProps={{
                  endAdornment: isDirtyName ? (
                    <CheckCircleIcon sx={{ color: 'success.main' }} />
                  ) : null,
                }}
              />
            </Box>

            {/* Add Flow to Sequence */}
            <Box sx={{ width: '100%', maxWidth: 900 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}
              >
                Add Flow to Sequence
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Search and select flow (flows) to add to your sequence
              </Typography>
              <FormControl sx={{ width: '100%' }}>
                <GroupedDataAssetSearch<FlowSeriesData>
                  items={enrichedSeries}
                  myLabel="My Flows"
                  publicLabel="Public Flows"
                  searchField={(item) => item.seriesName}
                  displayField={(item) => item.seriesName}
                  placeholderText="Search for a Flow to add..."
                  getCreatedBy={(item) => (item as any).createdBy}
                  onSelect={(selectedFlow) => {
                    handleSelect(selectedFlow)
                  }}
                  fullWidth
                />
              </FormControl>
            </Box>

            {/* List of Flow in this Sequence */}
            <Box sx={{ width: '100%', maxWidth: 900 }}>
              <EditableSeriesList
                items={sequences.sequencesSeries as any[]}
                onItemsChange={(updated) =>
                  handleSeriesItemsChange(updated as FlowSeriesData[])
                }
                selectedIndex={currentSeriesIndex}
                onItemClick={(idx) => setCurrentSeriesIndex(idx)}
                title="Your Sequence"
                emptyMessage="No flow added yet. Use the search above to add flow to your sequence."
              />
            </Box>

            {/* Poses Preview - shows poses for the selected flow row */}
            {normalizedPreviewPoses.length > 0 && (
              <Box className="journal" sx={{ width: '100%', maxWidth: 900 }}>
                <Box className="journalTitleContainer" flexDirection={'column'}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: 'text.secondary',
                      width: '100%',
                      textAlign: 'left',
                      alignSelf: 'stretch',
                    }}
                  >
                    Poses Preview
                  </Typography>
                  <Typography variant="h1" textAlign="center">
                    {currentSeriesName}
                  </Typography>
                </Box>
                <SeriesPoseList
                  seriesPoses={normalizedPreviewPoses}
                  poseIds={poseIds}
                  linkColor="primary.main"
                  showAlignmentInline
                  showSecondary
                  showFallbackSecondary
                  dataTestIdPrefix="create-sequence-preview-pose"
                />
                {sequences.sequencesSeries.length > 1 && (
                  <Stack
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ mt: 2 }}
                  >
                    <IconButton
                      onClick={() =>
                        setCurrentSeriesIndex((prev) => Math.max(prev - 1, 0))
                      }
                      disabled={currentSeriesIndex === 0}
                      aria-label="Previous flow"
                    >
                      <ArrowBack />
                    </IconButton>
                    <Typography sx={{ mx: 2 }}>
                      {currentSeriesIndex + 1} of{' '}
                      {sequences.sequencesSeries.length}
                    </Typography>
                    <IconButton
                      onClick={() =>
                        setCurrentSeriesIndex((prev) =>
                          Math.min(
                            prev + 1,
                            sequences.sequencesSeries.length - 1
                          )
                        )
                      }
                      disabled={
                        currentSeriesIndex ===
                        sequences.sequencesSeries.length - 1
                      }
                      aria-label="Next flow"
                    >
                      <ArrowForward />
                    </IconButton>
                  </Stack>
                )}
              </Box>
            )}

            {/* Description Section */}
            <Box sx={{ width: '100%', maxWidth: 900 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}
              >
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

            {/* Image Upload Section */}
            <Box sx={{ width: '100%', maxWidth: 900 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}
              >
                Sequence Image
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
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
            </Box>

            {/* Action Bar */}
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
                  onClick={handleSubmit}
                  disabled={session === null}
                  sx={{
                    borderRadius: '12px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    width: { xs: '100%', sm: 'auto' },
                    minWidth: { sm: '200px' },
                    boxShadow: (theme) => theme.customShadows.cta,
                  }}
                >
                  {AppText.APP_BUTTON_SAVE}
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
                    width: { xs: '100%', sm: 'auto' },
                    minWidth: { sm: '160px' },
                  }}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Box>

      <HelpDrawer
        content={HELP_PATHS.sequences.createSequences}
        open={open}
        onClose={() => setOpen(false)}
      />

      {/* Validation error Snackbar */}
      <Snackbar
        open={!!submissionError}
        autoHideDuration={6000}
        onClose={() => setSubmissionError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSubmissionError(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {submissionError}
        </Alert>
      </Snackbar>
    </>
  )
}
