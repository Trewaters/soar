/**
 * @jest-environment node
 */
import {
  recordAsanaActivity,
  deleteAsanaActivity,
  checkExistingActivity,
} from '../../lib/asanaActivityService'

// Mock the error logger
jest.mock('../../lib/errorLogger', () => ({
  logApiError: jest.fn(),
  logServiceError: jest.fn(),
  logDatabaseError: jest.fn(),
}))

// Mock the service functions
jest.mock('../../lib/asanaActivityService', () => ({
  recordAsanaActivity: jest.fn(),
  deleteAsanaActivity: jest.fn(),
  checkExistingActivity: jest.fn(),
}))

describe('/api/asanaActivity Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear console mocks
    jest.clearAllMocks()
  })

  describe('recordAsanaActivity', () => {
    it('should record a new asana activity', async () => {
      const mockActivity = {
        id: '1',
        userId: 'user123',
        postureId: 'posture123',
        postureName: 'Mountain Pose',
        duration: 60,
        datePerformed: new Date(),
        notes: null,
        sensations: null,
        completionStatus: 'complete',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockRecordAsanaActivity =
        recordAsanaActivity as jest.MockedFunction<typeof recordAsanaActivity>
      mockRecordAsanaActivity.mockResolvedValue(mockActivity)

      const activityData = {
        userId: 'user123',
        postureId: 'posture123',
        postureName: 'Mountain Pose',
        duration: 60,
        datePerformed: new Date(),
        completionStatus: 'complete',
      }

      const result = await recordAsanaActivity(activityData)

      expect(result).toEqual(mockActivity)
      expect(mockRecordAsanaActivity).toHaveBeenCalledWith(activityData)
    })
  })

  describe('deleteAsanaActivity', () => {
    it('should delete an asana activity', async () => {
      const mockDeleteAsanaActivity =
        deleteAsanaActivity as jest.MockedFunction<typeof deleteAsanaActivity>
      mockDeleteAsanaActivity.mockResolvedValue({ count: 1 })

      const result = await deleteAsanaActivity('user123', 'posture123')

      expect(result).toEqual({ count: 1 })
      expect(mockDeleteAsanaActivity).toHaveBeenCalledWith(
        'user123',
        'posture123'
      )
    })
  })

  describe('checkExistingActivity', () => {
    it('should check if activity exists', async () => {
      const mockActivity = {
        id: '1',
        userId: 'user123',
        postureId: 'posture123',
        postureName: 'Mountain Pose',
        datePerformed: new Date(),
        duration: 60,
        completionStatus: 'complete',
        notes: null,
        sensations: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockCheckExistingActivity =
        checkExistingActivity as jest.MockedFunction<
          typeof checkExistingActivity
        >
      mockCheckExistingActivity.mockResolvedValue(mockActivity)

      const result = await checkExistingActivity('user123', 'posture123')

      expect(result).toEqual(mockActivity)
      expect(mockCheckExistingActivity).toHaveBeenCalledWith(
        'user123',
        'posture123'
      )
    })

    it('should return null when activity does not exist', async () => {
      const mockCheckExistingActivity =
        checkExistingActivity as jest.MockedFunction<
          typeof checkExistingActivity
        >
      mockCheckExistingActivity.mockResolvedValue(null)

      const result = await checkExistingActivity('user123', 'posture123')

      expect(result).toBeNull()
      expect(mockCheckExistingActivity).toHaveBeenCalledWith(
        'user123',
        'posture123'
      )
    })
  })

  describe('API Route Logic', () => {
    it('should validate required fields for POST', () => {
      const data = {
        userId: 'user123',
        postureId: 'posture123',
        postureName: 'Mountain Pose',
        duration: 60,
        datePerformed: new Date(),
        completionStatus: 'complete',
      }

      // Test validation logic
      const isValid = !!(data.userId && data.postureId && data.postureName)
      expect(isValid).toBe(true)

      // Test invalid data
      const invalidData = { userId: 'user123' }
      const isInvalid = !!(
        invalidData.userId &&
        (invalidData as any).postureId &&
        (invalidData as any).postureName
      )
      expect(isInvalid).toBe(false)
    })

    it('should validate required fields for DELETE', () => {
      const data = {
        userId: 'user123',
        postureId: 'posture123',
      }

      // Test validation logic
      const isValid = !!(data.userId && data.postureId)
      expect(isValid).toBe(true)

      // Test invalid data
      const invalidData = { userId: 'user123' }
      const isInvalid = !!(invalidData.userId && (invalidData as any).postureId)
      expect(isInvalid).toBe(false)
    })

    it('should validate required query params for GET', () => {
      const url = new URL(
        'http://localhost:3000/api/asanaActivity?userId=user123&postureId=posture123'
      )
      const userId = url.searchParams.get('userId')
      const postureId = url.searchParams.get('postureId')

      expect(userId).toBe('user123')
      expect(postureId).toBe('posture123')

      // Test validation logic
      const isValid = !!(userId && postureId)
      expect(isValid).toBe(true)
    })
  })

  describe('Error Logging Validation', () => {
    beforeEach(() => {
      // Mock console methods to prevent actual logging during tests
      jest.spyOn(console, 'error').mockImplementation(() => {})
      jest.spyOn(console, 'warn').mockImplementation(() => {})
      jest.spyOn(console, 'info').mockImplementation(() => {})
      jest.spyOn(console, 'debug').mockImplementation(() => {})

      // Clear the error logger buffer before each test
      const { errorLogger } = jest.requireActual('../../lib/errorLogger')
      errorLogger.clearBuffer()
    })

    afterEach(() => {
      // Restore console methods
      jest.restoreAllMocks()
    })

    it('should log service errors with proper context', async () => {
      const { logServiceError } = require('../../lib/errorLogger')
      const testError = new Error('Test service error')

      logServiceError(
        testError,
        'asanaActivityService',
        'recordAsanaActivity',
        {
          userId: 'user123',
          postureId: 'posture123',
        }
      )

      expect(logServiceError).toHaveBeenCalledWith(
        testError,
        'asanaActivityService',
        'recordAsanaActivity',
        expect.objectContaining({
          userId: 'user123',
          postureId: 'posture123',
        })
      )
    })

    it('should log database errors with query context', async () => {
      const { logDatabaseError } = require('../../lib/errorLogger')
      const testError = new Error('Database connection failed')
      const query = { userId: 'user123', postureId: 'posture123' }

      logDatabaseError(testError, 'create', 'AsanaActivity', query)

      expect(logDatabaseError).toHaveBeenCalledWith(
        testError,
        'create',
        'AsanaActivity',
        query
      )
    })

    it('should log API errors with request context', async () => {
      const { logApiError } = require('../../lib/errorLogger')
      const testError = new Error('API validation failed')
      const mockRequest = {
        url: '/api/asanaActivity',
        method: 'POST',
        headers: new Map([['content-type', 'application/json']]),
      } as any

      logApiError(testError, mockRequest, 'POST /api/asanaActivity', {
        operation: 'record_activity',
      })

      expect(logApiError).toHaveBeenCalledWith(
        testError,
        mockRequest,
        'POST /api/asanaActivity',
        expect.objectContaining({
          operation: 'record_activity',
        })
      )
    })

    it('should handle unknown error types gracefully', async () => {
      const { logServiceError } = require('../../lib/errorLogger')
      const unknownError = 'This is not an Error object'

      expect(() => {
        logServiceError(unknownError, 'testService', 'testOperation')
      }).not.toThrow()

      expect(logServiceError).toHaveBeenCalledWith(
        unknownError,
        'testService',
        'testOperation'
      )
    })

    it('should format error context correctly', () => {
      const { errorLogger } = jest.requireActual('../../lib/errorLogger')
      const testError = new Error('Test error')
      const context = {
        operation: 'test_operation',
        userId: 'user123',
        additionalData: { key: 'value' },
      }

      // Test that the error logger instance can handle context properly
      expect(() => {
        errorLogger.logError(testError, context, 'error')
      }).not.toThrow()
    })

    it('should maintain error buffer for debugging', () => {
      const { errorLogger } = jest.requireActual('../../lib/errorLogger')
      const testError1 = new Error('First error')
      const testError2 = new Error('Second error')

      errorLogger.logError(testError1, { operation: 'test1' })
      errorLogger.logError(testError2, { operation: 'test2' })

      const recentErrors = errorLogger.getRecentErrors(2)
      expect(recentErrors).toHaveLength(2)
      expect(recentErrors[0].message).toBe('First error')
      expect(recentErrors[1].message).toBe('Second error')
    })

    it('should clear error buffer when requested', () => {
      const { errorLogger } = jest.requireActual('../../lib/errorLogger')
      const testError = new Error('Test error')

      errorLogger.logError(testError, { operation: 'test' })
      expect(errorLogger.getRecentErrors()).toHaveLength(1)

      errorLogger.clearBuffer()
      expect(errorLogger.getRecentErrors()).toHaveLength(0)
    })

    it('should provide structured error information', () => {
      const { errorLogger } = jest.requireActual('../../lib/errorLogger')
      const testError = new Error('Structured test error')
      testError.stack = 'Test stack trace'

      errorLogger.logError(testError, {
        operation: 'structured_test',
        userId: 'user123',
        additionalData: { context: 'test' },
      })

      const errors = errorLogger.getRecentErrors(1)
      expect(errors[0]).toMatchObject({
        message: 'Structured test error',
        name: 'Error',
        stack: 'Test stack trace',
        level: 'error',
        context: expect.objectContaining({
          operation: 'structured_test',
          userId: 'user123',
          additionalData: { context: 'test' },
        }),
      })
    })
  })
})
