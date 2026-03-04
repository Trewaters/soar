import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DataAssetImageManager from '@app/clientComponents/DataAssetImageManager'
import GroupedDataAssetSearch from '@app/clientComponents/GroupedDataAssetSearch'
import AsanaDetailsEdit from '@app/clientComponents/asanaUi/AsanaDetailsEdit'
import type { AsanaEditFieldProps } from '@app/clientComponents/asanaUi/asanaFieldConstants'
import { sanitizeSeriesSecondaryLabel } from '@app/utils/asana/seriesPoseLabels'
import { getAccessiblePoses } from '@lib/poseService'
import { useSession } from 'next-auth/react'
import type { AsanaPose } from 'types/asana'
import EditableAsanaList, {
  AsanaListItem,
} from '@app/clientComponents/EditableAsanaList'
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Stack,
  FormControl,
} from '@mui/material'

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
  const { data: session, status } = useSession()
  const [name, setName] = React.useState(series.name || '')
  const [description, setDescription] = React.useState(series.description || '')
  const [duration, setDuration] = React.useState(series.duration || '')
  const [asanas, setAsanas] = React.useState<AsanaListItem[]>(
    series.asanas || []
  )
  const [poses, setPoses] = React.useState<AsanaPose[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [nameError, setNameError] = React.useState<string | null>(null)
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const [snackbarMessage, setSnackbarMessage] = React.useState<string | null>(
    null
  )
  const [acOpen, setAcOpen] = React.useState(false)
  const [searchInputValue, setSearchInputValue] = React.useState('')
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false)

  const detailFields = React.useMemo(
    (): AsanaEditFieldProps[] => [
      {
        type: 'text' as const,
        label: 'Flow Name',
        value: name,
        onChange: (value: string) => setName(value),
        required: true,
        placeholder: 'Give your flow a name...',
        error: !!nameError,
        errorText: nameError ?? undefined,
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
    [name, description, duration, nameError]
  )

  React.useEffect(() => {
    setName(series.name || '')
    setDescription(series.description || '')
    setDuration(series.duration || '')
    setAsanas(series.asanas || [])
  }, [series])

  // Clear inline errors only when the user edits a field — do NOT include
  // `error` or `nameError` here or they will clear themselves immediately.
  React.useEffect(() => {
    if (error) setError(null)
    if (nameError && name.trim()) setNameError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, description, duration, asanas])

  const fetchPoses = React.useCallback(async () => {
    try {
      const availablePoses = await getAccessiblePoses(
        session?.user?.email || undefined
      )
      setPoses(availablePoses)
    } catch (fetchError: Error | any) {
      console.error('[SeriesEditorForm] Error fetching poses:', fetchError)
    }
  }, [session?.user?.email])

  React.useEffect(() => {
    if (status === 'authenticated') {
      fetchPoses()
    }
  }, [status, fetchPoses])

  const validate = (): string | null => {
    if (!name || !name.trim()) return 'Name is required.'
    if (!asanas || asanas.length === 0) return 'At least one asana is required.'
    return null
  }

  const handleSave = () => {
    const v = validate()
    if (v) {
      setError(v)
      setSnackbarMessage(v)
      // Show field-level error on the name field when it is the culprit
      if (!name || !name.trim()) {
        setNameError('Flow name is required')
      }
      setSnackbarOpen(true)
      return
    }
    const updated: Series = { ...series, name, description, duration, asanas }
    onSave && onSave(updated)
  }

  const handleSelectAsana = (pose: AsanaPose) => {
    const sanskritName = Array.isArray(pose.sanskrit_names)
      ? pose.sanskrit_names[0] || ''
      : ''

    const asanaToAdd: AsanaListItem = {
      id: pose.id,
      poseId: pose.id,
      name: pose.sort_english_name || '',
      secondary: sanitizeSeriesSecondaryLabel(sanskritName),
      alignment_cues: '',
      breathSeries: '',
    }

    setAsanas((prev) => [...prev, asanaToAdd])
    setSearchInputValue('')
    setAcOpen(false)
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography id="edit-series-title" variant="h5">
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
                <Typography variant="h6">Details</Typography>
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

              {/* Right: Delete and Cancel Icon Buttons (Cancel moved to the right with extra spacing) */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                <IconButton
                  aria-label="Cancel editing"
                  onClick={onCancel}
                  size="small"
                  color="warning"
                  sx={{ ml: 1 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
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
            <DataAssetImageManager
              assetType="series"
              assetId={series.id}
              disabled={disabled}
              maxImages={1}
            />
          </Paper>

          <Paper elevation={1} sx={{ p: 3, mb: 1.5, borderRadius: '12px' }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 1,
              }}
            >
              Add Poses to Flow
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Search and select poses to add to your flow. You can add as many
              poses as you like, and rearrange or edit them later.
            </Typography>
            <FormControl sx={{ width: '100%', mb: 3 }}>
              <GroupedDataAssetSearch<AsanaPose>
                items={poses.sort((a, b) =>
                  a.sort_english_name.localeCompare(b.sort_english_name)
                )}
                myLabel="My Poses"
                publicLabel="Public Poses"
                searchField={(pose) => pose.sort_english_name}
                displayField={(pose) => pose.sort_english_name}
                placeholderText="Search for a pose to add..."
                getCreatedBy={(pose) => pose.created_by || undefined}
                onSelect={handleSelectAsana}
                open={acOpen}
                onOpen={() => setAcOpen(true)}
                onClose={() => setAcOpen(false)}
                inputValue={searchInputValue}
                onInputChange={setSearchInputValue}
                fullWidth
              />
            </FormControl>

            <EditableAsanaList
              asanas={asanas}
              onAsanasChange={setAsanas}
              disabled={disabled}
              showAddButton={false}
              title="Asana List"
              emptyMessage="No asanas in this series."
            />
          </Paper>

          {error && (
            <div style={{ color: 'red', marginBottom: 8 }} role="alert">
              {error}
            </div>
          )}

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity="error"
              variant="filled"
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
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
