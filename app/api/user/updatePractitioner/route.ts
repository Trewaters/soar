import { PractitionerProfile } from '@app/userManagement/UserDetails'
import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()

// export async function POST(req: Request) {
//   const { email, practitionerData } = await req.json()

//   // console.log(`pronouns, email: ${pronouns}, ${email}`)

//   const decodedId = email.toString().replace('%40', '@').replace('=', '')
//   // console.log(`Decoded id: ${decodedId}`)

//   try {
//     // Find the user by email
//     const user = await prisma.userData.findUnique({
//       where: { email: decodedId },
//     })

//     if (!user) {
//       return new Response(JSON.stringify({ error: 'User not found' }), {
//         status: 404,
//       })
//     }

//     // Update the practitioner data
//     await prisma.practitioner.update({
//       where: { id: user.id },
//       data: practitionerData,
//     })

//     return new Response(
//       JSON.stringify({ message: 'Practitioner data updated successfully' }),
//       { status: 200 }
//     )
//   } catch (error) {
//     console.error('Error updating practitioner data:', error)
//     return new Response(
//       JSON.stringify({ error: 'Error updating practitioner data' }),
//       { status: 500 }
//     )
//   }

//   // try {
//   //   await prisma.practitioner.update({
//   //     where: { email: decodedId },
//   //     data: { pronouns },
//   //   })
//   //   return Response.json({ message: 'Data saved' })
//   // } catch (error) {
//   //   return Response.json({ error: 'Error saving data' })
//   // }
// }

export async function POST(req: Request) {
  // const {
  //   email,
  //   practitionerData,
  // }: { email: string; practitionerData: PractitionerProfile } = await req.json()
  const { email, practitionerData } = await req.json()

  const decodedId = email.toString().replace('%40', '@').replace('=', '')

  try {
    // Find the user by email
    const user = await prisma.userData.findUnique({
      where: { email: decodedId },
    })

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      })
    }

    // Try to update the practitioner data
    try {
      await prisma.practitioner.update({
        where: { id: user.id },
        data: practitionerData,
      })
    } catch (updateError: unknown) {
      // If update fails, create a new practitioner record
      // console.error('updateError', updateError)
      await prisma.practitioner.create({
        data: {
          id: user.id,
          ...practitionerData,
        },
      })
      // const knownErrorCode = JSON.stringify(updateError)
      // if (knownErrorCode === 'P2025') {
      //   // P2025 is the error code for "Record to update not found."
      //   await prisma.practitioner.create({
      //     data: {
      //       id: user.id,
      //       ...practitionerData,
      //     },
      //   })
      // } else {
      //   throw updateError
      // }
    }

    return new Response(
      JSON.stringify({ message: 'Practitioner data updated successfully' }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating practitioner data:', error)
    return new Response(
      JSON.stringify({ error: 'Error updating practitioner data' }),
      { status: 500 }
    )
  }
}
