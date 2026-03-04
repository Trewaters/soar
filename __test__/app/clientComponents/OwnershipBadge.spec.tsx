import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import OwnershipBadge from '@app/clientComponents/OwnershipBadge'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'

const theme = createTheme()

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('OwnershipBadge', () => {
  describe('Rendering', () => {
    it('should render PUBLIC badge for PUBLIC content', () => {
      render(<OwnershipBadge created_by="PUBLIC" />, { wrapper: TestWrapper })

      const badge = screen.getByText('PUBLIC')
      expect(badge).toBeInTheDocument()
      // aria-label is on the Chip parent element
      expect(badge.closest('.MuiChip-root')).toHaveAttribute(
        'aria-label',
        'Public system content'
      )
    })

    it('should render Personal badge for user-owned content', () => {
      render(<OwnershipBadge created_by="user-123" />, {
        wrapper: TestWrapper,
      })

      const badge = screen.getByText('Personal')
      expect(badge).toBeInTheDocument()
    })

    it('should render "My Content" badge when current user owns the content', () => {
      render(
        <OwnershipBadge created_by="user-123" currentUserId="user-123" />,
        { wrapper: TestWrapper }
      )

      const badge = screen.getByText('My Content')
      expect(badge).toBeInTheDocument()
      // aria-label is on the Chip parent element
      expect(badge.closest('.MuiChip-root')).toHaveAttribute(
        'aria-label',
        'Your personal content'
      )
    })

    it('should not render anything when created_by is null', () => {
      const { container } = render(<OwnershipBadge created_by={null} />, {
        wrapper: TestWrapper,
      })

      expect(container.firstChild).toBeNull()
    })

    it('should not render anything when created_by is undefined', () => {
      const { container } = render(<OwnershipBadge created_by={undefined} />, {
        wrapper: TestWrapper,
      })

      expect(container.firstChild).toBeNull()
    })

    it('should not render anything when created_by is empty string', () => {
      const { container } = render(<OwnershipBadge created_by="" />, {
        wrapper: TestWrapper,
      })

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Props', () => {
    it('should render small size badge by default', () => {
      render(<OwnershipBadge created_by="PUBLIC" />, { wrapper: TestWrapper })

      const badge = screen.getByText('PUBLIC').closest('.MuiChip-root')
      expect(badge).toHaveClass('MuiChip-sizeSmall')
    })

    it('should render medium size badge when size prop is medium', () => {
      render(<OwnershipBadge created_by="PUBLIC" size="medium" />, {
        wrapper: TestWrapper,
      })

      const badge = screen.getByText('PUBLIC').closest('.MuiChip-root')
      expect(badge).toHaveClass('MuiChip-sizeMedium')
    })

    it('should apply custom data-testid for PUBLIC badge', () => {
      render(
        <OwnershipBadge
          created_by="PUBLIC"
          data-testid="custom-public-badge"
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByTestId('custom-public-badge')).toBeInTheDocument()
    })

    it('should apply custom data-testid for personal badge', () => {
      render(
        <OwnershipBadge
          created_by="user-123"
          data-testid="custom-personal-badge"
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByTestId('custom-personal-badge')).toBeInTheDocument()
    })

    it('should apply default data-testid for PUBLIC badge', () => {
      render(<OwnershipBadge created_by="PUBLIC" />, { wrapper: TestWrapper })

      expect(screen.getByTestId('ownership-badge-public')).toBeInTheDocument()
    })

    it('should apply default data-testid for personal badge', () => {
      render(<OwnershipBadge created_by="user-123" />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByTestId('ownership-badge-personal')).toBeInTheDocument()
    })
  })

  describe('Badge Variants', () => {
    it('should render PUBLIC badge with outlined variant', () => {
      render(<OwnershipBadge created_by="PUBLIC" />, { wrapper: TestWrapper })

      const badge = screen.getByText('PUBLIC').closest('.MuiChip-root')
      expect(badge).toHaveClass('MuiChip-outlined')
    })

    it('should render personal badge with filled variant', () => {
      render(<OwnershipBadge created_by="user-123" />, {
        wrapper: TestWrapper,
      })

      const badge = screen.getByText('Personal').closest('.MuiChip-root')
      expect(badge).toHaveClass('MuiChip-filled')
    })

    it('should render PUBLIC badge with primary color', () => {
      render(<OwnershipBadge created_by="PUBLIC" />, { wrapper: TestWrapper })

      const badge = screen.getByText('PUBLIC').closest('.MuiChip-root')
      expect(badge).toHaveClass('MuiChip-colorPrimary')
    })

    it('should render personal badge with secondary color', () => {
      render(<OwnershipBadge created_by="user-123" />, {
        wrapper: TestWrapper,
      })

      const badge = screen.getByText('Personal').closest('.MuiChip-root')
      expect(badge).toHaveClass('MuiChip-colorSecondary')
    })
  })

  describe('Icons', () => {
    it('should render PublicIcon for PUBLIC content', () => {
      render(<OwnershipBadge created_by="PUBLIC" />, { wrapper: TestWrapper })

      const icon = screen
        .getByText('PUBLIC')
        .closest('.MuiChip-root')
        ?.querySelector('.MuiChip-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should render PersonIcon for personal content', () => {
      render(<OwnershipBadge created_by="user-123" />, {
        wrapper: TestWrapper,
      })

      const icon = screen
        .getByText('Personal')
        .closest('.MuiChip-root')
        ?.querySelector('.MuiChip-icon')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper aria-label for PUBLIC content', () => {
      render(<OwnershipBadge created_by="PUBLIC" />, { wrapper: TestWrapper })

      const badge = screen.getByText('PUBLIC')
      expect(badge.closest('.MuiChip-root')).toHaveAttribute(
        'aria-label',
        'Public system content'
      )
    })

    it('should have proper aria-label for user-owned content', () => {
      render(
        <OwnershipBadge created_by="user-123" currentUserId="user-456" />,
        {
          wrapper: TestWrapper,
        }
      )

      const badge = screen.getByText('Personal')
      expect(badge.closest('.MuiChip-root')).toHaveAttribute(
        'aria-label',
        'User-created personal content'
      )
    })

    it('should have proper aria-label for current user content', () => {
      render(
        <OwnershipBadge created_by="user-123" currentUserId="user-123" />,
        { wrapper: TestWrapper }
      )

      const badge = screen.getByText('My Content')
      expect(badge.closest('.MuiChip-root')).toHaveAttribute(
        'aria-label',
        'Your personal content'
      )
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long user IDs', () => {
      const longUserId = 'a'.repeat(100)
      render(<OwnershipBadge created_by={longUserId} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText('Personal')).toBeInTheDocument()
    })

    it('should handle user ID that is exactly "PUBLIC" (case-sensitive)', () => {
      render(<OwnershipBadge created_by="PUBLIC" />, { wrapper: TestWrapper })

      expect(screen.getByText('PUBLIC')).toBeInTheDocument()
      expect(screen.queryByText('Personal')).not.toBeInTheDocument()
    })

    it('should treat "public" (lowercase) as personal content', () => {
      render(<OwnershipBadge created_by="public" />, { wrapper: TestWrapper })

      expect(screen.getByText('Personal')).toBeInTheDocument()
      expect(screen.queryByText('PUBLIC')).not.toBeInTheDocument()
    })

    it('should handle special characters in user IDs', () => {
      render(<OwnershipBadge created_by="user-@#$%^&*()" />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText('Personal')).toBeInTheDocument()
    })
  })

  describe('Conditional Rendering Logic', () => {
    it('should show "My Content" when currentUserId matches created_by', () => {
      render(
        <OwnershipBadge created_by="abc-123-xyz" currentUserId="abc-123-xyz" />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByText('My Content')).toBeInTheDocument()
      expect(screen.queryByText('Personal')).not.toBeInTheDocument()
    })

    it('should show "Personal" when currentUserId does not match created_by', () => {
      render(
        <OwnershipBadge
          created_by="abc-123-xyz"
          currentUserId="different-user"
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByText('Personal')).toBeInTheDocument()
      expect(screen.queryByText('My Content')).not.toBeInTheDocument()
    })

    it('should show "Personal" when currentUserId is not provided', () => {
      render(<OwnershipBadge created_by="abc-123-xyz" />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText('Personal')).toBeInTheDocument()
      expect(screen.queryByText('My Content')).not.toBeInTheDocument()
    })
  })
})
