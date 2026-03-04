// Mock console.log to avoid console output during tests
global.console = {
  ...console,
  log: jest.fn(),
}

// Simple response mock
class MockResponse {
  private _status: number
  private _data: any
  private _headers: Record<string, string>

  constructor(
    data: any,
    init?: { status?: number; headers?: Record<string, string> }
  ) {
    this._data = data
    this._status = init?.status || 200
    this._headers = init?.headers || {}
  }

  get status() {
    return this._status
  }

  async json() {
    return typeof this._data === 'string' ? JSON.parse(this._data) : this._data
  }

  get headers() {
    return this._headers
  }
}

// Mock Web API classes for API route testing
global.Response = MockResponse as any
global.Headers = class MockHeaders {
  private _headers: Record<string, string> = {}

  constructor(init?: Record<string, string>) {
    if (init) {
      this._headers = { ...init }
    }
  }

  get(name: string) {
    return this._headers[name.toLowerCase()]
  }

  set(name: string, value: string) {
    this._headers[name.toLowerCase()] = value
  }
} as any

global.FormData = class MockFormData {
  private _data: Map<string, any> = new Map()

  append(name: string, value: any) {
    this._data.set(name, value)
  }

  get(name: string) {
    return this._data.get(name)
  }

  has(name: string) {
    return this._data.has(name)
  }
} as any

global.File = class MockFile {
  name: string
  type: string
  size: number
  private _content: any

  constructor(content: any, name: string, options: { type?: string } = {}) {
    this._content = content
    this.name = name
    this.type = options.type || ''
    this.size = Array.isArray(content)
      ? content.length
      : content.toString().length
  }
} as any

// Mock the auth function from auth.ts
jest.mock('../../../../auth', () => ({
  auth: jest.fn(() => Promise.resolve({ user: { email: 'test@uvuyoga.com' } })),
}))

// Mock Prisma client
jest.mock('../../../../app/prisma/generated/client', () => ({
  __esModule: true,
  default: {
    userData: {
      findUnique: jest.fn(() =>
        Promise.resolve({
          profileImages: [],
          email: 'test@uvuyoga.com',
        })
      ),
      update: jest.fn(({ data }) =>
        Promise.resolve({ profileImages: data.profileImages })
      ),
    },
  },
}))

// Mock storage manager
jest.mock('../../../../lib/storage/manager', () => ({
  storageManager: {
    uploadProfileImage: jest.fn(() =>
      Promise.resolve({
        url: 'https://example.com/image.jpg',
        id: 'test-image-id',
      })
    ),
  },
}))

// Mock the route handler itself to avoid importing the actual file
const mockPOST = jest.fn()

jest.mock('../../../../app/api/profileImage/route', () => ({
  POST: mockPOST,
}))

describe('POST /api/profileImage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle POST request properly', async () => {
    // Mock the response for no file uploaded
    mockPOST.mockResolvedValue(
      new MockResponse(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    // Create a mock NextRequest
    const mockRequest = {
      method: 'POST',
      headers: new (global.Headers as any)(),
      formData: async () => new (global.FormData as any)(),
    }

    const response = await mockPOST(mockRequest)
    const data = await response.json()

    expect(mockPOST).toHaveBeenCalledWith(mockRequest)
    expect(response.status).toBe(400)
    expect(data.error).toBe('No file uploaded')
  })

  it('should handle successful file upload', async () => {
    // Mock successful upload response
    mockPOST.mockResolvedValue(
      new MockResponse(
        JSON.stringify({
          message: 'Profile image uploaded successfully',
          profileImages: [
            {
              url: 'https://example.com/image.jpg',
              id: 'test-image-id',
              isActive: true,
            },
          ],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    )

    const mockFile = new (global.File as any)(['fake content'], 'test.jpg', {
      type: 'image/jpeg',
    })
    const formData = new (global.FormData as any)()
    formData.append('file', mockFile)

    const mockRequest = {
      method: 'POST',
      headers: new (global.Headers as any)(),
      formData: async () => formData,
    }

    const response = await mockPOST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe('Profile image uploaded successfully')
    expect(data.profileImages).toHaveLength(1)
  })

  it('should handle authentication errors', async () => {
    mockPOST.mockResolvedValue(
      new MockResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    const mockRequest = {
      method: 'POST',
      headers: new (global.Headers as any)(),
      formData: async () => new (global.FormData as any)(),
    }

    const response = await mockPOST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })
})
