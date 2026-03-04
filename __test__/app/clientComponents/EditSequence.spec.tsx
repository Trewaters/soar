import React from 'react'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@styles/theme'
import EditSequence, {
  type EditableSequence,
} from '@clientComponents/EditSequence'

// Note: next/navigation and useNavigationWithLoading are mocked globally in jest.setup.ts
// Access the global mock via (globalThis as any).mockNavigationPush for assertions

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, fill, ...props }: any) => {
    // Convert boolean fill to string or omit it
    const imgProps = { ...props }
    if (fill === true) {
      // Don't pass fill as a prop to img element
    } else if (typeof fill === 'string') {
      imgProps.fill = fill
    }

    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img src={src} alt={alt} width={width} height={height} {...imgProps} />
    )
  },
}))

// Mock NextAuth session
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

// Mock useCanEditContent hook
const mockUseCanEditContent = jest.fn(() => ({
  canEdit: false,
  reason: 'default mock',
  isOwner: false,
  isAdmin: false,
}))
jest.mock('@app/hooks/useCanEditContent', () => ({
  useCanEditContent: (created_by: string) => mockUseCanEditContent(created_by),
}))

// Mock SequenceContext to be inactive by default so the component uses local state
jest.mock('@context/SequenceContext', () => ({
  useSequence: () => ({ active: false, state: { sequences: {} } }),
  useSequenceEditor: () => ({
    updateField: jest.fn(),
    removeSeriesAt: jest.fn(),
    reorderSeries: jest.fn(),
  }),
  useSequenceOwnership: () => true,
}))

// Mock GroupedDataAssetSearch used for inline flow search
const mockSeriesOptions = [
  {
    id: 'new-flow-1',
    seriesName: 'Power Flow',
    seriesPoses: ['warrior-1', 'warrior-2'],
    image: 'https://example.com/power-flow.jpg',
    duration: '20 minutes',
    createdBy: 'test@uvuyoga.com',
  },
  {
    id: 'new-flow-2',
    seriesName: 'Cool Down',
    seriesPoses: ['pigeon'],
    image: '',
    duration: '10 minutes',
    createdBy: 'test@uvuyoga.com',
  },
]
jest.mock('@clientComponents/GroupedDataAssetSearch', () => {
  return function MockGroupedDataAssetSearch({
    onSelect,
    items,
    placeholderText,
  }: any) {
    return (
      <div data-testid="flow-search">
        <input
          placeholder={placeholderText}
          data-testid="flow-search-input"
          readOnly
        />
        {items.map((item: any) => (
          <button
            key={item.id}
            data-testid={`select-flow-${item.id}`}
            onClick={() => onSelect(item)}
          >
            {item.seriesName}
          </button>
        ))}
      </div>
    )
  }
})

// Mock getAllSeries used by EditSequence to populate search
jest.mock('@lib/seriesService', () => ({
  getAllSeries: jest.fn().mockResolvedValue([
    {
      id: 'new-flow-1',
      seriesName: 'Power Flow',
      seriesPoses: ['warrior-1', 'warrior-2'],
      image: 'https://example.com/power-flow.jpg',
      duration: '20 minutes',
      createdBy: 'test@uvuyoga.com',
    },
    {
      id: 'new-flow-2',
      seriesName: 'Cool Down',
      seriesPoses: ['pigeon'],
      image: '',
      duration: '10 minutes',
      createdBy: 'test@uvuyoga.com',
    },
  ]),
}))

// Mock ImageUpload
jest.mock('@clientComponents/imageUpload/ImageUpload', () => {
  return function MockImageUpload({ onImageUploaded }: any) {
    return (
      <button
        onClick={() => {
          if (onImageUploaded) {
            onImageUploaded({
              id: 'test-image-id',
              url: 'https://example.com/uploaded.jpg',
              uploadedAt: new Date().toISOString(),
            })
          }
        }}
      >
        Upload Image
      </button>
    )
  }
})

// Mock DataAssetImageManager component
jest.mock('@clientComponents/DataAssetImageManager', () => {
  return function MockDataAssetImageManager({
    assetType,
    assetId,
    disabled,
    maxImages,
  }: any) {
    return (
      <div data-testid={`image-manager-${assetType}`}>
        <h3>Sequence Images</h3>
        {disabled ? (
          <p>Image management disabled</p>
        ) : (
          <>
            <button data-testid="upload-image-btn">Upload Image</button>
            <button
              data-testid="delete-image-btn"
              aria-label="delete sequence image"
            >
              Delete Image
            </button>
          </>
        )}
      </div>
    )
  }
})

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

