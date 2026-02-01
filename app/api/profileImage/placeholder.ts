import { NextResponse } from 'next/server'

// Returns a placeholder image for unauthenticated or fallback cases
export async function GET() {
  // This can be expanded to return different placeholders based on query params
  return NextResponse.json({ placeholder: '/images/profile-placeholder.png' })
}
