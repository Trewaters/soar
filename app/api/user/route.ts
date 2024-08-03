import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()
// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  let user

  if (!email) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
    })
  }

  const decodedEmail = decodeURIComponent(email)

  try {
    user = await prisma.userData.findUnique({
      where: { email: decodedEmail },
    })

    // console.log('api prisma.user:', { user })

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      })
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user data' }),
      { status: 500 }
    )
  }

  // try {
  //   practitioner = await fetch(
  //     `${baseUrl}/api/user/fetchPractitioner/?id=${user.id}`
  //   )
  //   const data = await practitioner.json()
  //   console.log('user GET practitioner data:', data)
  // } catch (error) {
  //   console.error('Practitioner creation error (api/user):', error)
  //   return new Response(
  //     JSON.stringify({ error: 'Failed to create practitioner data' }),
  //     { status: 500 }
  //   )
  // }

  return new Response(JSON.stringify({ data: user }), { status: 200 })
}
