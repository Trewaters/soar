'use client'

import {
  Container,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import ProfileNavMenu from '@app/navigator/profile/ProfileNavMenu'
import theme from '@styles/theme'
import { useState, useEffect } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import DevicesIcon from '@mui/icons-material/Devices'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import InfoIcon from '@mui/icons-material/Info'
import Link from 'next/link'

export default function AccountSecurityPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasCredentialsAccount, setHasCredentialsAccount] = useState<
    boolean | null
  >(null)
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true)
  const [loginHistory, setLoginHistory] = useState<any[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  // Check if user has credentials provider account on mount
  useEffect(() => {
    const checkCredentialsProvider = async () => {
      try {
        const response = await fetch('/api/user/connected-accounts')
        if (response.ok) {
          const data = await response.json()
          const credentialsAccount = data.accounts?.find(
            (account: any) => account.provider === 'credentials'
          )
          setHasCredentialsAccount(
            credentialsAccount && credentialsAccount.hasPassword
          )
        }
      } catch (error) {
        console.error('Error checking credentials provider:', error)
        setHasCredentialsAccount(false)
      } finally {
        setIsLoadingAccounts(false)
      }
    }

    checkCredentialsProvider()
  }, [])

  // Fetch login history on mount
  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        const response = await fetch('/api/user/login-history')
        if (response.ok) {
          const data = await response.json()
          setLoginHistory(data.loginHistory || [])
        }
      } catch (error) {
        console.error('Error fetching login history:', error)
      } finally {
        setIsLoadingHistory(false)
      }
    }

    fetchLoginHistory()
  }, [])

  const handlePasswordChange = async () => {
    // Reset states
    setPasswordError('')
    setPasswordSuccess(false)

    // Validation
    if (!currentPassword) {
      setPasswordError('Current password is required')
      return
    }

    if (!newPassword) {
      setPasswordError('New password is required')
      return
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long')
      return
    }

    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError('Password must contain at least one uppercase letter')
      return
    }

    if (!/[a-z]/.test(newPassword)) {
      setPasswordError('Password must contain at least one lowercase letter')
      return
    }

    if (!/[0-9]/.test(newPassword)) {
      setPasswordError('Password must contain at least one number')
      return
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      setPasswordError('Password must contain at least one special character')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Your passwords do not match!')
      return
    }

    if (currentPassword === newPassword) {
      setPasswordError('New password must be different from current password')
      return
    }

    // Submit to API
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setPasswordSuccess(true)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPasswordError(data.error || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      setPasswordError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatLoginDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Navigation Menu */}
        <Grid size={{ xs: 12, md: 4 }}>
          <ProfileNavMenu />
        </Grid>

        {/* Account Security Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Header with Back Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                component={Link}
                href="/navigator/profile/settings"
                sx={{
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.light',
                  },
                }}
                aria-label="Back to Account Settings"
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  color: theme.palette.success.main,
                }}
              >
                Account Security
              </Typography>
            </Box>

            {/* Change Password Section */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'primary.main',
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: 'text.primary', fontWeight: 600, mb: 3 }}
              >
                Change Password
              </Typography>

              {/* Loading State */}
              {isLoadingAccounts && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress />
                </Box>
              )}

              {/* Not Available for Social Accounts */}
              {!isLoadingAccounts && !hasCredentialsAccount && (
                <Alert
                  severity="info"
                  icon={<InfoIcon />}
                  sx={{
                    backgroundColor: 'info.light',
                    color: 'info.dark',
                    '& .MuiAlert-icon': {
                      color: 'info.main',
                    },
                  }}
                >
                  Password change is only available for accounts created with
                  email and password. You signed in with a social account
                  (Google or GitHub). To manage your password, please visit your
                  social account provider&apos;s settings.
                </Alert>
              )}

              {/* Password Change Form */}
              {!isLoadingAccounts && hasCredentialsAccount && (
                <Stack spacing={2.5}>
                  {/* Current Password */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', mb: 1 }}
                    >
                      Current Password*
                    </Typography>
                    <TextField
                      fullWidth
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value)
                        setPasswordError('')
                        setPasswordSuccess(false)
                      }}
                      placeholder="••••••"
                      disabled={isSubmitting}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                              edge="end"
                              disabled={isSubmitting}
                            >
                              {showCurrentPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  {/* New Password */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', mb: 1 }}
                    >
                      New Password*
                    </Typography>
                    <TextField
                      fullWidth
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value)
                        setPasswordError('')
                        setPasswordSuccess(false)
                      }}
                      placeholder="••••••"
                      disabled={isSubmitting}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              edge="end"
                              disabled={isSubmitting}
                            >
                              {showNewPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  {/* Confirm New Password */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', mb: 1 }}
                    >
                      Confirm New Password*
                    </Typography>
                    <TextField
                      fullWidth
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        setPasswordError('')
                        setPasswordSuccess(false)
                      }}
                      placeholder="••••••"
                      disabled={isSubmitting}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                              disabled={isSubmitting}
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
                  </Box>

                  {/* Password Requirements */}
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block' }}
                  >
                    A secure password must contain at least 8 characters,
                    including one uppercase letter, one lowercase letter, one
                    number, and one special character (!@#$%^&*...).
                  </Typography>

                  {/* Error Message */}
                  {passwordError && (
                    <Alert
                      severity="error"
                      sx={{
                        backgroundColor: 'error.light',
                        color: 'error.dark',
                        '& .MuiAlert-icon': {
                          color: 'error.main',
                        },
                      }}
                    >
                      {passwordError}
                    </Alert>
                  )}

                  {/* Success Message */}
                  {passwordSuccess && (
                    <Alert
                      severity="success"
                      icon={<CheckCircleIcon />}
                      sx={{
                        backgroundColor: 'success.light',
                        color: 'success.dark',
                        '& .MuiAlert-icon': {
                          color: 'success.main',
                        },
                      }}
                    >
                      Password updated successfully. Your new password is now
                      active.
                    </Alert>
                  )}

                  {/* Update Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={handlePasswordChange}
                      disabled={isSubmitting}
                      sx={{
                        backgroundColor: 'success.main',
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 4,
                        py: 1,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: 'success.dark',
                        },
                        '&:disabled': {
                          backgroundColor: 'action.disabledBackground',
                          color: 'action.disabled',
                        },
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <CircularProgress
                            size={20}
                            sx={{ mr: 1, color: 'inherit' }}
                          />
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </Box>
                </Stack>
              )}
            </Paper>

            {/* Login History Section */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'primary.main',
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: 'text.primary', fontWeight: 600, mb: 3 }}
              >
                Login History
              </Typography>

              {/* Loading State */}
              {isLoadingHistory && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress />
                </Box>
              )}

              {/* No History */}
              {!isLoadingHistory && loginHistory.length === 0 && (
                <Alert
                  severity="info"
                  icon={<InfoIcon />}
                  sx={{
                    backgroundColor: 'info.light',
                    color: 'info.dark',
                    '& .MuiAlert-icon': {
                      color: 'info.main',
                    },
                  }}
                >
                  No login history available yet. Your login activities will
                  appear here.
                </Alert>
              )}

              {/* Login History List */}
              {!isLoadingHistory && loginHistory.length > 0 && (
                <>
                  <List sx={{ p: 0 }}>
                    {loginHistory.map((login, index) => (
                      <ListItem
                        key={login.id}
                        sx={{
                          px: 0,
                          py: 2,
                          borderBottom:
                            index !== loginHistory.length - 1
                              ? '1px solid'
                              : 'none',
                          borderColor: 'divider',
                        }}
                      >
                        <ListItemIcon>
                          <DevicesIcon sx={{ color: 'text.secondary' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                flexWrap: 'wrap',
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500 }}
                              >
                                {login.device}
                              </Typography>
                              {login.provider && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    backgroundColor: 'primary.light',
                                    color: 'primary.main',
                                    fontWeight: 600,
                                  }}
                                >
                                  {login.provider}
                                </Typography>
                              )}
                            </Box>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              sx={{ color: 'text.secondary', mt: 0.5 }}
                            >
                              {formatLoginDate(login.loginDate)} •{' '}
                              {login.location}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 2,
                      color: 'text.secondary',
                      textAlign: 'center',
                    }}
                  >
                    Showing your {loginHistory.length} most recent login
                    {loginHistory.length !== 1 ? 's' : ''}
                  </Typography>
                </>
              )}
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  )
}
