import '@testing-library/jest-dom'
import React from 'react'
import { render, waitFor } from '@testing-library/react'
import PracticePage from '../../../../app/navigator/asanaPoses/practiceAsanas/page'
import { SessionProvider } from 'next-auth/react'

// Mock dependencies
jest.mock('../../../../lib/poseService', () => ({
  getAccessiblePoses: jest.fn(() => Promise.resolve([])),
  getPose: jest.fn(() => Promise.resolve(null)),
  getAllPoses: jest.fn(() => Promise.resolve([])),
}))

// Mock window.history.replaceState
const replaceStateMock = jest.fn()
Object.defineProperty(window, 'history', {
  value: {
    replaceState: replaceStateMock,
  },
  writable: true,
})

// Setup mock for useSearchParams to be dynamic
let searchParamsMock = new URLSearchParams()
jest.mock('next/navigation', () => ({
  useSearchParams: () => searchParamsMock,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/app/navigator/asanaPoses/practiceAsanas',
}))

// Mock session
const mockSession = {
  data: { user: { email: 'test@example.com' } },
  status: 'authenticated',
}

jest.mock('next-auth/react', () => ({
  useSession: () => mockSession,
  SessionProvider: ({ children }: any) => <div>{children}</div>,
}))

// Mock other components to avoid rendering issues
jest.mock('../../../../app/clientComponents/splash-header', () => {
  const SplashHeader = () => <div data-testid="splash-header" />
  SplashHeader.displayName = 'SplashHeader'
  return SplashHeader
})
jest.mock('../../../../app/navigator/asanaPoses/pose-search', () => {
  const PoseSearch = () => <div data-testid="pose-search" />
  PoseSearch.displayName = 'PoseSearch'
  return PoseSearch
})
jest.mock('../../../../app/clientComponents/sub-nav-header', () => {
  const SubNavHeader = () => <div data-testid="sub-nav-header" />
  SubNavHeader.displayName = 'SubNavHeader'
  return SubNavHeader
})
jest.mock('../../../../app/clientComponents/HelpButton', () => {
  const HelpButton = () => <div data-testid="help-button" />
  HelpButton.displayName = 'HelpButton'
  return HelpButton
})

import { getAccessiblePoses } from '../../../../lib/poseService'

describe('Practice Page Refresh Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    searchParamsMock = new URLSearchParams()
  })

  it('triggers data fetch and clears query param when refresh=true is present', async () => {
    // Set query param to refresh=true
    searchParamsMock.set('refresh', 'true')

    render(
      <SessionProvider session={mockSession.data as any}>
        <PracticePage />
      </SessionProvider>
    )

    // Check if getAccessiblePoses was called
    await waitFor(() => {
      // It might be called twice: once on mount (initial fetch) and once due to refresh param
      // The component has useEffect(() => fetchData(), []) and useEffect watching searchParams
      expect(getAccessiblePoses).toHaveBeenCalled()
    })

    // Check if history.replaceState was called to clean up the URL
    await waitFor(() => {
      expect(replaceStateMock).toHaveBeenCalledWith(
        {},
        '',
        '/app/navigator/asanaPoses/practiceAsanas'
      )
    })
  })

  it('does not clear URL if refresh param is missing', async () => {
    searchParamsMock = new URLSearchParams()

    render(
      <SessionProvider session={mockSession.data as any}>
        <PracticePage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(getAccessiblePoses).toHaveBeenCalled()
    })

    expect(replaceStateMock).not.toHaveBeenCalled()
  })
})
