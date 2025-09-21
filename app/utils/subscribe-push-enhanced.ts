/**
 * Enhanced push notification utilities with better error handling
 * This addresses the AbortError issue you're experiencing
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

// Enhanced service worker registration with better error handling
async function registerServiceWorkerWithRetry(): Promise<ServiceWorkerRegistration> {
  let attempt = 0
  const maxAttempts = 3

  while (attempt < maxAttempts) {
    try {
      attempt++
      console.log(
        `Service Worker registration attempt ${attempt}/${maxAttempts}`
      )

      // For first attempt, try to clean up any existing registrations
      if (attempt === 1) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations()
          for (const reg of registrations) {
            console.log('Unregistering existing service worker:', reg.scope)
            await reg.unregister()
          }
          // Brief wait for cleanup
          await new Promise((resolve) => setTimeout(resolve, 200))
        } catch (cleanupError) {
          console.warn('Service worker cleanup failed:', cleanupError)
          // Continue anyway
        }
      }

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none', // Prevent caching issues
      })

      console.log('Service Worker registered successfully:', registration.scope)

      // Wait for the service worker to be ready with timeout
      const readyPromise = navigator.serviceWorker.ready
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Service Worker ready timeout')),
          10000
        )
      )

      await Promise.race([readyPromise, timeoutPromise])
      console.log('Service Worker is ready')

      return registration
    } catch (error) {
      console.error(
        `Service Worker registration attempt ${attempt} failed:`,
        error
      )

      if (attempt === maxAttempts) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        throw new Error(
          `Failed to register service worker after ${maxAttempts} attempts: ${errorMessage}`
        )
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
    }
  }

  throw new Error('Unexpected error in service worker registration')
}

// Enhanced push subscription with better error handling
async function subscribeToPushWithRetry(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription> {
  const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

  if (!publicVapidKey) {
    throw new Error('VAPID public key not configured')
  }

  let attempt = 0
  const maxAttempts = 3

  while (attempt < maxAttempts) {
    try {
      attempt++
      console.log(`Push subscription attempt ${attempt}/${maxAttempts}`)

      // Check for existing subscription and unsubscribe
      const existing = await registration.pushManager.getSubscription()
      if (existing) {
        console.log('Unsubscribing from existing subscription')
        await existing.unsubscribe()
        // Brief wait after unsubscribing
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      const applicationServerKey = urlBase64ToUint8Array(publicVapidKey)

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as BufferSource,
      })

      console.log('Push subscription successful:', subscription.endpoint)
      return subscription
    } catch (error) {
      console.error(`Push subscription attempt ${attempt} failed:`, error)

      // Specific handling for AbortError
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('AbortError detected - this typically means:')
        console.error('1. Browser push service is temporarily unavailable')
        console.error('2. VAPID keys might be invalid')
        console.error('3. Browser permissions are blocked')
        console.error('4. Network connectivity issues')

        // For AbortError, try clearing any cached push state
        if (attempt === 1) {
          try {
            // Clear any cached push manager state
            const existingSub = await registration.pushManager.getSubscription()
            if (existingSub) {
              await existingSub.unsubscribe()
            }
          } catch (clearError) {
            console.warn('Failed to clear push state:', clearError)
          }
        }
      }

      if (attempt === maxAttempts) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        throw new Error(
          `Failed to subscribe to push notifications after ${maxAttempts} attempts: ${errorMessage}`
        )
      }

      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, attempt - 1))
      )
    }
  }

  throw new Error('Unexpected error in push subscription')
}

// Enhanced main function with comprehensive error handling
export async function enablePushNotificationsEnhanced(): Promise<{
  success: boolean
  subscription?: PushSubscription
  error?: string
  diagnostics?: Record<string, any>
}> {
  const diagnostics: Record<string, any> = {}

  try {
    // Pre-flight checks
    diagnostics.browserSupport = {
      serviceWorker: 'serviceWorker' in navigator,
      pushManager: 'PushManager' in window,
      notification: 'Notification' in window,
      secureContext: window.isSecureContext,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
    }

    // Check browser support
    if (
      !('serviceWorker' in navigator) ||
      !('PushManager' in window) ||
      !('Notification' in window)
    ) {
      return {
        success: false,
        error: 'Push notifications are not supported in this browser',
        diagnostics,
      }
    }

    // Check secure context
    if (!window.isSecureContext) {
      return {
        success: false,
        error: 'Push notifications require HTTPS or localhost',
        diagnostics,
      }
    }

    // Request notification permission with timeout
    let permission: NotificationPermission
    try {
      if (Notification.permission === 'default') {
        const permissionPromise = Notification.requestPermission()
        const timeoutPromise = new Promise<NotificationPermission>(
          (_, reject) =>
            setTimeout(
              () => reject(new Error('Permission request timeout')),
              10000
            )
        )
        permission = await Promise.race([permissionPromise, timeoutPromise])
      } else {
        permission = Notification.permission
      }

      diagnostics.permission = permission

      if (permission !== 'granted') {
        return {
          success: false,
          error: 'Notification permission denied',
          diagnostics,
        }
      }
    } catch (permError) {
      return {
        success: false,
        error: `Failed to get notification permission: ${permError instanceof Error ? permError.message : String(permError)}`,
        diagnostics,
      }
    }

    // Register service worker with retry
    const registration = await registerServiceWorkerWithRetry()
    diagnostics.serviceWorkerRegistration = {
      scope: registration.scope,
      active: !!registration.active,
      state: registration.active?.state,
    }

    // Subscribe to push notifications with retry
    const subscription = await subscribeToPushWithRetry(registration)
    diagnostics.subscription = {
      endpoint: subscription.endpoint,
      hasKeys: {
        p256dh: !!subscription.getKey('p256dh'),
        auth: !!subscription.getKey('auth'),
      },
    }

    // Save subscription to backend
    try {
      await saveSubscriptionToServer(subscription)
      diagnostics.serverSave = 'success'
    } catch (saveError) {
      console.error('Failed to save subscription to server:', saveError)
      diagnostics.serverSave = 'failed'
      // Don't fail the entire operation for server save issues
    }

    return {
      success: true,
      subscription,
      diagnostics,
    }
  } catch (error) {
    console.error('Error enabling push notifications:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    diagnostics.error = {
      name: error instanceof Error ? error.name : 'Unknown',
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    }

    return {
      success: false,
      error: errorMessage,
      diagnostics,
    }
  }
}

// Server subscription save with retry
async function saveSubscriptionToServer(
  subscription: PushSubscription
): Promise<void> {
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
            String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))
          )
        : null,
    },
  }

  let attempt = 0
  const maxAttempts = 3

  while (attempt < maxAttempts) {
    try {
      attempt++

      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP ${response.status}`)
      }

      console.log('Subscription saved successfully')
      return
    } catch (error) {
      console.error(`Server save attempt ${attempt} failed:`, error)

      if (attempt === maxAttempts) {
        throw error
      }

      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
    }
  }
}
