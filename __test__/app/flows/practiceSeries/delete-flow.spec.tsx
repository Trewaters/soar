import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// Provide a specific mock for alphaUsers used inside the page component
jest.mock('@app/lib/alphaUsers', () => ({
  __esModule: true,
  getAlphaUserIds: () => [], // no alpha users for test
  default: () => [],
}))
import Page from '@app/flows/practiceSeries/page'
import { Providers } from '@app/providers/Providers'

// Override next-auth session to simulate owner
const mockUseSession: any = (globalThis as any).mockUseSession
mockUseSession.mockReturnValue({
  data: {
    user: { email: 'owner@example.com', id: 'owner@example.com' },
  },
  status: 'authenticated',
})

// Override next/navigation to include an id search param so the flow auto-selects
jest.mock('next/navigation', () => {
  const original = jest.requireActual('next/navigation')
  return {
    __esModule: true,
    ...original,
    useSearchParams: jest.fn(() => new URLSearchParams('id=flow-1')),
    usePathname: jest.fn(() => '/flows/practiceSeries'),
    useRouter: jest.fn(() => ({
      back: jest.fn(),
      forward: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    })),
  }
})

// seriesService mocks
import { deleteSeries, getAllSeries } from '@lib/seriesService'

// Provide an initial flow returned by getAllSeries
;(getAllSeries as jest.Mock).mockResolvedValueOnce([
  {
    id: 'flow-1',
    seriesName: 'Test Flow',
    description: 'Flow description',
    seriesPoses: [],
    createdBy: 'owner@example.com',
  },
])

// Ensure subsequent calls (if any) return empty to simulate deletion
;(getAllSeries as jest.Mock).mockResolvedValue([])
;(deleteSeries as jest.Mock).mockResolvedValue({ success: true })

// Navigation hook mocks (from jest.setup)
const mockReplace: any = (globalThis as any).mockNavigationReplace
const mockRefresh: any = (globalThis as any).mockNavigationRefresh

describe('Practice Series Page - Delete Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reapply session override in case cleared
    mockUseSession.mockReturnValue({
      data: {
        user: { email: 'owner@example.com', id: 'owner@example.com' },
      },
      status: 'authenticated',
    })
  })

  it('removes deleted flow from view and navigates to base page', async () => {
    const user = userEvent.setup()
    const mockSession = {
      user: { email: 'owner@example.com', id: 'owner@example.com' },
      expires: '2099-01-01T00:00:00.000Z',
    }
    render(
      <Providers session={mockSession}>
        <Page />
      </Providers>
    )

    // Flow title should appear after initial fetch
    expect(
      await screen.findByRole('heading', { name: 'Test Flow' })
    ).toBeInTheDocument()

    // Open editor (owner sees edit button)
    const editButton = screen.getByRole('button', { name: /edit flow/i })
    await user.click(editButton)

    // Click Delete Flow button in editor
    // Use the explicit button text to avoid matching multiple delete buttons
    const deleteFlowBtn = await screen.findByRole('button', {
      name: 'Delete Flow',
    })
    await user.click(deleteFlowBtn)

    // Confirm dialog appears; click Delete in dialog
    const confirmDeleteBtn = await screen.findByRole('button', {
      name: /^delete$/i,
    })
    await user.click(confirmDeleteBtn)

    // The flow heading should disappear after deletion
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Test Flow' })).toBeNull()
    })

    // Navigation replace should have been called to base route (no id param)
    expect(mockReplace).toHaveBeenCalledWith('/flows/practiceSeries')
    // Refresh invoked to revalidate data
    expect(mockRefresh).toHaveBeenCalled()
    // Service delete called
    expect(deleteSeries).toHaveBeenCalledWith('flow-1')
  })
})
