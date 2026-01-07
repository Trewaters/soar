import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '../../../styles/theme'
import PracticeHistoryChart from '@clientComponents/PracticeHistoryChart'

// Mock recharts components
jest.mock('recharts', () => ({
  BarChart: ({ children, data }: any) => (
    <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Bar: ({ dataKey, fill }: any) => (
    <div data-testid="bar" data-key={dataKey} data-fill={fill} />
  ),
  XAxis: ({ dataKey }: any) => <div data-testid="x-axis" data-key={dataKey} />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('PracticeHistoryChart', () => {
  // Mock offsetWidth for the container
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 800,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Happy Path - Chart Rendering', () => {
    it('should render the chart with valid practice history data', async () => {
      const mockData = [
        { month: 'Nov 24', days: 14 },
        { month: 'Dec 24', days: 18 },
        { month: 'Jan 25', days: 12 },
        { month: 'Feb 25', days: 15 },
        { month: 'Mar 25', days: 19 },
        { month: 'Apr 25', days: 22 },
        { month: 'May 25', days: 25 },
        { month: 'Jun 25', days: 28 },
        { month: 'Jul 25', days: 30 },
        { month: 'Aug 25', days: 27 },
        { month: 'Sep 25', days: 24 },
        { month: 'Oct 25', days: 20 },
      ]

      render(<PracticeHistoryChart data={mockData} />, { wrapper: TestWrapper })

      // Wait for the chart to render (after useEffect timing)
      await waitFor(
        () => {
          expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Verify chart components are rendered
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
      expect(screen.getByTestId('bar')).toBeInTheDocument()
      expect(screen.getByTestId('x-axis')).toBeInTheDocument()
      expect(screen.getByTestId('y-axis')).toBeInTheDocument()
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument()
      expect(screen.getByTestId('tooltip')).toBeInTheDocument()
    })

    it('should pass correct data to the BarChart component', async () => {
      const mockData = [
        { month: 'Nov 24', days: 14 },
        { month: 'Dec 24', days: 18 },
        { month: 'Jan 25', days: 12 },
      ]

      render(<PracticeHistoryChart data={mockData} />, { wrapper: TestWrapper })

      await waitFor(
        () => {
          const barChart = screen.getByTestId('bar-chart')
          expect(barChart).toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const barChart = screen.getByTestId('bar-chart')
      const chartData = JSON.parse(
        barChart.getAttribute('data-chart-data') || '[]'
      )

      expect(chartData).toEqual(mockData)
      expect(chartData).toHaveLength(3)
    })

    it('should use the correct theme color for bars', async () => {
      const mockData = [{ month: 'Oct 25', days: 20 }]

      render(<PracticeHistoryChart data={mockData} />, { wrapper: TestWrapper })

      await waitFor(
        () => {
          expect(screen.getByTestId('bar')).toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const bar = screen.getByTestId('bar')
      expect(bar).toHaveAttribute('data-fill', '#FFA726')
      expect(bar).toHaveAttribute('data-key', 'days')
    })

    it('should configure XAxis with the correct dataKey', async () => {
      const mockData = [{ month: 'Oct 25', days: 20 }]

      render(<PracticeHistoryChart data={mockData} />, { wrapper: TestWrapper })

      await waitFor(
        () => {
          expect(screen.getByTestId('x-axis')).toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const xAxis = screen.getByTestId('x-axis')
      expect(xAxis).toHaveAttribute('data-key', 'month')
    })
  })

  describe('Edge Cases', () => {
    it('should not render chart when data is empty array', () => {
      const { container } = render(<PracticeHistoryChart data={[]} />, {
        wrapper: TestWrapper,
      })

      expect(container.firstChild).toBeNull()
    })

    it('should not render chart when data is null', () => {
      const { container } = render(
        <PracticeHistoryChart data={null as any} />,
        {
          wrapper: TestWrapper,
        }
      )

      expect(container.firstChild).toBeNull()
    })

    it('should not render chart when data is undefined', () => {
      const { container } = render(
        <PracticeHistoryChart data={undefined as any} />,
        {
          wrapper: TestWrapper,
        }
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Responsive Behavior', () => {
    it('should handle container width measurement', async () => {
      const mockData = [{ month: 'Oct 25', days: 20 }]

      render(<PracticeHistoryChart data={mockData} />, { wrapper: TestWrapper })

      await waitFor(
        () => {
          expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Chart should render after measuring container width
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    })

    it('should render chart with 12 months of data', async () => {
      const mockData = [
        { month: 'Nov 24', days: 14 },
        { month: 'Dec 24', days: 18 },
        { month: 'Jan 25', days: 12 },
        { month: 'Feb 25', days: 15 },
        { month: 'Mar 25', days: 19 },
        { month: 'Apr 25', days: 22 },
        { month: 'May 25', days: 25 },
        { month: 'Jun 25', days: 28 },
        { month: 'Jul 25', days: 30 },
        { month: 'Aug 25', days: 27 },
        { month: 'Sep 25', days: 24 },
        { month: 'Oct 25', days: 20 },
      ]

      render(<PracticeHistoryChart data={mockData} />, { wrapper: TestWrapper })

      await waitFor(
        () => {
          expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const barChart = screen.getByTestId('bar-chart')
      const chartData = JSON.parse(
        barChart.getAttribute('data-chart-data') || '[]'
      )

      expect(chartData).toHaveLength(12)
    })
  })

  describe('Data Validation', () => {
    it('should handle single month data point', async () => {
      const mockData = [{ month: 'Oct 25', days: 20 }]

      render(<PracticeHistoryChart data={mockData} />, { wrapper: TestWrapper })

      await waitFor(
        () => {
          expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const barChart = screen.getByTestId('bar-chart')
      const chartData = JSON.parse(
        barChart.getAttribute('data-chart-data') || '[]'
      )

      expect(chartData).toHaveLength(1)
      expect(chartData[0]).toEqual({ month: 'Oct 25', days: 20 })
    })

    it('should handle zero days in practice data', async () => {
      const mockData = [
        { month: 'Oct 25', days: 0 },
        { month: 'Nov 25', days: 15 },
      ]

      render(<PracticeHistoryChart data={mockData} />, { wrapper: TestWrapper })

      await waitFor(
        () => {
          expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const barChart = screen.getByTestId('bar-chart')
      const chartData = JSON.parse(
        barChart.getAttribute('data-chart-data') || '[]'
      )

      expect(chartData).toContainEqual({ month: 'Oct 25', days: 0 })
      expect(chartData).toContainEqual({ month: 'Nov 25', days: 15 })
    })
  })
})
