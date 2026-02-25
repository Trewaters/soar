import React, { useCallback } from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import { useTimer, useStopwatch, useDelay } from 'react-use-precision-timer'

/**
 * Example component demonstrating the new react-use-precision-timer usage
 * This replaces the old marky-based timer implementation
 */
export default function PrecisionTimerExamples() {
  // Example 1: Repeating Timer
  const timerCallback = useCallback(() => {}, [])

  const timer = useTimer({ delay: 1000 }, timerCallback)

  // Example 2: Stopwatch
  const stopwatch = useStopwatch()

  // Example 3: One-time delay
  const delayCallback = useCallback(() => {}, [])

  const onceTimer = useDelay(2000, delayCallback)

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        React Use Precision Timer Examples
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Repeating Timer (1 second intervals)
        </Typography>
        <Typography variant="body2" gutterBottom>
          This timer calls a callback every 1000ms when running.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => timer.start()}
            disabled={timer.isRunning()}
          >
            Start Timer
          </Button>
          <Button
            variant="outlined"
            onClick={() => timer.stop()}
            disabled={!timer.isRunning()}
          >
            Stop Timer
          </Button>
          <Button
            variant="outlined"
            onClick={() => timer.pause()}
            disabled={!timer.isRunning()}
          >
            Pause Timer
          </Button>
          <Button
            variant="outlined"
            onClick={() => timer.resume()}
            disabled={timer.isRunning() || !timer.isPaused()}
          >
            Resume Timer
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Status:{' '}
          {timer.isRunning()
            ? 'Running'
            : timer.isPaused()
              ? 'Paused'
              : 'Stopped'}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Stopwatch
        </Typography>
        <Typography variant="body2" gutterBottom>
          A precision stopwatch for measuring elapsed time.
        </Typography>
        <Typography variant="h5" sx={{ my: 2, fontFamily: 'monospace' }}>
          {formatTime(stopwatch.getElapsedRunningTime())}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={() => stopwatch.start()}>
            Start/Restart
          </Button>
          <Button
            variant="outlined"
            onClick={() => stopwatch.stop()}
            disabled={!stopwatch.isRunning()}
          >
            Stop
          </Button>
          <Button
            variant="outlined"
            onClick={() => stopwatch.pause()}
            disabled={!stopwatch.isRunning()}
          >
            Pause
          </Button>
          <Button
            variant="outlined"
            onClick={() => stopwatch.resume()}
            disabled={stopwatch.isRunning() || !stopwatch.isPaused()}
          >
            Resume
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            Running Time: {formatTime(stopwatch.getElapsedRunningTime())}
          </Typography>
          <Typography variant="body2">
            Paused Time: {formatTime(stopwatch.getTotalElapsedPausedTime())}
          </Typography>
          <Typography variant="body2">
            Status:{' '}
            {stopwatch.isRunning()
              ? 'Running'
              : stopwatch.isPaused()
                ? 'Paused'
                : 'Stopped'}
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          One-Time Delay (2 seconds)
        </Typography>
        <Typography variant="body2" gutterBottom>
          Executes a callback once after a 2-second delay.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => onceTimer.start()}
            disabled={onceTimer.isRunning()}
          >
            Start Delay
          </Button>
          <Button
            variant="outlined"
            onClick={() => onceTimer.stop()}
            disabled={!onceTimer.isRunning()}
          >
            Cancel
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Status: {onceTimer.isRunning() ? 'Waiting...' : 'Ready'}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Key Benefits of react-use-precision-timer
        </Typography>
        <Box component="ul" sx={{ mt: 2 }}>
          <li>⏰ Timeout and timestamp based (not tick-based)</li>
          <li>🎯 Accurate and precise with sub-10ms precision</li>
          <li>💪 Resilient to expensive callbacks and low timer delays</li>
          <li>🧰 Versatile - timer, delay, or stopwatch</li>
          <li>⏯️ Pause and resume support</li>
          <li>🌞 Rich accessor methods for all timer states</li>
          <li>⚡ Optimized to reduce unnecessary renders</li>
        </Box>
      </Paper>
    </Box>
  )
}
