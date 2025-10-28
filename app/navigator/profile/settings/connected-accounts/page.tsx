'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  Box,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  ArrowBack as ArrowBackIcon,
  AddCircleOutline as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import ProfileNavMenu from '@app/navigator/profile/ProfileNavMenu'
import theme from '@styles/theme'
import Image from 'next/image'
import Link from 'next/link'

// Provider metadata for displaying accounts
const PROVIDER_METADATA = {
  google: {
    name: 'Google',
    icon: '/icons/profile/auth-google.svg',
    available: true,
  },
  github: {
    name: 'GitHub',
    icon: '/icons/profile/auth-github-mark.svg',
    available: true,
  },
  instagram: {
    name: 'Instagram',
    icon: '/icons/profile/auth-instagram.svg',
    available: false,
  },
}

interface ConnectedAccount {
  provider: string
  providerAccountId: string
  connectedAt: Date
}

export default function ConnectedAccountsPage() {
  const { data: session } = useSession()
  const [connectedAccounts, setConnectedAccounts] = useState<
    ConnectedAccount[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch connected accounts on mount
  useEffect(() => {
    if (session?.user) {
      fetchConnectedAccounts()
    }
  }, [session])

  const fetchConnectedAccounts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/user/connected-accounts', {
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch connected accounts')
      }

      const data = await response.json()
      setConnectedAccounts(data.accounts || [])
    } catch (err) {
      console.error('Error fetching connected accounts:', err)
      setError('Failed to load connected accounts')
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = async (provider: string) => {
    // Prevent disconnecting if it's the only account
    if (connectedAccounts.length === 1) {
      alert('Cannot disconnect your only authentication method')
      return
    }

    if (
      !confirm(
        `Are you sure you want to disconnect your ${PROVIDER_METADATA[provider as keyof typeof PROVIDER_METADATA]?.name || provider} account?`
      )
    ) {
      return
    }

    try {
      const response = await fetch('/api/user/connected-accounts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to disconnect account')
      }

      // Refresh the connected accounts list
      await fetchConnectedAccounts()
    } catch (err) {
      console.error('Error disconnecting account:', err)
      alert(
        err instanceof Error
          ? err.message
          : 'Failed to disconnect account. Please try again.'
      )
    }
  }

  const handleAddAccount = () => {
    // This would open a dialog or redirect to add new login method
    // For now, just show a message
    alert('Adding new login methods is coming soon!')
  }

  // Check if a provider is connected
  const isProviderConnected = (provider: string) => {
    return connectedAccounts.some((account) => account.provider === provider)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Navigation Menu */}
        <Grid size={{ xs: 12, md: 4 }}>
          <ProfileNavMenu />
        </Grid>

        {/* Connected Accounts Content */}
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
                Connected Accounts
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Loading State */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {/* Content - Only show when not loading */}
            {!loading && (
              <>
                {/* Add New Login Method Button */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: 'success.main',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Button
                    fullWidth
                    startIcon={<AddIcon sx={{ fontSize: 24 }} />}
                    onClick={handleAddAccount}
                    sx={{
                      py: 1.5,
                      color: 'success.main',
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      justifyContent: 'flex-start',
                      '&:hover': {
                        bgcolor: 'success.light',
                        color: 'success.dark',
                      },
                    }}
                  >
                    Add a new login method
                  </Button>
                </Paper>

                {/* Connected Accounts Section */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: 'primary.main',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      color: 'text.primary',
                      fontWeight: 500,
                    }}
                  >
                    Available Accounts
                  </Typography>

                  <Stack spacing={2}>
                    {Object.entries(PROVIDER_METADATA).map(
                      ([providerId, metadata]) => {
                        const isConnected = isProviderConnected(providerId)
                        const isAvailable = metadata.available

                        return (
                          <Paper
                            key={providerId}
                            elevation={0}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: 'background.default',
                              border: '1px solid',
                              borderColor: 'divider',
                              opacity: !isAvailable ? 0.6 : 1,
                            }}
                          >
                            <Stack spacing={1.5}>
                              {/* Account Name and Icon */}
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 32,
                                      height: 32,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <Image
                                      src={metadata.icon}
                                      alt={`${metadata.name} icon`}
                                      width={32}
                                      height={32}
                                    />
                                  </Box>
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      fontWeight: 500,
                                      color: 'text.primary',
                                    }}
                                  >
                                    {metadata.name}
                                  </Typography>
                                </Box>

                                {/* Disconnect Button - only for connected & available providers */}
                                {isConnected && isAvailable && (
                                  <IconButton
                                    onClick={() => handleDisconnect(providerId)}
                                    disabled={connectedAccounts.length === 1}
                                    sx={{
                                      color: 'error.main',
                                      '&:hover': {
                                        bgcolor: 'error.light',
                                      },
                                      '&:disabled': {
                                        color: 'text.disabled',
                                      },
                                    }}
                                    aria-label={`Disconnect ${metadata.name}`}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                )}
                              </Box>

                              {/* Status */}
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  pl: 6,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: 'text.secondary',
                                    fontStyle: 'italic',
                                  }}
                                >
                                  Status:{' '}
                                  {!isAvailable
                                    ? 'Coming Soon'
                                    : isConnected
                                      ? 'Connected'
                                      : 'Not Connected'}
                                </Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        )
                      }
                    )}
                  </Stack>
                </Paper>

                {/* Help Text */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'info.light',
                    border: '1px solid',
                    borderColor: 'info.main',
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <strong>Note:</strong> You can connect multiple accounts to
                    enable different login methods. Disconnecting an account
                    will remove that login option. Make sure you have at least
                    one login method connected to your account.
                  </Typography>
                </Paper>
              </>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  )
}
