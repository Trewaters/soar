[**soar**](../../../../README.md)

***

[soar](../../../../modules.md) / [app/utils/mobileInputHelpers](../README.md) / maintainInputFocus

# Function: maintainInputFocus()

> **maintainInputFocus**(`inputRef`, `isActive`): () => `void` \| `undefined`

Defined in: app/utils/mobileInputHelpers.ts:84

Maintain input focus for mobile devices

## Parameters

### inputRef

`RefObject`\<`HTMLInputElement` \| `HTMLTextAreaElement`\>

React ref to the input element

### isActive

`boolean` = `true`

Whether the input should maintain focus

## Returns

() => `void` \| `undefined`

Cleanup function or undefined
