import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import UserDetails from '@app/navigator/profile/UserDetails'
import { UseUser } from '@app/context/UserContext'
import '@testing-library/jest-dom'

// Mock dependencies
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }: any) => children,
}))
jest.mock('next/navigation')
jest.mock('@app/context/UserContext')

// Mock Google Maps API - Comprehensive mocking for real LocationPicker integration
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
  ;(global as any).window.google = mockGoogle

  // Setup navigator.geolocation
  Object.defineProperty(global.navigator, 'geolocation', {
    value: mockGeolocation,
    configurable: true,
  })
})

afterAll(() => {
  process.env = originalEnv
})

// Mock @react-google-maps/api
jest.mock('@react-google-maps/api', () => ({
  useJsApiLoader: jest.fn(() => ({
    isLoaded: true,
    loadError: null,
  })),
}))

// Mock ActivityStreaks component
jest.mock('@app/clientComponents/activityStreaks/ActivityStreaks', () => {
  return function MockActivityStreaks({ variant }: { variant: string }) {
    return (
      <div data-testid="activity-streaks">Activity Streaks ({variant})</div>
    )
  }
})

// Mock Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Mock fetch
global.fetch = jest.fn()

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUseUser = UseUser as jest.MockedFunction<typeof UseUser>

describe('UserDetails - LocationPicker Integration', () => {
  const mockRouterPush = jest.fn()
  const mockDispatch = jest.fn()

  const mockUserData = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    location: 'San Diego, CA, USA',
    pronouns: 'they/them',
    headline: 'Yoga enthusiast',
    bio: 'Passionate yoga practitioner',
    yogaStyle: 'Vinyasa',
    yogaExperience: '5 years',
    company: 'Yoga Studio',
    websiteURL: 'https://example.com',
    createdAt: '2023-01-01T00:00:00.000Z',
  }

  const mockSession = {
    user: {
      email: 'test@example.com',
      name: 'Test User',
      image: 'https://example.com/avatar.jpg',
    },
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

  beforeEach(() => {
    jest.clearAllMocks()

    // Reset useJsApiLoader mock to default state
    const { useJsApiLoader } = require('@react-google-maps/api')
    useJsApiLoader.mockReturnValue({
      isLoaded: true,
      loadError: null,
    })

    mockUseRouter.mockReturnValue({
      push: mockRouterPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    } as any)

    mockUseUser.mockReturnValue({
      state: { userData: mockUserData },
      dispatch: mockDispatch,
    } as any)
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUserData),
    })
  })

  describe('Authentication and Basic Rendering', () => {
    it('renders sign-in button when not authenticated', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      } as any)

      render(<UserDetails />)

      expect(
        screen.getByRole('button', { name: /sign in to view your profile/i })
      ).toBeInTheDocument()
      expect(screen.queryByText('My Location')).not.toBeInTheDocument()
    })

    it('renders user details form with LocationPicker when authenticated', async () => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      } as any)

      render(<UserDetails />)

      await waitFor(() => {
        expect(screen.getByText('My Location')).toBeInTheDocument()
      })

      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument()
      expect(screen.getByDisplayValue('they/them')).toBeInTheDocument()
    })
  })

  describe('LocationPicker Component Integration', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      } as any)
    })

    it('renders LocationPicker with correct props', async () => {
      render(<UserDetails />)

      await waitFor(() => {
        expect(screen.getByText('My Location')).toBeInTheDocument()
      })

      const locationInput = screen.getByPlaceholderText(
        'Search for your city, state, or country'
      )
      expect(locationInput).toBeInTheDocument()
      expect(locationInput).toHaveValue('San Diego, CA, USA')

      // Check helper text
      expect(
        screen.getByText(
          'Select your location to connect with local yoga practitioners'
        )
      ).toBeInTheDocument()

      // Check current location button
      expect(screen.getByTitle('Use current location')).toBeInTheDocument()
    })

    it('renders with empty location when user has no location', async () => {
      mockUseUser.mockReturnValue({
        state: { userData: { ...mockUserData, location: null } },
        dispatch: mockDispatch,
      } as any)

      render(<UserDetails />)

      await waitFor(() => {
        const locationInput = screen.getByPlaceholderText(
          'Search for your city, state, or country'
        )
        expect(locationInput).toHaveValue('')
      })
    })
  })

  describe('Location Search and Autocomplete', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      } as any)
    })

    it('fetches location predictions when user types', async () => {
      const user = userEvent.setup()

      mockGetPlacePredictions.mockImplementation((request, callback) => {
        callback(
          [
            {
              place_id: 'place1',
              description: 'Los Angeles, CA, USA',
              structured_formatting: {
                main_text: 'Los Angeles',
                secondary_text: 'CA, USA',
              },
            },
          ],
          'OK'
        )
      })

      render(<UserDetails />)

      await waitFor(() => {
        const locationInput = screen.getByPlaceholderText(
          'Search for your city, state, or country'
        )
        expect(locationInput).toBeInTheDocument()
      })

      const locationInput = screen.getByPlaceholderText(
        'Search for your city, state, or country'
      )
      await user.clear(locationInput)
      await user.type(locationInput, 'Los Angeles')

      await waitFor(() => {
        expect(mockGetPlacePredictions).toHaveBeenCalledWith(
          expect.objectContaining({
            input: 'Los Angeles',
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
              description: 'Los Angeles, CA, USA',
              structured_formatting: {
                main_text: 'Los Angeles',
                secondary_text: 'CA, USA',
              },
            },
          ],
          'OK'
        )
      })

      render(<UserDetails />)

      await waitFor(() => {
        const locationInput = screen.getByPlaceholderText(
          'Search for your city, state, or country'
        )
        expect(locationInput).toBeInTheDocument()
      })

      const locationInput = screen.getByPlaceholderText(
        'Search for your city, state, or country'
      )
      await user.clear(locationInput)
      await user.type(locationInput, 'Los Angeles')

      await waitFor(() => {
        expect(screen.getByText('Los Angeles')).toBeInTheDocument()
      })
    })

    it('handles location selection and updates user context', async () => {
      const user = userEvent.setup()

      mockGetPlacePredictions.mockImplementation((request, callback) => {
        callback(
          [
            {
              place_id: 'place1',
              description: 'Los Angeles, CA, USA',
              structured_formatting: {
                main_text: 'Los Angeles',
                secondary_text: 'CA, USA',
              },
            },
          ],
          'OK'
        )
      })

      mockGetDetails.mockImplementation((request, callback) => {
        callback(
          {
            ...mockPlaceDetails,
            formatted_address: 'Los Angeles, California, United States',
            address_components: [
              {
                long_name: 'Los Angeles',
                short_name: 'Los Angeles',
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
          },
          'OK'
        )
      })

      render(<UserDetails />)

      await waitFor(() => {
        const locationInput = screen.getByPlaceholderText(
          'Search for your city, state, or country'
        )
        expect(locationInput).toBeInTheDocument()
      })

      const locationInput = screen.getByPlaceholderText(
        'Search for your city, state, or country'
      )
      await user.clear(locationInput)
      await user.type(locationInput, 'Los Angeles')

      await waitFor(() => {
        expect(screen.getByText('Los Angeles')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Los Angeles'))

      await waitFor(() => {
        expect(mockGetDetails).toHaveBeenCalledWith(
          expect.objectContaining({
            placeId: 'place1',
            fields: [
              'formatted_address',
              'address_components',
              'geometry',
              'place_id',
            ],
          }),
          expect.any(Function)
        )
      })

      // Verify user context is updated
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_USER',
          payload: expect.objectContaining({
            location: 'Los Angeles, California, United States',
          }),
        })
      })
    })

    it('handles international locations without state', async () => {
      const user = userEvent.setup()

      const internationalPlace = {
        ...mockPlaceDetails,
        formatted_address: 'Tokyo, Japan',
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

      render(<UserDetails />)

      await waitFor(() => {
        const locationInput = screen.getByPlaceholderText(
          'Search for your city, state, or country'
        )
        expect(locationInput).toBeInTheDocument()
      })

      const locationInput = screen.getByPlaceholderText(
        'Search for your city, state, or country'
      )
      await user.clear(locationInput)
      await user.type(locationInput, 'Tokyo')

      await waitFor(() => {
        expect(
          screen.getByText((_, element) =>
            element?.textContent?.trim().includes('Tokyo, Japan')
          )
        ).toBeInTheDocument()
      })

      await user.click(
        screen.getByText(
          (_, element) => element?.textContent?.trim() === 'Tokyo, Japan'
        )
      )

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_USER',
          payload: expect.objectContaining({
            location: 'Tokyo, Japan',
          }),
        })
      })
    })
  })

  describe('Current Location Functionality', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      } as any)
    })

    it('requests current location when button is clicked', async () => {
      const user = userEvent.setup()

      render(<UserDetails />)

      await waitFor(() => {
        const currentLocationBtn = screen.getByTitle('Use current location')
        expect(currentLocationBtn).toBeInTheDocument()
      })

      const currentLocationBtn = screen.getByTitle('Use current location')
      await user.click(currentLocationBtn)

      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
    })

    it('handles successful geolocation and geocoding', async () => {
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

      render(<UserDetails />)

      await waitFor(() => {
        const currentLocationBtn = screen.getByTitle('Use current location')
        expect(currentLocationBtn).toBeInTheDocument()
      })

      const currentLocationBtn = screen.getByTitle('Use current location')
      await user.click(currentLocationBtn)

      await waitFor(() => {
        expect(mockGeocode).toHaveBeenCalledWith(
          expect.objectContaining({
            location: {
              lat: 32.7157,
              lng: -117.1611,
            },
          }),
          expect.any(Function)
        )
      })

      // Verify context is updated with geocoded location
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_USER',
          payload: expect.objectContaining({
            location: 'San Diego, California, United States',
          }),
        })
      })
    })

    it('handles geolocation permission denied error', async () => {
      const user = userEvent.setup()

      mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
        error({
          code: 1, // PERMISSION_DENIED
          message: 'User denied geolocation',
        })
      })

      render(<UserDetails />)

      await waitFor(() => {
        const currentLocationBtn = screen.getByTitle('Use current location')
        expect(currentLocationBtn).toBeInTheDocument()
      })

      const currentLocationBtn = screen.getByTitle('Use current location')
      await user.click(currentLocationBtn)

      await waitFor(() => {
        expect(screen.getByText(/User denied geolocation/i)).toBeInTheDocument()
      })
    })

    it('handles geolocation timeout error', async () => {
      const user = userEvent.setup()

      mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
        error({
          code: 3, // TIMEOUT
          message: 'Geolocation request timed out',
        })
      })

      render(<UserDetails />)

      await waitFor(() => {
        const currentLocationBtn = screen.getByTitle('Use current location')
        expect(currentLocationBtn).toBeInTheDocument()
      })

      const currentLocationBtn = screen.getByTitle('Use current location')
      await user.click(currentLocationBtn)

      // Adjust geolocation timeout error matcher
      await waitFor(() => {
        expect(
          screen.getByText((_, element) =>
            element?.textContent?.includes('Geolocation request timed out')
          )
        ).toBeInTheDocument()
      })
    })

    it('shows loading state during geolocation request', async () => {
      const user = userEvent.setup()

      let resolveGeolocation: (position: any) => void
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        resolveGeolocation = success
        // Don't call success immediately to simulate loading
      })

      render(<UserDetails />)

      await waitFor(() => {
        const currentLocationBtn = screen.getByTitle('Use current location')
        expect(currentLocationBtn).toBeInTheDocument()
      })

      const currentLocationBtn = screen.getByTitle('Use current location')
      await user.click(currentLocationBtn)

      // Should show loading indicator in the button
      await waitFor(() => {
        expect(
          screen.getByRole('progressbar', { hidden: true })
        ).toBeInTheDocument()
      })

      // Resolve the geolocation request
      resolveGeolocation({
        coords: {
          latitude: 32.7157,
          longitude: -117.1611,
        },
      })
    })
  })

  describe('Form Integration and Data Persistence', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      } as any)
    })

    it('includes location data in form submission', async () => {
      const user = userEvent.setup()

      render(<UserDetails />)

      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /save/i })
        expect(saveButton).toBeInTheDocument()
      })

      // Update location first
      const locationInput = screen.getByPlaceholderText(
        'Search for your city, state, or country'
      )
      await user.clear(locationInput)
      await user.type(locationInput, 'Los Angeles, CA')

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          `/api/user/updateUserData/?email=${mockUserData.email}`,
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: expect.stringContaining('"location":"Los Angeles, CA"'),
          })
        )
      })
    })

    it('handles form submission error gracefully', async () => {
      const user = userEvent.setup()

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
      })

      render(<UserDetails />)

      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /save/i })
        expect(saveButton).toBeInTheDocument()
      })

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      await waitFor(() => {
        expect(
          screen.getByText(/error updating user data/i)
        ).toBeInTheDocument()
      })
    })

    it('shows loading state during form submission', async () => {
      const user = userEvent.setup()

      ;(global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve(mockUserData),
                }),
              100
            )
          )
      )

      render(<UserDetails />)

      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /save/i })
        expect(saveButton).toBeInTheDocument()
      })

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      // Should show loading indicator in save button
      expect(
        screen.getByRole('progressbar', { hidden: true })
      ).toBeInTheDocument()

      // Wait for submission to complete
      await waitFor(
        () => {
          expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
        },
        { timeout: 2000 }
      )
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      } as any)
    })

    it('handles Google Maps API load errors', async () => {
      const { useJsApiLoader } = require('@react-google-maps/api')
      useJsApiLoader.mockReturnValue({
        isLoaded: false,
        loadError: new Error('Failed to load Google Maps'),
      })

      render(<UserDetails />)

      await waitFor(() => {
        expect(
          screen.getByText(/error loading google maps/i)
        ).toBeInTheDocument()
      })
    })

    it('shows loading state when Google Maps is loading', async () => {
      const { useJsApiLoader } = require('@react-google-maps/api')
      useJsApiLoader.mockReturnValue({
        isLoaded: false,
        loadError: null,
      })

      render(<UserDetails />)

      await waitFor(() => {
        expect(
          screen.getByText(/loading location services/i)
        ).toBeInTheDocument()
      })
    })

    it('handles API prediction errors gracefully', async () => {
      const user = userEvent.setup()

      mockGetPlacePredictions.mockImplementation((request, callback) => {
        callback(null, 'ERROR')
      })

      render(<UserDetails />)

      await waitFor(() => {
        const locationInput = screen.getByPlaceholderText(
          'Search for your city, state, or country'
        )
        expect(locationInput).toBeInTheDocument()
      })

      const locationInput = screen.getByPlaceholderText(
        'Search for your city, state, or country'
      )
      await user.clear(locationInput)
      await user.type(locationInput, 'Invalid Location')

      // Should not show any predictions and not crash
      await waitFor(() => {
        expect(screen.queryByText('Invalid Location')).not.toBeInTheDocument()
      })
    })
  })

  describe('Accessibility and User Experience', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      } as any)
    })

    it('has proper ARIA labels and roles', async () => {
      render(<UserDetails />)

      await waitFor(() => {
        const locationInput = screen.getByPlaceholderText(
          'Search for your city, state, or country'
        )
        expect(locationInput).toBeInTheDocument()

        // Check if input has proper accessibility - it should have a label
        expect(locationInput).toHaveAttribute('id')
        expect(screen.getByLabelText('Location')).toBeInTheDocument()
      })

      const currentLocationBtn = screen.getByTitle('Use current location')
      expect(currentLocationBtn).toBeInTheDocument()
      expect(currentLocationBtn).toHaveAttribute('title')
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()

      mockGetPlacePredictions.mockImplementation((request, callback) => {
        callback(
          [
            {
              place_id: 'place1',
              description: 'Los Angeles, CA, USA',
              structured_formatting: {
                main_text: 'Los Angeles',
                secondary_text: 'CA, USA',
              },
            },
          ],
          'OK'
        )
      })

      render(<UserDetails />)

      await waitFor(() => {
        const locationInput = screen.getByPlaceholderText(
          'Search for your city, state, or country'
        )
        expect(locationInput).toBeInTheDocument()
      })

      const locationInput = screen.getByPlaceholderText(
        'Search for your city, state, or country'
      )
      await user.clear(locationInput)
      await user.type(locationInput, 'Los Angeles')

      await waitFor(() => {
        expect(screen.getByText('Los Angeles')).toBeInTheDocument()
      })

      // Tab to navigate to prediction and press Enter
      await user.tab()
      await user.keyboard('{Enter}')

      // Should handle keyboard selection
      expect(screen.getByText('Los Angeles')).toBeInTheDocument()
    })

    it('displays helper text explaining location benefits', async () => {
      render(<UserDetails />)

      await waitFor(() => {
        expect(
          screen.getByText(
            'Select your location to connect with local yoga practitioners'
          )
        ).toBeInTheDocument()
      })
    })

    it('shows location chips for detailed location data', async () => {
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

      render(<UserDetails />)

      await waitFor(() => {
        const locationInput = screen.getByPlaceholderText(
          'Search for your city, state, or country'
        )
        expect(locationInput).toBeInTheDocument()
      })

      const locationInput = screen.getByPlaceholderText(
        'Search for your city, state, or country'
      )
      await user.clear(locationInput)
      await user.type(locationInput, 'San Diego')

      await waitFor(() => {
        expect(screen.getByText('San Diego')).toBeInTheDocument()
        expect(screen.getByText('CA, USA')).toBeInTheDocument()
      })

      await user.click(screen.getByText('San Diego'))

      // Wait for location chips to appear
      await waitFor(() => {
        expect(screen.getByText('City: San Diego')).toBeInTheDocument()
        expect(screen.getByText('State: California')).toBeInTheDocument()
        expect(screen.getByText('Country: United States')).toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases and Boundary Conditions', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      } as any)
    })

    it('handles empty location gracefully', async () => {
      const userDataWithoutLocation = { ...mockUserData, location: '' }
      mockUseUser.mockReturnValue({
        state: { userData: userDataWithoutLocation },
        dispatch: mockDispatch,
      } as any)

      render(<UserDetails />)

      await waitFor(() => {
        const locationInput = screen.getByPlaceholderText(
          'Search for your city, state, or country'
        )
        expect(locationInput).toBeInTheDocument()
        expect(locationInput).toHaveValue('')
      })
    })

    it('handles very long location names', async () => {
      const user = userEvent.setup()
      const longLocationName =
        'A Very Long Location Name That Exceeds Normal Length Limits'

      render(<UserDetails />)

      await waitFor(() => {
        const locationInput = screen.getByPlaceholderText(
          'Search for your city, state, or country'
        )
        expect(locationInput).toBeInTheDocument()
      })

      const locationInput = screen.getByPlaceholderText(
        'Search for your city, state, or country'
      )
      await user.clear(locationInput)
      await user.type(locationInput, longLocationName)

      // Should handle long input without crashing
      expect(locationInput).toHaveValue(longLocationName)
    })

    it('handles special characters in location names', async () => {
      const user = userEvent.setup()
      const specialLocationName = 'Saint-Jean-sur-Richelieu, Québec'

      render(<UserDetails />)

      await waitFor(() => {
        const locationInput = screen.getByPlaceholderText(
          'Search for your city, state, or country'
        )
        expect(locationInput).toBeInTheDocument()
      })

      const locationInput = screen.getByPlaceholderText(
        'Search for your city, state, or country'
      )
      await user.clear(locationInput)
      await user.type(locationInput, specialLocationName)

      // Should handle special characters without issues
      expect(locationInput).toHaveValue(specialLocationName)
    })

    it('does not fetch predictions for short input', async () => {
      const user = userEvent.setup()

      render(<UserDetails />)

      await waitFor(() => {
        const locationInput = screen.getByPlaceholderText(
          'Search for your city, state, or country'
        )
        expect(locationInput).toBeInTheDocument()
      })

      const locationInput = screen.getByPlaceholderText(
        'Search for your city, state, or country'
      )
      await user.clear(locationInput)
      await user.type(locationInput, 'Sa')

      // Should not call API for short input
      expect(mockGetPlacePredictions).not.toHaveBeenCalled()
    })
  })

  describe('User Context Integration', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      } as any)
    })

    it('syncs email from session to user context', () => {
      const userDataWithoutEmail = { ...mockUserData, email: '' }
      mockUseUser.mockReturnValue({
        state: { userData: userDataWithoutEmail },
        dispatch: mockDispatch,
      } as any)

      render(<UserDetails />)

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_USER',
        payload: { ...userDataWithoutEmail, email: mockSession.user.email },
      })
    })

    it('updates user context when other fields change alongside location', async () => {
      const user = userEvent.setup()

      // Set initial state for userData
      const initialUserData = {
        pronouns: 'they/them',
        location: '',
        // Add other necessary fields with default values
      }
      mockDispatch.mockImplementation((action) => {
        if (action.type === 'SET_USER') {
          initialUserData.pronouns = action.payload.pronouns
        }
      })

      // Ensure initial state is correct
      await waitFor(() => {
        const pronounsInput = screen.getByDisplayValue('they/them')
        expect(pronounsInput).toBeInTheDocument()
      })

      // Clear previous dispatch calls
      mockDispatch.mockClear()

      // Update pronouns field
      const pronounsInput = screen.getByDisplayValue('they/them')
      await user.clear(pronounsInput)
      await user.type(pronounsInput, 'she/her')

      // Wait for all typing to complete and check the last call
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled()
      })

      // Check that the last call contains the expected pronouns value
      const lastCall =
        mockDispatch.mock.calls[mockDispatch.mock.calls.length - 1]
      expect(lastCall[0]).toEqual({
        type: 'SET_USER',
        payload: expect.objectContaining({
          pronouns: 'she/her',
        }),
      })
    })
  })
})
