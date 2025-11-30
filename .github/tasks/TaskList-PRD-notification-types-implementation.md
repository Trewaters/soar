# Engineering Task Breakdown: Notification Types Implementation

This task list guides implementation of the backend notification system for five notification types currently shown in the UI but not functionally implemented. These tasks are based on `PRD-notification-types-implementation.md`.

---

## 1. Database Schema & Migrations

### 1.1 Create NotificationLog Model

- Open `prisma/schema.prisma`
- Add the `NotificationLog` model with fields: `id`, `userId`, `notificationType`, `triggerData`, `sentVia`, `sentAt`, `readAt`
- Use `@map("notification_logs")` for the collection name
- Ensure `notificationType` uses enum values: `daily_practice`, `new_feature`, `progress_milestone`, `login_streak`, `activity_streak`

### 1.2 Create FeatureAnnouncement Model

- In `prisma/schema.prisma`, add the `FeatureAnnouncement` model
- Include fields: `id`, `title`, `description`, `content`, `releaseDate`, `targetUsers`, `active`, `createdAt`, `updatedAt`
- Use `@map("feature_announcements")` for the collection name
- Set default value for `active` to `true`

### 1.3 Create UserNotificationDelivery Model

- In `prisma/schema.prisma`, add the `UserNotificationDelivery` model
- Include fields: `id`, `userId`, `announcementId`, `deliveredAt`, `readAt`
- Add `@@unique([userId, announcementId])` constraint to prevent duplicate deliveries
- Use `@map("user_notification_deliveries")` for the collection name

### 1.4 Update Reminder Model

- In `prisma/schema.prisma`, locate the existing `Reminder` model
- Add optional `notificationPreferences` field of type `Json`
- This field will store the five sub-preference toggles (dailyPractice, newFeatures, progressMilestones, loginStreak, activityStreak)

### 1.5 Run Database Migration

- Run `npx prisma migrate dev --name add_notification_system` to create migration files
- Verify migration files are created in `prisma/migrations/`
- Run `npx prisma generate` to update Prisma client with new models
- Test database connection and verify new collections are created in MongoDB

---

## 2. Core Notification Service

### 2.1 Create Notification Service File

- Create new file `app/lib/notificationService.ts`
- Add TypeScript interfaces for notification types and configurations
- Import Prisma client for database operations
- Set up base structure with exported functions

### 2.2 Implement hasBeenSent() Function

- In `app/lib/notificationService.ts`, create `hasBeenSent()` function
- Query `NotificationLog` model to check if a notification with matching `userId`, `notificationType`, and `triggerData` exists
- Return boolean indicating if notification was already sent
- Handle database query errors gracefully

### 2.3 Implement logNotification() Function

- In `app/lib/notificationService.ts`, create `logNotification()` function
- Accept parameters: `userId`, `notificationType`, `triggerData`, `sentVia[]`
- Create new `NotificationLog` entry in database
- Set `sentAt` to current timestamp
- Return the created log entry or throw error on failure

### 2.4 Create getUserNotificationPreferences() Helper

- In `app/lib/notificationService.ts`, create helper function to fetch user's notification preferences
- Query `Reminder` model for user's `notificationPreferences` field
- Return object with in-app and email preferences for all five notification types
- Handle cases where user has no preferences set (return default: all disabled)

### 2.5 Implement sendNotification() Core Function

- In `app/lib/notificationService.ts`, create `sendNotification()` function
- Accept parameters: `userId`, `notificationType`, `payload`, `userPreferences`
- Check user preferences to determine if notification should be sent
- Determine delivery methods based on in-app and email toggle states
- Call email sending function if email is enabled
- Call push notification function if in-app is enabled
- Log the notification using `logNotification()`
- Return success/failure status with details

---

## 3. Email Template System

### 3.1 Create Email Templates Directory

- Create directory `app/lib/emailTemplates/`
- Set up base template structure that all email templates will extend

