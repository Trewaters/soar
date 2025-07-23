import { Box, Container } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { SessionProvider } from 'next-auth/react'
import UserDetails from '@app/navigator/profile/UserDetails'
import ProfileNavMenu from '@app/navigator/profile/ProfileNavMenu'
import { auth } from '../../../auth'

export default async function Page() {
  const session = await auth()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SessionProvider session={session}>
        <Grid container spacing={4}>
          {/* Profile Navigation Menu */}
          <Grid size={{ xs: 12, md: 4 }}>
            <ProfileNavMenu />
          </Grid>

          {/* Main Profile Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              flexDirection={'column'}
            >
              <UserDetails />
            </Box>
          </Grid>
        </Grid>
      </SessionProvider>
    </Container>
  )
}
