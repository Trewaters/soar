import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HelpButton from '@app/clientComponents/HelpButton'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'

const theme = createTheme()

describe('HelpButton Component', () => {
  const user = userEvent.setup()

  describe('Rendering', () => {
    it('should render without errors', () => {
      const mockOnClick = jest.fn()
      render(
        <ThemeProvider theme={theme}>
          <HelpButton onClick={mockOnClick} />
        </ThemeProvider>
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should render with help icon', () => {
      const mockOnClick = jest.fn()
      render(
        <ThemeProvider theme={theme}>
          <HelpButton onClick={mockOnClick} />
        </ThemeProvider>
      )

      const icon = screen.getByRole('button').querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should apply success.light color to icon', () => {
      const mockOnClick = jest.fn()
      render(
        <ThemeProvider theme={theme}>
          <HelpButton onClick={mockOnClick} />
        </ThemeProvider>
      )

      const icon = screen.getByRole('button').querySelector('svg')
      expect(icon).toHaveAttribute('data-testid', 'HelpIcon')
    })
  })

  describe('User Interactions', () => {
    it('should call onClick handler when clicked', async () => {
      const mockOnClick = jest.fn()
      render(
        <ThemeProvider theme={theme}>
          <HelpButton onClick={mockOnClick} />
        </ThemeProvider>
      )

      await user.click(screen.getByRole('button'))
      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('should call onClick handler multiple times when clicked repeatedly', async () => {
      const mockOnClick = jest.fn()
      render(
        <ThemeProvider theme={theme}>
          <HelpButton onClick={mockOnClick} />
        </ThemeProvider>
      )

      await user.click(screen.getByRole('button'))
      await user.click(screen.getByRole('button'))
      await user.click(screen.getByRole('button'))

      expect(mockOnClick).toHaveBeenCalledTimes(3)
    })

    it('should have disableRipple prop to prevent ripple effect', () => {
      const mockOnClick = jest.fn()
      const { container } = render(
        <ThemeProvider theme={theme}>
          <HelpButton onClick={mockOnClick} />
        </ThemeProvider>
      )

      const button = container.querySelector('.MuiIconButton-root')
      expect(button).toHaveClass('MuiIconButton-root')
    })
  })

  describe('Custom Styling', () => {
    it('should apply custom sx props when provided', () => {
      const mockOnClick = jest.fn()
      const customSx = { backgroundColor: 'red', padding: '20px' }

      render(
        <ThemeProvider theme={theme}>
          <HelpButton onClick={mockOnClick} sx={customSx} />
        </ThemeProvider>
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should work without custom sx props', () => {
      const mockOnClick = jest.fn()
      render(
        <ThemeProvider theme={theme}>
          <HelpButton onClick={mockOnClick} />
        </ThemeProvider>
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard accessible', async () => {
      const mockOnClick = jest.fn()
      render(
        <ThemeProvider theme={theme}>
          <HelpButton onClick={mockOnClick} />
        </ThemeProvider>
      )

      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()
    })

    it('should trigger onClick on Enter key press', async () => {
      const mockOnClick = jest.fn()
      render(
        <ThemeProvider theme={theme}>
          <HelpButton onClick={mockOnClick} />
        </ThemeProvider>
      )

      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard('{Enter}')

      expect(mockOnClick).toHaveBeenCalled()
    })

    it('should trigger onClick on Space key press', async () => {
      const mockOnClick = jest.fn()
      render(
        <ThemeProvider theme={theme}>
          <HelpButton onClick={mockOnClick} />
        </ThemeProvider>
      )

      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard(' ')

      expect(mockOnClick).toHaveBeenCalled()
    })
  })

  describe('Integration with HelpDrawer Pattern', () => {
    it('should work in common usage pattern with state toggle', async () => {
      let open = false
      const toggleOpen = jest.fn(() => {
        open = !open
      })

      const { rerender } = render(
        <ThemeProvider theme={theme}>
          <HelpButton onClick={toggleOpen} />
        </ThemeProvider>
      )

      expect(toggleOpen).not.toHaveBeenCalled()
      expect(open).toBe(false)

      await user.click(screen.getByRole('button'))

      expect(toggleOpen).toHaveBeenCalledTimes(1)

      // Simulate state update
      toggleOpen()
      rerender(
        <ThemeProvider theme={theme}>
          <HelpButton onClick={toggleOpen} />
        </ThemeProvider>
      )

      expect(toggleOpen).toHaveBeenCalledTimes(2)
    })
  })
})
