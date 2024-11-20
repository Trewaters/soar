import React from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import Header from '@serverComponents/header'
import Image from 'next/image'
import { signIn, providerMap, signOut } from '@auth'

export default async function SignInPage(props: {
  searchParams: { callbackUrl: string | undefined }
}) {
  return (
    <>
      <nav>
        <Header />
      </nav>
      <Stack display={'flex'} alignItems={'center'}>
        <Stack flexDirection={'row'}>
          <Typography variant={'h1'}>SOAR</Typography>
          <Image
            src={'/icons/asanas/leaf-1.svg'}
            alt={'SOAR logo'}
            width={100}
            height={100}
          />
        </Stack>
        <Stack>
          <Typography variant={'subtitle1'}>A Happy Yoga App</Typography>
        </Stack>
      </Stack>
      <Stack justifyContent={'center'} alignItems={'center'} display={'flex'}>
        <Stack
          textAlign={'center'}
          spacing={2}
          sx={{
            my: 6,
            border: '1px solid black',
            width: '50%',
            borderRadius: '12px',
          }}
        >
          <Box
            sx={{ pt: 4, pl: 4 }}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'flex-start'}
          >
            <Typography variant="h2">Welcome back 👋🏾</Typography>
            <Typography variant="body1" component="p">
              We&apos;re happy you&apos;re here!
            </Typography>
          </Box>
          {/* 
           <Box
              sx={{ pt: 4, pl: 4 }}
              display={'flex'}
              flexDirection={'column'}
              alignItems={'flex-start'}
            >
              <Typography variant="h2">Welcome back 👋🏾</Typography>
              <Typography variant="body1" component="p">
                We&apos;re happy you&apos;re here!
              </Typography>
            </Box>
          */}

          <Stack
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            sx={{ mt: 4 }}
          >
            <form
              action={async (formData) => {
                'use server'
                // eslint-disable-next-line no-useless-catch
                try {
                  await signIn('credentials', formData)
                } catch (error) {
                  // if (error instanceof AuthError) {
                  //   return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
                  // }
                  throw error
                }
              }}
            >
              <Stack display={'flex'} alignItems={'flex-start'}>
                <Stack>
                  <label htmlFor="email">
                    Email
                    <input name="email" id="email" />
                  </label>
                </Stack>
                <Stack>
                  <label htmlFor="password">
                    Password
                    <input name="password" id="password" />
                  </label>
                </Stack>
              </Stack>
              <input type="submit" value="Sign In" />
            </form>
            {Object.values(providerMap).map((provider, index) => (
              <form
                key={index}
                action={async () => {
                  'use server'
                  // eslint-disable-next-line no-useless-catch
                  try {
                    // await signIn(provider.id, {
                    //   redirectTo: props.searchParams?.callbackUrl ?? '',
                    // })
                    await signIn(provider.id, {
                      redirectTo: '/navigator/profile',
                    })
                  } catch (error) {
                    // Signin can fail for a number of reasons, such as the user
                    // not existing, or the user not having the correct role.
                    // In some cases, you may want to redirect to a custom error
                    // if (error instanceof AuthError) {
                    //   return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
                    // }

                    // Otherwise if a redirects happens Next.js can handle it
                    // so you can just re-thrown the error and let Next.js handle it.
                    // Docs:
                    // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                    throw error
                  }
                }}
              >
                <Button type="submit" variant="contained" sx={{ my: 2 }}>
                  <span>Sign in with {provider.name}</span>
                </Button>
              </form>
            ))}
          </Stack>
          <Stack>
            <Typography variant="subtitle1">sign in again 🔓</Typography>
            <Typography variant="body1">
              Don&apos;t have an account yet❔
            </Typography>
            <Typography variant="body1">
              Signing in will automatically create an account for you.
            </Typography>
          </Stack>
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/navigator' })
            }}
          >
            <Button variant="contained" type="submit">
              Sign out
            </Button>
          </form>
        </Stack>
      </Stack>
    </>
  )
}
