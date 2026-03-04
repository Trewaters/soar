import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import ProfileDetails from '@app/clientComponents/profileUi/ProfileDetails'
import theme from '@styles/theme'

// Test wrapper with theme
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('ProfileDetails', () => {
  describe('Rendering', () => {
    it('should render without errors with basic props', () => {
      render(<ProfileDetails label="Username" details="YogaMaster123" />, {
        wrapper: TestWrapper,
      })
      expect(screen.getByText('Username')).toBeInTheDocument()
      expect(screen.getByText('YogaMaster123')).toBeInTheDocument()
    })

    it('should render with N/A when details is null', () => {
      render(<ProfileDetails label="Location" details={null} />, {
        wrapper: TestWrapper,
      })
      expect(screen.getByText('Location')).toBeInTheDocument()
      expect(screen.getByText('N/A')).toBeInTheDocument()
    })

    it('should render with N/A when details is undefined', () => {
      render(<ProfileDetails label="Bio" details={undefined} />, {
        wrapper: TestWrapper,
      })
      expect(screen.getByText('Bio')).toBeInTheDocument()
      expect(screen.getByText('N/A')).toBeInTheDocument()
    })

    it('should render with N/A when details is empty string', () => {
      render(<ProfileDetails label="Company" details="" />, {
        wrapper: TestWrapper,
      })
      expect(screen.getByText('Company')).toBeInTheDocument()
      expect(screen.getByText('N/A')).toBeInTheDocument()
    })

    it('should render with N/A when details is empty array', () => {
      render(<ProfileDetails label="Skills" details={[]} />, {
        wrapper: TestWrapper,
      })
      expect(screen.getByText('Skills')).toBeInTheDocument()
      expect(screen.getByText('N/A')).toBeInTheDocument()
    })

    it('should render array of strings joined by newlines', () => {
      render(
        <ProfileDetails
          label="Yoga Styles"
          details={['Vinyasa', 'Hatha', 'Yin']}
        />,
        { wrapper: TestWrapper }
      )
      expect(screen.getByText('Yoga Styles')).toBeInTheDocument()
      // Text with newlines needs a function matcher
      expect(
        screen.getByText((content, element) => {
          return (
            element?.tagName.toLowerCase() === 'dd' &&
            content.includes('Vinyasa') &&
            content.includes('Hatha') &&
            content.includes('Yin')
          )
        })
      ).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    it('should apply single line text variant by default', () => {
      render(<ProfileDetails label="Name" details="John Doe" />, {
        wrapper: TestWrapper,
      })
      const detailsElement = screen.getByText('John Doe')
      expect(detailsElement).toHaveStyle({ whiteSpace: 'normal' })
    })

    it('should apply multiline variant with pre-line whitespace', () => {
      render(
        <ProfileDetails
          label="Bio"
          details="Line 1\nLine 2\nLine 3"
          variant="multiline"
        />,
        { wrapper: TestWrapper }
      )
      const detailsElement = screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === 'dd' && content.includes('Line 1')
        )
      })
      expect(detailsElement).toHaveStyle({ whiteSpace: 'pre-line' })
    })
  })

  describe('Background Highlighting', () => {
    it('should not apply background by default', () => {
      render(<ProfileDetails label="Name" details="John Doe" />, {
        wrapper: TestWrapper,
      })
      const detailsElement = screen.getByText('John Doe')
      expect(detailsElement).toHaveStyle({ backgroundColor: 'transparent' })
    })

    it('should apply lightgray background when highlightBackground is true', () => {
      render(
        <ProfileDetails
          label="Email"
          details="test@example.com"
          highlightBackground
        />,
        { wrapper: TestWrapper }
      )
      const detailsElement = screen.getByText('test@example.com')
      expect(detailsElement).toHaveStyle({ backgroundColor: 'lightgray' })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for group', () => {
      render(<ProfileDetails label="Username" details="YogiMaster" />, {
        wrapper: TestWrapper,
      })
      const group = screen.getByRole('group', {
        name: 'Profile detail: Username',
      })
      expect(group).toBeInTheDocument()
    })

    it('should use semantic definition list markup', () => {
      const { container } = render(
        <ProfileDetails label="Location" details="San Francisco, CA" />,
        { wrapper: TestWrapper }
      )
      expect(container.querySelector('dl')).toBeInTheDocument()
      expect(container.querySelector('dt')).toBeInTheDocument()
      expect(container.querySelector('dd')).toBeInTheDocument()
    })

    it('should have descriptive aria-label on details element', () => {
      render(<ProfileDetails label="Yoga Style" details="Vinyasa Flow" />, {
        wrapper: TestWrapper,
      })
      const detailsElement = screen.getByLabelText('Yoga Style: Vinyasa Flow')
      expect(detailsElement).toBeInTheDocument()
    })

    it('should have descriptive aria-label for array details', () => {
      render(
        <ProfileDetails
          label="Certifications"
          details={['RYT-200', 'RYT-500']}
        />,
        { wrapper: TestWrapper }
      )
      const detailsElement = screen.getByLabelText(
        'Certifications: RYT-200 RYT-500'
      )
      expect(detailsElement).toBeInTheDocument()
    })
  })

  describe('Custom Styling', () => {
    it('should accept and apply custom sx props', () => {
      render(
        <ProfileDetails
          label="Name"
          details="John Doe"
          sx={{ color: 'red', fontSize: '20px' }}
        />,
        { wrapper: TestWrapper }
      )
      const detailsElement = screen.getByText('John Doe')
      expect(detailsElement).toHaveStyle({ color: 'red', fontSize: '20px' })
    })
  })

  describe('Edge Cases', () => {
    it('should handle array with empty strings correctly', () => {
      render(
        <ProfileDetails
          label="Tags"
          details={['', 'yoga', '', 'meditation']}
        />,
        { wrapper: TestWrapper }
      )
      expect(
        screen.getByText((content, element) => {
          return (
            element?.tagName.toLowerCase() === 'dd' &&
            content.includes('yoga') &&
            content.includes('meditation')
          )
        })
      ).toBeInTheDocument()
    })

    it('should handle array with only whitespace strings', () => {
      render(<ProfileDetails label="Notes" details={['  ', '\t', '   ']} />, {
        wrapper: TestWrapper,
      })
      expect(screen.getByText('N/A')).toBeInTheDocument()
    })

    it('should trim whitespace from array entries', () => {
      render(
        <ProfileDetails
          label="Skills"
          details={['  Vinyasa  ', '\tHatha\t', '  Yin  ']}
        />,
        { wrapper: TestWrapper }
      )
      expect(
        screen.getByText((content, element) => {
          return (
            element?.tagName.toLowerCase() === 'dd' &&
            content.includes('Vinyasa') &&
            content.includes('Hatha') &&
            content.includes('Yin')
          )
        })
      ).toBeInTheDocument()
    })
  })
})
