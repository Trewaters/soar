# MongoDB Database Sync and Backup Process

## Overview

This document describes the processes for syncing your local development database with production data, creating backups of production data, and restoring from backups in the Soar yoga application.

## Prerequisites

- Local MongoDB running on `localhost:27017`
- Access to production MongoDB Atlas database
- Environment variables configured in `.env.local`

## Environment Configuration

Your `.env.local` file must have both connection strings configured:

```env
# Local development MongoDB URI
MONGODB_URI=mongodb://localhost:27017/yogaDBSandbox

# Production MongoDB URI for backups and syncing
MONGODB_PROD_URI='mongodb+srv://trewaters:WEbPgqS%25V521ACpG@yogadb.vtzgbh1.mongodb.net/yogadb?retryWrites=true&w=majority'

# Optional: Custom backup directory (defaults to ./backups)
BACKUP_DIR=./backups
```

## Database Sync Process

### Purpose

Synchronize your local development database with production data. This is useful when you need fresh production data for testing features or reproducing bugs.

### Command

```bash
npm run sync:db
```

### What It Does

1. Connects to both production (read-only) and local (read-write) MongoDB databases
2. Lists all collections in production
3. For each collection:
   - Drops the local version (clean slate)
   - Copies all documents from production to local
4. Skips system collections automatically
5. Preserves your authentication sessions (since you use the same Google account)

### When to Use

- After making test data changes you want to discard
- When you need to test with real production data
- Before starting work on a new feature that requires production data
- When debugging production-specific issues

### Safety Notes

- ✅ **Your Google login will work** - same account in dev and prod
- ✅ **Production is never modified** - read-only access
- ⚠️ **Local data will be completely replaced** - any test data is lost
- ⚠️ **Requires local MongoDB to be running** - start with `npm run mongo`

### Example Output

```
🔌 Connecting to production database...
🔌 Connecting to local database...

📦 Found 8 collections in production

📋 Processing collection: users
   └─ 15 documents found
   └─ 🗑️  Dropped existing local collection
   └─ ✅ Copied 15 documents

📋 Processing collection: asana
   └─ 234 documents found
   └─ 🗑️  Dropped existing local collection
   └─ ✅ Copied 234 documents

✨ Database sync completed successfully!
```

## Backup Process

### Purpose

Create a timestamped backup of all production data to your local machine. Backups are stored as JSON files for easy inspection and restoration.

### Command

```bash
npm run backup:prod
```

### What It Does

1. Connects to production MongoDB (read-only)
2. Creates a timestamped folder in `./backups/`
3. Exports each collection as a JSON file
4. Generates metadata file with statistics
5. Creates a human-readable summary file

### Backup Structure

```
backups/
└── backup-2024-11-17T10-30-00-000Z/
    ├── _backup-metadata.json      # Backup statistics and info
    ├── _backup-summary.txt         # Human-readable summary
    ├── users.json                  # User collection data
    ├── asana.json                  # Yoga poses
    ├── asanaSeries.json           # Pose series
    ├── asanaSequence.json         # Yoga sequences
    ├── userData.json              # User preferences
    ├── accounts.json              # NextAuth accounts
    └── sessions.json              # NextAuth sessions
```

### When to Use

- Before major production deployments
- Before running database migrations
- Weekly/monthly for disaster recovery
- Before making risky production changes
- As part of your regular backup strategy

### Example Output

```
🔌 Connecting to production database...
✅ Connected successfully!

📦 Found 8 collections in production

💾 Backing up collection: asana
   └─ 234 documents found
   └─ ✅ Saved to: backups/backup-2024-11-17T10-30-00-000Z/asana.json

✨ Backup completed successfully!

📊 Backup Summary:
   - Collections backed up: 8
   - Total documents: 512
   - Backup location: backups/backup-2024-11-17T10-30-00-000Z
   - Timestamp: 2024-11-17T10:30:00.000Z

📄 Collection Details:
   - users: 15 documents
   - asana: 234 documents
   - asanaSeries: 45 documents
   - asanaSequence: 78 documents
   - userData: 32 documents
   - accounts: 18 documents
   - sessions: 12 documents
   - verificationtokens: 78 documents
```

## Restore Process

### Purpose

Restore your local development database from a previously created backup. Useful for testing rollback scenarios or reverting to a known good state.

### Command

```bash
# List available backups
npm run restore:backup

# Restore specific backup
npm run restore:backup backup-2024-11-17T10-30-00-000Z
```

### What It Does

1. Validates that the backup folder exists
2. Displays backup metadata (when it was created, how much data)
3. Connects to local MongoDB
4. For each collection in the backup:
   - Drops the existing local collection
   - Restores all documents from the backup JSON file
5. Displays restoration statistics

### When to Use

