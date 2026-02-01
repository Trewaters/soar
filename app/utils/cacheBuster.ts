/**
 * Cache Busting Utilities for Soar Yoga App
 * Provides aggressive cache invalidation strategies
 */

const CACHE_BUST_STORAGE_KEY = 'soar_cache_bust_timestamp'

/**
 * Get or create a cache bust token
 * Used to force refresh of resources
 */
export function getCacheBustToken(): string {
  let token = localStorage.getItem(CACHE_BUST_STORAGE_KEY)

  if (!token) {
    token = generateCacheBustToken()
    localStorage.setItem(CACHE_BUST_STORAGE_KEY, token)
  }

  return token
}

/**
 * Generate a new cache bust token
 * Should be called on major updates or user request
 */
export function generateCacheBustToken(): string {
  const token = `cb_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`
  localStorage.setItem(CACHE_BUST_STORAGE_KEY, token)
  return token
}

/**
 * Add cache bust parameter to URL
 */
export function addCacheBustParam(url: string, token?: string): string {
  try {
    const u = new URL(url)
    const bust = token || getCacheBustToken()

    // Always add/update cache bust parameter
    u.searchParams.set('cb', bust)

    return u.toString()
  } catch (e) {
    console.warn('[CacheBuster] Failed to parse URL:', url, e)
    return url
  }
}

/**
 * Clear all browser caches (local and IndexedDB)
 */
export async function clearAllCaches(): Promise<void> {
  try {
    // Clear localStorage
    localStorage.clear()

    // Clear sessionStorage
    sessionStorage.clear()

    // Clear IndexedDB
    const dbs = (await window.indexedDB.databases?.()) ?? []
    for (const db of dbs) {
      if (db.name) {
        window.indexedDB.deleteDatabase(db.name)
      }
    }

    // Clear Service Worker caches
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName)
      }
    }

    // Clear HTTP cache by requesting with no-cache
    const noCache = new Request('/', {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
    })
    await fetch(noCache)

    console.log('[CacheBuster] All caches cleared')
  } catch (error) {
    console.error('[CacheBuster] Error clearing caches:', error)
  }
}

/**
 * Request Service Worker to clear all caches
 */
export async function requestServiceWorkerClearCache(): Promise<void> {
  try {
    if (!navigator.serviceWorker?.controller) {
      console.log('[CacheBuster] Service Worker not active')
      return
    }

    // Use MessageChannel for response
    const channel = new MessageChannel()

    navigator.serviceWorker.controller.postMessage(
      { command: 'CLEAR_ALL_CACHES' },
      [channel.port2]
    )

    console.log('[CacheBuster] Requested SW cache clear')
  } catch (error) {
    console.error('[CacheBuster] Failed to request SW cache clear:', error)
  }
}

/**
 * Invalidate specific API URLs in Service Worker cache
 */
export async function invalidateServiceWorkerCache(
  urls: string[]
): Promise<void> {
  try {
    if (!navigator.serviceWorker?.controller) {
      console.log('[CacheBuster] Service Worker not active')
      return
    }

    navigator.serviceWorker.controller.postMessage({
      command: 'INVALIDATE_URLS',
      urls: urls,
    })

    console.log('[CacheBuster] Invalidation request sent to SW:', urls)
  } catch (error) {
    console.error('[CacheBuster] Failed to invalidate SW cache:', error)
  }
}

/**
 * Force full page reload with cache bust
 */
export function forceFullReload(): void {
  // Generate new token
  generateCacheBustToken()

  // Force reload bypassing cache
  window.location.href = addCacheBustParam(window.location.href)
}

/**
 * Monitor Service Worker for updates and trigger cache clear on new version
 */
export function monitorServiceWorkerUpdates(callback?: () => void): void {
  if (!navigator.serviceWorker) return

  navigator.serviceWorker.addEventListener('message', (event) => {
    const { data } = event

    // Listen for cache invalidation messages from SW
    if (data?.command === 'CACHE_CLEARED') {
      console.log(
        '[CacheBuster] Service Worker cleared caches at:',
        new Date(data.timestamp)
      )
      callback?.()
    }

    // Listen for invalidation confirmations
    if (data?.command === 'INVALIDATE_URLS') {
      console.log('[CacheBuster] URLs invalidated:', data.urls)
      callback?.()
    }
  })

  // Check for controller change (new SW activated)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('[CacheBuster] New Service Worker activated')
    // Clear token to force new cache bust on next request
    generateCacheBustToken()
    callback?.()
  })
}

/**
 * Get current Service Worker version
 */
export async function getServiceWorkerVersion(): Promise<{
  version: string
  cacheVersion: string
  timestamp: number
} | null> {
  return new Promise((resolve) => {
    try {
      if (!navigator.serviceWorker?.controller) {
        resolve(null)
        return
      }

      const channel = new MessageChannel()

      channel.port1.onmessage = (event) => {
        resolve(event.data)
      }

      navigator.serviceWorker.controller.postMessage(
        { command: 'GET_VERSION' },
        [channel.port2]
      )
    } catch (error) {
      console.error('[CacheBuster] Failed to get SW version:', error)
      resolve(null)
    }
  })
}

/**
 * Check if an update is available and optionally trigger refresh
 */
export async function checkAndApplyUpdates(
  autoRefresh = false
): Promise<boolean> {
  try {
    if (!navigator.serviceWorker?.controller) return false

    const swVersion = await getServiceWorkerVersion()
    if (!swVersion) return false

    const storedVersion = sessionStorage.getItem('soar_sw_version')

    // Version changed, update is available
    if (storedVersion && storedVersion !== swVersion.version) {
      console.log('[CacheBuster] Update available:', swVersion.version)

      if (autoRefresh) {
        // Clear cache and reload
        await clearAllCaches()
        window.location.reload()
      }

      return true
    }

    // Store current version
    sessionStorage.setItem('soar_sw_version', swVersion.version)
    return false
  } catch (error) {
    console.error('[CacheBuster] Error checking updates:', error)
    return false
  }
}
