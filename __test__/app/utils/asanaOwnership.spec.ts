/**
 * Unit tests for asana ownership verification utilities
 * Tests ownership validation functions for multi-image management
 */

import '@testing-library/jest-dom'
import { Session } from 'next-auth'
import { AsanaPostureData } from '../../../types/images'

// Mock Prisma Client - create mock before importing the module that uses it
const mockPrisma = {
  asanaPosture: {
    findUnique: jest.fn(),
  },
  poseImage: {
    findMany: jest.fn(),
  },
}

// Use doMock to avoid jest hoisting the mock call before mockPrisma is defined
jest.doMock('../../../prisma/generated/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}))

// Now require the utilities under test after mocking Prisma to avoid import hoisting
jest.resetModules()
const {
  verifyAsanaOwnership,
  canManageImages,
  isUserCreatedAsana,
  getImageManagementPermissions,
  verifyMultipleImageOwnership,
  canHaveMultipleImages,
  getNextDisplayOrder,
  validateDisplayOrders,
  AsanaOwnershipError,
  ImageLimitError,
  SystemAsanaError,
} = require('../../../app/utils/asanaOwnership')

// Mock session data
const mockUserSession = {
  user: {
    id: 'test-user-id',
    email: 'test@uvuyoga.com',
    name: 'Test Yogi',
  },
} as Session

const mockOtherUserSession = {
  user: {
    id: 'other-user-id',
    email: 'other@uvuyoga.com',
    name: 'Other Yogi',
  },
} as Session

// Mock asana data
const mockUserCreatedAsana: AsanaPostureData = {
  id: 'user-asana-1',
  english_names: ['Custom Warrior'],
  sanskrit_names: 'Virabhadrasana Custom',
  sort_english_name: 'Custom Warrior',
  description: 'A custom variation of warrior pose',
  benefits: 'Custom benefits',
  category: 'standing',
  difficulty: 'intermediate',
  lore: 'Custom lore',
  breath_direction_default: 'natural breath',
  dristi: 'forward',
  variations: [],
  modifications: [],
  label: 'custom',
  suggested_postures: [],
  preparatory_postures: [],
  preferred_side: 'both',
  sideways: false,
  image: 'custom-warrior.jpg',
  created_on: new Date('2024-01-01'),
  updated_on: new Date('2024-01-02'),
  acitivity_completed: false,
  acitivity_practice: true,
  posture_intent: 'strength and balance',
  breath_series: [],
  duration_asana: '30 seconds',
  transition_cues_out: 'step back',
  transition_cues_in: 'step forward',
  setup_cues: 'ground feet',
  deepening_cues: 'lift chest',
  customize_asana: 'adjust stance',
  additional_cues: 'breathe deeply',
  joint_action: 'hip flexion',
  muscle_action: 'quad engagement',
  created_by: 'test-user-id',
  isUserCreated: true,
  imageCount: 2,
  poseImages: [],
}

const mockSystemAsana: AsanaPostureData = {
  ...mockUserCreatedAsana,
  id: 'system-asana-1',
  english_names: ['Traditional Warrior I'],
  sort_english_name: 'Traditional Warrior I',
  created_by: '', // System asanas don't have creators
  isUserCreated: false,
  imageCount: 1,
}

describe('Asana Ownership Verification Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('verifyAsanaOwnership', () => {
    it('should return true when user owns the asana', async () => {
      mockPrisma.asanaPosture.findUnique.mockResolvedValue({
        created_by: 'test-user-id',
      })

      const result = await verifyAsanaOwnership('asana-1', 'test-user-id')

      expect(result).toBe(true)
      expect(mockPrisma.asanaPosture.findUnique).toHaveBeenCalledWith({
        where: { id: 'asana-1' },
        select: { created_by: true },
      })
    })

    it('should return false when user does not own the asana', async () => {
      mockPrisma.asanaPosture.findUnique.mockResolvedValue({
        created_by: 'other-user-id',
      })

      const result = await verifyAsanaOwnership('asana-1', 'test-user-id')

      expect(result).toBe(false)
    })

    it('should return false when asana does not exist', async () => {
      mockPrisma.asanaPosture.findUnique.mockResolvedValue(null)

      const result = await verifyAsanaOwnership('non-existent', 'test-user-id')

      expect(result).toBe(false)
    })

    it('should return false and log error when database query fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockPrisma.asanaPosture.findUnique.mockRejectedValue(
        new Error('Database error')
      )

      const result = await verifyAsanaOwnership('asana-1', 'test-user-id')

      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error verifying asana ownership:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })
  })

  describe('canManageImages', () => {
    it('should return true for user-created asana owned by session user', () => {
      const result = canManageImages(mockUserCreatedAsana, mockUserSession)

      expect(result).toBe(true)
    })

    it('should return false for user-created asana not owned by session user', () => {
      const result = canManageImages(mockUserCreatedAsana, mockOtherUserSession)

      expect(result).toBe(false)
    })

    it('should return false for system asana', () => {
      const result = canManageImages(mockSystemAsana, mockUserSession)

      expect(result).toBe(false)
    })

    it('should return false when session is null', () => {
      const result = canManageImages(mockUserCreatedAsana, null)

      expect(result).toBe(false)
    })

    it('should return false when session user has no id', () => {
      const invalidSession = {
        ...mockUserSession,
        user: { ...mockUserSession.user, id: undefined },
      } as any

      const result = canManageImages(mockUserCreatedAsana, invalidSession)

      expect(result).toBe(false)
    })
  })

  describe('isUserCreatedAsana', () => {
    it('should return true for user-created asana', () => {
      const result = isUserCreatedAsana(mockUserCreatedAsana)

      expect(result).toBe(true)
    })

    it('should return false for system asana', () => {
      const result = isUserCreatedAsana(mockSystemAsana)

      expect(result).toBe(false)
    })

    it('should return false for asana without isUserCreated flag', () => {
      const asanaWithoutFlag = {
        ...mockUserCreatedAsana,
        isUserCreated: undefined,
      } as any

      const result = isUserCreatedAsana(asanaWithoutFlag)

      expect(result).toBe(false)
    })
  })

  describe('getImageManagementPermissions', () => {
    it('should return correct permissions for user-created asana owner', () => {
      const asanaWithImages = {
        ...mockUserCreatedAsana,
        imageCount: 2,
      }

      const permissions = getImageManagementPermissions(
        asanaWithImages,
        mockUserSession
      )

      expect(permissions).toEqual({
        canUpload: true, // 2 < 3, can upload more
        canDelete: true, // has images to delete
        canReorder: true, // more than 1 image
        canManage: true,
        isOwner: true,
        isUserCreated: true,
        maxImages: 3,
        currentCount: 2,
        remainingSlots: 1,
      })
    })

    it('should return correct permissions when image limit reached', () => {
      const asanaWithMaxImages = {
        ...mockUserCreatedAsana,
        imageCount: 3,
      }

      const permissions = getImageManagementPermissions(
        asanaWithMaxImages,
        mockUserSession
      )

      expect(permissions).toEqual({
        canUpload: false, // limit reached
        canDelete: true,
        canReorder: true,
        canManage: true,
        isOwner: true,
        isUserCreated: true,
        maxImages: 3,
        currentCount: 3,
        remainingSlots: 0,
      })
    })

    it('should return no permissions for system asana', () => {
      const permissions = getImageManagementPermissions(
        mockSystemAsana,
        mockUserSession
      )

      expect(permissions).toEqual({
        canUpload: false,
        canDelete: false,
        canReorder: false,
        canManage: false,
        isOwner: false,
        isUserCreated: false,
        maxImages: 1, // system asanas limited to 1 image
        currentCount: 1,
        remainingSlots: 0,
      })
    })

    it('should return no permissions for non-owner', () => {
      const permissions = getImageManagementPermissions(
        mockUserCreatedAsana,
        mockOtherUserSession
      )

      expect(permissions).toEqual({
        canUpload: false,
        canDelete: false,
        canReorder: false,
        canManage: false,
        isOwner: false,
        isUserCreated: true,
        maxImages: 3,
        currentCount: 2,
        remainingSlots: 1,
      })
    })
  })

  describe('verifyMultipleImageOwnership', () => {
    it('should return true when user owns all images', async () => {
      mockPrisma.poseImage.findMany.mockResolvedValue([
        { id: 'image-1', userId: 'test-user-id' },
        { id: 'image-2', userId: 'test-user-id' },
      ])

      const result = await verifyMultipleImageOwnership(
        ['image-1', 'image-2'],
        'test-user-id'
      )

      expect(result).toBe(true)
    })

    it('should return false when user does not own all images', async () => {
      mockPrisma.poseImage.findMany.mockResolvedValue([
        { id: 'image-1', userId: 'test-user-id' },
        { id: 'image-2', userId: 'other-user-id' },
      ])

      const result = await verifyMultipleImageOwnership(
        ['image-1', 'image-2'],
        'test-user-id'
      )

      expect(result).toBe(false)
    })

    it('should return false when some images do not exist', async () => {
      mockPrisma.poseImage.findMany.mockResolvedValue([
        { id: 'image-1', userId: 'test-user-id' },
        // image-2 not found
      ])

      const result = await verifyMultipleImageOwnership(
        ['image-1', 'image-2'],
        'test-user-id'
      )

      expect(result).toBe(false)
    })

    it('should handle database errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockPrisma.poseImage.findMany.mockRejectedValue(
        new Error('Database error')
      )

      const result = await verifyMultipleImageOwnership(
        ['image-1'],
        'test-user-id'
      )

      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('canHaveMultipleImages', () => {
    it('should return true for user-created asana', () => {
      const result = canHaveMultipleImages(mockUserCreatedAsana)

      expect(result).toBe(true)
    })

    it('should return false for system asana', () => {
      const result = canHaveMultipleImages(mockSystemAsana)

      expect(result).toBe(false)
    })
  })

  describe('getNextDisplayOrder', () => {
    it('should return 1 for asana with no images', async () => {
      mockPrisma.poseImage.findMany.mockResolvedValue([])

      const result = await getNextDisplayOrder('asana-1')

      expect(result).toBe(1)
    })

    it('should return 2 when display order 1 is taken', async () => {
      mockPrisma.poseImage.findMany.mockResolvedValue([{ displayOrder: 1 }])

      const result = await getNextDisplayOrder('asana-1')

      expect(result).toBe(2)
    })

    it('should return 2 when display orders 1 and 3 are taken', async () => {
      mockPrisma.poseImage.findMany.mockResolvedValue([
        { displayOrder: 1 },
        { displayOrder: 3 },
      ])

      const result = await getNextDisplayOrder('asana-1')

      expect(result).toBe(2)
    })

    it('should throw error when all slots are taken', async () => {
      mockPrisma.poseImage.findMany.mockResolvedValue([
        { displayOrder: 1 },
        { displayOrder: 2 },
        { displayOrder: 3 },
      ])

      await expect(getNextDisplayOrder('asana-1')).rejects.toThrow(
        'No available display order slots'
      )
    })

    it('should handle database errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockPrisma.poseImage.findMany.mockRejectedValue(
        new Error('Database error')
      )

      await expect(getNextDisplayOrder('asana-1')).rejects.toThrow()
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('validateDisplayOrders', () => {
    it('should return true for valid unique orders', () => {
      expect(validateDisplayOrders([1, 2, 3])).toBe(true)
      expect(validateDisplayOrders([1])).toBe(true)
      expect(validateDisplayOrders([2, 1])).toBe(true)
    })

    it('should return false for duplicate orders', () => {
      expect(validateDisplayOrders([1, 1, 2])).toBe(false)
      expect(validateDisplayOrders([2, 2])).toBe(false)
    })

    it('should return false for out-of-range orders', () => {
      expect(validateDisplayOrders([0, 1, 2])).toBe(false)
      expect(validateDisplayOrders([1, 2, 4])).toBe(false)
      expect(validateDisplayOrders([-1])).toBe(false)
    })

    it('should return true for empty array', () => {
      expect(validateDisplayOrders([])).toBe(true)
    })
  })

  describe('Error Classes', () => {
    it('should create AsanaOwnershipError with code', () => {
      const error = new AsanaOwnershipError('Test message', 'UNAUTHORIZED')

      expect(error.message).toBe('Test message')
      expect(error.code).toBe('UNAUTHORIZED')
      expect(error.name).toBe('AsanaOwnershipError')
    })

    it('should create ImageLimitError with limit and current', () => {
      const error = new ImageLimitError('Limit exceeded', 3, 3)

      expect(error.message).toBe('Limit exceeded')
      expect(error.limit).toBe(3)
      expect(error.current).toBe(3)
      expect(error.name).toBe('ImageLimitError')
    })

    it('should create SystemAsanaError', () => {
      const error = new SystemAsanaError('Cannot modify system asana')

      expect(error.message).toBe('Cannot modify system asana')
      expect(error.name).toBe('SystemAsanaError')
    })
  })

  describe('Edge Cases', () => {
    it('should handle asana without created_by field', () => {
      const asanaWithoutCreator = {
        ...mockUserCreatedAsana,
        created_by: undefined,
      } as any

      const result = canManageImages(asanaWithoutCreator, mockUserSession)

      expect(result).toBe(false)
    })

    it('should handle session without user', () => {
      const invalidSession = {
        expires: '2025-12-31T23:59:59.999Z',
      } as any

      const result = canManageImages(mockUserCreatedAsana, invalidSession)

      expect(result).toBe(false)
    })

    it('should handle imageCount of zero', () => {
      const asanaWithNoImages = {
        ...mockUserCreatedAsana,
        imageCount: 0,
      }

      const permissions = getImageManagementPermissions(
        asanaWithNoImages,
        mockUserSession
      )

      expect(permissions.canDelete).toBe(false)
      expect(permissions.canReorder).toBe(false)
      expect(permissions.canUpload).toBe(true)
    })
  })
})
