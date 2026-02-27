/**
 * Activity Streak Reminder Email Template
 */

import { COLORS } from '@styles/theme'

export interface ActivityStreakReminderData {
  userName: string
  streakCount: number
  reminderType: 'warning' | 'celebration'
  practiceUrl: string
  unsubscribeUrl: string
}

export function getActivityStreakReminderEmail(
  data: ActivityStreakReminderData
): {
  subject: string
  html: string
  text: string
} {
  const { subject, emoji, message, cta } = getStreakContent(
    data.reminderType,
    data.streakCount
  )

  const text = `Hi ${data.userName},

${message}

${cta}:
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
  <title>Activity Streak</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: ${COLORS.textDark};
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: ${COLORS.backgroundLight};
    }
    .container {
      background-color: ${COLORS.backgroundPaper};
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
      color: ${COLORS.emailPurple};
      margin: 0;
      font-size: 24px;
    }
    .streak-badge {
      background: ${
        data.reminderType === 'warning'
          ? `linear-gradient(135deg, ${COLORS.emailGradientLight1} 0%, ${COLORS.emailGradientLight2} 100%)`
          : `linear-gradient(135deg, ${COLORS.emailGradientDark1} 0%, ${COLORS.emailGradientDark2} 100%)`
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
      color: ${COLORS.textGray};
      text-align: center;
      margin: 25px 0;
      line-height: 1.8;
    }
    .quick-practice {
      background-color: ${COLORS.backgroundLight};
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    }
    .quick-practice h3 {
      color: ${COLORS.emailPurple};
      font-size: 16px;
      margin: 0 0 10px 0;
    }
    .quick-practice ul {
      margin: 0;
      padding-left: 20px;
    }
    .quick-practice li {
      color: ${COLORS.textGray};
      font-size: 14px;
      margin: 5px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: ${COLORS.emailPurple};
      color: ${COLORS.textInverse} !important;
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
      border-top: 1px solid ${COLORS.borderDivider};
      font-size: 12px;
      color: ${COLORS.shadowGray};
      text-align: center;
    }
    .footer a {
      color: ${COLORS.emailPurple};
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
      <div class="streak-label">Day Practice Streak</div>
    </div>
    
    <div class="message">
      ${message}
    </div>
    
    ${
      data.reminderType === 'warning'
        ? `
    <div class="quick-practice">
      <h3>Quick 10-Minute Practices:</h3>
      <ul>
        <li>🌅 Morning Sun Salutation Flow</li>
        <li>🧘 Gentle Stretching Sequence</li>
        <li>🌙 Evening Wind-Down Practice</li>
        <li>💪 Core Strength Builder</li>
      </ul>
    </div>
    `
        : ''
    }
    
    <div class="button-container">
      <a href="${data.practiceUrl}" class="cta-button">${cta}</a>
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
  type: 'warning' | 'celebration',
  count: number
): { subject: string; emoji: string; message: string; cta: string } {
  switch (type) {
    case 'warning':
      return {
        subject: `Your ${count}-day practice streak is at risk!`,
        emoji: '⚠️',
        message: `You've been practicing for ${count} days in a row, but we haven't logged a practice today. Take 10 minutes to keep your streak alive! 🧘`,
        cta: 'Start Quick Practice',
      }
    case 'celebration':
      return {
        subject: `🔥 ${count} Days of Consistent Practice!`,
        emoji: '🔥',
        message: `Incredible! You've practiced yoga for ${count} days straight! Your dedication is truly inspiring. Keep flowing! 🌟`,
        cta: 'Continue Your Journey',
      }
  }
}
