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

// Enhanced error analysis for push subscription failures
function analyzePushError(error: any): {
  errorType: string
  userMessage: string
  technicalDetails: string
  suggestedActions: string[]
} {
  console.error('Analyzing push error:', error)

  if (error?.name === 'AbortError') {
    return {
      errorType: 'AbortError',
      userMessage:
        'Push service registration was aborted. This often happens due to browser cache issues or conflicts.',
      technicalDetails: `${error.name}: ${error.message}`,
      suggestedActions: [
        'Clear browser cache and cookies for this site',
        'Disable browser extensions temporarily',
        'Try in an incognito/private window',
        'Restart your browser',
        'Check if notifications are blocked in browser settings',
      ],
    }
  }

  if (error?.name === 'NotSupportedError') {
    return {
      errorType: 'NotSupportedError',
      userMessage:
        'Push notifications are not supported in this browser or environment.',
      technicalDetails: `${error.name}: ${error.message}`,
      suggestedActions: [
        'Try using Chrome, Firefox, Edge, or Safari',
        'Make sure you are using HTTPS (not HTTP)',
        'Check if you are in a supported browser environment',
      ],
    }
  }

  if (error?.name === 'NotAllowedError') {
    return {
      errorType: 'NotAllowedError',
      userMessage: 'Push notifications are blocked or permission was denied.',
      technicalDetails: `${error.name}: ${error.message}`,
      suggestedActions: [
        'Click the notification icon in your browser address bar',
        'Go to browser settings and allow notifications for this site',
        'Check if notifications are disabled globally in browser',
      ],
    }
  }

  if (error?.message?.includes('VAPID')) {
    return {
      errorType: 'VAPIDError',
      userMessage: 'There is a configuration error with push notifications.',
      technicalDetails: `VAPID Error: ${error.message}`,
      suggestedActions: [
        'Contact support - this is a server configuration issue',
        'Try again later',
      ],
    }
  }

  // Network or service errors
  if (
    error?.message?.includes('network') ||
    error?.message?.includes('fetch') ||
    error?.message?.includes('service')
  ) {
    return {
      errorType: 'NetworkError',
      userMessage:
        'There was a network error while setting up push notifications.',
      technicalDetails: `Network Error: ${error.message}`,
      suggestedActions: [
        'Check your internet connection',
        'Try again in a few moments',
        'Disable VPN if you are using one',
      ],
    }
  }

  // Default case
  return {
    errorType: 'UnknownError',
    userMessage: 'An unexpected error occurred while setting up notifications.',
    technicalDetails: `Unknown Error: ${error?.message || String(error)}`,
    suggestedActions: [
      'Try refreshing the page',
      'Try again in a few minutes',
      'Contact support if the problem persists',
    ],
  }
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
        const errorAnalysis = analyzePushError(error)
        throw new Error(
          `Failed to register service worker after ${maxAttempts} attempts. ${errorAnalysis.userMessage} Technical details: ${errorAnalysis.technicalDetails}`
        )
      }

      // Wait before retrying - use exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, attempt - 1))
      )
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

      // Use enhanced error analysis
      const errorAnalysis = analyzePushError(error)
      console.error('Error analysis:', errorAnalysis)

      // Specific handling for AbortError
      if (errorAnalysis.errorType === 'AbortError') {
        console.error('AbortError detected - attempting recovery strategies:')

        // For AbortError, try clearing any cached push state
        if (attempt === 1) {
          try {
            console.log('Clearing cached push manager state...')
            const existingSub = await registration.pushManager.getSubscription()
            if (existingSub) {
              await existingSub.unsubscribe()
              console.log('Unsubscribed from cached subscription')
            }

            // Wait longer before retry for AbortError
            await new Promise((resolve) => setTimeout(resolve, 1000))
          } catch (clearError) {
            console.warn('Failed to clear push state:', clearError)
          }
        }
      }

      if (attempt === maxAttempts) {
        const errorAnalysis = analyzePushError(error)
        throw new Error(
          `Failed to subscribe to push notifications after ${maxAttempts} attempts. ${errorAnalysis.userMessage} Technical details: ${errorAnalysis.technicalDetails}`
        )
      }

      // Exponential backoff - wait longer between retries
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

    // Use enhanced error analysis for better user feedback
    const errorAnalysis = analyzePushError(error)
    console.error('Enhanced error analysis:', errorAnalysis)

    diagnostics.error = {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      analysis: errorAnalysis,
    }

    return {
      success: false,
      error: errorAnalysis.userMessage,
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
