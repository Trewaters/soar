import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
    })
  }

  const decodedEmail = decodeURIComponent(email)

  try {
    const user = await prisma.userData.findUnique({
      where: { email: decodedEmail },
    })

    // console.log(`api prisma.user: ${JSON.stringify(user)}`)

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      })
    }

    return new Response(JSON.stringify({ data: user }), { status: 200 })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user data' }),
      { status: 500 }
    )
  }
}