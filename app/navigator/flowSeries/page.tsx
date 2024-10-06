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

// import { Router } from 'next/router'

// const Search = styled('div')(({ theme }) => ({
//   position: 'relative',
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: alpha(theme.palette.common.white, 0.15),
//   '&:hover': {
//     backgroundColor: alpha(theme.palette.common.white, 0.25),
//   },
//   marginRight: theme.spacing(2),
//   marginLeft: 0,
//   width: '100%',
//   [theme.breakpoints.up('sm')]: {
//     marginLeft: theme.spacing(3),
//     width: 'auto',
//   },
// }))

// const SearchIconWrapper = styled('div')(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: '100%',
//   position: 'absolute',
//   pointerEvents: 'none',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// }))

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: 'inherit',
//   '& .MuiInputBase-input': {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//     transition: theme.transitions.create('width'),
//     width: '100%',
//     [theme.breakpoints.up('md')]: {
//       width: '20ch',
//     },
//   },
// }))

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
          position: 'relative',
          display: 'flex',
          height: '260px',
          width: '44%',
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
          // variant="text"
          href="/navigator/flowSeries/practiceSeries"
          // startIcon={<SelfImprovementIcon />}
          endIcon={
            <SelfImprovementIcon style={{ height: '36px', width: '36px' }} />
          }
          sx={{
            backgroundColor: 'info.contrastText',
            // alignSelf: 'end',
            // alignItems: 'center',
            // justifyItems: 'start',
            justifyContent: 'center',
            // width: ['80vw', '80%'],
            width: ['100vw', '100%'],
          }}
        >
          <Typography variant="h3">Practice Series</Typography>
        </Button>
      </Box>

      {typeof window !== 'undefined' && FEATURES.SHOW_CREATE_SERIES && (
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            height: '202px',
            width: '44%',
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
              width: ['100vw', '100%'],
            }}
          >
            <Typography variant="h3">Create Series</Typography>
          </Button>
        </Box>
      )}

      {typeof window !== 'undefined' && FEATURES.SHOW_PRACTICE_SEQUENCE && (
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            height: '202px',
            width: '44%',
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
              width: ['100vw', '100%'],
            }}
          >
            <Typography variant="h3" noWrap>
              Practice Sequence
            </Typography>
          </Button>
        </Box>
      )}

      {typeof window !== 'undefined' && FEATURES.SHOW_CREATE_SEQUENCE && (
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            height: '202px',
            width: '44%',
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
            variant="h3"
            component={'h2'}
            sx={{
              color: 'navSplash.main',
              alignSelf: 'start',
              mt: 2,
              ml: 4,
            }}
          >
            Create your Sequences.
          </Typography>
          <Button
            // variant="text"
            href="/navigator/flowSeries/createSequence"
            endIcon={<HiveIcon style={{ height: '36px', width: '36px' }} />}
            sx={{
              backgroundColor: 'info.contrastText',
              justifyContent: 'center',
              width: ['100vw', '100%'],
            }}
          >
            <Typography variant="h3">Create Sequence</Typography>
          </Button>
        </Box>
      )}
    </Box>
  )
}
