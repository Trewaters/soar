import { Container, Typography, Stack } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { SessionProvider } from 'next-auth/react'
import ProfileNavMenu from '@app/navigator/profile/ProfileNavMenu'
import { auth } from '../../../../../auth'
import theme from '@styles/theme'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Link from 'next/link'

export const metadata = {
  title: 'Legal & Community | Uvuyoga',
  description:
    'Legal information and community guidelines for Uvuyoga yoga application.',
}

export default async function LegalPage() {
  const session = await auth()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SessionProvider session={session}>
        <Grid container spacing={4}>
          {/* Profile Navigation Menu */}
          <Grid size={{ xs: 12, md: 4 }}>
            <ProfileNavMenu />
          </Grid>

          {/* Legal Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              {/* Back Button */}
              <Link
                href="/navigator/profile/settings"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: theme.palette.primary.main,
                  width: 'fit-content',
                }}
              >
                <ArrowBackIcon sx={{ mr: 1 }} />
                <Typography variant="body1">Back</Typography>
              </Link>

              {/* Page Title */}
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  color: theme.palette.success.main,
                  textAlign: 'center',
                  mb: 2,
                }}
              >
                Legal
              </Typography>

              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 400,
                  color: 'text.primary',
                  mb: 2,
                }}
              >
                Legal & Community
              </Typography>

              {/* Terms of Service */}
              <Link
                href="/compliance/terms"
                style={{
                  textDecoration: 'underline',
                  color: 'inherit',
                  display: 'block',
                  marginBottom: '16px',
                }}
              >
                <Typography variant="body1">Terms of Service</Typography>
              </Link>

              {/* Privacy Policy */}
              <Link
                href="/navigator/profile/privacy-policy"
                style={{
                  textDecoration: 'underline',
                  color: 'inherit',
                  display: 'block',
                  marginBottom: '16px',
                }}
              >
                <Typography variant="body1">Privacy Policy</Typography>
              </Link>

              {/* Community Guidelines */}
              <Link
                href="/navigator/profile/settings/legal/community-guidelines"
                style={{
                  textDecoration: 'underline',
                  color: 'inherit',
                  display: 'block',
                }}
              >
                <Typography variant="body1">Community Guidelines</Typography>
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </SessionProvider>
    </Container>
  )
}
