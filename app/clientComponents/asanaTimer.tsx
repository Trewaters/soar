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
import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

export default function AsanaTimer({
  onTimeUpdate,
  onPauseUpdate,
}: AsanaTimerProps) {
  const [baseStartTime, setBaseStartTime] = useState(Date.now())
  const [pausedElapsedTime, setPausedElapsedTime] = useState(0)
  const { state } = useTimer()

  // Initialize the timer when component mounts or when timer is reset
  useEffect(() => {
    if (state.watch.elapsedTime === 0) {
      setBaseStartTime(Date.now())
      setPausedElapsedTime(0)
    }
  }, [state.watch.elapsedTime])

  // Update elapsed time when pause state changes
  useEffect(() => {
    if (state.watch.isPaused) {
      // When pausing, save the current elapsed time
      const currentElapsed =
        Math.floor((Date.now() - baseStartTime) / 1000) + pausedElapsedTime
      setPausedElapsedTime(currentElapsed)
    } else {
      // When resuming, reset the base start time
      setBaseStartTime(Date.now())
    }
  }, [state.watch.isPaused, baseStartTime, pausedElapsedTime])

  useEffect(() => {
    const timer = setInterval(() => {
      if (!state.watch.isPaused) {
        const currentElapsed =
          Math.floor((Date.now() - baseStartTime) / 1000) + pausedElapsedTime
        onTimeUpdate(currentElapsed)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [state.watch.isPaused, baseStartTime, pausedElapsedTime, onTimeUpdate])

  useEffect(() => {
    if (onPauseUpdate) {
      onPauseUpdate(state.watch.isPaused)
    }
  }, [state.watch.isPaused, onPauseUpdate])

  // Calculate current display time
  const currentElapsed = state.watch.isPaused
    ? pausedElapsedTime
    : Math.floor((Date.now() - baseStartTime) / 1000) + pausedElapsedTime

  return (
    <Box>
      <Typography sx={{ color: 'white' }}>
        Elapsed Time: {currentElapsed} seconds
      </Typography>
    </Box>
  )
}
