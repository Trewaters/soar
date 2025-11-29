const { createAsanaActivity } = require('../../lib/asanaActivityClientService')

describe('asanaActivityClientService', () => {
  const originalNavigator = (global as any).navigator
  const originalFetch = (global as any).fetch

  beforeEach(() => {
    jest.resetModules()
    // mock fetch
    ;(global as any).fetch = jest.fn()

    // Provide a navigator.serviceWorker mock
    ;(global as any).navigator = {
      ...(originalNavigator || {}),
      serviceWorker: {
        controller: { postMessage: jest.fn() },
        ready: Promise.resolve({ active: { postMessage: jest.fn() } }),
      },
    }
  })

  afterEach(() => {
    // restore
    ;(global as any).fetch = originalFetch
    ;(global as any).navigator = originalNavigator
  })

  it('posts activity then revalidates cache and notifies service worker', async () => {
    const postResult = { id: 'a1' }

    // Mock POST response (first fetch call)
    ;(global as any).fetch
      .mockResolvedValueOnce({ ok: true, json: async () => postResult })
      // Mock revalidation GET (second fetch call)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ exists: true }) })

    const input = {
      userId: 'user123',
      asanaId: 'pose123',
      asanaName: 'Pose',
      sort_english_name: 'Pose',
      duration: 0,
      datePerformed: new Date(),
      completionStatus: 'complete',
    }

    const res = await createAsanaActivity(input)
    expect(res).toEqual(postResult)

    // First fetch was POST to /api/asanaActivity
    expect((global as any).fetch.mock.calls[0][0]).toBe('/api/asanaActivity')
    expect((global as any).fetch.mock.calls[0][1].method).toBe('POST')

    // Second fetch was a GET revalidation with cache: 'no-store'
    const secondCallOpts = (global as any).fetch.mock.calls[1][1]
    expect(secondCallOpts).toBeDefined()
    expect(secondCallOpts.cache).toBe('no-store')

    // Service worker postMessage should be called
    const swController = (global as any).navigator.serviceWorker.controller
    expect(swController.postMessage).toHaveBeenCalled()
    const calledWith = swController.postMessage.mock.calls[0][0]
    expect(calledWith.command).toBe('INVALIDATE_URLS')
    expect(Array.isArray(calledWith.urls)).toBe(true)
    expect(calledWith.urls.length).toBeGreaterThan(0)
  })
})
