import Head from 'next/head';
import LandingPage from './component/LandingPage'
import MenuPlanner from './component/MenuPlanner'
import PostureSearch from '../pages/components/PosturesSearch'
import postureData from '../interfaces/postureData';
import { Box, Paper } from '@mui/material';

export default async function Home() {

  return (
    <>
      <Head>
        <title>Happy Yoga &quot;Soar&quot;</title>
      </Head>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: 360, bgcolor: 'lightgray' }}>
        <Paper>
          <LandingPage />
        </Paper>
      </Box>

    </>
  )
}
