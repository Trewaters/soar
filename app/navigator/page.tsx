// import CurrentTime from '@app/clientComponents/current-time'
import TabHeader from '@app/clientComponents/tab-header'
import { Box, Typography } from '@mui/material'
import Image from 'next/image'
export default function Page() {
  return (
    <>
      <Box
        textAlign="center"
        sx={{ marginTop: 4 }}
        role="main"
        aria-labelledby="page-title"
      >
        <Image
          src={'/images/primary/Home-page-yogi.png'}
          alt="Home page yogi"
          width={207}
          height={207}
          quality={100}
        />
        {/* <Typography variant="body1" id="page-title">
          Like a leaf on the Wind
        </Typography> */}
        <Typography variant="body1" id="page-title">
          a yoga exercise app
        </Typography>
        {/* <CurrentTime /> */}
      </Box>
      <TabHeader />
    </>
  )
}
