'use client'
import React from 'react'
import { Box, Stack, Skeleton, Fade } from '@mui/material'

/**
 * Route-level loading component for individual asana pose pages.
 * Shows skeleton UI matching the pose detail layout.
 */
export default function PoseDetailLoading() {
  return (
    <Fade in timeout={300}>
      <Box sx={{ p: 2 }}>
        {/* Sub-nav header skeleton */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Skeleton
            variant="circular"
            width={40}
            height={40}
            animation="pulse"
          />
          <Skeleton variant="text" width="40%" height={32} animation="pulse" />
          <Skeleton
            variant="circular"
            width={40}
            height={40}
            animation="pulse"
          />
        </Stack>

        {/* Pose image skeleton */}
        <Skeleton
          variant="rounded"
          width="100%"
          height={250}
          animation="pulse"
          sx={{ borderRadius: 2, mb: 2 }}
        />

        {/* Pose title skeleton */}
        <Skeleton
          variant="text"
          width="70%"
          height={40}
          animation="pulse"
          sx={{ mb: 1 }}
        />

        {/* Sanskrit name skeleton */}
        <Skeleton
          variant="text"
          width="50%"
          height={24}
          animation="pulse"
          sx={{ mb: 2 }}
        />

        {/* Description skeleton */}
        <Stack spacing={0.5} sx={{ mb: 3 }}>
          <Skeleton variant="text" width="100%" height={20} animation="pulse" />
          <Skeleton variant="text" width="95%" height={20} animation="pulse" />
          <Skeleton variant="text" width="80%" height={20} animation="pulse" />
        </Stack>

        {/* Activity tracker skeleton */}
        <Skeleton
          variant="rounded"
          width="100%"
          height={100}
          animation="pulse"
          sx={{ borderRadius: 2 }}
        />
      </Box>
    </Fade>
  )
}
