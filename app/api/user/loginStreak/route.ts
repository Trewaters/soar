import { PrismaClient } from '../../../../prisma/generated/client'
import { NextRequest, NextResponse } from 'next/server'
import { logApiError } from '../../../../lib/errorLogger'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  console.log('=== GET /api/user/loginStreak called ===')
  try {
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

    // Verify user exists
    const user = await prisma.userData.findUnique({
      where: { id: userId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate login streak using UserLogin table
    console.log('About to calculate login streak for userId:', userId)
    const streakData = await calculateLoginStreak(userId)
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
    await prisma.$disconnect()
  }
}

async function calculateLoginStreak(userId: string) {
  console.log('=== calculateLoginStreak called with userId:', userId)
  try {
    // Get user's login events ordered by date (most recent first)
    const loginEvents = await prisma.userLogin.findMany({
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
