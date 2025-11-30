# PRD: User Activity Notifications

## Overview

This document outlines the requirements for implementing a user activity notification system within the Soar yoga application. The primary goal is to provide users with timely "practice now" reminders via web push notifications and email fallbacks, with customizable scheduling based on their local time.

## Problem Statement

Users may forget or lose track of their personal yoga practice schedules. To foster consistent engagement and help users maintain their practice routines, the application needs a proactive reminder system that nudges them at their preferred times.

## Target Users

- **Primary:** Registered and active yoga practitioners using the Soar application who want to build a consistent practice habit.

## Scope

### In-Scope

- **Data Model:** Extend the Prisma schema to store user notification preferences, timezones, and push subscription details. Check UserData Prisma schema for last login activity.
- **Web Push Notifications:**
  - Implement a service worker to manage push notifications.
  - Request user permission for notifications.
  - Subscribe users to push notifications and save subscription details.
- **Email Fallback:** Send reminder emails to users who have not enabled or are not reachable via push notifications.
- **Scheduling System:**
  - Create a cron job that runs periodically (e.g., every 1-5 minutes).
  - The job will identify users whose reminders are due based on their local time and day preferences.
- **Notification Delivery:**
  - Integrate `web-push` for sending VAPID-secured push notifications.
  - Integrate an email service (e.g., Resend) for sending emails.
- **User Interface:**
  - Develop a settings “Notification preferences” page where users can enable/disable and customize their reminder schedule (days of the week, time of day).
  - Allow users to set their local timezone.

### Out-of-Scope

- In-app notification center/feed.
- SMS or other notification channels.
- Advanced notification analytics dashboard.
- "Quiet hours" and "Practice Streak" motivators (listed as future considerations).

## Functional Requirements

### Core Functionality

1.  **User Timezone:** The system must store and use the user's IANA timezone string (e.g., "America/Los_Angeles") to deliver notifications accurately.
2.  **Reminder Scheduling:** Users must be able to define one or more reminders, specifying:
    - Time of day (e.g., "07:30" in 24h format).
    - Days of the week (e.g., ["Mon", "Tue", "Wed", "Thu", "Fri"]).
    - A custom reminder message.
3.  **Notification Logic:** The cron job must:
    - Run at a frequent interval (e.g., every minute).
    - For each user with enabled reminders, convert the current UTC time to the user's local time.
    - Check if the current local day and time match a user's reminder settings within a predefined window (e.g., ±60 seconds).
    - Avoid sending duplicate notifications within the same time window.
4.  **Channel Priority:** The system will attempt to send a web push notification first. If the user has no active push subscriptions, it will fall back to sending an email.
5.  **Push Notification Interaction:** When a user clicks a push notification, it should open the app and navigate to a relevant page (e.g., the practice series flow).
6.  **Stale Subscription Handling:** The system must detect and remove expired or invalid push subscriptions (e.g., on an HTTP 410 response).

### User Interface Requirements

- A dedicated "Notifications" or "Reminders" section in the user's settings/profile page.
- UI controls for users to:
  - Enable or disable all reminders.
  - Select days of the week (e.g., checkboxes).
  - Set a time of day (e.g., time input).
  - Select their timezone (e.g., dropdown).
  - Edit the notification message.
- A button to trigger the browser's permission prompt for push notifications.
- The UI should provide clear feedback on whether push notifications are successfully enabled.
- For iOS users, display a friendly message encouraging them to "Add to Home Screen" to enable push notifications.

### Integration Requirements

- **Authentication:** All API endpoints for managing subscriptions and preferences must be protected and associated with the authenticated user.
- **Database:** The system will use Prisma to interact with the MongoDB database for all data operations.
- **Service Worker:** A service worker must be registered at the root scope (`/`) to handle incoming push events.

## User Stories

### Primary User Stories

**As a** registered user,
**I want** to set a daily or weekly reminder at a specific time in my timezone,
**So that** I don't forget to practice and can build a consistent routine.

**Acceptance Criteria:**

- [ ] I can navigate to a settings page to manage my reminders.
- [ ] I can enable/disable reminders.
- [ ] I can select the days of the week and a specific time for my reminder.
- [ ] I can select my local timezone from a list.
- [ ] I receive a push notification on my device at the scheduled time.
- [ ] If I don't have push enabled, I receive an email reminder instead.
- [ ] Clicking the notification takes me to the practice section of the app.

**As a** new user,
**I want** to be prompted to enable notifications,
**So that** I can easily opt-in to receiving practice reminders.

**Acceptance Criteria:**

- [ ] The app asks for my permission to send notifications.
- [ ] If I grant permission, my device is subscribed.
- [ ] If I deny permission, the app does not ask me again immediately.

## Technical Requirements

### Frontend Requirements

