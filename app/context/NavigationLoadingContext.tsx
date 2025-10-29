'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

interface NavigationLoadingState {
  isNavigating: boolean
  targetPath: string | null
  elementId: string | null
}

interface NavigationLoadingContextType {
  state: NavigationLoadingState
  startNavigation: (targetPath: string, elementId?: string) => void
  endNavigation: () => void
  isNavigatingTo: (path: string) => boolean
  isElementLoading: (elementId: string) => boolean
}

const NavigationLoadingContext = createContext<
  NavigationLoadingContextType | undefined
>(undefined)

const initialState: NavigationLoadingState = {
  isNavigating: false,
  targetPath: null,
  elementId: null,
}

export const NavigationLoadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<NavigationLoadingState>(initialState)

  const startNavigation = (targetPath: string, elementId?: string) => {
    setState({
      isNavigating: true,
      targetPath,
      elementId: elementId || null,
    })
  }

  const endNavigation = () => {
    setState(initialState)
  }

  const isNavigatingTo = (path: string) => {
    return state.isNavigating && state.targetPath === path
  }

  const isElementLoading = (elementId: string) => {
    return state.isNavigating && state.elementId === elementId
  }

  return (
    <NavigationLoadingContext.Provider
      value={{
        state,
        startNavigation,
        endNavigation,
        isNavigatingTo,
        isElementLoading,
      }}
    >
      {children}
    </NavigationLoadingContext.Provider>
  )
}

export function useNavigationLoading() {
  const context = useContext(NavigationLoadingContext)
  if (context === undefined) {
    throw new Error(
      'useNavigationLoading must be used within a NavigationLoadingProvider'
    )
  }
  return context
}
