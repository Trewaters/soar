import { auth } from '@auth'
import { Box, Stack } from '@mui/material'
import { SessionProvider } from 'next-auth/react'
import UserDetails from './UserDetails'
import SignIn, { SignOut } from '@serverComponents/auth-components'

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
      <SessionProvider basePath={'/auth'} session={session}>
        <Stack>
          <UserDetails />
        </Stack>
        {session ? (
          <Stack>
            <SignOut />
          </Stack>
        ) : (
          <Stack>
            <SignIn />
          </Stack>
        )}
      </SessionProvider>
    </Box>
  )
}
