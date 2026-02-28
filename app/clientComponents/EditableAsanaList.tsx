'use client'

import React from 'react'
import {
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import AddIcon from '@mui/icons-material/Add'
import FilterVintageIcon from '@mui/icons-material/FilterVintage'
import DeblurIcon from '@mui/icons-material/Deblur'
import PlayForWorkIcon from '@mui/icons-material/PlayForWork'
import BackHandIcon from '@mui/icons-material/BackHand'

export interface AsanaListItem {
  id?: string
  name: string
  secondary?: string
  alignment_cues?: string
  breathSeries?: string
  // Fields from SeriesPoseEntry format
  poseId?: string
  sort_english_name?: string
}

export interface EditableAsanaListProps {
  /** Array of asanas to display and edit */
  asanas: AsanaListItem[]

  /** Callback when asanas array changes */
  onAsanasChange: (asanas: AsanaListItem[]) => void

  /** Optional callback when user clicks "Add Asanas" button */
  onAddAsanasClick?: () => void

  /** Whether list is in read-only mode */
  disabled?: boolean

  /** Show "Add Asanas" button */
  showAddButton?: boolean

  /** Title for the asana list section */
  title?: string

  /** Empty state message */
  emptyMessage?: string
}

const BREATH_SERIES_OPTIONS = [
  'Inhale',
  'Hold full',
  'Exhale',
  'Hold empty',
] as const

const getBreathIcon = (value: string) => {
  switch (value) {
    case 'Inhale':
      return (
        <FilterVintageIcon sx={{ color: 'success.main' }} fontSize="small" />
      )
    case 'Hold full':
      return <DeblurIcon sx={{ color: 'secondary.main' }} fontSize="small" />
    case 'Exhale':
      return <PlayForWorkIcon sx={{ color: 'info.main' }} fontSize="small" />
    case 'Hold empty':
      return <BackHandIcon sx={{ color: 'error.main' }} fontSize="small" />
    default:
      return undefined
  }
}

const getBreathColor = (value: string) => {
  switch (value) {
    case 'Inhale':
      return 'success'
    case 'Hold full':
      return 'secondary'
    case 'Exhale':
      return 'info'
    case 'Hold empty':
      return 'error'
    default:
      return 'default'
  }
}

/**
 * EditableAsanaList - Reusable component for editing asana lists with reorder, delete, and breath/cues editing
 *
 * Combines the asana list editing functionality from both create and edit views,
 * using the UI style from the edit/practice view (List-based with proper spacing).
 */
const EditableAsanaList: React.FC<EditableAsanaListProps> = ({
  asanas,
  onAsanasChange,
  onAddAsanasClick,
  disabled = false,
  showAddButton = false,
  title = 'Asana List',
  emptyMessage = 'No asanas in this series.',
}) => {
  const handleRemove = (idx: number) => {
    const updated = asanas.filter((_, i) => i !== idx)
    onAsanasChange(updated)
  }

  const handleMoveUp = (idx: number) => {
    if (idx === 0 || disabled) return
    const updated = [...asanas]
    const tmp = updated[idx - 1]
    updated[idx - 1] = updated[idx]
    updated[idx] = tmp
    onAsanasChange(updated)
  }

  const handleMoveDown = (idx: number) => {
    if (idx === asanas.length - 1 || disabled) return
    const updated = [...asanas]
    const tmp = updated[idx + 1]
    updated[idx + 1] = updated[idx]
    updated[idx] = tmp
    onAsanasChange(updated)
  }

  const handleBreathChange = (idx: number, newBreath: string) => {
    const updated = asanas.map((asana, i) =>
      i === idx ? { ...asana, breathSeries: newBreath } : asana
    )
    onAsanasChange(updated)
  }

  const handleCuesChange = (idx: number, newCues: string) => {
    const newVal = newCues.slice(0, 1000)
    const updated = asanas.map((asana, i) =>
      i === idx ? { ...asana, alignment_cues: newVal } : asana
    )
    onAsanasChange(updated)
  }

  const getAsanaName = (asana: AsanaListItem): string => {
    return (
      asana.name || asana.sort_english_name || `asana-${asanas.indexOf(asana)}`
    )
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6" gutterBottom color="primary">
          {title}
          {asanas.length > 0 && ` (${asanas.length})`}
        </Typography>
        {showAddButton && !disabled && onAddAsanasClick && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onAddAsanasClick}
            size="small"
          >
            Add Asanas
          </Button>
        )}
      </Box>

      <List dense aria-label={`${title} list`}>
        {asanas.map((asana, idx) => {
          const asanaName = getAsanaName(asana)
          const breathValue = asana.breathSeries || ''

          return (
            <ListItem
              key={`${asana.id || asana.poseId || asanaName}-${idx}`}
              sx={{ flexDirection: 'column', alignItems: 'stretch', py: 2 }}
            >
              {/* Header row with name, delete, and reorder buttons */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  mb: 1,
                }}
              >
                <ListItemText primary={asanaName} sx={{ flex: 1 }} />

                <IconButton
                  edge="end"
                  aria-label={`Remove ${asanaName} from asana list`}
                  onClick={() => handleRemove(idx)}
                  disabled={disabled}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>

                <IconButton
                  edge="end"
                  aria-label={`Move ${asanaName} up in the list`}
                  onClick={() => handleMoveUp(idx)}
                  disabled={disabled || idx === 0}
                  sx={{ ml: 1 }}
                >
                  <ArrowUpwardIcon />
                </IconButton>

                <IconButton
                  edge="end"
                  aria-label={`Move ${asanaName} down in the list`}
                  onClick={() => handleMoveDown(idx)}
                  disabled={disabled || idx === asanas.length - 1}
                  sx={{ ml: 1 }}
                >
                  <ArrowDownwardIcon />
                </IconButton>
              </Box>

              {/* Secondary/Sanskrit name if present */}
              {asana.secondary && (
                <Typography
                  variant="body2"
                  sx={{
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    mb: 2,
                  }}
                >
                  {asana.secondary}
                </Typography>
              )}

              {/* Breath cue selection chips */}
              <Box sx={{ mt: 1, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Breath cue
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {BREATH_SERIES_OPTIONS.map((option) => (
                    <Chip
                      key={option}
                      label={option}
                      icon={getBreathIcon(option)}
                      onClick={() => {
                        if (disabled) return
                        const newVal = breathValue === option ? '' : option
                        handleBreathChange(idx, newVal)
                      }}
                      variant={breathValue === option ? 'filled' : 'outlined'}
                      color={
                        breathValue === option
                          ? getBreathColor(option)
                          : 'default'
                      }
                      disabled={disabled}
                      aria-label={`Select ${option} breath cue for ${asanaName}`}
                    />
                  ))}
                </Box>
              </Box>

              {/* Alignment cues text area */}
              <TextField
                placeholder="Optional alignment cues (max 1000 characters)"
                variant="outlined"
                multiline
                minRows={1}
                value={asana.alignment_cues || ''}
                onChange={(e) => handleCuesChange(idx, e.target.value)}
                disabled={disabled}
                inputProps={{
                  maxLength: 1000,
                  'aria-label': `Alignment cues for ${asanaName}`,
                }}
                sx={{ mt: 1, mb: 0.5 }}
              />

              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', mt: 0.25 }}
              >
                {(asana.alignment_cues || '').length}/1000
              </Typography>
            </ListItem>
          )
        })}
      </List>

      {asanas.length === 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ py: 2, textAlign: 'center' }}
          role="alert"
        >
          {emptyMessage}
        </Typography>
      )}
    </Box>
  )
}

export default EditableAsanaList
