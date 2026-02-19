/* eslint-disable @typescript-eslint/no-unused-vars */
// Create a context for the AsanaPose component
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react'
import { PoseImageData } from '../../types/images'
import {
  AsanaPose,
  DisplayAsanaPose,
  PoseCardFields as CanonicalPoseCardFields,
} from 'types/asana'
import { createEmptyAsanaFormData } from '@app/clientComponents/asanaUi/asanaFieldConstants'

export type displayAsanaPose = DisplayAsanaPose

// PoseCard fields
export type PoseCardFields = CanonicalPoseCardFields

export interface AsanaPosePageState {
  // allow partial during initial load/migration to avoid strict type mismatch
  poses: Partial<AsanaPose>
  // New multi-image carousel state
  currentImageIndex: number
  isReordering: boolean
  uploadProgress: number | null
}

type AsanaPoseAction =
  | { type: 'SET_POSES'; payload: Partial<AsanaPose> }
  | { type: 'SET_CURRENT_IMAGE_INDEX'; payload: number }
  | { type: 'UPDATE_IMAGE_COUNT'; payload: number }
  | { type: 'ADD_POSE_IMAGE'; payload: PoseImageData }
  | { type: 'REMOVE_POSE_IMAGE'; payload: string } // imageId
  | { type: 'REORDER_IMAGES'; payload: PoseImageData[] }
  | { type: 'SET_REORDERING'; payload: boolean }
  | { type: 'SET_UPLOAD_PROGRESS'; payload: number | null }
  | { type: 'RESET_CAROUSEL' }

const initialState: AsanaPosePageState = {
  poses: {
    id: '',
    ...createEmptyAsanaFormData(),
    poseImages: [],
    imageCount: 0,
    isUserCreated: false,
  },
  currentImageIndex: 0,
  isReordering: false,
  uploadProgress: null,
}

export interface AsanaPoseContextType {
  state: AsanaPosePageState
  dispatch: Dispatch<AsanaPoseAction>
  // Helper functions for multi-image management
  setCurrentImageIndex: Function
  updateImageCount: Function
  addPoseImage: Function
  removePoseImage: Function
  reorderImages: Function
  setReordering: Function
  setUploadProgress: Function
  resetCarousel: () => void
}

export const AsanaPoseContext = createContext<AsanaPoseContextType | undefined>(
  undefined
)

function AsanaPoseReducer(
  state: AsanaPosePageState,
  action: AsanaPoseAction
): AsanaPosePageState {
  switch (action.type) {
    case 'SET_POSES':
      return {
        ...state,
        poses: action.payload,
        currentImageIndex: 0, // Reset carousel when poses change
      }
    case 'SET_CURRENT_IMAGE_INDEX':
      return { ...state, currentImageIndex: action.payload }
    case 'UPDATE_IMAGE_COUNT':
      return {
        ...state,
        poses: {
          ...state.poses,
          imageCount: action.payload,
        },
      }
    case 'ADD_POSE_IMAGE': {
      const updatedImages = [...(state.poses.poseImages || []), action.payload]
      return {
        ...state,
        poses: {
          ...state.poses,
          poseImages: updatedImages,
          imageCount: updatedImages.length,
        },
      }
    }
    case 'REMOVE_POSE_IMAGE': {
      const filteredImages = (state.poses.poseImages || []).filter(
        (img) => img.id !== action.payload
      )
      return {
        ...state,
        poses: {
          ...state.poses,
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
        poses: {
          ...state.poses,
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

export default function AsanaPoseProvider({
  children,
  hydration,
}: {
  children: ReactNode
  hydration?: { asanaPose?: any }
}) {
  const [state, dispatch] = useReducer(AsanaPoseReducer, initialState)

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

  useEffect(() => {}, [state.poses])

  // Apply hydration payload if present
  useEffect(() => {
    if (hydration && hydration.asanaPose) {
      try {
        dispatch({ type: 'SET_POSES', payload: hydration.asanaPose })
      } catch (err) {
        console.warn('[AsanaPoseProvider] hydration failed', err)
      }
    }
  }, [hydration])

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
    <AsanaPoseContext.Provider value={contextValue}>
      {children}
    </AsanaPoseContext.Provider>
  )
}

export function useAsanaPose() {
  const context = useContext(AsanaPoseContext)
  if (context === undefined) {
    throw new Error('useAsanaPose must be used within an AsanaPoseProvider')
  }
  return context
}

// Defensive hook: returns a safe no-op fallback if the provider is missing.
export function useSafeAsanaPose(): AsanaPoseContextType {
  try {
    return useAsanaPose()
  } catch (err) {
    console.warn(
      '[useSafeAsanaPose] AsanaPoseProvider not found, returning fallback'
    )
    const fallback: AsanaPoseContextType = {
      state: initialState,
      dispatch: () => undefined,
      setCurrentImageIndex: () => undefined,
      updateImageCount: () => undefined,
      addPoseImage: () => undefined,
      removePoseImage: () => undefined,
      reorderImages: () => undefined,
      setReordering: () => undefined,
      setUploadProgress: () => undefined,
      resetCarousel: () => undefined,
    }
    return fallback
  }
}
