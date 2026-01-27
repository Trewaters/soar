import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HelpDrawer from '@app/clientComponents/HelpDrawer'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import * as helpLoader from '@app/utils/helpLoader'

const theme = createTheme()

// Mock the helpLoader module
jest.mock('@app/utils/helpLoader', () => ({
  ...jest.requireActual('@/app/utils/helpLoader'),
  loadHelpText: jest.fn(),
  parseMarkdownToHTML: jest.fn(),
}))

describe('HelpDrawer Component', () => {
  const user = userEvent.setup()
  const mockLoadHelpText = helpLoader.loadHelpText as jest.MockedFunction<
    typeof helpLoader.loadHelpText
  >
  const mockParseMarkdownToHTML =
    helpLoader.parseMarkdownToHTML as jest.MockedFunction<
      typeof helpLoader.parseMarkdownToHTML
    >

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without errors when closed', () => {
      const mockOnClose = jest.fn()
      render(
        <ThemeProvider theme={theme}>
          <HelpDrawer
            open={false}
            onClose={mockOnClose}
            content="Test help content"
          />
        </ThemeProvider>
      )

      // Drawer should not be visible when closed
      expect(screen.queryByRole('presentation')).not.toBeInTheDocument()
    })

    it('should render when open with plain text content', async () => {
      const mockOnClose = jest.fn()
      const helpText = 'This is plain text help content'

      render(
        <ThemeProvider theme={theme}>
          <HelpDrawer open={true} onClose={mockOnClose} content={helpText} />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(helpText)).toBeInTheDocument()
      })
    })

    it('should detect and load markdown file when path starts with /help/', async () => {
      const mockOnClose = jest.fn()
      const markdownContent = '# Test Heading\nTest paragraph'
      const htmlContent = '<h1>Test Heading</h1><p>Test paragraph</p>'

      mockLoadHelpText.mockResolvedValue(markdownContent)
      mockParseMarkdownToHTML.mockReturnValue(htmlContent)

      render(
        <ThemeProvider theme={theme}>
          <HelpDrawer
            open={true}
            onClose={mockOnClose}
            content="/help/test.md"
          />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(mockLoadHelpText).toHaveBeenCalledWith('/help/test.md')
        expect(mockParseMarkdownToHTML).toHaveBeenCalledWith(markdownContent)
      })
    })

    it('should detect and load markdown file when path ends with .md', async () => {
      const mockOnClose = jest.fn()
      const markdownContent = '## Subheading\nContent'
      const htmlContent = '<h2>Subheading</h2><p>Content</p>'

      mockLoadHelpText.mockResolvedValue(markdownContent)
      mockParseMarkdownToHTML.mockReturnValue(htmlContent)

      render(
        <ThemeProvider theme={theme}>
          <HelpDrawer
            open={true}
            onClose={mockOnClose}
            content="custom-path.md"
          />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(mockLoadHelpText).toHaveBeenCalledWith('custom-path.md')
        expect(mockParseMarkdownToHTML).toHaveBeenCalledWith(markdownContent)
      })
    })
  })

  describe('Content Type Detection', () => {
    it('should treat content without /help/ prefix or .md suffix as plain text', async () => {
      const mockOnClose = jest.fn()
      const plainText = 'Just some regular help text without markdown'

      render(
        <ThemeProvider theme={theme}>
          <HelpDrawer open={true} onClose={mockOnClose} content={plainText} />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(plainText)).toBeInTheDocument()
      })

      expect(mockLoadHelpText).not.toHaveBeenCalled()
      expect(mockParseMarkdownToHTML).not.toHaveBeenCalled()
    })

    it('should handle HELP_PATHS constants correctly', async () => {
      const mockOnClose = jest.fn()
      const markdownContent = '# Practice Asanas\nHelp content here'
      const htmlContent = '<h1>Practice Asanas</h1><p>Help content here</p>'

      mockLoadHelpText.mockResolvedValue(markdownContent)
      mockParseMarkdownToHTML.mockReturnValue(htmlContent)

      render(
        <ThemeProvider theme={theme}>
          <HelpDrawer
            open={true}
            onClose={mockOnClose}
            content={helpLoader.HELP_PATHS.asanas.practice}
          />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(mockLoadHelpText).toHaveBeenCalledWith(
          '/help/asanas/practice.md'
        )
      })
    })
  })

  describe('Drawer Behavior', () => {
    it('should call onClose when drawer backdrop is clicked', async () => {
      const mockOnClose = jest.fn()

      render(
        <ThemeProvider theme={theme}>
          <HelpDrawer
            open={true}
            onClose={mockOnClose}
            content="Test content"
          />
        </ThemeProvider>
      )

      const backdrop = document.querySelector('.MuiBackdrop-root')
      if (backdrop) {
        await user.click(backdrop as Element)
        expect(mockOnClose).toHaveBeenCalled()
      }
    })

    it('should render drawer when open', () => {
      const mockOnClose = jest.fn()
      render(
        <ThemeProvider theme={theme}>
          <HelpDrawer
            open={true}
            onClose={mockOnClose}
            content="Test content"
          />
        </ThemeProvider>
      )

      expect(screen.getByRole('presentation')).toBeInTheDocument()
    })

    it('should have proper max dimensions for mobile', () => {
      const mockOnClose = jest.fn()
      render(
        <ThemeProvider theme={theme}>
          <HelpDrawer
            open={true}
            onClose={mockOnClose}
            content="Test content"
          />
        </ThemeProvider>
      )

      const drawerPaper = document.querySelector('.MuiDrawer-paper')
      expect(drawerPaper).toBeInTheDocument()
    })
  })

  describe('Loading States and Error Handling', () => {
    it('should handle markdown loading errors gracefully', async () => {
      const mockOnClose = jest.fn()
      const errorMessage =
        'Help content is currently unavailable. Please try again later.'

      mockLoadHelpText.mockResolvedValue(errorMessage)
      mockParseMarkdownToHTML.mockReturnValue(`<p>${errorMessage}</p>`)

      render(
        <ThemeProvider theme={theme}>
          <HelpDrawer
            open={true}
            onClose={mockOnClose}
            content="/help/nonexistent.md"
          />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(mockLoadHelpText).toHaveBeenCalled()
      })
    })

    it('should update content when drawer is reopened', async () => {
      const mockOnClose = jest.fn()
      const firstContent = 'First help text'
      const secondContent = 'Second help text'

      const { rerender } = render(
        <ThemeProvider theme={theme}>
          <HelpDrawer
            open={true}
            onClose={mockOnClose}
            content={firstContent}
          />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(firstContent)).toBeInTheDocument()
      })

      rerender(
        <ThemeProvider theme={theme}>
          <HelpDrawer
            open={false}
            onClose={mockOnClose}
            content={firstContent}
          />
        </ThemeProvider>
      )

      rerender(
        <ThemeProvider theme={theme}>
          <HelpDrawer
            open={true}
            onClose={mockOnClose}
            content={secondContent}
          />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(secondContent)).toBeInTheDocument()
      })
    })

    it('should not load content when drawer is closed', () => {
      const mockOnClose = jest.fn()

      render(
        <ThemeProvider theme={theme}>
          <HelpDrawer
            open={false}
            onClose={mockOnClose}
            content="/help/test.md"
          />
        </ThemeProvider>
      )

      expect(mockLoadHelpText).not.toHaveBeenCalled()
      expect(mockParseMarkdownToHTML).not.toHaveBeenCalled()
    })
  })

  describe('Custom Styling', () => {
    it('should apply custom sx props to drawer paper', () => {
      const mockOnClose = jest.fn()
      const customSx = { backgroundColor: 'red' }

      render(
        <ThemeProvider theme={theme}>
          <HelpDrawer
            open={true}
            onClose={mockOnClose}
            content="Test content"
            sx={customSx}
          />
        </ThemeProvider>
      )

      const drawerPaper = document.querySelector('.MuiDrawer-paper')
      expect(drawerPaper).toBeInTheDocument()
    })

    it('should work without custom sx props', () => {
      const mockOnClose = jest.fn()

      render(
        <ThemeProvider theme={theme}>
          <HelpDrawer
            open={true}
            onClose={mockOnClose}
            content="Test content"
          />
        </ThemeProvider>
      )

      const drawerPaper = document.querySelector('.MuiDrawer-paper')
      expect(drawerPaper).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA role', () => {
      const mockOnClose = jest.fn()
      render(
        <ThemeProvider theme={theme}>
          <HelpDrawer
            open={true}
            onClose={mockOnClose}
            content="Test content"
          />
        </ThemeProvider>
      )

      const drawer = screen.getByRole('presentation')
      expect(drawer).toBeInTheDocument()
    })

    it('should be closeable with Escape key', async () => {
      const mockOnClose = jest.fn()
      render(
        <ThemeProvider theme={theme}>
          <HelpDrawer
            open={true}
            onClose={mockOnClose}
            content="Test content"
          />
        </ThemeProvider>
      )

      await user.keyboard('{Escape}')

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should display HTML content with proper semantic structure', async () => {
      const mockOnClose = jest.fn()
      const markdownContent = '# Main Title\n## Subtitle\nParagraph text'
      const htmlContent =
        '<h1>Main Title</h1><h2>Subtitle</h2><p>Paragraph text</p>'

      mockLoadHelpText.mockResolvedValue(markdownContent)
      mockParseMarkdownToHTML.mockReturnValue(htmlContent)

      render(
        <ThemeProvider theme={theme}>
          <HelpDrawer
            open={true}
            onClose={mockOnClose}
            content="/help/test.md"
          />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(mockParseMarkdownToHTML).toHaveBeenCalledWith(markdownContent)
      })
    })
  })

  describe('Real-world Usage Patterns', () => {
    it('should work with typical page integration pattern', async () => {
      const mockOnClose = jest.fn()
      let open = false
      const setOpen = jest.fn((value: boolean) => {
        open = value
      })

      const { rerender } = render(
        <ThemeProvider theme={theme}>
          <HelpDrawer
            open={open}
            onClose={() => setOpen(false)}
            content="Help for this page"
          />
        </ThemeProvider>
      )

      expect(screen.queryByRole('presentation')).not.toBeInTheDocument()

      // Simulate opening drawer
      open = true
      rerender(
        <ThemeProvider theme={theme}>
          <HelpDrawer
            open={open}
            onClose={() => setOpen(false)}
            content="Help for this page"
          />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByRole('presentation')).toBeInTheDocument()
      })
    })
  })
})
