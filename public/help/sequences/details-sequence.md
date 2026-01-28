# Sequence Details Help

## Overview

The **Sequence Details** page provides a comprehensive view of a complete yoga sequence with its component series and poses. You can view sequence information, navigate through flows, track your practice activity, and (if you're the owner) edit sequence details—all in a mobile-friendly list format that shows all series at once.

**Page URL:** `/navigator/sequences/[id]` or `/sequences/[id]`

## What is a Sequence?

A **sequence** is an ordered collection of yoga **series** that creates a complete practice journey. While an individual series focuses on a specific theme or body area, a sequence combines multiple series into a structured practice session with progressive flow—beginning, middle, and end.

**Examples of Sequences:**

- **Morning Flow** - Energizing sun salutations + standing poses + gentle backbends
- **Evening Practice** - Hip openers + twists + restorative series for relaxation
- **Full Vinyasa** - Complete 60-minute session: warm-up series + peak poses + cool-down
- **Core Strength Builder** - Multiple series targeting abdominal and back strength
- **Therapeutic Back Care** - Series designed specifically for back health and pain relief

## Page Components

### Back to Flows Navigation

Navigation button at the top left labeled **"Back to [Sequence Name]"** that returns you to the scroll view practice page for this specific sequence.

**Features:**

- **Arrow icon** - Left-pointing arrow for visual clarity
- **Dynamic text** - Shows the sequence name you're viewing
- **Smart navigation** - Returns to the practice view with the sequence already loaded
- **Accessible** - Screen reader-friendly with clear ARIA labels

**When to Use:**

- Switch from list view back to scroll view for guided practice
- Return to single-series-at-a-time view for focused practice
- Access the scroll view's navigation controls and practice flow

### Help Button

Opens this contextual help drawer with detailed guidance specific to sequence details. The green question mark icon is available in the page header for quick reference anytime.

### Sequence Title Header

Prominent orange header tab displaying the sequence name with integrated controls.

**Components:**

- **Sequence Name** - Large, bold title text in white against orange background
- **Edit Icon** (Owner Only) - Pencil icon for owners to enter edit mode
- **Edit Icon** (Owner Only) - Pencil icon visible to sequence owners and admins; for editing workflows see [Edit Sequence Help](edit-sequence.md).
- **Rounded corners** - Polished top-left and top-right rounded borders
- **Responsive width** - Adapts to screen size (80% mobile, 240px+ desktop)

### View Toggle Icons

Two icons on the right side of the title area to switch between viewing modes for this sequence:

**List View Icon** (Format List Bulleted)

- **Currently Active** - Shown in orange/primary color
- **Non-interactive** - Pointer events disabled since you're already in this view
- **List view** shows all series in the sequence simultaneously
- Perfect for planning your practice and seeing the full sequence structure

**Scroll View Icon** (View Stream)

- **Clickable** - Gray color indicates it's available but not active
- **Switches to scroll view** - One series displayed at a time with previous/next navigation
- **Same sequence** - Navigates to scroll practice page for this sequence
- Perfect for following along during active practice

**When to Use Each View:**

- **List View** (current page) - Planning, overview, editing, activity tracking
- **Scroll View** - Active practice, following along pose-by-pose, focused sessions

### Sequence Image (Optional)

If the sequence has an uploaded image, it displays centered below the title.

**Image Features:**

- **Centered display** - Horizontally centered on the page
- **Responsive sizing** - 100% width on mobile (max 400px on larger screens)
- **Contained fit** - Image scaled to fit within bounds without distortion
- **Maximum height** - Limited to 400px to prevent oversized displays
- **Rounded corners** - Subtle border radius for visual polish
- **Shadow effect** - Elevation shadow for visual depth

**Common Uses:**

- Visual representation of the sequence theme
- Inspirational practice imagery
- Quick visual identification in search results

### Flow Series Cards

Interactive cards displaying each series in the sequence with full pose listings. Click any card to navigate to that series's detail page.

**Card Components:**

- **Series Name Header** - Clickable title centered at the top
- **Numbered Pose List** - All poses displayed in sequence order
- **Pose Links** - Each pose name is a clickable link to the pose detail page
- **Hover Effects** - Card elevates slightly on hover, poses highlight
- **Empty State** - "No poses in this series" message if series is empty

**Card Features:**

- **Smart navigation** - Clicking the card area navigates to series practice page
- **Name resolution** - Uses series name (not ID) to ensure accurate navigation
- **Error handling** - Alerts if a series is no longer available in the database
- **Data freshness** - Series data refreshes on page load to show current poses

**Pose List Details:**

Each pose within a series shows:

- **Pose name** - Sanskrit or English name as configured
- **Clickable link** - Navigate to full pose details and instructions
- **Hover state** - Light gray background highlights pose on hover
- **Padding** - Comfortable spacing for touch targets

**What Happens When You Click:**

- **Card background** - Opens the series detail/practice page
- **Pose name** - Opens the individual pose detail page
- **Both** work together for flexible navigation during planning

### Sequence Description Section

Detailed description of the sequence's purpose, benefits, and practice guidance. Only displays if the sequence has a description set by the owner.

**Design Features:**

- **Journal styling** - Dark background with primary color text
- **Leaf icon** - Decorative yoga theme icon next to "Description" heading
- **Formatted text** - Preserves line breaks and paragraph formatting
- **Generous padding** - Comfortable reading space

**Common Description Content:**

- **Practice goals** - What this sequence aims to achieve
- **Difficulty level** - Beginner, intermediate, advanced guidance
- **Duration estimate** - How long to expect the practice to take
- **Prerequisites** - Any preparation or props needed
- **Modifications** - How to adapt for different levels
- **Benefits** - Physical and mental benefits of this sequence

**Example Description:**

```
Morning Energizer Sequence

A dynamic 30-minute flow to wake up body and mind.

Recommended for intermediate practitioners.

Props: Mat, 2 blocks (optional)

This sequence progresses through:
1. Gentle awakening poses
2. Sun salutations for heat
3. Standing strength poses
4. Gentle cool-down

Perfect for starting your day with energy and focus.
```

### Activity Tracker Component

Interactive button to mark when you practice this sequence, helping you build consistent practice habits and track your yoga journey.

**Features:**

- **Toggle button** - Click to mark "I practiced this today"
- **Status display** - Shows whether you've practiced today
- **Calendar integration** - Practices recorded with date and time
- **User-specific** - Only you see your practice tracking

**How It Works:**

1. **Not Tracked** - Button shows "Mark as Practiced" or similar
2. **Click button** - Creates a practice activity record for today
3. **Tracked** - Button changes to "Remove Practice" or checkmark state
4. **Click again** - Removes the practice record if you made a mistake

**Activity Types Tracked:**

- **Sequence practice** - You completed this full sequence
- **Date stamp** - When the practice occurred
- **User association** - Linked to your account for privacy

**Why Track Practice:**

- Build awareness of your practice consistency
- See patterns in your yoga routine
- Motivate regular practice with visible progress
- Provide data for weekly activity views

### Weekly Activity Viewer

Visual calendar showing your practice history for this sequence over the past week.

**Display Features:**

- **7-day grid** - Current week shown with individual days
- **Visual indicators** - Days you practiced are highlighted/marked
- **Date labels** - Each day shows the date for reference
- **Responsive layout** - Adapts to mobile and desktop screens
- **Detailed variant** - Shows more information than compact view

**Information Displayed:**

- **Practice days** - Which days this week you practiced this sequence
- **Current streak** - If you've practiced multiple consecutive days
- **Weekly total** - How many times this week you've practiced
- **Today indicator** - Current day clearly marked

**Automatic Refresh:**

- Updates when you toggle activity tracking
- Shows real-time practice status
- No page reload needed to see changes

**Benefits:**

- **Visual motivation** - See your consistency at a glance
- **Pattern awareness** - Notice gaps or streaks in practice
- **Goal tracking** - Work toward daily or weekly practice goals
- **Personal accountability** - Private view of your commitment

## Using the Sequence Details Page

### Step-by-Step Viewing Workflow

1. **Arrive at Sequence Details**

   - Navigate from practice sequences page
   - Or use direct link to specific sequence
   - Or select from search results

2. **Review Sequence Overview**

   - Read sequence name in orange header
   - View image if available for visual context
   - Check description for practice guidance
   - Note how many series are included

3. **Explore Flow Structure**

   - Scroll through series cards to see the practice flow
   - Note the order of series (top to bottom = practice order)
   - Click series cards to view more details about each series
   - Click pose names to review pose instructions

4. **Plan Your Practice**

   - Use list view to see the entire sequence at once
   - Estimate total practice time based on number of poses
   - Note any props or preparation mentioned in description
   - Identify challenging poses you may want to modify

5. **Navigate to Practice View**

   - Click "Scroll View" icon to switch to practice mode
   - Or click "Back to [Sequence]" to return to scroll view
   - Scroll view presents one series at a time for focused practice

6. **Track Your Activity**
   - After practicing, click "Mark as Practiced" button
   - View your weekly activity to see practice patterns
   - Build consistency with visual feedback

### Editing Your Sequence (Owners Only)

Sequence owners and admins can edit sequences. For full, step-by-step editing workflows and best practices, see [Edit Sequence Help](edit-sequence.md).

## Tips for Effective Use

**Practice Planning:**

- Use list view to plan your practice session ahead of time
- Review all poses before starting to gather needed props
- Note the progression from warm-up through peak to cool-down
- Estimate time by counting poses (roughly 1-2 minutes per pose)

**Navigation Strategy:**

- Use list view for overview and planning (current page)
- Switch to scroll view for guided practice with navigation
- Bookmark frequently-practiced sequences for quick access
- Use series cards to jump directly to specific series

**Activity Tracking:**

- Track practice immediately after completing for accurate records
- Use weekly activity view to identify practice patterns
- Set personal goals (e.g., practice 3 times per week)
- Don't worry about perfection—any practice counts!

**Sequence Ownership:**

- Only you can edit sequences you created (plus admins)
- Edit mode hides details to focus on modifications
- Always save your changes before navigating away
- Consider adding detailed descriptions to help future practice

**Mobile Practice:**

- List view works great on mobile for pre-practice review
- Scroll view (accessed via icon) is better for active practice on mobile
- Series cards are touch-friendly for easy navigation
- Activity buttons are sized for comfortable tapping

## Common Questions

**Q: What's the difference between list view and scroll view for sequences?**

A: **List view** (this page) shows all series in the sequence at once in a vertical list—perfect for planning and getting an overview. **Scroll view** displays one series at a time with previous/next buttons—ideal for following along during active practice. Use the view toggle icons to switch between them.

**Q: How do I practice this sequence step-by-step?**

A: Click the **Scroll View icon** (View Stream icon) at the top right, or click the **Back to [Sequence]** button. This takes you to the practice page where you can navigate through the series one at a time with previous/next controls.

**Q: Can I edit any sequence or only my own?**

A: You can only edit sequences **you created** (where you are the owner) or if you have an **admin role**. The edit pencil icon only appears in the title header if you have editing permissions. This protects curated sequences and other users' work.

**Q: Why do series sometimes show "No poses in this series"?**

A: This means the series exists but doesn't currently have any poses added to it. The series creator may be building it, or poses may have been removed. You can still click the series card to view its detail page, where you might find a description or more information.

**Q: What happens when I click a series card?**

A: Clicking a series card navigates to that series's practice page where you can see all poses with more detail, view the series description, and track series-specific activity. It's a quick way to focus on one part of your sequence.

**Q: How does activity tracking work?**

A: Click the **"Mark as Practiced"** button after completing your practice. This records today's practice in your personal activity log. The **Weekly Activity Viewer** shows which days you practiced this sequence. Only you can see your tracking data—it's private.

**Q: Can I remove a practice activity if I tracked it by mistake?**

A: Yes! Click the activity button again (it may show "Remove Practice" or a checkmark when already tracked). This removes the activity record for today. You can toggle it on and off as needed.

**Q: Why does the page show "Refreshing series data..."?**

A: The sequence is fetching the latest pose information for each series from the database. This ensures you always see current series content even if the series owner has updated their poses since the sequence was created. It usually takes just a moment.

**Q: What if a series I click no longer exists?**

A: The page uses smart series resolution by name. If a series has been deleted or is unavailable, you'll see an alert message: "Cannot find series named [name]". This is rare but can happen if a series owner deleted their series.

**Q: How do I know which view I'm currently in?**

A: The active view icon is highlighted in **orange/primary color**, while the inactive view is **gray**. In list view (this page), the Format List Bulleted icon is orange and the Scroll View icon is gray. The orange icon also has pointer events disabled since you're already in that view.

**Q: Can I change the order of series in my sequence?**

A: Yes, if you're the owner! Click the **edit pencil icon** to enter edit mode. In the editor, you can reorder series to change your practice flow. The order shown in list view is the same order used in scroll view navigation.

## Permission-Based Access

### All Users (Including Guests)

- View sequence details, series, and poses
- Browse all public sequences
- Click through to series and pose pages
- See sequence images and descriptions

### Authenticated Users

- All guest permissions, plus:
- **Track practice activity** with "Mark as Practiced" button
- **View personal activity data** in weekly activity viewer
- **Create sequences** via Create Sequence page
- **Bookmark favorites** (if bookmarking feature is enabled)

### Sequence Owners

- All authenticated user permissions, plus:
- **Edit sequence** via pencil icon in title header
- **Modify name, description, and image**
- **Add or remove series** from the sequence
- **Reorder series** to change practice flow
- **Delete sequence** (via edit page settings)

### Admin Users

- **Edit any sequence** regardless of ownership
- **Access all owner capabilities** for all sequences
- **Manage platform content** and curated sequences
- **Assist users** with sequence issues

## When to Use This Page

### For Planning Practice

- **Review the full sequence** before starting your yoga session
- **Estimate practice time** by counting total poses across all series
- **Identify props needed** from descriptions and pose requirements
- **Plan modifications** for challenging poses you see in the list

### For Learning Sequences

- **Study the flow structure** - how series build on each other
- **Understand progression** - warm-up to peak to cool-down
- **Memorize the sequence** - see all components at once
- **Analyze teaching structure** - if you're a yoga instructor

### For Tracking Progress

- **Mark practices** using the activity tracker button
- **Review weekly consistency** with the activity calendar
- **Build practice habits** by tracking regularly
- **Motivate yourself** with visual progress feedback

### For Editing and Customization (Owners)

- **Update sequence details** as your understanding evolves
- **Add more series** to expand the practice
- **Remove outdated series** to streamline the sequence
- **Reorder series** to improve flow and progression
- **Upload images** that inspire your practice

### For Navigating to Practice

- **Switch to scroll view** for guided one-series-at-a-time practice
- **Jump to specific series** by clicking series cards
- **Navigate to pose details** by clicking pose names
- **Return to flow landing** via navigation buttons

## Accessibility Features

### Screen Reader Support

- **Semantic HTML** - Proper heading hierarchy and landmarks
- **ARIA labels** - Descriptive labels for all interactive elements
- **Alt text** - Sequence images include descriptive alternative text
- **Role attributes** - Regions properly labeled (e.g., "sequence-view", "edit-region")

### Keyboard Navigation

- **Tab order** - Logical tab sequence through all interactive elements
- **Focus indicators** - Visible focus states for keyboard users
- **Button activation** - All buttons respond to Enter and Space keys
- **Link navigation** - All links accessible via keyboard

### Visual Accessibility

- **High contrast** - Orange primary color on white/dark backgrounds
- **Sufficient text size** - Readable font sizes for titles and content
- **Icon clarity** - Recognizable icons with text labels where needed
- **Hover states** - Visual feedback for interactive elements

### Mobile Accessibility

- **Touch targets** - Buttons and links sized for comfortable tapping (minimum 44x44px)
- **Responsive layout** - Adapts to small screens without horizontal scrolling
- **Pinch zoom** - Images and text can be zoomed on mobile devices
- **Orientation support** - Works in portrait and landscape modes

## Troubleshooting

### Sequence Not Loading

**Symptoms:** Page shows blank or "not found" error

**Solutions:**

- Verify the sequence ID in the URL is correct
- Check that the sequence hasn't been deleted by its owner
- Refresh the page to retry database connection
- Try accessing from search results or flows landing page

### Edit Button Not Showing

**Symptoms:** No pencil icon in the title header

**Solutions:**

- Confirm you are **logged in** (edit requires authentication)
- Verify you **created this sequence** (check created_by field)
- Check if you have **admin role** permissions
- Remember: you can only edit your own sequences (or any if admin)

### Series Cards Not Clickable

**Symptoms:** Clicking series cards doesn't navigate anywhere

**Solutions:**

- Check browser console for JavaScript errors
- Verify series still exists in database (may have been deleted)
- Try clicking the series name specifically, not just the card edge
- Refresh the page to reset navigation state

### Activity Tracking Not Working

**Symptoms:** "Mark as Practiced" button doesn't respond or track practice

**Solutions:**

- **Sign in** - Activity tracking requires authentication
- Check internet connection for database operations
- Verify sequence has a valid ID (not ID of 0)
- Try refreshing the page and tracking again

### Weekly Activity Not Updating

**Symptoms:** Activity viewer doesn't show recent practice

**Solutions:**

- Wait a moment - updates happen after activity toggle completes
- Refresh the page to force reload activity data
- Check that activity tracking completed successfully (no error messages)
- Verify you're viewing the correct week range

### Images Not Displaying

**Symptoms:** Sequence image broken or not showing

**Solutions:**

- Verify image URL is valid and accessible
- Check that image hasn't been deleted from storage
- Try refreshing the page to reload the image
- Contact sequence owner if image appears broken

## Related Help Topics

- [**Practice Sequences Help**](practice-sequences.md) - Scroll view practice with series navigation
- [**Edit Sequence Help**](edit-sequence.md) - Detailed editing instructions for owners
- [**Create Sequences Help**](create-sequences.md) - Build your own custom sequences
- [**Practice Series Help**](../flows/practice-series.md) - Understanding individual series
- [**Flows Landing Help**](../flows/flows-landing.md) - Main flows and sequences hub

## Development Notes

**Technical Implementation:**

- React client component with MUI styling
- Next.js dynamic routing with async params
- Prisma database queries for sequence and series data
- NextAuth.js session management for ownership checks
- Activity tracking via dedicated client service functions
- Real-time data refresh for series content updates

**Key Components:**

- `SequenceViewWithEdit` - Main client component
- `EditSequence` - Inline editor component
- `SeriesPoseList` - Pose list rendering
- `ActivityTracker` - Practice activity toggling
- `WeeklyActivityViewer` - Activity calendar display

**URL Patterns:**

- View: `/navigator/sequences/[id]` or `/sequences/[id]`
- Edit: `/navigator/sequences/[id]?edit=true`
- Practice: `/navigator/flows/practiceSequences?sequenceId=[id]`
