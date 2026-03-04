'use client'
import React from 'react'
import { Box, Stack, Skeleton, Fade } from '@mui/material'
import LoadingSkeleton from '@app/clientComponents/LoadingSkeleton'

/**
 * Route-level loading component for the Library page.
 * Shows skeleton UI for tabs and content.
 */
export default function LibraryLoading() {
  return (
    <Fade in timeout={300}>
      <Box sx={{ p: 2 }}>
        {/* Page title skeleton */}
        <Skeleton
          variant="text"
          width="40%"
          height={40}
          animation="pulse"
          sx={{ mb: 2 }}
        />

        {/* Tabs skeleton */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider', pb: 1 }}
        >
          <Skeleton
            variant="rounded"
            width={100}
            height={40}
            animation="pulse"
          />
          <Skeleton
            variant="rounded"
            width={100}
            height={40}
            animation="pulse"
          />
          <Skeleton
            variant="rounded"
            width={100}
            height={40}
            animation="pulse"
          />
          <Skeleton
            variant="rounded"
            width={100}
            height={40}
            animation="pulse"
          />
        </Stack>

        {/* Content grid skeleton */}
        <Stack spacing={2}>
          <LoadingSkeleton type="card" lines={3} />
          <LoadingSkeleton type="card" lines={3} />
          <LoadingSkeleton type="card" lines={3} />
        </Stack>
      </Box>
    </Fade>
  )
}
