import { Box, Stack, Typography, Button } from '@mui/material'
import Header from '@serverComponents/header'
import Image from 'next/image'
import { signOut, signIn } from '@auth'

export default function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <>
      <nav>
        <Header />
      </nav>
      <Stack display={'flex'} alignItems={'center'}>
        <Stack flexDirection={'row'}>
          <Typography variant={'h1'}>SOAR</Typography>
          <Image
            src={'/icons/asanas/leaf-1.svg'}
            alt={'SOAR logo'}
            width={100}
            height={100}
          />
        </Stack>
        <Stack>
          <Typography variant={'subtitle1'}>A Happy Yoga App</Typography>
        </Stack>
      </Stack>
      <Stack justifyContent={'center'} alignItems={'center'} display={'flex'}>
        <Stack
          textAlign={'center'}
          spacing={2}
          sx={{
            my: 6,
            border: '1px solid black',
            width: '50%',
            borderRadius: '12px',
          }}
        >
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
          <Stack>
            <Typography variant="subtitle1">sign in again 🔓</Typography>
            <Typography variant="body1">
              Don&apos;t have an account yet❔
            </Typography>
            <Typography variant="body1">
              Signing in will automatically create an account for you.
            </Typography>
          </Stack>
          {/* <form
            action={async () => {
              'use server'
              await signOut()
            }}
          >
            <Button type="submit" variant="contained" {...props}>
              Sign Out
            </Button>
          </form> */}
          <form
            action={async () => {
              'use server'
              await signIn(provider)
            }}
          >
            <Button type="submit" variant="contained" {...props}>
              Sign In
            </Button>
          </form>
        </Stack>
      </Stack>
    </>
  )
}
