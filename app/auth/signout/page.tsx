import { auth, signIn, signOut } from '@auth'
import { Box, Button, Link, Stack, Typography } from '@mui/material'
import Header from '@serverComponents/header'
import Image from 'next/image'
import React, { useEffect } from 'react'

export default async function SignOutPage({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  const session = await auth()

  useEffect(() => {
    signOut()
  }, [])

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
          <Box sx={{ pt: 4, pb: 3 }}>
            <Typography variant="h2">
              {session?.user.name} you&apos;re signed in 🔆
            </Typography>
            <Typography variant="body1">
              If you don&apos;t get redirected. Click{' '}
              <Link href="http://localhost:3000/navigator">here</Link> to go to
              the home page.
            </Typography>
          </Box>
        </Stack>
        <Stack textAlign={'center'} spacing={2} sx={{ my: 6 }}>
          <form
            action={async () => {
              await signIn(provider)
            }}
          >
            <Button type="submit" variant="contained" {...props}>
              Sign In
            </Button>
          </form>
        </Stack>
      </Stack>
    </>
  )
}
