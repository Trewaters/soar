import '@testing-library/jest-dom'
import {
  HELP_PATHS,
  loadHelpText,
  parseMarkdownToHTML,
} from '@app/utils/helpLoader'

// Mock fetch globally
global.fetch = jest.fn()

describe('helpLoader Utility', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('HELP_PATHS Constant', () => {
    it('should have asanas paths', () => {
      expect(HELP_PATHS.asanas).toBeDefined()
      expect(HELP_PATHS.asanas.practice).toBe('/help/asanas/practice-asana.md')
      expect(HELP_PATHS.asanas.create).toBe('/help/asanas/create-asana.md')
    })

    it('should have flows paths', () => {
      expect(HELP_PATHS.flows).toBeDefined()
      expect(HELP_PATHS.flows.practiceFlow).toBe('/help/flows/practice-flow.md')
      expect(HELP_PATHS.sequences.practiceSequences).toBe(
        '/help/sequences/practice-sequence.md'
      )
      expect(HELP_PATHS.flows.createFlow).toBe('/help/flows/create-flow.md')
      expect(HELP_PATHS.sequences.createSequences).toBe(
        '/help/sequences/create-sequences.md'
      )
    })

    it('should have profile paths', () => {
      expect(HELP_PATHS.profile).toBeDefined()
      expect(HELP_PATHS.profile.library).toBe('/help/profile/library.md')
    })

    it('should have all paths start with /help/', () => {
      const allPaths = Object.values(HELP_PATHS).flatMap((category) =>
        Object.values(category)
      )

      allPaths.forEach((path) => {
        expect(path).toMatch(/^\/help\//)
      })
    })

    it('should have all paths end with .md', () => {
      const allPaths = Object.values(HELP_PATHS).flatMap((category) =>
        Object.values(category)
      )

      allPaths.forEach((path) => {
        expect(path).toMatch(/\.md$/)
      })
    })
  })

  describe('loadHelpText Function', () => {
    it('should successfully load help text from valid path', async () => {
      const mockContent = '# Test Help\nThis is test content'
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => mockContent,
      } as Response)

      const result = await loadHelpText('/help/test.md')

      expect(mockFetch).toHaveBeenCalledWith('/help/test.md')
      expect(result).toBe(mockContent)
    })

    it('should return error message when fetch fails', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
      } as Response)

      const result = await loadHelpText('/help/nonexistent.md')

      expect(result).toBe(
        'Help content is currently unavailable. Please try again later.'
      )
    })

    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const result = await loadHelpText('/help/test.md')

      expect(result).toBe(
        'Help content is currently unavailable. Please try again later.'
      )
    })

    it('should load content from HELP_PATHS constants', async () => {
      const mockContent = '# Practice Asanas\nHelp content'
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => mockContent,
      } as Response)

      const result = await loadHelpText(HELP_PATHS.asanas.practice)

      expect(mockFetch).toHaveBeenCalledWith('/help/asanas/practice-asana.md')
      expect(result).toBe(mockContent)
    })

    it('should handle empty response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => '',
      } as Response)

      const result = await loadHelpText('/help/empty.md')

      expect(result).toBe('')
    })
  })

  describe('parseMarkdownToHTML Function', () => {
    describe('Heading Parsing', () => {
      it('should parse H1 headings correctly', () => {
        const markdown = '# Main Title'
        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('<h1>Main Title</h1>')
      })

      it('should parse H2 headings correctly', () => {
        const markdown = '## Section Title'
        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('<h2>Section Title</h2>')
      })

      it('should parse H3 headings correctly', () => {
        const markdown = '### Subsection Title'
        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('<h3>Subsection Title</h3>')
      })

      it('should parse multiple headings', () => {
        const markdown = `# Title One
## Title Two
### Title Three`
        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('<h1>Title One</h1>')
        expect(result).toContain('<h2>Title Two</h2>')
        expect(result).toContain('<h3>Title Three</h3>')
      })
    })

    describe('Text Formatting', () => {
      it('should parse bold text with double asterisks', () => {
        const markdown = 'This is **bold text** in a sentence'
        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('<strong>bold text</strong>')
      })

      it('should parse italic text with single asterisk', () => {
        const markdown = 'This is *italic text* in a sentence'
        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('<em>italic text</em>')
      })

      it('should parse both bold and italic text', () => {
        const markdown = 'Text with **bold** and *italic* formatting'
        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('<strong>bold</strong>')
        expect(result).toContain('<em>italic</em>')
      })

      it('should handle multiple bold sections in one line', () => {
        const markdown = '**First bold** text **second bold**'
        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('<strong>First bold</strong>')
        expect(result).toContain('<strong>second bold</strong>')
      })
    })

    describe('List Parsing', () => {
      it('should parse ordered list items', () => {
        const markdown = `1. First item
2. Second item
3. Third item`
        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('<ol>')
        expect(result).toContain('<li>First item</li>')
        expect(result).toContain('<li>Second item</li>')
        expect(result).toContain('<li>Third item</li>')
        expect(result).toContain('</ol>')
      })

      it('should parse unordered list items with dashes', () => {
        const markdown = `- First item
- Second item
- Third item`
        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('<ul>')
        expect(result).toContain('<li>First item</li>')
        expect(result).toContain('<li>Second item</li>')
        expect(result).toContain('<li>Third item</li>')
        expect(result).toContain('</ul>')
      })

      it('should not parse asterisks as lists (only dashes supported)', () => {
        const markdown = `* Item one
* Item two`
        const result = parseMarkdownToHTML(markdown)

        // Parser only supports dashes, not asterisks for lists
        expect(result).not.toContain('<ul>')
        expect(result).toContain('* Item')
      })

      it('should close ordered list when content changes', () => {
        const markdown = `1. List item
Regular paragraph`
        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('</ol>')
        expect(result).toContain('<p>Regular paragraph</p>')
      })

      it('should close unordered list when content changes', () => {
        const markdown = `- List item
Regular paragraph`
        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('</ul>')
        expect(result).toContain('<p>Regular paragraph</p>')
      })

      it('should handle list items with formatting', () => {
        const markdown = `- Item with **bold** text
- Item with *italic* text`
        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain(
          '<li>Item with <strong>bold</strong> text</li>'
        )
        expect(result).toContain('<li>Item with <em>italic</em> text</li>')
      })
    })

    describe('Paragraph Parsing', () => {
      it('should wrap regular text in paragraph tags', () => {
        const markdown = 'This is a regular paragraph'
        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('<p>This is a regular paragraph</p>')
      })

      it('should handle multiple paragraphs', () => {
        const markdown = `First paragraph

Second paragraph`
        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('<p>First paragraph</p>')
        expect(result).toContain('<p>Second paragraph</p>')
      })

      it('should not create empty paragraphs from blank lines', () => {
        const markdown = `Paragraph one

Paragraph two`
        const result = parseMarkdownToHTML(markdown)

        expect(result).not.toContain('<p></p>')
      })
    })

    describe('Complex Mixed Content', () => {
      it('should parse document with headings, lists, and paragraphs', () => {
        const markdown = `# Main Title

This is an introduction paragraph.

## Features

- Feature one with **bold**
- Feature two with *italic*

### Details

More information here.`

        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('<h1>Main Title</h1>')
        expect(result).toContain('<p>This is an introduction paragraph.</p>')
        expect(result).toContain('<h2>Features</h2>')
        expect(result).toContain('<ul>')
        expect(result).toContain(
          '<li>Feature one with <strong>bold</strong></li>'
        )
        expect(result).toContain('<li>Feature two with <em>italic</em></li>')
        expect(result).toContain('<h3>Details</h3>')
        expect(result).toContain('<p>More information here.</p>')
      })

      it('should handle ordered and unordered lists together', () => {
        const markdown = `1. First ordered item
2. Second ordered item

- First unordered item
- Second unordered item`

        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('<ol>')
        expect(result).toContain('</ol>')
        expect(result).toContain('<ul>')
        expect(result).toContain('</ul>')
      })

      it('should preserve text formatting across multiple lines', () => {
        const markdown = `**Bold heading**
*Italic subtext*
Regular text`

        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('<strong>Bold heading</strong>')
        expect(result).toContain('<em>Italic subtext</em>')
        expect(result).toContain('Regular text')
      })
    })

    describe('Edge Cases', () => {
      it('should handle empty string', () => {
        const result = parseMarkdownToHTML('')

        expect(result).toBe('')
      })

      it('should handle string with only whitespace', () => {
        const markdown = '   \n\n   '
        const result = parseMarkdownToHTML(markdown)

        expect(result).not.toContain('<p>')
      })

      it('should handle markdown with no special formatting', () => {
        const markdown = 'Just plain text without any markdown'
        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('<p>Just plain text without any markdown</p>')
      })

      it('should handle list with single item', () => {
        const markdown = '- Single item'
        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('<ul>')
        expect(result).toContain('<li>Single item</li>')
        expect(result).toContain('</ul>')
      })

      it('should close open lists at end of content', () => {
        const markdown = `1. First item
2. Second item`
        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('</ol>')
      })

      it('should handle text with special characters', () => {
        const markdown = 'Text with & < > special characters'
        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('Text with & < > special characters')
      })
    })

    describe('Real-world Help Content Examples', () => {
      it('should parse typical yoga help content', () => {
        const markdown = `# How to Create a Yoga Sequence

## What is a Sequence?

A sequence is an **ordered collection** of yoga poses designed for practice.

### Creating Your First Sequence

1. Navigate to the Create Sequence page
2. Add poses from your *favorite series*
3. Arrange them in the desired order
4. Save your sequence

## Tips

- Start with simple poses
- Consider the flow between poses
- **Remember**: Quality over quantity`

        const result = parseMarkdownToHTML(markdown)

        expect(result).toContain('<h1>How to Create a Yoga Sequence</h1>')
        expect(result).toContain('<h2>What is a Sequence?</h2>')
        expect(result).toContain('<strong>ordered collection</strong>')
        expect(result).toContain('<h3>Creating Your First Sequence</h3>')
        expect(result).toContain('<ol>')
        expect(result).toContain('<em>favorite series</em>')
        expect(result).toContain('<h2>Tips</h2>')
        expect(result).toContain('<ul>')
        expect(result).toContain('<strong>Remember</strong>')
      })
    })
  })
})
