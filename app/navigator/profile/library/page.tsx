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
  Paper,
  Stack,
  CircularProgress,
  Alert,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { UseUser } from '@app/context/UserContext'
import Image from 'next/image'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import EditSeriesDialog, {
  Series as EditSeriesShape,
  Asana as EditAsanaShape,
} from '@app/navigator/flows/editSeries/EditSeriesDialog'
import { updateSeries, deleteSeries } from '@lib/seriesService'
import { deletePose } from '@lib/poseService'
import { splitSeriesPoseEntry } from '@app/utils/asana/seriesPoseLabels'
import { getUserPoseImages, type PoseImageData } from '@lib/imageService'
import {
  UserAsanaData,
  UserSeriesData,
  UserSequenceData,
  getUserCreatedAsanas,
  getUserCreatedSeries,
  getUserCreatedSequences,
} from '@lib/userLibraryService'
import ProfileNavMenu from '@app/navigator/profile/ProfileNavMenu'
import ImageManagement from '@app/clientComponents/imageUpload/ImageManagement'

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
  const { state } = UseUser()
  const router = useRouter()
  const [tabValue, setTabValue] = useState(0)

  // State for different content types
  const [asanas, setAsanas] = useState<UserAsanaData[]>([])
  const [series, setSeries] = useState<UserSeriesData[]>([])
  const [sequences, setSequences] = useState<UserSequenceData[]>([])

  // Get profile images count from UserContext
  const profileImagesCount = state.userData.profileImages?.length || 0

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Profile Navigation Menu */}
          <Grid size={{ xs: 12, md: 4 }}>
            <ProfileNavMenu />
          </Grid>

          {/* Library Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Please sign in to view your library
              </Alert>
              <Button
                variant="contained"
                onClick={() => router.push('/auth/signin')}
              >
                Sign In
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Navigation Menu */}
        <Grid size={{ xs: 12, md: 4 }}>
          <ProfileNavMenu />
        </Grid>

        {/* Library Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            My Library
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Manage all the content you&apos;ve created in the app
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
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
                <Tab
                  label={`Sequences (${sequences.length})`}
                  {...a11yProps(2)}
                />
                <Tab
                  label={`Profile Images (${profileImagesCount})`}
                  {...a11yProps(3)}
                />
              </Tabs>
            </Box>

            {/* Asanas Tab */}
            <TabPanel value={tabValue} index={0}>
              <AsanasLibrary
                asanas={asanas}
                loading={asanasLoading}
                onAsanaDeleted={fetchUserAsanas}
              />
            </TabPanel>

            {/* Series Tab */}
            <TabPanel value={tabValue} index={1}>
              <SeriesLibrary series={series} loading={seriesLoading} />
            </TabPanel>

            {/* Sequences Tab */}
            <TabPanel value={tabValue} index={2}>
              <SequencesLibrary
                sequences={sequences}
                loading={sequencesLoading}
              />
            </TabPanel>

            {/* Profile Images Tab */}
            <TabPanel value={tabValue} index={3}>
              <ImageManagement title="" variant="profile-only" />
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

