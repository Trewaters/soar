[**soar**](../../../../README.md)

***

[soar](../../../../modules.md) / [app/context/SequenceContext](../README.md) / useSequenceEditor

# Function: useSequenceEditor()

> **useSequenceEditor**(): `object`

Defined in: app/context/SequenceContext.tsx:171

## Returns

`object`

### addSeries()

> **addSeries**: (`series`) => `void`

#### Parameters

##### series

[`FlowSeriesSequence`](../../AsanaSeriesContext/interfaces/FlowSeriesSequence.md)[]

#### Returns

`void`

### removeSeriesAt()

> **removeSeriesAt**: (`index`) => `void`

#### Parameters

##### index

`number`

#### Returns

`void`

### reorderSeries()

> **reorderSeries**: (`from`, `to`) => `void`

#### Parameters

##### from

`number`

##### to

`number`

#### Returns

`void`

### sequence

> **sequence**: [`SequenceData`](../interfaces/SequenceData.md) = `state.sequences`

### setSequence()

> **setSequence**: (`payload`) => `void`

#### Parameters

##### payload

[`SequenceData`](../interfaces/SequenceData.md)

#### Returns

`void`

### updateField()

> **updateField**: (`key`, `value`) => `void`

#### Parameters

##### key

keyof [`SequenceData`](../interfaces/SequenceData.md)

##### value

`any`

#### Returns

`void`
