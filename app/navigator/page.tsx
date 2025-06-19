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
          width: '50%',
          justifyContent: 'center',
          mx: 'auto',
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
          sx={{ mx: 'auto', width: '10%' }}
        />
        <Typography variant="body1" fontWeight="600" sx={{ mt: 4, mb: 1 }}>
          Start your practice
        </Typography>
        <Stack>
          <LandingPage />
        </Stack>
        <Stack sx={{ mt: 4 }}>
          <AsanaActivityList />
        </Stack>
        <Stack>
          <Typography
            variant="body1"
            fontWeight="600"
            sx={{ mt: 4, mb: 1, textAlign: 'center' }}
            id="learn-section-title"
          >
            Learn about Yoga
          </Typography>
          <nav aria-labelledby="learn-section-title">
            <Stack spacing={1} sx={{ mt: 2 }}>
              {learnLinks.map((link) => (
                <Link href={link.href} key={link.name} passHref>
                  <Button
                    variant="outlined"
                    aria-label={`Navigate to ${link.name} section`}
                    sx={{
                      width: '100%',
                      mb: 1,
                      borderRadius: '14px',
                      boxShadow: '0px 4px 4px -1px rgba(0, 0, 0, 0.25)',
                      textTransform: 'uppercase',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        transform: 'translateY(-1px)',
                        boxShadow: '0px 6px 8px -1px rgba(0, 0, 0, 0.25)',
                      },
                      '&:focus': {
                        outline: '2px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: '2px',
                      },
                      // Improve focus visibility
                      '&:focus-visible': {
                        outline: '3px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: '2px',
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      component="span"
                      sx={{
                        fontWeight: 'medium',
                        fontSize: '0.875rem',
                        lineHeight: 1.4,
                        // Remove overflow restrictions to prevent text cutoff
                        wordWrap: 'break-word',
                        hyphens: 'auto',
                        textAlign: 'center',
                      }}
                    >
                      {link.name}
                    </Typography>
                  </Button>
                </Link>
              ))}
            </Stack>
          </nav>
        </Stack>
      </Box>
    </Stack>
  )
}
