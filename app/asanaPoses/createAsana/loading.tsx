'use client'
import React from 'react'
import { Box, Stack, Skeleton, Fade } from '@mui/material'

/**
 * Route-level loading component for the create asana page.
 * Shows skeleton UI for the form layout.
 */
export default function CreateAsanaLoading() {
  return (
    <Fade in timeout={300}>
      <Box sx={{ p: 2 }}>
        {/* Header skeleton */}
        <Skeleton
          variant="text"
          width="50%"
          height={40}
          animation="pulse"
          sx={{ mb: 3 }}
        />

        {/* Form fields skeleton */}
        <Stack spacing={3}>
          {/* Name field */}
          <Skeleton
            variant="rounded"
            width="100%"
            height={56}
            animation="pulse"
          />

          {/* Description field */}
          <Skeleton
            variant="rounded"
            width="100%"
            height={120}
            animation="pulse"
          />

          {/* Image upload area skeleton */}
          <Skeleton
            variant="rounded"
            width="100%"
            height={200}
            animation="pulse"
            sx={{ borderRadius: 2 }}
          />

          {/* Additional fields */}
          <Stack direction="row" spacing={2}>
            <Skeleton
              variant="rounded"
              width="50%"
              height={56}
              animation="pulse"
            />
            <Skeleton
              variant="rounded"
              width="50%"
              height={56}
              animation="pulse"
            />
          </Stack>

          {/* Submit button skeleton */}
          <Skeleton
            variant="rounded"
            width={150}
            height={48}
            animation="pulse"
            sx={{ alignSelf: 'flex-end' }}
          />
        </Stack>
      </Box>
    </Fade>
  )
}
