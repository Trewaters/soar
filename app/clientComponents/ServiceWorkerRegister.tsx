'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    const register = async () => {
      try {
        const isDev =
          process.env.NODE_ENV === 'development' &&
          (location.hostname === 'localhost' ||
            location.hostname === '127.0.0.1')

        // In development, proactively unregister any existing service workers
        // to avoid stale/corrupted workers persisting between edits. Do NOT
        // re-register a service worker in development — that can interfere
        // with authentication flows (cookies/redirects) during local testing.
        if (isDev) {
          try {
            const regs = await navigator.serviceWorker.getRegistrations()
            for (const r of regs) {
              // eslint-disable-next-line no-console
              console.log('[SW] Dev unregistering', r.scope)
              // Unregister and wait for completion
              // eslint-disable-next-line no-await-in-loop
              await r.unregister()
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('[SW] Dev unregister failed', e)
          }
          // Skip registering the service worker in development to avoid
          // interfering with localhost auth flows.
          return
        }

        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          type: 'classic',
        })
        // Optional: log lifecycle
        reg.addEventListener?.('updatefound', () => {
          // eslint-disable-next-line no-console
          console.log('[SW] Update found')
        })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[SW] Registration failed', err)
      }
    }

    // Delay a tick to avoid competing with initial hydration
    const id = window.setTimeout(register, 100)
    return () => window.clearTimeout(id)
  }, [])

  return null
}
