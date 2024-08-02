'use client'
import {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useMemo,
  Dispatch,
  useState,
  useEffect,
  FC,
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
  accounts: Record<string, any>
}

export type UserProfile = {
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

type UserProfilePageState = {
  userData: UserData
  userDataProfile: UserProfile
  fetchUserData: (email: string) => void
  setEmail: (email: string) => void
}

// type UserAction = { type: 'SET_USER'; payload: UserProfilePageState }

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
    accounts: {} as Record<string, any>,
  },
  userDataProfile: {
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
  fetchUserData: () => null,
  setEmail: () => null,
}

// interface UserStateContextType {
//   userData: UserData
//   fetchUserData: (email: string) => void
//   setEmail: (email: string) => void
// }

export const UserStateContext =
  createContext<UserProfilePageState>(initialState)

// function UserReducer(
//   state: UserProfilePageState,
//   action: UserAction
// ): UserProfilePageState {
//   switch (action.type) {
//     case 'SET_USER':
//       return { ...state, ...action.payload }
//     default:
//       return state
//   }
// }

export default function UserStateProvider({
  children,
}: {
  children: ReactNode
}) {
  // const [state, dispatch] = useReducer(UserReducer, initialState)
  // const [user, setUser] = useState<UserData>(initialState.user)
  const [userData, setUserData] = useState<UserData>(initialState.userData)
  const [userDataProfile, setUserDataProfile] = useState<UserProfile>(
    initialState.userDataProfile
  )
  const [email, setEmail] = useState<string>('t@t.com')

  const fetchUserData = async (email: string) => {
    try {
      const response = await fetch(
        `/api/user/?email=${encodeURIComponent(email)}`
      )
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch user data: ${errorText}`)
      }
      const fetchUser = await response.json()
      setUserData(fetchUser.data)
      const profile = JSON.parse(fetchUser.data.profile)
      setUserDataProfile(profile)
    } catch (error) {
      console.error('Error fetching user data', error)
    }
  }

  const updateEmail = (email: string) => {
    setEmail(email)
    fetchUserData(email)
  }

  useEffect(() => {
    // const email = 'trewaters@gmail.com'
    if (email) {
      fetchUserData(email)
    }
  }, [])

  // const value = {
  //   user,
  //   setUser,
  // }
  const value = {
    userData,
    userDataProfile,
    fetchUserData,
    setEmail: updateEmail,
  }

  // const value: UserProfilePageState = {
  //   user: initialState.user,
  //   setUser: initialState.setUser,
  // }

  // function to set user by getting userData record from db
  // function setUser(user: UserProfilePageState) {
  //   dispatch({ type: 'SET_USER', payload: user })
  // }

  // const value = useMemo(
  //   () => ({
  //     state: state,
  //     dispatch: dispatch,
  //     user: state.user,
  //     setUser: setUser,
  //   }),
  //   [state]
  // )

  return (
    <UserStateContext.Provider value={value}>
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
