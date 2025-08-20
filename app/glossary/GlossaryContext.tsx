'use client'
import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { defaultGlossaryTerms } from '../data/glossary-default'

export interface GlossaryTerm {
  term: string
  definition: string // alias of meaning for now (default terms use definition field)
  meaning?: string // future user field
  whyMatters?: string
  category?: string
  source?: 'default' | 'alpha_user' | 'user'
  sanskrit?: string
  pronunciation?: string
  readOnly?: boolean
}

interface GlossaryContextValue {
  defaultTerms: GlossaryTerm[]
  terms: GlossaryTerm[]
  loading: boolean
  error: string | null
  createTerm: (
    input: Omit<GlossaryTerm, 'source'> & { source?: GlossaryTerm['source'] }
  ) => Promise<void>
  updateTerm: (term: Partial<GlossaryTerm> & { term: string }) => Promise<void>
  deleteTerm: (term: string) => Promise<void>
}

const GlossaryContext = createContext<GlossaryContextValue | undefined>(
  undefined
)

export const GlossaryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Normalize default terms to GlossaryTerm shape
  const normalizedDefaults: GlossaryTerm[] = useMemo(
    () =>
      defaultGlossaryTerms.map((t) => ({
        term: t.term,
        definition: t.definition,
        meaning: t.definition,
        whyMatters: t.whyMatters,
        category: t.category,
        source: 'default',
        sanskrit: t.sanskrit,
        pronunciation: t.pronunciation,
        readOnly: true,
      })),
    []
  )

  const [terms, setTerms] = useState<GlossaryTerm[]>(normalizedDefaults)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch glossary terms from API and merge with defaults (avoid duplicates by term)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/glossary', { cache: 'no-store' })
        if (!res.ok) throw new Error(`Failed to fetch glossary (${res.status})`)
        const data = await res.json()
        // Map API data into GlossaryTerm shape (API uses meaning field)
        const apiTerms: GlossaryTerm[] = (data || []).map((t: any) => ({
          term: t.term,
          // Prefer meaning, fallback to definition - maintain alias
          definition: t.meaning || t.definition || '',
          meaning: t.meaning,
          whyMatters: t.whyMatters,
          category: t.category ?? undefined,
          source:
            (t.source?.toLowerCase?.() as GlossaryTerm['source']) || 'user',
          sanskrit: t.sanskrit ?? undefined,
          pronunciation: t.pronunciation ?? undefined,
          readOnly: !!t.readOnly,
        }))
        // Build map to avoid duplicate default terms if DB already seeded
        const map = new Map(apiTerms.map((t) => [t.term.toLowerCase(), t]))
        normalizedDefaults.forEach((d) => {
          if (!map.has(d.term.toLowerCase())) map.set(d.term.toLowerCase(), d)
        })
        if (!cancelled)
          setTerms(
            Array.from(map.values()).sort((a, b) =>
              a.term.localeCompare(b.term)
            )
          )
      } catch (e: any) {
        if (!cancelled) {
          console.warn(
            'GlossaryContext fetch fallback to defaults:',
            e?.message
          )
          setError(e?.message || 'Failed to load glossary')
          setTerms(normalizedDefaults) // fallback
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [normalizedDefaults])

  const createTerm = useCallback(
    async (
      input: Omit<GlossaryTerm, 'source'> & { source?: GlossaryTerm['source'] }
    ) => {
      try {
        const res = await fetch('/api/glossary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        })
        if (!res.ok) throw new Error(await res.text())
        const created = await res.json()
        setTerms((prev) =>
          [
            ...prev.filter(
              (t) => t.term.toLowerCase() !== created.term.toLowerCase()
            ),
            {
              term: created.term,
              definition: created.meaning,
              meaning: created.meaning,
              whyMatters: created.whyMatters,
              category: created.category,
              source:
                (created.source?.toLowerCase?.() as GlossaryTerm['source']) ||
                'user',
              sanskrit: created.sanskrit,
              pronunciation: created.pronunciation,
              readOnly: !!created.readOnly,
            },
          ].sort((a, b) => a.term.localeCompare(b.term))
        )
      } catch (e: any) {
        console.error('createTerm error', e)
        throw e
      }
    },
    []
  )

  const updateTerm = useCallback(
    async (input: Partial<GlossaryTerm> & { term: string }) => {
      try {
        const res = await fetch(
          `/api/glossary/${encodeURIComponent(input.term)}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
          }
        )
        if (!res.ok) throw new Error(await res.text())
        const updated = await res.json()
        setTerms((prev) =>
          prev.map((t) =>
            t.term.toLowerCase() === updated.term.toLowerCase()
              ? {
                  ...t,
                  ...updated,
                  readOnly: !!updated.readOnly,
                  definition:
                    updated.meaning || updated.definition || t.definition,
                }
              : t
          )
        )
      } catch (e: any) {
        console.error('updateTerm error', e)
        throw e
      }
    },
    []
  )

  const deleteTerm = useCallback(async (term: string) => {
    try {
      const res = await fetch(`/api/glossary/${encodeURIComponent(term)}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error(await res.text())
      setTerms((prev) =>
        prev.filter((t) => t.term.toLowerCase() !== term.toLowerCase())
      )
    } catch (e: any) {
      console.error('deleteTerm error', e)
      throw e
    }
  }, [])

  const value: GlossaryContextValue = {
    defaultTerms: normalizedDefaults,
    terms,
    loading,
    error,
    createTerm,
    updateTerm,
    deleteTerm,
  }

  return (
    <GlossaryContext.Provider value={value}>
      {children}
    </GlossaryContext.Provider>
  )
}

export const useGlossary = () => {
  const ctx = useContext(GlossaryContext)
  if (!ctx)
    throw new Error('useGlossary must be used within a GlossaryProvider')
  return ctx
}
