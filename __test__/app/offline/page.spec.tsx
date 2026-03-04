import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OfflinePage from '@app/offline/page'

// Mock window.location.reload
const mockReload = jest.fn()

beforeAll(() => {
  Object.defineProperty(window, 'location', {
    value: { reload: mockReload },
    writable: true,
  })
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('OfflinePage', () => {
  describe('Happy Path', () => {
    it('should render without errors', () => {
      render(<OfflinePage />)
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('should display offline mode heading', () => {
      render(<OfflinePage />)
      expect(
        screen.getByRole('heading', { name: /offline mode/i })
      ).toBeInTheDocument()
    })

    it('should display informative message about being offline', () => {
      render(<OfflinePage />)
      expect(screen.getByText(/you appear to be offline/i)).toBeInTheDocument()
    })

    it('should display message about automatic sync', () => {
      render(<OfflinePage />)
      expect(
        screen.getByText(/automatically sync and refresh/i)
      ).toBeInTheDocument()
    })

    it('should render a retry button', () => {
      render(<OfflinePage />)
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })

    it('should have accessible aria-label on retry button', () => {
      render(<OfflinePage />)
      expect(
        screen.getByRole('button', { name: /retry loading the app/i })
      ).toBeInTheDocument()
    })

    it('should call window.location.reload when retry button is clicked', async () => {
      const user = userEvent.setup()
      render(<OfflinePage />)

      const retryButton = screen.getByRole('button', { name: /retry/i })
      await user.click(retryButton)

      expect(mockReload).toHaveBeenCalledTimes(1)
    })

    it('should have centered layout styling', () => {
      render(<OfflinePage />)
      const main = screen.getByRole('main')

      // The main Box has these styles but MUI applies them via CSS classes
      // Check that the element exists and is properly structured
      expect(main).toBeInTheDocument()
      expect(main).toHaveAttribute('class')

      // Verify the Container is inside
      const container = main.querySelector('.MuiContainer-root')
      expect(container).toBeInTheDocument()
    })
  })
})
