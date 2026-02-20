# Connected Accounts Guide

## Overview

The Connected Accounts feature allows you to manage how you sign in to your Soar yoga account. You can connect multiple login methods to your account, giving you flexibility and security in how you access the platform.

## Why Use Multiple Login Methods?

- **Convenience**: Sign in using your preferred method (Google, GitHub, or email/password)
- **Security**: Never lose access to your account - have backup login options
- **Flexibility**: Switch between devices and methods seamlessly
- **Account Recovery**: If you forget your password or lose access to one provider, you can still use another

## Available Login Methods

### 1. Google Account

Sign in using your Google account. Quick and secure OAuth authentication.

**Benefits:**

- One-click sign in
- No password to remember
- Automatic account linking
- Uses Google's security features

### 2. GitHub Account

Sign in using your GitHub account. Perfect for developers and tech-savvy practitioners.

**Benefits:**

- Developer-friendly
- OAuth secure authentication
- No password management needed
- Integrates with your existing GitHub identity

### 3. Email & Password (Credentials)

Traditional email and password combination. Full control over your credentials.

**Benefits:**

- Works without third-party accounts
- You control your password
- No external dependencies
- Privacy-focused option

### 4. Instagram (Coming Soon)

Connect your Instagram account for social features and sharing your yoga journey.

## How to Add a Login Method

### Step 1: Navigate to Connected Accounts

1. Click on your **Profile** icon in the navigation bar
2. Select **Settings**
3. Choose **Account Security**
4. Click on **Connected Accounts**

### Step 2: Add a New Login Method

1. Click the **"Add a new login method"** button
2. Choose from the available options:
   - **Google**
   - **GitHub**
   - **Email & Password**

### For OAuth Providers (Google/GitHub):

1. Click on the provider you want to add
2. You'll be redirected to the provider's login page
3. Authorize Soar to access your account
4. You'll be returned to Soar automatically
5. Your new login method will appear in your Connected Accounts list

### For Email & Password:

1. Click on **"Email & Password"**
2. Create a strong password with these requirements:

   - **At least 8 characters long**
   - **At least one uppercase letter** (A-Z)
   - **At least one lowercase letter** (a-z)
   - **At least one number** (0-9)

   Example of a strong password: `YogaPose123`

3. Re-enter your password to confirm
4. Click **"Add Password"**
5. Your email/password login method is now active

## How to Remove a Login Method

### Important Safety Rule

**You must always have at least one login method connected to your account.** This prevents you from being locked out of your account.

### Steps to Remove:

1. Go to **Connected Accounts** (Profile → Settings → Account Security → Connected Accounts)
2. Find the login method you want to remove
3. Click the **"Disconnect [Provider]"** button
4. Confirm your choice in the dialog that appears
5. The login method will be removed from your account

### What Happens When You Disconnect?

- The connection between your Soar account and that provider is removed
- You can no longer sign in using that method
- Your Soar account and practice data remain intact
- You can reconnect the same provider later if needed

## Security Best Practices

### Strong Password Guidelines

If you're using email & password authentication:

1. **Length**: Use at least 8 characters (longer is better)
2. **Complexity**: Mix uppercase, lowercase, numbers, and special characters
3. **Uniqueness**: Don't reuse passwords from other websites
4. **Avoid**: Don't use personal information (name, birthdate, etc.)

**Good Examples:**

- `SunSalutation2024!`
- `YogaMaster#108`
- `TreePose&Balance99`

**Avoid:**

- `password123` (too common)
- `yoga` (too short and simple)
- `JohnSmith1985` (personal information)

### Account Security Tips

1. **Use Multiple Methods**: Add at least 2 login methods for redundancy
2. **Update Regularly**: Change your password periodically if using credentials
3. **Monitor Access**: Review your connected accounts occasionally
4. **Secure Email**: Ensure your email account is secure (used for recovery)
5. **Public Computers**: Always sign out when using shared devices

## Troubleshooting

### I Can't Add a Login Method

**Problem**: The "Add Login Method" dialog doesn't open or fails

**Solutions:**

- Refresh the page and try again
- Clear your browser cache
- Try a different browser
- Check your internet connection
- Ensure JavaScript is enabled

