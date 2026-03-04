/**
 * @jest-environment jsdom
 */

/**
 * Unit Tests for ImageCarousel Component
 * Tests carousel navigation (arrows, dots, keyboard, touch) and state management
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { ImageCarousel } from '../../../../app/clientComponents/imageUpload/ImageCarousel'
import { PoseImageData } from '../../../../types/images'
import theme from '../../../../styles/theme'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} data-testid="next-image" />
  ),
}))

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

// Mock image data
const mockImages: PoseImageData[] = [
  {
    id: '1',
    userId: 'user-1',
    poseId: 'pose-1',
    url: 'https://example.com/image1.jpg',
    displayOrder: 1,
    fileName: 'image1.jpg',
    fileSize: 1024,
    imageType: 'image/jpeg',
    uploadedAt: new Date('2023-01-01'),
    storageType: 'CLOUD',
    isOffline: false,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    userId: 'user-1',
    poseId: 'pose-1',
    url: 'https://example.com/image2.jpg',
    displayOrder: 2,
    fileName: 'image2.jpg',
    fileSize: 2048,
    imageType: 'image/jpeg',
    uploadedAt: new Date('2023-01-02'),
    storageType: 'CLOUD',
    isOffline: false,
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02'),
  },
  {
    id: '3',
    userId: 'user-1',
    poseId: 'pose-1',
    url: 'https://example.com/image3.jpg',
    displayOrder: 3,
    fileName: 'image3.jpg',
    fileSize: 1536,
    imageType: 'image/jpeg',
    uploadedAt: new Date('2023-01-03'),
    storageType: 'CLOUD',
    isOffline: false,
    createdAt: new Date('2023-01-03'),
    updatedAt: new Date('2023-01-03'),
  },
]

const singleImage = [mockImages[0]]

describe('ImageCarousel', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without errors with multiple images', () => {
      render(
        <TestWrapper>
          <ImageCarousel images={mockImages} />
        </TestWrapper>
      )

      expect(
        screen.getByRole('img', { name: /image carousel/i })
      ).toBeInTheDocument()
      expect(screen.getByTestId('next-image')).toBeInTheDocument()
    })

    it('should render without errors with single image', () => {
      render(
        <TestWrapper>
          <ImageCarousel images={singleImage} />
        </TestWrapper>
      )

      expect(
        screen.getByRole('img', { name: /image carousel/i })
      ).toBeInTheDocument()
      expect(screen.getByTestId('next-image')).toBeInTheDocument()
    })

    it('should render empty state with no images', () => {
      render(
        <TestWrapper>
          <ImageCarousel images={[]} />
        </TestWrapper>
      )

      expect(screen.getByText(/no images available/i)).toBeInTheDocument()
    })

    it('should display correct aria-label', () => {
      const customAriaLabel = 'Custom yoga pose carousel'
      render(
        <TestWrapper>
          <ImageCarousel images={mockImages} aria-label={customAriaLabel} />
        </TestWrapper>
      )

      expect(
        screen.getByRole('img', { name: new RegExp(customAriaLabel, 'i') })
      ).toBeInTheDocument()
    })
  })

  describe('Navigation Controls', () => {
    it('should show navigation arrows for multiple images', () => {
      render(
        <TestWrapper>
          <ImageCarousel images={mockImages} showArrows={true} />
        </TestWrapper>
      )

      expect(
        screen.getByRole('button', { name: /previous image/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /next image/i })
      ).toBeInTheDocument()
    })

    it('should hide navigation arrows when showArrows is false', () => {
      render(
        <TestWrapper>
          <ImageCarousel images={mockImages} showArrows={false} />
        </TestWrapper>
      )

      expect(
        screen.queryByRole('button', { name: /previous image/i })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: /next image/i })
      ).not.toBeInTheDocument()
    })

    it('should navigate to next image when next button is clicked', async () => {
      const onIndexChange = jest.fn()
      render(
        <TestWrapper>
          <ImageCarousel images={mockImages} onIndexChange={onIndexChange} />
        </TestWrapper>
      )

      const nextButton = screen.getByRole('button', { name: /next image/i })
      await user.click(nextButton)

      expect(onIndexChange).toHaveBeenCalledWith(1)
    })

    it('should navigate to previous image when previous button is clicked', async () => {
      const onIndexChange = jest.fn()
      render(
        <TestWrapper>
          <ImageCarousel
            images={mockImages}
            currentIndex={1}
            onIndexChange={onIndexChange}
          />
        </TestWrapper>
      )

      const prevButton = screen.getByRole('button', { name: /previous image/i })
      await user.click(prevButton)

      expect(onIndexChange).toHaveBeenCalledWith(0)
    })

    it('should wrap to last image when clicking previous on first image', async () => {
      const onIndexChange = jest.fn()
      render(
        <TestWrapper>
          <ImageCarousel
            images={mockImages}
            currentIndex={0}
            onIndexChange={onIndexChange}
          />
        </TestWrapper>
      )

      const prevButton = screen.getByRole('button', { name: /previous image/i })
      await user.click(prevButton)

      expect(onIndexChange).toHaveBeenCalledWith(2) // Last image index
    })

    it('should wrap to first image when clicking next on last image', async () => {
      const onIndexChange = jest.fn()
      render(
        <TestWrapper>
          <ImageCarousel
            images={mockImages}
            currentIndex={2}
            onIndexChange={onIndexChange}
          />
        </TestWrapper>
      )

      const nextButton = screen.getByRole('button', { name: /next image/i })
      await user.click(nextButton)

      expect(onIndexChange).toHaveBeenCalledWith(0) // First image index
    })
  })

  describe('Keyboard Navigation', () => {
    it('should navigate with arrow keys', async () => {
      const onIndexChange = jest.fn()
      render(
        <TestWrapper>
          <ImageCarousel
            images={mockImages}
            currentIndex={1}
            onIndexChange={onIndexChange}
          />
        </TestWrapper>
      )

      const carousel = screen.getByRole('img', { name: /image carousel/i })
      carousel.focus()

      // Right arrow should go to next image (from 1 to 2)
      await user.keyboard('{ArrowRight}')
      expect(onIndexChange).toHaveBeenCalledWith(2)

      // Clear mock and test left arrow (from current position back to 0, since the component state is still at 1)
      onIndexChange.mockClear()
      await user.keyboard('{ArrowLeft}')
      expect(onIndexChange).toHaveBeenCalledWith(0)
    })

    it('should navigate with space and enter keys on buttons', async () => {
      const onIndexChange = jest.fn()
      render(
        <TestWrapper>
          <ImageCarousel images={mockImages} onIndexChange={onIndexChange} />
        </TestWrapper>
      )

      const nextButton = screen.getByRole('button', {
        name: /next image/i,
      })
      nextButton.focus()

      await user.keyboard('{Enter}')
      expect(onIndexChange).toHaveBeenLastCalledWith(1)

      // Reset mock and test space key
      onIndexChange.mockClear()
      await user.keyboard(' ')
      expect(onIndexChange).toHaveBeenCalledWith(1)
    })
  })

  describe('Touch Navigation', () => {
    it('should handle touch swipe gestures', async () => {
      const onIndexChange = jest.fn()
      render(
        <TestWrapper>
          <ImageCarousel images={mockImages} onIndexChange={onIndexChange} />
        </TestWrapper>
      )

      const carousel = screen.getByRole('img', { name: /image carousel/i })
      carousel.focus()

      // Test swipe left (next image) - start at 100, end at 40 (distance = 60 > 50, triggers next)
      fireEvent.touchStart(carousel, {
        targetTouches: [{ clientX: 100, clientY: 50 }],
      })
      fireEvent.touchMove(carousel, {
        targetTouches: [{ clientX: 70, clientY: 50 }],
      })
      fireEvent.touchEnd(carousel, {
        changedTouches: [{ clientX: 40, clientY: 50 }],
      })

      await waitFor(
        () => {
          expect(onIndexChange).toHaveBeenCalledWith(1)
        },
        { timeout: 200 }
      )
    })

    it('should ignore small touch movements', async () => {
      const onIndexChange = jest.fn()
      render(
        <TestWrapper>
          <ImageCarousel images={mockImages} onIndexChange={onIndexChange} />
        </TestWrapper>
      )

      const carousel = screen.getByRole('img', { name: /image carousel/i })

      // Simulate small touch movement (should be ignored)
      fireEvent.touchStart(carousel, {
        targetTouches: [{ clientX: 100, clientY: 50 }],
      })
      fireEvent.touchEnd(carousel, {
        changedTouches: [{ clientX: 95, clientY: 50 }],
      })

      await waitFor(() => {
        expect(onIndexChange).not.toHaveBeenCalled()
      })
    })
  })

  describe('Auto Play', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.runOnlyPendingTimers()
      jest.useRealTimers()
    })

    it('should auto-advance images when autoPlay is enabled', async () => {
      const onIndexChange = jest.fn()
      render(
        <TestWrapper>
          <ImageCarousel
            images={mockImages}
            autoPlay={true}
            autoPlayInterval={1000}
            onIndexChange={onIndexChange}
          />
        </TestWrapper>
      )

      // Fast forward time by interval amount
      jest.advanceTimersByTime(1000)

      await waitFor(() => {
        expect(onIndexChange).toHaveBeenCalledWith(1)
      })
    })

    it('should not auto-advance when autoPlay is disabled', async () => {
      const onIndexChange = jest.fn()
      render(
        <TestWrapper>
          <ImageCarousel
            images={mockImages}
            autoPlay={false}
            onIndexChange={onIndexChange}
          />
        </TestWrapper>
      )

      jest.advanceTimersByTime(5000)

      expect(onIndexChange).not.toHaveBeenCalled()
    })

    it('should pause auto-play on hover', async () => {
      const onIndexChange = jest.fn()
      render(
        <TestWrapper>
          <ImageCarousel
            images={mockImages}
            autoPlay={true}
            autoPlayInterval={1000}
            onIndexChange={onIndexChange}
          />
        </TestWrapper>
      )

      const carousel = screen.getByRole('img', { name: /image carousel/i })

      // Hover over carousel to pause auto-play
      fireEvent.mouseEnter(carousel)

      // Advance time - should not trigger index change due to hover
      jest.advanceTimersByTime(1000)

      expect(onIndexChange).not.toHaveBeenCalled()

      // Unhover to resume auto-play
      fireEvent.mouseLeave(carousel)

      // Now it should advance after interval
      jest.advanceTimersByTime(1000)

      await waitFor(
        () => {
          expect(onIndexChange).toHaveBeenCalledWith(1)
        },
        { timeout: 100 }
      )
    })
  })

  describe('Image Display', () => {
    it('should display images in correct display order', () => {
      const unorderedImages = [
        { ...mockImages[2], displayOrder: 3 },
        { ...mockImages[0], displayOrder: 1 },
        { ...mockImages[1], displayOrder: 2 },
      ]

      render(
        <TestWrapper>
          <ImageCarousel images={unorderedImages} />
        </TestWrapper>
      )

      const image = screen.getByTestId('next-image')
      expect(image).toHaveAttribute('src', mockImages[0].url)
    })

    it('should handle missing images gracefully', () => {
      const imagesWithMissing = [
        mockImages[0],
        undefined,
        mockImages[2],
      ].filter(Boolean) as PoseImageData[]

      render(
        <TestWrapper>
          <ImageCarousel images={imagesWithMissing} />
        </TestWrapper>
      )

      expect(screen.getByTestId('next-image')).toBeInTheDocument()
    })

    it('should show loading skeleton initially', () => {
      render(
        <TestWrapper>
          <ImageCarousel images={mockImages} />
        </TestWrapper>
      )

      // Skeleton should be present in the DOM
      expect(screen.getByTestId('next-image')).toBeInTheDocument()
      const skeletons = document.querySelectorAll('.MuiSkeleton-root')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('should apply custom height', () => {
      render(
        <TestWrapper>
          <ImageCarousel images={mockImages} height={300} />
        </TestWrapper>
      )

      const carousel = screen.getByRole('img', { name: /image carousel/i })
      expect(carousel).toHaveStyle({ height: '300px' })
    })
  })

  describe('State Management', () => {
    it('should update internal state when currentIndex prop changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <ImageCarousel images={mockImages} currentIndex={0} />
        </TestWrapper>
      )

      // Change currentIndex prop
      rerender(
        <TestWrapper>
          <ImageCarousel images={mockImages} currentIndex={1} />
        </TestWrapper>
      )

      // Should display second image
      const image = screen.getByTestId('next-image')
      expect(image).toHaveAttribute('src', mockImages[1].url)
    })

    it('should handle image array changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <ImageCarousel images={mockImages} />
        </TestWrapper>
      )

      // Change to single image
      rerender(
        <TestWrapper>
          <ImageCarousel images={singleImage} />
        </TestWrapper>
      )

      // Should display single image
      const image = screen.getByTestId('next-image')
      expect(image).toHaveAttribute('src', singleImage[0].url)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(
        <TestWrapper>
          <ImageCarousel images={mockImages} />
        </TestWrapper>
      )

      expect(
        screen.getByRole('img', { name: /image carousel/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /previous image/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /next image/i })
      ).toBeInTheDocument()
    })

    it('should support screen reader navigation', () => {
      render(
        <TestWrapper>
          <ImageCarousel images={mockImages} />
        </TestWrapper>
      )

      const carousel = screen.getByRole('img', { name: /image carousel/i })
      expect(carousel).toHaveAttribute('tabIndex', '0')
    })

    it('should announce current position to screen readers', () => {
      render(
        <TestWrapper>
          <ImageCarousel images={mockImages} currentIndex={1} />
        </TestWrapper>
      )

      // Position is announced in the aria-label
      expect(
        screen.getByRole('img', {
          name: /image 2 of 3/i,
        })
      ).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should handle empty images array gracefully', () => {
      render(
        <TestWrapper>
          <ImageCarousel images={[]} />
        </TestWrapper>
      )

      // Component should show empty state message
      expect(screen.getByText('No images available')).toBeInTheDocument()
    })

    it('should handle images with missing properties', () => {
      const incompleteImages: PoseImageData[] = [
        {
          id: '1',
          url: 'https://example.com/image1.jpg',
          displayOrder: 1,
          userId: 'user1',
          uploadedAt: new Date(),
          storageType: 'CLOUD' as const,
          isOffline: false,
          imageType: 'original',
          createdAt: new Date(),
          updatedAt: new Date(),
          // Missing optional properties like altText, poseName
        },
      ]

      render(
        <TestWrapper>
          <ImageCarousel images={incompleteImages} />
        </TestWrapper>
      )

      // Component should still render without crashing
      expect(
        screen.getByRole('img', { name: /image carousel/i })
      ).toBeInTheDocument()
    })
  })
})
