// 'use client'
import UserDetails from '@app/userManagement/UserDetails'
import { auth } from '@auth'
import { SessionProvider } from 'next-auth/react'

export default async function page() {
  const session = await auth()
  return (
    <SessionProvider basePath={'/auth'} session={session}>
      <UserDetails />
    </SessionProvider>
  )
}
