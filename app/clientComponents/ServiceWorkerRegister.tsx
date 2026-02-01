'use client'

import { useEffect } from 'react'
import {
  monitorServiceWorkerUpdates,
  requestServiceWorkerClearCache,
} from '../utils/cacheBuster'

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

        const reg = await navigator.serviceWorker.register(
          '/sw.js?cb=' + new Date().getTime(),
          {
            scope: '/',
            type: 'classic',
          }
        )
        // Optional: log lifecycle
        reg.addEventListener?.('updatefound', () => {
          // eslint-disable-next-line no-console
          console.log('[SW] Update found, triggering cache clear')
          // Clear caches when update is found
          requestServiceWorkerClearCache().catch((e) =>
            console.warn('[SW] Failed to clear cache on update:', e)
          )
        })

        // Monitor for Service Worker updates (no automatic reload)
        monitorServiceWorkerUpdates(() => {
          console.log('[SW] Cache cleared - update available')
          // Note: Removed automatic reload to prevent infinite loop
          // User can manually reload or it will reload on next navigation
        })

        // Listen for messages from the service worker and re-broadcast as a
        // CustomEvent on window so application components can react to
        // INVALIDATE_URLS messages without directly depending on navigator APIs.
        try {
          if (
            navigator.serviceWorker &&
            navigator.serviceWorker.addEventListener
          ) {
            navigator.serviceWorker.addEventListener('message', (ev: any) => {
              try {
                const data = ev?.data
                if (!data) return
                if (data.command === 'INVALIDATE_URLS') {
                  console.debug(
                    '[SW] received INVALIDATE_URLS; rebroadcasting',
                    { urls: data.urls }
                  )
                  try {
                    window.dispatchEvent(
                      new CustomEvent('soar:sw-invalidate', {
                        detail: { urls: data.urls },
                      })
                    )
                  } catch (e) {
                    // fallback: post a plain message to window
                    try {
                      window.postMessage(
                        { command: 'SOAR_SW_INVALIDATE', urls: data.urls },
                        '*'
                      )
                    } catch (e2) {
                      // ignore
                    }
                  }
                }
              } catch (e) {
                console.warn('[SW] message handler failed', e)
              }
            })
            // When a new service worker takes control, emit an event so
            // application components can re-establish state or re-run
            // authoritative checks. This helps installed PWAs or pages that
            // were previously uncontrolled start listening for invalidations.
            try {
              navigator.serviceWorker.addEventListener(
                'controllerchange',
                () => {
                  try {
                    console.debug(
                      '[SW] controller changed; rebroadcasting controller-change'
                    )
                    window.dispatchEvent(
                      new CustomEvent('soar:sw-controller-change')
                    )
                  } catch (e) {
                    // ignore
                  }
                }
              )
            } catch (e) {
              // ignore
            }
          }
        } catch (e) {
          console.warn('[SW] failed to attach message listener', e)
        }
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
