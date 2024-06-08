// pages/login.tsx

import { Typography } from '@mui/material'
import AuthButtons from './AuthButtons'
import LoginForm from './LoginForm'

const LoginPage = () => {
  return (
    <div>
      <h1>Login</h1>
      <Typography variant="h6">Auth Buttons</Typography>
      <AuthButtons />
      <Typography variant="h6">Login Form</Typography>
      <LoginForm />
    </div>
  )
}

export default LoginPage
