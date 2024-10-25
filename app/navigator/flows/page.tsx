'use client'
import { Box } from '@mui/material'
import SplashHeader from '@app/clientComponents/splash-header'
import { useRouter } from 'next/navigation'
import SplashNavButton from '@app/clientComponents/splash-nav-button'

export default function Page() {
  const router = useRouter()

  const handlePracticeSeriesClick = () => {
    router.push('/navigator/flows/practiceSeries')
  }
  const handleCreateSeriesClick = () => {
    router.push('/navigator/flows/createSeries')
  }
  const handlePracticeSequenceClick = () => {
    router.push('/navigator/flows/practiceSequences')
  }
  const handleCreateSequenceClick = () => {
    router.push('/navigator/flows/createSequence')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 4,
      }}
    >
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
        title="Practice Sequence"
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
  )
}
