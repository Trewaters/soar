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

export function NavigationLoadingProvider({
  children,
}: {
  children: ReactNode
}) {
  const [state, setState] = useState<NavigationLoadingState>(initialState)

  const startNavigation = (targetPath: string, elementId?: string) => {
    setState({
      isNavigating: true,
      targetPath,
      elementId: elementId || null,
    })

    // Auto-clear navigation state after a timeout to prevent stuck loading states
    // This handles cases where navigation might fail or take too long
    setTimeout(() => {
      setState((prev) => {
        // Only clear if we're still loading to the same path
        if (prev.targetPath === targetPath) {
          return initialState
        }
        return prev
      })
    }, 5000) // 5 second timeout
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
