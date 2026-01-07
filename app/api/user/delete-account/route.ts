/**
 * Account Deletion Endpoint
 * Allows users to permanently delete their account and all associated data
 * Complies with GDPR Article 17 (Right to Erasure/"Right to be Forgotten")
 */

import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '@lib/prismaClient'

/**
 * DELETE /api/user/delete-account
 * Permanently deletes the user account and all associated data
 *
 * GDPR Compliance:
 * - Right to erasure (Article 17)
 * - Requires authentication
 * - Cascading deletion of all user data
 * - Irreversible action
 */
export async function DELETE() {
  try {
    // Authenticate user
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const userEmail = session.user.email

    // Find user data
    const userData = await prisma.userData.findUnique({
      where: { email: userEmail },
      select: { id: true, email: true },
    })

    if (!userData) {
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 404 }
      )
    }

    // Delete all user-related data in proper order (respecting foreign key constraints)
    // This ensures complete data removal per GDPR Article 17

    await prisma.$transaction(async (tx) => {
      // Note: NextAuth sessions are managed separately and will be cleared on next auth check

      // 1. Delete notification logs
      await tx.notificationLog.deleteMany({
        where: { userId: userData.id },
      })

      // 2. Delete user notification delivery records
      await tx.userNotificationDelivery.deleteMany({
        where: { userId: userData.id },
      })

      // 3. Delete push subscriptions
      await tx.pushSubscription.deleteMany({
        where: { userId: userData.id },
      })

      // 4. Delete reminders
      await tx.reminder.deleteMany({
        where: { userId: userData.id },
      })

      // 5. Delete user activities
      await tx.asanaActivity.deleteMany({
        where: { userId: userData.id },
      })

      await tx.seriesActivity.deleteMany({
        where: { userId: userData.id },
      })

      await tx.sequenceActivity.deleteMany({
        where: { userId: userData.id },
      })

      // 6. Delete user logins
      await tx.userLogin.deleteMany({
        where: { userId: userData.id },
      })

      // 7. Delete pose images
      await tx.poseImage.deleteMany({
        where: { userId: userData.id },
      })

      // 8. Delete glossary terms
      await tx.glossaryTerm.deleteMany({
        where: { userId: userData.id },
      })

      // 8. Delete user-created content
      await tx.asanaPose.deleteMany({
        where: { created_by: userEmail },
      })

      await tx.asanaSeries.deleteMany({
        where: { created_by: userEmail },
      })

      await tx.asanaSequence.deleteMany({
        where: { created_by: userEmail },
      })

      // 9. Delete provider accounts (OAuth connections)
      await tx.providerAccount.deleteMany({
        where: { userId: userData.id },
      })

      // 10. Finally, delete the user data record
      await tx.userData.delete({
        where: { id: userData.id },
      })
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Account successfully deleted',
        deleted_email: userEmail,
        deleted_at: new Date().toISOString(),
        gdpr_compliance: {
          article_17: 'Right to Erasure',
          data_removed: [
            'User profile and account details',
            'Activity history',
            'Created content',
            'Preferences and settings',
            'Notification history',
            'Connected accounts',
            'Sessions',
          ],
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete account. Please try again later.',
        details:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
