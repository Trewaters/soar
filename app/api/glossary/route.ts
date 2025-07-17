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

    const terms = await prismaClient.glossaryTerm.findMany({
      orderBy: { term: 'asc' },
    })

    // Return empty array if no terms found (instead of null)
    return NextResponse.json(terms || [])
  } catch (error) {
    console.error('Error fetching glossary terms:', error)

    // Return a more specific error response
    if (error instanceof Error) {
      if (
        error.message.includes('timeout') ||
        error.message.includes('No available servers')
      ) {
        console.warn('Database connection timeout, returning fallback data')
        return NextResponse.json(fallbackGlossaryTerms, { status: 200 })
      }
    }

    // Return fallback data for any other database errors
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
