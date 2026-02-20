'use client'
import React, { useState } from 'react'
import { Button, Stack, Typography } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CredentialsInput from './credentialsInput'
import OAuthButtons from './OAuthButtons'

export interface SignInFormProps {
  providers: Array<{ id: string; name: string }>
  callbackUrl?: string
}

const SignInForm: React.FC<SignInFormProps> = ({ providers, callbackUrl }) => {
  const [providerType, setProviderType] = useState<string | null>(null)
  const [isCreateMode, setIsCreateMode] = useState(false)

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

      <CredentialsInput
        onProviderTypeChange={setProviderType}
        createMode={isCreateMode}
        onCreateModeChange={setIsCreateMode}
      />

      {!isCreateMode && (
        <Stack spacing={1} alignItems={'center'}>
          <Typography variant="body1">
            Don&apos;t have an account yet?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ✨ Use any method to login the first time and a new account will be
            created for you!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Accept the terms of service when prompted and you&apos;ll be good to
            go.
          </Typography>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => setIsCreateMode(true)}
            sx={{ mt: 1, py: 1.5, fontSize: '16px', fontWeight: 'bold' }}
          >
            Create an account
          </Button>
        </Stack>
      )}
    </Stack>
  )
}

export default SignInForm
