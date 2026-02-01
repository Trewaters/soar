/**
 * Cache Management Service for Soar Yoga App
 * Provides utilities for cache invalidation and management
 */

import {
  clearAllCaches,
  invalidateServiceWorkerCache,
  requestServiceWorkerClearCache,
  getServiceWorkerVersion,
  generateCacheBustToken,
} from '../utils/cacheBuster'

/**
 * Invalidate API cache for specific endpoints
 * Use this when you update user data, preferences, or yoga content
 */
export async function invalidateApiCache(endpoints: string[]): Promise<void> {
  const urls = endpoints.map((endpoint) => {
    const url = new URL(endpoint, window.location.origin)
    return url.toString()
  })

  await invalidateServiceWorkerCache(urls)
  console.log('[CacheService] Invalidated API cache for:', endpoints)
}

/**
 * Invalidate cache for yoga data (poses, series, sequences)
 */
export async function invalidateYogaDataCache(): Promise<void> {
  const endpoints = [
    '/api/asana',
    '/api/asanaSeries',
    '/api/asanaSequence',
    '/api/userData',
  ]
  await invalidateApiCache(endpoints)
}

/**
 * Invalidate user-specific data cache
 */
export async function invalidateUserCache(userId?: string): Promise<void> {
  const id = userId || 'current'
  const endpoints = [`/api/user/${id}`, `/api/userData/${id}`]
  await invalidateApiCache(endpoints)
}

/**
 * Invalidate practice session cache
 */
export async function invalidatePracticeCache(): Promise<void> {
  const endpoints = [
    '/api/practice',
    '/api/practice/sessions',
    '/api/practice/history',
  ]
  await invalidateApiCache(endpoints)
}

/**
 * Hard refresh: clear all caches and reload page
 */
export async function hardRefresh(): Promise<void> {
  console.log('[CacheService] Performing hard refresh')
  await clearAllCaches()
  await requestServiceWorkerClearCache()
  generateCacheBustToken()

  // Reload after a brief delay
  setTimeout(() => {
    window.location.reload()
  }, 500)
}

/**
 * Get current cache status
 */
export async function getCacheStatus(): Promise<{
  serviceWorkerVersion: string | null
  hasUpdates: boolean
  cacheSize: number
}> {
  try {
    const swVersion = await getServiceWorkerVersion()

    // Estimate cache size
    let cacheSize = 0
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      cacheSize = estimate.usage || 0
    }

    return {
      serviceWorkerVersion: swVersion?.version || null,
      hasUpdates: false,
      cacheSize,
    }
  } catch (error) {
    console.error('[CacheService] Error getting cache status:', error)
    return {
      serviceWorkerVersion: null,
      hasUpdates: false,
      cacheSize: 0,
    }
  }
}

/**
 * Clear cache for a specific type of content
 */
export async function clearCacheByType(
  type: 'images' | 'api' | 'assets' | 'all'
): Promise<void> {
  try {
    if ('caches' in window) {
      const cacheNames = await caches.keys()

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName)
        const requests = await cache.keys()

        for (const request of requests) {
          const shouldDelete =
            type === 'all' ||
            (type === 'images' &&
              request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) ||
            (type === 'api' && request.url.includes('/api/')) ||
            (type === 'assets' && request.url.match(/\.(js|css|woff|woff2)$/i))

          if (shouldDelete) {
            await cache.delete(request)
          }
        }
      }

      console.log(`[CacheService] Cleared ${type} cache`)
    }
  } catch (error) {
    console.error(`[CacheService] Error clearing ${type} cache:`, error)
  }
}

/**
 * Listen for cache events and trigger callbacks
 */
export function onCacheClear(callback: () => void): () => void {
  const handler = () => callback()
  window.addEventListener('soar:cache-cleared', handler as EventListener)

  // Return unsubscribe function
  return () => {
    window.removeEventListener('soar:cache-cleared', handler as EventListener)
  }
}

/**
 * Listen for invalidation events
 */
export function onCacheInvalidate(
  // eslint-disable-next-line no-unused-vars
  callback: (urls: string[]) => void
): () => void {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent
    callback(customEvent.detail?.urls || [])
  }
  window.addEventListener('soar:sw-invalidate', handler)

  // Return unsubscribe function
  return () => {
    window.removeEventListener('soar:sw-invalidate', handler)
  }
}

/**
 * Listen for Service Worker controller changes
 */
export function onControllerChange(callback: () => void): () => void {
  const handler = () => callback()
  window.addEventListener('soar:sw-controller-change', handler as EventListener)

  // Return unsubscribe function
  return () => {
    window.removeEventListener(
      'soar:sw-controller-change',
      handler as EventListener
    )
  }
}
