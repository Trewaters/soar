import { PrismaClient } from '@prisma/generated/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  const data = await prisma.asanaSequence.findMany()
  // console.log('asanaSeries data', data)
  const dataWithId = data.map(
    (item, index) => (
      console.log('item', item),
      {
        ...item,
        id: index + 1,
        sequencesSeries: Array.isArray(item.sequencesSeries)
          ? item.sequencesSeries
          : [],
      }
    )
  )
  console.log('asanaSequence data with id', dataWithId)
  return NextResponse.json(dataWithId)
  // try {
  //   const data = await prisma.asanaSequence.findMany()
  //   // console.log('asanaSeries data', data)
  //   const dataWithId = data.map((item, index) => ({
  //     ...item,
  //     id: index + 1,
  //   }))
  //   console.log('asanaSequence data with id', dataWithId)
  //   return NextResponse.json(dataWithId)
  // } catch (error: unknown) {
  //   if (error instanceof Error) {
  //     console.error(error.message)
  //     return NextResponse.json({ error: error.message }, { status: 500 })
  //   } else {
  //     console.error('An unknown error occurred.')
  //     return NextResponse.json(
  //       { error: 'An unknown error occurred.' },
  //       { status: 500 }
  //     )
  //   }
  // } finally {
  //   await prisma.$disconnect()
  // }
}
