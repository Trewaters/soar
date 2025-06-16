/**
 * Login Streak API Route - Enhanced for Production Debugging
 *
 * This API calculates user login streaks with comprehensive logging to troubleshoot
 * production issues where the feature works locally but fails in production.
 *
 * Enhanced logging includes:
 * - Request tracking with unique request IDs
 * - Environment and deployment diagnostics
 * - Database connection testing and timing
 * - User lookup diagnostics with collection inspection
 * - Detailed error context with stack traces
 * - Performance timing measurements
 * - Network and browser information
 * - Debug information (excluded in production responses)
 *
 * Troubleshooting production issues:
 * 1. Check Vercel logs for detailed error messages
 * 2. Look for database connection timeouts or failures
 * 3. Verify environment variables are properly set
 * 4. Check if user exists in UserData collection
 * 5. Monitor UserLogin collection for missing data
 * 6. Review request IDs to trace specific failures
 */

import { PrismaClient } from '../../../../prisma/generated/client'
import { NextRequest, NextResponse } from 'next/server'
import { logApiError } from '../../../../lib/errorLogger'
import { randomUUID } from 'crypto'

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
  const requestId = randomUUID()
  const timestamp = new Date().toISOString()
  const isProduction = process.env.NODE_ENV === 'production'
  const deployment = process.env.VERCEL_ENV || 'local'

  console.log('=== GET /api/user/loginStreak called ===', {
    requestId,
    timestamp,
    url: req.url,
    method: req.method,
    environment: process.env.NODE_ENV,
    deployment,
    isProduction,
    headers: Object.fromEntries(req.headers.entries()),
    userAgent: req.headers.get('user-agent'),
    referer: req.headers.get('referer'),
    origin: req.headers.get('origin'),
  })

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

  console.log('Enhanced database configuration check:', {
    requestId,
    timestamp,
    ...envConfig,
  })

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

  let client: PrismaClient | null = null
  try {
    console.log('Attempting to get Prisma client...', {
      requestId,
      timestamp,
      dbProvider: envConfig.dbProvider,
      hasAtlasCluster: envConfig.hasAtlasCluster,
    })
    client = getPrismaClient()

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    console.log('Extracted query parameters:', {
      requestId,
      userId,
      fullUrl: req.url,
      searchParams: Object.fromEntries(searchParams.entries()),
      timestamp,
    })

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
      console.log('Testing database connection...', {
        requestId,
        userId,
        timestamp,
        dbProvider: envConfig.dbProvider,
      })

      const connectionStart = Date.now()
      await client.$connect()
      const connectionTime = Date.now() - connectionStart

      console.log('Database connection successful', {
        requestId,
        userId,
        timestamp,
        connectionTimeMs: connectionTime,
        dbProvider: envConfig.dbProvider,
      })
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
    console.log('Verifying user exists...', { requestId, userId, timestamp })

    const userQueryStart = Date.now()
    const user = await client.userData.findUnique({
      where: { id: userId },
      select: { id: true, email: true, createdAt: true },
    })
    const userQueryTime = Date.now() - userQueryStart

    console.log('User lookup completed:', {
      user,
      requestId,
      userId,
      timestamp,
      queryTimeMs: userQueryTime,
      userFound: !!user,
      userEmail: user?.email,
      userCreatedAt: user?.createdAt,
    })

    if (!user) {
      // Enhanced user not found logging with collection diagnostics
      console.warn('User not found - running diagnostics...', {
        requestId,
        userId,
        timestamp,
        operation: 'user_lookup',
      })

      // Check if UserData collection exists and has any records
      try {
        const totalUsersCount = await client.userData.count()
        const recentUsers = await client.userData.findMany({
          take: 5,
          select: { id: true, email: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        })

        console.warn('UserData collection diagnostics:', {
          requestId,
          userId,
          timestamp,
          totalUsersCount,
          recentUserIds: recentUsers.map((u) => u.id),
          recentUserEmails: recentUsers.map((u) => u.email),
          userIdType: typeof userId,
          userIdLength: userId.length,
        })
      } catch (diagError) {
        console.error('Failed to run user diagnostics:', {
          requestId,
          userId,
          timestamp,
          diagError:
            diagError instanceof Error ? diagError.message : String(diagError),
        })
      }

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

    console.log('User found, proceeding to calculate login streak:', {
      requestId,
      userId,
      timestamp,
      userEmail: user.email,
    })

    // Calculate login streak using UserLogin table
    console.log('About to calculate login streak for userId:', {
      requestId,
      userId,
      timestamp,
    })

    const streakCalculationStart = Date.now()
    const streakData = await calculateLoginStreak(userId, client)
    const streakCalculationTime = Date.now() - streakCalculationStart

    console.log('Successfully calculated streak data:', {
      requestId,
      userId,
      streakData,
      timestamp,
      calculationTimeMs: streakCalculationTime,
    })

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

    console.error('LoginStreak API Error:', errorDetails)

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
  } finally {
    if (client) {
      try {
        await client.$disconnect()
        console.log('Database client disconnected successfully:', {
          requestId,
          timestamp,
        })
      } catch (disconnectError) {
        console.warn('Failed to disconnect database client:', {
          requestId,
          timestamp,
          disconnectError:
            disconnectError instanceof Error
              ? disconnectError.message
              : String(disconnectError),
        })
      }
    }
  }
}

async function calculateLoginStreak(
  userId: string,
  prismaClient: PrismaClient
) {
  const functionStartTime = Date.now()
  console.log('=== calculateLoginStreak called ===', {
    userId,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })

  try {
    // Get user's login events ordered by date (most recent first)
    const queryStartTime = Date.now()
    const loginEvents = await prismaClient.userLogin.findMany({
      where: { userId },
      orderBy: { loginDate: 'desc' },
      select: {
        loginDate: true,
      },
    })
    const queryTime = Date.now() - queryStartTime

    console.log('UserLogin query completed:', {
      loginEvents,
      userId,
      queryTimeMs: queryTime,
      eventsCount: loginEvents.length,
      firstEvent: loginEvents[0]?.loginDate?.toISOString(),
      lastEvent: loginEvents[loginEvents.length - 1]?.loginDate?.toISOString(),
      timestamp: new Date().toISOString(),
    })

    if (loginEvents.length === 0) {
      console.log('No login events found for user:', {
        userId,
        timestamp: new Date().toISOString(),
      })
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastLoginDate: null,
        isActiveToday: false,
      }
    }

    // Get unique login dates (ignore multiple logins on same day)
    // Use UTC to ensure consistent date calculations across timezones
    const dateProcessingStart = Date.now()
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

    const dateProcessingTime = Date.now() - dateProcessingStart

    const today = new Date()
    const todayTime = new Date(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate()
    ).getTime()
    const yesterdayTime = todayTime - 24 * 60 * 60 * 1000

    // Check if user logged in today
    const isActiveToday = uniqueDates.length > 0 && uniqueDates[0] === todayTime

    console.log('Date processing completed:', {
      userId,
      dateProcessingTimeMs: dateProcessingTime,
      uniqueDatesCount: uniqueDates.length,
      totalEventsCount: loginEvents.length,
      todayTime,
      yesterdayTime,
      isActiveToday,
      mostRecentDate: uniqueDates[0],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: new Date().toISOString(),
    })

    // Calculate current streak
    const streakCalculationStart = Date.now()
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

    const streakCalculationTime = Date.now() - streakCalculationStart

    // Get the most recent login date for return
    const lastLoginDate =
      loginEvents.length > 0 ? loginEvents[0].loginDate.toISOString() : null

    const result = {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      lastLoginDate,
      isActiveToday,
    }

    const totalTime = Date.now() - functionStartTime

    console.log('Streak calculation completed:', {
      userId,
      result,
      timings: {
        totalTimeMs: totalTime,
        queryTimeMs: queryTime,
        dateProcessingTimeMs: dateProcessingTime,
        streakCalculationTimeMs: streakCalculationTime,
      },
      debugInfo: {
        uniqueDatesCount: uniqueDates.length,
        totalEventsCount: loginEvents.length,
        isActiveToday,
        environment: process.env.NODE_ENV,
      },
      timestamp: new Date().toISOString(),
    })

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
