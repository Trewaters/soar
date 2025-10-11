// Create a context for the AsanaPosture component
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react'
import { PoseImageData } from '../../types/images'
import { AsanaPose } from 'types/asana'

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
  postures: AsanaPose
  // New multi-image carousel state
  currentImageIndex: number
  isReordering: boolean
  uploadProgress: number | null
}

type AsanaPostureAction =
  | { type: 'SET_POSTURES'; payload: AsanaPose }
  | { type: 'SET_CURRENT_IMAGE_INDEX'; payload: number }
  | { type: 'UPDATE_IMAGE_COUNT'; payload: number }
  | { type: 'ADD_POSE_IMAGE'; payload: PoseImageData }
  | { type: 'REMOVE_POSE_IMAGE'; payload: string } // imageId
  | { type: 'REORDER_IMAGES'; payload: PoseImageData[] }
  | { type: 'SET_REORDERING'; payload: boolean }
  | { type: 'SET_UPLOAD_PROGRESS'; payload: number | null }
  | { type: 'RESET_CAROUSEL' }

const initialState: AsanaPosturePageState = {
  postures: {
    id: '',
    english_names: [],
    sanskrit_names: [],
    sort_english_name: '',
    description: '',
    benefits: '',
    category: '',
    difficulty: '',
    lore: '',
    breath: [],
    dristi: '',
    pose_variations: [],
    pose_modifications: [],
    label: '',
    suggested_postures: [],
    preparatory_postures: [],
    alignment_cues: '',
    poseImages: [],
    created_on: new Date(),
    updated_on: new Date(),
    activity_completed: false,
    activity_practice: false,
    asana_intention: '',
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
    isUserCreated: false,
    imageCount: 0,
    alternative_english_names: [],
    asanaActivities: [],
  },
  currentImageIndex: 0,
  isReordering: false,
  uploadProgress: null,
}

export interface AsanaPostureContextType {
  state: AsanaPosturePageState
  dispatch: Dispatch<AsanaPostureAction>
  // Helper functions for multi-image management
  setCurrentImageIndex: (index: number) => void
  updateImageCount: (count: number) => void
  addPoseImage: (image: PoseImageData) => void
  removePoseImage: (imageId: string) => void
  reorderImages: (images: PoseImageData[]) => void
  setReordering: (isReordering: boolean) => void
  setUploadProgress: (progress: number | null) => void
  resetCarousel: () => void
}

export const AsanaPostureContext = createContext<
  AsanaPostureContextType | undefined
>(undefined)

function AsanaPostureReducer(
  state: AsanaPosturePageState,
  action: AsanaPostureAction
): AsanaPosturePageState {
  switch (action.type) {
    case 'SET_POSTURES':
      return {
        ...state,
        postures: action.payload,
        currentImageIndex: 0, // Reset carousel when postures change
      }
    case 'SET_CURRENT_IMAGE_INDEX':
      return { ...state, currentImageIndex: action.payload }
    case 'UPDATE_IMAGE_COUNT':
      return {
        ...state,
        postures: {
          ...state.postures,
          imageCount: action.payload,
        },
      }
    case 'ADD_POSE_IMAGE': {
      const updatedImages = [
        ...(state.postures.poseImages || []),
        action.payload,
      ]
      return {
        ...state,
        postures: {
          ...state.postures,
          poseImages: updatedImages,
          imageCount: updatedImages.length,
        },
      }
    }
    case 'REMOVE_POSE_IMAGE': {
      const filteredImages = (state.postures.poseImages || []).filter(
        (img) => img.id !== action.payload
      )
      return {
        ...state,
        postures: {
          ...state.postures,
          poseImages: filteredImages,
          imageCount: filteredImages.length,
        },
        currentImageIndex: Math.min(
          state.currentImageIndex,
          filteredImages.length - 1
        ),
      }
    }
    case 'REORDER_IMAGES':
      return {
        ...state,
        postures: {
          ...state.postures,
          poseImages: action.payload,
        },
      }
    case 'SET_REORDERING':
      return { ...state, isReordering: action.payload }
    case 'SET_UPLOAD_PROGRESS':
      return { ...state, uploadProgress: action.payload }
    case 'RESET_CAROUSEL':
      return {
        ...state,
        currentImageIndex: 0,
        isReordering: false,
        uploadProgress: null,
      }
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

  // Helper functions for multi-image management
  const setCurrentImageIndex = (index: number) => {
    dispatch({ type: 'SET_CURRENT_IMAGE_INDEX', payload: index })
  }

  const updateImageCount = (count: number) => {
    dispatch({ type: 'UPDATE_IMAGE_COUNT', payload: count })
  }

  const addPoseImage = (image: PoseImageData) => {
    dispatch({ type: 'ADD_POSE_IMAGE', payload: image })
  }

  const removePoseImage = (imageId: string) => {
    dispatch({ type: 'REMOVE_POSE_IMAGE', payload: imageId })
  }

  const reorderImages = (images: PoseImageData[]) => {
    dispatch({ type: 'REORDER_IMAGES', payload: images })
  }

  const setReordering = (isReordering: boolean) => {
    dispatch({ type: 'SET_REORDERING', payload: isReordering })
  }

  const setUploadProgress = (progress: number | null) => {
    dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: progress })
  }

  const resetCarousel = () => {
    dispatch({ type: 'RESET_CAROUSEL' })
  }

  useEffect(() => {}, [state.postures])

  const contextValue = {
    state,
    dispatch,
    setCurrentImageIndex,
    updateImageCount,
    addPoseImage,
    removePoseImage,
    reorderImages,
    setReordering,
    setUploadProgress,
    resetCarousel,
  }

  return (
    <AsanaPostureContext.Provider value={contextValue}>
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
