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

  return null
}
