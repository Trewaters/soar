// Ensure these external dependencies are mocked before importing the route module
// Provide an explicit factory so the real auth implementation (which imports ESM-only packages)
// is never executed in the Jest environment.
jest.mock('../../../../../auth', () => ({
  __esModule: true,
  auth: jest.fn(),
}))
jest.mock('../../../../../prisma/generated/client', () => {
  // Create a shared mock prisma instance so both the test file and the route
  // module (which calls `new PrismaClient()` at import time) receive the same
  // mocked object. This ensures the test can control the behavior observed by
  // the route implementation.
  const mockPrisma = {
    userData: {
      findUnique: jest.fn(),
    },
    poseImage: {
      findUnique: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    asanaPosture: {
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  }

  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
  }
})
jest.mock('../../../../../lib/storage/manager')

import { DELETE } from '../../../../../app/api/images/[id]/route'
import { NextRequest } from 'next/server'
import { auth } from '../../../../../auth'
import { PrismaClient } from '../../../../../prisma/generated/client'
import { storageManager } from '../../../../../lib/storage/manager'

const mockAuth = auth as jest.Mock
const prisma = new PrismaClient()

describe('DELETE /api/images/[id]', () => {
  let req: NextRequest

  beforeEach(() => {
    jest.clearAllMocks()
    req = new NextRequest('http://localhost/api/images/some-image-id')
    // Mock transaction to support both calling with an array of operations
    // or with an async function (tx => { ... }) as used by the route.
    ;(prisma.$transaction as jest.Mock).mockImplementation(async (arg: any) => {
      if (typeof arg === 'function') {
        // Create a tx proxy that uses the same mocked model methods
        const tx = {
          poseImage: prisma.poseImage,
          asanaPosture: prisma.asanaPosture,
          userData: prisma.userData,
        }
        return await arg(tx)
      }

      if (Array.isArray(arg)) {
        const results: any[] = []
        for (const op of arg) {
          results.push(await op)
        }
        return results
      }

      // Fallback: return arg
      return arg
    })
  })

  describe('when user is not authenticated', () => {
    it('should return a 401 unauthorized response', async () => {
      mockAuth.mockResolvedValue(null)

      const response = await DELETE(req, {
        params: Promise.resolve({ id: 'some-image-id' }),
      })
      const body = await response.json()

      expect(response.status).toBe(401)
      expect(body.error).toBe('Authentication required')
    })
  })

  describe('when image does not exist', () => {
    it('should return a 404 not found response', async () => {
      mockAuth.mockResolvedValue({ user: { email: 'test@example.com' } })
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
      })
      ;(prisma.poseImage.findUnique as jest.Mock).mockResolvedValue(null)

      const response = await DELETE(req, {
        params: Promise.resolve({ id: 'non-existent-id' }),
      })
      const body = await response.json()

      expect(response.status).toBe(404)
      expect(body.error).toBe('Image not found')
    })
  })

  describe('when user does not own the image', () => {
    it('should return a 403 forbidden response', async () => {
      mockAuth.mockResolvedValue({ user: { email: 'test@example.com' } })
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
      })
      ;(prisma.poseImage.findUnique as jest.Mock).mockResolvedValue({
        id: 'image-1',
        userId: 'another-user-id',
      })

      const response = await DELETE(req, {
        params: Promise.resolve({ id: 'image-1' }),
      })
      const body = await response.json()

      expect(response.status).toBe(403)
      expect(body.error).toBe('Unauthorized')
    })
  })

  describe('when trying to delete an image from a system asana', () => {
    it('should return a 400 bad request response', async () => {
      mockAuth.mockResolvedValue({ user: { email: 'test@example.com' } })
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
      })
      ;(prisma.poseImage.findUnique as jest.Mock).mockResolvedValue({
        id: 'image-1',
        userId: 'user-1',
        postureId: 'asana-1',
        posture: {
          isUserCreated: false,
          created_by: 'system',
        },
      })

      const response = await DELETE(req, {
        params: Promise.resolve({ id: 'image-1' }),
      })
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toBe('Cannot delete images from system asanas')
    })
  })

  describe('when user does not own the asana', () => {
    it('should return a 403 forbidden response', async () => {
      mockAuth.mockResolvedValue({ user: { email: 'test@example.com' } })
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
      })
      ;(prisma.poseImage.findUnique as jest.Mock).mockResolvedValue({
        id: 'image-1',
        userId: 'user-1',
        postureId: 'asana-1',
        posture: {
          isUserCreated: true,
          created_by: 'another-user@example.com',
        },
      })

      const response = await DELETE(req, {
        params: Promise.resolve({ id: 'image-1' }),
      })
      const body = await response.json()

      expect(response.status).toBe(403)
      expect(body.error).toBe(
        'You can only delete images from asanas you created'
      )
    })
  })

  describe('when deletion is successful', () => {
    const imageIdToDelete = 'image-2'
    const postureId = 'asana-1'
    const mockImages = [
      { id: 'image-1', displayOrder: 1, postureId },
      {
        id: imageIdToDelete,
        displayOrder: 2,
        postureId,
        url: 'http://storage/image-2.jpg',
      },
      { id: 'image-3', displayOrder: 3, postureId },
    ]

    beforeEach(() => {
      mockAuth.mockResolvedValue({ user: { email: 'test@example.com' } })
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
      })
      ;(prisma.poseImage.findUnique as jest.Mock).mockImplementation((args) =>
        Promise.resolve(
          mockImages.find((img) => img.id === args.where.id)
            ? {
                ...mockImages.find((img) => img.id === args.where.id),
                userId: 'user-1',
                posture: {
                  isUserCreated: true,
                  created_by: 'test@example.com',
                },
              }
            : null
        )
      )
      ;(storageManager.delete as jest.Mock).mockResolvedValue(undefined)
      ;(prisma.poseImage.delete as jest.Mock).mockResolvedValue({
        id: imageIdToDelete,
      })

      const remainingImages = mockImages.filter(
        (img) => img.id !== imageIdToDelete
      )
      // When called inside the transaction, return the remaining images with
      // their original displayOrder so the route will detect gaps and call
      // update. After the transaction, the route fetches the updated list;
      // have the mock return the reordered list for that call.
      const originalRemaining = remainingImages.map((img) => ({ ...img }))
      const reorderedRemaining = remainingImages.map((img, i) => ({
        ...img,
        displayOrder: i + 1,
      }))

      // First call (inside tx) => original order (1 and 3)
      ;(prisma.poseImage.findMany as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(originalRemaining)
      )

      // Subsequent calls (after tx) => reordered (1 and 2)
      ;(prisma.poseImage.findMany as jest.Mock).mockResolvedValue(
        reorderedRemaining
      )
    })

    it('should call storageManager.delete with the image URL', async () => {
      await DELETE(req, { params: Promise.resolve({ id: imageIdToDelete }) })
      expect(storageManager.delete).toHaveBeenCalledWith(
        'http://storage/image-2.jpg'
      )
    })

    it('should delete the image from the database and reorder remaining images', async () => {
      await DELETE(req, { params: Promise.resolve({ id: imageIdToDelete }) })

      expect(prisma.poseImage.delete).toHaveBeenCalledWith({
        where: { id: imageIdToDelete },
      })

      // Check reordering
      expect(prisma.poseImage.update).toHaveBeenCalledWith({
        where: { id: 'image-3' },
        data: { displayOrder: 2 },
      })
    })

    it('should update the imageCount on the asana', async () => {
      await DELETE(req, { params: Promise.resolve({ id: imageIdToDelete }) })

      expect(prisma.asanaPosture.update).toHaveBeenCalledWith({
        where: { id: postureId },
        data: { imageCount: 2 },
      })
    })

    it('should return a successful response with the remaining images', async () => {
      const response = await DELETE(req, {
        params: Promise.resolve({ id: imageIdToDelete }),
      })
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.newImageCount).toBe(2)
      expect(body.remainingImages.length).toBe(2)
      expect(body.remainingImages[0].id).toBe('image-1')
      expect(body.remainingImages[0].displayOrder).toBe(1)
      expect(body.remainingImages[1].id).toBe('image-3')
      expect(body.remainingImages[1].displayOrder).toBe(2)
    })
  })
})
