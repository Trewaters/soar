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
  const userAuthState: UserAuthState = useMemo(() => {
    if (status === 'loading') {
      return 'unauthenticated' // Default during loading
    }

    if (!session) {
      return 'unauthenticated'
    }

    // TODO: Add logic to determine if user is pro/premium
    // For now, all authenticated users are considered free tier
    // This would be replaced with actual subscription check
    return 'authenticated-free'
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

      // Free tier users need to upgrade
      if (userAuthState === 'authenticated-free') {
        return {
          hasAccess: false,
          requiresLogin: false,
          requiresUpgrade: true,
          notificationContent: {
            title: 'Upgrade Required',
            message: `Upgrade to Pro to create ${featureName}`,
            ctaText: 'Upgrade Now',
            severity: 'warning',
          },
        }
      }

      // Pro users have access
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

  // Handle navigation to upgrade page (placeholder)
  const handleUpgradeRedirect = useCallback(() => {
    // TODO: Implement actual upgrade flow
    // For now, redirect to profile page where upgrade info might be shown
    router.push('/navigator/profile')
  }, [router])

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
