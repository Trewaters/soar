'use client'

import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import type { Session } from 'next-auth'

/**
 * Hook to determine if the current user can edit specific content
 * based on ownership and admin status
 *
 * @param created_by - The creator ID ('PUBLIC' for system content or userId)
 * @returns Object with canEdit boolean and reason string
 *
 * @example
 * ```tsx
 * const { canEdit, reason } = useCanEditContent(asana.created_by)
 * if (!canEdit) {
 *   console.log(reason) // "Only admins can modify PUBLIC content"
 * }
 * ```
 */
export function useCanEditContent(created_by?: string | null) {
  const { data: session } = useSession() as {
    data: Session | null
    status: string
  }

  return useMemo(() => {
    // No session = cannot edit
    if (!session?.user?.id) {
      return {
        canEdit: false,
        reason: 'Please sign in to edit content',
        isOwner: false,
        isAdmin: false,
      }
    }

    const userId = session.user.id
    const userRole = session.user.role || 'user'
    const isAdmin = userRole === 'admin'
    const isOwner = created_by === userId
    const isPublic = created_by === 'PUBLIC'

    // Admins can edit everything
    if (isAdmin) {
      return {
        canEdit: true,
        reason: 'Admin privileges',
        isOwner,
        isAdmin: true,
      }
    }

    // Users can only edit their own content
    if (isOwner) {
      return {
        canEdit: true,
        reason: 'You own this content',
        isOwner: true,
        isAdmin: false,
      }
    }

    // Cannot edit PUBLIC or other users' content
    if (isPublic) {
      return {
        canEdit: false,
        reason: 'Only admins can modify PUBLIC content',
        isOwner: false,
        isAdmin: false,
      }
    }

    return {
      canEdit: false,
      reason: 'You can only edit your own content',
      isOwner: false,
      isAdmin: false,
    }
  }, [session?.user?.id, session?.user?.role, created_by])
}

/**
 * Hook to check if current user is admin
 * @returns boolean indicating admin status
 */
export function useIsAdmin() {
  const { data: session } = useSession() as {
    data: Session | null
    status: string
  }
  return useMemo(() => {
    return session?.user?.role === 'admin'
  }, [session?.user?.role])
}
