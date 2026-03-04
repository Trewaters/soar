/**
 * New Feature Announcement Email Template
 */

export interface FeatureAnnouncementData {
  userName: string
  featureTitle: string
  featureDescription: string
  featureContent: string
  featureUrl: string
  unsubscribeUrl: string
}

export function getNewFeatureAnnouncementEmail(data: FeatureAnnouncementData): {
  subject: string
  html: string
  text: string
} {
  const subject = `🆕 New Feature: ${data.featureTitle}`

  const text = `Hi ${data.userName},

We're excited to announce a new feature in Soar!

${data.featureTitle}
${data.featureDescription}

${data.featureContent}

Try it now:
${data.featureUrl}

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
  <title>New Feature</title>
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
      margin: 0 0 10px 0;
      font-size: 24px;
    }
    h2 {
      color: #7e57c2;
      margin: 20px 0 10px 0;
      font-size: 20px;
    }
    .description {
      font-size: 16px;
      color: #666;
      margin-bottom: 20px;
    }
    .content {
      font-size: 15px;
      line-height: 1.8;
      color: #555;
      margin: 20px 0;
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
      <div class="emoji">🆕</div>
      <p style="color: #999; font-size: 14px; margin: 0;">NEW FEATURE</p>
    </div>
    
    <h1>${data.featureTitle}</h1>
    <p class="description">${data.featureDescription}</p>
    
    <div class="content">
      ${data.featureContent}
    </div>
    
    <div class="button-container">
      <a href="${data.featureUrl}" class="cta-button">Try It Now</a>
    </div>
    
    <div class="footer">
      <p>Happy practicing! 🙏</p>
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
