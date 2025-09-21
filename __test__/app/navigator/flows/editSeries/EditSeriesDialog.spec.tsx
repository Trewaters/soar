import React from 'react'
import { render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import EditSeriesDialog, {
  Series,
  Asana,
} from '@app/navigator/flows/editSeries/EditSeriesDialog'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useSession } from 'next-auth/react'

expect.extend(toHaveNoViolations)

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
jest.mock('@/app/context/AsanaPostureContext', () => ({
  AsanaPostureProvider: ({ children }: any) => <>{children}</>,
}))
jest.mock('@/app/context/AsanaSeriesContext', () => ({
  FlowSeriesProvider: ({ children }: any) => <>{children}</>,
}))

// useSession is imported and mocked; use useSession.mockReturnValue directly in tests

const theme = createTheme()
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

const baseAsanas: Asana[] = [
  { id: 'a1', name: 'Warrior I', difficulty: 'beginner' },
  { id: 'a2', name: 'Downward Dog', difficulty: 'beginner' },
  { id: 'a3', name: "Child's Pose", difficulty: 'beginner' },
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

describe('EditSeriesDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Permission enforcement', () => {
    it('should show Unauthorized when non-owner tries to open', () => {
      ;(useSession as jest.Mock).mockReturnValue({
        data: { user: { email: 'guest@yoga.com' } },
        status: 'authenticated',
      })
      const onSave = jest.fn()
      const onDelete = jest.fn()
      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={onSave}
          onDelete={onDelete}
        />,
        { wrapper: Wrapper }
      )
      expect(screen.getByText('Unauthorized')).toBeInTheDocument()
      expect(screen.queryByLabelText('Series Name *')).not.toBeInTheDocument()
    })
  })

  describe('Rendering and editing', () => {
    it('should render fields and list for owner', () => {
      ;(useSession as jest.Mock).mockReturnValue({
        data: { user: { email: 'owner@yoga.com' } },
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
      expect(screen.getByRole('dialog', { name: 'Edit Series' })).toBeTruthy()
      expect(screen.getByLabelText(/Series Name \*/i)).toHaveValue(
        'Morning Flow'
      )
      expect(screen.getByLabelText('Description')).toHaveValue(
        'Gentle warm-up flow'
      )
      expect(screen.getByLabelText('Difficulty')).toBeInTheDocument()
      expect(screen.getByLabelText('Created By')).toHaveValue('owner@yoga.com')
      const list = screen.getByRole('list', { name: 'Asana list' })
      expect(within(list).getAllByRole('listitem')).toHaveLength(3)
    })

    it('should validate required fields and prevent save', async () => {
      ;(useSession as jest.Mock).mockReturnValue({
        data: { user: { email: 'owner@yoga.com' } },
        status: 'authenticated',
      })
      const user = userEvent.setup()
      const onSave = jest.fn()
      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries({ name: '' })}
          onSave={onSave}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )
      await user.click(screen.getByRole('button', { name: 'Save Changes' }))
      expect(screen.getByText('Name is required.')).toBeInTheDocument()
      expect(onSave).not.toHaveBeenCalled()
    })

    it('should allow name edit and save', async () => {
      ;(useSession as jest.Mock).mockReturnValue({
        data: { user: { email: 'owner@yoga.com' } },
        status: 'authenticated',
      })
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
      const nameField = screen.getByLabelText(/Series Name \*/i)
      await user.clear(nameField)
      await user.type(nameField, 'Sunrise Flow')
      await user.click(screen.getByRole('button', { name: 'Save Changes' }))
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Sunrise Flow' })
      )
    })

    it('should remove an asana via trash icon', async () => {
      ;(useSession as jest.Mock).mockReturnValue({
        data: { user: { email: 'owner@yoga.com' } },
        status: 'authenticated',
      })
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
      expect(within(list).getAllByRole('listitem')).toHaveLength(3)
      const removeButtons = screen.getAllByRole('button', {
        name: /Remove /i,
      })
      await user.click(removeButtons[0])
      expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    })

    it('should reorder asanas using up/down buttons', async () => {
      ;(useSession as jest.Mock).mockReturnValue({
        data: { user: { email: 'owner@yoga.com' } },
        status: 'authenticated',
      })
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
      const itemsBefore = within(list).getAllByRole('listitem')
      expect(itemsBefore[0]).toHaveTextContent('Warrior I')
      const moveDownBtns = screen.getAllByRole('button', {
        name: /Move .* down/i,
      })
      await user.click(moveDownBtns[0])
      const itemsAfter = within(list).getAllByRole('listitem')
      expect(itemsAfter[1]).toHaveTextContent('Warrior I')
    })
  })

  describe('Deletion confirmation', () => {
    it('should confirm before deleting a series', async () => {
      ;(useSession as jest.Mock).mockReturnValue({
        data: { user: { email: 'owner@yoga.com' } },
        status: 'authenticated',
      })
      const user = userEvent.setup()
      const onDelete = jest.fn()
      render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={jest.fn()}
          onDelete={onDelete}
        />,
        { wrapper: Wrapper }
      )
      await user.click(screen.getByRole('button', { name: 'Delete Series' }))
      expect(
        screen.getByRole('dialog', { name: 'Confirm Deletion' })
      ).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Delete' }))
      expect(onDelete).toHaveBeenCalledWith('s1')
    })
  })

  describe('Accessibility', () => {
    it('has no obvious a11y violations', async () => {
      ;(useSession as jest.Mock).mockReturnValue({
        data: { user: { email: 'owner@yoga.com' } },
        status: 'authenticated',
      })
      const { container } = render(
        <EditSeriesDialog
          open
          onClose={jest.fn()}
          series={makeSeries()}
          onSave={jest.fn()}
          onDelete={jest.fn()}
        />,
        { wrapper: Wrapper }
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})

// Note: Drag-and-drop reordering tests are deferred until a DnD library is integrated.
// Current implementation uses explicit up/down buttons which are covered above.
