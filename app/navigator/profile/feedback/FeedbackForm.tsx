'use client'
import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material'
import {
  SentimentVerySatisfied,
  Star,
  ThumbDown,
  Send as SendIcon,
} from '@mui/icons-material'
import { useSession } from 'next-auth/react'

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
}

const initialFormData: FeedbackData = {
  name: '',
  email: '',
  sessionDate: '',
  overallRating: 0,
  wouldRecommend: '',
  difficultyLevel: '',
  pacing: '',
  favoriteContent: '',
  technicalIssues: '',
  navigationRating: 0,
  easeOfUse: 0,
  suggestions: '',
  instructorRequests: '',
  experienceWords: '',
  motivation: '',
  practiceFrequency: '',
  yogaMotivation: '',
}

const RatingButton: React.FC<{
  value: number
  currentValue: number
  onChange: (value: number) => void
  icon: React.ReactNode
  label: string
  color: 'success' | 'warning' | 'error'
}> = ({ value, currentValue, onChange, icon, label, color }) => (
  <Button
    variant={currentValue === value ? 'contained' : 'outlined'}
    color={color}
    onClick={() => onChange(value)}
    startIcon={icon}
    sx={{
      minWidth: 120,
      '&:hover': {
        transform: 'scale(1.05)',
      },
      transition: 'transform 0.2s',
    }}
  >
    {label}
  </Button>
)

const ScaleRating: React.FC<{
  value: number
  // eslint-disable-next-line no-unused-vars
  onChange: (_value: number) => void
  label: string
}> = ({ value, onChange, label }) => (
  <FormControl component="fieldset">
    <FormLabel component="legend" sx={{ mb: 1 }}>
      {label}
    </FormLabel>
    <Stack direction="row" spacing={1}>
      {[1, 2, 3, 4, 5].map((rating) => (
        <Button
          key={rating}
          variant={value === rating ? 'contained' : 'outlined'}
          color={rating <= 2 ? 'error' : rating <= 3 ? 'warning' : 'success'}
          onClick={() => onChange(rating)}
          sx={{ minWidth: 40, height: 40 }}
        >
          {rating}
        </Button>
      ))}
    </Stack>
  </FormControl>
)

