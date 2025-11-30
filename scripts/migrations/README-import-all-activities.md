# Activity Collections Import Guide

## Overview

This guide explains how to re-import all activity collections (AsanaActivity, SeriesActivity, SequenceActivity) into your development database after they have been deleted.

## Quick Start

### Import All Collections at Once

```bash
npm run import:all-activities
```

### Import Individual Collections

```bash
# Import AsanaActivity (individual pose practice records)
npm run import:asana-activity

# Import SeriesActivity (series practice records)
npm run import:series-activity

# Import SequenceActivity (sequence practice records)
npm run import:sequence-activity
```

## Prerequisites

1. **MongoDB Running**: Ensure your MongoDB server is running

   ```bash
   npm run mongo
   ```

2. **Environment Variable**: Make sure `DATABASE_URL` is set in your `.env.local` file

   ```env
   DATABASE_URL="mongodb://localhost:27017/UvuyoYogaDb"
   ```

3. **JSON Files**: The data files must exist at these locations:
   - `C:\Users\trewa\OneDrive\01-WORMHOLE\Yoga\app-Soar\app data\version 2 data\version 2b Data-pose\v2_UvuyoYogaDb.AsanaActivity.json`
   - `C:\Users\trewa\OneDrive\01-WORMHOLE\Yoga\app-Soar\app data\version 2 data\version 2b Data-pose\v2_UvuyoYogaDb.SeriesActivity.json`
   - `C:\Users\trewa\OneDrive\01-WORMHOLE\Yoga\app-Soar\app data\version 2 data\version 2b Data-pose\v2_UvuyoYogaDb.SequenceActivity.json`

## Collection Details

### AsanaActivity Collection

**Purpose**: Records individual yoga pose practice activities

**Expected Count**: ~78 documents

**Data Structure**:

```typescript
{
  _id: string                    // ObjectId
  userId: string                 // Reference to UserData
  poseId: string                 // Reference to AsanaPose
  poseName: string               // "Headstand, supported"
  sort_english_name: string      // For routing/sorting
  duration: number               // Seconds held
  datePerformed: Date            // When practiced
  completionStatus: string       // "complete" | "skipped" | "partial"
  difficulty?: string            // "easy" | "average" | "difficult"
  notes?: string                 // User notes
  sensations?: string            // Body sensations
  createdAt: Date
  updatedAt: Date
}
```

### SeriesActivity Collection

**Purpose**: Records yoga series practice activities

**Expected Count**: ~412 documents (from 826 lines in JSON)

**Data Structure**:

```typescript
{
  _id: string                    // ObjectId
  userId: string                 // Reference to UserData
  seriesId: string               // Reference to AsanaSeries
  seriesName: string             // "Sun Salutation A"
  datePerformed: Date            // When practiced
  difficulty?: string            // "easy" | "average" | "difficult"
  completionStatus: string       // "complete" | "skipped" | "partial"
  duration: number               // Seconds (default 0)
  notes?: string                 // User notes
  createdAt: Date
  updatedAt: Date
}
```

### SequenceActivity Collection

**Purpose**: Records yoga sequence practice activities

**Expected Count**: ~130 documents (from 260 lines in JSON)

**Data Structure**:

```typescript
{
  _id: string                    // ObjectId
  userId: string                 // Reference to UserData
  sequenceId: string             // Reference to AsanaSequence
  sequenceName: string           // "C1 Corepower"
  datePerformed: Date            // When practiced
  difficulty?: string            // "easy" | "average" | "difficult"
  completionStatus: string       // "complete" | "skipped" | "partial"
  duration: number               // Seconds (default 0)
  notes?: string                 // User notes
  createdAt: Date
  updatedAt: Date
}
```

## Import Execution

### Expected Output for All Collections

When running `npm run import:all-activities`, you'll see output for each collection:

```
============================================================
AsanaActivity Collection Import
============================================================
📂 Reading JSON file...
✓ Successfully read 78 documents from file
🔌 Connecting to MongoDB...
✓ Connected to MongoDB
💾 Inserting documents...
✓ Import completed successfully
   Documents inserted: 78
✅ Import completed successfully!
============================================================

============================================================
SeriesActivity Collection Import
============================================================
📂 Reading JSON file...
✓ Successfully read 412 documents from file
🔌 Connecting to MongoDB...
✓ Connected to MongoDB
💾 Inserting documents...
✓ Import completed successfully
   Documents inserted: 412
✅ Import completed successfully!
============================================================

============================================================
SequenceActivity Collection Import
============================================================
📂 Reading JSON file...
✓ Successfully read 130 documents from file
🔌 Connecting to MongoDB...
✓ Connected to MongoDB
💾 Inserting documents...
✓ Import completed successfully
   Documents inserted: 130
✅ Import completed successfully!
============================================================
```

## Handling Existing Data

By default, all import scripts **add to existing documents** without dropping collections. To replace existing data:

### Option 1: Edit Import Scripts (Recommended for Clean Import)

In each import script, uncomment these lines:

```typescript
// In import-asana-activity.ts
// In import-series-activity.ts
// In import-sequence-activity.ts

// Find these lines (around line 125):
// console.log('🗑️  Dropping existing collection...')
// await collection.drop()
// console.log('✓ Collection dropped')

// Remove the comment markers to enable:
console.log('🗑️  Dropping existing collection...')
await collection.drop()
console.log('✓ Collection dropped')
```

### Option 2: Manual MongoDB Cleanup

```bash
mongosh "YOUR_DATABASE_URL"
```

