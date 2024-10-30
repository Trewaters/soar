import { Stack } from '@mui/material'
import UserButton from '@serverComponents/user-button'

export default function SignIn() {
  return (
    <Stack justifyContent={'center'} alignItems={'center'} display={'flex'}>
      <Stack
        textAlign={'center'}
        spacing={2}
        sx={{
          my: 6,
          border: '1px solid black',
          width: '50%',
          borderRadius: '12px',
        }}
      >
        <UserButton />
      </Stack>
    </Stack>
  )
}
