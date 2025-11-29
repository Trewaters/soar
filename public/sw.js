/*
  Soar Yoga - Service Worker
  Clean, single-file service worker.
*/

const CACHE_VERSION = 'v4'
const CACHE_NAME = `soar-offline-${CACHE_VERSION}`
const SW_VERSION = '2.0.3'

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
  console.log('[SW ' + SW_VERSION + '] install')
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
  console.log('[SW ' + SW_VERSION + '] activate')
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys.map(function (key) {
            if (key !== CACHE_NAME && key.startsWith('soar-offline-')) {
              console.log('[SW] deleting old cache', key)
              return caches.delete(key)
            }
            return Promise.resolve()
          })
        )
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
      fetch(request)
        .then(function (networkResponse) {
          return caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, networkResponse.clone())
            return networkResponse
          })
        })
        .catch(function () {
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
      caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(request).then(function (cached) {
          if (cached) return cached
          return fetch(request)
            .then(function (networkResponse) {
              cache.put(request, networkResponse.clone())
              return networkResponse
            })
            .catch(function () {
              return new Response('Offline asset unavailable', { status: 504 })
            })
        })
      })
    )
    return
  }

  if (isJsonRequest(request)) {
    event.respondWith(
      fetch(request)
        .then(function (networkResponse) {
          return caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, networkResponse.clone())
            return networkResponse
          })
        })
        .catch(function () {
          return caches.open(CACHE_NAME).then(function (cache) {
            return cache.match(request).then(function (cached) {
              if (cached) return cached
              return new Response(JSON.stringify({ offline: true }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200,
              })
            })
          })
        })
    )
    return
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(request).then(function (cached) {
        if (cached) return cached
        return fetch(request)
          .then(function (networkResponse) {
            cache.put(request, networkResponse.clone())
            return networkResponse
          })
          .catch(function () {
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
      event.ports[0].postMessage({ version: SW_VERSION })
    }
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
          )
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
  console.log('[SW] syncYogaData')
  return Promise.resolve()
}
