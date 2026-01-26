/**
 * Authorization Utilities for Role-Based Access Control
 *
 * This module provides server-side authorization functions for the Soar yoga application.
 * All functions are designed to be used in API routes and server components to enforce
 * role-based access control and content ownership rules.
 *
 * @module authorization
 */

import { auth } from '../../auth'
import type { UserRole } from '../../types/models/user'
import type { Session } from 'next-auth'

/**
 * Requires an authenticated session. Throws an error if the user is not authenticated.
 *
 * @throws {Error} If no session exists (user not authenticated)
 * @returns {Promise<Session>} The authenticated session
 *
 * @example
 * ```typescript
 * // In an API route
 * export async function POST(req: Request) {
 *   const session = await requireAuth()
 *   // User is authenticated, proceed with logic
 *   const userId = session.user.id
 * }
 * ```
 */
export async function requireAuth(): Promise<Session> {
  const session = await auth()

  if (!session || !session.user) {
    throw new Error('Unauthorized - Please sign in')
  }

  // Reject null or invalid roles
  if (!session.user.role || !['user', 'admin'].includes(session.user.role)) {
    throw new Error('Unauthorized - Invalid or missing role. Please contact support.')
  }

  return session
}

/**
 * Requires the user to have one of the specified roles. Throws an error if the user
 * does not have any of the allowed roles.
 *
 * @param {UserRole[]} allowedRoles - Array of roles that are permitted
 * @throws {Error} If user doesn't have any of the required roles
 * @returns {Promise<Session>} The authenticated session with verified role
 *
 * @example
 * ```typescript
 * // Require admin role
 * export async function DELETE(req: Request) {
 *   const session = await requireRole(['admin'])
 *   // User is admin, can proceed with deletion
 * }
 *
 * // Allow multiple roles
 * export async function POST(req: Request) {
 *   const session = await requireRole(['admin', 'instructor'])
 *   // User has either admin or instructor role
 * }
 * ```
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<Session> {
  const session = await requireAuth()

  const userRole = session.user.role as UserRole

  // Extra safety check: reject null or invalid roles
  if (!userRole || !['user', 'admin'].includes(userRole)) {
    throw new Error('Forbidden - Invalid or missing role. Please contact support.')
  }

  if (!allowedRoles.includes(userRole)) {
    throw new Error(
      `Forbidden - Required role: ${allowedRoles.join(' or ')}. Your role: ${userRole}`
    )
  }

  return session
}

/**
 * Checks if the current user has admin role. This is a non-throwing boolean check
 * that can be used for conditional logic.
 *
 * @returns {Promise<boolean>} True if user is admin, false otherwise
 *
 * @example
 * ```typescript
 * // Conditionally show admin features
 * export async function GET(req: Request) {
 *   const userIsAdmin = await isAdmin()
 *
 *   const data = await fetchData()
 *   return Response.json({
 *     data,
 *     canEdit: userIsAdmin, // Include edit capability in response
 *   })
 * }
 * ```
 */
export async function isAdmin(): Promise<boolean> {
  const session = await auth()
  // Null roles are not admin - must have explicit 'admin' role
  return session?.user?.role === 'admin'
}

/**
 * Checks if the current user has a specific role. This is a non-throwing boolean check
 * useful for conditional logic and feature flags.
 *
 * @param {UserRole} role - The role to check for
 * @returns {Promise<boolean>} True if user has the specified role, false otherwise
 *
 * @example
 * ```typescript
 * // Check for specific role
 * export async function GET(req: Request) {
 *   const isInstructor = await hasRole('instructor')
 *
 *   if (isInstructor) {
 *     // Show instructor-specific content
 *   }
 * }
 * ```
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const session = await auth()
  // Null roles never match valid roles
  return !!(session?.user?.role && session.user.role === role)
}

/**
 * Checks if the current user can modify content. Content can be modified if:
 * 1. The user is an admin (admins can modify all content), OR
 * 2. The user is the creator of the content (content ownership)
 *
 * This function handles the ownership model where "PUBLIC" content can only be
 * modified by admins, while user-created content can be modified by the owner or admins.
 *
 * @param {string} contentCreatorId - The creator ID or "PUBLIC" for system content
 * @returns {Promise<boolean>} True if user can modify the content, false otherwise
 *
 * @example
 * ```typescript
 * // Check if user can edit an asana
 * export async function PUT(req: Request, { params }: { params: { id: string } }) {
 *   const asana = await prisma.asanaPose.findUnique({
 *     where: { id: params.id },
 *     select: { created_by: true }
 *   })
 *
 *   const canModify = await canModifyContent(asana.created_by)
 *
 *   if (!canModify) {
 *     return Response.json(
 *       { error: 'You do not have permission to modify this content' },
 *       { status: 403 }
 *     )
 *   }
 *
 *   // Proceed with modification
 * }
 * ```
 */
export async function canModifyContent(
  contentCreatorId: string
): Promise<boolean> {
  const session = await auth()

  if (!session || !session.user) {
    return false
  }

  // Reject null or invalid roles
  if (!session.user.role || !['user', 'admin'].includes(session.user.role)) {
    return false
  }

  // Admin users can modify all content
  if (session.user.role === 'admin') {
    return true
  }

  // "alpha users" and "PUBLIC" content can only be modified by admins
  if (contentCreatorId === 'PUBLIC' || contentCreatorId === 'alpha users') {
    return false
  }

  // User can modify their own content
  // Check against both user ID and email for flexibility
  return (
    contentCreatorId === session.user.id ||
    contentCreatorId === session.user.email
  )
}

/**
 * Type guard to check if a session has a valid role field.
 * Useful for TypeScript type narrowing in authorization logic.
 *
 * @param {Session | null} session - The session to check
 * @returns {boolean} True if session has a role field
 *
 * @example
 * ```typescript
 * const session = await auth()
 * if (hasValidRole(session)) {
 *   // TypeScript knows session.user.role exists here
 *   console.log(session.user.role)
 * }
 * ```
 */
export function hasValidRole(
  session: Session | null
): session is Session & { user: { role: UserRole } } {
  return !!(
    session?.user?.role && ['user', 'admin'].includes(session.user.role)
  )
}
