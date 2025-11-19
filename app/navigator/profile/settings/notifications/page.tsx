import { Container, Typography, Paper, Stack } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { SessionProvider } from 'next-auth/react'
import ProfileNavMenu from '@app/navigator/profile/ProfileNavMenu'
import NotificationSettingsWrapper from '@app/clientComponents/NotificationSettingsWrapper'
import { auth } from '../../../../../auth'

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
            <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
              <Stack spacing={3}>
                <Typography variant="h1" component="h1" gutterBottom>
                  Notification Preferences
                </Typography>

                <Typography variant="body1" color="text.secondary">
                  Configure your yoga practice reminders and notification
                  preferences. Stay consistent with your practice through
                  personalized notifications.
                </Typography>

                {/* Integrated Notification Settings */}
                <NotificationSettingsWrapper />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </SessionProvider>
    </Container>
  )
}
