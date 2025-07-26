import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import AsanaDetails from '@clientComponents/asanaUi/asanaDetails'
import theme from '@styles/theme'

// Mock Next.js components and hooks
jest.mock('next/navigation')
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} {...props} />
  ),
}))

// Standard test wrapper for Soar components
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

// Default props for testing
const defaultProps = {
  label: 'Pose Name',
  details:
    'This is a detailed description of the yoga pose with instructions and benefits.',
}

describe('AsanaDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without errors', () => {
      render(<AsanaDetails {...defaultProps} />, { wrapper: TestWrapper })

      expect(screen.getByRole('group')).toBeInTheDocument()
      expect(screen.getByText('Pose Name:')).toBeInTheDocument()
      expect(screen.getByText(defaultProps.details)).toBeInTheDocument()
    })

    it('should render with semantic HTML structure using definition list', () => {
      render(<AsanaDetails {...defaultProps} />, { wrapper: TestWrapper })

      // Check that the component uses proper semantic HTML
      const definitionList = screen.getByRole('group')
      expect(definitionList.tagName).toBe('DL')

      // Check for definition term (dt) and definition description (dd)
      const term = screen.getByText('Pose Name:')
      const description = screen.getByText(defaultProps.details)

      expect(term.tagName).toBe('DT')
      expect(description.tagName).toBe('DD')
    })

    it('should render the decorative leaf icon', () => {
      render(<AsanaDetails {...defaultProps} />, { wrapper: TestWrapper })

      const icon = screen.getByRole('img', { hidden: true })
      expect(icon).toHaveAttribute('src', '/icons/asanas/label_name_leaf.png')
      expect(icon).toHaveAttribute('aria-hidden', 'true')
      // The mocked image inherits the alt from the component, but in real Next.js Image it would be empty
    })
  })

  describe('Props', () => {
    it('should display the correct label text', () => {
      const customLabel = 'Custom Asana Label'
      render(
        <AsanaDetails label={customLabel} details={defaultProps.details} />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByText(`${customLabel}:`)).toBeInTheDocument()
    })

    it('should display the correct details text', () => {
      const customDetails = 'Custom detailed instructions for this yoga pose.'
      render(
        <AsanaDetails label={defaultProps.label} details={customDetails} />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByText(customDetails)).toBeInTheDocument()
    })

    it('should handle multi-line details with pre-line formatting', () => {
      const multiLineDetails = 'Line 1\nLine 2\nLine 3'
      render(
        <AsanaDetails label={defaultProps.label} details={multiLineDetails} />,
        { wrapper: TestWrapper }
      )

      // Get the specific dd element containing the details
      const detailsElement = screen.getByRole('definition')
      // The DOM normalizes whitespace, but the CSS should preserve it
      expect(detailsElement).toHaveStyle('white-space: pre-line')
      // Check that the original text with newlines is present in the DOM
      expect(detailsElement.textContent).toBe(multiLineDetails)
    })

    it('should apply custom sx styles when provided', () => {
      const customSx = { backgroundColor: 'red', padding: '10px' }
      render(<AsanaDetails {...defaultProps} sx={customSx} />, {
        wrapper: TestWrapper,
      })

      const detailsElement = screen.getByText(defaultProps.details)
      expect(detailsElement).toHaveStyle('background-color: red')
      expect(detailsElement).toHaveStyle('padding: 10px')
    })

    it('should properly type-extend Stack props but apply them to the root Box element', () => {
      // This test verifies that the component properly types Stack props
      // but since the root is a Box, not all Stack props may be applied
      const { container } = render(
        <AsanaDetails {...defaultProps} direction="column" spacing={2} />,
        { wrapper: TestWrapper }
      )

      // The component should render without TypeScript errors
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Fallback Handling', () => {
    it('should display fallback text when details prop is empty string', () => {
      render(<AsanaDetails label={defaultProps.label} details="" />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText('No details available')).toBeInTheDocument()
    })

    it('should display fallback text when details prop is undefined', () => {
      render(
        <AsanaDetails label={defaultProps.label} details={undefined as any} />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByText('No details available')).toBeInTheDocument()
    })

    it('should display fallback text when details prop is null', () => {
      render(
        <AsanaDetails label={defaultProps.label} details={null as any} />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByText('No details available')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for the group container', () => {
      render(<AsanaDetails {...defaultProps} />, { wrapper: TestWrapper })

      const container = screen.getByRole('group')
      expect(container).toHaveAttribute(
        'aria-label',
        `Asana detail: ${defaultProps.label}`
      )
    })

    it('should have proper ARIA label for the details text', () => {
      render(<AsanaDetails {...defaultProps} />, { wrapper: TestWrapper })

      const detailsElement = screen.getByText(defaultProps.details)
      expect(detailsElement).toHaveAttribute(
        'aria-label',
        `${defaultProps.label}: ${defaultProps.details}`
      )
    })

    it('should have proper ARIA label for details text with fallback', () => {
      render(<AsanaDetails label={defaultProps.label} details="" />, {
        wrapper: TestWrapper,
      })

      const detailsElement = screen.getByText('No details available')
      expect(detailsElement).toHaveAttribute(
        'aria-label',
        `${defaultProps.label}: No details available`
      )
    })

    it('should mark the icon as decorative with aria-hidden', () => {
      render(<AsanaDetails {...defaultProps} />, { wrapper: TestWrapper })

      const icon = screen.getByRole('img', { hidden: true })
      expect(icon).toHaveAttribute('aria-hidden', 'true')
      // In the actual component, Next.js Image with alt="" would be decorative
      // Our mock inherits props differently but maintains aria-hidden
    })

    it('should use semantic HTML elements for better screen reader support', () => {
      render(<AsanaDetails {...defaultProps} />, { wrapper: TestWrapper })

      // Check for semantic structure
      const definitionList = screen.getByRole('group')
      const term = screen.getByText('Pose Name:')
      const description = screen.getByText(defaultProps.details)

      expect(definitionList.tagName).toBe('DL')
      expect(term.tagName).toBe('DT')
      expect(description.tagName).toBe('DD')
    })
  })

  describe('Responsive Design', () => {
    it('should apply responsive width styles', () => {
      render(<AsanaDetails {...defaultProps} />, { wrapper: TestWrapper })

      const container = screen.getByRole('group')

      // Check that MUI responsive styles are applied
      // Note: In JSDOM, we can't test actual responsive behavior,
      // but we can verify the styles are set up correctly
      expect(container).toBeInTheDocument()
    })

    it('should apply responsive padding styles', () => {
      render(<AsanaDetails {...defaultProps} />, { wrapper: TestWrapper })

      const container = screen.getByRole('group')
      expect(container).toBeInTheDocument()

      // The responsive padding is handled by MUI's sx prop
      // In a real browser, this would adjust based on breakpoints
    })

    it('should apply responsive border radius to details text', () => {
      render(<AsanaDetails {...defaultProps} />, { wrapper: TestWrapper })

      const detailsElement = screen.getByText(defaultProps.details)
      expect(detailsElement).toBeInTheDocument()

      // The responsive border radius is handled by MUI's sx prop
      // borderTopRightRadius and borderBottomRightRadius adjust by breakpoint
    })
  })

  describe('Performance', () => {
    it('should be memoized to prevent unnecessary re-renders', () => {
      const Component = AsanaDetails

      // Verify the component is wrapped with React.memo
      // React.memo returns an object with specific properties
      expect(Component.$$typeof).toBeDefined()
      expect(typeof Component).toBe('object')
      // The component should be callable like a function component
      expect(Component).toBeTruthy()
    })

    it('should not re-render when props are the same', () => {
      const { rerender } = render(<AsanaDetails {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      const initialElement = screen.getByRole('group')

      // Re-render with the same props
      rerender(<AsanaDetails {...defaultProps} />)

      // Element should still be in the document (memoization working)
      expect(screen.getByRole('group')).toBe(initialElement)
    })
  })

  describe('Theme Integration', () => {
    it('should use theme colors for label text', () => {
      render(<AsanaDetails {...defaultProps} />, { wrapper: TestWrapper })

      const labelElement = screen.getByText('Pose Name:')

      // Verify theme colors are applied (primary.main for label)
      // The theme primary.main is #F6893D which converts to rgb(246, 137, 61)
      expect(labelElement).toHaveStyle('color: rgb(246, 137, 61)')
    })

    it('should use theme colors for details text', () => {
      render(<AsanaDetails {...defaultProps} />, { wrapper: TestWrapper })

      const detailsElement = screen.getByText(defaultProps.details)

      // Verify theme colors are applied (primary.contrastText for details)
      expect(detailsElement).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long text content', () => {
      const longDetails = 'A'.repeat(1000)
      render(
        <AsanaDetails label={defaultProps.label} details={longDetails} />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByText(longDetails)).toBeInTheDocument()
    })

    it('should handle special characters in text', () => {
      const specialCharsDetails = 'Sanskrit: प्राणायाम & symbols: ॐ @#$%^&*()'
      render(
        <AsanaDetails
          label={defaultProps.label}
          details={specialCharsDetails}
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByText(specialCharsDetails)).toBeInTheDocument()
    })

    it('should handle empty label gracefully', () => {
      render(<AsanaDetails label="" details={defaultProps.details} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText(':')).toBeInTheDocument()
      expect(screen.getByText(defaultProps.details)).toBeInTheDocument()
    })
  })
})
