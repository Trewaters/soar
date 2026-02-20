'use client'
import React from 'react'
import { Box, Stack, Skeleton, Fade } from '@mui/material'
import LoadingSkeleton from '@app/clientComponents/LoadingSkeleton'

/**
 * Route-level loading component for /asanaPoses routes.
 * Shows skeleton UI during asana page transitions.
 */
export default function AsanaPosesLoading() {
  return (
    <Fade in timeout={300}>
      <Box sx={{ p: 2 }}>
        {/* Header skeleton */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Skeleton variant="text" width="60%" height={40} animation="pulse" />
          <Skeleton variant="text" width="40%" height={24} animation="pulse" />
        </Stack>

        {/* Search skeleton */}
        <LoadingSkeleton type="search" />

        {/* Content skeleton - list of poses */}
        <Stack spacing={2} sx={{ mt: 3 }}>
          <LoadingSkeleton type="list" lines={5} />
        </Stack>
      </Box>
    </Fade>
  )
}
