import { PrismaClient } from '../../../../prisma/generated/client'

const prisma = new PrismaClient()

// Force this route to be dynamic since it requires query parameters
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const userEmail = searchParams.get('email') || undefined
  let account

  if (!userId) {
    if (userEmail) {
      try {
        account = await prisma.userData.findUnique({
          where: { email: userEmail },
        })

        if (!account) {
          // No user found for this email - return 200 with null data for consistency
          return new Response(JSON.stringify({ data: null }), {
            status: 200,
            headers: { 'Cache-Control': 'no-store' },
          })
        }

        // Since users can now have multiple provider accounts, return all of them
        const providerAccounts = await prisma.providerAccount.findMany({
          where: { userId: account.id },
        })

        // Return all provider accounts for this user
        return new Response(
          JSON.stringify({
            data: providerAccounts.length > 0 ? providerAccounts : null,
          }),
          {
            status: 200,
            headers: {
              'Cache-Control': 'no-store',
            },
          }
        )
      } catch (error) {
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
    // Since users can now have multiple provider accounts, return all of them
    const accounts = await prisma.providerAccount.findMany({
      where: { userId: userId },
    })

    if (!accounts || accounts.length === 0) {
      // Return consistent success response with null data when no providerAccount exists
      return new Response(JSON.stringify({ data: null }), {
        status: 200,
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    // Return all provider accounts for this user
    return new Response(JSON.stringify({ data: accounts }), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch account data' }),
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
