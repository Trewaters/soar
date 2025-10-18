'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import { useNavigationLoading } from '@context/NavigationLoadingContext'

/**
 * Enhanced router hook that provides loading state feedback for navigation actions.
 * Prevents multiple rapid taps/clicks on mobile devices by showing immediate visual feedback.
 */
export function useNavigationWithLoading() {
  const router = useRouter()
  const pathname = usePathname()
  const { startNavigation, endNavigation, state } = useNavigationLoading()
  const currentPathRef = useRef(pathname)
  const navigationStartTimeRef = useRef<number | null>(null)

  // Monitor pathname changes to detect when navigation completes
  useEffect(() => {
    // Always update current path ref
    if (currentPathRef.current !== pathname) {
      currentPathRef.current = pathname

      // If we're currently navigating, end the navigation immediately
      if (state.isNavigating) {
        endNavigation()
        navigationStartTimeRef.current = null
      }
    }
  }, [pathname, state.isNavigating, endNavigation]) // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      // No cleanup needed for immediate navigation approach
    }
  }, [])

  /**
   * Navigate to a new route with loading state feedback
   * @param path - The route to navigate to
   * @param elementId - Optional ID to track specific element loading state
   * @param options - Additional navigation options
   */
  const navigateWithLoading = useCallback(
    (
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

      // Start loading state and record navigation start time
      startNavigation(path, elementId)
      navigationStartTimeRef.current = Date.now()

      try {
        // Perform navigation
        if (options?.replace) {
          router.replace(path)
        } else {
          router.push(path)
        }

        // Navigation completion is handled by pathname monitoring - no artificial timeouts needed
      } catch (error) {
        console.error('Navigation error:', error)
        endNavigation()
        navigationStartTimeRef.current = null
      }
    },
    [router, startNavigation, endNavigation, state.isNavigating]
  )

  /**
   * Navigate back with loading state
   */
  const goBack = useCallback(() => {
    if (state.isNavigating) {
      return
    }

    try {
      startNavigation('back', 'back-button')
      navigationStartTimeRef.current = Date.now()
      router.back()

      // Navigation completion handled by pathname monitoring
    } catch (error) {
      // Handle navigation errors gracefully
      console.warn('Back navigation failed:', error)
      endNavigation()
      navigationStartTimeRef.current = null
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
      startNavigation('forward', 'forward-button')
      navigationStartTimeRef.current = Date.now()
      router.forward()

      // Navigation completion handled by pathname monitoring
    } catch (error) {
      // Handle navigation errors gracefully
      console.warn('Forward navigation failed:', error)
      endNavigation()
      navigationStartTimeRef.current = null
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
      startNavigation('refresh', 'refresh-button')
      navigationStartTimeRef.current = Date.now()
      router.refresh()

      // Safety timeout for refresh - slightly longer since page reloads
      setTimeout(() => {
        if (state.isNavigating && navigationStartTimeRef.current) {
          console.warn('Page refresh safety timeout reached')
          endNavigation()
          navigationStartTimeRef.current = null
        }
      }, 1500) // 1.5 second safety timeout for refresh
    } catch (error) {
      // Handle navigation errors gracefully
      console.warn('Page refresh failed:', error)
      endNavigation()
      navigationStartTimeRef.current = null
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
