'use client'
import React from 'react'
import { Box, Stack, Skeleton, Fade } from '@mui/material'
import LoadingSkeleton from '@app/clientComponents/LoadingSkeleton'

/**
 * Route-level loading component for /navigator/flows routes.
 * Shows skeleton UI during series/sequence page transitions.
 */
export default function FlowsLoading() {
  return (
    <Fade in timeout={300}>
      <Box sx={{ p: 2 }}>
        {/* Header skeleton */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Skeleton variant="text" width="50%" height={40} animation="pulse" />
          <Skeleton variant="text" width="30%" height={24} animation="pulse" />
        </Stack>

        {/* Search/filter skeleton */}
        <LoadingSkeleton type="search" />

        {/* Cards skeleton - flow series or sequences */}
        <Stack spacing={2} sx={{ mt: 3 }}>
          <LoadingSkeleton type="card" lines={4} />
          <LoadingSkeleton type="card" lines={4} />
        </Stack>
      </Box>
    </Fade>
  )
}
