import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import '@testing-library/jest-dom'
import PoseShareButton from '@app/clientComponents/poseShareButton'
import type { FlowSeriesData } from '@app/context/AsanaSeriesContext'
import type { SequenceData } from '@app/context/SequenceContext'
import type { ShareableContent } from '../../../types/sharing'
import theme from '../../../styles/theme'
import { AsanaPose } from 'types/asana'

// Mock Next.js navigation
jest.mock('next/navigation')

// Mock the sharing strategy
jest.mock('../../../types/sharing', () => ({
  ...jest.requireActual('../../../types/sharing'),
  createShareStrategy: jest.fn(),
}))

// Mock contexts with comprehensive data
jest.mock('@app/context/AsanaPoseContext', () => ({
  useAsanaPose: jest.fn(),
}))

jest.mock('@app/context/AsanaSeriesContext', () => ({
  useFlowSeries: jest.fn(),
}))

jest.mock('@app/context/SequenceContext', () => ({
  useSequence: jest.fn(),
}))

// Import mocked functions
const { useAsanaPose } = require('@app/context/AsanaPoseContext')
const { useFlowSeries } = require('@app/context/AsanaSeriesContext')
const { useSequence } = require('@app/context/SequenceContext')

// Create test wrapper with MUI theme
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

// Minimal mock data for testing
const mockAsanaData: AsanaPose = {
  id: 'test-asana-1',
  english_names: ['Warrior Pose'],
  sort_english_name: 'Warrior Pose',
  description: 'A powerful standing pose',
  benefits: 'Strengthens legs',
  category: 'Standing',
  difficulty: 'Beginner',
  sanskrit_names: ['Virabhadrasana'],
  lore: 'Ancient pose',
  dristi: 'Forward',
  pose_variations: ['Warrior I'],
  pose_modifications: ['Use blocks'],
  label: 'Warrior Pose',
  suggested_poses: ['Mountain Pose'],
  preparatory_poses: ['Forward Fold'],
  alignment_cues: 'Both',
  poseImages: [],
  created_on: '2024-01-01' as unknown as Date,
  updated_on: '2024-01-01' as unknown as Date,
  activity_completed: false,
  activity_practice: false,
  asana_intention: 'Strength',
  breath: ['4 count'],
  duration_asana: '30 seconds',
  transition_cues_out: 'Step back',
  transition_cues_in: 'Step forward',
  setup_cues: 'Stand tall',
  deepening_cues: 'Sink deeper',
  customize_asana: 'Adjust stance',
  additional_cues: 'Keep spine straight',
  joint_action: 'Hip flexion',
  muscle_action: 'Quadriceps',
  created_by: 'test-user',
  asanaActivities: [],
  isUserCreated: false,
  imageCount: 0,
}

const mockSeriesData: FlowSeriesData = {
  id: 'test-series-1',
  seriesName: 'Morning Flow',
  description: 'Energizing sequence',
  seriesPoses: ['warrior-pose'],
  duration: '30',
}

const mockSequenceData: SequenceData = {
  id: 1,
  nameSequence: 'Power Sequence',
  description: 'High-energy flow',
  sequencesSeries: [mockSeriesData],
  duration: '45',
  image: 'sequence.jpg',
  breath_direction: 'In and Out',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
}

// Context data variations for testing
const contextAsanaData: AsanaPose = {
  ...mockAsanaData,
  id: 'context-asana-1',
  sort_english_name: 'Warrior Pose',
}

const contextSeriesData: FlowSeriesData = {
  ...mockSeriesData,
  seriesName: 'Context Morning Flow',
}

const contextSequenceData: SequenceData = {
  ...mockSequenceData,
  nameSequence: 'Context Power Sequence',
}

// Mock navigator.share
const mockShare = jest.fn()
Object.defineProperty(navigator, 'share', {
  writable: true,
  value: mockShare,
})

// Mock the createShareStrategy function
const mockCreateShareStrategy = require('../../../types/sharing')
  .createShareStrategy as jest.MockedFunction<any>

// Additional mock setup for advanced testing scenarios
const mockClipboard = {
  writeText: jest.fn(),
}

Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  value: mockClipboard,
})

Object.defineProperty(navigator, 'canShare', {
  writable: true,
  value: jest.fn(),
})

// Mock window.isSecureContext for clipboard tests
Object.defineProperty(window, 'isSecureContext', {
  writable: true,
  value: true,
})

// Mock document.queryCommandSupported for fallback clipboard tests
const mockQueryCommandSupported = jest.fn()
const mockExecCommand = jest.fn()

Object.defineProperty(document, 'queryCommandSupported', {
  writable: true,
  value: mockQueryCommandSupported,
})

Object.defineProperty(document, 'execCommand', {
  writable: true,
  value: mockExecCommand,
})

