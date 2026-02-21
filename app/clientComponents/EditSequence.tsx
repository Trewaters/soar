'use client'
/* eslint-disable */

import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Stack,
  Typography,
  Alert,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
} from '@mui/material'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import AddIcon from '@mui/icons-material/Add'
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement'
import { useSession } from 'next-auth/react'
import { useCanEditContent } from '@app/hooks/useCanEditContent'
import { FlowSeriesSequence } from '@context/AsanaSeriesContext'
import {
  useSequence,
  useSequenceEditor,
  useSequenceOwnership,
} from '@context/SequenceContext'
import Image from 'next/image'
import ImageUpload, {
  PoseImageData,
} from '@clientComponents/imageUpload/ImageUpload'
import AddSeriesDialog from '@clientComponents/AddSeriesDialog'

export type EditableSequence = {
  id: string | number
  nameSequence: string
  sequencesSeries: FlowSeriesSequence[]
  description?: string
  image?: string
  created_by?: string | null
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export interface EditSequenceProps {
  sequence: EditableSequence
  onChange?: (updated: EditableSequence) => void
  onCancel?: () => void
  children?: React.ReactNode
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export default function EditSequence({
  sequence,
  onChange,
  onCancel,
  children,
}: EditSequenceProps) {
  const { data: session, status } = useSession()
  const router = useNavigationWithLoading()
  const ctx = useSequence()
  const editor = useSequenceEditor()
  const ctxIsOwner = useSequenceOwnership()

  const email = session?.user?.email ?? null
  const usingContext = ctx?.active === true
  const { canEdit } = useCanEditContent(sequence?.created_by || null)
  const isOwner = usingContext ? ctxIsOwner : canEdit

  const [form, setForm] = useState<EditableSequence>({
    id: sequence.id,
    nameSequence: sequence.nameSequence || '',
    sequencesSeries: sequence.sequencesSeries || [],
    description: sequence.description || '',
    image: sequence.image || '',
    created_by: sequence.created_by ?? null,
  })

  // Sync form state when sequence ID changes (new sequence loaded)
  useEffect(() => {
    if (sequence.id !== form.id) {
      setForm({
        id: sequence.id,
        nameSequence: sequence.nameSequence || '',
        sequencesSeries: sequence.sequencesSeries || [],
        description: sequence.description || '',
        image: sequence.image || '',
        created_by: sequence.created_by ?? null,
      })
    }
  }, [sequence.id, sequence, form.id])

  const [confirm, setConfirm] = useState<{
    open: boolean
    index: number | null
  }>({ open: false, index: null })

  const [confirmDeleteSeq, setConfirmDeleteSeq] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [saveState, setSaveState] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showAddSeriesDialog, setShowAddSeriesDialog] = useState(false)
  // Track image load errors for series avatars
  const [seriesImageErrors, setSeriesImageErrors] = useState<
    Record<number, boolean>
  >({})

  const model: EditableSequence = usingContext
    ? (ctx.state.sequences as unknown as EditableSequence)
    : form

  const errors = useMemo(() => {
    const e: Partial<Record<keyof EditableSequence, string>> = {}
    if (!model.nameSequence || model.nameSequence.trim().length === 0) {
      e.nameSequence = 'Name is required'
    } else if (model.nameSequence.length > 100) {
      e.nameSequence = 'Name must be 100 characters or less'
    }

    if (model.description && model.description.length > 1000) {
      e.description = 'Description must be 1000 characters or less'
    }

    if (model.image && !/^https?:\/\//i.test(model.image)) {
      e.image = 'Image must be a valid URL (https://)'
    }
    return e
  }, [model])

  // Remove the useEffect that calls onChange on every form change
  // This was causing the parent component to navigate away on every keystroke

  const setField = <K extends keyof EditableSequence>(
    key: K,
    value: EditableSequence[K]
  ) => {
    if (usingContext) {
      editor.updateField(key as any, value as any)
    } else {
      setForm((prev) => ({ ...prev, [key]: value }))
    }
  }

  const handleImageUploaded = (img: PoseImageData) => {
    setField('image', img.url)
  }

  const requestRemoveSeries = (index: number) => {
    setConfirm({ open: true, index })
  }

  const cancelRemoveSeries = () => setConfirm({ open: false, index: null })

  const confirmRemoveSeries = () => {
    if (confirm.index == null) return cancelRemoveSeries()
    if (usingContext) {
      editor.removeSeriesAt(confirm.index)
    } else {
      setForm((prev) => {
        const next = { ...prev, sequencesSeries: [...prev.sequencesSeries] }
        next.sequencesSeries.splice(confirm.index as number, 1)
        return next
      })
    }
    cancelRemoveSeries()
  }

  const moveItem = (from: number, to: number) => {
    if (usingContext) {
      editor.reorderSeries(from, to)
      return
    }
    setForm((prev) => {
      if (
        from === to ||
        to < 0 ||
        to >= prev.sequencesSeries.length ||
        from < 0 ||
        from >= prev.sequencesSeries.length
      )
        return prev
      const next = { ...prev, sequencesSeries: [...prev.sequencesSeries] }
      const [moved] = next.sequencesSeries.splice(from, 1)
      next.sequencesSeries.splice(to, 0, moved)
      return next
    })
  }

  const onDragStart = (index: number) => setDragIndex(index)
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  const onDrop = (index: number) => {
    if (dragIndex == null) return
    moveItem(dragIndex, index)
    setDragIndex(null)
  }

  const canSave = isOwner && Object.keys(errors).length === 0

  const handleSave = async () => {
    if (!canSave) return
    if (!model.id || typeof model.id !== 'string') {
      setSaveState('error')
      setSaveError('Invalid sequence id; cannot save changes.')
      return
    }
    setSaveState('saving')
    setSaveError(null)
    try {
      const payload = {
        nameSequence: model.nameSequence,
        description: model.description ?? '',
        image: model.image ?? '',
        sequencesSeries: model.sequencesSeries ?? [],
      }
      const res = await fetch(`/api/sequences/${model.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || `Save failed (${res.status})`)
      }
      setSaveState('saved')
      // Optionally notify parent with latest model
      onChange?.(usingContext ? (ctx.state.sequences as any) : form)
      // Saved state will reset on next edit or component lifecycle
    } catch (e: any) {
      setSaveState('error')
      setSaveError(e?.message || 'An error occurred while saving')
    }
  }

  const handleDeleteSequence = async () => {
    if (!isOwner) return
    if (!model.id || typeof model.id !== 'string') return
    try {
      const res = await fetch(`/api/sequences/${model.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || `Delete failed (${res.status})`)
      }
      // Navigate to practice sequences page after delete
      router.push('/flows/practiceSequences')
    } catch (e) {
      // Surface an inline error via saveError banner area
      setSaveState('error')
      setSaveError(e instanceof Error ? e.message : 'Failed to delete')
    } finally {
      setConfirmDeleteSeq(false)
    }
  }

  const handleAddSeries = (newSeries: any[]) => {
    const seriesToAdd = newSeries.map((series) => ({
      id: series.id,
      seriesName: series.seriesName,
      seriesPoses: series.seriesPoses || [],
      image: series.image || '',
      breath: '',
      duration: series.durationSeries || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))

    if (usingContext) {
      editor.addSeries(seriesToAdd)
    } else {
      setForm((prev) => ({
        ...prev,
        sequencesSeries: [...prev.sequencesSeries, ...seriesToAdd],
      }))
    }
    setShowAddSeriesDialog(false)
  }

  if (status === 'loading') {
    return (
      <Box role="status" aria-live="polite" sx={{ p: 2 }}>
        <Typography variant="body2">Loading your session…</Typography>
      </Box>
    )
  }

  if (!email) {
    return (
      <Alert
        severity="info"
        role="alert"
        aria-label="sign-in-required"
        sx={{ m: 2 }}
      >
        Please sign in to edit sequences.
      </Alert>
    )
  }

  if (!isOwner) {
    return (
      <Alert
        severity="warning"
        role="alert"
        aria-label="edit-not-allowed"
        sx={{ m: 2 }}
      >
        You do not have permission to edit this sequence.
      </Alert>
    )
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Prevent form submission - instead trigger save if valid
    if (canSave) {
      handleSave()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // Don't trigger form submission on Enter
    }
  }

  return (
    <Box component="section" aria-label="edit-sequence" sx={{ px: 2, pb: 12 }}>
      {/* Page Title */}
      <Typography
        variant="h5"
        component="h1"
        sx={{
          mb: 3,
          color: 'text.primary',
        }}
      >
        Edit Sequence
      </Typography>

      {/* Save Status Messages */}
      {saveState === 'saved' && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Changes saved successfully
        </Alert>
      )}
      {saveState === 'error' && saveError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {saveError}
        </Alert>
      )}

      <form onSubmit={handleFormSubmit}>
        <Stack spacing={3}>
          {/* Sequence Name Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
            >
              Sequence Name
            </Typography>
            <TextField
              label="Sequence Name"
              value={model.nameSequence}
              onChange={(e) => setField('nameSequence', e.target.value)}
              onKeyDown={handleKeyDown}
              required
              fullWidth
              inputProps={{ maxLength: 100 }}
              error={!!errors.nameSequence}
              helperText={
                errors.nameSequence || 'Enter a concise, descriptive name'
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </Paper>

          {/* Description Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
            >
              Description
            </Typography>
            <TextField
              label="Description"
              value={model.description}
              onChange={(e) => setField('description', e.target.value)}
              onKeyDown={(e) => {
                // Allow Enter in multiline description but prevent form submission
                if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
                  e.stopPropagation()
                }
              }}
              fullWidth
              multiline
              minRows={3}
              inputProps={{ maxLength: 1000 }}
              error={!!errors.description}
              helperText={
                errors.description ||
                'Optional. Provide details about this sequence'
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </Paper>

          {/* Image Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
            >
              Image
            </Typography>
            {model.image ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ position: 'relative', width: 160, height: 100 }}>
                  <Image
                    src={model.image as string}
                    alt={model.nameSequence || 'Sequence image'}
                    fill
                    sizes="160px"
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                  />
                </Box>
                <TextField
                  label="Image URL"
                  value={model.image}
                  onChange={(e) => setField('image', e.target.value)}
                  onKeyDown={handleKeyDown}
                  fullWidth
                  error={!!errors.image}
                  helperText={
                    errors.image || 'You can paste a URL or upload below'
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />
                <Tooltip title="Delete image">
                  <IconButton
                    onClick={() => setField('image', '')}
                    color="error"
                    aria-label="Delete sequence image"
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <TextField
                label="Image URL"
                value={model.image}
                onChange={(e) => setField('image', e.target.value)}
                onKeyDown={handleKeyDown}
                fullWidth
                error={!!errors.image}
                helperText={
                  errors.image || 'You can paste a URL or upload below'
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
              />
            )}
            <Box sx={{ mt: 2 }}>
              <ImageUpload onImageUploaded={handleImageUploaded} />
            </Box>
          </Paper>

          {/* Flow Series Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: 'text.primary' }}
              >
                Flow Series
              </Typography>
              {isOwner && (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setShowAddSeriesDialog(true)}
                  size="small"
                  sx={{ borderRadius: '12px' }}
                >
                  Add Series
                </Button>
              )}
            </Box>
            {model.sequencesSeries?.length ? (
              <List dense>
                {model.sequencesSeries.map((s, idx) => {
                  const hasImageError = seriesImageErrors[idx]
                  const shouldShowImage = s.image && !hasImageError
                  return (
                    <ListItem
                      key={`${s.seriesName}-${idx}`}
                      draggable
                      onDragStart={() => onDragStart(idx)}
                      onDragOver={onDragOver}
                      onDrop={() => onDrop(idx)}
                      aria-grabbed={dragIndex === idx ? 'true' : 'false'}
                      secondaryAction={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Tooltip title="Move up">
                            <span>
                              <IconButton
                                aria-label={`move ${s.seriesName} up`}
                                onClick={() => moveItem(idx, idx - 1)}
                                disabled={idx === 0}
                                size="small"
                              >
                                <ArrowUpwardIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Move down">
                            <span>
                              <IconButton
                                aria-label={`move ${s.seriesName} down`}
                                onClick={() => moveItem(idx, idx + 1)}
                                disabled={
                                  idx === model.sequencesSeries.length - 1
                                }
                                size="small"
                              >
                                <ArrowDownwardIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Remove from sequence">
                            <IconButton
                              edge="end"
                              aria-label={`remove series ${s.seriesName}`}
                              onClick={() => requestRemoveSeries(idx)}
                              color="error"
                            >
                              <DeleteForeverIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={shouldShowImage ? s.image : undefined}
                          alt={s.seriesName}
                          imgProps={{
                            onError: () => {
                              setSeriesImageErrors((prev) => ({
                                ...prev,
                                [idx]: true,
                              }))
                            },
                          }}
                        >
                          {!shouldShowImage && <SelfImprovementIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          flex: 1,
                        }}
                      >
                        <Tooltip title="Drag to reorder">
                          <IconButton
                            size="small"
                            edge="start"
                            aria-label={`drag ${s.seriesName}`}
                            sx={{ cursor: 'grab' }}
                          >
                            <DragIndicatorIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <ListItemText
                          primary={s.seriesName}
                          secondary={
                            s.seriesPoses?.length
                              ? `${s.seriesPoses.length} poses`
                              : undefined
                          }
                        />
                      </Box>
                    </ListItem>
                  )
                })}
              </List>
            ) : (
              <Alert severity="info" sx={{ mt: 1 }}>
                No flow series added yet.
              </Alert>
            )}
          </Paper>

          {/* Creator Info Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
            >
              Creator Info
            </Typography>
            <TextField
              label="Created by"
              value={sequence.created_by || 'Unknown'}
              fullWidth
              InputProps={{ readOnly: true }}
              helperText="Only the creator may edit this sequence"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </Paper>

          {/* Remove Series Confirmation Dialog */}
          <Dialog
            open={confirm.open}
            onClose={cancelRemoveSeries}
            aria-labelledby="confirm-remove-series-title"
          >
            <DialogTitle id="confirm-remove-series-title">
              Remove series from sequence?
            </DialogTitle>
            <DialogContent>
              <Typography>
                This action will remove the selected series from this sequence.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={cancelRemoveSeries} autoFocus>
                Cancel
              </Button>
              <Button
                onClick={confirmRemoveSeries}
                color="error"
                variant="contained"
              >
                Remove
              </Button>
            </DialogActions>
          </Dialog>

          {children}
        </Stack>
      </form>

      {/* Action Bar - placed in document flow below content so it doesn't overlap bottom nav */}
      <Box
        sx={{
          position: 'relative',
          mt: 2,
          mb: { xs: 6, sm: 4 }, // space above bottom nav on small screens
          py: 2,
          px: 3,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ maxWidth: '600px', mx: 'auto' }}
        >
          <Button
            variant="outlined"
            onClick={() => onCancel?.()}
            sx={{
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!canSave || saveState === 'saving'}
            sx={{
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              flex: 1,
            }}
          >
            {saveState === 'saving' ? 'Saving…' : 'Save Changes'}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setConfirmDeleteSeq(true)}
            aria-label="Delete sequence"
            sx={{
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            Delete
          </Button>
        </Stack>
      </Box>

      {/* Delete Sequence Confirmation Dialog */}
      <Dialog
        open={confirmDeleteSeq}
        onClose={() => setConfirmDeleteSeq(false)}
        aria-labelledby="confirm-delete-sequence-title"
      >
        <DialogTitle id="confirm-delete-sequence-title">
          Delete this sequence?
        </DialogTitle>
        <DialogContent>
          <Typography>
            This will permanently delete the sequence "{model.nameSequence}".
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteSeq(false)} autoFocus>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteSequence}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Series Dialog */}
      <AddSeriesDialog
        open={showAddSeriesDialog}
        onClose={() => setShowAddSeriesDialog(false)}
        onAdd={handleAddSeries}
        excludeSeriesIds={model.sequencesSeries.map((s) => s.id || '')}
      />
    </Box>
  )
}
