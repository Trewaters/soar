'use client'
import React from 'react'
import { Box, CircularProgress, Typography, Fade, Paper } from '@mui/material'

/**
 * Route-level loading component for /auth routes.
 * Shows centered loading state during authentication page transitions.
 */
export default function AuthLoading() {
  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          p: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            borderRadius: 2,
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
          <Typography variant="body1" color="text.secondary">
            Preparing your session...
          </Typography>
        </Paper>
      </Box>
    </Fade>
  )
}
