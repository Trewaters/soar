"use client"
import React from "react"
import { Box, Button, Stack, Typography } from "@mui/material"
import Header from "@serverComponents/header"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function SignOutPage() {
  const router = useRouter()
  return (
    <>
      <nav>
        <Header />
      </nav>
      <Stack display={"flex"} alignItems={"center"}>
        <Stack flexDirection={"row"}>
          <Image
            src={"/icons/asanas/leaf-1.svg"}
            alt={"SOAR logo"}
            width={100}
            height={100}
          />
        </Stack>
        <Stack>
          <Typography variant={"subtitle1"}>An Uvuyoga App</Typography>
        </Stack>
      </Stack>
      <Stack justifyContent={"center"} alignItems={"center"} display={"flex"}>
        <Stack
          textAlign={"center"}
          spacing={2}
          sx={{
            my: 6,
            border: "1px solid black",
            width: "50%",
            borderRadius: "12px",
          }}
        >
          <Box sx={{ pt: 4, pb: 3 }}>
            <Typography color="success.main" variant="h2">
              You&apos;re signed out!
            </Typography>
            <Typography variant="body1">
              Come back soon to continue your yoga journey!
            </Typography>
          </Box>
          <Button
            type="submit"
            variant="outlined"
            sx={{ my: 2, borderRadius: "12px" }}
            onClick={() => {
              router.push("/")
            }}
          >
            <Typography>Go back to the home page</Typography>
          </Button>
          <Button
            type="submit"
            variant="outlined"
            sx={{ my: 2, borderRadius: "12px" }}
            onClick={() => {
              router.push("/auth/signin")
            }}
          >
            <Typography>Sign in again!</Typography>
          </Button>
        </Stack>
        <Stack textAlign={"center"} spacing={2} sx={{ my: 6 }}></Stack>
      </Stack>
    </>
  )
}
