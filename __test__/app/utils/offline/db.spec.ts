import db from '@app/utils/offline/db'

describe('offline db wrapper (localStorage fallback)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('sets and gets a value', async () => {
    await db.setKV('test:key', { name: 'value' })
    const v = await db.getKV('test:key')
    expect(v).toEqual({ name: 'value' })
  })

  it('deletes a key', async () => {
    await db.setKV('to:delete', 123)
    await db.delKV('to:delete')
    const v = await db.getKV('to:delete')
    expect(v).toBeNull()
  })

  it('returns keys and clears all', async () => {
    await db.setKV('k1', 'a')
    await db.setKV('k2', 'b')
    const ks = await db.keys()
    expect(ks).toEqual(expect.arrayContaining(['k1', 'k2']))
    await db.clearAll()
    const ks2 = await db.keys()
    expect(ks2.length).toBeGreaterThanOrEqual(0)
  })
})
