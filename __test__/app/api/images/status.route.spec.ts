// Mock next/server to avoid requiring the Edge runtime polyfills during tests
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => data,
    }),
  },
}))

// Mock Prisma singleton used by the route
jest.mock('../../../prisma/generated/client', () => ({
  __esModule: true,
  default: {
    asanaPosture: {
      findUnique: jest.fn(),
    },
    $disconnect: jest.fn(),
  },
}))

// Mock auth
jest.mock('../../../auth', () => ({
  auth: jest.fn(),
}))

const prisma = require('../../../prisma/generated/client')
const { auth } = require('../../../auth')
const route = require('../../../app/api/images/status/route')

describe('GET /api/images/status', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const baseUrl = 'http://localhost/api/images/status'

  it('returns 401 when unauthenticated', async () => {
    ;(auth as jest.Mock).mockResolvedValue(null)

    const req: any = {
      url: `${baseUrl}?postureId=abc&userId=creator@example.com`,
    }

    const res = await route.GET(req)
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body).toEqual({ error: 'Authentication required' })
  })

  it('returns 400 when postureId missing', async () => {
    ;(auth as jest.Mock).mockResolvedValue({
      user: { email: 'creator@example.com' },
    })
    const req: any = { url: `${baseUrl}?userId=creator@example.com` }

    const res = await route.GET(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body).toEqual({ error: 'postureId is required' })
  })

  it('returns 400 when userId missing', async () => {
    ;(auth as jest.Mock).mockResolvedValue({
      user: { email: 'creator@example.com' },
    })
    const req: any = { url: `${baseUrl}?postureId=abc` }

    const res = await route.GET(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body).toEqual({ error: 'userId is required' })
  })

  it('returns 403 when userId does not match session email', async () => {
    ;(auth as jest.Mock).mockResolvedValue({
      user: { email: 'someone@x.com' },
    })
    const req: any = {
      url: `${baseUrl}?postureId=abc&userId=creator@example.com`,
    }

    const res = await route.GET(req)
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body).toEqual({ error: 'Unauthorized access' })
  })

  it('returns 404 when asana not found', async () => {
    ;(auth as jest.Mock).mockResolvedValue({
      user: { email: 'creator@example.com' },
    })
    ;(prisma as any).asanaPosture.findUnique.mockResolvedValue(null)

    const req: any = {
      url: `${baseUrl}?postureId=missing&userId=creator@example.com`,
    }

    const res = await route.GET(req)
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body).toEqual({ error: 'Asana not found' })
  })

  it('returns status object for owner when user can manage images', async () => {
    ;(auth as jest.Mock).mockResolvedValue({
      user: { email: 'creator@example.com' },
    })
    ;(prisma as any).asanaPosture.findUnique.mockResolvedValue({
      isUserCreated: true,
      created_by: 'creator@example.com',
      imageCount: 1,
    })

    const req: any = {
      url: `${baseUrl}?postureId=abc&userId=creator@example.com`,
    }

    const res = await route.GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({
      currentCount: 1,
      remainingSlots: 2,
      maxAllowed: 3,
      canUpload: true,
      isUserCreated: true,
      canManage: true,
    })
  })
})
