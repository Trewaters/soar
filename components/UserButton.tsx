import React from 'react'
import { Button } from '@mui/material'
import { signIn, signOut } from 'auth'

export default function UserButton({
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
      <Button {...props}>Sign In</Button>
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
      <Button {...props}>Sign Out</Button>
    </form>
  )
}
