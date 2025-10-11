[**soar**](../../../../../README.md)

***

[soar](../../../../../modules.md) / [app/clientComponents/asanaUi/AsanaDetailsEdit](../README.md) / default

# Variable: default

> **default**: `NamedExoticComponent`\<`AsanaDetailsEditComponentProps`\>

Defined in: app/clientComponents/asanaUi/AsanaDetailsEdit.tsx:149

A standardized edit component for Asana form fields with consistent styling and headers.

## Remarks

This component provides a uniform way to display edit fields with proper headers,
icons, and consistent Soar application styling. It supports various input types
including text fields, autocomplete, button groups, and custom components.

## Param

The properties for the AsanaDetailsEdit component

## Param

Array of field configurations with their respective props

## Returns

A styled form component with consistent headers and field layouts

## Example

```tsx
<AsanaDetailsEdit
  fields={[
    {
      type: 'text',
      label: 'Asana Name',
      value: formData.name,
      onChange: (value) => setFormData({...formData, name: value}),
      required: true
    },
    {
      type: 'autocomplete',
      label: 'Category',
      value: formData.category,
      options: categories,
      onChange: (value) => setFormData({...formData, category: value})
    }
  ]}
/>
```
