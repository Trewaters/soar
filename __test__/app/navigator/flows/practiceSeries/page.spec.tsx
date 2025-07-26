import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Page from '@app/navigator/flows/practiceSeries/page'
import { FlowSeriesData } from '@context/AsanaSeriesContext'
import { getAllSeries } from '@lib/seriesService'
import userEvent from '@testing-library/user-event'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(() => ({
    get: jest.fn(() => null),
  })),
}))

// Mock the seriesService
jest.mock('@lib/seriesService', () => ({
  getAllSeries: jest.fn(),
}))

// Mock SeriesActivityTracker to avoid NextAuth import issues
jest.mock(
  '@app/clientComponents/seriesActivityTracker/SeriesActivityTracker',
  () => {
    const MockSeriesActivityTracker = ({ seriesId }: any) => (
      <div data-testid="series-activity-tracker">
        Activity Tracker for series: {seriesId}
      </div>
    )
    MockSeriesActivityTracker.displayName = 'MockSeriesActivityTracker'
    return MockSeriesActivityTracker
  }
)

// Mock SeriesWeeklyActivityTracker to avoid NextAuth import issues
jest.mock(
  '@app/clientComponents/seriesActivityTracker/SeriesWeeklyActivityTracker',
  () => {
    const MockSeriesWeeklyActivityTracker = ({ seriesId }: any) => (
      <div data-testid="series-weekly-activity-tracker">
        Weekly Activity Tracker for series: {seriesId}
      </div>
    )
    MockSeriesWeeklyActivityTracker.displayName =
      'MockSeriesWeeklyActivityTracker'
    return MockSeriesWeeklyActivityTracker
  }
)

const mockGetAllSeries = getAllSeries as jest.MockedFunction<
  typeof getAllSeries
>

// Mock SplashHeader component
jest.mock('@app/clientComponents/splash-header', () => {
  const MockSplashHeader = ({ title, src, alt }: any) => (
    <div data-testid="splash-header">
      <img src={src} alt={alt} width={400} height={200} />
      <span>{title}</span>
    </div>
  )
  MockSplashHeader.displayName = 'MockSplashHeader'
  return MockSplashHeader
})

// Mock SubNavHeader component
jest.mock('@app/clientComponents/sub-nav-header', () => {
  const MockSubNavHeader = ({ title, link, onClick }: any) => (
    <div data-testid="sub-nav-header">
      <a href={link}>Back to {title}</a>
      <button onClick={onClick} data-testid="help-button">
        Help
      </button>
    </div>
  )
  MockSubNavHeader.displayName = 'MockSubNavHeader'
  return MockSubNavHeader
})

// Mock NavBottom component
jest.mock('@serverComponents/navBottom', () => {
  const MockNavBottom = ({ subRoute }: any) => (
    <div data-testid="nav-bottom">Navigation: {subRoute}</div>
  )
  MockNavBottom.displayName = 'MockNavBottom'
  return MockNavBottom
})

// Mock PostureShareButton component
jest.mock('@app/clientComponents/exportPoses', () => {
  const MockPostureShareButton = ({ seriesData }: any) => (
    <div data-testid="posture-share-button">
      Share: {seriesData?.seriesName}
    </div>
  )
  MockPostureShareButton.displayName = 'MockPostureShareButton'
  return MockPostureShareButton
})

// Mock Next.js Image component
jest.mock('next/image', () => {
  const MockImage = ({ src, alt, height, width }: any) => (
    <img src={src} alt={alt} height={height} width={width} />
  )
  MockImage.displayName = 'MockImage'
  return MockImage
})

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: any) => <a href={href}>{children}</a>
  MockLink.displayName = 'MockLink'
  return MockLink
})

// Mock MUI icons
jest.mock('@mui/icons-material/Search', () => ({
  __esModule: true,
  default: () => <div data-testid="search-icon" />,
}))

