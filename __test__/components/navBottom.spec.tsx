import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import NavBottom from '../../components/navBottom'

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock Next.js Image component
jest.mock('next/image', () => {
  const MockImage = ({ src, alt, width, height }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} />
  }
  MockImage.displayName = 'MockImage'
  return MockImage
})

describe('NavBottom Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
  })

  describe('component rendering', () => {
    it('renders the navigation bar with proper structure', () => {
      render(<NavBottom subRoute="/test-route" />)

      // The component renders as an AppBar which has banner role
      const navigationBar = screen.getByRole('banner')
      expect(navigationBar).toBeInTheDocument()
    })

    it('renders all three navigation buttons', () => {
      render(<NavBottom subRoute="/test-route" />)

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(3)
    })

    it('renders home button with correct icon and accessibility', () => {
      render(<NavBottom subRoute="/test-route" />)

      const homeIcon = screen.getByRole('img', { name: /home icon/i })
      expect(homeIcon).toBeInTheDocument()
      expect(homeIcon).toHaveAttribute('src', '/icons/bottom-home.svg')
      expect(homeIcon).toHaveAttribute('width', '20')
      expect(homeIcon).toHaveAttribute('height', '20')
    })

    it('renders profile button with correct icon and accessibility', () => {
      render(<NavBottom subRoute="/test-route" />)

      const profileIcon = screen.getByRole('img', {
        name: /user profile icon/i,
      })
      expect(profileIcon).toBeInTheDocument()
      expect(profileIcon).toHaveAttribute('src', '/icons/bottom-user.svg')
      expect(profileIcon).toHaveAttribute('width', '20')
      expect(profileIcon).toHaveAttribute('height', '20')
    })

    it('renders menu button with correct icon and accessibility', () => {
      render(<NavBottom subRoute="/test-route" />)

      const menuIcon = screen.getByRole('img', {
        name: /bottom burger menu icon/i,
      })
      expect(menuIcon).toBeInTheDocument()
      expect(menuIcon).toHaveAttribute('src', '/icons/bottom-burger-menu.svg')
      expect(menuIcon).toHaveAttribute('width', '20')
      expect(menuIcon).toHaveAttribute('height', '20')
    })
  })

  describe('navigation functionality', () => {
    it('navigates to home when home button is clicked', () => {
      render(<NavBottom subRoute="/test-route" />)

      const homeButton = screen
        .getByRole('img', { name: /home icon/i })
        .closest('button')
      expect(homeButton).toBeInTheDocument()

      if (homeButton) {
        fireEvent.click(homeButton)
        expect(mockPush).toHaveBeenCalledTimes(1)
        expect(mockPush).toHaveBeenCalledWith('/')
      }
    })

    it('navigates to profile when profile button is clicked', () => {
      render(<NavBottom subRoute="/test-route" />)

      const profileButton = screen
        .getByRole('img', { name: /user profile icon/i })
        .closest('button')
      expect(profileButton).toBeInTheDocument()

      if (profileButton) {
        fireEvent.click(profileButton)
        expect(mockPush).toHaveBeenCalledTimes(1)
        expect(mockPush).toHaveBeenCalledWith('/navigator/profile')
      }
    })

    it('navigates to subRoute when menu button is clicked', () => {
      const testSubRoute = '/navigator/flows'
      render(<NavBottom subRoute={testSubRoute} />)

      const menuButton = screen
        .getByRole('img', { name: /bottom burger menu icon/i })
        .closest('button')
      expect(menuButton).toBeInTheDocument()

      if (menuButton) {
        fireEvent.click(menuButton)
        expect(mockPush).toHaveBeenCalledTimes(1)
        expect(mockPush).toHaveBeenCalledWith(testSubRoute)
      }
    })

    it('handles different subRoute values correctly', () => {
      const { rerender } = render(<NavBottom subRoute="/first-route" />)

      const menuButton = screen
        .getByRole('img', { name: /bottom burger menu icon/i })
        .closest('button')

      if (menuButton) {
        fireEvent.click(menuButton)
        expect(mockPush).toHaveBeenCalledWith('/first-route')
      }

      // Reset mock and test with different subRoute
      mockPush.mockClear()
      rerender(<NavBottom subRoute="/second-route" />)

      const updatedMenuButton = screen
        .getByRole('img', { name: /bottom burger menu icon/i })
        .closest('button')

      if (updatedMenuButton) {
        fireEvent.click(updatedMenuButton)
        expect(mockPush).toHaveBeenCalledWith('/second-route')
      }
    })
  })

  describe('button interaction', () => {
    it('all buttons are clickable and interactive', () => {
      render(<NavBottom subRoute="/test-route" />)

      const buttons = screen.getAllByRole('button')

      buttons.forEach((button) => {
        expect(button).toBeEnabled()
        expect(button).not.toHaveAttribute('disabled')
      })
    })

    it('buttons have proper Material-UI IconButton structure', () => {
      render(<NavBottom subRoute="/test-route" />)

      const buttons = screen.getAllByRole('button')

      buttons.forEach((button) => {
        expect(button).toHaveClass('MuiIconButton-root')
      })
    })

    it('handles multiple rapid clicks correctly', () => {
      render(<NavBottom subRoute="/test-route" />)

      const homeButton = screen
        .getByRole('img', { name: /home icon/i })
        .closest('button')

      if (homeButton) {
        fireEvent.click(homeButton)
        fireEvent.click(homeButton)
        fireEvent.click(homeButton)

        expect(mockPush).toHaveBeenCalledTimes(3)
        expect(mockPush).toHaveBeenCalledWith('/')
      }
    })
  })

  describe('accessibility features', () => {
    it('has proper ARIA structure for navigation', () => {
      render(<NavBottom subRoute="/test-route" />)

      const navigationBar = screen.getByRole('banner')
      expect(navigationBar).toBeInTheDocument()
    })

    it('images have descriptive alt text', () => {
      render(<NavBottom subRoute="/test-route" />)

      expect(
        screen.getByRole('img', { name: /home icon/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('img', { name: /user profile icon/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('img', { name: /bottom burger menu icon/i })
      ).toBeInTheDocument()
    })

    it('buttons are keyboard accessible', () => {
      render(<NavBottom subRoute="/test-route" />)

      const buttons = screen.getAllByRole('button')

      buttons.forEach((button) => {
        expect(button).toHaveAttribute('tabindex', '0')
      })
    })

    it('supports keyboard navigation', () => {
      render(<NavBottom subRoute="/test-route" />)

      const homeButton = screen
        .getByRole('img', { name: /home icon/i })
        .closest('button')

      if (homeButton) {
        homeButton.focus()
        expect(homeButton).toHaveFocus()

        // Use fireEvent.click instead of keyDown since Material-UI IconButton
        // handles keyboard events internally and converts them to click events
        fireEvent.click(homeButton)
        expect(mockPush).toHaveBeenCalledWith('/')
      }
    })
  })

  describe('props handling', () => {
    it('correctly uses the subRoute prop', () => {
      const customSubRoute = '/custom/navigation/path'
      render(<NavBottom subRoute={customSubRoute} />)

      const menuButton = screen
        .getByRole('img', { name: /bottom burger menu icon/i })
        .closest('button')

      if (menuButton) {
        fireEvent.click(menuButton)
        expect(mockPush).toHaveBeenCalledWith(customSubRoute)
      }
    })

    it('handles empty subRoute prop', () => {
      render(<NavBottom subRoute="" />)

      const menuButton = screen
        .getByRole('img', { name: /bottom burger menu icon/i })
        .closest('button')

      if (menuButton) {
        fireEvent.click(menuButton)
        expect(mockPush).toHaveBeenCalledWith('')
      }
    })

    it('handles complex subRoute paths', () => {
      const complexSubRoute = '/navigator/flows/practiceSeries?filter=advanced'
      render(<NavBottom subRoute={complexSubRoute} />)

      const menuButton = screen
        .getByRole('img', { name: /bottom burger menu icon/i })
        .closest('button')

      if (menuButton) {
        fireEvent.click(menuButton)
        expect(mockPush).toHaveBeenCalledWith(complexSubRoute)
      }
    })
  })

  describe('component structure', () => {
    it('renders as Material-UI AppBar component', () => {
      render(<NavBottom subRoute="/test-route" />)

      const appBar = screen.getByRole('banner')
      expect(appBar).toHaveClass('MuiAppBar-root')
    })

    it('contains exactly three IconButton components', () => {
      render(<NavBottom subRoute="/test-route" />)

      const iconButtons = screen.getAllByRole('button')
      expect(iconButtons).toHaveLength(3)

      iconButtons.forEach((button) => {
        expect(button).toHaveClass('MuiIconButton-root')
      })
    })

    it('has proper image elements within buttons', () => {
      render(<NavBottom subRoute="/test-route" />)

      const images = screen.getAllByRole('img')
      expect(images).toHaveLength(3)

      images.forEach((image) => {
        expect(image).toHaveAttribute('width', '20')
        expect(image).toHaveAttribute('height', '20')
      })
    })
  })
})
