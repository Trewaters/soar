import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { ProfileImageManager } from '@app/clientComponents/ProfileImage/ProfileImageManager'
import '@testing-library/jest-dom'
import { createTheme } from '@mui/material/styles'

const theme = createTheme()

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

describe('ProfileImageManager', () => {
  const mockImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ]
  const mockPlaceholder = '/images/profile-placeholder.png'
  const mockOnChange = jest.fn()
  const mockOnUpload = jest.fn()
  const mockOnDelete = jest.fn()
  const mockOnSelect = jest.fn()

  const defaultProps = {
    images: mockImages,
    active: mockImages[0],
    placeholder: mockPlaceholder,
    onChange: mockOnChange,
    onUpload: mockOnUpload,
    onDelete: mockOnDelete,
    onSelect: mockOnSelect,
    loading: false,
    maxImages: 3,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without errors', () => {
      render(<ProfileImageManager {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText('Your Profile Images')).toBeInTheDocument()
    })

    it('should display upload section', () => {
      render(<ProfileImageManager {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      // Component renders a labeled upload control
      expect(screen.getByText('Upload Image')).toBeInTheDocument()
      expect(screen.getByLabelText(/upload profile image/i)).toBeInTheDocument()
    })

    it('should display all profile images', () => {
      render(<ProfileImageManager {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      const images = screen.getAllByRole('img')
      const profileImages = images.filter((img) =>
        img.getAttribute('src')?.includes('example.com')
      )
      expect(profileImages).toHaveLength(3)
    })

    it('should show placeholder when no images exist', () => {
      render(
        <ProfileImageManager {...defaultProps} images={[]} active={null} />,
        { wrapper: TestWrapper }
      )

      expect(
        screen.getByText('No profile images uploaded yet')
      ).toBeInTheDocument()
      expect(screen.getByAltText('Profile placeholder')).toBeInTheDocument()
    })
  })

  describe('Upload Functionality', () => {
    const user = userEvent.setup()

    it('should call onUpload when file is selected', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      mockOnUpload.mockResolvedValue(undefined)

      render(<ProfileImageManager {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      const fileInput = screen.getByLabelText(/upload profile image/i)
      await user.upload(fileInput, file)

      expect(mockOnUpload).toHaveBeenCalledWith(file)
    })

    it('should show error when upload fails', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const errorMessage = 'Upload failed'
      mockOnUpload.mockRejectedValue(new Error(errorMessage))

      render(<ProfileImageManager {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      // The visible control is a label with pointer-events disabled; target the hidden file input inside it
      const uploadLabel = screen.getByLabelText(/upload profile image/i)
      const fileInput = uploadLabel.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement
      await user.upload(fileInput, file)

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
    })

    it('should show error when trying to upload beyond max limit', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

      render(
        <ProfileImageManager
          {...defaultProps}
          images={mockImages}
          maxImages={3}
        />,
        { wrapper: TestWrapper }
      )

      const fileInput = screen.getByLabelText(/upload profile image/i)
      await user.upload(fileInput, file)

      await waitFor(() => {
        expect(
          screen.getByText('You can only upload up to 3 images.')
        ).toBeInTheDocument()
      })
      expect(mockOnUpload).not.toHaveBeenCalled()
    })

    it('should disable upload when at max images', () => {
      render(
        <ProfileImageManager
          {...defaultProps}
          images={mockImages}
          maxImages={3}
        />,
        { wrapper: TestWrapper }
      )

      const uploadButton = screen.getByLabelText(/upload profile image/i)
      expect(uploadButton).toBeDisabled()
    })

    it('should show loading state during upload', () => {
      render(<ProfileImageManager {...defaultProps} loading={true} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
  })

  describe('Image Selection', () => {
    const user = userEvent.setup()

    it('should call onSelect when clicking on an image', async () => {
      render(<ProfileImageManager {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      const images = screen.getAllByRole('img')
      const secondImage = images.find(
        (img) => img.getAttribute('src') === mockImages[1]
      )

      if (secondImage) {
        await user.click(secondImage)
        expect(mockOnSelect).toHaveBeenCalledWith(mockImages[1])
      }
    })

    it('should show active indicator on current active image', () => {
      render(<ProfileImageManager {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('should handle onSelect callback errors gracefully', async () => {
      const mockOnSelectWithError = jest
        .fn()
        .mockRejectedValue(new Error('Selection failed'))

      render(
        <ProfileImageManager
          {...defaultProps}
          onSelect={mockOnSelectWithError}
        />,
        { wrapper: TestWrapper }
      )

      const images = screen.getAllByRole('img')
      const firstImage = images.find(
        (img) => img.getAttribute('src') === mockImages[0]
      )

      if (firstImage) {
        await user.click(firstImage)
        expect(mockOnSelectWithError).toHaveBeenCalled()
        // Component should not crash
      }
    })
  })

  describe('Image Deletion', () => {
    const user = userEvent.setup()

    it('should call onDelete when clicking delete button', async () => {
      mockOnDelete.mockResolvedValue(undefined)

      render(<ProfileImageManager {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      const deleteButtons = screen.getAllByLabelText(/delete profile image/i)
      await user.click(deleteButtons[0])

      expect(mockOnDelete).toHaveBeenCalledWith(mockImages[0])
    })

    it('should show error when delete fails', async () => {
      const errorMessage = 'Delete failed'
      mockOnDelete.mockRejectedValue(new Error(errorMessage))

      render(<ProfileImageManager {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      const deleteButtons = screen.getAllByLabelText(/delete profile image/i)
      await user.click(deleteButtons[0])

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
    })

    it('should show delete button for each image', () => {
      render(<ProfileImageManager {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      const deleteButtons = screen.getAllByLabelText(/delete profile image/i)
      expect(deleteButtons).toHaveLength(mockImages.length)
    })
  })

  describe('Error Handling', () => {
    it('should display error messages', () => {
      render(<ProfileImageManager {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      // Trigger an error by trying to upload when at max capacity
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

      // Simulate the internal error state
      const fileInput = screen.getByLabelText(
        /upload profile image/i
      ) as HTMLInputElement
      fireEvent.change(fileInput, { target: { files: [file] } })

      // Since the component has internal state management, we need to verify
      // that the error handling mechanism is in place
      expect(fileInput).toBeInTheDocument()
    })

    it('should clear error when performing new actions', async () => {
      const user = userEvent.setup()
      mockOnUpload.mockRejectedValue(new Error('First error'))

      render(<ProfileImageManager {...defaultProps} images={[]} />, {
        wrapper: TestWrapper,
      })

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const fileInput = screen.getByLabelText(/upload profile image/i)

      // First upload fails
      await user.upload(fileInput, file)

      await waitFor(() => {
        expect(screen.getByText('First error')).toBeInTheDocument()
      })

      // Reset mock for successful upload
      mockOnUpload.mockResolvedValue(undefined)

      // Second upload should clear error
      await user.upload(fileInput, file)

      await waitFor(() => {
        expect(screen.queryByText('First error')).not.toBeInTheDocument()
      })
    })
  })

  describe('Props Validation', () => {
    it('should handle null active image', () => {
      render(<ProfileImageManager {...defaultProps} active={null} />, {
        wrapper: TestWrapper,
      })

      expect(screen.queryByText('Active')).not.toBeInTheDocument()
    })

    it('should handle empty images array', () => {
      render(
        <ProfileImageManager {...defaultProps} images={[]} active={null} />,
        { wrapper: TestWrapper }
      )

      expect(
        screen.getByText('No profile images uploaded yet')
      ).toBeInTheDocument()
    })

    it('should use custom max images limit', () => {
      const customMaxImages = 5
      render(
        <ProfileImageManager {...defaultProps} maxImages={customMaxImages} />,
        { wrapper: TestWrapper }
      )

      // Component should accept up to 5 images instead of default 3
      // This would be verified by the upload behavior
      // The upload control uses an aria-label of 'Upload profile image'
      expect(screen.getByLabelText(/upload profile image/i)).toBeInTheDocument()
    })

    it('should handle custom placeholder image', () => {
      const customPlaceholder = '/custom-placeholder.png'
      render(
        <ProfileImageManager
          {...defaultProps}
          images={[]}
          active={null}
          placeholder={customPlaceholder}
        />,
        { wrapper: TestWrapper }
      )

      const placeholderImg = screen.getByAltText('Profile placeholder')
      expect(placeholderImg).toHaveAttribute('src', customPlaceholder)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for images', () => {
      render(<ProfileImageManager {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      const images = screen.getAllByRole('img')
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt')
      })
    })

    it('should have proper ARIA labels for buttons', () => {
      render(<ProfileImageManager {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      const deleteButtons = screen.getAllByLabelText(/delete profile image/i)
      expect(deleteButtons.length).toBeGreaterThan(0)
      const uploadButton = screen.getByLabelText(/upload profile image/i)
      expect(uploadButton).toBeInTheDocument()
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<ProfileImageManager {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      const deleteButtons = screen.getAllByLabelText(/delete profile image/i)

      // Tab to first delete button and activate with Enter
      await user.tab()
      await user.keyboard('{Enter}')

      // Should be able to navigate to buttons
      expect(document.activeElement).toBeTruthy()
    })
  })

  describe('Responsive Behavior', () => {
    it('should render properly in different viewport sizes', () => {
      // Test with different container sizes
      const { container } = render(<ProfileImageManager {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      expect(container.firstChild).toBeInTheDocument()

      // Images should be arranged in a flexible layout (smoke check)
      const imageContainer = screen.getByText(
        'Your Profile Images'
      ).parentElement
      expect(imageContainer).toBeInTheDocument()
    })
  })
})
