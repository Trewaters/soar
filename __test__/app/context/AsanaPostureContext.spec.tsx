/**
 * Unit tests for AsanaPostureContext with multi-image support
 * Tests enhanced context functionality for carousel management and image operations
 */

import '@testing-library/jest-dom'
import { renderHook, act } from '@testing-library/react'
import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import AsanaPostureProvider, {
  useAsanaPosture,
} from '../../../app/context/AsanaPostureContext'
import { PoseImageData } from '../../../types/images'
import { theme } from '../../../styles/theme'
import { AsanaPose } from 'types/asana'

// Mock NextAuth
jest.mock('next-auth/react')

// Mock session for testing
const mockSession = {
  user: {
    id: 'test-user-id',
    email: 'test@uvuyoga.com',
    name: 'Test Yogi',
  },
  expires: '2025-12-31T23:59:59.999Z',
}

// Test wrapper component
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <SessionProvider session={mockSession}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AsanaPostureProvider>{children}</AsanaPostureProvider>
    </ThemeProvider>
  </SessionProvider>
)

// Mock data
const mockAsana: AsanaPose = {
  id: 'test-asana-1',
  english_names: ['Warrior I'],
  sanskrit_names: ['Virabhadrasana I'],
  sort_english_name: 'Warrior I',
  description: 'A powerful standing pose',
  benefits: 'Strengthens legs and core',
  category: 'standing',
  difficulty: 'beginner',
  lore: 'Named after a fierce warrior',
  breath: ['inhale to lift, exhale to ground'],
  dristi: 'forward',
  alignment_cues: 'High lunge',
  label: 'Foundational pose',
  suggested_postures: ['Warrior II', 'Warrior III'],
  preparatory_postures: ['Mountain Pose', 'Standing Forward Fold'],
  poseImages: [],
  created_on: '2024-01-01T00:00:00Z' as unknown as Date,
  updated_on: '2024-01-02T00:00:00Z' as unknown as Date,
  activity_completed: false,
  activity_practice: true,
  asana_intention: 'Strength and stability',
  duration_asana: '30 seconds',
  transition_cues_out: 'Step back to downward dog',
  transition_cues_in: 'Step forward from downward dog',
  setup_cues: 'Ground through feet',
  deepening_cues: 'Lift through crown',
  customize_asana: 'Adjust stance length',
  additional_cues: 'Keep hips square',
  joint_action: 'Hip flexion, ankle dorsiflexion',
  muscle_action: 'Quadriceps engagement',
  created_by: 'test-user-id',
  isUserCreated: true,
  imageCount: 0,
  pose_modifications: ['Use blocks under hands'],
  alternative_english_names: ['Warrior I', 'Virabhadrasana I'],
  asanaActivities: [],
  pose_variations: ['High lunge', 'Low lunge'],
}

const mockPoseImage: PoseImageData = {
  id: 'image-1',
  userId: 'test-user-id',
  postureId: 'test-asana-1',
  postureName: 'Warrior I',
  url: 'https://example.com/warrior1.jpg',
  altText: 'Warrior I demonstration',
  fileName: 'warrior1.jpg',
  fileSize: 1024,
  uploadedAt: new Date('2024-01-01T00:00:00Z'),
  storageType: 'CLOUD',
  isOffline: false,
  imageType: 'image/jpeg',
  displayOrder: 1,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
}

