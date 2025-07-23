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

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // Ensure data is always an array
        const glossaryArray = Array.isArray(data) ? data : []

        setGlossary(glossaryArray)
        setFilteredGlossary(glossaryArray)
      } catch (error) {
        console.error('Error fetching glossary:', error)
        // Set empty arrays on any error
        setGlossary([])
        setFilteredGlossary([])
      }
    }
    fetchGlossary()
  }, [])

  const handleSearch = (event: any, value: string | null) => {
    if (!value || !Array.isArray(glossary)) {
      setFilteredGlossary(Array.isArray(glossary) ? glossary : [])
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
        options={
          Array.isArray(glossary) ? glossary.map((item) => item.term) : []
        }
        onInputChange={handleSearch}
        renderInput={(params) => (
          <TextField {...params} placeholder="Search for a term..." />
        )}
        sx={{ mb: 4 }}
      />
      {Array.isArray(filteredGlossary) ? (
        filteredGlossary.map((item) => (
          <Stack key={item.id} sx={{ mb: 4 }}>
            <Typography variant={'h2'}>{item.term}</Typography>
            <Typography variant={'body1'}>
              <strong>Meaning:</strong> {item.meaning}
            </Typography>
            <Typography variant={'body1'}>
              <strong>Why it matters:</strong> {item.whyMatters}
            </Typography>
          </Stack>
        ))
      ) : (
        <Typography variant="body1">No glossary terms available.</Typography>
      )}
    </Box>
  )
}
