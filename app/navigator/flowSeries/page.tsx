'use client'
import { FEATURES } from '@app/FEATURES'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Stack,
  Typography,
} from '@mui/material'
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement'
import HexagonIcon from '@mui/icons-material/Hexagon'
import HiveIcon from '@mui/icons-material/Hive'
import warrior1 from '@public/warrior one-icon.svg'
import Image from 'next/image'
import SplashHeader from '@app/clientComponents/splash-header'

export default function Page() {
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
        src={'/icons/designImages/splash-flows.png'}
        alt={'Flows'}
        title="Flows"
      />
      <Box
        sx={{
          display: 'flex',
          height: '260px',
          // maxWidth: '100vw',
          // width: '80%',
          width: '384px',
          borderRadius: '8px',
          border: '1px solid',
          borderColor: 'primary.main',
          alignItems: 'center',
          overflow: 'hidden',
          flexDirection: 'column',
          justifyContent: 'space-between',

          backgroundImage: `url('/icons/designImages/button-practice-series.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
          mb: 4,
        }}
      >
        <Typography
          variant="body1"
          component={'h2'}
          sx={{
            color: 'navSplash.main',
            alignSelf: 'start',
            mt: 2,
            mx: 4,
            fontWeight: 'bold',
          }}
        >
          Series are made up of asana poses.
        </Typography>
        <Button
          href="/navigator/flowSeries/practiceSeries"
          endIcon={
            <SelfImprovementIcon style={{ height: '36px', width: '36px' }} />
          }
          sx={{
            backgroundColor: 'info.contrastText',
            justifyContent: 'center',
            width: '100%',
            whiteSpace: 'normal',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <Typography variant="h6" sx={{ whiteSpace: 'normal' }}>
            Practice Series
          </Typography>
        </Button>
      </Box>

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          height: '202px',
          width: '381px',
          borderRadius: '8px',
          border: '1px solid',
          borderColor: 'primary.main',
          alignItems: 'center',
          overflow: 'hidden',
          flexDirection: 'column',
          justifyContent: 'space-between',

          backgroundImage: `url('/icons/designImages/beautiful-young-woman-practices-yoga-asana-garudas.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
          mb: 4,
        }}
      >
        <Typography
          variant="body1"
          component={'h2'}
          sx={{
            color: 'navSplash.main',
            alignSelf: 'start',
            mt: 2,
            mx: 4,
            fontWeight: 'bold',
          }}
        >
          Create your own Series of asana poses.
        </Typography>
        <Image
          src="/icons/subscription-star.svg"
          alt="subscription icon"
          height={36}
          width={36}
          style={{ position: 'relative', left: '132px', top: '15px' }}
        />
        <Button
          href="/navigator/flowSeries/createSeries"
          endIcon={
            <Image
              src="/warrior one-icon.svg"
              alt="practice series icon"
              height={36}
              width={36}
            />
          }
          sx={{
            backgroundColor: 'info.contrastText',
            justifyContent: 'center',
            width: '100%',
            whiteSpace: 'normal',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <Typography variant="h6" sx={{ whiteSpace: 'normal' }}>
            Create Series
          </Typography>
        </Button>
      </Box>

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          height: '202px',
          width: '384px',
          borderRadius: '8px',
          border: '1px solid',
          borderColor: 'primary.main',
          alignItems: 'center',
          overflow: 'hidden',

          flexDirection: 'column',
          justifyContent: 'space-between',

          backgroundImage: `url('/icons/designImages/beautiful-young-woman-practices-yoga-asana.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
          mb: 4,
        }}
      >
        <Typography
          variant="body1"
          component={'h2'}
          sx={{
            color: 'navSplash.main',
            alignSelf: 'start',
            mt: 2,
            ml: 4,
            fontWeight: 'bold',
          }}
        >
          Sequences are ordered series.
        </Typography>
        <Button
          href="/navigator/flowSeries/practiceSequences"
          endIcon={<HexagonIcon style={{ height: '36px', width: '36px' }} />}
          sx={{
            backgroundColor: 'info.contrastText',
            justifyContent: 'center',
            width: '100%',
            whiteSpace: 'normal',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <Typography variant="h6" sx={{ whiteSpace: 'normal' }}>
            Practice Sequence
          </Typography>
        </Button>
      </Box>

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          height: '202px',
          width: '384px',
          borderRadius: '8px',
          border: '1px solid',
          borderColor: 'primary.main',
          alignItems: 'center',
          overflow: 'hidden',

          flexDirection: 'column',
          justifyContent: 'space-between',

          backgroundImage: `url('/icons/designImages/beautiful-young-woman-practices-yoga-create-sequence.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
          mb: 4,
        }}
      >
        <Typography
          variant="body1"
          component={'h2'}
          sx={{
            color: 'navSplash.main',
            alignSelf: 'start',
            mt: 2,
            ml: 4,
            fontWeight: 'bold',
          }}
        >
          Create your Sequences.
        </Typography>
        <Image
          src="/icons/subscription-star.svg"
          alt="subscription icon"
          height={36}
          width={36}
          style={{ position: 'relative', left: '132px', top: '15px' }}
        />
        <Button
          href="/navigator/flowSeries/createSequence"
          endIcon={<HiveIcon style={{ height: '36px', width: '36px' }} />}
          sx={{
            backgroundColor: 'info.contrastText',
            justifyContent: 'center',
            width: '100%',
            whiteSpace: 'normal',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <Typography variant="h6" sx={{ whiteSpace: 'normal' }}>
            Create Sequence
          </Typography>
        </Button>
      </Box>
    </Box>
  )
}
