'use client'
import { Typography } from '@mui/material'
import { SignInForm } from './SignInForm'
import { useFormState } from 'react-dom'

export default function LoginPage() {
  return (
    <>
      <Typography variant="h6">Google Sign In</Typography>
      <SignInForm />
      {/* 
        https://github.com/youngjun625/nextauth14-nextauthv5/blob/(3)-GoogleSignIn/src/lib/actions.ts
         */}
    </>
  )
}
