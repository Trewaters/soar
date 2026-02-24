jest.mock('@app/utils/authorization', () => ({
  requireAuth: jest.fn(),
}))

jest.mock('@lib/prismaClient', () => ({
  prisma: {
    asanaPose: {
      create: jest.fn(),
    },
  },
}))

import { POST } from '../../../../app/api/poses/createAsana/route'
import { requireAuth } from '@app/utils/authorization'
import { prisma } from '@lib/prismaClient'

describe('POST /api/poses/createAsana validation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(requireAuth as jest.Mock).mockResolvedValue({
      user: { id: 'user-1', email: 'user@test.com' },
    })
  })

  it('returns 401 when unauthenticated', async () => {
    ;(requireAuth as jest.Mock).mockRejectedValueOnce(
      new Error('Unauthorized - Please sign in')
    )

    const response = await POST(
      new Request('http://localhost/api/poses/createAsana', {
        method: 'POST',
        body: JSON.stringify({}),
      })
    )

    expect(response.status).toBe(401)
  })

  it('returns 400 with structured validation errors for invalid payload', async () => {
    const response = await POST(
      new Request('http://localhost/api/poses/createAsana', {
        method: 'POST',
        body: JSON.stringify({
          sort_english_name: '',
          english_names: [],
          difficulty: 'Hard',
        }),
      })
    )

    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error).toBe('Validation failed')
    expect(body.validation.errors.sort_english_name).toBeDefined()
    expect(body.validation.errors.english_names).toBeDefined()
    expect(prisma.asanaPose.create).not.toHaveBeenCalled()
  })

  it('persists normalized payload for valid request', async () => {
    ;(prisma.asanaPose.create as jest.Mock).mockResolvedValue({
      id: 'pose-1',
      sort_english_name: 'Warrior II',
      breath: ['inhale'],
    })

    const response = await POST(
      new Request('http://localhost/api/poses/createAsana', {
        method: 'POST',
        body: JSON.stringify({
          sort_english_name: ' Warrior II ',
          english_names: [' Warrior II ', ' '],
          category: 'Standing',
          difficulty: 'Easy',
          description: '  ',
          breath: [' inhale ', ' '],
        }),
      })
    )

    expect(response.status).toBe(200)
    expect(prisma.asanaPose.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          sort_english_name: 'Warrior II',
          english_names: ['Warrior II'],
          description: null,
          breath: ['inhale'],
          created_by: 'user-1',
        }),
      })
    )
  })

  it('defaults difficulty to Easy when omitted', async () => {
    ;(prisma.asanaPose.create as jest.Mock).mockResolvedValue({
      id: 'pose-2',
      sort_english_name: 'Chair Pose',
      difficulty: 'Easy',
      breath: ['neutral'],
    })

    const response = await POST(
      new Request('http://localhost/api/poses/createAsana', {
        method: 'POST',
        body: JSON.stringify({
          sort_english_name: 'Chair Pose',
          english_names: ['Chair Pose'],
          category: 'Standing',
        }),
      })
    )

    expect(response.status).toBe(200)
    expect(prisma.asanaPose.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          sort_english_name: 'Chair Pose',
          difficulty: 'Easy',
        }),
      })
    )
  })

  it('defaults category to Standing when omitted', async () => {
    ;(prisma.asanaPose.create as jest.Mock).mockResolvedValue({
      id: 'pose-3',
      sort_english_name: 'Triangle Pose',
      category: 'Standing',
      breath: ['neutral'],
    })

    const response = await POST(
      new Request('http://localhost/api/poses/createAsana', {
        method: 'POST',
        body: JSON.stringify({
          sort_english_name: 'Triangle Pose',
          english_names: ['Triangle Pose'],
          difficulty: 'Easy',
        }),
      })
    )

    expect(response.status).toBe(200)
    expect(prisma.asanaPose.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          sort_english_name: 'Triangle Pose',
          category: 'Standing',
        }),
      })
    )
  })
})