- After testing destructive operations
- When you need to revert to a specific data state
- Testing backup restoration procedures
- Recovering from accidental local data corruption

### Example Output

```
📂 Restoring from: backups/backup-2024-11-17T10-30-00-000Z

📋 Backup created: 11/17/2024, 10:30:00 AM
📦 Collections: 8
📄 Documents: 512

🔌 Connecting to local database...
✅ Connected successfully!

🔄 Restoring 8 collections...

💾 Restoring collection: asana
   └─ 234 documents to restore
   └─ 🗑️  Dropped existing local collection
   └─ ✅ Restored 234 documents

✨ Restore completed successfully!
```

## Workflow Recommendations

### Daily Development Workflow

1. **Start of day**: Sync with production if needed

   ```bash
   npm run sync:db
   ```

2. **During development**: Work with local data freely

3. **Testing destructive changes**: Create a backup first
   ```bash
   npm run backup:prod
   ```

### Before Major Changes

1. **Create production backup**

   ```bash
   npm run backup:prod
   ```

2. **Sync local with production**

   ```bash
   npm run sync:db
   ```

3. **Test changes locally**

4. **Deploy to production if tests pass**

### Disaster Recovery

If you need to restore local data:

1. **List available backups**

   ```bash
   npm run restore:backup
   ```

2. **Choose a backup and restore**
   ```bash
   npm run restore:backup backup-2024-11-17T10-30-00-000Z
   ```

## Troubleshooting

### Error: Missing environment variables

**Problem**: `MONGODB_URI` or `MONGODB_PROD_URI` not set

**Solution**: Add both to `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/yogaDBSandbox
MONGODB_PROD_URI='mongodb+srv://...'
```

### Error: Cannot connect to local MongoDB

**Problem**: Local MongoDB is not running

**Solution**: Start MongoDB first:

```bash
npm run mongo
```

### Error: Backup folder not found

**Problem**: Specified backup doesn't exist

**Solution**: List available backups:

```bash
npm run restore:backup
```

### Error: Connection timeout to production

**Problem**: Network issues or invalid production URI

**Solution**:

1. Check your internet connection
2. Verify the production connection string in `.env.local`
3. Ensure your IP is whitelisted in MongoDB Atlas

## Script Locations

- **Sync script**: `scripts/syncDb/sync-db-from-prod.ts`
- **Backup script**: `scripts/syncDb/backup-prod-db.ts`
- **Restore script**: `scripts/syncDb/restore-from-backup.ts`

## Security Considerations

### Production Safety

- ✅ All scripts use **read-only** access to production
- ✅ Production data is never modified by these scripts
- ✅ Authentication credentials stored in `.env.local` (gitignored)

### Local Safety

- ⚠️ Sync and restore operations **completely replace** local data
- ⚠️ No confirmation prompts (by design for automation)
- ⚠️ Always ensure you have backups before major operations

### Credential Management

- 🔒 Never commit `.env.local` to git (already in `.gitignore`)
- 🔒 Keep production credentials secure
- 🔒 Use MongoDB Atlas IP whitelisting for additional security
- 🔒 Rotate credentials periodically

## Automation Options

### Scheduled Backups (Windows Task Scheduler)

Create a scheduled task to run daily backups:

1. Open Task Scheduler
2. Create new task
3. Set trigger: Daily at 2 AM
4. Set action: Run program
   - Program: `cmd.exe`
   - Arguments: `/c cd "C:\Users\trewa\Documents\Github\NextJS tutorials\soar" && npm run backup:prod`

### Scheduled Backups (Bash/Cron-like)

If using WSL or Git Bash with cron:

```bash
# Run daily at 2 AM
0 2 * * * cd /path/to/soar && npm run backup:prod
```

## Best Practices

### Backup Strategy

- 🎯 Create backups before major releases
- 🎯 Keep at least 7 days of daily backups
- 🎯 Keep at least 4 weekly backups
- 🎯 Test restoration periodically

### Development Workflow

- 🎯 Sync with production when starting new features
- 🎯 Don't sync in the middle of development work
- 🎯 Use backup/restore for testing rollback scenarios
- 🎯 Keep local test data separate from production syncs

### Data Management

- 🎯 Document any test users or data you need to preserve
- 🎯 Clean up old backups periodically (keep last 30 days)
- 🎯 Verify backup integrity by testing restoration
- 🎯 Monitor backup sizes for unexpected growth

## Related Documentation

- [MongoDB Setup Guide](../../README_MongoDB.md)
- [Prisma Configuration](../../prisma/schema.prisma)
- [Environment Variables Guide](../.env.example) (if exists)

## Support

For issues or questions:

- Check the troubleshooting section above
- Review script output for specific error messages
- Ensure MongoDB services are running
- Verify network connectivity to MongoDB Atlas
