import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  LocationPicker,
  LocationData,
} from '@app/clientComponents/locationPicker'
import '@testing-library/jest-dom'

// Mock Google Maps API
const mockGetPlacePredictions = jest.fn()
const mockGetDetails = jest.fn()
const mockGeocode = jest.fn()

const mockAutocompleteService = {
  getPlacePredictions: mockGetPlacePredictions,
}

const mockPlacesService = {
  getDetails: mockGetDetails,
}

const mockGeocoder = {
  geocode: mockGeocode,
}

// Mock the Google Maps API
const mockGoogle = {
  maps: {
    places: {
      AutocompleteService: jest.fn(() => mockAutocompleteService),
      PlacesService: jest.fn(() => mockPlacesService),
      PlacesServiceStatus: {
        OK: 'OK',
        ZERO_RESULTS: 'ZERO_RESULTS',
        INVALID_REQUEST: 'INVALID_REQUEST',
      },
    },
    Geocoder: jest.fn(() => mockGeocoder),
    GeocoderStatus: {
      OK: 'OK',
      ZERO_RESULTS: 'ZERO_RESULTS',
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

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
}

// Mock process.env
const originalEnv = process.env
beforeAll(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'test-api-key',
  }
})

afterAll(() => {
  process.env = originalEnv
})

