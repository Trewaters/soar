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
            <Typography variant="h3" component="p">
              or
            </Typography>
            <Typography variant="subtitle1">sign in again 🔓</Typography>
            <Typography variant="body1">
              Don&apos;t have an account yet❔Click sign in to create one
            </Typography>
          </Box>
        )}
      </>
    )
  return (
    <>
      {session?.user && (
        <Box sx={{ pt: 4, pb: 3 }}>
          <Typography variant="h2">Welcome back 🔆</Typography>
          <Typography variant="subtitle1">
            We&apos;re happy you are here {session.user.name}
          </Typography>
        </Box>
      )}
      <SignOut />
    </>
  )
}
