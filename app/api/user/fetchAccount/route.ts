import { prisma } from '../../../../app/lib/prismaClient'

// Force this route to be dynamic since it requires query parameters
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const userEmail = searchParams.get('email') || undefined
  let account, providerAccount

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

        providerAccount = await prisma.providerAccount.findUnique({
          where: { userId: account.id },
        })

        // If provider account is not found, return a consistent 200 response with null data
        return new Response(JSON.stringify({ data: providerAccount ?? null }), {
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
      }
    }
    return new Response(JSON.stringify({ error: 'Account not provided' }), {
      status: 404,
    })
  }

  try {
    account = await prisma.providerAccount.findUnique({
      where: { userId: userId },
    })

    if (!account) {
      // Return consistent success response with null data when no providerAccount exists
      return new Response(JSON.stringify({ data: null }), {
        status: 200,
        headers: { 'Cache-Control': 'no-store' },
      })
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch account data' }),
      { status: 500 }
    )
  }

  return new Response(JSON.stringify({ data: account }), {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
