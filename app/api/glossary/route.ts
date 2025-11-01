import { prisma } from '../../lib/prismaClient'
import { NextResponse } from 'next/server'

// Use shared cached Prisma client (created in app/lib/prismaClient)

// Lightweight fallback when DB unreachable (subset of default bundled terms)
const fallbackGlossaryTerms = [
  {
    id: 'fallback-1',
    term: 'Asana',
    meaning: 'A yoga pose or pose',
    whyMatters:
      'Asanas are the physical foundation of yoga practice, helping to build strength, flexibility, and mindfulness.',
    category: 'foundational',
    sanskrit: 'Āsana',
    pronunciation: 'AH-suh-nuh',
    source: 'DEFAULT',
    readOnly: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Force dynamic rendering to prevent static export
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const terms = await prisma.glossaryTerm.findMany({
      orderBy: { term: 'asc' },
    })

    return NextResponse.json(
      terms.map((t: any) => ({
        id: t.id,
        term: t.term,
        meaning: t.meaning,
        whyMatters: t.whyMatters,
        category: t.category,
        sanskrit: t.sanskrit,
        pronunciation: t.pronunciation,
        source: t.source,
        readOnly: t.readOnly,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      }))
    )
  } catch (error) {
    console.error('Error fetching glossary terms:', error)

    // Always return fallback data with 200 status to prevent frontend errors
    return NextResponse.json(fallbackGlossaryTerms, { status: 200 })
  } finally {
    // Intentionally keep connection open in serverless-friendly pattern
  }
}

export async function POST(req: Request) {
  const { auth } = await import('../../../auth')
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    // Use shared prisma client
    const body = await req.json()

    // Backend validation
    const term = (body.term || '').trim()
    const meaning = (body.meaning || body.definition || '').trim()
    const whyMatters = (body.whyMatters || '').trim()
    const category = (body.category || '').trim()
    const sanskrit = (body.sanskrit || '').trim()
    const pronunciation = (body.pronunciation || '').trim()

    if (!term) {
      return NextResponse.json(
        { error: 'Term name is required' },
        { status: 400 }
      )
    }
    if (term.length > 100) {
      return NextResponse.json(
        { error: 'Term name must be 100 characters or less' },
        { status: 400 }
      )
    }
    if (!meaning) {
      return NextResponse.json(
        { error: 'Definition/meaning is required' },
        { status: 400 }
      )
    }
    if (meaning.length > 1000) {
      return NextResponse.json(
        { error: 'Definition must be 1000 characters or less' },
        { status: 400 }
      )
    }
    if (whyMatters.length > 500) {
      return NextResponse.json(
        { error: 'Why it matters must be 500 characters or less' },
        { status: 400 }
      )
    }
    if (category.length > 50) {
      return NextResponse.json(
        { error: 'Category must be 50 characters or less' },
        { status: 400 }
      )
    }
    if (sanskrit.length > 100) {
      return NextResponse.json(
        { error: 'Sanskrit term must be 100 characters or less' },
        { status: 400 }
      )
    }
    if (pronunciation.length > 150) {
      return NextResponse.json(
        { error: 'Pronunciation guide must be 150 characters or less' },
        { status: 400 }
      )
    }

    // Check for duplicate terms
    const existing = await prisma.glossaryTerm.findUnique({
      where: { term },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'A term with this name already exists' },
        { status: 409 }
      )
    }

    // Determine source (alpha vs user)
    const { default: getAlphaUserIds } = await import('../../lib/alphaUsers')
    const alphaSet = new Set(
      getAlphaUserIds().map((e: string) => e.toLowerCase())
    )
    const source = alphaSet.has(session.user.email.toLowerCase())
      ? 'ALPHA_USER'
      : 'USER'

    const created = await prisma.glossaryTerm.create({
      data: {
        term,
        meaning,
        whyMatters: whyMatters || null,
        category: category || null,
        sanskrit: sanskrit || null,
        pronunciation: pronunciation || null,
        source,
        userId: (session.user as any).id || null,
        readOnly: false,
      },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Create glossary term error', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