### 3.2 Create Daily Practice Reminder Email Template

- Create file `app/lib/emailTemplates/dailyPracticeReminder.ts`
- Export function that accepts user data and reminder details
- Return object with `subject`, `html`, and `text` properties
- Include personalized greeting with user's name
- Add call-to-action button linking to practice planner
- Include unsubscribe link in footer

### 3.3 Create New Feature Announcement Email Template

- Create file `app/lib/emailTemplates/newFeatureAnnouncement.ts`
- Export function that accepts announcement data (title, description, content)
- Return object with `subject`, `html`, and `text` properties
- Include feature title, description, and detailed content
- Add "Try It Now" call-to-action button
- Include unsubscribe link in footer

### 3.4 Create Progress Milestone Email Template

- Create file `app/lib/emailTemplates/progressMilestone.ts`
- Export function that accepts milestone type and achievement details
- Return object with `subject`, `html`, and `text` properties
- Support different milestone types: session counts, streak days, goal completion, first-time achievements
- Include celebratory messaging and achievement badge/icon
- Add call-to-action to view full stats on dashboard
- Include unsubscribe link in footer

### 3.5 Create Login Streak Reminder Email Template

- Create file `app/lib/emailTemplates/loginStreakReminder.ts`
- Export function that accepts streak data and reminder type (warning, celebration, re-engagement)
- Return object with `subject`, `html`, and `text` properties
- For warning: show current streak and encourage login
- For celebration: congratulate on milestone streak (7, 14, 30, etc.)
- For re-engagement: motivate user to restart their streak
- Include unsubscribe link in footer

### 3.6 Create Activity Streak Reminder Email Template

- Create file `app/lib/emailTemplates/activityStreakReminder.ts`
- Export function that accepts activity streak data and current streak count
- Return object with `subject`, `html`, and `text` properties
- Show current streak and encourage practice to maintain it
- Include quick practice suggestions (10-minute flows)
- Add call-to-action button to start practice
- Include unsubscribe link in footer

### 3.7 Implement Email Sending Utility

- Create or update `app/lib/emailService.ts` with `sendEmail()` function
- Integrate with email service provider (SendGrid, Resend, or AWS SES)
- Accept parameters: recipient email, subject, html body, text body
- Handle email sending errors and return success/failure status
- Log email sending attempts for debugging

---

## 4. Push Notification Payloads

### 4.1 Create Push Notification Payloads File

- Create file `app/lib/pushNotificationPayloads.ts`
- Import types for push notification structure

### 4.2 Implement Daily Practice Reminder Push Payload

- In `app/lib/pushNotificationPayloads.ts`, create `getDailyPracticeReminderPayload()` function
- Return object with `title`, `body`, `icon`, `badge`, `data` properties
- Use concise, actionable message (e.g., "🧘‍♀️ Time for yoga! Your mat is calling.")
- Include deep link to practice planner in `data.url`

### 4.3 Implement New Feature Announcement Push Payload

- Create `getNewFeatureAnnouncementPayload()` function
- Accept feature title and description
- Return push notification payload with feature details
- Include deep link to feature documentation or page

### 4.4 Implement Progress Milestone Push Payload

- Create `getProgressMilestonePayload()` function
- Accept milestone type and achievement data
- Return celebratory notification payload
- Include emoji and encouraging message
- Add deep link to dashboard stats page

### 4.5 Implement Login Streak Reminder Push Payload

- Create `getLoginStreakReminderPayload()` function
- Accept streak count and reminder type
- Return notification payload appropriate for warning, celebration, or re-engagement
- Include current streak count in message

### 4.6 Implement Activity Streak Reminder Push Payload

- Create `getActivityStreakReminderPayload()` function
- Accept activity streak count
- Return notification payload encouraging practice
- Show current streak in message
- Include deep link to practice page

### 4.7 Implement Push Notification Sending Utility

