import { jest } from '@jest/globals'

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

jest.mock('next/server', () => ({
  NextResponse: { json: (b: any, init?: any) => new MockResponse(b, init) },
}))

jest.mock('../../../../../auth', () => ({ auth: jest.fn() }))

jest.mock('../../../../../app/lib/prismaClient', () => ({
  prisma: {
    tosVersion: { findFirst: jest.fn() },
    userTosAcceptance: { create: jest.fn() },
    userData: { update: jest.fn() },
  },
}))

let POST: any
let auth: any
let prisma: any

beforeAll(() => {
  const mod = require('../../../../../app/api/tos/accept/route')
  POST = mod.POST
  auth = require('../../../../../auth').auth
  prisma = require('../../../../../app/lib/prismaClient').prisma
})

describe('POST /api/tos/accept', () => {
  beforeEach(() => jest.clearAllMocks())

  it('records acceptance when active version exists', async () => {
    ;(auth as any).mockResolvedValue({ user: { id: 'u1' } })
    ;(prisma.tosVersion.findFirst as any).mockResolvedValue({ id: 'vA' })
    ;(prisma.userTosAcceptance.create as any).mockResolvedValue({ id: 'a1' })
    ;(prisma.userData.update as any).mockResolvedValue({
      id: 'u1',
      acceptedTosVersionId: 'vA',
    })

    const mockReq: any = {
      json: async () => ({}),
      headers: {
        get: (k: string) =>
          k === 'x-real-ip' ? '1.2.3.4' : k === 'user-agent' ? 'jest' : null,
      },
    }

    const res: any = await POST(mockReq)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(prisma.userTosAcceptance.create).toHaveBeenCalled()
    expect(prisma.userData.update).toHaveBeenCalled()
  })

  it('returns 401 when unauthenticated', async () => {
    ;(auth as any).mockResolvedValue(null)
    const mockReq: any = {
      json: async () => ({}),
      headers: { get: () => null },
    }
    const res: any = await POST(mockReq)
    const body = await res.json()
    expect(res.status).toBe(401)
    expect(body.error).toMatch(/Authentication required/)
  })

  it('returns 400 when no active version and no versionId provided', async () => {
    ;(auth as any).mockResolvedValue({ user: { id: 'u1' } })
    ;(prisma.tosVersion.findFirst as any).mockResolvedValue(null)
    const mockReq: any = {
      json: async () => ({}),
      headers: { get: () => null },
    }
    const res: any = await POST(mockReq)
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.error).toMatch(/No active TOS version available/)
  })
})
