import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import SeriesImageManager from '@app/clientComponents/SeriesImageManager'
import AddAsanasDialog from '@clientComponents/AddAsanasDialog'
import AsanaDetailsEdit from '@app/clientComponents/asanaUi/AsanaDetailsEdit'
import type { AsanaEditFieldProps } from '@app/clientComponents/asanaUi/asanaFieldConstants'
import { sanitizeSeriesSecondaryLabel } from '@app/utils/asana/seriesPoseLabels'
import EditableAsanaList, {
  AsanaListItem,
} from '@app/clientComponents/EditableAsanaList'
import { Box, Typography, Paper, IconButton, Stack } from '@mui/material'

// Re-export AsanaListItem for use in other components
export type { AsanaListItem }
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import React from 'react'

export interface Series {
  id: string
  name: string
  description?: string
  duration?: string
  difficulty?: string
  asanas: AsanaListItem[]
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
  const [asanas, setAsanas] = React.useState<AsanaListItem[]>(
    series.asanas || []
  )
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
    const asanaToAdd: AsanaListItem[] = items.map((asanaItem) => {
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
            {/* Top Row: Details Title with Icon Buttons */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              {/* Left: Details text with Save Icon directly next to it */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="h6" color="primary">
                  Details
                </Typography>
                <IconButton
                  aria-label="Save changes"
                  onClick={handleSave}
                  disabled={disabled}
                  size="small"
                  color="primary"
                >
                  <SaveIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Right: Cancel and Delete Icon Buttons */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton
                  aria-label="Cancel editing"
                  onClick={onCancel}
                  size="small"
                  color="warning"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
                {mode === 'edit' && (
                  <IconButton
                    aria-label="Delete flow"
                    onClick={() => setConfirmDeleteOpen(true)}
                    disabled={disabled}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>

            {/* Details Content */}
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
            <EditableAsanaList
              asanas={asanas}
              onAsanasChange={setAsanas}
              onAddAsanasClick={() => {
                setAsanaRefreshTrigger((prev) => prev + 1)
                setShowAddAsanasDialog(true)
              }}
              disabled={disabled}
              showAddButton={!disabled}
              title="Asana List"
              emptyMessage="No asanas in this series."
            />
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
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{
            width: '100%',
            maxWidth: 600,
            mx: 'auto',
            alignItems: 'stretch',
          }}
        >
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            disabled={disabled}
            startIcon={<SaveIcon fontSize="small" />}
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
            }}
          >
            {mode === 'create' ? 'Create Flow' : 'Save Changes'}
          </Button>
          {mode === 'edit' && (
            <Button
              onClick={() => setConfirmDeleteOpen(true)}
              color="error"
              variant="contained"
              disabled={disabled}
              startIcon={<DeleteIcon fontSize="small" />}
              sx={{
                textTransform: 'none',
                borderRadius: '10px',
                color: 'error.contrastText',
              }}
            >
              Delete Flow
            </Button>
          )}
          <Button
            onClick={onCancel}
            color="warning"
            variant="contained"
            startIcon={<CloseIcon fontSize="small" />}
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
              color: 'warning.contrastText',
            }}
          >
            Cancel
          </Button>
        </Stack>
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
