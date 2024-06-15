'use client'
import React from 'react'
import { signIn } from '@app/auth'

export async function SignInForm() {
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn('google')
  }

  return (
    <form onSubmit={handleSignIn}>
      <button type="submit">Sign in with Google</button>
    </form>
  )
}
