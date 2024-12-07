"use client"
import React, { useEffect, useState } from "react"
import { Box, Stack, TextField, Button } from "@mui/material"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

const CredentialsInput: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const [isEmailValid, setIsEmailValid] = useState(false)

  const checkEmailExists = async (email: string) => {
    const response = await fetch(
      `/api/user/fetchAccount?email=${encodeURIComponent(email)}`
    )
    const user = await response.json()
    // console.log('user:', user)
    if (user.error) setIsEmailValid(false)
    else setIsEmailValid(true)
  }
  useEffect(() => {
    checkEmailExists(email)
    console.log("email exists:", isEmailValid)
  }, [email, isEmailValid])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })
      if (result?.error) {
        router.push(`${process.env.SIGNIN_ERROR_URL}?error=${result.error}`)
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("An unexpected error happened:", error)
    }
  }

  return (
    <Box
      component={"form"}
      noValidate
      autoComplete={"off"}
      onSubmit={handleSubmit}
      my={3}
    >
      <Stack spacing={2}>
        <TextField
          onChange={async (e) => {
            const email = e.target.value
            setEmail(email)
            await checkEmailExists(email)
          }}
          label="Email"
          type="email"
          autoComplete="current-email"
          error={!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)}
        />

        {/* 
        Change button to Sign Up if the user doesn't exist.
        Allow user to input password. 
        Pass the password to the Auth provider.
        */}
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {isEmailValid ? (
          <Button type="submit" variant="contained" color="primary">
            Sign In
          </Button>
        ) : (
          <Button type="submit" variant="contained" color="primary">
            Sign Up
          </Button>
        )}
        <Button
          variant="text"
          color="secondary"
          onClick={() => router.push("/auth/passwordRecovery")}
        >
          Forgot Password?
        </Button>
      </Stack>
    </Box>
  )
}

export default CredentialsInput
