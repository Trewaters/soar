'use client'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/system'
import SplashHeader from '@app/clientComponents/splash-header'
import { useRouter } from 'next/navigation'
import SplashNavButton from '@app/clientComponents/splash-nav-button'
import { useSession } from '@node_modules/next-auth/react'
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup'
import { useState, MouseEvent } from 'react'
import NavBottom from '@serverComponents/navBottom'

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
}

const PopupBody = styled('div')(
  ({ theme }) => `
  width: max-content;
  padding: 12px 16px;
  margin: 8px;
  border-radius: 8px;
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  box-shadow: ${
    theme.palette.mode === 'dark'
      ? `0px 4px 8px rgb(0 0 0 / 0.7)`
      : `0px 4px 8px rgb(0 0 0 / 0.1)`
  };
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  z-index: 1;
`
)

export default function Page() {
  const router = useRouter()
  const { data: session } = useSession()
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)

  const handlePracticeSeriesClick = () => {
    router.push('/navigator/flows/practiceSeries')
  }
  const handleCreateSeriesClick = (event: MouseEvent<HTMLElement>) => {
    if (!session) {
      setAnchor(anchor ? null : event.currentTarget)
    } else {
      router.push('/navigator/flows/createSeries')
    }
  }
  const handlePracticeSequenceClick = () => {
    router.push('/navigator/flows/practiceSequences')
  }
  const handleCreateSequenceClick = (event: MouseEvent<HTMLElement>) => {
    if (!session) {
      setAnchor(anchor ? null : event.currentTarget)
    } else {
      router.push('/navigator/flows/createSequence')
    }
  }

  const open = Boolean(anchor)
  const id = open ? 'simple-popup' : undefined

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <BasePopup id={id} open={open} anchor={anchor} placement={'top'}>
          <PopupBody>
            <Typography color="error.contrastText">
              Please sign-in to access this feature.
            </Typography>
          </PopupBody>
        </BasePopup>
        <SplashHeader
          src={'/icons/designImages/splash-flows-2.png'}
          alt={'Flows'}
          title="Flows"
        />
        <Box height={'32px'} />
        <SplashNavButton
          title="Practice Series"
          description="Series are made up of asana poses."
          sx={{
            backgroundImage: "url('/images/practice-series-color.png')",
          }}
          onClick={handlePracticeSeriesClick}
        />
        <SplashNavButton
          title="Create Series"
          description="Create your own Series of asana poses."
          sx={{
            backgroundImage: "url('/images/create-series-bw.png')",
          }}
          onClick={handleCreateSeriesClick}
        />
        <SplashNavButton
          title="Practice Sequences"
          description="Sequences are ordered series."
          sx={{
            backgroundImage:
              "url('/icons/designImages/beautiful-young-woman-practices-yoga-asana.png')",
          }}
          onClick={handlePracticeSequenceClick}
        />
        <SplashNavButton
          title="Create Sequence"
          description="Create your Sequences."
          sx={{
            backgroundImage:
              "url('/icons/designImages/beautiful-young-woman-practices-yoga-create-sequence.png')",
          }}
          onClick={handleCreateSequenceClick}
        />
      </Box>
      <Box height={'72px'} />
      <NavBottom subRoute="/navigator/flows" />
    </>
  )
}
