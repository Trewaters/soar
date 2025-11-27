'use client'
import React from 'react'
import { Box, Stack, Skeleton, Fade } from '@mui/material'

/**
 * Route-level loading component for Eight Limbs page.
 * Shows skeleton UI matching the limbs list layout.
 */
export default function EightLimbsLoading() {
  return (
    <Fade in timeout={300}>
      <Box sx={{ p: 2 }}>
        {/* Title skeleton */}
        <Skeleton
          variant="text"
          width="50%"
          height={48}
          animation="pulse"
          sx={{ mb: 3 }}
        />

        {/* List items skeleton */}
        <Stack spacing={2}>
          {[...Array(8)].map((_, index) => (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ py: 1 }}
            >
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                animation="pulse"
              />
              <Stack spacing={0.5} sx={{ flex: 1 }}>
                <Skeleton
                  variant="text"
                  width="40%"
                  height={24}
                  animation="pulse"
                />
                <Skeleton
                  variant="text"
                  width="60%"
                  height={18}
                  animation="pulse"
                />
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Fade>
  )
}
