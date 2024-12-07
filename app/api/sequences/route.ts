import { PrismaClient } from "@prisma/generated/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const data = await prisma.asanaSequence.findMany()
    const dataWithId = data.map((item, index) => ({
      ...item,
      id: index + 1,
      sequencesSeries: Array.isArray(item.sequencesSeries)
        ? item.sequencesSeries
        : [],
    }))
    return NextResponse.json(dataWithId, {
      headers: {
        "Cache-Control": "no-store",
      },
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred." },
        { status: 500 }
      )
    }
  } finally {
    await prisma.$disconnect()
  }
}
