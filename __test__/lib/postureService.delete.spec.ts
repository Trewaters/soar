/**
 * @jest-environment node
 */
import { deletePosture } from '../../lib/postureService'

describe('postureService.deletePosture', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterEach(() => {
    global.fetch = originalFetch as any
  })

  it('calls DELETE /api/poses/:id and returns success', async () => {
    const mockResponse = { success: true }
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    }) as any

    const result = await deletePosture('pose-123')

    expect(global.fetch).toHaveBeenCalledWith('/api/poses/pose-123', {
      method: 'DELETE',
      headers: { 'Cache-Control': 'no-cache' },
    })
    expect(result).toEqual({ success: true })
  })

  it('throws with server error message when response not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({
        error: 'Unauthorized: You can only delete postures you created',
      }),
    }) as any

    await expect(deletePosture('pose-123')).rejects.toThrow(
      'Failed to delete posture: Unauthorized: You can only delete postures you created'
    )
  })
})
