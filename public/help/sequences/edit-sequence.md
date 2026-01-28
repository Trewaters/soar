# Edit Sequence Help

## Overview

The **Edit Sequence** feature allows sequence owners to modify their yoga sequences—updating names, descriptions, images, and managing which series are included. Access editing from both the list view (Sequence Details page) and scroll view (Practice Sequences page) via the pencil icon in the sequence title header.

**Edit URLs:**

- From List View: `/navigator/sequences/[id]?edit=true`
- From Scroll View: `/navigator/flows/practiceSequences?sequenceId=[id]` (then click edit icon)

## Who Can Edit Sequences?

### Sequence Owners

You can edit sequences **you created** where you are listed as the owner. The edit pencil icon appears in the orange title header only for your sequences.

### Admin Users

Users with **admin role** can edit any sequence regardless of ownership. This allows admins to:

- Manage platform content and curated sequences
- Assist users with sequence issues
- Update shared or public sequences
- Fix data inconsistencies

### Permission Check

The system compares your email address (from your session) with the sequence's `created_by` field. If they match **OR** you have admin role, you can edit.

## Accessing Edit Mode

### From List View (Sequence Details Page)

1. **Navigate to sequence details** - Go to `/navigator/sequences/[id]`
2. **Locate the edit icon** - Pencil icon inside the orange title header
3. **Click the pencil icon** - Inline editor appears below the title
4. **URL updates** - `?edit=true` is added to the URL
5. **Content hides** - Series cards and details hide during editing

### From Scroll View (Practice Sequences Page)

1. **Load a sequence** - Search and select your sequence
2. **Find the edit icon** - Pencil icon inside the orange title tab
3. **Click the pencil icon** - Navigates to list view edit page
4. **Edit mode opens** - Redirects to `/navigator/sequences/[id]?edit=true`

### Visual Indicators

**Edit Icon States:**

- **Pencil icon** - Not editing, click to enter edit mode
- **X (close) icon** - Currently editing, click to exit without saving
- **Icon location** - Inside orange title header on the right side
- **Color** - White icon on orange background for contrast

## Edit Capabilities

### Sequence Name

Update the title/name of your sequence to better describe its purpose or theme.

**Field Details:**

- **Required** - Sequence name cannot be empty
- **Text input** - Standard text field with label
- **Character limit** - Reasonable length for display (check validation)
- **Immediate preview** - Changes reflected in title when saved

**Naming Tips:**

- Use descriptive names that indicate sequence purpose
- Include difficulty level if relevant (e.g., "Beginner Morning Flow")
- Note duration if consistent (e.g., "30-Minute Evening Practice")
- Consider searchability (use common yoga terms)

### Description

Add or modify detailed description of the sequence's purpose, benefits, and practice guidance.

**Field Details:**

- **Optional** - Description can be blank
- **Multi-line text** - Textarea for longer content
- **Preserves formatting** - Line breaks maintained in display
- **Markdown-style** - Plain text with preserved line breaks

**Description Best Practices:**

- **Practice goals** - What this sequence aims to achieve
- **Target audience** - Beginner, intermediate, or advanced
- **Duration estimate** - How long the practice typically takes
- **Best timing** - Morning, evening, or any-time practice
- **Props needed** - Blocks, straps, blankets, bolster, etc.
- **Modifications** - How to adapt for different levels
- **Benefits** - Physical, mental, and energetic benefits
- **Special notes** - Contraindications or safety considerations

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

### Image Upload

Add, replace, or remove the sequence image that visually represents the practice.

**Upload Features:**

- **Drag and drop** - Drag image files onto upload area
- **File picker** - Click to browse and select image
- **Preview** - See uploaded image before saving
- **Replace** - Upload new image to replace existing
- **Remove** - Delete existing image (optional)

**Image Requirements:**

- **Supported formats** - JPEG, PNG, SVG
- **File size limit** - Maximum 5MB per image
- **Recommended dimensions** - 400px width (responsive sizing)
- **Aspect ratio** - Any, but square or landscape work best

**Image Use Cases:**

