'use client'
import { auth } from '@auth'
import { Box, Stack } from '@mui/material'
import { SessionProvider } from 'next-auth/react'
import UserDetails from './UserDetails'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default async function Page() {
  const session = await auth()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
  })

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
      </SessionProvider>
    </Box>
  )
}
