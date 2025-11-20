'use client'

import { useState } from 'react'
import {
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Box,
  TextField,
} from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

/**
 * Account Deletion Button Component
 * Allows users to permanently delete their account
 * Complies with GDPR Article 17 (Right to Erasure)
 */
export default function DeleteAccountButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')

  const handleOpenConfirm = () => {
    setConfirmOpen(true)
    setConfirmationText('')
  }

  const handleCloseConfirm = () => {
    setConfirmOpen(false)
    setConfirmationText('')
  }

  const handleConfirmDelete = async () => {
    if (confirmationText !== 'DELETE') {
      setError('Please type DELETE to confirm account deletion')
      return
    }

    setConfirmOpen(false)
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete account')
      }

      // Account deleted successfully
      // Force a hard redirect to clear all state and prevent session checks
      window.location.replace('/?account-deleted=true')
    } catch (err: any) {
      console.error('Delete account error:', err)
      setError(
        err.message || 'Failed to delete your account. Please try again.'
      )
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpenConfirm}
        disabled={loading}
        sx={{
          backgroundColor: 'error.main',
          color: 'white',
          textTransform: 'none',
          fontWeight: 600,
          px: 3,
          '&:hover': {
            backgroundColor: 'error.dark',
          },
          '&:disabled': {
            backgroundColor: 'grey.300',
          },
        }}
        startIcon={
          loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <WarningAmberIcon />
          )
        }
      >
        {loading ? 'Deleting Account...' : 'Delete My Account'}
      </Button>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        aria-labelledby="delete-confirm-dialog-title"
        aria-describedby="delete-confirm-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="delete-confirm-dialog-title"
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
            id="delete-confirm-dialog-description"
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
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="Type DELETE to confirm"
            variant="outlined"
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
            onClick={handleCloseConfirm}
            sx={{
              color: 'text.secondary',
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            disabled={confirmationText !== 'DELETE'}
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
            Yes, Delete My Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  )
}
