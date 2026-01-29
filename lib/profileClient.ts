import { logServiceError } from './errorLogger'

export interface FetchProfileParams {
  type?: 'asanas' | 'series' | 'sequences' | 'all'
  limit?: number
  cursor?: string | null
  mode?: 'infinite' | 'paged'
  page?: number | null
}

export async function fetchProfileLibrary(params: FetchProfileParams) {
  const {
    type = 'asanas',
    limit = 20,
    cursor = null,
    mode = 'infinite',
    page = null,
  } = params
  try {
    const qs = new URLSearchParams()
    qs.set('type', type)
    qs.set('limit', String(limit))
    if (cursor) qs.set('cursor', cursor)
    if (mode) qs.set('mode', mode)
    if (page) qs.set('page', String(page))

    const url = `/api/profile/library?${qs.toString()}`

    const resp = await fetch(url, {
      cache: 'no-store',
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })

    if (!resp.ok) {
      const txt = await resp.text().catch(() => '')
      throw new Error(txt || 'Failed to fetch profile library')
    }

    const data = await resp.json()
    return data
  } catch (error) {
    logServiceError(error, 'profileClient', 'fetchProfileLibrary', { params })
    throw error
  }
}

export default { fetchProfileLibrary }
