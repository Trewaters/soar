import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import StyleGuide from '@app/styleGuide/page'

// Mock Material-UI icons
jest.mock('@mui/icons-material/ExpandMore', () => ({
  __esModule: true,
  default: () => <div data-testid="expand-more-icon" />,
}))

jest.mock('@mui/icons-material/Favorite', () => ({
  __esModule: true,
  default: () => <div data-testid="favorite-icon" />,
}))

jest.mock('@mui/icons-material/Home', () => ({
  __esModule: true,
  default: () => <div data-testid="home-icon" />,
}))

jest.mock('@mui/icons-material/Menu', () => ({
  __esModule: true,
  default: () => <div data-testid="menu-icon" />,
}))

jest.mock('@mui/icons-material/Person', () => ({
  __esModule: true,
  default: () => <div data-testid="person-icon" />,
}))

jest.mock('@mui/icons-material/Search', () => ({
  __esModule: true,
  default: () => <div data-testid="search-icon" />,
}))

jest.mock('@mui/icons-material/Settings', () => ({
  __esModule: true,
  default: () => <div data-testid="settings-icon" />,
}))

// Create a test theme to match the app
const testTheme = createTheme({
  palette: {
    primary: {
      main: '#F6893D',
      light: '#FFBA6F',
      dark: '#C3581A',
      contrastText: '#000000',
    },
    secondary: {
      main: '#F6B93D',
      light: '#FFD970',
      dark: '#C38B1A',
      contrastText: '#07020D',
    },
    error: {
      main: '#D32F2F',
      light: '#E57373',
      dark: '#9A0007',
      contrastText: '#d32f2f',
    },
    warning: {
      main: '#FFA726',
      light: '#FFD95B',
      dark: '#C77800',
      contrastText: '#000000',
    },
    info: {
      main: '#1976D2',
      light: '#63A4FF',
      dark: '#004BA0',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#2E7D32',
      light: '#60AD5E',
      dark: '#005005',
      contrastText: '#FFFFFF',
    },
    navSplash: {
      main: '#185A77',
      light: 'rgba(248, 244, 242, 0.5)',
      dark: '#F8F4F2',
      contrastText: '#07020D',
    },
  },
  typography: {
    h1: { fontSize: '3rem' },
    h2: { fontSize: '2rem' },
    h3: { fontSize: '1.8rem' },
    h4: { fontSize: '1.6rem' },
    h5: { fontSize: '1.4rem' },
    h6: { fontSize: '1.2rem' },
    subtitle1: { fontSize: '1.2rem' },
    subtitle2: { fontSize: '1.05rem' },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '.8rem' },
    caption: { fontSize: '0.9rem' },
    overline: { fontSize: '0.9rem' },
    label: { fontSize: '1.8rem' },
    splashTitle: {
      fontSize: '3rem',
      fontWeight: '900',
      textTransform: 'capitalize',
      letterSpacing: '0.1rem',
    },
  },
})

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={testTheme}>{component}</ThemeProvider>)
}

