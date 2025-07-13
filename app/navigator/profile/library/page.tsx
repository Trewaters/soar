'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  IconButton,
  Button,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
  getUserCreatedAsanas,
  getUserCreatedSeries,
  getUserCreatedSequences,
  type UserAsanaData,
  type UserSeriesData,
  type UserSequenceData,
} from '@lib/userLibraryService'
import { getUserPoseImages, type PoseImageData } from '@lib/imageService'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`library-tabpanel-${index}`}
      aria-labelledby={`library-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `library-tab-${index}`,
    'aria-controls': `library-tabpanel-${index}`,
  }
}

export default function LibraryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tabValue, setTabValue] = useState(0)

  // State for different content types
  const [asanas, setAsanas] = useState<UserAsanaData[]>([])
  const [series, setSeries] = useState<UserSeriesData[]>([])
  const [sequences, setSequences] = useState<UserSequenceData[]>([])

  // Loading states
  const [asanasLoading, setAsanasLoading] = useState(false)
  const [seriesLoading, setSeriesLoading] = useState(false)
  const [sequencesLoading, setSequencesLoading] = useState(false)

  // Error states
  const [error, setError] = useState<string | null>(null)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // Fetch user's created asanas
  const fetchUserAsanas = async () => {
    if (!session?.user?.email) return

    setAsanasLoading(true)
    setError(null)
    try {
      const userAsanas = await getUserCreatedAsanas(session.user.email)
      setAsanas(userAsanas)
    } catch (error) {
      console.error('Error fetching user asanas:', error)
      setError('Failed to load your asanas')
    } finally {
      setAsanasLoading(false)
    }
  }

  // Fetch user's created series
  const fetchUserSeries = async () => {
    if (!session?.user?.email) return

    setSeriesLoading(true)
    setError(null)
    try {
      const userSeries = await getUserCreatedSeries(session.user.email)
      setSeries(userSeries)
    } catch (error) {
      console.error('Error fetching user series:', error)
      setError('Failed to load your series')
    } finally {
      setSeriesLoading(false)
    }
  }

  // Fetch user's created sequences
  const fetchUserSequences = async () => {
    if (!session?.user?.email) return

    setSequencesLoading(true)
    setError(null)
    try {
      const userSequences = await getUserCreatedSequences(session.user.email)
      setSequences(userSequences)
    } catch (error) {
      console.error('Error fetching user sequences:', error)
      setError('Failed to load your sequences')
    } finally {
      setSequencesLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserAsanas()
      fetchUserSeries()
      fetchUserSequences()
    }
  }, [session?.user?.email])

  if (status === 'loading') {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading your library...
        </Typography>
      </Container>
    )
  }

  if (!session) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please sign in to view your library
        </Alert>
        <Button variant="contained" onClick={() => router.push('/auth/signin')}>
          Sign In
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h1" component="h1" gutterBottom>
        My Library
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage all the content you&apos;ve created in the app
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="library content tabs"
            variant="fullWidth"
          >
            <Tab label={`Asanas (${asanas.length})`} {...a11yProps(0)} />
            <Tab label={`Series (${series.length})`} {...a11yProps(1)} />
            <Tab label={`Sequences (${sequences.length})`} {...a11yProps(2)} />
          </Tabs>
        </Box>

        {/* Asanas Tab */}
        <TabPanel value={tabValue} index={0}>
          <AsanasLibrary
            asanas={asanas}
            loading={asanasLoading}
            onRefresh={fetchUserAsanas}
          />
        </TabPanel>

        {/* Series Tab */}
        <TabPanel value={tabValue} index={1}>
          <SeriesLibrary
            series={series}
            loading={seriesLoading}
            onRefresh={fetchUserSeries}
          />
        </TabPanel>

        {/* Sequences Tab */}
        <TabPanel value={tabValue} index={2}>
          <SequencesLibrary
            sequences={sequences}
            loading={sequencesLoading}
            onRefresh={fetchUserSequences}
          />
        </TabPanel>
      </Paper>
    </Container>
  )
}

// Asanas Library Component
function AsanasLibrary({
  asanas,
  loading,
  onRefresh,
}: {
  asanas: UserAsanaData[]
  loading: boolean
  onRefresh: () => void
}) {
  const router = useRouter()

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading your asanas...
        </Typography>
      </Box>
    )
  }

  if (asanas.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" gutterBottom>
          No asanas created yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Start building your yoga library by creating your first asana
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/navigator/asanaPostures/createAsana')}
        >
          Create Your First Asana
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {asanas.map((asana) => (
          <Grid item xs={12} sm={6} md={4} key={asana.id}>
            <AsanaCard asana={asana} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

// Series Library Component
function SeriesLibrary({
  series,
  loading,
  onRefresh,
}: {
  series: UserSeriesData[]
  loading: boolean
  onRefresh: () => void
}) {
  const router = useRouter()

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading your series...
        </Typography>
      </Box>
    )
  }

  if (series.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" gutterBottom>
          No series created yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create your first series to group related asanas together
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/navigator/flows/createSeries')}
        >
          Create Your First Series
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {series.map((seriesItem) => (
          <Grid item xs={12} sm={6} md={4} key={seriesItem.id}>
            <SeriesCard series={seriesItem} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

// Sequences Library Component
function SequencesLibrary({
  sequences,
  loading,
  onRefresh,
}: {
  sequences: UserSequenceData[]
  loading: boolean
  onRefresh: () => void
}) {
  const router = useRouter()

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading your sequences...
        </Typography>
      </Box>
    )
  }

  if (sequences.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" gutterBottom>
          No sequences created yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create your first sequence to organize multiple series into a complete
          practice
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/navigator/flows/createSequence')}
        >
          Create Your First Sequence
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {sequences.map((sequence) => (
          <Grid item xs={12} sm={6} md={4} key={sequence.id}>
            <SequenceCard sequence={sequence} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

// Individual Card Components
function AsanaCard({ asana }: { asana: UserAsanaData }) {
  const router = useRouter()
  const [images, setImages] = useState<PoseImageData[]>([])
  const [imagesLoading, setImagesLoading] = useState(false)

  useEffect(() => {
    const fetchImages = async () => {
      setImagesLoading(true)
      try {
        const response = await getUserPoseImages(
          5,
          0,
          asana.id,
          asana.sort_english_name
        )
        setImages(response.images)
      } catch (error) {
        console.error('Error fetching asana images:', error)
      } finally {
        setImagesLoading(false)
      }
    }

    fetchImages()
  }, [asana.id, asana.sort_english_name])

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia sx={{ height: 200, position: 'relative', overflow: 'hidden' }}>
        {imagesLoading ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              bgcolor: 'grey.100',
            }}
          >
            <CircularProgress size={30} />
          </Box>
        ) : images.length > 0 ? (
          <Image
            src={images[0].url}
            alt={images[0].altText || asana.sort_english_name}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              bgcolor: 'grey.100',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No image
            </Typography>
          </Box>
        )}
      </CardMedia>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {asana.sort_english_name}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip label={asana.category} size="small" />
          <Chip label={asana.difficulty} size="small" variant="outlined" />
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {asana.description?.length > 100
            ? `${asana.description.substring(0, 100)}...`
            : asana.description}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Created: {new Date(asana.created_on).toLocaleDateString()}
        </Typography>

        {images.length > 0 && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block' }}
          >
            {images.length} image{images.length > 1 ? 's' : ''}
          </Typography>
        )}
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={() =>
              router.push(
                `/navigator/asanaPostures/${encodeURIComponent(asana.sort_english_name)}`
              )
            }
            title="View"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            size="small"
            title="Edit"
            onClick={() => {
              // TODO: Create edit functionality
              console.log('Edit asana:', asana.id)
            }}
          >
            <EditIcon />
          </IconButton>
        </Stack>
      </Box>
    </Card>
  )
}

function SeriesCard({ series }: { series: UserSeriesData }) {
  const router = useRouter()

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {series.seriesName}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {series.description && series.description.length > 100
            ? `${series.description.substring(0, 100)}...`
            : series.description || 'No description provided'}
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          {series.seriesPostures.length} posture
          {series.seriesPostures.length !== 1 ? 's' : ''}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Created: {new Date(series.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={() =>
              router.push(`/navigator/flows/practiceSeries?id=${series.id}`)
            }
            title="View"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            size="small"
            title="Edit"
            onClick={() => {
              // TODO: Create edit functionality
              console.log('Edit series:', series.id)
            }}
          >
            <EditIcon />
          </IconButton>
        </Stack>
      </Box>
    </Card>
  )
}

function SequenceCard({ sequence }: { sequence: UserSequenceData }) {
  const router = useRouter()

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {sequence.nameSequence}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {sequence.description && sequence.description.length > 100
            ? `${sequence.description.substring(0, 100)}...`
            : sequence.description || 'No description provided'}
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          {sequence.sequencesSeries.length} series
        </Typography>

        {sequence.duration && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            Duration: {sequence.duration}
          </Typography>
        )}

        <Typography variant="caption" color="text.secondary">
          Created: {new Date(sequence.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={() =>
              router.push(
                `/navigator/flows/practiceSequences?id=${sequence.id}`
              )
            }
            title="View"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            size="small"
            title="Edit"
            onClick={() => {
              // TODO: Create edit functionality
              console.log('Edit sequence:', sequence.id)
            }}
          >
            <EditIcon />
          </IconButton>
        </Stack>
      </Box>
    </Card>
  )
}
