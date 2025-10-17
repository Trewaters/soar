import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '@styles/theme'
import SeriesPoseList, {
  SeriesPoseEntry,
} from '@app/clientComponents/SeriesPoseList'

// Test wrapper with MUI theme
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

describe('SeriesPoseList', () => {
  const mockStringPoses: SeriesPoseEntry[] = [
    'Warrior I; Virabhadrasana I',
    'Downward Dog; Adho Mukha Svanasana',
    'Child Pose',
  ]

  const mockObjectPoses: SeriesPoseEntry[] = [
    {
      sort_english_name: 'Tree Pose',
      secondary: 'Vrikshasana',
      alignment_cues: 'Keep standing leg strong',
    },
    {
      sort_english_name: 'Mountain Pose',
      secondary: 'Tadasana',
      alignment_cues: '',
    },
    {
      sort_english_name: 'Triangle Pose',
      secondary: 'Trikonasana',
      alignment_cues: 'Extend through both sides\nKeep hips aligned',
    },
  ]

  const mockPoseIds = {
    'Warrior I': 'warrior-1-id',
    'Tree Pose': 'tree-pose-id',
    'Mountain Pose': 'mountain-pose-id',
  }

  describe('Rendering with string poses', () => {
    it('should render without errors', () => {
      render(<SeriesPoseList seriesPoses={mockStringPoses} />, {
        wrapper: TestWrapper,
      })
      expect(screen.getByText('Warrior I')).toBeInTheDocument()
      expect(screen.getByText('Downward Dog')).toBeInTheDocument()
      expect(screen.getByText('Child Pose')).toBeInTheDocument()
    })

    it('should display secondary Sanskrit names from string format', () => {
      render(<SeriesPoseList seriesPoses={mockStringPoses} />, {
        wrapper: TestWrapper,
      })
      expect(screen.getByText('Virabhadrasana I')).toBeInTheDocument()
      expect(screen.getByText('Adho Mukha Svanasana')).toBeInTheDocument()
    })

    it('should render links for each pose', () => {
      render(<SeriesPoseList seriesPoses={mockStringPoses} />, {
        wrapper: TestWrapper,
      })
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(3)
      expect(links[0]).toHaveAttribute(
        'href',
        '/navigator/asanaPoses/Warrior%20I'
      )
      expect(links[1]).toHaveAttribute(
        'href',
        '/navigator/asanaPoses/Downward%20Dog'
      )
    })
  })

  describe('Rendering with object poses', () => {
    it('should render without errors', () => {
      render(<SeriesPoseList seriesPoses={mockObjectPoses} />, {
        wrapper: TestWrapper,
      })
      expect(screen.getByText('Tree Pose')).toBeInTheDocument()
      expect(screen.getByText('Mountain Pose')).toBeInTheDocument()
      expect(screen.getByText('Triangle Pose')).toBeInTheDocument()
    })

    it('should display alignment cues inline', () => {
      render(<SeriesPoseList seriesPoses={mockObjectPoses} />, {
        wrapper: TestWrapper,
      })
      // Should show first line of alignment cue in parentheses
      expect(screen.getByText('(Keep standing leg strong)')).toBeInTheDocument()
      // Should show multiline cue's first line only
      expect(
        screen.getByText('(Extend through both sides)')
      ).toBeInTheDocument()
      expect(screen.queryByText('Keep hips aligned')).not.toBeInTheDocument()
    })

    it('should not show alignment cues when empty', () => {
      render(<SeriesPoseList seriesPoses={mockObjectPoses} />, {
        wrapper: TestWrapper,
      })
      const mountainPoseElement = screen.getByText('Mountain Pose')
      const parent = mountainPoseElement.closest('.journalLine')
      expect(parent).toBeInTheDocument()
      // Should not have inline cue for Mountain Pose (empty alignment_cues)
      const cueElements = screen.getAllByText(/\(/i)
      expect(cueElements).toHaveLength(2) // Only Tree and Triangle have cues
    })

    it('should display secondary Sanskrit names', () => {
      render(<SeriesPoseList seriesPoses={mockObjectPoses} />, {
        wrapper: TestWrapper,
      })
      expect(screen.getByText('Vrikshasana')).toBeInTheDocument()
      expect(screen.getByText('Tadasana')).toBeInTheDocument()
      expect(screen.getByText('Trikonasana')).toBeInTheDocument()
    })
  })

  describe('Props: poseIds', () => {
    it('should use resolved IDs for navigation when provided', () => {
      render(
        <SeriesPoseList seriesPoses={mockObjectPoses} poseIds={mockPoseIds} />,
        { wrapper: TestWrapper }
      )
      const links = screen.getAllByRole('link')
      expect(links[0]).toHaveAttribute(
        'href',
        '/navigator/asanaPoses/tree-pose-id'
      )
      expect(links[1]).toHaveAttribute(
        'href',
        '/navigator/asanaPoses/mountain-pose-id'
      )
    })

    it('should fallback to encoded name when ID not available', () => {
      render(<SeriesPoseList seriesPoses={mockObjectPoses} poseIds={{}} />, {
        wrapper: TestWrapper,
      })
      const links = screen.getAllByRole('link')
      expect(links[0]).toHaveAttribute(
        'href',
        '/navigator/asanaPoses/Tree%20Pose'
      )
    })
  })

  describe('Props: getHref', () => {
    it('should use custom getHref function when provided', () => {
      const customGetHref = (poseName: string) =>
        `/custom/${poseName.toLowerCase()}`
      render(
        <SeriesPoseList
          seriesPoses={mockObjectPoses}
          getHref={customGetHref}
        />,
        { wrapper: TestWrapper }
      )
      const links = screen.getAllByRole('link')
      expect(links[0]).toHaveAttribute('href', '/custom/tree pose')
      expect(links[1]).toHaveAttribute('href', '/custom/mountain pose')
    })
  })

  describe('Props: showAlignmentInline', () => {
    it('should hide alignment cues when showAlignmentInline=false', () => {
      render(
        <SeriesPoseList
          seriesPoses={mockObjectPoses}
          showAlignmentInline={false}
        />,
        { wrapper: TestWrapper }
      )
      expect(
        screen.queryByText(/Keep standing leg strong/i)
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText(/Extend through both sides/i)
      ).not.toBeInTheDocument()
    })
  })

  describe('Props: showSecondary', () => {
    it('should hide Sanskrit names when showSecondary=false', () => {
      render(
        <SeriesPoseList seriesPoses={mockObjectPoses} showSecondary={false} />,
        { wrapper: TestWrapper }
      )
      expect(screen.queryByText('Vrikshasana')).not.toBeInTheDocument()
      expect(screen.queryByText('Tadasana')).not.toBeInTheDocument()
      expect(screen.queryByText('Trikonasana')).not.toBeInTheDocument()
    })
  })

  describe('Props: linkColor', () => {
    it('should apply custom link color', () => {
      render(
        <SeriesPoseList seriesPoses={mockObjectPoses} linkColor="error.main" />,
        { wrapper: TestWrapper }
      )
      const links = screen.getAllByRole('link')
      expect(links[0]).toHaveStyle({ color: theme.palette.error.main })
    })
  })

  describe('Props: dataTestIdPrefix', () => {
    it('should use custom test ID prefix', () => {
      render(
        <SeriesPoseList
          seriesPoses={mockObjectPoses}
          dataTestIdPrefix="custom-pose"
        />,
        { wrapper: TestWrapper }
      )
      expect(screen.getByTestId('custom-pose-0')).toBeInTheDocument()
      expect(screen.getByTestId('custom-pose-1')).toBeInTheDocument()
      expect(screen.getByTestId('custom-pose-2')).toBeInTheDocument()
    })

    it('should include cue test IDs when alignment cues present', () => {
      render(
        <SeriesPoseList
          seriesPoses={mockObjectPoses}
          dataTestIdPrefix="custom-pose"
        />,
        { wrapper: TestWrapper }
      )
      expect(screen.getByTestId('custom-pose-0-cue')).toBeInTheDocument()
      expect(screen.getByTestId('custom-pose-2-cue')).toBeInTheDocument()
    })

    it('should include secondary test IDs when secondary names present', () => {
      render(
        <SeriesPoseList
          seriesPoses={mockObjectPoses}
          dataTestIdPrefix="custom-pose"
        />,
        { wrapper: TestWrapper }
      )
      expect(screen.getByTestId('custom-pose-0-secondary')).toBeInTheDocument()
      expect(screen.getByTestId('custom-pose-1-secondary')).toBeInTheDocument()
      expect(screen.getByTestId('custom-pose-2-secondary')).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('should handle empty seriesPoses array', () => {
      render(<SeriesPoseList seriesPoses={[]} />, { wrapper: TestWrapper })
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    it('should handle mixed string and object formats', () => {
      const mixedPoses: SeriesPoseEntry[] = [
        'Warrior I; Virabhadrasana I',
        {
          sort_english_name: 'Tree Pose',
          secondary: 'Vrikshasana',
          alignment_cues: 'Balance on one leg',
        },
        'Child Pose',
      ]
      render(<SeriesPoseList seriesPoses={mixedPoses} />, {
        wrapper: TestWrapper,
      })
      expect(screen.getByText('Warrior I')).toBeInTheDocument()
      expect(screen.getByText('Tree Pose')).toBeInTheDocument()
      expect(screen.getByText('Child Pose')).toBeInTheDocument()
      expect(screen.getByText('(Balance on one leg)')).toBeInTheDocument()
    })

    it('should handle poses with missing sort_english_name', () => {
      const incompletePose: SeriesPoseEntry[] = [
        {
          secondary: 'Sanskrit Only',
        },
      ]
      render(<SeriesPoseList seriesPoses={incompletePose} />, {
        wrapper: TestWrapper,
      })
      // Should fallback to pose-0 when name is missing
      expect(screen.getByTestId('series-pose-0')).toBeInTheDocument()
    })

    it('should handle very long alignment cues with ellipsis', () => {
      const longCuePose: SeriesPoseEntry[] = [
        {
          sort_english_name: 'Complex Pose',
          alignment_cues:
            'This is a very long alignment cue that should be truncated because it exceeds the maximum width allowed for inline display',
        },
      ]
      render(<SeriesPoseList seriesPoses={longCuePose} />, {
        wrapper: TestWrapper,
      })
      const cueElement = screen.getByTestId('series-pose-0-cue')
      expect(cueElement).toHaveStyle({
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      })
    })
  })

  describe('Accessibility', () => {
    it('should render semantic link elements', () => {
      render(<SeriesPoseList seriesPoses={mockObjectPoses} />, {
        wrapper: TestWrapper,
      })
      const links = screen.getAllByRole('link')
      links.forEach((link) => {
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href')
      })
    })

    it('should maintain proper heading hierarchy with Typography', () => {
      render(<SeriesPoseList seriesPoses={mockObjectPoses} />, {
        wrapper: TestWrapper,
      })
      // Verify body1 and body2 variants are used (not headings)
      const treePose = screen.getByText('Tree Pose')
      expect(treePose.tagName).not.toBe('H1')
      expect(treePose.tagName).not.toBe('H2')
    })
  })
})
