'use client'

import React from 'react'
import CurrentTime from '@app/clientComponents/current-time'
import TabHeader from '@app/clientComponents/tab-header'
import { Box, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import AsanaActivityList from '@app/clientComponents/AsanaActivityList'
import ActivityStreaks from '@app/clientComponents/activityStreaks/ActivityStreaks'
import LandingPage from '@app/clientComponents/landing-page'

export default function Page() {
  return (
    <Stack>
      <Box
        textAlign="center"
        sx={{ marginTop: 4 }}
        role="main"
        aria-labelledby="page-title"
      >
        <Image
          src={'/images/primary/Home-page-yogi.png'}
          width={207}
          height={207}
          quality={100}
          alt="Illustration of a person practicing yoga"
        />
        <CurrentTime />
        <ActivityStreaks variant="compact" />
        <Typography variant="body1" fontWeight="600" sx={{ mt: 4, mb: 1 }}>
          Start your practice
        </Typography>
        <LandingPage />
      </Box>
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
        <Box sx={{ mt: 4 }}>
          <AsanaActivityList />
        </Box>
      </Box>
    </Stack>
  )
}
