# Timer Implementation Migration Guide

## Migration from `marky` to `react-use-precision-timer`

We have successfully migrated from the `marky` timer library to `react-use-precision-timer` for better performance, accuracy, and React integration.

## Key Changes

### 1. Package Changes

- ❌ Removed: `marky: ^1.3.0`
- ✅ Added: `react-use-precision-timer: ^3.0.0`

### 2. Timer Context Updates

**Before (marky-based):**

```tsx
export interface TimerWatch {
  isPaused: boolean
  markName: string | null
  markStartTime: number | null
  elapsedTime: number
}

// Actions: SET_TIMER, RESET_TIMER, PAUSE_TIMER, RESUME_TIMER
```

**After (react-use-precision-timer):**

```tsx
export interface TimerWatch {
  isPaused: boolean
  isRunning: boolean
  startTime: number | null
  elapsedTime: number
}

// Actions: SET_TIMER, RESET_TIMER, PAUSE_TIMER, RESUME_TIMER, START_TIMER, STOP_TIMER, UPDATE_ELAPSED_TIME
```

### 3. AsanaTimer Component

**Before:**

- Manual interval management
- Complex state synchronization
- Fallback calculations when marky failed

**After:**

- Uses `useStopwatch` hook from react-use-precision-timer
- Automatic precision timing
- Built-in pause/resume functionality
- Sub-10ms accuracy

### 4. Timer Controls

**Updated actions:**

```tsx
// Starting a timer
dispatch({ type: 'START_TIMER' })

// Pausing/resuming
if (state.watch.isPaused || !state.watch.isRunning) {
  dispatch({ type: 'RESUME_TIMER' })
} else {
  dispatch({ type: 'PAUSE_TIMER' })
}

// Resetting
dispatch({ type: 'RESET_TIMER' })
```

## Benefits of the New Implementation

### ⏰ Timeout and Timestamp Based

- Based on `setTimeout()` and Unix times, not ticks
- More reliable than tick-based timing systems

### 🎯 Accurate and Precise

- Perfect mean accuracy with no wandering
- Sub-10ms callback precision
- No timer drift over long periods

### 💪 Resilient Under Pressure

- Handles expensive callbacks gracefully
- Works well with low timer delays
- Doesn't choke under system pressure

### 🧰 Versatile Usage

- Timer with regular intervals
- One-time delays
- Stopwatch functionality
- Rich accessor methods

### ⏯️ Built-in Pause/Resume

- Native pause and resume support
- Tracks cumulative elapsed pause time
- Seamless state management

### 🌞 Rich Accessors

```tsx
const stopwatch = useStopwatch()

// Available methods:
stopwatch.start() // Start the stopwatch
stopwatch.stop() // Stop and reset
stopwatch.pause() // Pause timing
stopwatch.resume() // Resume from pause
stopwatch.isRunning() // Check if running
stopwatch.isPaused() // Check if paused
stopwatch.getElapsedRunningTime() // Get running time in ms
stopwatch.getElapsedPausedTime() // Get paused time in ms
```

## Usage Examples

### Basic Stopwatch

```tsx
import { useStopwatch } from 'react-use-precision-timer'

const MyComponent = () => {
  const stopwatch = useStopwatch()

  return (
    <div>
      <p>Time: {Math.floor(stopwatch.getElapsedRunningTime() / 1000)}s</p>
      <button onClick={() => stopwatch.start()}>Start</button>
      <button onClick={() => stopwatch.pause()}>Pause</button>
      <button onClick={() => stopwatch.resume()}>Resume</button>
      <button onClick={() => stopwatch.stop()}>Reset</button>
    </div>
  )
}
```

### Repeating Timer

```tsx
import { useTimer } from 'react-use-precision-timer'
import { useCallback } from 'react'

const MyComponent = () => {
  const callback = useCallback(() => {
    console.log('Timer tick!')
  }, [])

  const timer = useTimer({ delay: 1000 }, callback)

  return (
    <div>
      <button onClick={() => timer.start()}>Start</button>
      <button onClick={() => timer.stop()}>Stop</button>
    </div>
  )
}
```

### One-time Delay

```tsx
import { useDelay } from 'react-use-precision-timer'
import { useCallback } from 'react'

const MyComponent = () => {
  const callback = useCallback(() => {
    alert('Time is up!')
  }, [])

  const delayTimer = useDelay(5000, callback) // 5 second delay

  return (
    <button onClick={() => delayTimer.start()}>Start 5-second countdown</button>
  )
}
```

## Performance Improvements

### Reduced Renders

- Timer state tracked via React refs
- Timer options are memoized automatically
- Only necessary updates trigger re-renders

### Better Memory Management

- No manual interval cleanup needed
- Automatic resource management
- More efficient than previous implementation

### Enhanced Accuracy

- Sub-10ms precision vs. previous ~100ms precision
- No timer drift over extended periods
- Consistent performance under load

## Migration Checklist

- [x] Remove `marky` dependency
- [x] Install `react-use-precision-timer`
- [x] Update `TimerWatch` interface
- [x] Add new timer actions to reducer
- [x] Update `AsanaTimer` component
- [x] Update timer control handlers
- [x] Update tests
- [x] Create documentation and examples

## Testing

The timer implementation includes comprehensive tests that verify:

- Timer state management
- Pause/resume functionality
- Time formatting utilities
- Component integration
- Error handling

Run tests with:

```bash
npm test __test__/lib/timerUtils.spec.ts
```

## Troubleshooting

### Common Issues

1. **Timer not starting**: Make sure to dispatch `START_TIMER` action for new timers
2. **Pause/Resume not working**: Check that you're using the correct conditional logic for pause/resume states
3. **Time display issues**: Ensure you're using the `formatDuration` utility function

### Debug Information

The timer context now provides more detailed state information:

```tsx
const { state } = useTimer()
console.log({
  isPaused: state.watch.isPaused,
  isRunning: state.watch.isRunning,
  elapsedTime: state.watch.elapsedTime,
  startTime: state.watch.startTime,
})
```
