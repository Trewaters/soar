import { PrismaClient } from '../../../../prisma/generated/client'
import { NextRequest, NextResponse } from 'next/server'
import { logApiError } from '../../../../lib/errorLogger'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
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

    // Get user data to verify user exists
    const user = await prisma.userData.findUnique({
      where: { id: userId },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        // We'll use updatedAt as a proxy for login activity for now
        // In a full implementation, we'd have a separate UserLogin table
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // For now, we'll calculate a simple streak based on user activity
    // In a real implementation, you'd want to track actual login events
    const streakData = await calculateLoginStreak(userId)

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
  try {
    // Get the user's basic info
    const user = await prisma.userData.findUnique({
      where: { id: userId },
      select: {
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastLoginDate: null,
        isActiveToday: false,
      }
    }

    // Get user's login events ordered by date (most recent first)
    const loginEvents = await prisma.userLogin.findMany({
      where: { userId },
      orderBy: { loginDate: 'desc' },
      take: 100, // Look at last 100 login events to calculate streaks
      select: {
        loginDate: true,
      },
    })

    if (loginEvents.length === 0) {
      // New user with no login events recorded yet
      // Check if they signed up today (might be their first login)
      const today = new Date()
      const signupDate = new Date(user.createdAt)

      // Check if signup was today
      const isSignupToday = today.toDateString() === signupDate.toDateString()

      return {
        currentStreak: isSignupToday ? 1 : 0,
        longestStreak: isSignupToday ? 1 : 0,
        lastLoginDate: isSignupToday ? signupDate.toISOString() : null,
        isActiveToday: isSignupToday,
      }
    }

    // Get unique login dates (ignore multiple logins on same day)
    const uniqueDates = [
      ...new Set(
        loginEvents.map((login) => new Date(login.loginDate).toDateString())
      ),
    ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    let isActiveToday = false

    if (uniqueDates.length > 0) {
      const lastLoginDate = uniqueDates[0]
      isActiveToday = lastLoginDate === today

      // Calculate current streak
      // Start from today if user logged in today, otherwise yesterday
      const streakStartDate = isActiveToday ? today : yesterday
      const currentDate = new Date(streakStartDate)

      for (const loginDateStr of uniqueDates) {
        const expectedDateStr = currentDate.toDateString()

        if (loginDateStr === expectedDateStr) {
          currentStreak++
          tempStreak++
          longestStreak = Math.max(longestStreak, tempStreak)

          // Move to previous day
          currentDate.setDate(currentDate.getDate() - 1)
        } else {
          // Gap in streak, stop counting current streak
          break
        }
      }

      // Calculate longest streak from all login dates
      tempStreak = 1
      for (let i = 1; i < uniqueDates.length; i++) {
        const currentLoginDate = new Date(uniqueDates[i])
        const prevLoginDate = new Date(uniqueDates[i - 1])

        // Calculate days between consecutive logins
        const daysDiff = Math.floor(
          (prevLoginDate.getTime() - currentLoginDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )

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

    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      lastLoginDate:
        loginEvents.length > 0
          ? loginEvents[0].loginDate.toISOString()
          : user.createdAt.toISOString(),
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
