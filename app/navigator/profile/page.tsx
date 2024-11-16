'use client'
import { Box, Stack } from '@mui/material'
import { getSession, SessionProvider } from 'next-auth/react'
import UserDetails from './UserDetails'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { get } from 'http'

export default function Page() {
  let session: any
  const router = useRouter()

  function assignSession() {
    session = getSession()
  }

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
    assignSession()
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
