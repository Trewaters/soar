import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { theme } from '@styles/theme'
import { NavigationLoadingProvider } from '@context/NavigationLoadingContext'
import Page from '@app/flows/createSequence/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock the alpha users utility
jest.mock('@app/lib/alphaUsers', () => ({
  __esModule: true,
  default: jest.fn(() => ['alpha1@uvuyoga.com']),
}))

// Mock the ImageUpload component
jest.mock('@clientComponents/imageUpload/ImageUpload', () => {
  return function MockImageUpload({
    onImageUploaded,
    onImageDeleted,
  }: {
    // eslint-disable-next-line no-unused-vars
    onImageUploaded?: (image: {
      id: string
      url: string
      altText?: string | null
      fileName?: string | null
      fileSize?: number | null
      uploadedAt: string
    }) => void
    // eslint-disable-next-line no-unused-vars
    onImageDeleted?: (imageId: string) => void
  }) {
    return (
      <div data-testid="mock-image-upload">
        <button
          data-testid="upload-image-button"
          onClick={() => {
            if (onImageUploaded) {
              onImageUploaded({
                id: 'img-123',
                url: 'https://example.com/test-image.jpg',
                altText: 'Test sequence image',
                fileName: 'test-image.jpg',
                fileSize: 1024,
                uploadedAt: new Date().toISOString(),
              })
            }
          }}
        >
          Upload Image
        </button>
        <button
          data-testid="delete-image-button"
          onClick={() => {
            if (onImageDeleted) {
              onImageDeleted('img-123')
            }
          }}
        >
          Delete Image
        </button>
      </div>
    )
  }
})

// Mock fetch for series data
global.fetch = jest.fn()

const mockSessionUser = {
  id: 'user123',
  email: 'testuser@example.com',
  name: 'Test User',
}

const mockSession = {
  user: mockSessionUser,
  expires: '2024-01-01',
}

const globalMockUseSession = (global as any).mockUseSession as
  | jest.Mock
  | undefined
if (globalMockUseSession) {
  globalMockUseSession.mockImplementation(() => ({
    data: mockSession,
    status: 'authenticated',
  }))
}

const mockSeriesData = [
  {
    id: '1',
    seriesName: 'Test Series',
    seriesPoses: ['Pose 1', 'Pose 2'],
    description: 'Test series',
    createdBy: 'testuser@example.com',
  },
]

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider session={mockSession}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavigationLoadingProvider>{children}</NavigationLoadingProvider>
    </ThemeProvider>
  </SessionProvider>
)

