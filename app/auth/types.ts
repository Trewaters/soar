/**
 * Authentication error codes for detailed error handling
 *
 * These codes are used throughout the authentication flow to provide
 * specific feedback to users about what went wrong during sign-in/sign-up.
 */
/* eslint-disable no-unused-vars */
export enum AuthErrorCode {
  /** User tried to create account with email that already has credentials */
  EMAIL_EXISTS_CREDENTIALS = 'EMAIL_EXISTS_CREDENTIALS',
  /** User tried to create account with email that already has OAuth */
  EMAIL_EXISTS_OAUTH = 'EMAIL_EXISTS_OAUTH',
  /** User provided incorrect password */
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  /** User tried to sign in with email that has no password set (OAuth only) */
  NO_PASSWORD_SET = 'NO_PASSWORD_SET',
}
/* eslint-enable no-unused-vars */

/**
 * Type definition for auth error response
 */
export type AuthError = {
  code: AuthErrorCode
  message: string
  provider?: string
}
