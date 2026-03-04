'use client'

import { Box, Button, Container, Stack, Typography } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'

export default function OfflinePage() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3} sx={{ textAlign: 'center' }}>
          <Typography variant="h1" gutterBottom>
            Offline Mode
          </Typography>
          <Typography variant="body1">
            You appear to be offline. Some features may be unavailable.
          </Typography>
          <Typography variant="body1">
            We&apos;ll automatically sync and refresh when your connection
            returns.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => window.location.reload()}
            startIcon={<RefreshIcon />}
            sx={{
              mt: 2,
              alignSelf: 'center',
              px: 4,
              py: 1.5,
            }}
            aria-label="Retry loading the app"
          >
            Retry
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}
