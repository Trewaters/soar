import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Page from '@app/navigator/page'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        name: 'Test User',
        email: 'test@example.com',
      },
    },
    status: 'authenticated',
  })),
}))

jest.mock('@app/clientComponents/landing-page', () => {
  const MockedLandingPage = () => (
    <div data-testid="landing-page">Mocked LandingPage</div>
  )
  MockedLandingPage.displayName = 'MockedLandingPage'
  return MockedLandingPage
})

jest.mock('@app/clientComponents/AsanaActivityList', () => {
  const MockedAsanaActivityList = () => (
    <div data-testid="asana-activity-list">Mocked AsanaActivityList</div>
  )
  MockedAsanaActivityList.displayName = 'MockedAsanaActivityList'
  return MockedAsanaActivityList
})

jest.mock('@app/clientComponents/activityStreaks/ActivityStreaks', () => {
  const MockedActivityStreaks = () => (
    <div data-testid="activity-streaks">Mocked ActivityStreaks</div>
  )
  MockedActivityStreaks.displayName = 'MockedActivityStreaks'
  return MockedActivityStreaks
})

jest.mock('next/image', () => {
  const MockedNextImage = (props: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt || 'Mocked Image'} />
  )
  MockedNextImage.displayName = 'MockedNextImage'
  return MockedNextImage
})

jest.mock('next/link', () => {
  const MockedLink = ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
  MockedLink.displayName = 'MockedLink'
  return MockedLink
})

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
  usePathname: jest.fn(() => '/navigator'),
}))

const theme = createTheme()

describe('Page Component', () => {
  it('renders the main container with correct attributes', () => {
    render(
      <ThemeProvider theme={theme}>
        <Page />
      </ThemeProvider>
    )
    const mainContainer = screen.getByRole('main')
    expect(mainContainer).toBeInTheDocument()
    expect(mainContainer).toHaveAttribute('aria-labelledby', 'page-title')
  })

  it('renders the image with correct attributes', () => {
    render(
      <ThemeProvider theme={theme}>
        <Page />
      </ThemeProvider>
    )
    const image = screen.getByAltText(
      'Illustration of a person practicing yoga'
    )
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/images/primary/Home-page-yogi.png')
    expect(image).toHaveAttribute('width', '207')
    expect(image).toHaveAttribute('height', '207')
  })

  it('renders the welcome message with user name', () => {
    render(
      <ThemeProvider theme={theme}>
        <Page />
      </ThemeProvider>
    )
    const welcomeText = screen.getByText('Welcome Yogi')
    expect(welcomeText).toBeInTheDocument()
    expect(welcomeText).toHaveAttribute('id', 'page-title')
  })

  it('renders the ActivityStreaks component', () => {
    render(
      <ThemeProvider theme={theme}>
        <Page />
      </ThemeProvider>
    )
    expect(screen.getByTestId('activity-streaks')).toBeInTheDocument()
  })

  it('renders the AsanaActivityList component', () => {
    render(
      <ThemeProvider theme={theme}>
        <Page />
      </ThemeProvider>
    )
    expect(screen.getByTestId('asana-activity-list')).toBeInTheDocument()
  })

  it('renders the LandingPage component', () => {
    render(
      <ThemeProvider theme={theme}>
        <Page />
      </ThemeProvider>
    )
    expect(screen.getByTestId('landing-page')).toBeInTheDocument()
  })

  it('renders key page sections', () => {
    render(
      <ThemeProvider theme={theme}>
        <Page />
      </ThemeProvider>
    )
    expect(screen.getByText('Build Your Practice:')).toBeInTheDocument()
    expect(
      screen.getByText('"From a Single Asana to Full Sequences"')
    ).toBeInTheDocument()
    expect(screen.getByText('View Your Activity:')).toBeInTheDocument()
  })

  it('uses semantic HTML and ARIA roles correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <Page />
      </ThemeProvider>
    )
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveAttribute('aria-labelledby', 'page-title')

    const image = screen.getByAltText(
      'Illustration of a person practicing yoga'
    )
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/images/primary/Home-page-yogi.png')
  })
})
