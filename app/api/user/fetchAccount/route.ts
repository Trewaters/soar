import { prisma } from '@lib/prismaClient'
import {
  checkRateLimit,
  getClientIP,
  createRateLimitResponse,
} from '@app/utils/rateLimit'

// Force this route to be dynamic since it requires query parameters
export const dynamic = 'force-dynamic'

// Rate limit configuration: 10 requests per minute per IP
const RATE_LIMIT_CONFIG = {
  limit: 10,
  windowMs: 60 * 1000, // 1 minute
}

export async function GET(req: Request) {
  // Apply rate limiting
  const clientIP = getClientIP(req)
  const rateLimitResult = checkRateLimit(clientIP, RATE_LIMIT_CONFIG)

  if (!rateLimitResult.allowed) {
    console.warn('[API] Rate limit exceeded for IP:', clientIP)
    return createRateLimitResponse(rateLimitResult.resetTime)
  }

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const userEmail = searchParams.get('email') || undefined
  let account

  if (!userId) {
    if (userEmail) {
      try {
        // Query user data with provider accounts in a single query
        account = await prisma.userData.findUnique({
          where: { email: userEmail },
          include: {
            providerAccounts: {
              select: {
                provider: true,
                providerAccountId: true,
                type: true,
              },
            },
          },
        })

        if (!account) {
          // No user found for this email - return 200 with null data for consistency
          return new Response(JSON.stringify({ data: null }), {
            status: 200,
            headers: { 'Cache-Control': 'no-store' },
          })
        }

        // Determine the primary provider (first provider or credentials if available)
        const primaryProvider =
          account.providerAccounts.find(
            (pa) => pa.provider === 'credentials'
          ) || account.providerAccounts[0]

        // Return enhanced response with provider information
        return new Response(
          JSON.stringify({
            data: {
              email: account.email,
              provider: primaryProvider?.provider || 'unknown',
              providerId: primaryProvider?.providerAccountId || account.id,
              hasMultipleProviders: account.providerAccounts.length > 1,
              providers: account.providerAccounts.map((pa) => pa.provider),
            },
          }),
          {
            status: 200,
            headers: {
              'Cache-Control': 'no-store',
            },
          }
        )
      } catch (error) {
        console.error('[API] Error fetching account by email:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch account data' }),
          { status: 500 }
        )
      } finally {
        await prisma.$disconnect()
      }
    }
    return new Response(JSON.stringify({ error: 'Account not provided' }), {
      status: 404,
    })
  }

  try {
    // Query user with provider accounts in a single query for efficiency
    const user = await prisma.userData.findUnique({
      where: { id: userId },
      include: {
        providerAccounts: {
          select: {
            provider: true,
            providerAccountId: true,
            type: true,
          },
        },
      },
    })

    if (!user || !user.providerAccounts || user.providerAccounts.length === 0) {
      // Return consistent success response with null data when no providerAccount exists
      return new Response(JSON.stringify({ data: null }), {
        status: 200,
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    // Determine the primary provider (prefer credentials, otherwise use first)
    const primaryProvider =
      user.providerAccounts.find((pa) => pa.provider === 'credentials') ||
      user.providerAccounts[0]

    // Return enhanced response with provider information
    return new Response(
      JSON.stringify({
        data: {
          email: user.email,
          provider: primaryProvider.provider,
          providerId: primaryProvider.providerAccountId,
          hasMultipleProviders: user.providerAccounts.length > 1,
          providers: user.providerAccounts.map((pa) => pa.provider),
        },
      }),
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error('[API] Error fetching account by userId:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch account data' }),
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
