'use client'
import {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
  useState,
  useEffect,
} from 'react'

export type UserData = {
  id: string
  provider_id: string
  name: string
  email: string
  emailVerified: Date
  image: string
  pronouns: string
  profile: Record<string, any>
  createdAt: Date
  updatedAt: Date
  firstName: string
  lastName: string
  bio: string
  headline: string
  location: string
  websiteURL: string
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
}

type UserAction =
  | { type: 'SET_USER'; payload: UserData }
  | { type: 'SET_GITHUB_PROFILE'; payload: UserGithubProfile }
  | { type: 'SET_GOOGLE_PROFILE'; payload: UserGoogleProfile }

const initialState: UserProfilePageState = {
  userData: {
    id: '1',
    provider_id: '',
    name: 'initialState',
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

  useEffect(() => {
    const fetchUserData = async (email: string) => {
      console.log('fetchUserData by email:', email)
      let fetchUser: any
      try {
        const userResponse = await fetch(
          `/api/user/?email=${encodeURIComponent(email)}`
        )
        if (!userResponse.ok) {
          const errorText = await userResponse.text()
          throw new Error(`Failed to fetch user data: ${errorText}`)
        }
        fetchUser = await userResponse.json()
        dispatch({ type: 'SET_USER', payload: fetchUser.data })
      } catch (error) {
        console.error('Error fetching user data', error)
      }

      try {
        const accountResponse = await fetch(
          `/api/user/fetchAccount/?userId=${fetchUser.data.id}`
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
        console.error('Error fetching user profile', error)
      }
    }

    if (state.userData.email) {
      fetchUserData(state.userData.email)
    }
  }, [state.userData.email])

  return (
    <UserStateContext.Provider value={{ state, dispatch }}>
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
