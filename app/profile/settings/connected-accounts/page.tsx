'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  ArrowBack as ArrowBackIcon,
  AddCircleOutline as AddIcon,
  Delete as DeleteIcon,
  WarningAmber as WarningAmberIcon,
} from '@mui/icons-material'
import ConfirmationDialog from '@clientComponents/ConfirmationDialog'
import AddLoginMethodDialog from '@clientComponents/AddLoginMethodDialog'
import ProfileNavMenu from '@app/profile/ProfileNavMenu'
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
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false)
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('')
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false)
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
    if (connectedAccounts.length === 1) {
      setDeleteConfirmationText('')
      setDeleteAccountDialogOpen(true)
      return
    }

    setProviderToDisconnect(provider)
    setDialogOpen(true)
  }

  const cancelDeleteAccount = () => {
    if (deleteAccountLoading) return
    setDeleteAccountDialogOpen(false)
    setDeleteConfirmationText('')
  }

  const confirmDeleteAccount = async () => {
    if (deleteConfirmationText !== 'DELETE') return

    setDeleteAccountLoading(true)
    setError(null)
    let accountDeleted = false

    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete account')
      }

      accountDeleted = true
      await signOut({ redirect: true, callbackUrl: '/?account-deleted=true' })
    } catch (err) {
      console.error('Failed to delete account:', err)

      if (accountDeleted) {
        window.location.replace('/?account-deleted=true')
        return
      }

      setError(err instanceof Error ? err.message : 'Failed to delete account')
      setDeleteAccountLoading(false)
      setDeleteAccountDialogOpen(false)
      setDeleteConfirmationText('')
    }
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
                href="/profile/settings"
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
                                    sx={{
                                      color: 'error.main',
                                      '&:hover': {
                                        bgcolor: 'error.light',
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

      <Dialog
        open={deleteAccountDialogOpen}
        onClose={cancelDeleteAccount}
        aria-labelledby="delete-account-dialog-title"
        aria-describedby="delete-account-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="delete-account-dialog-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'error.main',
          }}
        >
          <WarningAmberIcon />
          <Typography variant="h6" component="span">
            Delete Account Permanently
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="delete-account-dialog-description"
            sx={{ mb: 2, color: 'error.main', fontWeight: 600 }}
          >
            ⚠️ WARNING: This action cannot be undone!
          </DialogContentText>
          <Typography variant="body2" sx={{ mb: 2 }}>
            You are about to permanently delete your account and all associated
            data. This includes:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              Your profile information and account details
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              All activity history (asanas, series, sequences)
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              All created content (poses, series, sequences)
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              All preferences and notification settings
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              All notification history and reminders
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              All connected accounts and sessions
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
          >
            This action complies with GDPR Article 17 (Right to Erasure).
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            To confirm, please type{' '}
            <Box
              component="span"
              sx={{
                color: 'error.main',
                fontFamily: 'monospace',
                fontSize: '1.1em',
              }}
            >
              DELETE
            </Box>{' '}
            below:
          </Typography>
          <TextField
            fullWidth
            value={deleteConfirmationText}
            onChange={(e) => setDeleteConfirmationText(e.target.value)}
            placeholder="Type DELETE to confirm"
            variant="outlined"
            disabled={deleteAccountLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: 'error.main',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={cancelDeleteAccount}
            disabled={deleteAccountLoading}
            sx={{ color: 'text.secondary', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteAccount}
            variant="contained"
            disabled={
              deleteAccountLoading || deleteConfirmationText !== 'DELETE'
            }
            sx={{
              backgroundColor: 'error.main',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'error.dark',
              },
              '&:disabled': {
                backgroundColor: 'grey.300',
              },
            }}
          >
            {deleteAccountLoading
              ? 'Deleting Account...'
              : 'Yes, Delete My Account'}
          </Button>
        </DialogActions>
      </Dialog>

      <AddLoginMethodDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={handleAddSuccess}
        connectedProviders={connectedAccounts.map((acc) => acc.provider)}
      />
    </Container>
  )
}
