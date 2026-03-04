'use client'

import { useState } from 'react'
import {
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
} from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

/**
 * GDPR-Compliant Data Download Button
 * Allows users to download all their personal data
 * Complies with GDPR Article 15 (Right of Access) and Article 20 (Right to Data Portability)
 */
export default function DownloadDataButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleOpenConfirm = () => {
    setConfirmOpen(true)
  }

  const handleCloseConfirm = () => {
    setConfirmOpen(false)
  }

  const handleConfirmDownload = async () => {
    setConfirmOpen(false)
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/download-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to download data')
      }

      // Get the JSON data
      const data = await response.json()

      // Create a blob and download it
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `soar-account-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setSuccess(true)
    } catch (err: any) {
      console.error('Download error:', err)
      setError(err.message || 'Failed to download your data. Please try again.')
    } finally {
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
          backgroundColor: 'primary.main',
          color: 'white',
          textTransform: 'none',
          fontWeight: 600,
          px: 3,
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
          '&:disabled': {
            backgroundColor: 'grey.300',
          },
        }}
        startIcon={
          loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <Box
              component="span"
              sx={{
                fontSize: '1.2rem',
              }}
            >
              ⬇
            </Box>
          )
        }
      >
        {loading ? 'Preparing Download...' : 'Download Data'}
      </Button>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        aria-labelledby="download-confirm-dialog-title"
        aria-describedby="download-confirm-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="download-confirm-dialog-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'primary.main',
          }}
        >
          <InfoOutlinedIcon />
          <Typography variant="h6" component="span">
            Download Your Data
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="download-confirm-dialog-description"
            sx={{ mb: 2 }}
          >
            You&apos;re about to download a complete copy of your personal data
            in JSON format.
          </DialogContentText>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            This file will include:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              Profile information and account details
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              Activity history (asanas, series, sequences)
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              Created content (poses, series, sequences)
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              Preferences and notification settings
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              Notification history
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: 'text.secondary',
              fontStyle: 'italic',
            }}
          >
            Note: Sensitive data like passwords and access tokens are excluded
            for security.
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 1,
              color: 'success.main',
              fontWeight: 600,
            }}
          >
            ✓ GDPR Compliant (Article 15 & 20)
          </Typography>
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
            onClick={handleConfirmDownload}
            variant="contained"
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Download My Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Your data has been downloaded successfully!
        </Alert>
      </Snackbar>

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
