/**
 * Rate limiting utility for API endpoints
 * Tracks request counts per IP address with configurable time windows
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store for rate limiting
// In production, consider using Redis or similar for distributed systems
const rateLimitStore: RateLimitStore = {}

// Cleanup old entries every 5 minutes
setInterval(
  () => {
    const now = Date.now()
    Object.keys(rateLimitStore).forEach((key) => {
      if (rateLimitStore[key].resetTime < now) {
        delete rateLimitStore[key]
      }
    })
  },
  5 * 60 * 1000
)

export interface RateLimitOptions {
  /** Maximum number of requests allowed within the time window */
  limit: number
  /** Time window in milliseconds */
  windowMs: number
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean
  /** Current request count for this identifier */
  count: number
  /** Remaining requests before hitting the limit */
  remaining: number
  /** Timestamp when the rate limit will reset */
  resetTime: number
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier for the requester (e.g., IP address)
 * @param options - Rate limit configuration
 * @returns Rate limit result with allowed status and metadata
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now()
  const { limit, windowMs } = options

  // Get or create entry for this identifier
  let entry = rateLimitStore[identifier]

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired entry
    entry = {
      count: 1,
      resetTime: now + windowMs,
    }
    rateLimitStore[identifier] = entry

    return {
      allowed: true,
      count: 1,
      remaining: limit - 1,
      resetTime: entry.resetTime,
    }
  }

  // Increment count for existing entry
  entry.count++

  const allowed = entry.count <= limit

  return {
    allowed,
    count: entry.count,
    remaining: Math.max(0, limit - entry.count),
    resetTime: entry.resetTime,
  }
}

/**
 * Get the client IP address from a request
 * @param request - The incoming request object
 * @returns The client IP address or 'unknown' if not found
 */
export function getClientIP(request: Request): string {
  // Check various headers for IP address
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  // Fallback to a default identifier
  return 'unknown'
}

/**
 * Create a Response object for rate limit exceeded
 * @param resetTime - Timestamp when the rate limit will reset
 * @returns Response with 429 status code
 */
export function createRateLimitResponse(resetTime: number): Response {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000)

  return new Response(
    JSON.stringify({
      error: 'Too many requests. Please try again later.',
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Reset': new Date(resetTime).toISOString(),
      },
    }
  )
}
