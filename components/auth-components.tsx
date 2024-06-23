import React from 'react'
import { Button } from '@mui/material'
import { signIn, signOut } from 'auth'

export default function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
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
  )
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
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
