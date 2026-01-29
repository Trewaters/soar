import '@testing-library/jest-dom'

// Mock Prisma client
const mockPrisma: any = {
  asanaPose: { findMany: jest.fn(), count: jest.fn() },
  asanaSeries: { findMany: jest.fn(), count: jest.fn() },
  asanaSequence: { findMany: jest.fn(), count: jest.fn() },
}

jest.mock('../../lib/prismaClient', () => ({
  prisma: mockPrisma,
}))

describe('profileService.getLibrary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('queries asanaPose.findMany for type=asanas with correct order and limit', async () => {
    mockPrisma.asanaPose.findMany.mockResolvedValue([
      { id: '3', createdAt: new Date('2024-01-03') },
      { id: '2', createdAt: new Date('2024-01-02') },
      { id: '1', createdAt: new Date('2024-01-01') },
    ])

    const { getLibrary } = await import('../../lib/profileService')

    const res = await getLibrary({ userId: 'user-1', type: 'asanas', limit: 2 })

    expect(mockPrisma.asanaPose.findMany).toHaveBeenCalled()
    expect(res.items.length).toBe(2)
    expect(res.hasMore).toBe(true)
    expect(res.nextCursor).toBeDefined()
  })

  it('returns merged items for type=all', async () => {
    mockPrisma.asanaPose.findMany.mockResolvedValue([
      { id: 'p1', createdAt: new Date('2024-01-04') },
    ])
    mockPrisma.asanaSeries.findMany.mockResolvedValue([
      { id: 's1', createdAt: new Date('2024-01-03') },
    ])
    mockPrisma.asanaSequence.findMany.mockResolvedValue([
      { id: 'q1', createdAt: new Date('2024-01-02') },
    ])

    const { getLibrary } = await import('../../lib/profileService')

    const res = await getLibrary({ type: 'all', limit: 5 })

    expect(mockPrisma.asanaPose.findMany).toHaveBeenCalled()
    expect(mockPrisma.asanaSeries.findMany).toHaveBeenCalled()
    expect(mockPrisma.asanaSequence.findMany).toHaveBeenCalled()
    expect(res.items.length).toBeGreaterThan(0)
  })
})
