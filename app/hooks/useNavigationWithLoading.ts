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
    console.log(
      `useEffect triggered - Current path: ${currentPathRef.current}, New pathname: ${pathname}, isNavigating: ${state.isNavigating}`
    )

    // Always update current path ref
    if (currentPathRef.current !== pathname) {
      console.log(
        `Navigation completed: ${currentPathRef.current} -> ${pathname}`
      )
      currentPathRef.current = pathname

      // If we're currently navigating, end the navigation immediately
      if (state.isNavigating) {
        console.log('Ending navigation - route change detected')
        endNavigation()
        navigationStartTimeRef.current = null
      } else {
        console.log(
          'Path changed but not currently navigating - this might be a browser back/forward'
        )
      }
    } else {
      console.log(
        'Path unchanged, but useEffect triggered due to other dependencies'
      )
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
      console.log(`🔄 navigateWithLoading called for path: ${path}`)
      console.log(`   Current pathname: ${pathname}`)
      console.log(`   Current loading state: ${state.isNavigating}`)

      // Don't start new navigation if already navigating
      if (state.isNavigating) {
        console.log(`   Already navigating, skipping`)
        return
      }

      // Start loading state and record navigation start time
      console.log(`   Starting navigation loading for: ${path}`)
      startNavigation(path, elementId)
      navigationStartTimeRef.current = Date.now()

      try {
        // Perform navigation
        if (options?.replace) {
          console.log(`   Calling router.replace(${path})`)
          router.replace(path)
        } else {
          console.log(`   Calling router.push(${path})`)
          router.push(path)
        }
        console.log(`   Router navigation method called successfully`)

        // Reasonable safety timeout - much shorter than before
        // This only triggers if navigation completely fails
        setTimeout(() => {
          if (state.isNavigating && navigationStartTimeRef.current) {
            console.warn(
              `Navigation safety timeout reached for ${path}, ending loading state`
            )
            endNavigation()
            navigationStartTimeRef.current = null
          }
        }, 1500) // 1.5 second safety timeout - reduced from 3 seconds
      } catch (error) {
        console.error('Navigation error:', error)
        endNavigation()
        navigationStartTimeRef.current = null
      }
    },
    [router, startNavigation, endNavigation, state.isNavigating, pathname]
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

      // Safety timeout for back navigation
      setTimeout(() => {
        if (state.isNavigating && navigationStartTimeRef.current) {
          console.warn('Back navigation safety timeout reached')
          endNavigation()
          navigationStartTimeRef.current = null
        }
      }, 1000) // 1 second safety timeout for back navigation
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

      // Safety timeout for forward navigation
      setTimeout(() => {
        if (state.isNavigating && navigationStartTimeRef.current) {
          console.warn('Forward navigation safety timeout reached')
          endNavigation()
          navigationStartTimeRef.current = null
        }
      }, 1000) // 1 second safety timeout for forward navigation
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
