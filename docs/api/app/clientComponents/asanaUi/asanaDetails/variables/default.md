[**soar**](../../../../../README.md)

***

[soar](../../../../../modules.md) / [app/clientComponents/asanaUi/asanaDetails](../README.md) / default

# Variable: default

> **default**: `NamedExoticComponent`\<`AsanaDetailsComponentProps`\>

Defined in: app/clientComponents/asanaUi/asanaDetails.tsx:37

Displays detailed information about an Asana item in a styled definition list format.

## Remarks

This component uses Material UI's Box, Stack, and Typography components to layout the label and details.
It also includes an icon and supports responsive design.

## Param

The properties for the AsanaDetails component.

## Param

The label or title for the Asana detail.

## Param

The detailed description or content for the Asana detail.

## Param

Optional additional styling to apply to the details section.

## Returns

A memoized React component rendering the Asana detail section.

## Example

```tsx
<AsanaDetails label="Pose Name" details="Description of the pose." />
```
