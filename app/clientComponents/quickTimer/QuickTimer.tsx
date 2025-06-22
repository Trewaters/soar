'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box,
  Button,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Tooltip,
  Alert,
  Collapse,
} from '@mui/material'
import TimerIcon from '@mui/icons-material/Timer'
import NotificationsIcon from '@mui/icons-material/Notifications'
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'

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
  onTimerUpdate?: (remainingSeconds: number) => void
  /** Show/hide the timer display when active (default: true) */
  showTimeDisplay?: boolean
  /** Variant for different layouts */
  variant?: 'default' | 'compact' | 'minimal'
  /** Maximum width of the component */
  maxWidth?: string | number
  /** Enable notifications when timer completes (default: false) */
  enableNotifications?: boolean
  /** Show notification settings toggle (default: false) */
  showNotificationToggle?: boolean
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
  enableNotifications = false,
  showNotificationToggle = false,
}: QuickTimerProps) {
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [timerEndTime, setTimerEndTime] = useState<number | null>(null)
  const [notificationsEnabled, setNotificationsEnabled] =
    useState(enableNotifications)
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>('default')
  const [showPermissionAlert, setShowPermissionAlert] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  // Request notification permission when user opts in
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      setShowPermissionAlert(true)
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)

      if (permission === 'granted') {
        setNotificationsEnabled(true)
        return true
      } else if (permission === 'denied') {
        setShowPermissionAlert(true)
        setNotificationsEnabled(false)
        return false
      }
    } catch (error) {
      console.warn('Error requesting notification permission:', error)
      setShowPermissionAlert(true)
      return false
    }

    return false
  }, [])

  // Show notification when timer completes
  const showNotification = useCallback(() => {
    if (
      notificationsEnabled &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification('Timer Complete!', {
          body: `Your ${timerMinutes}-minute timer has finished.`,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'timer-complete',
          requireInteraction: false,
        })
      } catch (error) {
        console.warn('Error showing notification:', error)
      }
    }
  }, [notificationsEnabled, timerMinutes])

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

          // Show notification when timer completes (if enabled)
          showNotification()
          onTimerEnd?.()
        }
      }

      // Update immediately
      updateTimer()

      // Then update every second
      timerRef.current = setInterval(updateTimer, 1000)
    },
    [onTimerUpdate, onTimerEnd, showNotification]
  )

  const addTimer = async () => {
    const timerDurationInMs = Math.max(0, timerMinutes * 60 * 1000)
    const now = Date.now()

    // Request notification permission if notifications are enabled but permission hasn't been granted
    if (
      enableNotifications &&
      'Notification' in window &&
      Notification.permission === 'default'
    ) {
      const granted = await requestNotificationPermission()
      if (granted) {
        setNotificationsEnabled(true)
      }
    }

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

  const NotificationToggle = () => {
    if (!showNotificationToggle || !('Notification' in window)) return null

    const handleToggleNotifications = async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const enabled = event.target.checked

      if (enabled && notificationPermission !== 'granted') {
        const granted = await requestNotificationPermission()
        setNotificationsEnabled(granted)
      } else {
        setNotificationsEnabled(enabled)
      }
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip
          title={
            notificationPermission === 'denied'
              ? 'Notifications blocked. Enable in browser settings.'
              : 'Get notified when timer completes'
          }
        >
          <FormControlLabel
            control={
              <Switch
                checked={
                  notificationsEnabled && notificationPermission === 'granted'
                }
                onChange={handleToggleNotifications}
                disabled={notificationPermission === 'denied'}
                size={variant === 'minimal' ? 'small' : 'medium'}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {notificationsEnabled &&
                notificationPermission === 'granted' ? (
                  <NotificationsIcon fontSize="small" />
                ) : (
                  <NotificationsOffIcon fontSize="small" />
                )}
                <Typography
                  variant={variant === 'minimal' ? 'caption' : 'body2'}
                >
                  Notifications
                </Typography>
              </Box>
            }
            sx={{
              margin: 0,
              '& .MuiFormControlLabel-label': {
                fontSize: variant === 'minimal' ? '0.75rem' : '0.875rem',
              },
            }}
          />
        </Tooltip>
      </Box>
    )
  }

  const PermissionAlert = () => (
    <Collapse in={showPermissionAlert}>
      <Alert
        severity="warning"
        onClose={() => setShowPermissionAlert(false)}
        sx={{
          mb: 1,
          fontSize: variant === 'minimal' ? '0.75rem' : '0.875rem',
        }}
      >
        {!('Notification' in window)
          ? 'Browser notifications not supported'
          : 'Please enable notifications in your browser settings to receive timer alerts.'}
      </Alert>
    </Collapse>
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
        <PermissionAlert />
        <TimerButton />
        <TimerDisplay />
        <NotificationToggle />
      </Box>
    )
  }

  return (
    <Paper elevation={variant === 'compact' ? 1 : 2} sx={getContainerStyles()}>
      <PermissionAlert />
      <TimerButton />
      <TimerDisplay />
      <NotificationToggle />
    </Paper>
  )
}
