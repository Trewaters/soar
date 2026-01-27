import { Drawer, Typography, Box, SxProps, Theme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { loadHelpText, parseMarkdownToHTML } from '@app/utils/helpLoader'

interface HelpDrawerProps {
  open: boolean
  onClose: () => void
  content: string
  sx?: SxProps<Theme>
}

/**
 * HelpDrawer component renders a bottom drawer with help content.
 * Automatically detects if content is a markdown file path or plain text.
 * Reusable across the app for consistent help pattern.
 *
 * @component
 * @param {HelpDrawerProps} props - The properties for the HelpDrawer component.
 * @param {boolean} props.open - Controls whether the drawer is open or closed.
 * @param {function} props.onClose - Callback function when the drawer is closed.
 * @param {string} props.content - Help content as plain text OR path to markdown file (e.g., '/help/asanas/practice.md').
 * @param {SxProps<Theme>} [props.sx] - Optional sx prop for custom styling of the drawer paper.
 *
 * @example
 * // Using plain text
 * <HelpDrawer
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   content="Your help content here..."
 * />
 *
 * @example
 * // Using markdown file
 * import { HELP_PATHS } from '@app/utils/helpLoader'
 *
 * <HelpDrawer
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   content={HELP_PATHS.asanas.practice}
 * />
 */
const HelpDrawer: React.FC<HelpDrawerProps> = ({
  open,
  onClose,
  content,
  sx,
}) => {
  const [displayContent, setDisplayContent] = useState<string>('')
  const [isMarkdown, setIsMarkdown] = useState(false)

  useEffect(() => {
    if (open && content) {
      // Detect if content is a file path (starts with /help/ or ends with .md)
      const isFilePath = content.startsWith('/help/') || content.endsWith('.md')

      if (isFilePath) {
        // Load markdown from file
        loadHelpText(content).then((markdown) => {
          const html = parseMarkdownToHTML(markdown)
          setDisplayContent(html)
          setIsMarkdown(true)
        })
      } else {
        // Use provided plain text
        setDisplayContent(content)
        setIsMarkdown(false)
      }
    }
  }, [open, content])

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          maxWidth: '100vw',
          maxHeight: '80vh',
          overflowY: 'auto',
        },
        ...sx,
      }}
    >
      {isMarkdown ? (
        <Box
          sx={{
            p: 2,
            '& h1': {
              fontSize: '1.5rem',
              fontWeight: 600,
              mb: 2,
              mt: 0,
            },
            '& h2': {
              fontSize: '1.25rem',
              fontWeight: 600,
              mb: 1.5,
              mt: 2,
            },
            '& h3': {
              fontSize: '1.1rem',
              fontWeight: 600,
              mb: 1,
              mt: 1.5,
            },
            '& p': {
              mb: 1,
              lineHeight: 1.6,
            },
            '& ul, & ol': {
              pl: 3,
              mb: 1.5,
            },
            '& li': {
              mb: 0.5,
              lineHeight: 1.6,
            },
            '& strong': {
              fontWeight: 600,
            },
          }}
          dangerouslySetInnerHTML={{ __html: displayContent }}
        />
      ) : (
        <Typography variant="body1" sx={{ p: 2 }}>
          {displayContent}
        </Typography>
      )}
    </Drawer>
  )
}

export default HelpDrawer
