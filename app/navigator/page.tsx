'use client'

import React from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import AsanaActivityList from '@app/clientComponents/AsanaActivityList'
import ActivityStreaks from '@app/clientComponents/activityStreaks/ActivityStreaks'
import LandingPage from '@app/clientComponents/landing-page'
import { UseUser } from '@app/context/UserContext'

export default function Page() {
  const { state } = UseUser()

  return (
    <Stack>
      <Typography
        variant="h1"
        color="text.secondary"
        id="page-title"
        sx={{
          my: 2,
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          maxWidth: '100%',
        }}
        alignSelf={'center'}
      >
        {(() => {
          const first = state?.userData?.firstName || ''
          const last = state?.userData?.lastName || ''
          const combined = `${first} ${last}`.trim()
          return `Welcome ${combined || 'Yogi'}`
        })()}
      </Typography>
      <Box
        textAlign="center"
        sx={{
          marginTop: 4,
          width: { xs: '100%', sm: 'auto', md: '60%' },
          justifyContent: 'center',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
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
        <ActivityStreaks variant="compact" />
        <Divider
          color="primary.main"
          textAlign="center"
          sx={{ marginLeft: 'auto', marginRight: 'auto', width: '10%', mb: 6 }}
        />
        <Stack>
          <Typography variant="subtitle1" color="success.main">
            Build Your Practice:
          </Typography>
          <Typography variant="body2" fontStyle={'italic'} sx={{ mb: 4 }}>
            &quot;From a Single Asana to Full Sequences&quot;
          </Typography>
          <LandingPage />
        </Stack>
        <Divider
          color="primary.main"
          textAlign="center"
          sx={{ marginLeft: 'auto', marginRight: 'auto', width: '10%', my: 6 }}
        />
        <Stack>
          <Typography
            variant="subtitle1"
            color="success.main"
            sx={{ width: '80vw' }}
          >
            View Your Activity:
          </Typography>
          <Typography variant="body2" fontStyle={'italic'} sx={{ mb: 4 }}>
            &quot;Marked <strong>complete</strong> during practice&quot;
          </Typography>
          <AsanaActivityList />
        </Stack>
      </Box>
    </Stack>
  )
}
