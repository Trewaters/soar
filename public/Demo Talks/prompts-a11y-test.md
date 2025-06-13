## Level 1: Semantic HTML & Basic ARIA

Make content understandable to assistive technologies like screen readers.
• Use proper HTML5 tags (<button>, <nav>, <main>, <header>, <label>, etc.) instead of generic <div> or <span> for structure and controls.
• Ensure all inputs have associated <label> elements.
• Use alt attributes on images:
• <img src="/logo.png" alt="Company logo" />
• Add basic ARIA roles or properties only when necessary:
• <div role="alert"> Form submission failed. </div>

## Ai Prompts

Prompt 1.a, setup all jest tests
Implement jest testing for component. Here are the files that I see as needed. please suggest best practices.
The testing path I use currently is **test**\*.spec.ts

Prompt 1.b, setup level 1
Apply this level of accessibility to the component.

Level 1: Semantic HTML & Basic ARIA

Make content understandable to assistive technologies like screen readers.

Use proper HTML5 tags (<button>, <nav>, <main>, <header>, <label>, etc.) instead of generic <div> or <span> for structure and controls.

Ensure all inputs have associated <label> elements.

Use alt attributes on images:

```html
<img src="/logo.png" alt="Company logo" />
```

Add basic ARIA roles or properties only when necessary:

```html
<div role="alert">Form submission failed.</div>
```

Prompt 2, level 1unit tests
Add jest unit test to include checks for level 1 accessibility. Level 1 is Semantic HTML & Basic ARIA.
Create unit test for this component. Use accessibility markers where possible to simplify testing.

Prompt 2.b, component specific unit testing
add the below level of accessibility to my component code.
Level 1: Semantic HTML & Basic ARIA
Make content understandable to assistive technologies like screen readers.
• Use proper HTML5 tags (<button>, <nav>, <main>, <header>, <label>, etc.) instead of generic <div> or <span> for structure and controls.
• Ensure all inputs have associated <label> elements.
• Use alt attributes on images:
• <img src="/logo.png" alt="Company logo" Add basic ARIA roles or properties only when necessary:
• <div role="alert"> Form submission failed. </div>

Prompt 3, Prioritize a11y testing
#codebase use accessibility markers instead of testId for my unit tests where possible.
Instead of using test id use an already available accessibility element or tag for the icons.

Prompt 4.a, scan package.json
#codebase analyze this package json for accessibility related packages.

Prompt 4.b, Accessibility tool setup
#codebase properly initialize "@axe-core/react": "^4.10.0" so it is used by this project.

Prompt 5, Prepare talk
#codebase outline a short 5 minute talk about the unit tests in this project and how they focus on accessibility.
