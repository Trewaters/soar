'use client'
import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useMemo,
  Dispatch,
} from 'react'

export type UserProfilePageState = {
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
  userId: string
}

export type UserAction = { type: 'SET_USER'; payload: UserProfilePageState }

export const initialState: UserProfilePageState = {
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
  userId: '',
}

type UserStateContextType = {
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
      return { ...state, ...action.payload }
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

  // function to set user

  const value = useMemo(() => ({ state, dispatch }), [state])

  return (
    <UserStateContext.Provider value={value}>
      {children}
    </UserStateContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserStateContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserStateProvider')
  }
  return context
}