// Create a test theme
const testTheme = createTheme({
  palette: {
    primary: {
      main: '#F6893D',
      light: '#FFBA6F',
      dark: '#C3581A',
      contrastText: '#000000',
    },
    navSplash: {
      main: '#185A77',
      light: 'rgba(248, 244, 242, 0.5)',
      dark: '#F8F4F2',
      contrastText: '#07020D',
    },
  },
  typography: {
    splashTitle: {
      fontSize: '3rem',
      fontWeight: '900',
      textTransform: 'capitalize',
      letterSpacing: '0.1rem',
    },
  },
})

// Sample test data
const mockSeriesData: FlowSeriesData[] = [
  {
    id: '1',
    seriesName: 'Sun Salutation A',
    seriesPostures: [
      'Mountain Pose;Stand tall with feet together',
      'Forward Fold;Bend forward from hips',
      'Chaturanga;Lower down with control',
    ],
    description: 'A classic yoga sequence to warm up the body',
    duration: '10 minutes',
    breath: '5 breaths per pose',
    image: '/images/sun-salutation.jpg',
  },
  {
    id: '2',
    seriesName: 'Hip Opening Series',
    seriesPostures: [
      'Pigeon Pose;Deep hip opener',
      'Butterfly Pose;Gentle hip stretch',
      'Low Lunge;Hip flexor stretch',
    ],
    description: 'Sequence focused on opening tight hips',
    duration: '15 minutes',
    breath: '8 breaths per pose',
    image: '/images/hip-opening.jpg',
  },
  {
    id: '3',
    seriesName: 'Backbend Flow',
    seriesPostures: [
      'Camel Pose;Heart opening backbend',
      'Bridge Pose;Gentle backbend',
      'Wheel Pose;Advanced backbend',
    ],
    description: 'Progressive backbending sequence',
    duration: '20 minutes',
    breath: '3-5 breaths per pose',
    image: '/images/backbend.jpg',
  },
]

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={testTheme}>{component}</ThemeProvider>)
}

