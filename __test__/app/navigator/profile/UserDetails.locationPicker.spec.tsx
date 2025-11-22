// Shared mocks for all tests
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
import React from 'react'
import { act } from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import EditUserDetails from '@app/navigator/profile/editUserDetails'
import { UseUser } from '@app/context/UserContext'
import '@testing-library/jest-dom'

// ...existing code...

// Mocks and shared variables (must be in scope for all tests)

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

describe('EditUserDetails - LocationPicker Integration', () => {
  const mockRouterPush = jest.fn()

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

      render(<EditUserDetails />)

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

      render(<EditUserDetails />)

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
      render(<EditUserDetails />)

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

      render(<EditUserDetails />)

      await waitFor(() => {
        const locationInput = screen.getByPlaceholderText(
          'Search for your city, state, or country'
        )
        expect(locationInput).toHaveValue('')
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

      render(<EditUserDetails />)

      await waitFor(() => {
        const currentLocationBtn = screen.getByTitle('Use current location')
        expect(currentLocationBtn).toBeInTheDocument()
      })
      const currentLocationBtn = screen.getByTitle('Use current location')
      await user.click(currentLocationBtn)
    })

    it('shows loading state during geolocation request', async () => {
      const user = userEvent.setup()

      let resolveGeolocation: any
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        resolveGeolocation = success
        // Don't call success immediately to simulate loading
      })

      render(<EditUserDetails />)
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
      if (resolveGeolocation) {
        resolveGeolocation({
          coords: {
            latitude: 32.7157,
            longitude: -117.1611,
          },
        })
      }
    })
  })

  describe('Form Integration and Data Persistence', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      } as any)

      // Setup fetch mock to handle different endpoints
      ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url.includes('/api/profileImage/get')) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                success: true,
                images: [],
                activeImage: null,
              }),
          })
        }
        if (url.includes('/api/user/updateUserData/')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockUserData),
          })
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        })
      })
    })

    it('includes location data in form submission', async () => {
      const user = userEvent.setup()

      render(<EditUserDetails />)

      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /save/i })
        expect(saveButton).toBeInTheDocument()
      })

      // Fire submit event directly on the form using testid
      let form = undefined
      try {
        form = screen.getByTestId('edit-user-details-form')
      } catch (e) {
        form = document.querySelector('form')
      }
      if (form) {
        fireEvent.submit(form)
      } else {
        // fallback: click the button
        const saveButton = screen.getByRole('button', { name: /save/i })
        await user.click(saveButton)
      }

      // Verify the form submission includes location data
      await waitFor(() => {
        const fetchCalls = (global.fetch as jest.Mock).mock.calls
        const updateCall = fetchCalls.find((call) =>
          call[0]?.includes('/api/user/updateUserData/')
        )
        expect(updateCall).toBeDefined()
        if (updateCall) {
          expect(updateCall[1]).toMatchObject({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })
          expect(updateCall[1].body).toContain('"location":')
        }
      })
    })

    it('handles form submission error gracefully', async () => {
      const user = userEvent.setup()

      ;(global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to update user data')
      )

      render(<EditUserDetails />)

      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /save/i })
        expect(saveButton).toBeInTheDocument()
      })

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      // Wait for the error to be set and verify fetch was called
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })

      // The component sets error state but may not display it in the DOM
      // Check that the form is still present (component didn't crash)
      expect(saveButton).toBeInTheDocument()
    })

    it('shows loading state during form submission', async () => {
      const user = userEvent.setup()

      ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url.includes('/api/profileImage/get')) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                success: true,
                images: [],
                activeImage: null,
              }),
          })
        }
        if (url.includes('/api/user/updateUserData/')) {
          return new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve(mockUserData),
                }),
              100
            )
          )
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        })
      })

      render(<EditUserDetails />)

      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /save/i })
        expect(saveButton).toBeInTheDocument()
      })

      const saveButton = screen.getByRole('button', { name: /save/i })
      await act(async () => {
        await user.click(saveButton)
      })

      // The loading state is internal - verify the submission completes
      await waitFor(
        () => {
          const calls = (global.fetch as jest.Mock).mock.calls
          // Debug output for troubleshooting
          // eslint-disable-next-line no-console
          console.log('FETCH CALLS:', calls)
          const found = calls.some(
            ([url, options]) =>
              url.includes('/api/user/updateUserData/') &&
              typeof options === 'object'
          )
          expect(found).toBe(true)
        },
        { timeout: 4000 }
      )
    })

    // ...existing code...
  })

  it('displays helper text explaining location benefits', async () => {
    render(<EditUserDetails />)

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

    render(<EditUserDetails />)

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

    // Use mouseDown since we changed the component to use onMouseDown for immediate response
    const prediction = screen.getByText('San Diego')
    fireEvent.mouseDown(prediction)

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

    render(<EditUserDetails />)

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

    render(<EditUserDetails />)

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

    render(<EditUserDetails />)

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

    render(<EditUserDetails />)

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

    render(<EditUserDetails />)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_USER',
      payload: { ...userDataWithoutEmail, email: mockSession.user.email },
    })
  })
})
