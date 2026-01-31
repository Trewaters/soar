// Clean implementation below
'use client'
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
} from '@mui/material'
import { useGlossary } from './GlossaryContext'

export interface GlossaryEditorProps {
  open: boolean
  mode: 'create' | 'edit'
  termToEdit?: string | null
  onClose: () => void
  // eslint-disable-next-line no-unused-vars
  onSaved: (msg: string) => void
  // eslint-disable-next-line no-unused-vars
  onError: (msg: string) => void
}

const GlossaryEditor: React.FC<GlossaryEditorProps> = ({
  open,
  mode,
  termToEdit,
  onClose,
  onSaved,
  onError,
}) => {
  const { terms, createTerm, updateTerm } = useGlossary()
  const [saving, setSaving] = useState(false)
  const [term, setTerm] = useState('')
  const [meaning, setMeaning] = useState('')
  const [whyMatters, setWhyMatters] = useState('')
  const [category, setCategory] = useState('')
  const [sanskrit, setSanskrit] = useState('')
  const [pronunciation, setPronunciation] = useState('')

  useEffect(() => {
    if (open && mode === 'edit' && termToEdit) {
      const t = terms.find((x) => x.term === termToEdit)
      if (t) {
        setTerm(t.term)
        setMeaning(t.meaning || t.definition)
        setWhyMatters(t.whyMatters || '')
        setCategory(t.category || '')
        setSanskrit(t.sanskrit || '')
        setPronunciation(t.pronunciation || '')
      }
    } else if (open && mode === 'create') {
      setTerm('')
      setMeaning('')
      setWhyMatters('')
      setCategory('')
      setSanskrit('')
      setPronunciation('')
    }
  }, [open, mode, termToEdit, terms])

  const handleSave = async () => {
    // Frontend validation
    if (!term.trim()) {
      onError('Term name is required')
      return
    }
    if (term.trim().length > 100) {
      onError('Term name must be 100 characters or less')
      return
    }
    if (!meaning.trim()) {
      onError('Definition/meaning is required')
      return
    }
    if (meaning.trim().length > 1000) {
      onError('Definition must be 1000 characters or less')
      return
    }
    if (whyMatters.trim().length > 500) {
      onError('Why it matters must be 500 characters or less')
      return
    }
    if (category.trim().length > 50) {
      onError('Category must be 50 characters or less')
      return
    }
    if (sanskrit.trim().length > 100) {
      onError('Sanskrit term must be 100 characters or less')
      return
    }
    if (pronunciation.trim().length > 150) {
      onError('Pronunciation guide must be 150 characters or less')
      return
    }

    setSaving(true)
    try {
      if (mode === 'create') {
        await createTerm({
          term: term.trim(),
          definition: meaning.trim(),
          meaning: meaning.trim(),
          whyMatters: whyMatters.trim(),
          category: category.trim(),
          sanskrit: sanskrit.trim(),
          pronunciation: pronunciation.trim(),
        })
        onSaved(`Created term "${term}"`)
      } else if (mode === 'edit' && termToEdit) {
        await updateTerm({
          term: termToEdit,
          meaning: meaning.trim(),
          whyMatters: whyMatters.trim(),
          category: category.trim(),
          sanskrit: sanskrit.trim(),
          pronunciation: pronunciation.trim(),
        })
        onSaved(`Updated term "${termToEdit}"`)
      }
      onClose()
    } catch (e: any) {
      onError(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === 'create' ? 'Add Term' : `Edit Term: ${termToEdit}`}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Term"
            value={term}
            disabled={mode === 'edit'}
            onChange={(e) => setTerm(e.target.value)}
            required
            helperText={`${term.length}/100 characters`}
            error={term.length > 100}
          />
          <TextField
            label="Meaning / Definition"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            multiline
            minRows={2}
            required
            helperText={`${meaning.length}/1000 characters`}
            error={meaning.length > 1000}
          />
          <TextField
            label="Why it matters"
            value={whyMatters}
            onChange={(e) => setWhyMatters(e.target.value)}
            multiline
            minRows={2}
            helperText={`${whyMatters.length}/500 characters`}
            error={whyMatters.length > 500}
          />
          <TextField
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            helperText={`${category.length}/50 characters`}
            error={category.length > 50}
          />
          <TextField
            label="Sanskrit"
            value={sanskrit}
            onChange={(e) => setSanskrit(e.target.value)}
            helperText={`${sanskrit.length}/100 characters`}
            error={sanskrit.length > 100}
          />
          <TextField
            label="Pronunciation"
            value={pronunciation}
            onChange={(e) => setPronunciation(e.target.value)}
            helperText={`${pronunciation.length}/150 characters`}
            error={pronunciation.length > 150}
          />
        </Stack>
        <Box mt={1} fontSize={12} color="text.secondary">
          * Default terms are read-only. User / alpha terms are editable.
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving} variant="contained">
          {mode === 'create' ? 'Create' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default GlossaryEditor
