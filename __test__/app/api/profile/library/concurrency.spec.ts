import '@testing-library/jest-dom'

// Mock Prisma client similar to other tests
const mockPrisma: any = {
  asanaPose: { findMany: jest.fn(), count: jest.fn() },
}

jest.mock('../../../../../lib/prismaClient', () => ({
  prisma: mockPrisma,
}))

describe('profileService concurrency case', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handles items deleted between pages by allowing refresh', async () => {
    // Page 1 returns two items
    mockPrisma.asanaPose.findMany
      .mockResolvedValueOnce([
        { id: 'a1', created_on: new Date('2024-01-03') },
        { id: 'a2', created_on: new Date('2024-01-02') },
      ])
      // Page 2 originally would return one item, but simulate deletion -> empty array
      .mockResolvedValueOnce([])

    const { getLibrary } = await import('../../../../../lib/profileService')

    // Load first page (paged mode)
    const res1 = await getLibrary({ type: 'asanas', limit: 2, page: 1 })
    expect(res1.items.length).toBe(2)

    // Request next page; simulate deletion between requests
    const res2 = await getLibrary({ type: 'asanas', limit: 2, page: 2 })

    // In this simulation res2 is empty; client should detect and call refresh (page 1)
    expect(res2.items.length).toBe(0)

    // Simulate refresh by calling page 1 again and ensure it returns items
    mockPrisma.asanaPose.findMany.mockResolvedValueOnce([
      { id: 'a1', created_on: new Date('2024-01-03') },
    ])
    const refreshed = await getLibrary({ type: 'asanas', limit: 2, page: 1 })
    expect(refreshed.items.length).toBeGreaterThan(0)
  })
})
