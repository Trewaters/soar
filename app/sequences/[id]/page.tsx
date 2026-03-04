'use client'

import { useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

/**
 * Legacy route redirect.
 * The sequence detail and edit UI now lives entirely within
 * /sequences/practiceSequences?id=<id>[&edit=true][&view=<view>].
 * Any direct visits to /sequences/<id> are transparently redirected there.
 */
export default function SequenceDetailRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const edit = searchParams.get('edit')
    const view = searchParams.get('view')
    let url = `/sequences/practiceSequences?id=${id}`
    if (edit === 'true') url += '&edit=true'
    if (view) url += `&view=${encodeURIComponent(view)}`
    router.replace(url)
  }, [id, searchParams, router])

  return null
}
