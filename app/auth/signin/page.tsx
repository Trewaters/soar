import React from 'react'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { signOut, auth, providerMap } from '../../../auth'
import { Link as MuiLink } from '@mui/material'
import Link from 'next/link'
import SignInForm from './SignInForm'

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const session = await auth()
  const resolvedSearchParams = (await searchParams) ?? {}
  return (
    <>
      <Stack justifyContent={'center'} alignItems={'center'} minHeight={'80vh'}>
        <Stack
          spacing={3}
          sx={{
            mt: 6,
            borderTop: '1px solid black',
            borderLeft: '1px solid black',
            borderRight: '1px solid black',
            width: '90%',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            p: 4,
            minHeight: 'calc(100vh - 120px)',
            justifyContent: 'space-between',
          }}
        >
          <Stack spacing={3} alignItems={'center'}>
            {session ? (
              <>
                <Typography variant="h2" color="success.main">
                  You&apos;re signed in!
                </Typography>
                <Typography variant="body1">
                  <MuiLink component={Link} href="/">
                    Click here
                  </MuiLink>
                  &nbsp;to go to the home page.
                </Typography>
                <Paper
                  component="form"
                  action={async () => {
                    'use server'
                    await signOut({
                      redirect: true,
                      redirectTo: '/auth/signout',
                    })
                  }}
                  elevation={0}
                  sx={{ backgroundColor: 'transparent' }}
                >
                  <Button
                    variant="outlined"
                    type="submit"
                    sx={{ width: 'auto' }}
                  >
                    Sign out
                  </Button>
                </Paper>
              </>
            ) : (
              <SignInForm
                providers={Object.values(providerMap)}
                callbackUrl={resolvedSearchParams.callbackUrl ?? '/'}
              />
            )}
          </Stack>
        </Stack>
      </Stack>
    </>
  )
}
