import React from 'react'
import { Box, Typography } from '@mui/material'
import TabHeader from '@components/tab-header'
import CurrentTime from '../components/current-time'
// import TopNav from '@app/top-nav'

export default function Home() {
  return (
    <>
      <Box textAlign="center">
        <Typography variant="body1">Like a leaf on the wind</Typography>
        <Typography variant="body1">The 8 Limbs of Yoga </Typography>
        <CurrentTime />
      </Box>
      <TabHeader />
    </>
  )
}