- Create or update `app/lib/pushNotificationService.ts` with `sendPushNotification()` function
- Query user's push subscription from database
- Use Web Push API to send notification to user's subscription endpoint
- Handle cases where subscription is invalid or expired
- Return success/failure status

---

## 5. Daily Practice Reminder Notification Logic

### 5.1 Implement checkDailyPracticeReminders() Function

- In `app/lib/notificationService.ts`, create `checkDailyPracticeReminders()` function
- Query all users who have reminders enabled
- For each user, check if today is in their selected days of the week
- Check if current time matches their configured reminder time (with timezone conversion)
- Check if user has already practiced today by querying practice history
- Collect list of users who should receive reminders

### 5.2 Implement sendDailyPracticeReminder() Function

- In `app/lib/notificationService.ts`, create `sendDailyPracticeReminder()` function
- Accept user data and reminder configuration
- Check if this exact reminder was already sent today using `hasBeenSent()`
- Get user's notification preferences
- Prepare email using `dailyPracticeReminder` template
- Prepare push notification using `getDailyPracticeReminderPayload()`
- Call `sendNotification()` to deliver via enabled channels
- Return success/failure status

### 5.3 Integrate with Reminder API Endpoint

- Update `app/api/reminders/route.ts` to store `notificationPreferences` field
- In POST handler, accept and validate notification sub-preferences object
- Save the five sub-preference toggles (dailyPractice, newFeatures, etc.) to database
- In GET handler, return notification preferences along with reminder settings

---

## 6. Login Streak Notification Logic

### 6.1 Implement checkLoginStreaks() Function

- In `app/lib/notificationService.ts`, create `checkLoginStreaks()` function
- Query all active users with notification preferences enabled
- For each user, fetch current login streak from `/api/user/loginStreak` or database
- Check current time in user's timezone to determine if it's evening (e.g., after 6 PM)
- Identify users who haven't logged in today and have an active streak at risk
- Identify users who just hit milestone streaks (7, 14, 30, 90, 180, 365 days)
- Return list of users with notification type (warning, celebration, or re-engagement)

### 6.2 Implement sendLoginStreakReminder() Function

- In `app/lib/notificationService.ts`, create `sendLoginStreakReminder()` function
- Accept user data, streak count, and reminder type (warning/celebration/re-engagement)
- Check if this specific notification was already sent using `hasBeenSent()`
- Get user's notification preferences and verify login streak notifications are enabled
- Prepare email using `loginStreakReminder` template with appropriate messaging
- Prepare push notification using `getLoginStreakReminderPayload()`
- Call `sendNotification()` to deliver
- Return success/failure status

---

## 7. Activity Streak Notification Logic

### 7.1 Implement checkActivityStreaks() Function

- In `app/lib/notificationService.ts`, create `checkActivityStreaks()` function
- Query all users with activity streak notifications enabled
- For each user, calculate current activity streak using dashboard service logic
- Check if user has practiced today by querying practice history
- Identify users who haven't practiced today and have an active streak at risk
- Identify users who just hit milestone streaks (3, 7, 14, 30, 60, 90 days)
- Return list of users with notification type (warning or celebration)

### 7.2 Implement sendActivityStreakReminder() Function

- In `app/lib/notificationService.ts`, create `sendActivityStreakReminder()` function
- Accept user data, streak count, and reminder type (warning/celebration)
- Check if this specific notification was already sent using `hasBeenSent()`
- Get user's notification preferences and verify activity streak notifications are enabled
- Prepare email using `activityStreakReminder` template
- Prepare push notification using `getActivityStreakReminderPayload()`
- Call `sendNotification()` to deliver
- Return success/failure status

---

## 8. Progress Milestone Notification Logic

### 8.1 Implement checkProgressMilestones() Function

