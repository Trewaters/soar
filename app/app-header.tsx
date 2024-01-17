import TopNav from '@components/top-nav'
import { Stack, Typography } from '@mui/material'

export default function AppHeader() {
  return (
    <Stack direction="row" justifyContent="space-between">
      <TopNav />
      <Stack>
        <Typography variant="h3">Soar App</Typography>
      </Stack>
    </Stack>
  )
}
