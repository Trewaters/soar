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

  // Timer functions
  const add5Minutes = () => {
    const fiveMinutesInSeconds = 5 * 60
    setTimerSeconds((prev) => prev + fiveMinutesInSeconds)

    if (!isTimerActive) {
      setIsTimerActive(true)
      startTimer()
    }
  }

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setIsTimerActive(false)
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

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
