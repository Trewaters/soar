# Practice Sequences Help (Scroll View)

## Overview

The **Practice Sequences** page provides a focused, scroll-through practice experience where you navigate through one series at a time within a complete yoga sequence. This guided view is perfect for active practice, allowing you to flow through each series with previous/next navigation while tracking your progress and activity.

**Page URL:** `/navigator/flows/practiceSequences` or `/navigator/flows/practiceSequences?sequenceId=[id]`

## What is a Sequence?

A **sequence** is an ordered collection of yoga series that creates a complete practice journey. While a series focuses on a specific theme or body area, a sequence combines multiple series into a structured practice with beginning, middle, and end progression.

**Examples of Sequences:**

- **Morning Energizer** - Sun salutations, standing poses, and gentle backbends
- **Evening Wind Down** - Hip openers, twists, and restorative poses
- **Full Practice** - Comprehensive 60-minute session with warm-up, peak poses, and cool-down
- **Quick Flow** - 20-minute sequence for busy days
- **Therapeutic Sequence** - Targeted practice for specific needs (back care, stress relief)

## Page Components

### Splash Header

Visual banner displaying "Practice Sequences" with an inspiring yoga practice image. Sets the context for your complete practice experience.

### Back to Flows Navigation

Navigation header with a clickable "Flows" link that returns you to the **Flows Landing Page** (`/navigator/flows`). Use this to explore other flow and sequence options or access the main flows menu.

**Features:**

- **Always accessible** - Located at the top of the page
- **Clear labeling** - "Flows" text with navigation arrow
- **Breadcrumb pattern** - Shows your location in the app hierarchy
- **Keyboard accessible** - Full keyboard navigation support

### Help Button

Opens this contextual help drawer with detailed guidance. The green question mark icon is always available in the top navigation area for quick reference.

### Sequence Search Bar

Autocomplete search component to find sequences by name. Type to search through available sequences with intelligent filtering.

**Search Features:**

- **Smart Filtering** - Results update as you type
- **Organized Sections** - Sequences grouped by "Mine" (your sequences) and "Alpha" (curated sequences)
- **Quick Selection** - Click any result to load and display the sequence
- **Clear Button** - X icon to clear your search and start over

**How to Search:**

1. Click the search field labeled "Search for a Sequence"
2. Type the sequence name (partial matches work)
3. Select from the dropdown results
4. The selected sequence loads immediately for practice

### Sequence Title Header

Prominent orange header tab displaying the selected sequence name with integrated owner controls.

**Components:**

- **Sequence Name** - Large, bold title text in white against orange background
- **Edit Icon** (Owner Only) - Pencil icon appears inside the orange tab for sequence owners
  - Click to navigate to edit mode in list view
  - Opens the sequence edit page (`/navigator/sequences/[id]?edit=true`)
  - Changes to X (close) icon when in edit mode
  - Only visible if you created this sequence or have admin role
- **Rounded corners** - Polished top-left and top-right rounded borders
- **Responsive width** - Adapts to screen size (80% mobile, 240px+ desktop)
- **Accessible** - Clear ARIA labels for screen readers

### View Toggle Icons

Two icons positioned to the right of the sequence title that allow you to switch between different viewing modes for the same sequence:

**List View Icon** (Format List Bulleted)

- **Clickable** - Gray color indicates it's available but not currently active
- **Switches to list view** - Shows all series in the sequence simultaneously
- **Navigation** - Goes to `/navigator/sequences/[id]`
- **Use case** - Planning, overview, seeing full sequence structure at once

**Scroll View Icon** (View Stream)

- **Currently Active** - Orange/primary color indicates you're in this view
- **Non-interactive** - Pointer events disabled since you're already here
- **One series at a time** - Current series displayed with previous/next navigation
- **Use case** - Active practice, following along pose-by-pose

\*\*Whenquence-Flow Top Navigation

The series navigation card header provides previous/next controls at the **top** of the current series card.

**Navigation Controls:**

- **Previous Button** - Left side with chevron icon and series name

  - Shows name of the previous series for context
  - Click to navigate backward in the sequence
  - Disabled (opacity 30%) when on first series
  - Shows "Previous" text when no prior series exists

