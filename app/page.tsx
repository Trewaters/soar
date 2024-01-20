import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import TabHeader from '@components/tab-header'
import CurrentTime from '@components/current-time'
import TopNav from '@/app/top-nav'

export default function Home() {
  return (
    <>
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
