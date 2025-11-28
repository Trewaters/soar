import db from './db'

// Simple cache helpers that use the db layer. Keys should be app-scoped.
export async function setCache(key: string, value: any): Promise<void> {
  return db.setKV(`cache:${key}`, { value, ts: Date.now() })
}

export async function getCache<T = any>(key: string): Promise<T | null> {
  const item = await db.getKV<{ value: T; ts: number }>(`cache:${key}`)
  return item ? item.value : null
}

export async function removeCache(key: string): Promise<void> {
  return db.delKV(`cache:${key}`)
}

export async function purgeCacheOlderThan(ms: number): Promise<void> {
  const ks = await db.keys()
  const now = Date.now()
  const promises: Promise<void>[] = []
  for (const k of ks) {
    if (!k.startsWith('cache:')) continue
    promises.push(
      (async () => {
        const item = await db.getKV<{ value: any; ts: number }>(k)
        if (!item) return
        if (now - (item.ts ?? 0) > ms) {
          await db.delKV(k)
        }
      })()
    )
  }
  await Promise.all(promises)
}

export default {
  setCache,
  getCache,
  removeCache,
  purgeCacheOlderThan,
}
