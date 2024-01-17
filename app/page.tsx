import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import TabHeader from '@components/tab-header'
import CurrentTime from '@components/current-time'
import TopNav from '@/pages/top-nav'
// import AppHeader from '@app/app-header'

export default function Home() {
  return (
    <>
      {/* <AppHeader /> */}
      <Stack direction="row" justifyContent="space-between">
        <TopNav />
        <Stack>
          <Typography variant="h3">Soar App</Typography>
        </Stack>
      </Stack>
      <Box textAlign="center">
        <Typography variant="body1">Like a leaf on the wind</Typography>
        <Typography variant="body1">The 8 Limbs of Yoga </Typography>
        <Typography variant="body1">
          <CurrentTime />
        </Typography>
      </Box>
      <TabHeader />
    </>
  )
}
