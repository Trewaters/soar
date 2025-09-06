import { renderHook } from '@testing-library/react'
import { useActiveProfileImage } from '../../../app/hooks/useActiveProfileImage'
import { UseUser } from '../../../app/context/UserContext'
import '@testing-library/jest-dom'

// Mock the UserContext
jest.mock('../../../app/context/UserContext')
const mockUseUser = UseUser as jest.MockedFunction<typeof UseUser>

describe('useActiveProfileImage', () => {
  const mockProfileImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ]

  const mockUserData = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    image: 'https://oauth-provider.com/avatar.jpg',
    profileImages: mockProfileImages,
    activeProfileImage: mockProfileImages[0],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Active Image Priority Logic', () => {
    it('should return active profile image when set and valid', () => {
      mockUseUser.mockReturnValue({
        state: { userData: mockUserData },
        dispatch: jest.fn(),
      })

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.activeImage).toBe(mockProfileImages[0])
      expect(result.current.hasCustomImage).toBe(true)
      expect(result.current.imageCount).toBe(3)
    })

    it('should fallback to first uploaded image when active is invalid', () => {
      const invalidActiveUserData = {
        ...mockUserData,
        activeProfileImage: 'https://invalid-url.com/image.jpg', // Not in profileImages
      }

      mockUseUser.mockReturnValue({
        state: { userData: invalidActiveUserData },
        dispatch: jest.fn(),
      })

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.activeImage).toBe(mockProfileImages[0])
      expect(result.current.hasCustomImage).toBe(true)
    })

    it('should fallback to OAuth image when no profile images exist', () => {
      const noProfileImagesUserData = {
        ...mockUserData,
        profileImages: [],
        activeProfileImage: null,
      }

      mockUseUser.mockReturnValue({
        state: { userData: noProfileImagesUserData },
        dispatch: jest.fn(),
      })

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.activeImage).toBe(
        'https://oauth-provider.com/avatar.jpg'
      )
      expect(result.current.hasCustomImage).toBe(false)
      expect(result.current.imageCount).toBe(0)
    })

    it('should fallback to placeholder when no images exist at all', () => {
      const noImagesUserData = {
        ...mockUserData,
        profileImages: [],
        activeProfileImage: null,
        image: null,
      }

      mockUseUser.mockReturnValue({
        state: { userData: noImagesUserData },
        dispatch: jest.fn(),
      })

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.activeImage).toBe('/images/profile-placeholder.png')
      expect(result.current.hasCustomImage).toBe(false)
      expect(result.current.imageCount).toBe(0)
    })

    it('should handle null profileImages array', () => {
      const nullProfileImagesUserData = {
        ...mockUserData,
        profileImages: null,
        activeProfileImage: null,
      }

      mockUseUser.mockReturnValue({
        state: { userData: nullProfileImagesUserData },
        dispatch: jest.fn(),
      })

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.activeImage).toBe(
        'https://oauth-provider.com/avatar.jpg'
      )
      expect(result.current.hasCustomImage).toBe(false)
      expect(result.current.imageCount).toBe(0)
    })

    it('should handle undefined profileImages', () => {
      const undefinedProfileImagesUserData = {
        ...mockUserData,
        profileImages: undefined,
        activeProfileImage: null,
      }

      mockUseUser.mockReturnValue({
        state: { userData: undefinedProfileImagesUserData },
        dispatch: jest.fn(),
      })

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.activeImage).toBe(
        'https://oauth-provider.com/avatar.jpg'
      )
      expect(result.current.hasCustomImage).toBe(false)
      expect(result.current.imageCount).toBe(0)
    })
  })

  describe('hasCustomImage Logic', () => {
    it('should return true when user has active profile image', () => {
      mockUseUser.mockReturnValue({
        state: { userData: mockUserData },
        dispatch: jest.fn(),
      })

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.hasCustomImage).toBe(true)
    })

    it('should return true when user has uploaded images but no active set', () => {
      const noActiveUserData = {
        ...mockUserData,
        activeProfileImage: null,
      }

      mockUseUser.mockReturnValue({
        state: { userData: noActiveUserData },
        dispatch: jest.fn(),
      })

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.hasCustomImage).toBe(true)
    })

    it('should return false when user has no uploaded images', () => {
      const noImagesUserData = {
        ...mockUserData,
        profileImages: [],
        activeProfileImage: null,
      }

      mockUseUser.mockReturnValue({
        state: { userData: noImagesUserData },
        dispatch: jest.fn(),
      })

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.hasCustomImage).toBe(false)
    })
  })

  describe('Image Count Logic', () => {
    it('should return correct count for multiple images', () => {
      mockUseUser.mockReturnValue({
        state: { userData: mockUserData },
        dispatch: jest.fn(),
      })

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.imageCount).toBe(3)
    })

    it('should return 0 for empty profile images array', () => {
      const noImagesUserData = {
        ...mockUserData,
        profileImages: [],
        activeProfileImage: null,
      }

      mockUseUser.mockReturnValue({
        state: { userData: noImagesUserData },
        dispatch: jest.fn(),
      })

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.imageCount).toBe(0)
    })

    it('should return 0 for null profile images', () => {
      const nullImagesUserData = {
        ...mockUserData,
        profileImages: null,
        activeProfileImage: null,
      }

      mockUseUser.mockReturnValue({
        state: { userData: nullImagesUserData },
        dispatch: jest.fn(),
      })

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.imageCount).toBe(0)
    })

    it('should return 1 for single image', () => {
      const singleImageUserData = {
        ...mockUserData,
        profileImages: [mockProfileImages[0]],
        activeProfileImage: mockProfileImages[0],
      }

      mockUseUser.mockReturnValue({
        state: { userData: singleImageUserData },
        dispatch: jest.fn(),
      })

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.imageCount).toBe(1)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty string active profile image', () => {
      const emptyActiveUserData = {
        ...mockUserData,
        activeProfileImage: '',
      }

      mockUseUser.mockReturnValue({
        state: { userData: emptyActiveUserData },
        dispatch: jest.fn(),
      })

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.activeImage).toBe(mockProfileImages[0])
      expect(result.current.hasCustomImage).toBe(true)
    })

    it('should handle whitespace-only active profile image', () => {
      const whitespaceActiveUserData = {
        ...mockUserData,
        activeProfileImage: '   ',
      }

      mockUseUser.mockReturnValue({
        state: { userData: whitespaceActiveUserData },
        dispatch: jest.fn(),
      })

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.activeImage).toBe(mockProfileImages[0])
      expect(result.current.hasCustomImage).toBe(true)
    })

    it('should handle active image with special characters', () => {
      const specialCharUrl = 'https://example.com/image%20with%20spaces.jpg?v=1'
      const specialCharUserData = {
        ...mockUserData,
        profileImages: [specialCharUrl, ...mockProfileImages],
        activeProfileImage: specialCharUrl,
      }

      mockUseUser.mockReturnValue({
        state: { userData: specialCharUserData },
        dispatch: jest.fn(),
      })

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.activeImage).toBe(specialCharUrl)
      expect(result.current.hasCustomImage).toBe(true)
      expect(result.current.imageCount).toBe(4)
    })

    it('should handle very long image URLs', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(1000) + '.jpg'
      const longUrlUserData = {
        ...mockUserData,
        profileImages: [longUrl],
        activeProfileImage: longUrl,
      }

      mockUseUser.mockReturnValue({
        state: { userData: longUrlUserData },
        dispatch: jest.fn(),
      })

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.activeImage).toBe(longUrl)
      expect(result.current.hasCustomImage).toBe(true)
      expect(result.current.imageCount).toBe(1)
    })
  })

  describe('Memoization', () => {
    it('should return same values when userData has not changed', () => {
      const mockState = {
        state: { userData: mockUserData },
        dispatch: jest.fn(),
      }
      mockUseUser.mockReturnValue(mockState)

      const { result, rerender } = renderHook(() => useActiveProfileImage())

      const firstResult = result.current
      rerender()
      const secondResult = result.current

      expect(firstResult.activeImage).toBe(secondResult.activeImage)
      expect(firstResult.hasCustomImage).toBe(secondResult.hasCustomImage)
      expect(firstResult.imageCount).toBe(secondResult.imageCount)
    })

    it('should update when userData changes', () => {
      const initialState = {
        state: { userData: mockUserData },
        dispatch: jest.fn(),
      }
      mockUseUser.mockReturnValue(initialState)

      const { result, rerender } = renderHook(() => useActiveProfileImage())

      expect(result.current.activeImage).toBe(mockProfileImages[0])

      // Change the userData
      const updatedUserData = {
        ...mockUserData,
        activeProfileImage: mockProfileImages[1],
      }
      mockUseUser.mockReturnValue({
        state: { userData: updatedUserData },
        dispatch: jest.fn(),
      })

      rerender()

      expect(result.current.activeImage).toBe(mockProfileImages[1])
    })
  })

  describe('Integration with UserContext', () => {
    it('should handle UserContext returning undefined state', () => {
      mockUseUser.mockReturnValue({
        state: { userData: {} },
        dispatch: jest.fn(),
      })

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.activeImage).toBe('/images/profile-placeholder.png')
      expect(result.current.hasCustomImage).toBe(false)
      expect(result.current.imageCount).toBe(0)
    })

    it('should handle minimal user data structure', () => {
      const minimalUserData = {
        email: 'test@example.com',
      }

      mockUseUser.mockReturnValue({
        state: { userData: minimalUserData },
        dispatch: jest.fn(),
      })

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.activeImage).toBe('/images/profile-placeholder.png')
      expect(result.current.hasCustomImage).toBe(false)
      expect(result.current.imageCount).toBe(0)
    })
  })
})
