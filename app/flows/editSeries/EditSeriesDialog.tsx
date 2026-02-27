import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { useCanEditContent } from '@app/hooks/useCanEditContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import SeriesEditorForm from './SeriesEditorForm'

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
  /**
   * When true, render the editor inline instead of inside a modal Dialog.
   * The component will render nothing when `inline` is true and `open` is false.
   */
  inline?: boolean
}
/* eslint-enable no-unused-vars */
/* eslint-enable @typescript-eslint/no-unused-vars */

const EditSeriesDialog: React.FC<EditSeriesDialogProps> = ({
  open,
  onClose,
  series,
  onSave,
  onDelete,
  inline = false,
}) => {
  const { canEdit } = useCanEditContent(series.created_by)

  // Form implementation moved to SeriesEditorForm; this component wraps it

  // If inline variant is used and not open, render nothing so parent can keep
  // the component mounted without showing the editor.
  if (inline && !open) return null

  // Only allow dialog/editor to open for authorized users (owner or admin).
  // When not authorized show an unauthorized message. Render differently depending on inline vs modal.
  if (!canEdit && open) {
    if (inline) {
      return (
        <Box role="region" aria-labelledby="unauthorized-title" sx={{ p: 2 }}>
          <Typography id="unauthorized-title" variant="h6">
            Unauthorized
          </Typography>
          <Typography sx={{ mt: 1 }}>
            You do not have permission to edit this flow.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button onClick={onClose} color="primary">
              Close
            </Button>
          </Box>
        </Box>
      )
    }

    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="unauthorized-title"
      >
        <DialogTitle id="unauthorized-title">Unauthorized</DialogTitle>
        <DialogContent>
          You do not have permission to edit this flow.
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  // Render the shared SeriesEditorForm. It encapsulates the form, add-dialog,
  // image manager and delete-confirm flow. We pass through the callbacks so
  // parent components (and tests) receive the same events.
  const EditorContent = (
    <SeriesEditorForm
      series={series}
      mode="edit"
      disabled={!canEdit}
      onSave={(updated) => {
        // forward the updated series to the original onSave handler
        onSave && onSave(updated)
        // close the dialog/view after successful save
        onClose && onClose()
      }}
      onCancel={onClose}
      onDelete={(id) => {
        onDelete && onDelete(id)
        onClose && onClose()
      }}
    />
  )

  if (inline) {
    // If rendering inline, respect the `open` prop (we returned early above if !open)
    return <Box sx={{ width: '100%' }}>{EditorContent}</Box>
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
      <DialogTitle id="edit-series-title">Edit Flow</DialogTitle>
      <DialogContent id="edit-series-content">{EditorContent}</DialogContent>
    </Dialog>
  )
}

export default EditSeriesDialog
