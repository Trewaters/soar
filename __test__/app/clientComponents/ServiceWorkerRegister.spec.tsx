import '@testing-library/jest-dom'
import { render, waitFor } from '@testing-library/react'
import ServiceWorkerRegister from '@clientComponents/ServiceWorkerRegister'

// Mock navigator.serviceWorker
const mockRegister = jest.fn()
const mockGetRegistrations = jest.fn()

beforeAll(() => {
  Object.defineProperty(navigator, 'serviceWorker', {
    value: {
      register: mockRegister,
      getRegistrations: mockGetRegistrations,
    },
    writable: true,
  })
})

beforeEach(() => {
  jest.clearAllMocks()
  jest.useFakeTimers()
  mockGetRegistrations.mockResolvedValue([])
  mockRegister.mockResolvedValue({
    addEventListener: jest.fn(),
  })
})

afterEach(() => {
  jest.useRealTimers()
})

describe('ServiceWorkerRegister', () => {
  describe('Happy Path', () => {
    it('should render without errors and return null', () => {
      const { container } = render(<ServiceWorkerRegister />)
      expect(container.firstChild).toBeNull()
    })

    it('should register service worker after timeout', async () => {
      render(<ServiceWorkerRegister />)

      // Advance timers to trigger the delayed registration
      jest.advanceTimersByTime(150)

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith('/sw.js', {
          scope: '/',
          type: 'classic',
        })
      })
    })

    it('should successfully complete registration flow', async () => {
      const mockAddEventListener = jest.fn()
      mockRegister.mockResolvedValue({
        addEventListener: mockAddEventListener,
      })

      render(<ServiceWorkerRegister />)
      jest.advanceTimersByTime(150)

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalled()
        expect(mockAddEventListener).toHaveBeenCalledWith(
          'updatefound',
          expect.any(Function)
        )
      })
    })

    it('should add updatefound event listener to registration', async () => {
      const mockAddEventListener = jest.fn()
      mockRegister.mockResolvedValue({
        addEventListener: mockAddEventListener,
      })

      render(<ServiceWorkerRegister />)
      jest.advanceTimersByTime(150)

      await waitFor(() => {
        expect(mockAddEventListener).toHaveBeenCalledWith(
          'updatefound',
          expect.any(Function)
        )
      })
    })
  })
})
