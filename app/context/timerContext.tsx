import {
  createContext,
  Dispatch,
  ReactNode,
  use,
  useEffect,
  useReducer,
} from 'react'

export interface TimerWatch {
  isPaused: boolean
  startTime: number
  id?: string
  name?: string
  endTime?: number
  elapsedTime?: number
  totalTime?: number
  siSeconds?: number
  siMinutes?: number
  siHours?: number
  siDays?: number
  siWeeks?: number
  siMonths?: number
  siYears?: number
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
    isPaused: false,
    startTime: Date.now(),
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
    case 'RESET_TIMER':
      return {
        ...state,
        watch: {
          ...state.watch,
          isPaused: false,
          startTime: Date.now(),
          elapsedTime: 0,
        },
      }
    case 'PAUSE_TIMER':
      return {
        ...state,
        watch: {
          ...state.watch,
          isPaused: true,
          elapsedTime: Math.floor((Date.now() - state.watch.startTime) / 1000),
        },
      }
    case 'RESUME_TIMER':
      return {
        ...state,
        watch: {
          ...state.watch,
          isPaused: false,
          startTime: Date.now(),
        },
      }
    default:
      return state
  }
}

export default function TimerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(TimerReducer, initialState)

  useEffect(() => {
    // const timer = setInterval(() => {
    //   if (!state.watch.isPaused) {
    //     const elapsedTime = Math.floor((Date.now() - state.watch.startTime) / 1000)
    //     const seconds = elapsedTime % 60
    //     const minutes = Math.floor((elapsedTime % 3600) / 60)
    //     const hours = Math.floor(elapsedTime / 3600)
    //     const days = Math.floor(elapsedTime / 86400)
    //     const weeks = Math.floor(elapsedTime / 604800)
    //     const months = Math.floor(elapsedTime / 2628000)
    //     const years = Math.floor(elapsedTime / 31536000)
    //     dispatch({
    //       type: 'SET_TIMER',
    //       payload: {
    //         ...state.watch,
    //         elapsedTime,
    //         siSeconds: seconds,
    //         siMinutes: minutes,
    //         siHours: hours,
    //         siDays: days,
    //         siWeeks: weeks,
    //         siMonths: months,
    //         siYears: years,
    //       },
    //     })
    //   }
    // }, 1000)
    // return () => clearInterval(timer)
  }, [state.watch.isPaused, state.watch.startTime])

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
