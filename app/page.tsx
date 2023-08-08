import Head from 'next/head';
import LandingPage from '../components/LandingPage'
import { Box, Paper } from '@mui/material';

export default async function Home() {

  return (
    <>
      <Head>
        <title>Happy Yoga &quot;Soar&quot;</title>
      </Head>
      <Box sx={{ display: 'flex', justifyContent: 'center', bgcolor: 'lightgray' }}>
        <Paper>
          <LandingPage />
        </Paper>
      </Box>

    </>
  )
}