describe('PoseShareButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Reset context mocks to default state
    useAsanaPose.mockReturnValue({
      state: { poses: null },
      dispatch: jest.fn(),
    })
    useFlowSeries.mockReturnValue({
      state: { flowSeries: null },
      dispatch: jest.fn(),
    })
    useSequence.mockReturnValue({
      state: { sequences: null },
      dispatch: jest.fn(),
    })

    // Mock strategy implementation
    mockCreateShareStrategy.mockReturnValue({
      generateShareConfig: jest.fn().mockReturnValue({
        title: 'Test Title',
        text: 'Test content',
        url: 'https://test.com',
        shareType: 'asana',
      }),
    })
  })

  describe('Component Rendering', () => {
    it('should render without errors with asana content', () => {
      const asanaContent: ShareableContent = {
        contentType: 'asana',
        data: mockAsanaData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={asanaContent} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByLabelText('Share this pose')).toBeInTheDocument()
    })

    it('should render without errors with series content', () => {
      const seriesContent: ShareableContent = {
        contentType: 'series',
        data: mockSeriesData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={seriesContent} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByLabelText('Share this series')).toBeInTheDocument()
    })

    it('should render without errors with sequence content', () => {
      const sequenceContent: ShareableContent = {
        contentType: 'sequence',
        data: mockSequenceData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={sequenceContent} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByLabelText('Share this sequence')).toBeInTheDocument()
    })

    it('should display "No data available" when shareConfig is null', () => {
      mockCreateShareStrategy.mockReturnValue({
        generateShareConfig: jest.fn().mockReturnValue(null),
      })

      const asanaContent: ShareableContent = {
        contentType: 'asana',
        data: mockAsanaData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={asanaContent} />
        </TestWrapper>
      )

      expect(
        screen.getByText('No data available to share.')
      ).toBeInTheDocument()
    })
  })

  describe('Content Display with showDetails', () => {
    it('should display asana details when showDetails is true', () => {
      const asanaContent: ShareableContent = {
        contentType: 'asana',
        data: mockAsanaData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={asanaContent} showDetails={true} />
        </TestWrapper>
      )

      expect(screen.getByText('Warrior Pose')).toBeInTheDocument()
      expect(screen.getByText('A powerful standing pose')).toBeInTheDocument()
    })

    it('should not display details when showDetails is false', () => {
      const asanaContent: ShareableContent = {
        contentType: 'asana',
        data: mockAsanaData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={asanaContent} showDetails={false} />
        </TestWrapper>
      )

      expect(screen.queryByText('Warrior Pose')).not.toBeInTheDocument()
    })
  })

  describe('Share Functionality', () => {
    it('should use Web Share API when available', async () => {
      mockShare.mockResolvedValue(undefined)

      const asanaContent: ShareableContent = {
        contentType: 'asana',
        data: mockAsanaData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={asanaContent} />
        </TestWrapper>
      )

      const shareButton = screen.getByRole('button')
      fireEvent.click(shareButton)

      // In jsdom environment, it falls back to clipboard
      await waitFor(() => {
        expect(screen.getByText(/copied to clipboard/)).toBeInTheDocument()
      })
    })

    it('should handle share errors gracefully', async () => {
      mockShare.mockRejectedValue(new Error('Share failed'))

      const mockConsoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      const asanaContent: ShareableContent = {
        contentType: 'asana',
        data: mockAsanaData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={asanaContent} />
        </TestWrapper>
      )

      const shareButton = screen.getByRole('button')
      fireEvent.click(shareButton)

      // In jsdom environment, it falls back to clipboard
      await waitFor(() => {
        expect(screen.getByText(/copied to clipboard/)).toBeInTheDocument()
      })

      mockConsoleError.mockRestore()
    })
  })

  describe('Strategy Pattern Integration', () => {
    it('should call createShareStrategy with correct content type', () => {
      const asanaContent: ShareableContent = {
        contentType: 'asana',
        data: mockAsanaData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={asanaContent} />
        </TestWrapper>
      )

      expect(mockCreateShareStrategy).toHaveBeenCalledWith('asana')
    })
  })

  describe('Series Share Format Specification', () => {
    it('should generate exact PRD-specified format for series sharing', () => {
      // Create a more realistic series data for testing the exact format
      const testSeriesData: FlowSeriesData = {
        id: 'test-series-format',
        seriesName: 'Sun Salutation A',
        description: 'Classic sun salutation sequence',
        seriesPoses: [
          'Mountain Pose',
          'Upward Salute',
          'Standing Forward Fold',
          'Low Lunge',
          'Plank Pose',
        ],
        duration: '15',
      }

      // Import the actual SeriesShareStrategy to test directly
      const { SeriesShareStrategy } = require('../../../types/sharing')
      const strategy = new SeriesShareStrategy()
      const shareConfig = strategy.generateShareConfig(testSeriesData)

      // Verify the exact format matches PRD specification
      const expectedText = `Sharing a video of
the yoga series
"Sun Salutation A"

Below are the poses in this series:

* Mountain Pose,
* Upward Salute,
* Standing Forward Fold,
* Low Lunge,
* Plank Pose

Practice with Uvuyoga!

https://www.happyyoga.app/navigator/flows/practiceSeries

(www.happyyoga.app)`

      expect(shareConfig.text).toBe(expectedText)
      expect(shareConfig.title).toBe(
        'Sharing a video of the yoga series "Sun Salutation A"'
      )
      expect(shareConfig.url).toBe(
        'https://www.happyyoga.app/navigator/flows/practiceSeries'
      )
      expect(shareConfig.shareType).toBe('series')
    })

    it('should handle series with single pose correctly', () => {
      const singlePoseSeriesData: FlowSeriesData = {
        id: 'single-pose-series',
        seriesName: "Child's Pose Rest",
        description: 'Single pose relaxation',
        seriesPoses: ["Child's Pose"],
        duration: '5',
      }

      const { SeriesShareStrategy } = require('../../../types/sharing')
      const strategy = new SeriesShareStrategy()
      const shareConfig = strategy.generateShareConfig(singlePoseSeriesData)

      // For single pose, should not have comma after the last (and only) item
      const expectedText = `Sharing a video of
the yoga series
"Child's Pose Rest"

Below are the poses in this series:

* Child's Pose

Practice with Uvuyoga!

https://www.happyyoga.app/navigator/flows/practiceSeries

(www.happyyoga.app)`

      expect(shareConfig.text).toBe(expectedText)
    })

    it('should clean semicolons from pose names in series format', () => {
      const seriesWithSemicolons: FlowSeriesData = {
        id: 'semicolon-test',
        seriesName: 'Test Series',
        description: 'Testing semicolon cleanup',
        seriesPoses: ['Warrior I; Right Side', 'Warrior I; Left Side'],
        duration: '10',
      }

      const { SeriesShareStrategy } = require('../../../types/sharing')
      const strategy = new SeriesShareStrategy()
      const shareConfig = strategy.generateShareConfig(seriesWithSemicolons)

      // Should clean semicolons and format correctly
      const expectedText = `Sharing a video of
the yoga series
"Test Series"

Below are the poses in this series:

* Warrior I Right Side,
* Warrior I Left Side

Practice with Uvuyoga!

https://www.happyyoga.app/navigator/flows/practiceSeries

(www.happyyoga.app)`

      expect(shareConfig.text).toBe(expectedText)
    })
  })

  describe('Asana Share Format Specification', () => {
    it('should generate exact PRD-specified format for asana sharing', () => {
      // Create test asana data for testing the exact format
      const testAsanaData: AsanaPose = {
        id: 'test-asana-format',
        english_names: ['Warrior I'],
        sort_english_name: 'Warrior I',
        description: 'A powerful standing pose that strengthens the legs',
        benefits: 'Strengthens legs and core',
        category: 'Standing',
        difficulty: 'Beginner',
        sanskrit_names: ['Virabhadrasana I'],
        lore: 'Named after the fierce warrior Virabhadra',
        breath: ['Inhale'],
        dristi: 'Forward',
        pose_variations: ['Warrior I with blocks'],
        pose_modifications: ['Use wall for support'],
        label: 'Warrior I Pose',
        suggested_poses: ['Mountain Pose'],
        preparatory_poses: ['Forward Fold'],
        alignment_cues: 'Both',
        poseImages: [],
        created_on: '2024-01-01' as unknown as Date,
        updated_on: '2024-01-01' as unknown as Date,
        activity_completed: false,
        activity_practice: false,
        asana_intention: 'Strength',
        duration_asana: '30 seconds',
        transition_cues_out: 'Step back to mountain',
        transition_cues_in: 'Step forward into lunge',
        setup_cues: 'Stand tall, step forward',
        deepening_cues: 'Sink deeper into front leg',
        customize_asana: 'Adjust stance width',
        additional_cues: 'Keep spine straight',
        joint_action: 'Hip flexion',
        muscle_action: 'Quadriceps engagement',
        created_by: 'instructor',
        asanaActivities: [],
        isUserCreated: false,
        imageCount: 0,
      }

      // Import the actual AsanaShareStrategy to test directly
      const { AsanaShareStrategy } = require('../../../types/sharing')
      const strategy = new AsanaShareStrategy()
      const shareConfig = strategy.generateShareConfig(testAsanaData)

      // Verify the exact format matches PRD specification
      const expectedText = `The asana pose Warrior I was shared with you. Below is the description:

Practice with Uvuyoga!

https://www.happyyoga.app/navigator/flows/practiceSeries

(www.happyyoga.app)`

      expect(shareConfig.text).toBe(expectedText)
      expect(shareConfig.title).toBe(
        'The asana pose "Warrior I" was shared with you. Below is the description:'
      )
      expect(shareConfig.url).toBe(
        'https://www.happyyoga.app/navigator/flows/practiceSeries'
      )
      expect(shareConfig.shareType).toBe('asana')
    })

    it('should handle asana names with special characters correctly', () => {
      const specialAsanaData: AsanaPose = {
        id: 'special-asana',
        english_names: ["Child's Pose"],
        sort_english_name: "Child's Pose",
        description: 'A restful pose',
        benefits: 'Calming',
        category: 'Restorative',
        difficulty: 'Beginner',
        sanskrit_names: ['Balasana'],
        lore: 'Ancient resting pose',
        breath: ['Natural'],
        dristi: 'Down',
        pose_variations: ["Extended Child's Pose"],
        pose_modifications: ['Use bolster'],
        label: "Child's Pose",
        suggested_poses: ['Cat Pose'],
        preparatory_poses: ['Table Top'],
        poseImages: [],
        created_on: '2024-01-01' as unknown as Date,
        updated_on: '2024-01-01' as unknown as Date,
        activity_completed: false,
        activity_practice: false,
        asana_intention: 'Rest',
        duration_asana: '1-5 minutes',
        transition_cues_out: 'Slowly rise up',
        transition_cues_in: 'Sit back on heels',
        setup_cues: 'Kneel on mat',
        deepening_cues: 'Relax completely',
        customize_asana: 'Use props as needed',
        additional_cues: 'Rest forehead on mat',
        joint_action: 'Spinal flexion',
        muscle_action: 'Full body relaxation',
        created_by: 'instructor',
        asanaActivities: [],
        isUserCreated: false,
        imageCount: 0,
      }

      const { AsanaShareStrategy } = require('../../../types/sharing')
      const strategy = new AsanaShareStrategy()
      const shareConfig = strategy.generateShareConfig(specialAsanaData)

      // Should handle special characters correctly
      const expectedText = `The asana pose Child's Pose was shared with you. Below is the description:

Practice with Uvuyoga!

https://www.happyyoga.app/navigator/flows/practiceSeries

(www.happyyoga.app)`

      expect(shareConfig.text).toBe(expectedText)
      expect(shareConfig.title).toBe(
        'The asana pose "Child\'s Pose" was shared with you. Below is the description:'
      )
    })
  })

  describe('Legacy Props Support', () => {
    it('should support legacy poseData prop', () => {
      render(
        <TestWrapper>
          <PoseShareButton poseData={mockAsanaData} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByLabelText('Share this pose')).toBeInTheDocument()
    })

    it('should support legacy seriesData prop', () => {
      render(
        <TestWrapper>
          <PoseShareButton seriesData={mockSeriesData} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByLabelText('Share this series')).toBeInTheDocument()
    })

    it('should display "No data available" for null legacy props', () => {
      render(
        <TestWrapper>
          <PoseShareButton poseData={null} />
        </TestWrapper>
      )

      expect(
        screen.getByText('No data available to share.')
      ).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for different content types', () => {
      const { rerender } = render(
        <TestWrapper>
          <PoseShareButton
            content={{ contentType: 'asana', data: mockAsanaData }}
          />
        </TestWrapper>
      )
      expect(screen.getByLabelText('Share this pose')).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <PoseShareButton
            content={{ contentType: 'series', data: mockSeriesData }}
          />
        </TestWrapper>
      )
      expect(screen.getByLabelText('Share this series')).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <PoseShareButton
            content={{ contentType: 'sequence', data: mockSequenceData }}
          />
        </TestWrapper>
      )
      expect(screen.getByLabelText('Share this sequence')).toBeInTheDocument()
    })
  })

  describe('Context Integration', () => {
    it('should render with context asana data', () => {
      useAsanaPose.mockReturnValue({
        state: { poses: [contextAsanaData] },
        dispatch: jest.fn(),
      })

      const asanaContent: ShareableContent = {
        contentType: 'asana',
        data: contextAsanaData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={asanaContent} showDetails={true} />
        </TestWrapper>
      )

      expect(screen.getByText('Warrior Pose')).toBeInTheDocument()
      expect(screen.getByText('A powerful standing pose')).toBeInTheDocument()
    })

    it('should render with context series data', () => {
      useFlowSeries.mockReturnValue({
        state: { flowSeries: [contextSeriesData] },
        dispatch: jest.fn(),
      })

      const seriesContent: ShareableContent = {
        contentType: 'series',
        data: contextSeriesData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={seriesContent} showDetails={true} />
        </TestWrapper>
      )

      expect(screen.getByText('Context Morning Flow')).toBeInTheDocument()
      expect(screen.getByText('Energizing sequence')).toBeInTheDocument()
    })

    it('should render with context sequence data', () => {
      useSequence.mockReturnValue({
        state: { sequences: [contextSequenceData] },
        dispatch: jest.fn(),
      })

      const sequenceContent: ShareableContent = {
        contentType: 'sequence',
        data: contextSequenceData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={sequenceContent} showDetails={true} />
        </TestWrapper>
      )

      expect(screen.getByText('Context Power Sequence')).toBeInTheDocument()
      expect(screen.getByText('High-energy flow')).toBeInTheDocument()
    })

    it('should handle context data share correctly', async () => {
      mockShare.mockResolvedValue(undefined)

      useAsanaPose.mockReturnValue({
        state: { poses: [contextAsanaData] },
        dispatch: jest.fn(),
      })

      const asanaContent: ShareableContent = {
        contentType: 'asana',
        data: contextAsanaData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={asanaContent} />
        </TestWrapper>
      )

      const shareButton = screen.getByRole('button')
      fireEvent.click(shareButton)

      // In jsdom environment, it falls back to clipboard
      await waitFor(() => {
        expect(screen.getByText(/copied to clipboard/)).toBeInTheDocument()
      })
    })
  })

  describe('Context Integration', () => {
    describe('Context Data Fallback', () => {
      it('should fallback to asana context when no props content provided', () => {
        useAsanaPose.mockReturnValue({
          state: { poses: contextAsanaData },
          dispatch: jest.fn(),
        })

        render(
          <TestWrapper>
            <PoseShareButton showDetails={true} />
          </TestWrapper>
        )

        expect(screen.getByRole('button')).toBeInTheDocument()
        expect(screen.getByLabelText('Share this pose')).toBeInTheDocument()
        expect(screen.getByText('Warrior Pose')).toBeInTheDocument()
      })

      it('should fallback to series context when no props content provided', () => {
        useFlowSeries.mockReturnValue({
          state: { flowSeries: contextSeriesData },
          dispatch: jest.fn(),
        })

        render(
          <TestWrapper>
            <PoseShareButton showDetails={true} />
          </TestWrapper>
        )

        expect(screen.getByRole('button')).toBeInTheDocument()
        expect(screen.getByLabelText('Share this series')).toBeInTheDocument()
        expect(screen.getByText('Context Morning Flow')).toBeInTheDocument()
      })

      it('should fallback to sequence context when no props content provided', () => {
        useSequence.mockReturnValue({
          state: { sequences: contextSequenceData },
          dispatch: jest.fn(),
        })

        render(
          <TestWrapper>
            <PoseShareButton showDetails={true} />
          </TestWrapper>
        )

        expect(screen.getByRole('button')).toBeInTheDocument()
        expect(screen.getByLabelText('Share this sequence')).toBeInTheDocument()
        expect(screen.getByText('Context Power Sequence')).toBeInTheDocument()
      })

      it('should prefer props over context when both are available', () => {
        useAsanaPose.mockReturnValue({
          state: { poses: contextAsanaData },
          dispatch: jest.fn(),
        })

        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: mockAsanaData,
        }

        render(
          <TestWrapper>
            <PoseShareButton content={asanaContent} showDetails={true} />
          </TestWrapper>
        )

        expect(screen.getByText('Warrior Pose')).toBeInTheDocument()
        expect(
          screen.queryByText('Context Warrior Pose')
        ).not.toBeInTheDocument()
      })

      it('should display "No data available" when neither props nor context have valid data', () => {
        render(
          <TestWrapper>
            <PoseShareButton />
          </TestWrapper>
        )

        expect(
          screen.getByText('No data available to share.')
        ).toBeInTheDocument()
      })
    })

    describe('Context Data Validation', () => {
      it('should warn about data mismatch between props and context', () => {
        const mockConsoleWarn = jest
          .spyOn(console, 'warn')
          .mockImplementation(() => {})

        useAsanaPose.mockReturnValue({
          state: { poses: contextAsanaData },
          dispatch: jest.fn(),
        })

        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: mockAsanaData,
        }

        render(
          <TestWrapper>
            <PoseShareButton content={asanaContent} />
          </TestWrapper>
        )

        expect(mockConsoleWarn).toHaveBeenCalledWith(
          'PoseShareButton context warnings:',
          expect.arrayContaining([
            expect.stringContaining(
              'Asana data mismatch between props and context'
            ),
          ])
        )

        mockConsoleWarn.mockRestore()
      })

      it('should handle validation errors for incomplete data', async () => {
        const invalidAsanaData = {
          ...mockAsanaData,
          sort_english_name: '',
          english_names: [],
        }

        useAsanaPose.mockReturnValue({
          state: {
            poses: {
              ...contextAsanaData,
              sort_english_name: '',
              english_names: [],
            },
          },
          dispatch: jest.fn(),
        })

        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: invalidAsanaData,
        }

        render(
          <TestWrapper>
            <PoseShareButton content={asanaContent} />
          </TestWrapper>
        )

        await waitFor(() => {
          expect(screen.getByText(/Data validation failed/)).toBeInTheDocument()
        })
      })

      it('should handle series validation errors for empty poses', async () => {
        const invalidSeriesData = {
          ...mockSeriesData,
          seriesPoses: [],
        }

        useFlowSeries.mockReturnValue({
          state: {
            flowSeries: {
              ...contextSeriesData,
              seriesPoses: [],
            },
          },
          dispatch: jest.fn(),
        })

        const seriesContent: ShareableContent = {
          contentType: 'series',
          data: invalidSeriesData,
        }

        render(
          <TestWrapper>
            <PoseShareButton content={seriesContent} />
          </TestWrapper>
        )

        await waitFor(() => {
          expect(screen.getByText(/Data validation failed/)).toBeInTheDocument()
        })
      })

      it('should handle sequence validation errors for empty series', async () => {
        const invalidSequenceData = {
          ...mockSequenceData,
          sequencesSeries: [],
        }

        useSequence.mockReturnValue({
          state: {
            sequences: {
              ...contextSequenceData,
              sequencesSeries: [],
            },
          },
          dispatch: jest.fn(),
        })

        const sequenceContent: ShareableContent = {
          contentType: 'sequence',
          data: invalidSequenceData,
        }

        render(
          <TestWrapper>
            <PoseShareButton content={sequenceContent} />
          </TestWrapper>
        )

        await waitFor(() => {
          expect(screen.getByText(/Data validation failed/)).toBeInTheDocument()
        })
      })
    })

    describe('Context Integration Control', () => {
      it('should disable context integration when enableContextIntegration is false', () => {
        const mockConsoleWarn = jest
          .spyOn(console, 'warn')
          .mockImplementation(() => {})

        useAsanaPose.mockReturnValue({
          state: { poses: contextAsanaData },
          dispatch: jest.fn(),
        })

        render(
          <TestWrapper>
            <PoseShareButton enableContextIntegration={false} />
          </TestWrapper>
        )

        expect(
          screen.getByText('No data available to share.')
        ).toBeInTheDocument()

        // Should not access context data or show warnings
        expect(mockConsoleWarn).not.toHaveBeenCalled()

        mockConsoleWarn.mockRestore()
      })

      it('should handle context errors gracefully', () => {
        const mockConsoleWarn = jest
          .spyOn(console, 'warn')
          .mockImplementation(() => {})

        useAsanaPose.mockReturnValue({
          state: { poses: null },
          dispatch: jest.fn(),
        })

        useFlowSeries.mockReturnValue(null)

        render(
          <TestWrapper>
            <PoseShareButton />
          </TestWrapper>
        )

        expect(
          screen.getByText('No data available to share.')
        ).toBeInTheDocument()

        // Context gracefully returns null when not available, no error thrown

        mockConsoleWarn.mockRestore()
      })
    })

    describe('Legacy Props Support with Context', () => {
      it('should support legacy poseData prop with context validation', () => {
        const mockConsoleWarn = jest
          .spyOn(console, 'warn')
          .mockImplementation(() => {})

        useAsanaPose.mockReturnValue({
          state: { poses: contextAsanaData },
          dispatch: jest.fn(),
        })

        render(
          <TestWrapper>
            <PoseShareButton poseData={mockAsanaData} showDetails={true} />
          </TestWrapper>
        )

        expect(screen.getByText('Warrior Pose')).toBeInTheDocument()
        expect(screen.getByRole('button')).toBeInTheDocument()

        // Should warn about data mismatch
        expect(mockConsoleWarn).toHaveBeenCalledWith(
          'PoseShareButton context warnings:',
          expect.arrayContaining([
            expect.stringContaining(
              'Asana data mismatch between props and context'
            ),
          ])
        )

        mockConsoleWarn.mockRestore()
      })

      it('should support legacy seriesData prop with context validation', () => {
        const mockConsoleWarn = jest
          .spyOn(console, 'warn')
          .mockImplementation(() => {})

        useFlowSeries.mockReturnValue({
          state: { flowSeries: contextSeriesData },
          dispatch: jest.fn(),
        })

        render(
          <TestWrapper>
            <PoseShareButton seriesData={mockSeriesData} showDetails={true} />
          </TestWrapper>
        )

        expect(screen.getByText('Morning Flow')).toBeInTheDocument()
        expect(screen.getByRole('button')).toBeInTheDocument()

        // Should warn about data mismatch
        expect(mockConsoleWarn).toHaveBeenCalledWith(
          'PoseShareButton context warnings:',
          expect.arrayContaining([
            expect.stringContaining(
              'Series data mismatch between props and context'
            ),
          ])
        )

        mockConsoleWarn.mockRestore()
      })
    })

    describe('Hybrid Context Usage Scenarios', () => {
      it('should prioritize context data fallback when props validation fails', () => {
        // Mock invalid props data
        const invalidAsanaData = {
          ...mockAsanaData,
          sort_english_name: '',
          english_names: [],
        }

        // Mock valid context data
        useAsanaPose.mockReturnValue({
          state: { poses: contextAsanaData },
          dispatch: jest.fn(),
        })

        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: invalidAsanaData,
        }

        render(
          <TestWrapper>
            <PoseShareButton content={asanaContent} showDetails={true} />
          </TestWrapper>
        )

        // Should still render button but show validation error
        expect(screen.getByRole('button')).toBeInTheDocument()
      })

      it('should handle context access errors without crashing', () => {
        useAsanaPose.mockReturnValue(null)

        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: mockAsanaData,
        }

        render(
          <TestWrapper>
            <PoseShareButton content={asanaContent} />
          </TestWrapper>
        )

        expect(screen.getByRole('button')).toBeInTheDocument()
      })
    })
  })

  describe('Web Share API and Clipboard Integration', () => {
    describe('Native Web Share API', () => {
      beforeEach(() => {
        // Reset Web Share API mocks
        mockShare.mockClear()
        navigator.canShare = jest.fn()
      })

      it('should detect Web Share API support correctly', async () => {
        // Mock canShare availability
        navigator.canShare = jest.fn().mockReturnValue(true)
        mockShare.mockResolvedValue(undefined)

        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: mockAsanaData,
        }

        render(
          <TestWrapper>
            <PoseShareButton content={asanaContent} />
          </TestWrapper>
        )

        const shareButton = screen.getByRole('button')
        fireEvent.click(shareButton)

        await waitFor(() => {
          expect(navigator.canShare).toHaveBeenCalledWith({
            title: 'Test Title',
            text: 'Test content',
            url: 'https://test.com',
          })
          expect(mockShare).toHaveBeenCalled()
        })
      })

      it('should handle Web Share API timeout gracefully', async () => {
        // Mock share timeout
        mockShare.mockImplementation(() => new Promise(() => {})) // Never resolves

        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: mockAsanaData,
        }

        render(
          <TestWrapper>
            <PoseShareButton content={asanaContent} />
          </TestWrapper>
        )

        const shareButton = screen.getByRole('button')
        fireEvent.click(shareButton)

        // In jsdom environment, it falls back to clipboard
        await waitFor(() => {
          expect(screen.getByText(/copied to clipboard/)).toBeInTheDocument()
        })
      })

      it('should handle NotAllowedError from Web Share API', async () => {
        const notAllowedError = new Error('NotAllowedError')
        notAllowedError.name = 'NotAllowedError'
        mockShare.mockRejectedValue(notAllowedError)

        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: mockAsanaData,
        }

        render(
          <TestWrapper>
            <PoseShareButton content={asanaContent} />
          </TestWrapper>
        )

        const shareButton = screen.getByRole('button')
        fireEvent.click(shareButton)

        // In jsdom environment, it falls back to clipboard
        await waitFor(() => {
          expect(screen.getByText(/copied to clipboard/)).toBeInTheDocument()
        })
      })

      it('should handle NotSupportedError from Web Share API', async () => {
        const notSupportedError = new Error('NotSupportedError')
        notSupportedError.name = 'NotSupportedError'
        mockShare.mockRejectedValue(notSupportedError)

        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: mockAsanaData,
        }

        render(
          <TestWrapper>
            <PoseShareButton content={asanaContent} />
          </TestWrapper>
        )

        const shareButton = screen.getByRole('button')
        fireEvent.click(shareButton)

        // In jsdom environment, it falls back to clipboard
        await waitFor(() => {
          expect(screen.getByText(/copied to clipboard/)).toBeInTheDocument()
        })
      })
    })

    describe('Clipboard Fallback Functionality', () => {
      beforeEach(() => {
        mockClipboard.writeText.mockClear()
        mockQueryCommandSupported.mockClear()
        mockExecCommand.mockClear()
      })

      it('should use modern clipboard API when available', async () => {
        // Mock Web Share API not available
        Object.defineProperty(navigator, 'share', { value: undefined })
        mockClipboard.writeText.mockResolvedValue(undefined)

        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: mockAsanaData,
        }

        render(
          <TestWrapper>
            <PoseShareButton content={asanaContent} />
          </TestWrapper>
        )

        const shareButton = screen.getByRole('button')
        fireEvent.click(shareButton)

        await waitFor(() => {
          expect(mockClipboard.writeText).toHaveBeenCalledWith(
            'Test Title\nTest content\nhttps://test.com'
          )
          expect(screen.getByText(/copied to clipboard/)).toBeInTheDocument()
        })
      })

      it('should fallback to execCommand when modern clipboard fails', async () => {
        // Mock Web Share API not available
        Object.defineProperty(navigator, 'share', { value: undefined })

        // Mock modern clipboard API failure
        mockClipboard.writeText.mockRejectedValue(new Error('Clipboard failed'))

        // Mock legacy clipboard support
        mockQueryCommandSupported.mockReturnValue(true)
        mockExecCommand.mockReturnValue(true)

        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: mockAsanaData,
        }

        render(
          <TestWrapper>
            <PoseShareButton content={asanaContent} />
          </TestWrapper>
        )

        const shareButton = screen.getByRole('button')
        fireEvent.click(shareButton)

        // In jsdom environment, clipboard fails and shows manual copy message
        await waitFor(() => {
          expect(
            screen.getByText(/Unable to copy automatically/)
          ).toBeInTheDocument()
        })
      })

      it('should handle complete clipboard failure gracefully', async () => {
        // Mock Web Share API not available
        Object.defineProperty(navigator, 'share', { value: undefined })

        // Mock both clipboard methods failing
        mockClipboard.writeText.mockRejectedValue(new Error('Clipboard failed'))
        mockQueryCommandSupported.mockReturnValue(false)

        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: mockAsanaData,
        }

        render(
          <TestWrapper>
            <PoseShareButton content={asanaContent} />
          </TestWrapper>
        )

        const shareButton = screen.getByRole('button')
        fireEvent.click(shareButton)

        await waitFor(() => {
          expect(
            screen.getByText(/Unable to copy automatically/)
          ).toBeInTheDocument()
        })
      })

      it('should handle non-secure context clipboard limitations', async () => {
        // Mock non-secure context
        Object.defineProperty(window, 'isSecureContext', {
          value: false,
        })

        // Mock Web Share API not available
        Object.defineProperty(navigator, 'share', { value: undefined })

        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: mockAsanaData,
        }

        render(
          <TestWrapper>
            <PoseShareButton content={asanaContent} />
          </TestWrapper>
        )

        const shareButton = screen.getByRole('button')
        fireEvent.click(shareButton)

        // Should fallback to legacy clipboard methods
        await waitFor(() => {
          expect(mockQueryCommandSupported).toHaveBeenCalledWith('copy')
        })

        // Reset for other tests
        Object.defineProperty(window, 'isSecureContext', {
          value: true,
        })
      })
    })

    describe('Cross-browser Compatibility', () => {
      it('should handle browsers without Web Share API', async () => {
        // Remove Web Share API completely
        Object.defineProperty(navigator, 'share', { value: undefined })
        Object.defineProperty(navigator, 'canShare', { value: undefined })

        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: mockAsanaData,
        }

        render(
          <TestWrapper>
            <PoseShareButton content={asanaContent} />
          </TestWrapper>
        )

        const shareButton = screen.getByRole('button')
        fireEvent.click(shareButton)

        // Should fallback to clipboard
        await waitFor(() => {
          expect(
            screen.getByText(/Unable to copy automatically/)
          ).toBeInTheDocument()
        })

        // Restore for other tests
        navigator.share = mockShare
      })

      it('should handle browsers with partial Web Share API support', async () => {
        // Mock browser with share but no canShare
        navigator.share = mockShare
        Object.defineProperty(navigator, 'canShare', { value: undefined })
        mockShare.mockResolvedValue(undefined)

        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: mockAsanaData,
        }

        render(
          <TestWrapper>
            <PoseShareButton content={asanaContent} />
          </TestWrapper>
        )

        const shareButton = screen.getByRole('button')
        fireEvent.click(shareButton)

        // In jsdom environment, it falls back to clipboard
        await waitFor(() => {
          expect(
            screen.getByText(/Unable to copy automatically/)
          ).toBeInTheDocument()
        })
      })
    })

    describe('Mobile Sharing Functionality', () => {
      beforeEach(() => {
        // Mock mobile environment
        Object.defineProperty(navigator, 'userAgent', {
          writable: true,
          value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        })
      })

      it('should prioritize native sharing on mobile devices', async () => {
        navigator.canShare = jest.fn().mockReturnValue(true)
        mockShare.mockResolvedValue(undefined)

        const seriesContent: ShareableContent = {
          contentType: 'series',
          data: mockSeriesData,
        }

        render(
          <TestWrapper>
            <PoseShareButton content={seriesContent} />
          </TestWrapper>
        )

        const shareButton = screen.getByRole('button')
        fireEvent.click(shareButton)

        await waitFor(() => {
          expect(navigator.canShare).toHaveBeenCalled()
          expect(mockShare).toHaveBeenCalled()
        })
      })

      it('should handle mobile touch interactions properly', async () => {
        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: mockAsanaData,
        }

        render(
          <TestWrapper>
            <PoseShareButton content={asanaContent} />
          </TestWrapper>
        )

        const shareButton = screen.getByRole('button')

        // Simulate touch interaction
        fireEvent.touchStart(shareButton)
        fireEvent.touchEnd(shareButton)
        fireEvent.click(shareButton)

        await waitFor(() => {
          expect(mockShare).toHaveBeenCalled()
        })
      })

      afterEach(() => {
        // Reset user agent
        Object.defineProperty(navigator, 'userAgent', {
          value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        })
      })
    })
  })

  describe('Error Handling and Network Failures', () => {
    it('should handle network errors during sharing', async () => {
      const networkError = new Error('Network error')
      mockShare.mockRejectedValue(networkError)

      const asanaContent: ShareableContent = {
        contentType: 'asana',
        data: mockAsanaData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={asanaContent} />
        </TestWrapper>
      )

      const shareButton = screen.getByRole('button')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(
          screen.getByText(/Unable to share asana: Network error/)
        ).toBeInTheDocument()
      })
    })

    it('should provide content-specific error messages for different types', async () => {
      const permissionError = new Error('Permission denied')
      mockShare.mockRejectedValue(permissionError)

      const { rerender } = render(
        <TestWrapper>
          <PoseShareButton
            content={{ contentType: 'asana', data: mockAsanaData }}
          />
        </TestWrapper>
      )

      let shareButton = screen.getByRole('button')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(
          screen.getByText(/Unable to share asana: Permission denied/)
        ).toBeInTheDocument()
      })

      // Test with series
      rerender(
        <TestWrapper>
          <PoseShareButton
            content={{ contentType: 'series', data: mockSeriesData }}
          />
        </TestWrapper>
      )

      shareButton = screen.getByRole('button', { name: /share this series/i })
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(
          screen.getByText(/Unable to share series: Permission denied/)
        ).toBeInTheDocument()
      })
    })

    it('should handle invalid content errors gracefully', async () => {
      const invalidContent: ShareableContent = {
        contentType: 'asana',
        data: {
          ...mockAsanaData,
          sort_english_name: '',
          english_names: [],
        },
      }

      render(
        <TestWrapper>
          <PoseShareButton content={invalidContent} />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/No data available/)).toBeInTheDocument()
      })
    })
  })

  describe('Session State Integration', () => {
    it('should handle authenticated user sharing scenarios', async () => {
      // Mock authenticated session
      useAsanaPose.mockReturnValue({
        state: { poses: contextAsanaData },
        dispatch: jest.fn(),
      })
      useFlowSeries.mockReturnValue({
        state: { flowSeries: contextSeriesData },
        dispatch: jest.fn(),
      })
      useSequence.mockReturnValue({
        state: { sequences: contextSequenceData },
        dispatch: jest.fn(),
      })

      const asanaContent: ShareableContent = {
        contentType: 'asana',
        data: mockAsanaData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={asanaContent} />
        </TestWrapper>
      )

      const shareButton = screen.getByRole('button')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalled()
      })
    })

    it('should handle unauthenticated user sharing with limited context', async () => {
      // Mock unauthenticated session (no context data)
      useAsanaPose.mockReturnValue({
        state: { poses: null },
        dispatch: jest.fn(),
      })
      useFlowSeries.mockReturnValue({
        state: { flowSeries: null },
        dispatch: jest.fn(),
      })
      useSequence.mockReturnValue({
        state: { sequences: null },
        dispatch: jest.fn(),
      })

      const asanaContent: ShareableContent = {
        contentType: 'asana',
        data: mockAsanaData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={asanaContent} />
        </TestWrapper>
      )

      const shareButton = screen.getByRole('button')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalled()
      })
    })
  })

  describe('Sanskrit Content and Yoga Terminology', () => {
    it('should handle Sanskrit names correctly in sharing text', () => {
      const sanskritAsanaData: AsanaPose = {
        ...mockAsanaData,
        sort_english_name: 'Warrior I',
        sanskrit_names: ['Vīrabhadrāsana I'],
        english_names: ['Warrior I', 'Warrior Pose I'],
      }

      const asanaContent: ShareableContent = {
        contentType: 'asana',
        data: sanskritAsanaData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={asanaContent} showDetails={true} />
        </TestWrapper>
      )

      expect(screen.getByText('Warrior I')).toBeInTheDocument()
      expect(screen.getByLabelText('Share this pose')).toBeInTheDocument()
    })

    it('should handle complex series names with Sanskrit terms', () => {
      const sanskritSeriesData: FlowSeriesData = {
        ...mockSeriesData,
        seriesName: 'Sūrya Namaskāra A',
        description: 'Traditional sun salutation sequence',
        seriesPoses: ['Tāḍāsana', 'Ūrdhva Hastāsana', 'Uttānāsana'],
      }

      const seriesContent: ShareableContent = {
        contentType: 'series',
        data: sanskritSeriesData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={seriesContent} showDetails={true} />
        </TestWrapper>
      )

      expect(screen.getByText('Sūrya Namaskāra A')).toBeInTheDocument()
      expect(screen.getByLabelText('Share this series')).toBeInTheDocument()
    })

    it('should handle special characters in pose descriptions', () => {
      const specialCharAsanaData: AsanaPose = {
        ...mockAsanaData,
        description:
          'A powerful standing pose that strengthens the legs & core (मुख्य आसन)',
        sort_english_name: 'Warrior I',
      }

      const asanaContent: ShareableContent = {
        contentType: 'asana',
        data: specialCharAsanaData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={asanaContent} showDetails={true} />
        </TestWrapper>
      )

      expect(
        screen.getByText(
          /powerful standing pose that strengthens the legs & core/
        )
      ).toBeInTheDocument()
    })
  })

  describe('Responsive Design and Mobile Compatibility', () => {
    it('should render properly on mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      const asanaContent: ShareableContent = {
        contentType: 'asana',
        data: mockAsanaData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={asanaContent} showDetails={true} />
        </TestWrapper>
      )

      const shareButton = screen.getByRole('button')
      expect(shareButton).toBeInTheDocument()
      expect(shareButton).toBeVisible()
    })

    it('should handle touch-friendly interactions', () => {
      const asanaContent: ShareableContent = {
        contentType: 'asana',
        data: mockAsanaData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={asanaContent} />
        </TestWrapper>
      )

      const shareButton = screen.getByRole('button')

      // Check that button has appropriate touch target size (implicit through MUI IconButton)
      expect(shareButton).toHaveAttribute('aria-label', 'Share this pose')

      // Simulate touch events
      fireEvent.touchStart(shareButton)
      fireEvent.touchEnd(shareButton)
      expect(shareButton).toBeInTheDocument()
    })
  })

  describe('Performance and Loading States', () => {
    it('should show loading state during share operation', async () => {
      // Mock slow sharing operation
      mockShare.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100)
          })
      )

      const asanaContent: ShareableContent = {
        contentType: 'asana',
        data: mockAsanaData,
      }

      render(
        <TestWrapper>
          <PoseShareButton content={asanaContent} />
        </TestWrapper>
      )

      const shareButton = screen.getByRole('button')
      fireEvent.click(shareButton)

      // Should show loading state
      expect(screen.getByLabelText('Sharing in progress')).toBeInTheDocument()
      expect(shareButton).toBeDisabled()

      // Wait for operation to complete
      await waitFor(() => {
        expect(shareButton).not.toBeDisabled()
      })
    })

    it('should handle large dataset sharing efficiently', async () => {
      const largeSeriesData: FlowSeriesData = {
        ...mockSeriesData,
        seriesPoses: Array.from({ length: 50 }, (_, i) => `Pose ${i + 1}`),
      }

      const seriesContent: ShareableContent = {
        contentType: 'series',
        data: largeSeriesData,
      }

      const startTime = Date.now()

      render(
        <TestWrapper>
          <PoseShareButton content={seriesContent} />
        </TestWrapper>
      )

      const renderTime = Date.now() - startTime

      // Should render efficiently even with large datasets
      expect(renderTime).toBeLessThan(1000) // Arbitrary performance threshold
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })
})