describe('AsanaPostureContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Context Provider', () => {
    it('should provide initial state with proper defaults', () => {
      const { result } = renderHook(() => useAsanaPosture(), {
        wrapper: TestWrapper,
      })

      expect(result.current.state.currentImageIndex).toBe(0)
      expect(result.current.state.isReordering).toBe(false)
      expect(result.current.state.uploadProgress).toBe(null)
      expect(result.current.state.postures.imageCount).toBe(0)
      expect(result.current.state.postures.poseImages).toEqual([])
    })

    it('should provide all helper functions', () => {
      const { result } = renderHook(() => useAsanaPosture(), {
        wrapper: TestWrapper,
      })

      expect(typeof result.current.setCurrentImageIndex).toBe('function')
      expect(typeof result.current.updateImageCount).toBe('function')
      expect(typeof result.current.addPoseImage).toBe('function')
      expect(typeof result.current.removePoseImage).toBe('function')
      expect(typeof result.current.reorderImages).toBe('function')
      expect(typeof result.current.setReordering).toBe('function')
      expect(typeof result.current.setUploadProgress).toBe('function')
      expect(typeof result.current.resetCarousel).toBe('function')
    })

    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test since React will log the error
      const originalError = console.error
      console.error = jest.fn()

      // Test the hook without a provider wrapper - should throw error
      expect(() => {
        renderHook(() => useAsanaPosture())
      }).toThrow('useAsanaPosture must be used within an AsanaPostureProvider')

      console.error = originalError
    })
  })

  describe('State Management', () => {
    it('should set postures and reset carousel index', () => {
      const { result } = renderHook(() => useAsanaPosture(), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.setCurrentImageIndex(2)
      })

      expect(result.current.state.currentImageIndex).toBe(2)

      act(() => {
        result.current.dispatch({
          type: 'SET_POSTURES',
          payload: mockAsana,
        })
      })

      expect(result.current.state.postures).toEqual(mockAsana)
      expect(result.current.state.currentImageIndex).toBe(0) // Should reset
    })

    it('should update current image index', () => {
      const { result } = renderHook(() => useAsanaPosture(), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.setCurrentImageIndex(1)
      })

      expect(result.current.state.currentImageIndex).toBe(1)
    })

    it('should update image count', () => {
      const { result } = renderHook(() => useAsanaPosture(), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.updateImageCount(3)
      })

      expect(result.current.state.postures.imageCount).toBe(3)
    })

    it('should set reordering state', () => {
      const { result } = renderHook(() => useAsanaPosture(), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.setReordering(true)
      })

      expect(result.current.state.isReordering).toBe(true)

      act(() => {
        result.current.setReordering(false)
      })

      expect(result.current.state.isReordering).toBe(false)
    })

    it('should set upload progress', () => {
      const { result } = renderHook(() => useAsanaPosture(), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.setUploadProgress(50)
      })

      expect(result.current.state.uploadProgress).toBe(50)

      act(() => {
        result.current.setUploadProgress(null)
      })

      expect(result.current.state.uploadProgress).toBe(null)
    })

    it('should reset carousel state', () => {
      const { result } = renderHook(() => useAsanaPosture(), {
        wrapper: TestWrapper,
      })

      // Set some non-default values
      act(() => {
        result.current.setCurrentImageIndex(2)
        result.current.setReordering(true)
        result.current.setUploadProgress(75)
      })

      // Reset carousel
      act(() => {
        result.current.resetCarousel()
      })

      expect(result.current.state.currentImageIndex).toBe(0)
      expect(result.current.state.isReordering).toBe(false)
      expect(result.current.state.uploadProgress).toBe(null)
    })
  })

  describe('Image Management', () => {
    it('should add pose image and update count', () => {
      const { result } = renderHook(() => useAsanaPosture(), {
        wrapper: TestWrapper,
      })

      act(() => {
        result.current.addPoseImage(mockPoseImage)
      })

      expect(result.current.state.postures.poseImages).toContain(mockPoseImage)
      expect(result.current.state.postures.imageCount).toBe(1)
    })

    it('should add multiple pose images', () => {
      const { result } = renderHook(() => useAsanaPosture(), {
        wrapper: TestWrapper,
      })

      const image2: PoseImageData = {
        ...mockPoseImage,
        id: 'image-2',
        displayOrder: 2,
      }

      act(() => {
        result.current.addPoseImage(mockPoseImage)
        result.current.addPoseImage(image2)
      })

      expect(result.current.state.postures.poseImages).toHaveLength(2)
      expect(result.current.state.postures.imageCount).toBe(2)
    })

    it('should remove pose image and update count', () => {
      const { result } = renderHook(() => useAsanaPosture(), {
        wrapper: TestWrapper,
      })

      // Add image first
      act(() => {
        result.current.addPoseImage(mockPoseImage)
      })

      expect(result.current.state.postures.imageCount).toBe(1)

      // Remove image
      act(() => {
        result.current.removePoseImage(mockPoseImage.id)
      })

      expect(result.current.state.postures.poseImages).toHaveLength(0)
      expect(result.current.state.postures.imageCount).toBe(0)
    })

    it('should adjust current image index when removing image', () => {
      const { result } = renderHook(() => useAsanaPosture(), {
        wrapper: TestWrapper,
      })

      const image2: PoseImageData = {
        ...mockPoseImage,
        id: 'image-2',
        displayOrder: 2,
      }
      const image3: PoseImageData = {
        ...mockPoseImage,
        id: 'image-3',
        displayOrder: 3,
      }

      // Add three images
      act(() => {
        result.current.addPoseImage(mockPoseImage)
        result.current.addPoseImage(image2)
        result.current.addPoseImage(image3)
        result.current.setCurrentImageIndex(2) // Set to last image
      })

      expect(result.current.state.currentImageIndex).toBe(2)

      // Remove last image
      act(() => {
        result.current.removePoseImage(image3.id)
      })

      expect(result.current.state.currentImageIndex).toBe(1) // Should adjust to valid index
    })

    it('should reorder images correctly', () => {
      const { result } = renderHook(() => useAsanaPosture(), {
        wrapper: TestWrapper,
      })

      const image2: PoseImageData = {
        ...mockPoseImage,
        id: 'image-2',
        displayOrder: 2,
      }

      // Add images in order
      act(() => {
        result.current.addPoseImage(mockPoseImage)
        result.current.addPoseImage(image2)
      })

      // Reorder images (swap order)
      const reorderedImages = [
        { ...image2, displayOrder: 1 },
        { ...mockPoseImage, displayOrder: 2 },
      ]

      act(() => {
        result.current.reorderImages(reorderedImages)
      })

      expect(result.current.state.postures.poseImages).toEqual(reorderedImages)
    })
  })

  describe('Integration with Initial State', () => {
    it('should handle posture with existing images', () => {
      const { result } = renderHook(() => useAsanaPosture(), {
        wrapper: TestWrapper,
      })

      const asanaWithImages: AsanaPose = {
        ...mockAsana,
        imageCount: 2,
        poseImages: [
          mockPoseImage,
          { ...mockPoseImage, id: 'image-2', displayOrder: 2 },
        ],
      }

      act(() => {
        result.current.dispatch({
          type: 'SET_POSTURES',
          payload: asanaWithImages,
        })
      })

      expect(result.current.state.postures.imageCount).toBe(2)
      expect(result.current.state.postures.poseImages).toHaveLength(2)
      expect(result.current.state.currentImageIndex).toBe(0) // Reset on posture change
    })

    it('should maintain backward compatibility with single image asanas', () => {
      const { result } = renderHook(() => useAsanaPosture(), {
        wrapper: TestWrapper,
      })

      const singleImageAsana: AsanaPose = {
        ...mockAsana,
        imageCount: 1,
        poseImages: [], // No multi-image data
      }

      act(() => {
        result.current.dispatch({
          type: 'SET_POSTURES',
          payload: singleImageAsana,
        })
      })

      expect(result.current.state.postures.poseImages).toBe('single-image.jpg')
      expect(result.current.state.postures.imageCount).toBe(1)
      expect(result.current.state.postures.poseImages).toBeUndefined()
    })
  })

  describe('Error Handling', () => {
    it('should handle undefined pose images gracefully', () => {
      const { result } = renderHook(() => useAsanaPosture(), {
        wrapper: TestWrapper,
      })

      const asanaWithoutImages: AsanaPose = {
        ...mockAsana,
        poseImages: [],
      }

      act(() => {
        result.current.dispatch({
          type: 'SET_POSTURES',
          payload: asanaWithoutImages,
        })
      })

      // Should not throw error when adding image to asana without existing images
      act(() => {
        result.current.addPoseImage(mockPoseImage)
      })

      expect(result.current.state.postures.poseImages).toContain(mockPoseImage)
    })

    it('should handle removing non-existent image gracefully', () => {
      const { result } = renderHook(() => useAsanaPosture(), {
        wrapper: TestWrapper,
      })

      // Try to remove image that doesn't exist
      act(() => {
        result.current.removePoseImage('non-existent-id')
      })

      // Should not throw error and should maintain state
      expect(result.current.state.postures.poseImages).toEqual([])
      expect(result.current.state.postures.imageCount).toBe(0)
    })

    it('should handle negative image index gracefully', () => {
      const { result } = renderHook(() => useAsanaPosture(), {
        wrapper: TestWrapper,
      })

      // Add some images
      act(() => {
        result.current.addPoseImage(mockPoseImage)
        result.current.setCurrentImageIndex(0)
      })

      // Remove the only image
      act(() => {
        result.current.removePoseImage(mockPoseImage.id)
      })

      // Current index should be adjusted to -1 but Math.min should handle it
      expect(result.current.state.currentImageIndex).toBe(-1)
    })
  })
})
