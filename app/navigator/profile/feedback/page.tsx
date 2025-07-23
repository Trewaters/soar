import { Container, Typography, Paper } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { SessionProvider } from 'next-auth/react'
import { redirect } from 'next/navigation'
import ProfileNavMenu from '@app/navigator/profile/ProfileNavMenu'
import { auth } from '../../../../auth'
import FeedbackForm from './FeedbackForm'

export default async function FeedbackPage() {
  const session = await auth()

  // Protect this page - only accessible by signed-in users
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SessionProvider session={session}>
        <Grid container spacing={4}>
          {/* Profile Navigation Menu */}
          <Grid size={{ xs: 12, md: 4 }}>
            <ProfileNavMenu />
          </Grid>

          {/* Feedback Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h1" component="h1" gutterBottom>
                Send Feedback
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                We value your feedback! Help us improve your yoga experience by
                sharing your thoughts, suggestions, and any issues you&apos;ve
                encountered.
              </Typography>

              <FeedbackForm />
            </Paper>
          </Grid>
        </Grid>
      </SessionProvider>
    </Container>
  )
}
