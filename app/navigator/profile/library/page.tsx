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
  CircularProgress,
  Alert,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Pagination,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useSession } from 'next-auth/react'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import { UseUser } from '@app/context/UserContext'
import { useIsAdmin } from '@app/hooks/useCanEditContent'
import Image from 'next/image'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AllInclusiveIcon from '@mui/icons-material/AllInclusive'
import PagesIcon from '@mui/icons-material/Pages'
import { deleteSeries } from '@lib/seriesService'
import { deletePose } from '@lib/poseService'
import { deleteSequence } from '@lib/sequenceService'
import { getUserPoseImages, type PoseImageData } from '@lib/imageService'
import {
  UserAsanaData,
  UserSeriesData,
  UserSequenceData,
} from '@lib/userLibraryService'
import useProfileLibrary from '@app/hooks/useProfileLibrary'
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
  const router = useNavigationWithLoading()
  const isAdmin = useIsAdmin()
  const [tabValue, setTabValue] = useState(0)

  // Get profile images count from UserContext
  const profileImagesCount = state.userData.profileImages?.length || 0

  // Error states
  const [error, setError] = useState<string | null>(null)
  const [showCursorAlert, setShowCursorAlert] = useState(false)

  // Use paginated library hooks for each content type
  const [paginationMode, setPaginationMode] = useState<'infinite' | 'paged'>(
    'infinite'
  )

  const asanasLibrary = useProfileLibrary({
    type: 'asanas',
    pageSize: 12,
    mode: paginationMode,
  })
  const seriesLibrary = useProfileLibrary({
    type: 'series',
    pageSize: 12,
    mode: paginationMode,
  })
  const sequencesLibrary = useProfileLibrary({
    type: 'sequences',
    pageSize: 12,
    mode: paginationMode,
  })

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  useEffect(() => {
    // Trigger initial loads when session becomes available
    if (session?.user?.email) {
      asanasLibrary.refresh()
      seriesLibrary.refresh()
      sequencesLibrary.refresh()
      // show cursor alerts if any hook reported invalid cursor
      if (asanasLibrary && (asanasLibrary as any).invalidCursor)
        setShowCursorAlert(true)
      if (seriesLibrary && (seriesLibrary as any).invalidCursor)
        setShowCursorAlert(true)
      if (sequencesLibrary && (sequencesLibrary as any).invalidCursor)
        setShowCursorAlert(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email, isAdmin])

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

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="body1" color="text.secondary">
                Manage all the content you&apos;ve created in the app
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                <IconButton
                  onClick={() => setPaginationMode('infinite')}
                  aria-label={
                    paginationMode === 'infinite'
                      ? 'Infinite pagination (selected)'
                      : 'Enable infinite pagination'
                  }
                  title={
                    paginationMode === 'infinite'
                      ? 'Infinite (selected)'
                      : 'Infinite'
                  }
                  sx={{
                    p: 1,
                    minWidth: 0,
                    bgcolor:
                      paginationMode === 'infinite'
                        ? 'primary.main'
                        : 'transparent',
                    color:
                      paginationMode === 'infinite'
                        ? 'common.white'
                        : 'text.secondary',
                    border: paginationMode === 'infinite' ? 'none' : 1,
                    borderColor:
                      paginationMode === 'infinite' ? 'transparent' : 'divider',
                    '&:hover': {
                      bgcolor:
                        paginationMode === 'infinite'
                          ? 'primary.dark'
                          : 'action.hover',
                    },
                  }}
                >
                  <AllInclusiveIcon />
                </IconButton>

                <IconButton
                  onClick={() => setPaginationMode('paged')}
                  aria-label={
                    paginationMode === 'paged'
                      ? 'Paged pagination (selected)'
                      : 'Enable paged pagination'
                  }
                  title={
                    paginationMode === 'paged' ? 'Paged (selected)' : 'Paged'
                  }
                  sx={{
                    p: 1,
                    minWidth: 0,
                    bgcolor:
                      paginationMode === 'paged'
                        ? 'primary.main'
                        : 'transparent',
                    color:
                      paginationMode === 'paged'
                        ? 'common.white'
                        : 'text.secondary',
                    border: paginationMode === 'paged' ? 'none' : 1,
                    borderColor:
                      paginationMode === 'paged' ? 'transparent' : 'divider',
                    '&:hover': {
                      bgcolor:
                        paginationMode === 'paged'
                          ? 'primary.dark'
                          : 'action.hover',
                    },
                  }}
                >
                  <PagesIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {showCursorAlert && (
            <Alert
              severity="info"
              sx={{ mb: 3 }}
              onClose={() => setShowCursorAlert(false)}
            >
              Some pages had an invalid pagination cursor; the view was reset to
              the first page.
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
                <Tab
                  label={`Asanas (${asanasLibrary.totalCount ?? asanasLibrary.items.length})`}
                  {...a11yProps(0)}
                />
                <Tab
                  label={`Flows (${seriesLibrary.totalCount ?? seriesLibrary.items.length})`}
                  {...a11yProps(1)}
                />
                <Tab
                  label={`Sequences (${sequencesLibrary.totalCount ?? sequencesLibrary.items.length})`}
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
                asanas={asanasLibrary.items as UserAsanaData[]}
                loading={asanasLibrary.loading}
                onAsanaDeleted={() => asanasLibrary.refresh()}
                isAdmin={isAdmin}
                loadMore={asanasLibrary.loadMore}
                hasMore={asanasLibrary.hasMore}
                page={asanasLibrary.page}
                setPage={asanasLibrary.setPage}
                totalCount={asanasLibrary.totalCount}
                pageSize={12}
                paginationMode={paginationMode}
              />
            </TabPanel>

            {/* Series Tab */}
            <TabPanel value={tabValue} index={1}>
              <SeriesLibrary
                series={seriesLibrary.items as UserSeriesData[]}
                loading={seriesLibrary.loading}
                onSeriesDeleted={() => seriesLibrary.refresh()}
                loadMore={seriesLibrary.loadMore}
                hasMore={seriesLibrary.hasMore}
                page={seriesLibrary.page}
                setPage={seriesLibrary.setPage}
                totalCount={seriesLibrary.totalCount}
                pageSize={12}
                paginationMode={paginationMode}
              />
            </TabPanel>

            {/* Sequences Tab */}
            <TabPanel value={tabValue} index={2}>
              <SequencesLibrary
                sequences={sequencesLibrary.items as UserSequenceData[]}
                loading={sequencesLibrary.loading}
                onSequenceDeleted={() => sequencesLibrary.refresh()}
                loadMore={sequencesLibrary.loadMore}
                hasMore={sequencesLibrary.hasMore}
                page={sequencesLibrary.page}
                setPage={sequencesLibrary.setPage}
                totalCount={sequencesLibrary.totalCount}
                pageSize={12}
                paginationMode={paginationMode}
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
  isAdmin,
  loadMore,
  hasMore,
  page,
  setPage,
  totalCount,
  pageSize,
  paginationMode,
}: {
  asanas: UserAsanaData[]
  loading: boolean
  onAsanaDeleted: () => void
  isAdmin: boolean
  loadMore?: () => Promise<void>
  hasMore?: boolean
  page?: number | undefined
  setPage?: ((p: number) => Promise<void>) | undefined
  totalCount?: number | null
  pageSize?: number
  paginationMode?: 'infinite' | 'paged'
}) {
  const router = useNavigationWithLoading()
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')

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
      {/* View Toggle Controls + Page Info */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          gap: 1,
        }}
      >
        <Box>
          {page !== undefined ? (
            <Typography variant="body2" color="text.secondary">
              {totalCount && pageSize
                ? `Viewing page ${page} of ${Math.max(1, Math.ceil((totalCount ?? 0) / pageSize))}`
                : `Viewing page ${page}`}
            </Typography>
          ) : paginationMode === 'infinite' ? (
            <Typography variant="body2" color="text.secondary">
              {`Viewing ${asanas.length} images of ${totalCount ?? asanas.length} available`}
            </Typography>
          ) : null}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <IconButton
            onClick={() => setViewMode('card')}
            aria-label={
              viewMode === 'card'
                ? 'Currently in card view'
                : 'Switch to card view'
            }
            sx={{
              color: viewMode === 'card' ? 'primary.main' : 'text.secondary',
              p: 1,
              minWidth: 0,
              cursor: viewMode === 'card' ? 'default' : 'pointer',
              pointerEvents: viewMode === 'card' ? 'none' : 'auto',
              opacity: viewMode === 'card' ? 1 : 0.6,
              '&:hover': {
                opacity: 1,
              },
            }}
            title={viewMode === 'card' ? 'Card View (current)' : 'Card View'}
          >
            <ViewModuleIcon />
          </IconButton>

          <IconButton
            onClick={() => setViewMode('list')}
            aria-label={
              viewMode === 'list'
                ? 'Currently in list view'
                : 'Switch to list view'
            }
            sx={{
              color: viewMode === 'list' ? 'primary.main' : 'text.secondary',
              p: 1,
              minWidth: 0,
              cursor: viewMode === 'list' ? 'default' : 'pointer',
              pointerEvents: viewMode === 'list' ? 'none' : 'auto',
              opacity: viewMode === 'list' ? 1 : 0.6,
              '&:hover': {
                opacity: 1,
              },
            }}
            title={viewMode === 'list' ? 'List View (current)' : 'List View'}
          >
            <FormatListBulletedIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Card View */}
      {viewMode === 'card' && (
        <Grid container spacing={3}>
          {asanas.map((asana) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={asana.id}>
              <AsanaCard
                asana={asana}
                onDeleted={onAsanaDeleted}
                isAdmin={isAdmin}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {asanas.map((asana) => (
            <AsanaListItem
              key={asana.id}
              asana={asana}
              onDeleted={onAsanaDeleted}
              isAdmin={isAdmin}
            />
          ))}
        </Box>
      )}

      {/* Pagination controls (paged mode uses numeric pages; infinite mode no Load more) */}
      {page !== undefined ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          {/* Use MUI Pagination with chevrons and page count */}
          {/* Compute count from totalCount and pageSize when available */}
          <Pagination
            count={
              totalCount && pageSize
                ? Math.max(1, Math.ceil(totalCount / pageSize))
                : 1
            }
            page={page}
            onChange={(_e, value) => {
              if (setPage) setPage(value)
            }}
            showFirstButton={false}
            showLastButton={false}
            siblingCount={0}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            aria-label="Profile library pagination"
          />
        </Box>
      ) : // Infinite mode: show a down-chevron load more button when a loadMore handler exists
      loadMore ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <IconButton
            aria-label="Load more library items"
            onClick={() => {
              if (loadMore) loadMore()
            }}
            disabled={loading || !hasMore}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: '50%',
              boxShadow: 1,
              width: 56,
              height: 56,
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      ) : null}
    </Box>
  )
}