- **Next Button** - Right side with chevron icon and series name
  - Shows name of the upcoming series for context
  - Click to navigate forward in the sequence
  - Disabled (opacity 30%) when on last series
  - Shows "Next" text when no following series exists

**Design Features:**

- **Space-between layout** - Buttons positioned at opposite ends
- **Small font size** - Compact for minimal visual distraction
- **Hover effects** - No background change (transparent hover)
- **Accessible** - Clear button labels and disabled states
- **Context preview** - See adjacent series names before navigating

### Sequence-Flow Detail Card

Interactive card displ (Bottom Navigation)

Visual navigation component with interactive circles/dots positioned below the series card, providing an at-a-glance view of your position in the sequence.

**Features:**

- **One circle per series** - Total number of circles = total series in sequence
- **Active indicator** - Orange/primary color circle shows current position
- **Inactive circles** - Gray circles represent other series in the sequence
- **Click to jump** - Click any circle to navigate directly to that series
- **Page number tracking** - Corresponds to series order (page 1 = first series)
- **Visual progress** - See how far through the sequence you've progressed
  Details Section

Complete descriptive information about the sequence including optional image and detailed description.

**Sequence Image (Optional)**

Visual representation of the sequence, displayed below the pagination circles when available.

**Image Features:**

- **Centered display** - Horizontally centered on the page
- **Responsive sizing** - 100% width on mobile (max 400px on larger screens)
- **Contained fit** - Image scaled to fit within bounds without distortion
- **Maximum height** - Limited to 400px to prevent oversized displays
- **Rounded corners** - Subtle border radius (2px) for visual polish
- **Shadow effect** - Elevation shadow (level 3) for depth
- **Conditional display** - Only shows if sequence creator uploaded an image

**Common Image Uses:**

- Visual representation of the sequence theme
- Inspirational practice imagery
- Peak pose demonstration
- Energy or mood representation
- Quick visual identification

**Description Section**

Detailed explanation of the sequence purpose, benefits, and guidance, displayed in journal-style formatting.

**Design Features:**

- **Journal styling** - Dark background (`navSplash.dark`) with primary color text
- **Leaf icon** - Decorative yoga theme icon next to "Description" heading
- **Formatted text** - Preserves line breaks and paragraph formatting (`whiteSpace: 'pre-line'`)
- **Generous padding** - Comfortable reading space (p: 4)
- **Contrast text** - White text (`primary.contrastText`) on dark background
- **Margin top** - Spaced 32px from previous content

**Common Description Content:**

- **Practice goals** - What this sequence aims to achieve
- **Target audience** - Beginner, intermediate, or advanced practitioners
- **Duration estimate** - How long to expect the practice to take
- **Best timing** - Morning, evening, or any-time practice
- **Prerequisites** - Props needed (blocks, straps, blankets)
- **Modifications** - How to adapt for different levels
- **Benefits** - Physical, mental, and energetic benefits
- **Special notes** - Contraindications or safety consider
- **Clean vertical layout** - Each pose on its own line
- **Touch-friendly** - Adequate padding for mobile tapping
- **Keyboard accessible** - All pose links navigable via Tab key
- **Visual hierarchy** - Number, name, and cue clearly separated

**Navigation Integration:**

- **Click series name** - Navigate to series detail/practice page
- **Click pose name** - Navigate to individual pose instruction page
- **Smart ID resolution** - Uses series name to resolve correct database ID
- **Error handling** - Alert shown if series no longer exists

### Sequence-Flow Bottom Navigation

\*\*CuTrack Sequence Activity

Two integrated components work together to help you track and visualize your practice consistency for this specific sequence.

**Activity Tracker Component**

Interactive card-style component to mark when you practice this sequence, helping you build consistent practice habits.

**Features:**

- **Toggle functionality** - Click to mark "I practiced this today"
- **Status display** - Shows current tracking state (practiced or not)
- **Date/time recording** - Practices recorded with timestamp
- **User-specific** - Only you see your practice tracking (private data)
- **Card variant** - Displayed as a card with clear visual styling
- **Database integration** - Uses dedicated sequence activity client service

**How It Works:**

