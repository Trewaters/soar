import { PrismaClient } from '../../../prisma/generated/client'

const prisma = new PrismaClient()
// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

// Force this route to be dynamic since it requires query parameters
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  let user

  if (!email) {
    // No email provided - respond with consistent shape
    return new Response(JSON.stringify({ data: null }), {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  const decodedEmail = decodeURIComponent(email)

  try {
    user = await prisma.userData.findUnique({
      where: { email: decodedEmail },
    })

    if (!user) {
      // Return consistent success response with null data when no user exists
      return new Response(JSON.stringify({ data: null }), {
        status: 200,
        headers: { 'Cache-Control': 'no-store' },
      })
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user data' }),
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }

  // try {
  //   practitioner = await fetch(
  //     `${baseUrl}/api/user/fetchPractitioner/?id=${user.id}`
  //   )
  //   const data = await practitioner.json()
  // } catch (error) {
  //   console.error('Practitioner creation error (api/user):', error)
  //   return new Response(
  //     JSON.stringify({ error: 'Failed to create practitioner data' }),
  //     { status: 500 }
  //   )
  // }

  return new Response(JSON.stringify({ data: user }), {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
