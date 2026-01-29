import { NextRequest } from 'next/server'

// Mock auth and profileService dependencies
jest.mock('../../../../../auth', () => ({
  auth: jest.fn(),
}))

jest.mock('../../../../../lib/profileService', () => ({
  __esModule: true,
  default: {
    getLibrary: jest.fn(),
  },
}))

jest.mock('../../../../../lib/telemetry', () => ({
  trackServerEvent: jest.fn(),
}))

import { GET } from '../../../../../app/api/profile/library/route'
import { auth } from '../../../../../auth'
import profileService from '../../../../../lib/profileService'

describe('GET /api/profile/library - integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 401 when unauthenticated', async () => {
    ;(auth as jest.Mock).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/profile/library')
    const response = await GET(request as any)

    expect(response.status).toBe(401)
    const body = await response.json()
    expect(body).toHaveProperty('error')
    expect(body.error).toMatch(/Unauthorized|Authentication required/i)
  })

  it('calls profileService.getLibrary with session userId and returns data', async () => {
    const mockSession = {
      user: { id: 'user-123', email: 'me@example.com', role: 'user' },
    }
    ;(auth as jest.Mock).mockResolvedValue(mockSession)

    const mockResult = {
      items: [{ id: 'a1', title: 'Test Asana' }],
      nextCursor: null,
      hasMore: false,
      totalCount: 1,
    }

    ;(profileService as any).getLibrary.mockResolvedValue(mockResult)

    const request = new NextRequest(
      'http://localhost:3000/api/profile/library?type=asanas&limit=5'
    )
    const response = await GET(request as any)

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toMatchObject(mockResult)
    expect((profileService as any).getLibrary).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-123', type: 'asanas', limit: 5 })
    )
  })
})
