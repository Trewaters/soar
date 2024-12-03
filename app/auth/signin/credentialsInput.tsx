'use client'
import React, { useState } from 'react'
import { Box, Stack, TextField, Button } from '@mui/material'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const CredentialsInput: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      if (result?.error) {
        router.push(`${process.env.SIGNIN_ERROR_URL}?error=${result.error}`)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('An unexpected error happened:', error)
    }
  }

  return (
    <Box
      component={'form'}
      noValidate
      autoComplete={'off'}
      onSubmit={handleSubmit}
    >
      <Stack spacing={2}>
        <TextField
          id="outlined-email-input"
          label="Email"
          type="email"
          autoComplete="current-email"
          error={!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)}
          helperText={
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
              ? 'Invalid email address'
              : ''
          }
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" disabled>
          Sign In
        </Button>
      </Stack>
    </Box>
  )
}

export default CredentialsInput
