'use client'

import { useEffect, useState } from 'react'
import { Box, Stack, Typography, TextField, Autocomplete } from '@mui/material'

interface GlossaryTerm {
  id: string
  term: string
  meaning: string
  whyMatters: string
}

export default function GlossaryPage() {
  const [glossary, setGlossary] = useState<GlossaryTerm[]>([])
  const [filteredGlossary, setFilteredGlossary] = useState<GlossaryTerm[]>([])

  useEffect(() => {
    async function fetchGlossary() {
      try {
        const response = await fetch('/api/glossary')
        const data = await response.json()

        // Handle both successful responses and error responses
        if (response.ok) {
          // Successful response - data should be an array
          setGlossary(Array.isArray(data) ? data : [])
          setFilteredGlossary(Array.isArray(data) ? data : [])
        } else {
          // Error response - check if it has a terms property
          console.error(
            'Error fetching glossary:',
            data.error || 'Unknown error'
          )
          setGlossary(Array.isArray(data.terms) ? data.terms : [])
          setFilteredGlossary(Array.isArray(data.terms) ? data.terms : [])
        }
      } catch (error) {
        console.error('Network error fetching glossary:', error)
        setGlossary([])
        setFilteredGlossary([])
      }
    }
    fetchGlossary()
  }, [])

  const handleSearch = (event: any, value: string | null) => {
    if (!value) {
      setFilteredGlossary(glossary)
    } else {
      setFilteredGlossary(
        glossary.filter((item) =>
          item.term.toLowerCase().includes(value.toLowerCase())
        )
      )
    }
  }

  return (
    <Box sx={{ mx: 4, mt: 4 }}>
      <Autocomplete
        freeSolo
        options={glossary.map((item) => item.term)}
        onInputChange={handleSearch}
        renderInput={(params) => (
          <TextField {...params} placeholder="Search for a term..." />
        )}
        sx={{ mb: 4 }}
      />
      {filteredGlossary.map((item) => (
        <Stack key={item.id} sx={{ mb: 4 }}>
          <Typography variant={'h2'}>{item.term}</Typography>
          <Typography variant={'body1'}>
            <strong>Meaning:</strong> {item.meaning}
          </Typography>
          <Typography variant={'body1'}>
            <strong>Why it matters:</strong> {item.whyMatters}
          </Typography>
        </Stack>
      ))}
    </Box>
  )
}
