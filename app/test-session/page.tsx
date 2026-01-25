'use client'

import { useSession } from 'next-auth/react'
import { Box, Typography, Paper, Alert } from '@mui/material'

/**
 * Session Debug Page
 *
 * This page displays the current NextAuth session data to help diagnose
 * authentication and role-related issues.
 */
export default function SessionDebugPage() {
  const { data: session, status } = useSession()

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Session Debug Information
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This page shows your current session data. Use this to verify that user
        ID, email, and role are properly set.
      </Alert>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Session Status
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Status:</strong> {status}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          User Information
        </Typography>
        {session?.user ? (
          <Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>ID:</strong> {session.user.id || 'Not set'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> {session.user.email || 'Not set'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Name:</strong> {session.user.name || 'Not set'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Role:</strong> {(session.user as any).role || 'Not set'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Image:</strong> {session.user.image || 'Not set'}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No user data in session
          </Typography>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Full Session Data (JSON)
        </Typography>
        <Box
          component="pre"
          sx={{
            bgcolor: 'grey.100',
            p: 2,
            borderRadius: 1,
            overflow: 'auto',
            fontSize: '0.875rem',
          }}
        >
          {JSON.stringify({ session, status }, null, 2)}
        </Box>
      </Paper>
    </Box>
  )
}
