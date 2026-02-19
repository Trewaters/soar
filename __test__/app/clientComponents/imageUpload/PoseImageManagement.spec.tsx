import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import theme from '../../../../styles/theme'
import PoseImageManagement from '../../../../app/clientComponents/imageUpload/PoseImageManagement'

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { email: 'test@example.com' } },
    status: 'authenticated',
  }),
}))

jest.mock('../../../../lib/imageStatus', () => ({
  getImageUploadStatus: jest.fn().mockResolvedValue({
    status: {
      currentCount: 0,
      maxAllowed: 3,
      canUpload: true,
      remainingSlots: 3,
    },
  }),
}))

jest.mock(
  '../../../../app/clientComponents/imageUpload/PoseImageGallery',
  () => ({
    __esModule: true,
    default: () => <div data-testid="pose-image-gallery">PoseImageGallery</div>,
  })
)

jest.mock(
  '../../../../app/clientComponents/imageUpload/PoseImageUpload',
  () => ({
    __esModule: true,
    default: ({ poseName }: { poseName?: string }) => (
      <button
        aria-label={poseName ? `Upload image for ${poseName}` : 'Upload image'}
      >
        Upload
      </button>
    ),
  })
)

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

describe('PoseImageManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render title and upload icon in header when upload is enabled', () => {
    render(
      <TestWrapper>
        <PoseImageManagement
          title="Images for Test Asana"
          poseName="Test Asana"
          showUploadButton={true}
          enableManagement={true}
          variant="gallery-only"
        />
      </TestWrapper>
    )

    expect(screen.getByText('Images for Test Asana')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /upload image for test asana/i })
    ).toBeInTheDocument()
  })

  it('should hide upload icon when showUploadButton is false', () => {
    render(
      <TestWrapper>
        <PoseImageManagement
          title="Images for Test Asana"
          poseName="Test Asana"
          showUploadButton={false}
          enableManagement={true}
          variant="gallery-only"
        />
      </TestWrapper>
    )

    expect(screen.getByText('Images for Test Asana')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /upload image for test asana/i })
    ).not.toBeInTheDocument()
  })

  it('should hide upload icon when management is disabled', () => {
    render(
      <TestWrapper>
        <PoseImageManagement
          title="Images for Test Asana"
          poseName="Test Asana"
          showUploadButton={true}
          enableManagement={false}
          variant="gallery-only"
        />
      </TestWrapper>
    )

    expect(screen.getByText('Images for Test Asana')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /upload image for test asana/i })
    ).not.toBeInTheDocument()
  })
})
