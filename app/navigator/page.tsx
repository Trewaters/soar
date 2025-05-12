import React from 'react'
import CurrentTime from '@app/clientComponents/current-time'
import TabHeader from '@app/clientComponents/tab-header'
import { Box, Typography } from '@mui/material'
import Image from 'next/image'

export default function Page() {
  return (
    <React.Fragment>
      <Box
        textAlign="center"
        sx={{ marginTop: 4 }}
        role="main"
        aria-labelledby="page-title"
      >
        <Image
          src={'/images/primary/Home-page-yogi.png'}
          width={207}
          height={207}
          quality={100}
          alt="Illustration of a person practicing yoga"
        />
        <Typography variant="body1" id="page-title" color="primary.main">
          Yoga Exercise
        </Typography>
        <CurrentTime />
      </Box>
      <nav aria-label="Tab Navigation">
        <TabHeader />
      </nav>
    </React.Fragment>
  )
}
