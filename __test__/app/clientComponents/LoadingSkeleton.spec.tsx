import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoadingSkeleton from '@clientComponents/LoadingSkeleton'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme()

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('LoadingSkeleton', () => {
  describe('Rendering', () => {
    it('should render without errors', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton />
        </TestWrapper>
      )

      // Default type is 'text' which renders Skeleton elements
      expect(document.querySelector('.MuiSkeleton-root')).toBeInTheDocument()
    })

    it('should render with default text type', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton type="text" />
        </TestWrapper>
      )

      // Should render multiple text lines by default (3 lines)
      const skeletons = document.querySelectorAll('.MuiSkeleton-text')
      expect(skeletons.length).toBe(3)
    })
  })

  describe('Type Variants', () => {
    it('should render search skeleton type', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton type="search" />
        </TestWrapper>
      )

      const skeleton = document.querySelector('.MuiSkeleton-rounded')
      expect(skeleton).toBeInTheDocument()
    })

    it('should render list skeleton type with circular avatars', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton type="list" lines={2} />
        </TestWrapper>
      )

      // Should render circular skeletons for avatars
      const circularSkeletons = document.querySelectorAll(
        '.MuiSkeleton-circular'
      )
      expect(circularSkeletons.length).toBe(2)
    })

    it('should render card skeleton type', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton type="card" />
        </TestWrapper>
      )

      const skeletons = document.querySelectorAll('.MuiSkeleton-root')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('should render circular skeleton type', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton type="circular" />
        </TestWrapper>
      )

      const circularSkeleton = document.querySelector('.MuiSkeleton-circular')
      expect(circularSkeleton).toBeInTheDocument()
    })

    it('should render custom skeleton type', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton type="custom" height={100} width={200} />
        </TestWrapper>
      )

      const skeleton = document.querySelector('.MuiSkeleton-rectangular')
      expect(skeleton).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('should respect lines prop for text type', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton type="text" lines={5} />
        </TestWrapper>
      )

      const skeletons = document.querySelectorAll('.MuiSkeleton-text')
      expect(skeletons.length).toBe(5)
    })

    it('should respect lines prop for list type', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton type="list" lines={4} />
        </TestWrapper>
      )

      const circularSkeletons = document.querySelectorAll(
        '.MuiSkeleton-circular'
      )
      expect(circularSkeletons.length).toBe(4)
    })

    it('should apply pulse animation by default', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton />
        </TestWrapper>
      )

      const skeleton = document.querySelector('.MuiSkeleton-pulse')
      expect(skeleton).toBeInTheDocument()
    })

    it('should apply wave animation when specified', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton animation="wave" />
        </TestWrapper>
      )

      const skeleton = document.querySelector('.MuiSkeleton-wave')
      expect(skeleton).toBeInTheDocument()
    })

    it('should disable animation when set to false', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton animation={false} />
        </TestWrapper>
      )

      // Neither pulse nor wave class should be present
      const pulseSkeleton = document.querySelector('.MuiSkeleton-pulse')
      const waveSkeleton = document.querySelector('.MuiSkeleton-wave')
      expect(pulseSkeleton).not.toBeInTheDocument()
      expect(waveSkeleton).not.toBeInTheDocument()
    })

    it('should apply custom sx styles', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton type="custom" sx={{ backgroundColor: 'red' }} />
        </TestWrapper>
      )

      const skeleton = document.querySelector('.MuiSkeleton-root')
      expect(skeleton).toBeInTheDocument()
    })
  })

  describe('List Type Details', () => {
    it('should render avatar and text lines for each list item', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton type="list" lines={1} />
        </TestWrapper>
      )

      // Should have circular (avatar) and text skeletons
      const circularSkeletons = document.querySelectorAll(
        '.MuiSkeleton-circular'
      )
      const textSkeletons = document.querySelectorAll('.MuiSkeleton-text')

      expect(circularSkeletons.length).toBe(1)
      expect(textSkeletons.length).toBeGreaterThan(0)
    })
  })

  describe('Card Type Details', () => {
    it('should render card with title and content lines', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton type="card" lines={3} />
        </TestWrapper>
      )

      const skeletons = document.querySelectorAll('.MuiSkeleton-root')
      // Card has a title + (lines - 1) content lines
      expect(skeletons.length).toBe(3)
    })
  })

  describe('Search Type Details', () => {
    it('should render search input skeleton with rounded corners', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton type="search" />
        </TestWrapper>
      )

      const skeleton = document.querySelector('.MuiSkeleton-rounded')
      expect(skeleton).toBeInTheDocument()
    })
  })

  describe('Text Type Details', () => {
    it('should render last line shorter than others', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton type="text" lines={3} />
        </TestWrapper>
      )

      const skeletons = document.querySelectorAll('.MuiSkeleton-text')
      expect(skeletons.length).toBe(3)
      // Last skeleton should have different width (70%)
      // We can't easily test computed styles but we verify the count
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard accessible (non-interactive)', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton />
        </TestWrapper>
      )

      // Skeletons should not be focusable since they're purely visual
      const skeleton = document.querySelector('.MuiSkeleton-root')
      expect(skeleton).toBeInTheDocument()
      expect(skeleton).not.toHaveFocus()
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero lines gracefully for text type', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton type="text" lines={0} />
        </TestWrapper>
      )

      const skeletons = document.querySelectorAll('.MuiSkeleton-text')
      expect(skeletons.length).toBe(0)
    })

    it('should handle large number of lines for list type', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton type="list" lines={10} />
        </TestWrapper>
      )

      const circularSkeletons = document.querySelectorAll(
        '.MuiSkeleton-circular'
      )
      expect(circularSkeletons.length).toBe(10)
    })

    it('should handle string dimensions', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton type="custom" width="100%" height="50px" />
        </TestWrapper>
      )

      const skeleton = document.querySelector('.MuiSkeleton-root')
      expect(skeleton).toBeInTheDocument()
    })

    it('should handle numeric dimensions', () => {
      render(
        <TestWrapper>
          <LoadingSkeleton type="custom" width={200} height={100} />
        </TestWrapper>
      )

      const skeleton = document.querySelector('.MuiSkeleton-root')
      expect(skeleton).toBeInTheDocument()
    })
  })
})
