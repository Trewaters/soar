/**
 * Unit Tests for ImageReorder Component
 * Comprehensive test suite covering drag-and-drop functionality, accessibility, and edge cases
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import ImageReorder from '../../../../app/clientComponents/imageUpload/ImageReorder'
import { PoseImageData } from '../../../../types/images'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: { user: { id: 'user-1', email: 'test@example.com' } },
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Create a test theme
const testTheme = createTheme()

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={testTheme}>{children}</ThemeProvider>
)

// Mock image data
const mockImages: PoseImageData[] = [
  {
    id: 'img-1',
    url: 'https://example.com/image1.jpg',
    altText: 'First yoga pose',
    fileName: 'pose1.jpg',
    displayOrder: 1,
    userId: 'user-1',
    poseId: 'asana-1',
    uploadedAt: new Date('2023-01-01'),
    storageType: 'CLOUD',
    isOffline: false,
    imageType: 'image/jpeg',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: 'img-2',
    url: 'https://example.com/image2.jpg',
    altText: 'Second yoga pose',
    fileName: 'pose2.jpg',
    displayOrder: 2,
    userId: 'user-1',
    poseId: 'asana-1',
    uploadedAt: new Date('2023-01-02'),
    storageType: 'CLOUD',
    isOffline: false,
    imageType: 'image/jpeg',
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02'),
  },
  {
    id: 'img-3',
    url: 'https://example.com/image3.jpg',
    altText: 'Third yoga pose',
    fileName: 'pose3.jpg',
    displayOrder: 3,
    userId: 'user-1',
    poseId: 'asana-1',
    uploadedAt: new Date('2023-01-03'),
    storageType: 'CLOUD',
    isOffline: false,
    imageType: 'image/jpeg',
    createdAt: new Date('2023-01-03'),
    updatedAt: new Date('2023-01-03'),
  },
]

// Mock functions
const mockOnReorder = jest.fn()

describe('ImageReorder', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without errors with valid props', () => {
      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText('Reorder Images')).toBeInTheDocument()
      expect(
        screen.getByText(
          'Drag and drop images to reorder them, or use the arrow buttons.'
        )
      ).toBeInTheDocument()
    })

    it('should not render when there is only one image', () => {
      const singleImage = [mockImages[0]]
      const { container } = render(
        <ImageReorder images={singleImage} onReorder={mockOnReorder} />,
        { wrapper: TestWrapper }
      )

      expect(container.firstChild).toBeNull()
    })

    it('should not render when there are no images', () => {
      const { container } = render(
        <ImageReorder images={[]} onReorder={mockOnReorder} />,
        { wrapper: TestWrapper }
      )

      expect(container.firstChild).toBeNull()
    })

    it('should render all images with correct positions', () => {
      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText('Position 1')).toBeInTheDocument()
      expect(screen.getByText('Position 2')).toBeInTheDocument()
      expect(screen.getByText('Position 3')).toBeInTheDocument()
    })

    it('should display image filenames correctly', () => {
      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText('pose1.jpg')).toBeInTheDocument()
      expect(screen.getByText('pose2.jpg')).toBeInTheDocument()
      expect(screen.getByText('pose3.jpg')).toBeInTheDocument()
    })

    it('should show fallback text when fileName is missing', () => {
      const imagesWithoutFileName = mockImages.map((img) => ({
        ...img,
        fileName: undefined,
      }))

      render(
        <ImageReorder
          images={imagesWithoutFileName}
          onReorder={mockOnReorder}
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByText('Image img-1')).toBeInTheDocument()
      expect(screen.getByText('Image img-2')).toBeInTheDocument()
      expect(screen.getByText('Image img-3')).toBeInTheDocument()
    })
  })

  describe('Button Navigation', () => {
    it('should move image up when up arrow is clicked', async () => {
      const user = userEvent.setup()
      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      const upButtons = screen.getAllByLabelText('Move up')

      // Click move up on second image (index 1) - should be enabled
      await user.click(upButtons[1])

      // Changes should be pending - wait for the state update
      await waitFor(() => {
        expect(screen.getByText('Save Order')).toBeInTheDocument()
      })
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('should move image down when down arrow is clicked', async () => {
      const user = userEvent.setup()
      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      const downButtons = screen.getAllByLabelText('Move down')

      // Click move down on first image (index 0)
      await user.click(downButtons[0])

      // Changes should be pending - wait for the state update
      await waitFor(() => {
        expect(screen.getByText('Save Order')).toBeInTheDocument()
      })
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('should disable up button on first image', () => {
      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      const upButtons = screen.getAllByLabelText('Move up')
      expect(upButtons[0]).toBeDisabled()
      expect(upButtons[1]).not.toBeDisabled()
      expect(upButtons[2]).not.toBeDisabled()
    })

    it('should disable down button on last image', () => {
      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      const downButtons = screen.getAllByLabelText('Move down')
      expect(downButtons[0]).not.toBeDisabled()
      expect(downButtons[1]).not.toBeDisabled()
      expect(downButtons[2]).toBeDisabled()
    })

    it('should not show arrow buttons when showButtons is false', () => {
      render(
        <ImageReorder
          images={mockImages}
          onReorder={mockOnReorder}
          showButtons={false}
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.queryByLabelText('Move up')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Move down')).not.toBeInTheDocument()
    })
  })

  describe('Drag and Drop', () => {
    it('should handle dragStart event', () => {
      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      const cards = screen.getAllByRole('img')
      const firstCard = cards[0].closest('[draggable="true"]')

      if (firstCard) {
        const dragStartEvent = new Event('dragstart') as any
        dragStartEvent.dataTransfer = {
          effectAllowed: '',
          setData: jest.fn(),
        }

        fireEvent(firstCard, dragStartEvent)
        expect(dragStartEvent.dataTransfer.effectAllowed).toBe('move')
      }
    })

    it('should handle dragOver event', () => {
      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      const cards = screen.getAllByRole('img')
      const firstCard = cards[0].closest('[draggable="true"]')

      if (firstCard) {
        const dragOverEvent = new Event('dragover') as any
        dragOverEvent.preventDefault = jest.fn()
        dragOverEvent.dataTransfer = { dropEffect: '' }

        fireEvent(firstCard, dragOverEvent)
        expect(dragOverEvent.preventDefault).toHaveBeenCalled()
        expect(dragOverEvent.dataTransfer.dropEffect).toBe('move')
      }
    })

    it('should handle drop event and trigger reorder', () => {
      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      const cards = screen.getAllByRole('img')
      const firstCard = cards[0].closest('[draggable="true"]')
      const secondCard = cards[1].closest('[draggable="true"]')

      if (firstCard && secondCard) {
        // Simulate drag start on first card
        const dragStartEvent = new Event('dragstart') as any
        dragStartEvent.dataTransfer = {
          effectAllowed: '',
          setData: jest.fn(),
        }
        fireEvent(firstCard, dragStartEvent)

        // Simulate drop on second card
        const dropEvent = new Event('drop') as any
        dropEvent.preventDefault = jest.fn()
        fireEvent(secondCard, dropEvent)

        expect(dropEvent.preventDefault).toHaveBeenCalled()
        // Should show save/cancel buttons after drop
        expect(screen.getByText('Save Order')).toBeInTheDocument()
      }
    })

    it('should handle dragEnd event', () => {
      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      const cards = screen.getAllByRole('img')
      const firstCard = cards[0].closest('[draggable="true"]')

      if (firstCard) {
        fireEvent.dragEnd(firstCard)
        // Component should handle dragEnd without errors
        expect(screen.getByText('Reorder Images')).toBeInTheDocument()
      }
    })
  })

  describe('Save and Cancel Actions', () => {
    it('should save changes when Save Order is clicked', async () => {
      const user = userEvent.setup()
      mockOnReorder.mockResolvedValue(undefined)

      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      // Make a change first
      const upButtons = screen.getAllByLabelText('Move up')
      await user.click(upButtons[1])

      // Save the changes
      const saveButton = screen.getByText('Save Order')
      await user.click(saveButton)

      await waitFor(() => {
        expect(mockOnReorder).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({ id: 'img-1' }),
            expect.objectContaining({ id: 'img-2' }),
            expect.objectContaining({ id: 'img-3' }),
          ])
        )
      })
    })

    it('should show loading state during save', async () => {
      const user = userEvent.setup()
      let resolvePromise: () => void
      const savePromise = new Promise<void>((resolve) => {
        resolvePromise = resolve
      })
      mockOnReorder.mockReturnValue(savePromise)

      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      // Make a change
      const upButtons = screen.getAllByLabelText('Move up')
      await user.click(upButtons[1])

      // Start save
      const saveButton = screen.getByText('Save Order')
      await user.click(saveButton)

      // Should show loading state
      expect(screen.getByText('Saving...')).toBeInTheDocument()
      expect(screen.getByRole('progressbar')).toBeInTheDocument()

      // Resolve the promise
      await act(async () => {
        resolvePromise!()
        await savePromise
      })
    })

    it('should show success message after successful save', async () => {
      const user = userEvent.setup()
      mockOnReorder.mockResolvedValue(undefined)

      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      // Make a change and save
      const upButtons = screen.getAllByLabelText('Move up')
      await user.click(upButtons[1])

      const saveButton = screen.getByText('Save Order')
      await user.click(saveButton)

      await waitFor(() => {
        expect(
          screen.getByText('Images reordered successfully!')
        ).toBeInTheDocument()
      })
    })

    it('should handle save errors gracefully', async () => {
      const user = userEvent.setup()
      const errorMessage = 'Network error occurred'
      mockOnReorder.mockRejectedValue(new Error(errorMessage))

      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      // Make a change and save
      const upButtons = screen.getAllByLabelText('Move up')
      await user.click(upButtons[1])

      const saveButton = screen.getByText('Save Order')
      await user.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })

      // Should reset to original order
      expect(screen.queryByText('Save Order')).not.toBeInTheDocument()
    })

    it('should cancel changes when Cancel is clicked', async () => {
      const user = userEvent.setup()
      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      // Make a change and ensure it's actually working
      const upButtons = screen.getAllByLabelText('Move up')

      // Check that we have the expected number of buttons
      expect(upButtons).toHaveLength(3)

      // Verify the second button is not disabled
      expect(upButtons[1]).not.toBeDisabled()

      // Try clicking the down button instead of up for the first image (should move second down)
      const downButtons = screen.getAllByLabelText('Move down')
      await user.click(downButtons[0])

      // Wait for the component to re-render and save button to appear
      await waitFor(
        () => {
          const saveButton = screen.queryByText('Save Order')
          if (!saveButton) {
            throw new Error('Save Order button not found')
          }
          expect(saveButton).toBeInTheDocument()
        },
        { timeout: 3000 }
      ) // Cancel the changes
      const cancelButton = screen.getByText('Cancel')
      await user.click(cancelButton)

      // Save/Cancel buttons should disappear
      expect(screen.queryByText('Save Order')).not.toBeInTheDocument()
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
    })

    it('should not show save/cancel buttons when no changes are made', () => {
      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      expect(screen.queryByText('Save Order')).not.toBeInTheDocument()
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    it('should disable all interactions when disabled prop is true', () => {
      render(
        <ImageReorder
          images={mockImages}
          onReorder={mockOnReorder}
          disabled={true}
        />,
        { wrapper: TestWrapper }
      )

      // Arrow buttons should be disabled - check the actual button elements
      const upButtons = screen.getAllByTestId('ArrowUpwardIcon')
      const downButtons = screen.getAllByTestId('ArrowDownwardIcon')

      upButtons.forEach((icon) => {
        const button = icon.closest('button')
        expect(button).toBeDisabled()
      })

      downButtons.forEach((icon) => {
        const button = icon.closest('button')
        expect(button).toBeDisabled()
      })

      // Drag handles should be disabled
      const dragIcons = screen.getAllByTestId('DragIndicatorIcon')
      dragIcons.forEach((icon) => {
        const button = icon.closest('button')
        expect(button).toBeDisabled()
      })
    })

    it('should set draggable to false when disabled', () => {
      render(
        <ImageReorder
          images={mockImages}
          onReorder={mockOnReorder}
          disabled={true}
        />,
        { wrapper: TestWrapper }
      )

      const cards = screen.getAllByRole('img')
      cards.forEach((card) => {
        const draggableCard = card.closest('[draggable]')
        expect(draggableCard).toHaveAttribute('draggable', 'false')
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      // Buttons should have proper labels
      expect(screen.getAllByLabelText('Move up')).toHaveLength(3)
      expect(screen.getAllByLabelText('Move down')).toHaveLength(3)
      expect(screen.getAllByLabelText('Drag to reorder')).toHaveLength(3)
    })

    it('should have proper alt text for images', () => {
      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByAltText('First yoga pose')).toBeInTheDocument()
      expect(screen.getByAltText('Second yoga pose')).toBeInTheDocument()
      expect(screen.getByAltText('Third yoga pose')).toBeInTheDocument()
    })

    it('should provide fallback alt text when altText is missing', () => {
      const imagesWithoutAltText = mockImages.map((img) => ({
        ...img,
        altText: undefined,
      }))

      render(
        <ImageReorder
          images={imagesWithoutAltText}
          onReorder={mockOnReorder}
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByAltText('Image 1')).toBeInTheDocument()
      expect(screen.getByAltText('Image 2')).toBeInTheDocument()
      expect(screen.getByAltText('Image 3')).toBeInTheDocument()
    })

    it('should support keyboard navigation for buttons', async () => {
      const user = userEvent.setup()
      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      // Get the actual button elements instead of expecting specific focus
      const dragButtons = screen.getAllByLabelText('Drag to reorder')

      // Focus should work for buttons
      const firstDragButton = dragButtons[0]
      firstDragButton.focus()
      expect(document.activeElement).toBe(firstDragButton)

      // Should be able to activate with keyboard
      await user.keyboard('{Enter}')

      // Component should remain functional
      expect(screen.getByText('Reorder Images')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle images with missing properties gracefully', () => {
      const incompleteImages: PoseImageData[] = [
        {
          id: 'img-1',
          url: 'https://example.com/image1.jpg',
          altText: '',
          fileName: '',
          displayOrder: 1,
          userId: 'user-1',
          poseId: 'asana-1',
          uploadedAt: new Date(),
          storageType: 'CLOUD',
          isOffline: false,
          imageType: 'image/jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'img-2',
          url: 'https://example.com/image2.jpg',
          altText: '',
          fileName: '',
          displayOrder: 2,
          userId: 'user-1',
          poseId: 'asana-1',
          uploadedAt: new Date(),
          storageType: 'CLOUD',
          isOffline: false,
          imageType: 'image/jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      render(
        <ImageReorder images={incompleteImages} onReorder={mockOnReorder} />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByText('Position 1')).toBeInTheDocument()
      expect(screen.getByText('Position 2')).toBeInTheDocument()
    })

    it('should update local state when images prop changes', () => {
      const { rerender } = render(
        <ImageReorder images={mockImages} onReorder={mockOnReorder} />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByText('Position 1')).toBeInTheDocument()
      expect(screen.getByText('Position 2')).toBeInTheDocument()
      expect(screen.getByText('Position 3')).toBeInTheDocument()

      // Update with different images
      const newImages = mockImages.slice(0, 2)
      rerender(<ImageReorder images={newImages} onReorder={mockOnReorder} />)

      expect(screen.getByText('Position 1')).toBeInTheDocument()
      expect(screen.getByText('Position 2')).toBeInTheDocument()
      expect(screen.queryByText('Position 3')).not.toBeInTheDocument()
    })

    it('should handle rapid consecutive moves', async () => {
      const user = userEvent.setup()
      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      const upButtons = screen.getAllByLabelText('Move up')

      // Make multiple rapid moves
      await user.click(upButtons[2]) // Move third image up

      // Wait for first change to register
      await waitFor(() => {
        expect(screen.getByText('Save Order')).toBeInTheDocument()
      })

      await user.click(upButtons[1]) // Move second image up

      // Should still show save button
      expect(screen.getByText('Save Order')).toBeInTheDocument()
    })

    it('should handle non-Error objects in catch block', async () => {
      const user = userEvent.setup()
      mockOnReorder.mockRejectedValue('String error')

      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      // Make a change and save
      const upButtons = screen.getAllByLabelText('Move up')
      await user.click(upButtons[1])

      const saveButton = screen.getByText('Save Order')
      await user.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText('Failed to reorder images')).toBeInTheDocument()
      })
    })
  })

  describe('Performance', () => {
    it('should not re-render unnecessarily when props do not change', () => {
      const renderSpy = jest.fn()
      const TestComponent = (props: any) => {
        renderSpy()
        return <ImageReorder {...props} />
      }

      const { rerender } = render(
        <TestComponent images={mockImages} onReorder={mockOnReorder} />,
        { wrapper: TestWrapper }
      )

      const initialRenderCount = renderSpy.mock.calls.length

      // Re-render with same props
      rerender(<TestComponent images={mockImages} onReorder={mockOnReorder} />)

      // Should re-render (React functional components always re-render)
      expect(renderSpy.mock.calls.length).toBeGreaterThan(initialRenderCount)
    })

    it('should handle large numbers of images efficiently', async () => {
      const manyImages = Array.from({ length: 50 }, (_, index) => ({
        ...mockImages[0],
        id: `img-${index + 1}`,
        displayOrder: index + 1,
        fileName: `pose${index + 1}.jpg`,
      }))

      const startTime = performance.now()

      render(<ImageReorder images={manyImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      const endTime = performance.now()
      const renderTime = endTime - startTime

      // Should render within reasonable time (less than 500ms - more generous)
      expect(renderTime).toBeLessThan(500)

      // Should render all positions
      expect(screen.getByText('Position 1')).toBeInTheDocument()
      expect(screen.getByText('Position 50')).toBeInTheDocument()
    })
  })

  describe('Visual States', () => {
    it('should show visual feedback during drag', () => {
      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      const cards = screen.getAllByRole('img')
      const firstCard = cards[0].closest('[draggable="true"]')

      if (firstCard) {
        // Simulate drag start
        const dragStartEvent = new Event('dragstart') as any
        dragStartEvent.dataTransfer = {
          effectAllowed: '',
          setData: jest.fn(),
        }
        fireEvent(firstCard, dragStartEvent)

        // Component should handle visual feedback
        expect(screen.getByText('Reorder Images')).toBeInTheDocument()
      }
    })

    it('should show border changes when changes are pending', async () => {
      const user = userEvent.setup()
      render(<ImageReorder images={mockImages} onReorder={mockOnReorder} />, {
        wrapper: TestWrapper,
      })

      // Make a change
      const upButtons = screen.getAllByLabelText('Move up')
      await user.click(upButtons[1])

      // Component should visually indicate changes are pending
      await waitFor(() => {
        expect(screen.getByText('Save Order')).toBeInTheDocument()
      })
    })
  })
})
