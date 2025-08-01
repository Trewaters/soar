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

/**
 * Global navigation loading overlay that displays during page transitions.
 * Shows a backdrop with spinner and optional target path information.
 */
export default function GlobalNavigationOverlay() {
  const { state } = useNavigationLoading()

  return (
    <Backdrop
      open={state.isNavigating}
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 2000, // Above everything
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(2px)',
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
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
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
