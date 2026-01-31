# Terms of Service — Acceptance and Re-Accepting

## Overview

We require acceptance of the Terms of Service (TOS) so users understand the rules and legal terms that govern use of the Soar application. Acceptance is recorded with a specific published TOS version so we can track which users agreed to which version.

## Why acceptance is required

- Ensures users have consented to the legal terms for the service.
- Lets the team make and publish updates to terms while knowing which users have accepted which version.
- Enables safe rollouts and compliance: when the TOS is updated to a new published version, users need to re-accept so their consent is current.

## When you'll be asked

- At signup: the signup flow requires you to check a box to accept the current TOS version.
- On sign-in: if the site has published a new TOS version since you last accepted, a non-dismissible modal will prompt you to review and accept the new TOS before continuing.

## How to accept or re-accept

1. Visit the Terms page: `/compliance/terms` (link available from your Profile → Terms).
2. Read the summary or view the full terms.
3. Click the **Accept** button. The app records your acceptance (timestamp + TOS version).

If you are required to re-accept, you'll see a modal on sign-in that links directly to this page.

## What happens after acceptance

- Your account record stores the accepted TOS version id and timestamp for auditability.
- If you previously had limited access due to a required re-accept, access will be restored after acceptance.

## Privacy & Data

Acceptance records include minimal metadata (timestamp and the published TOS version). For audit purposes we may also store the user agent and IP address when acceptance is recorded.

# Terms of Service — Acceptance (Help Drawer)

## Overview

The **Terms of Service (TOS)** help page explains why Soar asks for acceptance, where acceptance is recorded, and how to re-accept when a new version is published.

**Page URL:** /compliance/terms

## What is Terms of Service acceptance?

Acceptance is a recorded, versioned consent that a user agrees to the published TOS. Soar associates each acceptance with a published TOS version id and timestamp so the team can verify when a user agreed to a specific set of terms.

**Examples:**

- You accept the TOS at signup by checking the acceptance checkbox.
- If the team publishes a new TOS version, you will be prompted to re-accept on your next sign-in.

## Page Components

### Header

- Page title and short summary of the current published TOS version.

### Summary Block

- Short summary text shown on the TOS page to help decide whether to read the full terms.

### Full Terms Link

- Link to the full legal text (hosted on the same page or a linked external URL).

### Accept Button

- Primary action that records acceptance. This calls `POST /api/tos/accept` and creates an append-only `UserTosAcceptance` record and updates `UserData.acceptedTosVersionId` and `acceptedTosAt`.

### Re-Accept Modal (Sign-in Flow)

- If your recorded `acceptedTosVersionId` does not match the current published version, a modal will show after sign-in with a summary and link to this page. The modal must be accepted before continuing to protected features.

## How to Accept or Re-Accept

1. Go to **Profile → Terms** or visit `/compliance/terms` (the link is available from your Profile menu).
2. Read the summary and/or click the full terms link.
3. Click **Accept**. Your acceptance (version id + timestamp) is recorded and access will be restored if it was limited.

## Tips for Users

- If signing up, check the TOS checkbox before submitting the form.
- If prompted to re-accept, read the summary or full terms via the provided link; acceptance is required to continue using protected features.

## Common Questions

**Q: Why was I asked to re-accept after signing in?**

A: A new TOS version was published after you last accepted. Re-acceptance ensures your consent is up-to-date.

**Q: What data does Soar store when I accept?**

A: We store the `tosVersionId` and `acceptedTosAt` timestamp. For audit purposes we may also record minimal metadata such as user agent and IP address.

**Q: Can I opt out of accepting the TOS?**

A: No — acceptance is required to use the Soar service.

## Admin & Permissions Notes

- Only admins can create and publish new TOS versions via Admin → TOS.
- Publishing a new version triggers re-accept prompts for users whose `acceptedTosVersionId` differs from the newly published version.

## Accessibility & Mobile

- The accept controls and modal include ARIA labels and keyboard support. The modal is responsive for mobile and desktop devices.

## Support

If you cannot accept the TOS for technical reasons or believe the prompt is incorrect, open Help → Contact in the app and include your user id/email and a screenshot of the prompt.

_Stored at `public/help/compliance/terms-acceptance.md` — used by the in-app help drawer._
