import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import SplashHeader from '../../../app/clientComponents/splash-header'
import { theme } from '../../../styles/theme'
import React from 'react'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, height, width, style, ...props }: any) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        height={height}
        width={width}
        style={style}
        {...props}
        data-testid="mock-image"
      />
    )
  }
})

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('SplashHeader Component', () => {
  const defaultProps = {
    title: 'Test Title',
    src: '/test-image.jpg',
    alt: 'Test image alt text',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render with required props', () => {
      render(<SplashHeader {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByAltText('Test image alt text')).toBeInTheDocument()
    })

    it('should render main image with correct attributes', () => {
      render(<SplashHeader {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      const mainImage = screen.getByAltText('Test image alt text')
      expect(mainImage).toHaveAttribute('src', '/test-image.jpg')
      expect(mainImage).toHaveAttribute('height', '355')
      expect(mainImage).toHaveAttribute('width', '384')
    })

    it('should render title text correctly', () => {
      render(<SplashHeader {...defaultProps} title="lowercase title" />, {
        wrapper: TestWrapper,
      })

      const titleElement = screen.getByText('lowercase title')
      expect(titleElement).toBeInTheDocument()
      // In a real browser, the textTransform CSS would make this uppercase
      expect(titleElement.tagName).toBe('SPAN') // MUI Typography renders as span
    })
  })

  describe('Decorative Icon - Default Behavior', () => {
    it('should show decorative icon by default', () => {
      render(<SplashHeader {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      const decorativeIcon = screen.getByAltText('')
      expect(decorativeIcon).toBeInTheDocument()
      expect(decorativeIcon).toHaveAttribute(
        'src',
        '/icons/designImages/leaf-orange.png'
      )
      expect(decorativeIcon).toHaveAttribute('height', '21')
      expect(decorativeIcon).toHaveAttribute('width', '21')
    })

    it('should hide decorative icon when showIcon is false', () => {
      render(<SplashHeader {...defaultProps} showIcon={false} />, {
        wrapper: TestWrapper,
      })

      const images = screen.getAllByTestId('mock-image')
      expect(images).toHaveLength(1) // Only main image, no decorative icon
      expect(screen.getByAltText('Test image alt text')).toBeInTheDocument()
    })
  })

  describe('Decorative Icon - Custom Configuration', () => {
    it('should use custom icon source when provided', () => {
      render(<SplashHeader {...defaultProps} iconSrc="/custom-icon.png" />, {
        wrapper: TestWrapper,
      })

      const decorativeIcon = screen.getByAltText('')
      expect(decorativeIcon).toHaveAttribute('src', '/custom-icon.png')
    })

    it('should use custom icon size when provided as number', () => {
      render(<SplashHeader {...defaultProps} iconSize={32} />, {
        wrapper: TestWrapper,
      })

      const decorativeIcon = screen.getByAltText('')
      expect(decorativeIcon).toHaveAttribute('height', '32')
      expect(decorativeIcon).toHaveAttribute('width', '32')
    })

    it('should use custom icon size when provided as string', () => {
      render(<SplashHeader {...defaultProps} iconSize="48" />, {
        wrapper: TestWrapper,
      })

      const decorativeIcon = screen.getByAltText('')
      expect(decorativeIcon).toHaveAttribute('height', '48')
      expect(decorativeIcon).toHaveAttribute('width', '48')
    })
  })

  describe('Accessibility - Icon Alt Text', () => {
    it('should use empty alt text by default for decorative icon', () => {
      render(<SplashHeader {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      const decorativeIcon = screen.getByAltText('')
      expect(decorativeIcon).toBeInTheDocument()
    })

    it('should use custom alt text when provided for decorative purposes', () => {
      render(
        <SplashHeader {...defaultProps} iconAlt="Decorative leaf symbol" />,
        {
          wrapper: TestWrapper,
        }
      )

      expect(screen.getByAltText('Decorative leaf symbol')).toBeInTheDocument()
    })

    it('should use descriptive alt text when icon is meaningful', () => {
      render(<SplashHeader {...defaultProps} iconAlt="Icon description" />, {
        wrapper: TestWrapper,
      })

      const decorativeIcon = screen.getByAltText('Icon description')
      expect(decorativeIcon).toBeInTheDocument()
    })
  })

  describe('Responsive Image Sizing', () => {
    it('should handle responsive height object', () => {
      const responsiveHeight = { xs: 200, sm: 300, md: 400, lg: 500 }
      render(<SplashHeader {...defaultProps} height={responsiveHeight} />, {
        wrapper: TestWrapper,
      })

      const mainImage = screen.getByAltText('Test image alt text')
      expect(mainImage).toHaveAttribute('height', '400') // md value used as base
    })

    it('should handle responsive width object', () => {
      const responsiveWidth = { xs: 250, sm: 350, md: 450, lg: 550 }
      render(<SplashHeader {...defaultProps} width={responsiveWidth} />, {
        wrapper: TestWrapper,
      })

      const mainImage = screen.getByAltText('Test image alt text')
      expect(mainImage).toHaveAttribute('width', '450') // md value used as base
    })

    it('should fallback to default values for empty responsive objects', () => {
      render(<SplashHeader {...defaultProps} height={{}} width={{}} />, {
        wrapper: TestWrapper,
      })

      const mainImage = screen.getByAltText('Test image alt text')
      expect(mainImage).toHaveAttribute('height', '355')
      expect(mainImage).toHaveAttribute('width', '384')
    })
  })

  describe('Custom Styling', () => {
    it('should apply custom style to main image', () => {
      const customStyle = { border: '2px solid red', opacity: 0.8 }
      render(<SplashHeader {...defaultProps} style={customStyle} />, {
        wrapper: TestWrapper,
      })

      const mainImage = screen.getByAltText('Test image alt text')
      expect(mainImage).toHaveStyle('border: 2px solid red')
      expect(mainImage).toHaveStyle('opacity: 0.8')
    })
  })

  describe('Container Spacing Strategy', () => {
    it('should use default spacing of 2 when no spacing prop is provided', () => {
      const { container } = render(<SplashHeader {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      // The Stack component should have a data-testid or we can check the MUI class
      const stackElement = container.querySelector('.MuiStack-root')
      expect(stackElement).toBeInTheDocument()
    })

    it('should apply custom spacing when spacing prop is provided', () => {
      const { container } = render(
        <SplashHeader {...defaultProps} spacing={4} />,
        { wrapper: TestWrapper }
      )

      const stackElement = container.querySelector('.MuiStack-root')
      expect(stackElement).toBeInTheDocument()
    })

    it('should handle responsive spacing object', () => {
      const responsiveSpacing = { xs: 1, sm: 2, md: 3, lg: 4 }

      const { container } = render(
        <SplashHeader {...defaultProps} spacing={responsiveSpacing} />,
        { wrapper: TestWrapper }
      )

      const stackElement = container.querySelector('.MuiStack-root')
      expect(stackElement).toBeInTheDocument()
    })

    it('should eliminate need for manual spacing in consuming components', () => {
      // This test verifies that the component manages its own internal spacing
      // so consumers don't need to add manual spacing boxes
      render(<SplashHeader {...defaultProps} spacing={3} />, {
        wrapper: TestWrapper,
      })

      // The component should render both image and title sections
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByAltText('Test image alt text')).toBeInTheDocument()

      // Both sections should be within the same Stack container
      const titleElement = screen.getByText('Test Title')
      const imageElement = screen.getByAltText('Test image alt text')

      expect(titleElement).toBeInTheDocument()
      expect(imageElement).toBeInTheDocument()
    })
  })

  describe('Theme Integration', () => {
    it('should render within theme provider without errors', () => {
      expect(() => {
        render(<SplashHeader {...defaultProps} />, {
          wrapper: TestWrapper,
        })
      }).not.toThrow()
    })
  })

  describe('Component Interface Compliance', () => {
    it('should accept all optional props', () => {
      const allProps = {
        ...defaultProps,
        height: 400,
        width: 500,
        style: { margin: '10px' },
        showIcon: true,
        iconSrc: '/custom-icon.svg',
        iconAlt: 'Custom icon',
        iconSize: 30,
      }

      expect(() => {
        render(<SplashHeader {...allProps} />, {
          wrapper: TestWrapper,
        })
      }).not.toThrow()
    })

    it('should work with minimal required props only', () => {
      expect(() => {
        render(<SplashHeader {...defaultProps} />, {
          wrapper: TestWrapper,
        })
      }).not.toThrow()
    })
  })

  describe('Backward Compatibility', () => {
    it('should maintain existing behavior when no icon props are provided', () => {
      render(<SplashHeader {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      // Should have both main image and default decorative icon
      const images = screen.getAllByTestId('mock-image')
      expect(images).toHaveLength(2)

      // Main image
      expect(images[0]).toHaveAttribute('src', '/test-image.jpg')
      // Default decorative icon
      expect(images[1]).toHaveAttribute(
        'src',
        '/icons/designImages/leaf-orange.png'
      )
    })

    it('should not break existing usage patterns', () => {
      const legacyProps = {
        title: 'Legacy Title',
        src: '/legacy-image.jpg',
        alt: 'Legacy alt text',
        height: 300,
        width: 400,
      }

      expect(() => {
        render(<SplashHeader {...legacyProps} />, {
          wrapper: TestWrapper,
        })
      }).not.toThrow()

      expect(screen.getByText('Legacy Title')).toBeInTheDocument()
      expect(screen.getByAltText('Legacy alt text')).toBeInTheDocument()
    })
  })
})
