import { Resend } from 'resend'

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export async function sendReminderEmail(
  to: string,
  subject: string,
  html: string
) {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured, skipping email send')
    return
  }

  await resend.emails.send({
    from: 'Uvuyoga <reminders@happyyoga.app>',
    to,
    subject,
    html,
  })
}
