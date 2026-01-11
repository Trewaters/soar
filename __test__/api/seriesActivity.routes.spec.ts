import { NextRequest } from 'next/server'
import { GET, POST, DELETE } from '../../app/api/seriesActivity/route'
import {
  createSeriesActivity,
  deleteSeriesActivity,
  checkExistingSeriesActivity,
  getUserSeriesHistory,
} from '../../lib/seriesActivityService'

jest.mock('../../lib/seriesActivityService')
jest.mock('../../lib/errorLogger')

describe('POST /api/seriesActivity - Cache-Control Headers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 201 status on successful creation', async () => {
    const mockActivity = {
      id: 'series-activity-1',
      userId: 'user-123',
      seriesId: 'series-123',
      seriesName: 'Sun Salutation Series',
      datePerformed: new Date('2026-01-10T14:00:00Z'),
      duration: 120,
      completionStatus: 'complete',
      difficulty: 'easy',
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(createSeriesActivity as jest.Mock).mockResolvedValue(mockActivity)

    const request = new NextRequest(
      'http://localhost:3000/api/seriesActivity',
      {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user-123',
          seriesId: 'series-123',
          seriesName: 'Sun Salutation Series',
          duration: 120,
          completionStatus: 'complete',
        }),
      }
    )

    const response = await POST(request)
    expect(response.status).toBe(201)
  })

  it('should include Cache-Control: private, no-store, must-revalidate on POST', async () => {
    const mockActivity = {
      id: 'series-activity-1',
      userId: 'user-123',
      seriesId: 'series-123',
      seriesName: 'Sun Salutation Series',
      datePerformed: new Date(),
      duration: 120,
      completionStatus: 'complete',
      difficulty: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(createSeriesActivity as jest.Mock).mockResolvedValue(mockActivity)

    const request = new NextRequest(
      'http://localhost:3000/api/seriesActivity',
      {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user-123',
          seriesId: 'series-123',
          seriesName: 'Sun Salutation Series',
          duration: 120,
          completionStatus: 'complete',
        }),
      }
    )

    const response = await POST(request)

    expect(response.headers.get('Cache-Control')).toBe(
      'private, no-store, must-revalidate'
    )
  })

  it('should include Pragma: no-cache on POST', async () => {
    const mockActivity = {
      id: 'series-activity-1',
      userId: 'user-123',
      seriesId: 'series-123',
      seriesName: 'Sun Salutation Series',
      datePerformed: new Date(),
      duration: 120,
      completionStatus: 'complete',
      difficulty: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(createSeriesActivity as jest.Mock).mockResolvedValue(mockActivity)

    const request = new NextRequest(
      'http://localhost:3000/api/seriesActivity',
      {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user-123',
          seriesId: 'series-123',
          seriesName: 'Sun Salutation Series',
          duration: 120,
          completionStatus: 'complete',
        }),
      }
    )

    const response = await POST(request)

    expect(response.headers.get('Pragma')).toBe('no-cache')
  })

  it('should include Expires: 0 on POST', async () => {
    const mockActivity = {
      id: 'series-activity-1',
      userId: 'user-123',
      seriesId: 'series-123',
      seriesName: 'Sun Salutation Series',
      datePerformed: new Date(),
      duration: 120,
      completionStatus: 'complete',
      difficulty: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(createSeriesActivity as jest.Mock).mockResolvedValue(mockActivity)

    const request = new NextRequest(
      'http://localhost:3000/api/seriesActivity',
      {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user-123',
          seriesId: 'series-123',
          seriesName: 'Sun Salutation Series',
          duration: 120,
          completionStatus: 'complete',
        }),
      }
    )

    const response = await POST(request)

    expect(response.headers.get('Expires')).toBe('0')
  })

  it('should return 400 when required fields are missing', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/seriesActivity',
      {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user-123',
        }),
      }
    )

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('should return 500 on service error', async () => {
    ;(createSeriesActivity as jest.Mock).mockRejectedValue(
      new Error('Database error')
    )

    const request = new NextRequest(
      'http://localhost:3000/api/seriesActivity',
      {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user-123',
          seriesId: 'series-123',
          seriesName: 'Sun Salutation Series',
          duration: 120,
          completionStatus: 'complete',
        }),
      }
    )

    const response = await POST(request)
    expect(response.status).toBe(500)
  })
})

