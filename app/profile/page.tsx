import UserDetails from '@app/userManagement/UserDetails'
import { auth } from '@auth'
import { Box } from '@mui/material'
import { SessionProvider } from 'next-auth/react'

export default async function Page() {
  const session = await auth()
  return (
    <Box display={'flex'} justifyContent={'center'} marginTop={4}>
      <SessionProvider basePath={'/auth'} session={session}>
        <UserDetails />
      </SessionProvider>
    </Box>
  )
}
