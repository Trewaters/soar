# Asana Details Help

## Overview

The **Asana Details** page displays all information for a single yoga pose (asana). This view appears when an asana is selected from search results or when the page is opened with an `id` query parameter that points to a specific asana record.

**Example URL with asana selected:** `/navigator/asanaPoses/practiceAsanas?id=686000caa1949b8140c403b3`

**When to use this page:**

- Review step-by-step instructions and images for a single pose
- Start a focused practice for that pose
- Edit or manage the pose (when you are the owner)

## What You See on the Page

- **Title and names:** English name and, if available, Sanskrit name/alternate names.
- **Primary image / gallery:** High-resolution reference image and any additional photos or media.
- **Difficulty and tags:** Difficulty level, primary body focus, and categories.
- **Instructions and cues:** Step-by-step setup, alignment cues, and common modifications.
- **Benefits & Contraindications:** Short notes on why and when to practice the pose.
- **Practice controls:** A **Practice** button to start guided practice for this single pose, timers/hold durations when available.
- **Action buttons (permissions-based):** Edit, Delete, Share, Favorite — Edit/Delete shown only to owners or users with permission.
- **Related asanas / suggestions:** Links to similar poses or sequences that include this asana.

## Page Components (User-facing)

### Header

- Displays the pose title and a large decorative image. Use the back button to return to search results.

### Image Gallery

- Tap thumbnails to open larger views; swipe on mobile to change images.

### Details Panel

- Shows the pose description, step-by-step cues, recommended hold time, and breathing guidance.

### Practice Controls

- **Practice**: Launches a focused practice session for this pose.
- **Timer**: If the pose has recommended hold duration, a timer is available during practice.

### Actions

- **Edit** / **Delete**: Visible only when you own the pose.
- **Favorite**: Save the pose to your personal list.
- **Share**: Copy a link or open system share dialogs where supported.

## How to Open an Asana Detail

1. Use the search bar on the Practice Asanas page and tap a pose card.
2. Open a pose from the results list or from `My Asanas` / `Public Asanas` tabs.
3. Open a direct link containing `?id=<asanaId>` — the page will display that asana's details.

## Help Drawer Link Behavior

The application's Help Drawer should show a context-appropriate link depending on whether a single asana is displayed or the page is in search/list mode:

- **If an asana is visible (URL contains an `id` query parameter):** show a link labeled **Asana Details** that opens this help document.
- **If no asana is selected (search/list view only):** show a link labeled **Practice Asanas** pointing to the general practice-asanas help document.

Note: The Help Drawer should determine which link to display based on whether the UI currently has a selected asana (for example, by checking whether the current route includes an `id` parameter or the internal selection state). This provides users the most relevant help content for their current task.

## Step-by-Step: Practicing from Details

1. Open the asana detail view for the pose you want to practice.
2. Review alignment cues and any modifications for your level.
3. Tap **Practice** to launch the practice player for this single pose.
4. Use the timer or manual advance controls to hold or repeat the pose as needed.

## Tips

- Prefer the **Practice** button on the detail page for focused repetition and timer controls.
- Use the **Favorite** action to build a quick-access list of poses you practice often.
- If you plan to teach, include both English and Sanskrit names for clarity.
- For faster retrieval, give custom poses descriptive names and tags (e.g., "hip opener, beginner").

## Common Questions

**Q: I opened a direct URL with an `id` but see a blank page — why?**

A: The `id` may be invalid or the asana record may have been deleted. Confirm the `id` and try again, or navigate via the Practice Asanas search to locate the pose.

**Q: I can't edit the pose — where is the Edit button?**

A: Only the pose owner (creator) and users with appropriate permissions see Edit/Delete actions. Sign in with the owner account or duplicate the pose into `My Asanas` to modify it.

**Q: How do I share a direct link to this asana?**

A: Use the **Share** control on the detail page; the link includes the `id` query parameter so other users can open the same detail view.

## Accessibility & Mobile

- Images have descriptive alt text; use the image gallery controls with keyboard or swipe gestures.
- Buttons include ARIA labels; use `Tab` to focus action buttons and `Enter`/`Space` to activate.
- The practice timer includes audible cues where configured; users can disable sound in accessibility settings.

## Permissions & Notes

- Creating, editing, or deleting poses requires signing in. If you attempt an owner-only action while signed out, a sign-in prompt or freemium/permission notice will appear.
