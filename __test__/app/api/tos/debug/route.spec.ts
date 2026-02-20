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

jest.mock('@lib/prismaClient', () => ({
  __esModule: true,
  default: {
    tosVersion: {
      findMany: jest.fn(),
    },
  },
}))

let GET: any
let prismaDefault: any

beforeAll(() => {
  const mod = require('../../../../../app/api/tos/debug/route')
  GET = mod.GET
  prismaDefault = require('@lib/prismaClient').default
})

describe('GET /api/tos/debug', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns version diagnostics payload', async () => {
    ;(prismaDefault.tosVersion.findMany as any).mockResolvedValue([
      { id: 'v3' },
      { id: 'v2' },
      { id: 'v1' },
    ])

    const res: any = await GET()
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.count).toBe(3)
    expect(body.versions).toHaveLength(3)
  })

  it('returns 500 on prisma failure', async () => {
    ;(prismaDefault.tosVersion.findMany as any).mockRejectedValue(
      new Error('db down')
    )

    const res: any = await GET()
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.ok).toBe(false)
    expect(String(body.error)).toMatch(/db down/)
  })
})
