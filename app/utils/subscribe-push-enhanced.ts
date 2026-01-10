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

  // Check for AbortError - look at both name and message for better detection
  if (
    error?.name === 'AbortError' ||
    (error?.message && error.message.includes('AbortError')) ||
    (error?.message &&
      error.message.includes('Registration failed - push service error'))
  ) {
    // Check if we're in production for more specific messaging
    const isProduction =
      window.location.hostname === 'www.happyyoga.app' ||
      window.location.hostname === 'happyyoga.app'

    return {
      errorType: 'AbortError',
      userMessage: isProduction
        ? 'Push notifications are temporarily unavailable. You can still receive email reminders for your yoga practice.'
        : 'Push service registration was aborted. This often happens due to browser cache issues or conflicts.',
      technicalDetails: `${error?.name || 'AbortError'}: ${
        error?.message || String(error)
      }`,
      suggestedActions: isProduction
        ? [
            'Email reminders will work as an alternative',
            'Try refreshing the page and clearing browser cache',
            'Contact support if this persists',
            'Push notifications may work better in Chrome or Firefox',
          ]
        : [
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

function waitForServiceWorkerController(): Promise<ServiceWorker> {
  if (navigator.serviceWorker.controller) {
    return Promise.resolve(navigator.serviceWorker.controller)
  }

  return new Promise((resolve, reject) => {
    const onControllerChange = () => {
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        onControllerChange
      )
      if (navigator.serviceWorker.controller) {
        resolve(navigator.serviceWorker.controller)
      } else {
        reject(new Error('Service worker controller not available'))
      }
    }

    navigator.serviceWorker.addEventListener(
      'controllerchange',
      onControllerChange
    )
  })
}

// Enhanced service worker registration with aggressive conflict resolution
async function registerServiceWorkerWithRetry(): Promise<ServiceWorkerRegistration> {
  let attempt = 0
  const maxAttempts = 3

  while (attempt < maxAttempts) {
    try {
      attempt++

      // AGGRESSIVE CLEANUP: Always clean up on first attempt and retry scenarios
      if (attempt === 1 || attempt === 2) {
        try {
          // Get all registrations and unregister them
          const registrations = await navigator.serviceWorker.getRegistrations()

          for (const reg of registrations) {
            try {
              await reg.unregister()
            } catch (unregError) {
              console.warn('⚠️ Failed to unregister:', reg.scope, unregError)
            }
          }

          // Force clear any cached service worker state
          if (
            'serviceWorker' in navigator &&
            navigator.serviceWorker.controller
          ) {
            try {
              // Post message to current SW to self-destruct if possible
              navigator.serviceWorker.controller.postMessage({
                command: 'SKIP_WAITING',
              })
            } catch (postError) {
              console.warn('Could not message service worker:', postError)
            }
          }
        } catch (cleanupError) {
          console.warn('⚠️ Service worker cleanup failed:', cleanupError)
          // Continue anyway - don't let cleanup failures stop us
        }
      }

      await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none', // Prevent caching issues
      })

      // Use the standard ready promise
      const readyRegistration = await navigator.serviceWorker.ready

      // Strategy 2: Verify the registration is actually active
      // Get active worker
      let activeWorker =
        readyRegistration.active || navigator.serviceWorker.controller

      if (!activeWorker) {
        try {
          activeWorker = await waitForServiceWorkerController()
        } catch (controllerError) {
          console.error(
            '⚠️ Service worker controller did not resolve:',
            controllerError
          )
          throw new Error('Service worker failed to become active')
        }
      }

      if (!activeWorker) {
        throw new Error('Service worker failed to become active')
      }

      return readyRegistration
    } catch (error) {
      console.error(
        `❌ Service Worker registration attempt ${attempt} failed:`,
        error
      )

      if (attempt === maxAttempts) {
        const errorAnalysis = analyzePushError(error)
        throw new Error(
          `Failed to register service worker after ${maxAttempts} attempts. ${errorAnalysis.userMessage} Technical details: ${errorAnalysis.technicalDetails}`
        )
      }
    }
  }

  throw new Error('Unexpected error in service worker registration')
}

