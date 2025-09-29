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
  const minimumLoadingTimeRef = useRef<NodeJS.Timeout | null>(null)

  // Monitor pathname changes to detect when navigation completes
  useEffect(() => {
    if (currentPathRef.current !== pathname) {
      // Path has changed, navigation is complete
      if (state.isNavigating && navigationStartTimeRef.current) {
        const navigationDuration = Date.now() - navigationStartTimeRef.current
        const minimumLoadingTime = 300 // Show loading for at least 300ms

        if (navigationDuration >= minimumLoadingTime) {
          // Navigation took long enough, end immediately
          endNavigation()
        } else {
          // Navigation was too fast, delay ending to prevent jarring UX
          const remainingTime = minimumLoadingTime - navigationDuration
          minimumLoadingTimeRef.current = setTimeout(() => {
            endNavigation()
          }, remainingTime)
        }
      }
      currentPathRef.current = pathname
      navigationStartTimeRef.current = null
    }
  }, [pathname, state.isNavigating, endNavigation])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (minimumLoadingTimeRef.current) {
        clearTimeout(minimumLoadingTimeRef.current)
      }
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

      // Clear any pending minimum loading timeout
      if (minimumLoadingTimeRef.current) {
        clearTimeout(minimumLoadingTimeRef.current)
        minimumLoadingTimeRef.current = null
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

        // Fallback timeout in case pathname change detection fails
        setTimeout(() => {
          if (state.isNavigating && navigationStartTimeRef.current) {
            console.warn(
              'Navigation timeout reached, forcing end of loading state'
            )
            endNavigation()
            navigationStartTimeRef.current = null
          }
        }, 5000) // 5 second maximum timeout
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

    // Clear any pending minimum loading timeout
    if (minimumLoadingTimeRef.current) {
      clearTimeout(minimumLoadingTimeRef.current)
      minimumLoadingTimeRef.current = null
    }

    try {
      startNavigation('back', 'back-button')
      navigationStartTimeRef.current = Date.now()
      router.back()

      // Fallback timeout for back navigation
      setTimeout(() => {
        if (state.isNavigating && navigationStartTimeRef.current) {
          console.warn('Back navigation timeout reached')
          endNavigation()
          navigationStartTimeRef.current = null
        }
      }, 3000) // 3 second timeout for back navigation
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

    // Clear any pending minimum loading timeout
    if (minimumLoadingTimeRef.current) {
      clearTimeout(minimumLoadingTimeRef.current)
      minimumLoadingTimeRef.current = null
    }

    try {
      startNavigation('forward', 'forward-button')
      navigationStartTimeRef.current = Date.now()
      router.forward()

      // Fallback timeout for forward navigation
      setTimeout(() => {
        if (state.isNavigating && navigationStartTimeRef.current) {
          console.warn('Forward navigation timeout reached')
          endNavigation()
          navigationStartTimeRef.current = null
        }
      }, 3000) // 3 second timeout for forward navigation
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

    // Clear any pending minimum loading timeout
    if (minimumLoadingTimeRef.current) {
      clearTimeout(minimumLoadingTimeRef.current)
      minimumLoadingTimeRef.current = null
    }

    try {
      startNavigation('refresh', 'refresh-button')
      navigationStartTimeRef.current = Date.now()
      router.refresh()

      // For refresh, use a longer timeout since the page reloads
      setTimeout(() => {
        if (state.isNavigating && navigationStartTimeRef.current) {
          console.warn('Page refresh timeout reached')
          endNavigation()
          navigationStartTimeRef.current = null
        }
      }, 2000) // 2 second timeout for refresh
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
