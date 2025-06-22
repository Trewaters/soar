# Cloudflare Images Setup Guide

## Step 1: Get Your Cloudflare Account ID

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Log in to your account
3. On the right sidebar, you'll see your **Account ID**
4. Copy this Account ID

## Step 2: Create an API Token

1. Go to [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use the "Custom token" template
4. Configure the token with these permissions:
   - **Account** - `Cloudflare Images:Edit`
   - **Zone** - `Zone:Read` (if you have any zones)
5. Add your Account ID to "Account Resources"
6. Click "Continue to summary"
7. Click "Create Token"
8. **Copy the token immediately** (you won't be able to see it again)

## Step 3: Update Environment Variables

1. Open your `.env.local` file in the soar project
2. Replace the placeholder values:
   ```bash
   CLOUDFLARE_ACCOUNT_ID=your_actual_account_id_here
   CLOUDFLARE_API_TOKEN=your_actual_api_token_here
   ```

## Step 4: Restart Your Development Server

1. Stop your Next.js development server (Ctrl+C)
2. Start it again:
   ```bash
   npm run dev
   ```

## Step 5: Test the Upload

1. Go to your app's asana creation page
2. Try uploading an image
3. It should now work without the "accounts/undefined" error

## Troubleshooting

If you still get errors:

1. **Check your Account ID**: Make sure it's exactly as shown in the Cloudflare dashboard
2. **Check your API Token**: Make sure it has the correct permissions
3. **Restart the server**: Environment variables are only loaded when the server starts
4. **Check the console**: Look for any error messages in the browser console or terminal

## Security Notes

- Never commit your `.env.local` file to version control
- The `.env.local` file should already be in your `.gitignore`
- Keep your API token secure and never share it publicly