- Visual representation of sequence theme or energy
- Peak pose demonstration from the sequence
- Inspirational practice imagery
- Quick visual identification in search results
- Brand/style consistency for your sequences

### Series Management

Add or remove series from the sequence to customize your practice flow.

**Add Series:**

1. **Search field** - Autocomplete search for existing series
2. **Type series name** - Partial matches show dropdown results
3. **Select from list** - Click to add series to sequence
4. **Multiple additions** - Add as many series as needed
5. **Immediate feedback** - Added series appear in edit list

**Remove Series:**

1. **Delete icon** - X or trash icon next to each series in editor
2. **Click to remove** - Series removed from sequence (not deleted from database)
3. **Confirmation** - May show confirmation dialog
4. **Reversible** - Can re-add if removed by mistake

**Series Search Features:**

- **Autocomplete** - Smart filtering as you type
- **Your series** - Priority given to series you created
- **Alpha series** - Curated platform series available
- **Name matching** - Searches by series name

### Series Ordering

Reorder series to change the practice flow and progression of the sequence.

**Reordering Methods:**

**Drag and Drop (if enabled):**

- Grab series by drag handle icon
- Drag to new position in the list
- Drop to reorder
- Visual feedback during drag

**Alternative Methods:**

- Up/down arrow buttons next to each series
- Move to top/bottom buttons
- Numeric position input

**Why Order Matters:**

- **Safety** - Proper warm-up before intense poses
- **Energy flow** - Build intensity then cool down
- **Pedagogical** - Teach fundamental patterns first
- **Experience** - Create intentional practice arc

**Recommended Sequence Structure:**

1. **Warm-up series** - Gentle preparation (5-10 minutes)
2. **Foundation series** - Basic poses and alignment
3. **Building series** - Increase challenge and intensity
4. **Peak series** - Most demanding or focused work
5. **Integration series** - Balance and transition
6. **Cool-down series** - Calming and restorative

## Edit Controls

### Save Button

Commits all changes to the database and exits edit mode.

**Save Behavior:**

- **Validates fields** - Checks required fields are filled
- **Database update** - Saves changes to MongoDB via Prisma
- **Exits edit mode** - Returns to view mode automatically
- **URL update** - Removes `?edit=true` from URL
- **Shows changes** - Updated content immediately visible
- **Success feedback** - Confirmation message or visual cue

**What Gets Saved:**

- Updated sequence name
- Modified description text
- New or replaced image URL
- Added or removed series
- Reordered series positions
- Updated timestamp (updatedAt field)

### Cancel Button

Discards all changes and closes the editor without saving.

**Cancel Behavior:**

- **No database changes** - Nothing is saved
- **Reverts to original** - All fields return to pre-edit state
- **Exits edit mode** - Returns to view mode
- **URL update** - Removes `?edit=true` from URL
- **Confirmation dialog** - May ask "Are you sure?" if changes made

**When to Cancel:**

- Changed your mind about modifications
- Made mistakes and want to start over
- Accidentally entered edit mode
- Testing features without saving

### Close Icon (X in Title)

Alternative way to exit edit mode, equivalent to Cancel.

**Close Behavior:**

- **Same as Cancel** - Discards unsaved changes
- **Located in title** - X icon replaces pencil in orange header
- **Quick exit** - Fast way to close editor
- **No confirmation** - May exit immediately (depending on implementation)

## Editing Workflow

### Step-by-Step Editing Process

1. **Enter Edit Mode**

   - Click pencil icon in the orange title header
   - URL updates to include `?edit=true`
   - Editor panel appears
   - Series cards and details hide temporarily

2. **Modify Sequence Details**

   - **Update name** - Edit in the name text field
   - **Change description** - Modify in the description textarea
   - **Upload image** - Drag/drop or browse for new image
   - **Remove image** - Click remove button if unwanted

3. **Manage Series**

   - **Add series** - Use search autocomplete to find and add series
   - **Remove series** - Click delete icon next to unwanted series
   - **Reorder series** - Drag to rearrange or use arrow buttons
   - **Verify order** - Confirm sequence flow makes sense

