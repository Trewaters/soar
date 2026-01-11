import { NextRequest } from 'next/server'
import { GET, POST, DELETE } from '../../app/api/asanaActivity/route'
import {
  recordAsanaActivity,
  deleteAsanaActivity,
  checkExistingActivity,
  getUserAsanaHistory,
} from '../../lib/asanaActivityService'

jest.mock('../../lib/asanaActivityService')
jest.mock('../../lib/errorLogger')

describe('POST /api/asanaActivity - Cache-Control Headers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 201 status on successful creation', async () => {
    const mockActivity = {
      id: 'activity-1',
      userId: 'user-123',
      asanaId: 'pose-123',
      asanaName: 'Mountain Pose',
      sort_english_name: 'Mountain Pose',
      datePerformed: new Date('2026-01-10T14:00:00Z'),
      duration: 60,
      completionStatus: 'complete',
      difficulty: 'easy',
      notes: null,
      sensations: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(recordAsanaActivity as jest.Mock).mockResolvedValue(mockActivity)

    const request = new NextRequest('http://localhost:3000/api/asanaActivity', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-123',
        asanaId: 'pose-123',
        asanaName: 'Mountain Pose',
        duration: 60,
        completionStatus: 'complete',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(201)
  })

  it('should include Cache-Control: private, no-store, must-revalidate on POST', async () => {
    const mockActivity = {
      id: 'activity-1',
      userId: 'user-123',
      asanaId: 'pose-123',
      asanaName: 'Mountain Pose',
      sort_english_name: 'Mountain Pose',
      datePerformed: new Date(),
      duration: 60,
      completionStatus: 'complete',
      difficulty: null,
      notes: null,
      sensations: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(recordAsanaActivity as jest.Mock).mockResolvedValue(mockActivity)

    const request = new NextRequest('http://localhost:3000/api/asanaActivity', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-123',
        asanaId: 'pose-123',
        asanaName: 'Mountain Pose',
        duration: 60,
        completionStatus: 'complete',
      }),
    })

    const response = await POST(request)

    expect(response.headers.get('Cache-Control')).toBe(
      'private, no-store, must-revalidate'
    )
  })

  it('should include Pragma: no-cache on POST', async () => {
    const mockActivity = {
      id: 'activity-1',
      userId: 'user-123',
      asanaId: 'pose-123',
      asanaName: 'Mountain Pose',
      sort_english_name: 'Mountain Pose',
      datePerformed: new Date(),
      duration: 60,
      completionStatus: 'complete',
      difficulty: null,
      notes: null,
      sensations: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(recordAsanaActivity as jest.Mock).mockResolvedValue(mockActivity)

    const request = new NextRequest('http://localhost:3000/api/asanaActivity', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-123',
        asanaId: 'pose-123',
        asanaName: 'Mountain Pose',
        duration: 60,
        completionStatus: 'complete',
      }),
    })

    const response = await POST(request)

    expect(response.headers.get('Pragma')).toBe('no-cache')
  })

  it('should include Expires: 0 on POST', async () => {
    const mockActivity = {
      id: 'activity-1',
      userId: 'user-123',
      asanaId: 'pose-123',
      asanaName: 'Mountain Pose',
      sort_english_name: 'Mountain Pose',
      datePerformed: new Date(),
      duration: 60,
      completionStatus: 'complete',
      difficulty: null,
      notes: null,
      sensations: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(recordAsanaActivity as jest.Mock).mockResolvedValue(mockActivity)

    const request = new NextRequest('http://localhost:3000/api/asanaActivity', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-123',
        asanaId: 'pose-123',
        asanaName: 'Mountain Pose',
        duration: 60,
        completionStatus: 'complete',
      }),
    })

    const response = await POST(request)

    expect(response.headers.get('Expires')).toBe('0')
  })

  it('should return 400 when required fields are missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/asanaActivity', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-123',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('should return 500 on service error', async () => {
    ;(recordAsanaActivity as jest.Mock).mockRejectedValue(
      new Error('Database error')
    )

    const request = new NextRequest('http://localhost:3000/api/asanaActivity', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-123',
        asanaId: 'pose-123',
        asanaName: 'Mountain Pose',
        duration: 60,
        completionStatus: 'complete',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(500)
  })
})

