import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  let account

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Account not found' }), {
      status: 404,
    })
  }

  try {
    account = await prisma.providerAccount.findUnique({
      where: { userId: userId },
    })

    if (!account) {
      return new Response(JSON.stringify({ error: 'Account not found' }), {
        status: 404,
      })
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch account data' }),
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }

  return new Response(JSON.stringify({ data: account }), {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