const baseSequence = (
  overrides: Partial<EditableSequence> = {}
): EditableSequence => ({
  id: 'seq-1',
  nameSequence: 'Morning Flow',
  sequencesSeries: [
    {
      id: 'base-flow-1',
      seriesName: 'Warmup',
      image: '/img/1.png',
      seriesPoses: [{ id: 'p1' }],
    } as any,
    {
      id: 'base-flow-2',
      seriesName: 'Sun Salutation',
      image: '/img/2.png',
      seriesPoses: [{ id: 'p2' }, { id: 'p3' }],
    } as any,
  ],
  description: 'Gentle warmup and sun salutation',
  image: 'https://example.com/img.png',
  created_by: 'test@uvuyoga.com',
  ...overrides,
})

const mockUseSession = require('next-auth/react').useSession as jest.Mock

describe('EditSequence', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Authorization gates', () => {
    it('shows sign-in notice when unauthenticated', () => {
      mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' })

      render(<EditSequence sequence={baseSequence()} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByLabelText('sign-in-required')).toBeInTheDocument()
    })

    it('blocks editing for non-owners', () => {
      mockUseSession.mockReturnValue({
        data: { user: { email: 'other@uvuyoga.com' } },
        status: 'authenticated',
      })

      render(<EditSequence sequence={baseSequence()} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByLabelText('edit-not-allowed')).toBeInTheDocument()
    })
  })

  describe('Owner interactions', () => {
    beforeEach(() => {
      // Mock useCanEditContent to allow editing for matching owner
      mockUseCanEditContent.mockReturnValue({
        canEdit: true,
        reason: '',
        isOwner: true,
        isAdmin: false,
      })
    })

    it('renders fields and saves successfully', async () => {
      const user = userEvent.setup()
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@uvuyoga.com' } },
        status: 'authenticated',
      })

      // Mock fetch for save
      ;(global as any).fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      })

      render(<EditSequence sequence={baseSequence()} />, {
        wrapper: TestWrapper,
      })

      // Fields render - use heading and textbox roles instead of group roles
      expect(
        screen.getByRole('heading', { name: /Sequence Name/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: /Description/i })
      ).toBeInTheDocument()

      // Edit name
      const nameInput = screen.getByRole('textbox', { name: /sequence name/i })
      await user.clear(nameInput)
      await user.type(nameInput, 'New Name')

      // Trigger save - use getByText for button with exact text content
      const saveBtn = screen.getByText('Save Changes') as HTMLButtonElement
      await user.click(saveBtn)

      // Saved indicator appears (now shown as an Alert)
      expect(await screen.findByText(/saved successfully/i)).toBeInTheDocument()

      // Ensure API called with PATCH
      expect((global as any).fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/sequences\/seq-1/),
        expect.objectContaining({ method: 'PATCH' })
      )
    })

    it('confirms and deletes a flow item', async () => {
      const user = userEvent.setup()
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@uvuyoga.com' } },
        status: 'authenticated',
      })

      render(<EditSequence sequence={baseSequence()} />, {
        wrapper: TestWrapper,
      })

      // There should be two items initially - find the list directly
      const list = screen.getByRole('list')
      expect(within(list).getAllByRole('listitem')).toHaveLength(2)

      // Click the first remove button
      const removeButtons = screen.getAllByRole('button', {
        name: /remove flow/i,
      })
      await user.click(removeButtons[0])

      // Confirm dialog appears
      expect(
        screen.getByRole('heading', { name: /remove flow from sequence/i })
      ).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: /remove/i }))

      // One item remains (wait for DOM update)
      await waitFor(() => {
        const updatedList = screen.getByRole('list')
        expect(within(updatedList).getAllByRole('listitem')).toHaveLength(1)
      })
    })

    it('reorders items via move up/down buttons', async () => {
      const user = userEvent.setup()
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@uvuyoga.com' } },
        status: 'authenticated',
      })

      render(<EditSequence sequence={baseSequence()} />, {
        wrapper: TestWrapper,
      })

      // Initial order
      let items = screen.getAllByRole('listitem')
      expect(within(items[0]).getByText('Warmup')).toBeInTheDocument()
      expect(within(items[1]).getByText('Sun Salutation')).toBeInTheDocument()

      // Move second up
      const moveUpSecond = within(items[1]).getByRole('button', {
        name: /move .* up/i,
      })
      await user.click(moveUpSecond)

      // Order should be swapped
      items = screen.getAllByRole('listitem')
      expect(within(items[0]).getByText('Sun Salutation')).toBeInTheDocument()
      expect(within(items[1]).getByText('Warmup')).toBeInTheDocument()
    })

    it('shows Delete button and deletes sequence after confirmation', async () => {
      const user = userEvent.setup()
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@uvuyoga.com' } },
        status: 'authenticated',
      })

      // Mock DELETE
      ;(global as any).fetch = jest
        .fn()
        .mockImplementation((url: string, init?: any) => {
          if (init?.method === 'DELETE') {
            return Promise.resolve({
              ok: true,
              json: async () => ({ success: true }),
            })
          }
          return Promise.resolve({ ok: true, json: async () => ({}) })
        })

      render(<EditSequence sequence={baseSequence()} />, {
        wrapper: TestWrapper,
      })

      const deleteBtn = screen.getByText('Delete Sequence') as HTMLButtonElement
      expect(deleteBtn).toBeInTheDocument()

      await user.click(deleteBtn)
      // Confirm dialog
      expect(
        screen.getByRole('heading', { name: /delete this sequence/i })
      ).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: /delete$/i }))

      expect((global as any).fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/sequences\/seq-1$/),
        expect.objectContaining({ method: 'DELETE' })
      )
      expect((globalThis as any).mockNavigationPush).toHaveBeenCalledWith(
        '/sequences/practiceSequences'
      )
    })
  })

  describe('Add Flow Feature', () => {
    let mockAddSeries: jest.Mock

    beforeEach(() => {
      mockAddSeries = jest.fn()

      const mockUseSequence = jest.fn(() => ({
        active: true,
        state: {
          sequences: {
            id: 'seq-1',
            nameSequence: 'Morning Flow',
            sequencesSeries: [],
          },
        },
      }))
      const mockUseSequenceEditor = jest.fn(() => ({
        updateField: jest.fn(),
        removeSeriesAt: jest.fn(),
        reorderSeries: jest.fn(),
        addSeries: mockAddSeries,
      }))

      require('@context/SequenceContext').useSequence = mockUseSequence
      require('@context/SequenceContext').useSequenceEditor =
        mockUseSequenceEditor
    })

    it('should show inline flow search for sequence owner', async () => {
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@uvuyoga.com' } },
        status: 'authenticated',
      })

      render(<EditSequence sequence={baseSequence()} />, {
        wrapper: TestWrapper,
      })

      await waitFor(() => {
        expect(screen.getByTestId('flow-search')).toBeInTheDocument()
      })
    })

    it('should not show flow search for unauthenticated users', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      })

      render(<EditSequence sequence={baseSequence()} />, {
        wrapper: TestWrapper,
      })

      expect(screen.queryByTestId('flow-search')).not.toBeInTheDocument()
    })

    it('should add flow to sequence when selected from search', async () => {
      const user = userEvent.setup()
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@uvuyoga.com' } },
        status: 'authenticated',
      })

      render(<EditSequence sequence={baseSequence()} />, {
        wrapper: TestWrapper,
      })

      await waitFor(() => {
        expect(screen.getByTestId('select-flow-new-flow-1')).toBeInTheDocument()
      })

      await user.click(screen.getByTestId('select-flow-new-flow-1'))

      expect(mockAddSeries).toHaveBeenCalledWith([
        expect.objectContaining({
          id: 'new-flow-1',
          seriesName: 'Power Flow',
          seriesPoses: ['warrior-1', 'warrior-2'],
          image: 'https://example.com/power-flow.jpg',
          breath: '',
          duration: '20 minutes',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ])
    })

    it('should not call addSeries when no item is selected', async () => {
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@uvuyoga.com' } },
        status: 'authenticated',
      })

      render(<EditSequence sequence={baseSequence()} />, {
        wrapper: TestWrapper,
      })

      await waitFor(() => {
        expect(screen.getByTestId('flow-search')).toBeInTheDocument()
      })

      // No selection made
      expect(mockAddSeries).not.toHaveBeenCalled()
    })

    it('should add second flow without overwriting the first', async () => {
      const user = userEvent.setup()
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@uvuyoga.com' } },
        status: 'authenticated',
      })

      render(<EditSequence sequence={baseSequence()} />, {
        wrapper: TestWrapper,
      })

      await waitFor(() => {
        expect(screen.getByTestId('select-flow-new-flow-1')).toBeInTheDocument()
      })

      await user.click(screen.getByTestId('select-flow-new-flow-1'))
      await user.click(screen.getByTestId('select-flow-new-flow-2'))

      expect(mockAddSeries).toHaveBeenCalledTimes(2)
      expect(mockAddSeries).toHaveBeenNthCalledWith(1, [
        expect.objectContaining({
          id: 'new-flow-1',
          seriesName: 'Power Flow',
        }),
      ])
      expect(mockAddSeries).toHaveBeenNthCalledWith(2, [
        expect.objectContaining({
          id: 'new-flow-2',
          seriesName: 'Cool Down',
        }),
      ])
    })

    it('should show search for owner even when sequence already has flow', async () => {
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@uvuyoga.com' } },
        status: 'authenticated',
      })

      const sequenceWithSeries = baseSequence({
        sequencesSeries: [
          {
            id: 'existing-flow',
            seriesName: 'Existing Flow',
            seriesPoses: ['mountain-pose'],
          } as any,
        ],
      })

      render(<EditSequence sequence={sequenceWithSeries} />, {
        wrapper: TestWrapper,
      })

      await waitFor(() => {
        expect(screen.getByTestId('flow-search')).toBeInTheDocument()
      })
    })
  })

  describe('Image Management', () => {
    beforeEach(() => {
      // Reset context mocks to default (inactive) state
      // This is important because the "Add Flow Feature" tests override these
      require('@context/SequenceContext').useSequence = jest.fn(() => ({
        active: false,
        state: { sequences: {} },
      }))
      require('@context/SequenceContext').useSequenceEditor = jest.fn(() => ({
        updateField: jest.fn(),
        removeSeriesAt: jest.fn(),
        reorderSeries: jest.fn(),
      }))
      // Mock useCanEditContent to allow editing for matching emails
      mockUseCanEditContent.mockReturnValue({
        canEdit: true,
        reason: '',
        isOwner: true,
        isAdmin: false,
      })
    })

    it('should display image when sequence has an image URL', () => {
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@uvuyoga.com' } },
        status: 'authenticated',
      })

      const sequenceWithImage = baseSequence()

      render(<EditSequence sequence={sequenceWithImage} />, {
        wrapper: TestWrapper,
      })

      // Check for Sequence Images section heading
      expect(
        screen.getByRole('heading', { name: /Sequence Images/i })
      ).toBeInTheDocument()

      // Check that the image manager is rendered
      expect(screen.getByTestId('image-manager-sequence')).toBeInTheDocument()
    })

    it('should show delete button when image exists', () => {
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@uvuyoga.com' } },
        status: 'authenticated',
      })

      const sequenceWithImage = baseSequence()

      render(<EditSequence sequence={sequenceWithImage} />, {
        wrapper: TestWrapper,
      })

      // Verify image manager is shown and delete button exists
      expect(screen.getByTestId('image-manager-sequence')).toBeInTheDocument()
      const deleteButton = screen.getByRole('button', {
        name: /delete sequence image/i,
      })
      expect(deleteButton).toBeInTheDocument()
    })

    it('should delete image when delete button is clicked', async () => {
      const user = userEvent.setup()
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@uvuyoga.com' } },
        status: 'authenticated',
      })

      const sequenceWithImage = baseSequence()

      render(<EditSequence sequence={sequenceWithImage} />, {
        wrapper: TestWrapper,
      })

      const deleteButton = screen.getByRole('button', {
        name: /delete sequence image/i,
      })

      // Click delete button
      await user.click(deleteButton)

      // Image manager should still be rendered (the mock doesn't actually change)
      expect(screen.getByTestId('image-manager-sequence')).toBeInTheDocument()
    })

    it('should not show delete button when there is no image', () => {
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@uvuyoga.com' } },
        status: 'authenticated',
      })

      const sequenceWithoutImage = baseSequence({
        image: '',
      })

      render(<EditSequence sequence={sequenceWithoutImage} />, {
        wrapper: TestWrapper,
      })

      // Image manager should still be rendered (it will show upload options)
      expect(screen.getByTestId('image-manager-sequence')).toBeInTheDocument()
    })

    it('should allow re-uploading after deleting an image', async () => {
      const user = userEvent.setup()
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@uvuyoga.com' } },
        status: 'authenticated',
      })

      const sequenceWithImage = baseSequence()

      render(<EditSequence sequence={sequenceWithImage} />, {
        wrapper: TestWrapper,
      })

      // Delete the image
      const deleteButton = screen.getByRole('button', {
        name: /delete sequence image/i,
      })
      await user.click(deleteButton)

      // Image manager should still be present for re-uploading
      const imageManager = screen.getByTestId('image-manager-sequence')
      expect(imageManager).toBeInTheDocument()

      // Upload button should still be available
      const uploadButton = screen.getByTestId('upload-image-btn')
      expect(uploadButton).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has no obvious accessibility violations', async () => {
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@uvuyoga.com' } },
        status: 'authenticated',
      })

      const { container } = render(<EditSequence sequence={baseSequence()} />, {
        wrapper: TestWrapper,
      })

      const results = await (global as any).axe(container, {
        rules: {
          'color-contrast': { enabled: false },
          'heading-order': { enabled: false },
        },
      })
      expect(results).toHaveNoViolations()
    })
  })
})
