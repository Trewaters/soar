[**soar**](../../../../README.md)

***

[soar](../../../../modules.md) / [app/utils/mobileThemeHelpers](../README.md) / default

# Variable: default

> `const` **default**: `object`

Defined in: app/utils/mobileThemeHelpers.ts:194

## Type Declaration

### getMobileButtonTheme()

> **getMobileButtonTheme**: () => `SxProps`\<`Theme`\>

Mobile-optimized button styling for better touch interaction

#### Returns

`SxProps`\<`Theme`\>

### getMobileFormContainerTheme()

> **getMobileFormContainerTheme**: () => `SxProps`\<`Theme`\>

Mobile-optimized form container styling

#### Returns

`SxProps`\<`Theme`\>

### getMobileGlobalTheme()

> **getMobileGlobalTheme**: () => `object`

Global mobile theme enhancements

#### Returns

`object`

##### components

> **components**: `object`

###### components.MuiButton

> **MuiButton**: `object`

###### components.MuiButton.styleOverrides

> **styleOverrides**: `object`

###### components.MuiButton.styleOverrides.root

> **root**: `object`

###### components.MuiButton.styleOverrides.root.borderRadius?

> `optional` **borderRadius**: `string` = `'12px'`

###### components.MuiButton.styleOverrides.root.fontSize?

> `optional` **fontSize**: `string` = `'16px'`

###### components.MuiButton.styleOverrides.root.fontWeight?

> `optional` **fontWeight**: `number` = `600`

###### components.MuiButton.styleOverrides.root.minHeight

> **minHeight**: `string` = `'48px'`

###### components.MuiButton.styleOverrides.root.minWidth

> **minWidth**: `string` = `'48px'`

###### components.MuiIconButton

> **MuiIconButton**: `object`

###### components.MuiIconButton.styleOverrides

> **styleOverrides**: `object`

###### components.MuiIconButton.styleOverrides.root

> **root**: `object`

###### components.MuiIconButton.styleOverrides.root.minHeight

> **minHeight**: `string` = `'48px'`

###### components.MuiIconButton.styleOverrides.root.minWidth

> **minWidth**: `string` = `'48px'`

###### components.MuiIconButton.styleOverrides.root.padding

> **padding**: `string` = `'12px'`

###### components.MuiTextField

> **MuiTextField**: `object`

###### components.MuiTextField.styleOverrides

> **styleOverrides**: `object`

###### components.MuiTextField.styleOverrides.root

> **root**: `object`

###### components.MuiTextField.styleOverrides.root.& input

> **& input**: `object`

###### components.MuiTextField.styleOverrides.root.& input.fontSize

> **fontSize**: `string` = `'16px !important'`

###### components.MuiTextField.styleOverrides.root.& input.WebkitAppearance

> **WebkitAppearance**: `string` = `'none'`

###### components.MuiTextField.styleOverrides.root.& textarea

> **& textarea**: `object`

###### components.MuiTextField.styleOverrides.root.& textarea.fontSize

> **fontSize**: `string` = `'16px !important'`

###### components.MuiTextField.styleOverrides.root.& textarea.WebkitAppearance

> **WebkitAppearance**: `string` = `'none'`

### getMobileInputTheme()

> **getMobileInputTheme**: () => `SxProps`\<`Theme`\>

Mobile-optimized input styling that prevents iOS zoom
and improves touch interaction

#### Returns

`SxProps`\<`Theme`\>

### getMobileModalTheme()

> **getMobileModalTheme**: () => `SxProps`\<`Theme`\>

Mobile-optimized modal/dialog styling

#### Returns

`SxProps`\<`Theme`\>

### getMobileTypographyTheme()

> **getMobileTypographyTheme**: () => `object`

Responsive typography that prevents zoom issues

#### Returns

`object`

##### typography

> **typography**: `object`

###### typography.body1

> **body1**: `object`

###### typography.body1.fontSize

> **fontSize**: `string` = `'16px'`

###### typography.body1.lineHeight

> **lineHeight**: `number` = `1.5`

###### typography.body2

> **body2**: `object`

###### typography.body2.fontSize

> **fontSize**: `string` = `'16px'`

###### typography.body2.lineHeight

> **lineHeight**: `number` = `1.4`

###### typography.caption

> **caption**: `object`

###### typography.caption.fontSize

> **fontSize**: `string` = `'14px'`

###### typography.h6

> **h6**: `object`

###### typography.h6.fontSize

> **fontSize**: `string` = `'18px'`

###### typography.h6.fontWeight

> **fontWeight**: `number` = `600`

### shouldUseMobileTheme()

> **shouldUseMobileTheme**: () => `boolean`

Helper to check if device needs mobile optimizations

#### Returns

`boolean`
