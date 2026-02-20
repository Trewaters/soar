# Create Asana Help

## Overview

The **Create Asana** page allows you to add custom yoga poses to your personal collection. Build your own asana library with poses that match your practice style, including modifications, personal notes, and custom names.

**Page URL:** `/asanaPoses/createAsana`

## Page Components

### Splash Header

Visual banner displaying "Create an Asana" with an inspiring background image of a yoga practitioner. This establishes the context and purpose of the page.

### Back Navigation

Returns you to the **Asana Landing Page** (`/asanaPoses`). Use this to exit the creation process without saving.

### Help Button

Opens this contextual help drawer with guidance on creating custom asana poses. The green question mark icon is always available in the top navigation area.

### Asana Form Fields

Complete form for defining all aspects of your custom pose:

#### Required Fields

**Asana Pose Name**

- Primary identifier for your pose
- Must be unique in your collection
- Use clear, descriptive names
- Examples: "Warrior I", "Extended Triangle", "Child's Pose"

**Note:** If you try to use a name that already exists, the system will suggest an alternative with a timestamp (e.g., "Warrior I (1234)").

#### Recommended Fields

**Category**

- Select from predefined categories or create custom ones
- Categories include: Standing, Seated, Balance, Backbend, Forward Bend, Twist, Inversion, Hip Opener, Arm Leg Support, Core, Restorative, and more
- Helps organize and filter your pose collection
- Supports free-form text entry for custom categories

**Difficulty Level**

- Choose from: **Easy**, **Average**, or **Difficult**
- Button group selection for quick input
- Helps you plan practices appropriate to your skill level

**Description**

- Multi-line text field for detailed pose explanation
- Include benefits, contraindications, or personal observations
- Use this space to capture what makes this pose special for your practice

#### Optional Fields

**Name Variations**

- Comma-separated list of alternative English names
- Examples: "Downward Dog, Down Dog, Adho Mukha"
- Helps you find poses when searching by different names
- Useful for poses with multiple common names

**Sanskrit Name(s)**

- Traditional Sanskrit name for the pose
- Single text field (first Sanskrit name is primary)
- Examples: "Tadasana", "Vrikshasana", "Adho Mukha Svanasana"
- Use proper spelling and diacritics when possible

**Dristi (Gaze Point)**

- Specify where to focus your gaze during the pose
- Common options: "Tip of the nose", "Between the eyebrows", "Hand", "Toes", "Upward to the sky"
- Supports custom entries for specific gaze directions
- Enhances mindfulness and alignment in practice

**Setup Cues**

- Multi-line instructions for entering the pose
- Step-by-step guidance for initial positioning
- Include preparatory movements or prop setup
- Write as if teaching someone new to the pose

**Deepening Cues**

- Advanced instructions for progressing the pose
- Tips for increasing intensity or depth
- Modifications for experienced practitioners
- Safety considerations for deeper variations

**Alternative Names (Custom/Nicknames)**

- Personal nicknames or custom identifiers
- Comma-separated list of your own names for the pose
- Examples: "My favorite twist", "Pretzel pose", "Morning wake-up stretch"
- Helps you organize poses by personal meaning

### Image Upload

**Purpose:** Add visual references to your custom pose

**Features:**

- Drag-and-drop or click to upload
- Supports JPEG, PNG, and SVG formats
- Maximum file size: 5MB per image
- Upload multiple images to show different angles or variations

**Best Practices:**

- Use clear, well-lit photos
- Show proper alignment and form
- Include front, side, and back views when helpful
- Name images descriptively before uploading

**Uploaded Images Gallery:**

- Thumbnail grid displays all uploaded images
- Shows filename below each image
- Images are linked to the pose after successful creation
- If pose creation fails, images are automatically cleaned up

### Create/Cancel Buttons

**Sticky Bottom Bar** - Always visible at the bottom of the page for easy access

**Create Asana Button:**

- Primary action (contained button style)
- Validates required fields before submission
- Shows progress: "Creating Asana..." during save
- Displays success message and redirects to pose detail page
- Disabled during submission to prevent duplicate entries

**Cancel Button:**

- Secondary action (outlined button style)
- Clears all form fields and uploaded images
- Returns to Asana Landing Page without saving
- No confirmation required (work is not saved)

