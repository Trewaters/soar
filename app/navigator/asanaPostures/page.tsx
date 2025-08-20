'use client'

import { Box } from '@mui/material'
import SplashHeader from '@app/clientComponents/splash-header'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import SplashNavButton from '@app/clientComponents/splash-nav-button'

export default function Page() {
  const router = useNavigationWithLoading()

  const handlePracticeAsanaClick = () => {
    // Navigate to the dedicated practice asana page
    router.push('/navigator/asanaPostures/practiceAsanas')
  }

  const handleCreateAsanaClick = () => {
    router.push('/navigator/asanaPostures/createAsana')
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
          src={'/images/asana-postures-splash-header.png'}
          alt={'Asana'}
          title="Asana"
        />
        <Box height={'32px'} />

        {/* Practice Asana Postures Button with embedded search */}
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
            title="Practice Asana Postures"
            description="Search and practice yoga postures."
            sx={{
              backgroundImage:
                "url('/images/asana/practice-asana-posture-210x363.png')",
              mb: 2,
            }}
            onClick={handlePracticeAsanaClick}
          />
        </Box>

        {/* Create Asana Postures Button */}
        <SplashNavButton
          title="Create Asana Posture"
          description="Customize your practice by creating new Asana postures."
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