describe('GET /api/asanaActivity - Cache-Control Headers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return all user activities with 200 status', async () => {
    const mockActivities = [
      {
        id: 'activity-1',
        userId: 'user-123',
        asanaId: 'pose-123',
        asanaName: 'Mountain Pose',
        sort_english_name: 'Mountain Pose',
        datePerformed: new Date(),
        duration: 60,
        completionStatus: 'complete',
        difficulty: 'easy',
        notes: null,
        sensations: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    ;(getUserAsanaHistory as jest.Mock).mockResolvedValue(mockActivities)

    const request = new NextRequest(
      'http://localhost:3000/api/asanaActivity?userId=user-123'
    )

    const response = await GET(request)
    expect(response.status).toBe(200)
  })

  it('should include Cache-Control: private, no-store, must-revalidate on GET', async () => {
    ;(getUserAsanaHistory as jest.Mock).mockResolvedValue([])

    const request = new NextRequest(
      'http://localhost:3000/api/asanaActivity?userId=user-123'
    )

    const response = await GET(request)

    expect(response.headers.get('Cache-Control')).toBe(
      'private, no-store, must-revalidate'
    )
  })

  it('should include Pragma: no-cache on GET', async () => {
    ;(getUserAsanaHistory as jest.Mock).mockResolvedValue([])

    const request = new NextRequest(
      'http://localhost:3000/api/asanaActivity?userId=user-123'
    )

    const response = await GET(request)

    expect(response.headers.get('Pragma')).toBe('no-cache')
  })

  it('should include Expires: 0 on GET', async () => {
    ;(getUserAsanaHistory as jest.Mock).mockResolvedValue([])

    const request = new NextRequest(
      'http://localhost:3000/api/asanaActivity?userId=user-123'
    )

    const response = await GET(request)

    expect(response.headers.get('Expires')).toBe('0')
  })

  it('should check specific activity existence with Cache-Control headers', async () => {
    ;(checkExistingActivity as jest.Mock).mockResolvedValue(null)

    const request = new NextRequest(
      'http://localhost:3000/api/asanaActivity?userId=user-123&asanaId=pose-123'
    )

    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('Cache-Control')).toBe(
      'private, no-store, must-revalidate'
    )
  })

  it('should return 400 when userId is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/asanaActivity')

    const response = await GET(request)
    expect(response.status).toBe(400)
  })

  it('should return 500 on service error', async () => {
    ;(getUserAsanaHistory as jest.Mock).mockRejectedValue(
      new Error('Database error')
    )

    const request = new NextRequest(
      'http://localhost:3000/api/asanaActivity?userId=user-123'
    )

    const response = await GET(request)
    expect(response.status).toBe(500)
  })
})

describe('DELETE /api/asanaActivity - Cache-Control Headers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should delete activity and return 200', async () => {
    ;(deleteAsanaActivity as jest.Mock).mockResolvedValue(undefined)

    const request = new NextRequest('http://localhost:3000/api/asanaActivity', {
      method: 'DELETE',
      body: JSON.stringify({
        userId: 'user-123',
        asanaId: 'pose-123',
      }),
    })

    const response = await DELETE(request)
    expect(response.status).toBe(200)
  })

  it('should return 400 when required fields are missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/asanaActivity', {
      method: 'DELETE',
      body: JSON.stringify({
        userId: 'user-123',
      }),
    })

    const response = await DELETE(request)
    expect(response.status).toBe(400)
  })

  it('should return 500 on service error', async () => {
    ;(deleteAsanaActivity as jest.Mock).mockRejectedValue(
      new Error('Database error')
    )

    const request = new NextRequest('http://localhost:3000/api/asanaActivity', {
      method: 'DELETE',
      body: JSON.stringify({
        userId: 'user-123',
        asanaId: 'pose-123',
      }),
    })

    const response = await DELETE(request)
    expect(response.status).toBe(500)
  })
})
