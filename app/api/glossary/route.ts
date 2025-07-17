import { PrismaClient } from '../../../prisma/generated/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// Force dynamic rendering to prevent static export
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const terms = await prisma.glossaryTerm.findMany({
      orderBy: { term: 'asc' },
    })
    return NextResponse.json(terms)
  } catch (error) {
    console.error('Error fetching glossary terms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch glossary terms' },
      { status: 500 }
    )
  }
}
