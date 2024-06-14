'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Button, Stack } from '@mui/material'

export default function AuthButtons() {
  const { data: session, status } = useSession()

  return (
    <Stack spacing={2} alignItems="center">
      Broken
      {!session && (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => signIn('google')}
          >
            Sign in with Google
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => signIn('facebook')}
          >
            Sign in with Facebook
          </Button>
        </>
      )}
      {session && status === 'authenticated' && (
        <>
          <p>Welcome, {session.user?.name}</p>
          <Button variant="contained" color="primary" onClick={() => signOut()}>
            Sign out
          </Button>
        </>
      )}
    </Stack>
  )
}
