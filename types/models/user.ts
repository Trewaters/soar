/**
 * User Data Types for Soar Yoga Application
 * Centralized type definitions for user-related data structures
 *
 * This is the single source of truth for UserData type.
 * All other files should import from this file.
 */

/**
 * Core UserData type representing the user account and profile information
 * This type matches the Prisma UserData model schema
 */
export type UserData = {
  // Non-editable core identity fields
  id: string
  provider_id: string
  name: string
  email: string
  emailVerified: Date
  image: string

  // Profile metadata
  pronouns: string
  profile: Record<string, any>

  // Timestamps
  createdAt: Date
  updatedAt: Date

  // Editable profile fields
  firstName: string
  lastName: string
  bio: string
  headline: string
  location: string
  websiteURL: string
  shareQuick: string
  yogaStyle: string
  yogaExperience: string
  company: string
  socialURL: string
  isLocationPublic: string
  role: string

  // Profile image management fields
  profileImages: string[]
  activeProfileImage?: string

  // Timezone
  tz?: string
}

/**
 * Simplified UserData type for API responses and service layer
 * Contains only essential user identification and metadata
 */
export type UserDataSimple = {
  id: string
  email: string
  name?: string
  provider_id?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * GitHub OAuth profile data structure
 * Used for GitHub authentication provider integration
 */
export type UserGithubProfile = {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string
  company: string
  blog: string
  location: string
  email: string
  hireable: boolean
  bio: string
  twitter_username: string
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
  private_gists: number
  total_private_repos: number
  owned_private_repos: number
  disk_usage: number
  collaborators: number
  two_factor_authentication: boolean
  plan: {
    name: string
    space: number
    collaborators: number
    private_repos: number
  }
}

/**
 * Google OAuth profile data structure
 * Used for Google authentication provider integration
 */
export type UserGoogleProfile = {
  iss: string
  azp: string
  aud: string
  sub: string
  email: string
  email_verified: boolean
  at_hash: string
  name: string
  picture: string
  given_name: string
  family_name: string
  iat: number
  exp: number
}

/**
 * User login streak tracking data
 * Used for gamification and engagement features
 */
export type UserStreakData = {
  currentStreak: number
  longestStreak: number
  lastLoginDate: string | null
  isActiveToday: boolean
}

/**
 * Complete user profile page state
 * Used in UserContext for comprehensive user state management
 */
export type UserProfilePageState = {
  userData: UserData
  userGithubProfile: UserGithubProfile
  userGoogleProfile: UserGoogleProfile
  isMobile?: boolean
  deviceInfo?: {
    isMobile: boolean
    userAgent?: string
    screenWidth?: number
    touchSupport?: boolean
  }
}

/**
 * User state action types for reducer
 * Used in UserContext for state management
 */
export type UserAction =
  | { type: 'SET_USER'; payload: UserData }
  | { type: 'SET_GITHUB_PROFILE'; payload: UserGithubProfile }
  | { type: 'SET_GOOGLE_PROFILE'; payload: UserGoogleProfile }
  | { type: 'SET_DEVICE_INFO'; payload: UserProfilePageState['deviceInfo'] }
  | {
      type: 'SET_PROFILE_IMAGES'
      payload: { images: string[]; active: string | null }
    }

/**
 * Type guard to check if an object is valid UserData
 */
export function isUserData(obj: any): obj is UserData {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.name === 'string'
  )
}

/**
 * Type guard to check if an object is valid UserDataSimple
 */
export function isUserDataSimple(obj: any): obj is UserDataSimple {
  return obj && typeof obj.id === 'string' && typeof obj.email === 'string'
}
