'use client'
import React, { useEffect, useState } from 'react'
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Alert,
  AlertTitle,
  Link as MuiLink,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@mui/material'
import { signIn } from 'next-auth/react'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import { AppText } from '@app/navigator/constants/Strings'
import { AuthErrorCode } from '@app/auth/types'
import Link from 'next/link'

// Type for structured error objects
type AuthErrorType = {
  type: string
  message: string
  provider?: string
}

/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
export interface CredentialsInputProps {
  // Callback invoked with the provider type when email lookup completes
  // The callback receives the detected provider string or null when not found
  onProviderTypeChange?: (_provider: string | null) => void
  createMode?: boolean
  onCreateModeChange?: (_isCreateMode: boolean) => void
}
/* eslint-enable no-unused-vars, @typescript-eslint/no-unused-vars */

const CredentialsInput: React.FC<CredentialsInputProps> = ({
  onProviderTypeChange,
  createMode,
  onCreateModeChange,
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useNavigationWithLoading()
  const [isNewUser, setIsNewUser] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthErrorType | null>(null)
  const [providerType, setProviderType] = useState<string | null>(null)
  const [tosAccepted, setTosAccepted] = useState(false)
  const [tosVersionId, setTosVersionId] = useState<string | null>(null)
  const [tosUrl, setTosUrl] = useState('/compliance/terms')
  const [tosLoading, setTosLoading] = useState(false)

  useEffect(() => {
    if (typeof createMode === 'boolean') {
      setIsNewUser(createMode)
    }
  }, [createMode])

  const checkEmailExists = React.useCallback(
    async (emailParam: string) => {
      const email = emailParam
      if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
        setIsNewUser(false)
        setProviderType(null)
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
          setProviderType(null)
          return
        }

        const result = await response.json()

        if (result.data) {
          // User exists - store provider information
          setIsNewUser(false)
          setProviderType(result.data.provider)
          // Notify parent component of provider type change
          if (onProviderTypeChange) {
            onProviderTypeChange(result.data.provider)
          }
        } else {
          // Email doesn't exist, so it's a new user
          setIsNewUser(true)
          setProviderType(null)
          // Notify parent component of provider type change
          if (onProviderTypeChange) {
            onProviderTypeChange(null)
          }
        }
      } catch (error) {
        console.error('Error checking email:', error)
        setIsNewUser(false)
        setProviderType(null)
      }
    },
    [onProviderTypeChange]
  )

  useEffect(() => {
    checkEmailExists(email)
  }, [email, checkEmailExists])

  useEffect(() => {
    if (!isNewUser) {
      setTosAccepted(false)
      return
    }

    let mounted = true
    const loadActiveTos = async () => {
      setTosLoading(true)
      try {
        const response = await fetch('/api/tos')
        if (!response.ok) {
          throw new Error('Unable to load Terms of Service')
        }
        const data = await response.json()
        if (!mounted) return
        const activeVersionId =
          typeof data?.id === 'string' && data.id.length > 0 ? data.id : null
        setTosVersionId(activeVersionId)
        setTosUrl(
          activeVersionId
            ? `/compliance/terms?versionId=${encodeURIComponent(activeVersionId)}`
            : '/compliance/terms'
        )
      } catch (e) {
        console.error('Failed to fetch active Terms of Service:', e)
        if (!mounted) return
        setTosVersionId(null)
        setTosUrl('/compliance/terms')
      } finally {
        if (mounted) setTosLoading(false)
      }
    }

    loadActiveTos()

    return () => {
      mounted = false
    }
  }, [isNewUser])

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
          tosAccepted: tosAccepted ? 'true' : 'false',
          tosVersionId: tosVersionId || '',
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

        // Parse the error message to extract auth error codes
        const errorMessage = result.error

        // Check for auth error codes in the error message
        if (errorMessage.includes(AuthErrorCode.EMAIL_EXISTS_CREDENTIALS)) {
          setError({
            type: 'warning',
            message:
              'This email is already registered. Please sign in or use "Forgot Password" to reset your password.',
            provider: 'credentials',
          })
        } else if (errorMessage.includes(AuthErrorCode.EMAIL_EXISTS_OAUTH)) {
          // Extract provider name from error message
          const providerMatch = errorMessage.match(
            /(Google|GitHub|Facebook|Twitter)/i
          )
          const provider = providerMatch ? providerMatch[1] : 'social login'
          setError({
            type: 'warning',
            message: `This email is registered with ${provider}. Please sign in using the ${provider} button.`,
            provider: provider.toLowerCase(),
          })
        } else if (errorMessage.includes(AuthErrorCode.INVALID_PASSWORD)) {
          setError({
            type: 'error',
            message:
              'Invalid email or password. Please try again or use "Forgot Password" to reset your password.',
            provider: 'credentials',
          })
        } else if (errorMessage.includes(AuthErrorCode.NO_PASSWORD_SET)) {
          setError({
            type: 'warning',
            message:
              'No password is set for this account. Please use "Forgot Password" to set a password or use social login.',
            provider: providerType || undefined,
          })
        } else if (
          errorMessage.includes(AuthErrorCode.TOS_ACCEPTANCE_REQUIRED)
        ) {
          setError({
            type: 'error',
            message:
              'You must accept the current Terms of Service before creating your account.',
          })
        } else if (errorMessage.includes(AuthErrorCode.TOS_VERSION_MISMATCH)) {
          setError({
            type: 'error',
            message:
              'The Terms of Service were updated. Please review and accept the current version, then try again.',
          })
        } else if (
          errorMessage.includes(AuthErrorCode.TOS_VERSION_UNAVAILABLE)
        ) {
          setError({
            type: 'error',
            message:
              'Unable to load the current Terms of Service. Please try again shortly.',
          })
        } else if (errorMessage === 'CredentialsSignin') {
          // Generic credentials error
          if (isNewUser) {
            setError({
              type: 'error',
              message: 'Failed to create account. Please try again.',
            })
          } else {
            setError({
              type: 'error',
              message: 'Invalid email or password.',
            })
          }
        } else if (errorMessage === 'AccessDenied') {
          setError({
            type: 'error',
            message: 'Access denied. Please check your credentials.',
          })
        } else if (errorMessage === 'Configuration') {
          setError({
            type: 'error',
            message: 'Configuration error. Please contact support.',
          })
        } else {
          setError({
            type: 'error',
            message: `Authentication failed: ${errorMessage}`,
          })
        }
      } else if (result?.ok) {
        // Success - redirect to navigator
        router.push('/')
      } else {
        setError({
          type: 'error',
          message: 'Authentication failed. Please try again.',
        })
      }
    } catch (error) {
      console.error('An unexpected error happened:', error)
      setError({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.',
      })
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
          <Alert
            severity={error.type === 'warning' ? 'warning' : 'error'}
            sx={{ mb: 2 }}
          >
            <AlertTitle>
              {error.type === 'warning'
                ? 'Account Already Exists'
                : 'Sign In Failed'}
            </AlertTitle>
            {error.message}
            {error.provider === 'credentials' && (
              <>
                {' or '}
                <MuiLink
                  component={Link}
                  href={`/auth/passwordRecovery?email=${encodeURIComponent(email)}`}
                  sx={{ fontWeight: 'bold', textDecoration: 'underline' }}
                >
                  reset your password
                </MuiLink>
                .
              </>
            )}
          </Alert>
        )}

        {isNewUser ? (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={tosAccepted}
                  onChange={(event) => setTosAccepted(event.target.checked)}
                />
              }
              label={
                <Typography variant="body2">
                  I accept the current{' '}
                  <MuiLink
                    component={Link}
                    href={tosUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ fontWeight: 'bold', textDecoration: 'underline' }}
                  >
                    Terms of Service
                  </MuiLink>
                  .
                </Typography>
              }
            />

            {tosLoading && (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  Loading current Terms of Service...
                </Typography>
              </Stack>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                loading ||
                tosLoading ||
                !email ||
                !password ||
                password.length < 6 ||
                !tosAccepted ||
                !tosVersionId
              }
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

        {isNewUser && (
          <Button
            variant="text"
            color="primary"
            onClick={() => {
              setIsNewUser(false)
              onCreateModeChange?.(false)
              setError(null)
            }}
            sx={{ mt: 1 }}
          >
            Already have an account? Sign in
          </Button>
        )}
      </Stack>
    </Box>
  )
}

export default CredentialsInput