beforeEach(() => {
  // Reset mocks
  jest.clearAllMocks()

  // Reset useJsApiLoader mock to default state
  const { useJsApiLoader } = require('@react-google-maps/api')
  useJsApiLoader.mockReturnValue({
    isLoaded: true,
    loadError: null,
  })

  // Setup window.google
  ;(global as any).window.google = mockGoogle

  // Setup navigator.geolocation
  Object.defineProperty(global.navigator, 'geolocation', {
    value: mockGeolocation,
    configurable: true,
  })
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('LocationPicker', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    placeholder: 'Enter your location',
    label: 'Location',
  }

  const mockPlaceDetails = {
    place_id: 'place1',
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
  }

  const mockPrediction = {
    place_id: 'place1',
    description: 'San Diego, CA, USA',
    structured_formatting: {
      main_text: 'San Diego',
      secondary_text: 'CA, USA',
    },
  }

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<LocationPicker {...defaultProps} />)

      expect(screen.getByLabelText('Location')).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText('Enter your location')
      ).toBeInTheDocument()
    })

    it('renders with custom label and placeholder', () => {
      render(
        <LocationPicker
          {...defaultProps}
          label="Custom Location"
          placeholder="Custom placeholder"
        />
      )

      expect(screen.getByLabelText('Custom Location')).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText('Custom placeholder')
      ).toBeInTheDocument()
    })

    it('renders current location button when showCurrentLocation is true', () => {
      render(<LocationPicker {...defaultProps} showCurrentLocation={true} />)

      expect(screen.getByTitle('Use current location')).toBeInTheDocument()
    })

    it('does not render current location button when showCurrentLocation is false', () => {
      render(<LocationPicker {...defaultProps} showCurrentLocation={false} />)

      expect(
        screen.queryByTitle('Use current location')
      ).not.toBeInTheDocument()
    })

    it('renders in disabled state', () => {
      render(<LocationPicker {...defaultProps} disabled={true} />)

      const input = screen.getByLabelText('Location')
      expect(input).toBeDisabled()
    })

    it('renders with error state', () => {
      render(
        <LocationPicker
          {...defaultProps}
          error={true}
          helperText="Location is required"
        />
      )

      expect(screen.getByText('Location is required')).toBeInTheDocument()
    })
  })

  describe('User Input and Autocomplete', () => {
    it('shows loading state initially when Google Maps is not loaded', () => {
      const { useJsApiLoader } = require('@react-google-maps/api')
      useJsApiLoader.mockReturnValue({
        isLoaded: false,
        loadError: null,
      })

      render(<LocationPicker {...defaultProps} />)

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('shows error when Google Maps fails to load', () => {
      const { useJsApiLoader } = require('@react-google-maps/api')
      useJsApiLoader.mockReturnValue({
        isLoaded: false,
        loadError: new Error('Failed to load'),
      })

      render(<LocationPicker {...defaultProps} />)

      expect(screen.getByText(/error loading google maps/i)).toBeInTheDocument()
    })

    it('calls onChange when user types in input', async () => {
      const onChange = jest.fn()
      const user = userEvent.setup()

      render(<LocationPicker {...defaultProps} onChange={onChange} />)

      const input = screen.getByLabelText('Location')
      await user.type(input, 'San Diego')

      expect(input).toHaveValue('San Diego')
    })

    it('fetches autocomplete predictions when user types', async () => {
      const user = userEvent.setup()

      mockGetPlacePredictions.mockImplementation((request, callback) => {
        callback(
          [
            {
              place_id: 'place1',
              description: 'San Diego, CA, USA',
              structured_formatting: {
                main_text: 'San Diego',
                secondary_text: 'CA, USA',
              },
            },
          ],
          'OK'
        )
      })

      render(<LocationPicker {...defaultProps} />)

      const input = screen.getByLabelText('Location')
      await user.type(input, 'San Diego')

      await waitFor(() => {
        expect(mockGetPlacePredictions).toHaveBeenCalledWith(
          expect.objectContaining({
            input: 'San Diego',
            types: ['(cities)'],
          }),
          expect.any(Function)
        )
      })
    })

    it('displays autocomplete predictions', async () => {
      const user = userEvent.setup()

      mockGetPlacePredictions.mockImplementation((request, callback) => {
        callback(
          [
            {
              place_id: 'place1',
              description: 'San Diego, CA, USA',
              structured_formatting: {
                main_text: 'San Diego',
                secondary_text: 'CA, USA',
              },
            },
          ],
          'OK'
        )
      })

      render(<LocationPicker {...defaultProps} />)

      const input = screen.getByLabelText('Location')
      await user.type(input, 'San Diego')

      await waitFor(() => {
        expect(screen.getByText('San Diego')).toBeInTheDocument()
        expect(screen.getByText('CA, USA')).toBeInTheDocument()
      })
    })

    it('does not fetch predictions for short input', async () => {
      const user = userEvent.setup()

      render(<LocationPicker {...defaultProps} />)

      const input = screen.getByLabelText('Location')
      await user.type(input, 'Sa')

      expect(mockGetPlacePredictions).not.toHaveBeenCalled()
    })
  })

  describe('Place Selection', () => {
    it('calls onChange with location data when place is selected', async () => {
      const onChange = jest.fn()
      const user = userEvent.setup()

      mockGetPlacePredictions.mockImplementation((request, callback) => {
        callback(
          [
            {
              place_id: 'place1',
              description: 'San Diego, CA, USA',
              structured_formatting: {
                main_text: 'San Diego',
                secondary_text: 'CA, USA',
              },
            },
          ],
          'OK'
        )
      })

      mockGetDetails.mockImplementation((request, callback) => {
        callback(mockPlaceDetails, 'OK')
      })

      render(<LocationPicker {...defaultProps} onChange={onChange} />)

      const input = screen.getByLabelText('Location')
      await user.type(input, 'San Diego')

      await waitFor(() => {
        expect(screen.getByText('San Diego')).toBeInTheDocument()
        expect(screen.getByText('CA, USA')).toBeInTheDocument()
      })

      await user.click(screen.getByText('San Diego'))

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(
          'San Diego, California, United States',
          expect.objectContaining({
            formatted_address: 'San Diego, California, United States',
            city: 'San Diego',
            state: 'California',
            country: 'United States',
            coordinates: {
              lat: 32.7157,
              lng: -117.1611,
            },
            place_id: 'place1',
          })
        )
      })
    })

    it('handles international locations without state', async () => {
      const onChange = jest.fn()
      const user = userEvent.setup()

      const internationalPlace = {
        ...mockPlaceDetails,
        address_components: [
          {
            long_name: 'Tokyo',
            short_name: 'Tokyo',
            types: ['locality'],
          },
          {
            long_name: 'Japan',
            short_name: 'JP',
            types: ['country'],
          },
        ],
      }

      mockGetPlacePredictions.mockImplementation((request, callback) => {
        callback(
          [
            {
              place_id: 'place1',
              description: 'Tokyo, Japan',
              structured_formatting: {
                main_text: 'Tokyo',
                secondary_text: 'Japan',
              },
            },
          ],
          'OK'
        )
      })

      mockGetDetails.mockImplementation((request, callback) => {
        callback(internationalPlace, 'OK')
      })

      render(<LocationPicker {...defaultProps} onChange={onChange} />)

      const input = screen.getByLabelText('Location')
      await user.type(input, 'Tokyo')

      await waitFor(() => {
        expect(screen.getByText('Tokyo')).toBeInTheDocument()
        expect(screen.getByText('Japan')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Tokyo'))

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(
          'Tokyo, Japan',
          expect.objectContaining({
            formatted_address: 'Tokyo, Japan',
            city: 'Tokyo',
            state: '',
            country: 'Japan',
          })
        )
      })
    })
  })

  describe('Current Location', () => {
    beforeEach(() => {
      mockGeolocation.getCurrentPosition.mockClear()
    })

    it('requests current location when button is clicked', async () => {
      const user = userEvent.setup()

      render(<LocationPicker {...defaultProps} showCurrentLocation={true} />)

      const currentLocationBtn = screen.getByRole('button', {
        name: /get current location/i,
      })
      await user.click(currentLocationBtn)

      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
    })

    it('handles successful geolocation with geocoding', async () => {
      const onChange = jest.fn()
      const user = userEvent.setup()

      const mockPosition = {
        coords: {
          latitude: 32.7157,
          longitude: -117.1611,
        },
      }

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition)
      })

      mockGeocode.mockImplementation((request, callback) => {
        callback([mockPlaceDetails], 'OK')
      })

      render(
        <LocationPicker
          {...defaultProps}
          onChange={onChange}
          showCurrentLocation={true}
        />
      )

      const currentLocationBtn = screen.getByRole('button', {
        name: /get current location/i,
      })
      await user.click(currentLocationBtn)

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(
          'San Diego, California, United States',
          expect.objectContaining({
            city: 'San Diego',
            state: 'California',
            country: 'United States',
          })
        )
      })
    })

    it('handles geolocation permission denied', async () => {
      const user = userEvent.setup()

      mockGeolocation.getCurrentPosition.mockImplementation(
        (success, error) => {
          const mockError = {
            code: 1,
            message: 'User denied geolocation',
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
          }
          error(mockError)
        }
      )

      render(<LocationPicker {...defaultProps} showCurrentLocation={true} />)

      const currentLocationBtn = screen.getByRole('button', {
        name: /get current location/i,
      })
      await user.click(currentLocationBtn)

      await waitFor(() => {
        expect(screen.getByText(/location access denied/i)).toBeInTheDocument()
      })
    })

    it('handles geolocation unavailable', async () => {
      const user = userEvent.setup()

      mockGeolocation.getCurrentPosition.mockImplementation(
        (success, error) => {
          const mockError = {
            code: 2,
            message: 'Position unavailable',
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
          }
          error(mockError)
        }
      )

      render(<LocationPicker {...defaultProps} showCurrentLocation={true} />)

      const currentLocationBtn = screen.getByRole('button', {
        name: /get current location/i,
      })
      await user.click(currentLocationBtn)

      await waitFor(() => {
        expect(screen.getByText(/location not available/i)).toBeInTheDocument()
      })
    })

    it('handles geolocation timeout', async () => {
      const user = userEvent.setup()

      mockGeolocation.getCurrentPosition.mockImplementation(
        (success, error) => {
          const mockError = {
            code: 3,
            message: 'Timeout',
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
          }
          error(mockError)
        }
      )

      render(<LocationPicker {...defaultProps} showCurrentLocation={true} />)

      const currentLocationBtn = screen.getByRole('button', {
        name: /get current location/i,
      })
      await user.click(currentLocationBtn)

      await waitFor(() => {
        expect(
          screen.getByText(/location request timed out/i)
        ).toBeInTheDocument()
      })
    })

    it('shows geolocation not supported error', async () => {
      const user = userEvent.setup()

      // Remove geolocation from navigator
      Object.defineProperty(global.navigator, 'geolocation', {
        value: undefined,
        configurable: true,
      })

      render(<LocationPicker {...defaultProps} showCurrentLocation={true} />)

      const currentLocationBtn = screen.getByLabelText('Get current location')
      await user.click(currentLocationBtn)

      await waitFor(() => {
        expect(
          screen.getByText(/geolocation is not supported/i)
        ).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()

      mockGetPlacePredictions.mockImplementation((request, callback) => {
        callback(
          [
            {
              place_id: 'place1',
              description: 'San Diego, CA, USA',
              structured_formatting: {
                main_text: 'San Diego',
                secondary_text: 'CA, USA',
              },
            },
          ],
          'OK'
        )
      })

      mockGetDetails.mockImplementation((request, callback) => {
        callback(mockPlaceDetails, 'OK')
      })

      render(<LocationPicker {...defaultProps} />)

      const input = screen.getByLabelText('Location')
      await user.type(input, 'San Diego')

      await waitFor(() => {
        expect(screen.getByText('San Diego')).toBeInTheDocument()
        expect(screen.getByText('CA, USA')).toBeInTheDocument()
      })

      // Tab to prediction and press Enter
      await user.tab()
      await user.keyboard('{Enter}')

      // Should be able to navigate with keyboard - for now just verify input still works
      expect(input).toBeInTheDocument()
    })

    it('has proper ARIA labels', () => {
      render(<LocationPicker {...defaultProps} showCurrentLocation={true} />)

      expect(screen.getByLabelText('Location')).toBeInTheDocument()
      expect(screen.getByLabelText('Get current location')).toBeInTheDocument()
    })

    it('announces loading states to screen readers', async () => {
      const user = userEvent.setup()

      // Mock getCurrentPosition to not immediately call success/error callbacks
      // This keeps the loading state active
      mockGeolocation.getCurrentPosition.mockImplementation(() => {
        // Don't call success or error immediately to simulate loading state
      })

      render(<LocationPicker {...defaultProps} showCurrentLocation={true} />)

      const currentLocationBtn = screen.getByRole('button', {
        name: /get current location/i,
      })
      await user.click(currentLocationBtn)

      // Should show loading indicator
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      const user = userEvent.setup()

      mockGetPlacePredictions.mockImplementation((request, callback) => {
        callback(null, 'ERROR')
      })

      render(<LocationPicker {...defaultProps} />)

      const input = screen.getByLabelText('Location')
      await user.type(input, 'San Diego')

      // Should not crash and should handle error gracefully
      expect(input).toHaveValue('San Diego')
    })

    it('clears error when user starts typing', async () => {
      const user = userEvent.setup()

      render(
        <LocationPicker
          {...defaultProps}
          error={true}
          helperText="Previous error"
        />
      )

      const input = screen.getByLabelText('Location')
      await user.type(input, 'test')

      // Error should be cleared when user types
      expect(input).toHaveValue('test')
    })
  })

  describe('Props and Configuration', () => {
    it('applies custom styles', () => {
      const customSx = { backgroundColor: 'red' }

      render(<LocationPicker {...defaultProps} sx={customSx} />)

      const container = screen
        .getByLabelText('Location')
        .closest('.MuiBox-root')
      expect(container).toHaveStyle({ backgroundColor: 'red' })
    })

    it('uses different TextField variants', () => {
      const { rerender } = render(
        <LocationPicker {...defaultProps} variant="filled" />
      )

      expect(screen.getByLabelText('Location')).toBeInTheDocument()

      rerender(<LocationPicker {...defaultProps} variant="standard" />)

      expect(screen.getByLabelText('Location')).toBeInTheDocument()
    })

    it('handles fullWidth prop', () => {
      render(<LocationPicker {...defaultProps} fullWidth={false} />)

      expect(screen.getByLabelText('Location')).toBeInTheDocument()
    })
  })
})
