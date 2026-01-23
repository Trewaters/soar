'use client'

import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState, FormEvent } from 'react'
import EmailIcon from '@mui/icons-material/Email'

export default function PasswordRecoveryPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Implement password recovery API call
      console.log('Password recovery requested for:', email)

      // Show success message or redirect
    } catch (error) {
      console.error('Password recovery error:', error)
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
          <Typography variant="h1" gutterBottom sx={{ textAlign: 'center' }}>
            Password Recovery
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            Forgot your password? No problem! Enter your email and we&apos;ll
            send you a temporary password.
          </Typography>

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
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
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
        </Stack>
      </Container>
    </Box>
  )
}
