'use client'
import React from 'react'
import { Box, Skeleton, Stack, SkeletonProps } from '@mui/material'

export interface LoadingSkeletonProps {
  type?: 'text' | 'list' | 'search' | 'card' | 'circular' | 'custom'
  height?: number | string
  width?: number | string
  lines?: number
  animation?: SkeletonProps['animation']
  sx?: any
}

export default function LoadingSkeleton({
  type = 'text',
  height = 40,
  width = '100%',
  lines = 3,
  animation = 'pulse',
  sx = {},
}: LoadingSkeletonProps) {
  const getSkeletonContent = () => {
    switch (type) {
      case 'search':
        return (
          <Stack
            spacing={2}
            sx={{
              marginX: 3,
              background: 'white',
              mb: '1em',
              width: { xs: '90vw', md: '40vw' },
              borderRadius: '12px',
              minHeight: '72px', // Ensure consistent height to prevent layout jump
              display: 'flex',
              justifyContent: 'center',
              ...sx,
            }}
          >
            <Skeleton
              variant="rounded"
              height={56}
              animation={animation}
              sx={{
                borderRadius: '12px',
                boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                margin: 2, // Add margin to match the Stack spacing
              }}
            />
          </Stack>
        )

      case 'list':
        return (
          <Stack spacing={1} sx={{ width, ...sx }}>
            {Array.from({ length: lines }).map((_, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  animation={animation}
                  sx={{ mr: 2 }}
                />
                <Stack spacing={0.5} sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width="80%"
                    animation={animation}
                    sx={{ fontSize: '1rem' }}
                  />
                  <Skeleton
                    variant="text"
                    width="60%"
                    animation={animation}
                    sx={{ fontSize: '0.875rem' }}
                  />
                </Stack>
              </Box>
            ))}
          </Stack>
        )

      case 'card':
        return (
          <Box
            sx={{
              width,
              borderRadius: '12px',
              p: 2,
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 48px 5px rgba(0, 0, 0, 0.1)',
              ...sx,
            }}
          >
            <Stack spacing={1}>
              <Skeleton
                variant="text"
                width="70%"
                animation={animation}
                sx={{ fontSize: '1.5rem' }}
              />
              {Array.from({ length: lines - 1 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="text"
                  width={index === lines - 2 ? '50%' : '90%'}
                  animation={animation}
                />
              ))}
            </Stack>
          </Box>
        )

      case 'circular':
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: height || 100,
              width,
              ...sx,
            }}
          >
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              animation={animation}
            />
          </Box>
        )

      case 'custom':
        return (
          <Skeleton
            variant="rectangular"
            width={width}
            height={height}
            animation={animation}
            sx={sx}
          />
        )

      case 'text':
      default:
        return (
          <Stack spacing={0.5} sx={{ width, ...sx }}>
            {Array.from({ length: lines }).map((_, index) => (
              <Skeleton
                key={index}
                variant="text"
                width={index === lines - 1 ? '70%' : '100%'}
                height={height}
                animation={animation}
              />
            ))}
          </Stack>
        )
    }
  }

  return getSkeletonContent()
}
