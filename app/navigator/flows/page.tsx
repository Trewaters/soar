'use client'

import { Box } from '@mui/material'
import { useState, useCallback } from 'react'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'

import SplashHeader from '@app/clientComponents/splash-header'
import SplashNavButton from '@app/clientComponents/splash-nav-button'
import { useSession } from 'next-auth/react'
import {
  FreemiumNotification,
  useFreemiumNotification,
  type FreemiumFeatureType,
} from '@app/clientComponents/freemiumNotification'

export default function Page() {
  const router = useNavigationWithLoading()
  const { userAuthState, checkFeatureAccess, handleCtaAction } =
    useFreemiumNotification()

  // State for notification management
  const [notificationState, setNotificationState] = useState<{
    isOpen: boolean
    featureType: FreemiumFeatureType | null
  }>({
    isOpen: false,
    featureType: null,
  })

  // Handle freemium feature clicks
  const handleFreemiumFeatureClick = useCallback(
    (featureType: FreemiumFeatureType, targetRoute: string) => {
      const accessResult = checkFeatureAccess(featureType)

      if (accessResult.hasAccess) {
        // User has access, navigate to the feature
        router.push(targetRoute)
      } else {
        // Show notification for restricted access
        setNotificationState({
          isOpen: true,
          featureType,
        })
      }
    },
    [checkFeatureAccess, router]
  )

  // Navigation handlers
  const handlePracticeSeriesClick = () => {
    router.push('/navigator/flows/practiceSeries')
  }

  const handleCreateSeriesClick = () => {
    handleFreemiumFeatureClick('createSeries', '/navigator/flows/createSeries')
  }

  // Close notification
  const handleCloseNotification = () => {
    setNotificationState({
      isOpen: false,
      featureType: null,
    })
  }

  // Handle CTA click in notification
  const handleNotificationCtaClick = () => {
    if (notificationState.featureType) {
      handleCtaAction(notificationState.featureType, window.location.pathname)
    }
  }

  // Determine auth state for image selection
  const { data: session, status } = useSession()
  const hasAuthCookie = () => {
    if (typeof window === 'undefined') return false
    const c = document.cookie || ''
    return /(__Secure-)?next-auth\.session-token=|next-auth\.session-token=/.test(
      c
    )
  }
  const isAuthenticated =
    status === 'authenticated' || Boolean(session) || hasAuthCookie()

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <SplashHeader
          src={'/icons/designImages/splash-flows-2.png'}
          alt={'Flows'}
          title="Flows"
        />
        <SplashNavButton
          title="Practice Flows"
          description="Flows are made up of asana poses."
          image="/images/practice-series-color.png"
          sx={{
            backgroundImage: "url('/images/practice-series-color.png')",
          }}
          onClick={handlePracticeSeriesClick}
        />
        <SplashNavButton
          title="Create Flow"
          description="Create your own Flow of asana poses."
          colorImage="/images/asana/create-flow-color.png"
          bwImage="/images/asana/create-flow-bw.png"
          isAuthenticated={isAuthenticated}
          premium
          sx={{
            backgroundImage: "url('/images/asana/create-flow-bw.png')",
          }}
          onClick={handleCreateSeriesClick}
        />
      </Box>

      {/* Freemium Notification */}
      {notificationState.featureType && (
        <FreemiumNotification
          featureType={notificationState.featureType}
          userAuthState={userAuthState}
          isOpen={notificationState.isOpen}
          onClose={handleCloseNotification}
          onCtaClick={handleNotificationCtaClick}
        />
      )}
    </>
  )
}
