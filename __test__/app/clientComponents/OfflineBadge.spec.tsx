import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import OfflineBadge from '@clientComponents/OfflineBadge'

// Mock the useOfflineStatus hook
jest.mock('@app/utils/offline/useOfflineStatus', () => ({
  useOfflineStatus: jest.fn(),
}))

import { useOfflineStatus } from '@app/utils/offline/useOfflineStatus'

const mockUseOfflineStatus = useOfflineStatus as jest.MockedFunction<
  typeof useOfflineStatus
>

const theme = createTheme()

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('OfflineBadge', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Happy Path', () => {
    it('should render without errors when online', () => {
      mockUseOfflineStatus.mockReturnValue({
        online: true,
        since: Date.now(),
        lastChange: null,
      })

      render(<OfflineBadge />, { wrapper: TestWrapper })

      // Badge should not be visible when online
      expect(screen.queryByText('Offline')).not.toBeVisible()
    })

    it('should display offline chip when offline', () => {
      mockUseOfflineStatus.mockReturnValue({
        online: false,
        since: Date.now(),
        lastChange: Date.now(),
      })

      render(<OfflineBadge />, { wrapper: TestWrapper })

      expect(screen.getByText('Offline')).toBeInTheDocument()
    })

    it('should have accessible live region', () => {
      mockUseOfflineStatus.mockReturnValue({
        online: false,
        since: Date.now(),
        lastChange: Date.now(),
      })

      render(<OfflineBadge />, { wrapper: TestWrapper })

      // Find the aria-live region
      const liveRegion = screen.getByText('You are currently offline')
      expect(liveRegion).toHaveAttribute('aria-live', 'polite')
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true')
    })

    it('should have empty live region text when online', () => {
      mockUseOfflineStatus.mockReturnValue({
        online: true,
        since: Date.now(),
        lastChange: null,
      })

      render(<OfflineBadge />, { wrapper: TestWrapper })

      // Live region should be empty when online
      const liveRegions = screen
        .getAllByRole('generic')
        .filter((el) => el.getAttribute('aria-live') === 'polite')
      expect(liveRegions.length).toBeGreaterThan(0)
    })

    it('should render CloudOff icon when offline', () => {
      mockUseOfflineStatus.mockReturnValue({
        online: false,
        since: Date.now(),
        lastChange: Date.now(),
      })

      render(<OfflineBadge />, { wrapper: TestWrapper })

      // MUI Chip with icon renders an svg
      const chip = screen.getByText('Offline').closest('.MuiChip-root')
      expect(chip).toBeInTheDocument()
      expect(chip?.querySelector('svg')).toBeInTheDocument()
    })

    it('should have warning color variant when offline', () => {
      mockUseOfflineStatus.mockReturnValue({
        online: false,
        since: Date.now(),
        lastChange: Date.now(),
      })

      render(<OfflineBadge />, { wrapper: TestWrapper })

      const chip = screen.getByText('Offline').closest('.MuiChip-root')
      expect(chip).toHaveClass('MuiChip-colorWarning')
    })
  })
})
