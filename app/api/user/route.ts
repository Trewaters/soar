import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  console.log(`searchParams: ${searchParams}`)
  const id = searchParams
  console.log(`GET id: ${id}`)
  // const id = searchParams.get('userEmail')
  // const id = searchParams.get('userId')
  if (!id) {
    return Response.json({ error: 'User not found' })
  }
  console.log(`GET user: ${id}`)

  const decodedId = id.toString().replace('%40', '@').replace('=', '')
  console.log(`Decoded id: ${decodedId}`)

  try {
    const res = await prisma.userData.findUnique({
      where: { email: decodedId.toString() },
      // where: { id: id },
    })
    console.log(`api prisma.user: ${JSON.stringify(res)}`)
    if (!res) {
      return Response.json({ error: 'User not found' })
    }
    const data = await res
    return Response.json({ data })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch user data' })
  }
}
