/**
 * Spacing Fix Test Component
 * This component tests various spacing values to ensure the theme fix works correctly
 */
import React from 'react'
import { Box, Typography, Container } from '@mui/material'

const SpacingTest = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Spacing Test - MUI Theme Fix Verification
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Integer Spacing Values:
        </Typography>
        <Box sx={{ p: 1, mb: 1, bgcolor: 'primary.light', color: 'white' }}>
          Padding: 1 (4px)
        </Box>
        <Box sx={{ p: 2, mb: 1, bgcolor: 'primary.main', color: 'white' }}>
          Padding: 2 (8px)
        </Box>
        <Box sx={{ p: 4, mb: 1, bgcolor: 'primary.dark', color: 'white' }}>
          Padding: 4 (16px)
        </Box>
        <Box sx={{ p: 20, mb: 1, bgcolor: 'secondary.main', color: 'black' }}>
          Padding: 20 (80px) - This was causing the original error
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Fractional Spacing Values:
        </Typography>
        <Box
          sx={{
            py: 0.5,
            px: 1.5,
            mb: 1,
            bgcolor: 'info.light',
            color: 'white',
          }}
        >
          Padding Y: 0.5 (2px), Padding X: 1.5 (6px)
        </Box>
        <Box
          sx={{ py: 1.5, px: 2.5, mb: 1, bgcolor: 'info.main', color: 'white' }}
        >
          Padding Y: 1.5 (6px), Padding X: 2.5 (10px)
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Margin Spacing:
        </Typography>
        <Box
          sx={{ mx: 4, my: 2, p: 2, bgcolor: 'success.main', color: 'white' }}
        >
          Margin X: 4 (16px), Margin Y: 2 (8px)
        </Box>
        <Box
          sx={{
            ml: 8,
            mr: 2,
            mt: 1,
            mb: 3,
            p: 2,
            bgcolor: 'success.dark',
            color: 'white',
          }}
        >
          Margin Left: 8 (32px), Margin Right: 2 (8px)
        </Box>
      </Box>

      <Typography
        variant="body1"
        sx={{ color: 'success.main', fontWeight: 'bold' }}
      >
        ✅ If you can see this page without MUI spacing errors in the console,
        the fix is working!
      </Typography>
    </Container>
  )
}

export default SpacingTest