// Series Library Component
function SeriesLibrary({
  series,
  loading,
  onSeriesDeleted,
  loadMore,
  hasMore,
  page,
  setPage,
  totalCount,
  pageSize,
  paginationMode,
}: {
  series: UserSeriesData[]
  loading: boolean
  onSeriesDeleted?: () => void
  loadMore?: () => Promise<void>
  hasMore?: boolean
  page?: number | undefined
  setPage?: ((p: number) => Promise<void>) | undefined
  totalCount?: number | null
  pageSize?: number
  paginationMode?: 'infinite' | 'paged'
}) {
  const router = useNavigationWithLoading()
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading your flows...
        </Typography>
      </Box>
    )
  }

  if (series.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" gutterBottom>
          No flows created yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create your first flow to group related asanas together
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/navigator/flows/createSeries')}
        >
          Create Your First Flow
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* View Toggle Controls + Page Info */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          gap: 1,
        }}
      >
        <Box>
          {page !== undefined ? (
            <Typography variant="body2" color="text.secondary">
              {totalCount && pageSize
                ? `Viewing page ${page} of ${Math.max(1, Math.ceil((totalCount ?? 0) / pageSize))}`
                : `Viewing page ${page}`}
            </Typography>
          ) : paginationMode === 'infinite' ? (
            <Typography variant="body2" color="text.secondary">
              {`Viewing ${series.length} images of ${totalCount ?? series.length} available`}
            </Typography>
          ) : null}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <IconButton
            onClick={() => setViewMode('card')}
            aria-label={
              viewMode === 'card'
                ? 'Currently in card view'
                : 'Switch to card view'
            }
            sx={{
              color: viewMode === 'card' ? 'primary.main' : 'text.secondary',
              p: 1,
              minWidth: 0,
              cursor: viewMode === 'card' ? 'default' : 'pointer',
              pointerEvents: viewMode === 'card' ? 'none' : 'auto',
              opacity: viewMode === 'card' ? 1 : 0.6,
              '&:hover': {
                opacity: 1,
              },
            }}
            title={viewMode === 'card' ? 'Card View (current)' : 'Card View'}
          >
            <ViewModuleIcon />
          </IconButton>

          <IconButton
            onClick={() => setViewMode('list')}
            aria-label={
              viewMode === 'list'
                ? 'Currently in list view'
                : 'Switch to list view'
            }
            sx={{
              color: viewMode === 'list' ? 'primary.main' : 'text.secondary',
              p: 1,
              minWidth: 0,
              cursor: viewMode === 'list' ? 'default' : 'pointer',
              pointerEvents: viewMode === 'list' ? 'none' : 'auto',
              opacity: viewMode === 'list' ? 1 : 0.6,
              '&:hover': {
                opacity: 1,
              },
            }}
            title={viewMode === 'list' ? 'List View (current)' : 'List View'}
          >
            <FormatListBulletedIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Card View */}
      {viewMode === 'card' && (
        <Grid container spacing={3}>
          {series.map((seriesItem) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={seriesItem.id}>
              <SeriesCard series={seriesItem} onDeleted={onSeriesDeleted} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {series.map((seriesItem) => (
            <SeriesListItem
              key={seriesItem.id}
              series={seriesItem}
              onDeleted={onSeriesDeleted}
            />
          ))}
        </Box>
      )}

      {page !== undefined ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={
              totalCount && pageSize
                ? Math.max(1, Math.ceil(totalCount / pageSize))
                : 1
            }
            page={page}
            onChange={(_e, value) => {
              if (setPage) setPage(value)
            }}
            showFirstButton={false}
            showLastButton={false}
            siblingCount={0}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            aria-label="Profile library pagination"
          />
        </Box>
      ) : loadMore ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <IconButton
            aria-label="Load more library items"
            onClick={() => {
              if (loadMore) loadMore()
            }}
            disabled={loading || !hasMore}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: '50%',
              boxShadow: 1,
              width: 56,
              height: 56,
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      ) : null}
    </Box>
  )
}

