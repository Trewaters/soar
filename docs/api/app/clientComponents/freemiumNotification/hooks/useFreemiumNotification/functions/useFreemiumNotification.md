[**soar**](../../../../../../README.md)

***

[soar](../../../../../../modules.md) / [app/clientComponents/freemiumNotification/hooks/useFreemiumNotification](../README.md) / useFreemiumNotification

# Function: useFreemiumNotification()

> **useFreemiumNotification**(): `object`

Defined in: app/clientComponents/freemiumNotification/hooks/useFreemiumNotification.ts:16

Custom hook for managing freemium notifications
Integrates with NextAuth.js session management and navigation

## Returns

`object`

### checkFeatureAccess()

> **checkFeatureAccess**: (`featureType`) => [`FeatureAccessResult`](../../../types/interfaces/FeatureAccessResult.md)

#### Parameters

##### featureType

[`FreemiumFeatureType`](../../../types/type-aliases/FreemiumFeatureType.md)

#### Returns

[`FeatureAccessResult`](../../../types/interfaces/FeatureAccessResult.md)

### getNotificationContent()

> **getNotificationContent**: (`featureType`) => [`NotificationContent`](../../../types/interfaces/NotificationContent.md)

#### Parameters

##### featureType

[`FreemiumFeatureType`](../../../types/type-aliases/FreemiumFeatureType.md)

#### Returns

[`NotificationContent`](../../../types/interfaces/NotificationContent.md)

### handleCtaAction()

> **handleCtaAction**: (`featureType`, `returnUrl?`) => `void`

#### Parameters

##### featureType

[`FreemiumFeatureType`](../../../types/type-aliases/FreemiumFeatureType.md)

##### returnUrl?

`string`

#### Returns

`void`

### handleLoginRedirect()

> **handleLoginRedirect**: (`returnUrl?`) => `void`

#### Parameters

##### returnUrl?

`string`

#### Returns

`void`

### handleUpgradeRedirect()

> **handleUpgradeRedirect**: () => `void`

#### Returns

`void`

### isLoading

> **isLoading**: `boolean`

### sessionStatus

> **sessionStatus**: `"loading"` \| `"authenticated"` \| `"unauthenticated"` = `status`

### userAuthState

> **userAuthState**: [`UserAuthState`](../../../types/type-aliases/UserAuthState.md)
