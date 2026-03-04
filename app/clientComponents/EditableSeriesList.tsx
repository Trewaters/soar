'use client'

import React from 'react'
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

export interface SeriesListItem {
  id?: string | number
  seriesName: string
  seriesPoses?: any[]
}

export interface EditableSeriesListProps {
  /** Array of series items to display and edit */
  items: SeriesListItem[]

  /** Callback when items array changes (reorder or delete) */
  onItemsChange: (items: SeriesListItem[]) => void

  /** Index of the currently selected/previewed item */
  selectedIndex?: number

  /** Callback when an item row is clicked (for preview) */
  onItemClick?: (index: number) => void

  /** Whether list is in read-only mode */
  disabled?: boolean

  /** Title for the list section */
  title?: string

  /** Empty state message */
  emptyMessage?: string
}

/**
 * EditableSeriesList – Reusable component for editing a list of series/flows
 * within a sequence. Provides reorder (up/down) and delete, matching the
 * style and interaction pattern of EditableAsanaList.
 */
const EditableSeriesList: React.FC<EditableSeriesListProps> = ({
  items,
  onItemsChange,
  selectedIndex,
  onItemClick,
  disabled = false,
  title = 'Series List',
  emptyMessage = 'No series added yet.',
}) => {
  const handleRemove = (idx: number) => {
    onItemsChange(items.filter((_, i) => i !== idx))
  }

  const handleMoveUp = (idx: number) => {
    if (idx === 0 || disabled) return
    const updated = [...items]
    ;[updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]]
    onItemsChange(updated)
  }

  const handleMoveDown = (idx: number) => {
    if (idx === items.length - 1 || disabled) return
    const updated = [...items]
    ;[updated[idx + 1], updated[idx]] = [updated[idx], updated[idx + 1]]
    onItemsChange(updated)
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
        <Typography variant="h6" gutterBottom>
          {title}
          {items.length > 0 && ` (${items.length})`}
        </Typography>
      </Box>

      {items.length === 0 ? (
        <Typography
          variant="body2"
          sx={{ py: 2, textAlign: 'center' }}
          role="alert"
        >
          {emptyMessage}
        </Typography>
      ) : (
        <List dense aria-label={`${title} list`}>
          {items.map((item, idx) => {
            const isSelected = selectedIndex === idx
            return (
              <ListItem
                key={`${item.id ?? item.seriesName}-${idx}`}
                onClick={() => onItemClick?.(idx)}
                sx={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  py: 1.5,
                  pl: 2,
                  borderRadius: 1,
                  cursor: onItemClick ? 'pointer' : 'default',
                  borderLeft: isSelected
                    ? '3px solid'
                    : '3px solid transparent',
                  borderLeftColor: isSelected ? 'primary.main' : 'transparent',
                  backgroundColor: isSelected
                    ? 'primary.light'
                    : 'background.surfaceSubtle',
                  '&:not(:last-of-type)': { mb: 1 },
                  '&:hover': {
                    backgroundColor: isSelected
                      ? 'primary.light'
                      : 'background.surfaceHover',
                  },
                }}
              >
                {/* Index number */}
                <Typography
                  sx={{
                    mr: 2,
                    fontWeight: 'bold',
                    color: 'primary.main',
                    minWidth: 24,
                  }}
                >
                  {idx + 1}.
                </Typography>

                {/* Series name */}
                <ListItemText
                  primary={item.seriesName}
                  secondary={
                    item.seriesPoses?.length
                      ? `${item.seriesPoses.length} pose${item.seriesPoses.length !== 1 ? 's' : ''}`
                      : undefined
                  }
                  primaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                  sx={{ flex: 1 }}
                />

                {/* Action buttons */}
                <Box
                  sx={{ display: 'flex', gap: 0.5 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconButton
                    size="small"
                    aria-label={`Move ${item.seriesName} up`}
                    onClick={() => handleMoveUp(idx)}
                    disabled={disabled || idx === 0}
                  >
                    <ArrowUpwardIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    aria-label={`Move ${item.seriesName} down`}
                    onClick={() => handleMoveDown(idx)}
                    disabled={disabled || idx === items.length - 1}
                  >
                    <ArrowDownwardIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    aria-label={`Remove ${item.seriesName}`}
                    onClick={() => handleRemove(idx)}
                    disabled={disabled}
                    sx={{ color: 'error.light' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </ListItem>
            )
          })}
        </List>
      )}
    </Box>
  )
}

export default EditableSeriesList
