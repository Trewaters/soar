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

    // Mock all fetch calls:
    // 1. POST /api/asanaActivity
    // 2. GET per-asana/day revalidation
    // 3. GET user list revalidation
    // 4. GET weekly summary revalidation
    // 5. GET checkActivityExists call
    ;(global as any).fetch
      .mockResolvedValueOnce({ ok: true, json: async () => postResult }) // POST
      .mockResolvedValueOnce({ ok: true, json: async () => ({ exists: true }) }) // per-asana revalidation
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // user list revalidation
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // weekly revalidation
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ exists: true, activity: postResult }),
      }) // checkActivityExists

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

    // Give the fire-and-forget revalidation async code time to execute
    await new Promise((resolve) => setTimeout(resolve, 50))
    // Also flush any pending microtasks (promises)
    await Promise.resolve()

    // First fetch was POST to /api/asanaActivity
    expect((global as any).fetch.mock.calls[0][0]).toBe('/api/asanaActivity')
    expect((global as any).fetch.mock.calls[0][1].method).toBe('POST')

    // Subsequent fetches should be revalidation GET requests with cache: 'no-store'
    // Check that at least one revalidation request was made
    let revalidationFound = false
    for (let i = 1; i < (global as any).fetch.mock.calls.length; i++) {
      const opts = (global as any).fetch.mock.calls[i][1]
      if (opts && opts.cache === 'no-store') {
        revalidationFound = true
        break
      }
    }
    expect(revalidationFound).toBe(true)

    // Service worker postMessage should be called with INVALIDATE_URLS
    const swController = (global as any).navigator.serviceWorker.controller
    expect(swController.postMessage).toHaveBeenCalled()
    const calledWith = swController.postMessage.mock.calls[0][0]
    expect(calledWith.command).toBe('INVALIDATE_URLS')
    expect(Array.isArray(calledWith.urls)).toBe(true)
    // Should invalidate at least 3 URLs (per-asana, user list, weekly)
    expect(calledWith.urls.length).toBeGreaterThanOrEqual(3)
  })
})
