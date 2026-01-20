import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import StaticMapImage from '@app/clientComponents/maps/StaticMapImage'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('StaticMapImage', () => {
  const originalEnv = process.env
  const mockLocation = 'San Francisco, CA'
  const mockApiKey = 'test-api-key-12345'

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: mockApiKey,
    }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('Rendering', () => {
    it('should render map image with location', () => {
      render(<StaticMapImage location={mockLocation} />)

      const mapImage = screen.getByAltText(`Map showing ${mockLocation}`)
      expect(mapImage).toBeInTheDocument()
    })

    it('should not render when API key is missing', () => {
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = ''

      const { container } = render(<StaticMapImage location={mockLocation} />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Google Maps Static API URL', () => {
    it('should construct correct API URL with default props', () => {
      render(<StaticMapImage location={mockLocation} />)

      const mapImage = screen.getByAltText(`Map showing ${mockLocation}`)
      const expectedUrl = `https://maps.googleapis.com/maps/api/staticmap?center=San%20Francisco%2C%20CA&zoom=13&size=600x300&markers=color:red%7CSan%20Francisco%2C%20CA&key=${mockApiKey}`

      expect(mapImage).toHaveAttribute('src', expectedUrl)
    })

    it('should construct correct API URL with custom dimensions', () => {
      render(
        <StaticMapImage
          location={mockLocation}
          width={800}
          height={400}
          zoom={15}
        />
      )

      const mapImage = screen.getByAltText(`Map showing ${mockLocation}`)
      const expectedUrl = `https://maps.googleapis.com/maps/api/staticmap?center=San%20Francisco%2C%20CA&zoom=15&size=800x400&markers=color:red%7CSan%20Francisco%2C%20CA&key=${mockApiKey}`

      expect(mapImage).toHaveAttribute('src', expectedUrl)
    })

    it('should encode special characters in location', () => {
      const specialLocation = 'New York, NY 10001'
      render(<StaticMapImage location={specialLocation} />)

      const mapImage = screen.getByAltText(`Map showing ${specialLocation}`)
      expect(mapImage.getAttribute('src')).toContain(
        'New%20York%2C%20NY%2010001'
      )
    })
  })

  describe('Styling', () => {
    it('should apply correct container styles', () => {
      const { container } = render(<StaticMapImage location={mockLocation} />)

      const boxElement = container.firstChild as HTMLElement
      expect(boxElement).toHaveStyle({
        position: 'relative',
        width: '100%',
      })
    })

    it('should render image with correct src attribute', () => {
      render(<StaticMapImage location={mockLocation} />)

      const mapImage = screen.getByAltText(`Map showing ${mockLocation}`)
      expect(mapImage).toHaveAttribute('src')
      expect(mapImage.getAttribute('src')).toContain('maps.googleapis.com')
    })
  })

  describe('Accessibility', () => {
    it('should have descriptive alt text', () => {
      const location = 'Los Angeles, CA'
      render(<StaticMapImage location={location} />)

      const mapImage = screen.getByAltText(`Map showing ${location}`)
      expect(mapImage).toBeInTheDocument()
    })
  })
})
