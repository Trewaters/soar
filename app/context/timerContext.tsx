import { createContext, Dispatch, ReactNode, use, useReducer } from 'react'

export interface TimerWatch {
  isPaused: boolean
  isRunning: boolean
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
  | { type: 'START_TIMER' }
  | { type: 'STOP_TIMER' }
  | { type: 'UPDATE_ELAPSED_TIME'; payload: number }

const initialState: TimerPageState = {
  watch: {
    isPaused: true,
    isRunning: false,
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
  switch (action.type) {
    case 'SET_TIMER':
      return {
        ...state,
        watch: action.payload,
      }
    case 'RESET_TIMER': {
      return {
        ...state,
        watch: {
          ...state.watch,
          isPaused: true,
          isRunning: false,
          startTime: null,
          elapsedTime: 0,
        },
      }
    }
    case 'START_TIMER': {
      return {
        ...state,
        watch: {
          ...state.watch,
          isPaused: false,
          isRunning: true,
          startTime: Date.now(),
        },
      }
    }
    case 'PAUSE_TIMER': {
      return {
        ...state,
        watch: {
          ...state.watch,
          isPaused: true,
          isRunning: false,
        },
      }
    }
    case 'RESUME_TIMER': {
      return {
        ...state,
        watch: {
          ...state.watch,
          isPaused: false,
          isRunning: true,
        },
      }
    }
    case 'STOP_TIMER': {
      return {
        ...state,
        watch: {
          ...state.watch,
          isPaused: true,
          isRunning: false,
          startTime: null,
        },
      }
    }
    case 'UPDATE_ELAPSED_TIME': {
      return {
        ...state,
        watch: {
          ...state.watch,
          elapsedTime: action.payload,
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
