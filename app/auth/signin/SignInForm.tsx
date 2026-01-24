'use client'
import React, { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import CredentialsInput from './credentialsInput'
import OAuthButtons from './OAuthButtons'

interface SignInFormProps {
  providers: Array<{ id: string; name: string }>
  callbackUrl?: string
}

const SignInForm: React.FC<SignInFormProps> = ({ providers, callbackUrl }) => {
  const [providerType, setProviderType] = useState<string | null>(null)

  return (
    <Stack alignItems={'center'} spacing={2}>
      <Typography variant="h2">Welcome back.</Typography>
      <Typography variant="body1">
        We&apos;re happy you&apos;re here!
      </Typography>

      <OAuthButtons
        providers={providers}
        highlightProvider={providerType}
        callbackUrl={callbackUrl}
      />

      <CredentialsInput onProviderTypeChange={setProviderType} />
    </Stack>
  )
}

export default SignInForm
