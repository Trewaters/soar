// Minimal IndexedDB wrapper with localStorage fallback for hydration/cache needs.
// Keeps implementation small and test-friendly: if `indexedDB` is not available
// (e.g. in some test environments), we fall back to `localStorage`.

const DB_NAME = 'soar_offline_db'
const STORE_NAME = 'kv'
const DB_VERSION = 1

function supportsIndexedDB() {
  try {
    const ok = typeof indexedDB !== 'undefined' && indexedDB !== null
    if (!ok)
      console.debug(
        '[db] IndexedDB not available - will fallback to localStorage'
      )
    return ok
  } catch (e) {
    console.debug('[db] supportsIndexedDB check threw', e)
    return false
  }
}

function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!supportsIndexedDB()) {
      return reject(new Error('IndexedDB not supported'))
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

// eslint-disable-next-line no-unused-vars
async function withIDB<T>(fn: (db: IDBDatabase) => Promise<T>): Promise<T> {
  if (!supportsIndexedDB()) {
    return Promise.reject(new Error('IndexedDB not available'))
  }
  const db = await openIndexedDB()
  try {
    return await fn(db)
  } finally {
    db.close()
  }
}

export async function setKV(key: string, value: any): Promise<void> {
  if (!supportsIndexedDB()) {
    // fallback to localStorage
    try {
      localStorage.setItem(key, JSON.stringify(value))
      console.debug('[db] setKV using localStorage', { key })
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  return withIDB<void>(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const req = store.put(value, key)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })
  )
}

export async function getKV<T = any>(key: string): Promise<T | null> {
  if (!supportsIndexedDB()) {
    try {
      const raw = localStorage.getItem(key)
      console.debug('[db] getKV using localStorage', { key, found: !!raw })
      return raw ? (JSON.parse(raw) as T) : null
    } catch (e) {
      return Promise.reject(e)
    }
  }

  return withIDB<T | null>(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly')
        const store = tx.objectStore(STORE_NAME)
        const req = store.get(key)
        req.onsuccess = () => resolve(req.result ?? null)
        req.onerror = () => reject(req.error)
      })
  )
}

export async function delKV(key: string): Promise<void> {
  if (!supportsIndexedDB()) {
    localStorage.removeItem(key)
    return Promise.resolve()
  }

  return withIDB<void>(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const req = store.delete(key)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })
  )
}

export async function clearAll(): Promise<void> {
  if (!supportsIndexedDB()) {
    // clear only keys used by the app would be ideal; fallback to full clear
    localStorage.clear()
    return Promise.resolve()
  }

  return withIDB<void>(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const req = store.clear()
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })
  )
}

export async function keys(): Promise<string[]> {
  if (!supportsIndexedDB()) {
    const ks: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k) ks.push(k)
    }
    return ks
  }

  return withIDB<string[]>(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly')
        const store = tx.objectStore(STORE_NAME)
        const req = store.getAllKeys()
        req.onsuccess = () => resolve((req.result as string[]) || [])
        req.onerror = () => reject(req.error)
      })
  )
}

const db = {
  setKV,
  getKV,
  delKV,
  clearAll,
  keys,
}

export default db
