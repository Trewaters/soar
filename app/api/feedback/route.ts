import { NextRequest, NextResponse } from 'next/server'
import * as nodemailer from 'nodemailer'
import { auth } from '../../../auth'

// Force this route to be dynamic since it requires authentication
export const dynamic = 'force-dynamic'

interface FeedbackData {
  name: string
  email: string
  sessionDate: string
  overallRating: number
  wouldRecommend: string
  difficultyLevel: string
  pacing: string
  favoriteContent: string
  technicalIssues: string
  navigationRating: number
  easeOfUse: number
  suggestions: string
  instructorRequests: string
  experienceWords: string
  motivation: string
  practiceFrequency: string
  yogaMotivation: string
  userId?: string
  userAgent?: string
  timestamp?: string
}

// Configure nodemailer transporter
const createTransporter = () => {
  if (process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_PORT) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT),
      secure: process.env.EMAIL_SERVER_PORT === '465',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })
  }

  // Fallback to Gmail if environment variables not set
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

const getRatingEmoji = (rating: number): string => {
  if (rating >= 5) return '😊 Excellent'
  if (rating >= 3) return '⭐ Good'
  if (rating >= 1) return '👎 Poor'
  return 'Not rated'
}

const formatFeedbackEmail = (data: FeedbackData): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
    .section { background: white; margin: 20px 0; padding: 15px; border-radius: 8px; border-left: 4px solid #4CAF50; }
    .rating { font-size: 18px; font-weight: bold; }
    .metadata { background: #e8f5e8; padding: 10px; border-radius: 4px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧘‍♀️ New Feedback from SOAR Yoga App</h1>
    </div>
    
    <div class="content">
      <div class="section">
        <h3>📋 General Information</h3>
        <p><strong>Name:</strong> ${data.name || 'Anonymous'}</p>
        <p><strong>Email:</strong> ${data.email || 'Not provided'}</p>
        <p><strong>Session Date:</strong> ${data.sessionDate}</p>
        <p><strong>Submitted:</strong> ${data.timestamp ? new Date(data.timestamp).toLocaleString() : 'Unknown'}</p>
      </div>

      <div class="section">
        <h3>🌟 Overall Experience</h3>
        <p class="rating"><strong>Overall Rating:</strong> ${getRatingEmoji(data.overallRating)}</p>
        <p><strong>Would Recommend:</strong> ${data.wouldRecommend || 'Not answered'}</p>
      </div>

      <div class="section">
        <h3>🧘‍♀️ Yoga Content Feedback</h3>
        <p><strong>Difficulty Level:</strong> ${data.difficultyLevel || 'Not specified'}</p>
        <p><strong>Pacing:</strong> ${data.pacing || 'Not specified'}</p>
        <p><strong>Favorite Content:</strong> ${data.favoriteContent || 'None specified'}</p>
      </div>

      <div class="section">
        <h3>🎯 App Functionality</h3>
        <p><strong>Technical Issues:</strong> ${data.technicalIssues || 'None reported'}</p>
        <p><strong>Navigation Rating:</strong> ${data.navigationRating ? `${data.navigationRating}/5` : 'Not rated'}</p>
        <p><strong>Ease of Use:</strong> ${data.easeOfUse ? `${data.easeOfUse}/5` : 'Not rated'}</p>
      </div>

      <div class="section">
        <h3>💡 Suggestions & Improvements</h3>
        <p><strong>Suggestions:</strong> ${data.suggestions || 'None provided'}</p>
        <p><strong>Instructor Requests:</strong> ${data.instructorRequests || 'None provided'}</p>
      </div>

      <div class="section">
        <h3>💬 User Sentiment</h3>
        <p><strong>Experience in 3 Words:</strong> ${data.experienceWords || 'Not provided'}</p>
        <p><strong>What Keeps Them Coming Back:</strong> ${data.motivation || 'Not provided'}</p>
      </div>

      <div class="section">
        <h3>📆 Engagement & Motivation</h3>
        <p><strong>Practice Frequency:</strong> ${data.practiceFrequency || 'Not specified'}</p>
        <p><strong>Yoga Motivation:</strong> ${data.yogaMotivation || 'Not provided'}</p>
      </div>

      <div class="metadata">
        <p><strong>Technical Details:</strong></p>
        <p>User ID: ${data.userId || 'Unknown'}</p>
        <p>User Agent: ${data.userAgent || 'Unknown'}</p>
      </div>
    </div>
  </div>
</body>
</html>
  `
}

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const feedbackData: FeedbackData = await request.json()

    // Validate required fields
    if (
      !feedbackData.overallRating &&
      !feedbackData.suggestions &&
      !feedbackData.technicalIssues
    ) {
      return NextResponse.json(
        {
          error:
            'Please provide at least a rating, suggestion, or technical issue report',
        },
        { status: 400 }
      )
    }

    // Create email transporter
    const transporter = createTransporter()

    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.GMAIL_USER,
      to: process.env.DEVELOPER_EMAIL || 'trewaters@hotmail.com',
      subject: `Feedback from SOAR Yoga App - Rating: ${getRatingEmoji(feedbackData.overallRating)}`,
      html: formatFeedbackEmail(feedbackData),
      text: `
New Feedback from SOAR Yoga App

Name: ${feedbackData.name || 'Anonymous'}
Email: ${feedbackData.email || 'Not provided'}
Overall Rating: ${getRatingEmoji(feedbackData.overallRating)}
Would Recommend: ${feedbackData.wouldRecommend || 'Not answered'}

Difficulty Level: ${feedbackData.difficultyLevel || 'Not specified'}
Pacing: ${feedbackData.pacing || 'Not specified'}
Favorite Content: ${feedbackData.favoriteContent || 'None specified'}

Technical Issues: ${feedbackData.technicalIssues || 'None reported'}
Navigation Rating: ${feedbackData.navigationRating ? `${feedbackData.navigationRating}/5` : 'Not rated'}
Ease of Use: ${feedbackData.easeOfUse ? `${feedbackData.easeOfUse}/5` : 'Not rated'}

Suggestions: ${feedbackData.suggestions || 'None provided'}
Instructor Requests: ${feedbackData.instructorRequests || 'None provided'}

Experience in 3 Words: ${feedbackData.experienceWords || 'Not provided'}
What Keeps Them Coming Back: ${feedbackData.motivation || 'Not provided'}

Practice Frequency: ${feedbackData.practiceFrequency || 'Not specified'}
Yoga Motivation: ${feedbackData.yogaMotivation || 'Not provided'}

Technical Details:
User ID: ${feedbackData.userId || 'Unknown'}
User Agent: ${feedbackData.userAgent || 'Unknown'}
Timestamp: ${feedbackData.timestamp || 'Unknown'}
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      { message: 'Feedback sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending feedback email:', error)
    return NextResponse.json(
      { error: 'Failed to send feedback' },
      { status: 500 }
    )
  }
}
