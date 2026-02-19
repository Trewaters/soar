jest.mock('../../../../auth', () => ({
  auth: jest.fn(),
}))

jest.mock('@app/utils/authorization', () => ({
  canModifyContent: jest.fn(),
}))

jest.mock('@lib/prismaClient', () => ({
  prisma: {
    asanaPose: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

jest.mock('fs', () => ({
  existsSync: jest.fn(() => true),
  mkdirSync: jest.fn(),
  appendFileSync: jest.fn(),
}))

import { PUT } from '../../../../app/api/poses/[id]/route'
import { auth } from '../../../../auth'
import { canModifyContent } from '@app/utils/authorization'
import { prisma } from '@lib/prismaClient'

describe('PUT /api/poses/[id] validation', () => {
  const params = { params: Promise.resolve({ id: 'pose-1' }) }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(auth as jest.Mock).mockResolvedValue({
      user: { email: 'owner@test.com' },
    })
    ;(canModifyContent as jest.Mock).mockResolvedValue(true)
    ;(prisma.asanaPose.findUnique as jest.Mock).mockResolvedValue({
      id: 'pose-1',
      created_by: 'owner@test.com',
    })
  })

  it('returns 403 before validation if authorization fails', async () => {
    ;(canModifyContent as jest.Mock).mockResolvedValueOnce(false)

    const response = await PUT(
      {
        json: async () => ({ difficulty: 'Hard' }),
      } as any,
      params
    )

    expect(response.status).toBe(403)
    expect(prisma.asanaPose.update).not.toHaveBeenCalled()
  })

  it('returns 400 when update payload fails validation', async () => {
    const response = await PUT(
      {
        json: async () => ({
          sort_english_name: ' ',
          difficulty: 'hard',
          english_names: [],
        }),
      } as any,
      params
    )

    const body = await response.json()
    expect(response.status).toBe(400)
    expect(body.error).toBe('Validation failed')
    expect(body.validation.errors.sort_english_name).toBeDefined()
    expect(prisma.asanaPose.update).not.toHaveBeenCalled()
  })

  it('allows partial update and persists normalized values', async () => {
    ;(prisma.asanaPose.update as jest.Mock).mockResolvedValue({
      id: 'pose-1',
      sort_english_name: 'Chair Pose',
      breath: ['inhale'],
    })

    const response = await PUT(
      {
        json: async () => ({
          sort_english_name: '  Chair Pose ',
          breath: [' inhale ', ' '],
        }),
      } as any,
      params
    )

    expect(response.status).toBe(200)
    expect(prisma.asanaPose.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          sort_english_name: 'Chair Pose',
          breath: ['inhale'],
        }),
      })
    )
  })
})
