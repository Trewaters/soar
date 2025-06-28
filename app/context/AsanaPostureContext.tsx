// Create a context for the AsanaPosture component
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react'

// Full Posture Data Interface
// ! udpate name to 'FullAsanaData' ( 2024-11-10 12:27:15 )
// Full Asana Posture Data, “AsanaPosture” is all data for Asana. Update name to [FullAsanaData]

/*  
include the following fields:
Abbreviated Posture 1

•	Category
•	English names [0]
•	Sanskrit name
•	Description
•	Benefits
•	Difficulty
•	Lore
•	Breath default
•	Dristi
•	Activities
•	Variations
•	Modifications
•	Suggested postures
•	Preparatory postures
•	Sideways
•	Image
•	Activities – completed, practice
•	Posture intent
•	Duration asana
•	Transition in/out
•	Setupcues
•	Deepening cues
•	Customize asana
•	Additional cues
•	Joint action
•	Muscle action

*/

export interface FullAsanaData {
  id: string
  english_names: string[]
  sanskrit_names: string
  sort_english_name: string
  description: string
  benefits: string
  category: string
  difficulty: string
  lore: string
  breath_direction_default: string
  dristi: string
  variations: string[]
  modifications: string[]
  suggested_postures: string[]
  preparatory_postures: string[]
  preferred_side: string
  sideways: boolean
  image: string
  created_on: string
  updated_on: string
  activity_completed: boolean
  activity_practice: boolean
  posture_intent: string
  breath_series: string[]
  duration_asana: string
  transition_cues_out: string
  transition_cues_in: string
  setup_cues: string
  deepening_cues: string
  customize_asana: string
  additional_cues: string
  joint_action: string
  muscle_action: string
  created_by: string
}

export interface displayAsanaPosture {
  id: number
  english_names: string[]
  sanskrit_names: string
  sort_english_name: string
  description: string
  benefits: string
  category: string
  difficulty: string
  lore: string
  dristi: string
  preferred_side: string
  sideways: boolean
  created_on: string
  updated_on: string
  activity_completed: boolean
  activity_practice: boolean
  posture_intent: string
  duration_asana: string
  created_by: string
}

// export interface PostureData {
//   id: number

//   // aka: string[]
//   alternate_english_name: string[]

//   benefits: string
//   category: string
//   description: string
//   difficulty: string

//   // simplified_english_name: string
//   simplified_english_name: string

//   // name: string
//   english_name: string

//   next_poses: string[]
//   preferred_side: string
//   previous_poses: string[]
//   sanskrit_names: {
//     latin: string
//     devanagari: string
//     simplified: string
//     translation: {
//       latin: string
//       devanagari: string
//       simplified: string
//       description: string
//     }[]
//   }[]
//   sideways: boolean

//   // sort_name: string
//   sort_english_name: string

//   // subcategory: string ('backbend', 'forward_bend', 'standing', 'seated', 'twist', 'neutral', 'balancing', 'inversion', 'mudra', 'bandha', 'lateral_bend')
//   subcategory: string

//   two_sided: boolean

//   // variations: null | any
//   variations_english_name: string[]

//   // visibility: ('primary', 'secondary', 'tertiary')
//   visibility: string
//   image?: string
//   createdAt?: string
//   updatedAt?: string
//   acitivity_completed?: boolean
//   acitivity_easy?: boolean
//   acitivity_difficult?: boolean
//   acitivity_practice?: boolean
//   posture_intent?: string
//   posture_meaning?: string
//   dristi?: string
//   breath?: string
//   // duration?: string
// }

//
// Abbreviated Posture 1, display in Asanas > Postures
// ! displayAsanaPosture

// Abbreviated Posture 2, display in Asanas > Practice view
// ! displayAsanaPracticeView

// Abbreviated Posture 3, display in Flows > Practice Series
// ! displayAsanaFlowSeries

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
  postures: FullAsanaData
  // selectedPosture: FullAsanaData | undefined
}

type AsanaPostureAction = { type: 'SET_POSTURES'; payload: FullAsanaData }

const initialState: AsanaPosturePageState = {
  postures: {
    id: '',
    english_names: [],
    sanskrit_names: '',
    sort_english_name: '',
    description: '',
    benefits: '',
    category: '',
    difficulty: '',
    lore: '',
    breath_direction_default: '',
    dristi: '',
    variations: [],
    modifications: [],
    suggested_postures: [],
    preparatory_postures: [],
    preferred_side: '',
    sideways: false,
    image: '',
    created_on: '',
    updated_on: '',
    activity_completed: false,
    activity_practice: false,
    posture_intent: '',
    breath_series: [],
    duration_asana: '',
    transition_cues_out: '',
    transition_cues_in: '',
    setup_cues: '',
    deepening_cues: '',
    customize_asana: '',
    additional_cues: '',
    joint_action: '',
    muscle_action: '',
    created_by: '',
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
