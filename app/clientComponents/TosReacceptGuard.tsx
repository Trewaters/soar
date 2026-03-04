'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import TosReacceptModal from './TosReacceptModal'

export default function TosReacceptGuard() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only consider TOS acceptance for authenticated users
    if (status === 'loading') return
    if (status !== 'authenticated') {
      setLoading(false)
      setOpen(false)
      return
    }

    const checkStatus = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/tos/status', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })
        if (!res.ok) {
          // If we can't determine status, default to not showing the modal
          console.warn('[TOS] status check failed', res.status)
          setOpen(false)
          return
        }
        const data = await res.json()
        setOpen(!data?.accepted)
      } catch (e) {
        console.error('Error checking TOS status:', e)
        setOpen(false)
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
  }, [status])

  const accept = async (): Promise<void> => {
    setLoading(true)
    try {
      const res = await fetch('/api/tos/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (!res.ok) {
        console.error('TOS accept failed', { status: res.status, body: data })
        throw new Error(data?.error || 'Failed to accept TOS')
      }
      // Acceptance recorded server-side; UI will reflect via subsequent status checks
    } catch (e) {
      console.error('Error accepting TOS:', e)
      // Optionally surface an alert to the user
      alert('Unable to record Terms acceptance. Please try again.')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  if (!open) return null

  return <TosReacceptModal open={open} loading={loading} onAccept={accept} />
}
