# Activity Streak Debugging Guide

## Problem Summary

The activity streak is showing **0 days** in production (https://www.happyyoga.app) but **7 days** in localhost. This suggests a timezone-related calculation issue.

## Root Cause Analysis

### The Core Issue: Timezone Handling

The `calculateActivityStreak` function in `app/lib/dashboardService.ts` uses JavaScript's `new Date()` which operates in the **server's timezone**:

- **Localhost**: Your computer's timezone (likely your local timezone)
- **Production (Vercel)**: UTC timezone (default for Vercel servers)

### How This Affects Streak Calculation

When the server calculates "today's date" using `new Date()`, it gets different results:

```typescript
// On localhost (e.g., PST/PDT - UTC-8)
const today = new Date() // 2025-11-21 in PST

// On production (UTC)
const today = new Date() // Could be 2025-11-22 if after 4pm PST
```

This timezone difference causes:

1. **Different "today" dates** between environments
2. **Different "days since last activity" calculations**
3. **Broken streak** if the calculation determines last activity was >1 day ago

## Debug Tools Created

I've created two debugging tools to help analyze this issue:

### 1. Debug API Endpoint

**Location**: `/api/debug/activity-streak`

This endpoint provides detailed information about:

- Server timezone and current date
- All user activities and their dates
- Unique days with activity
- Streak calculation step-by-step
- Whether the streak is broken and why

### 2. Debug Page (Visual Interface)

**Location**: `/debug/activity-streak`

**How to Use**:

1. **In Production**: Visit https://www.happyyoga.app/debug/activity-streak
2. **In Localhost**: Visit http://localhost:3000/debug/activity-streak

This page shows:

- **Timezone Comparison**: Client (browser) vs Server timezone
- **Date Mismatch Detection**: Highlights if client and server dates differ
- **Streak Calculation Details**: Day-by-day breakdown of the streak logic
- **Activity Summary**: All your recent activities with timestamps
- **Raw Date Data**: ISO, UTC, and local string representations

## How to Analyze the Issue

### Step 1: Visit the Debug Page

1. Open the debug page in both environments:

   - Production: https://www.happyyoga.app/debug/activity-streak
   - Localhost: http://localhost:3000/debug/activity-streak

2. Compare the **Timezone Comparison** section:
   - Look for date mismatches between client and server
   - Note the timezone offset differences

### Step 2: Review Streak Calculation

Check the **Streak Calculation Details** section:

- Each row shows what date the algorithm expected vs. what it found
- A "No Match" indicates where the streak breaks
- Compare the "Days Since Last Activity" value

### Step 3: Examine Activity Dates

In the **Detailed Activity Dates** section:

- Look at the `datePerformed` ISO timestamps
- Check if activities are being stored in the correct dates
- Verify that the date extraction logic matches your expectations

## Expected Findings

You'll likely find one of these scenarios:

### Scenario A: Timezone Offset Causing Date Shift

- **Production server**: Shows date as 2025-11-22
- **Your browser**: Shows date as 2025-11-21
- **Last activity**: Recorded as 2025-11-21
- **Result**: Server calculates 1 day ago, breaks streak

### Scenario B: Activity Times Near Midnight

- Activities recorded near midnight (23:00-01:00)
- Server interprets them as different days due to UTC conversion
- Streak logic expects consecutive days but sees gaps

## Solutions

Once you've identified the specific issue, here are potential solutions:

### Solution 1: Pass Client Timezone to Server

Modify the API to accept the user's timezone and perform calculations in user's local time.

### Solution 2: Store Timezone with Activities

When recording activities, store the user's timezone so calculations can be adjusted.

### Solution 3: Use UTC Consistently

Normalize all date calculations to UTC and adjust display logic on the client.

### Solution 4: Lenient Streak Calculation

Allow a grace period (e.g., 36 hours instead of 24) to account for timezone differences.

## Next Steps

1. **Visit the debug page** in production to gather data
2. **Take screenshots** of the key sections (Timezone Comparison, Streak Calculation)
3. **Share the findings** so we can determine the best solution
4. **Implement the fix** based on the specific timezone issue found

## Files to Review

- `app/lib/dashboardService.ts` (lines 91-180) - Activity streak calculation
- `app/api/dashboard/stats/route.ts` - Dashboard stats API
- `app/api/debug/activity-streak/route.ts` - New debug endpoint
- `app/debug/activity-streak/page.tsx` - New debug page

## Additional Debugging

If you need to see raw database records:

```bash
# Connect to MongoDB and check activity records
db.AsanaActivity.find({ userId: "your-user-id" }).sort({ datePerformed: -1 }).limit(20)
db.SeriesActivity.find({ userId: "your-user-id" }).sort({ datePerformed: -1 }).limit(20)
db.SequenceActivity.find({ userId: "your-user-id" }).sort({ datePerformed: -1 }).limit(20)
```

This will show the actual `datePerformed` values as stored in MongoDB.
