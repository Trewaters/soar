# Production Login Streak Troubleshooting Guide

## Enhanced Error Logging Overview

The login streak API has been enhanced with comprehensive logging to help debug production issues. This document explains how to use the new logging to troubleshoot problems.

## What's New in the Enhanced Logging

### 1. Request Tracking

- Every request now has a unique `requestId` for tracing
- Request headers include `X-Request-ID`, `X-Environment`, and `X-Timestamp`
- All logs include the request ID for correlation

### 2. Environment Diagnostics

- Database connection string validation
- Environment variable availability checks
- Deployment platform detection (Vercel, local, etc.)
- Region and function ID tracking

### 3. Database Connection Testing

- Connection timing measurements
- Database provider detection (MongoDB, PostgreSQL, etc.)
- Atlas cluster detection for MongoDB
- Connection failure root cause analysis

### 4. User Lookup Diagnostics

- User existence verification with timing
- Collection inspection when user not found
- Sample user data for comparison
- User ID format validation

### 5. Performance Monitoring

- Query execution timing
- Date processing performance
- Streak calculation timing
- Total request duration

### 6. Enhanced Error Context

- Stack traces in all error logs
- Network information (User-Agent, Referer)
- Browser connection diagnostics
- Environment-specific error details

## How to Troubleshoot Production Issues

### Step 1: Check Vercel Function Logs

1. Go to your Vercel dashboard
2. Navigate to your project's Functions tab
3. Look for logs from `/api/user/loginStreak`
4. Search for the specific `requestId` or user ID

### Step 2: Use the Debug Scripts

#### For Production Testing:

```bash
node scripts/debug-production-login-streak.js https://yourapp.vercel.app [userId]
```

#### For Local Testing:

```bash
node scripts/test-login-streak.js dev [userId]
```

### Step 3: Common Issues and Solutions

#### Issue: "Database configuration missing"

**Symptoms:** Error in logs about missing DATABASE_URL
**Solution:**

1. Check Vercel environment variables
2. Ensure DATABASE_URL is set correctly
3. Verify the connection string format

#### Issue: "Database connection failed"

**Symptoms:** Connection timeouts or authentication errors
**Solution:**

1. Test the connection string manually with mongosh
2. Check if IP whitelist includes Vercel's IP ranges
3. Verify database user permissions

#### Issue: "User not found"

**Symptoms:** API returns 404 for valid users
**Solution:**

1. Check the logs for "UserData collection diagnostics"
2. Verify the user ID format and casing
3. Ensure the user exists in the correct database

#### Issue: "Failed to calculate login streak"

**Symptoms:** 500 error during streak calculation
**Solution:**

1. Check UserLogin collection for the user
2. Verify date formats in the database
3. Look for timezone-related issues in the logs

### Step 4: Understanding the Enhanced Logs

#### Request Start Log:

```
=== GET /api/user/loginStreak called ===
{
  "requestId": "uuid-here",
  "timestamp": "2025-06-15T...",
  "environment": "production",
  "deployment": "vercel",
  "url": "/api/user/loginStreak?userId=...",
  ...
}
```

#### Database Connection Log:

```
Database connection successful {
  "requestId": "uuid-here",
  "connectionTimeMs": 150,
  "dbProvider": "MongoDB"
}
```

#### User Diagnostics Log (when user not found):

```
UserData collection diagnostics: {
  "totalUsersCount": 25,
  "recentUserIds": ["id1", "id2", ...],
  "userIdType": "string",
  "userIdLength": 25
}
```

#### Streak Calculation Log:

```
Streak calculation completed: {
  "result": {
    "currentStreak": 5,
    "longestStreak": 12,
    "lastLoginDate": "2025-06-15T...",
    "isActiveToday": true
  },
  "timings": {
    "totalTimeMs": 85,
    "queryTimeMs": 45,
    "streakCalculationTimeMs": 25
  }
}
```

### Step 5: Compare with Localhost

If the API works locally but not in production:

1. Run the same request on localhost with debugging
2. Compare the log outputs
3. Look for differences in:
   - Database connection timing
   - User data availability
   - Date/timezone handling
   - Environment variables

### Step 6: Monitor Performance

Watch for these performance indicators in the logs:

- Connection time > 1000ms (slow database)
- Query time > 500ms (database performance issues)
- Total request time > 2000ms (overall slowness)

## Debug Information in Responses

In development mode, API responses include a `debugInfo` field with:

- Calculation timing
- Environment details
- Request metadata

In production, this field is excluded for security.

## Best Practices for Production Debugging

1. **Always include the requestId** when reporting issues
2. **Check both client and server logs** for complete context
3. **Test with multiple user IDs** to isolate user-specific issues
4. **Monitor trends** in response times and error rates
5. **Use the debug scripts** regularly to catch issues early

## Need Help?

If you're still experiencing issues after following this guide:

1. Collect the relevant requestId from the logs
2. Note the specific error message and timestamp
3. Include information about when it started failing
4. Test with the debug scripts and include those results
