import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  console.log(`searchParams: ${searchParams}`)
  const id = searchParams.get('userEmail')
  // const id = searchParams.get('userId')
  if (!id) {
    return Response.json({ error: 'User not found' })
  }
  console.log(`api GET user: ${id}`)

  try {
    const res = await prisma.userData.findUnique({
      where: { email: id },
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
