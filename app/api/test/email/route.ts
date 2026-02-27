import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { sendReminderEmail } from '../../../../lib/email'
import { COLORS } from '@styles/theme'

export async function POST() {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'No authenticated user or email address found' },
      { status: 401 }
    )
  }

  try {
    await sendReminderEmail(
      session.user.email,
      'Soar Yoga Test Email 🧘‍♀️',
      `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: ${COLORS.successMain};">Soar Yoga Practice Reminder Test</h2>
          <p>Hello ${session.user.name || 'Yogi'},</p>
          <p>This is a test email notification from your Soar yoga app! 🧘‍♀️</p>
          <p>If you're receiving this, your email notifications are working perfectly.</p>
          <div style="margin: 20px 0; padding: 15px; background-color: ${COLORS.backgroundLight}; border-radius: 8px;">
            <p><strong>Test Details:</strong></p>
            <ul>
              <li>Sent to: ${session.user.email}</li>
              <li>Time: ${new Date().toLocaleString()}</li>
              <li>Purpose: Email notification test</li>
            </ul>
          </div>
          <p style="margin: 20px 0;">
            <a href="https://www.happyyoga.app/flows/practiceSeries" 
               style="background-color: ${COLORS.successMain}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Start Your Practice
            </a>
          </p>
          <p style="color: ${COLORS.textGray}; font-size: 14px; margin-top: 30px;">
            This is an automated test message from Soar Yoga App.<br>
            You can manage your notification preferences in your account settings.
          </p>
        </div>
      `
    )

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${session.user.email}`,
    })
  } catch (error) {
    console.error('Failed to send test email:', error)
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    )
  }
}
