# AsanaActivity Collection Import Guide

## Overview

This guide explains how to re-import the `AsanaActivity` collection into your development database after it has been deleted.

## Quick Start

The easiest way to import the data is to use the npm script:

```bash
npm run import:asana-activity
```

This will:

- Read the JSON file from your data directory
- Transform the MongoDB export format to JavaScript objects
- Insert the documents into your MongoDB database
- Provide detailed progress and error reporting

## Prerequisites

1. **MongoDB Running**: Ensure your MongoDB server is running
2. **Environment Variable**: Make sure `DATABASE_URL` is set in your `.env.local` file
3. **JSON File**: The data file must exist at:
   ```
   C:\Users\trewa\OneDrive\01-WORMHOLE\Yoga\app-Soar\app data\version 2 data\version 2b Data-pose\v2_UvuyoYogaDb.AsanaActivity.json
   ```

## Import Methods

### Method 1: Using npm script (Recommended)

```bash
npm run import:asana-activity
```

**Advantages:**

- Simple one-command execution
- Detailed progress reporting
- Automatic error handling
- Type-safe with TypeScript

### Method 2: Using mongoimport (Direct)

If you prefer to use MongoDB's native import tool:

```bash
mongoimport --uri="YOUR_DATABASE_URL" \
  --collection=AsanaActivity \
  --file="C:\Users\trewa\OneDrive\01-WORMHOLE\Yoga\app-Soar\app data\version 2 data\version 2b Data-pose\v2_UvuyoYogaDb.AsanaActivity.json" \
  --jsonArray \
  --drop
```

**Advantages:**

- Native MongoDB tool
- Very fast for large datasets
- `--drop` flag replaces existing data

### Method 3: Using mongosh script

```bash
mongosh "YOUR_DATABASE_URL" < scripts/migrations/import-asana-activity.js
```

**Note:** This script only provides instructions, not actual import functionality.

## Important Considerations

### Handling Existing Data

By default, the import script **adds to existing documents** without dropping the collection. If you want to replace all existing data:

1. **Option A:** Manually drop the collection first:

   ```typescript
   // In the import script, uncomment these lines:
   console.log('🗑️  Dropping existing collection...')
   await collection.drop()
   console.log('✓ Collection dropped')
   ```

2. **Option B:** Use mongoimport with `--drop` flag (see Method 2 above)

### Duplicate Key Errors

If you try to import documents that already exist (same `_id`), you'll get duplicate key errors. The script uses `ordered: false` to continue importing other documents even if some fail.

## Expected Output

When running `npm run import:asana-activity`, you should see:

```
============================================================
AsanaActivity Collection Import
============================================================

📂 Reading JSON file...
   Path: C:\Users\trewa\OneDrive\01-WORMHOLE\...\v2_UvuyoYogaDb.AsanaActivity.json
✓ Successfully read 78 documents from file

🔌 Connecting to MongoDB...
✓ Connected to MongoDB

📊 Pre-import status:
   Existing documents: 0

🔄 Transforming documents...
✓ Transformed 78 documents

💾 Inserting documents...
✓ Import completed successfully
   Documents inserted: 78
   Duration: 0.42 seconds

📊 Post-import status:
   Total documents: 78
   New documents added: 78

============================================================
✅ Import completed successfully!
============================================================
🔌 MongoDB connection closed
```

## Troubleshooting

### Error: DATABASE_URL not set

```
❌ ERROR: DATABASE_URL environment variable not set
Please set DATABASE_URL in your .env file
```

**Solution:** Add `DATABASE_URL` to your `.env.local` file:

```env
DATABASE_URL="mongodb://localhost:27017/UvuyoYogaDb"
```

### Error: JSON file not found

```
❌ ERROR: JSON file not found
Path: C:\Users\trewa\OneDrive\...
```

**Solution:** Verify the file exists at the specified path. If the file is in a different location, update the `JSON_FILE_PATH` constant in `scripts/migrations/import-asana-activity.ts`.

### Error: Duplicate key error

```
❌ ERROR: Import failed
   Duplicate key error - some documents may already exist
   Partial import may have succeeded
```

**Solution:** Some documents already exist in the database. You can:

1. Drop the collection and try again
2. Modify the JSON file to remove duplicate `_id` values
3. Accept the partial import (non-duplicate documents were imported)

### Error: Connection refused

```
MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Start your MongoDB server:

```bash
npm run mongo
# Or directly:
mongod --config C:/data/config/mongod.conf
```

## Data Structure

The imported documents will have this structure:

```typescript
{
  _id: "68fc4a6ca76e17a612e5c2ba",           // ObjectId as string
  userId: "673e5d2d3d92e4747b15b287",        // Reference to UserData
  poseId: "68f7f2dcded0983a7df56fd8",        // Reference to AsanaPose
  poseName: "Headstand, supported",          // English pose name
  sort_english_name: "Headstand, supported", // For routing/sorting
  duration: 0,                               // Duration in seconds
  datePerformed: "2025-10-25T03:56:27.857Z", // ISO date string
  completionStatus: "complete",              // "complete", "skipped", "partial"
  createdAt: "2025-10-25T03:56:27.999Z",     // Record creation date
  updatedAt: "2025-10-25T03:56:27.999Z",     // Last update date
  // Optional fields:
  notes?: string,                            // User notes
  sensations?: string,                       // Body sensations
  difficulty?: "easy" | "average" | "difficult"
}
```

## Related Files

- **Import Script (TypeScript)**: `scripts/migrations/import-asana-activity.ts`
- **Import Script (mongosh)**: `scripts/migrations/import-asana-activity.js`
- **Source Data**: `C:\Users\trewa\OneDrive\01-WORMHOLE\Yoga\app-Soar\app data\version 2 data\version 2b Data-pose\v2_UvuyoYogaDb.AsanaActivity.json`
- **Prisma Schema**: `prisma/schema.prisma` (see `model AsanaActivity`)

## Verifying the Import

After importing, verify the data in your database:

### Using Prisma Studio

```bash
npx prisma studio
```

Navigate to the `AsanaActivity` collection to view the imported records.

### Using MongoDB Shell

```bash
mongosh "YOUR_DATABASE_URL"
```

Then run:

```javascript
use UvuyoYogaDb
db.AsanaActivity.countDocuments()  // Should show 78 (or your expected count)
db.AsanaActivity.findOne()         // View a sample document
```

### Using the Application

Log into your Soar application and check if asana activity data appears in:

- User practice history
- Asana tracking features
- Activity dashboards

## Next Steps

After successfully importing the data:

1. **Verify relationships**: Ensure `userId` and `poseId` references point to valid documents
2. **Test features**: Check that yoga activity tracking works correctly
3. **Backup**: Create a backup of your database after successful import
4. **Monitor**: Watch for any issues with the imported data in production use

## Support

If you encounter issues not covered in this guide:

1. Check the MongoDB logs for detailed error messages
2. Verify your Prisma schema matches the data structure
3. Ensure all referenced documents (users, poses) exist in the database