- In `app/lib/notificationService.ts`, create `checkProgressMilestones()` function
- Query all users with progress milestone notifications enabled
- For each user, fetch dashboard statistics (total sessions, common asanas/series/sequences)
- Check for milestone achievements:
  - Session counts: 10, 25, 50, 100, 250, 500 total sessions
  - First-time achievements: first asana logged, first series completed, first sequence finished
  - Goal completions: monthly practice goals met
- Check `NotificationLog` to ensure each milestone is only celebrated once
- Return list of users with their specific milestone achievements

### 8.2 Implement sendProgressMilestone() Function

- In `app/lib/notificationService.ts`, create `sendProgressMilestone()` function
- Accept user data and milestone details (type, count, achievement name)
- Check if this specific milestone was already celebrated using `hasBeenSent()`
- Get user's notification preferences and verify progress milestone notifications are enabled
- Prepare email using `progressMilestone` template with achievement details
- Prepare push notification using `getProgressMilestonePayload()`
- Call `sendNotification()` to deliver
- Return success/failure status

---

## 9. Feature Announcement Notification Logic

### 9.1 Implement checkNewFeatureAnnouncements() Function

- In `app/lib/notificationService.ts`, create `checkNewFeatureAnnouncements()` function
- Query `FeatureAnnouncement` model for active announcements with `releaseDate` <= current date
- For each announcement, query `UserNotificationDelivery` to find users who haven't received it
- Filter users based on `targetUsers` field (all, active, new)
- Return list of announcement-user pairs to be delivered

### 9.2 Implement sendFeatureAnnouncement() Function

- In `app/lib/notificationService.ts`, create `sendFeatureAnnouncement()` function
- Accept user data and feature announcement details
- Get user's notification preferences and verify new feature notifications are enabled
- Prepare email using `newFeatureAnnouncement` template
- Prepare push notification using `getNewFeatureAnnouncementPayload()`
- Call `sendNotification()` to deliver
- Create `UserNotificationDelivery` record to mark announcement as sent to this user
- Return success/failure status

---

## 10. Cron Job / Scheduled Task System

### 10.1 Create Notification Check API Route

- Create file `app/api/cron/notifications/route.ts`
- Implement GET handler that will be called by scheduled job
- Add authentication check to ensure only authorized requests can trigger this endpoint (API key or Vercel cron secret)

### 10.2 Implement Notification Checking Logic in Cron Endpoint

- In `app/api/cron/notifications/route.ts`, call all notification check functions:
  - `checkDailyPracticeReminders()`
  - `checkLoginStreaks()`
  - `checkActivityStreaks()`
  - `checkProgressMilestones()`
  - `checkNewFeatureAnnouncements()`
- Process results in batches to avoid timeout
- Send notifications for each triggered event
- Log execution results (how many notifications sent, any errors)
- Return summary response with status and counts

### 10.3 Set Up Vercel Cron Configuration

- Create or update `vercel.json` file
- Add cron job configuration to run `/api/cron/notifications` every hour
- Example: `"schedule": "0 * * * *"` for hourly execution
- Configure appropriate timeout for the cron job (e.g., 60 seconds)

### 10.4 Add Environment Variables for Cron Security

- Add `CRON_SECRET` environment variable to `.env.local` and production environment
- Update cron endpoint to verify `CRON_SECRET` in request headers or query parameters
- Reject unauthorized requests with 401 status

---

## 11. Update Existing API Routes

### 11.1 Update GET /api/reminders to Return Notification Preferences

- Open `app/api/reminders/route.ts`
- Locate the GET handler
- Update database query to include `notificationPreferences` field
- Return notification preferences in response object alongside existing reminder settings

### 11.2 Update POST /api/reminders to Save Notification Preferences

- In `app/api/reminders/route.ts`, locate the POST handler
- Accept `notificationPreferences` object in request body
- Validate that `notificationPreferences` contains the five sub-preference booleans
- Save `notificationPreferences` to `Reminder` model using Prisma `upsert`
- Return updated reminder settings including notification preferences

