/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import theme from '../../../../styles/theme'
import PoseImageGallery from '../../../../app/clientComponents/imageUpload/PoseImageGallery'

// Mock next-auth
jest.mock('next-auth/react')
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

// Mock fetch
global.fetch = jest.fn()

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

// Mock the new components
jest.mock('../../../../app/clientComponents/imageUpload/ImageReorder', () => {
  return function MockImageReorder({ images, onReorder }: any) {
    return (
      <div data-testid="image-reorder">
        <div>Reorder Interface</div>
        <div>Images: {images.length}</div>
        <button onClick={() => onReorder(images)} data-testid="reorder-save">
          Save Order
        </button>
      </div>
    )
  }
})

// Test wrapper with theme
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

const mockImages = [
  {
    id: 'img1',
    url: 'https://example.com/image1.jpg',
    altText: 'Yoga pose 1',
    fileName: 'pose1.jpg',
    fileSize: 102400,
    uploadedAt: '2024-01-01T10:00:00Z',
    order: 1,
    displayOrder: 1,
  },
  {
    id: 'img2',
    url: 'https://example.com/image2.jpg',
    altText: 'Yoga pose 2',
    fileName: 'pose2.jpg',
    fileSize: 204800,
    uploadedAt: '2024-01-01T11:00:00Z',
    order: 2,
    displayOrder: 2,
  },
  {
    id: 'img3',
    url: 'https://example.com/image3.jpg',
    altText: 'Yoga pose 3',
    fileName: 'pose3.jpg',
    fileSize: 153600,
    uploadedAt: '2024-01-01T12:00:00Z',
    order: 3,
    displayOrder: 3,
  },
]

describe('PoseImageGallery Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock successful session
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        },
        expires: '2024-12-31',
      } as any,
      status: 'authenticated',
      update: jest.fn(),
    } as any)

    // Mock successful image fetch with ownership data
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        images: mockImages,
        ownership: {
          canManage: true,
          isOwner: true,
          isUserCreated: true,
        },
      }),
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render tab interface when management is enabled and multiple images exist', async () => {
    render(
      <TestWrapper>
        <PoseImageGallery
          poseId="pose1"
          poseName="Mountain Pose"
          enableManagement={true}
        />
      </TestWrapper>
    )

    // Wait for images to load and check for the image count indicator
    await waitFor(
      () => {
        expect(screen.getByText(/3 images/)).toBeInTheDocument()
      },
      { timeout: 3000 }
    )

    // Should show tab interface for multiple images
    await waitFor(() => {
      expect(screen.getByText('View Images')).toBeInTheDocument()
      expect(screen.getByText('Reorder Images')).toBeInTheDocument()
      expect(screen.getByText('Manage Images')).toBeInTheDocument()
    })
  })

  it('should switch between carousel and reorder views', async () => {
    render(
      <TestWrapper>
        <PoseImageGallery
          poseId="pose1"
          poseName="Mountain Pose"
          enableManagement={true}
        />
      </TestWrapper>
    )

    // Wait for images to load and check for the image count indicator
    await waitFor(
      () => {
        expect(screen.getByText(/3 images/)).toBeInTheDocument()
      },
      { timeout: 3000 }
    )

    // Wait for tabs to appear
    await waitFor(() => {
      expect(screen.getByText('Reorder Images')).toBeInTheDocument()
    })

    // Should start in carousel view by default
    expect(screen.queryByTestId('image-reorder')).not.toBeInTheDocument()

    // Click reorder tab
    fireEvent.click(screen.getByText('Reorder Images'))

    // Should show reorder interface
    await waitFor(() => {
      expect(screen.getByTestId('image-reorder')).toBeInTheDocument()
      expect(screen.getByText('Reorder Interface')).toBeInTheDocument()
      expect(screen.getByText('Images: 3')).toBeInTheDocument()
    })
  })

  it('should switch to management view and handle delete', async () => {
    render(
      <TestWrapper>
        <PoseImageGallery
          poseId="pose1"
          poseName="Mountain Pose"
          enableManagement={true}
        />
      </TestWrapper>
    )

    // Wait for images to load and check for the image count indicator
    await waitFor(
      () => {
        expect(screen.getByText(/3 images/)).toBeInTheDocument()
      },
      { timeout: 3000 }
    )

    // Wait for tabs to appear
    await waitFor(() => {
      expect(screen.getByText('Manage Images')).toBeInTheDocument()
    })

    // Click manage tab
    fireEvent.click(screen.getByText('Manage Images'))

    // Should show management interface (grid of images with delete buttons)
    await waitFor(() => {
      expect(screen.getByTestId('image-management')).toBeInTheDocument()
      expect(screen.getByText('Yoga pose 1')).toBeInTheDocument()
      expect(screen.getByTestId('delete-image')).toBeInTheDocument()
    })

    // Mock delete API call
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    // Trigger delete
    fireEvent.click(screen.getByTestId('delete-image'))

    // Wait for confirmation dialog to appear
    await waitFor(() => {
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument()
    })

    // Confirm the delete in the dialog
    fireEvent.click(screen.getByText('Delete Image'))

    // Verify delete API was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/images/img1',
        expect.objectContaining({
          method: 'DELETE',
        })
      )
    })
  })

  it('should handle reorder API calls', async () => {
    render(
      <TestWrapper>
        <PoseImageGallery
          poseId="pose1"
          poseName="Mountain Pose"
          enableManagement={true}
        />
      </TestWrapper>
    )

    await waitFor(
      () => {
        expect(screen.getByText(/3 images/)).toBeInTheDocument()
      },
      { timeout: 3000 }
    )

    // Wait for tabs to appear
    await waitFor(() => {
      expect(screen.getByText('Reorder Images')).toBeInTheDocument()
    })

    // Switch to reorder view
    fireEvent.click(screen.getByText('Reorder Images'))

    await waitFor(() => {
      expect(screen.getByTestId('image-reorder')).toBeInTheDocument()
    })

    // Mock reorder API call
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    // Trigger reorder save
    fireEvent.click(screen.getByTestId('reorder-save'))

    // Verify reorder API was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/asana/pose1/images/reorder',
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
    })
  })

  it('should not show tabs for single image', async () => {
    // Mock single image response - override the beforeEach mock
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        images: [mockImages[0]],
        ownership: {
          canManage: true,
          isOwner: true,
          isUserCreated: true,
        },
      }),
    })

    render(
      <TestWrapper>
        <PoseImageGallery
          poseId="pose1"
          poseName="Mountain Pose"
          enableManagement={true}
        />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText(/1 image/)).toBeInTheDocument()
    })

    // Should not show tabs for single image
    expect(screen.queryByText('View Images')).not.toBeInTheDocument()
    expect(screen.queryByText('Reorder Images')).not.toBeInTheDocument()
    expect(screen.queryByText('Manage Images')).not.toBeInTheDocument()
  })

  it('should handle ownership permissions correctly', async () => {
    render(
      <TestWrapper>
        <PoseImageGallery
          poseId="pose1"
          poseName="Mountain Pose"
          enableManagement={true}
        />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText(/3 images/)).toBeInTheDocument()
    })

    // Should show tabs when user can manage (already mocked in beforeEach)
    expect(screen.getByText('View Images')).toBeInTheDocument()
    expect(screen.getByText('Reorder Images')).toBeInTheDocument()
    expect(screen.getByText('Manage Images')).toBeInTheDocument()
  })
})
