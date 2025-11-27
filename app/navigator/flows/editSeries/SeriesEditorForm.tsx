import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
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
import SeriesImageManager from '@app/clientComponents/SeriesImageManager'
import AddAsanasDialog from '@clientComponents/AddAsanasDialog'
import { sanitizeSeriesSecondaryLabel } from '@app/utils/asana/seriesPoseLabels'
import {
  Box,
  Typography,
  Paper,
  FormControl,
  TextField,
  InputLabel,
} from '@mui/material'
import React from 'react'

export interface Asana {
  id: string
  name: string
  difficulty?: string
  alignment_cues?: string
}

export interface Series {
  id: string
  name: string
  description?: string
  difficulty?: string
  asanas: Asana[]
  created_by?: string
}

export type Mode = 'edit' | 'create'

export interface SeriesEditorFormProps {
  series: Series
  mode?: Mode
  disabled?: boolean
  onSave?: (updated: Series) => void
  onCancel?: () => void
  onDelete?: (id: string) => void
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
  const [difficulty, setDifficulty] = React.useState(series.difficulty || '')
  const [asanas, setAsanas] = React.useState<Asana[]>(series.asanas || [])
  const [error, setError] = React.useState<string | null>(null)
  const [showAddAsanasDialog, setShowAddAsanasDialog] = React.useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false)
  const [asanaRefreshTrigger, setAsanaRefreshTrigger] = React.useState(0)

  React.useEffect(() => {
    setName(series.name || '')
    setDescription(series.description || '')
    setDifficulty(series.difficulty || '')
    setAsanas(series.asanas || [])
  }, [series])

  React.useEffect(() => {
    if (error) setError(null)
  }, [name, description, difficulty, asanas, error])

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
    const updated: Series = { ...series, name, description, difficulty, asanas }
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

            <FormControl fullWidth margin="normal">
              <TextField
                id="series-name"
                label="Flow Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={disabled}
                required
                inputProps={{ 'aria-required': true }}
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                id="series-description"
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={disabled}
                multiline
                rows={3}
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="series-difficulty-label">Difficulty</InputLabel>
              <Select
                labelId="series-difficulty-label"
                id="series-difficulty"
                value={difficulty}
                label="Difficulty"
                onChange={(e) => setDifficulty(e.target.value as string)}
                disabled={disabled}
              >
                <MenuItem value="">(none)</MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                id="series-created-by"
                label="Created By"
                value={series.created_by || ''}
                disabled
                inputProps={{ 'aria-readonly': true }}
              />
            </FormControl>
          </Paper>

          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
            <SeriesImageManager seriesId={series.id} disabled={disabled} />
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

      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={disabled}
        >
          {mode === 'create' ? 'Create' : 'Save Changes'}
        </Button>
        {mode === 'edit' && (
          <Button
            onClick={() => setConfirmDeleteOpen(true)}
            color="error"
            disabled={disabled}
          >
            Delete Series
          </Button>
        )}
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
        <DialogTitle id="confirm-delete-title">Delete Series</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this series? This action cannot be
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
