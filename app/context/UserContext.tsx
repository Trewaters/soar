'use client'
import React, {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  Dispatch,
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import { isMobileDevice } from '@app/utils/mobileInputHelpers'
import type {
  UserData,
  UserGithubProfile,
  UserGoogleProfile,
  UserProfilePageState,
  UserAction,
} from '../../types/models/user'

const initialState: UserProfilePageState = {
  userData: {
    id: '1',
    provider_id: '',
    name: '',
    email: '',
    emailVerified: new Date(),
    image: '',
    pronouns: '',
    profile: {} as Record<string, any>,
    createdAt: new Date(),
    updatedAt: new Date(),
    firstName: '',
    lastName: '',
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
  },
  userGithubProfile: {
    login: '',
    id: 0,
    node_id: '',
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
    type: '',
    site_admin: false,
    name: '',
    company: '',
    blog: '',
    location: '',
    email: '',
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
    plan: {
      name: '',
      space: 0,
      collaborators: 0,
      private_repos: 0,
    },
  },
  userGoogleProfile: {
    iss: '',
    azp: '',
    aud: '',
    sub: '',
    email: '',
    email_verified: false,
    at_hash: '',
    name: '',
    picture: '',
    given_name: '',
    family_name: '',
    iat: 0,
    exp: 0,
  },
  isMobile: false,
  deviceInfo: {
    isMobile: false,
    touchSupport: false,
  },
}

interface UserStateContextType {
  state: UserProfilePageState
  dispatch: Dispatch<UserAction>
}

export const UserStateContext = createContext<UserStateContextType>({
  state: initialState,
  dispatch: () => null,
})

function UserReducer(
  state: UserProfilePageState,
  action: UserAction
): UserProfilePageState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, userData: action.payload }
    case 'SET_GITHUB_PROFILE':
      return { ...state, userGithubProfile: action.payload }
    case 'SET_GOOGLE_PROFILE':
      return { ...state, userGoogleProfile: action.payload }
    case 'SET_DEVICE_INFO':
      return {
        ...state,
        deviceInfo: action.payload,
        isMobile: action.payload?.isMobile || false,
      }
    case 'SET_PROFILE_IMAGES':
      return {
        ...state,
        userData: {
          ...state.userData,
          profileImages: action.payload.images,
          activeProfileImage: action.payload.active || undefined,
        },
      }
    default:
      return state
  }
}

export default function UserStateProvider({
  children,
}: {
  children: ReactNode
}) {
  const [state, dispatch] = useReducer(UserReducer, initialState)

  // Detect device capabilities on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const deviceInfo = {
        isMobile: isMobileDevice(),
        userAgent: navigator.userAgent,
        screenWidth: window.screen.width,
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      }

      dispatch({ type: 'SET_DEVICE_INFO', payload: deviceInfo })
    }
  }, [])

  // Memoize the fetchUserData function to prevent unnecessary re-creation
  const fetchUserData = useCallback(
    async (email: string) => {
      let fetchUser: any
      try {
        const userResponse = await fetch(
          `/api/user/?email=${encodeURIComponent(email)}`,
          { cache: 'no-store' }
        )
        if (!userResponse.ok) {
          const errorText = await userResponse.text()
          throw new Error(`Failed to fetch user data: ${errorText}`)
        }
        fetchUser = await userResponse.json()
        dispatch({ type: 'SET_USER', payload: fetchUser.data })
      } catch (error) {
        throw new Error(`Error fetching user data: ${error}`)
      }

      try {
        const accountResponse = await fetch(
          `/api/user/fetchAccount/?userId=${fetchUser.data.id}`,
          { cache: 'no-store' }
        )

        if (!accountResponse.ok) {
          // No provider account exists for this user - skip provider profile handling
          // Log for debugging and return early
          try {
            const txt = await accountResponse.text()
            console.warn('fetchAccount not ok:', accountResponse.status, txt)
          } catch (_) {
            console.warn('fetchAccount not ok:', accountResponse.status)
          }
          return
        }

        const fetchAccount = await accountResponse.json()

        // Safely parse profile JSON; profile may be empty or already an object
        let profile: any = {}
        try {
          profile = fetchUser.data.profile
            ? typeof fetchUser.data.profile === 'string'
              ? JSON.parse(fetchUser.data.profile)
              : fetchUser.data.profile
            : {}
        } catch (err) {
          console.warn('Failed to parse user.profile JSON', err)
          profile = {}
        }

        const provider = fetchAccount?.data?.provider
        if (!provider) {
          // nothing to do if provider info is missing
          return
        }

        if (provider === 'github') {
          dispatch({
            type: 'SET_GITHUB_PROFILE',
            payload: profile as UserGithubProfile,
          })
        } else if (provider === 'google') {
          dispatch({
            type: 'SET_GOOGLE_PROFILE',
            payload: profile as UserGoogleProfile,
          })
        }
      } catch (error) {
        throw new Error(`Error fetching user profile: ${error}`)
      }
    },
    [dispatch]
  )

  useEffect(() => {
    if (state.userData.email) {
      fetchUserData(state.userData.email)
    }
  }, [state.userData.email, fetchUserData])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch]
  )

  return (
    <UserStateContext.Provider value={contextValue}>
      {children}
    </UserStateContext.Provider>
  )
}

export function UseUser() {
  const context = useContext(UserStateContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserStateProvider')
  }
  return context
}
