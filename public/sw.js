// Service Worker for handling push notifications in Soar Yoga App
// Version 2.0 - Enhanced error handling and caching prevention

const CACHE_VERSION = 'v2.0'
const SW_VERSION = '2.0.1'

console.log(`Service Worker ${SW_VERSION} initializing...`)

self.addEventListener('install', (event) => {
  console.log(`Service Worker ${SW_VERSION} installing...`)
  // Skip waiting to activate the new service worker immediately
  // This prevents caching issues that can cause push subscription failures
  event.waitUntil(
    Promise.resolve().then(() => {
      console.log('Service Worker installation complete')
      return self.skipWaiting()
    })
  )
})

self.addEventListener('activate', (event) => {
  console.log(`Service Worker ${SW_VERSION} activated`)

  // Take control of all clients immediately and clear old caches
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_VERSION)
            .map((cacheName) => {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            })
        )
      }),
    ]).then(() => {
      console.log('Service Worker activation complete')

      // Notify all clients that service worker is ready
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            version: SW_VERSION,
            timestamp: Date.now(),
          })
        })
      })
    })
  )
})

// Handle messages from main thread
self.addEventListener('message', (event) => {
  console.log(`[SW ${SW_VERSION}] Message received:`, event.data)

  if (event.data && event.data.command === 'SKIP_WAITING') {
    console.log('Skipping waiting as requested')
    self.skipWaiting()
  }

  if (event.data && event.data.command === 'GET_VERSION') {
    event.ports[0].postMessage({ version: SW_VERSION })
  }
})

// Handle push notifications with enhanced error handling
self.addEventListener('push', (event) => {
  console.log(`[SW ${SW_VERSION}] Push event received:`, event)

  let notificationData = {
    title: 'Soar Yoga Practice Reminder',
    body: 'Time for your yoga practice! 🧘‍♀️',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    url: '/navigator/flows/practiceSeries',
    tag: 'yoga-reminder',
    requireInteraction: false,
    actions: [
      {
        action: 'start-practice',
        title: 'Start Practice',
        icon: '/icons/play-icon.png',
      },
      {
        action: 'dismiss',
        title: 'Maybe Later',
        icon: '/icons/dismiss-icon.png',
      },
    ],
  }

  // Parse notification data from the push event if available
  if (event.data) {
    try {
      const pushData = event.data.json()
      notificationData = {
        ...notificationData,
        ...pushData,
      }
      console.log(`[SW ${SW_VERSION}] Parsed push data:`, pushData)
    } catch (error) {
      console.error(`[SW ${SW_VERSION}] Error parsing push data:`, error)
      // Continue with default notification data
    }
  }

  // Show the notification with error handling
  const showNotification = self.registration
    .showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      actions: notificationData.actions,
      data: {
        url: notificationData.url,
      },
    })
    .catch((error) => {
      console.error(`[SW ${SW_VERSION}] Error showing notification:`, error)
    })

  event.waitUntil(showNotification)
})

// Handle notification clicks with enhanced logging
self.addEventListener('notificationclick', (event) => {
  console.log(`[SW ${SW_VERSION}] Notification clicked:`, event)
  console.log(`[SW ${SW_VERSION}] Action:`, event.action)
  console.log(`[SW ${SW_VERSION}] Notification data:`, event.notification.data)

  // Close the notification
  event.notification.close()

  // Get the URL to open (default to practice series)
  const urlToOpen =
    event.notification.data?.url || '/navigator/flows/practiceSeries'

  // Handle action button clicks
  if (event.action === 'start-practice') {
    // Open the practice page
    event.waitUntil(
      clients
        .matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if app is already open
          for (const client of clientList) {
            if (client.url.includes(urlToOpen) && 'focus' in client) {
              return client.focus()
            }
          }

          // Open new window/tab if app not already open
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen)
          }
        })
    )
  } else if (event.action === 'dismiss') {
    // Just close the notification (already done above)
    return
  } else {
    // Default click behavior - open the app
    event.waitUntil(
      clients
        .matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if app is already open
          for (const client of clientList) {
            if (client.url === self.registration.scope && 'focus' in client) {
              return client.focus()
            }
          }

          // Open new window/tab if app not already open
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen)
          }
        })
    )
  }
})

// Handle background sync (future enhancement)
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event.tag)

  if (event.tag === 'yoga-practice-sync') {
    // Could be used to sync practice data when connection is restored
    event.waitUntil(syncYogaData())
  }
})

// Helper function for syncing yoga data (placeholder)
async function syncYogaData() {
  try {
    // This could sync user's practice data, preferences, etc.
    console.log('Syncing yoga practice data...')
    // Implementation would depend on your offline strategy
  } catch (error) {
    console.error('Error syncing yoga data:', error)
  }
}

// Handle service worker updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
