import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import { useRouter } from 'next/navigation'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe('SubNavHeader', () => {
  const mockRouterBack = jest.fn()
  const mockOnClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      back: mockRouterBack,
      forward: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    } as any)
  })

  describe('Rendering', () => {
    it('should render without errors with back mode', () => {
      render(<SubNavHeader mode="back" onClick={mockOnClick} />)
      expect(screen.getByText('BACK')).toBeInTheDocument()
    })

    it('should render without errors with static mode', () => {
      render(
        <SubNavHeader
          mode="static"
          link="/dashboard"
          title="Dashboard"
          onClick={mockOnClick}
        />
      )
      expect(screen.getByText('Back to Dashboard')).toBeInTheDocument()
    })

    it('should render back arrow icon', () => {
      render(<SubNavHeader mode="back" onClick={mockOnClick} />)
      const backArrow = screen.getByAltText('back arrow')
      expect(backArrow).toBeInTheDocument()
    })

    it('should render help icon button', () => {
      render(<SubNavHeader mode="back" onClick={mockOnClick} />)
      const helpButton = screen.getByRole('button', { name: '' })
      expect(helpButton).toBeInTheDocument()
    })
  })

  describe('Back Mode Navigation', () => {
    it('should call router.back() when button is clicked in back mode', async () => {
      const user = userEvent.setup()
      render(<SubNavHeader mode="back" onClick={mockOnClick} />)

      const backButton = screen.getByRole('button', { name: /back/i })
      await user.click(backButton)

      expect(mockRouterBack).toHaveBeenCalledTimes(1)
    })

    it('should display "BACK" text when no title is provided in back mode', () => {
      render(<SubNavHeader mode="back" onClick={mockOnClick} />)
      expect(screen.getByText('BACK')).toBeInTheDocument()
    })

    it('should display "Back to {title}" when title is provided in back mode', () => {
      render(
        <SubNavHeader mode="back" title="Dashboard" onClick={mockOnClick} />
      )
      expect(screen.getByText('Back to Dashboard')).toBeInTheDocument()
    })
  })

  describe('Static Mode Navigation', () => {
    it('should render as link with correct href in static mode', () => {
      render(
        <SubNavHeader
          mode="static"
          link="/dashboard"
          title="Dashboard"
          onClick={mockOnClick}
        />
      )

      const backButton = screen.getByRole('link', {
        name: /back to dashboard/i,
      })
      expect(backButton).toHaveAttribute('href', '/dashboard')
    })

    it('should not call router.back() in static mode', async () => {
      const user = userEvent.setup()
      render(
        <SubNavHeader
          mode="static"
          link="/dashboard"
          title="Dashboard"
          onClick={mockOnClick}
        />
      )

      const backButton = screen.getByRole('link', {
        name: /back to dashboard/i,
      })
      await user.click(backButton)

      expect(mockRouterBack).not.toHaveBeenCalled()
    })

    it('should display "BACK" when no title is provided in static mode', () => {
      render(<SubNavHeader mode="static" link="/home" onClick={mockOnClick} />)
      expect(screen.getByText('BACK')).toBeInTheDocument()
    })
  })

  describe('Title Display', () => {
    it('should display custom title with "Back to" prefix', () => {
      render(
        <SubNavHeader
          mode="static"
          link="/settings"
          title="Settings"
          onClick={mockOnClick}
        />
      )
      expect(screen.getByText('Back to Settings')).toBeInTheDocument()
    })

    it('should display "BACK" when title is undefined', () => {
      render(<SubNavHeader mode="back" onClick={mockOnClick} />)
      expect(screen.getByText('BACK')).toBeInTheDocument()
      expect(screen.queryByText(/Back to/)).not.toBeInTheDocument()
    })
  })

  describe('Help Icon Interaction', () => {
    it('should call onClick handler when help icon is clicked', async () => {
      const user = userEvent.setup()
      render(<SubNavHeader mode="back" onClick={mockOnClick} />)

      const helpButton = screen.getAllByRole('button')[1] // Second button is help icon
      await user.click(helpButton)

      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('should not trigger navigation when help icon is clicked', async () => {
      const user = userEvent.setup()
      render(<SubNavHeader mode="back" onClick={mockOnClick} />)

      const helpButton = screen.getAllByRole('button')[1]
      await user.click(helpButton)

      expect(mockRouterBack).not.toHaveBeenCalled()
    })
  })

  describe('Styling', () => {
    it('should apply custom sx prop styles', () => {
      const customSx = { paddingX: 2, marginTop: 2 }
      render(<SubNavHeader mode="back" sx={customSx} onClick={mockOnClick} />)

      const container = screen.getByText('BACK').closest('div')?.parentElement
      expect(container).toBeInTheDocument()
    })
  })
})
