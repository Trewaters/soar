import React from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import Header from '@serverComponents/header'
import Image from 'next/image'
import { signIn, providerMap, auth } from '../../../auth'

export default async function SignUpPage() {
  const session = await auth()
  return (
    <>
      <nav>
        <Header />
      </nav>
      <Stack flexDirection={'row'} justifySelf={'center'} alignItems={'center'}>
        <Stack>
          <Typography variant={'subtitle1'}>An Uvuyoga App</Typography>
        </Stack>
        <Stack>
          <Image
            src={'/icons/asanas/leaf-1.svg'}
            alt={'SOAR logo'}
            width={100}
            height={100}
          />
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
          {/* 
          // ! add credentials once it is correctly set up
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
 */}
          <Box
            sx={{ pt: 4, pl: 4 }}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'flex-start'}
          >
            {!session && (
              <>
                <Typography variant="h2">Welcome!</Typography>
                <Typography variant="body1" component="p">
                  We&apos;re happy you&apos;re decided to join us.
                </Typography>
                <Typography variant="body1">
                  Signing in will automatically create an account for you.
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
            {!session && (
              // Client component enforces TOS acceptance before sign-in
              // @ts-ignore - providerMap is serializable
              <SignupProviders providers={Object.values(providerMap)} />
            )}
          </Stack>
        </Stack>
      </Stack>
    </>
  )
}
