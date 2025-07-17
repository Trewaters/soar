import { createContext, Dispatch, ReactNode, use, useReducer } from 'react'
import {
  startTimer,
  stopTimer,
  clearAllTimers,
  msToSeconds,
} from '@lib/timerUtils'

export interface TimerWatch {
  isPaused: boolean
  markName: string | null
  startTime: number | null
  elapsedTime: number
  id?: string
  name?: string
  endTime?: number
  totalTime?: number
}

export interface AsanaTimerProps {
  // eslint-disable-next-line no-unused-vars
  onTimeUpdate: (time: number) => void
  // eslint-disable-next-line no-unused-vars
  onPauseUpdate?: (isPaused: boolean) => void
}

export type TimerPageState = {
  watch: TimerWatch
}

type TimerAction =
  | { type: 'SET_TIMER'; payload: TimerWatch }
  | { type: 'RESET_TIMER' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESUME_TIMER' }

const initialState: TimerPageState = {
  watch: {
    isPaused: true,
    markName: null,
    startTime: null,
    elapsedTime: 0,
  },
}

interface TimerContextType {
  state: TimerPageState
  dispatch: Dispatch<TimerAction>
}

export const TimerContext = createContext<TimerContextType>({
  state: initialState,
  dispatch: () => null,
})

function TimerReducer(
  state: TimerPageState,
  action: TimerAction
): TimerPageState {
  const generateMarkName = () => `timer-${Date.now()}-${Math.random()}`

  switch (action.type) {
    case 'SET_TIMER':
      return {
        ...state,
        watch: action.payload,
      }
    case 'RESET_TIMER': {
      // Clear all existing marks and measurements
      clearAllTimers()

      return {
        ...state,
        watch: {
          ...state.watch,
          isPaused: true,
          markName: null,
          startTime: null,
          elapsedTime: 0,
        },
      }
    }
    case 'PAUSE_TIMER': {
      let pausedElapsedTime = state.watch.elapsedTime

      // If we have an active mark, stop it and get the elapsed time
      if (state.watch.markName && !state.watch.isPaused) {
        const result = stopTimer(state.watch.markName)
        if (result) {
          pausedElapsedTime =
            state.watch.elapsedTime + msToSeconds(result.duration)
        } else {
          // Fallback to manual calculation if marky fails
          if (state.watch.startTime) {
            const elapsed = (Date.now() - state.watch.startTime) / 1000
            pausedElapsedTime = state.watch.elapsedTime + elapsed
          }
        }
      }

      return {
        ...state,
        watch: {
          ...state.watch,
          isPaused: true,
          markName: null,
          startTime: null,
          elapsedTime: pausedElapsedTime,
        },
      }
    }
    case 'RESUME_TIMER': {
      // Start a new mark when resuming
      const newMarkName = generateMarkName()
      const startTime = Date.now()

      startTimer(newMarkName)

      return {
        ...state,
        watch: {
          ...state.watch,
          isPaused: false,
          markName: newMarkName,
          startTime,
        },
      }
    }
    default:
      return state
  }
}

export default function TimerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(TimerReducer, initialState)

  return (
    <TimerContext.Provider value={{ state, dispatch }}>
      {children}
    </TimerContext.Provider>
  )
}

export function useTimer() {
  const context = use(TimerContext)
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider')
  }
  return context
}
