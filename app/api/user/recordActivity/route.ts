/**
 * Record User Activity API Route
 *
 * This API endpoint records user activity (like viewing the streak component)
 * and updates login streak information automatically. This ensures the login
 * streak is always up-to-date when users view their activity streaks.
 *
 * Features:
 * - Records daily login activity automatically
 * - Prevents duplicate entries for the same day
 * - Returns updated streak information
 * - Handles timezone differences properly
 */

import { prisma } from '../../../../app/lib/prismaClient'
import { NextRequest, NextResponse } from 'next/server'
import { logApiError } from '../../../../lib/errorLogger'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  const requestId = randomUUID()
  const timestamp = new Date().toISOString()
  const isProduction = process.env.NODE_ENV === 'production'

  // use shared prisma client

  try {
    // use shared prisma client

    const body = await req.json()
    const { userId, activityType = 'view_streaks' } = body

    if (!userId) {
      return NextResponse.json(
        {
          error: 'Missing required parameter: userId',
          requestId,
          timestamp,
        },
        { status: 400 }
      )
    }

    // Verify user exists
    const user = await prisma.userData.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    })

    if (!user) {
      console.warn('recordActivity: user not found for supplied session id.', {
        requestId,
        timestamp,
        userId,
      })

      return NextResponse.json(
        {
          error: 'User session is no longer valid. Please sign in again.',
          requestId,
          timestamp,
        },
        { status: 401 }
      )
    }

    // Record today's activity if not already recorded
    const today = new Date()
    const startOfToday = new Date(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      0,
      0,
      0,
      0
    )
    const endOfToday = new Date(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      23,
      59,
      59,
      999
    )

    // Check if user already has a login record for today
    const existingLoginToday = await prisma.userLogin.findFirst({
      where: {
        userId: userId,
        loginDate: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    })

    let loginRecorded = false

    if (!existingLoginToday) {
      // Create new login record for today

      await prisma.userLogin.create({
        data: {
          userId: userId,
          loginDate: new Date(),
        },
      })

      loginRecorded = true
    }

    // Calculate updated streak information

    const streakData = await calculateLoginStreak(userId)

    return NextResponse.json({
      success: true,
      loginRecorded,
      streakData,
      requestId,
      timestamp,
      debugInfo: isProduction
        ? undefined
        : {
            activityType,
            existingLoginToday: !!existingLoginToday,
            environment: process.env.NODE_ENV,
          },
    })
  } catch (error) {
    console.error('Error in recordActivity API:', {
      requestId,
      timestamp,
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    })

    logApiError(error, req, 'POST /api/user/recordActivity', {
      requestId,
      timestamp,
    })

    return NextResponse.json(
      {
        error: 'Failed to record activity',
        details: error instanceof Error ? error.message : 'Unknown error',
        requestId,
        timestamp,
        debugInfo: isProduction
          ? undefined
          : {
              errorType:
                error instanceof Error ? error.constructor.name : typeof error,
            },
      },
      { status: 500 }
    )
  }
}

async function calculateLoginStreak(userId: string) {
  try {
    // Get user's login events ordered by date (most recent first)
    const loginEvents = await prisma.userLogin.findMany({
      where: { userId },
      orderBy: { loginDate: 'desc' },
      select: {
        loginDate: true,
      },
    })

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

    const result = {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      lastLoginDate,
      isActiveToday,
    }

    return result
  } catch (error) {
    console.error('Error in calculateLoginStreak from recordActivity:', {
      userId,
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
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
