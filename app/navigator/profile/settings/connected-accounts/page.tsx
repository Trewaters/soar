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
import ConfirmationDialog from '@clientComponents/ConfirmationDialog'
import AddLoginMethodDialog from '@clientComponents/AddLoginMethodDialog'
import ProfileNavMenu from '@app/navigator/profile/ProfileNavMenu'
import theme from '@styles/theme'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// Provider metadata for displaying accounts
const PROVIDER_METADATA = {
  credentials: {
    name: 'Email & Password',
    icon: '/icons/profile/auth-credentials.svg',
    available: true,
  },
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
  type?: string
  hasPassword?: boolean
}

export default function ConnectedAccountsPage() {
  const { data: session } = useSession()
  const [connectedAccounts, setConnectedAccounts] = useState<
    ConnectedAccount[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [providerToDisconnect, setProviderToDisconnect] = useState<
    string | null
  >(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const searchParams = useSearchParams()

  // Fetch connected accounts on mount
  useEffect(() => {
    if (session?.user) {
      fetchConnectedAccounts()
    }
  }, [session])

  // Check for OAuth callback success
  useEffect(() => {
    const action = searchParams.get('action')
    const provider = searchParams.get('provider')

    if (action === 'link-success' && provider) {
      // Refresh accounts list after OAuth link
      fetchConnectedAccounts()
      // Optionally show success message
      // Could add a success state here if desired
    }
  }, [searchParams])

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
    setProviderToDisconnect(provider)
    setDialogOpen(true)
  }

  const confirmDisconnect = async () => {
    if (!providerToDisconnect) return

    try {
      const response = await fetch('/api/user/connected-accounts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider: providerToDisconnect }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to disconnect account')
      }

      // Refresh the list
      await fetchConnectedAccounts()
    } catch (err) {
      console.error('Failed to disconnect:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to disconnect account'
      )
    } finally {
      setDialogOpen(false)
      setProviderToDisconnect(null)
    }
  }

  const cancelDisconnect = () => {
    setDialogOpen(false)
    setProviderToDisconnect(null)
  }

  const handleAddAccount = () => {
    setAddDialogOpen(true)
  }

  const handleAddSuccess = () => {
    // Refresh the connected accounts list
    fetchConnectedAccounts()
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
                        const isCredentials = providerId === 'credentials'

                        return (
                          <Paper
                            key={providerId}
                            elevation={0}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor:
                                isCredentials && isConnected
                                  ? 'action.hover'
                                  : 'background.default',
                              border: '1px solid',
                              borderColor:
                                isCredentials && isConnected
                                  ? 'primary.main'
                                  : 'divider',
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
                                  <Box>
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontWeight: 500,
                                        color: 'text.primary',
                                      }}
                                    >
                                      {metadata.name}
                                    </Typography>
                                    {isCredentials && isConnected && (
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: 'text.secondary',
                                          display: 'block',
                                        }}
                                      >
                                        Password-based authentication
                                      </Typography>
                                    )}
                                  </Box>
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

      <ConfirmationDialog
        open={dialogOpen}
        title="Disconnect Account"
        message={
          providerToDisconnect
            ? `Are you sure you want to disconnect your ${
                PROVIDER_METADATA[
                  providerToDisconnect as keyof typeof PROVIDER_METADATA
                ]?.name || providerToDisconnect
              } account? You can reconnect it later.`
            : ''
        }
        confirmText="Disconnect"
        cancelText="Cancel"
        onConfirm={confirmDisconnect}
        onCancel={cancelDisconnect}
        isWarning={true}
      />

      <AddLoginMethodDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={handleAddSuccess}
        connectedProviders={connectedAccounts.map((acc) => acc.provider)}
      />
    </Container>
  )
}
