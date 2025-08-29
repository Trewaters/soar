import React from 'react'
import AsanaDetailsEdit from '@app/clientComponents/asanaUi/AsanaDetailsEdit'
import type { AsanaEditFieldProps } from '@app/clientComponents/asanaUi/AsanaDetailsEdit'

/**
 * Example usage of the AsanaDetailsEdit component
 * This demonstrates how to create various field types with consistent styling
 */
export function AsanaDetailsEditExample() {
  const [formData, setFormData] = React.useState({
    name: '',
    category: '',
    variations: [] as string[],
    description: '',
    difficulty: '',
    breath: '',
    dristi: '',
  })

  const exampleFields: AsanaEditFieldProps[] = [
    {
      type: 'text',
      label: 'Asana Name',
      value: formData.name,
      onChange: (value: string) => setFormData({ ...formData, name: value }),
      required: true,
      placeholder: 'Enter the asana name',
    },
    {
      type: 'autocomplete',
      label: 'Category',
      value: formData.category,
      options: ['Standing', 'Seated', 'Backbend', 'Forward Bend', 'Twist'],
      onChange: (value: string) =>
        setFormData({ ...formData, category: value }),
      placeholder: 'Select a category',
      helperText: 'Choose the primary category for this asana',
      freeSolo: true,
    },
    {
      type: 'variations',
      label: 'Name Variations',
      value: formData.variations,
      onChange: (value: string[]) =>
        setFormData({ ...formData, variations: value }),
      placeholder: 'e.g. "Warrior I, Virabhadrasana I"',
      helperText: 'Separate variant names with commas',
    },
    {
      type: 'multiline',
      label: 'Description',
      value: formData.description,
      onChange: (value: string) =>
        setFormData({ ...formData, description: value }),
      placeholder: 'Enter a detailed description of the asana...',
      rows: 4,
      helperText: 'Provide step-by-step instructions and benefits',
    },
    {
      type: 'buttonGroup',
      label: 'Difficulty Level',
      value: formData.difficulty,
      options: ['Beginner', 'Intermediate', 'Advanced'],
      onChange: (value: string) =>
        setFormData({ ...formData, difficulty: value }),
      helperText: 'Select the appropriate difficulty level',
      required: true,
    },
    {
      type: 'text',
      label: 'Breath Pattern',
      value: formData.breath,
      onChange: (value: string) => setFormData({ ...formData, breath: value }),
      placeholder: 'e.g. Inhale to lift, Exhale to deepen',
    },
    {
      type: 'custom',
      label: 'Custom Field Example',
      value: '',
      onChange: () => {},
      helperText: 'This demonstrates how to use custom components',
      children: (
        <div
          style={{
            padding: '16px',
            border: '1px solid #ccc',
            borderRadius: '8px',
          }}
        >
          <p>Any custom component can go here!</p>
          <button onClick={() => console.log('Custom action')}>
            Custom Action
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <h2>AsanaDetailsEdit Component Example</h2>
      <AsanaDetailsEdit fields={exampleFields} />

      <div
        style={{ marginTop: '24px', padding: '16px', background: '#f5f5f5' }}
      >
        <h3>Current Form Data:</h3>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  )
}
