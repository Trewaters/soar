'use client'

import React from 'react'
import CurrentTime from '@app/clientComponents/current-time'
import { Box, Divider, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import AsanaActivityList from '@app/clientComponents/AsanaActivityList'
import ActivityStreaks from '@app/clientComponents/activityStreaks/ActivityStreaks'
import LandingPage from '@app/clientComponents/landing-page'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Page() {
  const { data: session } = useSession()
  return (
    <Stack>
      <Box
        textAlign="center"
        sx={{ marginTop: 4 }}
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
          sx={{ mx: 'auto', width: '10%' }}
        />
        <Typography variant="body1" fontWeight="600" sx={{ mt: 4, mb: 1 }}>
          Start your practice
        </Typography>
        <LandingPage />
      </Box>
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
        <Box sx={{ mt: 4 }}>
          <AsanaActivityList />
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" fontWeight="600" sx={{ mt: 4, mb: 1 }}>
            Learn about Yoga
          </Typography>
          <Typography
            variant="body1"
            color="primary.main"
            sx={{ mb: 1, display: 'flex', flexDirection: 'column', gap: 1 }}
          >
            <Link href="/eight-limbs" passHref>
              Eight Limbs
            </Link>
            <Link href="/glossary" passHref>
              Glossary
            </Link>
          </Typography>
        </Box>
      </Box>
    </Stack>
  )
}
