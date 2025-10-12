import '@testing-library/jest-dom'
import { Session } from 'next-auth'

// Mock Prisma Client before importing utilities under test
const mockPrisma = {
  asanaPose: {
    findUnique: jest.fn(),
  },
}

jest.doMock('../../../prisma/generated/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}))

jest.resetModules()

const {
  verifyAsanaOwnership,
  canManageImages,
} = require('../../../app/utils/asanaOwnership')

const mockUserSession = {
  user: {
    id: 'user-id-123',
    email: 'creator@example.com',
    name: 'Creator',
  },
} as Session

describe('Owner matching compatibility', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('verifyAsanaOwnership returns true when created_by matches email', async () => {
    mockPrisma.asanaPose.findUnique.mockResolvedValue({
      created_by: 'creator@example.com',
    })

    const result = await verifyAsanaOwnership(
      'asana-abc',
      'creator@example.com'
    )

    expect(result).toBe(true)
    expect(mockPrisma.asanaPose.findUnique).toHaveBeenCalledWith({
      where: { id: 'asana-abc' },
      select: { created_by: true },
    })
  })

  it('verifyAsanaOwnership returns true when created_by matches user id (legacy records)', async () => {
    mockPrisma.asanaPose.findUnique.mockResolvedValue({
      created_by: 'user-id-123',
    })

    const result = await verifyAsanaOwnership('asana-abc', 'user-id-123')

    expect(result).toBe(true)
  })

  it('canManageImages recognizes ownership by email in session', () => {
    const asana = {
      created_by: 'creator@example.com',
      isUserCreated: true,
      imageCount: 1,
    }

    const result = canManageImages(asana, mockUserSession)

    expect(result).toBe(true)
  })

  it('canManageImages recognizes ownership by id in session (legacy)', () => {
    const asana = {
      created_by: 'user-id-123',
      isUserCreated: true,
      imageCount: 1,
    }

    const result = canManageImages(asana, mockUserSession)

    // should be true because helpers accept session.user.id as well
    expect(result).toBe(true)
  })
})
