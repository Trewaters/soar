'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { signIn } from 'next-auth/react'

export type Provider = {
  id: string
  name: string
}

export default function SignupProviders({
  providers,
}: {
  providers: Provider[]
}) {
  const [accepted, setAccepted] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const onSignIn = async (providerId: string) => {
    if (!accepted) return
    setLoadingProvider(providerId)
    try {
      await signIn(providerId, { callbackUrl: '/profile' })
    } catch (e) {
      // ignore - NextAuth will handle redirects/errors
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
        }
        label={
          <Typography variant="body2">
            I agree to the <a href="/compliance/terms">Terms of Service</a>
          </Typography>
        }
      />

      <Stack display={'flex'} alignItems={'center'} justifyContent={'center'}>
        {providers.map((provider) => (
          <Button
            key={provider.id}
            variant="outlined"
            sx={{ my: 2, borderRadius: '12px' }}
            startIcon={
              <Image
                src={
                  provider.name.toLowerCase() === 'google'
                    ? '/icons/profile/auth-google.svg'
                    : '/icons/profile/auth-github-mark.svg'
                }
                alt={provider.name}
                width={20}
                height={20}
              />
            }
            onClick={() => onSignIn(provider.id)}
            disabled={!accepted || Boolean(loadingProvider)}
          >
            <Typography>Sign in with {provider.name}</Typography>
          </Button>
        ))}
      </Stack>
    </div>
  )
}
