/**
 * @jest-environment node
 */
describe('poseService.deletePose', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  afterEach(() => {
    global.fetch = originalFetch as any
  })

  it('calls DELETE /api/poses/:id and returns success', async () => {
    // Set up a mocked global.fetch before importing the actual implementation
    const mockResponse = { success: true }
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    }) as any

    // Import the actual implementation from the library (bypass any jest.mock in setup)
    const { deletePose } = jest.requireActual(
      '../../lib/poseService'
    ) as typeof import('../../lib/poseService')

    const result = await deletePose('pose-123')

    expect(global.fetch).toHaveBeenCalled()
    const callArgs = (global.fetch as jest.Mock).mock.calls[0]
    expect(callArgs[0]).toBe('/api/poses/pose-123')
    expect(callArgs[1].method).toBe('DELETE')
    expect(callArgs[1].headers).toEqual({ 'Cache-Control': 'no-cache' })
    // Note: fetchWithTimeout adds an AbortSignal, so we just verify it exists
    expect(callArgs[1].signal).toBeDefined()
    expect(result).toEqual({ success: true })
  })

  it('throws with server error message when response not ok', async () => {
    const { deletePose } = jest.requireActual(
      '../../lib/poseService'
    ) as typeof import('../../lib/poseService')

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({
        error: 'Unauthorized: You can only delete poses you created',
      }),
    }) as any

    await expect(deletePose('pose-123')).rejects.toThrow(
      'Failed to delete pose: Unauthorized: You can only delete poses you created'
    )
  })
})
