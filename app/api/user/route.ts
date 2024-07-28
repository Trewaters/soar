import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  let user
  let practitioner

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

    console.log(`api prisma.user: ${JSON.stringify(user)}`)

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      })
    }

    // return new Response(JSON.stringify({ data: user }), { status: 200 })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user data' }),
      { status: 500 }
    )
  }

  // TODO: replace try/catch with practitioner GET call 'app/api/user/fetchPractitioner/route.ts'
  // try {
  //   practitioner = await prisma.practitioner.findUnique({
  //     // TODO Create a new practitioner
  //     where: { id: user.id },
  //   })

  //   if (!practitioner) {
  //     // TODO Create a new practitioner
  //     practitioner = await prisma.practitioner.create({
  //       data: {
  //         id: user.id,
  //         // ...practitionerData,
  //         headline: 'New Headline',
  //         bio: 'Updated bio',
  //         location: 'New Location',
  //         websiteURL: 'https://happyYoga.app',
  //         firstName: 'New First Name',
  //         lastName: 'New Last Name',
  //         userId: user.id,
  //       },
  //     })
  //     console.error('Practitioner created:', practitioner)
  //   }
  // } catch (error) {
  //   console.error('Practitioner creation error:', error)
  //   return new Response(
  //     JSON.stringify({ error: 'Failed to create practitioner data' }),
  //     { status: 500 }
  //   )
  // }
  try {
    practitioner = await fetch(
      `${baseUrl}/api/user/fetchPractitioner/?id=${user.id}`
    )
    // .then(
    //   (res) => res.json()
    // )
    console.log(`user GET practitioner: ${JSON.stringify(practitioner)}`)
  } catch (error) {
    console.error('Practitioner creation error (api/user):', error)
    return new Response(
      JSON.stringify({ error: 'Failed to create practitioner data' }),
      { status: 500 }
    )
  }

  return new Response(JSON.stringify({ data: user }), { status: 200 })
}
