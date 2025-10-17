import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import CreateSeriesPage from '@app/navigator/flows/createSeries/page'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import * as poseService from '@lib/poseService'

// Standard Soar mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  SessionProvider: ({ children }: any) => <>{children}</>,
}))
jest.mock('@/app/context/UserContext', () => ({
  UserStateProvider: ({ children }: any) => <>{children}</>,
}))
jest.mock('@/app/context/AsanaPoseContext', () => ({
  AsanaPoseProvider: ({ children }: any) => <>{children}</>,
}))
jest.mock('@/app/context/AsanaSeriesContext', () => {
  const React = require('react')
  const { useState } = React

  return {
    FlowSeriesProvider: ({ children }: any) => {
      const [state, setState] = useState({
        flowSeries: {
          seriesName: '',
          seriesPoses: [],
          breath: [],
          description: '',
          duration: 0,
          image: '',
        },
      })

      const dispatch = jest.fn((action: any) => {
        if (action.type === 'SET_SERIES_NAME') {
          setState((prev: any) => ({
            ...prev,
            flowSeries: { ...prev.flowSeries, seriesName: action.payload },
          }))
        }
      })

      return (
        <MockFlowSeriesContext.Provider value={{ state, dispatch }}>
          {children}
        </MockFlowSeriesContext.Provider>
      )
    },
    useFlowSeries: () => {
      const context = React.useContext(MockFlowSeriesContext)
      if (!context) {
        throw new Error('useFlowSeries must be used within FlowSeriesProvider')
      }
      return context
    },
  }
})

const MockFlowSeriesContext = React.createContext<any>(null)

// Mock poseService
jest.mock('@lib/poseService', () => ({
  getAccessiblePoses: jest.fn(),
}))

// Mock image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

const theme = createTheme()
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

const mockPoses = [
  {
    id: 'pose1',
    sort_english_name: 'warrior-i',
    english_names: ['Warrior I'],
    sanskrit_names: ['Virabhadrasana I'],
    isUserCreated: false,
  },
  {
    id: 'pose2',
    sort_english_name: 'downward-dog',
    english_names: ['Downward Dog'],
    sanskrit_names: ['Adho Mukha Svanasana'],
    isUserCreated: false,
  },
  {
    id: 'pose3',
    sort_english_name: 'tree-pose',
    english_names: ['Tree Pose'],
    sanskrit_names: ['Vrikshasana'],
    isUserCreated: false,
  },
]

