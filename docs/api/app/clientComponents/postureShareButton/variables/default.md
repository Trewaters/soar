[**soar**](../../../../README.md)

***

[soar](../../../../modules.md) / [app/clientComponents/postureShareButton](../README.md) / default

# Variable: default

> `const` **default**: `React.FC`\<`CombinedPostureShareButtonProps`\>

Defined in: app/clientComponents/postureShareButton.tsx:130

A React functional component that renders a button for sharing yoga content using the strategy pattern.

This component supports multiple content types (asana, series, sequence) through a discriminated union
pattern for type safety and extensibility. It automatically selects the appropriate sharing strategy
based on the content type provided.

Features:
- Dynamic accessibility labels based on content type
- Enhanced error handling with content-specific messages
- Loading states and user feedback for sharing operations
- Consistent MUI styling across all content types
- Proper edge case handling for missing or invalid content

## Component

## Param

The properties for the component.

## Param

The yoga content to share (discriminated union).

## Param

Legacy: The data for a single asana pose (deprecated).

## Param

Legacy: The data for a series of asana poses (deprecated).

## Param

Flag to indicate whether to show detailed information.

## Returns

The rendered sharing component.

## Examples

```ts
// New discriminated union usage (preferred):
<PostureShareButton
  content={{
    contentType: 'asana',
    data: asanaData
  }}
  showDetails={true}
/>
```

```ts
// Legacy usage (deprecated but supported):
<PostureShareButton
  postureData={postureData}
  showDetails={true}
/>
```
