'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import profileClient from '../../lib/profileClient'

type Item = any

export function useProfileLibrary(options?: {
  type?: 'asanas' | 'series' | 'sequences' | 'all'
  pageSize?: number
  mode?: 'infinite' | 'paged'
  initialPage?: number
}) {
  const {
    type = 'asanas',
    pageSize = 20,
    mode = 'infinite',
    initialPage = 1,
  } = options || {}
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState<string | null>(null)
  const [invalidCursor, setInvalidCursor] = useState(false)
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const [page, setPage] = useState<number>(initialPage)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    // initial load
    resetAndLoad()
    return () => {
      mounted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  const load = useCallback(
    async (opts?: { reset?: boolean; specificPage?: number }) => {
      if (loading) return
      setLoading(true)
      try {
        if (mode === 'paged') {
          const targetPage = opts?.specificPage ?? page
          const res = await profileClient.fetchProfileLibrary({
            type,
            limit: pageSize,
            mode: 'paged',
            page: targetPage,
          })
          if (res && (res as any).invalidCursor) {
            setInvalidCursor(true)
            // fall back to first page silently
            setPage(1)
            // replace items with first page
            const fallback = await profileClient.fetchProfileLibrary({
              type,
              limit: pageSize,
              mode: 'paged',
              page: 1,
            })
            if (!mounted.current) return
            setItems(Array.isArray(fallback.items) ? fallback.items : [])
            setHasMore(Boolean(fallback.hasMore))
            setCursor(fallback.nextCursor || null)
            setInvalidCursor(false)
            return
          }
          if (!mounted.current) return

          const newItems = Array.isArray(res.items) ? res.items : []
          setItems(newItems)
          setHasMore(Boolean(res.hasMore))
          setCursor(res.nextCursor || null)
          setPage(targetPage)
          if (typeof (res as any).totalCount === 'number') {
            setTotalCount((res as any).totalCount)
          }
        } else {
          const res = await profileClient.fetchProfileLibrary({
            type,
            limit: pageSize,
            cursor,
            mode: 'infinite',
          })
          if (res && (res as any).invalidCursor) {
            setInvalidCursor(true)
            // fallback: reset cursor and load first slice
            setCursor(null)
            const fallback = await profileClient.fetchProfileLibrary({
              type,
              limit: pageSize,
              mode: 'infinite',
            })
            if (!mounted.current) return
            const fallbackItems = Array.isArray(fallback.items)
              ? fallback.items
              : []
            setItems(
              opts?.reset ? fallbackItems : (prev) => prev.concat(fallbackItems)
            )
            setHasMore(Boolean(fallback.hasMore))
            setCursor(fallback.nextCursor || null)
            setInvalidCursor(false)
            return
          }
          if (!mounted.current) return

          const newItems = Array.isArray(res.items) ? res.items : []
          setItems((prev) => (opts?.reset ? newItems : prev.concat(newItems)))
          setHasMore(Boolean(res.hasMore))
          setCursor(res.nextCursor || null)
          if (typeof (res as any).totalCount === 'number') {
            setTotalCount((res as any).totalCount)
          }
        }
      } catch (err) {
        // swallow; caller can handle via UI toasts
        console.error('useProfileLibrary load error', err)
      } finally {
        if (mounted.current) setLoading(false)
      }
    },
    [type, pageSize, cursor, loading, mode, page]
  )

  const loadMore = useCallback(async () => {
    if (mode === 'paged') {
      const next = page + 1
      await load({ reset: false, specificPage: next })
    } else {
      const start = Date.now()
      await load({ reset: false })
      const duration = Date.now() - start
      try {
        // lightweight client telemetry
        const { trackClientEvent } = await import('../../lib/telemetry')
        trackClientEvent('library.load_more', {
          type,
          mode,
          page: undefined,
          limit: pageSize,
          duration_ms: duration,
        })
      } catch (e) {
        console.error('Failed to track client telemetry', e)
      }
    }
  }, [load, mode, page])

  const refresh = useCallback(async () => {
    setCursor(null)
    if (mode === 'paged') {
      setPage(1)
      await load({ reset: true, specificPage: 1 })
    } else {
      await load({ reset: true })
    }
  }, [load, mode])

  const resetAndLoad = useCallback(() => {
    setItems([])
    setCursor(null)
    setHasMore(true)
    if (mode === 'paged') setPage(initialPage)
    // fire-and-forget
    void load({
      reset: true,
      specificPage: mode === 'paged' ? initialPage : undefined,
    })
  }, [load, mode, initialPage])

  return {
    items,
    loading,
    hasMore,
    totalCount,
    loadMore,
    refresh,
    reset: resetAndLoad,
    cursor,
    // paged mode helpers
    page: mode === 'paged' ? page : undefined,
    setPage:
      mode === 'paged'
        ? async (p: number) => await load({ specificPage: p })
        : undefined,
  }
}

export default useProfileLibrary
