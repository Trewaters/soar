import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendReminderEmail(
  to: string,
  subject: string,
  html: string
) {
  await resend.emails.send({
    from: 'Uvuyoga <reminders@happyyoga.app>',
    to,
    subject,
    html,
  })
}
