import React from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
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
      <Stack justifyContent={'center'} alignItems={'center'} display={'flex'}>
        <Stack
          textAlign={'center'}
          spacing={2}
          sx={{
            my: 6,
            border: '1px solid black',
            width: '50%',
            borderRadius: '12px',
            pb: 3,
          }}
        >
          <Box
            sx={{ pt: 4 }}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
          >
            {session ? (
              <>
                <Typography
                  alignSelf={'center'}
                  variant="h2"
                  color="success.main"
                >
                  You&apos;re signed in!
                </Typography>
                <Typography alignSelf={'center'} variant="body1">
                  <Link href="/">Click here</Link>
                  &nbsp;to go to the home page.
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h2">Welcome back!</Typography>
                <Typography variant="body1" component="p">
                  We&apos;re happy you&apos;re here!
                </Typography>
              </>
            )}
          </Box>

          <Stack
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            sx={{ mt: 4 }}
          >
            {Object.values(providerMap).map((provider, index) => (
              <form
                key={index}
                action={async () => {
                  'use server'
                  // eslint-disable-next-line no-useless-catch
                  try {
                    await signIn(provider.id, {
                      redirectTo:
                        props.searchParams?.callbackUrl ?? '/navigator',
                    })
                    // await signIn(provider.id, {
                    // redirectTo: '/navigator/profile',
                    // })
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
              </form>
            ))}
            <CredentialsInput />
          </Stack>
          <Stack display={'flex'} textAlign={'center'} sx={{ pb: 2 }}>
            {!session && (
              <>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Sign In or Create Account
                </Typography>
                <Typography variant="body1">
                  Don&apos;t have an account yet?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ✨ Just enter your email below - if it&apos;s new, we&apos;ll
                  help you create an account!
                </Typography>
              </>
            )}
          </Stack>
          {session && (
            <form
              action={async () => {
                'use server'
                await signOut({ redirect: true, redirectTo: '/auth/signout' })
              }}
            >
              <Button
                variant="contained"
                type="submit"
                sx={{ width: '50%', alignSelf: 'center' }}
              >
                Sign out
              </Button>
            </form>
          )}
        </Stack>
      </Stack>
    </>
  )
}
