import { Stack } from '@mui/material'
import UserButton from '@serverComponents/user-button'

export default function SignIn() {
  return (
    <Stack textAlign={'center'} spacing={2} sx={{ my: 6 }}>
      <UserButton />
    </Stack>
  )
}
