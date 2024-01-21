'use client'
import { useState, useEffect } from 'react'
import { DateTime } from 'luxon'
import Typography from '@mui/material/Typography'

export default function CurrentTime() {
  const [time, setTime] = useState(
    DateTime.now().toLocaleString(DateTime.TIME_WITH_SECONDS)
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(DateTime.now().toLocaleString(DateTime.TIME_WITH_SECONDS))
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return <Typography variant="body1">{time as string}</Typography>
}
