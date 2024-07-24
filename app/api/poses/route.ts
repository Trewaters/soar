import { NextResponse } from 'next/server'
import postureData from '@interfaces/postureData'

export async function GET() {
  const url = 'https://www.pocketyoga.com/poses.json'
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`)
    }
    const data = await response.json()
    const dataWithId: postureData[] = data.map(
      (item: postureData, index: number) => ({
        ...item,
        id: index + 1,
      })
    )
    return NextResponse.json(dataWithId)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
