/*
  Soar Yoga - Service Worker
  Clean, single-file service worker.
*/

const CACHE_VERSION = 'v2026.02.24'
const CACHE_NAME = `soar-offline-${CACHE_VERSION}`
const SW_VERSION = '1.0.0'
const CACHE_BUST_TIMESTAMP = new Date().getTime()

const PRECACHE_URLS = [
  '/',
  '/offline',
  '/favicon.ico',
  '/icon-192x192.png',
  '/icon-512x512.png',
]

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
            // Delete old cache versions.
            if (key !== CACHE_NAME && key.startsWith('soar-offline-')) {
              console.log('[SW] Deleting old cache:', key)
              return caches.delete(key)
            }
            return Promise.resolve()
          })
        )
      })
      .then(function () {
        // Clear the current cache before repopulating fresh content.
        return caches.delete(CACHE_NAME)
      })
      .then(function () {
        // Repopulate with fresh precache URLs.
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
      // Network-first for navigation requests.
      fetch(request).catch(function () {
        // Fallback to cache when offline.
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
      // Stale-while-revalidate for static assets.
      caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(request).then(function (cached) {
          // Fetch a fresh copy in the background.
          var fetchPromise = fetch(request)
            .then(function (networkResponse) {
              // Always refresh the cache with the network response.
              if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone())
              }
              return networkResponse
            })
            .catch(function () {
              // Network failed; return cached response or error.
              if (cached) return cached
              return new Response('Offline asset unavailable', { status: 504 })
            })

          // Return cache immediately, or await network response.
          return cached || fetchPromise
        })
      })
    )
    return
  }

  if (isJsonRequest(request)) {
    event.respondWith(
      // Network-first for API/data requests.
      fetch(request)
        .then(function (networkResponse) {
          // Cache only successful responses.
          if (networkResponse && networkResponse.status === 200) {
            return caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, networkResponse.clone())
              return networkResponse
            })
          }
          return networkResponse
        })
        .catch(function () {
          // Fallback to stale cache if network fails.
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
    // Network-first with cache fallback for all other requests.
    caches.open(CACHE_NAME).then(function (cache) {
      return fetch(request)
        .then(function (networkResponse) {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone())
          }
          return networkResponse
        })
        .catch(function () {
          // Network failed; return cached response.
          return cache.match(request).then(function (cached) {
            if (cached) return cached
            return new Response('Offline', { status: 503 })
          })
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
          // Repopulate with fresh precache URLs.
          return caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(PRECACHE_URLS).catch(function (e) {
              console.warn('[SW] Precache repopulation failed:', e)
            })
          })
        })
        .then(function () {
          // Broadcast cache-clear event to all clients.
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
  // Invalidate cached URLs on demand. Clients can send:
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
                // Remove only same-origin cached requests.
                if (!isSameOrigin(u)) {
                  console.debug('[SW] skipping cross-origin invalidation', {
                    url: u,
                  })
                  return Promise.resolve(false)
                }
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
            // After deletions, broadcast invalidation to all window clients.
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
                      // Ignore per-client failures.
                    }
                  })
                })
            } catch (e) {
              // Ignore client-broadcast failures.
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
    url: '/flows/practiceSeries',
    tag: 'yoga-reminder',
    requireInteraction: false,
    actions: [],
  }

  if (event.data) {
    try {
      var parsed = event.data.json()
      notificationData = Object.assign({}, notificationData, parsed)
    } catch (e) {
      // Ignore payload parse errors.
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
