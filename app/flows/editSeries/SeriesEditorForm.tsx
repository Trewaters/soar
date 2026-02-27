import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import AddIcon from '@mui/icons-material/Add'
import FilterVintageIcon from '@mui/icons-material/FilterVintage'
import DeblurIcon from '@mui/icons-material/Deblur'
import PlayForWorkIcon from '@mui/icons-material/PlayForWork'
import BackHandIcon from '@mui/icons-material/BackHand'
import SeriesImageManager from '@app/clientComponents/SeriesImageManager'
import AddAsanasDialog from '@clientComponents/AddAsanasDialog'
import AsanaDetailsEdit from '@app/clientComponents/asanaUi/AsanaDetailsEdit'
import type { AsanaEditFieldProps } from '@app/clientComponents/asanaUi/asanaFieldConstants'
import { sanitizeSeriesSecondaryLabel } from '@app/utils/asana/seriesPoseLabels'
import MenuItem from '@mui/material/MenuItem'
import { Box, Typography, Paper, TextField } from '@mui/material'
import React from 'react'

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
      return null
  }
}

export interface Asana {
  id: string
  name: string
  difficulty?: string
  alignment_cues?: string
  breathSeries?: string
}

export interface Series {
  id: string
  name: string
  description?: string
  duration?: string
  difficulty?: string
  asanas: Asana[]
  created_by?: string
}

export type Mode = 'edit' | 'create'

export interface SeriesEditorFormProps {
  series: Series
  mode?: Mode
  disabled?: boolean
  // eslint-disable-next-line no-unused-vars
  onSave?: (_updated: Series) => void
  onCancel?: () => void
  // eslint-disable-next-line no-unused-vars
  onDelete?: (_id: string) => void
}

