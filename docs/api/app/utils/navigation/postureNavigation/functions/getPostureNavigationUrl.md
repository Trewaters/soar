[**soar**](../../../../../README.md)

***

[soar](../../../../../modules.md) / [app/utils/navigation/postureNavigation](../README.md) / getPostureNavigationUrl

# Function: getPostureNavigationUrl()

> **getPostureNavigationUrl**(`postureReference`): `Promise`\<`string`\>

Defined in: app/utils/navigation/postureNavigation.ts:8

Convert a posture reference from series data to a navigation URL
Series data stores postures as "PoseName;Description" format
This function extracts the name and converts it to an ObjectId-based URL

## Parameters

### postureReference

`string`

## Returns

`Promise`\<`string`\>
