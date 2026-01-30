'use client'

import { Box } from '@mui/material'
import SplashHeader from '@app/clientComponents/splash-header'
import { useSession } from 'next-auth/react'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import SplashNavButton from '@app/clientComponents/splash-nav-button'
import NAV_PATHS from '@app/utils/navigation/constants'

export default function Page() {
  const router = useNavigationWithLoading()

  const { data: session, status } = useSession()

  // Fallback cookie check for NextAuth session tokens. In some cases the
  // server-rendered session may be null while the client has an auth cookie
  // (e.g., after signing in on the client). Check known NextAuth cookie
  // names and treat presence as authenticated until `useSession` resolves.
  const hasAuthCookie = () => {
    if (typeof window === 'undefined') return false
    const c = document.cookie || ''
    return /(__Secure-)?next-auth\.session-token=|next-auth\.session-token=/.test(
      c
    )
  }

  const isAuthenticated =
    status === 'authenticated' || Boolean(session) || hasAuthCookie()

  const handlePracticeAsanaClick = () => {
    // Navigate to the dedicated practice asana page
    router.push(NAV_PATHS.PRACTICE_ASANAS)
  }

  const handleCreateAsanaClick = () => {
    router.push(NAV_PATHS.CREATE_ASANA)
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh', // Ensure full viewport height
          paddingBottom: { xs: '80px', sm: '80px' }, // Extra padding for mobile to ensure content is above nav
        }}
      >
        <SplashHeader
          src={'/images/asana/view-asana-practice-background.png'}
          alt={'Asana'}
          title="Asana"
        />
        <Box height={'32px'} />

        {/* Practice Asana Poses Button with embedded search */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '363px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <SplashNavButton
            title="Practice Asanas"
            description="Search and practice asana poses."
            image="/images/asana/practice-asana-pose-210x363.png"
            sx={{
              backgroundImage:
                "url('/images/asana/practice-asana-pose-210x363.png')",
              mb: 2,
            }}
            onClick={handlePracticeAsanaClick}
          />
        </Box>

        {/* Create Asana Poses Button */}
        <SplashNavButton
          title="Create Asana Pose"
          description="Customize your practice by creating new Asana poses."
          colorImage="/images/asana/create-asana-splash-header.png"
          bwImage="/images/asana/create-asana-splash-header-bw.png"
          isAuthenticated={isAuthenticated}
          premium
          sx={{
            backgroundImage:
              "url('/images/asana/create-asana-splash-header.svg')",
          }}
          onClick={handleCreateAsanaClick}
        />
      </Box>
    </>
  )
}
