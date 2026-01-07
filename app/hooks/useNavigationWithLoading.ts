'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import { useNavigationLoading } from '@context/NavigationLoadingContext'

/**
 * Enhanced router hook that provides loading state feedback for navigation actions.
 * Prevents multiple rapid taps/clicks on mobile devices by showing immediate visual feedback.
 */
export function useNavigationWithLoading() {
  const router = useRouter()
  const pathname = usePathname()

  // Some test environments (Jest) mock `next/navigation` without `useSearchParams`.
  // Guard the hook call so tests don't throw when that function is not present.
  const _useSearchParams =
    typeof useSearchParams === 'function' ? useSearchParams : undefined
  const searchParams = _useSearchParams ? _useSearchParams() : null
  const { startNavigation, endNavigation, state } = useNavigationLoading()
  // Track a combined location (pathname + search) so we detect navigations that only
  // change query params or when router.refresh() is used (which doesn't change pathname).
  const currentLocationRef = useRef(
    `${pathname}${searchParams ? `?${searchParams.toString()}` : ''}`
  )
  // Record the location where a navigation started from. This helps detect
  // completion when redirects or server-side rewrites move the user to a
  // different final pathname than the requested targetPath. We set this when
  // `state.isNavigating` becomes true and compare against subsequent location
  // changes to decide when to call `endNavigation()`.
  const navigationStartedFromRef = useRef(currentLocationRef.current)
  // Track the navId generated when starting a navigation so we only end the
  // same navigation (prevents races across quick successive navigations).
  const navigationIdRef = useRef<string | null>(null)

  // Monitor pathname + search and Next's navigation state to detect when navigation completes.
  useEffect(() => {
    const combined = `${pathname}${searchParams ? `?${searchParams.toString()}` : ''}`

    // If location changed compared to our ref, update ref. If we're currently
    // navigating and the current location is different from where the
    // navigation started from, treat that as navigation completion and end it.
    if (currentLocationRef.current !== combined) {
      currentLocationRef.current = combined

      if (state.isNavigating) {
        const origin = navigationStartedFromRef.current

        // development-only logging removed

        // More aggressive safety: if we've landed on a different location than
        // the intended `targetPath` (for example server redirects that
        // route `/` -> `/navigator`) end the navigation. Checking this first
        // ensures we dismiss the overlay even in cases where origin === combined
        // but the final route doesn't match what was requested.
        if (state.targetPath && combined !== state.targetPath) {
          endNavigation(navigationIdRef.current || undefined)
        } else if (origin && origin !== combined) {
          // If we have a recorded origin for this navigation, and the location
          // now differs from that origin, consider navigation complete and end it.
          endNavigation(navigationIdRef.current || undefined)
        } else if (!origin) {
          // Fallback: if we don't have an origin recorded, end navigation on
          // any location change.
          endNavigation(navigationIdRef.current || undefined)
        }
      }
    }
  }, [
    pathname,
    searchParams,
    state.isNavigating,
    state.targetPath,
    endNavigation,
  ])

  // Event-driven fallback (no timers): listen for native browser navigation
  // events which fire on full-page navigations, redirects, or history changes
  // so we can end navigation even when Next's client hooks don't report a
  // pathname/search update in time. These events are deterministic and avoid
  // polling/timers.
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkLocation = () => {
      try {
        const href = `${window.location.pathname}${window.location.search || ''}`

        if (!state.isNavigating) return

        // If we've landed somewhere different than requested, end navigation.
        if (state.targetPath && href !== state.targetPath) {
          endNavigation(navigationIdRef.current || undefined)
          return
        }

        // If the browser location differs from where navigation started,
        // consider the navigation complete.
        if (
          navigationStartedFromRef.current &&
          href !== navigationStartedFromRef.current
        ) {
          endNavigation(navigationIdRef.current || undefined)
          return
        }

        // As a final safety, if currentLocationRef (our last-observed router
        // location) is different from the real window.location, end navigation.
        if (currentLocationRef.current !== href) {
          endNavigation(navigationIdRef.current || undefined)
        }
      } catch (err) {
        // Defensive: don't throw from event handler
        // development-only logging removed
      }
    }

    window.addEventListener('popstate', checkLocation)
    window.addEventListener('pageshow', checkLocation)
    window.addEventListener('focus', checkLocation)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkLocation()
    })

    return () => {
      window.removeEventListener('popstate', checkLocation)
      window.removeEventListener('pageshow', checkLocation)
      window.removeEventListener('focus', checkLocation)
      document.removeEventListener('visibilitychange', checkLocation)
    }
  }, [state.isNavigating, state.targetPath, endNavigation])

  // No timers: rely on combined location monitoring to end navigation.
  // (Removed previous timeout-based fallback per performance guidance.)

  /**
   * Navigate to a new route with loading state feedback
   * @param path - The route to navigate to
   * @param elementId - Optional ID to track specific element loading state
   * @param options - Additional navigation options
   */
  const navigateWithLoading = useCallback(
    async (
      path: string,
      elementId?: string,
      options?: {
        replace?: boolean
        shallow?: boolean
        scroll?: boolean
      }
    ) => {
      // Don't start new navigation if already navigating
      if (state.isNavigating) {
        return
      }

      // Generate a navId and start loading state. Pass the navId through so
      // the provider can use it to avoid races.
      const navId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      navigationIdRef.current = navId
      startNavigation(path, elementId, navId)
      // Record where the navigation started from so we can detect when the
      // browser actually moved away from this location (useful for redirects).
      navigationStartedFromRef.current = `${pathname}${
        searchParams ? `?${searchParams.toString()}` : ''
      }`
      // development-only logging removed

      try {
        // Perform navigation and await completion when supported by the router API
        if (options?.replace) {
          // router.replace may return a promise in newer Next versions
          await (router as any).replace(path)
        } else {
          await (router as any).push(path)
        }
        // After the push/replace promise resolves, end the navigation for this
        // navId. This makes client-side navigations reliably dismiss the loading
        // overlay even when pathname monitoring lags. The pathname/search
        // observer and native event listeners remain as safety fallbacks.
        try {
          endNavigation(navId)
        } catch (err) {
          // Defensive: don't throw from navigation flow
          // eslint-disable-next-line no-console
          console.warn('endNavigation failed after router promise', err)
        }
      } catch (error) {
        console.error('Navigation error:', error)
        // Ensure we don't leave the app stuck in navigating state on error.
        endNavigation(navigationIdRef.current || undefined)
      }
    },
    [
      router,
      startNavigation,
      endNavigation,
      state.isNavigating,
      pathname,
      searchParams,
    ]
  )

  /**
   * Navigate back with loading state
   */
  const goBack = useCallback(() => {
    if (state.isNavigating) {
      return
    }

    try {
      const navId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      navigationIdRef.current = navId
      startNavigation('back', 'back-button', navId)
      router.back()

      // Navigation completion handled by pathname monitoring
    } catch (error) {
      // Handle navigation errors gracefully
      console.warn('Back navigation failed:', error)
      endNavigation(navigationIdRef.current || undefined)
    }
  }, [router, startNavigation, endNavigation, state.isNavigating])

  /**
   * Navigate forward with loading state
   */
  const goForward = useCallback(() => {
    if (state.isNavigating) {
      return
    }

    try {
      const navId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      navigationIdRef.current = navId
      startNavigation('forward', 'forward-button', navId)
      router.forward()

      // Navigation completion handled by pathname monitoring
    } catch (error) {
      // Handle navigation errors gracefully
      console.warn('Forward navigation failed:', error)
      endNavigation(navigationIdRef.current || undefined)
    }
  }, [router, startNavigation, endNavigation, state.isNavigating])

  /**
   * Refresh current page with loading state
   */
  const refresh = useCallback(() => {
    if (state.isNavigating) {
      return
    }

    try {
      const navId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      navigationIdRef.current = navId
      startNavigation('refresh', 'refresh-button', navId)
      router.refresh()
    } catch (error) {
      // Handle navigation errors gracefully
      console.warn('Page refresh failed:', error)
      endNavigation(navigationIdRef.current || undefined)
    }
  }, [router, startNavigation, endNavigation, state.isNavigating])

  return {
    // Enhanced navigation methods
    push: navigateWithLoading,
    replace: (path: string, elementId?: string) =>
      navigateWithLoading(path, elementId, { replace: true }),
    back: goBack,
    forward: goForward,
    refresh,

    // Loading state information
    isNavigating: state.isNavigating,
    targetPath: state.targetPath,
    isNavigatingTo: (path: string) => state.targetPath === path,
    isElementLoading: (elementId: string) => state.elementId === elementId,

    // Direct access to navigation loading context
    navigationState: state,
  }
}
