import { UserStateProvider } from '@app/context/UserContext'
import UserDetails from '@app/userManagement/UserDetails'
import { auth } from '@auth'
import { SessionProvider } from 'next-auth/react'

export default async function Page() {
  const session = await auth()
  return (
    <SessionProvider basePath={'/auth'} session={session}>
      <UserStateProvider>
        <UserDetails />
      </UserStateProvider>
    </SessionProvider>
  )
}
