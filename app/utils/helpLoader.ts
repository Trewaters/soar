/**
 * Help text loader utility for Soar yoga application
 * Loads markdown help files from the public/help directory
 */

export const HELP_PATHS = {
  asanas: {
    practice: '/help/asanas/practice.md',
    create: '/help/asanas/create.md',
  },
  flows: {
    practiceSeries: '/help/flows/practice-series.md',
    practiceSequences: '/help/flows/practice-sequences.md',
    createSeries: '/help/flows/create-series.md',
    createSequences: '/help/flows/create-sequences.md',
  },
  profile: {
    library: '/help/profile/library.md',
  },
} as const

export type HelpPath = string

/**
 * Loads markdown help content from public directory
 * @param path - Path to markdown file (from HELP_PATHS)
 * @returns Promise resolving to markdown content string
 *
 * @example
 * const helpText = await loadHelpText(HELP_PATHS.asanas.practice)
 */
export async function loadHelpText(path: string): Promise<string> {
  try {
    const response = await fetch(path)
    if (!response.ok) {
      throw new Error(`Failed to load help text from ${path}`)
    }
    return await response.text()
  } catch (error) {
    console.error('Error loading help text:', error)
    return 'Help content is currently unavailable. Please try again later.'
  }
}

/**
 * Parses simple markdown to HTML for display
 * Supports: headings, bold, italic, lists (ordered/unordered), paragraphs
 * @param markdown - Raw markdown string
 * @returns HTML string
 */
export function parseMarkdownToHTML(markdown: string): string {
  const lines = markdown.split('\n')
  const result: string[] = []
  let inOrderedList = false
  let inUnorderedList = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Headings
    if (line.startsWith('### ')) {
      if (inOrderedList) {
        result.push('</ol>')
        inOrderedList = false
      }
      if (inUnorderedList) {
        result.push('</ul>')
        inUnorderedList = false
      }
      result.push(`<h3>${line.substring(4)}</h3>`)
      continue
    }
    if (line.startsWith('## ')) {
      if (inOrderedList) {
        result.push('</ol>')
        inOrderedList = false
      }
      if (inUnorderedList) {
        result.push('</ul>')
        inUnorderedList = false
      }
      result.push(`<h2>${line.substring(3)}</h2>`)
      continue
    }
    if (line.startsWith('# ')) {
      if (inOrderedList) {
        result.push('</ol>')
        inOrderedList = false
      }
      if (inUnorderedList) {
        result.push('</ul>')
        inUnorderedList = false
      }
      result.push(`<h1>${line.substring(2)}</h1>`)
      continue
    }

    // Ordered list
    const orderedMatch = line.match(/^(\d+)\.\s+(.+)$/)
    if (orderedMatch) {
      if (inUnorderedList) {
        result.push('</ul>')
        inUnorderedList = false
      }
      if (!inOrderedList) {
        result.push('<ol>')
        inOrderedList = true
      }

      let content = orderedMatch[2]
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      content = content.replace(/\*(.*?)\*/g, '<em>$1</em>')
      result.push(`<li>${content}</li>`)
      continue
    }

    // Unordered list (with indentation support)
    const unorderedMatch = line.match(/^(\s*)-\s+(.+)$/)
    if (unorderedMatch) {
      const indent = unorderedMatch[1].length
      if (indent === 0) {
        // Top-level bullet
        if (inOrderedList) {
          result.push('</ol>')
          inOrderedList = false
        }
        if (!inUnorderedList) {
          result.push('<ul>')
          inUnorderedList = true
        }
      } else {
        // Nested bullet - start nested ul if needed
        if (!inUnorderedList) {
          result.push('<ul>')
          inUnorderedList = true
        }
      }

      let content = unorderedMatch[2]
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      content = content.replace(/\*(.*?)\*/g, '<em>$1</em>')
      result.push(`<li>${content}</li>`)
      continue
    }

    // Empty line
    if (line.trim() === '') {
      if (inOrderedList) {
        result.push('</ol>')
        inOrderedList = false
      }
      if (inUnorderedList) {
        result.push('</ul>')
        inUnorderedList = false
      }
      result.push('')
      continue
    }

    // Regular paragraph
    if (inOrderedList) {
      result.push('</ol>')
      inOrderedList = false
    }
    if (inUnorderedList) {
      result.push('</ul>')
      inUnorderedList = false
    }

    let content = line
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    content = content.replace(/\*(.*?)\*/g, '<em>$1</em>')
    result.push(`<p>${content}</p>`)
  }

  // Close any open lists
  if (inOrderedList) result.push('</ol>')
  if (inUnorderedList) result.push('</ul>')

  return result.join('')
}
