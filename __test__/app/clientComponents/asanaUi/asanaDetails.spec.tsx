import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'

// Mock next/image for tests
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} {...props} />
  ),
}))

import AsanaDetails from '@app/clientComponents/asanaUi/asanaDetails'

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={createTheme()}>{children}</ThemeProvider>
)

describe('AsanaDetails (clean copy)', () => {
  it('returns null for empty-ish details', () => {
    const { container } = render(
      <AsanaDetails label="Dristi" details={undefined} />,
      { wrapper: Wrapper }
    )
    expect(container.firstChild).toBeNull()

    const { container: c2 } = render(
      <AsanaDetails label="Dristi" details={''} />,
      { wrapper: Wrapper }
    )
    expect(c2.firstChild).toBeNull()

    const { container: c3 } = render(
      <AsanaDetails label="Dristi" details={[]} />,
      { wrapper: Wrapper }
    )
    expect(c3.firstChild).toBeNull()
  })

  it('renders string details correctly', () => {
    render(<AsanaDetails label="Dristi" details={'Gaze forward'} />, {
      wrapper: Wrapper,
    })
    expect(screen.getByText(/Dristi:/)).toBeInTheDocument()
    expect(screen.getByText(/Gaze forward/)).toBeInTheDocument()
  })

  it('renders array details and filters empty entries', () => {
    render(
      <AsanaDetails
        label="Notes"
        details={['One', '', 'Two', '  ', 'Three']}
      />,
      { wrapper: Wrapper }
    )
    // Array details are joined with newlines into a single text node
    const detailsText = screen.getByRole('definition')
    expect(detailsText).toHaveTextContent('One')
    expect(detailsText).toHaveTextContent('Two')
    expect(detailsText).toHaveTextContent('Three')
    // Verify empty strings were filtered out (no extra whitespace)
    expect(detailsText.textContent).toBe('One\nTwo\nThree')
  })
})
