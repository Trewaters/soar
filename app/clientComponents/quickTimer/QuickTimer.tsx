'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Box, Button, Typography, Paper } from '@mui/material'
import TimerIcon from '@mui/icons-material/Timer'

export interface QuickTimerProps {
  /** Custom button text (default: "+5 Minutes") */
  buttonText?: string
  /** Timer duration in minutes (default: 5) */
  timerMinutes?: number
  /** Custom styling for the container */
  sx?: object
  /** Callback when timer starts */
  onTimerStart?: () => void
  /** Callback when timer ends */
  onTimerEnd?: () => void
  /** Callback with remaining seconds on each update */
  onTimerUpdate?: (_remainingSeconds: number) => void
  /** Show/hide the timer display when active (default: true) */
  showTimeDisplay?: boolean
  /** Variant for different layouts */
  variant?: 'default' | 'compact' | 'minimal'
  /** Maximum width of the component */
  maxWidth?: string | number
}

export default function QuickTimer({
  buttonText = '+5 Minutes',
  timerMinutes = 5,
  sx = {},
  onTimerStart,
  onTimerEnd,
  onTimerUpdate,
  showTimeDisplay = true,
  variant = 'default',
  maxWidth = '400px',
}: QuickTimerProps) {
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [timerEndTime, setTimerEndTime] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(
    (endTime: number) => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      const updateTimer = () => {
        const now = Date.now()
        const remaining = Math.max(0, Math.ceil((endTime - now) / 1000))

        setTimerSeconds(remaining)
        onTimerUpdate?.(remaining)

        if (remaining <= 0) {
          setIsTimerActive(false)
          setTimerEndTime(null)
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }

          // Show notification when timer completes
          if (
            'Notification' in window &&
            Notification.permission === 'granted'
          ) {
            new Notification('Timer Complete!', {
              body: 'Your timer has finished.',
              icon: '/favicon.ico',
            })
          }

          onTimerEnd?.()
        }
      }

      // Update immediately
      updateTimer()

      // Then update every second
      timerRef.current = setInterval(updateTimer, 1000)
    },
    [onTimerUpdate, onTimerEnd]
  )

  const addTimer = () => {
    const timerDurationInMs = Math.max(0, timerMinutes * 60 * 1000)
    const now = Date.now()

    if (isTimerActive && timerEndTime) {
      // Add time to existing timer
      const newEndTime = timerEndTime + timerDurationInMs
      setTimerEndTime(newEndTime)
      startTimer(newEndTime) // Restart the timer with the new end time
    } else {
      // Start new timer
      const endTime = now + timerDurationInMs
      setTimerEndTime(endTime)
      setIsTimerActive(true)

      // For zero or very short timers, ensure we show the display briefly
      if (timerDurationInMs === 0) {
        setTimerSeconds(0)
        onTimerUpdate?.(0)

        // Use setTimeout to allow display to render before ending
        setTimeout(() => {
          setIsTimerActive(false)
          setTimerEndTime(null)
          onTimerEnd?.()
        }, 100)
      } else {
        startTimer(endTime)
      }

      onTimerStart?.()
    }
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
          onTimerEnd?.()
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
  }, [isTimerActive, timerEndTime, onTimerEnd, startTimer])

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getContainerStyles = () => {
    const baseStyles = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth,
      ...sx,
    }

    switch (variant) {
      case 'compact':
        return {
          ...baseStyles,
          p: 1.5,
          mb: 2,
          borderRadius: 1,
          gap: 1,
          minHeight: '80px',
        }
      case 'minimal':
        return {
          ...baseStyles,
          p: 1,
          gap: 1,
          minHeight: 'auto',
        }
      default:
        return {
          ...baseStyles,
          p: 2,
          mb: 3,
          borderRadius: 2,
          gap: 2,
          minHeight: '120px',
        }
    }
  }

  const getButtonSize = () => {
    switch (variant) {
      case 'compact':
      case 'minimal':
        return { minWidth: '120px', fontSize: '0.875rem' }
      default:
        return { minWidth: '150px', fontSize: '1rem', fontWeight: 'bold' }
    }
  }

  const TimerButton = () => (
    <Button
      variant="contained"
      color="secondary"
      startIcon={<TimerIcon />}
      onClick={addTimer}
      sx={getButtonSize()}
    >
      {buttonText}
    </Button>
  )

  const TimerDisplay = () => {
    if (!isTimerActive || !showTimeDisplay) return null

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: variant === 'minimal' ? 0.5 : 1,
        }}
      >
        <Typography
          variant={variant === 'minimal' ? 'h6' : 'h4'}
          color="primary.main"
          fontWeight="bold"
        >
          {formatTime(timerSeconds)}
        </Typography>
        <Typography
          variant={variant === 'minimal' ? 'caption' : 'body2'}
          color="text.secondary"
        >
          Time Remaining
        </Typography>
      </Box>
    )
  }

  if (variant === 'minimal') {
    return (
      <Box sx={getContainerStyles()}>
        <TimerButton />
        <TimerDisplay />
      </Box>
    )
  }

  return (
    <Paper elevation={variant === 'compact' ? 1 : 2} sx={getContainerStyles()}>
      <TimerButton />
      <TimerDisplay />
    </Paper>
  )
}