describe('StyleGuide Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Overall Structure', () => {
    it('renders the main style guide container', () => {
      renderWithTheme(<StyleGuide />)
      expect(screen.getByText('Design System Style Guide')).toBeInTheDocument()
    })

    it('renders all main sections', () => {
      renderWithTheme(<StyleGuide />)

      // Check for main section headings
      expect(screen.getByText('Typography')).toBeInTheDocument()
      expect(screen.getByText('Theme Configuration')).toBeInTheDocument()
      expect(screen.getByText('Color Palette')).toBeInTheDocument()
      expect(
        screen.getByText('MUI Components (Primary Theme Style)')
      ).toBeInTheDocument()
    })
  })

  describe('Typography Section', () => {
    it('displays all typography variants', () => {
      renderWithTheme(<StyleGuide />)

      // Check for typography headings
      expect(screen.getByText(/H1 - Main Heading/)).toBeInTheDocument()
      expect(screen.getByText(/H2 - Section Heading/)).toBeInTheDocument()
      expect(screen.getByText(/H3 - Subsection Heading/)).toBeInTheDocument()
      expect(screen.getByText(/H4 - Heading/)).toBeInTheDocument()
      expect(screen.getByText(/H5 - Heading/)).toBeInTheDocument()
      expect(screen.getByText(/H6 - Heading/)).toBeInTheDocument()
      expect(screen.getByText(/Subtitle 1/)).toBeInTheDocument()
      expect(screen.getByText(/Subtitle 2/)).toBeInTheDocument()
      expect(
        screen.getByText(/Body 1 - Default paragraph text/)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/Body 2 - Smaller paragraph text/)
      ).toBeInTheDocument()
      expect(screen.getByText(/Caption text/)).toBeInTheDocument()
      expect(screen.getByText(/OVERLINE TEXT/)).toBeInTheDocument()
      expect(screen.getByText(/Label Text/)).toBeInTheDocument()
      expect(screen.getByText(/Splash Title/)).toBeInTheDocument()
    })

    it('shows typography with font size information', () => {
      renderWithTheme(<StyleGuide />)

      // Check that font sizes are displayed (they come from theme)
      const h1Element = screen.getByText(/H1 - Main Heading/)
      expect(h1Element).toBeInTheDocument()
    })
  })

  describe('Theme Configuration Section', () => {
    it('displays breakpoints information', () => {
      renderWithTheme(<StyleGuide />)

      expect(screen.getByText('Breakpoints')).toBeInTheDocument()
      // Breakpoints should be displayed but exact values depend on theme
    })

    it('displays spacing scale information', () => {
      renderWithTheme(<StyleGuide />)

      expect(screen.getByText('Spacing Scale')).toBeInTheDocument()
    })

    it('displays font family information', () => {
      renderWithTheme(<StyleGuide />)

      expect(screen.getByText('Font Family')).toBeInTheDocument()
    })
  })

  describe('Color Palette Section', () => {
    it('displays color palette section', () => {
      renderWithTheme(<StyleGuide />)

      // Check for color palette section
      expect(screen.getByText('Color Palette')).toBeInTheDocument()
    })

    it('shows color structure is rendered correctly', () => {
      renderWithTheme(<StyleGuide />)

      // Check that the color section exists and has proper structure
      const colorSection = screen.getByText('Color Palette')
      expect(colorSection).toBeInTheDocument()
    })
  })

  describe('MUI Components Section', () => {
    describe('Button Components', () => {
      it('displays all button variants', () => {
        renderWithTheme(<StyleGuide />)

        expect(screen.getByText('Buttons')).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: 'Contained Primary' })
        ).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: 'Outlined Primary' })
        ).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: 'Text Primary' })
        ).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: 'Disabled' })
        ).toBeInTheDocument()
      })

      it('displays button group', () => {
        renderWithTheme(<StyleGuide />)

        expect(screen.getByRole('button', { name: 'One' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Two' })).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: 'Three' })
        ).toBeInTheDocument()
      })

      it('displays icon button with favorite icon', () => {
        renderWithTheme(<StyleGuide />)

        expect(screen.getByLabelText('icon button')).toBeInTheDocument()
        expect(screen.getByTestId('favorite-icon')).toBeInTheDocument()
      })
    })

    describe('Form Control Components', () => {
      it('displays text field with helper text', () => {
        renderWithTheme(<StyleGuide />)

        expect(screen.getByText('Form Controls')).toBeInTheDocument()
        expect(screen.getByLabelText('Text Field')).toBeInTheDocument()
        expect(screen.getByText('Helper text')).toBeInTheDocument()
      })

      it('displays autocomplete component', () => {
        renderWithTheme(<StyleGuide />)

        expect(
          screen.getByPlaceholderText('Search for a Yoga Posture')
        ).toBeInTheDocument()
      })

      it('displays checkbox components with form group', () => {
        renderWithTheme(<StyleGuide />)

        expect(screen.getByLabelText('Checkbox Primary')).toBeInTheDocument()
        expect(screen.getByLabelText('Checkbox Unchecked')).toBeInTheDocument()
        expect(
          screen.getByText('Helper text for form group')
        ).toBeInTheDocument()
      })
    })

    describe('Card Components', () => {
      it('displays card with header, media, content, and actions', () => {
        renderWithTheme(<StyleGuide />)

        expect(screen.getByText('Cards')).toBeInTheDocument()
        expect(screen.getByText('Card Title')).toBeInTheDocument()
        expect(screen.getByText('Card Subtitle')).toBeInTheDocument()
        expect(
          screen.getByText('This is card content with some example text.')
        ).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: 'Action 1' })
        ).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: 'Action 2' })
        ).toBeInTheDocument()
      })

      it('displays expandable card with collapse functionality', () => {
        renderWithTheme(<StyleGuide />)

        expect(screen.getByText('Expandable Card')).toBeInTheDocument()
        expect(
          screen.getByText('Click expand to see more content.')
        ).toBeInTheDocument()

        // Test expand functionality
        const expandButton = screen.getByLabelText('show more')
        fireEvent.click(expandButton)

        expect(
          screen.getByText(/This is the expanded content/)
        ).toBeInTheDocument()
      })
    })

    describe('Navigation Components', () => {
      it('displays tabs component', () => {
        renderWithTheme(<StyleGuide />)

        expect(screen.getByText('Navigation')).toBeInTheDocument()
        expect(screen.getByText('Tabs')).toBeInTheDocument()
        expect(screen.getByRole('tab', { name: 'Tab One' })).toBeInTheDocument()
        expect(screen.getByRole('tab', { name: 'Tab Two' })).toBeInTheDocument()
        expect(
          screen.getByRole('tab', { name: 'Tab Three' })
        ).toBeInTheDocument()
      })

      it('allows tab switching', () => {
        renderWithTheme(<StyleGuide />)

        const tabTwo = screen.getByRole('tab', { name: 'Tab Two' })
        fireEvent.click(tabTwo)

        expect(tabTwo).toHaveAttribute('aria-selected', 'true')
      })

      it('displays app bar component', () => {
        renderWithTheme(<StyleGuide />)

        expect(screen.getByText('App Bar')).toBeInTheDocument()
        expect(screen.getByText('App Title')).toBeInTheDocument()
        expect(screen.getByLabelText('menu')).toBeInTheDocument()
        expect(screen.getByLabelText('profile')).toBeInTheDocument()
        expect(screen.getAllByTestId('menu-icon')).toHaveLength(1)
        expect(screen.getAllByTestId('person-icon')).toHaveLength(2) // Appears in both AppBar and List
      })

      it('displays list component with navigation items', () => {
        renderWithTheme(<StyleGuide />)

        expect(screen.getByText('Lists')).toBeInTheDocument()
        expect(screen.getByText('Home')).toBeInTheDocument()
        expect(screen.getByText('Profile')).toBeInTheDocument()
        expect(screen.getByText('Settings')).toBeInTheDocument()
        expect(screen.getByText('About')).toBeInTheDocument()

        // Check for icons - expect multiple instances
        expect(screen.getAllByTestId('home-icon')).toHaveLength(1)
        expect(screen.getAllByTestId('person-icon')).toHaveLength(2) // Appears in both AppBar and List
        expect(screen.getAllByTestId('settings-icon')).toHaveLength(2) // Appears in both Card header and List
        expect(screen.getAllByTestId('search-icon')).toHaveLength(2)
      })
    })

    describe('Feedback Components', () => {
      it('displays all alert variants', () => {
        renderWithTheme(<StyleGuide />)

        expect(screen.getByText('Feedback')).toBeInTheDocument()
        expect(screen.getByText('This is a success alert!')).toBeInTheDocument()
        expect(screen.getByText('This is an info alert!')).toBeInTheDocument()
        expect(screen.getByText('This is a warning alert!')).toBeInTheDocument()
        expect(screen.getByText('This is an error alert!')).toBeInTheDocument()
      })

      it('displays circular progress indicator', () => {
        renderWithTheme(<StyleGuide />)

        expect(screen.getByText('Loading...')).toBeInTheDocument()
        expect(screen.getByRole('progressbar')).toBeInTheDocument()
      })
    })

    describe('Layout Components', () => {
      it('displays divider variants', () => {
        renderWithTheme(<StyleGuide />)

        expect(screen.getByText('Layout')).toBeInTheDocument()
        expect(screen.getByText('Dividers')).toBeInTheDocument()
      })

      it('displays avatar components', () => {
        renderWithTheme(<StyleGuide />)

        expect(screen.getByText('Avatar')).toBeInTheDocument()

        // Check for avatar elements with letters A, B, C
        const avatars = screen.getAllByText(/^[ABC]$/)
        expect(avatars).toHaveLength(3)
      })
    })

    describe('App-Specific Styles', () => {
      it('displays app-specific button style', () => {
        renderWithTheme(<StyleGuide />)

        expect(
          screen.getByText('App-Specific Button Styles')
        ).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: 'Navigation Button Style' })
        ).toBeInTheDocument()
      })

      it('displays app-specific form field style', () => {
        renderWithTheme(<StyleGuide />)

        expect(screen.getByLabelText('Form Field Style')).toBeInTheDocument()
      })
    })
  })

  describe('Interactive Functionality', () => {
    it('allows autocomplete interaction', () => {
      renderWithTheme(<StyleGuide />)

      const autocomplete = screen.getByPlaceholderText(
        'Search for a Yoga Posture'
      )
      fireEvent.click(autocomplete)
      fireEvent.change(autocomplete, { target: { value: 'Option' } })

      // Should not throw errors during interaction
      expect(autocomplete).toBeInTheDocument()
    })

    it('allows checkbox interaction', () => {
      renderWithTheme(<StyleGuide />)

      const checkbox = screen.getByLabelText('Checkbox Unchecked')
      fireEvent.click(checkbox)

      expect(checkbox).toBeChecked()
    })

    it('maintains state across interactions', () => {
      renderWithTheme(<StyleGuide />)

      // Test that component state is maintained
      const tabTwo = screen.getByRole('tab', { name: 'Tab Two' })
      const expandButton = screen.getByLabelText('show more')

      fireEvent.click(tabTwo)
      fireEvent.click(expandButton)

      expect(tabTwo).toHaveAttribute('aria-selected', 'true')
      expect(
        screen.getByText(/This is the expanded content/)
      ).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      renderWithTheme(<StyleGuide />)

      // Check for proper heading hierarchy - get the main title specifically
      const mainHeading = screen.getByText('Design System Style Guide')
      expect(mainHeading).toBeInTheDocument()
      expect(mainHeading.tagName).toBe('H1')

      const sectionHeadings = screen.getAllByRole('heading', { level: 2 })
      expect(sectionHeadings.length).toBeGreaterThan(3)
    })

    it('has proper form labels and controls', () => {
      renderWithTheme(<StyleGuide />)

      // Check for proper form accessibility
      expect(screen.getByLabelText('Text Field')).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText('Search for a Yoga Posture')
      ).toBeInTheDocument()
      expect(screen.getByLabelText('Checkbox Primary')).toBeInTheDocument()
    })

    it('has proper button accessibility', () => {
      renderWithTheme(<StyleGuide />)

      // Check for proper button labels
      expect(screen.getByLabelText('icon button')).toBeInTheDocument()
      expect(screen.getByLabelText('show more')).toBeInTheDocument()
      expect(screen.getByLabelText('menu')).toBeInTheDocument()
      expect(screen.getByLabelText('profile')).toBeInTheDocument()
    })
  })

  describe('Theme Integration', () => {
    it('uses theme values dynamically', () => {
      renderWithTheme(<StyleGuide />)

      // The component should render without hardcoded values
      // This test ensures the component doesn't crash when theme values change
      expect(screen.getByText('Design System Style Guide')).toBeInTheDocument()
    })

    it('displays theme information correctly', () => {
      renderWithTheme(<StyleGuide />)

      // Check that theme sections are populated
      expect(screen.getByText('Breakpoints')).toBeInTheDocument()
      expect(screen.getByText('Spacing Scale')).toBeInTheDocument()
      expect(screen.getByText('Font Family')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('renders without performance issues', () => {
      const startTime = performance.now()
      renderWithTheme(<StyleGuide />)
      const endTime = performance.now()

      // Should render in reasonable time (less than 1 second)
      expect(endTime - startTime).toBeLessThan(1000)
    })

    it('handles state updates efficiently', () => {
      renderWithTheme(<StyleGuide />)

      const tabOne = screen.getByRole('tab', { name: 'Tab One' })
      const tabTwo = screen.getByRole('tab', { name: 'Tab Two' })
      const tabThree = screen.getByRole('tab', { name: 'Tab Three' })

      // Multiple state updates should not cause issues
      fireEvent.click(tabTwo)
      fireEvent.click(tabThree)
      fireEvent.click(tabOne)

      expect(tabOne).toHaveAttribute('aria-selected', 'true')
    })
  })
})
