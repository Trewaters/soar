'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export function useRequireTosAcceptance() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const suspended = (session?.user as any)?.suspended_tos
    if (status === 'authenticated' && suspended) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [status, session])

  const accept = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/tos/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        credentials: 'same-origin',
      })
      if (!res.ok) throw new Error('Failed to accept')

      // Reload page / session so server-side session state updates
      window.location.reload()
    } finally {
      setLoading(false)
    }
  }, [])

  return { open, loading, accept }
}
