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

export type UserProfile = {
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

type UserProfilePageState = {
  userData: UserProfile
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
  fetchUserData: () => null,
  setEmail: () => null,
}

// interface UserStateContextType {
//   userData: UserProfile
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
  // const [user, setUser] = useState<UserProfile>(initialState.user)
  const [userData, setUserData] = useState<UserProfile>(initialState.userData)
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
