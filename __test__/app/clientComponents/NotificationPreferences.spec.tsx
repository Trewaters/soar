/**
 * Unit tests for NotificationPreferences component
 * Tests notification preference switches and user interactions
 */

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NotificationPreferences from '../../../app/clientComponents/NotificationPreferences'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '../../../styles/theme'

// Test wrapper with MUI theme
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

describe('NotificationPreferences Component', () => {
  const mockPreferences = {
    inApp: true,
    email: true,
    inAppSubPreferences: {
      dailyPractice: true,
      newFeatures: false,
      progressMilestones: true,
      loginStreak: true,
      activityStreak: false,
    },
    emailSubPreferences: {
      dailyPractice: false,
      newFeatures: true,
      progressMilestones: true,
      loginStreak: false,
      activityStreak: true,
    },
  }

  const mockOnChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without errors', () => {
      render(
        <NotificationPreferences
          preferences={mockPreferences}
          onPreferencesChange={mockOnChange}
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByText('Preferences')).toBeInTheDocument()
    })

    it('should display In-App Notifications section', () => {
      render(
        <NotificationPreferences
          preferences={mockPreferences}
          onPreferencesChange={mockOnChange}
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByText('In-App Notifications')).toBeInTheDocument()
    })

    it('should display Email Notifications section', () => {
      render(
        <NotificationPreferences
          preferences={mockPreferences}
          onPreferencesChange={mockOnChange}
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByText('Email Notifications')).toBeInTheDocument()
    })

    it('should display all notification type labels', () => {
      render(
        <NotificationPreferences
          preferences={mockPreferences}
          onPreferencesChange={mockOnChange}
        />,
        { wrapper: TestWrapper }
      )

      // Check for all notification types
      const labels = [
        'Daily Practice Reminders',
        'New Feature Announcements',
        'Progress Milestones',
        'Login streak reminders',
        'Activity streak reminders',
      ]

      labels.forEach((label) => {
        // Each label appears twice (In-App and Email sections)
        const elements = screen.getAllByText(label)
        expect(elements.length).toBe(2)
      })
    })
  })

  describe('Master Switches', () => {
    it('should render In-App master switch with correct state', () => {
      render(
        <NotificationPreferences
          preferences={mockPreferences}
          onPreferencesChange={mockOnChange}
        />,
        { wrapper: TestWrapper }
      )

      const switches = screen.getAllByRole('checkbox')
      // First switch should be In-App master switch
      expect(switches[0]).toBeChecked()
    })

    it('should call onChange when In-App master switch is toggled', async () => {
      const user = userEvent.setup()

      render(
        <NotificationPreferences
          preferences={mockPreferences}
          onPreferencesChange={mockOnChange}
        />,
        { wrapper: TestWrapper }
      )

      const switches = screen.getAllByRole('checkbox')
      await user.click(switches[0]) // Click In-App master switch

      expect(mockOnChange).toHaveBeenCalledTimes(1)
      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockPreferences,
        inApp: false,
      })
    })

    it('should call onChange when Email master switch is toggled', async () => {
      const user = userEvent.setup()

      render(
        <NotificationPreferences
          preferences={mockPreferences}
          onPreferencesChange={mockOnChange}
        />,
        { wrapper: TestWrapper }
      )

      const switches = screen.getAllByRole('checkbox')
      // Find Email master switch (after In-App section switches)
      const emailMasterSwitch = switches[6] // Adjusted index

      await user.click(emailMasterSwitch)

      expect(mockOnChange).toHaveBeenCalledTimes(1)
      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockPreferences,
        email: false,
      })
    })
  })

  describe('In-App Sub-Preferences', () => {
    it('should render In-App sub-preference switches with correct states', () => {
      render(
        <NotificationPreferences
          preferences={mockPreferences}
          onPreferencesChange={mockOnChange}
        />,
        { wrapper: TestWrapper }
      )

      const switches = screen.getAllByRole('checkbox')

      // In-App section: Master + 5 sub-prefs = 6 switches
      expect(switches[0]).toBeChecked() // Master
      expect(switches[1]).toBeChecked() // dailyPractice: true
      expect(switches[2]).not.toBeChecked() // newFeatures: false
      expect(switches[3]).toBeChecked() // progressMilestones: true
      expect(switches[4]).toBeChecked() // loginStreak: true
      expect(switches[5]).not.toBeChecked() // activityStreak: false
    })

    it('should call onChange when In-App Daily Practice is toggled', async () => {
      const user = userEvent.setup()

      render(
        <NotificationPreferences
          preferences={mockPreferences}
          onPreferencesChange={mockOnChange}
        />,
        { wrapper: TestWrapper }
      )

      const switches = screen.getAllByRole('checkbox')
      await user.click(switches[1]) // Daily Practice

      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockPreferences,
        inAppSubPreferences: {
          ...mockPreferences.inAppSubPreferences,
          dailyPractice: false,
        },
      })
    })

    it('should disable In-App sub-preferences when master switch is off', () => {
      const disabledPrefs = {
        ...mockPreferences,
        inApp: false,
      }

      render(
        <NotificationPreferences
          preferences={disabledPrefs}
          onPreferencesChange={mockOnChange}
        />,
        { wrapper: TestWrapper }
      )

      const switches = screen.getAllByRole('checkbox')

      // In-App sub-preferences should be disabled
      expect(switches[1]).toBeDisabled() // dailyPractice
      expect(switches[2]).toBeDisabled() // newFeatures
      expect(switches[3]).toBeDisabled() // progressMilestones
      expect(switches[4]).toBeDisabled() // loginStreak
      expect(switches[5]).toBeDisabled() // activityStreak
    })
  })

  describe('Email Sub-Preferences', () => {
    it('should render Email sub-preference switches with correct states', () => {
      render(
        <NotificationPreferences
          preferences={mockPreferences}
          onPreferencesChange={mockOnChange}
        />,
        { wrapper: TestWrapper }
      )

      const switches = screen.getAllByRole('checkbox')

      // Email section starts after In-App (6 switches) + Email master = index 7+
      expect(switches[7]).not.toBeChecked() // dailyPractice: false
      expect(switches[8]).toBeChecked() // newFeatures: true
      expect(switches[9]).toBeChecked() // progressMilestones: true
      expect(switches[10]).not.toBeChecked() // loginStreak: false
      expect(switches[11]).toBeChecked() // activityStreak: true
    })

    it('should call onChange when Email Daily Practice is toggled', async () => {
      const user = userEvent.setup()

      render(
        <NotificationPreferences
          preferences={mockPreferences}
          onPreferencesChange={mockOnChange}
        />,
        { wrapper: TestWrapper }
      )

      const switches = screen.getAllByRole('checkbox')
      await user.click(switches[7]) // Email Daily Practice

      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockPreferences,
        emailSubPreferences: {
          ...mockPreferences.emailSubPreferences,
          dailyPractice: true,
        },
      })
    })

    it('should disable Email sub-preferences when master switch is off', () => {
      const disabledPrefs = {
        ...mockPreferences,
        email: false,
      }

      render(
        <NotificationPreferences
          preferences={disabledPrefs}
          onPreferencesChange={mockOnChange}
        />,
        { wrapper: TestWrapper }
      )

      const switches = screen.getAllByRole('checkbox')

      // Email sub-preferences should be disabled (indices 7-11)
      expect(switches[7]).toBeDisabled() // dailyPractice
      expect(switches[8]).toBeDisabled() // newFeatures
      expect(switches[9]).toBeDisabled() // progressMilestones
      expect(switches[10]).toBeDisabled() // loginStreak
      expect(switches[11]).toBeDisabled() // activityStreak
    })
  })

  describe('Independent Preferences', () => {
    it('should allow different values for In-App and Email sub-preferences', () => {
      const independentPrefs = {
        inApp: true,
        email: true,
        inAppSubPreferences: {
          dailyPractice: true,
          newFeatures: false,
          progressMilestones: false,
          loginStreak: true,
          activityStreak: false,
        },
        emailSubPreferences: {
          dailyPractice: false,
          newFeatures: true,
          progressMilestones: true,
          loginStreak: false,
          activityStreak: true,
        },
      }

      render(
        <NotificationPreferences
          preferences={independentPrefs}
          onPreferencesChange={mockOnChange}
        />,
        { wrapper: TestWrapper }
      )

      const switches = screen.getAllByRole('checkbox')

      // In-App Daily Practice: true
      expect(switches[1]).toBeChecked()
      // Email Daily Practice: false
      expect(switches[7]).not.toBeChecked()

      // In-App New Features: false
      expect(switches[2]).not.toBeChecked()
      // Email New Features: true
      expect(switches[8]).toBeChecked()
    })

    it('should toggle In-App preference without affecting Email preference', async () => {
      const user = userEvent.setup()

      render(
        <NotificationPreferences
          preferences={mockPreferences}
          onPreferencesChange={mockOnChange}
        />,
        { wrapper: TestWrapper }
      )

      const switches = screen.getAllByRole('checkbox')
      await user.click(switches[1]) // In-App Daily Practice

      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockPreferences,
        inAppSubPreferences: {
          ...mockPreferences.inAppSubPreferences,
          dailyPractice: false, // Changed
        },
        emailSubPreferences: mockPreferences.emailSubPreferences, // Unchanged
      })
    })

    it('should toggle Email preference without affecting In-App preference', async () => {
      const user = userEvent.setup()

      render(
        <NotificationPreferences
          preferences={mockPreferences}
          onPreferencesChange={mockOnChange}
        />,
        { wrapper: TestWrapper }
      )

      const switches = screen.getAllByRole('checkbox')
      await user.click(switches[8]) // Email New Features

      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockPreferences,
        inAppSubPreferences: mockPreferences.inAppSubPreferences, // Unchanged
        emailSubPreferences: {
          ...mockPreferences.emailSubPreferences,
          newFeatures: false, // Changed
        },
      })
    })
  })

  describe('All Preferences Disabled', () => {
    it('should handle all preferences being disabled', () => {
      const allDisabledPrefs = {
        inApp: false,
        email: false,
        inAppSubPreferences: {
          dailyPractice: false,
          newFeatures: false,
          progressMilestones: false,
          loginStreak: false,
          activityStreak: false,
        },
        emailSubPreferences: {
          dailyPractice: false,
          newFeatures: false,
          progressMilestones: false,
          loginStreak: false,
          activityStreak: false,
        },
      }

      render(
        <NotificationPreferences
          preferences={allDisabledPrefs}
          onPreferencesChange={mockOnChange}
        />,
        { wrapper: TestWrapper }
      )

      const switches = screen.getAllByRole('checkbox')

      // All sub-preferences should be disabled
      for (let i = 1; i <= 11; i++) {
        if (i !== 6) {
          // Skip Email master switch
          expect(switches[i]).toBeDisabled()
        }
      }
    })
  })

  describe('All Preferences Enabled', () => {
    it('should handle all preferences being enabled', () => {
      const allEnabledPrefs = {
        inApp: true,
        email: true,
        inAppSubPreferences: {
          dailyPractice: true,
          newFeatures: true,
          progressMilestones: true,
          loginStreak: true,
          activityStreak: true,
        },
        emailSubPreferences: {
          dailyPractice: true,
          newFeatures: true,
          progressMilestones: true,
          loginStreak: true,
          activityStreak: true,
        },
      }

      render(
        <NotificationPreferences
          preferences={allEnabledPrefs}
          onPreferencesChange={mockOnChange}
        />,
        { wrapper: TestWrapper }
      )

      const switches = screen.getAllByRole('checkbox')

      // All switches should be checked
      switches.forEach((switchElement) => {
        expect(switchElement).toBeChecked()
      })
    })
  })
})
