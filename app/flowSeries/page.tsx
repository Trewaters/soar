'use client'
import { FEATURES } from '@app/FEATURES'
import { Box, Button, Stack, Typography } from '@mui/material'
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
        Flow a Series
      </Typography>
      <Stack direction="row" spacing={5} sx={{ mt: 4 }}>
        <Button
          variant="contained"
          href="/flowSeries/practiceSeries"
          // component="a"
          LinkComponent="a"
        >
          Practice Series
        </Button>
        {FEATURES.SHOW_CREATE_SERIES && (
          <>
            <Typography variant="body1">or</Typography>
            <Button
              variant="outlined"
              color="primary"
              href="/flowSeries/createSeries"
              LinkComponent="a"
            >
              Create Series
            </Button>
          </>
        )}
      </Stack>
      {FEATURES.SHOW_PRACTICE_SEQUENCE && (
        <Stack direction="row" spacing={5} sx={{ mt: 4 }}>
          <Button
            variant="contained"
            LinkComponent="a"
            href="/flowSeries/practiceSequences"
          >
            Practice Sequence
          </Button>
          {FEATURES.SHOW_CREATE_SEQUENCE && (
            <>
              <Typography variant="body1">or</Typography>
              <Button
                variant="outlined"
                color="primary"
                LinkComponent="a"
                href="/flowSeries/practiceSequences"
              >
                Create Sequence
              </Button>
            </>
          )}
        </Stack>
      )}

      {/* <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search> */}
    </Box>
  )
}
