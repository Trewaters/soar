import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import type {
  ActivityTrackerProps,
  CheckActivityResult,
  CreateActivityData,
} from '../../../app/clientComponents/ActivityTracker.types'

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

// Import mocked useSession
import { useSession } from 'next-auth/react'
import ActivityTracker from '../../../app/clientComponents/ActivityTracker'

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

// Create MUI theme for testing
const theme = createTheme()

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

// Mock data
const mockSession = {
  user: {
    id: 'test-user-123',
    email: 'test@uvuyoga.com',
    name: 'Test Yogi',
  },
  expires: '2025-12-31T23:59:59.999Z',
}

const mockActivity = {
  id: 'activity-123',
  userId: 'test-user-123',
  entityId: 'entity-123',
  entityName: 'Test Asana',
  difficulty: 'average' as const,
  completionStatus: 'complete',
  datePerformed: new Date().toISOString(),
}

// Mock service functions
const mockCheckActivity = jest.fn<
  Promise<CheckActivityResult>,
  [string, string]
>()
const mockCreateActivity = jest.fn<Promise<void>, [CreateActivityData]>()
const mockDeleteActivity = jest.fn<Promise<void>, [string, string]>()

// Default props for testing
const defaultProps: ActivityTrackerProps = {
  entityId: 'test-entity-123',
  entityName: 'Test Entity',
  entityType: 'asana',
  checkActivity: mockCheckActivity,
  createActivity: mockCreateActivity,
  deleteActivity: mockDeleteActivity,
}

