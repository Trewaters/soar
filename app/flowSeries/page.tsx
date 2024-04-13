'use client'
import { Box, Button, Stack, Typography } from '@mui/material'
import { Router } from 'next/router'

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
      <Typography variant="h1" align="center">
        Flow Series
      </Typography>
      <Stack direction="row" spacing={5} sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          href="/flowSeries/practice"
          // component="a"
          LinkComponent="a"
        >
          Practice
        </Button>
        <Typography variant="body1">or</Typography>
        <Button variant="contained" color="primary" component="a">
          Create
        </Button>
      </Stack>
      <Stack direction="row" spacing={5} sx={{ mt: 4 }}>
        <Button variant="outlined" color="primary" component="a">
          Flow (full)
        </Button>
        <Typography variant="body1">vs.</Typography>
        <Button variant="contained" component="a">
          Series (mini)
        </Button>
      </Stack>
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
