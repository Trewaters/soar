# Engineering Task Breakdown: User Activity Notifications

This document breaks down the work required to implement the user activity notification feature as specified in `PRD-user-activity-notifications.md`.

### 1. Data Model and Environment Setup

- **Update Prisma Schema**:
  - Modify the `User` model in `prisma/schema.prisma` to add a `tz` field for the user's timezone and relations for reminders and push subscriptions.
  - Add a new `Reminder` model to store notification preferences (`timeOfDay`, `days`, `message`, `enabled`, `lastSent`).
  - Add a new `PushSubscription` model to store the web push subscription details (`endpoint`, `p256dh`, `auth`).
- **Update Database**:
  - Run `npx prisma migrate dev --name add_notification_models` to apply the schema changes to the database.
- **Generate VAPID Keys**:
  - Run the command `npx web-push generate-vapid-keys` in your terminal.
  - Add the generated public and private keys to your environment file (`.env.local`) as `NEXT_PUBLIC_VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY`.
- **Install Dependencies**:
  - Install the required packages by running `npm install web-push resend date-fns-tz`.

### 2. Backend Implementation

- **Create Notification Services**:
  - Create `lib/webPush.ts` to initialize the `web-push` library with your VAPID keys. Export a `sendWebPush` function.
  - Create `lib/email.ts` to initialize your email sending client (e.g., `Resend`) and export a `sendReminderEmail` function.
- **Implement API Route for Push Subscriptions**:
  - Create the file `app/api/push/subscribe/route.ts`.
  - Implement a `POST` handler that validates the incoming subscription payload.
  - Use the `getCurrentUser` helper to identify the user.
  - Use Prisma to `upsert` the subscription details into the `PushSubscription` table, linking it to the user.
- **Implement API Route for Reminder Preferences**:
  - Create the file `app/api/reminders/route.ts`.
  - Implement a `POST` handler to receive and save the user's reminder settings (timezone, time of day, days of the week, etc.).
  - Use Prisma to update the `User`'s `tz` field and `upsert` their `Reminder` settings.
- **Implement Cron Job for Notification Delivery**:
  - Create the file `app/api/cron/deliver-reminders/route.ts`.
  - Implement the main `GET` handler that will be triggered by the cron job.
  - Add logic to fetch all enabled reminders, check the user's timezone, and determine if a notification should be sent based on the current time.
  - Integrate the `sendWebPush` and `sendReminderEmail` services.
  - Implement logic to detect and delete stale push subscriptions (HTTP 410).
  - Update the `lastSent` timestamp on the `Reminder` model after sending a notification.
- **Configure Cron Job**:
  - Modify `vercel.json` to add a new cron job that calls the `/api/cron/deliver-reminders` endpoint every minute.
  ```json
  {
    "crons": [
      { "path": "/api/cron/deliver-reminders", "schedule": "* * * * *" }
    ]
  }
  ```

### 3. Frontend Implementation

- **Create the Service Worker**:
  - Create a new file `public/sw.js`.
  - Add event listeners for `push` to display the notification and `notificationclick` to handle user interaction (e.g., opening the app).
- **Implement Push Subscription Client Logic**:
  - Create a utility file, e.g., `app/utils/subscribe-push.ts`.
  - Implement the `enablePush` function that registers the service worker, requests notification permission, and subscribes to the push manager.
  - This function should call the `POST /api/push/subscribe` endpoint to save the subscription.
- **Build the Reminder Settings UI**:
  - Create a new client component, `app/clientComponents/ReminderSettings.tsx`.
  - Build a form that allows users to set their timezone, preferred time, days of the week, and a custom message.
  - Include a button that calls the `enablePush` function to trigger the notification permission prompt.
  - This component should call the `POST /api/reminders` endpoint to save the user's preferences.
- **Integrate Settings Page**:
  - Create a new page at `app/settings/notifications/page.tsx`.
  - Import and render the `ReminderSettings` component on this page.
  - Ensure this page is only accessible to authenticated users.

### 4. Testing

- **Create Unit Tests**:
  - Write unit tests for the time-matching and timezone conversion logic in `app/api/cron/deliver-reminders/route.ts`.
  - Write unit tests for the API route handlers (`/api/push/subscribe`, `/api/reminders`) using mock requests and a mocked Prisma client to verify data is handled correctly.
- **Manual End-to-End Testing**:
  - On a development server (using HTTPS), navigate to the settings page and enable notifications.
  - Verify that the browser prompts for permission and the subscription is saved to the database.
  - Set a reminder for a few minutes in the future and confirm that a push notification is received.
  - Disable push notifications and verify that an email is received instead.
  - Click the notification and confirm it opens the correct page in the application.
