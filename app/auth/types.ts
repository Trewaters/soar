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
  /** User must accept the current Terms of Service to create an account */
  TOS_ACCEPTANCE_REQUIRED = 'TOS_ACCEPTANCE_REQUIRED',
  /** Submitted TOS version is not the currently active version */
  TOS_VERSION_MISMATCH = 'TOS_VERSION_MISMATCH',
  /** No active TOS version is available for account creation */
  TOS_VERSION_UNAVAILABLE = 'TOS_VERSION_UNAVAILABLE',
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
