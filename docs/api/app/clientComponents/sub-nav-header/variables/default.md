[**soar**](../../../../README.md)

***

[soar](../../../../modules.md) / [app/clientComponents/sub-nav-header](../README.md) / default

# Variable: default

> `const` **default**: `React.FC`\<`SubNavHeaderProps`\>

Defined in: app/clientComponents/sub-nav-header.tsx:30

SubNavHeader component renders a navigation header with a back button and a help icon button.

## Component

## Param

The properties for the SubNavHeader component.

## Param

The title to be displayed on the back button.

## Param

The URL to navigate to when the back button is clicked.

## Param

Optional click handler for the help icon button.

## Param

Optional sx prop for custom styling of the container.

## Example

```ts
<SubNavHeader
  title="Dashboard"
  link="/dashboard"
  onClick={() => console.log('Help icon clicked')}
  sx={{ paddingLeft: 1, paddingRight: 1 }}
/>
```
