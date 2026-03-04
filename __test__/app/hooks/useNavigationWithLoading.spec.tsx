import { renderHook, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import React, { ReactNode } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'

// Reset modules to clear any global mocks
beforeAll(() => {
  jest.resetModules()
})

// Unmock to use real implementations
jest.unmock('@context/NavigationLoadingContext')
jest.unmock('@app/hooks/useNavigationWithLoading')

// Mock router functions
const mockRouterPush = jest.fn(() => Promise.resolve())
const mockRouterReplace = jest.fn(() => Promise.resolve())
const mockRouterBack = jest.fn()
const mockRouterForward = jest.fn()
const mockRouterRefresh = jest.fn()
const mockRouterPrefetch = jest.fn()

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: mockRouterReplace,
    back: mockRouterBack,
    forward: mockRouterForward,
    refresh: mockRouterRefresh,
    prefetch: mockRouterPrefetch,
  }),
  usePathname: () => '/current-path',
  useSearchParams: () => new URLSearchParams(),
}))

// Import after mocking
const {
  NavigationLoadingProvider,
  useNavigationLoading,
} = require('@context/NavigationLoadingContext')
const {
  useNavigationWithLoading,
} = require('@app/hooks/useNavigationWithLoading')

const theme = createTheme()

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={theme}>
    <NavigationLoadingProvider>{children}</NavigationLoadingProvider>
  </ThemeProvider>
)

