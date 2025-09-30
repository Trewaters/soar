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
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useSession } from 'next-auth/react'

interface AsanaOption {
  id: string
  english_names: string[]
  sanskrit_names: string | null
  sort_english_name: string
  difficulty: string
  category: string
  created_by: string
}

interface AddAsanasDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (asanas: AsanaOption[]) => void
  excludeAsanaIds?: string[]
  refreshTrigger?: number // Add this to trigger data refresh
}

export default function AddAsanasDialog({
  open,
  onClose,
  onAdd,
  excludeAsanaIds = [],
  refreshTrigger = 0, // Add this parameter
}: AddAsanasDialogProps) {
  const { data: session } = useSession()
  const [availableAsanas, setAvailableAsanas] = useState<AsanaOption[]>([])
  const [filteredAsanas, setFilteredAsanas] = useState<AsanaOption[]>([])
  const [selectedAsanas, setSelectedAsanas] = useState<AsanaOption[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Add a manual refresh function
  const refreshAsanas = async () => {
    console.log('🔄 AddAsanasDialog: Manual refresh triggered')
    setLoading(true)
    setError(null)

    try {
      // Add cache-busting parameter to ensure fresh data
      const timestamp = new Date().getTime()
      const fetchUrl = `/api/poses?_t=${timestamp}`
      console.log('📡 AddAsanasDialog: Manual refresh fetching from:', fetchUrl)

      const response = await fetch(fetchUrl, {
        // Force cache bypass
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch asanas')
      }

      const asanas: AsanaOption[] = await response.json()
      console.log(
        '✅ AddAsanasDialog: Manual refresh received asanas:',
        asanas.length,
        'total'
      )

      // Filter out asanas that are already in the series
      const filtered = asanas.filter(
        (asana) => !excludeAsanaIds.includes(asana.id)
      )
      console.log(
        '🔍 AddAsanasDialog: Manual refresh filtered asanas:',
        filtered.length,
        'available to add'
      )

      setAvailableAsanas(filtered)
      setFilteredAsanas(filtered)
    } catch (err) {
      console.error('❌ AddAsanasDialog: Manual refresh error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load asanas')
    } finally {
      setLoading(false)
    }
  }

  // Fetch available asanas when dialog opens or when refreshTrigger changes
  useEffect(() => {
    const fetchAvailableAsanas = async () => {
      console.log('🔄 AddAsanasDialog: Fetching asanas...', {
        open,
        userEmail: session?.user?.email,
        refreshTrigger,
        excludeAsanaIds: excludeAsanaIds.length,
      })
      setLoading(true)
      setError(null)

      try {
        // Add cache-busting parameter to ensure fresh data
        const timestamp = new Date().getTime()
        const fetchUrl = `/api/poses?_t=${timestamp}`
        console.log('📡 AddAsanasDialog: Fetching from:', fetchUrl)

        const response = await fetch(fetchUrl, {
          // Force cache bypass
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch asanas')
        }

        const asanas: AsanaOption[] = await response.json()
        console.log(
          '✅ AddAsanasDialog: Received asanas:',
          asanas.length,
          'total'
        )

        // Filter out asanas that are already in the series
        const filtered = asanas.filter(
          (asana) => !excludeAsanaIds.includes(asana.id)
        )
        console.log(
          '🔍 AddAsanasDialog: Filtered asanas:',
          filtered.length,
          'available to add'
        )

        setAvailableAsanas(filtered)
        setFilteredAsanas(filtered)
      } catch (err) {
        console.error('❌ AddAsanasDialog: Error fetching asanas:', err)
        setError(err instanceof Error ? err.message : 'Failed to load asanas')
      } finally {
        setLoading(false)
      }
    }

    if (open && session?.user?.email) {
      fetchAvailableAsanas()
    }
  }, [open, session?.user?.email, excludeAsanaIds, refreshTrigger]) // Add refreshTrigger to dependencies

  // Filter asanas based on search term
  useEffect(() => {
    const filtered = availableAsanas.filter((asana) => {
      const englishNames = asana.english_names.join(' ').toLowerCase()
      const sanskritName =
        typeof asana.sanskrit_names === 'string'
          ? asana.sanskrit_names.toLowerCase()
          : ''
      const category = asana.category?.toLowerCase() || ''
      const difficulty = asana.difficulty?.toLowerCase() || ''

      const searchLower = searchTerm.toLowerCase()

      return (
        englishNames.includes(searchLower) ||
        sanskritName.includes(searchLower) ||
        category.includes(searchLower) ||
        difficulty.includes(searchLower)
      )
    })
    setFilteredAsanas(filtered)
  }, [availableAsanas, searchTerm])

  const handleAsanaToggle = (asana: AsanaOption) => {
    setSelectedAsanas((prev) => {
      const isSelected = prev.some((selected) => selected.id === asana.id)
      if (isSelected) {
        return prev.filter((selected) => selected.id !== asana.id)
      } else {
        return [...prev, asana]
      }
    })
  }

  const handleAdd = () => {
    onAdd(selectedAsanas)
    handleClose()
  }

  const handleClose = () => {
    setSelectedAsanas([])
    setSearchTerm('')
    setError(null)
    // Clear cached data when closing to ensure fresh data on next open
    setAvailableAsanas([])
    setFilteredAsanas([])
    onClose()
  }

  const isAsanaSelected = (asana: AsanaOption) =>
    selectedAsanas.some((selected) => selected.id === asana.id)

  const getAsanaDisplayName = (asana: AsanaOption) => {
    const englishName = asana.english_names[0] || asana.sort_english_name
    const sanskritName =
      typeof asana.sanskrit_names === 'string' ? asana.sanskrit_names : ''
    return sanskritName ? `${englishName} (${sanskritName})` : englishName
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="add-asanas-title"
    >
      <DialogTitle id="add-asanas-title">Add Asanas to Series</DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search asanas by name, category, or difficulty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              onClick={refreshAsanas}
              disabled={loading}
              startIcon={<RefreshIcon />}
              variant="outlined"
              sx={{ minWidth: 'auto', px: 2 }}
              title="Refresh asana list"
            >
              Refresh
            </Button>
          </Box>

          {selectedAsanas.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Selected Asanas ({selectedAsanas.length}):
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedAsanas.map((asana) => (
                  <Chip
                    key={asana.id}
                    label={getAsanaDisplayName(asana)}
                    onDelete={() => handleAsanaToggle(asana)}
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
            {filteredAsanas.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary={
                    searchTerm
                      ? 'No asanas found matching your search'
                      : 'No asanas available to add'
                  }
                />
              </ListItem>
            ) : (
              filteredAsanas.map((asana) => (
                <ListItem
                  key={asana.id}
                  onClick={() => handleAsanaToggle(asana)}
                  dense
                  sx={{ cursor: 'pointer' }}
                >
                  <ListItemText
                    primary={getAsanaDisplayName(asana)}
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        {asana.difficulty && (
                          <Chip
                            label={asana.difficulty}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        )}
                        {asana.category && (
                          <Chip
                            label={asana.category}
                            size="small"
                            color="default"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      checked={isAsanaSelected(asana)}
                      onChange={() => handleAsanaToggle(asana)}
                      inputProps={{
                        'aria-labelledby': `add-asana-${asana.id}`,
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
          disabled={selectedAsanas.length === 0}
        >
          Add {selectedAsanas.length} Asana
          {selectedAsanas.length !== 1 ? 's' : ''}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
