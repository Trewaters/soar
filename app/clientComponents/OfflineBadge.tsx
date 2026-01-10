'use client'

import { Box, Chip, Fade } from '@mui/material'
import CloudOffIcon from '@mui/icons-material/CloudOff'
import { useOfflineStatus } from '@app/utils/offline/useOfflineStatus'

/**
 * A subtle badge that appears when the user is offline.
 * Includes aria-live region for accessibility announcements.
 */
export default function OfflineBadge() {
  const { online } = useOfflineStatus()

  return (
    <>
      {/* Accessible live region for screen readers */}
      <Box
        component="span"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          display: 'none',
        }}
      >
        {online ? '' : 'You are currently offline'}
      </Box>

      {/* Visual indicator */}
      <Fade in={!online} timeout={300}>
        <Chip
          icon={<CloudOffIcon />}
          label="Offline"
          size="small"
          color="warning"
          variant="outlined"
          sx={{
            display: online ? 'none' : 'flex',
            position: 'fixed',
            bottom: 80,
            right: 16,
            zIndex: 1300,
            backgroundColor: 'background.paper',
            boxShadow: 1,
          }}
          aria-hidden="true"
        />
      </Fade>
    </>
  )
}
