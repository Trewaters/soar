'use client'
import { useState, useEffect } from 'react'
import { DateTime } from 'luxon'
import Typography from '@mui/material/Typography'

export default function CurrentTime() {
  const [time, setTime] = useState(
    DateTime.now().toLocaleString(DateTime.TIME_WITH_SECONDS)
  )
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const timer = setInterval(() => {
      setTime(DateTime.now().toLocaleString(DateTime.TIME_WITH_SECONDS))
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  if (!isMounted) return null

  return <Typography variant="body1">{time}</Typography>
}
