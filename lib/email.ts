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
  // For testing without Resend API key, log to console
  if (!resend) {
    // In development, throw error to make it clear API key is needed
    if (process.env.NODE_ENV === 'development') {
      const error =
        'RESEND_API_KEY not configured. Please add your Resend API key to environment variables.'
      console.error(error)
      throw new Error(error)
    }

    // In production, just log and return (fallback behavior)
    return { data: { id: 'simulated' } }
  }

  try {
    const result = await resend.emails.send({
      from: 'Uvuyoga <reminders@happyyoga.app>',
      to,
      subject,
      html,
    })

    return result
  } catch (error) {
    console.error('Failed to send email via Resend:', error)
    throw error
  }
}
