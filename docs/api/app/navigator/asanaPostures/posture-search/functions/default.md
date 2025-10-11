[**soar**](../../../../../README.md)

***

[soar](../../../../../modules.md) / [app/navigator/asanaPostures/posture-search](../README.md) / default

# Function: default()

> **default**(`props`): `Element`

Defined in: app/navigator/asanaPostures/posture-search.tsx:42

A search component for asana poses that provides autocomplete functionality.

## Parameters

### props

`PostureSearchProps`

The component props

## Returns

`Element`

A search interface with autocomplete dropdown for selecting asana poses

## Component

## Example

```tsx
<PostureSearch posturePropData={asanaPostures} />
```

## Remarks

- Updates the global asana pose state when a selection is made
- Navigates to the selected posture's detail page
- Filters postures by English name using case-insensitive matching
- Displays a search icon and custom styling for the input field
- Automatically selects the first matching option when typing
