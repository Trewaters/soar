import CurrentTime from '@app/clientComponents/current-time'
import TabHeader from '@app/clientComponents/tab-header'
import { auth } from '@auth'
import { Box, Typography } from '@mui/material'
import { SessionProvider } from 'next-auth/react'

export default async function Page() {
  const session = await auth()

  return (
    <SessionProvider basePath={'/auth'} session={session}>
      <Box textAlign="center" sx={{ marginTop: 4 }}>
        <Typography variant="body1">Like a leaf on the Wind</Typography>
        <CurrentTime />
      </Box>
      <TabHeader />
    </SessionProvider>
  )
}
