import { auth } from '@/auth'
import SignIn, { SignOut } from './auth-components'
import { Box, Typography } from '@mui/material'

export default async function UserButton() {
  /*  
  Docs for `auth()` method v5: 
  * https://authjs.dev/getting-started/migrating-to-v5#authentication-methods
  */
  const session = await auth()

  if (!session?.user)
    return (
      <>
        <SignIn />
        {!session?.user && (
          <Box sx={{ pt: 4 }} display={'flex'} flexDirection={'column'}>
            <Typography variant="h2">Good Bye 👋🏾</Typography>
            <Typography variant="h2">or</Typography>
            <Typography variant="h2">sign in again 🔓</Typography>
          </Box>
        )}
      </>
    )
  return (
    <>
      <SignOut />
      {session?.user && (
        <Box sx={{ pt: 4 }}>
          <Typography variant="h2">Welcome 🔆</Typography>
          <Typography variant="h2">{session.user.name}</Typography>
        </Box>
      )}
    </>
  )
}
