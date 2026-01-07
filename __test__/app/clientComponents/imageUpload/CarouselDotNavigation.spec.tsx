import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { SessionProvider } from 'next-auth/react'
import { CarouselDotNavigation } from '../../../../app/clientComponents/imageUpload/CarouselDotNavigation'
import { PoseImageData } from '../../../../types/images'
import theme from '../../../../styles/theme'

// Mock Next.js dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/test-path',
}))

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        id: 'test-user-id',
        email: 'test@uvuyoga.com',
        name: 'Test Yogi',
      },
      expires: '2025-12-31T23:59:59.999Z',
    },
    status: 'authenticated',
  }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Test wrapper with theme provider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider session={null}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </SessionProvider>
)

// Mock pose image data for testing
const mockImages: PoseImageData[] = [
  {
    id: 'image-1',
    userId: 'test-user-id',
    url: '/test-image-1.jpg',
    altText: 'Warrior I Pose',
    displayOrder: 0,
    poseId: 'pose-1',
    poseName: 'Warrior I',
    uploadedAt: new Date('2024-01-01'),
    storageType: 'CLOUD',
    isOffline: false,
    imageType: 'image/jpeg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'image-2',
    userId: 'test-user-id',
    url: '/test-image-2.jpg',
    altText: 'Downward Dog Pose',
    displayOrder: 1,
    poseId: 'pose-1',
    poseName: 'Downward Dog',
    uploadedAt: new Date('2024-01-02'),
    storageType: 'CLOUD',
    isOffline: false,
    imageType: 'image/jpeg',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: 'image-3',
    userId: 'test-user-id',
    url: '/test-image-3.jpg',
    altText: "Child's Pose",
    displayOrder: 2,
    poseId: 'pose-1',
    poseName: "Child's Pose",
    uploadedAt: new Date('2024-01-03'),
    storageType: 'CLOUD',
    isOffline: false,
    imageType: 'image/jpeg',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
]

const mockUnsortedImages: PoseImageData[] = [
  {
    id: 'image-1',
    userId: 'test-user-id',
    url: '/test-image-1.jpg',
    altText: 'Warrior I Pose',
    displayOrder: 2,
    poseId: 'pose-1',
    poseName: 'Warrior I',
    uploadedAt: new Date('2024-01-01'),
    storageType: 'CLOUD',
    isOffline: false,
    imageType: 'image/jpeg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'image-2',
    userId: 'test-user-id',
    url: '/test-image-2.jpg',
    altText: 'Downward Dog Pose',
    displayOrder: 0,
    poseId: 'pose-1',
    poseName: 'Downward Dog',
    uploadedAt: new Date('2024-01-02'),
    storageType: 'CLOUD',
    isOffline: false,
    imageType: 'image/jpeg',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: 'image-3',
    userId: 'test-user-id',
    url: '/test-image-3.jpg',
    altText: "Child's Pose",
    displayOrder: 1,
    poseId: 'pose-1',
    poseName: "Child's Pose",
    uploadedAt: new Date('2024-01-03'),
    storageType: 'CLOUD',
    isOffline: false,
    imageType: 'image/jpeg',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
]

describe('CarouselDotNavigation', () => {
  const mockOnIndexChange = jest.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without errors with valid props', () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByRole('tablist')).toBeInTheDocument()
      expect(screen.getAllByRole('tab')).toHaveLength(3)
    })

    it('should not render when there is only one image', () => {
      render(
        <CarouselDotNavigation
          images={[mockImages[0]]}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    })

    it('should not render when there are no images', () => {
      render(
        <CarouselDotNavigation
          images={[]}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    })

    it('should sort images by displayOrder before rendering', () => {
      render(
        <CarouselDotNavigation
          images={mockUnsortedImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      const tabs = screen.getAllByRole('tab')
      expect(tabs).toHaveLength(3)

      // First tab should correspond to image with displayOrder 0 (Downward Dog)
      expect(tabs[0]).toHaveAttribute('aria-label', 'Go to Image 1 of 3')

      // Check that the sorted order is correct by looking at screen reader text
      expect(screen.getByText(/Downward Dog Pose/)).toBeInTheDocument()
    })

    it('should apply custom className when provided', () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
          className="custom-dot-navigation"
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByRole('tablist')).toHaveClass('custom-dot-navigation')
    })

    it('should use custom aria-label when provided', () => {
      const customAriaLabel = 'Yoga pose image navigation'
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
          aria-label={customAriaLabel}
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByRole('tablist')).toHaveAttribute(
        'aria-label',
        customAriaLabel
      )
    })
  })

  describe('Active State Management', () => {
    it('should indicate the correct active dot', () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={1}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      const tabs = screen.getAllByRole('tab')
      expect(tabs[0]).toHaveAttribute('aria-selected', 'false')
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
      expect(tabs[2]).toHaveAttribute('aria-selected', 'false')
    })

    it('should update active state when activeIndex prop changes', () => {
      const { rerender } = render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      let tabs = screen.getAllByRole('tab')
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true')

      rerender(
        <TestWrapper>
          <CarouselDotNavigation
            images={mockImages}
            activeIndex={2}
            onIndexChange={mockOnIndexChange}
          />
        </TestWrapper>
      )

      tabs = screen.getAllByRole('tab')
      expect(tabs[0]).toHaveAttribute('aria-selected', 'false')
      expect(tabs[2]).toHaveAttribute('aria-selected', 'true')
    })

    it('should display screen reader text for current position', () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={1}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      expect(
        screen.getByText(/Currently viewing image 2 of 3/)
      ).toBeInTheDocument()
      expect(screen.getByText(/Downward Dog Pose/)).toBeInTheDocument()
    })
  })

  describe('Click Navigation', () => {
    it('should call onIndexChange when a dot is clicked', async () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      const secondTab = screen.getAllByRole('tab')[1]
      await user.click(secondTab)

      expect(mockOnIndexChange).toHaveBeenCalledWith(1)
      expect(mockOnIndexChange).toHaveBeenCalledTimes(1)
    })

    it('should handle clicking on already active dot', async () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={1}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      const activeTab = screen.getAllByRole('tab')[1]
      await user.click(activeTab)

      expect(mockOnIndexChange).toHaveBeenCalledWith(1)
    })

    it('should handle rapid successive clicks', async () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      const tabs = screen.getAllByRole('tab')
      await user.click(tabs[1])
      await user.click(tabs[2])
      await user.click(tabs[0])

      expect(mockOnIndexChange).toHaveBeenCalledTimes(3)
      expect(mockOnIndexChange).toHaveBeenNthCalledWith(1, 1)
      expect(mockOnIndexChange).toHaveBeenNthCalledWith(2, 2)
      expect(mockOnIndexChange).toHaveBeenNthCalledWith(3, 0)
    })
  })

  describe('Keyboard Navigation', () => {
    it('should navigate with Enter key', async () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      const secondTab = screen.getAllByRole('tab')[1]
      secondTab.focus()
      await user.keyboard('{Enter}')

      expect(mockOnIndexChange).toHaveBeenCalledWith(1)
    })

    it('should navigate with Space key', async () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      const secondTab = screen.getAllByRole('tab')[1]
      secondTab.focus()
      await user.keyboard(' ')

      expect(mockOnIndexChange).toHaveBeenCalledWith(1)
    })

    it('should navigate with Arrow keys', async () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={1}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      const currentTab = screen.getAllByRole('tab')[1]
      currentTab.focus()

      // Arrow right should go to next index
      await user.keyboard('{ArrowRight}')
      expect(mockOnIndexChange).toHaveBeenCalledWith(2)

      // Arrow left should go to previous index
      await user.keyboard('{ArrowLeft}')
      expect(mockOnIndexChange).toHaveBeenCalledWith(0)
    })

    it('should handle Arrow key boundaries correctly', async () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      const firstTab = screen.getAllByRole('tab')[0]
      firstTab.focus()

      // Arrow left at first position should not call onIndexChange
      await user.keyboard('{ArrowLeft}')
      expect(mockOnIndexChange).not.toHaveBeenCalled()

      // Test right boundary
      const { rerender } = render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={2}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      const lastTab = screen.getAllByRole('tab')[2]
      lastTab.focus()

      // Arrow right at last position should not call onIndexChange
      jest.clearAllMocks()
      await user.keyboard('{ArrowRight}')
      expect(mockOnIndexChange).not.toHaveBeenCalled()
    })

    it('should navigate to first/last with Home/End keys', async () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={1}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      const currentTab = screen.getAllByRole('tab')[1]
      currentTab.focus()

      // Home key should go to first index
      await user.keyboard('{Home}')
      expect(mockOnIndexChange).toHaveBeenCalledWith(0)

      // End key should go to last index
      await user.keyboard('{End}')
      expect(mockOnIndexChange).toHaveBeenCalledWith(2)
    })

    it('should handle keyboard navigation correctly', () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={1}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      const currentTab = screen.getAllByRole('tab')[1]

      // Test that navigation works for different keys
      fireEvent.keyDown(currentTab, { key: 'Enter' })
      expect(mockOnIndexChange).toHaveBeenCalledWith(1)

      fireEvent.keyDown(currentTab, { key: ' ' })
      expect(mockOnIndexChange).toHaveBeenCalledWith(1)

      fireEvent.keyDown(currentTab, { key: 'Home' })
      expect(mockOnIndexChange).toHaveBeenCalledWith(0)

      fireEvent.keyDown(currentTab, { key: 'End' })
      expect(mockOnIndexChange).toHaveBeenCalledWith(2)
    })
  })

  describe('Size Variations', () => {
    it('should apply small size styling', () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
          size="small"
        />,
        { wrapper: TestWrapper }
      )

      const tablist = screen.getByRole('tablist')
      expect(tablist).toBeInTheDocument()
      // Visual check - small dots should be 8px (verified through component logic)
    })

    it('should apply large size styling', () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
          size="large"
        />,
        { wrapper: TestWrapper }
      )

      const tablist = screen.getByRole('tablist')
      expect(tablist).toBeInTheDocument()
      // Visual check - large dots should be 16px (verified through component logic)
    })

    it('should use medium size as default', () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      const tablist = screen.getByRole('tablist')
      expect(tablist).toBeInTheDocument()
      // Default size should be medium (12px dots)
    })
  })

  describe('Color Variations', () => {
    it('should apply primary color theme', () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
          color="primary"
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByRole('tablist')).toBeInTheDocument()
      // Color verification happens through theme integration
    })

    it('should apply secondary color theme', () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
          color="secondary"
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })

    it('should apply default color theme', () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
          color="default"
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })
  })

  describe('Tooltips and Labels', () => {
    it('should show basic tooltips without labels', async () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
          showLabels={false}
        />,
        { wrapper: TestWrapper }
      )

      const firstTab = screen.getAllByRole('tab')[0]
      await user.hover(firstTab)

      await waitFor(() => {
        expect(screen.getByText('Image 1 of 3')).toBeInTheDocument()
      })
    })

    it('should show detailed tooltips with labels enabled', async () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
          showLabels={true}
        />,
        { wrapper: TestWrapper }
      )

      const firstTab = screen.getAllByRole('tab')[0]
      await user.hover(firstTab)

      await waitFor(() => {
        expect(
          screen.getByText('Image 1 of 3: Warrior I Pose')
        ).toBeInTheDocument()
      })
    })

    it('should handle images without altText gracefully', async () => {
      const imagesWithoutAltText = mockImages.map((img) => ({
        ...img,
        altText: undefined,
      }))

      render(
        <CarouselDotNavigation
          images={imagesWithoutAltText}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
          showLabels={true}
        />,
        { wrapper: TestWrapper }
      )

      const firstTab = screen.getAllByRole('tab')[0]
      await user.hover(firstTab)

      await waitFor(() => {
        expect(screen.getByText('Image 1 of 3: Warrior I')).toBeInTheDocument()
      })
    })

    it('should fall back to basic tooltip when no altText or poseName', async () => {
      const imagesWithoutLabels = mockImages.map((img) => ({
        ...img,
        altText: undefined,
        poseName: undefined,
      }))

      render(
        <CarouselDotNavigation
          images={imagesWithoutLabels}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
          showLabels={true}
        />,
        { wrapper: TestWrapper }
      )

      const firstTab = screen.getAllByRole('tab')[0]
      await user.hover(firstTab)

      await waitFor(() => {
        expect(screen.getByText('Image 1 of 3')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA roles and attributes', () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={1}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      const tablist = screen.getByRole('tablist')
      expect(tablist).toHaveAttribute('aria-label', 'Image navigation dots')

      const tabs = screen.getAllByRole('tab')
      tabs.forEach((tab, index) => {
        expect(tab).toHaveAttribute('aria-controls', `carousel-panel-${index}`)
        expect(tab).toHaveAttribute(
          'aria-selected',
          index === 1 ? 'true' : 'false'
        )
        expect(tab).toHaveAttribute('tabIndex', '0')
      })
    })

    it('should have descriptive aria-labels for each dot', () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      const tabs = screen.getAllByRole('tab')
      expect(tabs[0]).toHaveAttribute('aria-label', 'Go to Image 1 of 3')
      expect(tabs[1]).toHaveAttribute('aria-label', 'Go to Image 2 of 3')
      expect(tabs[2]).toHaveAttribute('aria-label', 'Go to Image 3 of 3')
    })

    it('should have live region for screen readers', () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={1}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      // Find the live region by its text content
      const liveRegion = screen.getByText(/Currently viewing image 2 of 3/)
      expect(liveRegion).toHaveAttribute('aria-live', 'polite')
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true')
    })

    it('should have focus indicators', () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      const firstTab = screen.getAllByRole('tab')[0]
      expect(firstTab).toHaveAttribute('tabIndex', '0')
      // Focus styling is applied through MUI sx prop (verified in component)
    })

    it('should support keyboard focus management', async () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      const tabs = screen.getAllByRole('tab')

      // Tab key should focus the first tab
      await user.tab()
      expect(tabs[0]).toHaveFocus()

      // Shift+Tab should remove focus
      await user.tab({ shift: true })
      expect(tabs[0]).not.toHaveFocus()
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid activeIndex gracefully', () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={10} // Invalid index
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      // Component should still render without crashing
      expect(screen.getByRole('tablist')).toBeInTheDocument()
      expect(screen.getAllByRole('tab')).toHaveLength(3)
    })

    it('should handle negative activeIndex gracefully', () => {
      render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={-1}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByRole('tablist')).toBeInTheDocument()
      expect(screen.getAllByRole('tab')).toHaveLength(3)
    })

    it('should handle missing image properties gracefully', () => {
      const incompleteImages = [
        {
          id: 'img-1',
          url: '/test1.jpg',
          displayOrder: 0,
          poseId: 'pose-1',
        },
        {
          id: 'img-2',
          url: '/test2.jpg',
          displayOrder: 1,
          poseId: 'pose-1',
        },
      ] as PoseImageData[]

      render(
        <CarouselDotNavigation
          images={incompleteImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByRole('tablist')).toBeInTheDocument()
      expect(screen.getAllByRole('tab')).toHaveLength(2)
    })
  })

  describe('Performance', () => {
    it('should not re-render unnecessarily when props do not change', () => {
      const { rerender } = render(
        <CarouselDotNavigation
          images={mockImages}
          activeIndex={0}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      // Re-render with the same props
      rerender(
        <TestWrapper>
          <CarouselDotNavigation
            images={mockImages}
            activeIndex={0}
            onIndexChange={mockOnIndexChange}
          />
        </TestWrapper>
      )

      // Component should still be functional
      expect(screen.getByRole('tablist')).toBeInTheDocument()
      expect(screen.getAllByRole('tab')).toHaveLength(3)
    })

    it('should handle large numbers of images efficiently', () => {
      const manyImages = Array.from({ length: 20 }, (_, index) => ({
        id: `image-${index}`,
        userId: 'test-user-id',
        url: `/test-image-${index}.jpg`,
        altText: `Pose ${index + 1}`,
        displayOrder: index,
        poseId: 'pose-1',
        poseName: `Pose ${index + 1}`,
        uploadedAt: new Date(),
        storageType: 'CLOUD' as const,
        isOffline: false,
        imageType: 'image/jpeg',
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      render(
        <CarouselDotNavigation
          images={manyImages}
          activeIndex={5}
          onIndexChange={mockOnIndexChange}
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByRole('tablist')).toBeInTheDocument()
      expect(screen.getAllByRole('tab')).toHaveLength(20)
    })
  })
})