4. **Review Changes**

   - **Check name** - Ensure name is descriptive and correct
   - **Read description** - Verify all information is accurate
   - **Preview image** - Confirm image displays properly
   - **Validate series** - Review order and completeness

5. **Save or Cancel**

   - **Click Save** - Commit changes to database (exits edit mode)
   - **Click Cancel** - Discard changes (exits edit mode)
   - **Click X icon** - Alternative cancel (exits edit mode)

6. **Verify Results**

   - **View mode loads** - Editor closes, content displays
   - **Check changes** - Confirm modifications applied correctly
   - **Test navigation** - Ensure series links work properly
   - **Practice** - Try scroll view to verify flow

## Important Notes

### Edit Mode Behavior

**Content Visibility:**

- **Hidden during edit** - Series cards, description, and activity tracking hide
- **Focus on editing** - Clean interface for modifications only
- **Preview unavailable** - Can't see rendered view while editing
- **Save to preview** - Must save to see final appearance

**URL Synchronization:**

- **Edit parameter** - `?edit=true` added when editing
- **Browser history** - Creates history entry for edit state
- **Bookmark-able** - Can bookmark edit URL to return to editing
- **Shareable** - Edit URL only works for owners/admins

**Ownership Verification:**

- **Server-side check** - Permissions verified on save
- **Email matching** - Compares session email with created_by field
- **Admin override** - Admin role bypasses owner check
- **Error on mismatch** - Save fails if not authorized

### Data Persistence

**Auto-save:**

- **Not implemented** - Changes only saved on explicit Save click
- **No drafts** - Edits lost if you navigate away without saving
- **Browser warning** - May warn about unsaved changes on page leave

**Series References:**

- **Name-based** - Series referenced by name, not just ID
- **Dynamic resolution** - Series data refreshed on view to show current poses
- **Stale detection** - Warns if series no longer exists in database
- **Broken links** - Alerts users if series was deleted

**Image Storage:**

- **External storage** - Images uploaded to cloud storage (Vercel Blob, etc.)
- **URL saved** - Only image URL stored in sequence record
- **Deletion handling** - Old image may remain in storage when replaced
- **Size constraints** - Upload validation enforces size limits

## Editing Best Practices

### Content Quality

**Descriptive Names:**

- Be specific and clear about sequence purpose
- Include key information (duration, level, style)
- Make names searchable and recognizable
- Avoid overly long names (mobile display)

**Comprehensive Descriptions:**

- Write for practitioners who haven't practiced the sequence
- Include practical information (props, duration, level)
- Explain the progression and flow logic
- Add personal insights or teaching notes

**Appropriate Images:**

- Choose images that represent the sequence energy
- Ensure images are high quality and clear
- Use consistent styling across your sequences
- Respect image copyrights and licensing

### Sequence Design

**Series Selection:**

- Choose series that work well together
- Consider energy flow and difficulty progression
- Ensure adequate warm-up and cool-down
- Balance intensity throughout practice

**Logical Ordering:**

- Start with preparatory poses
- Build to peak intensity mindfully
- Include transitions and integrations
- End with calming, restorative series

**Practice Testing:**

- Practice your sequence before publishing
- Time the actual duration for accuracy
- Note any difficult transitions
- Adjust based on experience

### Maintenance

**Regular Reviews:**

- Revisit sequences periodically
- Update descriptions as understanding evolves
- Replace outdated images
- Adjust series based on teaching experience

**Series Updates:**

- Check if component series were modified
- Verify series still contain expected poses
- Update sequence if series changed significantly
- Remove stale or deleted series

**User Feedback:**

- Consider feedback from practitioners
- Adjust difficulty level descriptions
- Add clarifications to descriptions
- Improve based on common questions

## Common Editing Scenarios

### Updating an Existing Sequence

**Reason:** The sequence needs refinement based on practice experience.

**Process:**

1. Navigate to sequence details page
2. Click edit icon to enter edit mode
3. Modify name, description, or image as needed
4. Adjust series list (add, remove, reorder)
5. Save changes
6. Practice the updated sequence to verify improvements

