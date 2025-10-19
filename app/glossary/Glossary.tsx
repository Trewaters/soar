'use client'
import React, { useMemo, useState, useEffect } from 'react'
import { useGlossary } from './GlossaryContext'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import SearchField from '@app/clientComponents/form/SearchField'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import GlossaryEditor from './GlossaryEditor'

/**
 * Glossary component (Phase 1)
 * Displays default glossary terms (read-only) ensuring non-empty glossary baseline.
 * Future phases will merge user + alpha_user terms.
 */
export const Glossary: React.FC = () => {
  const { terms, loading, error, deleteTerm } = useGlossary()
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [category, setCategory] = useState('all')
  const [source, setSource] = useState('all')
  const [sort, setSort] = useState<
    'term_asc' | 'term_desc' | 'category' | 'recent'
  >('term_asc')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create')
  const [editTarget, setEditTarget] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [snack, setSnack] = useState<{
    open: boolean
    msg: string
    severity: 'success' | 'error'
  }>({ open: false, msg: '', severity: 'success' })

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim().toLowerCase()), 300)
    return () => clearTimeout(id)
  }, [search])

  const categories = useMemo(() => {
    const set = new Set<string>()
    terms.forEach((t) => t.category && set.add(t.category))
    return Array.from(set).sort()
  }, [terms])

  const filtered = useMemo(() => {
    let data = terms
    if (debounced) {
      data = data.filter(
        (t) =>
          t.term.toLowerCase().includes(debounced) ||
          (t.definition && t.definition.toLowerCase().includes(debounced)) ||
          (t.sanskrit && t.sanskrit.toLowerCase().includes(debounced))
      )
    }
    if (category !== 'all') {
      data = data.filter((t) => t.category === category)
    }
    if (source !== 'all') {
      data = data.filter((t) => (t.source || 'user') === source)
    }
    switch (sort) {
      case 'term_desc':
        data = [...data].sort((a, b) => b.term.localeCompare(a.term))
        break
      case 'category':
        data = [...data].sort(
          (a, b) =>
            (a.category || '').localeCompare(b.category || '') ||
            a.term.localeCompare(b.term)
        )
        break
      case 'recent':
        // no createdAt client field yet; keep as-is for placeholder
        data = [...data]
        break
      default:
        data = [...data].sort((a, b) => a.term.localeCompare(b.term))
    }
    return data
  }, [terms, debounced, category, source, sort])

  const openCreate = () => {
    setEditorMode('create')
    setEditTarget(null)
    setEditorOpen(true)
  }
  const openEdit = (term: string) => {
    setEditorMode('edit')
    setEditTarget(term)
    setEditorOpen(true)
  }
  const requestDelete = (term: string) => {
    setDeleteTarget(term)
    setConfirmOpen(true)
  }
  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteTerm(deleteTarget)
      setSnack({
        open: true,
        msg: `Deleted term "${deleteTarget}"`,
        severity: 'success',
      })
    } catch (e: any) {
      setSnack({
        open: true,
        msg: e?.message || 'Delete failed',
        severity: 'error',
      })
    } finally {
      setConfirmOpen(false)
      setDeleteTarget(null)
    }
  }
  const onSaved = (msg: string) =>
    setSnack({ open: true, msg, severity: 'success' })
  const onError = (msg: string) =>
    setSnack({ open: true, msg, severity: 'error' })
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }))

  return (
    <Box
      component="section"
      aria-labelledby="glossary-heading"
      sx={{ p: { xs: 2, md: 3 } }}
    >
      <Typography id="glossary-heading" variant="h4" gutterBottom>
        Yoga Glossary
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={2}>
        Foundational terminology to support your practice. Default terms are
        highlighted with a badge.
      </Typography>
      <Box mb={2} display="flex" flexWrap="wrap" gap={2} alignItems="flex-end">
        <SearchField
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          placeholder="Search term, definition, Sanskrit"
          sx={{ maxWidth: 360 }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="glossary-category-label">Category</InputLabel>
          <Select
            labelId="glossary-category-label"
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="glossary-source-label">Source</InputLabel>
          <Select
            labelId="glossary-source-label"
            label="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="alpha_user">Alpha</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="glossary-sort-label">Sort</InputLabel>
          <Select
            labelId="glossary-sort-label"
            label="Sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
          >
            <MenuItem value="term_asc">Term A→Z</MenuItem>
            <MenuItem value="term_desc">Term Z→A</MenuItem>
            <MenuItem value="category">Category</MenuItem>
            <MenuItem value="recent">Recently Added</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ ml: 'auto' }}
        >
          Add Term
        </Button>
      </Box>
      <GlossaryEditor
        open={editorOpen}
        mode={editorMode}
        termToEdit={editTarget}
        onClose={() => setEditorOpen(false)}
        onSaved={onSaved}
        onError={onError}
      />
      {loading && (
        <Typography role="status" aria-live="polite" mb={2}>
          Loading glossary…
        </Typography>
      )}
      {error && !loading && (
        <Typography color="error" mb={2} aria-live="assertive">
          {error}
        </Typography>
      )}
      <Grid
        container
        spacing={2}
        component="ul"
        aria-label="Glossary term list"
        sx={{ listStyle: 'none', pl: 0 }}
      >
        {filtered.map((t) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={t.term}
            component="li"
            aria-label={`Term ${t.term}`}
          >
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                borderColor: 'primary.light',
                position: 'relative',
                '&:focus-within': {
                  boxShadow: (theme) =>
                    `0 0 0 3px ${theme.palette.primary.light}`,
                },
              }}
              tabIndex={0}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  <Typography variant="h6" component="h3">
                    {t.term}
                  </Typography>
                  {t.source === 'default' && (
                    <Chip
                      size="small"
                      color="primary"
                      label="Default"
                      aria-label="Default glossary term"
                    />
                  )}
                  {t.source === 'alpha_user' && (
                    <Chip
                      size="small"
                      color="secondary"
                      label="Alpha"
                      aria-label="Alpha user glossary term"
                    />
                  )}
                  {t.source === 'user' && (
                    <Chip
                      size="small"
                      variant="outlined"
                      label="User"
                      aria-label="User glossary term"
                    />
                  )}
                  {!t.readOnly && (
                    <Box ml="auto" display="flex" gap={0.5}>
                      <Tooltip title="Edit term">
                        <IconButton
                          aria-label={`Edit ${t.term}`}
                          size="small"
                          onClick={() => openEdit(t.term)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete term">
                        <span>
                          <IconButton
                            aria-label={`Delete ${t.term}`}
                            size="small"
                            onClick={() => requestDelete(t.term)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
                {t.sanskrit && (
                  <Typography
                    variant="subtitle2"
                    color="info.main"
                    aria-label="Sanskrit term"
                  >
                    {t.sanskrit}{' '}
                    {t.pronunciation && <em>({t.pronunciation})</em>}
                  </Typography>
                )}
                <Typography variant="body2" mt={0.5} aria-label="Definition">
                  {t.definition}
                </Typography>
                {t.whyMatters && (
                  <Tooltip title="Why it matters">
                    <Typography
                      mt={1}
                      variant="caption"
                      color="text.secondary"
                      aria-label="Why this term matters"
                      sx={{ display: 'block' }}
                    >
                      {t.whyMatters}
                    </Typography>
                  </Tooltip>
                )}
                <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
                  {t.category && (
                    <Chip
                      size="small"
                      variant="outlined"
                      label={t.category}
                      aria-label={`Category ${t.category}`}
                    />
                  )}
                  {t.pronunciation && !t.sanskrit && (
                    <Chip
                      size="small"
                      variant="outlined"
                      label={t.pronunciation}
                      aria-label="Pronunciation"
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete term</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{deleteTarget}&quot;? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={closeSnack}
          severity={snack.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Glossary
