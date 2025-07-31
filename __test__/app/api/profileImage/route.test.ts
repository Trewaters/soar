import { createMocks } from 'node-mocks-http'
import { POST } from '@/app/api/profileImage/route'

jest.mock('next-auth/react', () => ({
  getServerSession: jest.fn(() => ({ user: { email: 'test@uvuyoga.com' } })),
}))
jest.mock('@/prisma/generated/client', () => ({
  userData: {
    findUnique: jest.fn(() => ({
      profileImages: [],
      email: 'test@uvuyoga.com',
    })),
    update: jest.fn(({ data }) => ({ profileImages: data.profileImages })),
  },
}))

describe('POST /api/profileImage', () => {
  it('should reject if no file is uploaded', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    })
    const response = await POST(req)
    expect(response.status).toBe(400)
  })

  it('should reject if file type is invalid', async () => {
    // ...mock file with invalid type...
  })

  it('should reject if file size is too large', async () => {
    // ...mock file with size > 2MB...
  })

  it('should add image if valid and under limit', async () => {
    // ...mock valid file and user with <3 images...
  })

  it('should reject if user already has 3 images', async () => {
    // ...mock user with 3 images...
  })
})