- **Service Worker:** Create a `sw.js` file in the `public/` directory to handle `push` and `notificationclick` events.
- **Push Subscription Logic:** Implement a client-side utility (`subscribe-push.ts`) to:
  - Check for browser support (`serviceWorker` and `PushManager`).
  - Register the service worker.
  - Request `Notification.permission`.
  - Subscribe to the push manager using the public VAPID key.
  - Send the subscription object to the backend API (`/api/push/subscribe`).
- **State Management:** The user's reminder settings should be fetched and managed within the application's state.
- **UI Components:** Build React components for the reminder settings form.

### Backend Requirements

- **API Endpoints:**
  - `POST /api/push/subscribe`: Receives and saves a push subscription, linking it to the current user.
  - `POST /api/reminders`: Creates or updates a user's reminder preferences.
  - `GET /api/cron/deliver-reminders`: A secure endpoint for the cron job to trigger notification delivery.
- **Cron Job:** Configure a cron job in `vercel.json` to hit the delivery endpoint every minute (`* * * * *`).
- **Libraries:**
  - `web-push` for sending push notifications.
  - An email sending library like `resend`.
  - `date-fns-tz` for robust timezone handling.
- **Environment Variables:**
  - `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
  - `VAPID_PRIVATE_KEY`
  - `RESEND_API_KEY` (or equivalent for another email provider).

### Data Requirements

- **Prisma Schema Changes:** Modify `prisma/schema.prisma` to include the following models and relations:
  - **User:** Add a `tz` field and relations to `Reminder` and `PushSubscription`.
  - **Reminder:** New model to store `userId`, `timeOfDay`, `days`, `enabled`, `message`, and `lastSent`.
  - **PushSubscription:** New model to store `userId`, `endpoint`, `p256dh`, and `auth`.
- **Database Operations:**
  - `upsert` for `PushSubscription` to handle new and existing subscriptions.
  - `upsert` for `Reminder` settings.
  - `findMany` to fetch all due reminders in the cron job.
  - `delete` to clean up stale push subscriptions.

## Success Criteria

### User Experience Metrics

- A measurable percentage of active users opt-in to receive notifications.
- The notification system achieves a high delivery success rate for both push and email.
- User feedback indicates the reminders are helpful and not intrusive.

### Technical Metrics

- The cron job executes successfully with minimal errors.
- API endpoints maintain low latency (<500ms).
- The system correctly handles timezone conversions for users worldwide.
- Test coverage for the new API routes and services exceeds 80%.

## Dependencies

### Internal Dependencies

- `@/lib/prisma`: Existing Prisma client setup.
- `@/lib/auth`: Existing authentication helpers (`getCurrentUser`).
- Next.js 14 API Routes and server components.

### External Dependencies

- `web-push` (npm package)
- `resend` (npm package, or other email provider)
- `date-fns-tz` (npm package)

## Risks and Considerations

### Technical Risks

- **Cron Job Reliability:** The cron job is a single point of failure. If it fails, no notifications will be sent. Monitoring and alerting should be considered.
- **Browser Incompatibility:** Web push is not supported on all browsers/platforms uniformly (especially iOS Safari). The email fallback is critical to mitigate this.
- **Timezone Complexity:** Incorrect handling of timezones or Daylight Saving Time could lead to notifications being sent at the wrong time.

### User Experience Risks

- **Notification Fatigue:** If not easily configurable, users may find the reminders annoying and disable them or uninstall the app.
- **Permission Denial:** Users may be hesitant to grant notification permissions. The value proposition must be clear.

## Implementation Notes

### File Structure Impact

- **New Files:**
  - `public/sw.js` (Service Worker)
  - `app/api/push/subscribe/route.ts`
  - `app/api/cron/deliver-reminders/route.ts`
  - `app/api/reminders/route.ts`
  - `lib/webPush.ts` (web-push setup)
  - `lib/email.ts` (email sender setup)
  - `app/clientComponents/ReminderSettings.tsx` (or similar UI component)
  - `app/utils/subscribe-push.ts` (client-side helper)
- **Modified Files:**
  - `prisma/schema.prisma` (add new models)
  - `vercel.json` (add cron job definition)
  - A user settings page to include the new `ReminderSettings` component.

### Testing Strategy

- **Unit Tests:**
  - Test the timezone and time-matching logic in the cron job.
  - Test the API route handlers with mock requests and mock Prisma calls.
- **Integration Tests:**
  - Test the full flow from client-side subscription to saving the data in the database.
- **End-to-End Tests (Manual):**
  - Manually test receiving a push notification on a real device (Android/Desktop).
  - Verify the email fallback is working.
  - Confirm that clicking the notification opens the correct URL.

## Future Considerations

- **Quiet Hours:** Allow users to define a "do not disturb" window (e.g., 10pm-7am).
- **Practice Streak:** Include motivational messages in the notification body, like "You're on a 3-day streak! 🔥".
- **Snooze/Pause:** Add "Snooze for 15m" or "Pause all for a week" options.
- **Unsubscribe Link:** Include a one-click unsubscribe link in reminder emails.
- **Firebase Cloud Messaging (FCM):** Consider migrating to FCM for more advanced features and a potentially simpler setup.