1. **Not Tracked** - Button shows "Mark as Practiced" or activity prompt
2. **Click to track** - Creates a practice activity record for today
3. **Tracked state** - Button changes appearance (checkmark or confirmation)
4. **Click to untrack** - Removes the practice record if tracked by mistake
5. **Callback trigger** - Triggers refresh of weekly activity viewer

**Activity Service Functions:**

- `checkSequenceActivityExists` - Checks if you've tracked this sequence today
- `createSequenceActivity` - Records a new practice session
- `deleteSequenceActivity` - Removes a practice record
- `onActivityToggle` - Triggers refresh of dependent components

**Why Track Practice:**

- **Build awareness** - See your practice consistency patterns
- **Create accountability** - Visual commitment to regular practice
- **Motivate continuation** - Streaks and patterns encourage habits
- **Provide data** - Feeds into weekly activity visualization

**Weekly Activity Viewer Component**

Detailed calendar visualization showing your practice history for this sequence over time.

**Display Features:**

- **7-day view** - Current week with individual day markers
- **Visual indicators** - Days you practiced are highlighted/colored
- **Date labels** - Each day shows the date for easy reference
- **Detailed variant** - Displays comprehensive practice information
- **Responsive layout** - Adapts to mobile and desktop screens
- **Auto-refresh** - Updates immediately when you track practice

**Information Displayed:**

- **Practice days** - Which days this week you practiced this sequence
- **Current streak** - Consecutive days of practice (if applicable)
- **Weekly total** - Total number of practices this week
- **Today indicator** - Current day clearly marked
- **Pattern visualization** - Easy-to-spot consistency trends

**Refresh Mechanism:**

- **Refresh trigger** - State variable increments on activity toggle
- **Automatic update** - Weekly viewer watches for trigger changes
- **No page reload** - Updates happen in real-time
- **Smooth experience** - Seamless integration between components

**Benefits of Activity Tracking:**

- **Visual motivation** - See your consistency at a glance
- **Pattern awareness** - Notice gaps or streaks in your practice
- **Goal tracking** - Work toward daily or weekly practice goals
- **Personal accountability** - Private view of your commitment
- **Progress celebration** - Recognize your dedication over time

**Privacy Note:**

All practice tracking is private to your account. Only you can see your activity history (and admins for support purposes). Your yoga journey is personal and confidential.e or energy

### Description Section

Detailed explanation of the sequence with decorative leaf icon.

**Contains:**

- Purpose and benefits of the sequence
- Who the sequence is designed for
- When to practice (morning, evening, etc.)
- Special focus areas or themes
- Practice recommendations

### Activity Tracker

Interactive card to mark your practice sessions and build consistency.

**Features:**

- **Track Practice** - Mark when you complete the sequence
- **Visual Feedback** - Checkmark or icon confirms tracking
- **Practice History** - Shows your recent practice sessions
- **Motivation** - Builds consistency and accountability

**How to Use:**

1. Complete the sequence practice
2. Click the activity tracker button
3. Confirms the date/time of your practice
4. View your practice streak and history

### Weekly Activity Viewer

Detailed calendar visualization of your practice patterns.

**Displays:**

- Week-by-week practice history
- Days you practiced this sequence
- Practice frequency and consistency
- Visual pattern recognition
- Motivational progress tracking

## Practicing Your First Sequence

### Step-by-Step Practice Workflow

1. **Search for a Sequence**

   - Use the search bar to find a sequence by name
   - Browse "Mine" section for your personal sequences
   - Explore "Alpha" section for curated sequences

2. **Select Your Sequence**

   - Click on a sequence from search results
   - The sequence loads with the first series displayed
   - Orange title bar shows the sequence name

3. **Review the Series**

   - Read the series name to understand the focus
   - Scan the pose list to familiarize yourself
   - Note any alignment cues provided
   - Click pose names if you need detailed instructions

4. **Begin Your Practice**

   - Start with the first pose in the first series
   - Follow the numbered sequence
   - Move through each pose mindfully
   - Use alignment cues for guidance

5. **Navigate Through Series**

   - Use Next button or pagination circles to advance
   - Review the next series before transitioning
   - Previous button available if you need to repeat
   - Visual dots show your progress

6. **Complete the Sequence**

   - Finish all series in order
   - View the description for closing notes
   - Use the activity tracker to log your practice
   - Reflect on the complete journey