// Advanced push notification diagnostic utility
export async function debugPushNotifications(): Promise<{
  diagnostics: Record<string, any>
  recommendations: string[]
  canAttemptFix: boolean
}> {
  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  }

  const recommendations: string[] = []

  try {
    // Browser support check
    diagnostics.browserSupport = {
      serviceWorker: 'serviceWorker' in navigator,
      pushManager: 'PushManager' in window,
      notification: 'Notification' in window,
      secureContext: window.isSecureContext,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
    }

    if (!diagnostics.browserSupport.serviceWorker) {
      recommendations.push('❌ Service Worker not supported - upgrade browser')
    }
    if (!diagnostics.browserSupport.pushManager) {
      recommendations.push('❌ Push Manager not supported - upgrade browser')
    }
    if (!diagnostics.browserSupport.notification) {
      recommendations.push('❌ Notifications not supported - upgrade browser')
    }
    if (!diagnostics.browserSupport.secureContext) {
      recommendations.push('❌ HTTPS required - switch to secure connection')
    }

    // Permission status
    diagnostics.permissions = {
      notification: Notification.permission,
      persistent: 'persistent' in Notification.prototype,
    }

    if (diagnostics.permissions.notification === 'denied') {
      recommendations.push(
        '🚫 Notifications denied - enable in browser settings'
      )
    } else if (diagnostics.permissions.notification === 'default') {
      recommendations.push('❓ Notifications not yet requested')
    }

    // Service worker status
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations()
        diagnostics.serviceWorkers = {
          count: registrations.length,
          registrations: registrations.map((reg) => ({
            scope: reg.scope,
            active: !!reg.active,
            installing: !!reg.installing,
            waiting: !!reg.waiting,
            state: reg.active?.state,
            scriptURL: reg.active?.scriptURL,
          })),
        }

        // Check for conflicts
        if (registrations.length > 1) {
          recommendations.push(
            '⚠️ Multiple service workers detected - may cause conflicts'
          )
        }

        if (registrations.length === 0) {
          recommendations.push('❌ No service worker registered')
        } else {
          const activeWorkers = registrations.filter((reg) => reg.active)
          if (activeWorkers.length === 0) {
            recommendations.push('❌ No active service workers found')
          }
        }

        // Check current controller
        diagnostics.serviceWorkerController = {
          hasController: !!navigator.serviceWorker.controller,
          controllerURL: navigator.serviceWorker.controller?.scriptURL,
          controllerState: navigator.serviceWorker.controller?.state,
        }

        if (!navigator.serviceWorker.controller) {
          recommendations.push('⚠️ No service worker controlling this page')
        }
      } catch (swError) {
        diagnostics.serviceWorkerError = String(swError)
        recommendations.push('❌ Service worker check failed: ' + swError)
      }
    }

    // Push subscription status
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        const existingSubscription =
          await registration.pushManager.getSubscription()

        diagnostics.pushSubscription = {
          hasExisting: !!existingSubscription,
          endpoint: existingSubscription?.endpoint,
          hasKeys: existingSubscription
            ? {
                p256dh: !!existingSubscription.getKey('p256dh'),
                auth: !!existingSubscription.getKey('auth'),
              }
            : null,
        }

        if (existingSubscription) {
          recommendations.push('✅ Existing push subscription found')
        } else {
          recommendations.push('❓ No existing push subscription')
        }
      } catch (pushError) {
        diagnostics.pushSubscriptionError = String(pushError)
        recommendations.push('❌ Push subscription check failed: ' + pushError)
      }
    }

    // VAPID key check
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    diagnostics.vapidConfiguration = {
      hasKey: !!vapidKey,
      keyLength: vapidKey?.length || 0,
      keyValid: vapidKey ? vapidKey.length > 80 : false,
    }

    if (!vapidKey) {
      recommendations.push('❌ VAPID public key not configured')
    } else if (vapidKey.length < 80) {
      recommendations.push('❌ VAPID public key appears invalid (too short)')
    } else {
      recommendations.push('✅ VAPID key configured')
    }

    // Network connectivity test
    try {
      const networkTest = await fetch('/api/push/subscribe', {
        method: 'HEAD',
      })
      diagnostics.networkConnectivity = {
        canReachAPI: networkTest.ok,
        status: networkTest.status,
      }

      if (!networkTest.ok) {
        recommendations.push('❌ Cannot reach push API endpoint')
      }
    } catch (networkError) {
      diagnostics.networkConnectivity = {
        error: String(networkError),
      }
      recommendations.push('❌ Network connectivity issue: ' + networkError)
    }

    // Environment analysis
    const isProduction =
      window.location.hostname === 'www.happyyoga.app' ||
      window.location.hostname === 'happyyoga.app'

    diagnostics.environment = {
      isProduction,
      isDevelopment: !isProduction,
      hostname: window.location.hostname,
      port: window.location.port,
    }

    // Final assessment
    const criticalIssues = recommendations.filter((r) => r.startsWith('❌'))
    const canAttemptFix = criticalIssues.length === 0

    if (canAttemptFix) {
      recommendations.push('🎉 System appears ready for push notifications')
    } else {
      recommendations.push(
        `🚨 ${criticalIssues.length} critical issues must be resolved first`
      )
    }

    return {
      diagnostics,
      recommendations,
      canAttemptFix,
    }
  } catch (error) {
    diagnostics.debugError = String(error)
    recommendations.push('❌ Diagnostic check failed: ' + error)

    return {
      diagnostics,
      recommendations,
      canAttemptFix: false,
    }
  }
}

