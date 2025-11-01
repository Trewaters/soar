import { renderHook } from '@testing-library/react'
import { useActiveProfileImage } from '../../../app/hooks/useActiveProfileImage'
import { UseUser } from '../../../app/context/UserContext'
import type {
  UserData,
  UserGithubProfile,
  UserGoogleProfile,
} from '../../../types/models/user'
import '@testing-library/jest-dom'

// Mock the UserContext
jest.mock('../../../app/context/UserContext')
const mockUseUser = UseUser as jest.MockedFunction<typeof UseUser>

// Helper to create a fully-typed UserData fixture with sensible defaults
const makeUserData = (overrides: Partial<UserData> = {}): UserData => ({
  id: '1',
  provider_id: 'prov-1',
  name: 'Test User',
  email: 'test@example.com',
  emailVerified: new Date(),
  image: 'https://oauth-provider.com/avatar.jpg',
  pronouns: '',
  profile: {},
  createdAt: new Date(),
  updatedAt: new Date(),
  firstName: 'Test',
  lastName: 'User',
  bio: '',
  headline: '',
  location: '',
  websiteURL: '',
  shareQuick: '',
  yogaStyle: '',
  yogaExperience: '',
  company: '',
  socialURL: '',
  isLocationPublic: '',
  role: 'user',
  profileImages: [],
  activeProfileImage: undefined,
  tz: 'UTC',
  ...overrides,
})

// Minimal default OAuth profile objects to satisfy UserProfilePageState shape in tests
const defaultGithubProfile: UserGithubProfile = {
  login: 'test',
  id: 1,
  node_id: 'node',
  avatar_url: '',
  gravatar_id: '',
  url: '',
  html_url: '',
  followers_url: '',
  following_url: '',
  gists_url: '',
  starred_url: '',
  subscriptions_url: '',
  organizations_url: '',
  repos_url: '',
  events_url: '',
  received_events_url: '',
  type: 'User',
  site_admin: false,
  name: 'Test User',
  company: '',
  blog: '',
  location: '',
  email: 'test@example.com',
  hireable: false,
  bio: '',
  twitter_username: '',
  public_repos: 0,
  public_gists: 0,
  followers: 0,
  following: 0,
  created_at: '',
  updated_at: '',
  private_gists: 0,
  total_private_repos: 0,
  owned_private_repos: 0,
  disk_usage: 0,
  collaborators: 0,
  two_factor_authentication: false,
  plan: { name: '', space: 0, collaborators: 0, private_repos: 0 },
}

const defaultGoogleProfile: UserGoogleProfile = {
  iss: '',
  azp: '',
  aud: '',
  sub: '',
  email: 'test@example.com',
  email_verified: true,
  at_hash: '',
  name: 'Test User',
  picture: '',
  given_name: 'Test',
  family_name: 'User',
  iat: 0,
  exp: 0,
}

// Helper to construct a full UserProfilePageState-like mock for UseUser
const makeUserProfileContext = (userDataOverrides: any = undefined) => {
  // Normalize nulls in overrides to types acceptable by UserData
  const safeOverrides: any = { ...(userDataOverrides || {}) }
  if (
    Object.prototype.hasOwnProperty.call(safeOverrides, 'activeProfileImage') &&
    safeOverrides.activeProfileImage === null
  ) {
    safeOverrides.activeProfileImage = undefined
  }
  if (
    Object.prototype.hasOwnProperty.call(safeOverrides, 'image') &&
    safeOverrides.image === null
  ) {
    safeOverrides.image = undefined
  }
  if (
    Object.prototype.hasOwnProperty.call(safeOverrides, 'profileImages') &&
    safeOverrides.profileImages === null
  ) {
    safeOverrides.profileImages = []
  }

  return {
    state: {
      userData: makeUserData(safeOverrides) as UserData as UserData,
      userGithubProfile: defaultGithubProfile,
      userGoogleProfile: defaultGoogleProfile,
      isMobile: false,
      deviceInfo: { isMobile: false },
    },
    dispatch: jest.fn(),
  }
}

