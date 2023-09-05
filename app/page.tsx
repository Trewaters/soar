import LandingPage from '../components/LandingPage'
import { Box, Paper } from '@mui/material';
import RootLayout from '@/app/layout';
import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Happy Yoga &quot;Soar&quot;',
}

export default function Home() {

  return (
    <RootLayout>
      <Box sx={{ display: 'flex', justifyContent: 'center', bgcolor: 'lightgray' }}>
        <Paper>
          <LandingPage />
        </Paper>
      </Box>
    </RootLayout>
  )
}