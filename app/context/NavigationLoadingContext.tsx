'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

interface NavigationLoadingState {
  isNavigating: boolean
  targetPath: string | null
  elementId: string | null
  navId: string | null
}

interface NavigationLoadingContextType {
  state: NavigationLoadingState
  startNavigation: (
    targetPath: string,
    elementId?: string,
    navId?: string
  ) => void
  endNavigation: (navId?: string) => void
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
  navId: null,
}

export const NavigationLoadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<NavigationLoadingState>(initialState)

  const startNavigation = (
    targetPath: string,
    elementId?: string,
    navId?: string
  ) => {
    // Generate a navId to disambiguate quick successive navigations.
    const id =
      navId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    // development-only logging removed

    setState({
      isNavigating: true,
      targetPath,
      elementId: elementId || null,
      navId: id,
    })
  }

  const endNavigation = (navId?: string) => {
    // If a navId is provided, only clear navigation state when it matches
    // the currently active navId. This prevents races where a later
    // navigation starts before an earlier one finishes and accidentally
    // clears the wrong navigation state.
    // development-only logging removed

    if (navId && state.navId && navId !== state.navId) {
      // Different navigation - do not clear
      return
    }

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
