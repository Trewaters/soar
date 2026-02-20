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

jest.mock('@app/utils/authorization', () => ({ requireRole: jest.fn() }))
jest.mock('../../../../../app/lib/prismaClient', () => ({
  prisma: {
    userTosAcceptance: {
      findMany: jest.fn(),
    },
  },
}))

let GET: any
let requireRole: any
let prisma: any

beforeAll(() => {
  const mod = require('../../../../../app/api/tos/acceptances/route')
  GET = mod.GET
  requireRole = require('@app/utils/authorization').requireRole
  prisma = require('../../../../../app/lib/prismaClient').prisma
})

describe('GET /api/tos/acceptances', () => {
  beforeEach(() => jest.clearAllMocks())

  it('requires admin role and returns records', async () => {
    ;(requireRole as any).mockResolvedValue(undefined)
    ;(prisma.userTosAcceptance.findMany as any).mockResolvedValue([
      { id: 'a1' },
      { id: 'a2' },
    ])

    const req: any = {
      url: 'http://localhost:3000/api/tos/acceptances',
    }
    const res: any = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.data).toHaveLength(2)
    expect(requireRole).toHaveBeenCalledWith(['admin'])
  })

  it('applies query filters to findMany where clause', async () => {
    ;(requireRole as any).mockResolvedValue(undefined)
    ;(prisma.userTosAcceptance.findMany as any).mockResolvedValue([])

    const req: any = {
      url: 'http://localhost:3000/api/tos/acceptances?versionId=v1&userId=u1&from=2026-01-01&to=2026-01-31',
    }

    await GET(req)

    expect(prisma.userTosAcceptance.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          tosVersionId: 'v1',
          userId: 'u1',
          acceptedAt: {
            gte: new Date('2026-01-01'),
            lte: new Date('2026-01-31'),
          },
        },
        orderBy: { acceptedAt: 'desc' },
        take: 1000,
      })
    )
  })

  it('returns 500 when role check or query fails', async () => {
    ;(requireRole as any).mockRejectedValue(new Error('Forbidden'))

    const req: any = {
      url: 'http://localhost:3000/api/tos/acceptances',
    }

    const res: any = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.error).toMatch(/Internal server error/)
  })
})
