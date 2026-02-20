# Edit Asana Help

## Overview

The **Edit Asana** view allows owners (or users with edit permissions) to update an existing asana's details: name, Sanskrit name, description, tags, difficulty, images, and practice settings. This help document covers the fields, validations, save/cancel behavior, and permissions notes.

**Page pattern:** The edit UI is displayed when the Practice Asanas page is opened with an `id` and `edit=true` (for example: `/asanaPoses/practiceAsanas?id=686000caa1949b8140c403b3&edit=true`).

## Editable Fields

- **English Name (required):** Primary display name. Keep it descriptive and concise.
- **Sanskrit Name (optional):** Traditional name for instructors and advanced users.
- **Description / Instructions (required):** Step-by-step cues, setup instructions, and modifications.
- **Difficulty:** Selects a difficulty level (beginner/intermediate/advanced).
- **Tags / Categories:** Body focus, pose type (standing, seated, balancing), and other tags.
- **Images:** Upload or replace pose images. Supported formats: JPEG, PNG. Max recommended size: 5 MB.
- **Recommended Hold Time / Timer (optional):** Numeric value used by practice timers.

## Validation Rules & UX

- Required fields will show inline validation messages when missing.
- Image uploads validate file type and size before submission.
- If the app supports real-time validation, resolve errors shown inline before saving.

## Save & Cancel Behavior

- **Save:** Validates inputs, persists changes to the database, and returns to the detail view (or refreshes the inline detail). A success toast/notification confirms save.
- **Cancel:** Discards unsaved changes and returns to the prior view. If there are unsaved changes, a confirmation prompt may appear.
- **Autosave / Drafts:** If the app implements autosave, drafts are kept and you may resume editing later.

## Permissions

- Only the asana owner or users granted edit permissions can save changes. If you lack permission, Edit controls are hidden or disabled.
- To modify a pose you don't own, copy/duplicate it into **My Asanas** (if available) and edit the copy.

## Audit & History

- Some deployments provide a change history or versioning; check the pose detail for an edit history if available.

## Troubleshooting

- **Unable to save:** Check form validation errors, ensure you are signed in, and try again.
- **Image upload fails:** Verify file format and size, and check network connectivity.
- **Permission denied:** Confirm you are the owner or contact the pose owner/admin for edit rights.

## Accessibility

- All form fields include labels and ARIA attributes. Use `Tab` to navigate fields and `Enter` to submit forms.
- Image upload controls accept keyboard and screen-reader interactions where supported.

If you want, I can also add a developer snippet showing how the Help Drawer decides between practice/details/edit help based on `searchParams` (example using `useSearchParams`).
