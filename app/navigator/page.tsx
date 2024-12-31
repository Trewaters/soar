import CurrentTime from '@app/clientComponents/current-time'
import TabHeader from '@app/clientComponents/tab-header'
import { Box, Typography } from '@mui/material'

export default function Page() {
  return (
    <>
      <Box
        textAlign="center"
        sx={{ marginTop: 4 }}
        role="main"
        aria-labelledby="page-title"
      >
        <Typography variant="body1" id="page-title">
          Like a leaf on the Wind
        </Typography>
        <CurrentTime />
      </Box>
      <TabHeader />
    </>
  )
}