// Asanas Library Component
function AsanasLibrary({
  asanas,
  loading,
  onAsanaDeleted,
}: {
  asanas: UserAsanaData[]
  loading: boolean
  onAsanaDeleted: () => void
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
          onClick={() => router.push('/navigator/asanaPoses/createAsana')}
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
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={asana.id}>
            <AsanaCard asana={asana} onDeleted={onAsanaDeleted} />
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
}: {
  series: UserSeriesData[]
  loading: boolean
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
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={seriesItem.id}>
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
}: {
  sequences: UserSequenceData[]
  loading: boolean
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
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={sequence.id}>
            <SequenceCard sequence={sequence} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

// Individual Card Components
function AsanaCard({
  asana,
  onDeleted,
}: {
  asana: UserAsanaData
  onDeleted: () => void
}) {
  const router = useRouter()
  const [images, setImages] = useState<PoseImageData[]>([])
  const [imagesLoading, setImagesLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click navigation
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      await deletePose(asana.id)
      setDeleteDialogOpen(false)
      // Refresh the asanas list after successful deletion
      onDeleted()
    } catch (error) {
      console.error('Error deleting asana:', error)
      // TODO: Show error message to user
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={() => router.push(`/navigator/asanaPoses/${asana.id}`)}
    >
      <CardMedia
        sx={{
          height: 180,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
          m: 1.5,
          mb: 0,
        }}
      >
        {imagesLoading ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              bgcolor: 'grey.100',
              borderRadius: 2,
            }}
          >
            <CircularProgress size={30} />
          </Box>
        ) : images.length > 0 ? (
          <Image
            src={images[0].url}
            alt={images[0].altText || asana.sort_english_name}
            fill
            style={{ objectFit: 'cover', borderRadius: '8px' }}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              bgcolor: 'grey.100',
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No image
            </Typography>
          </Box>
        )}
      </CardMedia>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="body1"
          component="h3"
          gutterBottom
          sx={{ fontWeight: 500, textAlign: 'center' }}
        >
          {asana.sort_english_name}
        </Typography>
      </CardContent>

      <Box
        sx={{
          px: 2,
          pb: 2,
          pt: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <IconButton
          size="small"
          title="Edit"
          onClick={(e) => {
            e.stopPropagation() // Prevent card click navigation
            router.push(`/navigator/asanaPoses/${asana.id}?edit=true`)
          }}
          sx={{ color: 'text.secondary' }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          title="Delete"
          onClick={handleDeleteClick}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-asana-dialog-title"
        aria-describedby="delete-asana-dialog-description"
        onClick={(e) => e.stopPropagation()} // Prevent card click when clicking dialog
      >
        <DialogTitle id="delete-asana-dialog-title">Delete Asana?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-asana-dialog-description">
            Are you sure you want to delete &quot;{asana.sort_english_name}
            &quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            color="primary"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : null}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

function SeriesCard({ series }: { series: UserSeriesData }) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)

  // Map UserSeriesData to EditSeriesDialog shape
  const dialogSeries: EditSeriesShape = {
    id: series.id || '',
    name: series.seriesName,
    description: series.description || '',
    difficulty: 'beginner',
    asanas: (series.seriesPoses || []).map((sp, idx) => {
      let name = ''
      let secondary = ''
      if (typeof sp === 'string') {
        const parsed = splitSeriesPoseEntry(sp)
        name = parsed.name
        secondary = parsed.secondary
      } else {
        name = (sp as any).sort_english_name || ''
        secondary = (sp as any).secondary || ''
      }
      const resolvedName = name || `asana-${idx}`
      const asana: EditAsanaShape = {
        id: `${idx}-${resolvedName}`,
        name: resolvedName,
        difficulty: secondary,
      }
      return asana
    }),
    created_by: series.createdBy || '',
  }

  const handleSave = async (updated: EditSeriesShape) => {
    try {
      await updateSeries(updated.id, updated)
      setEditOpen(false)
      // optionally trigger a refresh via router or a parent callback; omitted here
    } catch (e) {
      console.error('Failed to update series', e)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteSeries(id)
      setEditOpen(false)
      // Force page refresh to update the series list
      router.refresh()
      // Optionally redirect to the library to ensure clean state
      window.location.reload()
    } catch (e) {
      console.error('Failed to delete series', e)
    }
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={() =>
        router.push(`/navigator/flows/practiceSeries?id=${series.id}`)
      }
    >
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
          {series.seriesPoses.length} pose
          {series.seriesPoses.length !== 1 ? 's' : ''}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Created: {new Date(series.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            title="Edit"
            onClick={(e) => {
              e.stopPropagation() // Prevent card click navigation
              setEditOpen(true)
            }}
          >
            <EditIcon />
          </IconButton>
        </Stack>
      </Box>
      {editOpen ? (
        <Box sx={{ p: 2 }}>
          <EditSeriesDialog
            inline
            open={editOpen}
            onClose={() => setEditOpen(false)}
            series={dialogSeries}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        </Box>
      ) : null}
    </Card>
  )
}

function SequenceCard({ sequence }: { sequence: UserSequenceData }) {
  const router = useRouter()

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={() => router.push(`/navigator/sequences/${sequence.id}`)}
    >
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

        {sequence.durationSequence && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            Duration: {sequence.durationSequence}
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
            title="Edit"
            onClick={(e) => {
              e.stopPropagation() // Prevent card click navigation
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
