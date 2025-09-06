import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@styles/theme'
import EditSequence, {
  type EditableSequence,
} from '@clientComponents/EditSequence'

// Standard Soar test mocks
jest.mock('next/navigation', () => {
  const push = jest.fn()
  ;(global as any).__routerPushMock = push
  return {
    __esModule: true,
    useRouter: () => ({ push }),
  }
})
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
      seriesName: 'Warmup',
      image: '/img/1.png',
      seriesPostures: [{ id: 'p1' }],
    } as any,
    {
      seriesName: 'Sun Salutation',
      image: '/img/2.png',
      seriesPostures: [{ id: 'p2' }, { id: 'p3' }],
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

      // Fields render
      expect(
        screen.getByRole('group', { name: /sequence-name/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('group', { name: /sequence-owner/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('group', { name: /sequence-description/i })
      ).toBeInTheDocument()

      // Edit name
      const nameInput = screen.getByLabelText(/sequence name/i)
      await user.clear(nameInput)
      await user.type(nameInput, 'New Name')

      // Trigger save
      const saveBtn = screen.getByRole('button', { name: /save changes/i })
      await user.click(saveBtn)

      // Saved indicator appears
      expect(await screen.findByText(/saved/i)).toBeInTheDocument()

      // Ensure API called with PATCH
      expect((global as any).fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/sequences\/seq-1/),
        expect.objectContaining({ method: 'PATCH' })
      )
    })

    it('confirms and deletes a flow series item', async () => {
      const user = userEvent.setup()
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@uvuyoga.com' } },
        status: 'authenticated',
      })

      render(<EditSequence sequence={baseSequence()} />, {
        wrapper: TestWrapper,
      })

      // There should be two items initially
      const group = screen.getByRole('group', {
        name: /sequence-flow-series/i,
      })
      const list = within(group).getByRole('list')
      expect(within(list).getAllByRole('listitem')).toHaveLength(2)

      // Click the first remove button
      const removeButtons = screen.getAllByRole('button', {
        name: /remove series/i,
      })
      await user.click(removeButtons[0])

      // Confirm dialog appears
      expect(
        screen.getByRole('heading', { name: /remove series from sequence/i })
      ).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: /remove/i }))

      // One item remains (wait for DOM update)
      await screen.findByRole('group', { name: /sequence-flow-series/i })
      await new Promise((r) => setTimeout(r, 0))
      expect(within(list).getAllByRole('listitem')).toHaveLength(1)
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

      const deleteBtn = screen.getByRole('button', { name: /delete sequence/i })
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
      expect((global as any).__routerPushMock).toHaveBeenCalledWith(
        '/sequences'
      )
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
