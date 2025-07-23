import { PrismaClient } from '../../../prisma/generated/client'
import { NextResponse } from 'next/server'

// Create a singleton instance with proper error handling
let prisma: PrismaClient | null = null

function getPrismaClient() {
  if (!prisma) {
    try {
      prisma = new PrismaClient({
        log: ['error', 'warn'],
        errorFormat: 'pretty',
      })
    } catch (error) {
      console.error('Failed to initialize Prisma client:', error)
      console.error('Database URL exists:', !!process.env.DATABASE_URL)
      console.error(
        'Database URL prefix:',
        process.env.DATABASE_URL?.substring(0, 20)
      )
      throw new Error('Database connection failed')
    }
  }
  return prisma
}

// Fallback glossary data for when database is unavailable
const fallbackGlossaryTerms = [
  {
    id: '1',
    term: 'Asana',
    meaning: 'A yoga pose or posture',
    whyMatters:
      'Asanas are the physical foundation of yoga practice, helping to build strength, flexibility, and mindfulness.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    term: 'Pranayama',
    meaning: 'Breath control or breathing exercises',
    whyMatters:
      'Pranayama helps regulate the nervous system, improve focus, and connect the mind and body.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    term: 'Meditation',
    meaning: 'A practice of focused attention and awareness',
    whyMatters:
      'Meditation cultivates mindfulness, reduces stress, and promotes mental clarity and emotional balance.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Force dynamic rendering to prevent static export
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const prismaClient = getPrismaClient()

    // Test connection first
    await prismaClient.$connect()

    // Use findRaw to work around datetime parsing issues
    const rawTerms = await prismaClient.glossaryTerm.findRaw({
      filter: {},
    })

    // Convert raw terms to proper format and sort by term
    const terms = (rawTerms as unknown as any[])
      .map((term: any) => ({
        id: term._id.$oid,
        term: term.term,
        meaning: term.meaning,
        whyMatters: term.whyMatters,
        // Fix datetime format by truncating microseconds to milliseconds
        createdAt: new Date(
          term.createdAt.replace(/\.(\d{6})Z$/, '.$1'.substring(0, 4) + 'Z')
        ).toISOString(),
        updatedAt: new Date(
          term.updatedAt.replace(/\.(\d{6})Z$/, '.$1'.substring(0, 4) + 'Z')
        ).toISOString(),
      }))
      .sort((a: any, b: any) => a.term.localeCompare(b.term))

    // Return empty array if no terms found (instead of null)
    return NextResponse.json(terms || [])
  } catch (error) {
    console.error('Error fetching glossary terms:', error)

    // Always return fallback data with 200 status to prevent frontend errors
    console.warn('Database error, returning fallback data')
    return NextResponse.json(fallbackGlossaryTerms, { status: 200 })
  } finally {
    // Disconnect to prevent connection leaks
    if (prisma) {
      try {
        await prisma.$disconnect()
      } catch (e) {
        console.error('Error disconnecting from database:', e)
      }
    }
  }
}
