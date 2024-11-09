import React from 'react'
import { Button, Stack } from '@mui/material'
import { signIn, signOut } from '@auth'

export default async function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Stack textAlign={'center'} spacing={2} sx={{ my: 6 }}>
      <form
        action={async () => {
          'use server'
          await signIn(provider)
        }}
      >
        <Button type="submit" variant="contained" {...props}>
          Sign In
        </Button>
      </form>
    </Stack>
  )
}

export async function SignOut(
  props: React.ComponentPropsWithRef<typeof Button>
) {
  return (
    <form
      action={async () => {
        'use server'
        await signOut()
      }}
    >
      <Button type="submit" variant="contained" {...props}>
        Sign Out
      </Button>
    </form>
  )
}
