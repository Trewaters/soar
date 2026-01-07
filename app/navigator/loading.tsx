'use client'
import React from 'react'
import { Box, CircularProgress, Typography, Fade } from '@mui/material'

/**
 * Route-level loading component for /navigator routes.
 * Displays during page transitions with Next.js Suspense boundaries.
 */
export default function NavigatorLoading() {
  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 2,
        }}
      >
        <CircularProgress
          size={48}
          sx={{
            color: 'primary.main',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontWeight: 'medium' }}
        >
          Loading your yoga practice...
        </Typography>
      </Box>
    </Fade>
  )
}
