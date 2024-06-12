import { Typography } from '@mui/material'
import AuthButtons from './AuthButtons'
import LoginForm from './LoginForm'
/*  
connecting Nextauth

https://next-auth.js.org/getting-started/client
https://next-auth.js.org/getting-started/example

*/
const LoginPage = () => {
  return (
    <>
      <Typography variant="h6">Auth Buttons</Typography>
      <AuthButtons />
      <Typography variant="h6">Login</Typography>
      <LoginForm />
    </>
  )
}

export default LoginPage
