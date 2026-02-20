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
jest.mock('@app/utils/authorization', () => ({ isAdmin: jest.fn() }))
jest.mock('@lib/prismaClient', () => ({
  prisma: {
    tosVersion: {
      updateMany: jest.fn(),
      update: jest.fn(),
    },
  },
}))

let POST: any
let auth: any
let isAdmin: any
let prisma: any

beforeAll(() => {
  const mod = require('../../../../../app/api/tos/activate/route')
  POST = mod.POST
  auth = require('../../../../../auth').auth
  isAdmin = require('@app/utils/authorization').isAdmin
  prisma = require('@lib/prismaClient').prisma
})

describe('POST /api/tos/activate', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 401 when not authenticated or admin', async () => {
    ;(auth as any).mockResolvedValue(null)
    ;(isAdmin as any).mockResolvedValue(false)

    const req: any = { json: async () => ({ versionId: 'v1' }) }
    const res: any = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(401)
    expect(body.error).toMatch(/Unauthorized/)
  })

  it('returns 400 when versionId is missing', async () => {
    ;(auth as any).mockResolvedValue({ user: { id: 'admin-1' } })
    ;(isAdmin as any).mockResolvedValue(true)

    const req: any = { json: async () => ({}) }
    const res: any = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error).toMatch(/Missing versionId/)
  })

  it('deactivates all versions and activates selected version', async () => {
    ;(auth as any).mockResolvedValue({ user: { id: 'admin-1' } })
    ;(isAdmin as any).mockResolvedValue(true)
    ;(prisma.tosVersion.updateMany as any).mockResolvedValue({ count: 3 })
    ;(prisma.tosVersion.update as any).mockResolvedValue({
      id: 'v-next',
      active: true,
    })

    const req: any = { json: async () => ({ versionId: 'v-next' }) }
    const res: any = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.updated.id).toBe('v-next')
    expect(prisma.tosVersion.updateMany).toHaveBeenCalledWith({
      where: {},
      data: { active: false },
    })
    expect(prisma.tosVersion.update).toHaveBeenCalledWith({
      where: { id: 'v-next' },
      data: { active: true },
    })
  })
})
