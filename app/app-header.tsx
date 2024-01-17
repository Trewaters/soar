import TopNav from '@/pages/top-nav'
import { Stack, Typography } from '@mui/material'

export function AppHeader() {
  return (
    <Stack direction="row" justifyContent="space-between">
      <TopNav />
      <Stack>
        <Typography variant="h3">Soar App</Typography>
      </Stack>
    </Stack>
  )
}
