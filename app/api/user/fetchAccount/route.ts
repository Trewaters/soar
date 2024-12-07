import { PrismaClient } from "@prisma/generated/client"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  const userEmail = searchParams.get("email") || undefined
  let account, providerAccount

  console.log("email:", userEmail)

  if (!userId) {
    if (userEmail) {
      try {
        account = await prisma.userData.findUnique({
          where: { email: userEmail },
        })
        console.log("account:", account)

        if (!account) {
          return new Response(
            JSON.stringify({ error: "Email Account not found" }),
            {
              status: 404,
            }
          )
        }
        providerAccount = await prisma.providerAccount.findUnique({
          where: { userId: account.id },
        })

        return new Response(JSON.stringify({ data: providerAccount }), {
          status: 200,
          headers: {
            "Cache-Control": "no-store",
          },
        })
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Failed to fetch account data" }),
          { status: 500 }
        )
      } finally {
        await prisma.$disconnect()
      }
    }
    return new Response(JSON.stringify({ error: "Account not provided" }), {
      status: 404,
    })
  }

  try {
    account = await prisma.providerAccount.findUnique({
      where: { userId: userId },
    })

    if (!account) {
      return new Response(JSON.stringify({ error: "Account not found" }), {
        status: 404,
      })
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch account data" }),
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }

  return new Response(JSON.stringify({ data: account }), {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
    },
  })
}
