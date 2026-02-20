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

export default function SequencesPage() {
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
  const handlePracticeSequenceClick = () => {
    router.push('/flows/practiceSequences')
  }

  const handleCreateSequenceClick = () => {
    handleFreemiumFeatureClick('createSequence', '/flows/createSequence')
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

  // Determine auth state for image selection (prefer client-side detection)
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
          src={
            '/icons/designImages/beautiful-young-woman-practices-yoga-asana.png'
          }
          alt={'Sequences'}
          title="Sequences"
        />
        <SplashNavButton
          title="Practice Sequences"
          description="Sequences are ordered flows."
          image="/images/asana/practice-asana-color.png"
          onClick={handlePracticeSequenceClick}
        />
        <SplashNavButton
          title="Create Sequence"
          description="Create your Sequences."
          colorImage="/images/asana/create-sequence-color.png"
          bwImage="/images/asana/create-sequence-bw.png"
          isAuthenticated={isAuthenticated}
          premium
          onClick={handleCreateSequenceClick}
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
