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

jest.mock('../../../../auth', () => ({ auth: jest.fn() }))
jest.mock('@app/utils/authorization', () => ({ isAdmin: jest.fn() }))
jest.mock('../../../../app/lib/prismaClient', () => ({
  prisma: {
    tosVersion: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}))

jest.mock('@app/compliance/terms/server/tosFileRegistry', () => ({
  isValidTosFile: jest.fn(),
}))

let POST: any
let GET: any
let auth: any
let isAdmin: any
let prisma: any
let isValidTosFile: any

beforeAll(() => {
  const mod = require('../../../../app/api/tos/route')
  POST = mod.POST
  GET = mod.GET
  auth = require('../../../../auth').auth
  isAdmin = require('@app/utils/authorization').isAdmin
  prisma = require('../../../../app/lib/prismaClient').prisma
  isValidTosFile =
    require('@app/compliance/terms/server/tosFileRegistry').isValidTosFile
})

describe('POST /api/tos', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 401 when not admin', async () => {
    ;(auth as any).mockResolvedValue({ user: { id: 'u' } })
    ;(isAdmin as any).mockResolvedValue(false)
    const req: any = {
      json: async () => ({ title: 'T', effectiveAt: new Date().toISOString() }),
    }
    const res: any = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(401)
    expect(body.error).toMatch(/Unauthorized/)
  })

  it('returns 400 when missing required fields', async () => {
    ;(auth as any).mockResolvedValue({ user: { id: 'u' } })
    ;(isAdmin as any).mockResolvedValue(true)
    const req: any = { json: async () => ({ title: '' }) }
    const res: any = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.error).toMatch(/Missing required fields/)
  })

  it('returns 400 when content file is invalid', async () => {
    ;(auth as any).mockResolvedValue({ user: { id: 'u' } })
    ;(isAdmin as any).mockResolvedValue(true)
    ;(isValidTosFile as any).mockReturnValue(false)
    const req: any = {
      json: async () => ({
        title: 'T',
        effectiveAt: new Date().toISOString(),
        contentFile: 'missing.md',
      }),
    }
    const res: any = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.error).toMatch(/Invalid content file/)
  })

  it('creates active version with transaction when active=true', async () => {
    ;(auth as any).mockResolvedValue({ user: { id: 'u' } })
    ;(isAdmin as any).mockResolvedValue(true)
    ;(isValidTosFile as any).mockReturnValue(true)

    // Simulate no existing ids
    ;(prisma.tosVersion.findMany as any).mockResolvedValue([])

    // Mock $transaction to call provided fn with a tx object
    ;(prisma.$transaction as any).mockImplementation(async (fn: any) => {
      const tx = {
        tosVersion: {
          updateMany: jest.fn().mockResolvedValue({}),
          create: jest
            .fn()
            .mockResolvedValue({ id: '202501010001', title: 'T' }),
        },
      }
      return fn(tx)
    })

    const req: any = {
      json: async () => ({
        title: 'T',
        effectiveAt: new Date().toISOString(),
        active: true,
        contentFile: 'default-2024-06-01.md',
      }),
    }
    const res: any = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(201)
    expect(body.id).toBeDefined()
  })
})

describe('GET /api/tos', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns specific version when versionId is provided', async () => {
    ;(prisma.tosVersion as any).findUnique = jest
      .fn()
      .mockResolvedValue({ id: 'v42', title: 'Version 42' })

    const req: any = {
      nextUrl: 'http://localhost:3000/api/tos?versionId=v42',
    }

    const res: any = await GET(req)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.id).toBe('v42')
  })

  it('returns 404 when versionId is not found', async () => {
    ;(prisma.tosVersion as any).findUnique = jest.fn().mockResolvedValue(null)

    const req: any = {
      nextUrl: 'http://localhost:3000/api/tos?versionId=missing',
    }

    const res: any = await GET(req)
    const body = await res.json()
    expect(res.status).toBe(404)
    expect(body.error).toMatch(/TOS version not found/)
  })

  it('returns active version when no versionId is provided', async () => {
    ;(prisma.tosVersion.findFirst as any).mockResolvedValue({
      id: 'active-v1',
      active: true,
    })

    const req: any = {
      nextUrl: 'http://localhost:3000/api/tos',
    }

    const res: any = await GET(req)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.id).toBe('active-v1')
  })

  it('returns 404 when there is no active version', async () => {
    ;(prisma.tosVersion.findFirst as any).mockResolvedValue(null)

    const req: any = {
      nextUrl: 'http://localhost:3000/api/tos',
    }

    const res: any = await GET(req)
    const body = await res.json()
    expect(res.status).toBe(404)
    expect(body.error).toMatch(/No active TOS version/)
  })
})
