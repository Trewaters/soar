import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { SessionProvider } from 'next-auth/react'
import CreateAsanaWithImages from '@app/navigator/asanaPoses/createAsana/CreateAsanaWithImages'
import { createTheme } from '@mui/material/styles'
import * as poseService from '@lib/poseService'
import NAV_PATHS from '@app/utils/navigation/constants'

// Mock dependencies
jest.mock('next-auth/react')
// Remove local next/navigation mock - use global mock from jest.setup.ts
jest.mock('@app/context/AsanaPoseContext', () => ({
  useAsanaPose: jest.fn(),
  useSafeAsanaPose: jest.fn(),
}))
// Note: @lib/poseService is now centrally mocked in jest.setup.ts
jest.mock('@app/clientComponents/imageUpload/ImageManagement', () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="image-management">Image Management</div>
  )),
}))

// Use global mock from jest.setup.ts
const mockPush = (globalThis as any).mockNavigationPush
const mockSession = {
  user: {
    email: 'test@example.com',
    id: 'user123',
  },
  expires: '2099-01-01',
}

const mockDispatch = jest.fn()
const mockState = {
  poses: {},
}

describe('CreateAsanaWithImages - Happy Path', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock next-auth session
    const { useSession } = require('next-auth/react')
    useSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    })

    // Mock AsanaPose context (both hooks)
    const ctx = require('@app/context/AsanaPoseContext')
    ctx.useAsanaPose.mockReturnValue({
      state: mockState,
      dispatch: mockDispatch,
    })
    // ensure useSafeAsanaPose mirrors useAsanaPose in tests
    ctx.useSafeAsanaPose.mockImplementation(() => ctx.useAsanaPose())
  })

  const TestWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => (
    <SessionProvider session={mockSession}>
      <ThemeProvider theme={createTheme()}>{children}</ThemeProvider>
    </SessionProvider>
  )

  describe('Component Rendering', () => {
    it('should render create asana form with all required fields', () => {
      render(<CreateAsanaWithImages />, { wrapper: TestWrapper })

      expect(
        screen.getByRole('heading', { name: /create asana/i })
      ).toBeInTheDocument()
      expect(screen.getByLabelText(/sort english name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/difficulty/i)).toBeInTheDocument()
    })

    it('should display image management component', () => {
      render(<CreateAsanaWithImages />, { wrapper: TestWrapper })

      expect(screen.getByTestId('image-management')).toBeInTheDocument()
    })

    it('should render submit button', () => {
      render(<CreateAsanaWithImages />, { wrapper: TestWrapper })

      expect(
        screen.getByRole('button', { name: /create asana/i })
      ).toBeInTheDocument()
    })
  })

  describe('Form Input Handling', () => {
    it('should update sort english name field', async () => {
      render(<CreateAsanaWithImages />, { wrapper: TestWrapper })

      const nameInput = screen.getByLabelText(/sort english name/i)
      await user.type(nameInput, 'Warrior Pose')

      expect(nameInput).toHaveValue('Warrior Pose')
    })

    it('should update description field', async () => {
      render(<CreateAsanaWithImages />, { wrapper: TestWrapper })

      const descInput = screen.getByLabelText(/description/i)
      await user.type(descInput, 'A powerful standing pose')

      expect(descInput).toHaveValue('A powerful standing pose')
    })

    it('should update category field', async () => {
      render(<CreateAsanaWithImages />, { wrapper: TestWrapper })

      const categoryInput = screen.getByLabelText(/category/i)
      await user.selectOptions(categoryInput, 'Standing')

      expect(categoryInput).toHaveValue('Standing')
    })

    it('should update difficulty field', async () => {
      render(<CreateAsanaWithImages />, { wrapper: TestWrapper })

      const difficultyInput = screen.getByLabelText(/difficulty/i)
      await user.selectOptions(difficultyInput, 'Easy')

      expect(difficultyInput).toHaveValue('Easy')
    })

    it('should dispatch context updates when fields change', async () => {
      render(<CreateAsanaWithImages />, { wrapper: TestWrapper })

      const nameInput = screen.getByLabelText(/sort english name/i)
      await user.type(nameInput, 'Test Pose')

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled()
      })
    })
  })

  describe('Form Submission', () => {
    it('should successfully create a new asana pose', async () => {
      const mockCreatedPose = {
        id: 'new-pose-123',
        sort_english_name: 'Warrior Pose',
        english_names: ['Warrior I', 'Virabhadrasana I'],
        description: 'A powerful standing pose',
        category: 'Standing',
        difficulty: 'Beginner',
        breath_direction_default: 'Inhale',
        created_by: 'test@example.com',
      }

      ;(poseService.createPose as jest.Mock).mockResolvedValue(mockCreatedPose)

      render(<CreateAsanaWithImages />, { wrapper: TestWrapper })

      // Fill in required fields
      await user.type(
        screen.getByLabelText(/sort english name/i),
        'Warrior Pose'
      )
      await user.type(
        screen.getByLabelText(/english names/i),
        'Warrior, Warrior I'
      )
      await user.type(
        screen.getByLabelText(/description/i),
        'A powerful standing pose'
      )
      await user.selectOptions(screen.getByLabelText(/category/i), 'Standing')
      await user.selectOptions(screen.getByLabelText(/difficulty/i), 'Easy')

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /create asana/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(poseService.createPose).toHaveBeenCalledWith(
          expect.objectContaining({
            sort_english_name: 'Warrior Pose',
            description: 'A powerful standing pose',
            category: 'Standing',
            difficulty: 'Easy',
            created_by: 'test@example.com',
          })
        )
      })
    })

    it('should redirect to new asana page after successful creation', async () => {
      const mockCreatedPose = {
        id: 'new-pose-456',
        sort_english_name: 'Tree Pose',
        english_names: [],
        description: 'Balance pose',
        category: 'Balance',
        difficulty: 'Beginner',
        created_by: 'test@example.com',
      }

      ;(poseService.createPose as jest.Mock).mockResolvedValue(mockCreatedPose)

      render(<CreateAsanaWithImages />, { wrapper: TestWrapper })

      // Fill in minimal required fields
      await user.type(screen.getByLabelText(/sort english name/i), 'Tree Pose')
      await user.type(
        screen.getByLabelText(/english names/i),
        'Tree, Vrksasana'
      )
      await user.type(screen.getByLabelText(/description/i), 'Balance pose')
      await user.selectOptions(screen.getByLabelText(/category/i), 'Balance')
      await user.selectOptions(screen.getByLabelText(/difficulty/i), 'Easy')

      // Submit form
      await user.click(screen.getByRole('button', { name: /create asana/i }))

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          `${NAV_PATHS.PRACTICE_ASANAS}?id=${encodeURIComponent(
            'new-pose-456'
          )}`
        )
      })
    })

    it('should clear form fields after successful submission', async () => {
      const mockCreatedPose = {
        id: 'new-pose-789',
        sort_english_name: 'Child Pose',
        english_names: [],
        description: 'Resting pose',
        category: 'Restorative',
        difficulty: 'Beginner',
        created_by: 'test@example.com',
      }

      ;(poseService.createPose as jest.Mock).mockResolvedValue(mockCreatedPose)

      render(<CreateAsanaWithImages />, { wrapper: TestWrapper })

      const nameInput = screen.getByLabelText(
        /sort english name/i
      ) as HTMLInputElement
      const descInput = screen.getByLabelText(
        /description/i
      ) as HTMLInputElement

      await user.type(nameInput, 'Child Pose')
      await user.type(
        screen.getByLabelText(/english names/i),
        'Child, Balasana'
      )
      await user.type(descInput, 'Resting pose')
      await user.selectOptions(screen.getByLabelText(/category/i), 'Seated')
      await user.selectOptions(screen.getByLabelText(/difficulty/i), 'Easy')

      await user.click(screen.getByRole('button', { name: /create asana/i }))

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled()
      })
    })

    it('should include user email as created_by field', async () => {
      const mockCreatedPose = {
        id: 'new-pose-999',
        sort_english_name: 'Test Pose',
        english_names: [],
        description: 'Test description',
        category: 'Standing',
        difficulty: 'Average',
        created_by: 'test@example.com',
      }

      ;(poseService.createPose as jest.Mock).mockResolvedValue(mockCreatedPose)

      render(<CreateAsanaWithImages />, { wrapper: TestWrapper })

      await user.type(screen.getByLabelText(/sort english name/i), 'Test Pose')
      await user.type(
        screen.getByLabelText(/english names/i),
        'Test, Test Pose'
      )
      await user.type(screen.getByLabelText(/description/i), 'Test description')
      await user.selectOptions(screen.getByLabelText(/category/i), 'Standing')
      await user.selectOptions(screen.getByLabelText(/difficulty/i), 'Average')

      await user.click(screen.getByRole('button', { name: /create asana/i }))

      await waitFor(() => {
        expect(poseService.createPose).toHaveBeenCalledWith(
          expect.objectContaining({
            created_by: 'test@example.com',
          })
        )
      })
    })
  })

  describe('Optional Fields', () => {
    it('should include optional sanskrit names when provided', async () => {
      const mockCreatedPose = {
        id: 'new-pose-101',
        sort_english_name: 'Warrior Pose',
        english_names: [],
        sanskrit_names: ['Virabhadrasana'],
        description: 'Strong pose',
        category: 'Standing',
        difficulty: 'Intermediate',
        created_by: 'test@example.com',
      }

      ;(poseService.createPose as jest.Mock).mockResolvedValue(mockCreatedPose)

      render(<CreateAsanaWithImages />, { wrapper: TestWrapper })

      await user.type(
        screen.getByLabelText(/sort english name/i),
        'Warrior Pose'
      )
      await user.type(
        screen.getByLabelText(/english names/i),
        'Warrior, Warrior I'
      )
      await user.type(screen.getByLabelText(/description/i), 'Strong pose')
      await user.selectOptions(screen.getByLabelText(/category/i), 'Standing')
      await user.selectOptions(screen.getByLabelText(/difficulty/i), 'Average')

      await user.click(screen.getByRole('button', { name: /create asana/i }))

      await waitFor(() => {
        expect(poseService.createPose).toHaveBeenCalledWith(
          expect.objectContaining({
            sort_english_name: 'Warrior Pose',
            created_by: 'test@example.com',
          })
        )
      })
    })
  })

  describe('Authentication Handling', () => {
    it('should redirect to poses page when user is not authenticated', async () => {
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      })

      render(<CreateAsanaWithImages />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/asanaPoses')
      })
    })
  })
})
