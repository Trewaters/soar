/**
 * Debug utility for push notification issues
 * This file helps diagnose common push notification problems
 * Enhanced version with comprehensive error analysis
 */

// Import enhanced push notification utilities
import { enablePushNotificationsEnhanced } from './subscribe-push-enhanced'

export async function debugPushSupport() {
  console.clear()
  console.log('🔍 === SOAR PUSH NOTIFICATION DIAGNOSTIC ===')
  console.log(`Timestamp: ${new Date().toISOString()}`)
  console.log(`User Agent: ${navigator.userAgent}`)
  console.log(`URL: ${window.location.href}`)
  console.log('')

  // Check basic browser support
  console.log('=== 1. Basic Browser Support ===')
  const support = {
    serviceWorker: 'serviceWorker' in navigator,
    pushManager: 'PushManager' in window,
    notifications: 'Notification' in window,
    https:
      window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost',
  }

  console.log('✅ Browser Support Check:', support)

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
  console.log('\n=== 2. Configuration Check ===')
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  console.log('- VAPID Key present:', !!vapidKey)
  console.log('- VAPID Key length:', vapidKey?.length)
  console.log('- VAPID Key preview:', vapidKey?.substring(0, 20) + '...')

  if (!vapidKey) {
    console.error('❌ VAPID public key not configured')
    return false
  }

  // Check current permission status
  console.log('\n=== 3. Permission Status ===')
  const permission = Notification.permission
  console.log('- Current permission:', permission)

  if (permission === 'denied') {
    console.error('❌ Notifications are permanently denied by user')
    console.log(
      '🛠️  User must manually enable notifications in browser settings'
    )
    return false
  }

  // Test service worker registration
  console.log('\n=== 4. Service Worker Test ===')
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    console.log('✅ Service Worker registered successfully')
    console.log('- Scope:', registration.scope)
    console.log('- State:', registration.active?.state || 'installing')
    console.log('- Update found:', !!registration.waiting)

    // Wait for service worker to be ready
    await navigator.serviceWorker.ready
    console.log('✅ Service Worker is ready')

    // Check if push manager is available on registration
    if (!registration.pushManager) {
      console.error('❌ PushManager not available on registration')
      return false
    }
    console.log('✅ PushManager available on registration')

    return registration
  } catch (error) {
    console.error('❌ Service Worker registration failed:', error)
    return false
  }
}

export async function debugPushSubscriptionEnhanced(
  registration: ServiceWorkerRegistration
) {
  console.log('\n=== 5. Enhanced Push Subscription Test ===')

  try {
    // Check for existing subscription
    const existingSubscription =
      await registration.pushManager.getSubscription()
    if (existingSubscription) {
      console.log('⚠️ Existing subscription found')
      console.log('- Endpoint:', existingSubscription.endpoint)
      console.log('- Unsubscribing to start fresh...')
      await existingSubscription.unsubscribe()
    }

    // Use the enhanced push notification system
    console.log('🚀 Testing enhanced push subscription...')
    const result = await enablePushNotificationsEnhanced()

    if (result.success) {
      console.log('✅ Enhanced push subscription successful!')
      console.log('- Endpoint:', result.subscription?.endpoint)
      console.log('- Diagnostics:', result.diagnostics)
      return result.subscription
    } else {
      console.error('❌ Enhanced push subscription failed:', result.error)
      console.error('- Diagnostics:', result.diagnostics)

      // Provide specific troubleshooting based on error
      if (result.error?.includes('AbortError')) {
        console.log('\n🔧 ABORTATION ERROR TROUBLESHOOTING:')
        console.log('1. Clear browser cache and cookies for this site')
        console.log('2. Try in an incognito/private window')
        console.log('3. Disable browser extensions temporarily')
        console.log('4. Check if notifications are blocked in browser settings')
        console.log('5. Restart your browser completely')
        console.log('6. Try a different browser (Chrome, Firefox, Safari)')
      } else if (result.error?.includes('NotSupported')) {
        console.log('\n🔧 NOT SUPPORTED ERROR TROUBLESHOOTING:')
        console.log('1. Ensure you are using HTTPS (or localhost)')
        console.log('2. Update your browser to the latest version')
        console.log('3. Try Chrome, Firefox, Edge, or Safari')
      } else if (result.error?.includes('NotAllowed')) {
        console.log('\n🔧 PERMISSION DENIED TROUBLESHOOTING:')
        console.log('1. Click the notification icon in the address bar')
        console.log(
          '2. Go to browser settings → Privacy & Security → Notifications'
        )
        console.log('3. Allow notifications for this site')
      }

      return null
    }
  } catch (error) {
    console.error('❌ Enhanced push subscription test failed:', error)
    return null
  }
}

export async function runComprehensivePushDebug() {
  console.clear()
  console.log('🧘‍♀️ === SOAR YOGA PUSH NOTIFICATION COMPREHENSIVE DEBUG ===\n')

  const registration = await debugPushSupport()
  if (!registration) {
    console.log('\n❌ Push notification setup failed - see errors above')
    return { success: false, stage: 'basic_support' }
  }

  const subscription = await debugPushSubscriptionEnhanced(
    registration as ServiceWorkerRegistration
  )
  if (!subscription) {
    console.log('\n❌ Push subscription failed - see errors above')
    return { success: false, stage: 'subscription' }
  }

  console.log('\n✅ === ALL PUSH NOTIFICATION TESTS PASSED! ===')
  console.log('Push notifications are working correctly for this user/browser.')

  return {
    success: true,
    registration,
    subscription,
    stage: 'complete',
  }
}

// Quick test function for development
export async function quickPushTest() {
  console.log('🚀 Quick Push Test...')
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
    console.log('\n=== Testing Push Subscription ===')

    // Convert VAPID key
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
    const applicationServerKey = urlBase64ToUint8Array(vapidKey) as BufferSource
    console.log('✅ VAPID key converted successfully')

    // Check existing subscription
    const existingSubscription =
      await registration.pushManager.getSubscription()
    if (existingSubscription) {
      console.log('⚠️ Existing subscription found, unsubscribing first...')
      await existingSubscription.unsubscribe()
    }

    // Try to subscribe
    console.log('Attempting push subscription...')
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    })

    console.log('✅ Push subscription successful!')
    console.log('- Endpoint:', subscription.endpoint)
    console.log('- Keys:', {
      p256dh: subscription.getKey('p256dh') ? 'present' : 'missing',
      auth: subscription.getKey('auth') ? 'present' : 'missing',
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

  console.log('\n✅ All push notification tests passed!')
  return subscription
}
