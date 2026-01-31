'use client'

import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import CircularProgress from '@mui/material/CircularProgress'

type Props = {
  open: boolean
  loading?: boolean
  onAccept: () => Promise<void>
}

export default function TosReacceptModal({ open, loading, onAccept }: Props) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        // Intentionally noop to make modal non-dismissible until Accept
      }}
      aria-labelledby="tos-reaccept-title"
      disableEscapeKeyDown
    >
      <DialogTitle id="tos-reaccept-title">Terms of Service Update</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          We&apos;ve updated our Terms of Service. To continue using your
          account you must review and accept the new terms.
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          Please review the full Terms of Service and accept to continue. You
          can read the full text here:{' '}
          <Link
            href="/compliance/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </Link>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onAccept}
          color="primary"
          variant="contained"
          disabled={Boolean(loading)}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  )
}
