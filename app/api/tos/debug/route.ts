import prisma from '@lib/prismaClient'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const versions = await prisma.tosVersion.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({
      ok: true,
      count: versions.length,
      versions: versions.slice(0, 10),
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