## Creating Your First Asana

### Quick Start Guide

1. **Enter the pose name** (required) - Use a unique, descriptive name
2. **Select category** - Choose from dropdown or type custom category
3. **Choose difficulty level** - Easy, Average, or Difficult
4. **Add description** - Explain the pose and its benefits
5. **Upload an image** (optional) - Drag and drop or click to browse
6. **Click "Create Asana"** - Save your pose and view it immediately

### Step-by-Step Workflow

**Step 1: Plan Your Pose**

Before filling out the form, consider:

- What makes this pose unique to your practice?
- Which details are most important to capture?
- Do you have reference images ready to upload?

**Step 2: Complete Required Information**

Start with the essentials:

- Give your pose a clear, memorable name
- Select the most appropriate category
- Choose the difficulty level honestly

**Step 3: Add Context and Details**

Enhance your pose with:

- Detailed description of the pose
- Sanskrit name if known
- Setup and deepening cues for guidance

**Step 4: Upload Visual References**

If you have images:

- Upload photos showing proper form
- Include multiple angles if available
- Use clear, high-quality images

**Step 5: Review and Save**

Before clicking "Create Asana":

- Double-check the pose name is unique
- Review all entered information
- Ensure images are properly uploaded

**Step 6: Practice Your Pose**

After creation:

- You'll be redirected to your new pose's detail page
- The pose is immediately available in searches
- You can edit or delete it anytime from the detail page

## Tips for Creating Effective Asanas

**Naming Conventions:**

- Be specific: "Warrior I" not just "Warrior"
- Use standard names when they exist
- Add descriptors for variations: "Warrior I (Back Knee Down)"
- Avoid overly creative names that you might forget

**Writing Good Descriptions:**

- Start with the physical position
- Include key alignment points
- Mention primary muscle groups engaged
- Note any contraindications or cautions
- Keep it concise but informative

**Choosing Categories:**

- Pick the most prominent characteristic
- When in doubt, think about the primary action
- Use consistent category names across your poses
- Create custom categories for your unique practice style

**Setting Difficulty Levels:**

- **Easy:** Accessible to beginners, minimal strength/flexibility required
- **Average:** Requires some experience, moderate demands
- **Difficult:** Advanced poses requiring significant skill or conditioning

**Using Sanskrit Names:**

- Include them when you know them
- Don't worry about perfect diacritics
- Common spelling is better than nothing
- Sanskrit names help connect to yoga tradition

**Writing Setup Cues:**

- Use clear, sequential instructions
- Start from a known position (e.g., "From Mountain Pose...")
- Include breath cues when relevant
- Keep language simple and direct

**Creating Deepening Cues:**

- Assume the practitioner is already in the pose
- Focus on subtle refinements
- Suggest progressive challenges
- Always prioritize safety

## Common Questions

**What if my pose name already exists?**

The system will display an error and suggest an alternative name with a timestamp. You can either:

- Choose a more specific name (e.g., add "Modified" or a descriptor)
- Accept the suggested timestamp version
- Use the Alternative Names field for your preferred name

**Can I edit a pose after creating it?**

Yes! Navigate to the pose detail page and use the edit functionality. All fields can be updated, and images can be added or removed.

**Are my custom poses private or public?**

Currently, custom poses are **private to your account**. Only you can see and use poses you create. Future updates may include sharing options.

**Can I upload multiple images?**

Yes! Upload as many images as helpful. They'll appear in a gallery on the pose detail page. This is useful for showing different angles or variations.

**What happens to uploaded images if I cancel?**

Images are only linked to poses upon successful creation. If you cancel or if creation fails, any uploaded images are automatically deleted to prevent orphaned files.

**Do I need to fill out all fields?**

No. Only the **Asana Pose Name** is required. However, adding more details makes your poses more useful for practice and reference.

**Can I use emojis or special characters in names?**

Yes, the system supports Unicode characters. However, simple names are often easier to search for and remember.

**What's the difference between "Name Variations" and "Alternative Names"?**

- **Name Variations:** Standard alternative English names for the pose
- **Alternative Names:** Your personal nicknames or custom identifiers

Both help with searching, but Alternative Names are for your personal organization.
