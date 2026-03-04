'use client'
/* eslint-disable */

import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
  FormControl,
} from '@mui/material'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import { useSession } from 'next-auth/react'
import { useCanEditContent } from '@app/hooks/useCanEditContent'
import { FlowSeriesSequence } from '@context/AsanaSeriesContext'
import {
  useSequence,
  useSequenceEditor,
  useSequenceOwnership,
} from '@context/SequenceContext'
import DataAssetImageManager from '@clientComponents/DataAssetImageManager'
import GroupedDataAssetSearch from '@clientComponents/GroupedDataAssetSearch'
import { getAllSeries, SeriesData } from '@lib/seriesService'

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
  const [allSeries, setAllSeries] = useState<SeriesData[]>([])
  const [seriesLoading, setSeriesLoading] = useState(false)
  const [searchInputValue, setSearchInputValue] = useState('')
  const [acOpen, setAcOpen] = useState(false)
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
      router.push('/sequences/practiceSequences')
    } catch (e) {
      // Surface an inline error via saveError banner area
      setSaveState('error')
      setSaveError(e instanceof Error ? e.message : 'Failed to delete')
    } finally {
      setConfirmDeleteSeq(false)
    }
  }

  const fetchAllSeries = useCallback(async () => {
    setSeriesLoading(true)
    try {
      const data = await getAllSeries()
      setAllSeries(data)
    } catch {
      // silently fail; user sees empty list
    } finally {
      setSeriesLoading(false)
    }
  }, [])

  useEffect(() => {
    if (email) fetchAllSeries()
  }, [email, fetchAllSeries])

  const handleAddSeries = (series: SeriesData) => {
    const seriesEntry = {
      id: series.id,
      seriesName: series.seriesName,
      seriesPoses: series.seriesPoses || [],
      image: series.image || '',
      breath: '',
      duration: series.duration || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (usingContext) {
      editor.addSeries([seriesEntry])
    } else {
      setForm((prev) => ({
        ...prev,
        sequencesSeries: [...prev.sequencesSeries, seriesEntry],
      }))
    }
    setSearchInputValue('')
    setAcOpen(false)
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
      {/* Page Title with Save / Delete / Cancel icon buttons */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        {/* Left: title + Save */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{ color: 'text.primary' }}
          >
            Edit Sequence
          </Typography>
          <IconButton
            aria-label="Save changes"
            onClick={handleSave}
            disabled={!canSave || saveState === 'saving'}
            size="small"
            color="primary"
          >
            <SaveIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Right: Delete + Cancel */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            aria-label="Delete sequence"
            onClick={() => setConfirmDeleteSeq(true)}
            disabled={saveState === 'saving'}
            size="small"
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="Cancel editing"
            onClick={() => onCancel?.()}
            size="small"
            color="warning"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

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
          {typeof model.id === 'string' && model.id && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <DataAssetImageManager
                assetType="sequence"
                assetId={model.id}
                disabled={!isOwner}
                maxImages={1}
              />
            </Paper>
          )}

          {/* Flow Section */}
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
                Flows in this Sequence
              </Typography>
            </Box>
            {isOwner && (
              <FormControl sx={{ width: '100%', mb: 2 }}>
                <GroupedDataAssetSearch<SeriesData>
                  items={allSeries}
                  myLabel="My Flows"
                  publicLabel="Public Flows"
                  searchField={(s) => s.seriesName}
                  displayField={(s) => s.seriesName}
                  placeholderText="Search for a Flow to add..."
                  getCreatedBy={(s) => s.createdBy || undefined}
                  onSelect={handleAddSeries}
                  loading={seriesLoading}
                  open={acOpen}
                  onOpen={() => setAcOpen(true)}
                  onClose={() => setAcOpen(false)}
                  inputValue={searchInputValue}
                  onInputChange={setSearchInputValue}
                  fullWidth
                />
              </FormControl>
            )}
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
                              aria-label={`remove flow ${s.seriesName}`}
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
                No flow added yet.
              </Alert>
            )}
          </Paper>

          {/* Remove Flow Confirmation Dialog */}
          <Dialog
            open={confirm.open}
            onClose={cancelRemoveSeries}
            aria-labelledby="confirm-remove-flow-title"
          >
            <DialogTitle id="confirm-remove-flow-title">
              Remove flow from sequence?
            </DialogTitle>
            <DialogContent>
              <Typography>
                This action will remove the selected flow from this sequence.
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
          mt: 3,
          py: 2,
          px: 2,
          width: '100%',
          boxSizing: 'border-box',
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
            disabled={!canSave || saveState === 'saving'}
            startIcon={<SaveIcon fontSize="small" />}
            sx={{ textTransform: 'none', borderRadius: '10px' }}
          >
            {saveState === 'saving' ? 'Saving…' : 'Save Changes'}
          </Button>
          <Button
            onClick={() => setConfirmDeleteSeq(true)}
            color="error"
            variant="contained"
            disabled={saveState === 'saving'}
            startIcon={<DeleteIcon fontSize="small" />}
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
              color: 'error.contrastText',
            }}
          >
            Delete Sequence
          </Button>
          <Button
            onClick={() => onCancel?.()}
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
    </Box>
  )
}
