import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import QuickTimer, {
  QuickTimerProps,
} from '@app/clientComponents/quickTimer/QuickTimer'

// Mock TimerIcon from Material-UI
jest.mock('@mui/icons-material/Timer', () => ({
  __esModule: true,
  default: () => <div data-testid="timer-icon" />,
}))

// Mock Notification icons
jest.mock('@mui/icons-material/Notifications', () => ({
  __esModule: true,
  default: () => <div data-testid="notifications-icon" />,
}))

jest.mock('@mui/icons-material/NotificationsOff', () => ({
  __esModule: true,
  default: () => <div data-testid="notifications-off-icon" />,
}))

// Mock Notification API
const mockNotification = jest.fn()
const mockRequestPermission = jest.fn().mockResolvedValue('granted')

Object.defineProperty(window, 'Notification', {
  value: mockNotification,
  writable: true,
})

Object.defineProperty(mockNotification, 'permission', {
  value: 'granted',
  writable: true,
  configurable: true,
})

Object.defineProperty(mockNotification, 'requestPermission', {
  value: mockRequestPermission,
  writable: true,
  configurable: true,
})

// Mock document.hidden for visibility change tests
Object.defineProperty(document, 'hidden', {
  value: false,
  writable: true,
  configurable: true,
})

describe('QuickTimer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    // Set a consistent starting time for predictable testing
    jest.setSystemTime(new Date('2025-01-01T00:00:00.000Z'))

    // Reset Notification properties to default state
    Object.defineProperty(mockNotification, 'permission', {
      value: 'granted',
      writable: true,
      configurable: true,
    })

    // Reset the mock function
    mockRequestPermission.mockResolvedValue('granted')

    // Reset document.hidden
    Object.defineProperty(document, 'hidden', {
      value: false,
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    jest.useRealTimers()

    // Reset Notification properties back to default state
    Object.defineProperty(mockNotification, 'permission', {
      value: 'granted',
      writable: true,
      configurable: true,
    })

    // Reset document.hidden back to default
    Object.defineProperty(document, 'hidden', {
      value: false,
      writable: true,
      configurable: true,
    })

    // Clear all mocks
    jest.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('renders with default props', () => {
      render(<QuickTimer />)

      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByText('+5 Minutes')).toBeInTheDocument()
      expect(screen.getByTestId('timer-icon')).toBeInTheDocument()
    })

    it('renders with custom button text', () => {
      render(<QuickTimer buttonText="Start Timer" />)

      expect(screen.getByText('Start Timer')).toBeInTheDocument()
    })

    it('applies custom styles via sx prop', () => {
      const customSx = { backgroundColor: 'red' }
      const { container } = render(<QuickTimer sx={customSx} />)

      expect(container.firstChild).toHaveStyle('background-color: red')
    })

    it('sets custom maxWidth', () => {
      const { container } = render(<QuickTimer maxWidth="300px" />)

      expect(container.firstChild).toHaveStyle('max-width: 300px')
    })
  })

  describe('Variant Styles', () => {
    it('renders default variant with Paper wrapper', () => {
      render(<QuickTimer variant="default" />)

      const paperElement = screen.getByRole('button').closest('.MuiPaper-root')
      expect(paperElement).toBeInTheDocument()
    })

    it('renders compact variant with Paper wrapper', () => {
      render(<QuickTimer variant="compact" />)

      const paperElement = screen.getByRole('button').closest('.MuiPaper-root')
      expect(paperElement).toBeInTheDocument()
    })

    it('renders minimal variant without Paper wrapper', () => {
      render(<QuickTimer variant="minimal" />)

      const paperElement = screen
        .queryByRole('button')
        ?.closest('.MuiPaper-root')
      expect(paperElement).toBeNull()
    })
  })

  describe('Timer Functionality', () => {
    it('starts timer when button is clicked', () => {
      const onTimerStart = jest.fn()
      render(<QuickTimer onTimerStart={onTimerStart} timerMinutes={1} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(onTimerStart).toHaveBeenCalledTimes(1)
    })

    it('displays timer countdown when active', () => {
      render(<QuickTimer timerMinutes={1} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Timer should show initially
      expect(screen.getByText('1:00')).toBeInTheDocument()
      expect(screen.getByText('Time Remaining')).toBeInTheDocument()
    })

    it('updates timer display every second', () => {
      render(<QuickTimer timerMinutes={1} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Initial state
      expect(screen.getByText('1:00')).toBeInTheDocument()

      // Advance timer by 1 second
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(screen.getByText('0:59')).toBeInTheDocument()
    })

    it('calls onTimerUpdate callback with remaining seconds', () => {
      const onTimerUpdate = jest.fn()
      render(<QuickTimer onTimerUpdate={onTimerUpdate} timerMinutes={1} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Should be called immediately with 60 seconds
      expect(onTimerUpdate).toHaveBeenCalledWith(60)

      // Advance timer by 1 second
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(onTimerUpdate).toHaveBeenCalledWith(59)
    })

    it('completes timer and calls onTimerEnd', () => {
      const onTimerEnd = jest.fn()
      render(<QuickTimer onTimerEnd={onTimerEnd} timerMinutes={1} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Fast forward to timer completion
      act(() => {
        jest.advanceTimersByTime(60000) // 60 seconds
      })

      expect(onTimerEnd).toHaveBeenCalledTimes(1)
    })

    it('shows notification when timer completes and notifications are enabled', () => {
      render(<QuickTimer timerMinutes={1} enableNotifications={true} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Fast forward to timer completion
      act(() => {
        jest.advanceTimersByTime(60000)
      })

      expect(mockNotification).toHaveBeenCalledWith('Timer Complete!', {
        body: 'Your 1-minute timer has finished.',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'timer-complete',
        requireInteraction: false,
      })
    })

    it('formats time correctly', () => {
      render(<QuickTimer timerMinutes={2} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(screen.getByText('2:00')).toBeInTheDocument()

      act(() => {
        jest.advanceTimersByTime(65000) // 1 minute 5 seconds
      })

      expect(screen.getByText('0:55')).toBeInTheDocument()
    })
  })

  describe('Page Visibility Handling', () => {
    it('recalculates timer when page becomes visible again', () => {
      const onTimerUpdate = jest.fn()
      render(<QuickTimer onTimerUpdate={onTimerUpdate} timerMinutes={1} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Simulate page becoming hidden
      Object.defineProperty(document, 'hidden', {
        value: true,
        writable: true,
      })

      // Advance time while hidden
      act(() => {
        jest.advanceTimersByTime(30000) // 30 seconds
      })

      // Simulate page becoming visible again
      Object.defineProperty(document, 'hidden', {
        value: false,
        writable: true,
      })

      // Trigger visibility change event
      act(() => {
        const event = new Event('visibilitychange')
        document.dispatchEvent(event)
      })

      // Timer should recalculate correctly
      expect(onTimerUpdate).toHaveBeenLastCalledWith(30)
    })

    it('ends timer if time expired while page was hidden', () => {
      const onTimerEnd = jest.fn()
      render(<QuickTimer onTimerEnd={onTimerEnd} timerMinutes={1} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Simulate page becoming hidden
      Object.defineProperty(document, 'hidden', {
        value: true,
        writable: true,
      })

      // Advance time past timer duration while hidden
      act(() => {
        jest.advanceTimersByTime(70000) // 70 seconds (more than 1 minute)
      })

      // Simulate page becoming visible again
      Object.defineProperty(document, 'hidden', {
        value: false,
        writable: true,
      })

      // Trigger visibility change event
      act(() => {
        const event = new Event('visibilitychange')
        document.dispatchEvent(event)
      })

      expect(onTimerEnd).toHaveBeenCalledTimes(1)
    })
  })

  describe('Notification Permission', () => {
    it('checks notification permission on mount but does not request it', () => {
      Object.defineProperty(mockNotification, 'permission', {
        value: 'default',
        writable: true,
      })

      render(<QuickTimer />)

      // Should check permission but not request it automatically
      expect(mockRequestPermission).not.toHaveBeenCalled()
    })

    it('requests notification permission when enableNotifications=true and user starts timer', () => {
      Object.defineProperty(mockNotification, 'permission', {
        value: 'default',
        writable: true,
        configurable: true,
      })

      render(<QuickTimer enableNotifications={true} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(mockRequestPermission).toHaveBeenCalledTimes(1)
    })

    it('does not show notification when notifications are disabled', () => {
      Object.defineProperty(mockNotification, 'permission', {
        value: 'granted',
        writable: true,
        configurable: true,
      })

      render(<QuickTimer timerMinutes={1} enableNotifications={false} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Fast forward to timer completion
      act(() => {
        jest.advanceTimersByTime(60000)
      })

      expect(mockNotification).not.toHaveBeenCalled()
    })

    it('does not request permission if already granted', () => {
      Object.defineProperty(mockNotification, 'permission', {
        value: 'granted',
        writable: true,
        configurable: true,
      })

      render(<QuickTimer />)

      expect(mockRequestPermission).not.toHaveBeenCalled()
    })

    it('does not show notification if permission denied', () => {
      Object.defineProperty(mockNotification, 'permission', {
        value: 'denied',
        writable: true,
        configurable: true,
      })

      render(<QuickTimer timerMinutes={1} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      act(() => {
        jest.advanceTimersByTime(60000)
      })

      expect(mockNotification).not.toHaveBeenCalled()
    })
  })

  describe('Cleanup', () => {
    it('cleans up timer on unmount', () => {
      Object.defineProperty(mockNotification, 'permission', {
        value: 'granted',
        writable: true,
        configurable: true,
      })

      const { unmount } = render(<QuickTimer timerMinutes={1} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Spy on clearInterval
      const clearIntervalSpy = jest.spyOn(window, 'clearInterval')

      unmount()

      expect(clearIntervalSpy).toHaveBeenCalled()
    })

    it('removes visibility change listener on unmount', () => {
      Object.defineProperty(mockNotification, 'permission', {
        value: 'granted',
        writable: true,
        configurable: true,
      })

      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener')

      const { unmount } = render(<QuickTimer />)

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'visibilitychange',
        expect.any(Function)
      )
    })
  })

  describe('Edge Cases', () => {
    it('handles zero or negative timer minutes gracefully', () => {
      Object.defineProperty(mockNotification, 'permission', {
        value: 'granted',
        writable: true,
        configurable: true,
      })

      const onTimerEnd = jest.fn()
      render(<QuickTimer timerMinutes={0} onTimerEnd={onTimerEnd} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // For zero timer, it ends immediately without showing timer display
      expect(onTimerEnd).toHaveBeenCalled()
      // Timer display should not be shown for instant completion
      expect(screen.queryByText('0:00')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has accessible button with proper role', () => {
      Object.defineProperty(mockNotification, 'permission', {
        value: 'granted',
        writable: true,
        configurable: true,
      })

      render(<QuickTimer />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAccessibleName('+5 Minutes')
    })
  })

  describe('Props Interface', () => {
    it('accepts all prop types correctly', () => {
      const props: QuickTimerProps = {
        buttonText: 'Custom Text',
        timerMinutes: 10,
        sx: { margin: 2 },
        onTimerStart: jest.fn(),
        onTimerEnd: jest.fn(),
        onTimerUpdate: jest.fn(),
        showTimeDisplay: true,
        variant: 'compact',
        maxWidth: '500px',
        enableNotifications: true,
        showNotificationToggle: true,
      }

      expect(() => render(<QuickTimer {...props} />)).not.toThrow()
    })
  })
})
