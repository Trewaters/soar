import React from 'react'
import Head from 'next/head'
import { Box, Typography } from '@mui/material'
import TabHeader from '@components/tab-header'
import CurrentTime from '@components/current-time'

export default function Home() {
  return (
    <>
      <Box textAlign="center">
        <Head>
          <title>Happy Yoga</title>
          <meta name="description" content="Soar like a leaf on the wind!" />
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <Typography variant="body1">Like a leaf on the wind</Typography>
        <Typography variant="body1">The 8 Limbs of Yoga </Typography>
        <CurrentTime />
      </Box>
      <TabHeader />
    </>
  )
}