// Sequences Library Component
function SequencesLibrary({
  sequences,
  loading,
  onSequenceDeleted,
  loadMore,
  hasMore,
  page,
  setPage,
  totalCount,
  pageSize,
  paginationMode,
}: {
  sequences: UserSequenceData[]
  loading: boolean
  onSequenceDeleted?: () => void
  loadMore?: () => Promise<void>
  hasMore?: boolean
  page?: number | undefined
  setPage?: ((p: number) => Promise<void>) | undefined
  totalCount?: number | null
  pageSize?: number
  paginationMode?: 'infinite' | 'paged'
}) {
  // Note: SequencesLibrary can optionally show paged controls if the hook provides `page` and `setPage` props.
  const router = useNavigationWithLoading()
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')

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
      {/* View Toggle Controls + Page Info */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          gap: 1,
        }}
      >
        <Box>
          {page !== undefined ? (
            <Typography variant="body2" color="text.secondary">
              {totalCount && pageSize
                ? `Viewing page ${page} of ${Math.max(1, Math.ceil((totalCount ?? 0) / pageSize))}`
                : `Viewing page ${page}`}
            </Typography>
          ) : paginationMode === 'infinite' ? (
            <Typography variant="body2" color="text.secondary">
              {`Viewing ${sequences.length} images of ${totalCount ?? sequences.length} available`}
            </Typography>
          ) : null}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <IconButton
            onClick={() => setViewMode('card')}
            aria-label={
              viewMode === 'card'
                ? 'Currently in card view'
                : 'Switch to card view'
            }
            sx={{
              color: viewMode === 'card' ? 'primary.main' : 'text.secondary',
              p: 1,
              minWidth: 0,
              cursor: viewMode === 'card' ? 'default' : 'pointer',
              pointerEvents: viewMode === 'card' ? 'none' : 'auto',
              opacity: viewMode === 'card' ? 1 : 0.6,
              '&:hover': {
                opacity: 1,
              },
            }}
            title={viewMode === 'card' ? 'Card View (current)' : 'Card View'}
          >
            <ViewModuleIcon />
          </IconButton>

          <IconButton
            onClick={() => setViewMode('list')}
            aria-label={
              viewMode === 'list'
                ? 'Currently in list view'
                : 'Switch to list view'
            }
            sx={{
              color: viewMode === 'list' ? 'primary.main' : 'text.secondary',
              p: 1,
              minWidth: 0,
              cursor: viewMode === 'list' ? 'default' : 'pointer',
              pointerEvents: viewMode === 'list' ? 'none' : 'auto',
              opacity: viewMode === 'list' ? 1 : 0.6,
              '&:hover': {
                opacity: 1,
              },
            }}
            title={viewMode === 'list' ? 'List View (current)' : 'List View'}
          >
            <FormatListBulletedIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Card View */}
      {viewMode === 'card' && (
        <Grid container spacing={3}>
          {sequences.map((sequence) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={sequence.id}>
              <SequenceCard sequence={sequence} onDeleted={onSequenceDeleted} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sequences.map((sequence) => (
            <SequenceListItem
              key={sequence.id}
              sequence={sequence}
              onDeleted={onSequenceDeleted}
            />
          ))}
        </Box>
      )}

      {page !== undefined ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={
              totalCount && pageSize
                ? Math.max(1, Math.ceil(totalCount / pageSize))
                : 1
            }
            page={page}
            onChange={(_e, value) => {
              if (setPage) setPage(value)
            }}
            showFirstButton={false}
            showLastButton={false}
            siblingCount={0}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            aria-label="Profile library pagination"
          />
        </Box>
      ) : loadMore ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <IconButton
            aria-label="Load more library items"
            onClick={() => {
              if (loadMore) loadMore()
            }}
            disabled={loading || !hasMore}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: '50%',
              boxShadow: 1,
              width: 56,
              height: 56,
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      ) : null}
    </Box>
  )
}

