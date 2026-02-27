'use client'
import React from 'react'
import {
  Backdrop,
  CircularProgress,
  Box,
  Typography,
  Fade,
} from '@mui/material'
import { useNavigationLoading } from '@context/NavigationLoadingContext'
import { COLORS } from '../../styles/theme'

/**
 * Global navigation loading overlay that displays during page transitions.
 * Shows a backdrop with spinner and optional target path information.
 */
export default function GlobalNavigationOverlay() {
  const { state } = useNavigationLoading()

  // development-only logging removed

  return (
    <Backdrop
      // Key the backdrop by navId (fallback to targetPath) so React will
      // remount the overlay when a new navigation starts. This prevents a
      // stale DOM/backdrop from remaining visible if endNavigation() was
      // called but some portal/state race left the element mounted.
      key={state.navId ?? state.targetPath ?? 'global-navigation-overlay'}
      data-testid="global-navigation-overlay"
      open={state.isNavigating}
      sx={{
        color: (theme) => theme.palette.text.inverse,
        zIndex: (theme) => theme.zIndex.drawer + 2000, // Above everything
        backgroundColor: COLORS.overlayDarkFull,
        backdropFilter: 'blur(2px)',
        position: 'absolute', // Prevents Next.js "Skipping auto-scroll" warning
      }}
    >
      <Fade in={state.isNavigating} timeout={200}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            padding: 3,
            borderRadius: 2,
            backgroundColor: COLORS.overlayWhiteSoft,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${COLORS.overlayWhiteLight}`,
          }}
        >
          <CircularProgress
            size={40}
            sx={{
              color: 'primary.main',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'medium',
              textAlign: 'center',
              maxWidth: 200,
              wordBreak: 'break-word',
            }}
          >
            Loading...
          </Typography>
          {state.targetPath && (
            <Typography
              variant="caption"
              sx={{
                opacity: 0.8,
                textAlign: 'center',
                fontSize: '0.75rem',
                maxWidth: 250,
                wordBreak: 'break-word',
              }}
            >
              Going to {state.targetPath}
            </Typography>
          )}
        </Box>
      </Fade>
    </Backdrop>
  )
}
