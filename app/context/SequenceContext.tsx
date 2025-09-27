'use client'

import { FlowSeriesSequence } from '@context/AsanaSeriesContext'
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import { useSession } from 'next-auth/react'

export interface SequenceData {
  id: number
  nameSequence: string
  sequencesSeries: FlowSeriesSequence[]
  description?: string
  duration?: string
  image?: string
  breath_direction?: string
  created_by?: string | null
  createdAt?: string
  updatedAt?: string
}

export type SequencePageState = {
  sequences: SequenceData
}

type SequenceAction =
  | { type: 'SET_SEQUENCES'; payload: SequenceData }
  | { type: 'UPDATE_SEQUENCE'; payload: SequenceData }
  | { type: 'UPDATE_FIELD'; payload: { key: keyof SequenceData; value: any } }
  | { type: 'REMOVE_SERIES_AT'; payload: { index: number } }
  | { type: 'REORDER_SERIES'; payload: { from: number; to: number } }
  | { type: 'ADD_SERIES'; payload: { series: FlowSeriesSequence[] } }

const initialState: SequencePageState = {
  sequences: {
    id: 0,
    nameSequence: '',
    sequencesSeries: [],
    description: '',
    duration: '',
    image: '',
    // ! REMOVE: breath_direction is not need. (2024-08-27 16:49:10)
    breath_direction: '',
    createdAt: '',
    updatedAt: '',
  },
}

interface SequenceContextType {
  state: SequencePageState
  dispatch: Dispatch<SequenceAction>
  active: boolean
}

export const SequenceContext = createContext<SequenceContextType>({
  state: initialState,
  dispatch: () => null,
  active: false,
})

export function SequenceReducer(
  state: SequencePageState,
  action: SequenceAction
): SequencePageState {
  switch (action.type) {
    case 'SET_SEQUENCES':
      return { ...state, sequences: action.payload }
    case 'UPDATE_SEQUENCE':
      return { ...state, sequences: action.payload }
    case 'UPDATE_FIELD': {
      const { key, value } = action.payload
      return { ...state, sequences: { ...state.sequences, [key]: value } }
    }
    case 'REMOVE_SERIES_AT': {
      const next = {
        ...state.sequences,
        sequencesSeries: [...state.sequences.sequencesSeries],
      }
      next.sequencesSeries.splice(action.payload.index, 1)
      return { ...state, sequences: next }
    }
    case 'REORDER_SERIES': {
      const { from, to } = action.payload
      const list = [...state.sequences.sequencesSeries]
      if (
        from === to ||
        from < 0 ||
        to < 0 ||
        from >= list.length ||
        to >= list.length
      )
        return state
      const [moved] = list.splice(from, 1)
      list.splice(to, 0, moved)
      return {
        ...state,
        sequences: { ...state.sequences, sequencesSeries: list },
      }
    }
    case 'ADD_SERIES': {
      const next = {
        ...state.sequences,
        sequencesSeries: [
          ...state.sequences.sequencesSeries,
          ...action.payload.series,
        ],
      }
      return { ...state, sequences: next }
    }
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
    <SequenceContext.Provider value={{ state, dispatch, active: true }}>
      {children}
    </SequenceContext.Provider>
  )
}

export function useSequence() {
  const context = useContext(SequenceContext)
  if (context === undefined) {
    throw new Error('useSequence must be used within a SequenceProvider')
  }
  return context
}

// Helpers: derive ownership using NextAuth session
export function useSequenceOwnership() {
  const { data: session } = useSession()
  const {
    state: { sequences },
  } = useSequence()
  const isOwner = useMemo(() => {
    const email = session?.user?.email ?? null
    if (!sequences.created_by || !email) return false
    return (
      sequences.created_by.trim().toLowerCase() === email.trim().toLowerCase()
    )
  }, [sequences.created_by, session?.user?.email])
  return isOwner
}

// Helpers: editor actions for components
export function useSequenceEditor() {
  const { state, dispatch } = useSequence()
  return {
    sequence: state.sequences,
    setSequence: (payload: SequenceData) =>
      dispatch({ type: 'UPDATE_SEQUENCE', payload }),
    updateField: (key: keyof SequenceData, value: any) =>
      dispatch({ type: 'UPDATE_FIELD', payload: { key, value } }),
    removeSeriesAt: (index: number) =>
      dispatch({ type: 'REMOVE_SERIES_AT', payload: { index } }),
    reorderSeries: (from: number, to: number) =>
      dispatch({ type: 'REORDER_SERIES', payload: { from, to } }),
    addSeries: (series: FlowSeriesSequence[]) =>
      dispatch({ type: 'ADD_SERIES', payload: { series } }),
  }
}
