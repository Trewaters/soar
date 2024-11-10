import { auth } from '@auth'
import SignIn, { SignOut } from './auth-components'
import { Box, Link, Stack, Typography } from '@mui/material'

export default async function UserButton() {
  /*  
  Docs for `auth()` method v5: 
  * https://authjs.dev/getting-started/migrating-to-v5#authentication-methods
  */
  const session = await auth()

  if (!session?.user)
    return (
      <>
        {!session?.user && (
          <Box
            sx={{ pt: 4, pl: 4 }}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'flex-start'}
          >
            <Typography variant="h2">Welcome back 👋🏾</Typography>
            <Typography variant="body1" component="p">
              We&apos;re happy you&apos;re here!
            </Typography>
          </Box>
        )}
        <Stack>
          <SignIn />
        </Stack>
        <Stack>
          <Typography variant="subtitle1">sign in again 🔓</Typography>
          <Typography variant="body1">
            Don&apos;t have an account yet❔
          </Typography>
          <Typography variant="body1">
            Signing in will automatically create an account for you.
          </Typography>
        </Stack>
      </>
    )
  return (
    <>
      {session?.user && (
        <Box sx={{ pt: 4, pb: 3 }}>
          <Typography variant="h2">
            {session.user.name} you&apos;re signed in 🔆
          </Typography>
          <Typography variant="body1">
            If you don&apos;t get redirected. Click{' '}
            <Link href="http://localhost:3000/navigator">here</Link> to go to
            the home page.
          </Typography>
        </Box>
      )}
      <SignOut />
    </>
  )
}
