'use client'
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useEffect,
} from 'react'

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startNavigation = (targetPath: string, elementId?: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    console.log(`Starting navigation to: ${targetPath}`)
    setState({
      isNavigating: true,
      targetPath,
      elementId: elementId || null,
    })

    // Ultra-conservative safety timeout - only triggers if everything fails
    timeoutRef.current = setTimeout(() => {
      setState((prev) => {
        if (prev.targetPath === targetPath && prev.isNavigating) {
          console.warn(
            `Emergency navigation timeout for ${targetPath} - clearing stuck loading state`
          )
          return initialState
        }
        return prev
      })
      timeoutRef.current = null
    }, 3000) // 3 second emergency timeout - longer than safety timeouts
  }

  const endNavigation = () => {
    console.log('Ending navigation')
    // Clear timeout when navigation ends successfully
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setState(initialState)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

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
