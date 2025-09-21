// Service Worker for handling push notifications in Soar Yoga App

self.addEventListener('install', () => {
  console.log('Service Worker installing...')
  // Skip waiting to activate the new service worker immediately
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated')
  // Take control of all clients immediately
  event.waitUntil(self.clients.claim())
})

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push event received:', event)

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
    } catch (error) {
      console.error('Error parsing push data:', error)
    }
  }

  const showNotification = self.registration.showNotification(
    notificationData.title,
    {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      actions: notificationData.actions,
      data: {
        url: notificationData.url,
      },
    }
  )

  event.waitUntil(showNotification)
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)

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
