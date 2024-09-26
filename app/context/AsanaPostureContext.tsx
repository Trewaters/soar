// Create a context for the AsanaPosture component
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react'

// Full Posutre Data Interface
export interface PostureData {
  id: number

  // aka: string[]
  alternate_english_name: string[]

  benefits: string
  category: string
  description: string
  difficulty: string

  // simplified_english_name: string
  simplified_english_name: string

  // name: string
  english_name: string

  next_poses: string[]
  preferred_side: string
  previous_poses: string[]
  sanskrit_names: {
    latin: string
    devanagari: string
    simplified: string
    translation: {
      latin: string
      devanagari: string
      simplified: string
      description: string
    }[]
  }[]
  sideways: boolean

  // sort_name: string
  sort_english_name: string

  // subcategory: string ('backbend', 'forward_bend', 'standing', 'seated', 'twist', 'neutral', 'balancing', 'inversion', 'mudra', 'bandha', 'lateral_bend')
  subcategory: string

  two_sided: boolean

  // variations: null | any
  variations_english_name: string[]

  // visibility: ('primary', 'secondary', 'tertiary')
  visibility: string
  image?: string
  createdAt?: string
  updatedAt?: string
  acitivity_completed?: boolean
  acitivity_easy?: boolean
  acitivity_difficult?: boolean
  acitivity_practice?: boolean
  posture_intent?: string
  posture_meaning?: string
  dristi?: string
  breath?: string
  // duration?: string
}

// future posture definitions

// interface postureDataAbbreviated3 {
//   id: number
//   alternate_english_name: string[]
//   benefits: string
//   category: string
//   simplified_english_name: string
//   english_name: string
//   sanskrit_names: {
//     latin: string
//     simplified: string
//   }[]
//   sort_english_name: string
//   subcategory: string
// }

// interface postureDataAbbreviated2 {
//   id: number
//   alternate_english_name: string[]
//   benefits: string
//   category: string
//   difficulty: string
//   simplified_english_name: string
//   english_name: string
//   sanskrit_names: {
//     latin: string
//     simplified: string
//   }[]
//   sort_english_name: string
//   subcategory: string
//   variations_english_name: null | any
// }

// interface postureDataAbbreviated1 {
//   id: number
//   alternate_english_name: string[]
//   benefits: string
//   category: string
//   description: string
//   difficulty: string
//   simplified_english_name: string
//   english_name: string
//   next_poses: string[]
//   preferred_side: string
//   previous_poses: string[]
//   sanskrit_names: {
//     latin: string
//     simplified: string
//   }[]
//   sort_english_name: string
//   subcategory: string
//   variations_english_name: null | any
//   visibility: string
// }

// PostureCard fields
export interface PostureCardFields {
  id: number
  description: string
  simplified_english_name: string
  english_name: string
  sanskrit_names: {
    simplified: string
  }[]
  // duration: string
  posture_meaning: string
  benefits: string
  breath: string
  dristi: string
  difficulty: string
  category: string
  subcategory: string
  acitivity_completed: boolean
  acitivity_easy: boolean
  acitivity_difficult: boolean
  acitivity_practice: boolean
  posture_intent: string
}

export interface AsanaPosturePageState {
  postures: PostureData
  // selectedPosture: PostureData | undefined
}

type AsanaPostureAction = { type: 'SET_POSTURES'; payload: PostureData }

const initialState: AsanaPosturePageState = {
  postures: {
    id: 0,
    alternate_english_name: [],
    benefits: '',
    category: '',
    description: '',
    difficulty: '',
    simplified_english_name: '',
    english_name: '',
    next_poses: [],
    preferred_side: '',
    previous_poses: [],
    sanskrit_names: [
      {
        latin: '',
        devanagari: '',
        simplified: '',
        translation: [
          { latin: '', devanagari: '', simplified: '', description: '' },
        ],
      },
    ],
    sideways: false,
    sort_english_name: '',
    subcategory: '',
    two_sided: false,
    variations_english_name: [],
    visibility: '',
  },
}

interface AsanaPostureContextType {
  state: AsanaPosturePageState
  dispatch: Dispatch<AsanaPostureAction>
}

export const AsanaPostureContext = createContext<AsanaPostureContextType>({
  state: initialState,
  dispatch: () => null,
})

function AsanaPostureReducer(
  state: AsanaPosturePageState,
  action: AsanaPostureAction
): AsanaPosturePageState {
  switch (action.type) {
    case 'SET_POSTURES':
      return { ...state, postures: action.payload }
    default:
      return state
  }
}

export default function AsanaPostureProvider({
  children,
}: {
  children: ReactNode
}) {
  const [state, dispatch] = useReducer(AsanaPostureReducer, initialState)

  useEffect(() => {}, [state.postures])

  return (
    <AsanaPostureContext.Provider value={{ state, dispatch }}>
      {children}
    </AsanaPostureContext.Provider>
  )
}

export function useAsanaPosture() {
  const context = useContext(AsanaPostureContext)
  if (context === undefined) {
    throw new Error(
      'useAsanaPosture must be used within an AsanaPostureProvider'
    )
  }
  return context
}