// Individual List Item Component for Asanas
function AsanaListItem({
  asana,
  onDeleted,
  isAdmin,
}: {
  asana: UserAsanaData
  onDeleted: () => void
  isAdmin: boolean
}) {
  const router = useNavigationWithLoading()
  const [images, setImages] = useState<PoseImageData[]>([])
  const [imagesLoading, setImagesLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchImages = async () => {
      setImagesLoading(true)
      try {
        const response = await getUserPoseImages(
          1,
          0,
          asana.id,
          asana.sort_english_name,
          isAdmin
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
    e.stopPropagation()
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      await deletePose(asana.id)
      setDeleteDialogOpen(false)
      onDeleted()
    } catch (error) {
      console.error('Error deleting asana:', error)
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  return (
    <Paper
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: 4,
        },
      }}
      onClick={() => router.push(`/navigator/asanaPoses/${asana.id}`)}
    >
      {/* Image thumbnail */}
      <Box
        sx={{
          width: 80,
          height: 80,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 1,
          flexShrink: 0,
          mr: 2,
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
            }}
          >
            <CircularProgress size={20} />
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
            <Typography variant="caption" color="text.secondary">
              No image
            </Typography>
          </Box>
        )}
      </Box>

      {/* Asana name */}
      <Typography
        variant="body1"
        sx={{
          flexGrow: 1,
          fontWeight: 500,
        }}
      >
        {asana.sort_english_name}
      </Typography>

      {/* Action buttons */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexShrink: 0,
        }}
      >
        <IconButton
          size="small"
          title="Edit"
          onClick={(e) => {
            e.stopPropagation()
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
        aria-labelledby="delete-asana-list-dialog-title"
        aria-describedby="delete-asana-list-dialog-description"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle id="delete-asana-list-dialog-title">
          Delete Asana?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-asana-list-dialog-description">
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
    </Paper>
  )
}

