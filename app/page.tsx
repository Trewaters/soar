import React from 'react'
import TopNav from '@/pages/top-nav'
import { Box, Stack, Typography } from '@mui/material'
import TabHeader from '@/pages/tab-header'
import CurrentTime from '@/pages/current-time'

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
