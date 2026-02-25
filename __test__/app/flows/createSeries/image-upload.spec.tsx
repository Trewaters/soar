import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { theme } from '@styles/theme'
import Page from '@app/flows/createSeries/page'

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

// Mock AsanaSeriesContext
const mockDispatch = jest.fn()
const mockFlowSeriesState = {
  flowSeries: {
    seriesName: '',
    seriesPoses: [],
    breath: '',
    description: '',
    duration: '',
    image: '',
  },
}

jest.mock('@app/context/AsanaSeriesContext', () => ({
  useFlowSeries: () => ({
    state: mockFlowSeriesState,
    dispatch: mockDispatch,
  }),
}))

// Mock poseService
jest.mock('@lib/poseService', () => ({
  getAccessiblePoses: jest.fn(() => Promise.resolve([])),
}))

// Mock ImageManagement component
jest.mock('@app/clientComponents/imageUpload/ImageManagement', () => {
  return function MockImageManagement({
    onImageUploaded,
    uploadTitle,
    uploadSubtitle,
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
    uploadTitle?: string
    uploadSubtitle?: string
  }) {
    return (
      <div data-testid="mock-image-management">
        <div data-testid="upload-title">{uploadTitle}</div>
        <div data-testid="upload-subtitle">{uploadSubtitle}</div>
        <button
          data-testid="upload-image-button"
          onClick={() => {
            if (onImageUploaded) {
              onImageUploaded({
                id: 'img-456',
                url: 'https://example.com/series-image.jpg',
                altText: 'Test series image',
                fileName: 'series-image.jpg',
                fileSize: 2048,
                uploadedAt: new Date().toISOString(),
              })
            }
          }}
        >
          Upload Series Image
        </button>
      </div>
    )
  }
})

const mockSessionUser = {
  id: 'user456',
  email: 'seriesuser@example.com',
  name: 'Series User',
}

const mockSession = {
  user: mockSessionUser,
  expires: '2025-01-01',
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

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider session={mockSession}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </SessionProvider>
)

