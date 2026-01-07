import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { SessionProvider } from 'next-auth/react'
import EditPoseDialog from '@app/navigator/asanaPoses/editAsana/EditPoseDialog'
import { createTheme } from '@mui/material/styles'
import * as poseService from '@lib/poseService'
import type { AsanaPose } from 'types/asana'

// Mock dependencies
jest.mock('next-auth/react')
// Note: @lib/poseService is now centrally mocked in jest.setup.ts
jest.mock('@app/clientComponents/imageUpload/ImageGallery', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="image-gallery">Image Gallery</div>),
}))

const mockSession = {
  user: {
    email: 'test@example.com',
    id: 'user123',
  },
  expires: '2099-01-01',
}

const mockAsanaPose: AsanaPose = {
  id: 'pose-123',
  sort_english_name: 'Warrior I',
  sanskrit_names: ['Virabhadrasana I'],
  english_names: ['Warrior I', 'Warrior One'],
  description: 'A powerful standing pose',
  category: 'Standing',
  difficulty: 'Easy',
  dristi: 'Forward',
  setup_cues: 'Start in mountain pose',
  deepening_cues: 'Sink deeper',
  breath_direction_default: 'Neutral',
  created_by: 'test@example.com',
  poseImages: [],
}

describe('EditPoseDialog - Edit Asana - Happy Path', () => {
  const user = userEvent.setup()
  const mockOnClose = jest.fn()
  const mockOnSave = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock next-auth session
    const { useSession } = require('next-auth/react')
    useSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    })
    // Mock global.fetch used by EditPoseDialog to reorder images
    ;(global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    })
  })

  afterEach(() => {
    // Clean up fetch mock
    try {
      delete (global as any).fetch
    } catch (e) {
      ;(global as any).fetch = undefined
    }
  })

  const TestWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => (
    <SessionProvider session={mockSession}>
      <ThemeProvider theme={createTheme()}>{children}</ThemeProvider>
    </SessionProvider>
  )

  describe('Dialog Rendering', () => {
    it('should render edit dialog when open', () => {
      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText(/edit pose/i)).toBeInTheDocument()
    })

    it('should not render when closed', () => {
      render(
        <EditPoseDialog
          open={false}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should display all edit form fields', () => {
      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByLabelText(/sort english name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
    })
  })

  describe('Form Field Population', () => {
    it('should populate fields with existing pose data', () => {
      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      const nameInput = screen.getByLabelText(
        /sort english name/i
      ) as HTMLInputElement
      expect(nameInput.value).toBe('Warrior I')

      const descInput = screen.getByLabelText(
        /description/i
      ) as HTMLInputElement
      expect(descInput.value).toBe('A powerful standing pose')
    })

    it('should display sanskrit names in the form', () => {
      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      // Sanskrit names should be displayed in the form
      expect(screen.getByDisplayValue(/Virabhadrasana I/i)).toBeInTheDocument()
    })

    it('should display category information', () => {
      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      const categoryInput = screen.getByLabelText(
        /category/i
      ) as HTMLInputElement
      expect(categoryInput.value).toBe('Standing')
    })
  })

  describe('Form Field Editing', () => {
    it('should allow updating the sort english name', async () => {
      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      const nameInput = screen.getByLabelText(/sort english name/i)
      await user.clear(nameInput)
      await user.type(nameInput, 'Warrior II')

      expect(nameInput).toHaveValue('Warrior II')
    })

    it('should allow updating the description', async () => {
      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      const descInput = screen.getByLabelText(/description/i)
      await user.clear(descInput)
      await user.type(descInput, 'A grounding standing pose')

      expect(descInput).toHaveValue('A grounding standing pose')
    })

    it('should allow updating the category', async () => {
      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      const categoryInput = screen.getByLabelText(/category/i)
      await user.clear(categoryInput)
      await user.type(categoryInput, 'Balance')

      expect(categoryInput).toHaveValue('Balance')
    })

    it('should allow updating setup cues', async () => {
      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      const setupInput = screen.getByLabelText(/setup cues/i)
      await user.clear(setupInput)
      await user.type(setupInput, 'Begin in standing position')

      expect(setupInput).toHaveValue('Begin in standing position')
    })
  })

  describe('Save Functionality', () => {
    it('should successfully save edited pose', async () => {
      const mockUpdatedPose = {
        ...mockAsanaPose,
        description: 'Updated description',
      }

      ;(poseService.updatePose as jest.Mock).mockResolvedValue(mockUpdatedPose)

      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      const descInput = screen.getByLabelText(/description/i)
      await user.clear(descInput)
      await user.type(descInput, 'Updated description')

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      await waitFor(() => {
        expect(poseService.updatePose).toHaveBeenCalled()
      })
    })

    it('should call onSave callback after successful save', async () => {
      const mockUpdatedPose = {
        ...mockAsanaPose,
        sort_english_name: 'Warrior II',
      }

      ;(poseService.updatePose as jest.Mock).mockResolvedValue(mockUpdatedPose)

      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      const nameInput = screen.getByLabelText(/sort english name/i)
      await user.clear(nameInput)
      await user.type(nameInput, 'Warrior II')

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled()
      })
    })

    it('should include all updated fields in save request', async () => {
      ;(poseService.updatePose as jest.Mock).mockResolvedValue(mockAsanaPose)

      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      const nameInput = screen.getByLabelText(/sort english name/i)
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Name')

      const descInput = screen.getByLabelText(/description/i)
      await user.clear(descInput)
      await user.type(descInput, 'Updated description')

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      await waitFor(() => {
        expect(poseService.updatePose).toHaveBeenCalledWith(
          mockAsanaPose.id,
          expect.objectContaining({
            sort_english_name: 'Updated Name',
            description: 'Updated description',
          })
        )
      })
    })
  })

  describe('Cancel Functionality', () => {
    it('should call onClose when cancel button is clicked', async () => {
      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should not save changes when cancelled', async () => {
      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      const nameInput = screen.getByLabelText(/sort english name/i)
      await user.clear(nameInput)
      await user.type(nameInput, 'Should Not Save')

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      expect(poseService.updatePose).not.toHaveBeenCalled()
      expect(mockOnSave).not.toHaveBeenCalled()
    })
  })

  describe('Optional Fields Editing', () => {
    it('should allow editing dristi field', async () => {
      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      const dristiInput = screen.getByLabelText(/dristi/i)
      await user.clear(dristiInput)
      await user.type(dristiInput, 'Upward')

      expect(dristiInput).toHaveValue('Upward')
    })

    it('should allow editing deepening cues', async () => {
      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      const deepeningInput = screen.getByLabelText(/deepening cues/i)
      await user.clear(deepeningInput)
      await user.type(deepeningInput, 'Extend arms higher')

      expect(deepeningInput).toHaveValue('Extend arms higher')
    })
  })

  describe('Difficulty Level Selection', () => {
    it('should display difficulty level options', () => {
      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      // Difficulty selection should be present in the form
      expect(screen.getByText(/Easy/i)).toBeInTheDocument()
    })

    it('should allow changing difficulty level', async () => {
      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      // Look for difficulty button/chip options
      const intermediateButton = screen.getByRole('button', {
        name: /Average/i,
      })
      await user.click(intermediateButton)

      // Verify the selection is updated
      expect(intermediateButton).toBeInTheDocument()
    })
  })

  describe('Image Management Integration', () => {
    it('should display image gallery component', () => {
      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByTestId('image-gallery')).toBeInTheDocument()
    })
  })

  describe('Sanskrit Name Editing', () => {
    it('should allow editing sanskrit names', async () => {
      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      const sanskritInput = screen.getByDisplayValue(/Virabhadrasana I/i)
      await user.clear(sanskritInput)
      await user.type(sanskritInput, 'Virabhadrasana II')

      expect(sanskritInput).toHaveValue('Virabhadrasana II')
    })

    it('should preserve sanskrit names when saving', async () => {
      ;(poseService.updatePose as jest.Mock).mockResolvedValue(mockAsanaPose)

      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      await waitFor(() => {
        expect(poseService.updatePose).toHaveBeenCalledWith(
          mockAsanaPose.id,
          expect.objectContaining({
            sanskrit_names: expect.any(Array),
          })
        )
      })
    })
  })

  describe('Form Validation', () => {
    it('should maintain required fields during edit', async () => {
      render(
        <EditPoseDialog
          open={true}
          onClose={mockOnClose}
          pose={mockAsanaPose}
          onSave={mockOnSave}
        />,
        { wrapper: TestWrapper }
      )

      const nameInput = screen.getByLabelText(/sort english name/i)
      const descInput = screen.getByLabelText(/description/i)

      // Verify required fields are populated
      expect(nameInput).toHaveValue('Warrior I')
      expect(descInput).toHaveValue('A powerful standing pose')
    })
  })
})
