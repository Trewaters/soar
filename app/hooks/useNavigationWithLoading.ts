'use client'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useNavigationLoading } from '@context/NavigationLoadingContext'

/**
 * Enhanced router hook that provides loading state feedback for navigation actions.
 * Prevents multiple rapid taps/clicks on mobile devices by showing immediate visual feedback.
 */
export function useNavigationWithLoading() {
  const router = useRouter()
  const { startNavigation, endNavigation, state } = useNavigationLoading()

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

      // Start loading state
      startNavigation(path, elementId)

      try {
        // Perform navigation
        if (options?.replace) {
          router.replace(path)
        } else {
          router.push(path)
        }

        // End loading state after a brief delay to ensure the navigation has started
        // This provides visual feedback while the route is loading
        setTimeout(() => {
          endNavigation()
        }, 500) // Short delay for immediate visual feedback
      } catch (error) {
        console.error('Navigation error:', error)
        endNavigation()
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

    startNavigation('back', 'back-button')
    router.back()

    setTimeout(() => {
      endNavigation()
    }, 500)
  }, [router, startNavigation, endNavigation, state.isNavigating])

  /**
   * Navigate forward with loading state
   */
  const goForward = useCallback(() => {
    if (state.isNavigating) {
      return
    }

    startNavigation('forward', 'forward-button')
    router.forward()

    setTimeout(() => {
      endNavigation()
    }, 500)
  }, [router, startNavigation, endNavigation, state.isNavigating])

  /**
   * Refresh current page with loading state
   */
  const refresh = useCallback(() => {
    if (state.isNavigating) {
      return
    }

    startNavigation('refresh', 'refresh-button')
    router.refresh()

    setTimeout(() => {
      endNavigation()
    }, 1000) // Slightly longer for refresh
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
