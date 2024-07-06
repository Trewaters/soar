import { auth } from '@/auth'
import SignIn, { SignOut } from './auth-components'
import { Avatar, Typography } from '@mui/material'

export default async function UserButton() {
  /*  
  Docs for `auth()` method v5: 
  * https://authjs.dev/getting-started/migrating-to-v5#authentication-methods
  */
  const session = await auth()

  if (!session?.user) return <SignIn />
  return (
    <div className="flex gap-2 items-center">
      <Avatar
        alt={session.user.name ?? ''}
        src={session.user.image ?? undefined}
      />
      {/* <Typography variant="body1">{session.user.email}</Typography> */}
      <Typography variant="body1">{session.user.name}</Typography>
      <SignOut />
    </div>
  )
}
