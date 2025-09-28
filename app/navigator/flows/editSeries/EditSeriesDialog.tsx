import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import AddIcon from '@mui/icons-material/Add'
import { useSession } from 'next-auth/react'
import Paper from '@mui/material/Paper'
import ListSubheader from '@mui/material/ListSubheader'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import SeriesImageManager from '@app/clientComponents/SeriesImageManager'
import AddAsanasDialog from '@clientComponents/AddAsanasDialog'
import { sanitizeSeriesSecondaryLabel } from '@app/utils/asana/seriesPostureLabels'

export interface Asana {
  id: string
  name: string
  difficulty: string
}

export interface Series {
  id: string
  name: string
  description: string
  difficulty: string
  asanas: Asana[]
  created_by: string
}

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
export interface EditSeriesDialogProps {
  open: boolean
  onClose: () => void
  series: Series
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSave: (updated: Series) => void
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDelete: (seriesId: string) => void
}
/* eslint-enable no-unused-vars */
/* eslint-enable @typescript-eslint/no-unused-vars */

const EditSeriesDialog: React.FC<EditSeriesDialogProps> = ({
  open,
  onClose,
  series,
  onSave,
  onDelete,
}) => {
  const { data: session } = useSession()
  const isCreator = session?.user?.email === series.created_by

  // Local state for editable fields
  const [name, setName] = React.useState(series.name)
  const [description, setDescription] = React.useState(series.description)
  const [difficulty, setDifficulty] = React.useState(series.difficulty)
  const [asanas, setAsanas] = React.useState<Asana[]>(series.asanas)
  const [error, setError] = React.useState<string | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false)
  const [showAddAsanasDialog, setShowAddAsanasDialog] = React.useState(false)

  // Validation logic
  const validate = () => {
    if (!name.trim()) return 'Name is required.'
    if (!asanas || asanas.length === 0) return 'At least one asana is required.'
    return null
  }

  const handleSave = () => {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    onSave({
      ...series,
      name,
      description,
      difficulty,
      asanas,
    })
  }

  const handleAddAsanas = (newAsanas: any[]) => {
    const asanaToAdd: Asana[] = newAsanas.map((asana) => {
      const englishName = asana.english_names[0] || asana.sort_english_name
      const sanskritName =
        typeof asana.sanskrit_names === 'string' ? asana.sanskrit_names : ''

      return {
        id: asana.id,
        name: englishName,
        difficulty: sanitizeSeriesSecondaryLabel(sanskritName),
      }
    })
    setAsanas((prev) => [...prev, ...asanaToAdd])
    setShowAddAsanasDialog(false)
  }

  // Only allow dialog to open for creator
  if (!isCreator && open) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="unauthorized-title"
      >
        <DialogTitle id="unauthorized-title">Unauthorized</DialogTitle>
        <DialogContent>
          You do not have permission to edit this series.
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="edit-series-title"
      aria-describedby="edit-series-content"
    >
      <DialogTitle id="edit-series-title">Edit Series</DialogTitle>
      <DialogContent id="edit-series-content">
        <form aria-label="Edit Series Form">
          {/* Details Section */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Details
            </Typography>
            <FormControl fullWidth margin="normal">
              <TextField
                id="series-name"
                label="Series Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isCreator}
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
                disabled={!isCreator}
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
                onChange={(e) => setDifficulty(e.target.value)}
                disabled={!isCreator}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                id="series-created-by"
                label="Created By"
                value={series.created_by}
                disabled
                inputProps={{ 'aria-readonly': true }}
              />
            </FormControl>
          </Paper>

          {/* Images Section */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
            <SeriesImageManager seriesId={series.id} disabled={!isCreator} />
          </Paper>

          <Divider sx={{ mb: 3 }} />

          {/* Asana List Management */}
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
              {isCreator && (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setShowAddAsanasDialog(true)}
                  size="small"
                >
                  Add Asanas
                </Button>
              )}
            </Box>
            <List
              dense
              aria-label="Asana list"
              subheader={
                <ListSubheader
                  component="div"
                  disableSticky
                  sx={{ display: 'none' }}
                >
                  Asana List
                </ListSubheader>
              }
            >
              {asanas.map((asana, idx) => (
                <ListItem
                  key={asana.id}
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        aria-label={`Remove ${asana.name}`}
                        onClick={() => {
                          if (!isCreator) return
                          setAsanas((prev) => prev.filter((_, i) => i !== idx))
                        }}
                        disabled={!isCreator}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label={`Move ${asana.name} up`}
                        onClick={() => {
                          if (!isCreator || idx === 0) return
                          setAsanas((prev) => {
                            const arr = [...prev]
                            const temp = arr[idx - 1]
                            arr[idx - 1] = arr[idx]
                            arr[idx] = temp
                            return arr
                          })
                        }}
                        disabled={!isCreator || idx === 0}
                        sx={{ ml: 1 }}
                      >
                        <ArrowUpwardIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label={`Move ${asana.name} down`}
                        onClick={() => {
                          if (!isCreator || idx === asanas.length - 1) return
                          setAsanas((prev) => {
                            const arr = [...prev]
                            const temp = arr[idx + 1]
                            arr[idx + 1] = arr[idx]
                            arr[idx] = temp
                            return arr
                          })
                        }}
                        disabled={!isCreator || idx === asanas.length - 1}
                        sx={{ ml: 1 }}
                      >
                        <ArrowDownwardIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText primary={asana.name} />
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" disabled={!isCreator}>
          Save Changes
        </Button>
        <Button
          onClick={() => setConfirmDeleteOpen(true)}
          color="secondary"
          disabled={!isCreator}
        >
          Delete Series
        </Button>
        {/* Delete Confirmation Modal */}
        <Dialog
          open={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
          aria-labelledby="delete-series-confirm-title"
        >
          <DialogTitle id="delete-series-confirm-title">
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this series? This action cannot be
            undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                setConfirmDeleteOpen(false)
                onDelete(series.id)
              }}
              color="secondary"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </DialogActions>

      {/* Add Asanas Dialog */}
      <AddAsanasDialog
        open={showAddAsanasDialog}
        onClose={() => setShowAddAsanasDialog(false)}
        onAdd={handleAddAsanas}
        excludeAsanaIds={asanas.map((a) => a.id)}
      />
    </Dialog>
  )
}

export default EditSeriesDialog
