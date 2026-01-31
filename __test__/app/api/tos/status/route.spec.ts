// Tests for GET /api/tos/status
import { jest } from '@jest/globals'

// Minimal MockResponse used by our mocked NextResponse.json
class MockResponse {
  status: number
  body: any
  constructor(body: any, init?: { status?: number }) {
    this.body = body
    this.status = init?.status ?? 200
  }
  async json() {
    return this.body
  }
}

// Use CommonJS-style jest.mock to avoid top-level await issues in this environment
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: any) => new MockResponse(body, init),
  },
}))

jest.mock('../../../../../auth', () => ({
  auth: jest.fn(),
}))

jest.mock('../../../../../app/lib/prismaClient', () => ({
  prisma: {
    tosVersion: { findFirst: jest.fn() },
    userData: { findUnique: jest.fn() },
  },
}))

let GET: any
let auth: any
let prisma: any

beforeAll(() => {
  // Require after mocks are registered
  const mod = require('../../../../../app/api/tos/status/route')
  GET = mod.GET
  auth = require('../../../../../auth').auth
  prisma = require('../../../../../app/lib/prismaClient').prisma
})

describe('GET /api/tos/status', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns accepted=true when user accepted the active version', async () => {
    ;(auth as any).mockResolvedValue({ user: { id: 'user1' } })
    ;(prisma.tosVersion.findFirst as any).mockResolvedValue({ id: 'v1' })
    ;(prisma.userData.findUnique as any).mockResolvedValue({
      acceptedTosVersionId: 'v1',
    })

    const res: any = await GET({} as any)
    const body = await res.json()
    expect(body.accepted).toBe(true)
    expect(body.activeVersionId).toBe('v1')
    expect(body.userAcceptedVersionId).toBe('v1')
  })

  it('returns accepted=false when user has different accepted version', async () => {
    ;(auth as any).mockResolvedValue({ user: { id: 'user1' } })
    ;(prisma.tosVersion.findFirst as any).mockResolvedValue({ id: 'v1' })
    ;(prisma.userData.findUnique as any).mockResolvedValue({
      acceptedTosVersionId: 'other',
    })

    const res: any = await GET({} as any)
    const body = await res.json()
    expect(body.accepted).toBe(false)
    expect(body.activeVersionId).toBe('v1')
    expect(body.userAcceptedVersionId).toBe('other')
  })

  it('returns 401 when unauthenticated', async () => {
    ;(auth as any).mockResolvedValue(null)
    const res: any = await GET({} as any)
    const body = await res.json()
    expect(res.status).toBe(401)
    expect(body.error).toMatch(/Authentication required/)
  })

  it('returns 404 when no active version', async () => {
    ;(auth as any).mockResolvedValue({ user: { id: 'user1' } })
    ;(prisma.tosVersion.findFirst as any).mockResolvedValue(null)
    const res: any = await GET({} as any)
    const body = await res.json()
    expect(res.status).toBe(404)
    expect(body.error).toMatch(/No active TOS version/)
  })
})
