'use client'
import { Box } from '@mui/material'
import SplashHeader from '@app/clientComponents/splash-header'
import { useRouter } from 'next/navigation'
import SplashNavButton from '@app/clientComponents/splash-nav-button'

export default function Page() {
  const router = useRouter()

  const handlePracticeSeriesClick = () => {
    router.push('/navigator/flowSeries/practiceSeries')
  }
  const handleCreateSeriesClick = () => {
    router.push('/navigator/flowSeries/createSeries')
  }
  const handlePracticeSequenceClick = () => {
    router.push('/navigator/flowSeries/practiceSequences')
  }
  const handleCreateSequenceClick = () => {
    router.push('/navigator/flowSeries/createSequence')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 4,
        width: '100%',
      }}
    >
      <SplashHeader
        src={'/icons/designImages/splash-flows-2.png'}
        alt={'Flows'}
        title="Flows"
      />
      <SplashNavButton
        title="Practice Series"
        description="Series are made up of asana poses."
        sx={{
          backgroundImage:
            "url('/icons/designImages/button-practice-series.png')",
        }}
        onClick={handlePracticeSeriesClick}
      />
      <SplashNavButton
        title="Create Series"
        description="Create your own Series of asana poses."
        sx={{
          backgroundImage:
            "url('/icons/designImages/beautiful-young-woman-practices-yoga-asana-garudas.png')",
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