### OAuth Provider Error

**Problem**: Google or GitHub authentication fails

**Solutions:**

- Check you're logged into the correct account on that provider
- Make sure pop-ups are not blocked in your browser
- Try again in an incognito/private window
- Check the provider's status page (Google/GitHub) for outages
- Verify your account on that provider is active

### Password Doesn't Meet Requirements

**Problem**: Password is rejected when adding credentials

**Solutions:**

- Ensure it's at least 8 characters
- Add at least one uppercase letter
- Add at least one lowercase letter
- Add at least one number
- Example: `MyYoga123` meets all requirements

### Can't Disconnect Last Method

**Problem**: The disconnect button is disabled

**Reason**: You cannot disconnect your last remaining login method

**Solution**: Add another login method first, then disconnect the one you don't want

### Forgot Password

**Problem**: Can't remember your credentials password

**Solutions:**

1. Use one of your other connected login methods (Google/GitHub)
2. If you don't have other methods, use the password reset feature
3. Go to the login page and click "Forgot Password"
4. Follow the email instructions to reset

## Frequently Asked Questions (FAQ)

### Q: What happens if I disconnect Google/GitHub?

**A:** You simply won't be able to sign in using that method anymore. Your Soar account and all your yoga data remain safe. You can always reconnect it later.

### Q: Can I use multiple login methods?

**A:** Yes! You can connect as many login methods as you want. This is actually recommended for account security.

### Q: Which login method is most secure?

**A:** All methods are secure. OAuth providers (Google, GitHub) use industry-standard security. Email/password gives you more control. We recommend using multiple methods for best security.

### Q: What if I lose access to my email?

**A:** If you have other login methods connected (Google, GitHub), you can still access your account through those. This is why having multiple methods is important!

### Q: Can I change my email address?

**A:** Yes, you can update your email in your account settings. This doesn't affect your connected login methods.

### Q: How do I know which methods are connected?

**A:** Visit the Connected Accounts page (Profile → Settings → Account Security → Connected Accounts). All your active login methods are listed there with clear status indicators.

### Q: What does "Coming Soon" mean for Instagram?

**A:** We're working on adding Instagram as a login option. It's not available yet, but will be in a future update!

### Q: Can I remove all my login methods?

**A:** No, you must always have at least one login method. This is a safety feature to prevent account lockout.

### Q: Is my data shared with Google/GitHub?

**A:** No. OAuth providers only confirm your identity. We don't access or share your Soar yoga practice data with them.

### Q: What happens if a provider (Google/GitHub) has an outage?

**A:** If one provider is down, you can use your other connected login methods to access Soar. This is another great reason to have multiple methods connected.

## Privacy & Security

### What Information Do We Store?

When you connect a login method, we store:

- Provider name (Google, GitHub, or Credentials)
- Your unique account identifier from that provider
- Date when the account was connected
- For credentials: Your encrypted password (never stored in plain text)

### What We Don't Store

- Your Google or GitHub password
- Your browsing history on those platforms
- Data from other apps you use with those accounts
- Social connections or contacts from provider accounts

### Data Encryption

- All passwords are hashed using industry-standard bcrypt encryption
- OAuth tokens are securely stored and never exposed
- Communications use HTTPS encryption
- Your practice data is separate from login credentials

## Need More Help?

If you're experiencing issues not covered in this guide:

1. **Check System Status**: Ensure Soar services are operational
2. **Contact Support**: Use the Feedback form (Profile → Feedback)
3. **Community**: Check our community forums for common solutions
4. **Report Bugs**: Use the GitHub issue tracker for technical problems

## Updates & Changes

This guide is regularly updated as we add new features and improve the Connected Accounts system.

**Last Updated:** November 2024

---

**Related Help Articles:**

- Account Security Settings
- Password Reset Guide
- Profile Management
- Privacy Policy
- Terms of Service

**Quick Links:**

- [Go to Connected Accounts](#) → Profile → Settings → Account Security → Connected Accounts
- [Privacy Policy](../compliance/terms)
- [Community Guidelines](/profile/settings/legal/community-guidelines)
