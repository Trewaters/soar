import { PrismaClient } from '../../../../prisma/generated/client'
import { NextRequest, NextResponse } from 'next/server'
import { logApiError } from '../../../../lib/errorLogger'

// Initialize Prisma client with error handling
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

export async function GET(req: NextRequest) {
  console.log('=== GET /api/user/loginStreak called ===')

  // Check environment configuration
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.MONGODB_URI_v2 ||
    process.env.MONGODB_URI
  console.log('Database configuration check:', {
    hasDataBaseUrl: !!process.env.DATABASE_URL,
    hasMongoDbUri_v2: !!process.env.MONGODB_URI_v2,
    hasMongoDbUri: !!process.env.MONGODB_URI,
    nodeEnv: process.env.NODE_ENV,
    dbUrlStart: dbUrl ? dbUrl.substring(0, 20) + '...' : 'undefined',
  })

  if (!dbUrl) {
    const configError = new Error(
      'Database configuration missing: No DATABASE_URL, MONGODB_URI_v2 or MONGODB_URI found'
    )
    logApiError(configError, req, 'GET /api/user/loginStreak - configuration', {
      env: process.env.NODE_ENV,
      availableVars: Object.keys(process.env).filter((key) =>
        key.includes('MONGODB')
      ),
    })
    return NextResponse.json(
      {
        error: 'Database configuration error',
        details: 'Database connection not configured',
      },
      { status: 500 }
    )
  }

  let client: PrismaClient | null = null
  try {
    client = getPrismaClient()

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    console.log('Received userId:', userId)

    if (!userId) {
      const validationError = new Error(
        'Missing required query parameter: userId'
      )
      logApiError(
        validationError,
        req,
        'GET /api/user/loginStreak - validation',
        {
          queryParams: { userId },
          url: req.url,
        }
      )
      return NextResponse.json(
        {
          error: 'Missing required query parameter: userId',
        },
        { status: 400 }
      )
    }

    // Test database connection
    try {
      await client.$connect()
      console.log('Database connection successful')
    } catch (dbError) {
      console.error('Database connection failed:', dbError)
      throw new Error(
        `Database connection failed: ${
          dbError instanceof Error ? dbError.message : 'Unknown error'
        }`
      )
    }

    // Verify user exists
    const user = await client.userData.findUnique({
      where: { id: userId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate login streak using UserLogin table
    console.log('About to calculate login streak for userId:', userId)
    const streakData = await calculateLoginStreak(userId, client)
    console.log('Calculated streak data:', streakData)

    return NextResponse.json(streakData, { status: 200 })
  } catch (error) {
    logApiError(error, req, 'GET /api/user/loginStreak', {
      operation: 'calculate_login_streak',
    })
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to calculate login streak',
      },
      { status: 500 }
    )
  } finally {
    if (client) {
      await client.$disconnect()
    }
  }
}

async function calculateLoginStreak(
  userId: string,
  prismaClient: PrismaClient
) {
  console.log('=== calculateLoginStreak called with userId:', userId)
  try {
    // Get user's login events ordered by date (most recent first)
    const loginEvents = await prismaClient.userLogin.findMany({
      where: { userId },
      orderBy: { loginDate: 'desc' },
      select: {
        loginDate: true,
      },
    })
    console.log('Login events:', loginEvents)

    if (loginEvents.length === 0) {
      // No login events found
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastLoginDate: null,
        isActiveToday: false,
      }
    }

    // Get unique login dates (ignore multiple logins on same day)
    const uniqueDates = Array.from(
      new Set(
        loginEvents.map((login) => {
          const date = new Date(login.loginDate)
          // Normalize to start of day for consistent comparison
          return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          ).getTime()
        })
      )
    ).sort((a, b) => b - a) // Sort descending (most recent first)

    const today = new Date()
    const todayTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime()
    const yesterdayTime = todayTime - 24 * 60 * 60 * 1000

    // Check if user logged in today
    const isActiveToday = uniqueDates.length > 0 && uniqueDates[0] === todayTime

    // Calculate current streak
    let currentStreak = 0
    let expectedDate = isActiveToday ? todayTime : yesterdayTime

    for (const loginDate of uniqueDates) {
      if (loginDate === expectedDate) {
        currentStreak++
        expectedDate -= 24 * 60 * 60 * 1000 // Move to previous day
      } else if (loginDate < expectedDate) {
        // Gap found, stop counting current streak
        break
      }
      // If loginDate > expectedDate, skip this date (shouldn't happen with proper sorting)
    }

    // Calculate longest streak
    let longestStreak = 0
    let tempStreak = 1

    if (uniqueDates.length > 0) {
      longestStreak = 1 // At least one login

      for (let i = 1; i < uniqueDates.length; i++) {
        const currentDate = uniqueDates[i]
        const prevDate = uniqueDates[i - 1]
        const daysDiff = (prevDate - currentDate) / (24 * 60 * 60 * 1000)

        if (daysDiff === 1) {
          // Consecutive days
          tempStreak++
          longestStreak = Math.max(longestStreak, tempStreak)
        } else {
          // Gap in days, reset temp streak
          tempStreak = 1
        }
      }
    }

    // Get the most recent login date for return
    const lastLoginDate =
      loginEvents.length > 0 ? loginEvents[0].loginDate.toISOString() : null

    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      lastLoginDate,
      isActiveToday,
    }
  } catch (error) {
    console.error('Error calculating login streak:', error)
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastLoginDate: null,
      isActiveToday: false,
    }
  }
}
