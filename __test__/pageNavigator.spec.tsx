import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
// FIXME: Replace 'YOUR_MODULE_PATH/navigator/page' with the actual path to the Page component
import Page from '@app/navigator/page'

jest.mock('@app/clientComponents/current-time', () => {
  const MockedCurrentTime = () => <div>Mocked CurrentTime</div>
  MockedCurrentTime.displayName = 'MockedCurrentTime'
  return MockedCurrentTime
})
jest.mock('@app/clientComponents/tab-header', () => {
  const MockedTabHeader = () => <div>Mocked TabHeader</div>
  MockedTabHeader.displayName = 'MockedTabHeader'
  return MockedTabHeader
})
jest.mock('next/image', () => {
  const MockedNextImage = (props: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt || 'Mocked Image'} />
  )
  MockedNextImage.displayName = 'MockedNextImage'
  return MockedNextImage
})

const theme = createTheme()

describe('Page Component', () => {
  it('renders the main container with correct attributes', () => {
    render(
      <ThemeProvider theme={theme}>
        <Page />
      </ThemeProvider>
    )
    screen.debug(undefined, 60000) // Debugging line to see the rendered output
    const mainContainer = screen.getByRole('main') // Query by role only
    expect(mainContainer).toBeInTheDocument()
    expect(mainContainer).toHaveAttribute('aria-labelledby', 'page-title')
  })

  it('renders the image with correct attributes', () => {
    render(
      <ThemeProvider theme={theme}>
        <Page />
      </ThemeProvider>
    )
    const image = screen.getByAltText('Like a leaf on the Wind')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/images/primary/Home-page-yogi.png')
    expect(image).toHaveAttribute('width', '207')
    expect(image).toHaveAttribute('height', '207')
  })

  it('renders the Typography with correct text and attributes', () => {
    render(
      <ThemeProvider theme={theme}>
        <Page />
      </ThemeProvider>
    )
    const typography = screen.getByText('yoga exercise')
    expect(typography).toBeInTheDocument()
    expect(typography).toHaveAttribute('id', 'page-title')
    expect(typography).toHaveStyle({ color: 'rgb(25, 118, 210)' }) // Use resolved color value
  })
})
