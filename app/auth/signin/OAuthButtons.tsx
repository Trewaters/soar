'use client'
import React from 'react'
import { Button, Paper, Typography, keyframes } from '@mui/material'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(246, 137, 61, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(246, 137, 61, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(246, 137, 61, 0);
  }
`

export interface OAuthButtonsProps {
  providers: Array<{ id: string; name: string }>
  highlightProvider?: string | null
  callbackUrl?: string
}

const OAuthButtons: React.FC<OAuthButtonsProps> = ({
  providers,
  highlightProvider,
  callbackUrl = '/navigator',
}) => {
  const router = useRouter()

  const handleOAuthSignIn = async (providerId: string) => {
    try {
      await signIn(providerId, {
        redirectTo: callbackUrl,
      })
    } catch (error) {
      console.error(`Error signing in with ${providerId}:`, error)
      if (
        error &&
        typeof error === 'object' &&
        'type' in error &&
        process.env.SIGNIN_ERROR_URL
      ) {
        router.push(`${process.env.SIGNIN_ERROR_URL}?error=${error.type}`)
      }
    }
  }

  return (
    <>
      {providers.map((provider) => {
        const isHighlighted =
          highlightProvider?.toLowerCase() === provider.id.toLowerCase()

        return (
          <Paper
            key={provider.id}
            elevation={0}
            sx={{
              backgroundColor: 'transparent',
              ...(isHighlighted && {
                animation: `${pulse} 2s infinite`,
              }),
            }}
          >
            <Button
              onClick={() => handleOAuthSignIn(provider.id)}
              variant="outlined"
              sx={{
                m: 2,
                borderRadius: '12px',
                ...(isHighlighted && {
                  border: '2px solid',
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(246, 137, 61, 0.05)',
                  '&:hover': {
                    backgroundColor: 'rgba(246, 137, 61, 0.1)',
                    borderColor: 'primary.dark',
                  },
                }),
              }}
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
            >
              <Typography>
                Sign in with {provider.name}
                {isHighlighted && ' ← Try this!'}
              </Typography>
            </Button>
          </Paper>
        )
      })}
    </>
  )
}

export default OAuthButtons
