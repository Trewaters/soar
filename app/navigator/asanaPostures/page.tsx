'use client'
import { useEffect, useState, useRef } from 'react'
import PostureSearch from '@app/navigator/asanaPostures/posture-search'
import { Box, Button, CircularProgress, Typography, Paper } from '@mui/material'
import { FullAsanaData } from '@context/AsanaPostureContext'
import SplashHeader from '@app/clientComponents/splash-header'
import { useRouter } from 'next/navigation'
import NavBottom from '@serverComponents/navBottom'
import TimerIcon from '@mui/icons-material/Timer'

export default function Page() {
  const [posturePropData, setPosturePropData] = useState<FullAsanaData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [timerEndTime, setTimerEndTime] = useState<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/poses', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      // setPosturePropData(await response.json())
      setPosturePropData(
        (await response.json()).sort((a: FullAsanaData, b: FullAsanaData) => {
          if (a.sort_english_name < b.sort_english_name) return -1
          if (a.sort_english_name > b.sort_english_name) return 1
          return 0
        })
      )
    } catch (error: Error | any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Timer functions with timestamp-based approach for mobile device sleep handling
  const add5Minutes = () => {
    const fiveMinutesInMs = 5 * 60 * 1000
    const now = Date.now()

    if (isTimerActive && timerEndTime) {
      // Add 5 minutes to existing timer
      setTimerEndTime(timerEndTime + fiveMinutesInMs)
    } else {
      // Start new timer
      const endTime = now + fiveMinutesInMs
      setTimerEndTime(endTime)
      setIsTimerActive(true)
      startTimer(endTime)
    }
  }

  const startTimer = (endTime: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    const updateTimer = () => {
      const now = Date.now()
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000))

      setTimerSeconds(remaining)

      if (remaining <= 0) {
        setIsTimerActive(false)
        setTimerEndTime(null)
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
        // Optional: Show notification or sound when timer completes
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Timer Complete!', {
            body: 'Your yoga timer has finished.',
            icon: '/favicon.ico',
          })
        }
      }
    }

    // Update immediately
    updateTimer()

    // Then update every second
    timerRef.current = setInterval(updateTimer, 1000)
  }

  // Handle page visibility changes (when user switches apps or locks device)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isTimerActive && timerEndTime) {
        // Page became visible again, recalculate timer
        const now = Date.now()
        const remaining = Math.max(0, Math.ceil((timerEndTime - now) / 1000))
        setTimerSeconds(remaining)

        if (remaining <= 0) {
          setIsTimerActive(false)
          setTimerEndTime(null)
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
        } else {
          // Restart the interval with correct time
          startTimer(timerEndTime)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isTimerActive, timerEndTime])

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh', // Ensure full viewport height
          paddingBottom: { xs: '80px', sm: '80px' }, // Extra padding for mobile to ensure content is above nav
        }}
      >
        <SplashHeader
          src={'/images/asana-postures-splash-header.png'}
          alt={'Asanas'}
          title="Asanas"
        />
        <Box height={'32px'} />

        {/* Quick Timer Section */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            backgroundColor: 'background.paper',
            minHeight: '120px', // Ensure minimum height visibility
            width: '100%',
            maxWidth: '400px',
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            startIcon={<TimerIcon />}
            onClick={add5Minutes}
            sx={{
              minWidth: '150px',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            +5 Minutes
          </Button>

          {isTimerActive && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {formatTime(timerSeconds)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Time Remaining
              </Typography>
            </Box>
          )}
        </Paper>

        {loading ? (
          <CircularProgress sx={{ backgroundColor: 'transparent' }} />
        ) : (
          <PostureSearch posturePropData={posturePropData} />
        )}
        {error && <Typography color="error">Error: {error}</Typography>}
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 3 }}
          onClick={() => router.push('/navigator/asanaPostures/createAsana')}
        >
          <Typography whiteSpace={'nowrap'}>Create Asana Posture</Typography>
        </Button>
      </Box>
      <NavBottom subRoute="/navigator/asanaPostures" />
    </>
  )
}
