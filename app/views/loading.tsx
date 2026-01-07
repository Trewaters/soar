'use client'
import React from 'react'
import { Box, CircularProgress, Typography, Fade } from '@mui/material'

/**
 * Route-level loading component for /views routes (practice views).
 * Shows immersive loading state during practice view transitions.
 */
export default function ViewsLoading() {
  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default',
          gap: 3,
        }}
      >
        <CircularProgress
          size={56}
          thickness={4}
          sx={{
            color: 'primary.main',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontWeight: 'medium' }}
        >
          Preparing your practice...
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Take a deep breath
        </Typography>
      </Box>
    </Fade>
  )
}
