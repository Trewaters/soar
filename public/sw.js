/*
  Soar Yoga - Service Worker
  Clean, single-file service worker.
*/

const CACHE_VERSION = 'v7'
const CACHE_NAME = `soar-offline-${CACHE_VERSION}`
const SW_VERSION = '3.0.0'
const CACHE_BUST_TIMESTAMP = new Date().getTime()

const PRECACHE_URLS = [
  '/',
  '/offline',
  '/favicon.ico',
  '/icon-192x192.png',
  '/icon-512x512.png',
]

// Cache control configuration - aggressive busting
const CACHE_CONTROL_CONFIG = {
  // HTML, CSS, JS: network-first with short cache
  assets: 1000 * 60, // 1 minute
  // API responses: always revalidate
  api: 0,
  // Images: cache but check occasionally
  images: 1000 * 60 * 5, // 5 minutes
  // Static files: cache but with version check
  static: 1000 * 60 * 10, // 10 minutes
}

function isSameOrigin(url) {
  try {
    const u = new URL(url)
    return u.origin === self.location.origin
  } catch (e) {
    return false
  }
}

function isJsonRequest(request) {
  try {
    const url = new URL(request.url)
    const accept = request.headers.get('accept') || ''
    return url.pathname.endsWith('.json') || accept.includes('application/json')
  } catch (e) {
    return false
  }
}

function addCacheBustParam(url) {
  try {
    const u = new URL(url)
    // Add cache bust parameter if not already present
    if (!u.searchParams.has('cb')) {
      u.searchParams.set('cb', CACHE_BUST_TIMESTAMP)
    }
    return u.toString()
  } catch (e) {
    return url
  }
}

function isCacheExpired(timestamp, maxAge) {
  if (!timestamp) return true
  return new Date().getTime() - timestamp > maxAge
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(PRECACHE_URLS).catch(function (e) {
          console.warn('[SW] Precache warning:', e)
        })
      })
      .then(function () {
        return self.skipWaiting()
      })
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys.map(function (key) {
            // Delete all old cache versions
            if (key !== CACHE_NAME && key.startsWith('soar-offline-')) {
              console.log('[SW] Deleting old cache:', key)
              return caches.delete(key)
            }
            return Promise.resolve()
          })
        )
      })
      .then(function () {
        // Clear current cache and repopulate to ensure fresh content
        return caches.delete(CACHE_NAME)
      })
      .then(function () {
        // Repopulate with fresh precache URLs
        return caches.open(CACHE_NAME).then(function (cache) {
          return cache.addAll(PRECACHE_URLS).catch(function (e) {
            console.warn('[SW] Precache refresh failed:', e)
          })
        })
      })
      .then(function () {
        return self.clients.claim()
      })
  )
})

self.addEventListener('fetch', function (event) {
  var request = event.request
  if (request.method !== 'GET') return

  if (request.mode === 'navigate') {
    event.respondWith(
      // Network-first for navigation: always try network first for HTML
      fetch(request)
        .then(function (networkResponse) {
          // Validate response is HTML
          const contentType = networkResponse.headers.get('content-type') || ''
          if (contentType.includes('text/html')) {
            // Don't cache navigation responses, keep them fresh
            return networkResponse
          }
          return networkResponse
        })
        .catch(function () {
          // Fall back to cached version when offline
          return caches.open(CACHE_NAME).then(function (cache) {
            return cache.match(request).then(function (cached) {
              if (cached) return cached
              return cache.match('/offline').then(function (offline) {
                if (offline) return offline
                return new Response('You are offline.', { status: 503 })
              })
            })
          })
        })
    )
    return
  }

  if (
    isSameOrigin(request.url) &&
    ['script', 'style', 'image', 'font'].indexOf(request.destination) !== -1
  ) {
    event.respondWith(
      // Stale-while-revalidate: serve cached but also fetch fresh
      caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(request).then(function (cached) {
          // Fetch fresh copy in background
          var fetchPromise = fetch(request)
            .then(function (networkResponse) {
              // Always update cache with network version
              if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone())
              }
              return networkResponse
            })
            .catch(function () {
              // Network failed, return cached or error
              if (cached) return cached
              return new Response('Offline asset unavailable', { status: 504 })
            })

          // Return cached immediately, or wait for network
          return cached || fetchPromise
        })
      })
    )
    return
  }

  if (isJsonRequest(request)) {
    event.respondWith(
      // Network-first for API: always fetch fresh data
      fetch(request)
        .then(function (networkResponse) {
          // Only cache successful responses
          if (networkResponse && networkResponse.status === 200) {
            return caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, networkResponse.clone())
              return networkResponse
            })
          }
          return networkResponse
        })
        .catch(function () {
          // Fall back to stale cache if network fails
          return caches.open(CACHE_NAME).then(function (cache) {
            return cache.match(request).then(function (cached) {
              if (cached) {
                console.debug('[SW] Using stale API cache for:', request.url)
                return cached
              }
              return new Response(
                JSON.stringify({ offline: true, error: 'Network unavailable' }),
                {
                  headers: { 'Content-Type': 'application/json' },
                  status: 200,
                }
              )
            })
          })
        })
    )
    return
  }

  event.respondWith(
    // Cache-first with network fallback for other resources
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(request).then(function (cached) {
        // Try network first
        var fetchPromise = fetch(request)
          .then(function (networkResponse) {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone())
            }
            return networkResponse
          })
          .catch(function () {
            // Network failed, return cached
            if (cached) return cached
            return new Response('Offline', { status: 503 })
          })

        return fetchPromise
      })
    })
  )
})

