'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  InputAdornment,
  IconButton,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material'
import Image from 'next/image'
import { signIn } from 'next-auth/react'

export interface AddLoginMethodDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  connectedProviders: string[]
}

interface ProviderOption {
  id: string
  name: string
  icon: string
  type: 'oauth' | 'credentials'
  description: string
}

const PROVIDER_OPTIONS: ProviderOption[] = [
  {
    id: 'google',
    name: 'Google',
    icon: '/icons/profile/google.svg',
    type: 'oauth',
    description: 'Sign in with your Google account',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: '/icons/profile/github.svg',
    type: 'oauth',
    description: 'Sign in with your GitHub account',
  },
  {
    id: 'credentials',
    name: 'Email & Password',
    icon: '/icons/profile/auth-credentials.svg',
    type: 'credentials',
    description: 'Create a password for your account',
  },
]

export default function AddLoginMethodDialog({
  open,
  onClose,
  onSuccess,
  connectedProviders,
}: AddLoginMethodDialogProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    if (!loading) {
      setSelectedProvider(null)
      setPassword('')
      setConfirmPassword('')
      setError(null)
      setShowPassword(false)
      setShowConfirmPassword(false)
      onClose()
    }
  }

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
    setError(null)
  }

  const handleBack = () => {
    setSelectedProvider(null)
    setPassword('')
    setConfirmPassword('')
    setError(null)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number'
    }
    return null
  }

  const handleOAuthAdd = async (provider: string) => {
    setLoading(true)
    setError(null)

    try {
      // Redirect to OAuth provider with callback to connected accounts page
      const callbackUrl = `${window.location.origin}/profile/settings/connected-accounts?action=link-success&provider=${provider}`
      await signIn(provider, { callbackUrl })
    } catch (err) {
      console.error('OAuth sign-in error:', err)
      setError('Failed to initiate OAuth sign-in. Please try again.')
      setLoading(false)
    }
  }

  const handleCredentialsAdd = async () => {
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password strength
    const validationError = validatePassword(password)
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        '/api/user/connected-accounts/add-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add password')
      }

      // Success
      onSuccess()
      handleClose()
    } catch (err) {
      console.error('Failed to add password:', err)
      setError(err instanceof Error ? err.message : 'Failed to add password')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => {
    if (!selectedProvider) return

    const provider = PROVIDER_OPTIONS.find((p) => p.id === selectedProvider)
    if (!provider) return

    if (provider.type === 'oauth') {
      handleOAuthAdd(provider.id)
    } else {
      handleCredentialsAdd()
    }
  }

  const availableProviders = PROVIDER_OPTIONS.filter(
    (provider) => !connectedProviders.includes(provider.id)
  )

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="add-login-method-dialog-title"
    >
      <DialogTitle id="add-login-method-dialog-title">
        {selectedProvider ? 'Set Up Login Method' : 'Add Login Method'}
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {availableProviders.length === 0 ? (
          <Alert severity="info">
            All available login methods are already connected to your account.
          </Alert>
        ) : !selectedProvider ? (
          // Provider selection view
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Choose a login method to add to your account:
            </Typography>
            {availableProviders.map((provider) => (
              <Paper
                key={provider.id}
                elevation={0}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={() => handleProviderSelect(provider.id)}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      position: 'relative',
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={provider.icon}
                      alt={`${provider.name} icon`}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {provider.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {provider.description}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        ) : (
          // Password setup view (only for credentials)
          <Box>
            {selectedProvider === 'credentials' && (
              <Stack spacing={3}>
                <Alert severity="info">
                  Create a password to enable email/password login for your
                  account.
                </Alert>

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Password requirements:
                  </Typography>
                  <ul
                    style={{
                      margin: '8px 0',
                      paddingLeft: '20px',
                      fontSize: '0.75rem',
                      color: 'text.secondary',
                    }}
                  >
                    <li>At least 8 characters long</li>
                    <li>Contains uppercase and lowercase letters</li>
                    <li>Contains at least one number</li>
                  </ul>
                </Box>
              </Stack>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {selectedProvider && selectedProvider === 'credentials' && (
          <Button onClick={handleBack} disabled={loading}>
            Back
          </Button>
        )}
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        {selectedProvider && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              loading ||
              (selectedProvider === 'credentials' &&
                (!password || !confirmPassword))
            }
            startIcon={loading && <CircularProgress size={16} />}
          >
            {loading ? 'Adding...' : 'Add Login Method'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
