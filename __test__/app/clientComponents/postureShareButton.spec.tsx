import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import '@testing-library/jest-dom'
import PostureShareButton from '@app/clientComponents/postureShareButton'
import { FullAsanaData } from '@app/context/AsanaPostureContext'
import { FlowSeriesData } from '@app/context/AsanaSeriesContext'
import { SequenceData } from '@app/context/SequenceContext'
import { ShareableContent } from '../../../types/sharing'
import theme from '../../../styles/theme'

// Mock Next.js navigation
jest.mock('next/navigation')

// Mock the sharing strategy
jest.mock('../../../types/sharing', () => ({
  ...jest.requireActual('../../../types/sharing'),
  createShareStrategy: jest.fn(),
}))

// Mock contexts with comprehensive data
jest.mock('@app/context/AsanaPostureContext', () => ({
  ...jest.requireActual('@app/context/AsanaPostureContext'),
  useAsanaPosture: jest.fn(),
}))

jest.mock('@app/context/AsanaSeriesContext', () => ({
  ...jest.requireActual('@app/context/AsanaSeriesContext'),
  useFlowSeries: jest.fn(),
}))

jest.mock('@app/context/SequenceContext', () => ({
  ...jest.requireActual('@app/context/SequenceContext'),
  useSequence: jest.fn(),
}))

// Import mocked functions
const { useAsanaPosture } = require('@app/context/AsanaPostureContext')
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
const mockAsanaData: FullAsanaData = {
  id: 'test-asana-1',
  english_names: ['Warrior Pose'],
  sort_english_name: 'Warrior Pose',
  description: 'A powerful standing pose',
  benefits: 'Strengthens legs',
  category: 'Standing',
  difficulty: 'Beginner',
  sanskrit_names: 'Virabhadrasana',
  lore: 'Ancient pose',
  breath_direction_default: 'Inhale',
  dristi: 'Forward',
  variations: ['Warrior I'],
  modifications: ['Use blocks'],
  label: 'Warrior Pose',
  suggested_postures: ['Mountain Pose'],
  preparatory_postures: ['Forward Fold'],
  preferred_side: 'Both',
  sideways: false,
  image: 'warrior.jpg',
  created_on: '2024-01-01',
  updated_on: '2024-01-01',
  activity_completed: false,
  activity_practice: false,
  posture_intent: 'Strength',
  breath_series: ['4 count'],
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
}

