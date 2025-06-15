import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Page from '@app/navigator/page'

jest.mock('@app/clientComponents/current-time', () => {
  const MockedCurrentTime = () => (
    <div data-testid="current-time">Mocked CurrentTime</div>
  )
  MockedCurrentTime.displayName = 'MockedCurrentTime'
  return MockedCurrentTime
})
jest.mock('@app/clientComponents/tab-header', () => {
  const MockedTabHeader = () => <div>Mocked TabHeader</div>
  MockedTabHeader.displayName = 'MockedTabHeader'
  return MockedTabHeader
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
    const image = screen.getByAltText(
      'Illustration of a person practicing yoga'
    )
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
    const typography = screen.getByText('Yoga Exercise')
    expect(typography).toBeInTheDocument()
    expect(typography).toHaveAttribute('id', 'page-title')
    expect(typography).toHaveStyle({ color: 'rgb(25, 118, 210)' }) // Use resolved color value
  })

  it('renders the CurrentTime component', () => {
    render(
      <ThemeProvider theme={theme}>
        <Page />
      </ThemeProvider>
    )
    expect(screen.getByTestId('current-time')).toBeInTheDocument()
  })

  it('renders the page title "Yoga Exercise"', () => {
    render(
      <ThemeProvider theme={theme}>
        <Page />
      </ThemeProvider>
    )
    expect(screen.getByText('Yoga Exercise')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute(
      'aria-labelledby',
      'page-title'
    )
    expect(screen.getByText('Yoga Exercise')).toHaveAttribute(
      'id',
      'page-title'
    )
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

    const nav = screen.getByRole('navigation', { name: 'Tab Navigation' })
    expect(nav).toBeInTheDocument()

    const image = screen.getByAltText(
      'Illustration of a person practicing yoga'
    )
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/images/primary/Home-page-yogi.png')
  })
})
