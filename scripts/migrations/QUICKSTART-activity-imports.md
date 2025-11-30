# Activity Import Quick Reference

## One Command to Import Everything

```bash
npm run import:all-activities
```

This imports all three activity collections sequentially:

1. AsanaActivity (~78 records)
2. SeriesActivity (~412 records)
3. SequenceActivity (~130 records)

## Individual Collection Imports

```bash
npm run import:asana-activity      # Import pose practice records
npm run import:series-activity     # Import series practice records
npm run import:sequence-activity   # Import sequence practice records
```

## Before You Start

✅ MongoDB running: `npm run mongo`
✅ DATABASE_URL set in `.env.local`
✅ JSON files exist in OneDrive location

## Files Created

### Import Scripts

- `scripts/migrations/import-asana-activity.ts`
- `scripts/migrations/import-series-activity.ts`
- `scripts/migrations/import-sequence-activity.ts`

### Documentation

- `scripts/migrations/README-import-all-activities.md` - Comprehensive guide
- `scripts/migrations/README-import-asana-activity.md` - AsanaActivity specific

### Package.json Scripts Added

```json
{
  "import:asana-activity": "ts-node scripts/migrations/import-asana-activity.ts",
  "import:series-activity": "ts-node scripts/migrations/import-series-activity.ts",
  "import:sequence-activity": "ts-node scripts/migrations/import-sequence-activity.ts",
  "import:all-activities": "npm run import:asana-activity && npm run import:series-activity && npm run import:sequence-activity"
}
```

## Expected Results

| Collection       | Documents | Import Time    |
| ---------------- | --------- | -------------- |
| AsanaActivity    | ~78       | <1 second      |
| SeriesActivity   | ~412      | ~1-2 seconds   |
| SequenceActivity | ~130      | <1 second      |
| **Total**        | **~620**  | **<5 seconds** |

## Verify Import

### Quick Check

```bash
mongosh "YOUR_DATABASE_URL"
```

```javascript
use UvuyoYogaDb
db.AsanaActivity.countDocuments()
db.SeriesActivity.countDocuments()
db.SequenceActivity.countDocuments()
```

### Visual Check

```bash
npx prisma studio
```

## Common Issues

❌ **DATABASE_URL not set** → Add to `.env.local`
❌ **JSON file not found** → Check OneDrive path
❌ **Connection refused** → Start MongoDB: `npm run mongo`
❌ **Duplicate key error** → Drop collection or accept partial import

## Need Help?

See full documentation: `scripts/migrations/README-import-all-activities.md`
