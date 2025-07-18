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
import { useCallback, useEffect } from 'react'
import { useStopwatch } from 'react-use-precision-timer'

export default function AsanaTimer({
  onTimeUpdate,
  onPauseUpdate,
}: AsanaTimerProps) {
  const { state, dispatch } = useTimer()

  // Create a stopwatch using react-use-precision-timer
  const stopwatch = useStopwatch()

  // Update callback to track elapsed time
  const updateElapsedTime = useCallback(() => {
    const elapsedSeconds = Math.floor(stopwatch.getElapsedRunningTime() / 1000)
    dispatch({ type: 'UPDATE_ELAPSED_TIME', payload: elapsedSeconds })
    onTimeUpdate(elapsedSeconds)
  }, [stopwatch, dispatch, onTimeUpdate])

  // Set up interval to update elapsed time every second when running
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (state.watch.isRunning && !state.watch.isPaused) {
      // Update immediately
      updateElapsedTime()
      // Set up interval for regular updates
      interval = setInterval(updateElapsedTime, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [state.watch.isRunning, state.watch.isPaused, updateElapsedTime])

  // Handle timer state changes
  useEffect(() => {
    if (state.watch.isRunning && !state.watch.isPaused) {
      // Timer should be running
      if (!stopwatch.isRunning()) {
        stopwatch.start()
      }
    } else {
      // Timer should be paused or stopped
      if (stopwatch.isRunning()) {
        stopwatch.pause()
      }
    }
  }, [state.watch.isRunning, state.watch.isPaused, stopwatch])

  // Handle reset
  useEffect(() => {
    if (state.watch.elapsedTime === 0 && !state.watch.isRunning) {
      stopwatch.stop()
    }
  }, [state.watch.elapsedTime, state.watch.isRunning, stopwatch])

  // Notify about pause state changes
  useEffect(() => {
    if (onPauseUpdate) {
      onPauseUpdate(state.watch.isPaused)
    }
  }, [state.watch.isPaused, onPauseUpdate])

  return (
    <Box>
      <Typography sx={{ color: 'white' }}>
        Elapsed Time: {formatDuration(state.watch.elapsedTime)}
      </Typography>
    </Box>
  )
}
