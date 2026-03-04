'use client'
import React from 'react'
import { Box, Stack, Skeleton, Fade, Paper } from '@mui/material'
import LoadingSkeleton from '@app/clientComponents/LoadingSkeleton'

/**
 * Route-level loading component for /profile routes.
 * Shows skeleton UI during profile page transitions.
 */
export default function ProfileLoading() {
  return (
    <Fade in timeout={300}>
      <Box sx={{ p: 2 }}>
        {/* Profile header skeleton */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Skeleton
              variant="circular"
              width={80}
              height={80}
              animation="pulse"
            />
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Skeleton
                variant="text"
                width="60%"
                height={32}
                animation="pulse"
              />
              <Skeleton
                variant="text"
                width="40%"
                height={20}
                animation="pulse"
              />
            </Stack>
          </Stack>
        </Paper>

        {/* Tabs skeleton */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Skeleton
            variant="rounded"
            width={80}
            height={36}
            animation="pulse"
          />
          <Skeleton
            variant="rounded"
            width={80}
            height={36}
            animation="pulse"
          />
          <Skeleton
            variant="rounded"
            width={80}
            height={36}
            animation="pulse"
          />
        </Stack>

        {/* Content skeleton */}
        <LoadingSkeleton type="list" lines={4} />
      </Box>
    </Fade>
  )
}