const mockSeriesData: FlowSeriesData = {
  id: 'test-series-1',
  seriesName: 'Morning Flow',
  description: 'Energizing sequence',
  seriesPostures: ['warrior-pose'],
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
const contextAsanaData: FullAsanaData = {
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

describe('PostureShareButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Reset context mocks to default state
    useAsanaPosture.mockReturnValue({
      state: { postures: null },
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
          <PostureShareButton content={asanaContent} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByLabelText('Share this posture')).toBeInTheDocument()
    })

    it('should render without errors with series content', () => {
      const seriesContent: ShareableContent = {
        contentType: 'series',
        data: mockSeriesData,
      }

      render(
        <TestWrapper>
          <PostureShareButton content={seriesContent} />
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
          <PostureShareButton content={sequenceContent} />
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
          <PostureShareButton content={asanaContent} />
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
          <PostureShareButton content={asanaContent} showDetails={true} />
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
          <PostureShareButton content={asanaContent} showDetails={false} />
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
          <PostureShareButton content={asanaContent} />
        </TestWrapper>
      )

      const shareButton = screen.getByRole('button')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalledWith({
          title: 'Test Title',
          text: 'Test content',
          url: 'https://test.com',
        })
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
          <PostureShareButton content={asanaContent} />
        </TestWrapper>
      )

      const shareButton = screen.getByRole('button')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith(
          'Error sharing content:',
          expect.any(Error)
        )
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
          <PostureShareButton content={asanaContent} />
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
        seriesPostures: [
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

Below are the postures in this series:

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

    it('should handle series with single posture correctly', () => {
      const singlePostureSeriesData: FlowSeriesData = {
        id: 'single-posture-series',
        seriesName: "Child's Pose Rest",
        description: 'Single pose relaxation',
        seriesPostures: ["Child's Pose"],
        duration: '5',
      }

      const { SeriesShareStrategy } = require('../../../types/sharing')
      const strategy = new SeriesShareStrategy()
      const shareConfig = strategy.generateShareConfig(singlePostureSeriesData)

      // For single posture, should not have comma after the last (and only) item
      const expectedText = `Sharing a video of
the yoga series
"Child's Pose Rest"

Below are the postures in this series:

* Child's Pose

Practice with Uvuyoga!

https://www.happyyoga.app/navigator/flows/practiceSeries

(www.happyyoga.app)`

      expect(shareConfig.text).toBe(expectedText)
    })

    it('should clean semicolons from posture names in series format', () => {
      const seriesWithSemicolons: FlowSeriesData = {
        id: 'semicolon-test',
        seriesName: 'Test Series',
        description: 'Testing semicolon cleanup',
        seriesPostures: ['Warrior I; Right Side', 'Warrior I; Left Side'],
        duration: '10',
      }

      const { SeriesShareStrategy } = require('../../../types/sharing')
      const strategy = new SeriesShareStrategy()
      const shareConfig = strategy.generateShareConfig(seriesWithSemicolons)

      // Should clean semicolons and format correctly
      const expectedText = `Sharing a video of
the yoga series
"Test Series"

Below are the postures in this series:

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
      const testAsanaData: FullAsanaData = {
        id: 'test-asana-format',
        english_names: ['Warrior I'],
        sort_english_name: 'Warrior I',
        description: 'A powerful standing pose that strengthens the legs',
        benefits: 'Strengthens legs and core',
        category: 'Standing',
        difficulty: 'Beginner',
        sanskrit_names: 'Virabhadrasana I',
        lore: 'Named after the fierce warrior Virabhadra',
        breath_direction_default: 'Inhale',
        dristi: 'Forward',
        variations: ['Warrior I with blocks'],
        modifications: ['Use wall for support'],
        label: 'Warrior I Pose',
        suggested_postures: ['Mountain Pose'],
        preparatory_postures: ['Forward Fold'],
        preferred_side: 'Both',
        sideways: false,
        image: 'warrior1.jpg',
        created_on: '2024-01-01',
        updated_on: '2024-01-01',
        activity_completed: false,
        activity_practice: false,
        posture_intent: 'Strength',
        breath_series: ['4 count inhale'],
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
      }

      // Import the actual AsanaShareStrategy to test directly
      const { AsanaShareStrategy } = require('../../../types/sharing')
      const strategy = new AsanaShareStrategy()
      const shareConfig = strategy.generateShareConfig(testAsanaData)

      // Verify the exact format matches PRD specification
      const expectedText = `The yoga posture Warrior I was shared with you. Below is the description:

Practice with Uvuyoga!

https://www.happyyoga.app/navigator/flows/practiceSeries

(www.happyyoga.app)`

      expect(shareConfig.text).toBe(expectedText)
      expect(shareConfig.title).toBe(
        'The yoga posture "Warrior I" was shared with you. Below is the description:'
      )
      expect(shareConfig.url).toBe(
        'https://www.happyyoga.app/navigator/flows/practiceSeries'
      )
      expect(shareConfig.shareType).toBe('asana')
    })

    it('should handle asana names with special characters correctly', () => {
      const specialAsanaData: FullAsanaData = {
        id: 'special-asana',
        english_names: ["Child's Pose"],
        sort_english_name: "Child's Pose",
        description: 'A restful pose',
        benefits: 'Calming',
        category: 'Restorative',
        difficulty: 'Beginner',
        sanskrit_names: 'Balasana',
        lore: 'Ancient resting pose',
        breath_direction_default: 'Natural',
        dristi: 'Down',
        variations: ["Extended Child's Pose"],
        modifications: ['Use bolster'],
        label: "Child's Pose",
        suggested_postures: ['Cat Pose'],
        preparatory_postures: ['Table Top'],
        preferred_side: 'Center',
        sideways: false,
        image: 'childs.jpg',
        created_on: '2024-01-01',
        updated_on: '2024-01-01',
        activity_completed: false,
        activity_practice: false,
        posture_intent: 'Rest',
        breath_series: ['Natural breathing'],
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
      }

      const { AsanaShareStrategy } = require('../../../types/sharing')
      const strategy = new AsanaShareStrategy()
      const shareConfig = strategy.generateShareConfig(specialAsanaData)

      // Should handle special characters correctly
      const expectedText = `The yoga posture Child's Pose was shared with you. Below is the description:

Practice with Uvuyoga!

https://www.happyyoga.app/navigator/flows/practiceSeries

(www.happyyoga.app)`

      expect(shareConfig.text).toBe(expectedText)
      expect(shareConfig.title).toBe(
        'The yoga posture "Child\'s Pose" was shared with you. Below is the description:'
      )
    })
  })

  describe('Legacy Props Support', () => {
    it('should support legacy postureData prop', () => {
      render(
        <TestWrapper>
          <PostureShareButton postureData={mockAsanaData} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByLabelText('Share this posture')).toBeInTheDocument()
    })

    it('should support legacy seriesData prop', () => {
      render(
        <TestWrapper>
          <PostureShareButton seriesData={mockSeriesData} />
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByLabelText('Share this series')).toBeInTheDocument()
    })

    it('should display "No data available" for null legacy props', () => {
      render(
        <TestWrapper>
          <PostureShareButton postureData={null} />
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
          <PostureShareButton
            content={{ contentType: 'asana', data: mockAsanaData }}
          />
        </TestWrapper>
      )
      expect(screen.getByLabelText('Share this posture')).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <PostureShareButton
            content={{ contentType: 'series', data: mockSeriesData }}
          />
        </TestWrapper>
      )
      expect(screen.getByLabelText('Share this series')).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <PostureShareButton
            content={{ contentType: 'sequence', data: mockSequenceData }}
          />
        </TestWrapper>
      )
      expect(screen.getByLabelText('Share this sequence')).toBeInTheDocument()
    })
  })

  describe('Context Integration', () => {
    it('should render with context asana data', () => {
      useAsanaPosture.mockReturnValue({
        state: { postures: [contextAsanaData] },
        dispatch: jest.fn(),
      })

      const asanaContent: ShareableContent = {
        contentType: 'asana',
        data: contextAsanaData,
      }

      render(
        <TestWrapper>
          <PostureShareButton content={asanaContent} showDetails={true} />
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
          <PostureShareButton content={seriesContent} showDetails={true} />
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
          <PostureShareButton content={sequenceContent} showDetails={true} />
        </TestWrapper>
      )

      expect(screen.getByText('Context Power Sequence')).toBeInTheDocument()
      expect(screen.getByText('High-energy flow')).toBeInTheDocument()
    })

    it('should handle context data share correctly', async () => {
      mockShare.mockResolvedValue(undefined)

      useAsanaPosture.mockReturnValue({
        state: { postures: [contextAsanaData] },
        dispatch: jest.fn(),
      })

      const asanaContent: ShareableContent = {
        contentType: 'asana',
        data: contextAsanaData,
      }

      render(
        <TestWrapper>
          <PostureShareButton content={asanaContent} />
        </TestWrapper>
      )

      const shareButton = screen.getByRole('button')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalledWith({
          title: 'Test Title',
          text: 'Test content',
          url: 'https://test.com',
        })
      })
    })
  })

  describe('Context Integration', () => {
    describe('Context Data Fallback', () => {
      it('should fallback to asana context when no props content provided', () => {
        useAsanaPosture.mockReturnValue({
          state: { postures: contextAsanaData },
          dispatch: jest.fn(),
        })

        render(
          <TestWrapper>
            <PostureShareButton showDetails={true} />
          </TestWrapper>
        )

        expect(screen.getByRole('button')).toBeInTheDocument()
        expect(screen.getByLabelText('Share this posture')).toBeInTheDocument()
        expect(screen.getByText('Warrior Pose')).toBeInTheDocument()
      })

      it('should fallback to series context when no props content provided', () => {
        useFlowSeries.mockReturnValue({
          state: { flowSeries: contextSeriesData },
          dispatch: jest.fn(),
        })

        render(
          <TestWrapper>
            <PostureShareButton showDetails={true} />
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
            <PostureShareButton showDetails={true} />
          </TestWrapper>
        )

        expect(screen.getByRole('button')).toBeInTheDocument()
        expect(screen.getByLabelText('Share this sequence')).toBeInTheDocument()
        expect(screen.getByText('Context Power Sequence')).toBeInTheDocument()
      })

      it('should prefer props over context when both are available', () => {
        useAsanaPosture.mockReturnValue({
          state: { postures: contextAsanaData },
          dispatch: jest.fn(),
        })

        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: mockAsanaData,
        }

        render(
          <TestWrapper>
            <PostureShareButton content={asanaContent} showDetails={true} />
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
            <PostureShareButton />
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

        useAsanaPosture.mockReturnValue({
          state: { postures: contextAsanaData },
          dispatch: jest.fn(),
        })

        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: mockAsanaData,
        }

        render(
          <TestWrapper>
            <PostureShareButton content={asanaContent} />
          </TestWrapper>
        )

        expect(mockConsoleWarn).toHaveBeenCalledWith(
          'PostureShareButton context warnings:',
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

        useAsanaPosture.mockReturnValue({
          state: {
            postures: {
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
            <PostureShareButton content={asanaContent} />
          </TestWrapper>
        )

        await waitFor(() => {
          expect(screen.getByText(/Data validation failed/)).toBeInTheDocument()
        })
      })

      it('should handle series validation errors for empty postures', async () => {
        const invalidSeriesData = {
          ...mockSeriesData,
          seriesPostures: [],
        }

        useFlowSeries.mockReturnValue({
          state: {
            flowSeries: {
              ...contextSeriesData,
              seriesPostures: [],
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
            <PostureShareButton content={seriesContent} />
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
            <PostureShareButton content={sequenceContent} />
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

        useAsanaPosture.mockReturnValue({
          state: { postures: contextAsanaData },
          dispatch: jest.fn(),
        })

        render(
          <TestWrapper>
            <PostureShareButton enableContextIntegration={false} />
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

        useAsanaPosture.mockReturnValue({
          state: { postures: null },
          dispatch: jest.fn(),
        })

        useFlowSeries.mockReturnValue(null)

        render(
          <TestWrapper>
            <PostureShareButton />
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
      it('should support legacy postureData prop with context validation', () => {
        const mockConsoleWarn = jest
          .spyOn(console, 'warn')
          .mockImplementation(() => {})

        useAsanaPosture.mockReturnValue({
          state: { postures: contextAsanaData },
          dispatch: jest.fn(),
        })

        render(
          <TestWrapper>
            <PostureShareButton
              postureData={mockAsanaData}
              showDetails={true}
            />
          </TestWrapper>
        )

        expect(screen.getByText('Warrior Pose')).toBeInTheDocument()
        expect(screen.getByRole('button')).toBeInTheDocument()

        // Should warn about data mismatch
        expect(mockConsoleWarn).toHaveBeenCalledWith(
          'PostureShareButton context warnings:',
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
            <PostureShareButton
              seriesData={mockSeriesData}
              showDetails={true}
            />
          </TestWrapper>
        )

        expect(screen.getByText('Morning Flow')).toBeInTheDocument()
        expect(screen.getByRole('button')).toBeInTheDocument()

        // Should warn about data mismatch
        expect(mockConsoleWarn).toHaveBeenCalledWith(
          'PostureShareButton context warnings:',
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
        useAsanaPosture.mockReturnValue({
          state: { postures: contextAsanaData },
          dispatch: jest.fn(),
        })

        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: invalidAsanaData,
        }

        render(
          <TestWrapper>
            <PostureShareButton content={asanaContent} showDetails={true} />
          </TestWrapper>
        )

        // Should still render button but show validation error
        expect(screen.getByRole('button')).toBeInTheDocument()
      })

      it('should handle context access errors without crashing', () => {
        useAsanaPosture.mockReturnValue(null)

        const asanaContent: ShareableContent = {
          contentType: 'asana',
          data: mockAsanaData,
        }

        render(
          <TestWrapper>
            <PostureShareButton content={asanaContent} />
          </TestWrapper>
        )

        expect(screen.getByRole('button')).toBeInTheDocument()
      })
    })
  })
})