self.addEventListener('message', function (event) {
  if (!event.data) return
  if (
    event.data === 'SKIP_WAITING' ||
    (event.data && event.data.command === 'SKIP_WAITING')
  ) {
    self.skipWaiting()
    return
  }
  if (event.data && event.data.command === 'GET_VERSION') {
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({
        version: SW_VERSION,
        cacheVersion: CACHE_VERSION,
        timestamp: CACHE_BUST_TIMESTAMP,
      })
    }
  }
  if (event.data && event.data.command === 'CLEAR_ALL_CACHES') {
    event.waitUntil(
      caches
        .keys()
        .then(function (keys) {
          return Promise.all(
            keys.map(function (key) {
              console.log('[SW] Force clearing cache:', key)
              return caches.delete(key)
            })
          )
        })
        .then(function () {
          // Repopulate with fresh precache
          return caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(PRECACHE_URLS).catch(function (e) {
              console.warn('[SW] Precache repopulation failed:', e)
            })
          })
        })
        .then(function () {
          // Broadcast to all clients
          return self.clients
            .matchAll({ includeUncontrolled: true, type: 'window' })
            .then(function (clientList) {
              clientList.forEach(function (client) {
                client.postMessage({
                  command: 'CACHE_CLEARED',
                  timestamp: new Date().getTime(),
                })
              })
            })
        })
    )
  }
  // Invalidate cached URLs on demand. Client can send:
  // { command: 'INVALIDATE_URLS', urls: ['https://.../api/...'] }
  if (event.data && event.data.command === 'INVALIDATE_URLS') {
    try {
      const urls = Array.isArray(event.data.urls) ? event.data.urls : []
      if (urls.length === 0) return
      console.debug('[SW] invalidate request received', { urls })
      event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
          return Promise.all(
            urls.map(function (u) {
              try {
                // We only remove same-origin cached requests
                const req = new Request(u)
                return cache
                  .delete(req)
                  .then(function (deleted) {
                    if (deleted) {
                      console.debug('[SW] deleted cached entry', { url: u })
                    } else {
                      console.debug('[SW] no cached entry to delete', {
                        url: u,
                      })
                    }
                    return deleted
                  })
                  .catch(function (e) {
                    console.warn('[SW] per-url delete failed', {
                      url: u,
                      err: e,
                    })
                  })
              } catch (e) {
                return Promise.resolve()
              }
            })
          ).then(function () {
            // After attempting deletions, broadcast invalidation to all window clients
            try {
              return self.clients
                .matchAll({ includeUncontrolled: true, type: 'window' })
                .then(function (clientList) {
                  clientList.forEach(function (client) {
                    try {
                      client.postMessage({
                        command: 'INVALIDATE_URLS',
                        urls: urls,
                      })
                    } catch (e) {
                      // ignore per-client failures
                    }
                  })
                })
            } catch (e) {
              // ignore failures
            }
          })
        })
      )
    } catch (e) {
      console.warn('[SW] invalidate urls failed', e)
    }
  }
})

self.addEventListener('push', function (event) {
  var notificationData = {
    title: 'Soar Yoga Practice Reminder',
    body: 'Time for your yoga practice!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    url: '/navigator/flows/practiceSeries',
    tag: 'yoga-reminder',
    requireInteraction: false,
    actions: [],
  }

  if (event.data) {
    try {
      var parsed = event.data.json()
      notificationData = Object.assign({}, notificationData, parsed)
    } catch (e) {
      // ignore
    }
  }

  var promise = self.registration
    .showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      actions: notificationData.actions,
      data: { url: notificationData.url },
    })
    .catch(function (err) {
      console.warn('[SW] showNotification failed', err)
    })

  event.waitUntil(promise)
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  var urlToOpen =
    (event.notification.data && event.notification.data.url) || '/'
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i]
          if (client.url.indexOf(urlToOpen) !== -1 && 'focus' in client) {
            return client.focus()
          }
        }
        if (clients.openWindow) return clients.openWindow(urlToOpen)
      })
  )
})

self.addEventListener('sync', function (event) {
  if (event.tag === 'yoga-practice-sync') {
    event.waitUntil(syncYogaData())
  }
})

function syncYogaData() {
  return Promise.resolve()
}
