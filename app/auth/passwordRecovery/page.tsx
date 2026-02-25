'use client'

import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material'
import { useState, FormEvent, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import EmailIcon from '@mui/icons-material/Email'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Link from 'next/link'

export default function PasswordRecoveryPage() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email')

  const [email, setEmail] = useState(emailParam || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Update email field when query parameter changes
  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [emailParam])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      // TODO: Implement password recovery API call

      setSuccessMessage(
        'If an account exists with this email, you will receive a temporary password shortly.'
      )
    } catch (error) {
      console.error('Password recovery error:', error)
      setErrorMessage(
        'An error occurred while processing your request. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3}>
          {/* Back to Sign In Link */}
          <Link
            href="/auth/signin"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              width: 'fit-content',
            }}
          >
            <ArrowBackIcon sx={{ mr: 1 }} />
            <Typography variant="body1">Back to Sign In</Typography>
          </Link>

          <Typography variant="h1" gutterBottom sx={{ textAlign: 'center' }}>
            Password Recovery
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            Forgot your password? No problem! Enter your email and we&apos;ll
            send you a temporary password.
          </Typography>

          {/* Success Message */}
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMessage}
            </Alert>
          )}

          {/* Error Message */}
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                id="email"
                name="email"
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
                helperText={
                  emailParam ? 'Email pre-filled from your sign-in attempt' : ''
                }
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting || !email}
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Temporary Password'}
              </Button>
            </Stack>
          </Box>

          {/* Additional Help Text */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', mt: 2 }}
          >
            Remember your password?{' '}
            <Link
              href="/auth/signin"
              style={{ color: 'inherit', fontWeight: 'bold' }}
            >
              Sign in here
            </Link>
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}