describe('GET /api/seriesActivity - Cache-Control Headers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return all user activities with 200 status', async () => {
    const mockActivities = [
      {
        id: 'series-activity-1',
        userId: 'user-123',
        seriesId: 'series-123',
        seriesName: 'Sun Salutation Series',
        datePerformed: new Date(),
        duration: 120,
        completionStatus: 'complete',
        difficulty: 'easy',
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    ;(getUserSeriesHistory as jest.Mock).mockResolvedValue(mockActivities)

    const request = new NextRequest(
      'http://localhost:3000/api/seriesActivity?userId=user-123'
    )

    const response = await GET(request)
    expect(response.status).toBe(200)
  })

  it('should include Cache-Control: private, no-store, must-revalidate on GET', async () => {
    ;(getUserSeriesHistory as jest.Mock).mockResolvedValue([])

    const request = new NextRequest(
      'http://localhost:3000/api/seriesActivity?userId=user-123'
    )

    const response = await GET(request)

    expect(response.headers.get('Cache-Control')).toBe(
      'private, no-store, must-revalidate'
    )
  })

  it('should include Pragma: no-cache on GET', async () => {
    ;(getUserSeriesHistory as jest.Mock).mockResolvedValue([])

    const request = new NextRequest(
      'http://localhost:3000/api/seriesActivity?userId=user-123'
    )

    const response = await GET(request)

    expect(response.headers.get('Pragma')).toBe('no-cache')
  })

  it('should include Expires: 0 on GET', async () => {
    ;(getUserSeriesHistory as jest.Mock).mockResolvedValue([])

    const request = new NextRequest(
      'http://localhost:3000/api/seriesActivity?userId=user-123'
    )

    const response = await GET(request)

    expect(response.headers.get('Expires')).toBe('0')
  })

  it('should check specific activity existence with Cache-Control headers', async () => {
    ;(checkExistingSeriesActivity as jest.Mock).mockResolvedValue(null)

    const request = new NextRequest(
      'http://localhost:3000/api/seriesActivity?userId=user-123&seriesId=series-123'
    )

    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('Cache-Control')).toBe(
      'private, no-store, must-revalidate'
    )
  })

  it('should return 400 when userId is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/seriesActivity')

    const response = await GET(request)
    expect(response.status).toBe(400)
  })

  it('should return 500 on service error', async () => {
    ;(getUserSeriesHistory as jest.Mock).mockRejectedValue(
      new Error('Database error')
    )

    const request = new NextRequest(
      'http://localhost:3000/api/seriesActivity?userId=user-123'
    )

    const response = await GET(request)
    expect(response.status).toBe(500)
  })
})

describe('DELETE /api/seriesActivity - Cache-Control Headers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should delete activity and return 200', async () => {
    ;(deleteSeriesActivity as jest.Mock).mockResolvedValue(undefined)

    const request = new NextRequest(
      'http://localhost:3000/api/seriesActivity',
      {
        method: 'DELETE',
        body: JSON.stringify({
          userId: 'user-123',
          seriesId: 'series-123',
        }),
      }
    )

    const response = await DELETE(request)
    expect(response.status).toBe(200)
  })

  it('should return 400 when required fields are missing', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/seriesActivity',
      {
        method: 'DELETE',
        body: JSON.stringify({
          userId: 'user-123',
        }),
      }
    )

    const response = await DELETE(request)
    expect(response.status).toBe(400)
  })

  it('should return 500 on service error', async () => {
    ;(deleteSeriesActivity as jest.Mock).mockRejectedValue(
      new Error('Database error')
    )

    const request = new NextRequest(
      'http://localhost:3000/api/seriesActivity',
      {
        method: 'DELETE',
        body: JSON.stringify({
          userId: 'user-123',
          seriesId: 'series-123',
        }),
      }
    )

    const response = await DELETE(request)
    expect(response.status).toBe(500)
  })
})
