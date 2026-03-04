// Central site configuration derived from environment variables.
// Use NEXT_PUBLIC_SITE_URL for client-safe usage; fall back to other env vars.
export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL as string) ||
  (process.env.SITE_URL as string) ||
  (process.env.NEXTAUTH_URL as string) ||
  'https://www.happyyoga.app'

export const SITE_HOSTNAME = (() => {
  try {
    return new URL(SITE_URL).hostname
  } catch (err) {
    return SITE_URL.replace(/^https?:\/\//, '')
  }
})()