### Creating a Variation

**Reason:** You want a similar sequence with modifications.

**Process:**

1. **Note:** You can't duplicate sequences directly
2. Create a new sequence from scratch (Create Sequence page)
3. Reference the original sequence while building
4. Add similar series in modified order
5. Write new description explaining the variation
6. Give it a distinct name (e.g., "Morning Flow - Gentle Variation")

### Fixing Series Issues

**Reason:** A series was deleted or updated by its owner.

**Process:**

1. Notice warning or broken series reference
2. Enter edit mode
3. Remove the problematic series
4. Search for replacement series
5. Add appropriate substitute
6. Reorder if needed
7. Update description to reflect changes
8. Save and test

### Seasonal Adjustments

**Reason:** Adapt sequences for different seasons or intentions.

**Process:**

1. Review existing sequence
2. Enter edit mode
3. Update description with seasonal notes
4. Adjust series to match seasonal energy (more heating for winter, more cooling for summer)
5. Update image to reflect season if desired
6. Save seasonal variation
7. Consider creating separate sequences for major variations

## Troubleshooting Editing Issues

### Can't See Edit Icon

**Problem:** Pencil icon doesn't appear in title header.

**Solutions:**

- **Sign in** - Must be authenticated to edit
- **Verify ownership** - Only owner/admin can edit
- **Check created_by** - Ensure sequence is yours
- **Refresh page** - Reload to update session state
- **Contact admin** - If you should have access but don't

### Changes Not Saving

**Problem:** Click Save but changes don't persist.

**Solutions:**

- **Check console** - Browser console may show errors
- **Verify internet** - Ensure stable connection
- **Required fields** - Ensure name field is not empty
- **Try again** - Click Save again after fixing issues
- **Contact support** - If problem persists

### Series Won't Add

**Problem:** Can't add series to the sequence.

**Solutions:**

- **Search carefully** - Type exact or partial series name
- **Check availability** - Series may have been deleted
- **Verify permissions** - Some series may be restricted
- **Try different series** - Confirm search is working
- **Refresh data** - Reload page to refresh series list

### Image Upload Fails

**Problem:** Image won't upload or shows error.

**Solutions:**

- **Check file size** - Must be under 5MB
- **Verify format** - JPEG, PNG, or SVG only
- **Try different image** - Test with known-good image
- **Check internet** - Upload requires stable connection
- **Compress image** - Reduce file size if too large

### Lost Unsaved Changes

**Problem:** Navigated away and lost edits.

**Solutions:**

- **Save frequently** - Make a habit of saving work
- **No recovery** - No auto-save or draft system currently
- **Browser warning** - May warn before leaving with unsaved changes
- **Re-enter edits** - Unfortunately must redo lost work
- **Feature request** - Auto-save may be added in future

## Keyboard Shortcuts (if implemented)

- **Ctrl/Cmd + S** - Save changes (if enabled)
- **Escape** - Exit edit mode / Cancel (if enabled)
- **Tab** - Navigate between form fields
- **Enter** - Submit forms or confirm actions

## Related Help Topics

- [**Sequence Details Help**](sequence-details.md) - List view with all series displayed
- [**Practice Sequences Help**](practice-sequences.md) - Scroll view for active practice
- [**Create Sequences Help**](create-sequences.md) - Building sequences from scratch
- [**Practice Series Help**](../flows/practice-series.md) - Understanding series components

## Development Notes

**Technical Implementation:**

- Inline editing component: `EditSequence.tsx`
- Parent component: `SequenceViewWithEdit.tsx`
- URL state management: Next.js router with query params
- Database updates: Prisma update operations
- Permission checks: NextAuth session + role verification
- Image uploads: Cloud storage integration (Vercel Blob or similar)

**Key Functions:**

- `handleSequenceUpdate()` - Processes saved changes
- `handleToggleEdit()` - Enters/exits edit mode
- `isOwner` - Computed property for permission check
- Series resolution by name for navigation accuracy
