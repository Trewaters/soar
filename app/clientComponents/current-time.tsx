"use client"
import { useState, useEffect } from "react"
import { DateTime } from "luxon"
import Typography from "@mui/material/Typography"
import { Box, Skeleton } from "@mui/material"

export default function CurrentTime() {
  const [time, setTime] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const timer = setInterval(() => {
      setTime(DateTime.now().toLocaleString(DateTime.TIME_WITH_SECONDS))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!isMounted)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "2em",
        }}
      >
        <Typography variant="body1">
          <Skeleton variant="text" sx={{ width: "10em" }} />
        </Typography>
      </Box>
    )

  return (
    <Box sx={{ display: "flex", justifyContent: "center", height: "2em" }}>
      <Typography variant="body1">
        {time || <Skeleton variant="text" sx={{ width: "10em" }} />}
      </Typography>
    </Box>
  )
}
