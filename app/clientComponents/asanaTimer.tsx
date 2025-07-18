/* // when timerUp is running, it should display the time in the format 'HH:MM:SS'
// when timerUp is paused, it should display the time in the format 'HH:MM:SS' but should not increment

import { Box, Typography, Skeleton } from '@mui/material'
import { useState, useEffect } from 'react'

export default function AsanaTimer() {
  const [time, setTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [startTime, setStartTime] = useState(Date.now())

  useEffect(() => {
    setStartTime(Date.now())
  }, [])

  useEffect(() => {
    setIsMounted(true)

    const timerUp = setInterval(() => {
      if (!isPaused) {
        setTime(time + 1)
      }
    }, 100000)

    const timerDown = setInterval(() => {
      if (!isPaused) {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000)
        setTime(elapsedTime)
      }
    }, 1000)

    return () => clearInterval(timerUp)
  }, [time, isPaused, startTime])

  function countdownTimer() {
    // create a countdown timerUp
    // return the time in the format 'HH:MM:SS'
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60
    setTime(hours * 3600 + minutes * 60 + seconds)
  }

  if (!isMounted)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          height: '2em',
        }}
      >
        <Typography variant="body1">
          <Skeleton variant="text" sx={{ width: '10em' }} />
        </Typography>
      </Box>
    )

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', height: '2em' }}>
      <Typography variant="body1" color={'white'}>
        {time || <Skeleton variant="text" sx={{ width: '10em' }} />}
      </Typography>
    </Box>
  )
}
 */

import { AsanaTimerProps, useTimer } from '@context/timerContext'
import { formatDuration } from '@lib/timerUtils'
import { Box, Typography } from '@mui/material'
import { useCallback, useEffect, useRef } from 'react'

export default function AsanaTimer({
  onTimeUpdate,
  onPauseUpdate,
}: AsanaTimerProps) {
  const { state, dispatch } = useTimer()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const lastElapsedRef = useRef<number>(0)

  // Debug logging
  console.log('AsanaTimer state:', {
    isRunning: state.watch.isRunning,
    isPaused: state.watch.isPaused,
    elapsedTime: state.watch.elapsedTime,
  })

  // Simple fallback timer implementation
  const updateElapsedTime = useCallback(() => {
    if (
      startTimeRef.current &&
      state.watch.isRunning &&
      !state.watch.isPaused
    ) {
      const now = Date.now()
      const elapsedSeconds = Math.floor(
        (now - startTimeRef.current) / 1000 + lastElapsedRef.current
      )
      console.log('Updating elapsed time:', elapsedSeconds)
      dispatch({ type: 'UPDATE_ELAPSED_TIME', payload: elapsedSeconds })
      onTimeUpdate(elapsedSeconds)
    }
  }, [state.watch.isRunning, state.watch.isPaused, dispatch, onTimeUpdate])

  // Set up interval to update elapsed time every second when running
  useEffect(() => {
    if (state.watch.isRunning && !state.watch.isPaused) {
      // Set start time when starting
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now()
        lastElapsedRef.current = state.watch.elapsedTime
      }

      // Update immediately
      updateElapsedTime()
      // Set up interval for regular updates
      intervalRef.current = setInterval(updateElapsedTime, 1000)
    } else if (state.watch.isPaused) {
      // Store the current elapsed time and clear interval when paused
      lastElapsedRef.current = state.watch.elapsedTime
      startTimeRef.current = null
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    } else {
      // Clear everything when stopped
      startTimeRef.current = null
      lastElapsedRef.current = 0
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [
    state.watch.isRunning,
    state.watch.isPaused,
    state.watch.elapsedTime,
    updateElapsedTime,
  ])

  // Handle reset
  useEffect(() => {
    if (state.watch.elapsedTime === 0 && !state.watch.isRunning) {
      startTimeRef.current = null
      lastElapsedRef.current = 0
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state.watch.elapsedTime, state.watch.isRunning])

  // Notify about pause state changes
  useEffect(() => {
    if (onPauseUpdate) {
      onPauseUpdate(state.watch.isPaused)
    }
  }, [state.watch.isPaused, onPauseUpdate])

  return (
    <Box>
      <Typography sx={{ color: 'white' }}>
        Debug Timer: {formatDuration(state.watch.elapsedTime)}
      </Typography>
    </Box>
  )
}
