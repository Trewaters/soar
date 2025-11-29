let createAsanaActivity: any = null

describe('asanaActivityClientService', () => {
  const originalNavigator = (global as any).navigator
  const originalFetch = (global as any).fetch
  const originalLocation = (global as any).location

  beforeEach(() => {
    jest.resetModules()
    // mock fetch
    ;(global as any).fetch = jest.fn()

    // Ensure location.href exists for URL resolution in test environment
    ;(global as any).location = { href: 'http://localhost' }

    // Provide a navigator.serviceWorker mock by attaching to the existing
    // JSDOM Navigator object rather than replacing it (which can produce
    // a plain object and lose prototype methods).
    ;(global as any).navigator = originalNavigator || (global as any).navigator
    ;(global as any).navigator.serviceWorker = {
      controller: { postMessage: jest.fn() },
      ready: Promise.resolve({ active: { postMessage: jest.fn() } }),
    }

    // Ensure any automatic test setup mocks for this module are removed
    // so we can exercise the real client implementation in this unit test.
    try {
      jest.unmock('@lib/asanaActivityClientService')
    } catch (e) {
      // ignore if unmapped
    }

    // Require the actual implementation after unmocking so we get the
    // real exported function names (not test setup mocks).
    // Use requireActual to bypass any remaining mock registry entries.
    // eslint-disable-next-line global-require
    const mod = jest.requireActual('../../lib/asanaActivityClientService')
    // Debug: log module shape when running in CI/test to help diagnose
    // export resolution issues. Remove if noisy after debugging.
    // eslint-disable-next-line no-console
    console.log('DEBUG asanaActivityClientService module:', Object.keys(mod))
    createAsanaActivity = mod.createAsanaActivity
    if (!createAsanaActivity && mod && mod.default) {
      if (typeof mod.default === 'function') {
        createAsanaActivity = mod.default
      } else {
        createAsanaActivity = mod.default.createAsanaActivity
      }
    }
  })

  afterEach(() => {
    // restore
    ;(global as any).fetch = originalFetch
    ;(global as any).navigator = originalNavigator
    ;(global as any).location = originalLocation
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
    // Debug: ensure navigator shape is visible in test
    // eslint-disable-next-line no-console
    console.log('DEBUG navigator in assertion:', (global as any).navigator)
    const swController = (global as any).navigator.serviceWorker.controller
    expect(swController.postMessage).toHaveBeenCalled()
    const calledWith = swController.postMessage.mock.calls[0][0]
    expect(calledWith.command).toBe('INVALIDATE_URLS')
    expect(Array.isArray(calledWith.urls)).toBe(true)
    expect(calledWith.urls.length).toBeGreaterThan(0)
  })
})