---

## 12. Notification History API (Future Enhancement)

### 12.1 Create Notification History API Route

- Create file `app/api/notifications/history/route.ts`
- Implement GET handler to retrieve user's notification history
- Query `NotificationLog` filtered by authenticated user's ID
- Support pagination with query parameters (page, limit)
- Support filtering by `notificationType`
- Return array of notification logs with metadata

### 12.2 Implement Mark as Read Functionality

- In `app/api/notifications/history/route.ts`, add PATCH handler
- Accept notification log ID in request body
- Update `readAt` field to current timestamp
- Return updated notification log
- Only allow users to mark their own notifications as read

---

## 13. Testing - Unit Tests

### 13.1 Test Notification Service Helper Functions

- Create test file `__test__/app/lib/notificationService.spec.ts`
- Mock Prisma client for database operations
- Test `hasBeenSent()` with existing and non-existing notifications
- Test `logNotification()` creates correct database entries
- Test `getUserNotificationPreferences()` returns correct preferences and handles missing data

### 13.2 Test Email Template Generation

- Create test file `__test__/app/lib/emailTemplates/emailTemplates.spec.ts`
- Test each email template function returns correct structure (subject, html, text)
- Verify personalization works correctly with user data
- Verify unsubscribe links are included in all templates
- Test templates with missing or undefined data gracefully handle errors

### 13.3 Test Push Notification Payload Generation

- Create test file `__test__/app/lib/pushNotificationPayloads.spec.ts`
- Test each payload function returns correct structure (title, body, icon, data)
- Verify deep links are formatted correctly
- Test with various milestone types and achievement data
- Ensure messages are concise and actionable

### 13.4 Test Notification Check Functions

- In `__test__/app/lib/notificationService.spec.ts`, test notification checking logic
- Mock database queries for users and their settings
- Test `checkDailyPracticeReminders()` correctly identifies users needing reminders
- Test timezone handling for reminder timing
- Test `checkLoginStreaks()` correctly identifies streak warnings and celebrations
- Test `checkActivityStreaks()` correctly identifies practice streaks at risk
- Test `checkProgressMilestones()` correctly detects milestone achievements
- Test `checkNewFeatureAnnouncements()` correctly identifies undelivered announcements

### 13.5 Test Notification Sending Functions

- Test `sendNotification()` respects user preferences
- Mock email and push notification services
- Verify notifications are only sent when preferences allow
- Test that `hasBeenSent()` prevents duplicate notifications
- Test `logNotification()` is called after successful send

### 13.6 Test Cron Endpoint

- Create test file `__test__/app/api/cron/notifications/route.spec.ts`
- Mock all notification check functions
- Test authentication with valid and invalid secrets
- Test batch processing and error handling
- Verify response includes summary of sent notifications

### 13.7 Test Updated Reminder API

- Create or update test file `__test__/app/api/reminders/route.spec.ts`
- Test GET endpoint returns notification preferences
- Test POST endpoint saves notification preferences correctly
- Test validation of notification preferences object
- Verify preferences are properly stored and retrieved from database

---

## 14. Testing - Integration Tests

### 14.1 End-to-End Daily Practice Reminder Flow

- Create integration test `__test__/integration/dailyPracticeNotification.spec.ts`
- Set up test user with reminder configuration
- Trigger `checkDailyPracticeReminders()` at configured time
- Verify email is sent using test email service
- Verify push notification is sent (or mocked)
- Verify `NotificationLog` entry is created
- Verify duplicate notification is prevented on second trigger

### 14.2 End-to-End Login Streak Notification Flow

- Create integration test `__test__/integration/loginStreakNotification.spec.ts`
- Set up test user with active login streak
- Simulate evening time in user's timezone
- Trigger `checkLoginStreaks()`
- Verify warning notification is sent
- Set user's streak to milestone (e.g., 7 days)
- Verify celebration notification is sent