describe('ActivityTracker Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
      update: jest.fn(),
    } as any)
    mockCheckActivity.mockResolvedValue({ exists: false })
    mockCreateActivity.mockResolvedValue(undefined)
    mockDeleteActivity.mockResolvedValue(undefined)
  })

  describe('Rendering Tests', () => {
    it('should render inline variant without errors', () => {
      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} variant="inline" />
        </TestWrapper>
      )

      // Verify difficulty chips are present
      expect(screen.getByText('Easy')).toBeInTheDocument()
      expect(screen.getByText('Average')).toBeInTheDocument()
      expect(screen.getByText('Difficult')).toBeInTheDocument()

      // Verify button is present
      expect(
        screen.getByRole('button', { name: /Mark for Activity Tracker/i })
      ).toBeInTheDocument()

      // Verify checkbox is present
      expect(screen.getByRole('checkbox')).toBeInTheDocument()

      // Verify no Paper wrapper (inline variant)
      const paperElements = document.querySelectorAll('.MuiPaper-root')
      expect(paperElements).toHaveLength(0)
    })

    it('should render card variant without errors', () => {
      render(
        <TestWrapper>
          <ActivityTracker
            {...defaultProps}
            variant="card"
            title="Track Your Practice"
          />
        </TestWrapper>
      )

      // Verify Paper wrapper is present (card variant)
      const paperElements = document.querySelectorAll('.MuiPaper-root')
      expect(paperElements.length).toBeGreaterThan(0)

      // Verify title displays
      expect(screen.getByText('Track Your Practice')).toBeInTheDocument()

      // Verify all controls are present
      expect(screen.getByText('Easy')).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /Mark for Activity Tracker/i })
      ).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })

    it('should render with custom title', () => {
      render(
        <TestWrapper>
          <ActivityTracker
            {...defaultProps}
            variant="card"
            title="Custom Title Here"
          />
        </TestWrapper>
      )

      expect(screen.getByText('Custom Title Here')).toBeInTheDocument()
    })

    it('should render with custom button label', () => {
      render(
        <TestWrapper>
          <ActivityTracker
            {...defaultProps}
            buttonLabel="Custom Button Label"
          />
        </TestWrapper>
      )

      expect(
        screen.getByRole('button', { name: /Custom Button Label/i })
      ).toBeInTheDocument()
    })

    it('should return null without session', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      } as any)

      const { container } = render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} />
        </TestWrapper>
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Props Tests', () => {
    it('should use default variant (card) when not specified', () => {
      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} />
        </TestWrapper>
      )

      // Card variant has Paper wrapper
      const paperElements = document.querySelectorAll('.MuiPaper-root')
      expect(paperElements.length).toBeGreaterThan(0)
    })

    it('should use default title based on entityType asana', () => {
      render(
        <TestWrapper>
          <ActivityTracker
            {...defaultProps}
            entityType="asana"
            variant="card"
          />
        </TestWrapper>
      )

      expect(screen.getByText('Track Your Practice')).toBeInTheDocument()
    })

    it('should use default title based on entityType series', () => {
      render(
        <TestWrapper>
          <ActivityTracker
            {...defaultProps}
            entityType="series"
            variant="card"
          />
        </TestWrapper>
      )

      expect(screen.getByText('Track Your Practice')).toBeInTheDocument()
    })

    it('should use default title based on entityType sequence', () => {
      render(
        <TestWrapper>
          <ActivityTracker
            {...defaultProps}
            entityType="sequence"
            variant="card"
          />
        </TestWrapper>
      )

      expect(
        screen.getByText('Track Your Sequence Practice')
      ).toBeInTheDocument()
    })

    it('should use default buttonLabel based on entityType asana', () => {
      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} entityType="asana" />
        </TestWrapper>
      )

      expect(
        screen.getByRole('button', { name: /Mark for Activity Tracker/i })
      ).toBeInTheDocument()
    })

    it('should use default buttonLabel based on entityType series', () => {
      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} entityType="series" />
        </TestWrapper>
      )

      expect(
        screen.getByRole('button', { name: /Track Series Practice/i })
      ).toBeInTheDocument()
    })

    it('should use default buttonLabel based on entityType sequence', () => {
      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} entityType="sequence" />
        </TestWrapper>
      )

      expect(
        screen.getByRole('button', { name: /Track Sequence Practice/i })
      ).toBeInTheDocument()
    })
  })

  describe('Difficulty Selection Tests', () => {
    it('should toggle Easy chip selection on click', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} variant="inline" />
        </TestWrapper>
      )

      const easyChip = screen.getByText('Easy')

      // Click to select
      await user.click(easyChip)

      // Verify chip is filled (check for success color class or filled variant)
      expect(easyChip.closest('.MuiChip-filled')).toBeInTheDocument()

      // Click again to deselect
      await user.click(easyChip)

      // Verify chip is outlined
      expect(easyChip.closest('.MuiChip-outlined')).toBeInTheDocument()
    })

    it('should toggle Average chip selection on click', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} variant="inline" />
        </TestWrapper>
      )

      const averageChip = screen.getByText('Average')

      await user.click(averageChip)
      expect(averageChip.closest('.MuiChip-filled')).toBeInTheDocument()

      await user.click(averageChip)
      expect(averageChip.closest('.MuiChip-outlined')).toBeInTheDocument()
    })

    it('should toggle Difficult chip selection on click', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} variant="inline" />
        </TestWrapper>
      )

      const difficultChip = screen.getByText('Difficult')

      await user.click(difficultChip)
      expect(difficultChip.closest('.MuiChip-filled')).toBeInTheDocument()

      await user.click(difficultChip)
      expect(difficultChip.closest('.MuiChip-outlined')).toBeInTheDocument()
    })

    it('should allow only one difficulty to be selected at a time', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} variant="inline" />
        </TestWrapper>
      )

      const easyChip = screen.getByText('Easy')
      const averageChip = screen.getByText('Average')
      const difficultChip = screen.getByText('Difficult')

      // Click Easy
      await user.click(easyChip)
      expect(easyChip.closest('.MuiChip-filled')).toBeInTheDocument()
      expect(averageChip.closest('.MuiChip-outlined')).toBeInTheDocument()
      expect(difficultChip.closest('.MuiChip-outlined')).toBeInTheDocument()

      // Click Average
      await user.click(averageChip)
      expect(easyChip.closest('.MuiChip-outlined')).toBeInTheDocument()
      expect(averageChip.closest('.MuiChip-filled')).toBeInTheDocument()
      expect(difficultChip.closest('.MuiChip-outlined')).toBeInTheDocument()

      // Click Difficult
      await user.click(difficultChip)
      expect(easyChip.closest('.MuiChip-outlined')).toBeInTheDocument()
      expect(averageChip.closest('.MuiChip-outlined')).toBeInTheDocument()
      expect(difficultChip.closest('.MuiChip-filled')).toBeInTheDocument()
    })

    it('should have correct colors for difficulty chips', () => {
      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} />
        </TestWrapper>
      )

      const easyChip = screen.getByText('Easy').closest('.MuiChip-root')
      const averageChip = screen.getByText('Average').closest('.MuiChip-root')
      const difficultChip = screen
        .getByText('Difficult')
        .closest('.MuiChip-root')

      expect(easyChip).toHaveClass('MuiChip-colorSuccess')
      expect(averageChip).toHaveClass('MuiChip-colorInfo')
      expect(difficultChip).toHaveClass('MuiChip-colorError')
    })
  })

  describe('Activity Toggle Tests', () => {
    it('should create activity with correct data on button click', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} />
        </TestWrapper>
      )

      // Select difficulty
      await user.click(screen.getByText('Easy'))

      // Click track button
      const trackButton = screen.getByRole('button', {
        name: /Mark for Activity Tracker/i,
      })
      await user.click(trackButton)

      await waitFor(() => {
        // For asana entity type, dynamic fields (asanaId, asanaName) are NOT added
        // Only base fields and additionalActivityData are included
        expect(mockCreateActivity).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: 'test-user-123',
            difficulty: 'easy',
            completionStatus: 'complete',
          })
        )
      })

      // Verify button state updated
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Tracked in Activity/i })
        ).toBeInTheDocument()
      })
    })

    it('should create activity on checkbox change', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} />
        </TestWrapper>
      )

      // Select difficulty
      await user.click(screen.getByText('Average'))

      // Click checkbox
      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      await waitFor(() => {
        expect(mockCreateActivity).toHaveBeenCalledWith(
          expect.objectContaining({
            difficulty: 'average',
          })
        )
      })
    })

    it('should delete activity when unchecking', async () => {
      const user = userEvent.setup()

      // Mock existing activity
      mockCheckActivity.mockResolvedValue({
        exists: true,
        activity: mockActivity,
      })

      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} />
        </TestWrapper>
      )

      // Wait for existing activity to load
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Tracked in Activity/i })
        ).toBeInTheDocument()
      })

      // Click button to uncheck
      const trackButton = screen.getByRole('button', {
        name: /Tracked in Activity/i,
      })
      await user.click(trackButton)

      await waitFor(() => {
        expect(mockDeleteActivity).toHaveBeenCalledWith(
          'test-user-123',
          'test-entity-123'
        )
      })

      // Verify button state updated
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Mark for Activity Tracker/i })
        ).toBeInTheDocument()
      })
    })

    it('should show loading state and disable controls', async () => {
      const user = userEvent.setup()

      // Mock delayed response
      mockCreateActivity.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )

      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} />
        </TestWrapper>
      )

      await user.click(screen.getByText('Easy'))

      const trackButton = screen.getByRole('button', {
        name: /Mark for Activity Tracker/i,
      })
      const checkbox = screen.getByRole('checkbox')

      await user.click(trackButton)

      // Verify loading state
      expect(
        screen.getByRole('button', { name: /Saving/i })
      ).toBeInTheDocument()
      expect(trackButton).toBeDisabled()
      expect(checkbox).toBeDisabled()

      // Wait for completion
      await waitFor(
        () => {
          expect(
            screen.getByRole('button', { name: /Tracked in Activity/i })
          ).toBeInTheDocument()
        },
        { timeout: 200 }
      )
    })

    it('should include selected difficulty in activity data', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} />
        </TestWrapper>
      )

      await user.click(screen.getByText('Difficult'))

      const trackButton = screen.getByRole('button', {
        name: /Mark for Activity Tracker/i,
      })
      await user.click(trackButton)

      await waitFor(() => {
        expect(mockCreateActivity).toHaveBeenCalledWith(
          expect.objectContaining({
            difficulty: 'difficult',
          })
        )
      })
    })

    it('should include additional data from props', async () => {
      const user = userEvent.setup()

      const additionalData = {
        sort_english_name: 'Warrior Pose',
        duration: 60,
      }

      render(
        <TestWrapper>
          <ActivityTracker
            {...defaultProps}
            additionalActivityData={additionalData}
          />
        </TestWrapper>
      )

      await user.click(screen.getByText('Easy'))
      await user.click(
        screen.getByRole('button', { name: /Mark for Activity Tracker/i })
      )

      await waitFor(() => {
        expect(mockCreateActivity).toHaveBeenCalledWith(
          expect.objectContaining({
            sort_english_name: 'Warrior Pose',
            duration: 60,
          })
        )
      })
    })
  })

  describe('Session Integration Tests', () => {
    it('should not render when session is missing', async () => {
      // Set session to null before render
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      } as any)

      const { container } = render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} />
        </TestWrapper>
      )

      // Component should return null and render nothing
      expect(container.firstChild).toBeNull()
      expect(mockCreateActivity).not.toHaveBeenCalled()
    })

    it('should use correct userId from session', async () => {
      const user = userEvent.setup()

      const customSession = {
        user: {
          id: 'custom-user-456',
          email: 'custom@test.com',
          name: 'Custom User',
        },
        expires: '2025-12-31T23:59:59.999Z',
      }

      mockUseSession.mockReturnValue({
        data: customSession,
        status: 'authenticated',
        update: jest.fn(),
      } as any)

      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} />
        </TestWrapper>
      )

      await user.click(screen.getByText('Easy'))
      await user.click(
        screen.getByRole('button', { name: /Mark for Activity Tracker/i })
      )

      await waitFor(() => {
        expect(mockCreateActivity).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: 'custom-user-456',
          })
        )
      })
    })
  })

  describe('Error Handling Tests', () => {
    it('should display error message when createActivity fails', async () => {
      const user = userEvent.setup()

      mockCreateActivity.mockRejectedValue(
        new Error('Failed to create activity')
      )

      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} />
        </TestWrapper>
      )

      await user.click(screen.getByText('Easy'))
      await user.click(
        screen.getByRole('button', { name: /Mark for Activity Tracker/i })
      )

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to create activity/i)
        ).toBeInTheDocument()
      })

      // Verify checked state is not changed
      expect(
        screen.getByRole('button', { name: /Mark for Activity Tracker/i })
      ).toBeInTheDocument()
    })

    it('should display error message when deleteActivity fails', async () => {
      const user = userEvent.setup()

      mockCheckActivity.mockResolvedValue({
        exists: true,
        activity: mockActivity,
      })
      mockDeleteActivity.mockRejectedValue(
        new Error('Failed to delete activity')
      )

      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Tracked in Activity/i })
        ).toBeInTheDocument()
      })

      const trackButton = screen.getByRole('button', {
        name: /Tracked in Activity/i,
      })
      await user.click(trackButton)

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to delete activity/i)
        ).toBeInTheDocument()
      })

      // Verify checked state reverted
      expect(
        screen.getByRole('button', { name: /Tracked in Activity/i })
      ).toBeInTheDocument()
    })

    it('should clear error on successful retry', async () => {
      const user = userEvent.setup()

      // First attempt fails
      mockCreateActivity.mockRejectedValueOnce(new Error('Network error'))

      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} />
        </TestWrapper>
      )

      await user.click(screen.getByText('Easy'))
      await user.click(
        screen.getByRole('button', { name: /Mark for Activity Tracker/i })
      )

      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument()
      })

      // Second attempt succeeds
      mockCreateActivity.mockResolvedValueOnce(undefined)

      await user.click(
        screen.getByRole('button', { name: /Mark for Activity Tracker/i })
      )

      await waitFor(() => {
        expect(screen.queryByText(/Network error/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Callback Integration Tests', () => {
    it('should invoke onActivityToggle callback on create', async () => {
      const user = userEvent.setup()
      const onActivityToggle = jest.fn()

      render(
        <TestWrapper>
          <ActivityTracker
            {...defaultProps}
            onActivityToggle={onActivityToggle}
          />
        </TestWrapper>
      )

      await user.click(screen.getByText('Easy'))
      await user.click(
        screen.getByRole('button', { name: /Mark for Activity Tracker/i })
      )

      await waitFor(() => {
        expect(onActivityToggle).toHaveBeenCalledWith(true)
      })
    })

    it('should invoke onActivityToggle callback on delete', async () => {
      const user = userEvent.setup()
      const onActivityToggle = jest.fn()

      mockCheckActivity.mockResolvedValue({
        exists: true,
        activity: mockActivity,
      })

      render(
        <TestWrapper>
          <ActivityTracker
            {...defaultProps}
            onActivityToggle={onActivityToggle}
          />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Tracked in Activity/i })
        ).toBeInTheDocument()
      })

      await user.click(
        screen.getByRole('button', { name: /Tracked in Activity/i })
      )

      await waitFor(() => {
        expect(onActivityToggle).toHaveBeenCalledWith(false)
      })
    })

    it('should invoke onActivityRefresh callback after create', async () => {
      const user = userEvent.setup()
      const onActivityRefresh = jest.fn()

      render(
        <TestWrapper>
          <ActivityTracker
            {...defaultProps}
            onActivityRefresh={onActivityRefresh}
          />
        </TestWrapper>
      )

      await user.click(screen.getByText('Easy'))
      await user.click(
        screen.getByRole('button', { name: /Mark for Activity Tracker/i })
      )

      await waitFor(() => {
        expect(onActivityRefresh).toHaveBeenCalled()
      })
    })

    it('should invoke onActivityRefresh callback after delete', async () => {
      const user = userEvent.setup()
      const onActivityRefresh = jest.fn()

      mockCheckActivity.mockResolvedValue({
        exists: true,
        activity: mockActivity,
      })

      render(
        <TestWrapper>
          <ActivityTracker
            {...defaultProps}
            onActivityRefresh={onActivityRefresh}
          />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Tracked in Activity/i })
        ).toBeInTheDocument()
      })

      await user.click(
        screen.getByRole('button', { name: /Tracked in Activity/i })
      )

      await waitFor(() => {
        expect(onActivityRefresh).toHaveBeenCalled()
      })
    })

    it('should load existing activity on mount', async () => {
      mockCheckActivity.mockResolvedValue({
        exists: true,
        activity: mockActivity,
      })

      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Tracked in Activity/i })
        ).toBeInTheDocument()
      })

      expect(mockCheckActivity).toHaveBeenCalledWith(
        'test-user-123',
        'test-entity-123'
      )
    })

    it('should restore saved difficulty from existing activity', async () => {
      mockCheckActivity.mockResolvedValue({
        exists: true,
        activity: { ...mockActivity, difficulty: 'average' },
      })

      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} />
        </TestWrapper>
      )

      await waitFor(() => {
        const averageChip = screen.getByText('Average')
        expect(averageChip.closest('.MuiChip-filled')).toBeInTheDocument()
      })

      // Verify other chips are outlined
      const easyChip = screen.getByText('Easy')
      const difficultChip = screen.getByText('Difficult')
      expect(easyChip.closest('.MuiChip-outlined')).toBeInTheDocument()
      expect(difficultChip.closest('.MuiChip-outlined')).toBeInTheDocument()
    })
  })

  describe('Success Message Tests', () => {
    it('should display success message when showSuccessMessage is true and checked', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ActivityTracker
            {...defaultProps}
            variant="card"
            showSuccessMessage={true}
          />
        </TestWrapper>
      )

      await user.click(screen.getByText('Easy'))
      await user.click(
        screen.getByRole('button', { name: /Mark for Activity Tracker/i })
      )

      await waitFor(() => {
        expect(
          screen.getByText(/Great job! This asana practice has been added/i)
        ).toBeInTheDocument()
      })
    })

    it('should hide success message when showSuccessMessage is false', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ActivityTracker
            {...defaultProps}
            variant="card"
            showSuccessMessage={false}
          />
        </TestWrapper>
      )

      await user.click(screen.getByText('Easy'))
      await user.click(
        screen.getByRole('button', { name: /Mark for Activity Tracker/i })
      )

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Tracked in Activity/i })
        ).toBeInTheDocument()
      })

      expect(screen.queryByText(/Great job!/i)).not.toBeInTheDocument()
    })

    it('should hide success message when not checked', () => {
      render(
        <TestWrapper>
          <ActivityTracker
            {...defaultProps}
            variant="card"
            showSuccessMessage={true}
          />
        </TestWrapper>
      )

      expect(screen.queryByText(/Great job!/i)).not.toBeInTheDocument()
    })
  })

  describe('Accessibility Tests', () => {
    it('should have accessible button label', () => {
      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} />
        </TestWrapper>
      )

      expect(
        screen.getByRole('button', { name: /Mark for Activity Tracker/i })
      ).toBeInTheDocument()
    })

    it('should have accessible checkbox', () => {
      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} />
        </TestWrapper>
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
      expect(checkbox).not.toBeChecked()
    })

    it('should have focusable difficulty chips', async () => {
      render(
        <TestWrapper>
          <ActivityTracker {...defaultProps} variant="inline" />
        </TestWrapper>
      )

      const easyChip = screen.getByText('Easy').closest('.MuiChip-root')

      // Verify chip is focusable (has tabindex)
      expect(easyChip).toHaveAttribute('tabindex', '0')
      expect(easyChip).toHaveAttribute('role', 'button')
    })
  })
})
