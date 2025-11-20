/**
 * GDPR-Compliant Data Download Endpoint
 * Allows users to download all their personal data in JSON format
 * Complies with GDPR Article 15 (Right of Access) and Article 20 (Right to Data Portability)
 */

import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '@lib/prismaClient'

/**
 * GET /api/user/download-data
 * Generates a comprehensive JSON export of all user data
 *
 * GDPR Compliance:
 * - Provides data in structured, machine-readable format (JSON)
 * - Includes all personal data categories
 * - Requires authentication (user can only download their own data)
 * - Data is generated on-demand (not stored)
 */
export async function GET() {
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

    // Fetch user data
    const userData = await prisma.userData.findUnique({
      where: { email: userEmail },
      include: {
        providerAccounts: {
          select: {
            provider: true,
            createdAt: true,
            updatedAt: true,
            // Exclude sensitive tokens
          },
        },
        asanaActivities: {
          select: {
            id: true,
            asanaId: true,
            asanaName: true,
            datePerformed: true,
            notes: true,
            createdAt: true,
          },
        },
        seriesActivities: {
          select: {
            id: true,
            seriesId: true,
            seriesName: true,
            datePerformed: true,

            notes: true,
            createdAt: true,
          },
        },
        sequenceActivities: {
          select: {
            id: true,
            sequenceId: true,
            sequenceName: true,
            datePerformed: true,

            notes: true,
            createdAt: true,
          },
        },
        userLogins: {
          select: {
            id: true,
            loginDate: true,
            createdAt: true,
          },
          orderBy: {
            loginDate: 'desc',
          },
        },
        poseImages: {
          select: {
            id: true,
            url: true,
            createdAt: true,
          },
        },
        glossaryTerms: {
          select: {
            id: true,
            term: true,
            category: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        reminders: {
          select: {
            id: true,
            timeOfDay: true,
            days: true,
            enabled: true,
            message: true,
            emailNotificationsEnabled: true,
            notificationPreferences: true,
          },
        },
        pushSubscriptions: {
          select: {
            id: true,
            endpoint: true,
            createdAt: true,
            // Exclude encryption keys for security
          },
        },
      },
    })

    if (!userData) {
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 404 }
      )
    }

    // Fetch created content by user
    const [createdAsanas, createdSeries, createdSequences] = await Promise.all([
      prisma.asanaPose.findMany({
        where: { created_by: userEmail },
        select: {
          id: true,
          sort_english_name: true,
          sanskrit_names: true,
          english_names: true,
          description: true,
          category: true,
          difficulty: true,
          created_on: true,
          updated_on: true,
        },
      }),
      prisma.asanaSeries.findMany({
        where: { created_by: userEmail },
        select: {
          id: true,
          seriesName: true,
          description: true,
          durationSeries: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.asanaSequence.findMany({
        where: { created_by: userEmail },
        select: {
          id: true,
          nameSequence: true,
          description: true,
          durationSequence: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ])

    // Fetch notification log (user's notification history)
    const notificationLog = await prisma.notificationLog.findMany({
      where: { userId: userData.id },
      select: {
        id: true,
        notificationType: true,
        sentAt: true,
        sentVia: true,
      },
      orderBy: {
        sentAt: 'desc',
      },
      take: 100, // Limit to last 100 notifications
    })

    // Structure comprehensive data export following GDPR guidelines
    const dataExport = {
      // Export metadata
      export_info: {
        generated_at: new Date().toISOString(),
        format_version: '1.0',
        data_categories: [
          'profile_information',
          'account_details',
          'activity_history',
          'created_content',
          'preferences',
          'notification_history',
        ],
        compliance: {
          gdpr_article_15: 'Right of Access',
          gdpr_article_20: 'Right to Data Portability',
        },
      },

      // Personal Information (GDPR Art. 15(1)(a-c))
      profile_information: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        email_verified: userData.emailVerified,
        first_name: userData.firstName,
        last_name: userData.lastName,
        pronouns: userData.pronouns,
        bio: userData.bio,
        headline: userData.headline,
        location: userData.location,
        website_url: userData.websiteURL,
        social_url: userData.socialURL,
        company: userData.company,
        yoga_style: userData.yogaStyle,
        yoga_experience: userData.yogaExperience,
        share_quick: userData.shareQuick,
        is_location_public: userData.isLocationPublic,
        role: userData.role,
        timezone: userData.tz,
        profile_images: userData.profileImages,
        active_profile_image: userData.activeProfileImage,
        profile_metadata: userData.profile,
      },

      // Account Details
      account_details: {
        account_created: userData.createdAt,
        last_updated: userData.updatedAt,
        provider_id: userData.provider_id,
        connected_accounts: userData.providerAccounts.map((account) => ({
          provider: account.provider,
          connected_at: account.createdAt,
          last_updated: account.updatedAt,
        })),
      },

      // Activity History (GDPR Art. 15(1)(h))
      activity_history: {
        asana_activities: userData.asanaActivities,
        series_activities: userData.seriesActivities,
        sequence_activities: userData.sequenceActivities,
        login_history: userData.userLogins,
        total_sessions:
          userData.asanaActivities.length +
          userData.seriesActivities.length +
          userData.sequenceActivities.length,
      },

      // User-Created Content
      created_content: {
        asanas: createdAsanas,
        series: createdSeries,
        sequences: createdSequences,
        pose_images: userData.poseImages,
        glossary_terms: userData.glossaryTerms,
      },

      // Preferences and Settings
      preferences: {
        reminders: userData.reminders,
        push_subscriptions_count: userData.pushSubscriptions.length,
        notification_preferences:
          userData.reminders[0]?.notificationPreferences || null,
      },

      // Notification History
      notification_history: {
        recent_notifications: notificationLog,
        total_notifications_sent: notificationLog.length,
      },

      // Data Usage Information (Transparency)
      data_usage_information: {
        purposes: [
          'Providing yoga practice tracking and management',
          'Personalizing user experience',
          'Sending practice reminders and notifications',
          'Storing user-created content (asanas, series, sequences)',
          'Maintaining account security and authentication',
        ],
        legal_basis: 'Consent and Contract Performance (GDPR Art. 6(1)(a)(b))',
        retention_period: 'Data retained while account is active',
        data_sharing: 'No third-party sharing without explicit consent',
      },

      // User Rights (GDPR Information)
      your_rights: {
        right_to_access: 'You are exercising this right now',
        right_to_rectification: 'Edit your profile at /navigator/profile',
        right_to_erasure:
          'Delete your account at /navigator/profile/privacy-settings',
        right_to_restrict_processing:
          'Manage preferences at /navigator/profile/settings/notifications',
        right_to_data_portability: 'You are exercising this right now',
        right_to_object:
          'Manage data sharing at /navigator/profile/privacy-settings',
        contact: 'For data privacy questions, contact your administrator',
      },
    }

    // Return data as JSON with proper headers for download
    const response = NextResponse.json(dataExport)

    // Set headers for file download
    response.headers.set(
      'Content-Disposition',
      `attachment; filename="soar-account-data-${new Date().toISOString().split('T')[0]}.json"`
    )
    response.headers.set('Content-Type', 'application/json')

    return response
  } catch (error) {
    console.error('Error generating data export:', error)
    return NextResponse.json(
      { error: 'Failed to generate data export. Please try again later.' },
      { status: 500 }
    )
  }
}
