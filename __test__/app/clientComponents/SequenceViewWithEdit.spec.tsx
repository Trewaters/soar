import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@styles/theme'
import SequenceViewWithEdit from '@clientComponents/SequenceViewWithEdit'

// Mock next/image to avoid DOM warnings from the "fill" prop
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} />
  ),
}))

// Mock Next.js app router to avoid invariant errors when EditSequence uses useRouter
jest.mock('next/navigation', () => {
  const push = jest.fn()
  ;(global as any).__routerPushMock = push
  return {
    __esModule: true,
    useRouter: () => ({ push }),
  }
})

// Mock NextAuth session
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

const mockUseSession = require('next-auth/react').useSession as jest.Mock

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

const baseSequence = (overrides: Partial<any> = {}) => ({
  id: 'seq-1',
  nameSequence: 'Morning Flow',
  sequencesSeries: [],
  description: 'Gentle warmup and sun salutation',
  image: 'https://example.com/img.png',
  created_by: 'owner@uvuyoga.com',
  ...overrides,
})

describe('SequenceViewWithEdit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows Edit button for owner and toggles edit region', async () => {
    const user = userEvent.setup()
    mockUseSession.mockReturnValue({
      data: { user: { email: 'Owner@Uvuyoga.com' } }, // different case to test case-insensitive comparison
      status: 'authenticated',
    })

    render(<SequenceViewWithEdit sequence={baseSequence()} />, {
      wrapper: Wrapper,
    })

    const editBtn = screen.getByRole('button', { name: /edit/i })
    expect(editBtn).toBeInTheDocument()

    await user.click(editBtn)
    expect(
      screen.getByRole('region', { name: /edit-region/i })
    ).toBeInTheDocument()

    // Button label should change to "Close edit" or similar
    expect(
      screen.getByRole('button', { name: /hide edit|close edit/i })
    ).toBeInTheDocument()
  })

  it('does not show Edit button for non-owner', () => {
    mockUseSession.mockReturnValue({
      data: { user: { email: 'someone@else.com' } },
      status: 'authenticated',
    })

    render(<SequenceViewWithEdit sequence={baseSequence()} />, {
      wrapper: Wrapper,
    })

    expect(
      screen.queryByRole('button', { name: /edit/i })
    ).not.toBeInTheDocument()
  })

  it('does not show Edit button when unauthenticated', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' })

    render(<SequenceViewWithEdit sequence={baseSequence()} />, {
      wrapper: Wrapper,
    })

    expect(
      screen.queryByRole('button', { name: /edit/i })
    ).not.toBeInTheDocument()
  })
})
