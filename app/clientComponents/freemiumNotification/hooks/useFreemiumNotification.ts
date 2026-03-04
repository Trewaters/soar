'use client'
import { useCallback, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import type {
  FreemiumFeatureType,
  UserAuthState,
  FeatureAccessResult,
  NotificationContent,
} from '../types'

/**
 * Custom hook for managing freemium notifications
 * Integrates with NextAuth.js session management and navigation
 */
export const useFreemiumNotification = () => {
  const { data: session, status } = useSession()
  const router = useNavigationWithLoading()

  // Determine user authentication state
  const userAuthState = useMemo<UserAuthState>(() => {
    if (status === 'loading') return 'unauthenticated'
    if (!session?.user) return 'unauthenticated'

    // All authenticated users are treated as having full access
    // No upgrade/payment system implemented yet
    return 'authenticated-pro'
  }, [session, status])

  // Check if user has access to a specific feature
  const checkFeatureAccess = useCallback(
    (featureType: FreemiumFeatureType): FeatureAccessResult => {
      const featureNames = {
        createAsana: 'custom asanas',
        createFlow: 'custom flows',
        createSeries: 'custom series',
        createSequence: 'custom sequences',
      }

      const featureName = featureNames[featureType] || 'this feature'

      // Unauthenticated users need to log in
      if (userAuthState === 'unauthenticated') {
        return {
          hasAccess: false,
          requiresLogin: true,
          requiresUpgrade: false,
          notificationContent: {
            title: 'Login Required',
            message: `Please log in to create ${featureName}`,
            ctaText: 'Log In',
            severity: 'info',
          },
        }
      }

      // All authenticated users have access (no payment system yet)
      return {
        hasAccess: true,
        requiresLogin: false,
        requiresUpgrade: false,
        notificationContent: {
          title: 'Feature Available',
          message: `You can create ${featureName}`,
          severity: 'success',
        },
      }
    },
    [userAuthState]
  )

  // Handle navigation to login page
  const handleLoginRedirect = useCallback(
    (returnUrl?: string) => {
      const currentPath = window.location.pathname
      const targetUrl = returnUrl || currentPath
      const loginUrl = `/auth/signin?callbackUrl=${encodeURIComponent(targetUrl)}`
      router.push(loginUrl)
    },
    [router]
  )

  // Handle navigation to upgrade page (disabled - no payment system yet)
  const handleUpgradeRedirect = useCallback(() => {
    // TODO: Implement actual upgrade flow when payment system is ready
    console.warn('Upgrade functionality not implemented yet')
  }, [])

  // Get notification content for a specific feature
  const getNotificationContent = useCallback(
    (featureType: FreemiumFeatureType): NotificationContent => {
      const accessResult = checkFeatureAccess(featureType)
      return accessResult.notificationContent
    },
    [checkFeatureAccess]
  )

  // Handle CTA action based on user state
  const handleCtaAction = useCallback(
    (featureType: FreemiumFeatureType, returnUrl?: string) => {
      const accessResult = checkFeatureAccess(featureType)

      if (accessResult.requiresLogin) {
        handleLoginRedirect(returnUrl)
      } else if (accessResult.requiresUpgrade) {
        handleUpgradeRedirect()
      }
    },
    [checkFeatureAccess, handleLoginRedirect, handleUpgradeRedirect]
  )

  return {
    userAuthState,
    sessionStatus: status,
    isLoading: status === 'loading',
    checkFeatureAccess,
    getNotificationContent,
    handleCtaAction,
    handleLoginRedirect,
    handleUpgradeRedirect,
  }
}
