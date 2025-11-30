# Image Upload Authorization Fix

## Problem

When attempting to upload images to asanas (poses), users were receiving a **403 Forbidden** error with "Unauthorized" message in the console. The upload would fail even for users who owned the asana.

**Error Details:**

```
POST http://localhost:3000/api/images/upload 403 (Forbidden)
Error: Unauthorized
```

## Root Cause

The image upload API route (`/app/api/images/upload/route.ts`) validates ownership by checking:

```typescript
if (userId !== session.user.email) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
}
```

However, the `ImageUpload` component was sending the user's **ID** instead of their **email address**:

```typescript
// WRONG - was sending ID
userId: session.user.id
```

This caused the comparison to fail because:

- API expected: `"user@example.com"` (email)
- Client sent: `"68dc5f1f4587c06b5297cd6c"` (MongoDB ObjectId)

## Solution

Updated the `ImageUpload` component to send the user's **email address** instead of ID:

```typescript
// CORRECT - now sending email
userId: session.user.email
```

Also updated the validation check to use `session?.user?.email` instead of `session?.user?.id` for consistency.

## Files Modified

### `app/clientComponents/imageUpload/ImageUpload.tsx`

**Before:**

```typescript
const handleUpload = async () => {
  if (!selectedFile || !session?.user?.id) {
    setError('Please select a file and ensure you are logged in')
    return
  }

  const uploadedImage = await uploadPoseImage({
    file: selectedFile,
    altText: altText.trim() || undefined,
    userId: session.user.id, // ❌ Wrong - sends ID
  })
}
```

**After:**

```typescript
const handleUpload = async () => {
  if (!selectedFile || !session?.user?.email) {
    setError('Please select a file and ensure you are logged in')
    return
  }

  const uploadedImage = await uploadPoseImage({
    file: selectedFile,
    altText: altText.trim() || undefined,
    userId: session.user.email, // ✅ Correct - sends email
  })
}
```

## Other Components Verified

The following components were checked and confirmed to be **already using the correct approach**:

- ✅ `app/clientComponents/imageUpload/ImageUploadWithFallback.tsx` - Uses `session.user.email`
- ✅ `app/clientComponents/imageUpload/PoseImageUpload.tsx` - Uses `session.user.email`

## API Authorization Pattern

The standard authorization pattern across the Soar application uses **email addresses** for ownership verification:

### Why Email Instead of ID?

1. **Consistency**: The `created_by` field in database models stores email addresses
2. **User-Friendly**: Email is more readable in logs and debugging
3. **Session Compatibility**: NextAuth session always has email from providers
4. **Legacy Support**: Existing data uses email addresses for ownership

### Database Schema Reference

```prisma
model AsanaPose {
  id         String @id @default(auto()) @map("_id") @db.ObjectId
  created_by String?  // Stores email address, not ObjectId
  // ...
}
```

## Testing

### Before Fix

1. Navigate to an asana you created
2. Click "Edit"
3. Try to upload an image
4. ❌ Result: 403 Forbidden error, image not uploaded

### After Fix

1. Navigate to an asana you created
2. Click "Edit"
3. Try to upload an image
4. ✅ Result: Image uploads successfully

## Impact

This fix resolves the authorization issue for:

- Asana (pose) image uploads
- Sequence image uploads (via `ImageUpload` component)
- Any feature using the basic `ImageUpload` component

**Note**: The more advanced `PoseImageUpload` and `ImageUploadWithFallback` components were already working correctly.

## Related Components

- **API Route**: `/app/api/images/upload/route.ts` - No changes needed (already correct)
- **Service**: `/lib/imageService.ts` - No changes needed (passes through userId)
- **Type Definitions**: `/types/images.ts` - No changes needed

## Prevention

To prevent this issue in the future:

1. ✅ Always use `session.user.email` for ownership checks
2. ✅ Document that `created_by` fields store email addresses
3. ✅ Use TypeScript types to enforce email usage
4. ✅ Add JSDoc comments clarifying userId should be email

## Backward Compatibility

This change maintains full backward compatibility:

- No database changes required
- No API contract changes
- Existing uploaded images continue to work
- All authorization checks remain consistent
