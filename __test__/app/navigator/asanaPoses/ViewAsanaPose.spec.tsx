import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { SessionProvider } from 'next-auth/react'
import PoseActivityDetail from '@app/navigator/asanaPoses/poseActivityDetail'
import { createTheme } from '@mui/material/styles'
import type { AsanaPose } from 'types/asana'

// Mock dependencies
jest.mock('next-auth/react')
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))
// Mock useCanEditContent hook
const mockUseCanEditContent = jest.fn()
jest.mock('@app/hooks/useCanEditContent', () => ({
  useCanEditContent: (created_by: string) => mockUseCanEditContent(created_by),
}))
// Note: @lib/asanaActivityClientService and @lib/imageService are now centrally mocked in jest.setup.ts
jest.mock('@app/clientComponents/imageUpload/ImageCarousel', () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="image-carousel">Image Carousel</div>
  )),
}))
jest.mock('@app/clientComponents/imageUpload/CarouselDotNavigation', () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="carousel-dot-navigation">Carousel Navigation</div>
  )),
}))
jest.mock('@app/clientComponents/ShareAsset', () => ({
  __esModule: true,
  default: jest.fn(() => <button data-testid="share-button">Share</button>),
}))
jest.mock('@app/clientComponents/ActivityTracker', () => ({
  __esModule: true,
  default: () => <div data-testid="activity-tracker">Activity Tracker</div>,
}))
jest.mock('@app/clientComponents/WeeklyActivityViewer', () => ({
  __esModule: true,
  default: () => <div>Weekly Activity Viewer</div>,
}))

const mockPush = jest.fn()
const mockSession = {
  user: {
    email: 'test@example.com',
    id: 'user123',
  },
  expires: '2099-01-01',
}

const mockAsanaPose: AsanaPose = {
  id: 'pose-123',
  sort_english_name: 'Warrior I',
  sanskrit_names: ['Virabhadrasana I'],
  english_names: ['Warrior I', 'Warrior One'],
  description: 'A powerful standing pose that strengthens the legs and core',
  category: 'Standing',
  difficulty: 'Beginner',
  dristi: 'Forward',
  setup_cues: 'Start in mountain pose',
  deepening_cues: 'Sink deeper into the front knee',
  breath_direction_default: 'Inhale',
  created_by: 'test@example.com',
  created_on: '2024-01-01',
  poseImages: [],
}