// Individual List Item Component for Series
function SeriesListItem({
  series,
  onDeleted,
}: {
  series: UserSeriesData
  onDeleted?: () => void
}) {
  const router = useNavigationWithLoading()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteDialogOpen(true)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!series.id) return

    setIsDeleting(true)
    try {
      await deleteSeries(series.id)
      setDeleteDialogOpen(false)
      if (onDeleted) {
        onDeleted()
      }
    } catch (error) {
      console.error('Failed to delete series:', error)
      setIsDeleting(false)
    }
  }

  return (
    <Paper
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: 4,
        },
      }}
      onClick={() =>
        router.push(`/navigator/flows/practiceSeries?id=${series.id}`)
      }
    >
      {/* Series info */}
      <Box sx={{ flexGrow: 1, mr: 2 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            mb: 0.5,
          }}
        >
          {series.seriesName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {series.description && series.description.length > 100
            ? `${series.description.substring(0, 100)}...`
            : series.description || 'No description provided'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {series.seriesPoses.length} pose
          {series.seriesPoses.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Action buttons */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexShrink: 0,
        }}
      >
        <IconButton
          size="small"
          title="Edit"
          onClick={(e) => {
            e.stopPropagation()
            router.push(
              `/navigator/flows/practiceSeries?id=${series.id}&edit=true`
            )
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
        aria-labelledby="delete-series-list-dialog-title"
        aria-describedby="delete-series-list-dialog-description"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle id="delete-series-list-dialog-title">
          Delete Flow?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-series-list-dialog-description">
            Are you sure you want to delete &quot;{series.seriesName}&quot;?
            This action cannot be undone.
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
    </Paper>
  )
}

// Individual List Item Component for Sequences
function SequenceListItem({
  sequence,
  onDeleted,
}: {
  sequence: UserSequenceData
  onDeleted?: () => void
}) {
  const router = useNavigationWithLoading()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteDialogOpen(true)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!sequence.id) return

    setIsDeleting(true)
    try {
      await deleteSequence(String(sequence.id))
      setDeleteDialogOpen(false)
      if (onDeleted) {
        onDeleted()
      }
    } catch (error) {
      console.error('Failed to delete sequence:', error)
      setIsDeleting(false)
    }
  }

  return (
    <Paper
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: 4,
        },
      }}
      onClick={() => router.push(`/navigator/sequences/${sequence.id}`)}
    >
      {/* Sequence info */}
      <Box sx={{ flexGrow: 1, mr: 2 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            mb: 0.5,
          }}
        >
          {sequence.nameSequence}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {sequence.description && sequence.description.length > 100
            ? `${sequence.description.substring(0, 100)}...`
            : sequence.description || 'No description provided'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {sequence.sequencesSeries.length} flow
            {sequence.sequencesSeries.length !== 1 ? 's' : ''}
          </Typography>
          {sequence.durationSequence && (
            <Typography variant="caption" color="text.secondary">
              Duration: {sequence.durationSequence}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Action buttons */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexShrink: 0,
        }}
      >
        <IconButton
          size="small"
          title="Edit"
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/navigator/sequences/${sequence.id}?edit=true`)
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
        aria-labelledby="delete-sequence-list-dialog-title"
        aria-describedby="delete-sequence-list-dialog-description"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle id="delete-sequence-list-dialog-title">
          Delete Sequence?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-sequence-list-dialog-description">
            Are you sure you want to delete &quot;{sequence.nameSequence}
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
    </Paper>
  )
}

// Individual Card Components
function AsanaCard({
  asana,
  onDeleted,
  isAdmin,
}: {
  asana: UserAsanaData
  onDeleted: () => void
  isAdmin: boolean
}) {
  const router = useNavigationWithLoading()
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
          asana.sort_english_name,
          isAdmin
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

function SeriesCard({
  series,
  onDeleted,
}: {
  series: UserSeriesData
  onDeleted?: () => void
}) {
  const router = useNavigationWithLoading()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click navigation
    setDeleteDialogOpen(true)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!series.id) return

    setIsDeleting(true)
    try {
      await deleteSeries(series.id)
      setDeleteDialogOpen(false)
      // Call the onDeleted callback to refresh the list
      if (onDeleted) {
        onDeleted()
      }
    } catch (error) {
      console.error('Failed to delete series:', error)
      setIsDeleting(false)
      // Keep dialog open on error so user can try again
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
            router.push(
              `/navigator/flows/practiceSeries?id=${series.id}&edit=true`
            )
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
        aria-labelledby="delete-series-dialog-title"
        aria-describedby="delete-series-dialog-description"
        onClick={(e) => e.stopPropagation()} // Prevent card click when clicking dialog
      >
        <DialogTitle id="delete-series-dialog-title">Delete Flow?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-series-dialog-description">
            Are you sure you want to delete &quot;{series.seriesName}&quot;?
            This action cannot be undone.
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

function SequenceCard({
  sequence,
  onDeleted,
}: {
  sequence: UserSequenceData
  onDeleted?: () => void
}) {
  const router = useNavigationWithLoading()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click navigation
    setDeleteDialogOpen(true)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!sequence.id) return

    setIsDeleting(true)
    try {
      await deleteSequence(String(sequence.id))
      setDeleteDialogOpen(false)
      // Call the onDeleted callback to refresh the list
      if (onDeleted) {
        onDeleted()
      }
    } catch (error) {
      console.error('Failed to delete sequence:', error)
      setIsDeleting(false)
      // Keep dialog open on error so user can try again
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
            router.push(`/navigator/sequences/${sequence.id}?edit=true`)
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
        aria-labelledby="delete-sequence-dialog-title"
        aria-describedby="delete-sequence-dialog-description"
        onClick={(e) => e.stopPropagation()} // Prevent card click when clicking dialog
      >
        <DialogTitle id="delete-sequence-dialog-title">
          Delete Sequence?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-sequence-dialog-description">
            Are you sure you want to delete &quot;{sequence.nameSequence}
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
