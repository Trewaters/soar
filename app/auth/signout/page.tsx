import React from 'react'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import Header from '@serverComponents/header'
import Link from 'next/link'
import { signOut, auth } from '../../../auth'

export default async function SignOutPage(props: {
  searchParams: { success?: string }
}) {
  // Check if user is signed in
  const session = await auth()
  const { searchParams } = props

  // If user is signed in, redirect to signout with proper form action
  if (session) {
    return (
      <>
        <nav>
          <Header />
        </nav>
        <Stack justifyContent={'center'} alignItems={'center'}>
          <Stack
            textAlign={'center'}
            spacing={2}
            sx={{
              my: 6,
              pb: 3,
              px: 1,
              border: '1px solid black',
              width: '50%',
              borderRadius: '12px',
            }}
          >
            <Stack spacing={1} sx={{ pt: 4, pb: 2 }}>
              <Typography variant="h2">Signing you out...</Typography>
              <Typography variant="body1">
                Please wait while we sign you out.
              </Typography>
            </Stack>
            <Stack
              component="form"
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/auth/signout?success=true' })
              }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{ borderRadius: '12px' }}
              >
                <Typography>Complete Sign Out</Typography>
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </>
    )
  }

  return (
    <>
      <nav>
        <Header />
      </nav>
      <Stack justifyContent={'center'} alignItems={'center'}>
        <Stack
          textAlign={'center'}
          spacing={2}
          sx={{
            my: 6,
            pb: 3,
            px: 1,
            border: '1px solid black',
            width: '50%',
            borderRadius: '12px',
          }}
        >
          <Stack spacing={1} sx={{ pt: 4, pb: 2 }}>
            <Typography color="success.main" variant="h2">
              {searchParams?.success ? "You're signed out!" : 'Oops...'}
            </Typography>
            <Typography variant="body1">
              {searchParams?.success
                ? 'We hope to see you continue your yoga journey!'
                : 'You are still signed in!'}
            </Typography>
          </Stack>
          <Link href="/" passHref>
            <Button
              type="button"
              variant="outlined"
              sx={{ borderRadius: '12px' }}
            >
              <Typography>Go back to the home page</Typography>
            </Button>
          </Link>
          <Link href="/auth/signin" passHref>
            <Button
              type="button"
              variant="outlined"
              sx={{ borderRadius: '12px' }}
            >
              <Typography>Sign in again!</Typography>
            </Button>
          </Link>
        </Stack>
      </Stack>
    </>
  )
}