const FeedbackForm: React.FC = () => {
  const { data: session } = useSession()
  const [formData, setFormData] = useState<FeedbackData>({
    ...initialFormData,
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    sessionDate: new Date().toISOString().split('T')[0],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (
    field: keyof FeedbackData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateFeedbackEmail = () => {
    const developerEmail = 'trewaters@hotmail.com'
    const subject = `Feedback from SOAR Yoga App - Rating: ${getRatingEmoji(formData.overallRating)}`

    const emailBody = `
Dear Developer,

I'm sending you feedback about the SOAR Yoga App:

📋 GENERAL INFORMATION
Name: ${formData.name || 'Anonymous'}
Email: ${formData.email || 'Not provided'}
Session Date: ${formData.sessionDate}
Submitted: ${new Date().toLocaleString()}

🌟 OVERALL EXPERIENCE
Overall Rating: ${getRatingEmoji(formData.overallRating)}
Would Recommend: ${formData.wouldRecommend || 'Not answered'}

🧘‍♀️ YOGA CONTENT FEEDBACK
Difficulty Level: ${formData.difficultyLevel || 'Not specified'}
Pacing: ${formData.pacing || 'Not specified'}
Favorite Content: ${formData.favoriteContent || 'None specified'}

🎯 APP FUNCTIONALITY
Technical Issues: ${formData.technicalIssues || 'None reported'}
Navigation Rating: ${formData.navigationRating ? `${formData.navigationRating}/5` : 'Not rated'}
Ease of Use: ${formData.easeOfUse ? `${formData.easeOfUse}/5` : 'Not rated'}

💡 SUGGESTIONS & IMPROVEMENTS
Suggestions: ${formData.suggestions || 'None provided'}
Instructor Requests: ${formData.instructorRequests || 'None provided'}

💬 USER SENTIMENT
Experience in 3 Words: ${formData.experienceWords || 'Not provided'}
What Keeps Me Coming Back: ${formData.motivation || 'Not provided'}

📆 ENGAGEMENT & MOTIVATION
Practice Frequency: ${formData.practiceFrequency || 'Not specified'}
Yoga Motivation: ${formData.yogaMotivation || 'Not provided'}

🔧 TECHNICAL DETAILS
User ID: ${session?.user?.id || 'Unknown'}
User Agent: ${navigator.userAgent || 'Unknown'}
Timestamp: ${new Date().toISOString()}

Best regards,
${formData.name || 'A SOAR Yoga App User'}
    `

    return `mailto:${developerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`
  }

  const getRatingEmoji = (rating: number): string => {
    if (rating >= 5) return '😊 Excellent'
    if (rating >= 3) return '⭐ Good'
    if (rating >= 1) return '👎 Poor'
    return 'Not rated'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Validate that at least one meaningful field is filled
      if (
        !formData.overallRating &&
        !formData.suggestions &&
        !formData.technicalIssues &&
        !formData.favoriteContent &&
        !formData.experienceWords
      ) {
        throw new Error(
          'Please provide at least a rating, suggestion, or some feedback before submitting'
        )
      }

      // Generate mailto link and open user's email client
      const mailtoLink = generateFeedbackEmail()
      window.open(mailtoLink, '_blank')

      // Clear form data after successful submission
      setFormData({
        ...initialFormData,
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        sessionDate: new Date().toISOString().split('T')[0],
      })

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card sx={{ textAlign: 'center', p: 4 }}>
        <CardContent>
          <SentimentVerySatisfied
            sx={{ fontSize: 64, color: 'success.main', mb: 2 }}
          />
          <Typography variant="h4" gutterBottom>
            Email Client Opened!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your feedback has been prepared and your email client should have
            opened. Please send the email to complete your feedback submission.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setSubmitted(false)
              setFormData({
                ...initialFormData,
                name: session?.user?.name || '',
                email: session?.user?.email || '',
                sessionDate: new Date().toISOString().split('T')[0],
              })
            }}
            sx={{ mt: 3 }}
          >
            Send Another Feedback
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={4}>
        {/* General Information */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              🔍 General Information
            </Typography>
            <Stack spacing={3}>
              <TextField
                label="Name (Optional)"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                fullWidth
              />
              <TextField
                label="Email (Optional)"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                fullWidth
                helperText="Only if you'd like us to follow up"
              />
              <TextField
                label="Session Date or Last Practice"
                type="date"
                value={formData.sessionDate}
                onChange={(e) =>
                  handleInputChange('sessionDate', e.target.value)
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Overall Experience */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              🌟 Overall Experience
            </Typography>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  How would you rate your overall experience?
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
                  <RatingButton
                    value={5}
                    currentValue={formData.overallRating}
                    onChange={(value) =>
                      handleInputChange('overallRating', value)
                    }
                    icon={<SentimentVerySatisfied />}
                    label="Excellent"
                    color="success"
                  />
                  <RatingButton
                    value={3}
                    currentValue={formData.overallRating}
                    onChange={(value) =>
                      handleInputChange('overallRating', value)
                    }
                    icon={<Star />}
                    label="Good"
                    color="warning"
                  />
                  <RatingButton
                    value={1}
                    currentValue={formData.overallRating}
                    onChange={(value) =>
                      handleInputChange('overallRating', value)
                    }
                    icon={<ThumbDown />}
                    label="Poor"
                    color="error"
                  />
                </Stack>
              </Box>

              <FormControl component="fieldset">
                <FormLabel component="legend">
                  Would you recommend this app to others?
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.wouldRecommend}
                  onChange={(e) =>
                    handleInputChange('wouldRecommend', e.target.value)
                  }
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                  <FormControlLabel
                    value="maybe"
                    control={<Radio />}
                    label="Maybe"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        {/* Yoga Content Specific */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              🧘‍♀️ Yoga Content Feedback
            </Typography>
            <Stack spacing={3}>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  Was the difficulty level appropriate?
                </FormLabel>
                <RadioGroup
                  value={formData.difficultyLevel}
                  onChange={(e) =>
                    handleInputChange('difficultyLevel', e.target.value)
                  }
                >
                  <FormControlLabel
                    value="too-easy"
                    control={<Radio />}
                    label="Too Easy"
                  />
                  <FormControlLabel
                    value="just-right"
                    control={<Radio />}
                    label="Just Right"
                  />
                  <FormControlLabel
                    value="too-hard"
                    control={<Radio />}
                    label="Too Hard"
                  />
                </RadioGroup>
              </FormControl>

              <FormControl component="fieldset">
                <FormLabel component="legend">
                  Was the pacing comfortable?
                </FormLabel>
                <RadioGroup
                  value={formData.pacing}
                  onChange={(e) => handleInputChange('pacing', e.target.value)}
                >
                  <FormControlLabel
                    value="too-fast"
                    control={<Radio />}
                    label="Too Fast"
                  />
                  <FormControlLabel
                    value="just-right"
                    control={<Radio />}
                    label="Just Right"
                  />
                  <FormControlLabel
                    value="too-slow"
                    control={<Radio />}
                    label="Too Slow"
                  />
                </RadioGroup>
              </FormControl>

              <TextField
                label="Favorite practice or sequence"
                value={formData.favoriteContent}
                onChange={(e) =>
                  handleInputChange('favoriteContent', e.target.value)
                }
                fullWidth
                multiline
                rows={2}
                helperText="Tell us what you enjoyed most!"
              />
            </Stack>
          </CardContent>
        </Card>

        {/* App Functionality */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              🎯 App Functionality
            </Typography>
            <Stack spacing={3}>
              <TextField
                label="Did you encounter any technical issues?"
                value={formData.technicalIssues}
                onChange={(e) =>
                  handleInputChange('technicalIssues', e.target.value)
                }
                fullWidth
                multiline
                rows={3}
                placeholder="Describe any bugs, crashes, or technical problems you experienced"
              />

              <ScaleRating
                value={formData.navigationRating}
                onChange={(value) =>
                  handleInputChange('navigationRating', value)
                }
                label="Was the navigation intuitive? (1 = Confusing, 5 = Very Easy)"
              />

              <ScaleRating
                value={formData.easeOfUse}
                onChange={(value) => handleInputChange('easeOfUse', value)}
                label="How easy was it to find and start a session? (1 = Very Hard, 5 = Very Easy)"
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Suggestions & Improvements */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              💡 Suggestions & Improvements
            </Typography>
            <Stack spacing={3}>
              <TextField
                label="Is there anything you'd like to see added or changed?"
                value={formData.suggestions}
                onChange={(e) =>
                  handleInputChange('suggestions', e.target.value)
                }
                fullWidth
                multiline
                rows={4}
                placeholder="Share your ideas for new features, improvements, or changes"
              />

              <TextField
                label="Any instructors or styles you'd love to experience?"
                value={formData.instructorRequests}
                onChange={(e) =>
                  handleInputChange('instructorRequests', e.target.value)
                }
                fullWidth
                multiline
                rows={2}
                placeholder="Let us know about specific yoga styles or instructor preferences"
              />
            </Stack>
          </CardContent>
        </Card>

        {/* User Sentiment */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              💬 User Sentiment
            </Typography>
            <Stack spacing={3}>
              <TextField
                label="Describe your experience in 3 words"
                value={formData.experienceWords}
                onChange={(e) =>
                  handleInputChange('experienceWords', e.target.value)
                }
                fullWidth
                placeholder="e.g., Relaxing, Challenging, Inspiring"
              />

              <TextField
                label="What kept you coming back (or what would encourage you to)?"
                value={formData.motivation}
                onChange={(e) =>
                  handleInputChange('motivation', e.target.value)
                }
                fullWidth
                multiline
                rows={3}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Engagement & Motivation */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              📆 Engagement & Motivation
            </Typography>
            <Stack spacing={3}>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  How often do you practice using the app?
                </FormLabel>
                <RadioGroup
                  value={formData.practiceFrequency}
                  onChange={(e) =>
                    handleInputChange('practiceFrequency', e.target.value)
                  }
                >
                  <FormControlLabel
                    value="daily"
                    control={<Radio />}
                    label="Daily"
                  />
                  <FormControlLabel
                    value="weekly"
                    control={<Radio />}
                    label="Weekly"
                  />
                  <FormControlLabel
                    value="occasionally"
                    control={<Radio />}
                    label="Occasionally"
                  />
                  <FormControlLabel
                    value="just-started"
                    control={<Radio />}
                    label="Just Started"
                  />
                </RadioGroup>
              </FormControl>

              <TextField
                label="What motivates you to practice yoga?"
                value={formData.yogaMotivation}
                onChange={(e) =>
                  handleInputChange('yogaMotivation', e.target.value)
                }
                fullWidth
                multiline
                rows={3}
                placeholder="Stress relief, fitness, mindfulness, flexibility, etc."
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Box sx={{ textAlign: 'center', pt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? <CircularProgress size={20} /> : <SendIcon />
            }
            sx={{
              minWidth: 200,
              py: 1.5,
              fontSize: '1.1rem',
            }}
          >
            {isSubmitting ? 'Sending...' : 'Send Feedback'}
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Your feedback helps us create a better yoga experience for everyone
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
}

export default FeedbackForm
