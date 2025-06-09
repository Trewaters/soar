import { Box } from '@mui/material'
import { SessionProvider } from 'next-auth/react'
import UserDetails from '@app/navigator/profile/UserDetails'
import { auth } from '../../../auth'

export default async function Page() {
  const session = await auth()

  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      flexDirection={'column'}
      marginTop={4}
    >
      <SessionProvider session={session}>
        <UserDetails />
      </SessionProvider>
    </Box>
  )
}
