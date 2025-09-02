'use client'

import React from 'react'
import CurrentTime from '@app/clientComponents/current-time'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import AsanaActivityList from '@app/clientComponents/AsanaActivityList'
import ActivityStreaks from '@app/clientComponents/activityStreaks/ActivityStreaks'
import LandingPage from '@app/clientComponents/landing-page'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Page() {
  const { data: session } = useSession()

  const learnLinks = [
    {
      name: 'Eight Limbs',
      href: 'navigator/eightLimbs',
    },
    {
      name: 'Glossary',
      href: 'navigator/glossary',
    },
  ]

  return (
    <Stack>
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
        <Typography
          variant="body1"
          color="primary.main"
          id="page-title"
          sx={{ fontWeight: 600, mb: 2, ml: 4, textAlign: 'start' }}
        >
          Welcome {session?.user?.name || 'Yogi'}
        </Typography>
        <Image
          src={'/images/primary/Home-page-yogi.png'}
          width={207}
          height={207}
          quality={100}
          alt="Illustration of a person practicing yoga"
        />
        <CurrentTime />
        <ActivityStreaks variant="compact" />
        <Divider
          color="#F6893D"
          textAlign="center"
          sx={{ marginLeft: 'auto', marginRight: 'auto', width: '10%' }}
        />
        <Typography
          variant="body1"
          fontWeight="600"
          sx={{
            mt: 4,
            // , mb: 1
          }}
        >
          Build Your Practice:
        </Typography>
        <Typography
          variant="body2"
          // fontWeight="600"
          fontStyle={'italic'}
          sx={{
            // mt: 4,
            mb: 2,
          }}
        >
          &quot;From Single Asana to Full Sequences&quot;
        </Typography>
        <Stack>
          <LandingPage />
        </Stack>
        <Stack sx={{ mt: 4 }}>
          <Typography
            variant="body1"
            fontWeight="600"
            sx={{ mt: 4, mb: 1, width: '80vw' }}
          >
            Your Recent Activity
          </Typography>
          <AsanaActivityList />
        </Stack>
      </Box>
    </Stack>
  )
}
