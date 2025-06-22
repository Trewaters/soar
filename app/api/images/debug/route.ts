import { NextResponse } from 'next/server'

export async function GET() {
  const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN

  return NextResponse.json({
    hasAccountId: !!cloudflareAccountId,
    hasApiToken: !!cloudflareApiToken,
    accountIdLength: cloudflareAccountId?.length || 0,
    apiTokenLength: cloudflareApiToken?.length || 0,
  })
}
