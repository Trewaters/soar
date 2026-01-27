'use client'

import { Box } from '@mui/material'
import { useState, useCallback } from 'react'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'

import SplashHeader from '@app/clientComponents/splash-header'
import SplashNavButton from '@app/clientComponents/splash-nav-button'
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
    router.push('/navigator/flows/practiceSequences')
  }

  const handleCreateSequenceClick = () => {
    handleFreemiumFeatureClick(
      'createSequence',
      '/navigator/flows/createSequence'
    )
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
          image="/icons/designImages/beautiful-young-woman-practices-yoga-asana.png"
          sx={{
            backgroundImage:
              "url('/icons/designImages/beautiful-young-woman-practices-yoga-asana.png')",
          }}
          onClick={handlePracticeSequenceClick}
        />
        <SplashNavButton
          title="Create Sequence"
          description="Create your Sequences."
          image="/icons/designImages/beautiful-young-woman-practices-yoga-create-sequence.png"
          premium
          sx={{
            backgroundImage:
              "url('/icons/designImages/beautiful-young-woman-practices-yoga-create-sequence.png')",
          }}
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
