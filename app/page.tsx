import Head from 'next/head';
import LandingPage from '../components/LandingPage'
import { Box, Paper } from '@mui/material';
import RootLayout from '@/app/layout';



export default function Home() {


  return (
    <RootLayout>
      <Head>
        <title>Happy Yoga &quot;Soar&quot;</title>
      </Head>
      <Box sx={{ display: 'flex', justifyContent: 'center', bgcolor: 'lightgray' }}>
        <Paper>
          <LandingPage />
        </Paper>
      </Box>
    </RootLayout>
  )
}
