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
          <Typography
            variant="body1"
            fontWeight="600"
            sx={{ mt: 4, mb: 1, textAlign: 'center' }}
          >
            Learn about Yoga
          </Typography>
          <Stack spacing={1} sx={{ mt: 2 }}>
            {learnLinks.map((link) => (
              <Link href={link.href} key={link.name} passHref>
                <Button
                  variant="outlined"
                  sx={{
                    width: '100%',
                    mb: 1,
                    borderRadius: '14px',
                    boxShadow: '0px 4px 4px -1px',
                    textTransform: 'uppercase',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  <Typography variant="body1">{link.name}</Typography>
                </Button>
              </Link>
            ))}
          </Stack>
        </Box>
      </Box>
    </Stack>
  )
}
