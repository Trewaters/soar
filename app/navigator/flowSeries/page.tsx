'use client'
import { FEATURES } from '@app/FEATURES'
import { Box, Button, Stack, Typography } from '@mui/material'
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement'
import HexagonIcon from '@mui/icons-material/Hexagon'
import HiveIcon from '@mui/icons-material/Hive'
import warrior1 from '@public/warrior one-icon.svg'
import Image from 'next/image'

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
        // Enables Flexbox
        display: 'flex',
        // Stack children vertically
        flexDirection: 'column',
        // Center content vertically
        justifyContent: 'center',
        // Center content horizontally
        alignItems: 'center',
      }}
    >
      <Typography variant="h2" align="center">
        Flows
      </Typography>

      <Stack spacing={5} alignItems={'center'} sx={{ mt: 4, width: '50%' }}>
        <Typography variant="body2" sx={{ width: '50%' }}>
          Series are made up of asana poses.
        </Typography>
        <Button
          variant="contained"
          href="/navigator/flowSeries/practiceSeries"
          LinkComponent="a"
          startIcon={<SelfImprovementIcon />}
          // sx={{ width: '50%' }}
        >
          Practice Series
        </Button>
        {FEATURES.SHOW_CREATE_SERIES && (
          <Button
            variant="contained"
            color="primary"
            href="/navigator/flowSeries/createSeries"
            LinkComponent="a"
            startIcon={<HexagonIcon />}
            // sx={{ width: '50%' }}
          >
            Create Series
          </Button>
        )}
        <Typography variant="body2" sx={{ width: '50%' }}>
          Sequences can be up to an hour or more and are made up of Series.
        </Typography>
        {FEATURES.SHOW_PRACTICE_SEQUENCE && (
          <Button
            variant="contained"
            LinkComponent="a"
            href="/navigator/flowSeries/practiceSequences"
            startIcon={
              <Image
                src={warrior1}
                alt="warrior1 Icon"
                width={24}
                height={24}
              />
            }
            // sx={{ width: '50%' }}
          >
            Practice Sequence
          </Button>
        )}
        {FEATURES.SHOW_CREATE_SEQUENCE && (
          <Button
            variant="contained"
            color="primary"
            LinkComponent="a"
            href="/navigator/flowSeries/createSequence"
            startIcon={<HiveIcon />}
            // sx={{ width: '50%' }}
          >
            Create Sequence
          </Button>
        )}
      </Stack>
    </Box>
  )
}
