'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface OfflineStatus {
  /** Whether the browser is currently online */
  online: boolean
  /** Timestamp when current status began (null if unknown) */
  since: number | null
  /** Timestamp of the last status change (null if no change yet) */
  lastChange: number | null
}

/**
 * Hook to track browser online/offline status.
 * Uses navigator.onLine and online/offline events.
 *
 * @returns OfflineStatus object with online, since, and lastChange
 */
export function useOfflineStatus(): OfflineStatus {
  // Use ref to track if we've initialized on client
  const initialized = useRef(false)

  const [status, setStatus] = useState<OfflineStatus>({
    // Start with stable defaults for SSR
    online: true,
    since: null,
    lastChange: null,
  })

  const handleOnline = useCallback(() => {
    const now = Date.now()
    setStatus({
      online: true,
      since: now,
      lastChange: now,
    })
  }, [])

  const handleOffline = useCallback(() => {
    const now = Date.now()
    setStatus({
      online: false,
      since: now,
      lastChange: now,
    })
  }, [])

  useEffect(() => {
    // Initialize only once on client mount
    if (!initialized.current) {
      initialized.current = true
      const isOnline = navigator.onLine
      const now = Date.now()
      setStatus({
        online: isOnline,
        since: now,
        lastChange: null,
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [handleOnline, handleOffline])

  return status
}

export default useOfflineStatus