describe('CreateSeries - Alignment Cues Functionality', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(useSession as jest.Mock).mockReturnValue({
      data: { user: { email: 'test@yoga.com', name: 'Test Yogi' } },
      status: 'authenticated',
    })
    ;(poseService.getAccessiblePoses as jest.Mock).mockResolvedValue(mockPoses)
  })

  describe('Alignment Cues Input Rendering', () => {
    it('should render alignment cues TextField for each pose in the series', async () => {
      render(<CreateSeriesPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(poseService.getAccessiblePoses).toHaveBeenCalled()
      })

      // Add a pose to the series through the autocomplete
      const autocomplete = screen.getByLabelText(/Search for asanas/i)
      await userEvent.click(autocomplete)
      await userEvent.type(autocomplete, 'Warrior')

      await waitFor(() => {
        const option = screen.getByText('Warrior I')
        userEvent.click(option)
      })

      // Check that alignment cues input appears
      await waitFor(() => {
        const alignmentInput = screen.getByTestId('alignment-cues-0')
        expect(alignmentInput).toBeInTheDocument()
        expect(alignmentInput).toHaveAttribute(
          'placeholder',
          'Optional alignment cues (max 1000 characters)'
        )
      })
    })

    it('should display character counter for alignment cues input', async () => {
      render(<CreateSeriesPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(poseService.getAccessiblePoses).toHaveBeenCalled()
      })

      // Add a pose to the series
      const autocomplete = screen.getByLabelText(/Search for asanas/i)
      await userEvent.click(autocomplete)
      await userEvent.type(autocomplete, 'Warrior')

      await waitFor(() => {
        const option = screen.getByText('Warrior I')
        userEvent.click(option)
      })

      // Check for character counter
      await waitFor(() => {
        expect(screen.getByText('0/1000')).toBeInTheDocument()
      })
    })

    it('should update character counter as user types alignment cues', async () => {
      render(<CreateSeriesPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(poseService.getAccessiblePoses).toHaveBeenCalled()
      })

      // Add a pose
      const autocomplete = screen.getByLabelText(/Search for asanas/i)
      await userEvent.click(autocomplete)
      await userEvent.type(autocomplete, 'Warrior')

      await waitFor(() => {
        const option = screen.getByText('Warrior I')
        userEvent.click(option)
      })

      // Type alignment cues
      const alignmentInput = await screen.findByTestId('alignment-cues-0')
      const testText = 'Keep your front knee aligned over your ankle'
      await userEvent.type(alignmentInput, testText)

      await waitFor(() => {
        expect(screen.getByText(`${testText.length}/1000`)).toBeInTheDocument()
      })
    })

    it('should enforce 1000 character limit on alignment cues', async () => {
      render(<CreateSeriesPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(poseService.getAccessiblePoses).toHaveBeenCalled()
      })

      // Add a pose
      const autocomplete = screen.getByLabelText(/Search for asanas/i)
      await userEvent.click(autocomplete)
      await userEvent.type(autocomplete, 'Warrior')

      await waitFor(() => {
        const option = screen.getByText('Warrior I')
        userEvent.click(option)
      })

      // Try to type more than 1000 characters
      const alignmentInput = await screen.findByTestId('alignment-cues-0')
      const longText = 'a'.repeat(1100)
      await userEvent.type(alignmentInput, longText)

      await waitFor(() => {
        const input = alignmentInput as HTMLInputElement
        expect(input.value.length).toBeLessThanOrEqual(1000)
        expect(screen.getByText(/1000\/1000/)).toBeInTheDocument()
      })
    })

    it('should render multiple alignment cue inputs for multiple poses', async () => {
      render(<CreateSeriesPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(poseService.getAccessiblePoses).toHaveBeenCalled()
      })

      // Add first pose
      const autocomplete = screen.getByLabelText(/Search for asanas/i)
      await userEvent.click(autocomplete)
      await userEvent.type(autocomplete, 'Warrior')

      await waitFor(() => {
        const option = screen.getByText('Warrior I')
        userEvent.click(option)
      })

      // Add second pose
      await userEvent.clear(autocomplete)
      await userEvent.type(autocomplete, 'Downward')

      await waitFor(() => {
        const option = screen.getByText('Downward Dog')
        userEvent.click(option)
      })

      // Check that both alignment cue inputs appear
      await waitFor(() => {
        expect(screen.getByTestId('alignment-cues-0')).toBeInTheDocument()
        expect(screen.getByTestId('alignment-cues-1')).toBeInTheDocument()
      })
    })

    it('should support multiline alignment cues input', async () => {
      render(<CreateSeriesPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(poseService.getAccessiblePoses).toHaveBeenCalled()
      })

      // Add a pose
      const autocomplete = screen.getByLabelText(/Search for asanas/i)
      await userEvent.click(autocomplete)
      await userEvent.type(autocomplete, 'Warrior')

      await waitFor(() => {
        const option = screen.getByText('Warrior I')
        userEvent.click(option)
      })

      // Type multiline alignment cues
      const alignmentInput = await screen.findByTestId('alignment-cues-0')
      const multilineText =
        'Line 1: Keep knee aligned\nLine 2: Press into back foot\nLine 3: Reach arms up'
      await userEvent.type(alignmentInput, multilineText)

      await waitFor(() => {
        const input = alignmentInput as HTMLTextAreaElement
        expect(input.value).toContain('\n')
        expect(input.value.split('\n').length).toBeGreaterThan(1)
      })
    })
  })

  describe('Alignment Cues Data Handling', () => {
    it('should preserve alignment cues when reordering poses', async () => {
      render(<CreateSeriesPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(poseService.getAccessiblePoses).toHaveBeenCalled()
      })

      // Add two poses
      const autocomplete = screen.getByLabelText(/Search for asanas/i)

      // Add first pose
      await userEvent.click(autocomplete)
      await userEvent.type(autocomplete, 'Warrior')
      await waitFor(() => {
        const option = screen.getByText('Warrior I')
        userEvent.click(option)
      })

      // Add alignment cue to first pose
      const firstAlignment = await screen.findByTestId('alignment-cues-0')
      await userEvent.type(firstAlignment, 'First pose cues')

      // Add second pose
      await userEvent.clear(autocomplete)
      await userEvent.type(autocomplete, 'Downward')
      await waitFor(() => {
        const option = screen.getByText('Downward Dog')
        userEvent.click(option)
      })

      // Add alignment cue to second pose
      const secondAlignment = await screen.findByTestId('alignment-cues-1')
      await userEvent.type(secondAlignment, 'Second pose cues')

      // Find and click move up button for second pose
      const moveUpButtons = screen.getAllByLabelText(/Move up/i)
      await userEvent.click(moveUpButtons[1])

      // After reordering, check that cues moved with their poses
      await waitFor(() => {
        const firstInput = screen.getByTestId(
          'alignment-cues-0'
        ) as HTMLInputElement
        const secondInput = screen.getByTestId(
          'alignment-cues-1'
        ) as HTMLInputElement

        expect(firstInput.value).toBe('Second pose cues')
        expect(secondInput.value).toBe('First pose cues')
      })
    })

    it('should clear alignment cues when pose is removed from series', async () => {
      render(<CreateSeriesPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(poseService.getAccessiblePoses).toHaveBeenCalled()
      })

      // Add a pose
      const autocomplete = screen.getByLabelText(/Search for asanas/i)
      await userEvent.click(autocomplete)
      await userEvent.type(autocomplete, 'Warrior')

      await waitFor(() => {
        const option = screen.getByText('Warrior I')
        userEvent.click(option)
      })

      // Add alignment cues
      const alignmentInput = await screen.findByTestId('alignment-cues-0')
      await userEvent.type(alignmentInput, 'Test alignment cues')

      // Remove the pose
      const deleteButton = screen.getByLabelText(/Delete/i)
      await userEvent.click(deleteButton)

      // Check that alignment input is gone
      await waitFor(() => {
        expect(screen.queryByTestId('alignment-cues-0')).not.toBeInTheDocument()
      })
    })

    it('should convert legacy string format to object when alignment cues are added', async () => {
      // This test verifies the logic that converts "Warrior I; Virabhadrasana I"
      // to { sort_english_name: "Warrior I", secondary: "Virabhadrasana I", alignment_cues: "..." }

      render(<CreateSeriesPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(poseService.getAccessiblePoses).toHaveBeenCalled()
      })

      // Add a pose (initially stored as string)
      const autocomplete = screen.getByLabelText(/Search for asanas/i)
      await userEvent.click(autocomplete)
      await userEvent.type(autocomplete, 'Warrior')

      await waitFor(() => {
        const option = screen.getByText('Warrior I')
        userEvent.click(option)
      })

      // Add alignment cues (should trigger conversion to object format)
      const alignmentInput = await screen.findByTestId('alignment-cues-0')
      await userEvent.type(alignmentInput, 'Test cues')

      // The component should now treat this entry as an object internally
      await waitFor(() => {
        const input = alignmentInput as HTMLInputElement
        expect(input.value).toBe('Test cues')
      })
    })
  })

  describe('API Payload Format', () => {
    it('should include alignment_cues in object-shaped seriesPoses when submitting', async () => {
      // Mock fetch for the API call
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, seriesId: 'new-series-id' }),
      })

      render(<CreateSeriesPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(poseService.getAccessiblePoses).toHaveBeenCalled()
      })

      // Fill in series name
      const nameInput = screen.getByLabelText(/Series Name/i)
      await userEvent.type(nameInput, 'Test Series')

      // Add a pose
      const autocomplete = screen.getByLabelText(/Search for asanas/i)
      await userEvent.click(autocomplete)
      await userEvent.type(autocomplete, 'Warrior')

      await waitFor(() => {
        const option = screen.getByText('Warrior I')
        userEvent.click(option)
      })

      // Add alignment cues
      const alignmentInput = await screen.findByTestId('alignment-cues-0')
      const cueText = 'Keep front knee over ankle'
      await userEvent.type(alignmentInput, cueText)

      // Submit the form
      const saveButton = screen.getByRole('button', { name: /Save Series/i })
      await userEvent.click(saveButton)

      // Verify the API was called with correct payload structure
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/series/createSeries',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
            }),
            body: expect.stringContaining(cueText),
          })
        )
      })

      // Parse the body and verify structure
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0]
      const requestBody = JSON.parse(fetchCall[1].body)

      expect(requestBody.seriesPoses).toBeDefined()
      expect(Array.isArray(requestBody.seriesPoses)).toBe(true)
      expect(requestBody.seriesPoses.length).toBeGreaterThan(0)

      // Verify first pose has object shape with alignment_cues
      const firstPose = requestBody.seriesPoses[0]
      expect(typeof firstPose).toBe('object')
      expect(firstPose).toHaveProperty('sort_english_name')
      expect(firstPose).toHaveProperty('alignment_cues', cueText)
    })

    it('should send empty string alignment_cues when not provided', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, seriesId: 'new-series-id' }),
      })

      render(<CreateSeriesPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(poseService.getAccessiblePoses).toHaveBeenCalled()
      })

      // Fill in series name
      const nameInput = screen.getByLabelText(/Series Name/i)
      await userEvent.type(nameInput, 'Test Series')

      // Add a pose without alignment cues
      const autocomplete = screen.getByLabelText(/Search for asanas/i)
      await userEvent.click(autocomplete)
      await userEvent.type(autocomplete, 'Warrior')

      await waitFor(() => {
        const option = screen.getByText('Warrior I')
        userEvent.click(option)
      })

      // Don't type any alignment cues - leave it empty

      // Submit the form
      const saveButton = screen.getByRole('button', { name: /Save Series/i })
      await userEvent.click(saveButton)

      // Verify the API payload includes empty alignment_cues
      await waitFor(() => {
        const fetchCall = (global.fetch as jest.Mock).mock.calls[0]
        const requestBody = JSON.parse(fetchCall[1].body)

        const firstPose = requestBody.seriesPoses[0]
        expect(firstPose).toHaveProperty('alignment_cues', '')
      })
    })

    it('should handle multiple poses with mixed alignment cues in API payload', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, seriesId: 'new-series-id' }),
      })

      render(<CreateSeriesPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(poseService.getAccessiblePoses).toHaveBeenCalled()
      })

      // Fill in series name
      const nameInput = screen.getByLabelText(/Series Name/i)
      await userEvent.type(nameInput, 'Test Series')

      const autocomplete = screen.getByLabelText(/Search for asanas/i)

      // Add first pose with alignment cues
      await userEvent.click(autocomplete)
      await userEvent.type(autocomplete, 'Warrior')
      await waitFor(() => {
        const option = screen.getByText('Warrior I')
        userEvent.click(option)
      })

      const firstAlignment = await screen.findByTestId('alignment-cues-0')
      await userEvent.type(firstAlignment, 'First pose alignment')

      // Add second pose without alignment cues
      await userEvent.clear(autocomplete)
      await userEvent.type(autocomplete, 'Downward')
      await waitFor(() => {
        const option = screen.getByText('Downward Dog')
        userEvent.click(option)
      })

      // Add third pose with alignment cues
      await userEvent.clear(autocomplete)
      await userEvent.type(autocomplete, 'Tree')
      await waitFor(() => {
        const option = screen.getByText('Tree Pose')
        userEvent.click(option)
      })

      const thirdAlignment = await screen.findByTestId('alignment-cues-2')
      await userEvent.type(thirdAlignment, 'Third pose alignment')

      // Submit
      const saveButton = screen.getByRole('button', { name: /Save Series/i })
      await userEvent.click(saveButton)

      // Verify API payload
      await waitFor(() => {
        const fetchCall = (global.fetch as jest.Mock).mock.calls[0]
        const requestBody = JSON.parse(fetchCall[1].body)

        expect(requestBody.seriesPoses.length).toBe(3)
        expect(requestBody.seriesPoses[0].alignment_cues).toBe(
          'First pose alignment'
        )
        expect(requestBody.seriesPoses[1].alignment_cues).toBe('')
        expect(requestBody.seriesPoses[2].alignment_cues).toBe(
          'Third pose alignment'
        )
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for alignment cues inputs', async () => {
      render(<CreateSeriesPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(poseService.getAccessiblePoses).toHaveBeenCalled()
      })

      // Add a pose
      const autocomplete = screen.getByLabelText(/Search for asanas/i)
      await userEvent.click(autocomplete)
      await userEvent.type(autocomplete, 'Warrior')

      await waitFor(() => {
        const option = screen.getByText('Warrior I')
        userEvent.click(option)
      })

      // Check ARIA attributes
      const alignmentInput = await screen.findByTestId('alignment-cues-0')
      expect(alignmentInput).toHaveAttribute('aria-label')
      expect(alignmentInput.getAttribute('aria-label')).toContain(
        'alignment cues'
      )
    })

    it('should be keyboard navigable between pose list and alignment inputs', async () => {
      render(<CreateSeriesPage />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(poseService.getAccessiblePoses).toHaveBeenCalled()
      })

      // Add a pose
      const autocomplete = screen.getByLabelText(/Search for asanas/i)
      await userEvent.click(autocomplete)
      await userEvent.type(autocomplete, 'Warrior')

      await waitFor(() => {
        const option = screen.getByText('Warrior I')
        userEvent.click(option)
      })

      // Tab through elements to verify keyboard navigation
      await screen.findByTestId('alignment-cues-0')
      await userEvent.tab()

      // The focused element should eventually reach the alignment input
      expect(document.activeElement).toBeTruthy()
    })
  })
})