const SeriesEditorForm: React.FC<SeriesEditorFormProps> = ({
  series,
  mode = 'edit',
  disabled = false,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [name, setName] = React.useState(series.name || '')
  const [description, setDescription] = React.useState(series.description || '')
  const [duration, setDuration] = React.useState(series.duration || '')
  const [asanas, setAsanas] = React.useState<Asana[]>(series.asanas || [])
  const [error, setError] = React.useState<string | null>(null)
  const [showAddAsanasDialog, setShowAddAsanasDialog] = React.useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false)
  const [asanaRefreshTrigger, setAsanaRefreshTrigger] = React.useState(0)

  const detailFields = React.useMemo(
    (): AsanaEditFieldProps[] => [
      {
        type: 'text' as const,
        label: 'Flow Name',
        value: name,
        onChange: (value: string) => setName(value),
        required: true,
        placeholder: 'Give your flow a name...',
      },
      {
        type: 'multiline' as const,
        label: 'Description',
        value: description,
        onChange: (value: string) => setDescription(value),
        rows: 3,
        placeholder: 'Describe this flow...',
      },
      {
        type: 'text' as const,
        label: 'Flow Duration',
        value: duration,
        onChange: (value: string) => setDuration(value),
        placeholder: 'e.g. 20 min',
      },
    ],
    [name, description, duration]
  )

  React.useEffect(() => {
    setName(series.name || '')
    setDescription(series.description || '')
    setDuration(series.duration || '')
    setAsanas(series.asanas || [])
  }, [series])

  React.useEffect(() => {
    if (error) setError(null)
  }, [name, description, duration, asanas, error])

  const validate = (): string | null => {
    if (!name || !name.trim()) return 'Name is required.'
    if (!asanas || asanas.length === 0) return 'At least one asana is required.'
    return null
  }

  const handleSave = () => {
    const v = validate()
    if (v) {
      setError(v)
      return
    }
    const updated: Series = { ...series, name, description, duration, asanas }
    onSave && onSave(updated)
  }

  const handleAddAsanas = (items: any[]) => {
    const asanaToAdd: Asana[] = items.map((asanaItem) => {
      const englishName = asanaItem.sort_english_name || ''
      const sanskritName =
        typeof asanaItem.sanskrit_names === 'string'
          ? asanaItem.sanskrit_names
          : ''

      return {
        id: asanaItem.id,
        name: englishName,
        difficulty: sanitizeSeriesSecondaryLabel(sanskritName),
        breathSeries: '',
      }
    })
    setAsanas((prev) => [...prev, ...asanaToAdd])
    setShowAddAsanasDialog(false)
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography id="edit-series-title" variant="h5" color="primary">
          {mode === 'create' ? 'Create Flow' : 'Edit Flow'}
        </Typography>
      </Box>

      <Box id="edit-series-content">
        <form aria-label="Flow Form">
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Details
            </Typography>
            <AsanaDetailsEdit
              fields={detailFields.map((field) => ({
                ...field,
                disabled: disabled || field.disabled,
              }))}
            />
          </Paper>

          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
            <SeriesImageManager
              seriesId={series.id}
              disabled={disabled}
              maxImages={1}
            />
          </Paper>

          <Paper elevation={1} sx={{ p: 3, mb: 1.5, borderRadius: '12px' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6" gutterBottom color="primary">
                Asana List
              </Typography>
              {!disabled && (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setAsanaRefreshTrigger((prev) => prev + 1)
                    setShowAddAsanasDialog(true)
                  }}
                  size="small"
                >
                  Add Asanas
                </Button>
              )}
            </Box>

            <List dense aria-label="Asana list">
              {asanas.map((asana, idx) => (
                <ListItem
                  key={`${asana.id}-${idx}`}
                  sx={{ flexDirection: 'column', alignItems: 'stretch', py: 2 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      mb: 1,
                    }}
                  >
                    <ListItemText primary={asana.name} sx={{ flex: 1 }} />

                    <IconButton
                      edge="end"
                      aria-label={`Delete, Remove ${asana.name}`}
                      onClick={() =>
                        !disabled &&
                        setAsanas((prev) => prev.filter((_, i) => i !== idx))
                      }
                      disabled={disabled}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>

                    <IconButton
                      edge="end"
                      aria-label={`Move up, Move ${asana.name} up`}
                      onClick={() => {
                        if (disabled || idx === 0) return
                        setAsanas((prev) => {
                          const arr = [...prev]
                          const tmp = arr[idx - 1]
                          arr[idx - 1] = arr[idx]
                          arr[idx] = tmp
                          return arr
                        })
                      }}
                      disabled={disabled || idx === 0}
                      sx={{ ml: 1 }}
                    >
                      <ArrowUpwardIcon />
                    </IconButton>

                    <IconButton
                      edge="end"
                      aria-label={`Move down, Move ${asana.name} down`}
                      onClick={() => {
                        if (disabled || idx === asanas.length - 1) return
                        setAsanas((prev) => {
                          const arr = [...prev]
                          const tmp = arr[idx + 1]
                          arr[idx + 1] = arr[idx]
                          arr[idx] = tmp
                          return arr
                        })
                      }}
                      disabled={disabled || idx === asanas.length - 1}
                      sx={{ ml: 1 }}
                    >
                      <ArrowDownwardIcon />
                    </IconButton>
                  </Box>

                  <TextField
                    select
                    placeholder="Breath cue"
                    variant="outlined"
                    value={asana.breathSeries || ''}
                    onChange={(e) => {
                      if (disabled) return
                      setAsanas((prev) =>
                        prev.map((a, i) =>
                          i === idx ? { ...a, breathSeries: e.target.value } : a
                        )
                      )
                    }}
                    disabled={disabled}
                    inputProps={{
                      'aria-label': `Breath cue for ${asana.name}`,
                    }}
                    sx={{ mt: 1 }}
                  >
                    <MenuItem value="">(none)</MenuItem>
                    {BREATH_SERIES_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          {getBreathIcon(option)}
                          <span>{option}</span>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    placeholder="Optional alignment cues (max 1000 characters)"
                    variant="outlined"
                    multiline
                    minRows={1}
                    value={asana.alignment_cues || ''}
                    onChange={(e) => {
                      if (disabled) return
                      const newVal = e.target.value.slice(0, 1000)
                      setAsanas((prev) =>
                        prev.map((a, i) =>
                          i === idx ? { ...a, alignment_cues: newVal } : a
                        )
                      )
                    }}
                    disabled={disabled}
                    inputProps={{
                      maxLength: 1000,
                      'aria-label': `Alignment cues for ${asana.name}`,
                    }}
                    sx={{ mt: 1 }}
                  />

                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', mt: 0.5 }}
                  >
                    {(asana.alignment_cues || '').length}/1000
                  </Typography>
                </ListItem>
              ))}
            </List>

            {asanas.length === 0 && (
              <div style={{ color: 'red' }} role="alert">
                No asanas in this series.
              </div>
            )}
          </Paper>

          {error && (
            <div style={{ color: 'red', marginBottom: 8 }} role="alert">
              {error}
            </div>
          )}
        </form>
      </Box>

      {/* Sticky Bottom Action Bar - Consistent with Asana pages */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          py: 2,
          px: 2,
          mt: 3,
          // Keep within container width to prevent side cut-offs
          width: '100%',
          boxSizing: 'border-box',
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            disabled={disabled}
            sx={{
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              width: { xs: '100%', sm: 'auto' },
              boxShadow: (theme) => theme.customShadows.cta,
            }}
          >
            {mode === 'create' ? 'Create Flow' : 'Save Changes'}
          </Button>
          {mode === 'edit' && (
            <Button
              onClick={() => setConfirmDeleteOpen(true)}
              color="error"
              variant="outlined"
              disabled={disabled}
              sx={{
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Delete Flow
            </Button>
          )}
          <Button
            onClick={onCancel}
            color="secondary"
            variant="outlined"
            sx={{
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>

      <AddAsanasDialog
        open={showAddAsanasDialog}
        onClose={() => setShowAddAsanasDialog(false)}
        onAdd={handleAddAsanas}
        excludeAsanaIds={[]} // Allow duplicate asanas in series
        refreshTrigger={asanaRefreshTrigger}
      />

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        aria-labelledby="confirm-delete-title"
      >
        <DialogTitle id="confirm-delete-title">Delete Flow</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this flow? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setConfirmDeleteOpen(false)
              onDelete && onDelete(series.id)
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SeriesEditorForm