### 14.3 End-to-End Activity Streak Notification Flow

- Create integration test `__test__/integration/activityStreakNotification.spec.ts`
- Set up test user with active practice streak
- Simulate no practice activity for current day
- Trigger `checkActivityStreaks()`
- Verify reminder notification is sent
- Log practice activity for user
- Verify no notification sent on second check

### 14.4 End-to-End Progress Milestone Flow

- Create integration test `__test__/integration/progressMilestoneNotification.spec.ts`
- Set up test user approaching milestone (e.g., 9 sessions completed)
- Log one more practice session to reach 10
- Trigger `checkProgressMilestones()`
- Verify celebration notification is sent
- Verify milestone notification is only sent once

### 14.5 End-to-End Feature Announcement Flow

- Create integration test `__test__/integration/featureAnnouncementNotification.spec.ts`
- Create test feature announcement in database
- Trigger `checkNewFeatureAnnouncements()`
- Verify announcement notification is sent to eligible users
- Verify `UserNotificationDelivery` record is created
- Verify announcement is not sent again to same user

---

## 15. Testing - Manual & User Acceptance Testing

### 15.1 Manual Testing Checklist

- Create document `.github/testing/notification-manual-tests.md`
- Document steps for manually testing each notification type
- Include steps to toggle preferences on/off and verify behavior
- Include timezone testing scenarios
- Include steps to verify email content and formatting
- Include steps to test push notifications on different browsers

### 15.2 User Acceptance Testing Plan

- Select beta test group of 5-10 users
- Enable notification features for beta users only
- Monitor notification delivery logs
- Collect user feedback through survey or interviews
- Document any issues or unexpected behavior
- Iterate based on feedback before full rollout

---

## 16. Documentation & Deployment

### 16.1 Update User Documentation

- Update or create user guide for notification settings
- Document what each notification type does and when it's triggered
- Explain how to customize notification preferences
- Add screenshots of notification settings page
- Document how to unsubscribe from specific notification types

### 16.2 Create Admin Documentation

- Create document for managing feature announcements
- Document how to create and schedule feature announcements
- Explain targeting options (all, active, new users)
- Document monitoring and debugging notification delivery

### 16.3 Deploy Database Migrations to Production

- Run `npx prisma migrate deploy` in production environment
- Verify new collections are created in production MongoDB
- Test production database connection and queries

### 16.4 Deploy Backend Code

- Deploy updated codebase with notification service to production
- Verify environment variables are set (email service, CRON_SECRET, etc.)
- Test cron job endpoint is accessible
- Monitor initial cron job execution

### 16.5 Enable Vercel Cron Job

- Configure Vercel cron job in project settings
- Set schedule to run every hour
- Verify cron job executes successfully
- Monitor logs for errors or issues

### 16.6 Monitor Initial Rollout

- Monitor notification delivery logs for first 48 hours
- Check email delivery success rates
- Check push notification delivery success rates
- Monitor for any duplicate notifications
- Check user feedback and support tickets
- Be prepared to disable features if critical issues arise

---

## 17. Post-Launch Optimization

### 17.1 Analyze Notification Engagement Metrics

- Track open rates for email notifications
- Track click-through rates for notification CTAs
- Track push notification permission grant rates
- Identify which notification types have highest engagement
- Adjust messaging or timing based on data

### 17.2 Optimize Notification Timing

- Analyze when users are most likely to engage with notifications
- Consider implementing smart send times based on user behavior
- Test different timing strategies for streak reminders

### 17.3 Performance Optimization

- Monitor cron job execution time
- Optimize database queries if job is slow
- Implement caching for frequently accessed data
- Consider batch processing improvements if needed

---

This task breakdown provides a comprehensive roadmap for implementing the notification system. Each task is designed to be actionable by a junior engineer with clear instructions on which files to create or modify and what functionality to implement.