describe('Practice Series Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock console.error to avoid noise in tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
    // Set up default mock response
    mockGetAllSeries.mockResolvedValue(mockSeriesData)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    // Clean up any pending timers or async operations
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  describe('Initial Rendering', () => {
    it('renders the main page components', async () => {
      renderWithTheme(<Page />)

      expect(screen.getByTestId('splash-header')).toBeInTheDocument()
      expect(screen.getByTestId('sub-nav-header')).toBeInTheDocument()
      expect(screen.getByTestId('nav-bottom')).toBeInTheDocument()
      expect(screen.getAllByText('Practice Series')[0]).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText('Search for a Series')
      ).toBeInTheDocument()
    })

    it('displays correct header information', () => {
      mockGetAllSeries.mockResolvedValue([])

      renderWithTheme(<Page />)

      const splashHeader = screen.getByTestId('splash-header')
      expect(splashHeader).toHaveTextContent('Practice Series')

      const subNavHeader = screen.getByTestId('sub-nav-header')
      expect(subNavHeader).toHaveTextContent('Back to Flows')
    })

    it('renders search interface with correct styling', () => {
      mockGetAllSeries.mockResolvedValue([])

      renderWithTheme(<Page />)

      const searchInput = screen.getByPlaceholderText('Search for a Series')
      expect(searchInput).toBeInTheDocument()
      expect(screen.getByTestId('search-icon')).toBeInTheDocument()
    })
  })

  describe('Data Fetching', () => {
    it('fetches series data on component mount', async () => {
      mockGetAllSeries.mockResolvedValue(mockSeriesData)

      renderWithTheme(<Page />)

      await waitFor(() => {
        expect(mockGetAllSeries).toHaveBeenCalledTimes(1)
      })
    })

    it('handles API error gracefully', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      mockGetAllSeries.mockRejectedValue(new Error('API Error'))

      renderWithTheme(<Page />)

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error fetching series:',
          expect.any(Error)
        )
      })
    })

    it('updates autocomplete options when data is fetched', async () => {
      const user = userEvent.setup()
      renderWithTheme(<Page />)

      await waitFor(
        () => {
          expect(mockGetAllSeries).toHaveBeenCalled()
        },
        { timeout: 5000 }
      )

      // Click on the autocomplete to open options
      const autocomplete = screen.getByRole('combobox')
      await user.click(autocomplete)

      await waitFor(
        () => {
          expect(screen.getByText('Sun Salutation A')).toBeInTheDocument()
          expect(screen.getByText('Hip Opening Series')).toBeInTheDocument()
          expect(screen.getByText('Backbend Flow')).toBeInTheDocument()
        },
        { timeout: 3000 }
      )
    })
  })

  describe('Search and Filtering', () => {
    beforeEach(async () => {
      mockGetAllSeries.mockResolvedValue(mockSeriesData)
    })

    it('filters series based on search input', async () => {
      const user = userEvent.setup()
      renderWithTheme(<Page />)

      await waitFor(() => {
        expect(mockGetAllSeries).toHaveBeenCalled()
      })

      const searchInput = screen.getByPlaceholderText('Search for a Series')

      // Type "Hip" to filter
      await user.type(searchInput, 'Hip')

      await waitFor(() => {
        expect(screen.getByText('Hip Opening Series')).toBeInTheDocument()
      })
    })

    it('shows all options when search is cleared', async () => {
      const user = userEvent.setup()
      renderWithTheme(<Page />)

      await waitFor(() => {
        expect(mockGetAllSeries).toHaveBeenCalled()
      })

      const searchInput = screen.getByPlaceholderText('Search for a Series')

      // Type and then clear
      await user.type(searchInput, 'Hip')
      await user.clear(searchInput)

      // Click to open dropdown
      fireEvent.click(searchInput)

      await waitFor(() => {
        expect(screen.getByText('Sun Salutation A')).toBeInTheDocument()
        expect(screen.getByText('Hip Opening Series')).toBeInTheDocument()
        expect(screen.getByText('Backbend Flow')).toBeInTheDocument()
      })
    })

    it('sorts series alphabetically', async () => {
      const user = userEvent.setup()
      mockGetAllSeries.mockResolvedValue([
        { ...mockSeriesData[2], seriesName: 'Zebra Series' },
        { ...mockSeriesData[1], seriesName: 'Alpha Series' },
        { ...mockSeriesData[0], seriesName: 'Beta Series' },
      ])

      renderWithTheme(<Page />)

      await waitFor(() => {
        expect(mockGetAllSeries).toHaveBeenCalled()
      })

      const searchInput = screen.getByPlaceholderText('Search for a Series')
      await user.click(searchInput)

      await waitFor(() => {
        const options = screen.getAllByRole('option')
        expect(options[0]).toHaveTextContent('Alpha Series')
        expect(options[1]).toHaveTextContent('Beta Series')
        expect(options[2]).toHaveTextContent('Zebra Series')
      })
    })
  })

  describe('Series Selection and Display', () => {
    beforeEach(async () => {
      mockGetAllSeries.mockResolvedValue(mockSeriesData)
    })

    it('displays selected series details', async () => {
      const user = userEvent.setup()
      renderWithTheme(<Page />)

      await waitFor(() => {
        expect(mockGetAllSeries).toHaveBeenCalled()
      })

      const searchInput = screen.getByPlaceholderText('Search for a Series')
      await user.click(searchInput)

      await waitFor(() => {
        expect(screen.getByText('Sun Salutation A')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Sun Salutation A'))

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Sun Salutation A' })
        ).toBeInTheDocument()
        expect(screen.getByText('Mountain Pose')).toBeInTheDocument()
        expect(
          screen.getByText('Stand tall with feet together')
        ).toBeInTheDocument()
        expect(
          screen.getByText('A classic yoga sequence to warm up the body')
        ).toBeInTheDocument()
      })
    })

    it('displays all postures with links', async () => {
      const user = userEvent.setup()
      renderWithTheme(<Page />)

      await waitFor(() => {
        expect(mockGetAllSeries).toHaveBeenCalled()
      })

      const searchInput = screen.getByPlaceholderText('Search for a Series')
      await user.click(searchInput)
      await user.click(screen.getByText('Sun Salutation A'))

      await waitFor(() => {
        // Check for posture links
        const mountainPoseLink = screen.getByRole('link', {
          name: 'Mountain Pose',
        })
        expect(mountainPoseLink).toHaveAttribute(
          'href',
          '/navigator/asanaPostures/Mountain Pose'
        )

        const forwardFoldLink = screen.getByRole('link', {
          name: 'Forward Fold',
        })
        expect(forwardFoldLink).toHaveAttribute(
          'href',
          '/navigator/asanaPostures/Forward Fold'
        )
      })
    })

    it('shows description section when series is selected', async () => {
      const user = userEvent.setup()
      renderWithTheme(<Page />)

      await waitFor(() => {
        expect(mockGetAllSeries).toHaveBeenCalled()
      })

      const searchInput = screen.getByPlaceholderText('Search for a Series')
      await user.click(searchInput)
      await user.click(screen.getByText('Hip Opening Series'))

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Description' })
        ).toBeInTheDocument()
        expect(
          screen.getByText('Sequence focused on opening tight hips')
        ).toBeInTheDocument()
      })
    })

    it('shows PostureShareButton when series is selected', async () => {
      const user = userEvent.setup()
      renderWithTheme(<Page />)

      await waitFor(() => {
        expect(mockGetAllSeries).toHaveBeenCalled()
      })

      const searchInput = screen.getByPlaceholderText('Search for a Series')
      await user.click(searchInput)
      await user.click(screen.getByText('Backbend Flow'))

      await waitFor(() => {
        expect(screen.getByTestId('posture-share-button')).toBeInTheDocument()
        expect(screen.getByText('Share: Backbend Flow')).toBeInTheDocument()
      })
    })

    it('handles series selection with null value', async () => {
      renderWithTheme(<Page />)

      // Simulate selecting null (clearing selection)
      const searchInput = screen.getByPlaceholderText('Search for a Series')
      fireEvent.change(searchInput, { target: { value: '' } })

      // Should not display any series details
      expect(
        screen.queryByRole('heading', {
          name: /Sun Salutation A|Hip Opening Series|Backbend Flow/,
        })
      ).not.toBeInTheDocument()
    })
  })

  describe('Info Drawer Functionality', () => {
    it('opens drawer when help button is clicked', async () => {
      mockGetAllSeries.mockResolvedValue([])
      renderWithTheme(<Page />)

      const helpButton = screen.getByTestId('help-button')
      fireEvent.click(helpButton)

      await waitFor(() => {
        expect(
          screen.getByText('Pick a Series to practice.')
        ).toBeInTheDocument()
      })
    })

    it('closes drawer when clicked outside', async () => {
      mockGetAllSeries.mockResolvedValue([])
      renderWithTheme(<Page />)

      const helpButton = screen.getByTestId('help-button')
      fireEvent.click(helpButton)

      await waitFor(() => {
        expect(
          screen.getByText('Pick a Series to practice.')
        ).toBeInTheDocument()
      })

      // Find the backdrop and click it
      const backdrop = document.querySelector('.MuiBackdrop-root')
      if (backdrop) {
        fireEvent.click(backdrop)
      }

      await waitFor(() => {
        expect(
          screen.queryByText('Pick a Series to practice.')
        ).not.toBeInTheDocument()
      })
    })

    it('toggles drawer state correctly', async () => {
      mockGetAllSeries.mockResolvedValue([])
      renderWithTheme(<Page />)

      const helpButton = screen.getByTestId('help-button')

      // Open drawer
      fireEvent.click(helpButton)
      await waitFor(() => {
        expect(
          screen.getByText('Pick a Series to practice.')
        ).toBeInTheDocument()
      })

      // Close drawer by clicking help button again
      fireEvent.click(helpButton)
      await waitFor(() => {
        expect(
          screen.queryByText('Pick a Series to practice.')
        ).not.toBeInTheDocument()
      })
    })
  })

  describe('Component Integration', () => {
    it('passes correct props to NavBottom', () => {
      mockGetAllSeries.mockResolvedValue([])
      renderWithTheme(<Page />)

      const navBottom = screen.getByTestId('nav-bottom')
      expect(navBottom).toHaveTextContent('Navigation: /navigator/flows')
    })

    it('passes correct props to SplashHeader', () => {
      mockGetAllSeries.mockResolvedValue([])
      renderWithTheme(<Page />)

      const splashHeader = screen.getByTestId('splash-header')
      const image = splashHeader.querySelector('img')
      expect(image).toHaveAttribute(
        'src',
        '/images/series/series-practice-splash-header.png'
      )
      expect(image).toHaveAttribute('alt', 'Practice Series')
    })

    it('passes correct props to SubNavHeader', () => {
      mockGetAllSeries.mockResolvedValue([])
      renderWithTheme(<Page />)

      const subNavHeader = screen.getByTestId('sub-nav-header')
      const link = subNavHeader.querySelector('a')
      expect(link).toHaveAttribute('href', '/navigator/flows')
    })
  })

  describe('Responsive Layout', () => {
    it('renders with correct layout structure', () => {
      mockGetAllSeries.mockResolvedValue([])
      renderWithTheme(<Page />)

      // Check the main container styling by finding the outermost Box
      const mainBoxes = document.querySelectorAll('.MuiBox-root')
      expect(mainBoxes.length).toBeGreaterThan(0)

      // The outermost Box should have the flex styles
      const mainContainer = mainBoxes[0] as HTMLElement
      const computedStyles = window.getComputedStyle(mainContainer)
      expect(computedStyles.display).toBe('flex')
      expect(computedStyles.flexDirection).toBe('column')
    })

    it('includes proper spacing elements', () => {
      mockGetAllSeries.mockResolvedValue([])
      renderWithTheme(<Page />)

      // Check for the spacer box at the bottom by looking for Box with height style
      const boxes = document.querySelectorAll('.MuiBox-root')
      const spacerBox = Array.from(boxes).find((box) => {
        const style = window.getComputedStyle(box)
        return style.height === '72px'
      })
      expect(spacerBox).toBeTruthy()
    })
  })

  describe('Error Handling', () => {
    it('continues to function when series data is empty', async () => {
      mockGetAllSeries.mockResolvedValue([])

      renderWithTheme(<Page />)

      await waitFor(() => {
        expect(mockGetAllSeries).toHaveBeenCalled()
      })

      const searchInput = screen.getByPlaceholderText('Search for a Series')
      expect(searchInput).toBeInTheDocument()

      // Should not crash when clicking on empty autocomplete
      fireEvent.click(searchInput)
      expect(screen.queryByRole('option')).not.toBeInTheDocument()
    })

    it('handles malformed series data gracefully', async () => {
      const user = userEvent.setup()
      const malformedData = [
        {
          id: '1',
          seriesName: 'Test Series',
          seriesPostures: ['Invalid;Posture;Format;With;Too;Many;Parts'],
          description: 'Test description',
        },
      ] as FlowSeriesData[]

      mockGetAllSeries.mockResolvedValue(malformedData)

      renderWithTheme(<Page />)

      await waitFor(() => {
        expect(mockGetAllSeries).toHaveBeenCalled()
      })

      const searchInput = screen.getByPlaceholderText('Search for a Series')
      await user.click(searchInput)

      await waitFor(() => {
        expect(screen.getByText('Test Series')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Test Series'))

      // Should still render the series name
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Test Series' })
        ).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', async () => {
      mockGetAllSeries.mockResolvedValue(mockSeriesData)
      renderWithTheme(<Page />)

      await waitFor(() => {
        expect(mockGetAllSeries).toHaveBeenCalled()
      })

      const combobox = screen.getByRole('combobox')
      expect(combobox).toBeInTheDocument()

      // Check for proper labeling
      expect(
        screen.getByPlaceholderText('Search for a Series')
      ).toBeInTheDocument()
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      mockGetAllSeries.mockResolvedValue(mockSeriesData)
      renderWithTheme(<Page />)

      await waitFor(() => {
        expect(mockGetAllSeries).toHaveBeenCalled()
      })

      const searchInput = screen.getByPlaceholderText('Search for a Series')

      // Focus and navigate with keyboard
      await user.click(searchInput)
      await user.keyboard('{ArrowDown}')

      // Should be able to navigate options
      await waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveFocus()
      })
    })
  })
})