describe('useActiveProfileImage', () => {
  const mockProfileImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ]

  const mockUserData = makeUserData({
    profileImages: mockProfileImages,
    activeProfileImage: mockProfileImages[0],
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Active Image Priority Logic', () => {
    it('should return active profile image when set and valid', () => {
      mockUseUser.mockReturnValue(makeUserProfileContext(mockUserData))

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

      mockUseUser.mockReturnValue(makeUserProfileContext(invalidActiveUserData))

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

      mockUseUser.mockReturnValue(
        makeUserProfileContext(noProfileImagesUserData)
      )

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

      mockUseUser.mockReturnValue(makeUserProfileContext(noImagesUserData))

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

      mockUseUser.mockReturnValue(
        makeUserProfileContext(nullProfileImagesUserData)
      )

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

      mockUseUser.mockReturnValue(
        makeUserProfileContext(undefinedProfileImagesUserData)
      )

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
      mockUseUser.mockReturnValue(makeUserProfileContext(mockUserData))

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.hasCustomImage).toBe(true)
    })

    it('should return true when user has uploaded images but no active set', () => {
      const noActiveUserData = {
        ...mockUserData,
        activeProfileImage: null,
      }

      mockUseUser.mockReturnValue(makeUserProfileContext(noActiveUserData))

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.hasCustomImage).toBe(true)
    })

    it('should return false when user has no uploaded images', () => {
      const noImagesUserData = {
        ...mockUserData,
        profileImages: [],
        activeProfileImage: null,
      }

      mockUseUser.mockReturnValue(makeUserProfileContext(noImagesUserData))

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.hasCustomImage).toBe(false)
    })
  })

  describe('Image Count Logic', () => {
    it('should return correct count for multiple images', () => {
      mockUseUser.mockReturnValue(makeUserProfileContext(mockUserData))

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.imageCount).toBe(3)
    })

    it('should return 0 for empty profile images array', () => {
      const noImagesUserData = {
        ...mockUserData,
        profileImages: [],
        activeProfileImage: null,
      }

      mockUseUser.mockReturnValue(makeUserProfileContext(noImagesUserData))

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.imageCount).toBe(0)
    })

    it('should return 0 for null profile images', () => {
      const nullImagesUserData = {
        ...mockUserData,
        profileImages: null,
        activeProfileImage: null,
      }

      mockUseUser.mockReturnValue(makeUserProfileContext(nullImagesUserData))

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.imageCount).toBe(0)
    })

    it('should return 1 for single image', () => {
      const singleImageUserData = {
        ...mockUserData,
        profileImages: [mockProfileImages[0]],
        activeProfileImage: mockProfileImages[0],
      }

      mockUseUser.mockReturnValue(makeUserProfileContext(singleImageUserData))

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

      mockUseUser.mockReturnValue(makeUserProfileContext(emptyActiveUserData))

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.activeImage).toBe(mockProfileImages[0])
      expect(result.current.hasCustomImage).toBe(true)
    })

    it('should handle whitespace-only active profile image', () => {
      const whitespaceActiveUserData = {
        ...mockUserData,
        activeProfileImage: '   ',
      }

      mockUseUser.mockReturnValue(
        makeUserProfileContext(whitespaceActiveUserData)
      )

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

      mockUseUser.mockReturnValue(makeUserProfileContext(specialCharUserData))

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

      mockUseUser.mockReturnValue(makeUserProfileContext(longUrlUserData))

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.activeImage).toBe(longUrl)
      expect(result.current.hasCustomImage).toBe(true)
      expect(result.current.imageCount).toBe(1)
    })
  })

  describe('Memoization', () => {
    it('should return same values when userData has not changed', () => {
      const mockState = makeUserProfileContext(mockUserData)
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
      const initialState = makeUserProfileContext(mockUserData)
      mockUseUser.mockReturnValue(initialState)

      const { result, rerender } = renderHook(() => useActiveProfileImage())

      expect(result.current.activeImage).toBe(mockProfileImages[0])

      // Change the userData
      const updatedUserData = {
        ...mockUserData,
        activeProfileImage: mockProfileImages[1],
      }
      mockUseUser.mockReturnValue(makeUserProfileContext(updatedUserData))

      rerender()

      expect(result.current.activeImage).toBe(mockProfileImages[1])
    })
  })

  describe('Integration with UserContext', () => {
    it('should handle UserContext returning undefined state', () => {
      mockUseUser.mockReturnValue(makeUserProfileContext({}))

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.activeImage).toBe('/images/profile-placeholder.png')
      expect(result.current.hasCustomImage).toBe(false)
      expect(result.current.imageCount).toBe(0)
    })

    it('should handle minimal user data structure', () => {
      const minimalUserData = {
        email: 'test@example.com',
      }

      mockUseUser.mockReturnValue(makeUserProfileContext(minimalUserData))

      const { result } = renderHook(() => useActiveProfileImage())

      expect(result.current.activeImage).toBe('/images/profile-placeholder.png')
      expect(result.current.hasCustomImage).toBe(false)
      expect(result.current.imageCount).toBe(0)
    })
  })
})
