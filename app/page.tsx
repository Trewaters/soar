import React from 'react'
import { Box, Typography } from '@mui/material'
import TabHeader from '@components/tab-header'
import CurrentTime from '@components/current-time'
import { auth } from 'auth'
import { SessionProvider } from 'next-auth/react'

export default async function Home() {
  const session = await auth()
  return (
    <>
      <SessionProvider basePath={'/auth'} session={session}>
        <Box textAlign="center">
          <Typography variant="body1">Like a leaf on the Wind</Typography>
          <CurrentTime />
        </Box>
        <TabHeader />
      </SessionProvider>
    </>
  )
}
