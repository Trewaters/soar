import {
  Container,
  Typography,
  Paper,
  Stack,
  Box,
  IconButton,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { SessionProvider } from 'next-auth/react'
import ProfileNavMenu from '@app/navigator/profile/ProfileNavMenu'
import NotificationSettingsWrapper from '@app/clientComponents/NotificationSettingsWrapper'
import { auth } from '../../../../../auth'
import theme from '@styles/theme'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Link from 'next/link'

export default async function NotificationSettingsPage() {
  const session = await auth()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SessionProvider session={session}>
        <Grid container spacing={4}>
          {/* Profile Navigation Menu */}
          <Grid size={{ xs: 12, md: 4 }}>
            <ProfileNavMenu />
          </Grid>

          {/* Notification Settings Content */}
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
                    fontSize: { xs: '1.75rem', md: '2.5rem' },
                  }}
                >
                  Notification Preferences
                </Typography>
              </Box>

              <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
                <Stack spacing={3}>
                  <Typography variant="body1" color="text.secondary">
                    Configure your yoga practice reminders and notification
                    preferences. Stay consistent with your practice through
                    personalized notifications.
                  </Typography>

                  {/* Integrated Notification Settings */}
                  <NotificationSettingsWrapper />
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </SessionProvider>
    </Container>
  )
}
