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
import { Box, Typography } from '@node_modules/@mui/material'
import { useEffect, useState } from 'react'

export default function AsanaTimer({
  onTimeUpdate,
  onPauseUpdate,
}: AsanaTimerProps) {
  const [totalTime, setTotalTime] = useState(0)
  const [startTime, setStartTime] = useState(Date.now())
  const { state } = useTimer()

  useEffect(() => {
    setStartTime(Date.now())
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (!state.watch.isPaused) {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000)
        setTotalTime(elapsedTime)
        onTimeUpdate(elapsedTime)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [state.watch.isPaused, startTime, onTimeUpdate])

  useEffect(() => {
    onPauseUpdate(state.watch.isPaused)
  }, [state.watch.isPaused, onPauseUpdate])

  return (
    <Box>
      <Typography sx={{ color: 'white' }}>
        Elapsed Time: {totalTime} seconds
      </Typography>
    </Box>
  )
}
