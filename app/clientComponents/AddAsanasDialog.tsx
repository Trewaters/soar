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
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material'
import SearchField from './form/SearchField'
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
  // eslint-disable-next-line no-unused-vars
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

  // Fetch available asanas when dialog opens or when refreshTrigger changes
  useEffect(() => {
    const fetchAvailableAsanas = async () => {
      setLoading(true)
      setError(null)

      try {
        // Add cache-busting parameter to ensure fresh data
        const timestamp = new Date().getTime()
        const fetchUrl = `/api/poses?_t=${timestamp}`

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

        // Filter out asanas that are already in the series
        const filtered = asanas.filter(
          (asana) => !excludeAsanaIds.includes(asana.id)
        )

        setAvailableAsanas(filtered)
        setFilteredAsanas(filtered)
      } catch (err) {
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
      // Get the primary name (sort_english_name is the canonical name)
      const primaryName = (
        asana.sort_english_name ||
        asana.english_names[0] ||
        ''
      ).toLowerCase()

      // Get individual variant names for separate matching (including the canonical name)
      const allNames = [asana.sort_english_name, ...asana.english_names].filter(
        Boolean
      )
      const variantNames = allNames.map((name) => name.toLowerCase())

      const sanskritName =
        typeof asana.sanskrit_names === 'string'
          ? asana.sanskrit_names.toLowerCase()
          : ''
      const category = asana.category?.toLowerCase() || ''
      const difficulty = asana.difficulty?.toLowerCase() || ''

      const searchLower = searchTerm.toLowerCase()

      // Search in primary name (sort_english_name), any individual variant, sanskrit name, category, or difficulty
      const matches =
        primaryName.includes(searchLower) ||
        variantNames.some((variant) => variant.includes(searchLower)) ||
        sanskritName.includes(searchLower) ||
        category.includes(searchLower) ||
        difficulty.includes(searchLower)

      return matches
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
    // Prioritize sort_english_name as the canonical display name
    const englishName = asana.sort_english_name || asana.english_names[0]
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
          <SearchField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search asanas by name, category, or difficulty..."
            onClear={() => setSearchTerm('')}
            sx={{ mb: 2 }}
          />

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
                    secondaryTypographyProps={{ component: 'div' }}
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
