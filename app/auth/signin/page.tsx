import React from 'react'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import Header from '@serverComponents/header'
import Image from 'next/image'
import { signIn, providerMap, signOut, auth } from '../../../auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CredentialsInput from './credentialsInput'

export default async function SignInPage(props: {
  searchParams: { callbackUrl: string | undefined }
}) {
  const session = await auth()
  return (
    <>
      <nav>
        <Header />
      </nav>
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
          <Stack spacing={1} alignItems={'center'}>
            {session ? (
              <>
                <Typography variant="h2" color="success.main">
                  You&apos;re signed in!
                </Typography>
                <Typography variant="body1">
                  <Link href="/">Click here</Link>
                  &nbsp;to go to the home page.
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h2">Welcome back.</Typography>
                <Typography variant="body1">
                  We&apos;re happy you&apos;re here!
                </Typography>
              </>
            )}
          </Stack>

          <Stack alignItems={'center'} spacing={2}>
            {Object.values(providerMap).map((provider, index) => (
              <Paper
                key={index}
                component="form"
                action={async () => {
                  'use server'
                  // eslint-disable-next-line no-useless-catch
                  try {
                    await signIn(provider.id, {
                      redirectTo:
                        props.searchParams?.callbackUrl ?? '/navigator',
                    })
                  } catch (error) {
                    // Signin can fail for a number of reasons, such as the user
                    // not existing, or the user not having the correct role.
                    // In some cases, you may want to redirect to a custom error
                    if (error && typeof error === 'object' && 'type' in error) {
                      return redirect(
                        `${process.env.SIGNIN_ERROR_URL}?error=${error.type}`
                      )
                    }

                    // Otherwise if a redirects happens Next.js can handle it
                    // so you can just re-thrown the error and let Next.js handle it.
                    // Docs:
                    // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                    throw error
                  }
                }}
                elevation={0}
                sx={{ backgroundColor: 'transparent' }}
              >
                <Button
                  type="submit"
                  variant="outlined"
                  sx={{ m: 2, borderRadius: '12px' }}
                  startIcon={
                    <Image
                      src={
                        provider.name.toLowerCase() === 'google'
                          ? '/icons/profile/auth-google.svg'
                          : '/icons/profile/auth-github-mark.svg'
                      }
                      alt={provider.name}
                      width={20}
                      height={20}
                    />
                  }
                >
                  <Typography>Sign in with {provider.name}</Typography>
                </Button>
              </Paper>
            ))}
            <CredentialsInput />
          </Stack>
          <Stack alignItems={'center'} sx={{ mt: 'auto' }}>
            {!session && (
              <Stack spacing={1}>
                <Typography variant="body1">
                  Don&apos;t have an account yet?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ✨ Just enter your email below - if it&apos;s new, we&apos;ll
                  help you create an account!
                </Typography>
              </Stack>
            )}
          </Stack>
          {session && (
            <Paper
              component="form"
              action={async () => {
                'use server'
                await signOut({ redirect: true, redirectTo: '/auth/signout' })
              }}
              elevation={0}
              sx={{ backgroundColor: 'transparent' }}
            >
              <Button variant="contained" type="submit" sx={{ width: '200px' }}>
                Sign out
              </Button>
            </Paper>
          )}
        </Stack>
      </Stack>
    </>
  )
}