7. **Track Your Progress**

   - Click the activity tracker after completion
   - Review your weekly practice patterns
   - Build consistency over time
   - Celebrate your dedication

## Understanding Sequence Structure

### Series Order Matters

Sequences are carefully designed with intentional progression:

1. **Warm-Up Series** - Gentle poses to prepare the body
2. **Building Series** - Progressive intensity and challenge
3. **Peak Series** - Most demanding or focused poses
4. **Integration Series** - Balancing and transitional poses
5. **Cool-Down Series** - Calming and restorative poses

### Why Follow the Order?

- **Safety** - Proper warm-up prevents injury
- **Effectiveness** - Body preparation enhances performance
- **Energy Flow** - Natural build and release of intensity
- **Mental Journey** - Complete practice arc from start to finish

## Tips for Effective Sequence Practice

**Before You Begin:**

- Read through the entire sequence first
- Note the total number of series (pagination circles)
- Review any poses you're unfamiliar with
- Set aside enough uninterrupted time
- Prepare your space and props

**During Practice:**

- Follow the series in the designed order
- Don't rush between poses or series
- Pay attention to alignment cues provided
- Modify poses as needed for your body
- Breathe consciously throughout

**After Practice:**

- Take a moment in final relaxation (Savasana)
- Track your practice with the activity tracker
- Note how you feel physically and mentally
- Review the description for post-practice insights

**Building Consistency:**

- Practice the same sequence multiple times to deepen
- Track your progress with weekly activity viewer
- Notice improvements over repeated sessions
- Vary sequences to keep practice fresh

## Navigation Features Explained

### Previous/Next Buttons

**Location:** Top of series card, left and right sides

**Function:**

- **Previous** - Shows name of prior series, click to go back
- **Next** - Shows name of upcoming series, click to advance
- Disabled (grayed) at sequence boundaries
- Provides context about adjacent series

### Pagination Circles

**Location:** Below the series card

**FunWhat's the difference between scroll view and list view?**

A: **Scroll View** (this page) shows one series at a time with previous/next navigation—perfect for active practice and following along. **List View** shows all series in the sequence simultaneously—better for planning, editing, and overview. Use the view toggle icons to switch between them.

**Q: Do I have to practice the series in order?**

A: Yes, for best results. Sequences are designed with intentional progression for safety and effectiveness. However, you can use the pagination circles to jump to specific series if needed for review or to skip ahead

- Current position indicated by orange circle
- CliHow do I edit a sequence?\*\*

A: If you're the sequence owner (or admin), click the **pencil icon** in the orange title header. This navigates to the edit page in list view where you can modify the sequence name, description, image, and manage series. The icon changes to an X when you're in edit mode

### Pose Links

**Location:** Within each series card

**Function:**

- Click any pose name to view full pose details
- Opens individual asana page with complete instructions
- Includes images, Sanskrit names, and detailed cues
- Return to sequence with browser back button

### View Toggle

**Location:** Right side of title bar

**Function:**

- **List View** - See entire sequence at once
- **Scroll View** - Current paginated view
- Active view shown in orange/primary color
- Choose based on practice style preference

## Editing Sequences (Owner Only)

### When the Edit Icon Appears

The edit icon (pencil) appears in the orange title bar **only if:**

- You created the sequence
- You have admin permissions for the sequence

### How to Edit

1. Click the pencil icon in the title bar
2. Navigates to edit mode for the sequence
3. Icon changes to X (close) while editing
4. Click X to return to practice view
5. Refer to "Edit Sequence" help for details

### What You Can Edit

- Sequence name and description
- Add or remove series
- Reorder series in the sequence
- Update sequence image
- Modify all sequence properties

## Activity Tracking Explained

Why are there navigation buttons at the top but not the bottom of the series card?\*\*

A: The design uses **top navigation** (previous/next buttons) for sequential flow and **pagination circles** at the bottom for quick jumping to any series. This provides both linear navigation and random access without cluttering the interface.

**Q: How do I share a sequence with others?**

A: Currently, sequence sharing is managed through the system. Sequences you create are visible to you and admins. Future updates may include direct sharing features.

**Q: What happens when I click the series name in the card?**

