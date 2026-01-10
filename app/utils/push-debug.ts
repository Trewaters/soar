/**
 * Debug utility for push notification issues
 * This file helps diagnose common push notification problems
 * Enhanced version with comprehensive error analysis
 */

// Import enhanced push notification utilities
import { enablePushNotificationsEnhanced } from './subscribe-push-enhanced'

export async function debugPushSupport() {
  console.clear()

  // Check basic browser support
  const support = {
    serviceWorker: 'serviceWorker' in navigator,
    pushManager: 'PushManager' in window,
    notifications: 'Notification' in window,
    https:
      window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost',
  }

  if (!support.serviceWorker) {
    console.error('❌ ServiceWorker not supported')
    return false
  }
  if (!support.pushManager) {
    console.error('❌ PushManager not supported')
    return false
  }
  if (!support.notifications) {
    console.error('❌ Notifications not supported')
    return false
  }
  if (!support.https) {
    console.error('❌ HTTPS required for push notifications (except localhost)')
    return false
  }

  // Check environment variables
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

  if (!vapidKey) {
    console.error('❌ VAPID public key not configured')
    return false
  }

  // Check current permission status
  const permission = Notification.permission

  if (permission === 'denied') {
    console.error('❌ Notifications are permanently denied by user')
    return false
  }

  // Test service worker registration
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })

    // Wait for service worker to be ready
    await navigator.serviceWorker.ready

    // Check if push manager is available on registration
    if (!registration.pushManager) {
      console.error('❌ PushManager not available on registration')
      return false
    }

    return registration
  } catch (error) {
    console.error('❌ Service Worker registration failed:', error)
    return false
  }
}

export async function debugPushSubscriptionEnhanced(
  registration: ServiceWorkerRegistration
) {
  try {
    // Check for existing subscription
    const existingSubscription =
      await registration.pushManager.getSubscription()
    if (existingSubscription) {
      await existingSubscription.unsubscribe()
    }

    // Use the enhanced push notification system
    const result = await enablePushNotificationsEnhanced()

    if (result.success) {
      return result.subscription
    } else {
      console.error('❌ Enhanced push subscription failed:', result.error)
      console.error('- Diagnostics:', result.diagnostics)

      return null
    }
  } catch (error) {
    console.error('❌ Enhanced push subscription test failed:', error)
    return null
  }
}

export async function runComprehensivePushDebug() {
  console.clear()

  const registration = await debugPushSupport()
  if (!registration) {
    return { success: false, stage: 'basic_support' }
  }

  const subscription = await debugPushSubscriptionEnhanced(
    registration as ServiceWorkerRegistration
  )
  if (!subscription) {
    return { success: false, stage: 'subscription' }
  }

  return {
    success: true,
    registration,
    subscription,
    stage: 'complete',
  }
}

// Quick test function for development
export async function quickPushTest() {
  const result = await enablePushNotificationsEnhanced()

  if (result.success) {
    console.log('✅ Quick test passed!', result.diagnostics)
  } else {
    console.error('❌ Quick test failed:', result.error, result.diagnostics)
  }

  return result
}

export async function debugPushSubscription(
  registration: ServiceWorkerRegistration
) {
  try {
    // Convert VAPID key
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
    const applicationServerKey = urlBase64ToUint8Array(vapidKey) as BufferSource

    // Check existing subscription
    const existingSubscription =
      await registration.pushManager.getSubscription()
    if (existingSubscription) {
      await existingSubscription.unsubscribe()
    }

    // Try to subscribe
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    })

    return subscription
  } catch (error) {
    console.error('❌ Push subscription failed:', error)

    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })

      // Specific error diagnostics
      if (error.name === 'AbortError') {
        console.error('\n🔍 AbortError Diagnostics:')
        console.error(
          '- This usually indicates a problem with the push service'
        )
        console.error(
          '- Check if browser allows push notifications for this site'
        )
        console.error('- Try clearing browser data and cache')
        console.error('- Verify VAPID keys are correct')
      } else if (error.name === 'NotSupportedError') {
        console.error(
          '\n🔍 NotSupportedError: Push notifications not supported'
        )
      } else if (error.name === 'NotAllowedError') {
        console.error(
          '\n🔍 NotAllowedError: User denied permission or feature disabled'
        )
      }
    }

    return null
  }
}

// Helper function from your existing code
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

export async function runFullPushDebug() {
  console.clear()

  const registration = await debugPushSupport()
  if (!registration) {
    return
  }

  const subscription = await debugPushSubscription(
    registration as ServiceWorkerRegistration
  )
  if (!subscription) {
    return
  }

  return subscription
}