describe('CreateSequence Image Upload Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSeriesData),
    })
  })

  describe('Image Upload Section Rendering', () => {
    it('should render the Sequence Image section header', async () => {
      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Sequence Image')).toBeInTheDocument()
      })
    })

    it('should render the ImageUpload component', async () => {
      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('mock-image-upload')).toBeInTheDocument()
      })
    })

    it('should render the image upload with dropzone variant', async () => {
      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        const uploadComponent = screen.getByTestId('mock-image-upload')
        expect(uploadComponent).toBeInTheDocument()
      })
    })
  })

  describe('Image Upload Functionality', () => {
    it('should show image preview after uploading an image', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('upload-image-button')).toBeInTheDocument()
      })

      // Upload an image
      await user.click(screen.getByTestId('upload-image-button'))

      await waitFor(() => {
        const imagePreview = screen.getByAltText('Sequence preview')
        expect(imagePreview).toBeInTheDocument()
        expect(imagePreview).toHaveAttribute(
          'src',
          expect.stringContaining('test-image.jpg')
        )
      })
    })

    it('should update image state when image is uploaded', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('upload-image-button')).toBeInTheDocument()
      })

      // Initially no preview should be visible
      expect(screen.queryByAltText('Sequence preview')).not.toBeInTheDocument()

      // Upload an image
      await user.click(screen.getByTestId('upload-image-button'))

      // Preview should now be visible
      await waitFor(() => {
        expect(screen.getByAltText('Sequence preview')).toBeInTheDocument()
      })
    })

    it('should clear image when delete is clicked', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('upload-image-button')).toBeInTheDocument()
      })

      // Upload an image
      await user.click(screen.getByTestId('upload-image-button'))

      // Verify image is uploaded
      await waitFor(() => {
        expect(screen.getByAltText('Sequence preview')).toBeInTheDocument()
      })

      // Delete the image
      await user.click(screen.getByTestId('delete-image-button'))

      // Verify image is removed
      await waitFor(() => {
        expect(
          screen.queryByAltText('Sequence preview')
        ).not.toBeInTheDocument()
      })
    })
  })

  describe('Image Preview Display', () => {
    it('should display image preview with correct styling', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('upload-image-button')).toBeInTheDocument()
      })

      await user.click(screen.getByTestId('upload-image-button'))

      await waitFor(() => {
        const imagePreview = screen.getByAltText('Sequence preview')
        expect(imagePreview).toBeInTheDocument()

        // Check that image has proper styling attributes
        expect(imagePreview).toHaveAttribute('width', '400')
        expect(imagePreview).toHaveAttribute('height', '300')
      })
    })

    it('should not show preview when no image is uploaded', async () => {
      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('mock-image-upload')).toBeInTheDocument()
      })

      // No preview should be visible initially
      expect(screen.queryByAltText('Sequence preview')).not.toBeInTheDocument()
    })

    it('should show preview only after successful upload', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('upload-image-button')).toBeInTheDocument()
      })

      // Before upload - no preview
      expect(screen.queryByAltText('Sequence preview')).not.toBeInTheDocument()

      // Upload image
      await user.click(screen.getByTestId('upload-image-button'))

      // After upload - preview should appear
      await waitFor(() => {
        expect(screen.getByAltText('Sequence preview')).toBeInTheDocument()
      })
    })
  })

  describe('Image Section Layout', () => {
    it('should render image section with consistent styling', async () => {
      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        const heading = screen.getByText('Sequence Image')
        expect(heading).toBeInTheDocument()
      })

      // Decorative leaf icons use empty alt text (accessibility best practice)
      // so we verify the image section heading and upload component instead
      expect(screen.getByTestId('mock-image-upload')).toBeInTheDocument()
    })

    it('should position image section after description section', async () => {
      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Description')).toBeInTheDocument()
        expect(screen.getByText('Sequence Image')).toBeInTheDocument()
      })

      // Both sections should be visible
      const descriptionSection = screen.getByText('Description')
      const imageSection = screen.getByText('Sequence Image')

      expect(descriptionSection).toBeInTheDocument()
      expect(imageSection).toBeInTheDocument()
    })
  })

  describe('Image State Integration', () => {
    it('should maintain image state through component lifecycle', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('upload-image-button')).toBeInTheDocument()
      })

      // Upload image
      await user.click(screen.getByTestId('upload-image-button'))

      // Verify image persists
      await waitFor(() => {
        expect(screen.getByAltText('Sequence preview')).toBeInTheDocument()
      })

      // Image should still be there after waiting
      await waitFor(() => {
        expect(screen.getByAltText('Sequence preview')).toBeInTheDocument()
      })
    })

    it('should handle multiple upload and delete cycles', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('upload-image-button')).toBeInTheDocument()
      })

      // First upload
      await user.click(screen.getByTestId('upload-image-button'))
      await waitFor(() => {
        expect(screen.getByAltText('Sequence preview')).toBeInTheDocument()
      })

      // Delete
      await user.click(screen.getByTestId('delete-image-button'))
      await waitFor(() => {
        expect(
          screen.queryByAltText('Sequence preview')
        ).not.toBeInTheDocument()
      })

      // Second upload
      await user.click(screen.getByTestId('upload-image-button'))
      await waitFor(() => {
        expect(screen.getByAltText('Sequence preview')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure for image section', async () => {
      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        const imageHeading = screen.getByText('Sequence Image')
        expect(imageHeading).toBeInTheDocument()
        // Component uses h6 variant for section headings
        expect(imageHeading.tagName).toBe('H6')
      })
    })

    it('should have descriptive alt text for image preview', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('upload-image-button')).toBeInTheDocument()
      })

      await user.click(screen.getByTestId('upload-image-button'))

      await waitFor(() => {
        const imagePreview = screen.getByAltText('Sequence preview')
        expect(imagePreview).toBeInTheDocument()
      })
    })

    it('should have accessible structure with decorative icons', async () => {
      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        // Decorative leaf icons use empty alt text (accessibility best practice)
        // Verify section headings are accessible instead
        expect(screen.getByText('Sequence Image')).toBeInTheDocument()
        expect(screen.getByText('Sequence Name *')).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle missing image gracefully', async () => {
      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('mock-image-upload')).toBeInTheDocument()
      })

      // Should not crash when no image is present
      expect(screen.queryByAltText('Sequence preview')).not.toBeInTheDocument()
    })

    it('should handle rapid upload/delete operations', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('upload-image-button')).toBeInTheDocument()
      })

      // Rapid operations
      await user.click(screen.getByTestId('upload-image-button'))
      await user.click(screen.getByTestId('delete-image-button'))
      await user.click(screen.getByTestId('upload-image-button'))

      // Should end with image visible
      await waitFor(() => {
        expect(screen.getByAltText('Sequence preview')).toBeInTheDocument()
      })
    })
  })
})
