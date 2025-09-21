/**
 * Debug utility for push notification issues
 * This file helps diagnose common push notification problems
 */

export async function debugPushSupport() {
  console.log('=== Push Notification Debug Report ===')

  // Check browser support
  const hasServiceWorker = 'serviceWorker' in navigator
  const hasPushManager = 'PushManager' in window
  const hasNotification = 'Notification' in window

  console.log('Browser Support:')
  console.log('- Service Worker:', hasServiceWorker)
  console.log('- Push Manager:', hasPushManager)
  console.log('- Notification API:', hasNotification)

  if (!hasServiceWorker || !hasPushManager || !hasNotification) {
    console.error('❌ Browser does not support push notifications')
    return false
  }

  // Check notification permission
  const permission = Notification.permission
  console.log('- Notification Permission:', permission)

  // Check if we're on HTTPS or localhost
  const isSecure =
    location.protocol === 'https:' || location.hostname === 'localhost'
  console.log('- Secure Context (HTTPS/localhost):', isSecure)

  if (!isSecure) {
    console.error('❌ Push notifications require HTTPS or localhost')
    return false
  }

  // Check VAPID key
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  console.log('- VAPID Key present:', !!vapidKey)
  console.log('- VAPID Key length:', vapidKey?.length)

  if (!vapidKey) {
    console.error('❌ VAPID public key not configured')
    return false
  }

  // Try to register service worker
  try {
    console.log('\n=== Testing Service Worker Registration ===')
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })
    console.log('✅ Service Worker registered successfully')
    console.log('- Scope:', registration.scope)
    console.log('- State:', registration.active?.state)

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
