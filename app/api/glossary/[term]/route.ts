import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '../../../../app/lib/prismaClient'
import getAlphaUserIds from '@app/lib/alphaUsers'

// use shared prisma client

function canEdit(source: string | undefined) {
  // DEFAULT terms are read-only
  return source !== 'DEFAULT'
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ term: string }> }
) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userEmail = session.user.email
  const body = await req.json()
  const resolvedParams = await params
  const targetTerm = decodeURIComponent(resolvedParams.term)

  // Backend validation for update data
  const meaning = (body.meaning || '').trim()
  const whyMatters = (body.whyMatters || '').trim()
  const category = (body.category || '').trim()
  const sanskrit = (body.sanskrit || '').trim()
  const pronunciation = (body.pronunciation || '').trim()

  if (meaning && meaning.length > 1000) {
    return NextResponse.json(
      { error: 'Definition must be 1000 characters or less' },
      { status: 400 }
    )
  }
  if (whyMatters && whyMatters.length > 500) {
    return NextResponse.json(
      { error: 'Why it matters must be 500 characters or less' },
      { status: 400 }
    )
  }
  if (category && category.length > 50) {
    return NextResponse.json(
      { error: 'Category must be 50 characters or less' },
      { status: 400 }
    )
  }
  if (sanskrit && sanskrit.length > 100) {
    return NextResponse.json(
      { error: 'Sanskrit term must be 100 characters or less' },
      { status: 400 }
    )
  }
  if (pronunciation && pronunciation.length > 150) {
    return NextResponse.json(
      { error: 'Pronunciation guide must be 150 characters or less' },
      { status: 400 }
    )
  }

  try {
    const existing = await prisma.glossaryTerm.findUnique({
      where: { term: targetTerm },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (!canEdit(existing.source)) {
      return NextResponse.json({ error: 'Term is read-only' }, { status: 403 })
    }
    // Ownership / alpha check
    const alphaSet = new Set(
      getAlphaUserIds().map((e: string) => e.toLowerCase())
    )
    if (
      existing.source === 'ALPHA_USER' &&
      !alphaSet.has(userEmail.toLowerCase()) &&
      existing.userId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updated = await prisma.glossaryTerm.update({
      where: { term: targetTerm },
      data: {
        meaning: meaning || existing.meaning,
        whyMatters: whyMatters || existing.whyMatters,
        category: category || existing.category,
        sanskrit: sanskrit || existing.sanskrit,
        pronunciation: pronunciation || existing.pronunciation,
      },
    })

    return NextResponse.json(updated)
  } catch (e: any) {
    console.error('PATCH glossary error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ term: string }> }
) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const resolvedParams = await params
  const targetTerm = decodeURIComponent(resolvedParams.term)

  try {
    const existing = await prisma.glossaryTerm.findUnique({
      where: { term: targetTerm },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (!canEdit(existing.source)) {
      return NextResponse.json({ error: 'Term is read-only' }, { status: 403 })
    }
    // Ownership enforcement
    if (existing.userId && existing.userId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.glossaryTerm.delete({ where: { term: targetTerm } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('DELETE glossary error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
