# Cloudflare Images API Token Fix Guide

## Problem

The current Cloudflare API token doesn't have the required permissions to upload images, resulting in error code 5403: "The given account is not valid or is not authorized to access this service."

## Root Cause

Your API token was created with insufficient permissions. While it can verify and list images, it cannot upload new images to Cloudflare Images.

## Solution: Create a New API Token

### Step 1: Access Cloudflare API Tokens

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**

### Step 2: Configure Token Permissions

1. Use **"Custom token"** template
2. Set the following permissions:
   - **Account** → `Cloudflare Images:Edit`
   - **Zone** → `Zone:Read` (optional, only if using custom domains)

### Step 3: Configure Resources

1. **Account Resources**:
   - Select "Include" → "All accounts"
   - OR select your specific account: ``
2. **Zone Resources** (if you added Zone permission):
   - Select "Include" → "All zones"

### Step 4: Create and Copy Token

1. Click **"Continue to summary"**
2. Click **"Create Token"**
3. **Copy the new token immediately** (you won't be able to see it again)

### Step 5: Update Environment Variables

1. Open `.env.local` in your project
2. Replace the current token:
   ```bash
   CLOUDFLARE_API_TOKEN=your_new_token_here
   ```
3. Save the file
4. Restart your development server

## Testing the Fix

### Method 1: Using the Application

1. Restart your Next.js server: `npm run dev`
2. Navigate to an asana page with image upload
3. Try uploading an image
4. You should now see a success message

### Method 2: Command Line Test

```bash
curl -X GET "https://api.cloudflare.com/client/v4/accounts//images/v1" \
  -H "Authorization: Bearer YOUR_NEW_TOKEN" \
  -H "Content-Type: application/json"
```

## Important Notes

1. **Token Security**: Keep your API token secure and never commit it to version control
2. **Token Expiration**: Consider setting an appropriate expiration date for security
3. **Minimum Permissions**: The token only needs `Cloudflare Images:Edit` permission for basic functionality
4. **Account Verification**: Make sure the token is created under the same Cloudflare account that owns the Account ID

## Error Messages

With the updated code, you'll now see clearer error messages:

- **Before**: "Failed to upload image to Cloudflare"
- **After**: "Cloudflare Images permission denied. Please check your API token permissions."

## Verification Steps

1. **Token is Valid**: ✅ Confirmed
2. **Account ID is Correct**: ✅ Confirmed
3. **Token Has Upload Permissions**: ❌ **This needs to be fixed**
4. **Cloudflare Images is Enabled**: ✅ Confirmed

## Alternative: Verify Current Token Permissions

You can check what permissions your current token has:

```bash
curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer YOUR_CURRENT_TOKEN" \
  -H "Content-Type: application/json"
```

However, this doesn't show detailed permissions, so creating a new token with explicit permissions is the recommended approach.
