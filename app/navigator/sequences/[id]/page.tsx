'use client'

import { notFound } from 'next/navigation'
import { Box } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, use } from 'react'
import SequenceViewWithEdit from '@clientComponents/SequenceViewWithEdit'
import type { EditableSequence } from '@clientComponents/EditSequence'

export default function SequenceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const searchParams = useSearchParams()

  // Fallback method using window.location.search
  const [shouldEditFallback, setShouldEditFallback] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const editParam = urlParams.get('edit')
      setShouldEditFallback(editParam === 'true')
    }
  }, [])

  const shouldEdit = searchParams.get('edit') === 'true'
  const finalShouldEdit = shouldEdit || shouldEditFallback // Use fallback if useSearchParams fails

  const [sequence, setSequence] = useState<EditableSequence | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSequence() {
      try {
        const response = await fetch(`/api/sequences/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
            return
          }
          throw new Error('Failed to fetch sequence')
        }
        const seq = await response.json()

        const sequenceData = {
          id: seq.id,
          nameSequence: seq.nameSequence,
          sequencesSeries: Array.isArray(seq.sequencesSeries)
            ? (seq.sequencesSeries as any[])
            : [],
          description: seq.description ?? undefined,
          image: seq.image ?? undefined,
          created_by: (seq as any).created_by ?? null,
        }
        setSequence(sequenceData)
      } catch (error) {
        console.error('Error fetching sequence:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchSequence()
  }, [id])

  if (loading) {
    return <Box sx={{ p: 2 }}>Loading...</Box>
  }

  if (!sequence) {
    notFound()
    return null
  }

  return (
    <Box sx={{ p: 2 }}>
      <SequenceViewWithEdit
        sequence={sequence}
        defaultShowEdit={finalShouldEdit}
      />
    </Box>
  )
}
