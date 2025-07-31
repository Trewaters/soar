import { Box, Container, Typography, Paper, Stack } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { SessionProvider } from 'next-auth/react'
import ProfileNavMenu from '@app/navigator/profile/ProfileNavMenu'
import { auth } from '../../../../auth'

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
            <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
              <Stack spacing={3}>
                <Typography variant="h1" component="h1" gutterBottom>
                  Account Settings
                </Typography>

                <Typography variant="body1" color="text.secondary">
                  Account settings functionality is coming soon. This page will
                  include:
                </Typography>

                <Box component="ul" sx={{ pl: 3 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Privacy settings
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Notification preferences
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Account security options
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Data export and deletion
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Connected accounts management
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    <Box
                      component="a"
                      href="/navigator/profile/feedback"
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Send feedback to developer
                    </Box>
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    <Box
                      component="a"
                      href="/compliance/terms"
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Terms and conditions
                    </Box>
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    <Box
                      component="a"
                      href="/navigator/profile/privacy-policy"
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Privacy Policy
                    </Box>
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 3 }}
                >
                  For now, you can manage your profile information from the
                  Profile Overview page.
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </SessionProvider>
    </Container>
  )
}
