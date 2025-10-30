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
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import ProfileNavMenu from '@app/navigator/profile/ProfileNavMenu'
import theme from '@styles/theme'
import { useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import DevicesIcon from '@mui/icons-material/Devices'
import LogoutIcon from '@mui/icons-material/Logout'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
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

  const handlePasswordChange = () => {
    // Reset states
    setPasswordError('')
    setPasswordSuccess(false)

    // Validation
    if (!currentPassword) {
      setPasswordError('Current password is required')
      return
    }

    if (currentPassword === 'wrongpassword') {
      setPasswordError('Wrong password!')
      return
    }

    if (newPassword.length < 8) {
      setPasswordError('Try a stronger password.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Your passwords do not match!')
      return
    }

    // Success
    setPasswordSuccess(true)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  // Mock login history data
  const loginHistory = [
    { device: 'Chrome on Windows', location: 'San Francisco, CA' },
    { device: 'Safari on iPhone', location: 'New York, NY' },
    { device: 'Firefox on macOS', location: 'Austin, TX' },
  ]

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
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
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
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••"
                    error={
                      passwordError === 'Wrong password!' ||
                      passwordError === 'Current password is required'
                    }
                    helperText={
                      passwordError === 'Wrong password!' ||
                      passwordError === 'Current password is required'
                        ? passwordError
                        : ''
                    }
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&.Mui-error': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'error.main',
                          },
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'error.main',
                        fontWeight: 500,
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
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••"
                    error={passwordError === 'Try a stronger password.'}
                    helperText={
                      passwordError === 'Try a stronger password.'
                        ? passwordError
                        : ''
                    }
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&.Mui-error': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'error.main',
                          },
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'error.main',
                        fontWeight: 500,
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
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
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••"
                    error={passwordError === 'Your passwords do not match!'}
                    helperText={
                      passwordError === 'Your passwords do not match!'
                        ? passwordError
                        : ''
                    }
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&.Mui-error': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'error.main',
                          },
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'error.main',
                        fontWeight: 500,
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
                  A secure password contains at least one capital letter, one
                  lowercase letter, a number, and a special symbol.
                </Typography>

                {/* Forgot Password Link */}
                <Box>
                  <Button
                    variant="text"
                    sx={{
                      textTransform: 'none',
                      color: 'text.primary',
                      textDecoration: 'underline',
                      p: 0,
                      '&:hover': {
                        backgroundColor: 'transparent',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot password?
                  </Button>
                </Box>

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
                    Password updated successfully.
                  </Alert>
                )}

                {/* Update Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handlePasswordChange}
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
                    }}
                  >
                    Update Password
                  </Button>
                </Box>
              </Stack>
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

              <List sx={{ p: 0 }}>
                {loginHistory.map((login, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      px: 0,
                      py: 2,
                      borderBottom:
                        index !== loginHistory.length - 1
                          ? '1px solid'
                          : 'none',
                      borderColor: 'divider',
                    }}
                    secondaryAction={
                      <IconButton edge="end">
                        <OpenInNewIcon sx={{ color: 'text.secondary' }} />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      <DevicesIcon sx={{ color: 'text.secondary' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Device, location
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          {login.device} • {login.location}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              {/* Sign out all devices */}
              <Button
                variant="text"
                startIcon={<LogoutIcon />}
                sx={{
                  color: 'error.main',
                  textTransform: 'none',
                  fontWeight: 600,
                  mt: 2,
                  '&:hover': {
                    backgroundColor: 'error.light',
                  },
                }}
              >
                Sign out of all devices.
              </Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  )
}
