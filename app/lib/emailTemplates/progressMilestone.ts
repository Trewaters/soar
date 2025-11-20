/**
 * Progress Milestone Email Template
 */

export interface ProgressMilestoneData {
  userName: string
  milestoneType: 'sessions' | 'streak' | 'goal' | 'first_time'
  milestoneValue: number | string
  milestoneDescription: string
  dashboardUrl: string
  unsubscribeUrl: string
}

export function getProgressMilestoneEmail(data: ProgressMilestoneData): {
  subject: string
  html: string
  text: string
} {
  const emoji = data.milestoneType === 'sessions' ? '🎊' : '🔥'
  const subject = `${emoji} Milestone Achievement: ${data.milestoneDescription}`

  const text = `Hi ${data.userName},

Congratulations! 🎉

You've reached a new milestone:
${data.milestoneDescription}

${getMilestoneMessage(data.milestoneType, data.milestoneValue)}

View your complete stats:
${data.dashboardUrl}

Keep up the amazing work!

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
  <title>Milestone Achievement</title>
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
      font-size: 28px;
    }
    .milestone-badge {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 30px;
      border-radius: 12px;
      margin: 30px 0;
      text-align: center;
    }
    .milestone-value {
      font-size: 36px;
      font-weight: bold;
      margin: 10px 0;
    }
    .milestone-description {
      font-size: 18px;
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
      <h1>Congratulations!</h1>
    </div>
    
    <div class="milestone-badge">
      <div class="milestone-value">${data.milestoneValue}</div>
      <div class="milestone-description">${data.milestoneDescription}</div>
    </div>
    
    <div class="message">
      ${getMilestoneMessage(data.milestoneType, data.milestoneValue)}
    </div>
    
    <div class="button-container">
      <a href="${data.dashboardUrl}" class="cta-button">View Your Stats</a>
    </div>
    
    <div class="footer">
      <p>Keep up the amazing work! 🙏</p>
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

function getMilestoneMessage(type: string, value: number | string): string {
  switch (type) {
    case 'sessions':
      return `You've completed ${value} yoga sessions! You're building an incredible practice. 🌈`
    case 'streak':
      return `You've maintained your practice for ${value} days in a row! That's dedication and discipline. 🔥`
    case 'goal':
      return `You've achieved your monthly practice goal! Your commitment is inspiring. 🎯`
    case 'first_time':
      return `You've taken an important first step: ${value}. Every journey begins with a single breath. 🌟`
    default:
      return "You've reached a new milestone in your yoga journey!"
  }
}