```javascript
use UvuyoYogaDb

// Drop individual collections
db.AsanaActivity.drop()
db.SeriesActivity.drop()
db.SequenceActivity.drop()

// Or drop all three at once
db.AsanaActivity.drop()
db.SeriesActivity.drop()
db.SequenceActivity.drop()
```

## Troubleshooting

### Error: DATABASE_URL not set

```
❌ ERROR: DATABASE_URL environment variable not set
```

**Solution**: Add to `.env.local`:

```env
DATABASE_URL="mongodb://localhost:27017/UvuyoYogaDb"
```

### Error: JSON file not found

```
❌ ERROR: JSON file not found
Path: C:\Users\trewa\OneDrive\...
```

**Solution**: Verify files exist at specified paths. If files are elsewhere, update the `JSON_FILE_PATH` constant in each import script.

### Error: Duplicate key error

```
❌ ERROR: Import failed
   Duplicate key error - some documents may already exist
   Partial import may have succeeded
```

**Solution**:

1. Drop the collection first (see "Handling Existing Data" above)
2. Or accept partial import (non-duplicate documents were imported)

### Error: Connection refused

```
MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Start MongoDB:

```bash
npm run mongo
```

### Import Hangs or Takes Too Long

**Solution**:

1. Check MongoDB server is running and responsive
2. Verify JSON files aren't corrupted
3. Check available disk space
4. Review MongoDB logs for issues

## Verification

### Using Prisma Studio

```bash
npx prisma studio
```

Navigate to each collection to verify imported records:

- AsanaActivity: ~78 records
- SeriesActivity: ~412 records
- SequenceActivity: ~130 records

### Using MongoDB Shell

```bash
mongosh "YOUR_DATABASE_URL"
```

```javascript
use UvuyoYogaDb

// Check document counts
db.AsanaActivity.countDocuments()     // Should show ~78
db.SeriesActivity.countDocuments()    // Should show ~412
db.SequenceActivity.countDocuments()  // Should show ~130

// View sample documents
db.AsanaActivity.findOne()
db.SeriesActivity.findOne()
db.SequenceActivity.findOne()

// Check recent imports
db.AsanaActivity.find().sort({createdAt: -1}).limit(5)
db.SeriesActivity.find().sort({createdAt: -1}).limit(5)
db.SequenceActivity.find().sort({createdAt: -1}).limit(5)
```

### Using the Application

1. Log into Soar application
2. Check user practice history dashboard
3. Verify activity data appears in:
   - Individual pose tracking (AsanaActivity)
   - Series practice records (SeriesActivity)
   - Sequence practice records (SequenceActivity)
   - User statistics and charts

## Related Files

### Import Scripts (TypeScript)

- `scripts/migrations/import-asana-activity.ts`
- `scripts/migrations/import-series-activity.ts`
- `scripts/migrations/import-sequence-activity.ts`

### Source Data Files

- `C:\Users\trewa\OneDrive\01-WORMHOLE\Yoga\app-Soar\app data\version 2 data\version 2b Data-pose\v2_UvuyoYogaDb.AsanaActivity.json`
- `C:\Users\trewa\OneDrive\01-WORMHOLE\Yoga\app-Soar\app data\version 2 data\version 2b Data-pose\v2_UvuyoYogaDb.SeriesActivity.json`
- `C:\Users\trewa\OneDrive\01-WORMHOLE\Yoga\app-Soar\app data\version 2 data\version 2b Data-pose\v2_UvuyoYogaDb.SequenceActivity.json`

### Prisma Schema

- `prisma/schema.prisma` (see models: AsanaActivity, SeriesActivity, SequenceActivity)

## NPM Scripts Reference

```json
{
  "import:asana-activity": "Import AsanaActivity collection",
  "import:series-activity": "Import SeriesActivity collection",
  "import:sequence-activity": "Import SequenceActivity collection",
  "import:all-activities": "Import all three collections sequentially"
}
```

## Best Practices

### Before Import

1. **Backup existing data** if any important records exist
2. **Verify MongoDB is running** and accessible
3. **Check disk space** for database growth
4. **Review JSON files** for data integrity

### During Import

1. **Monitor progress** through console output
2. **Watch for errors** especially duplicate key issues
3. **Don't interrupt** the import process
4. **Note document counts** for verification

### After Import

1. **Verify counts** match expected numbers
2. **Test application features** that use activity data
3. **Check user dashboards** for data display
4. **Validate relationships** between users, poses, series, and sequences
5. **Create backup** of newly imported data

## Data Relationships

All activity collections reference core yoga data:

```
UserData (users)
  ├── AsanaActivity (pose practice records)
  │   └── References: AsanaPose
  ├── SeriesActivity (series practice records)
  │   └── References: AsanaSeries (not enforced in Prisma)
  └── SequenceActivity (sequence practice records)
      └── References: AsanaSequence (not enforced in Prisma)
```

**Important**: SeriesActivity and SequenceActivity use string IDs (not ObjectId refs with `@db.ObjectId`) for seriesId and sequenceId. Ensure referenced series/sequences exist before importing activities.

## Performance Considerations

- **AsanaActivity**: ~78 docs - Fast import (<1 second)
- **SeriesActivity**: ~412 docs - Medium import (~1-2 seconds)
- **SequenceActivity**: ~130 docs - Fast import (<1 second)
- **All Collections**: Total ~620 docs - Should complete in under 5 seconds

Large imports may benefit from:

- Indexing after import rather than before
- Batch sizes for very large datasets (not needed for current sizes)
- Running imports during low-traffic periods

## Support

If you encounter issues not covered here:

1. Check MongoDB server logs
2. Verify Prisma schema matches data structure
3. Ensure all referenced documents exist (users, poses, series, sequences)
4. Review import script output for specific error messages
5. Check file permissions for JSON source files
