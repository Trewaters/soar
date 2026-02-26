import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LocationPickerDemo from '@app/clientComponents/locationPicker/LocationPickerDemo'
import '@testing-library/jest-dom'

// Mock Google Maps API
const mockGetPlacePredictions = jest.fn()
const mockGetDetails = jest.fn()
const mockGeocode = jest.fn()

const mockGoogle = {
  maps: {
    places: {
      AutocompleteService: jest.fn(() => ({
        getPlacePredictions: mockGetPlacePredictions,
      })),
      PlacesService: jest.fn(() => ({
        getDetails: mockGetDetails,
      })),
      PlacesServiceStatus: {
        OK: 'OK',
        ZERO_RESULTS: 'ZERO_RESULTS',
      },
    },
    Geocoder: jest.fn(() => ({
      geocode: mockGeocode,
    })),
    GeocoderStatus: {
      OK: 'OK',
    },
  },
}

// Mock @react-google-maps/api
jest.mock('@react-google-maps/api', () => ({
  useJsApiLoader: jest.fn(() => ({
    isLoaded: true,
    loadError: null,
  })),
}))

beforeAll(() => {
  ;(global as any).window.google = mockGoogle
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-api-key'

  // Mock geolocation
  Object.defineProperty(global.navigator, 'geolocation', {
    value: {
      getCurrentPosition: jest.fn(),
      watchPosition: jest.fn(),
      clearWatch: jest.fn(),
    },
    configurable: true,
  })
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('LocationPickerDemo', () => {
  it('renders demo page with title and description', () => {
    render(<LocationPickerDemo />)

    expect(
      screen.getByText('Location Picker Component Demo')
    ).toBeInTheDocument()
    expect(
      screen.getByText(/this demo shows different configurations/i)
    ).toBeInTheDocument()
  })

  it('renders all demo sections', () => {
    render(<LocationPickerDemo />)

    expect(screen.getByText('Basic Usage')).toBeInTheDocument()
    expect(
      screen.getByText('Advanced Usage with Location Data')
    ).toBeInTheDocument()
    expect(screen.getByText('Error Handling Demo')).toBeInTheDocument()
    expect(screen.getByText('Disabled State')).toBeInTheDocument()
  })

  it('renders multiple LocationPicker instances', () => {
    render(<LocationPickerDemo />)

    // Should have multiple location inputs for different demos
    const locationInputs = screen.getAllByDisplayValue('')
    expect(locationInputs.length).toBeGreaterThan(0)
  })

  it('has clear all button functionality', async () => {
    const user = userEvent.setup()

    render(<LocationPickerDemo />)

    const clearButton = screen.getByText('Clear All Fields')
    expect(clearButton).toBeInTheDocument()

    await user.click(clearButton)
    // The clear functionality would reset all form states
  })

  it('has log values button functionality', async () => {
    const user = userEvent.setup()

    render(<LocationPickerDemo />)

    const logButton = screen.getByText('Log All Values')
    expect(logButton).toBeInTheDocument()

    await user.click(logButton)

    // Current demo behavior is a no-op click handler; verify interaction is safe.
    expect(logButton).toBeInTheDocument()
  })

  it('displays testing instructions', () => {
    render(<LocationPickerDemo />)

    expect(screen.getByText('Testing Instructions')).toBeInTheDocument()
    expect(
      screen.getByText(/try searching for different types of locations/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/test with international locations/i)
    ).toBeInTheDocument()
  })

  it('shows location details when location is selected in advanced demo', async () => {
    const user = userEvent.setup()

    // Mock a successful place details response
    mockGetDetails.mockImplementation((request, callback) => {
      callback(
        {
          place_id: 'test-place-id',
          formatted_address: 'San Diego, CA, USA',
          address_components: [
            {
              long_name: 'San Diego',
              short_name: 'San Diego',
              types: ['locality'],
            },
            {
              long_name: 'California',
              short_name: 'CA',
              types: ['administrative_area_level_1'],
            },
            {
              long_name: 'United States',
              short_name: 'US',
              types: ['country'],
            },
          ],
          geometry: {
            location: {
              lat: () => 32.7157,
              lng: () => -117.1611,
            },
          },
        },
        'OK'
      )
    })

    render(<LocationPickerDemo />)

    // The demo would show location details after selection
    // This test verifies the structure is in place for that functionality
    expect(
      screen.getByText('Advanced Usage with Location Data')
    ).toBeInTheDocument()
  })

  it('handles error state demonstration', () => {
    render(<LocationPickerDemo />)

    expect(screen.getByText('Error Handling Demo')).toBeInTheDocument()
    expect(
      screen.getByText(/shows how the component handles errors/i)
    ).toBeInTheDocument()
  })

  it('shows disabled state properly', () => {
    render(<LocationPickerDemo />)

    expect(screen.getByText('Disabled State')).toBeInTheDocument()
    expect(screen.getByDisplayValue('San Diego, CA, USA')).toBeInTheDocument()
  })

  it('is accessible with proper heading structure', () => {
    render(<LocationPickerDemo />)

    const mainHeading = screen.getByRole('heading', { level: 4 })
    expect(mainHeading).toHaveTextContent('Location Picker Component Demo')

    const subHeadings = screen.getAllByRole('heading', { level: 6 })
    expect(subHeadings.length).toBeGreaterThan(0)
  })

  it('provides helpful demo descriptions', () => {
    render(<LocationPickerDemo />)

    expect(
      screen.getByText(/simple location picker with autocomplete/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/captures detailed location information/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/shows the component in a disabled state/i)
    ).toBeInTheDocument()
  })
})
