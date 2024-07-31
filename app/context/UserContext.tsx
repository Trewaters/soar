'use client'
import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useMemo,
  Dispatch,
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
  user: UserProfile
  // setUser: (u: UserProfile) => void
}

// type UserAction = { type: 'SET_USER'; payload: UserProfilePageState }

const initialState: UserProfilePageState = {
  user: {
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
  // setUser: () => null,
}

// type UserStateContextType = {
//   state: UserProfilePageState
//   dispatch: Dispatch<UserAction>
// }

// const UserStateContext = createContext<UserStateContextType>({
//   state: initialState,
//   dispatch: () => null,
// })

export const UserStateContext = createContext(initialState)

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
  const value: UserProfilePageState = {
    user: initialState.user,
    // setUser: initialState.setUser,
  }

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
