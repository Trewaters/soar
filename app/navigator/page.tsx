import CurrentTime from '@app/clientComponents/current-time'
import TabHeader from '@app/clientComponents/tab-header'
import { Box, Typography } from '@mui/material'
import Image from '@node_modules/next/image'

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
          alt="Like a leaf on the Wind"
          width={207}
          height={207}
        />
        <Typography variant="body1" id="page-title" color="primary.main">
          yoga exercise
        </Typography>
        <CurrentTime />
      </Box>
      <TabHeader />
    </>
  )
}
