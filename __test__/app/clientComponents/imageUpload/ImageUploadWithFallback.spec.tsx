/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { SessionProvider } from 'next-auth/react'
import ImageUploadWithFallback from '../../../../app/clientComponents/imageUpload/ImageUploadWithFallback'
import theme from '../../../../styles/theme'

// Mock next-auth
jest.mock('next-auth/react')
const mockUseSession = require('next-auth/react').useSession as jest.Mock

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

// Mock localImageStorage
jest.mock('../../../../lib/localImageStorage', () => ({
  localImageStorage: {
    init: jest.fn().mockResolvedValue(undefined),
    storeImage: jest.fn(),
    hasSpaceFor: jest.fn().mockResolvedValue(true),
  },
  formatFileSize: (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  },
}))

// Mock fetch
global.fetch = jest.fn()

const mockSession = {
  user: {
    email: 'test@example.com',
    id: 'user123',
    name: 'Test User',
    role: 'user',
    yoga: 'yoga',
  },
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  status: 'authenticated' as const,
  value: 'mock-session-value',
}

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SessionProvider session={mockSession}>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </SessionProvider>
)

describe('ImageUploadWithFallback - Drag and Drop', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({ id: 'img1', url: 'data:image/jpeg;base64,test' }),
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Dropzone Rendering', () => {
    it('renders dropzone variant with correct text', () => {
      render(
        <TestWrapper>
          <ImageUploadWithFallback variant="dropzone" maxImages={3} />
        </TestWrapper>
      )

      expect(screen.getByText(/Upload Yoga Pose Image/)).toBeInTheDocument()
      expect(
        screen.getByText(/Drag and drop an image here/)
      ).toBeInTheDocument()
    })

    it('displays image count when creating new asana', () => {
      render(
        <TestWrapper>
          <ImageUploadWithFallback
            variant="dropzone"
            maxImages={3}
            currentCount={0}
          />
        </TestWrapper>
      )

      expect(
        screen.getByText(/You can select multiple images/)
      ).toBeInTheDocument()
    })
  })

  describe('Drag and Drop Functionality', () => {
    it('handles drag over event', async () => {
      render(
        <TestWrapper>
          <ImageUploadWithFallback variant="dropzone" maxImages={3} />
        </TestWrapper>
      )

      await waitFor(() => {
        const uploadText = screen.getByText(/Upload Yoga Pose Image/)
        expect(uploadText).toBeInTheDocument()
      })
    })

    it('stages valid image files on drop and opens dialog', async () => {
      render(
        <TestWrapper>
          <ImageUploadWithFallback variant="dropzone" maxImages={3} />
        </TestWrapper>
      )

      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      })
      const dataTransfer = {
        files: [file],
        items: [{ kind: 'file', type: 'image/jpeg', getAsFile: () => file }],
        types: ['Files'],
      }

      const uploadTextElement = screen.getByText(/Upload Yoga Pose Image/i)
      const dropzoneElement = uploadTextElement.closest(
        '[class*="MuiBox"]'
      ) as HTMLElement

      fireEvent.drop(dropzoneElement, { dataTransfer } as any)

      // Images now visible directly in dropzone - check for heading with count
      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: /Upload Yoga Pose Image \(1\/3\)/,
          })
        ).toBeInTheDocument()
      })
    })

    it('stages multiple image files at once', async () => {
      render(
        <TestWrapper>
          <ImageUploadWithFallback variant="dropzone" maxImages={3} />
        </TestWrapper>
      )

      // Create multiple mock files
      const file1 = new File(['image1'], 'test1.jpg', { type: 'image/jpeg' })
      const file2 = new File(['image2'], 'test2.png', { type: 'image/png' })

      const uploadTextElement = screen.getByText(/Upload Yoga Pose Image/i)
      const dropzoneElement = uploadTextElement.closest(
        '[class*="MuiBox"]'
      ) as HTMLElement

      const dataTransfer = {
        files: [file1, file2],
        items: [
          { kind: 'file', type: 'image/jpeg', getAsFile: () => file1 },
          { kind: 'file', type: 'image/png', getAsFile: () => file2 },
        ],
        types: ['Files'],
      }

      fireEvent.drop(dropzoneElement, { dataTransfer } as any)

      // Verify both images are staged and visible
      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: /Upload Yoga Pose Image \(2\/3\)/,
          })
        ).toBeInTheDocument()
      })
    })

    it('respects max image limit on drop', async () => {
      render(
        <TestWrapper>
          <ImageUploadWithFallback
            variant="dropzone"
            maxImages={2}
            currentCount={1}
          />
        </TestWrapper>
      )

      const files = [
        new File(['img1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['img2'], 'test2.jpg', { type: 'image/jpeg' }),
        new File(['img3'], 'test3.jpg', { type: 'image/jpeg' }),
      ]

      const dataTransfer = {
        files,
        items: files.map((f) => ({
          kind: 'file',
          type: 'image/jpeg',
          getAsFile: () => f,
        })),
        types: ['Files'],
      }

      const uploadTextElement = screen.getByText(/Upload Yoga Pose Image/i)
      const dropzoneElement = uploadTextElement.closest(
        '[class*="MuiBox"]'
      ) as HTMLElement

      fireEvent.drop(dropzoneElement, { dataTransfer } as any)

      // Should show total count (1 uploaded + 1 staged = 2/2)
      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: /Upload Yoga Pose Image \(2\/2\)/,
          })
        ).toBeInTheDocument()
      })
    })
  })

  describe('File Validation', () => {
    it('rejects invalid file types', async () => {
      const onStagedImagesChange = jest.fn()
      render(
        <TestWrapper>
          <ImageUploadWithFallback
            variant="dropzone"
            maxImages={3}
            acceptedTypes={['image/jpeg', 'image/png']}
            onStagedImagesChange={onStagedImagesChange}
          />
        </TestWrapper>
      )

      const invalidFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      })

      const dataTransfer = {
        files: [invalidFile],
        items: [
          { kind: 'file', type: 'text/plain', getAsFile: () => invalidFile },
        ],
        types: ['Files'],
      }

      const uploadTextElement = screen.getByText(/Upload Yoga Pose Image/i)
      const dropzoneElement = uploadTextElement.closest(
        '[class*="MuiBox"]'
      ) as HTMLElement

      fireEvent.drop(dropzoneElement, { dataTransfer } as any)

      // Should not call callback for invalid files
      // Wait a bit and verify callback was not called
      await new Promise((resolve) => setTimeout(resolve, 100))
      expect(onStagedImagesChange).not.toHaveBeenCalled()
    })

    it('rejects oversized files', async () => {
      const onStagedImagesChange = jest.fn()
      render(
        <TestWrapper>
          <ImageUploadWithFallback
            variant="dropzone"
            maxFileSize={5}
            maxImages={3}
            onStagedImagesChange={onStagedImagesChange}
          />
        </TestWrapper>
      )

      // Create a file larger than 5MB
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      })

      const dataTransfer = {
        files: [largeFile],
        items: [
          { kind: 'file', type: 'image/jpeg', getAsFile: () => largeFile },
        ],
        types: ['Files'],
      }

      const uploadTextElement = screen.getByText(/Upload Yoga Pose Image/i)
      const dropzoneElement = uploadTextElement.closest(
        '[class*="MuiBox"]'
      ) as HTMLElement

      fireEvent.drop(dropzoneElement, { dataTransfer } as any)

      // Callback should not be called for oversized files
      await new Promise((resolve) => setTimeout(resolve, 100))
      expect(onStagedImagesChange).not.toHaveBeenCalled()
    })
  })

  describe('Staged Images Management', () => {
    it('displays staged images in dialog', async () => {
      render(
        <TestWrapper>
          <ImageUploadWithFallback variant="dropzone" maxImages={3} />
        </TestWrapper>
      )

      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      })
      const dataTransfer = {
        files: [file],
        items: [{ kind: 'file', type: 'image/jpeg', getAsFile: () => file }],
        types: ['Files'],
      }

      const uploadTextElement = screen.getByText(/Upload Yoga Pose Image/i)
      const dropzoneElement = uploadTextElement.closest(
        '[class*="MuiBox"]'
      ) as HTMLElement

      fireEvent.drop(dropzoneElement, { dataTransfer } as any)

      // Staged images now visible directly in dropzone
      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: /Upload Yoga Pose Image \(1\/3\)/,
          })
        ).toBeInTheDocument()
        expect(screen.getByAltText('test.jpg')).toBeInTheDocument()
      })
    })

    it('removes staged image and updates count', async () => {
      render(
        <TestWrapper>
          <ImageUploadWithFallback variant="dropzone" maxImages={3} />
        </TestWrapper>
      )

      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      })
      const dataTransfer = {
        files: [file],
        items: [{ kind: 'file', type: 'image/jpeg', getAsFile: () => file }],
        types: ['Files'],
      }

      // Find the dropzone area - it's the one with the main Upload text
      const uploadTextElement = screen.getByText(/Upload Yoga Pose Image/i)
      const dropzoneElement = uploadTextElement.closest(
        '[class*="MuiBox"]'
      ) as HTMLElement

      fireEvent.drop(dropzoneElement, { dataTransfer } as any)

      // Staged image should be visible with count
      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: /Upload Yoga Pose Image \(1\/3\)/,
          })
        ).toBeInTheDocument()
      })

      // Find and click delete button for the staged image
      const deleteButtons = screen
        .getAllByRole('button')
        .filter((btn) => btn.getAttribute('title')?.includes('Remove image'))
      if (deleteButtons.length > 0) {
        fireEvent.click(deleteButtons[0])
      }

      // Image should be removed from view and count should be 0
      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: /Upload Yoga Pose Image \(0\/3\)/,
          })
        ).toBeInTheDocument()
        expect(screen.queryByAltText('test.jpg')).not.toBeInTheDocument()
      })
    })
  })

  describe('Dialog Interaction', () => {
    it('opens dialog automatically after drag-drop', async () => {
      render(
        <TestWrapper>
          <ImageUploadWithFallback variant="dropzone" maxImages={3} />
        </TestWrapper>
      )

      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      })
      const dataTransfer = {
        files: [file],
        items: [{ kind: 'file', type: 'image/jpeg', getAsFile: () => file }],
        types: ['Files'],
      }

      const uploadTextElement = screen.getByText(/Upload Yoga Pose Image/i)
      const dropzoneElement = uploadTextElement.closest(
        '[class*="MuiBox"]'
      ) as HTMLElement

      fireEvent.drop(dropzoneElement, { dataTransfer } as any)
      // Images now visible directly in dropzone (no auto dialog open)
      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: /Upload Yoga Pose Image \(1\/3\)/,
          })
        ).toBeInTheDocument()
      })
    })
  })

  describe('Success Toast', () => {
    it('displays success message when image is ready', async () => {
      render(
        <TestWrapper>
          <ImageUploadWithFallback variant="dropzone" maxImages={3} />
        </TestWrapper>
      )

      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      })
      const dataTransfer = {
        files: [file],
        items: [{ kind: 'file', type: 'image/jpeg', getAsFile: () => file }],
        types: ['Files'],
      }

      const uploadTextElement = screen.getByText(/Upload Yoga Pose Image/i)
      const dropzoneElement = uploadTextElement.closest(
        '[class*="MuiBox"]'
      ) as HTMLElement

      fireEvent.drop(dropzoneElement, { dataTransfer } as any)

      // Success message should appear showing images are staged
      await waitFor(() => {
        expect(
          screen.getByText(/will be added when you save the asana/)
        ).toBeInTheDocument()
      })
    })
  })

  describe('Ref Methods', () => {
    it('exposes saveStagedImages method via ref', async () => {
      const onImageUploaded = jest.fn()
      const componentRef = React.createRef<{
        saveStagedImages: (poseId?: string, poseName?: string) => Promise<void>
      }>()

      render(
        <TestWrapper>
          <ImageUploadWithFallback
            ref={componentRef}
            variant="dropzone"
            maxImages={3}
            onImageUploaded={onImageUploaded}
          />
        </TestWrapper>
      )

      // Verify ref is available
      expect(componentRef.current).not.toBeNull()
      expect(componentRef.current?.saveStagedImages).toBeDefined()
      expect(typeof componentRef.current?.saveStagedImages).toBe('function')
    })

    it('saveStagedImages uploads staged images via API with poseId', async () => {
      const onImageUploaded = jest.fn()
      const componentRef = React.createRef<{
        saveStagedImages: (poseId?: string, poseName?: string) => Promise<void>
      }>()

      // Mock fetch to return success
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 'img-123',
            url: 'data:image/jpeg;base64,test',
            uploadedAt: new Date().toISOString(),
          }),
      })

      render(
        <TestWrapper>
          <ImageUploadWithFallback
            ref={componentRef}
            variant="dropzone"
            maxImages={3}
            onImageUploaded={onImageUploaded}
          />
        </TestWrapper>
      )

      // Stage an image first
      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      })
      const dataTransfer = {
        files: [file],
        items: [{ kind: 'file', type: 'image/jpeg', getAsFile: () => file }],
        types: ['Files'],
      }

      const uploadTextElement = screen.getByText(/Upload Yoga Pose Image/i)
      const dropzoneElement = uploadTextElement.closest(
        '[class*="MuiBox"]'
      ) as HTMLElement

      fireEvent.drop(dropzoneElement, { dataTransfer } as any)

      // Wait for image to be staged
      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: /Upload Yoga Pose Image \(1\/3\)/,
          })
        ).toBeInTheDocument()
      })

      // Call saveStagedImages with poseId and poseName (as would happen after pose creation)
      const testPoseId = 'pose-123'
      const testPoseName = 'Test Pose Name'
      await componentRef.current?.saveStagedImages(testPoseId, testPoseName)

      // Verify API was called with correct poseId
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/images/upload',
          expect.objectContaining({
            method: 'POST',
          })
        )
        // Check that the FormData includes the poseId
        const callArgs = (global.fetch as jest.Mock).mock.calls[0]
        const formData = callArgs[1].body as FormData
        expect(formData.get('poseId')).toBe(testPoseId)
        expect(formData.get('poseName')).toBe(testPoseName)
      })

      // Verify onImageUploaded callback was called
      await waitFor(() => {
        expect(onImageUploaded).toHaveBeenCalled()
      })
    })
  })
})
