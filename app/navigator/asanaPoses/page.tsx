'use client'

import { Box } from '@mui/material'
import SplashHeader from '@app/clientComponents/splash-header'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import SplashNavButton from '@app/clientComponents/splash-nav-button'
import NAV_PATHS from '@app/utils/navigation/constants'

export default function Page() {
  const router = useNavigationWithLoading()

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
          src={'/images/asana-poses-splash-header.png'}
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
          image="/images/asana/create-asana-splash-header-bw.png"
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