describe('CreateSeries Image Upload Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFlowSeriesState.flowSeries = {
      seriesName: '',
      seriesPoses: [],
      breath: '',
      description: '',
      duration: '',
      image: '',
    }
  })

  describe('Image Upload Section Rendering', () => {
    it('should render the Flow Image section header', async () => {
      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Flow Image')).toBeInTheDocument()
      })
    })

    it('should render the descriptive text about uploading one image', async () => {
      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(
          screen.getByText(/Upload one image to represent this flow/i)
        ).toBeInTheDocument()
      })
    })

    it('should render the ImageManagement component initially', async () => {
      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('mock-image-management')).toBeInTheDocument()
      })
    })

    it('should pass correct upload title to ImageManagement', async () => {
      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('upload-title')).toHaveTextContent(
          'Upload Flow Image'
        )
      })
    })

    it('should pass correct upload subtitle with "one image only" text', async () => {
      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('upload-subtitle')).toHaveTextContent(
          /one image only/i
        )
      })
    })
  })

  describe('Image Upload Functionality', () => {
    it('should update context when image is uploaded', async () => {
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
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_FLOW_SERIES_IMAGE',
          payload: 'https://example.com/series-image.jpg',
        })
      })
    })

    it('should hide upload component after image is uploaded', async () => {
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
        expect(
          screen.queryByTestId('mock-image-management')
        ).not.toBeInTheDocument()
      })
    })

    it('should show success message after image upload', async () => {
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
        expect(
          screen.getByText('Flow image uploaded successfully')
        ).toBeInTheDocument()
      })
    })

    it('should display uploaded image preview', async () => {
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
        const imagePreview = screen.getByAltText('Test series image')
        expect(imagePreview).toBeInTheDocument()
        expect(imagePreview).toHaveAttribute(
          'src',
          'https://example.com/series-image.jpg'
        )
      })
    })

    it('should display uploaded image filename', async () => {
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
        expect(screen.getByText('series-image.jpg')).toBeInTheDocument()
      })
    })
  })

  describe('Single Image Limitation', () => {
    it('should only allow one image upload', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('upload-image-button')).toBeInTheDocument()
      })

      // Upload first image
      await user.click(screen.getByTestId('upload-image-button'))

      await waitFor(() => {
        // Upload component should be hidden
        expect(
          screen.queryByTestId('upload-image-button')
        ).not.toBeInTheDocument()
      })

      // Verify the series image is displayed
      await waitFor(() => {
        expect(screen.getByAltText('Test series image')).toBeInTheDocument()
      })
    })

    it('should not show upload component when image is already uploaded', async () => {
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
        expect(
          screen.queryByTestId('mock-image-management')
        ).not.toBeInTheDocument()
      })
    })
  })

  describe('Remove Image Functionality', () => {
    it('should show Remove Image button after upload', async () => {
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
        expect(
          screen.getByRole('button', { name: /remove image/i })
        ).toBeInTheDocument()
      })
    })

    it('should remove image and show upload component when Remove Image is clicked', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      // Upload an image first
      await waitFor(() => {
        expect(screen.getByTestId('upload-image-button')).toBeInTheDocument()
      })
      await user.click(screen.getByTestId('upload-image-button'))

      // Wait for image to be uploaded
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /remove image/i })
        ).toBeInTheDocument()
      })

      // Click Remove Image
      await user.click(screen.getByRole('button', { name: /remove image/i }))

      // Upload component should be visible again
      await waitFor(() => {
        expect(screen.getByTestId('mock-image-management')).toBeInTheDocument()
      })
    })

    it('should clear image from context when Remove Image is clicked', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      // Upload an image first
      await waitFor(() => {
        expect(screen.getByTestId('upload-image-button')).toBeInTheDocument()
      })
      await user.click(screen.getByTestId('upload-image-button'))

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /remove image/i })
        ).toBeInTheDocument()
      })

      // Clear previous dispatch calls
      mockDispatch.mockClear()

      // Click Remove Image
      await user.click(screen.getByRole('button', { name: /remove image/i }))

      // Should dispatch action to clear image
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_FLOW_SERIES',
          payload: expect.objectContaining({
            image: '',
          }),
        })
      })
    })

    it('should hide success message after removing image', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Page />
        </TestWrapper>
      )

      // Upload an image
      await waitFor(() => {
        expect(screen.getByTestId('upload-image-button')).toBeInTheDocument()
      })
      await user.click(screen.getByTestId('upload-image-button'))

      await waitFor(() => {
        expect(
          screen.getByText('Flow image uploaded successfully')
        ).toBeInTheDocument()
      })

      // Remove the image
      await user.click(screen.getByRole('button', { name: /remove image/i }))

      // Success message should be gone
      await waitFor(() => {
        expect(
          screen.queryByText('Flow image uploaded successfully')
        ).not.toBeInTheDocument()
      })
    })
  })

  describe('Image Display Properties', () => {
    it('should display image in container with proper structure', async () => {
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
        const imagePreview = screen.getByAltText('Test series image')
        expect(imagePreview).toBeInTheDocument()
        expect(imagePreview).toHaveAttribute(
          'src',
          'https://example.com/series-image.jpg'
        )
      })
    })

    it('should display uploaded image with correct attributes', async () => {
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
        const imagePreview = screen.getByAltText('Test series image')
        expect(imagePreview).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have accessible alt text for uploaded image', async () => {
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
        const imagePreview = screen.getByAltText('Test series image')
        expect(imagePreview).toHaveAccessibleName()
      })
    })

    it('should have accessible Remove Image button', async () => {
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
        const removeButton = screen.getByRole('button', {
          name: /remove image/i,
        })
        expect(removeButton).toHaveAccessibleName()
      })
    })
  })
})
