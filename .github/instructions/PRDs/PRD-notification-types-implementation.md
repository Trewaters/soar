# PRD: Notification Types Implementation for Yoga Practice

## Overview

Implement backend and notification delivery systems for five notification types currently shown in the UI but not functionally implemented. These notification preferences exist as toggles but don't trigger actual notifications via email or push notifications.

## Problem Statement

Users can toggle notification preferences for five specific notification types, but these toggles are non-functional. The application tracks activity streaks, login streaks, and user progress, but doesn't send notifications about these events. This creates a disconnect between user expectations and actual functionality.

## Target Users

- **Yoga Practitioners** who want reminders and encouragement to maintain their practice
- **New Users** who need motivation to establish a consistent yoga habit
- **Active Users** who want to celebrate milestones and track their progress

## Scope

### In-Scope

1. **Daily Practice Reminders** - Scheduled reminders for yoga practice
2. **New Feature Announcements** - Notifications when new app features are released
3. **Progress Milestones** - Notifications for achievements (e.g., 10 sessions completed)
4. **Login Streak Reminders** - Notifications to maintain login streaks
5. **Activity Streak Reminders** - Notifications to maintain practice activity streaks

### Out-of-Scope

- Real-time notifications during practice sessions
- Social sharing features
- Notification customization beyond the existing preference toggles
- SMS notifications
- Third-party calendar integrations

## Current State Analysis

### Existing Infrastructure

✅ **Already Implemented:**

- Login streak tracking (`/api/user/loginStreak`)
- Activity streak tracking (`calculateActivityStreak` in `dashboardService.ts`)
- Dashboard statistics (`/api/dashboard/stats`)
- Push notification infrastructure (`subscribe-push.ts`, `subscribe-push-enhanced.ts`)
- Email notification infrastructure (email service configured)
- Reminder scheduling system (`/api/reminders`)
- Service worker for push notifications (`sw.js`)
- Notification preference UI toggles (In-App and Email switches)

✅ **Data Available:**

- `loginStreak` - consecutive days user has logged in
- `activityStreak` - consecutive days with yoga practice
- `practiceHistory` - 12 months of practice data
- `mostCommonAsanas`, `mostCommonSeries`, `mostCommonSequences` - usage statistics
- `nextGoal` - current month's practice progress

❌ **Missing:**

- Backend logic to detect and trigger notifications for the five types
- Email templates for each notification type
- Push notification payload creation for each notification type
- Background jobs/scheduled tasks to check for notification triggers
- Database schema to track which notifications have been sent
- Database schema to track feature release announcements

## Functional Requirements

### Core Functionality

1. **Notification Trigger System**

   - Detect when notification conditions are met
   - Check user preferences before sending
   - Track sent notifications to avoid duplicates
   - Support both email and push notification delivery

2. **Daily Practice Reminders**

   - Send at user's configured reminder time
   - Respect user's selected days of the week
   - Use custom message if configured
   - Skip if user already practiced that day

3. **New Feature Announcements**

   - Admin interface to create announcements (future enhancement)
   - Store announcements in database
   - Send once per feature to each user
   - Mark as read/delivered per user

4. **Progress Milestones**

   - Trigger on specific achievement counts (10, 25, 50, 100, 250, 500 sessions)
   - Celebrate streak milestones (7, 14, 30, 60, 90, 180, 365 days)
   - Goal completion notifications
   - First-time achievements (first asana, first series, first sequence)

