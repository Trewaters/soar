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
jest.mock('../../../app/prisma/generated/client', () => ({
  __esModule: true,
  default: {
    asanaSequence: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

// Mock auth (from project root)
jest.mock('../../../auth', () => ({
  auth: jest.fn(),
}))

import prisma from '../../../app/prisma/generated/client'
import { auth } from '../../../auth'
import * as route from '../../../app/api/sequences/[id]/route'

describe('API PATCH /api/sequences/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 401 when unauthenticated', async () => {
    ;(auth as jest.Mock).mockResolvedValue(null)

    // Minimal request-like object with json() used by the route
    const req: any = {
      json: async () => ({ nameSequence: 'New' }),
    }

    const res = await route.PATCH(req, { params: { id: 'xyz' } })
    expect(res.status).toBe(401)
  })

  it('returns 403 when user is not creator', async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { email: 'abc@x.com' } })
    ;(prisma as any).asanaSequence.findUnique.mockResolvedValue({
      id: 'xyz',
      created_by: 'owner@x.com',
    })

    const req: any = {
      json: async () => ({ nameSequence: 'New' }),
    }

    const res = await route.PATCH(req, { params: { id: 'xyz' } })
    expect(res.status).toBe(403)
  })

  it('updates when user is creator', async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { email: 'owner@x.com' } })
    ;(prisma as any).asanaSequence.findUnique.mockResolvedValue({
      id: 'xyz',
      created_by: 'owner@x.com',
    })
    ;(prisma as any).asanaSequence.update.mockResolvedValue({
      id: 'xyz',
      nameSequence: 'New',
    })

    const req: any = {
      json: async () => ({ nameSequence: 'New' }),
    }

    const res = await route.PATCH(req, { params: { id: 'xyz' } })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.nameSequence).toBe('New')
  })
})

describe('API DELETE /api/sequences/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 401 when unauthenticated', async () => {
    ;(auth as jest.Mock).mockResolvedValue(null)
    const res = await route.DELETE({} as any, { params: { id: 'xyz' } })
    expect(res.status).toBe(401)
  })

  it('returns 404 when not found', async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { email: 'owner@x.com' } })
    ;(prisma as any).asanaSequence.findUnique.mockResolvedValue(null)
    const res = await route.DELETE({} as any, { params: { id: 'missing' } })
    expect(res.status).toBe(404)
  })

  it('returns 403 when requester is not owner', async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { email: 'other@x.com' } })
    ;(prisma as any).asanaSequence.findUnique.mockResolvedValue({
      id: 'xyz',
      created_by: 'owner@x.com',
    })
    const res = await route.DELETE({} as any, { params: { id: 'xyz' } })
    expect(res.status).toBe(403)
  })

  it('deletes when owner matches', async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { email: 'owner@x.com' } })
    ;(prisma as any).asanaSequence.findUnique.mockResolvedValue({
      id: 'xyz',
      created_by: 'owner@x.com',
    })
    ;(prisma as any).asanaSequence.delete.mockResolvedValue({ success: true })
    const res = await route.DELETE({} as any, { params: { id: 'xyz' } })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
  })
})
