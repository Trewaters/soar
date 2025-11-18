import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { PrismaClient } from '../../../../prisma/generated/client'

const prisma = new PrismaClient()

// Force this route to be dynamic
export const dynamic = 'force-dynamic'

/**
 * GET /api/user/login-history
 * Fetches the user's recent login history with device and location information
 */
export async function GET() {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user by email
    const user = await prisma.userData.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch recent login history (last 20 logins)
    const loginHistory = await prisma.userLogin.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        loginDate: 'desc',
      },
      take: 20,
    })

    // Transform login data into user-friendly format
    const formattedHistory = loginHistory.map((login) => ({
      id: login.id,
      loginDate: login.loginDate,
      device: parseUserAgent(login.userAgent || ''),
      location: login.ipAddress || 'Unknown location',
      provider: formatProvider(login.provider || ''),
      userAgent: login.userAgent || '',
    }))

    return NextResponse.json({
      loginHistory: formattedHistory,
      totalLogins: loginHistory.length,
    })
  } catch (error) {
    console.error('Error fetching login history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch login history' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

/**
 * Parse user agent string to extract device and browser information
 */
function parseUserAgent(userAgent: string): string {
  if (!userAgent) return 'Unknown Device'

  // Extract browser (check Edge before Chrome since Edge includes "Chrome" in its UA)
  let browser = 'Unknown Browser'
  if (userAgent.includes('Edg/'))
    browser = 'Edge' // Modern Edge uses "Edg/"
  else if (userAgent.includes('Edge'))
    browser = 'Edge' // Legacy Edge
  else if (userAgent.includes('Opera') || userAgent.includes('OPR'))
    browser = 'Opera'
  else if (userAgent.includes('Chrome')) browser = 'Chrome'
  else if (userAgent.includes('Firefox')) browser = 'Firefox'
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome'))
    browser = 'Safari'

  // Extract OS (check iOS before macOS since iOS UA can include "Mac OS X")
  let os = 'Unknown OS'
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    const iosMatch = userAgent.match(/OS ([\d_]+)/)
    os = iosMatch
      ? `iOS ${iosMatch[1].replace(/_/g, '.')}`
      : userAgent.includes('iPad')
        ? 'iPadOS'
        : 'iOS'
  } else if (userAgent.includes('Android')) {
    const androidMatch = userAgent.match(/Android ([\d.]+)/)
    os = androidMatch ? `Android ${androidMatch[1]}` : 'Android'
  } else if (userAgent.includes('Windows NT 10.0')) os = 'Windows 10/11'
  else if (userAgent.includes('Windows NT 6.3')) os = 'Windows 8.1'
  else if (userAgent.includes('Windows NT 6.2')) os = 'Windows 8'
  else if (userAgent.includes('Windows NT 6.1')) os = 'Windows 7'
  else if (userAgent.includes('Windows')) os = 'Windows'
  else if (userAgent.includes('Mac OS X')) {
    const macMatch = userAgent.match(/Mac OS X ([\d_]+)/)
    os = macMatch ? `macOS ${macMatch[1].replace(/_/g, '.')}` : 'macOS'
  } else if (userAgent.includes('Linux')) os = 'Linux'

  return `${browser} on ${os}`
}

/**
 * Format provider name for display
 */
function formatProvider(provider: string): string {
  if (!provider) return ''

  const providerMap: { [key: string]: string } = {
    google: 'Google',
    github: 'GitHub',
    credentials: 'Email/Password',
  }

  return providerMap[provider.toLowerCase()] || provider
}
