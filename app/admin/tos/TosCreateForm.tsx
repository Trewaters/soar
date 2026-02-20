'use client'

import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'

type TosCreateFormProps = {
  availableTosFiles: { value: string; label: string }[]
}

export default function TosCreateForm({
  availableTosFiles,
}: TosCreateFormProps) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [effectiveAt, setEffectiveAt] = useState('')
  const [active, setActive] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [contentFile, setContentFile] = useState(
    availableTosFiles[0]?.value ?? ''
  )

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    try {
      const res = await fetch('/api/tos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          summary,
          effectiveAt,
          active,
          contentFile,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        console.error('TOS create failed', { status: res.status, body: json })
        setStatus(`Error: ${json?.error || res.statusText}`)
      } else {
        setStatus('Created')
      }
      // clear form
      setTitle('')
      setSummary('')
      setEffectiveAt('')
      setActive(false)
      setContentFile(availableTosFiles[0]?.value ?? '')
    } catch (err: any) {
      console.error('TOS create exception', err)
      setStatus('Error')
    }
  }

  const formatDateTimeLocal = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0')
    const year = d.getFullYear()
    const month = pad(d.getMonth() + 1)
    const day = pad(d.getDate())
    const hours = pad(d.getHours())
    const minutes = pad(d.getMinutes())
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const useToday = () => {
    setEffectiveAt(formatDateTimeLocal(new Date()))
  }

  return (
    <form onSubmit={submit}>
      <Stack spacing={2}>
        {status === 'Created' && (
          <Alert severity="success">TOS version created</Alert>
        )}
        {status === 'Error' && <Alert severity="error">Failed to create</Alert>}

        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          multiline
          rows={3}
        />
        <TextField
          label="TOS Content File"
          select
          value={contentFile}
          onChange={(e) => setContentFile(e.target.value)}
          required
          helperText="Select a markdown file from app/compliance/terms/content"
          disabled={availableTosFiles.length === 0}
        >
          {availableTosFiles.map((file) => (
            <MenuItem key={file.value} value={file.value}>
              {file.label}
            </MenuItem>
          ))}
        </TextField>
        {availableTosFiles.length === 0 && (
          <Alert severity="warning">
            No TOS markdown files found in app/compliance/terms/content.
          </Alert>
        )}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            label="Effective At"
            type="datetime-local"
            value={effectiveAt}
            onChange={(e) => setEffectiveAt(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          <Button onClick={useToday} variant="outlined" size="small">
            Use today
          </Button>
        </Box>
        <div style={{ fontSize: 12, color: '#666' }}>Or pick your own date</div>

        <FormControlLabel
          control={
            <Checkbox
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              color="primary"
            />
          }
          label="Publish (set active)"
        />
        <Button
          type="submit"
          variant="contained"
          disabled={availableTosFiles.length === 0}
        >
          Create
        </Button>
      </Stack>
    </form>
  )
}
