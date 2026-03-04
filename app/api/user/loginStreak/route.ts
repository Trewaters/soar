import { prisma } from '../../../../app/lib/prismaClient'
import { NextRequest, NextResponse } from 'next/server'
import { logApiError } from '../../../../lib/errorLogger'
import { randomUUID } from 'crypto'

// Force this route to be dynamic since it requires query parameters
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const requestId = randomUUID()
  const timestamp = new Date().toISOString()
  const isProduction = process.env.NODE_ENV === 'production'
  const deployment = process.env.VERCEL_ENV || 'local'

  // Enhanced environment configuration check
  const dbUrl = process.env.DATABASE_URL
  const envVars = Object.keys(process.env).filter(
    (key) =>
      key.includes('MONGODB') ||
      key.includes('DATABASE') ||
      key.includes('DB') ||
      key.includes('PRISMA') ||
      key.includes('VERCEL')
  )
  const envConfig = {
    hasDataBaseUrl: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    dbUrlStart: dbUrl ? dbUrl.substring(0, 30) + '...' : 'undefined',
    dbProvider: dbUrl?.includes('mongodb')
      ? 'MongoDB'
      : dbUrl?.includes('postgres')
        ? 'PostgreSQL'
        : dbUrl?.includes('sqlite')
          ? 'SQLite'
          : 'Unknown',
    dbProtocol: dbUrl?.split('://')[0] || 'none',
    hasAtlasCluster: dbUrl?.includes('mongodb.net') || false,
    availableEnvVars: envVars,
    totalEnvVarsCount: Object.keys(process.env).length,
    region: process.env.VERCEL_REGION || 'unknown',
    functionId:
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.VERCEL_FUNCTION_PAYLOAD_ID ||
      'unknown',
  }

  if (!dbUrl) {
    const configError = new Error(
      'Database configuration missing: No DATABASE_URL found'
    )
    logApiError(configError, req, 'GET /api/user/loginStreak - configuration', {
      requestId,
      env: process.env.NODE_ENV,
      deployment,
      availableVars: envVars,
      envConfig,
      debugInfo: {
        totalEnvVars: Object.keys(process.env).length,
        someEnvKeys: Object.keys(process.env).slice(0, 10),
      },
    })
    return NextResponse.json(
      {
        error: 'Database configuration error',
        details: 'Database connection not configured',
        requestId,
        timestamp,
        debugInfo: isProduction ? undefined : { envVars, envConfig },
      },
      { status: 500 }
    )
  }

  try {
    // use shared prisma client

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      const validationError = new Error(
        'Missing required query parameter: userId'
      )
      logApiError(
        validationError,
        req,
        'GET /api/user/loginStreak - validation',
        {
          requestId,
          queryParams: { userId },
          url: req.url,
          timestamp,
        }
      )
      return NextResponse.json(
        {
          error: 'Missing required query parameter: userId',
          requestId,
          timestamp,
        },
        { status: 400 }
      )
    }

    // Enhanced database connection testing
    try {
      // attempt a lightweight connect check using shared client
      await prisma.$connect()
    } catch (dbError) {
      const detailedError = {
        requestId,
        userId,
        error: dbError,
        errorMessage:
          dbError instanceof Error ? dbError.message : String(dbError),
        errorStack: dbError instanceof Error ? dbError.stack : undefined,
        errorName: dbError instanceof Error ? dbError.name : 'UnknownError',
        timestamp,
        envConfig,
        dbDiagnostics: {
          canParseDatabaseUrl: !!dbUrl,
          urlLength: dbUrl?.length || 0,
          hasCredentials: dbUrl?.includes('@') || false,
          hasDatabase: dbUrl?.includes('/') && dbUrl.split('/').length > 3,
          urlPattern: dbUrl ? dbUrl.replace(/[^:\/\@\.]/g, '*') : 'none',
        },
        networkInfo: {
          userAgent: req.headers.get('user-agent'),
          referer: req.headers.get('referer'),
          deployment,
          region: process.env.VERCEL_REGION,
        },
      }

      console.error('Database connection failed:', detailedError)

      logApiError(
        dbError,
        req,
        'GET /api/user/loginStreak - db_connection',
        detailedError
      )

      throw new Error(
        `Database connection failed: ${
          dbError instanceof Error ? dbError.message : 'Unknown error'
        }`
      )
    }

    // Enhanced user verification with diagnostics

    const user = await prisma.userData.findUnique({
      where: { id: userId },
      select: { id: true, email: true, createdAt: true },
    })

    if (!user) {
      // Enhanced user not found logging with collection diagnostics
      console.warn('User not found - running diagnostics...', {
        requestId,
        userId,
        timestamp,
        operation: 'user_lookup',
      })

      return NextResponse.json(
        {
          error: 'User not found',
          requestId,
          timestamp,
          debugInfo: isProduction
            ? undefined
            : {
                userId,
                userIdType: typeof userId,
              },
        },
        { status: 404 }
      )
    }

    const streakCalculationStart = Date.now()
    const streakData = await calculateLoginStreak(userId)
    const streakCalculationTime = Date.now() - streakCalculationStart

    return NextResponse.json(
      {
        ...streakData,
        requestId,
        timestamp,
        debugInfo: isProduction
          ? undefined
          : {
              calculationTimeMs: streakCalculationTime,
              deployment,
              region: process.env.VERCEL_REGION,
            },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-Request-ID': requestId,
          'X-Environment': deployment,
          'X-Timestamp': timestamp,
        },
      }
    )
  } catch (error) {
    const errorDetails = {
      requestId,
      timestamp,
      operation: 'calculate_login_streak',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      errorName: error instanceof Error ? error.name : 'UnknownError',
      environment: process.env.NODE_ENV,
      deployment,
      envConfig,
      userAgent: req.headers.get('user-agent'),
    }

    logApiError(error, req, 'GET /api/user/loginStreak', errorDetails)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to calculate login streak',
        requestId,
        timestamp,
        debugInfo: isProduction ? undefined : errorDetails,
      },
      { status: 500 }
    )
  }
}

