import React from 'react'
import { Box, Typography } from '@mui/material'
import TabHeader from '@components/tab-header'
import CurrentTime from '@components/current-time'
import LoginPage from './userManagement/LoginPage'

export default async function Home() {
  return (
    <>
      <LoginPage />
      <Box textAlign="center">
        <Typography variant="body1">Like a leaf on the Wind</Typography>
        <CurrentTime />
      </Box>
      <TabHeader />
    </>
  )
}
