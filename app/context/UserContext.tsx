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

export type UserData = {
  // 'id' is not editable
  id: string
  // 'provider_id' is not editable
  provider_id: string
  // 'name' is username and not editable
  name: string
  // 'email' is not editable
  email: string
  // 'image' is not editable
  image: string
  // 'createdAt' is not editable
  createdAt: Date
  // following fields are editable
  updatedAt: Date
  pronouns: string
  headline: string
  websiteURL: string
  location: string
  firstName: string
  lastName: string
  bio: string
  shareQuick: string
  yogaStyle: string
  yogaExperience: string
  company: string
  socialURL: string
  isLocationPublic: string
  role: string

  emailVerified: Date
  profile: Record<string, any>
  // TODO: Add the following fields to the UserData object (type/interface, updateUserData route, and UserDetails.tsx)
  // yogaStyle: string
  // yogaExperience: string
  // yogaCertification: string
  // userCompany: string
}

export type UserGithubProfile = {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string
  company: string
  blog: string
  location: string
  email: string
  hireable: boolean
  bio: string
  twitter_username: string
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
  private_gists: number
  total_private_repos: number
  owned_private_repos: number
  disk_usage: number
  collaborators: number
  two_factor_authentication: boolean
  plan: {
    name: string
    space: number
    collaborators: number
    private_repos: number
  }
}

export type UserGoogleProfile = {
  iss: string
  azp: string
  aud: string
  sub: string
  email: string
  email_verified: boolean
  at_hash: string
  name: string
  picture: string
  given_name: string
  family_name: string
  iat: number
  exp: number
}

export type UserProfilePageState = {
  userData: UserData
  userGithubProfile: UserGithubProfile
  userGoogleProfile: UserGoogleProfile
  isMobile?: boolean
  deviceInfo?: {
    isMobile: boolean
    userAgent?: string
    screenWidth?: number
    touchSupport?: boolean
  }
}

type UserAction =
  | { type: 'SET_USER'; payload: UserData }
  | { type: 'SET_GITHUB_PROFILE'; payload: UserGithubProfile }
  | { type: 'SET_GOOGLE_PROFILE'; payload: UserGoogleProfile }
  | { type: 'SET_DEVICE_INFO'; payload: UserProfilePageState['deviceInfo'] }

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
        const fetchAccount = await accountResponse.json()
        const profile = JSON.parse(fetchUser.data.profile)
        if (fetchAccount.data.provider === 'github') {
          dispatch({
            type: 'SET_GITHUB_PROFILE',
            payload: profile as UserGithubProfile,
          })
        } else if (fetchAccount.data.provider === 'google') {
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
