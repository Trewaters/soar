/**
 * Daily Practice Reminder Email Template
 */

export interface DailyPracticeReminderData {
  userName: string
  customMessage?: string
  practiceUrl: string
  unsubscribeUrl: string
}

export function getDailyPracticeReminderEmail(
  data: DailyPracticeReminderData
): {
  subject: string
  html: string
  text: string
} {
  const subject = '🧘 Time for your yoga practice!'

  const text = `Hi ${data.userName},

${data.customMessage || "Your mat is calling. Let's flow! 🌟"}

Click here to start your practice:
${data.practiceUrl}

Namaste,
The Soar Team

---
To manage your notification preferences, visit:
${data.unsubscribeUrl}`

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Practice Time</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .emoji {
      font-size: 48px;
      margin-bottom: 20px;
    }
    h1 {
      color: #5e35b1;
      margin: 0;
      font-size: 24px;
    }
    .message {
      font-size: 18px;
      text-align: center;
      margin: 30px 0;
      color: #666;
    }
    .cta-button {
      display: inline-block;
      background-color: #5e35b1;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 6px;
      font-weight: 600;
      text-align: center;
      margin: 20px 0;
    }
    .button-container {
      text-align: center;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
    .footer a {
      color: #5e35b1;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="emoji">🧘</div>
      <h1>Time for your yoga practice!</h1>
    </div>
    
    <div class="message">
      Hi ${data.userName},<br><br>
      ${data.customMessage || "Your mat is calling. Let's flow! 🌟"}
    </div>
    
    <div class="button-container">
      <a href="${data.practiceUrl}" class="cta-button">Start Practice</a>
    </div>
    
    <div class="footer">
      <p>Namaste 🙏</p>
      <p>
        <a href="${data.unsubscribeUrl}">Manage notification preferences</a>
      </p>
    </div>
  </div>
</body>
</html>
  `

  return { subject, html, text }
}
