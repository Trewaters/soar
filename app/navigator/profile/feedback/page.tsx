import { Container, Typography, Paper } from '@mui/material'
import Grid from '@mui/material/Grid2'
import ProfileNavMenu from '@app/navigator/profile/ProfileNavMenu'
import FeedbackForm from './FeedbackForm'

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
    </Container>
  )
}
