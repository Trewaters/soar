[**soar**](../../../README.md)

***

[soar](../../../modules.md) / [types/asana](../README.md) / ASANA\_VALIDATION\_RULES

# Variable: ASANA\_VALIDATION\_RULES

> `const` **ASANA\_VALIDATION\_RULES**: `object`

Defined in: types/asana.ts:307

## Type Declaration

### benefits

> `readonly` **benefits**: `object`

#### benefits.maxLength

> `readonly` **maxLength**: `1000` = `1000`

### category

> `readonly` **category**: `object`

#### category.enum

> `readonly` **enum**: readonly \[`"standing"`, `"seated"`, `"prone"`, `"supine"`, `"backbend"`, `"forward_fold"`, `"twist"`, `"inversion"`, `"arm_balance"`, `"hip_opener"`, `"core"`, `"restorative"`, `"pranayama"`\] = `ASANA_CATEGORIES`

#### category.required

> `readonly` **required**: `true` = `true`

### description

> `readonly` **description**: `object`

#### description.maxLength

> `readonly` **maxLength**: `2000` = `2000`

### difficulty

> `readonly` **difficulty**: `object`

#### difficulty.enum

> `readonly` **enum**: readonly \[`"beginner"`, `"intermediate"`, `"advanced"`, `"expert"`\] = `ASANA_DIFFICULTIES`

#### difficulty.required

> `readonly` **required**: `true` = `true`

### english\_names

> `readonly` **english\_names**: `object`

#### english\_names.maxLength

> `readonly` **maxLength**: `5` = `5`

#### english\_names.minLength

> `readonly` **minLength**: `1` = `1`

#### english\_names.required

> `readonly` **required**: `true` = `true`

### sort\_english\_name

> `readonly` **sort\_english\_name**: `object`

#### sort\_english\_name.maxLength

> `readonly` **maxLength**: `100` = `100`

#### sort\_english\_name.minLength

> `readonly` **minLength**: `2` = `2`

#### sort\_english\_name.required

> `readonly` **required**: `true` = `true`
