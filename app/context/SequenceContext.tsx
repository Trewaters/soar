import { FlowSeriesSequence } from '@app/context/AsanaSeriesContext'
import {
  createContext,
  Dispatch,
  ReactNode,
  use,
  useEffect,
  useReducer,
} from 'react'

export interface SequenceData {
  id: number
  nameSequence: string
  sequencesSeries: FlowSeriesSequence[]
  description?: string
  duration?: string
  image?: string
  breath_direction?: string
  createdAt?: string
  updatedAt?: string
}

export type SequencePageState = {
  sequences: SequenceData
}

type SequenceAction = { type: 'SET_SEQUENCES'; payload: SequenceData }

const initialState: SequencePageState = {
  sequences: {
    id: 0,
    nameSequence: '',
    sequencesSeries: [],
    description: '',
    duration: '',
    image: '',
    breath_direction: '',
    createdAt: '',
    updatedAt: '',
  },
}

interface SequenceContextType {
  state: SequencePageState
  dispatch: Dispatch<SequenceAction>
}

export const SequenceContext = createContext<SequenceContextType>({
  state: initialState,
  dispatch: () => null,
})

export function SequenceReducer(
  state: SequencePageState,
  action: SequenceAction
): SequencePageState {
  switch (action.type) {
    case 'SET_SEQUENCES':
      return { ...state, sequences: action.payload }
    default:
      return state
  }
}

export default function SequenceProvider({
  children,
}: {
  children: ReactNode
}) {
  const [state, dispatch] = useReducer(SequenceReducer, initialState)

  useEffect(() => {
    // fetch('/api/sequences')
    //   .then((res) => res.json())
    //   .then((data) => {
    //     dispatch({ type: 'SET_SEQUENCES', payload: data })
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching sequence data:', error)
    //   })
  }, [state.sequences])

  return (
    <SequenceContext.Provider value={{ state, dispatch }}>
      {children}
    </SequenceContext.Provider>
  )
}

export function useSequence() {
  const context = use(SequenceContext)
  if (context === undefined) {
    throw new Error('useSequence must be used within a SequenceProvider')
  }
  return context
}
