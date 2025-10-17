import React from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import EditSeriesDialog, {
  Series,
  Asana,
} from '@app/navigator/flows/editSeries/EditSeriesDialog'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useSession } from 'next-auth/react'

// Standard Soar mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  SessionProvider: ({ children }: any) => <>{children}</>,
}))
jest.mock('@/app/context/UserContext', () => ({
  UserStateProvider: ({ children }: any) => <>{children}</>,
}))
jest.mock('@/app/context/AsanaPoseContext', () => ({
  AsanaPoseProvider: ({ children }: any) => <>{children}</>,
}))
jest.mock('@/app/context/AsanaSeriesContext', () => ({
  FlowSeriesProvider: ({ children }: any) => <>{children}</>,
}))

// Mock AddAsanasDialog
jest.mock('@clientComponents/AddAsanasDialog', () => {
  return function MockAddAsanasDialog({ open, onClose, onAdd }: any) {
    if (!open) return null
    return (
      <div data-testid="add-asanas-dialog">
        <h2>Add Asanas to Series</h2>
        <button
          onClick={() =>
            onAdd([
              {
                id: 'new1',
                english_names: ['Tree Pose'],
                sort_english_name: 'tree-pose',
                sanskrit_names: 'Vrikshasana',
              },
            ])
          }
        >
          Add Tree Pose
        </button>
        <button data-testid="cancel-add-asanas-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    )
  }
})

const theme = createTheme()
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

const baseAsanas: Asana[] = [
  {
    id: 'a1',
    name: 'Warrior I',
    difficulty: 'beginner',
    alignment_cues: 'Keep front knee over ankle',
  },
  {
    id: 'a2',
    name: 'Downward Dog',
    difficulty: 'beginner',
    alignment_cues: '',
  },
  {
    id: 'a3',
    name: "Child's Pose",
    difficulty: 'beginner',
    alignment_cues: 'Rest forehead on mat',
  },
]

const makeSeries = (overrides?: Partial<Series>): Series => ({
  id: 's1',
  name: 'Morning Flow',
  description: 'Gentle warm-up flow',
  difficulty: 'beginner',
  asanas: baseAsanas,
  created_by: 'owner@yoga.com',
  ...overrides,
})

describe('EditSeriesDialog - Alignment Cues Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSession as jest.Mock).mockReturnValue({
      data: { user: { email: 'owner@yoga.com' } },
      status: 'authenticated',
    })
  })

  describe('Alignment Cues Input Rendering', () => {
    it('should render alignment cues TextField for each asana', () => {
      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={jest.fn()}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )

      // Check that alignment cue inputs appear for each pose
      expect(screen.getByTestId('edit-alignment-cues-0')).toBeInTheDocument()
      expect(screen.getByTestId('edit-alignment-cues-1')).toBeInTheDocument()
      expect(screen.getByTestId('edit-alignment-cues-2')).toBeInTheDocument()
    })

    it('should display existing alignment cues for each asana', () => {
      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={jest.fn()}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )

      const firstCues = screen.getByTestId(
        'edit-alignment-cues-0'
      ) as HTMLInputElement
      const thirdCues = screen.getByTestId(
        'edit-alignment-cues-2'
      ) as HTMLInputElement

      expect(firstCues.value).toBe('Keep front knee over ankle')
      expect(thirdCues.value).toBe('Rest forehead on mat')
    })

    it('should display character counter for alignment cues', () => {
      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={jest.fn()}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )

      // Check for character counters
      expect(screen.getByText('29/1000')).toBeInTheDocument() // "Keep front knee over ankle"
      expect(screen.getByText('0/1000')).toBeInTheDocument() // Empty cues
      expect(screen.getByText('22/1000')).toBeInTheDocument() // "Rest forehead on mat"
    })

    it('should handle empty alignment cues gracefully', () => {
      const seriesWithEmptyCues = makeSeries({
        asanas: [
          { id: 'a1', name: 'Warrior I', difficulty: 'beginner' },
          {
            id: 'a2',
            name: 'Downward Dog',
            difficulty: 'beginner',
            alignment_cues: '',
          },
        ],
      })

      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={seriesWithEmptyCues}
          onSave={jest.fn()}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )

      const firstCues = screen.getByTestId(
        'edit-alignment-cues-0'
      ) as HTMLInputElement
      const secondCues = screen.getByTestId(
        'edit-alignment-cues-1'
      ) as HTMLInputElement

      expect(firstCues.value).toBe('')
      expect(secondCues.value).toBe('')
    })
  })

  describe('Editing Alignment Cues', () => {
    it('should allow editing alignment cues for owner', async () => {
      const user = userEvent.setup()
      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={jest.fn()}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )

      const alignmentInput = screen.getByTestId('edit-alignment-cues-0')
      await user.clear(alignmentInput)
      await user.type(alignmentInput, 'Updated alignment cues')

      await waitFor(() => {
        const input = alignmentInput as HTMLInputElement
        expect(input.value).toBe('Updated alignment cues')
      })
    })

    it('should update character counter as user types', async () => {
      const user = userEvent.setup()
      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={jest.fn()}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )

      const alignmentInput = screen.getByTestId('edit-alignment-cues-1')
      const testText = 'Press heels toward mat and lengthen spine'
      await user.type(alignmentInput, testText)

      await waitFor(() => {
        expect(screen.getByText(`${testText.length}/1000`)).toBeInTheDocument()
      })
    })

    it('should enforce 1000 character limit', async () => {
      const user = userEvent.setup()
      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={jest.fn()}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )

      const alignmentInput = screen.getByTestId('edit-alignment-cues-0')
      const longText = 'a'.repeat(1100)

      await user.clear(alignmentInput)
      await user.type(alignmentInput, longText)

      await waitFor(() => {
        const input = alignmentInput as HTMLInputElement
        expect(input.value.length).toBeLessThanOrEqual(1000)
      })
    })

    it('should support multiline alignment cues', async () => {
      const user = userEvent.setup()
      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={jest.fn()}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )

      const alignmentInput = screen.getByTestId('edit-alignment-cues-0')
      const multilineText =
        'Line 1: Front knee over ankle\nLine 2: Back leg strong\nLine 3: Reach arms up'

      await user.clear(alignmentInput)
      await user.type(alignmentInput, multilineText)

      await waitFor(() => {
        const input = alignmentInput as HTMLTextAreaElement
        expect(input.value).toContain('\n')
      })
    })

    it('should disable alignment cues editing for non-owner', () => {
      ;(useSession as jest.Mock).mockReturnValue({
        data: { user: { email: 'guest@yoga.com' } },
        status: 'authenticated',
      })

      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={jest.fn()}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )

      // Non-owner should see "Unauthorized" message instead
      expect(screen.getByText('Unauthorized')).toBeInTheDocument()
      expect(
        screen.queryByTestId('edit-alignment-cues-0')
      ).not.toBeInTheDocument()
    })
  })

  describe('Reordering with Alignment Cues', () => {
    it('should preserve alignment cues when moving asana up', async () => {
      const user = userEvent.setup()
      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={jest.fn()}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )

      const list = screen.getByRole('list', { name: 'Asana list' })
      const listItems = within(list).getAllByRole('listitem')

      // Move second asana up
      const moveUpButton = within(listItems[1]).getByLabelText('Move up')
      await user.click(moveUpButton)

      await waitFor(() => {
        const firstCues = screen.getByTestId(
          'edit-alignment-cues-0'
        ) as HTMLInputElement
        const secondCues = screen.getByTestId(
          'edit-alignment-cues-1'
        ) as HTMLInputElement

        // After moving up, Downward Dog should be first (empty cues)
        // and Warrior I should be second (has cues)
        expect(firstCues.value).toBe('')
        expect(secondCues.value).toBe('Keep front knee over ankle')
      })
    })

    it('should preserve alignment cues when moving asana down', async () => {
      const user = userEvent.setup()
      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={jest.fn()}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )

      const list = screen.getByRole('list', { name: 'Asana list' })
      const listItems = within(list).getAllByRole('listitem')

      // Move first asana down
      const moveDownButton = within(listItems[0]).getByLabelText('Move down')
      await user.click(moveDownButton)

      await waitFor(() => {
        const firstCues = screen.getByTestId(
          'edit-alignment-cues-0'
        ) as HTMLInputElement
        const secondCues = screen.getByTestId(
          'edit-alignment-cues-1'
        ) as HTMLInputElement

        // After moving down, Downward Dog should be first (empty cues)
        // and Warrior I should be second (has cues)
        expect(firstCues.value).toBe('')
        expect(secondCues.value).toBe('Keep front knee over ankle')
      })
    })
  })

  describe('Removing Asanas with Alignment Cues', () => {
    it('should remove alignment cues when asana is deleted', async () => {
      const user = userEvent.setup()
      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={jest.fn()}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )

      const list = screen.getByRole('list', { name: 'Asana list' })
      const initialItems = within(list).getAllByRole('listitem')
      expect(initialItems).toHaveLength(3)

      // Delete the first asana
      const deleteButton = within(initialItems[0]).getByLabelText('Delete')
      await user.click(deleteButton)

      await waitFor(() => {
        const updatedItems = within(list).getAllByRole('listitem')
        expect(updatedItems).toHaveLength(2)

        // First asana should now be Downward Dog (empty cues)
        const firstCues = screen.getByTestId(
          'edit-alignment-cues-0'
        ) as HTMLInputElement
        expect(firstCues.value).toBe('')
      })
    })
  })

  describe('Saving with Alignment Cues', () => {
    it('should include alignment_cues in saved payload', async () => {
      const user = userEvent.setup()
      const onSave = jest.fn()

      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={onSave}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )

      // Modify an alignment cue
      const alignmentInput = screen.getByTestId('edit-alignment-cues-0')
      await user.clear(alignmentInput)
      await user.type(alignmentInput, 'Modified alignment cues')

      // Save changes
      const saveButton = screen.getByRole('button', { name: 'Save Changes' })
      await user.click(saveButton)

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(
          expect.objectContaining({
            asanas: expect.arrayContaining([
              expect.objectContaining({
                id: 'a1',
                name: 'Warrior I',
                alignment_cues: 'Modified alignment cues',
              }),
            ]),
          })
        )
      })
    })

    it('should save empty string for empty alignment cues', async () => {
      const user = userEvent.setup()
      const onSave = jest.fn()

      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={onSave}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )

      // Clear the first asana's alignment cues
      const alignmentInput = screen.getByTestId('edit-alignment-cues-0')
      await user.clear(alignmentInput)

      // Save changes
      const saveButton = screen.getByRole('button', { name: 'Save Changes' })
      await user.click(saveButton)

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(
          expect.objectContaining({
            asanas: expect.arrayContaining([
              expect.objectContaining({
                id: 'a1',
                name: 'Warrior I',
                alignment_cues: '',
              }),
            ]),
          })
        )
      })
    })

    it('should save all asanas with their respective alignment cues', async () => {
      const user = userEvent.setup()
      const onSave = jest.fn()

      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={onSave}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )

      // Modify multiple alignment cues
      const firstInput = screen.getByTestId('edit-alignment-cues-0')
      const secondInput = screen.getByTestId('edit-alignment-cues-1')
      const thirdInput = screen.getByTestId('edit-alignment-cues-2')

      await user.clear(firstInput)
      await user.type(firstInput, 'Updated first cue')

      await user.type(secondInput, 'Added second cue')

      await user.clear(thirdInput)
      await user.type(thirdInput, 'Updated third cue')

      // Save changes
      const saveButton = screen.getByRole('button', { name: 'Save Changes' })
      await user.click(saveButton)

      await waitFor(() => {
        const savedData = onSave.mock.calls[0][0]
        expect(savedData.asanas).toHaveLength(3)
        expect(savedData.asanas[0].alignment_cues).toBe('Updated first cue')
        expect(savedData.asanas[1].alignment_cues).toBe('Added second cue')
        expect(savedData.asanas[2].alignment_cues).toBe('Updated third cue')
      })
    })
  })

  describe('Adding New Asanas with Alignment Cues', () => {
    it('should initialize new asanas with empty alignment cues', async () => {
      const user = userEvent.setup()
      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={jest.fn()}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )

      // Open Add Asanas dialog
      const addButton = screen.getByRole('button', { name: 'Add Asanas' })
      await user.click(addButton)

      // Add a new asana
      const addTreeButton = screen.getByText('Add Tree Pose')
      await user.click(addTreeButton)

      // Check that new asana has alignment cues input with empty value
      await waitFor(() => {
        const newAsanaInput = screen.getByTestId(
          'edit-alignment-cues-3'
        ) as HTMLInputElement
        expect(newAsanaInput).toBeInTheDocument()
        expect(newAsanaInput.value).toBe('')
      })
    })

    it('should allow adding alignment cues to newly added asanas', async () => {
      const user = userEvent.setup()
      const onSave = jest.fn()

      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={onSave}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )

      // Add a new asana
      const addButton = screen.getByRole('button', { name: 'Add Asanas' })
      await user.click(addButton)

      const addTreeButton = screen.getByText('Add Tree Pose')
      await user.click(addTreeButton)

      // Add alignment cues to the new asana
      const newAsanaInput = await screen.findByTestId('edit-alignment-cues-3')
      await user.type(newAsanaInput, 'Focus on balance and grounding')

      // Save
      const saveButton = screen.getByRole('button', { name: 'Save Changes' })
      await user.click(saveButton)

      await waitFor(() => {
        const savedData = onSave.mock.calls[0][0]
        expect(savedData.asanas).toHaveLength(4)
        expect(savedData.asanas[3]).toMatchObject({
          id: 'new1',
          name: 'Tree Pose',
          alignment_cues: 'Focus on balance and grounding',
        })
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for alignment cues inputs', () => {
      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={jest.fn()}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )

      const alignmentInput = screen.getByTestId('edit-alignment-cues-0')
      expect(alignmentInput).toHaveAttribute('aria-label')
      expect(alignmentInput.getAttribute('aria-label')).toContain(
        'Alignment cues for'
      )
    })

    it('should support keyboard navigation between fields', async () => {
      const user = userEvent.setup()
      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={jest.fn()}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )

      const firstInput = screen.getByTestId('edit-alignment-cues-0')
      firstInput.focus()

      // Tab to next field
      await user.tab()

      // Document should have an active element (keyboard navigation works)
      expect(document.activeElement).toBeTruthy()
      expect(document.activeElement).not.toBe(firstInput)
    })
  })
})
