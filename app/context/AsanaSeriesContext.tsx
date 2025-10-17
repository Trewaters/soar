import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react'

// used for the series page data
export interface FlowSeriesData {
  id?: string
  seriesName: string
  // seriesPoses may be legacy strings or the new object shape that includes
  // poseId, sort_english_name, optional secondary/sanskrit and alignment_cues.
  // Keep this union to remain backward compatible with existing code/tests.
  seriesPoses: Array<string | FlowSeriesPose>
  // breath will be a string of the breath count and type (inhale, exhale)
  breath?: string
  description?: string
  duration?: string
  image?: string
  createdAt?: string
  updatedAt?: string
}

// used for the sequence page data
export interface FlowSeriesSequence {
  id?: string
  seriesName: string
  seriesPoses: Array<string | FlowSeriesPose>
  breath?: string
  duration?: string
  image?: string
  createdAt?: string
  updatedAt?: string
}

// New shape for per-series pose metadata. Stored in Prisma as Json[] elements.
export interface FlowSeriesPose {
  poseId?: string
  sort_english_name: string
  // optional secondary label (e.g., sanskrit name or difficulty tag)
  secondary?: string
  alignment_cues?: string
}

export type FlowSeriesPageState = {
  flowSeries: FlowSeriesData
}

type FlowSeriesAction = {
  type: 'SET_FLOW_SERIES' | 'RESET_FLOW_SERIES'
  payload: FlowSeriesData
}

const initialState: FlowSeriesPageState = {
  flowSeries: {
    seriesName: '',
    seriesPoses: [],
    breath: '',
    description: '',
    duration: '',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
}

interface FlowSeriesContextType {
  state: FlowSeriesPageState
  dispatch: Dispatch<FlowSeriesAction>
}

export const FlowSeriesContext = createContext<FlowSeriesContextType>({
  state: initialState,
  dispatch: () => null,
})

function FlowSeriesReducer(
  state: FlowSeriesPageState,
  action: FlowSeriesAction
): FlowSeriesPageState {
  switch (action.type) {
    case 'SET_FLOW_SERIES':
      return { ...state, flowSeries: action.payload }
    case 'RESET_FLOW_SERIES':
      return {
        ...state,
        flowSeries: {
          seriesName: '',
          seriesPoses: [],
          breath: '',
          description: '',
          duration: '',
          image: '',
          createdAt: '',
          updatedAt: '',
        },
      }
    default:
      return state
  }
}

export default function FlowSeriesProvider({
  children,
}: {
  children: ReactNode
}) {
  const [state, dispatch] = useReducer(FlowSeriesReducer, initialState)

  useEffect(() => {
    // const fetchFlowSeriesData = async (id: string) => {
    //   let fetchFlowSeries: any
    //   try {
    //     fetchFlowSeries = await fetch(
    //       `${process.env.NEXT_PUBLIC_BASE_URL}/api/series`
    //     )
    //     const data = await fetchFlowSeries.json()
    //     dispatch({ type: 'SET_FLOW_SERIES', payload: data })
    //   } catch (error) {
    //     console.error('Error fetching flow series data:', error)
    //   }
    // }
    // fetchFlowSeriesData('Hip Series')
    // dispatch({ type: 'SET_FLOW_SERIES', payload: state.flowSeries })
  }, [state.flowSeries])

  return (
    <FlowSeriesContext.Provider value={{ state, dispatch }}>
      {children}
    </FlowSeriesContext.Provider>
  )
}

export function useFlowSeries() {
  const context = useContext(FlowSeriesContext)
  if (context === undefined) {
    throw new Error('useFlowSeries must be used within a FlowSeriesProvider')
  }
  return context
}
