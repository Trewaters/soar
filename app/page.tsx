import Head from 'next/head';
import LandingPage from './component/LandingPage'
import MenuPlanner from './component/MenuPlanner'
import PostureSearch from '../pages/components/PosturesSearch'
import postureData from '../interfaces/postureData';
import { Box, Paper } from '@mui/material';
/* 
async function getData() {
  const res = await fetch('https://www.pocketyoga.com/poses.json')
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  const postureProps = await res.json();

  // Recommendation: handle errors
  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
  }

  // return res.json()
  return postureProps
}
 */

export default async function Home() {
  // const posturePropData: postureData[] = await getData()

  return (
    <>
      <Head>
        <title>Happy Yoga &quot;Soar&quot;</title>
      </Head>
      <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'lightgray' }}>
        <Paper>
          <LandingPage />
        </Paper>
      </Box>

    </>
  )
}
