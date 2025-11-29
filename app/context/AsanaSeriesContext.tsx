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

type FlowSeriesAction =
  | {
      type: 'SET_FLOW_SERIES' | 'RESET_FLOW_SERIES'
      payload: FlowSeriesData
    }
  | {
      type: 'SET_FLOW_SERIES_IMAGE'
      payload: string
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
    case 'SET_FLOW_SERIES_IMAGE':
      return {
        ...state,
        flowSeries: { ...state.flowSeries, image: action.payload },
      }
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
  hydration,
}: {
  children: ReactNode
  hydration?: { flowSeries?: any }
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

  // Apply hydration if present
  useEffect(() => {
    if (hydration && hydration.flowSeries) {
      try {
        dispatch({ type: 'SET_FLOW_SERIES', payload: hydration.flowSeries })
        console.debug('[FlowSeriesProvider] applied hydration.flowSeries', {
          id: hydration.flowSeries?.id,
          name: hydration.flowSeries?.seriesName,
        })
      } catch (err) {
        console.warn('[FlowSeriesProvider] hydration failed', err)
      }
      // Background revalidation: even when hydrating from local cache, re-fetch
      // the authoritative server copy and update state if newer. This avoids
      // stale local IndexedDB state overwriting server updates (common in
      // production when users have multiple devices or previous cached data).
      ;(async () => {
        try {
          const id = hydration.flowSeries?.id
          if (!id) return
          const url = `/api/series?id=${encodeURIComponent(id)}`
          console.debug('[FlowSeriesProvider] revalidating server copy', {
            url,
          })
          const res = await fetch(url, { cache: 'no-store' })
          if (!res.ok) {
            console.debug('[FlowSeriesProvider] revalidation response not ok', {
              status: res.status,
            })
            return
          }
          const serverData = await res.json()
          console.debug('[FlowSeriesProvider] revalidation returned', {
            serverDataExists: !!serverData,
          })
          if (serverData) {
            dispatch({ type: 'SET_FLOW_SERIES', payload: serverData })
            console.debug(
              '[FlowSeriesProvider] updated state from server revalidation',
              { id: serverData.id }
            )
          }
        } catch (e) {
          // Non-fatal: we already applied hydration. Revalidation is best-effort.
          console.warn('[FlowSeriesProvider] revalidation failed', e)
        }
      })()
    }
  }, [hydration])

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
