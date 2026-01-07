import cache from '@app/utils/offline/cache'
import db from '@app/utils/offline/db'

describe('offline cache helpers', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('set and get cache entry', async () => {
    await cache.setCache('foo', { a: 1 })
    const got = await cache.getCache('foo')
    expect(got).toEqual({ a: 1 })
  })

  it('remove cache entry', async () => {
    await cache.setCache('x', { x: true })
    await cache.removeCache('x')
    const v = await cache.getCache('x')
    expect(v).toBeNull()
  })

  it('purges old cache entries', async () => {
    // low-level write an old item
    await db.setKV('cache:old', {
      value: { old: true },
      ts: Date.now() - 1000 * 60 * 60,
    })
    await db.setKV('cache:recent', { value: { r: true }, ts: Date.now() })
    await cache.purgeCacheOlderThan(1000 * 60)
    const old = await cache.getCache('old')
    const recent = await cache.getCache('recent')
    expect(old).toBeNull()
    expect(recent).toEqual({ r: true })
  })
})