A: Clicking the series name navigates to that series's dedicated practice page (`/navigator/flows/practiceSeries`) where you can view the series in isolation with full details, description, and series-specific activity tracking.

**Q: Can I practice just one series without the full sequence?**

A: Yes! Click the **series name** in the card header to navigate to that series's dedicated page. You can practice any series independently outside of its sequence context

- **Builds Accountability** - Visual record of commitment
- **Shows Progress** - See consistency patterns
- **Motivates Continuation** - Streaks encourage regularity
- **Informs Planning** - Understand your practice rhythm

### What Gets Tracked

- **Date and Time** - When you practiced
- **Sequence Completed** - Which sequence you practiced
- **Frequency** - How often you return to this sequence
- **Patterns** - Weekly and monthly trends

### Privacy Note

Your practice tracking is personal to your account. Only you can see your activity history (and admins for support purposes).

## Common Questions

**Q: Do I have to practice the series in order?**

A: Yes, for best results. Sequences are designed with intentional progression for safety and effectiveness. However, you can use the pagination circles to jump to specific series if needed for review.

**Q: Can I save my progress and return later?**

A: The page doesn't save mid-sequence progress. When you return, you'll start from the beginning. However, you can use pagination circles to quickly jump to where you left off.

**Q: What's the difference between Scroll View and List View?**

A: Scroll View (current page) shows one series at a time, perfect for practicing along. List View shows all series at once, better for overview and planning. Toggle with the icons in the title bar.

**Q: Can I practice sequences I didn't create?**

A: Yes! You can practice any sequence in the "Alpha" section (curated sequences) or any shared sequences. You can only edit sequences you created.

**Q: How do I create my own sequence?**

A: Go to Flows → Create Sequence. You'll be able to select multiple series and arrange them in your desired order with a description and image.

**Q: What if a series in a sequence was deleted?**

A: The page tries to load current series data. If a series no longer exists, it may show a warning or placeholder. Contact support if you encounter missing series in important sequences.

**Q: Can I see all my sequences at once?**

A: Use the search bar and view the "Mine" section to see your personal sequences. You can also browse through the autocomplete dropdown without typing.

**Q: Do alignment cues show during practice?**

A: Yes, the first line of any alignment cues appears in gray text next to each pose name. For full cues, click the pose name to view the complete instructions.

**Q: How do I share a sequence with others?**

A: Currently, sequence sharing is managed through the system. Sequences you create are visible to you and admins. Future updates may include direct sharing features.

**Q: Can I practice a sequence offline?**

A: The page requires an internet connection to load sequences and pose data. Consider printing or noting down sequences if you need offline access.

## Sequence Practice Best Practices

**Time Management:**

- Check total series count (pagination circles) before starting
- Estimate 10-20 minutes per series on average
- Allow extra time for unfamiliar sequences
- Don't rush—quality over speed

**Physical Preparation:**

- Warm up properly even before the sequence starts
- Have props ready (blocks, straps, blankets)
- Ensure adequate space for movement
- Dress comfortably for full range of motion

**Mental Approach:**

- Set an intention before beginning
- Stay present with each pose
- Avoid comparing to others or previous sessions
- Honor your body's needs and limits

**Creating Ritual:**

- Practice same sequences at consistent times
- Track regularly to build habit
- Review weekly patterns for insights
- Celebrate consistency milestones

**Progressive Development:**

- Master one sequence before adding new ones
- Repeat sequences to deepen understanding
- Notice subtle improvements over time
- Gradually increase challenge level

## Accessibility Features

**Screen Reader Support:**

- All interactive elements properly labeled
- Sequence and series names announced clearly
- Navigation buttons include descriptive text
- Activity tracking provides clear feedback

**Keyboard Navigation:**

- Tab through all interactive elements
- Enter/Space to activate buttons and links
- Arrow keys work in autocomplete search
- All features accessible without mouse

**Mobile Practice:**

- Responsive design works on phones and tablets
- Touch-friendly button sizes
- Pagination circles easy to tap
- Scrollable pose lists for small screens

**Visual Accessibility:**

- High contrast text and backgrounds
- Clear visual hierarchy
- Icon buttons include text labels
- Orange highlighting for active elements

This comprehensive guide ensures you can confidently practice yoga sequences, track your progress, and build a consistent, meaningful practice over time!
