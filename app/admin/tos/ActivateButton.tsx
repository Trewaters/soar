'use client'

import React, { useState } from 'react'
import Button from '@mui/material/Button'
import { useRouter } from 'next/navigation'

export default function ActivateButton({
  versionId,
  active,
}: {
  versionId: string
  active?: boolean
}) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const onActivate = async () => {
    if (
      !confirm(
        'Make this version active? This will deactivate the current active version.'
      )
    )
      return
    setLoading(true)
    try {
      const res = await fetch('/api/tos/activate', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionId }),
      })
      const json = await res.json().catch(() => ({}))
      if (res.ok) {
        router.refresh()
        alert('Activated: ' + (json?.updated?.id || 'ok'))
      } else {
        alert('Failed to activate: ' + (json?.error || res.statusText))
      }
    } catch (err: any) {
      alert('Activation error: ' + String(err?.message || err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="small"
      variant={active ? 'outlined' : 'contained'}
      onClick={onActivate}
      disabled={loading}
    >
      {loading ? 'Working…' : active ? 'Active' : 'Activate'}
    </Button>
  )
}
