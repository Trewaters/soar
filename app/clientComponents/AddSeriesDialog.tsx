'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Typography,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Avatar,
  ListItemAvatar,
} from '@mui/material'
import SearchField from './form/SearchField'
import { useSession } from 'next-auth/react'

interface SeriesOption {
  id: string
  seriesName: string
  seriesPoses: string[]
  description?: string
  image?: string
  durationSeries?: string
  created_by?: string
}

interface AddSeriesDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (series: SeriesOption[]) => void
  excludeSeriesIds?: string[]
}

export default function AddSeriesDialog({
  open,
  onClose,
  onAdd,
  excludeSeriesIds = [],
}: AddSeriesDialogProps) {
  const { data: session } = useSession()
  const [availableSeries, setAvailableSeries] = useState<SeriesOption[]>([])
  const [filteredSeries, setFilteredSeries] = useState<SeriesOption[]>([])
  const [selectedSeries, setSelectedSeries] = useState<SeriesOption[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch available series when dialog opens
  useEffect(() => {
    const fetchAvailableSeries = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/series')
        if (!response.ok) {
          throw new Error('Failed to fetch series')
        }

        const series: SeriesOption[] = await response.json()

        // Filter out series that are already in the sequence
        const filtered = series.filter(
          (series) => !excludeSeriesIds.includes(series.id)
        )

        setAvailableSeries(filtered)
        setFilteredSeries(filtered)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load series')
      } finally {
        setLoading(false)
      }
    }

    if (open && session?.user?.email) {
      fetchAvailableSeries()
    }
  }, [open, session?.user?.email, excludeSeriesIds])

  // Filter series based on search term
  useEffect(() => {
    const filtered = availableSeries.filter((series) => {
      const seriesName = series.seriesName?.toLowerCase() || ''
      const description = series.description?.toLowerCase() || ''
      const poseCount = series.seriesPoses?.length.toString() || ''

      const searchLower = searchTerm.toLowerCase()

      return (
        seriesName.includes(searchLower) ||
        description.includes(searchLower) ||
        poseCount.includes(searchLower)
      )
    })
    setFilteredSeries(filtered)
  }, [availableSeries, searchTerm])

  const handleSeriesToggle = (series: SeriesOption) => {
    setSelectedSeries((prev) => {
      const isSelected = prev.some((selected) => selected.id === series.id)
      if (isSelected) {
        return prev.filter((selected) => selected.id !== series.id)
      } else {
        return [...prev, series]
      }
    })
  }

  const handleAdd = () => {
    onAdd(selectedSeries)
    handleClose()
  }

  const handleClose = () => {
    setSelectedSeries([])
    setSearchTerm('')
    setError(null)
    onClose()
  }

  const isSeriesSelected = (series: SeriesOption) =>
    selectedSeries.some((selected) => selected.id === series.id)

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="add-series-title"
    >
      <DialogTitle id="add-series-title">Add Series to Sequence</DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <SearchField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search series by name, description, or pose count..."
            onClear={() => setSearchTerm('')}
            sx={{ mb: 2 }}
          />

          {selectedSeries.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Selected Series ({selectedSeries.length}):
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedSeries.map((series) => (
                  <Chip
                    key={series.id}
                    label={`${series.seriesName} (${series.seriesPoses?.length || 0} poses)`}
                    onDelete={() => handleSeriesToggle(series)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredSeries.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary={
                    searchTerm
                      ? 'No series found matching your search'
                      : 'No series available to add'
                  }
                />
              </ListItem>
            ) : (
              filteredSeries.map((series) => (
                <ListItem
                  key={series.id}
                  onClick={() => handleSeriesToggle(series)}
                  dense
                  sx={{ cursor: 'pointer' }}
                >
                  <ListItemAvatar>
                    <Avatar src={series.image} alt={series.seriesName}>
                      {series.seriesName?.[0]?.toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={series.seriesName}
                    secondary={
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                        }}
                      >
                        {series.description && (
                          <Typography variant="body2" color="text.secondary">
                            {series.description.length > 60
                              ? `${series.description.substring(0, 60)}...`
                              : series.description}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={`${series.seriesPoses?.length || 0} poses`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          {series.durationSeries && (
                            <Chip
                              label={series.durationSeries}
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      checked={isSeriesSelected(series)}
                      onChange={() => handleSeriesToggle(series)}
                      inputProps={{
                        'aria-labelledby': `add-series-${series.id}`,
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            )}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          disabled={selectedSeries.length === 0}
        >
          Add {selectedSeries.length} Series
        </Button>
      </DialogActions>
    </Dialog>
  )
}
