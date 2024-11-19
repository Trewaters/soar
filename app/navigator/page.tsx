import CurrentTime from '@app/clientComponents/current-time'
import TabHeader from '@app/clientComponents/tab-header'
import { Box, Typography } from '@mui/material'

export default function Page() {
  return (
    <>
      <Box textAlign="center" sx={{ marginTop: 4 }}>
        <Typography variant="body1">Like a leaf on the Wind</Typography>
        <CurrentTime />
      </Box>
      <TabHeader />
    </>
  )
}
