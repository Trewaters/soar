import { Box, Stack, Typography } from '@mui/material'
import Header from '@serverComponents/header'
import Image from 'next/image'
import React from 'react'

export default function SignIn() {
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
          {/* <Stack>
            <SignIn />
          </Stack> */}
          <Stack>
            <Typography variant="subtitle1">sign in again 🔓</Typography>
            <Typography variant="body1">
              Don&apos;t have an account yet❔
            </Typography>
            <Typography variant="body1">
              Signing in will automatically create an account for you.
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </>
  )
}
