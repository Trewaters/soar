/**
 * Login Streak Reminder Email Template
 */

export interface LoginStreakReminderData {
  userName: string
  streakCount: number
  reminderType: 'warning' | 'celebration' | 'reengagement'
  loginUrl: string
  unsubscribeUrl: string
}

export function getLoginStreakReminderEmail(data: LoginStreakReminderData): {
  subject: string
  html: string
  text: string
} {
  const { subject, emoji, message } = getStreakContent(
    data.reminderType,
    data.streakCount
  )

  const text = `Hi ${data.userName},

${message}

${
  data.reminderType === 'warning'
    ? `Log in now to maintain your ${data.streakCount}-day streak:\n${data.loginUrl}`
    : `Keep it up! Visit your dashboard:\n${data.loginUrl}`
}

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
  <title>Login Streak</title>
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
      font-size: 64px;
      margin-bottom: 20px;
    }
    h1 {
      color: #5e35b1;
      margin: 0;
      font-size: 24px;
    }
    .streak-badge {
      background: ${
        data.reminderType === 'warning'
          ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
      };
      color: white;
      padding: 20px 30px;
      border-radius: 12px;
      margin: 30px 0;
      text-align: center;
    }
    .streak-count {
      font-size: 48px;
      font-weight: bold;
      margin: 10px 0;
    }
    .streak-label {
      font-size: 16px;
      opacity: 0.9;
    }
    .message {
      font-size: 16px;
      color: #666;
      text-align: center;
      margin: 25px 0;
      line-height: 1.8;
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
      <div class="emoji">${emoji}</div>
      <h1>${subject}</h1>
    </div>
    
    <div class="streak-badge">
      <div class="streak-count">${data.streakCount}</div>
      <div class="streak-label">Day Streak</div>
    </div>
    
    <div class="message">
      ${message}
    </div>
    
    <div class="button-container">
      <a href="${data.loginUrl}" class="cta-button">
        ${data.reminderType === 'warning' ? 'Log In Now' : 'Visit Dashboard'}
      </a>
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

function getStreakContent(
  type: 'warning' | 'celebration' | 'reengagement',
  count: number
): { subject: string; emoji: string; message: string } {
  switch (type) {
    case 'warning':
      return {
        subject: '⚠️ Your login streak is at risk!',
        emoji: '⚠️',
        message: `You've been logging in for ${count} days straight, but we haven't seen you today. Don't break your streak!`,
      }
    case 'celebration':
      return {
        subject: `🔥 ${count} Day Login Streak!`,
        emoji: '🔥',
        message: `Amazing! You've logged in for ${count} days straight! Keep up the consistency! 🎉`,
      }
    case 'reengagement':
      return {
        subject: "We miss you! Let's restart your journey",
        emoji: '💜',
        message: `Your streak may have ended, but every day is a new opportunity to begin again. We're here to support your yoga journey!`,
      }
  }
}
