/**
 * Push notification subscription utilities for Soar Yoga App
 * Handles service worker registration, push subscriptions, and notification permissions
 */

// Convert VAPID key from base64url to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

// Check if service workers and push messaging are supported
export function isPushSupported(): boolean {
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

// Check current notification permission status
export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied'
  }
  return Notification.permission
}

// Register service worker
async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })

    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready

    return registration
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    throw new Error('Failed to register service worker')
  }
}

// Request notification permission
async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    throw new Error('Notifications are not supported in this browser')
  }

  if (Notification.permission === 'granted') {
    return 'granted'
  }

  if (Notification.permission === 'denied') {
    throw new Error(
      'Notifications are blocked. Please enable them in browser settings.'
    )
  }

  // Request permission
  const permission = await Notification.requestPermission()

  if (permission !== 'granted') {
    throw new Error('Notification permission denied')
  }

  return permission
}

// Subscribe to push notifications
async function subscribeToPush(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription> {
  const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

  if (!publicVapidKey) {
    throw new Error('VAPID public key not configured')
  }

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        publicVapidKey
      ) as BufferSource,
    })

    return subscription
  } catch (error) {
    console.error('Push subscription failed:', error)
    throw new Error('Failed to subscribe to push notifications')
  }
}

// Save subscription to backend
async function saveSubscription(subscription: PushSubscription): Promise<void> {
  try {
    const subscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.getKey('p256dh')
          ? btoa(
              String.fromCharCode(
                ...new Uint8Array(subscription.getKey('p256dh')!)
              )
            )
          : null,
        auth: subscription.getKey('auth')
          ? btoa(
              String.fromCharCode(
                ...new Uint8Array(subscription.getKey('auth')!)
              )
            )
          : null,
      },
    }

    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to save subscription')
    }
  } catch (error) {
    console.error('Error saving subscription:', error)
    throw error
  }
}

// Main function to enable push notifications
export async function enablePushNotifications(): Promise<{
  success: boolean
  subscription?: PushSubscription
  error?: string
}> {
  try {
    // Check support
    if (!isPushSupported()) {
      throw new Error('Push notifications are not supported in this browser')
    }

    // Request notification permission
    await requestNotificationPermission()

    // Register service worker
    const registration = await registerServiceWorker()

    // Subscribe to push notifications
    const subscription = await subscribeToPush(registration)

    // Save subscription to backend
    await saveSubscription(subscription)

    return {
      success: true,
      subscription,
    }
  } catch (error) {
    console.error('Error enabling push notifications:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

// Check if user is already subscribed
export async function getExistingSubscription(): Promise<PushSubscription | null> {
  try {
    if (!isPushSupported()) {
      return null
    }

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    return subscription
  } catch (error) {
    console.error('Error getting existing subscription:', error)
    return null
  }
}

// Unsubscribe from push notifications
export async function disablePushNotifications(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const subscription = await getExistingSubscription()

    if (!subscription) {
      return { success: true } // Already unsubscribed
    }

    // Unsubscribe from push manager
    const unsubscribed = await subscription.unsubscribe()

    if (unsubscribed) {
      return { success: true }
    } else {
      throw new Error('Failed to unsubscribe from push notifications')
    }
  } catch (error) {
    console.error('Error disabling push notifications:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

// Test notification (for development/debugging)
export async function sendTestNotification(): Promise<void> {
  if (!isPushSupported() || getNotificationPermission() !== 'granted') {
    throw new Error('Notifications not supported or not permitted')
  }

  // Show a local notification for testing
  const registration = await navigator.serviceWorker.ready

  await registration.showNotification('Soar Yoga Test Notification', {
    body: 'This is a test notification from your yoga app! 🧘‍♀️',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'test-notification',
    data: {
      url: '/flows/practiceSeries',
    },
  })
}