5. **Login Streak Reminders**

   - Remind before streak is about to break (if haven't logged in by evening)
   - Celebrate streak milestones (7, 14, 30, 90, 180, 365 days)
   - Re-engagement after streak breaks

6. **Activity Streak Reminders**
   - Remind if no practice activity today
   - Celebrate practice streak milestones
   - Encourage to maintain active streak

### User Interface Requirements

✅ **Already Exists:** Notification preference toggles in `/navigator/profile/settings/notifications`

- Main toggles: In-App Notifications, Email Notifications
- Sub-toggles for each of the five notification types
- Visual feedback when preferences are disabled

**New Requirement:** User should see notification history/inbox (future enhancement)

### Integration Requirements

#### Authentication and Session Management

- Use existing NextAuth.js session management
- Verify user is authenticated before sending notifications
- Respect user's notification preferences from database

#### Database Operations and Data Flow

1. **New Prisma Models Needed:**

   ```prisma
   model NotificationLog {
     id String @id @default(auto()) @map("_id") @db.ObjectId
     userId String @db.ObjectId
     notificationType String // daily_practice, new_feature, progress_milestone, login_streak, activity_streak
     triggerData Json // Details about what triggered the notification
     sentVia String[] // ["email", "push"] - which methods were used
     sentAt DateTime @default(now())
     readAt DateTime?

     @@map("notification_logs")
   }

   model FeatureAnnouncement {
     id String @id @default(auto()) @map("_id") @db.ObjectId
     title String
     description String
     content String
     releaseDate DateTime
     targetUsers String // "all", "active", "new"
     active Boolean @default(true)
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt

     @@map("feature_announcements")
   }

   model UserNotificationDelivery {
     id String @id @default(auto()) @map("_id") @db.ObjectId
     userId String @db.ObjectId
     announcementId String @db.ObjectId
     deliveredAt DateTime @default(now())
     readAt DateTime?

     @@unique([userId, announcementId])
     @@map("user_notification_deliveries")
   }
   ```

2. **Update Existing Reminder Model:**
   ```prisma
   model Reminder {
     // ... existing fields ...
     notificationPreferences Json? // Store the five sub-preferences
   }
   ```

#### Context Provider Integration

- Use existing `UserContext` for user preferences
- No new context providers needed

#### API Endpoints Needed

**New API Routes:**

1. `/api/notifications/check` - Scheduled job endpoint to check for notification triggers
2. `/api/notifications/send` - Send a specific notification
3. `/api/notifications/history` - Get user's notification history
4. `/api/admin/announcements` - Manage feature announcements (future)

**Updated API Routes:**

- `/api/reminders` - Update to store notification sub-preferences

## User Stories

### Primary User Stories

**US-1: Daily Practice Reminder**
**As a** yoga practitioner
**I want** to receive a reminder at my chosen time
**So that** I don't forget to practice yoga daily

**Acceptance Criteria:**

- [ ] Reminder sent at user's configured time in their timezone
- [ ] Only sent on selected days of the week
- [ ] Uses custom message if configured
- [ ] Not sent if user already practiced that day
- [ ] Respects In-App/Email preference toggles
- [ ] Respects the Daily Practice Reminders sub-toggle

**US-2: New Feature Announcement**
**As a** Soar user
**I want** to be notified when new features are released
**So that** I can discover and use new yoga tools

**Acceptance Criteria:**

- [ ] Notification sent when new feature is announced
- [ ] Only sent once per feature per user
- [ ] Includes feature name and description
- [ ] Link to feature documentation or page
- [ ] Respects notification preferences
- [ ] Respects the New Feature Announcements sub-toggle

**US-3: Progress Milestone**
**As a** yoga practitioner
**I want** to be celebrated when I reach milestones
**So that** I feel motivated to continue practicing

**Acceptance Criteria:**

- [ ] Triggered on specific session counts (10, 25, 50, 100, 250, 500)
- [ ] Triggered on streak milestones (7, 14, 30, 60, 90, 180, 365 days)
- [ ] Shows specific achievement and encouraging message
- [ ] Only sent once per milestone
- [ ] Respects notification preferences
- [ ] Respects the Progress Milestones sub-toggle

**US-4: Login Streak Reminder**
**As a** user with an active login streak
**I want** to be reminded before my streak breaks
**So that** I can maintain my consistency

**Acceptance Criteria:**

- [ ] Sent in evening if user hasn't logged in that day
- [ ] Celebrates milestone streaks (7, 14, 30, 90, 180, 365)
- [ ] Re-engagement message if streak breaks
- [ ] Respects user's timezone for "evening" timing
- [ ] Respects notification preferences
- [ ] Respects the Login Streak Reminders sub-toggle

**US-5: Activity Streak Reminder**
**As a** user with an active practice streak
**I want** to be reminded to practice before my streak breaks
**So that** I can maintain my yoga consistency

**Acceptance Criteria:**

- [ ] Sent in evening if no practice activity that day
- [ ] Celebrates milestone streaks (3, 7, 14, 30, 60, 90)
- [ ] Shows current streak count
- [ ] Respects user's timezone for "evening" timing
- [ ] Respects notification preferences
- [ ] Respects the Activity Streak Reminders sub-toggle

## Technical Requirements

### Frontend Requirements

✅ **Already Complete:** Notification preference UI exists and is functional

**Future Enhancement:** Notification inbox/history view

### Backend Requirements

#### Notification Service Module

Create `/app/lib/notificationService.ts`:

- `checkDailyPracticeReminders()` - Check who needs practice reminders
- `checkLoginStreaks()` - Check for login streak triggers
- `checkActivityStreaks()` - Check for activity streak triggers
- `checkProgressMilestones()` - Check for milestone achievements
- `sendNotification()` - Send via email and/or push
- `logNotification()` - Record in NotificationLog
- `hasBeenSent()` - Check if notification already sent

#### Email Template System

Create email templates in `/app/lib/emailTemplates/`:

- `dailyPracticeReminder.ts`
- `newFeatureAnnouncement.ts`
- `progressMilestone.ts`
- `loginStreakReminder.ts`
- `activityStreakReminder.ts`

Each template should include:

- HTML version
- Plain text version
- Personalization with user data
- Call-to-action links
- Unsubscribe link

#### Push Notification Payloads

Create push notification payload generators in `/app/lib/pushNotificationPayloads.ts`:

- Short, actionable messages
- App-specific notification icons
- Deep links to relevant app sections
- Badge counts (optional)

#### Scheduled Job System

Use one of these approaches:

1. **Vercel Cron Jobs** (if on Vercel)
2. **API endpoint called by external cron** (GitHub Actions, etc.)
3. **Next.js API route with scheduled execution**

Create `/app/api/cron/notifications/route.ts`:

- Runs every hour
- Checks all notification types
- Processes in batches to avoid timeouts
- Logs execution results

### Data Requirements

#### Database Schema Changes

Run Prisma migration to add:

- `NotificationLog` model
- `FeatureAnnouncement` model
- `UserNotificationDelivery` model
- Update `Reminder` model with `notificationPreferences` field

#### Data Validation Rules

- Notification preferences must be valid JSON
- Notification times must be valid 24-hour format
- Timezone must be from IANA timezone database
- User email must be verified before sending
- Push subscription must be active before sending

#### Migration Requirements

```bash
# Create migration
npx prisma migrate dev --name add_notification_system

# Update production database
npx prisma migrate deploy
```

## Success Criteria

### User Experience Metrics

- Users receive notifications within 5 minutes of trigger condition
- Notification delivery rate >95%
- Unsubscribe rate <5%
- User engagement with notifications >30%
- Positive feedback on notification timing and content

### Technical Metrics

- Notification check job completes in <30 seconds
- Email delivery success rate >98%
- Push notification delivery success rate >80%
- Zero duplicate notifications sent
- Notification logs properly stored for all sends

## Dependencies

### Internal Dependencies

- Existing `/api/reminders` route
- Existing `/api/user/loginStreak` route
- Existing `dashboardService.ts` for streak calculations
- Existing push notification infrastructure
- Existing email service configuration

### External Dependencies

- Email service provider (e.g., SendGrid, Resend, SES)
- Push notification service (Web Push API)
- Cron job scheduler (Vercel Cron or equivalent)

## Risks and Considerations

### Technical Risks

- **Email Deliverability:** Emails may be marked as spam
  - Mitigation: Use verified sender domain, proper SPF/DKIM records
- **Push Notification Permission:** Users may block notifications
  - Mitigation: Gracefully handle denied permissions, fall back to email
- **Timezone Handling:** Complex timezone conversions
  - Mitigation: Use UTC for all database times, convert only for display
- **Duplicate Notifications:** Risk of sending same notification multiple times
  - Mitigation: Check NotificationLog before sending, use unique constraint

### User Experience Risks

- **Notification Fatigue:** Too many notifications may annoy users
  - Mitigation: Rate limiting, respect user preferences strictly
- **Irrelevant Notifications:** Notifications may not match user interests
  - Mitigation: Allow granular control via sub-preferences
- **Timing Issues:** Notifications may arrive at inconvenient times
  - Mitigation: Respect user's timezone and configured reminder times

### Scalability Considerations

- **Large User Base:** Checking all users every hour may be slow
  - Mitigation: Batch processing, optimize database queries
- **High Notification Volume:** Sending thousands of notifications
  - Mitigation: Queue system, rate limiting with email provider

## Implementation Notes

### Phase 1: Foundation (Week 1)

1. Create database schema (Prisma models)
2. Run migrations
3. Create `notificationService.ts` with core functions
4. Create email templates
5. Create push notification payloads

### Phase 2: Daily Practice Reminders (Week 2)

1. Implement `checkDailyPracticeReminders()`
2. Test with development email/push
3. Create cron job endpoint
4. Deploy and monitor

### Phase 3: Streak Notifications (Week 3)

1. Implement `checkLoginStreaks()`
2. Implement `checkActivityStreaks()`
3. Test streak detection logic
4. Deploy and monitor

### Phase 4: Milestones & Announcements (Week 4)

1. Implement `checkProgressMilestones()`
2. Create admin interface for feature announcements
3. Test milestone triggers
4. Deploy and monitor

### Phase 5: Testing & Polish (Week 5)

1. End-to-end testing of all notification types
2. Load testing with large user base
3. Fix any bugs or issues
4. Update user documentation

### Testing Strategy

#### Unit Testing

- Test each notification check function independently
- Mock database calls
- Verify notification payloads are correctly formatted
- Test timezone conversions
- Test preference checking logic

#### Integration Testing

- Test full notification flow end-to-end
- Verify emails are sent correctly
- Verify push notifications are delivered
- Test notification logging
- Test duplicate prevention

#### User Acceptance Testing

- Beta test with subset of users
- Collect feedback on notification timing and content
- Verify users can control notifications via preferences
- Test unsubscribe functionality
- Verify notifications respect all preference toggles

## Future Considerations

### Potential Enhancements

1. **Notification Inbox:** In-app notification history
2. **Custom Notification Schedules:** Multiple reminders per day
3. **Smart Notifications:** AI-powered optimal timing
4. **Notification Analytics:** Dashboard for admins
5. **A/B Testing:** Test different notification messages
6. **Rich Notifications:** Images, videos in push notifications
7. **Notification Channels:** Group notifications by category
8. **Do Not Disturb:** Quiet hours for notifications

### Scalability Considerations

- Implement message queue (Redis, RabbitMQ) for high volume
- Use dedicated notification service microservice
- Implement notification batching for efficiency
- Add notification caching layer

## Appendix

### Example Notification Messages

**Daily Practice Reminder:**

> 🧘‍♀️ Time for your yoga practice! Your mat is calling. Let's flow! 🌟

**Login Streak Milestone (7 days):**

> 🔥 Amazing! You've logged in for 7 days straight! Keep up the consistency! 🎉

**Activity Streak Warning:**

> Your 12-day practice streak is at risk! Take 10 minutes for a quick yoga session today. 🧘

**Progress Milestone (50 sessions):**

> 🎊 Congratulations! You've completed 50 yoga sessions! You're building an incredible practice! 🌈

**New Feature Announcement:**

> 🆕 New Feature: Guided Meditation! Enhance your practice with our new meditation library. Check it out!

### Database Query Examples

```typescript
// Check if notification already sent
const existingLog = await prisma.notificationLog.findFirst({
  where: {
    userId: user.id,
    notificationType: 'progress_milestone',
    triggerData: {
      path: ['milestoneType'],
      equals: 'sessions_50',
    },
  },
})

// Log sent notification
await prisma.notificationLog.create({
  data: {
    userId: user.id,
    notificationType: 'daily_practice',
    triggerData: { scheduledTime: '08:00', timezone: 'America/Los_Angeles' },
    sentVia: ['email', 'push'],
    sentAt: new Date(),
  },
})
```