async function calculateLoginStreak(userId: string) {
  const functionStartTime = Date.now()
  try {
    // Get user's login events ordered by date (most recent first)
    // queryStartTime removed (instrumentation omitted)
    const loginEvents = await prisma.userLogin.findMany({
      where: { userId },
      orderBy: { loginDate: 'desc' },
      select: {
        loginDate: true,
      },
    })
    // instrumentation: query duration measurement intentionally omitted

    if (loginEvents.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastLoginDate: null,
        isActiveToday: false,
      }
    }

    // Get unique login dates (ignore multiple logins on same day)
    // Use UTC to ensure consistent date calculations across timezones
    // dateProcessingStart removed (instrumentation omitted)
    const uniqueDates = Array.from(
      new Set(
        loginEvents.map((login) => {
          const date = new Date(login.loginDate)
          // Normalize to start of day in UTC for consistent comparison
          return new Date(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate()
          ).getTime()
        })
      )
    ).sort((a, b) => b - a) // Sort descending (most recent first)

    // instrumentation: date processing duration intentionally omitted

    const today = new Date()
    const todayTime = new Date(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate()
    ).getTime()
    const yesterdayTime = todayTime - 24 * 60 * 60 * 1000

    // Check if user logged in today
    const isActiveToday = uniqueDates.length > 0 && uniqueDates[0] === todayTime

    // Calculate current streak
    // streakCalculationStart removed (instrumentation omitted)
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

    // instrumentation: streak calculation duration intentionally omitted

    // Get the most recent login date for return
    const lastLoginDate =
      loginEvents.length > 0 ? loginEvents[0].loginDate.toISOString() : null

    const result = {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      lastLoginDate,
      isActiveToday,
    }

    return result
  } catch (error) {
    const totalTime = Date.now() - functionStartTime
    console.error('Error in calculateLoginStreak:', {
      userId,
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      totalTimeMs: totalTime,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    })

    // Return safe defaults on error
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastLoginDate: null,
      isActiveToday: false,
    }
  }
}