// Enhanced push subscription with better error handling
async function subscribeToPushWithRetry(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription> {
  const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

  if (!publicVapidKey || publicVapidKey.length < 64) {
    const errorMessage = 'VAPID public key not configured or is invalid.'
    console.error(`❌ FATAL: ${errorMessage}`)
    throw new Error(errorMessage)
  }

  let attempt = 0
  const maxAttempts = 3

  while (attempt < maxAttempts) {
    try {
      attempt++

      // Check for existing subscription and unsubscribe
      const existing = await registration.pushManager.getSubscription()
      if (existing) {
        await existing.unsubscribe()
      }

      const applicationServerKey = urlBase64ToUint8Array(publicVapidKey)

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as BufferSource,
      })

      return subscription
    } catch (error) {
      console.error(`Push subscription attempt ${attempt} failed:`, error)

      // Use enhanced error analysis
      const errorAnalysis = analyzePushError(error)

      // Specific handling for AbortError
      if (errorAnalysis.errorType === 'AbortError') {
        // For AbortError, try more aggressive recovery strategies
        if (attempt === 1) {
          try {
            const existingSub = await registration.pushManager.getSubscription()
            if (existingSub) {
              await existingSub.unsubscribe()
            }
          } catch (clearError) {
            console.warn('Failed to clear push state:', clearError)
          }
          // On second failure, try re-registering the service worker
          try {
            // Unregister all service workers aggressively
            const registrations =
              await navigator.serviceWorker.getRegistrations()

            for (const reg of registrations) {
              await reg.unregister()
            }

            // Re-register fresh service worker with more explicit options
            const newRegistration = await navigator.serviceWorker.register(
              '/sw.js',
              {
                scope: '/',
                updateViaCache: 'none',
                type: 'classic', // Explicit type
              }
            )

            // Enhanced wait for readiness
            const readyReg = await navigator.serviceWorker.ready

            // Verify it's actually the new registration
            if (readyReg.scope !== newRegistration.scope) {
              console.warn(
                '⚠️ Registration scope mismatch, using ready registration'
              )
            }

            // Update registration reference
            registration = readyReg
          } catch (reregisterError) {
            console.warn(
              'Failed to re-register service worker:',
              reregisterError
            )
          }
        }
      }

      if (attempt === maxAttempts) {
        const errorAnalysis = analyzePushError(error)
        throw new Error(
          `Failed to subscribe to push notifications after ${maxAttempts} attempts. ${errorAnalysis.userMessage} Technical details: ${errorAnalysis.technicalDetails}`
        )
      }
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
    // Check if we're in production
    const isProduction =
      window.location.hostname === 'www.happyyoga.app' ||
      window.location.hostname === 'happyyoga.app'

    diagnostics.environment = {
      isProduction,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
    }

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

    // Request notification permission
    let permission: NotificationPermission
    try {
      if (Notification.permission === 'default') {
        permission = await Notification.requestPermission()
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

    // In production, if we get persistent AbortErrors, provide graceful fallback
    const isProduction =
      window.location.hostname === 'www.happyyoga.app' ||
      window.location.hostname === 'happyyoga.app'

    if (isProduction && errorAnalysis.errorType === 'AbortError') {
      // Log additional production diagnostic info
      diagnostics.productionFallback = {
        reason: 'Persistent AbortError in production',
        emailBackupAvailable: true,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      }
    }

    // Validate VAPID key configuration in production
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (isProduction && !vapidKey) {
      diagnostics.configurationIssues = {
        vapidKeyMissing: true,
        environment: 'production',
        recommendation:
          'Check NEXT_PUBLIC_VAPID_PUBLIC_KEY environment variable',
      }
      console.error('Production VAPID key validation failed')
    }

    diagnostics.error = {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      analysis: errorAnalysis,
    }

    // Provide production-specific user messaging
    let userMessage = errorAnalysis.userMessage
    if (
      isProduction &&
      errorAnalysis.errorType === 'AbortError' &&
      diagnostics.productionFallback
    ) {
      userMessage =
        'Push notifications are currently unavailable due to browser service limitations. ' +
        "Don't worry - your reminders will still be delivered via email. " +
        'You can update your email reminder preferences in the settings below.'
    }

    return {
      success: false,
      error: userMessage,
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

      return
    } catch (error) {
      console.error(`Server save attempt ${attempt} failed:`, error)

      if (attempt === maxAttempts) {
        throw error
      }
    }
  }
}
