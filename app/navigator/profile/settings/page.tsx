import { Container, Typography, Paper, Stack, Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { SessionProvider } from 'next-auth/react'
import ProfileNavMenu from '@app/navigator/profile/ProfileNavMenu'
import { auth } from '../../../../auth'
import theme from '@styles/theme'
import DownloadDataButton from '@clientComponents/DownloadDataButton'

export default async function SettingsPage() {
  const session = await auth()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SessionProvider session={session}>
        <Grid container spacing={4}>
          {/* Profile Navigation Menu */}
          <Grid size={{ xs: 12, md: 4 }}>
            <ProfileNavMenu />
          </Grid>

          {/* Settings Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <Typography
                variant="h1"
                component="h1"
                sx={{ color: theme.palette.success.main, textAlign: 'center' }}
                gutterBottom
              >
                Account Settings
              </Typography>

              {/* Privacy */}
              <Paper
                component="a"
                href="/navigator/profile/settings/legal"
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'all 0.2s',
                  '&:hover': {
                    elevation: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    textAlign: 'center',
                  }}
                >
                  Legal &amp; Community
                </Typography>
              </Paper>

              {/* Privacy Settings */}
              <Paper
                component="a"
                href="/navigator/profile/privacy-settings"
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'all 0.2s',
                  '&:hover': {
                    elevation: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    textAlign: 'center',
                  }}
                >
                  Privacy Settings
                </Typography>
              </Paper>

              {/* Notifications */}
              <Paper
                component="a"
                href="/navigator/profile/settings/notifications"
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'all 0.2s',
                  '&:hover': {
                    elevation: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    textAlign: 'center',
                  }}
                >
                  Notification Preferences
                </Typography>
              </Paper>

              {/* Account Security */}
              <Paper
                component="a"
                href="/navigator/profile/settings/account-security"
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'all 0.2s',
                  '&:hover': {
                    elevation: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    textAlign: 'center',
                  }}
                >
                  Account Security
                </Typography>
              </Paper>

              {/* Connected Accounts */}
              <Paper
                component="a"
                href="/navigator/profile/settings/connected-accounts"
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'all 0.2s',
                  '&:hover': {
                    elevation: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    textAlign: 'center',
                  }}
                >
                  Connected Accounts
                </Typography>
              </Paper>

              {/* Send Feedback */}
              <Paper
                component="a"
                href="/navigator/profile/feedback"
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'all 0.2s',
                  '&:hover': {
                    elevation: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    textAlign: 'center',
                  }}
                >
                  Send Feedback to Developer
                </Typography>
              </Paper>

              {/* Download My Data - GDPR Compliant */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: 'success.main',
                  backgroundColor: 'success.light',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    mb: 1,
                    textAlign: 'center',
                  }}
                >
                  Download My Data
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 2, textAlign: 'center' }}
                >
                  Get a complete copy of your personal information in JSON
                  format.
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    mb: 2,
                    display: 'block',
                    textAlign: 'center',
                  }}
                >
                  GDPR-compliant data export (Article 15 & 20)
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <DownloadDataButton />
                </Box>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </SessionProvider>
    </Container>
  )
}
