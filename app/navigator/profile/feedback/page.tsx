'use client'

import {
  Container,
  Typography,
  Paper,
  Box,
  IconButton,
  Stack,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import ProfileNavMenu from '@app/navigator/profile/ProfileNavMenu'
import FeedbackForm from './FeedbackForm'
import theme from '@styles/theme'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Link from 'next/link'

export default function FeedbackPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Navigation Menu */}
        <Grid size={{ xs: 12, md: 4 }}>
          <ProfileNavMenu />
        </Grid>

        {/* Feedback Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Header with Back Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                component={Link}
                href="/navigator/profile/settings"
                sx={{
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.light',
                  },
                }}
                aria-label="Back to Account Settings"
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  color: theme.palette.success.main,
                }}
              >
                Send Feedback
              </Typography>
            </Box>

            <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
              <Stack spacing={3}>
                <Typography variant="body1" color="text.secondary">
                  We value your feedback! Help us improve your yoga experience
                  by sharing your thoughts, suggestions, and any issues
                  you&apos;ve encountered.
                </Typography>

                <FeedbackForm />
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  )
}