describe('PoseActivityDetail - View Asana - Happy Path', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock next-auth session
    const { useSession } = require('next-auth/react')
    useSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    })

    // Mock router
    const { useRouter } = require('next/navigation')
    useRouter.mockReturnValue({
      push: mockPush,
    })

    // Mock image service
    const imageService = require('@lib/imageService')
    imageService.getUserPoseImages = jest.fn().mockResolvedValue({
      images: [],
      total: 0,
    })

    // Mock activity service
    const activityService = require('@lib/asanaActivityClientService')
    activityService.checkActivityExists = jest.fn().mockResolvedValue(false)

    // Mock useCanEditContent - default to allow editing for matching creator
    mockUseCanEditContent.mockImplementation((created_by: string) => ({
      canEdit: created_by === 'test@example.com',
      reason: created_by === 'test@example.com' ? '' : 'not creator',
      isOwner: created_by === 'test@example.com',
      isAdmin: false,
    }))
  })

  const TestWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => (
    <SessionProvider session={mockSession as any}>
      <ThemeProvider theme={createTheme()}>{children}</ThemeProvider>
    </SessionProvider>
  )

  describe('Pose Information Display', () => {
    it('should display asana primary name', async () => {
      const { container } = render(
        <PoseActivityDetail poseCardProp={mockAsanaPose} />,
        {
          wrapper: TestWrapper,
        }
      )

      // wait for async activity checks and updates and target the main H2 heading
      await waitFor(() => {
        const h2 = container.querySelector('h2')
        expect(h2).toBeTruthy()
        expect(h2?.textContent).toMatch(/Warrior I/i)
      })
    })

    it('should display asana sanskrit name', () => {
      render(<PoseActivityDetail poseCardProp={mockAsanaPose} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText(/Virabhadrasana I/i)).toBeInTheDocument()
    })

    it('should display asana description', () => {
      render(<PoseActivityDetail poseCardProp={mockAsanaPose} />, {
        wrapper: TestWrapper,
      })

      expect(
        screen.getByText(/powerful standing pose that strengthens/i)
      ).toBeInTheDocument()
    })

    it('should display asana category', async () => {
      render(<PoseActivityDetail poseCardProp={mockAsanaPose} />, {
        wrapper: TestWrapper,
      })

      // Category is rendered in an element with an aria-label like "Category: Standing"
      expect(
        await screen.findByLabelText(/Category: Standing/i)
      ).toBeInTheDocument()
    })

    it('should display asana difficulty level', async () => {
      render(<PoseActivityDetail poseCardProp={mockAsanaPose} />, {
        wrapper: TestWrapper,
      })

      expect(
        await screen.findByLabelText(/Difficulty: Beginner/i)
      ).toBeInTheDocument()
    })

    it('should display dristi information', () => {
      render(<PoseActivityDetail poseCardProp={mockAsanaPose} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText(/Forward/i)).toBeInTheDocument()
    })
  })

  describe('Interactive Elements', () => {
    it('should render activity tracker', () => {
      render(<PoseActivityDetail poseCardProp={mockAsanaPose} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByTestId('activity-tracker')).toBeInTheDocument()
    })

    it('should display image carousel when images are available', async () => {
      const poseWithImages: AsanaPose = {
        ...mockAsanaPose,
        poseImages: [
          {
            id: 'img-1',
            url: '/test-image.jpg',
            altText: 'Test Image',
            userId: 'user123',
            poseId: 'pose-123',
            uploadedAt: new Date('2024-01-01'),
            storageType: 'CLOUD',
            isOffline: false,
            imageType: 'pose',
            displayOrder: 0,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          },
        ],
      }

      // Ensure the image service returns images for this test
      const imageService = require('@lib/imageService')
      imageService.getUserPoseImages = jest.fn().mockResolvedValue({
        images: [
          {
            id: 'img-1',
            url: '/test-image.jpg',
            altText: 'Test Image',
            userId: 'user123',
            poseId: 'pose-123',
            uploadedAt: new Date('2024-01-01'),
            storageType: 'CLOUD',
            isOffline: false,
            imageType: 'pose',
            displayOrder: 0,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          },
        ],
        total: 1,
      })

      render(<PoseActivityDetail poseCardProp={poseWithImages} />, {
        wrapper: TestWrapper,
      })

      expect(await screen.findByTestId('image-carousel')).toBeInTheDocument()
    })
  })

  describe('Pose Details Organization', () => {
    it('should display setup cues for practitioners', () => {
      render(<PoseActivityDetail poseCardProp={mockAsanaPose} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText(/Start in mountain pose/i)).toBeInTheDocument()
    })

    it('should display deepening cues for progression', () => {
      render(<PoseActivityDetail poseCardProp={mockAsanaPose} />, {
        wrapper: TestWrapper,
      })

      expect(
        screen.getByText(/Sink deeper into the front knee/i)
      ).toBeInTheDocument()
    })
  })

  describe('User-Created Pose Identification', () => {
    it('should identify pose created by current user', () => {
      const userCreatedPose = {
        ...mockAsanaPose,
        created_by: 'test@example.com',
      }

      render(<PoseActivityDetail poseCardProp={userCreatedPose} />, {
        wrapper: TestWrapper,
      })

      // User-created poses should display edit functionality
      expect(screen.getByText('Warrior I')).toBeInTheDocument()
    })

    it('should display pose from other creators', () => {
      const otherUserPose = {
        ...mockAsanaPose,
        created_by: 'other@example.com',
      }

      render(<PoseActivityDetail poseCardProp={otherUserPose} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText('Warrior I')).toBeInTheDocument()
    })
  })

  describe('Edit Button Visibility', () => {
    it('should show Edit icon when user is the creator', () => {
      const userCreatedPose = {
        ...mockAsanaPose,
        created_by: 'test@example.com', // Same as mockSession.user.email
      }

      render(<PoseActivityDetail poseCardProp={userCreatedPose} />, {
        wrapper: TestWrapper,
      })

      const editButtons = screen.getAllByRole('button', { name: /edit pose/i })
      expect(editButtons.length).toBeGreaterThan(0)
    })

    it('should hide Edit icon when user is not the creator', () => {
      const otherUserPose = {
        ...mockAsanaPose,
        created_by: 'other@example.com', // Different from mockSession.user.email
      }

      render(<PoseActivityDetail poseCardProp={otherUserPose} />, {
        wrapper: TestWrapper,
      })

      expect(
        screen.queryByRole('button', { name: /edit pose/i })
      ).not.toBeInTheDocument()
    })

    it('should hide Edit icon when user is not logged in', () => {
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      })

      render(<PoseActivityDetail poseCardProp={mockAsanaPose} />, {
        wrapper: TestWrapper,
      })

      expect(
        screen.queryByRole('button', { name: /edit pose/i })
      ).not.toBeInTheDocument()
    })
  })

  describe('Responsive Layout', () => {
    it('should render pose details in mobile-friendly format', () => {
      const { container } = render(
        <PoseActivityDetail poseCardProp={mockAsanaPose} />,
        {
          wrapper: TestWrapper,
        }
      )

      // Verify component renders without errors for mobile
      expect(container).toBeInTheDocument()
    })

    it('should display all yoga instruction elements', () => {
      render(<PoseActivityDetail poseCardProp={mockAsanaPose} />, {
        wrapper: TestWrapper,
      })

      // Verify key yoga instruction elements are present
      expect(screen.getByText('Warrior I')).toBeInTheDocument()
      expect(screen.getByText(/Virabhadrasana I/i)).toBeInTheDocument()
      expect(screen.getByTestId('activity-tracker')).toBeInTheDocument()
    })
  })

  describe('Optional Fields Handling', () => {
    it('should handle poses with minimal information', async () => {
      const minimalPose: AsanaPose = {
        id: 'pose-minimal',
        sort_english_name: 'Simple Pose',
        sanskrit_names: [],
        english_names: ['Simple Pose'],
      }

      const { container } = render(
        <PoseActivityDetail poseCardProp={minimalPose} />,
        {
          wrapper: TestWrapper,
        }
      )

      await waitFor(() => {
        const h2 = container.querySelector('h2')
        expect(h2).toBeTruthy()
        expect(h2?.textContent).toMatch(/Simple Pose/i)
      })
    })

    it('should handle poses with all optional fields populated', () => {
      const completePose: AsanaPose = {
        ...mockAsanaPose,
        alternative_english_names: ['Warrior One Variation'],
        benefits: 'Strengthens legs and core',
        joint_action: 'Hip flexion',
        muscle_action: 'Quadriceps engagement',
      }

      render(<PoseActivityDetail poseCardProp={completePose} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText('Warrior I')).toBeInTheDocument()
    })
  })

  describe('Sanskrit Terminology Display', () => {
    it('should display primary sanskrit name correctly', () => {
      render(<PoseActivityDetail poseCardProp={mockAsanaPose} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText(/Virabhadrasana I/i)).toBeInTheDocument()
    })

    it('should handle multiple sanskrit names', () => {
      const multiSanskritPose = {
        ...mockAsanaPose,
        sanskrit_names: ['Virabhadrasana I', 'Vira Bhadra Asana'],
      }

      render(<PoseActivityDetail poseCardProp={multiSanskritPose} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText(/Virabhadrasana I/i)).toBeInTheDocument()
    })

    it('should handle poses without sanskrit names', () => {
      const noSanskritPose = {
        ...mockAsanaPose,
        sanskrit_names: [],
      }

      render(<PoseActivityDetail poseCardProp={noSanskritPose} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText('Warrior I')).toBeInTheDocument()
    })
  })

  describe('Accessibility Features', () => {
    it('should render with proper semantic structure', async () => {
      const { container } = render(
        <PoseActivityDetail poseCardProp={mockAsanaPose} />,
        {
          wrapper: TestWrapper,
        }
      )

      // Wait for the component to settle and verify semantic elements exist
      await waitFor(() => {
        const h2 = container.querySelector('h2')
        expect(h2).toBeTruthy()
        const groups = container.querySelectorAll('[role="group"]')
        expect(groups.length).toBeGreaterThan(0)
      })
    })

    it('should provide yoga instruction text for screen readers', () => {
      render(<PoseActivityDetail poseCardProp={mockAsanaPose} />, {
        wrapper: TestWrapper,
      })

      // Verify instructional text is accessible
      expect(screen.getByText(/Start in mountain pose/i)).toBeInTheDocument()
      expect(
        screen.getByText(/Sink deeper into the front knee/i)
      ).toBeInTheDocument()
    })
  })
})
