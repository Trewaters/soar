import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  let account
  // let practitioner

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Account not found' }), {
      status: 404,
    })
  }

  try {
    account = await prisma.account.findUnique({
      where: { id: userId },
    })

    console.log('api prisma.account:', { account })

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
  }

  return new Response(JSON.stringify({ data: account }), { status: 200 })
}