describe('useNavigationWithLoading', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset router mock to resolve immediately
    mockRouterPush.mockImplementation(() => Promise.resolve())
    mockRouterReplace.mockImplementation(() => Promise.resolve())
  })

  describe('Initialization', () => {
    it('should return navigation methods', () => {
      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      expect(result.current.push).toBeDefined()
      expect(result.current.replace).toBeDefined()
      expect(result.current.back).toBeDefined()
      expect(result.current.forward).toBeDefined()
      expect(result.current.refresh).toBeDefined()
    })

    it('should return loading state information', () => {
      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      expect(result.current.isNavigating).toBe(false)
      expect(result.current.targetPath).toBeNull()
      expect(typeof result.current.isNavigatingTo).toBe('function')
      expect(typeof result.current.isElementLoading).toBe('function')
    })

    it('should return navigationState object', () => {
      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      expect(result.current.navigationState).toBeDefined()
      expect(result.current.navigationState.isNavigating).toBe(false)
      expect(result.current.navigationState.targetPath).toBeNull()
      expect(result.current.navigationState.elementId).toBeNull()
      expect(result.current.navigationState.navId).toBeNull()
    })
  })

  describe('push method', () => {
    it('should call router.push with the provided path', async () => {
      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      await act(async () => {
        await result.current.push('/new-path')
      })

      expect(mockRouterPush).toHaveBeenCalledWith('/new-path')
    })

    it('should accept optional elementId', async () => {
      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      await act(async () => {
        await result.current.push('/new-path', 'my-element')
      })

      expect(mockRouterPush).toHaveBeenCalledWith('/new-path')
    })

    it('should use router.replace when replace option is true', async () => {
      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      await act(async () => {
        await result.current.push('/new-path', undefined, { replace: true })
      })

      expect(mockRouterReplace).toHaveBeenCalledWith('/new-path')
    })
  })

  describe('replace method', () => {
    it('should call router.replace with the provided path', async () => {
      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      await act(async () => {
        await result.current.replace('/new-path')
      })

      expect(mockRouterReplace).toHaveBeenCalledWith('/new-path')
    })

    it('should accept optional elementId', async () => {
      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      await act(async () => {
        await result.current.replace('/new-path', 'my-element')
      })

      expect(mockRouterReplace).toHaveBeenCalledWith('/new-path')
    })
  })

  describe('back method', () => {
    it('should call router.back', () => {
      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      act(() => {
        result.current.back()
      })

      expect(mockRouterBack).toHaveBeenCalled()
    })
  })

  describe('forward method', () => {
    it('should call router.forward', () => {
      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      act(() => {
        result.current.forward()
      })

      expect(mockRouterForward).toHaveBeenCalled()
    })
  })

  describe('refresh method', () => {
    it('should call router.refresh', () => {
      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      act(() => {
        result.current.refresh()
      })

      expect(mockRouterRefresh).toHaveBeenCalled()
    })
  })

  describe('isNavigatingTo helper', () => {
    it('should return false initially', () => {
      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      expect(result.current.isNavigatingTo('/some-path')).toBe(false)
    })
  })

  describe('isElementLoading helper', () => {
    it('should return false initially', () => {
      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      expect(result.current.isElementLoading('some-element')).toBe(false)
    })
  })

  describe('Navigation Prevention', () => {
    it('should not navigate when already navigating', async () => {
      // Create a never-resolving promise to keep navigation in progress
      mockRouterPush.mockImplementation(() => new Promise(() => {}))

      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      // Start first navigation (won't resolve)
      act(() => {
        result.current.push('/first-path')
      })

      // Try second navigation while first is in progress
      act(() => {
        result.current.push('/second-path')
      })

      // Should only have called push once
      expect(mockRouterPush).toHaveBeenCalledTimes(1)
      expect(mockRouterPush).toHaveBeenCalledWith('/first-path')
    })

    it('should not trigger back when already navigating', async () => {
      mockRouterPush.mockImplementation(() => new Promise(() => {}))

      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      // Start navigation
      act(() => {
        result.current.push('/some-path')
      })

      // Try back while navigating
      act(() => {
        result.current.back()
      })

      expect(mockRouterBack).not.toHaveBeenCalled()
    })

    it('should not trigger forward when already navigating', async () => {
      mockRouterPush.mockImplementation(() => new Promise(() => {}))

      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      // Start navigation
      act(() => {
        result.current.push('/some-path')
      })

      // Try forward while navigating
      act(() => {
        result.current.forward()
      })

      expect(mockRouterForward).not.toHaveBeenCalled()
    })

    it('should not trigger refresh when already navigating', async () => {
      mockRouterPush.mockImplementation(() => new Promise(() => {}))

      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      // Start navigation
      act(() => {
        result.current.push('/some-path')
      })

      // Try refresh while navigating
      act(() => {
        result.current.refresh()
      })

      expect(mockRouterRefresh).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle navigation errors gracefully', async () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      mockRouterPush.mockRejectedValue(new Error('Navigation failed'))

      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      await act(async () => {
        await result.current.push('/error-path')
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        'Navigation error:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should handle back navigation errors gracefully', () => {
      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {})

      mockRouterBack.mockImplementation(() => {
        throw new Error('Back failed')
      })

      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      act(() => {
        result.current.back()
      })

      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should handle forward navigation errors gracefully', () => {
      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {})

      mockRouterForward.mockImplementation(() => {
        throw new Error('Forward failed')
      })

      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      act(() => {
        result.current.forward()
      })

      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should handle refresh errors gracefully', () => {
      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {})

      mockRouterRefresh.mockImplementation(() => {
        throw new Error('Refresh failed')
      })

      const { result } = renderHook(() => useNavigationWithLoading(), {
        wrapper,
      })

      act(() => {
        result.current.refresh()
      })

      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('Hook Requirements', () => {
    it('should throw error when used outside NavigationLoadingProvider', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      // Wrapper without NavigationLoadingProvider
      const invalidWrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      )

      expect(() => {
        renderHook(() => useNavigationWithLoading(), {
          wrapper: invalidWrapper,
        })
      }).toThrow(
        'useNavigationLoading must be used within a NavigationLoadingProvider'
      )

      consoleSpy.mockRestore()
    })
  })
})

describe('useNavigationLoading context hook', () => {
  it('should provide context values when used within provider', () => {
    const { result } = renderHook(() => useNavigationLoading(), {
      wrapper,
    })

    expect(result.current.state).toBeDefined()
    expect(result.current.startNavigation).toBeDefined()
    expect(result.current.endNavigation).toBeDefined()
    expect(result.current.isNavigatingTo).toBeDefined()
    expect(result.current.isElementLoading).toBeDefined()
  })

  it('should update state when startNavigation is called', () => {
    const { result } = renderHook(() => useNavigationLoading(), {
      wrapper,
    })

    act(() => {
      result.current.startNavigation('/test-path', 'test-element')
    })

    expect(result.current.state.isNavigating).toBe(true)
    expect(result.current.state.targetPath).toBe('/test-path')
    expect(result.current.state.elementId).toBe('test-element')
  })

  it('should reset state when endNavigation is called', () => {
    const { result } = renderHook(() => useNavigationLoading(), {
      wrapper,
    })

    act(() => {
      result.current.startNavigation('/test-path')
    })

    expect(result.current.state.isNavigating).toBe(true)

    act(() => {
      result.current.endNavigation()
    })

    expect(result.current.state.isNavigating).toBe(false)
    expect(result.current.state.targetPath).toBeNull()
  })
})
