'use client'
import React, { useEffect, useState } from 'react'
import { Box, Stack, TextField, Button, Typography } from '@mui/material'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AppText } from '@app/navigator/constants/Strings'

const CredentialsInput: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const [isNewUser, setIsNewUser] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkEmailExists = async (email: string) => {
    if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setIsNewUser(false)
      return
    }

    try {
      const response = await fetch(
        `/api/user/fetchAccount?email=${encodeURIComponent(email)}`
      )

      if (!response.ok) {
        console.error(
          'Failed to check email:',
          response.status,
          response.statusText
        )
        setIsNewUser(false)
        return
      }

      const user = await response.json()

      if (user.error) {
        setIsNewUser(true) // Email doesn't exist, so it's a new user
      } else {
        setIsNewUser(false) // Email exists
      }
    } catch (error) {
      console.error('Error checking email:', error)
      setIsNewUser(false)
    }
  }

  useEffect(() => {
    checkEmailExists(email)
  }, [email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let result

      if (isNewUser) {
        // For new users, we need to create an account
        result = await signIn('credentials', {
          redirect: false,
          email,
          password,
          isNewAccount: 'true', // Flag to indicate account creation
        })
      } else {
        // For existing users, normal sign in
        result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        })
      }

      if (result?.error) {
        console.error('Sign in error:', result.error)

        // Handle specific error cases
        if (result.error === 'CredentialsSignin') {
          if (isNewUser) {
            setError('Failed to create account. Please try again.')
          } else {
            setError('Invalid email or password.')
          }
        } else if (result.error === 'AccessDenied') {
          setError('Access denied. Please check your credentials.')
        } else if (result.error === 'Configuration') {
          setError('Configuration error. Please contact support.')
        } else {
          setError(`Authentication failed: ${result.error}`)
        }
      } else if (result?.ok) {
        // Success - redirect to navigator
        router.push('/navigator')
      } else {
        setError('Authentication failed. Please try again.')
      }
    } catch (error) {
      console.error('An unexpected error happened:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      component={'form'}
      noValidate
      autoComplete={'off'}
      onSubmit={handleSubmit}
      my={3}
    >
      <Stack spacing={2}>
        <TextField
          onChange={async (e) => {
            const email = e.target.value
            setEmail(email)
          }}
          value={email}
          label="Email"
          type="email"
          autoComplete="email"
          error={
            email.length > 0 &&
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
          }
          helperText={
            email.length > 0 &&
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
              ? 'Please enter a valid email address'
              : isNewUser && email.length > 0
                ? AppText.APP_EMAIL_AVAILABLE
                : ''
          }
        />

        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          value={password}
          autoComplete={isNewUser ? 'new-password' : 'current-password'}
          onChange={(e) => setPassword(e.target.value)}
          error={password.length > 0 && password.length < 6}
          helperText={
            password.length > 0 && password.length < 6
              ? 'Password must be at least 6 characters'
              : isNewUser && password.length === 0
                ? AppText.APP_CHOOSE_PASSWORD
                : ''
          }
        />

        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        {isNewUser ? (
          <>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !email || !password || password.length < 6}
              sx={{ py: 1.5, fontSize: '16px' }}
            >
              {loading ? 'Creating Account...' : '🚀 Create New Account'}
            </Button>
            <Typography
              variant="body2"
              color="success.main"
              sx={{ mt: 1, textAlign: 'center', fontWeight: 'medium' }}
            >
              ✨ This email is available! Create your account to get started.
            </Typography>
          </>
        ) : (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !email || !password}
            sx={{ py: 1.5, fontSize: '16px' }}
          >
            {loading ? 'Signing In...' : '🔐 Sign In'}
          </Button>
        )}
        <Button
          variant="text"
          color="secondary"
          onClick={() => router.push('/auth/passwordRecovery')}
        >
          Forgot Password?
        </Button>

        {/* Manual toggle for creating account */}
        {!isNewUser && email && (
          <Button
            variant="text"
            color="primary"
            onClick={() => {
              setIsNewUser(true)
              setError(null)
            }}
            sx={{ mt: 1 }}
          >
            Don&apos;t have an account? Create one here
          </Button>
        )}
      </Stack>
    </Box>
  )
}

export default CredentialsInput
