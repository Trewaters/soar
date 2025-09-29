/**
 * Client
 **/

import * as runtime from './runtime/library.js'
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>

/**
 * Model UserData
 *
 */
export type UserData = $Result.DefaultSelection<Prisma.$UserDataPayload>
/**
 * Model Reminder
 *
 */
export type Reminder = $Result.DefaultSelection<Prisma.$ReminderPayload>
/**
 * Model PushSubscription
 *
 */
export type PushSubscription =
  $Result.DefaultSelection<Prisma.$PushSubscriptionPayload>
/**
 * Model ProviderAccount
 *
 */
export type ProviderAccount =
  $Result.DefaultSelection<Prisma.$ProviderAccountPayload>
/**
 * Model AsanaPosture
 * Represents a yoga Asana in the app.
 */
export type AsanaPosture = $Result.DefaultSelection<Prisma.$AsanaPosturePayload>
/**
 * Model AsanaSeries
 *
 */
export type AsanaSeries = $Result.DefaultSelection<Prisma.$AsanaSeriesPayload>
/**
 * Model AsanaSequence
 *
 */
export type AsanaSequence =
  $Result.DefaultSelection<Prisma.$AsanaSequencePayload>
/**
 * Model AsanaActivity
 * Records a user's daily asana activity.
 */
export type AsanaActivity =
  $Result.DefaultSelection<Prisma.$AsanaActivityPayload>
/**
 * Model SeriesActivity
 * Records a user's series practice activity.
 */
export type SeriesActivity =
  $Result.DefaultSelection<Prisma.$SeriesActivityPayload>
/**
 * Model SequenceActivity
 * Records a user's sequence practice activity.
 */
export type SequenceActivity =
  $Result.DefaultSelection<Prisma.$SequenceActivityPayload>
/**
 * Model UserLogin
 * Records user login events for activity streak calculation.
 */
export type UserLogin = $Result.DefaultSelection<Prisma.$UserLoginPayload>
/**
 * Model PoseImage
 * Records user-uploaded images of yoga poses.
 */
export type PoseImage = $Result.DefaultSelection<Prisma.$PoseImagePayload>
/**
 * Model GlossaryTerm
 *
 */
export type GlossaryTerm = $Result.DefaultSelection<Prisma.$GlossaryTermPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const StorageType: {
    CLOUD: 'CLOUD'
    LOCAL: 'LOCAL'
    HYBRID: 'HYBRID'
  }

  export type StorageType = (typeof StorageType)[keyof typeof StorageType]

  export const GlossarySource: {
    DEFAULT: 'DEFAULT'
    ALPHA_USER: 'ALPHA_USER'
    USER: 'USER'
  }

  export type GlossarySource =
    (typeof GlossarySource)[keyof typeof GlossarySource]
}

export type StorageType = $Enums.StorageType

export const StorageType: typeof $Enums.StorageType

export type GlossarySource = $Enums.GlossarySource

export const GlossarySource: typeof $Enums.GlossarySource

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more UserData
 * const userData = await prisma.userData.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions
    ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more UserData
   * const userData = await prisma.userData.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(
    optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>
  )
  $on<V extends U>(
    eventType: V,
    callback: (
      event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent
    ) => void
  ): void

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P]
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(
    fn: (
      prisma: Omit<PrismaClient, runtime.ITXClientDenyList>
    ) => $Utils.JsPromise<R>,
    options?: { maxWait?: number; timeout?: number }
  ): $Utils.JsPromise<R>

  /**
   * Executes a raw MongoDB command and returns the result of it.
   * @example
   * ```
   * const user = await prisma.$runCommandRaw({
   *   aggregate: 'User',
   *   pipeline: [{ $match: { name: 'Bob' } }, { $project: { email: true, _id: false } }],
   *   explain: false,
   * })
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $runCommandRaw(
    command: Prisma.InputJsonObject
  ): Prisma.PrismaPromise<Prisma.JsonObject>

  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

  /**
   * `prisma.userData`: Exposes CRUD operations for the **UserData** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more UserData
   * const userData = await prisma.userData.findMany()
   * ```
   */
  get userData(): Prisma.UserDataDelegate<ExtArgs>

  /**
   * `prisma.reminder`: Exposes CRUD operations for the **Reminder** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Reminders
   * const reminders = await prisma.reminder.findMany()
   * ```
   */
  get reminder(): Prisma.ReminderDelegate<ExtArgs>

  /**
   * `prisma.pushSubscription`: Exposes CRUD operations for the **PushSubscription** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more PushSubscriptions
   * const pushSubscriptions = await prisma.pushSubscription.findMany()
   * ```
   */
  get pushSubscription(): Prisma.PushSubscriptionDelegate<ExtArgs>

  /**
   * `prisma.providerAccount`: Exposes CRUD operations for the **ProviderAccount** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ProviderAccounts
   * const providerAccounts = await prisma.providerAccount.findMany()
   * ```
   */
  get providerAccount(): Prisma.ProviderAccountDelegate<ExtArgs>

  /**
   * `prisma.asanaPosture`: Exposes CRUD operations for the **AsanaPosture** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AsanaPostures
   * const asanaPostures = await prisma.asanaPosture.findMany()
   * ```
   */
  get asanaPosture(): Prisma.AsanaPostureDelegate<ExtArgs>

  /**
   * `prisma.asanaSeries`: Exposes CRUD operations for the **AsanaSeries** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AsanaSeries
   * const asanaSeries = await prisma.asanaSeries.findMany()
   * ```
   */
  get asanaSeries(): Prisma.AsanaSeriesDelegate<ExtArgs>

  /**
   * `prisma.asanaSequence`: Exposes CRUD operations for the **AsanaSequence** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AsanaSequences
   * const asanaSequences = await prisma.asanaSequence.findMany()
   * ```
   */
  get asanaSequence(): Prisma.AsanaSequenceDelegate<ExtArgs>

  /**
   * `prisma.asanaActivity`: Exposes CRUD operations for the **AsanaActivity** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AsanaActivities
   * const asanaActivities = await prisma.asanaActivity.findMany()
   * ```
   */
  get asanaActivity(): Prisma.AsanaActivityDelegate<ExtArgs>

  /**
   * `prisma.seriesActivity`: Exposes CRUD operations for the **SeriesActivity** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more SeriesActivities
   * const seriesActivities = await prisma.seriesActivity.findMany()
   * ```
   */
  get seriesActivity(): Prisma.SeriesActivityDelegate<ExtArgs>

  /**
   * `prisma.sequenceActivity`: Exposes CRUD operations for the **SequenceActivity** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more SequenceActivities
   * const sequenceActivities = await prisma.sequenceActivity.findMany()
   * ```
   */
  get sequenceActivity(): Prisma.SequenceActivityDelegate<ExtArgs>

  /**
   * `prisma.userLogin`: Exposes CRUD operations for the **UserLogin** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more UserLogins
   * const userLogins = await prisma.userLogin.findMany()
   * ```
   */
  get userLogin(): Prisma.UserLoginDelegate<ExtArgs>

  /**
   * `prisma.poseImage`: Exposes CRUD operations for the **PoseImage** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more PoseImages
   * const poseImages = await prisma.poseImage.findMany()
   * ```
   */
  get poseImage(): Prisma.PoseImageDelegate<ExtArgs>

  /**
   * `prisma.glossaryTerm`: Exposes CRUD operations for the **GlossaryTerm** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more GlossaryTerms
   * const glossaryTerms = await prisma.glossaryTerm.findMany()
   * ```
   */
  get glossaryTerm(): Prisma.GlossaryTermDelegate<ExtArgs>
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.16.1
   * Query Engine version: 34ace0eb2704183d2c05b60b52fba5c43c13f303
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from.
   */
  export type JsonObject = { [Key in string]?: JsonValue }

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue =
    | string
    | number
    | boolean
    | JsonObject
    | JsonArray
    | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {
    readonly [Key in string]?: InputJsonValue | null
  }

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray
    extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue =
    | string
    | number
    | boolean
    | InputJsonObject
    | InputJsonArray
    | { toJSON(): unknown }

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> =
    T extends PromiseLike<infer U> ? U : T

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<
    T extends (...args: any) => $Utils.JsPromise<any>,
  > = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P]
  }

  export type Enumerable<T> = T | Array<T>

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  }

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } & K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object
      ? (Without<T, U> & U) | (Without<U, T> & T)
      : U
    : T

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends BigInt
            ? False
            : T extends object
              ? True
              : False

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K]
  } & {}

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>
      }
    >
  >

  type Key = string | number | symbol
  type AtBasic<O extends object, K extends Key> = K extends keyof O
    ? O[K]
    : never
  type AtStrict<O extends object, K extends Key> = O[K & keyof O]
  type AtLoose<O extends object, K extends Key> = O extends unknown
    ? AtStrict<O, K>
    : never
  export type At<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = {
    1: AtStrict<O, K>
    0: AtLoose<O, K>
  }[strict]

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K]
      } & {}

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K]
  } & {}

  type _Record<K extends keyof any, T> = {
    [P in K]: T
  }

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ?
          | (K extends keyof O ? { [P in K]: O[P] } & O : O)
          | ({ [P in keyof O as P extends K ? K : never]-?: O[P] } & O)
      : never
  >

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B

  export const type: unique symbol

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never
      }
    : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>,
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<
            UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never
          >
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<
    T,
    K extends Enumerable<keyof T> | keyof T,
  > = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}`
    ? never
    : T

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>

  export const ModelName: {
    UserData: 'UserData'
    Reminder: 'Reminder'
    PushSubscription: 'PushSubscription'
    ProviderAccount: 'ProviderAccount'
    AsanaPosture: 'AsanaPosture'
    AsanaSeries: 'AsanaSeries'
    AsanaSequence: 'AsanaSequence'
    AsanaActivity: 'AsanaActivity'
    SeriesActivity: 'SeriesActivity'
    SequenceActivity: 'SequenceActivity'
    UserLogin: 'UserLogin'
    PoseImage: 'PoseImage'
    GlossaryTerm: 'GlossaryTerm'
  }

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]

  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb
    extends $Utils.Fn<
      { extArgs: $Extensions.InternalArgs; clientOptions: PrismaClientOptions },
      $Utils.Record<string, any>
    > {
    returns: Prisma.TypeMap<
      this['params']['extArgs'],
      this['params']['clientOptions']
    >
  }

  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    ClientOptions = {},
  > = {
    meta: {
      modelProps:
        | 'userData'
        | 'reminder'
        | 'pushSubscription'
        | 'providerAccount'
        | 'asanaPosture'
        | 'asanaSeries'
        | 'asanaSequence'
        | 'asanaActivity'
        | 'seriesActivity'
        | 'sequenceActivity'
        | 'userLogin'
        | 'poseImage'
        | 'glossaryTerm'
      txIsolationLevel: never
    }
    model: {
      UserData: {
        payload: Prisma.$UserDataPayload<ExtArgs>
        fields: Prisma.UserDataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserDataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserDataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserDataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserDataPayload>
          }
          findFirst: {
            args: Prisma.UserDataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserDataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserDataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserDataPayload>
          }
          findMany: {
            args: Prisma.UserDataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserDataPayload>[]
          }
          create: {
            args: Prisma.UserDataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserDataPayload>
          }
          createMany: {
            args: Prisma.UserDataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserDataPayload>
          }
          update: {
            args: Prisma.UserDataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserDataPayload>
          }
          deleteMany: {
            args: Prisma.UserDataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserDataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserDataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserDataPayload>
          }
          aggregate: {
            args: Prisma.UserDataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserData>
          }
          groupBy: {
            args: Prisma.UserDataGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserDataGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.UserDataFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.UserDataAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.UserDataCountArgs<ExtArgs>
            result: $Utils.Optional<UserDataCountAggregateOutputType> | number
          }
        }
      }
      Reminder: {
        payload: Prisma.$ReminderPayload<ExtArgs>
        fields: Prisma.ReminderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReminderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReminderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>
          }
          findFirst: {
            args: Prisma.ReminderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReminderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>
          }
          findMany: {
            args: Prisma.ReminderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>[]
          }
          create: {
            args: Prisma.ReminderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>
          }
          createMany: {
            args: Prisma.ReminderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ReminderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>
          }
          update: {
            args: Prisma.ReminderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>
          }
          deleteMany: {
            args: Prisma.ReminderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReminderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReminderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>
          }
          aggregate: {
            args: Prisma.ReminderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReminder>
          }
          groupBy: {
            args: Prisma.ReminderGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReminderGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.ReminderFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.ReminderAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.ReminderCountArgs<ExtArgs>
            result: $Utils.Optional<ReminderCountAggregateOutputType> | number
          }
        }
      }
      PushSubscription: {
        payload: Prisma.$PushSubscriptionPayload<ExtArgs>
        fields: Prisma.PushSubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PushSubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PushSubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>
          }
          findFirst: {
            args: Prisma.PushSubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PushSubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>
          }
          findMany: {
            args: Prisma.PushSubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>[]
          }
          create: {
            args: Prisma.PushSubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>
          }
          createMany: {
            args: Prisma.PushSubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PushSubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>
          }
          update: {
            args: Prisma.PushSubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.PushSubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PushSubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PushSubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>
          }
          aggregate: {
            args: Prisma.PushSubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePushSubscription>
          }
          groupBy: {
            args: Prisma.PushSubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PushSubscriptionGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PushSubscriptionFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PushSubscriptionAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PushSubscriptionCountArgs<ExtArgs>
            result:
              | $Utils.Optional<PushSubscriptionCountAggregateOutputType>
              | number
          }
        }
      }
      ProviderAccount: {
        payload: Prisma.$ProviderAccountPayload<ExtArgs>
        fields: Prisma.ProviderAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProviderAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProviderAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderAccountPayload>
          }
          findFirst: {
            args: Prisma.ProviderAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProviderAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderAccountPayload>
          }
          findMany: {
            args: Prisma.ProviderAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderAccountPayload>[]
          }
          create: {
            args: Prisma.ProviderAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderAccountPayload>
          }
          createMany: {
            args: Prisma.ProviderAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProviderAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderAccountPayload>
          }
          update: {
            args: Prisma.ProviderAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderAccountPayload>
          }
          deleteMany: {
            args: Prisma.ProviderAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProviderAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProviderAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderAccountPayload>
          }
          aggregate: {
            args: Prisma.ProviderAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProviderAccount>
          }
          groupBy: {
            args: Prisma.ProviderAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProviderAccountGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.ProviderAccountFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.ProviderAccountAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.ProviderAccountCountArgs<ExtArgs>
            result:
              | $Utils.Optional<ProviderAccountCountAggregateOutputType>
              | number
          }
        }
      }
      AsanaPosture: {
        payload: Prisma.$AsanaPosturePayload<ExtArgs>
        fields: Prisma.AsanaPostureFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AsanaPostureFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaPosturePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AsanaPostureFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaPosturePayload>
          }
          findFirst: {
            args: Prisma.AsanaPostureFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaPosturePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AsanaPostureFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaPosturePayload>
          }
          findMany: {
            args: Prisma.AsanaPostureFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaPosturePayload>[]
          }
          create: {
            args: Prisma.AsanaPostureCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaPosturePayload>
          }
          createMany: {
            args: Prisma.AsanaPostureCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AsanaPostureDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaPosturePayload>
          }
          update: {
            args: Prisma.AsanaPostureUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaPosturePayload>
          }
          deleteMany: {
            args: Prisma.AsanaPostureDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AsanaPostureUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AsanaPostureUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaPosturePayload>
          }
          aggregate: {
            args: Prisma.AsanaPostureAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAsanaPosture>
          }
          groupBy: {
            args: Prisma.AsanaPostureGroupByArgs<ExtArgs>
            result: $Utils.Optional<AsanaPostureGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.AsanaPostureFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.AsanaPostureAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.AsanaPostureCountArgs<ExtArgs>
            result:
              | $Utils.Optional<AsanaPostureCountAggregateOutputType>
              | number
          }
        }
      }
      AsanaSeries: {
        payload: Prisma.$AsanaSeriesPayload<ExtArgs>
        fields: Prisma.AsanaSeriesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AsanaSeriesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaSeriesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AsanaSeriesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaSeriesPayload>
          }
          findFirst: {
            args: Prisma.AsanaSeriesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaSeriesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AsanaSeriesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaSeriesPayload>
          }
          findMany: {
            args: Prisma.AsanaSeriesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaSeriesPayload>[]
          }
          create: {
            args: Prisma.AsanaSeriesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaSeriesPayload>
          }
          createMany: {
            args: Prisma.AsanaSeriesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AsanaSeriesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaSeriesPayload>
          }
          update: {
            args: Prisma.AsanaSeriesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaSeriesPayload>
          }
          deleteMany: {
            args: Prisma.AsanaSeriesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AsanaSeriesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AsanaSeriesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaSeriesPayload>
          }
          aggregate: {
            args: Prisma.AsanaSeriesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAsanaSeries>
          }
          groupBy: {
            args: Prisma.AsanaSeriesGroupByArgs<ExtArgs>
            result: $Utils.Optional<AsanaSeriesGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.AsanaSeriesFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.AsanaSeriesAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.AsanaSeriesCountArgs<ExtArgs>
            result:
              | $Utils.Optional<AsanaSeriesCountAggregateOutputType>
              | number
          }
        }
      }
      AsanaSequence: {
        payload: Prisma.$AsanaSequencePayload<ExtArgs>
        fields: Prisma.AsanaSequenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AsanaSequenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaSequencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AsanaSequenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaSequencePayload>
          }
          findFirst: {
            args: Prisma.AsanaSequenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaSequencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AsanaSequenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaSequencePayload>
          }
          findMany: {
            args: Prisma.AsanaSequenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaSequencePayload>[]
          }
          create: {
            args: Prisma.AsanaSequenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaSequencePayload>
          }
          createMany: {
            args: Prisma.AsanaSequenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AsanaSequenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaSequencePayload>
          }
          update: {
            args: Prisma.AsanaSequenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaSequencePayload>
          }
          deleteMany: {
            args: Prisma.AsanaSequenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AsanaSequenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AsanaSequenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaSequencePayload>
          }
          aggregate: {
            args: Prisma.AsanaSequenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAsanaSequence>
          }
          groupBy: {
            args: Prisma.AsanaSequenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<AsanaSequenceGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.AsanaSequenceFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.AsanaSequenceAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.AsanaSequenceCountArgs<ExtArgs>
            result:
              | $Utils.Optional<AsanaSequenceCountAggregateOutputType>
              | number
          }
        }
      }
      AsanaActivity: {
        payload: Prisma.$AsanaActivityPayload<ExtArgs>
        fields: Prisma.AsanaActivityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AsanaActivityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaActivityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AsanaActivityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaActivityPayload>
          }
          findFirst: {
            args: Prisma.AsanaActivityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaActivityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AsanaActivityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaActivityPayload>
          }
          findMany: {
            args: Prisma.AsanaActivityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaActivityPayload>[]
          }
          create: {
            args: Prisma.AsanaActivityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaActivityPayload>
          }
          createMany: {
            args: Prisma.AsanaActivityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AsanaActivityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaActivityPayload>
          }
          update: {
            args: Prisma.AsanaActivityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaActivityPayload>
          }
          deleteMany: {
            args: Prisma.AsanaActivityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AsanaActivityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AsanaActivityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsanaActivityPayload>
          }
          aggregate: {
            args: Prisma.AsanaActivityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAsanaActivity>
          }
          groupBy: {
            args: Prisma.AsanaActivityGroupByArgs<ExtArgs>
            result: $Utils.Optional<AsanaActivityGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.AsanaActivityFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.AsanaActivityAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.AsanaActivityCountArgs<ExtArgs>
            result:
              | $Utils.Optional<AsanaActivityCountAggregateOutputType>
              | number
          }
        }
      }
      SeriesActivity: {
        payload: Prisma.$SeriesActivityPayload<ExtArgs>
        fields: Prisma.SeriesActivityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SeriesActivityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesActivityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SeriesActivityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesActivityPayload>
          }
          findFirst: {
            args: Prisma.SeriesActivityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesActivityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SeriesActivityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesActivityPayload>
          }
          findMany: {
            args: Prisma.SeriesActivityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesActivityPayload>[]
          }
          create: {
            args: Prisma.SeriesActivityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesActivityPayload>
          }
          createMany: {
            args: Prisma.SeriesActivityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SeriesActivityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesActivityPayload>
          }
          update: {
            args: Prisma.SeriesActivityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesActivityPayload>
          }
          deleteMany: {
            args: Prisma.SeriesActivityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SeriesActivityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SeriesActivityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesActivityPayload>
          }
          aggregate: {
            args: Prisma.SeriesActivityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSeriesActivity>
          }
          groupBy: {
            args: Prisma.SeriesActivityGroupByArgs<ExtArgs>
            result: $Utils.Optional<SeriesActivityGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.SeriesActivityFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.SeriesActivityAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.SeriesActivityCountArgs<ExtArgs>
            result:
              | $Utils.Optional<SeriesActivityCountAggregateOutputType>
              | number
          }
        }
      }
      SequenceActivity: {
        payload: Prisma.$SequenceActivityPayload<ExtArgs>
        fields: Prisma.SequenceActivityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SequenceActivityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequenceActivityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SequenceActivityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequenceActivityPayload>
          }
          findFirst: {
            args: Prisma.SequenceActivityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequenceActivityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SequenceActivityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequenceActivityPayload>
          }
          findMany: {
            args: Prisma.SequenceActivityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequenceActivityPayload>[]
          }
          create: {
            args: Prisma.SequenceActivityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequenceActivityPayload>
          }
          createMany: {
            args: Prisma.SequenceActivityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SequenceActivityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequenceActivityPayload>
          }
          update: {
            args: Prisma.SequenceActivityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequenceActivityPayload>
          }
          deleteMany: {
            args: Prisma.SequenceActivityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SequenceActivityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SequenceActivityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequenceActivityPayload>
          }
          aggregate: {
            args: Prisma.SequenceActivityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSequenceActivity>
          }
          groupBy: {
            args: Prisma.SequenceActivityGroupByArgs<ExtArgs>
            result: $Utils.Optional<SequenceActivityGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.SequenceActivityFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.SequenceActivityAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.SequenceActivityCountArgs<ExtArgs>
            result:
              | $Utils.Optional<SequenceActivityCountAggregateOutputType>
              | number
          }
        }
      }
      UserLogin: {
        payload: Prisma.$UserLoginPayload<ExtArgs>
        fields: Prisma.UserLoginFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserLoginFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLoginPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserLoginFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLoginPayload>
          }
          findFirst: {
            args: Prisma.UserLoginFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLoginPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserLoginFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLoginPayload>
          }
          findMany: {
            args: Prisma.UserLoginFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLoginPayload>[]
          }
          create: {
            args: Prisma.UserLoginCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLoginPayload>
          }
          createMany: {
            args: Prisma.UserLoginCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserLoginDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLoginPayload>
          }
          update: {
            args: Prisma.UserLoginUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLoginPayload>
          }
          deleteMany: {
            args: Prisma.UserLoginDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserLoginUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserLoginUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLoginPayload>
          }
          aggregate: {
            args: Prisma.UserLoginAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserLogin>
          }
          groupBy: {
            args: Prisma.UserLoginGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserLoginGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.UserLoginFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.UserLoginAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.UserLoginCountArgs<ExtArgs>
            result: $Utils.Optional<UserLoginCountAggregateOutputType> | number
          }
        }
      }
      PoseImage: {
        payload: Prisma.$PoseImagePayload<ExtArgs>
        fields: Prisma.PoseImageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PoseImageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PoseImagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PoseImageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PoseImagePayload>
          }
          findFirst: {
            args: Prisma.PoseImageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PoseImagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PoseImageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PoseImagePayload>
          }
          findMany: {
            args: Prisma.PoseImageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PoseImagePayload>[]
          }
          create: {
            args: Prisma.PoseImageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PoseImagePayload>
          }
          createMany: {
            args: Prisma.PoseImageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PoseImageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PoseImagePayload>
          }
          update: {
            args: Prisma.PoseImageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PoseImagePayload>
          }
          deleteMany: {
            args: Prisma.PoseImageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PoseImageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PoseImageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PoseImagePayload>
          }
          aggregate: {
            args: Prisma.PoseImageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePoseImage>
          }
          groupBy: {
            args: Prisma.PoseImageGroupByArgs<ExtArgs>
            result: $Utils.Optional<PoseImageGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PoseImageFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PoseImageAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PoseImageCountArgs<ExtArgs>
            result: $Utils.Optional<PoseImageCountAggregateOutputType> | number
          }
        }
      }
      GlossaryTerm: {
        payload: Prisma.$GlossaryTermPayload<ExtArgs>
        fields: Prisma.GlossaryTermFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GlossaryTermFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlossaryTermPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GlossaryTermFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlossaryTermPayload>
          }
          findFirst: {
            args: Prisma.GlossaryTermFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlossaryTermPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GlossaryTermFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlossaryTermPayload>
          }
          findMany: {
            args: Prisma.GlossaryTermFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlossaryTermPayload>[]
          }
          create: {
            args: Prisma.GlossaryTermCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlossaryTermPayload>
          }
          createMany: {
            args: Prisma.GlossaryTermCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.GlossaryTermDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlossaryTermPayload>
          }
          update: {
            args: Prisma.GlossaryTermUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlossaryTermPayload>
          }
          deleteMany: {
            args: Prisma.GlossaryTermDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GlossaryTermUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GlossaryTermUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlossaryTermPayload>
          }
          aggregate: {
            args: Prisma.GlossaryTermAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGlossaryTerm>
          }
          groupBy: {
            args: Prisma.GlossaryTermGroupByArgs<ExtArgs>
            result: $Utils.Optional<GlossaryTermGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.GlossaryTermFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.GlossaryTermAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.GlossaryTermCountArgs<ExtArgs>
            result:
              | $Utils.Optional<GlossaryTermCountAggregateOutputType>
              | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $runCommandRaw: {
          args: Prisma.InputJsonObject
          result: Prisma.JsonObject
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<
    'define',
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
    }
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> =
    T extends LogDefinition
      ? T['emit'] extends 'event'
        ? T['level']
        : never
      : never
  export type GetEvents<T extends any> =
    T extends Array<LogLevel | LogDefinition>
      ?
          | GetLogType<T[0]>
          | GetLogType<T[1]>
          | GetLogType<T[2]>
          | GetLogType<T[3]>
      : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */

  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(
    log: Array<LogLevel | LogDefinition>
  ): LogLevel | undefined

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<
    Prisma.DefaultPrismaClient,
    runtime.ITXClientDenyList
  >

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */

  /**
   * Count Type UserDataCountOutputType
   */

  export type UserDataCountOutputType = {
    providerAccounts: number
    asanaActivities: number
    seriesActivities: number
    sequenceActivities: number
    userLogins: number
    poseImages: number
    glossaryTerms: number
    reminders: number
    pushSubscriptions: number
  }

  export type UserDataCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    providerAccounts?:
      | boolean
      | UserDataCountOutputTypeCountProviderAccountsArgs
    asanaActivities?: boolean | UserDataCountOutputTypeCountAsanaActivitiesArgs
    seriesActivities?:
      | boolean
      | UserDataCountOutputTypeCountSeriesActivitiesArgs
    sequenceActivities?:
      | boolean
      | UserDataCountOutputTypeCountSequenceActivitiesArgs
    userLogins?: boolean | UserDataCountOutputTypeCountUserLoginsArgs
    poseImages?: boolean | UserDataCountOutputTypeCountPoseImagesArgs
    glossaryTerms?: boolean | UserDataCountOutputTypeCountGlossaryTermsArgs
    reminders?: boolean | UserDataCountOutputTypeCountRemindersArgs
    pushSubscriptions?:
      | boolean
      | UserDataCountOutputTypeCountPushSubscriptionsArgs
  }

  // Custom InputTypes
  /**
   * UserDataCountOutputType without action
   */
  export type UserDataCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserDataCountOutputType
     */
    select?: UserDataCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserDataCountOutputType without action
   */
  export type UserDataCountOutputTypeCountProviderAccountsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProviderAccountWhereInput
  }

  /**
   * UserDataCountOutputType without action
   */
  export type UserDataCountOutputTypeCountAsanaActivitiesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AsanaActivityWhereInput
  }

  /**
   * UserDataCountOutputType without action
   */
  export type UserDataCountOutputTypeCountSeriesActivitiesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: SeriesActivityWhereInput
  }

  /**
   * UserDataCountOutputType without action
   */
  export type UserDataCountOutputTypeCountSequenceActivitiesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: SequenceActivityWhereInput
  }

  /**
   * UserDataCountOutputType without action
   */
  export type UserDataCountOutputTypeCountUserLoginsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: UserLoginWhereInput
  }

  /**
   * UserDataCountOutputType without action
   */
  export type UserDataCountOutputTypeCountPoseImagesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PoseImageWhereInput
  }

  /**
   * UserDataCountOutputType without action
   */
  export type UserDataCountOutputTypeCountGlossaryTermsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: GlossaryTermWhereInput
  }

  /**
   * UserDataCountOutputType without action
   */
  export type UserDataCountOutputTypeCountRemindersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ReminderWhereInput
  }

  /**
   * UserDataCountOutputType without action
   */
  export type UserDataCountOutputTypeCountPushSubscriptionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PushSubscriptionWhereInput
  }

  /**
   * Count Type AsanaPostureCountOutputType
   */

  export type AsanaPostureCountOutputType = {
    asanaActivities: number
    poseImages: number
  }

  export type AsanaPostureCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    asanaActivities?:
      | boolean
      | AsanaPostureCountOutputTypeCountAsanaActivitiesArgs
    poseImages?: boolean | AsanaPostureCountOutputTypeCountPoseImagesArgs
  }

  // Custom InputTypes
  /**
   * AsanaPostureCountOutputType without action
   */
  export type AsanaPostureCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaPostureCountOutputType
     */
    select?: AsanaPostureCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AsanaPostureCountOutputType without action
   */
  export type AsanaPostureCountOutputTypeCountAsanaActivitiesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AsanaActivityWhereInput
  }

  /**
   * AsanaPostureCountOutputType without action
   */
  export type AsanaPostureCountOutputTypeCountPoseImagesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PoseImageWhereInput
  }

  /**
   * Models
   */

  /**
   * Model UserData
   */

  export type AggregateUserData = {
    _count: UserDataCountAggregateOutputType | null
    _min: UserDataMinAggregateOutputType | null
    _max: UserDataMaxAggregateOutputType | null
  }

  export type UserDataMinAggregateOutputType = {
    id: string | null
    provider_id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    pronouns: string | null
    createdAt: Date | null
    updatedAt: Date | null
    firstName: string | null
    lastName: string | null
    bio: string | null
    headline: string | null
    location: string | null
    websiteURL: string | null
    shareQuick: string | null
    yogaStyle: string | null
    yogaExperience: string | null
    company: string | null
    socialURL: string | null
    isLocationPublic: string | null
    role: string | null
    activeProfileImage: string | null
    tz: string | null
  }

  export type UserDataMaxAggregateOutputType = {
    id: string | null
    provider_id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    pronouns: string | null
    createdAt: Date | null
    updatedAt: Date | null
    firstName: string | null
    lastName: string | null
    bio: string | null
    headline: string | null
    location: string | null
    websiteURL: string | null
    shareQuick: string | null
    yogaStyle: string | null
    yogaExperience: string | null
    company: string | null
    socialURL: string | null
    isLocationPublic: string | null
    role: string | null
    activeProfileImage: string | null
    tz: string | null
  }

  export type UserDataCountAggregateOutputType = {
    id: number
    provider_id: number
    name: number
    email: number
    emailVerified: number
    image: number
    pronouns: number
    profile: number
    createdAt: number
    updatedAt: number
    firstName: number
    lastName: number
    bio: number
    headline: number
    location: number
    websiteURL: number
    shareQuick: number
    yogaStyle: number
    yogaExperience: number
    company: number
    socialURL: number
    isLocationPublic: number
    role: number
    profileImages: number
    activeProfileImage: number
    tz: number
    _all: number
  }

  export type UserDataMinAggregateInputType = {
    id?: true
    provider_id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    pronouns?: true
    createdAt?: true
    updatedAt?: true
    firstName?: true
    lastName?: true
    bio?: true
    headline?: true
    location?: true
    websiteURL?: true
    shareQuick?: true
    yogaStyle?: true
    yogaExperience?: true
    company?: true
    socialURL?: true
    isLocationPublic?: true
    role?: true
    activeProfileImage?: true
    tz?: true
  }

  export type UserDataMaxAggregateInputType = {
    id?: true
    provider_id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    pronouns?: true
    createdAt?: true
    updatedAt?: true
    firstName?: true
    lastName?: true
    bio?: true
    headline?: true
    location?: true
    websiteURL?: true
    shareQuick?: true
    yogaStyle?: true
    yogaExperience?: true
    company?: true
    socialURL?: true
    isLocationPublic?: true
    role?: true
    activeProfileImage?: true
    tz?: true
  }

  export type UserDataCountAggregateInputType = {
    id?: true
    provider_id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    pronouns?: true
    profile?: true
    createdAt?: true
    updatedAt?: true
    firstName?: true
    lastName?: true
    bio?: true
    headline?: true
    location?: true
    websiteURL?: true
    shareQuick?: true
    yogaStyle?: true
    yogaExperience?: true
    company?: true
    socialURL?: true
    isLocationPublic?: true
    role?: true
    profileImages?: true
    activeProfileImage?: true
    tz?: true
    _all?: true
  }

  export type UserDataAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which UserData to aggregate.
     */
    where?: UserDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserData to fetch.
     */
    orderBy?:
      | UserDataOrderByWithRelationInput
      | UserDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: UserDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned UserData
     **/
    _count?: true | UserDataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: UserDataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: UserDataMaxAggregateInputType
  }

  export type GetUserDataAggregateType<T extends UserDataAggregateArgs> = {
    [P in keyof T & keyof AggregateUserData]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserData[P]>
      : GetScalarType<T[P], AggregateUserData[P]>
  }

  export type UserDataGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: UserDataWhereInput
    orderBy?:
      | UserDataOrderByWithAggregationInput
      | UserDataOrderByWithAggregationInput[]
    by: UserDataScalarFieldEnum[] | UserDataScalarFieldEnum
    having?: UserDataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserDataCountAggregateInputType | true
    _min?: UserDataMinAggregateInputType
    _max?: UserDataMaxAggregateInputType
  }

  export type UserDataGroupByOutputType = {
    id: string
    provider_id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    pronouns: string | null
    profile: JsonValue | null
    createdAt: Date
    updatedAt: Date
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick: string | null
    yogaStyle: string | null
    yogaExperience: string | null
    company: string | null
    socialURL: string | null
    isLocationPublic: string | null
    role: string | null
    profileImages: string[]
    activeProfileImage: string | null
    tz: string
    _count: UserDataCountAggregateOutputType | null
    _min: UserDataMinAggregateOutputType | null
    _max: UserDataMaxAggregateOutputType | null
  }

  type GetUserDataGroupByPayload<T extends UserDataGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<UserDataGroupByOutputType, T['by']> & {
          [P in keyof T & keyof UserDataGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserDataGroupByOutputType[P]>
            : GetScalarType<T[P], UserDataGroupByOutputType[P]>
        }
      >
    >

  export type UserDataSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      provider_id?: boolean
      name?: boolean
      email?: boolean
      emailVerified?: boolean
      image?: boolean
      pronouns?: boolean
      profile?: boolean
      createdAt?: boolean
      updatedAt?: boolean
      firstName?: boolean
      lastName?: boolean
      bio?: boolean
      headline?: boolean
      location?: boolean
      websiteURL?: boolean
      shareQuick?: boolean
      yogaStyle?: boolean
      yogaExperience?: boolean
      company?: boolean
      socialURL?: boolean
      isLocationPublic?: boolean
      role?: boolean
      profileImages?: boolean
      activeProfileImage?: boolean
      tz?: boolean
      providerAccounts?: boolean | UserData$providerAccountsArgs<ExtArgs>
      asanaActivities?: boolean | UserData$asanaActivitiesArgs<ExtArgs>
      seriesActivities?: boolean | UserData$seriesActivitiesArgs<ExtArgs>
      sequenceActivities?: boolean | UserData$sequenceActivitiesArgs<ExtArgs>
      userLogins?: boolean | UserData$userLoginsArgs<ExtArgs>
      poseImages?: boolean | UserData$poseImagesArgs<ExtArgs>
      glossaryTerms?: boolean | UserData$glossaryTermsArgs<ExtArgs>
      reminders?: boolean | UserData$remindersArgs<ExtArgs>
      pushSubscriptions?: boolean | UserData$pushSubscriptionsArgs<ExtArgs>
      _count?: boolean | UserDataCountOutputTypeDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['userData']
  >

  export type UserDataSelectScalar = {
    id?: boolean
    provider_id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    pronouns?: boolean
    profile?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    firstName?: boolean
    lastName?: boolean
    bio?: boolean
    headline?: boolean
    location?: boolean
    websiteURL?: boolean
    shareQuick?: boolean
    yogaStyle?: boolean
    yogaExperience?: boolean
    company?: boolean
    socialURL?: boolean
    isLocationPublic?: boolean
    role?: boolean
    profileImages?: boolean
    activeProfileImage?: boolean
    tz?: boolean
  }

  export type UserDataInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    providerAccounts?: boolean | UserData$providerAccountsArgs<ExtArgs>
    asanaActivities?: boolean | UserData$asanaActivitiesArgs<ExtArgs>
    seriesActivities?: boolean | UserData$seriesActivitiesArgs<ExtArgs>
    sequenceActivities?: boolean | UserData$sequenceActivitiesArgs<ExtArgs>
    userLogins?: boolean | UserData$userLoginsArgs<ExtArgs>
    poseImages?: boolean | UserData$poseImagesArgs<ExtArgs>
    glossaryTerms?: boolean | UserData$glossaryTermsArgs<ExtArgs>
    reminders?: boolean | UserData$remindersArgs<ExtArgs>
    pushSubscriptions?: boolean | UserData$pushSubscriptionsArgs<ExtArgs>
    _count?: boolean | UserDataCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserDataPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'UserData'
    objects: {
      providerAccounts: Prisma.$ProviderAccountPayload<ExtArgs>[]
      asanaActivities: Prisma.$AsanaActivityPayload<ExtArgs>[]
      seriesActivities: Prisma.$SeriesActivityPayload<ExtArgs>[]
      sequenceActivities: Prisma.$SequenceActivityPayload<ExtArgs>[]
      userLogins: Prisma.$UserLoginPayload<ExtArgs>[]
      poseImages: Prisma.$PoseImagePayload<ExtArgs>[]
      glossaryTerms: Prisma.$GlossaryTermPayload<ExtArgs>[]
      reminders: Prisma.$ReminderPayload<ExtArgs>[]
      pushSubscriptions: Prisma.$PushSubscriptionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        provider_id: string | null
        name: string | null
        email: string | null
        emailVerified: Date | null
        image: string | null
        pronouns: string | null
        profile: Prisma.JsonValue | null
        createdAt: Date
        updatedAt: Date
        firstName: string
        lastName: string
        bio: string
        headline: string
        location: string
        websiteURL: string
        shareQuick: string | null
        yogaStyle: string | null
        yogaExperience: string | null
        company: string | null
        socialURL: string | null
        isLocationPublic: string | null
        role: string | null
        /**
         * Profile image management fields
         */
        profileImages: string[]
        activeProfileImage: string | null
        tz: string
      },
      ExtArgs['result']['userData']
    >
    composites: {}
  }

  type UserDataGetPayload<
    S extends boolean | null | undefined | UserDataDefaultArgs,
  > = $Result.GetResult<Prisma.$UserDataPayload, S>

  type UserDataCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<UserDataFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: UserDataCountAggregateInputType | true
  }

  export interface UserDataDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['UserData']
      meta: { name: 'UserData' }
    }
    /**
     * Find zero or one UserData that matches the filter.
     * @param {UserDataFindUniqueArgs} args - Arguments to find a UserData
     * @example
     * // Get one UserData
     * const userData = await prisma.userData.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserDataFindUniqueArgs>(
      args: SelectSubset<T, UserDataFindUniqueArgs<ExtArgs>>
    ): Prisma__UserDataClient<
      $Result.GetResult<
        Prisma.$UserDataPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find one UserData that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserDataFindUniqueOrThrowArgs} args - Arguments to find a UserData
     * @example
     * // Get one UserData
     * const userData = await prisma.userData.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserDataFindUniqueOrThrowArgs>(
      args: SelectSubset<T, UserDataFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UserDataClient<
      $Result.GetResult<
        Prisma.$UserDataPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find the first UserData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserDataFindFirstArgs} args - Arguments to find a UserData
     * @example
     * // Get one UserData
     * const userData = await prisma.userData.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserDataFindFirstArgs>(
      args?: SelectSubset<T, UserDataFindFirstArgs<ExtArgs>>
    ): Prisma__UserDataClient<
      $Result.GetResult<
        Prisma.$UserDataPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find the first UserData that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserDataFindFirstOrThrowArgs} args - Arguments to find a UserData
     * @example
     * // Get one UserData
     * const userData = await prisma.userData.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserDataFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserDataFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UserDataClient<
      $Result.GetResult<
        Prisma.$UserDataPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find zero or more UserData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserDataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserData
     * const userData = await prisma.userData.findMany()
     *
     * // Get first 10 UserData
     * const userData = await prisma.userData.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userDataWithIdOnly = await prisma.userData.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserDataFindManyArgs>(
      args?: SelectSubset<T, UserDataFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserDataPayload<ExtArgs>, T, 'findMany'>
    >

    /**
     * Create a UserData.
     * @param {UserDataCreateArgs} args - Arguments to create a UserData.
     * @example
     * // Create one UserData
     * const UserData = await prisma.userData.create({
     *   data: {
     *     // ... data to create a UserData
     *   }
     * })
     *
     */
    create<T extends UserDataCreateArgs>(
      args: SelectSubset<T, UserDataCreateArgs<ExtArgs>>
    ): Prisma__UserDataClient<
      $Result.GetResult<Prisma.$UserDataPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >

    /**
     * Create many UserData.
     * @param {UserDataCreateManyArgs} args - Arguments to create many UserData.
     * @example
     * // Create many UserData
     * const userData = await prisma.userData.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserDataCreateManyArgs>(
      args?: SelectSubset<T, UserDataCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a UserData.
     * @param {UserDataDeleteArgs} args - Arguments to delete one UserData.
     * @example
     * // Delete one UserData
     * const UserData = await prisma.userData.delete({
     *   where: {
     *     // ... filter to delete one UserData
     *   }
     * })
     *
     */
    delete<T extends UserDataDeleteArgs>(
      args: SelectSubset<T, UserDataDeleteArgs<ExtArgs>>
    ): Prisma__UserDataClient<
      $Result.GetResult<Prisma.$UserDataPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >

    /**
     * Update one UserData.
     * @param {UserDataUpdateArgs} args - Arguments to update one UserData.
     * @example
     * // Update one UserData
     * const userData = await prisma.userData.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserDataUpdateArgs>(
      args: SelectSubset<T, UserDataUpdateArgs<ExtArgs>>
    ): Prisma__UserDataClient<
      $Result.GetResult<Prisma.$UserDataPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >

    /**
     * Delete zero or more UserData.
     * @param {UserDataDeleteManyArgs} args - Arguments to filter UserData to delete.
     * @example
     * // Delete a few UserData
     * const { count } = await prisma.userData.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserDataDeleteManyArgs>(
      args?: SelectSubset<T, UserDataDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserDataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserData
     * const userData = await prisma.userData.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserDataUpdateManyArgs>(
      args: SelectSubset<T, UserDataUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserData.
     * @param {UserDataUpsertArgs} args - Arguments to update or create a UserData.
     * @example
     * // Update or create a UserData
     * const userData = await prisma.userData.upsert({
     *   create: {
     *     // ... data to create a UserData
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserData we want to update
     *   }
     * })
     */
    upsert<T extends UserDataUpsertArgs>(
      args: SelectSubset<T, UserDataUpsertArgs<ExtArgs>>
    ): Prisma__UserDataClient<
      $Result.GetResult<Prisma.$UserDataPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >

    /**
     * Find zero or more UserData that matches the filter.
     * @param {UserDataFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const userData = await prisma.userData.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: UserDataFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a UserData.
     * @param {UserDataAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const userData = await prisma.userData.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(
      args?: UserDataAggregateRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Count the number of UserData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserDataCountArgs} args - Arguments to filter UserData to count.
     * @example
     * // Count the number of UserData
     * const count = await prisma.userData.count({
     *   where: {
     *     // ... the filter for the UserData we want to count
     *   }
     * })
     **/
    count<T extends UserDataCountArgs>(
      args?: Subset<T, UserDataCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserDataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserDataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends UserDataAggregateArgs>(
      args: Subset<T, UserDataAggregateArgs>
    ): Prisma.PrismaPromise<GetUserDataAggregateType<T>>

    /**
     * Group by UserData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserDataGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends UserDataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserDataGroupByArgs['orderBy'] }
        : { orderBy?: UserDataGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, UserDataGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetUserDataGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the UserData model
     */
    readonly fields: UserDataFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserData.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserDataClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    providerAccounts<T extends UserData$providerAccountsArgs<ExtArgs> = {}>(
      args?: Subset<T, UserData$providerAccountsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$ProviderAccountPayload<ExtArgs>,
          T,
          'findMany'
        >
      | Null
    >
    asanaActivities<T extends UserData$asanaActivitiesArgs<ExtArgs> = {}>(
      args?: Subset<T, UserData$asanaActivitiesArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$AsanaActivityPayload<ExtArgs>, T, 'findMany'>
      | Null
    >
    seriesActivities<T extends UserData$seriesActivitiesArgs<ExtArgs> = {}>(
      args?: Subset<T, UserData$seriesActivitiesArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$SeriesActivityPayload<ExtArgs>, T, 'findMany'>
      | Null
    >
    sequenceActivities<T extends UserData$sequenceActivitiesArgs<ExtArgs> = {}>(
      args?: Subset<T, UserData$sequenceActivitiesArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$SequenceActivityPayload<ExtArgs>,
          T,
          'findMany'
        >
      | Null
    >
    userLogins<T extends UserData$userLoginsArgs<ExtArgs> = {}>(
      args?: Subset<T, UserData$userLoginsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserLoginPayload<ExtArgs>, T, 'findMany'> | Null
    >
    poseImages<T extends UserData$poseImagesArgs<ExtArgs> = {}>(
      args?: Subset<T, UserData$poseImagesArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$PoseImagePayload<ExtArgs>, T, 'findMany'> | Null
    >
    glossaryTerms<T extends UserData$glossaryTermsArgs<ExtArgs> = {}>(
      args?: Subset<T, UserData$glossaryTermsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$GlossaryTermPayload<ExtArgs>, T, 'findMany'>
      | Null
    >
    reminders<T extends UserData$remindersArgs<ExtArgs> = {}>(
      args?: Subset<T, UserData$remindersArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, 'findMany'> | Null
    >
    pushSubscriptions<T extends UserData$pushSubscriptionsArgs<ExtArgs> = {}>(
      args?: Subset<T, UserData$pushSubscriptionsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$PushSubscriptionPayload<ExtArgs>,
          T,
          'findMany'
        >
      | Null
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the UserData model
   */
  interface UserDataFieldRefs {
    readonly id: FieldRef<'UserData', 'String'>
    readonly provider_id: FieldRef<'UserData', 'String'>
    readonly name: FieldRef<'UserData', 'String'>
    readonly email: FieldRef<'UserData', 'String'>
    readonly emailVerified: FieldRef<'UserData', 'DateTime'>
    readonly image: FieldRef<'UserData', 'String'>
    readonly pronouns: FieldRef<'UserData', 'String'>
    readonly profile: FieldRef<'UserData', 'Json'>
    readonly createdAt: FieldRef<'UserData', 'DateTime'>
    readonly updatedAt: FieldRef<'UserData', 'DateTime'>
    readonly firstName: FieldRef<'UserData', 'String'>
    readonly lastName: FieldRef<'UserData', 'String'>
    readonly bio: FieldRef<'UserData', 'String'>
    readonly headline: FieldRef<'UserData', 'String'>
    readonly location: FieldRef<'UserData', 'String'>
    readonly websiteURL: FieldRef<'UserData', 'String'>
    readonly shareQuick: FieldRef<'UserData', 'String'>
    readonly yogaStyle: FieldRef<'UserData', 'String'>
    readonly yogaExperience: FieldRef<'UserData', 'String'>
    readonly company: FieldRef<'UserData', 'String'>
    readonly socialURL: FieldRef<'UserData', 'String'>
    readonly isLocationPublic: FieldRef<'UserData', 'String'>
    readonly role: FieldRef<'UserData', 'String'>
    readonly profileImages: FieldRef<'UserData', 'String[]'>
    readonly activeProfileImage: FieldRef<'UserData', 'String'>
    readonly tz: FieldRef<'UserData', 'String'>
  }

  // Custom InputTypes
  /**
   * UserData findUnique
   */
  export type UserDataFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserData
     */
    select?: UserDataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserDataInclude<ExtArgs> | null
    /**
     * Filter, which UserData to fetch.
     */
    where: UserDataWhereUniqueInput
  }

  /**
   * UserData findUniqueOrThrow
   */
  export type UserDataFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserData
     */
    select?: UserDataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserDataInclude<ExtArgs> | null
    /**
     * Filter, which UserData to fetch.
     */
    where: UserDataWhereUniqueInput
  }

  /**
   * UserData findFirst
   */
  export type UserDataFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserData
     */
    select?: UserDataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserDataInclude<ExtArgs> | null
    /**
     * Filter, which UserData to fetch.
     */
    where?: UserDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserData to fetch.
     */
    orderBy?:
      | UserDataOrderByWithRelationInput
      | UserDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserData.
     */
    cursor?: UserDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserData.
     */
    distinct?: UserDataScalarFieldEnum | UserDataScalarFieldEnum[]
  }

  /**
   * UserData findFirstOrThrow
   */
  export type UserDataFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserData
     */
    select?: UserDataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserDataInclude<ExtArgs> | null
    /**
     * Filter, which UserData to fetch.
     */
    where?: UserDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserData to fetch.
     */
    orderBy?:
      | UserDataOrderByWithRelationInput
      | UserDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserData.
     */
    cursor?: UserDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserData.
     */
    distinct?: UserDataScalarFieldEnum | UserDataScalarFieldEnum[]
  }

  /**
   * UserData findMany
   */
  export type UserDataFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserData
     */
    select?: UserDataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserDataInclude<ExtArgs> | null
    /**
     * Filter, which UserData to fetch.
     */
    where?: UserDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserData to fetch.
     */
    orderBy?:
      | UserDataOrderByWithRelationInput
      | UserDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing UserData.
     */
    cursor?: UserDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserData.
     */
    skip?: number
    distinct?: UserDataScalarFieldEnum | UserDataScalarFieldEnum[]
  }

  /**
   * UserData create
   */
  export type UserDataCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserData
     */
    select?: UserDataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserDataInclude<ExtArgs> | null
    /**
     * The data needed to create a UserData.
     */
    data: XOR<UserDataCreateInput, UserDataUncheckedCreateInput>
  }

  /**
   * UserData createMany
   */
  export type UserDataCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many UserData.
     */
    data: UserDataCreateManyInput | UserDataCreateManyInput[]
  }

  /**
   * UserData update
   */
  export type UserDataUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserData
     */
    select?: UserDataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserDataInclude<ExtArgs> | null
    /**
     * The data needed to update a UserData.
     */
    data: XOR<UserDataUpdateInput, UserDataUncheckedUpdateInput>
    /**
     * Choose, which UserData to update.
     */
    where: UserDataWhereUniqueInput
  }

  /**
   * UserData updateMany
   */
  export type UserDataUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update UserData.
     */
    data: XOR<UserDataUpdateManyMutationInput, UserDataUncheckedUpdateManyInput>
    /**
     * Filter which UserData to update
     */
    where?: UserDataWhereInput
  }

  /**
   * UserData upsert
   */
  export type UserDataUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserData
     */
    select?: UserDataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserDataInclude<ExtArgs> | null
    /**
     * The filter to search for the UserData to update in case it exists.
     */
    where: UserDataWhereUniqueInput
    /**
     * In case the UserData found by the `where` argument doesn't exist, create a new UserData with this data.
     */
    create: XOR<UserDataCreateInput, UserDataUncheckedCreateInput>
    /**
     * In case the UserData was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserDataUpdateInput, UserDataUncheckedUpdateInput>
  }

  /**
   * UserData delete
   */
  export type UserDataDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserData
     */
    select?: UserDataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserDataInclude<ExtArgs> | null
    /**
     * Filter which UserData to delete.
     */
    where: UserDataWhereUniqueInput
  }

  /**
   * UserData deleteMany
   */
  export type UserDataDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which UserData to delete
     */
    where?: UserDataWhereInput
  }

  /**
   * UserData findRaw
   */
  export type UserDataFindRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * UserData aggregateRaw
   */
  export type UserDataAggregateRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * UserData.providerAccounts
   */
  export type UserData$providerAccountsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProviderAccount
     */
    select?: ProviderAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderAccountInclude<ExtArgs> | null
    where?: ProviderAccountWhereInput
    orderBy?:
      | ProviderAccountOrderByWithRelationInput
      | ProviderAccountOrderByWithRelationInput[]
    cursor?: ProviderAccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProviderAccountScalarFieldEnum | ProviderAccountScalarFieldEnum[]
  }

  /**
   * UserData.asanaActivities
   */
  export type UserData$asanaActivitiesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaActivity
     */
    select?: AsanaActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaActivityInclude<ExtArgs> | null
    where?: AsanaActivityWhereInput
    orderBy?:
      | AsanaActivityOrderByWithRelationInput
      | AsanaActivityOrderByWithRelationInput[]
    cursor?: AsanaActivityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AsanaActivityScalarFieldEnum | AsanaActivityScalarFieldEnum[]
  }

  /**
   * UserData.seriesActivities
   */
  export type UserData$seriesActivitiesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SeriesActivity
     */
    select?: SeriesActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesActivityInclude<ExtArgs> | null
    where?: SeriesActivityWhereInput
    orderBy?:
      | SeriesActivityOrderByWithRelationInput
      | SeriesActivityOrderByWithRelationInput[]
    cursor?: SeriesActivityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SeriesActivityScalarFieldEnum | SeriesActivityScalarFieldEnum[]
  }

  /**
   * UserData.sequenceActivities
   */
  export type UserData$sequenceActivitiesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SequenceActivity
     */
    select?: SequenceActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceActivityInclude<ExtArgs> | null
    where?: SequenceActivityWhereInput
    orderBy?:
      | SequenceActivityOrderByWithRelationInput
      | SequenceActivityOrderByWithRelationInput[]
    cursor?: SequenceActivityWhereUniqueInput
    take?: number
    skip?: number
    distinct?:
      | SequenceActivityScalarFieldEnum
      | SequenceActivityScalarFieldEnum[]
  }

  /**
   * UserData.userLogins
   */
  export type UserData$userLoginsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserLogin
     */
    select?: UserLoginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLoginInclude<ExtArgs> | null
    where?: UserLoginWhereInput
    orderBy?:
      | UserLoginOrderByWithRelationInput
      | UserLoginOrderByWithRelationInput[]
    cursor?: UserLoginWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserLoginScalarFieldEnum | UserLoginScalarFieldEnum[]
  }

  /**
   * UserData.poseImages
   */
  export type UserData$poseImagesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PoseImage
     */
    select?: PoseImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoseImageInclude<ExtArgs> | null
    where?: PoseImageWhereInput
    orderBy?:
      | PoseImageOrderByWithRelationInput
      | PoseImageOrderByWithRelationInput[]
    cursor?: PoseImageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PoseImageScalarFieldEnum | PoseImageScalarFieldEnum[]
  }

  /**
   * UserData.glossaryTerms
   */
  export type UserData$glossaryTermsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the GlossaryTerm
     */
    select?: GlossaryTermSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlossaryTermInclude<ExtArgs> | null
    where?: GlossaryTermWhereInput
    orderBy?:
      | GlossaryTermOrderByWithRelationInput
      | GlossaryTermOrderByWithRelationInput[]
    cursor?: GlossaryTermWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GlossaryTermScalarFieldEnum | GlossaryTermScalarFieldEnum[]
  }

  /**
   * UserData.reminders
   */
  export type UserData$remindersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderInclude<ExtArgs> | null
    where?: ReminderWhereInput
    orderBy?:
      | ReminderOrderByWithRelationInput
      | ReminderOrderByWithRelationInput[]
    cursor?: ReminderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReminderScalarFieldEnum | ReminderScalarFieldEnum[]
  }

  /**
   * UserData.pushSubscriptions
   */
  export type UserData$pushSubscriptionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    where?: PushSubscriptionWhereInput
    orderBy?:
      | PushSubscriptionOrderByWithRelationInput
      | PushSubscriptionOrderByWithRelationInput[]
    cursor?: PushSubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?:
      | PushSubscriptionScalarFieldEnum
      | PushSubscriptionScalarFieldEnum[]
  }

  /**
   * UserData without action
   */
  export type UserDataDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserData
     */
    select?: UserDataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserDataInclude<ExtArgs> | null
  }

  /**
   * Model Reminder
   */

  export type AggregateReminder = {
    _count: ReminderCountAggregateOutputType | null
    _min: ReminderMinAggregateOutputType | null
    _max: ReminderMaxAggregateOutputType | null
  }

  export type ReminderMinAggregateOutputType = {
    id: string | null
    userId: string | null
    timeOfDay: string | null
    enabled: boolean | null
    message: string | null
    lastSent: Date | null
    emailNotificationsEnabled: boolean | null
  }

  export type ReminderMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    timeOfDay: string | null
    enabled: boolean | null
    message: string | null
    lastSent: Date | null
    emailNotificationsEnabled: boolean | null
  }

  export type ReminderCountAggregateOutputType = {
    id: number
    userId: number
    timeOfDay: number
    days: number
    enabled: number
    message: number
    lastSent: number
    emailNotificationsEnabled: number
    _all: number
  }

  export type ReminderMinAggregateInputType = {
    id?: true
    userId?: true
    timeOfDay?: true
    enabled?: true
    message?: true
    lastSent?: true
    emailNotificationsEnabled?: true
  }

  export type ReminderMaxAggregateInputType = {
    id?: true
    userId?: true
    timeOfDay?: true
    enabled?: true
    message?: true
    lastSent?: true
    emailNotificationsEnabled?: true
  }

  export type ReminderCountAggregateInputType = {
    id?: true
    userId?: true
    timeOfDay?: true
    days?: true
    enabled?: true
    message?: true
    lastSent?: true
    emailNotificationsEnabled?: true
    _all?: true
  }

  export type ReminderAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Reminder to aggregate.
     */
    where?: ReminderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Reminders to fetch.
     */
    orderBy?:
      | ReminderOrderByWithRelationInput
      | ReminderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ReminderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Reminders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Reminders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Reminders
     **/
    _count?: true | ReminderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ReminderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ReminderMaxAggregateInputType
  }

  export type GetReminderAggregateType<T extends ReminderAggregateArgs> = {
    [P in keyof T & keyof AggregateReminder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReminder[P]>
      : GetScalarType<T[P], AggregateReminder[P]>
  }

  export type ReminderGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ReminderWhereInput
    orderBy?:
      | ReminderOrderByWithAggregationInput
      | ReminderOrderByWithAggregationInput[]
    by: ReminderScalarFieldEnum[] | ReminderScalarFieldEnum
    having?: ReminderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReminderCountAggregateInputType | true
    _min?: ReminderMinAggregateInputType
    _max?: ReminderMaxAggregateInputType
  }

  export type ReminderGroupByOutputType = {
    id: string
    userId: string
    timeOfDay: string
    days: string[]
    enabled: boolean
    message: string
    lastSent: Date | null
    emailNotificationsEnabled: boolean
    _count: ReminderCountAggregateOutputType | null
    _min: ReminderMinAggregateOutputType | null
    _max: ReminderMaxAggregateOutputType | null
  }

  type GetReminderGroupByPayload<T extends ReminderGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<ReminderGroupByOutputType, T['by']> & {
          [P in keyof T & keyof ReminderGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReminderGroupByOutputType[P]>
            : GetScalarType<T[P], ReminderGroupByOutputType[P]>
        }
      >
    >

  export type ReminderSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      userId?: boolean
      timeOfDay?: boolean
      days?: boolean
      enabled?: boolean
      message?: boolean
      lastSent?: boolean
      emailNotificationsEnabled?: boolean
      user?: boolean | UserDataDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['reminder']
  >

  export type ReminderSelectScalar = {
    id?: boolean
    userId?: boolean
    timeOfDay?: boolean
    days?: boolean
    enabled?: boolean
    message?: boolean
    lastSent?: boolean
    emailNotificationsEnabled?: boolean
  }

  export type ReminderInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDataDefaultArgs<ExtArgs>
  }

  export type $ReminderPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Reminder'
    objects: {
      user: Prisma.$UserDataPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        userId: string
        timeOfDay: string
        days: string[]
        enabled: boolean
        message: string
        lastSent: Date | null
        emailNotificationsEnabled: boolean
      },
      ExtArgs['result']['reminder']
    >
    composites: {}
  }

  type ReminderGetPayload<
    S extends boolean | null | undefined | ReminderDefaultArgs,
  > = $Result.GetResult<Prisma.$ReminderPayload, S>

  type ReminderCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<ReminderFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: ReminderCountAggregateInputType | true
  }

  export interface ReminderDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Reminder']
      meta: { name: 'Reminder' }
    }
    /**
     * Find zero or one Reminder that matches the filter.
     * @param {ReminderFindUniqueArgs} args - Arguments to find a Reminder
     * @example
     * // Get one Reminder
     * const reminder = await prisma.reminder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReminderFindUniqueArgs>(
      args: SelectSubset<T, ReminderFindUniqueArgs<ExtArgs>>
    ): Prisma__ReminderClient<
      $Result.GetResult<
        Prisma.$ReminderPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find one Reminder that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReminderFindUniqueOrThrowArgs} args - Arguments to find a Reminder
     * @example
     * // Get one Reminder
     * const reminder = await prisma.reminder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReminderFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ReminderFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ReminderClient<
      $Result.GetResult<
        Prisma.$ReminderPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find the first Reminder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderFindFirstArgs} args - Arguments to find a Reminder
     * @example
     * // Get one Reminder
     * const reminder = await prisma.reminder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReminderFindFirstArgs>(
      args?: SelectSubset<T, ReminderFindFirstArgs<ExtArgs>>
    ): Prisma__ReminderClient<
      $Result.GetResult<
        Prisma.$ReminderPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find the first Reminder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderFindFirstOrThrowArgs} args - Arguments to find a Reminder
     * @example
     * // Get one Reminder
     * const reminder = await prisma.reminder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReminderFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ReminderFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ReminderClient<
      $Result.GetResult<
        Prisma.$ReminderPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find zero or more Reminders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reminders
     * const reminders = await prisma.reminder.findMany()
     *
     * // Get first 10 Reminders
     * const reminders = await prisma.reminder.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const reminderWithIdOnly = await prisma.reminder.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ReminderFindManyArgs>(
      args?: SelectSubset<T, ReminderFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, 'findMany'>
    >

    /**
     * Create a Reminder.
     * @param {ReminderCreateArgs} args - Arguments to create a Reminder.
     * @example
     * // Create one Reminder
     * const Reminder = await prisma.reminder.create({
     *   data: {
     *     // ... data to create a Reminder
     *   }
     * })
     *
     */
    create<T extends ReminderCreateArgs>(
      args: SelectSubset<T, ReminderCreateArgs<ExtArgs>>
    ): Prisma__ReminderClient<
      $Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >

    /**
     * Create many Reminders.
     * @param {ReminderCreateManyArgs} args - Arguments to create many Reminders.
     * @example
     * // Create many Reminders
     * const reminder = await prisma.reminder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ReminderCreateManyArgs>(
      args?: SelectSubset<T, ReminderCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Reminder.
     * @param {ReminderDeleteArgs} args - Arguments to delete one Reminder.
     * @example
     * // Delete one Reminder
     * const Reminder = await prisma.reminder.delete({
     *   where: {
     *     // ... filter to delete one Reminder
     *   }
     * })
     *
     */
    delete<T extends ReminderDeleteArgs>(
      args: SelectSubset<T, ReminderDeleteArgs<ExtArgs>>
    ): Prisma__ReminderClient<
      $Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >

    /**
     * Update one Reminder.
     * @param {ReminderUpdateArgs} args - Arguments to update one Reminder.
     * @example
     * // Update one Reminder
     * const reminder = await prisma.reminder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ReminderUpdateArgs>(
      args: SelectSubset<T, ReminderUpdateArgs<ExtArgs>>
    ): Prisma__ReminderClient<
      $Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >

    /**
     * Delete zero or more Reminders.
     * @param {ReminderDeleteManyArgs} args - Arguments to filter Reminders to delete.
     * @example
     * // Delete a few Reminders
     * const { count } = await prisma.reminder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ReminderDeleteManyArgs>(
      args?: SelectSubset<T, ReminderDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reminders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reminders
     * const reminder = await prisma.reminder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ReminderUpdateManyArgs>(
      args: SelectSubset<T, ReminderUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Reminder.
     * @param {ReminderUpsertArgs} args - Arguments to update or create a Reminder.
     * @example
     * // Update or create a Reminder
     * const reminder = await prisma.reminder.upsert({
     *   create: {
     *     // ... data to create a Reminder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reminder we want to update
     *   }
     * })
     */
    upsert<T extends ReminderUpsertArgs>(
      args: SelectSubset<T, ReminderUpsertArgs<ExtArgs>>
    ): Prisma__ReminderClient<
      $Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >

    /**
     * Find zero or more Reminders that matches the filter.
     * @param {ReminderFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const reminder = await prisma.reminder.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: ReminderFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Reminder.
     * @param {ReminderAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const reminder = await prisma.reminder.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(
      args?: ReminderAggregateRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Count the number of Reminders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderCountArgs} args - Arguments to filter Reminders to count.
     * @example
     * // Count the number of Reminders
     * const count = await prisma.reminder.count({
     *   where: {
     *     // ... the filter for the Reminders we want to count
     *   }
     * })
     **/
    count<T extends ReminderCountArgs>(
      args?: Subset<T, ReminderCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReminderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reminder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ReminderAggregateArgs>(
      args: Subset<T, ReminderAggregateArgs>
    ): Prisma.PrismaPromise<GetReminderAggregateType<T>>

    /**
     * Group by Reminder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ReminderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReminderGroupByArgs['orderBy'] }
        : { orderBy?: ReminderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ReminderGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetReminderGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the Reminder model
     */
    readonly fields: ReminderFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for Reminder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReminderClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    user<T extends UserDataDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDataDefaultArgs<ExtArgs>>
    ): Prisma__UserDataClient<
      | $Result.GetResult<
          Prisma.$UserDataPayload<ExtArgs>,
          T,
          'findUniqueOrThrow'
        >
      | Null,
      Null,
      ExtArgs
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the Reminder model
   */
  interface ReminderFieldRefs {
    readonly id: FieldRef<'Reminder', 'String'>
    readonly userId: FieldRef<'Reminder', 'String'>
    readonly timeOfDay: FieldRef<'Reminder', 'String'>
    readonly days: FieldRef<'Reminder', 'String[]'>
    readonly enabled: FieldRef<'Reminder', 'Boolean'>
    readonly message: FieldRef<'Reminder', 'String'>
    readonly lastSent: FieldRef<'Reminder', 'DateTime'>
    readonly emailNotificationsEnabled: FieldRef<'Reminder', 'Boolean'>
  }

  // Custom InputTypes
  /**
   * Reminder findUnique
   */
  export type ReminderFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderInclude<ExtArgs> | null
    /**
     * Filter, which Reminder to fetch.
     */
    where: ReminderWhereUniqueInput
  }

  /**
   * Reminder findUniqueOrThrow
   */
  export type ReminderFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderInclude<ExtArgs> | null
    /**
     * Filter, which Reminder to fetch.
     */
    where: ReminderWhereUniqueInput
  }

  /**
   * Reminder findFirst
   */
  export type ReminderFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderInclude<ExtArgs> | null
    /**
     * Filter, which Reminder to fetch.
     */
    where?: ReminderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Reminders to fetch.
     */
    orderBy?:
      | ReminderOrderByWithRelationInput
      | ReminderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Reminders.
     */
    cursor?: ReminderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Reminders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Reminders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Reminders.
     */
    distinct?: ReminderScalarFieldEnum | ReminderScalarFieldEnum[]
  }

  /**
   * Reminder findFirstOrThrow
   */
  export type ReminderFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderInclude<ExtArgs> | null
    /**
     * Filter, which Reminder to fetch.
     */
    where?: ReminderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Reminders to fetch.
     */
    orderBy?:
      | ReminderOrderByWithRelationInput
      | ReminderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Reminders.
     */
    cursor?: ReminderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Reminders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Reminders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Reminders.
     */
    distinct?: ReminderScalarFieldEnum | ReminderScalarFieldEnum[]
  }

  /**
   * Reminder findMany
   */
  export type ReminderFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderInclude<ExtArgs> | null
    /**
     * Filter, which Reminders to fetch.
     */
    where?: ReminderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Reminders to fetch.
     */
    orderBy?:
      | ReminderOrderByWithRelationInput
      | ReminderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Reminders.
     */
    cursor?: ReminderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Reminders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Reminders.
     */
    skip?: number
    distinct?: ReminderScalarFieldEnum | ReminderScalarFieldEnum[]
  }

  /**
   * Reminder create
   */
  export type ReminderCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderInclude<ExtArgs> | null
    /**
     * The data needed to create a Reminder.
     */
    data: XOR<ReminderCreateInput, ReminderUncheckedCreateInput>
  }

  /**
   * Reminder createMany
   */
  export type ReminderCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Reminders.
     */
    data: ReminderCreateManyInput | ReminderCreateManyInput[]
  }

  /**
   * Reminder update
   */
  export type ReminderUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderInclude<ExtArgs> | null
    /**
     * The data needed to update a Reminder.
     */
    data: XOR<ReminderUpdateInput, ReminderUncheckedUpdateInput>
    /**
     * Choose, which Reminder to update.
     */
    where: ReminderWhereUniqueInput
  }

  /**
   * Reminder updateMany
   */
  export type ReminderUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Reminders.
     */
    data: XOR<ReminderUpdateManyMutationInput, ReminderUncheckedUpdateManyInput>
    /**
     * Filter which Reminders to update
     */
    where?: ReminderWhereInput
  }

  /**
   * Reminder upsert
   */
  export type ReminderUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderInclude<ExtArgs> | null
    /**
     * The filter to search for the Reminder to update in case it exists.
     */
    where: ReminderWhereUniqueInput
    /**
     * In case the Reminder found by the `where` argument doesn't exist, create a new Reminder with this data.
     */
    create: XOR<ReminderCreateInput, ReminderUncheckedCreateInput>
    /**
     * In case the Reminder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReminderUpdateInput, ReminderUncheckedUpdateInput>
  }

  /**
   * Reminder delete
   */
  export type ReminderDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderInclude<ExtArgs> | null
    /**
     * Filter which Reminder to delete.
     */
    where: ReminderWhereUniqueInput
  }

  /**
   * Reminder deleteMany
   */
  export type ReminderDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Reminders to delete
     */
    where?: ReminderWhereInput
  }

  /**
   * Reminder findRaw
   */
  export type ReminderFindRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Reminder aggregateRaw
   */
  export type ReminderAggregateRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Reminder without action
   */
  export type ReminderDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReminderInclude<ExtArgs> | null
  }

  /**
   * Model PushSubscription
   */

  export type AggregatePushSubscription = {
    _count: PushSubscriptionCountAggregateOutputType | null
    _min: PushSubscriptionMinAggregateOutputType | null
    _max: PushSubscriptionMaxAggregateOutputType | null
  }

  export type PushSubscriptionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    endpoint: string | null
    p256dh: string | null
    auth: string | null
    createdAt: Date | null
  }

  export type PushSubscriptionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    endpoint: string | null
    p256dh: string | null
    auth: string | null
    createdAt: Date | null
  }

  export type PushSubscriptionCountAggregateOutputType = {
    id: number
    userId: number
    endpoint: number
    p256dh: number
    auth: number
    createdAt: number
    _all: number
  }

  export type PushSubscriptionMinAggregateInputType = {
    id?: true
    userId?: true
    endpoint?: true
    p256dh?: true
    auth?: true
    createdAt?: true
  }

  export type PushSubscriptionMaxAggregateInputType = {
    id?: true
    userId?: true
    endpoint?: true
    p256dh?: true
    auth?: true
    createdAt?: true
  }

  export type PushSubscriptionCountAggregateInputType = {
    id?: true
    userId?: true
    endpoint?: true
    p256dh?: true
    auth?: true
    createdAt?: true
    _all?: true
  }

  export type PushSubscriptionAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which PushSubscription to aggregate.
     */
    where?: PushSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PushSubscriptions to fetch.
     */
    orderBy?:
      | PushSubscriptionOrderByWithRelationInput
      | PushSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: PushSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PushSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PushSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned PushSubscriptions
     **/
    _count?: true | PushSubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: PushSubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: PushSubscriptionMaxAggregateInputType
  }

  export type GetPushSubscriptionAggregateType<
    T extends PushSubscriptionAggregateArgs,
  > = {
    [P in keyof T & keyof AggregatePushSubscription]: P extends
      | '_count'
      | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePushSubscription[P]>
      : GetScalarType<T[P], AggregatePushSubscription[P]>
  }

  export type PushSubscriptionGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PushSubscriptionWhereInput
    orderBy?:
      | PushSubscriptionOrderByWithAggregationInput
      | PushSubscriptionOrderByWithAggregationInput[]
    by: PushSubscriptionScalarFieldEnum[] | PushSubscriptionScalarFieldEnum
    having?: PushSubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PushSubscriptionCountAggregateInputType | true
    _min?: PushSubscriptionMinAggregateInputType
    _max?: PushSubscriptionMaxAggregateInputType
  }

  export type PushSubscriptionGroupByOutputType = {
    id: string
    userId: string
    endpoint: string
    p256dh: string
    auth: string
    createdAt: Date
    _count: PushSubscriptionCountAggregateOutputType | null
    _min: PushSubscriptionMinAggregateOutputType | null
    _max: PushSubscriptionMaxAggregateOutputType | null
  }

  type GetPushSubscriptionGroupByPayload<
    T extends PushSubscriptionGroupByArgs,
  > = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PushSubscriptionGroupByOutputType, T['by']> & {
        [P in keyof T &
          keyof PushSubscriptionGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], PushSubscriptionGroupByOutputType[P]>
          : GetScalarType<T[P], PushSubscriptionGroupByOutputType[P]>
      }
    >
  >

  export type PushSubscriptionSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      userId?: boolean
      endpoint?: boolean
      p256dh?: boolean
      auth?: boolean
      createdAt?: boolean
      user?: boolean | UserDataDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['pushSubscription']
  >

  export type PushSubscriptionSelectScalar = {
    id?: boolean
    userId?: boolean
    endpoint?: boolean
    p256dh?: boolean
    auth?: boolean
    createdAt?: boolean
  }

  export type PushSubscriptionInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDataDefaultArgs<ExtArgs>
  }

  export type $PushSubscriptionPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'PushSubscription'
    objects: {
      user: Prisma.$UserDataPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        userId: string
        endpoint: string
        p256dh: string
        auth: string
        createdAt: Date
      },
      ExtArgs['result']['pushSubscription']
    >
    composites: {}
  }

  type PushSubscriptionGetPayload<
    S extends boolean | null | undefined | PushSubscriptionDefaultArgs,
  > = $Result.GetResult<Prisma.$PushSubscriptionPayload, S>

  type PushSubscriptionCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<PushSubscriptionFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: PushSubscriptionCountAggregateInputType | true
  }

  export interface PushSubscriptionDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['PushSubscription']
      meta: { name: 'PushSubscription' }
    }
    /**
     * Find zero or one PushSubscription that matches the filter.
     * @param {PushSubscriptionFindUniqueArgs} args - Arguments to find a PushSubscription
     * @example
     * // Get one PushSubscription
     * const pushSubscription = await prisma.pushSubscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PushSubscriptionFindUniqueArgs>(
      args: SelectSubset<T, PushSubscriptionFindUniqueArgs<ExtArgs>>
    ): Prisma__PushSubscriptionClient<
      $Result.GetResult<
        Prisma.$PushSubscriptionPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find one PushSubscription that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PushSubscriptionFindUniqueOrThrowArgs} args - Arguments to find a PushSubscription
     * @example
     * // Get one PushSubscription
     * const pushSubscription = await prisma.pushSubscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PushSubscriptionFindUniqueOrThrowArgs>(
      args: SelectSubset<T, PushSubscriptionFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__PushSubscriptionClient<
      $Result.GetResult<
        Prisma.$PushSubscriptionPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find the first PushSubscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionFindFirstArgs} args - Arguments to find a PushSubscription
     * @example
     * // Get one PushSubscription
     * const pushSubscription = await prisma.pushSubscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PushSubscriptionFindFirstArgs>(
      args?: SelectSubset<T, PushSubscriptionFindFirstArgs<ExtArgs>>
    ): Prisma__PushSubscriptionClient<
      $Result.GetResult<
        Prisma.$PushSubscriptionPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find the first PushSubscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionFindFirstOrThrowArgs} args - Arguments to find a PushSubscription
     * @example
     * // Get one PushSubscription
     * const pushSubscription = await prisma.pushSubscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PushSubscriptionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, PushSubscriptionFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__PushSubscriptionClient<
      $Result.GetResult<
        Prisma.$PushSubscriptionPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find zero or more PushSubscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PushSubscriptions
     * const pushSubscriptions = await prisma.pushSubscription.findMany()
     *
     * // Get first 10 PushSubscriptions
     * const pushSubscriptions = await prisma.pushSubscription.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const pushSubscriptionWithIdOnly = await prisma.pushSubscription.findMany({ select: { id: true } })
     *
     */
    findMany<T extends PushSubscriptionFindManyArgs>(
      args?: SelectSubset<T, PushSubscriptionFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, 'findMany'>
    >

    /**
     * Create a PushSubscription.
     * @param {PushSubscriptionCreateArgs} args - Arguments to create a PushSubscription.
     * @example
     * // Create one PushSubscription
     * const PushSubscription = await prisma.pushSubscription.create({
     *   data: {
     *     // ... data to create a PushSubscription
     *   }
     * })
     *
     */
    create<T extends PushSubscriptionCreateArgs>(
      args: SelectSubset<T, PushSubscriptionCreateArgs<ExtArgs>>
    ): Prisma__PushSubscriptionClient<
      $Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >

    /**
     * Create many PushSubscriptions.
     * @param {PushSubscriptionCreateManyArgs} args - Arguments to create many PushSubscriptions.
     * @example
     * // Create many PushSubscriptions
     * const pushSubscription = await prisma.pushSubscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends PushSubscriptionCreateManyArgs>(
      args?: SelectSubset<T, PushSubscriptionCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PushSubscription.
     * @param {PushSubscriptionDeleteArgs} args - Arguments to delete one PushSubscription.
     * @example
     * // Delete one PushSubscription
     * const PushSubscription = await prisma.pushSubscription.delete({
     *   where: {
     *     // ... filter to delete one PushSubscription
     *   }
     * })
     *
     */
    delete<T extends PushSubscriptionDeleteArgs>(
      args: SelectSubset<T, PushSubscriptionDeleteArgs<ExtArgs>>
    ): Prisma__PushSubscriptionClient<
      $Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >

    /**
     * Update one PushSubscription.
     * @param {PushSubscriptionUpdateArgs} args - Arguments to update one PushSubscription.
     * @example
     * // Update one PushSubscription
     * const pushSubscription = await prisma.pushSubscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends PushSubscriptionUpdateArgs>(
      args: SelectSubset<T, PushSubscriptionUpdateArgs<ExtArgs>>
    ): Prisma__PushSubscriptionClient<
      $Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >

    /**
     * Delete zero or more PushSubscriptions.
     * @param {PushSubscriptionDeleteManyArgs} args - Arguments to filter PushSubscriptions to delete.
     * @example
     * // Delete a few PushSubscriptions
     * const { count } = await prisma.pushSubscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends PushSubscriptionDeleteManyArgs>(
      args?: SelectSubset<T, PushSubscriptionDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PushSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PushSubscriptions
     * const pushSubscription = await prisma.pushSubscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends PushSubscriptionUpdateManyArgs>(
      args: SelectSubset<T, PushSubscriptionUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PushSubscription.
     * @param {PushSubscriptionUpsertArgs} args - Arguments to update or create a PushSubscription.
     * @example
     * // Update or create a PushSubscription
     * const pushSubscription = await prisma.pushSubscription.upsert({
     *   create: {
     *     // ... data to create a PushSubscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PushSubscription we want to update
     *   }
     * })
     */
    upsert<T extends PushSubscriptionUpsertArgs>(
      args: SelectSubset<T, PushSubscriptionUpsertArgs<ExtArgs>>
    ): Prisma__PushSubscriptionClient<
      $Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >

    /**
     * Find zero or more PushSubscriptions that matches the filter.
     * @param {PushSubscriptionFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const pushSubscription = await prisma.pushSubscription.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(
      args?: PushSubscriptionFindRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PushSubscription.
     * @param {PushSubscriptionAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const pushSubscription = await prisma.pushSubscription.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(
      args?: PushSubscriptionAggregateRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Count the number of PushSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionCountArgs} args - Arguments to filter PushSubscriptions to count.
     * @example
     * // Count the number of PushSubscriptions
     * const count = await prisma.pushSubscription.count({
     *   where: {
     *     // ... the filter for the PushSubscriptions we want to count
     *   }
     * })
     **/
    count<T extends PushSubscriptionCountArgs>(
      args?: Subset<T, PushSubscriptionCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PushSubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PushSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends PushSubscriptionAggregateArgs>(
      args: Subset<T, PushSubscriptionAggregateArgs>
    ): Prisma.PrismaPromise<GetPushSubscriptionAggregateType<T>>

    /**
     * Group by PushSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends PushSubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PushSubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: PushSubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, PushSubscriptionGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetPushSubscriptionGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the PushSubscription model
     */
    readonly fields: PushSubscriptionFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for PushSubscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PushSubscriptionClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    user<T extends UserDataDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDataDefaultArgs<ExtArgs>>
    ): Prisma__UserDataClient<
      | $Result.GetResult<
          Prisma.$UserDataPayload<ExtArgs>,
          T,
          'findUniqueOrThrow'
        >
      | Null,
      Null,
      ExtArgs
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the PushSubscription model
   */
  interface PushSubscriptionFieldRefs {
    readonly id: FieldRef<'PushSubscription', 'String'>
    readonly userId: FieldRef<'PushSubscription', 'String'>
    readonly endpoint: FieldRef<'PushSubscription', 'String'>
    readonly p256dh: FieldRef<'PushSubscription', 'String'>
    readonly auth: FieldRef<'PushSubscription', 'String'>
    readonly createdAt: FieldRef<'PushSubscription', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * PushSubscription findUnique
   */
  export type PushSubscriptionFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which PushSubscription to fetch.
     */
    where: PushSubscriptionWhereUniqueInput
  }

  /**
   * PushSubscription findUniqueOrThrow
   */
  export type PushSubscriptionFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which PushSubscription to fetch.
     */
    where: PushSubscriptionWhereUniqueInput
  }

  /**
   * PushSubscription findFirst
   */
  export type PushSubscriptionFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which PushSubscription to fetch.
     */
    where?: PushSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PushSubscriptions to fetch.
     */
    orderBy?:
      | PushSubscriptionOrderByWithRelationInput
      | PushSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PushSubscriptions.
     */
    cursor?: PushSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PushSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PushSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PushSubscriptions.
     */
    distinct?:
      | PushSubscriptionScalarFieldEnum
      | PushSubscriptionScalarFieldEnum[]
  }

  /**
   * PushSubscription findFirstOrThrow
   */
  export type PushSubscriptionFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which PushSubscription to fetch.
     */
    where?: PushSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PushSubscriptions to fetch.
     */
    orderBy?:
      | PushSubscriptionOrderByWithRelationInput
      | PushSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PushSubscriptions.
     */
    cursor?: PushSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PushSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PushSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PushSubscriptions.
     */
    distinct?:
      | PushSubscriptionScalarFieldEnum
      | PushSubscriptionScalarFieldEnum[]
  }

  /**
   * PushSubscription findMany
   */
  export type PushSubscriptionFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which PushSubscriptions to fetch.
     */
    where?: PushSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PushSubscriptions to fetch.
     */
    orderBy?:
      | PushSubscriptionOrderByWithRelationInput
      | PushSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing PushSubscriptions.
     */
    cursor?: PushSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PushSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PushSubscriptions.
     */
    skip?: number
    distinct?:
      | PushSubscriptionScalarFieldEnum
      | PushSubscriptionScalarFieldEnum[]
  }

  /**
   * PushSubscription create
   */
  export type PushSubscriptionCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a PushSubscription.
     */
    data: XOR<PushSubscriptionCreateInput, PushSubscriptionUncheckedCreateInput>
  }

  /**
   * PushSubscription createMany
   */
  export type PushSubscriptionCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many PushSubscriptions.
     */
    data: PushSubscriptionCreateManyInput | PushSubscriptionCreateManyInput[]
  }

  /**
   * PushSubscription update
   */
  export type PushSubscriptionUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a PushSubscription.
     */
    data: XOR<PushSubscriptionUpdateInput, PushSubscriptionUncheckedUpdateInput>
    /**
     * Choose, which PushSubscription to update.
     */
    where: PushSubscriptionWhereUniqueInput
  }

  /**
   * PushSubscription updateMany
   */
  export type PushSubscriptionUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update PushSubscriptions.
     */
    data: XOR<
      PushSubscriptionUpdateManyMutationInput,
      PushSubscriptionUncheckedUpdateManyInput
    >
    /**
     * Filter which PushSubscriptions to update
     */
    where?: PushSubscriptionWhereInput
  }

  /**
   * PushSubscription upsert
   */
  export type PushSubscriptionUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the PushSubscription to update in case it exists.
     */
    where: PushSubscriptionWhereUniqueInput
    /**
     * In case the PushSubscription found by the `where` argument doesn't exist, create a new PushSubscription with this data.
     */
    create: XOR<
      PushSubscriptionCreateInput,
      PushSubscriptionUncheckedCreateInput
    >
    /**
     * In case the PushSubscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<
      PushSubscriptionUpdateInput,
      PushSubscriptionUncheckedUpdateInput
    >
  }

  /**
   * PushSubscription delete
   */
  export type PushSubscriptionDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * Filter which PushSubscription to delete.
     */
    where: PushSubscriptionWhereUniqueInput
  }

  /**
   * PushSubscription deleteMany
   */
  export type PushSubscriptionDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which PushSubscriptions to delete
     */
    where?: PushSubscriptionWhereInput
  }

  /**
   * PushSubscription findRaw
   */
  export type PushSubscriptionFindRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PushSubscription aggregateRaw
   */
  export type PushSubscriptionAggregateRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PushSubscription without action
   */
  export type PushSubscriptionDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
  }

  /**
   * Model ProviderAccount
   */

  export type AggregateProviderAccount = {
    _count: ProviderAccountCountAggregateOutputType | null
    _avg: ProviderAccountAvgAggregateOutputType | null
    _sum: ProviderAccountSumAggregateOutputType | null
    _min: ProviderAccountMinAggregateOutputType | null
    _max: ProviderAccountMaxAggregateOutputType | null
  }

  export type ProviderAccountAvgAggregateOutputType = {
    expires_at: number | null
  }

  export type ProviderAccountSumAggregateOutputType = {
    expires_at: number | null
  }

  export type ProviderAccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    credentials_password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProviderAccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    credentials_password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProviderAccountCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    provider: number
    providerAccountId: number
    refresh_token: number
    access_token: number
    expires_at: number
    token_type: number
    scope: number
    id_token: number
    session_state: number
    credentials_password: number
    createdAt: number
    updatedAt: number
    _all: number
  }

  export type ProviderAccountAvgAggregateInputType = {
    expires_at?: true
  }

  export type ProviderAccountSumAggregateInputType = {
    expires_at?: true
  }

  export type ProviderAccountMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    credentials_password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProviderAccountMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    credentials_password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProviderAccountCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    credentials_password?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProviderAccountAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProviderAccount to aggregate.
     */
    where?: ProviderAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProviderAccounts to fetch.
     */
    orderBy?:
      | ProviderAccountOrderByWithRelationInput
      | ProviderAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProviderAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProviderAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProviderAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ProviderAccounts
     **/
    _count?: true | ProviderAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ProviderAccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ProviderAccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProviderAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProviderAccountMaxAggregateInputType
  }

  export type GetProviderAccountAggregateType<
    T extends ProviderAccountAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateProviderAccount]: P extends
      | '_count'
      | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProviderAccount[P]>
      : GetScalarType<T[P], AggregateProviderAccount[P]>
  }

  export type ProviderAccountGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProviderAccountWhereInput
    orderBy?:
      | ProviderAccountOrderByWithAggregationInput
      | ProviderAccountOrderByWithAggregationInput[]
    by: ProviderAccountScalarFieldEnum[] | ProviderAccountScalarFieldEnum
    having?: ProviderAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProviderAccountCountAggregateInputType | true
    _avg?: ProviderAccountAvgAggregateInputType
    _sum?: ProviderAccountSumAggregateInputType
    _min?: ProviderAccountMinAggregateInputType
    _max?: ProviderAccountMaxAggregateInputType
  }

  export type ProviderAccountGroupByOutputType = {
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: JsonValue | null
    credentials_password: string | null
    createdAt: Date
    updatedAt: Date
    _count: ProviderAccountCountAggregateOutputType | null
    _avg: ProviderAccountAvgAggregateOutputType | null
    _sum: ProviderAccountSumAggregateOutputType | null
    _min: ProviderAccountMinAggregateOutputType | null
    _max: ProviderAccountMaxAggregateOutputType | null
  }

  type GetProviderAccountGroupByPayload<T extends ProviderAccountGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<ProviderAccountGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof ProviderAccountGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProviderAccountGroupByOutputType[P]>
            : GetScalarType<T[P], ProviderAccountGroupByOutputType[P]>
        }
      >
    >

  export type ProviderAccountSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      userId?: boolean
      type?: boolean
      provider?: boolean
      providerAccountId?: boolean
      refresh_token?: boolean
      access_token?: boolean
      expires_at?: boolean
      token_type?: boolean
      scope?: boolean
      id_token?: boolean
      session_state?: boolean
      credentials_password?: boolean
      createdAt?: boolean
      updatedAt?: boolean
      user?: boolean | UserDataDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['providerAccount']
  >

  export type ProviderAccountSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    credentials_password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProviderAccountInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDataDefaultArgs<ExtArgs>
  }

  export type $ProviderAccountPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'ProviderAccount'
    objects: {
      user: Prisma.$UserDataPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        userId: string
        type: string
        provider: string
        providerAccountId: string
        refresh_token: string | null
        access_token: string | null
        expires_at: number | null
        token_type: string | null
        scope: string | null
        id_token: string | null
        session_state: Prisma.JsonValue | null
        credentials_password: string | null
        createdAt: Date
        updatedAt: Date
      },
      ExtArgs['result']['providerAccount']
    >
    composites: {}
  }

  type ProviderAccountGetPayload<
    S extends boolean | null | undefined | ProviderAccountDefaultArgs,
  > = $Result.GetResult<Prisma.$ProviderAccountPayload, S>

  type ProviderAccountCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<ProviderAccountFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: ProviderAccountCountAggregateInputType | true
  }

  export interface ProviderAccountDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['ProviderAccount']
      meta: { name: 'ProviderAccount' }
    }
    /**
     * Find zero or one ProviderAccount that matches the filter.
     * @param {ProviderAccountFindUniqueArgs} args - Arguments to find a ProviderAccount
     * @example
     * // Get one ProviderAccount
     * const providerAccount = await prisma.providerAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProviderAccountFindUniqueArgs>(
      args: SelectSubset<T, ProviderAccountFindUniqueArgs<ExtArgs>>
    ): Prisma__ProviderAccountClient<
      $Result.GetResult<
        Prisma.$ProviderAccountPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find one ProviderAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProviderAccountFindUniqueOrThrowArgs} args - Arguments to find a ProviderAccount
     * @example
     * // Get one ProviderAccount
     * const providerAccount = await prisma.providerAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProviderAccountFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ProviderAccountFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ProviderAccountClient<
      $Result.GetResult<
        Prisma.$ProviderAccountPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find the first ProviderAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderAccountFindFirstArgs} args - Arguments to find a ProviderAccount
     * @example
     * // Get one ProviderAccount
     * const providerAccount = await prisma.providerAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProviderAccountFindFirstArgs>(
      args?: SelectSubset<T, ProviderAccountFindFirstArgs<ExtArgs>>
    ): Prisma__ProviderAccountClient<
      $Result.GetResult<
        Prisma.$ProviderAccountPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find the first ProviderAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderAccountFindFirstOrThrowArgs} args - Arguments to find a ProviderAccount
     * @example
     * // Get one ProviderAccount
     * const providerAccount = await prisma.providerAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProviderAccountFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProviderAccountFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ProviderAccountClient<
      $Result.GetResult<
        Prisma.$ProviderAccountPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find zero or more ProviderAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProviderAccounts
     * const providerAccounts = await prisma.providerAccount.findMany()
     *
     * // Get first 10 ProviderAccounts
     * const providerAccounts = await prisma.providerAccount.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const providerAccountWithIdOnly = await prisma.providerAccount.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProviderAccountFindManyArgs>(
      args?: SelectSubset<T, ProviderAccountFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ProviderAccountPayload<ExtArgs>, T, 'findMany'>
    >

    /**
     * Create a ProviderAccount.
     * @param {ProviderAccountCreateArgs} args - Arguments to create a ProviderAccount.
     * @example
     * // Create one ProviderAccount
     * const ProviderAccount = await prisma.providerAccount.create({
     *   data: {
     *     // ... data to create a ProviderAccount
     *   }
     * })
     *
     */
    create<T extends ProviderAccountCreateArgs>(
      args: SelectSubset<T, ProviderAccountCreateArgs<ExtArgs>>
    ): Prisma__ProviderAccountClient<
      $Result.GetResult<Prisma.$ProviderAccountPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >

    /**
     * Create many ProviderAccounts.
     * @param {ProviderAccountCreateManyArgs} args - Arguments to create many ProviderAccounts.
     * @example
     * // Create many ProviderAccounts
     * const providerAccount = await prisma.providerAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProviderAccountCreateManyArgs>(
      args?: SelectSubset<T, ProviderAccountCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ProviderAccount.
     * @param {ProviderAccountDeleteArgs} args - Arguments to delete one ProviderAccount.
     * @example
     * // Delete one ProviderAccount
     * const ProviderAccount = await prisma.providerAccount.delete({
     *   where: {
     *     // ... filter to delete one ProviderAccount
     *   }
     * })
     *
     */
    delete<T extends ProviderAccountDeleteArgs>(
      args: SelectSubset<T, ProviderAccountDeleteArgs<ExtArgs>>
    ): Prisma__ProviderAccountClient<
      $Result.GetResult<Prisma.$ProviderAccountPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >

    /**
     * Update one ProviderAccount.
     * @param {ProviderAccountUpdateArgs} args - Arguments to update one ProviderAccount.
     * @example
     * // Update one ProviderAccount
     * const providerAccount = await prisma.providerAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProviderAccountUpdateArgs>(
      args: SelectSubset<T, ProviderAccountUpdateArgs<ExtArgs>>
    ): Prisma__ProviderAccountClient<
      $Result.GetResult<Prisma.$ProviderAccountPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >

    /**
     * Delete zero or more ProviderAccounts.
     * @param {ProviderAccountDeleteManyArgs} args - Arguments to filter ProviderAccounts to delete.
     * @example
     * // Delete a few ProviderAccounts
     * const { count } = await prisma.providerAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProviderAccountDeleteManyArgs>(
      args?: SelectSubset<T, ProviderAccountDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProviderAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProviderAccounts
     * const providerAccount = await prisma.providerAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProviderAccountUpdateManyArgs>(
      args: SelectSubset<T, ProviderAccountUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProviderAccount.
     * @param {ProviderAccountUpsertArgs} args - Arguments to update or create a ProviderAccount.
     * @example
     * // Update or create a ProviderAccount
     * const providerAccount = await prisma.providerAccount.upsert({
     *   create: {
     *     // ... data to create a ProviderAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProviderAccount we want to update
     *   }
     * })
     */
    upsert<T extends ProviderAccountUpsertArgs>(
      args: SelectSubset<T, ProviderAccountUpsertArgs<ExtArgs>>
    ): Prisma__ProviderAccountClient<
      $Result.GetResult<Prisma.$ProviderAccountPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >

    /**
     * Find zero or more ProviderAccounts that matches the filter.
     * @param {ProviderAccountFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const providerAccount = await prisma.providerAccount.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: ProviderAccountFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a ProviderAccount.
     * @param {ProviderAccountAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const providerAccount = await prisma.providerAccount.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(
      args?: ProviderAccountAggregateRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Count the number of ProviderAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderAccountCountArgs} args - Arguments to filter ProviderAccounts to count.
     * @example
     * // Count the number of ProviderAccounts
     * const count = await prisma.providerAccount.count({
     *   where: {
     *     // ... the filter for the ProviderAccounts we want to count
     *   }
     * })
     **/
    count<T extends ProviderAccountCountArgs>(
      args?: Subset<T, ProviderAccountCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProviderAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProviderAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ProviderAccountAggregateArgs>(
      args: Subset<T, ProviderAccountAggregateArgs>
    ): Prisma.PrismaPromise<GetProviderAccountAggregateType<T>>

    /**
     * Group by ProviderAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ProviderAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProviderAccountGroupByArgs['orderBy'] }
        : { orderBy?: ProviderAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ProviderAccountGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetProviderAccountGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the ProviderAccount model
     */
    readonly fields: ProviderAccountFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProviderAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProviderAccountClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    user<T extends UserDataDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDataDefaultArgs<ExtArgs>>
    ): Prisma__UserDataClient<
      | $Result.GetResult<
          Prisma.$UserDataPayload<ExtArgs>,
          T,
          'findUniqueOrThrow'
        >
      | Null,
      Null,
      ExtArgs
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the ProviderAccount model
   */
  interface ProviderAccountFieldRefs {
    readonly id: FieldRef<'ProviderAccount', 'String'>
    readonly userId: FieldRef<'ProviderAccount', 'String'>
    readonly type: FieldRef<'ProviderAccount', 'String'>
    readonly provider: FieldRef<'ProviderAccount', 'String'>
    readonly providerAccountId: FieldRef<'ProviderAccount', 'String'>
    readonly refresh_token: FieldRef<'ProviderAccount', 'String'>
    readonly access_token: FieldRef<'ProviderAccount', 'String'>
    readonly expires_at: FieldRef<'ProviderAccount', 'Int'>
    readonly token_type: FieldRef<'ProviderAccount', 'String'>
    readonly scope: FieldRef<'ProviderAccount', 'String'>
    readonly id_token: FieldRef<'ProviderAccount', 'String'>
    readonly session_state: FieldRef<'ProviderAccount', 'Json'>
    readonly credentials_password: FieldRef<'ProviderAccount', 'String'>
    readonly createdAt: FieldRef<'ProviderAccount', 'DateTime'>
    readonly updatedAt: FieldRef<'ProviderAccount', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * ProviderAccount findUnique
   */
  export type ProviderAccountFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProviderAccount
     */
    select?: ProviderAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderAccountInclude<ExtArgs> | null
    /**
     * Filter, which ProviderAccount to fetch.
     */
    where: ProviderAccountWhereUniqueInput
  }

  /**
   * ProviderAccount findUniqueOrThrow
   */
  export type ProviderAccountFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProviderAccount
     */
    select?: ProviderAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderAccountInclude<ExtArgs> | null
    /**
     * Filter, which ProviderAccount to fetch.
     */
    where: ProviderAccountWhereUniqueInput
  }

  /**
   * ProviderAccount findFirst
   */
  export type ProviderAccountFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProviderAccount
     */
    select?: ProviderAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderAccountInclude<ExtArgs> | null
    /**
     * Filter, which ProviderAccount to fetch.
     */
    where?: ProviderAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProviderAccounts to fetch.
     */
    orderBy?:
      | ProviderAccountOrderByWithRelationInput
      | ProviderAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProviderAccounts.
     */
    cursor?: ProviderAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProviderAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProviderAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProviderAccounts.
     */
    distinct?: ProviderAccountScalarFieldEnum | ProviderAccountScalarFieldEnum[]
  }

  /**
   * ProviderAccount findFirstOrThrow
   */
  export type ProviderAccountFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProviderAccount
     */
    select?: ProviderAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderAccountInclude<ExtArgs> | null
    /**
     * Filter, which ProviderAccount to fetch.
     */
    where?: ProviderAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProviderAccounts to fetch.
     */
    orderBy?:
      | ProviderAccountOrderByWithRelationInput
      | ProviderAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProviderAccounts.
     */
    cursor?: ProviderAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProviderAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProviderAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProviderAccounts.
     */
    distinct?: ProviderAccountScalarFieldEnum | ProviderAccountScalarFieldEnum[]
  }

  /**
   * ProviderAccount findMany
   */
  export type ProviderAccountFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProviderAccount
     */
    select?: ProviderAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderAccountInclude<ExtArgs> | null
    /**
     * Filter, which ProviderAccounts to fetch.
     */
    where?: ProviderAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProviderAccounts to fetch.
     */
    orderBy?:
      | ProviderAccountOrderByWithRelationInput
      | ProviderAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ProviderAccounts.
     */
    cursor?: ProviderAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProviderAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProviderAccounts.
     */
    skip?: number
    distinct?: ProviderAccountScalarFieldEnum | ProviderAccountScalarFieldEnum[]
  }

  /**
   * ProviderAccount create
   */
  export type ProviderAccountCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProviderAccount
     */
    select?: ProviderAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a ProviderAccount.
     */
    data: XOR<ProviderAccountCreateInput, ProviderAccountUncheckedCreateInput>
  }

  /**
   * ProviderAccount createMany
   */
  export type ProviderAccountCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many ProviderAccounts.
     */
    data: ProviderAccountCreateManyInput | ProviderAccountCreateManyInput[]
  }

  /**
   * ProviderAccount update
   */
  export type ProviderAccountUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProviderAccount
     */
    select?: ProviderAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a ProviderAccount.
     */
    data: XOR<ProviderAccountUpdateInput, ProviderAccountUncheckedUpdateInput>
    /**
     * Choose, which ProviderAccount to update.
     */
    where: ProviderAccountWhereUniqueInput
  }

  /**
   * ProviderAccount updateMany
   */
  export type ProviderAccountUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update ProviderAccounts.
     */
    data: XOR<
      ProviderAccountUpdateManyMutationInput,
      ProviderAccountUncheckedUpdateManyInput
    >
    /**
     * Filter which ProviderAccounts to update
     */
    where?: ProviderAccountWhereInput
  }

  /**
   * ProviderAccount upsert
   */
  export type ProviderAccountUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProviderAccount
     */
    select?: ProviderAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the ProviderAccount to update in case it exists.
     */
    where: ProviderAccountWhereUniqueInput
    /**
     * In case the ProviderAccount found by the `where` argument doesn't exist, create a new ProviderAccount with this data.
     */
    create: XOR<ProviderAccountCreateInput, ProviderAccountUncheckedCreateInput>
    /**
     * In case the ProviderAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProviderAccountUpdateInput, ProviderAccountUncheckedUpdateInput>
  }

  /**
   * ProviderAccount delete
   */
  export type ProviderAccountDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProviderAccount
     */
    select?: ProviderAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderAccountInclude<ExtArgs> | null
    /**
     * Filter which ProviderAccount to delete.
     */
    where: ProviderAccountWhereUniqueInput
  }

  /**
   * ProviderAccount deleteMany
   */
  export type ProviderAccountDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProviderAccounts to delete
     */
    where?: ProviderAccountWhereInput
  }

  /**
   * ProviderAccount findRaw
   */
  export type ProviderAccountFindRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * ProviderAccount aggregateRaw
   */
  export type ProviderAccountAggregateRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * ProviderAccount without action
   */
  export type ProviderAccountDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProviderAccount
     */
    select?: ProviderAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderAccountInclude<ExtArgs> | null
  }

  /**
   * Model AsanaPosture
   */

  export type AggregateAsanaPosture = {
    _count: AsanaPostureCountAggregateOutputType | null
    _min: AsanaPostureMinAggregateOutputType | null
    _max: AsanaPostureMaxAggregateOutputType | null
  }

  export type AsanaPostureMinAggregateOutputType = {
    id: string | null
    sort_english_name: string | null
    description: string | null
    benefits: string | null
    category: string | null
    difficulty: string | null
    lore: string | null
    breath_direction_default: string | null
    dristi: string | null
    label: string | null
    preferred_side: string | null
    sideways: boolean | null
    image: string | null
    created_on: Date | null
    updated_on: Date | null
    acitivity_completed: boolean | null
    acitivity_practice: boolean | null
    posture_intent: string | null
    duration_asana: string | null
    transition_cues_out: string | null
    transition_cues_in: string | null
    setup_cues: string | null
    deepening_cues: string | null
    customize_asana: string | null
    additional_cues: string | null
    joint_action: string | null
    muscle_action: string | null
    created_by: string | null
  }

  export type AsanaPostureMaxAggregateOutputType = {
    id: string | null
    sort_english_name: string | null
    description: string | null
    benefits: string | null
    category: string | null
    difficulty: string | null
    lore: string | null
    breath_direction_default: string | null
    dristi: string | null
    label: string | null
    preferred_side: string | null
    sideways: boolean | null
    image: string | null
    created_on: Date | null
    updated_on: Date | null
    acitivity_completed: boolean | null
    acitivity_practice: boolean | null
    posture_intent: string | null
    duration_asana: string | null
    transition_cues_out: string | null
    transition_cues_in: string | null
    setup_cues: string | null
    deepening_cues: string | null
    customize_asana: string | null
    additional_cues: string | null
    joint_action: string | null
    muscle_action: string | null
    created_by: string | null
  }

  export type AsanaPostureCountAggregateOutputType = {
    id: number
    english_names: number
    sanskrit_names: number
    sort_english_name: number
    description: number
    benefits: number
    category: number
    difficulty: number
    lore: number
    breath_direction_default: number
    dristi: number
    variations: number
    modifications: number
    label: number
    suggested_postures: number
    preparatory_postures: number
    preferred_side: number
    sideways: number
    image: number
    created_on: number
    updated_on: number
    acitivity_completed: number
    acitivity_practice: number
    posture_intent: number
    breath_series: number
    duration_asana: number
    transition_cues_out: number
    transition_cues_in: number
    setup_cues: number
    deepening_cues: number
    customize_asana: number
    additional_cues: number
    joint_action: number
    muscle_action: number
    created_by: number
    _all: number
  }

  export type AsanaPostureMinAggregateInputType = {
    id?: true
    sort_english_name?: true
    description?: true
    benefits?: true
    category?: true
    difficulty?: true
    lore?: true
    breath_direction_default?: true
    dristi?: true
    label?: true
    preferred_side?: true
    sideways?: true
    image?: true
    created_on?: true
    updated_on?: true
    acitivity_completed?: true
    acitivity_practice?: true
    posture_intent?: true
    duration_asana?: true
    transition_cues_out?: true
    transition_cues_in?: true
    setup_cues?: true
    deepening_cues?: true
    customize_asana?: true
    additional_cues?: true
    joint_action?: true
    muscle_action?: true
    created_by?: true
  }

  export type AsanaPostureMaxAggregateInputType = {
    id?: true
    sort_english_name?: true
    description?: true
    benefits?: true
    category?: true
    difficulty?: true
    lore?: true
    breath_direction_default?: true
    dristi?: true
    label?: true
    preferred_side?: true
    sideways?: true
    image?: true
    created_on?: true
    updated_on?: true
    acitivity_completed?: true
    acitivity_practice?: true
    posture_intent?: true
    duration_asana?: true
    transition_cues_out?: true
    transition_cues_in?: true
    setup_cues?: true
    deepening_cues?: true
    customize_asana?: true
    additional_cues?: true
    joint_action?: true
    muscle_action?: true
    created_by?: true
  }

  export type AsanaPostureCountAggregateInputType = {
    id?: true
    english_names?: true
    sanskrit_names?: true
    sort_english_name?: true
    description?: true
    benefits?: true
    category?: true
    difficulty?: true
    lore?: true
    breath_direction_default?: true
    dristi?: true
    variations?: true
    modifications?: true
    label?: true
    suggested_postures?: true
    preparatory_postures?: true
    preferred_side?: true
    sideways?: true
    image?: true
    created_on?: true
    updated_on?: true
    acitivity_completed?: true
    acitivity_practice?: true
    posture_intent?: true
    breath_series?: true
    duration_asana?: true
    transition_cues_out?: true
    transition_cues_in?: true
    setup_cues?: true
    deepening_cues?: true
    customize_asana?: true
    additional_cues?: true
    joint_action?: true
    muscle_action?: true
    created_by?: true
    _all?: true
  }

  export type AsanaPostureAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AsanaPosture to aggregate.
     */
    where?: AsanaPostureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AsanaPostures to fetch.
     */
    orderBy?:
      | AsanaPostureOrderByWithRelationInput
      | AsanaPostureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AsanaPostureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AsanaPostures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AsanaPostures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AsanaPostures
     **/
    _count?: true | AsanaPostureCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AsanaPostureMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AsanaPostureMaxAggregateInputType
  }

  export type GetAsanaPostureAggregateType<
    T extends AsanaPostureAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateAsanaPosture]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAsanaPosture[P]>
      : GetScalarType<T[P], AggregateAsanaPosture[P]>
  }

  export type AsanaPostureGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AsanaPostureWhereInput
    orderBy?:
      | AsanaPostureOrderByWithAggregationInput
      | AsanaPostureOrderByWithAggregationInput[]
    by: AsanaPostureScalarFieldEnum[] | AsanaPostureScalarFieldEnum
    having?: AsanaPostureScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AsanaPostureCountAggregateInputType | true
    _min?: AsanaPostureMinAggregateInputType
    _max?: AsanaPostureMaxAggregateInputType
  }

  export type AsanaPostureGroupByOutputType = {
    id: string
    english_names: string[]
    sanskrit_names: JsonValue | null
    sort_english_name: string
    description: string | null
    benefits: string | null
    category: string | null
    difficulty: string | null
    lore: string | null
    breath_direction_default: string | null
    dristi: string | null
    variations: string[]
    modifications: string[]
    label: string | null
    suggested_postures: string[]
    preparatory_postures: string[]
    preferred_side: string | null
    sideways: boolean | null
    image: string | null
    created_on: Date | null
    updated_on: Date | null
    acitivity_completed: boolean | null
    acitivity_practice: boolean | null
    posture_intent: string | null
    breath_series: string[]
    duration_asana: string | null
    transition_cues_out: string | null
    transition_cues_in: string | null
    setup_cues: string | null
    deepening_cues: string | null
    customize_asana: string | null
    additional_cues: string | null
    joint_action: string | null
    muscle_action: string | null
    created_by: string | null
    _count: AsanaPostureCountAggregateOutputType | null
    _min: AsanaPostureMinAggregateOutputType | null
    _max: AsanaPostureMaxAggregateOutputType | null
  }

  type GetAsanaPostureGroupByPayload<T extends AsanaPostureGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<AsanaPostureGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof AsanaPostureGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AsanaPostureGroupByOutputType[P]>
            : GetScalarType<T[P], AsanaPostureGroupByOutputType[P]>
        }
      >
    >

  export type AsanaPostureSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      english_names?: boolean
      sanskrit_names?: boolean
      sort_english_name?: boolean
      description?: boolean
      benefits?: boolean
      category?: boolean
      difficulty?: boolean
      lore?: boolean
      breath_direction_default?: boolean
      dristi?: boolean
      variations?: boolean
      modifications?: boolean
      label?: boolean
      suggested_postures?: boolean
      preparatory_postures?: boolean
      preferred_side?: boolean
      sideways?: boolean
      image?: boolean
      created_on?: boolean
      updated_on?: boolean
      acitivity_completed?: boolean
      acitivity_practice?: boolean
      posture_intent?: boolean
      breath_series?: boolean
      duration_asana?: boolean
      transition_cues_out?: boolean
      transition_cues_in?: boolean
      setup_cues?: boolean
      deepening_cues?: boolean
      customize_asana?: boolean
      additional_cues?: boolean
      joint_action?: boolean
      muscle_action?: boolean
      created_by?: boolean
      asanaActivities?: boolean | AsanaPosture$asanaActivitiesArgs<ExtArgs>
      poseImages?: boolean | AsanaPosture$poseImagesArgs<ExtArgs>
      _count?: boolean | AsanaPostureCountOutputTypeDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['asanaPosture']
  >

  export type AsanaPostureSelectScalar = {
    id?: boolean
    english_names?: boolean
    sanskrit_names?: boolean
    sort_english_name?: boolean
    description?: boolean
    benefits?: boolean
    category?: boolean
    difficulty?: boolean
    lore?: boolean
    breath_direction_default?: boolean
    dristi?: boolean
    variations?: boolean
    modifications?: boolean
    label?: boolean
    suggested_postures?: boolean
    preparatory_postures?: boolean
    preferred_side?: boolean
    sideways?: boolean
    image?: boolean
    created_on?: boolean
    updated_on?: boolean
    acitivity_completed?: boolean
    acitivity_practice?: boolean
    posture_intent?: boolean
    breath_series?: boolean
    duration_asana?: boolean
    transition_cues_out?: boolean
    transition_cues_in?: boolean
    setup_cues?: boolean
    deepening_cues?: boolean
    customize_asana?: boolean
    additional_cues?: boolean
    joint_action?: boolean
    muscle_action?: boolean
    created_by?: boolean
  }

  export type AsanaPostureInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    asanaActivities?: boolean | AsanaPosture$asanaActivitiesArgs<ExtArgs>
    poseImages?: boolean | AsanaPosture$poseImagesArgs<ExtArgs>
    _count?: boolean | AsanaPostureCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $AsanaPosturePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'AsanaPosture'
    objects: {
      asanaActivities: Prisma.$AsanaActivityPayload<ExtArgs>[]
      poseImages: Prisma.$PoseImagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        english_names: string[]
        sanskrit_names: Prisma.JsonValue | null
        sort_english_name: string
        description: string | null
        benefits: string | null
        category: string | null
        difficulty: string | null
        lore: string | null
        breath_direction_default: string | null
        dristi: string | null
        variations: string[]
        modifications: string[]
        label: string | null
        suggested_postures: string[]
        preparatory_postures: string[]
        preferred_side: string | null
        sideways: boolean | null
        image: string | null
        created_on: Date | null
        updated_on: Date | null
        acitivity_completed: boolean | null
        acitivity_practice: boolean | null
        posture_intent: string | null
        breath_series: string[]
        duration_asana: string | null
        transition_cues_out: string | null
        transition_cues_in: string | null
        setup_cues: string | null
        deepening_cues: string | null
        customize_asana: string | null
        additional_cues: string | null
        joint_action: string | null
        muscle_action: string | null
        created_by: string | null
      },
      ExtArgs['result']['asanaPosture']
    >
    composites: {}
  }

  type AsanaPostureGetPayload<
    S extends boolean | null | undefined | AsanaPostureDefaultArgs,
  > = $Result.GetResult<Prisma.$AsanaPosturePayload, S>

  type AsanaPostureCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<AsanaPostureFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: AsanaPostureCountAggregateInputType | true
  }

  export interface AsanaPostureDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['AsanaPosture']
      meta: { name: 'AsanaPosture' }
    }
    /**
     * Find zero or one AsanaPosture that matches the filter.
     * @param {AsanaPostureFindUniqueArgs} args - Arguments to find a AsanaPosture
     * @example
     * // Get one AsanaPosture
     * const asanaPosture = await prisma.asanaPosture.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AsanaPostureFindUniqueArgs>(
      args: SelectSubset<T, AsanaPostureFindUniqueArgs<ExtArgs>>
    ): Prisma__AsanaPostureClient<
      $Result.GetResult<
        Prisma.$AsanaPosturePayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find one AsanaPosture that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AsanaPostureFindUniqueOrThrowArgs} args - Arguments to find a AsanaPosture
     * @example
     * // Get one AsanaPosture
     * const asanaPosture = await prisma.asanaPosture.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AsanaPostureFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AsanaPostureFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AsanaPostureClient<
      $Result.GetResult<
        Prisma.$AsanaPosturePayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find the first AsanaPosture that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaPostureFindFirstArgs} args - Arguments to find a AsanaPosture
     * @example
     * // Get one AsanaPosture
     * const asanaPosture = await prisma.asanaPosture.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AsanaPostureFindFirstArgs>(
      args?: SelectSubset<T, AsanaPostureFindFirstArgs<ExtArgs>>
    ): Prisma__AsanaPostureClient<
      $Result.GetResult<
        Prisma.$AsanaPosturePayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find the first AsanaPosture that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaPostureFindFirstOrThrowArgs} args - Arguments to find a AsanaPosture
     * @example
     * // Get one AsanaPosture
     * const asanaPosture = await prisma.asanaPosture.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AsanaPostureFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AsanaPostureFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AsanaPostureClient<
      $Result.GetResult<
        Prisma.$AsanaPosturePayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find zero or more AsanaPostures that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaPostureFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AsanaPostures
     * const asanaPostures = await prisma.asanaPosture.findMany()
     *
     * // Get first 10 AsanaPostures
     * const asanaPostures = await prisma.asanaPosture.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const asanaPostureWithIdOnly = await prisma.asanaPosture.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AsanaPostureFindManyArgs>(
      args?: SelectSubset<T, AsanaPostureFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AsanaPosturePayload<ExtArgs>, T, 'findMany'>
    >

    /**
     * Create a AsanaPosture.
     * @param {AsanaPostureCreateArgs} args - Arguments to create a AsanaPosture.
     * @example
     * // Create one AsanaPosture
     * const AsanaPosture = await prisma.asanaPosture.create({
     *   data: {
     *     // ... data to create a AsanaPosture
     *   }
     * })
     *
     */
    create<T extends AsanaPostureCreateArgs>(
      args: SelectSubset<T, AsanaPostureCreateArgs<ExtArgs>>
    ): Prisma__AsanaPostureClient<
      $Result.GetResult<Prisma.$AsanaPosturePayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >

    /**
     * Create many AsanaPostures.
     * @param {AsanaPostureCreateManyArgs} args - Arguments to create many AsanaPostures.
     * @example
     * // Create many AsanaPostures
     * const asanaPosture = await prisma.asanaPosture.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AsanaPostureCreateManyArgs>(
      args?: SelectSubset<T, AsanaPostureCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AsanaPosture.
     * @param {AsanaPostureDeleteArgs} args - Arguments to delete one AsanaPosture.
     * @example
     * // Delete one AsanaPosture
     * const AsanaPosture = await prisma.asanaPosture.delete({
     *   where: {
     *     // ... filter to delete one AsanaPosture
     *   }
     * })
     *
     */
    delete<T extends AsanaPostureDeleteArgs>(
      args: SelectSubset<T, AsanaPostureDeleteArgs<ExtArgs>>
    ): Prisma__AsanaPostureClient<
      $Result.GetResult<Prisma.$AsanaPosturePayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >

    /**
     * Update one AsanaPosture.
     * @param {AsanaPostureUpdateArgs} args - Arguments to update one AsanaPosture.
     * @example
     * // Update one AsanaPosture
     * const asanaPosture = await prisma.asanaPosture.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AsanaPostureUpdateArgs>(
      args: SelectSubset<T, AsanaPostureUpdateArgs<ExtArgs>>
    ): Prisma__AsanaPostureClient<
      $Result.GetResult<Prisma.$AsanaPosturePayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >

    /**
     * Delete zero or more AsanaPostures.
     * @param {AsanaPostureDeleteManyArgs} args - Arguments to filter AsanaPostures to delete.
     * @example
     * // Delete a few AsanaPostures
     * const { count } = await prisma.asanaPosture.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AsanaPostureDeleteManyArgs>(
      args?: SelectSubset<T, AsanaPostureDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AsanaPostures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaPostureUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AsanaPostures
     * const asanaPosture = await prisma.asanaPosture.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AsanaPostureUpdateManyArgs>(
      args: SelectSubset<T, AsanaPostureUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AsanaPosture.
     * @param {AsanaPostureUpsertArgs} args - Arguments to update or create a AsanaPosture.
     * @example
     * // Update or create a AsanaPosture
     * const asanaPosture = await prisma.asanaPosture.upsert({
     *   create: {
     *     // ... data to create a AsanaPosture
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AsanaPosture we want to update
     *   }
     * })
     */
    upsert<T extends AsanaPostureUpsertArgs>(
      args: SelectSubset<T, AsanaPostureUpsertArgs<ExtArgs>>
    ): Prisma__AsanaPostureClient<
      $Result.GetResult<Prisma.$AsanaPosturePayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >

    /**
     * Find zero or more AsanaPostures that matches the filter.
     * @param {AsanaPostureFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const asanaPosture = await prisma.asanaPosture.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: AsanaPostureFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a AsanaPosture.
     * @param {AsanaPostureAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const asanaPosture = await prisma.asanaPosture.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(
      args?: AsanaPostureAggregateRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Count the number of AsanaPostures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaPostureCountArgs} args - Arguments to filter AsanaPostures to count.
     * @example
     * // Count the number of AsanaPostures
     * const count = await prisma.asanaPosture.count({
     *   where: {
     *     // ... the filter for the AsanaPostures we want to count
     *   }
     * })
     **/
    count<T extends AsanaPostureCountArgs>(
      args?: Subset<T, AsanaPostureCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AsanaPostureCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AsanaPosture.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaPostureAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AsanaPostureAggregateArgs>(
      args: Subset<T, AsanaPostureAggregateArgs>
    ): Prisma.PrismaPromise<GetAsanaPostureAggregateType<T>>

    /**
     * Group by AsanaPosture.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaPostureGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AsanaPostureGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AsanaPostureGroupByArgs['orderBy'] }
        : { orderBy?: AsanaPostureGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AsanaPostureGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetAsanaPostureGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the AsanaPosture model
     */
    readonly fields: AsanaPostureFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for AsanaPosture.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AsanaPostureClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    asanaActivities<T extends AsanaPosture$asanaActivitiesArgs<ExtArgs> = {}>(
      args?: Subset<T, AsanaPosture$asanaActivitiesArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$AsanaActivityPayload<ExtArgs>, T, 'findMany'>
      | Null
    >
    poseImages<T extends AsanaPosture$poseImagesArgs<ExtArgs> = {}>(
      args?: Subset<T, AsanaPosture$poseImagesArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$PoseImagePayload<ExtArgs>, T, 'findMany'> | Null
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the AsanaPosture model
   */
  interface AsanaPostureFieldRefs {
    readonly id: FieldRef<'AsanaPosture', 'String'>
    readonly english_names: FieldRef<'AsanaPosture', 'String[]'>
    readonly sanskrit_names: FieldRef<'AsanaPosture', 'Json'>
    readonly sort_english_name: FieldRef<'AsanaPosture', 'String'>
    readonly description: FieldRef<'AsanaPosture', 'String'>
    readonly benefits: FieldRef<'AsanaPosture', 'String'>
    readonly category: FieldRef<'AsanaPosture', 'String'>
    readonly difficulty: FieldRef<'AsanaPosture', 'String'>
    readonly lore: FieldRef<'AsanaPosture', 'String'>
    readonly breath_direction_default: FieldRef<'AsanaPosture', 'String'>
    readonly dristi: FieldRef<'AsanaPosture', 'String'>
    readonly variations: FieldRef<'AsanaPosture', 'String[]'>
    readonly modifications: FieldRef<'AsanaPosture', 'String[]'>
    readonly label: FieldRef<'AsanaPosture', 'String'>
    readonly suggested_postures: FieldRef<'AsanaPosture', 'String[]'>
    readonly preparatory_postures: FieldRef<'AsanaPosture', 'String[]'>
    readonly preferred_side: FieldRef<'AsanaPosture', 'String'>
    readonly sideways: FieldRef<'AsanaPosture', 'Boolean'>
    readonly image: FieldRef<'AsanaPosture', 'String'>
    readonly created_on: FieldRef<'AsanaPosture', 'DateTime'>
    readonly updated_on: FieldRef<'AsanaPosture', 'DateTime'>
    readonly acitivity_completed: FieldRef<'AsanaPosture', 'Boolean'>
    readonly acitivity_practice: FieldRef<'AsanaPosture', 'Boolean'>
    readonly posture_intent: FieldRef<'AsanaPosture', 'String'>
    readonly breath_series: FieldRef<'AsanaPosture', 'String[]'>
    readonly duration_asana: FieldRef<'AsanaPosture', 'String'>
    readonly transition_cues_out: FieldRef<'AsanaPosture', 'String'>
    readonly transition_cues_in: FieldRef<'AsanaPosture', 'String'>
    readonly setup_cues: FieldRef<'AsanaPosture', 'String'>
    readonly deepening_cues: FieldRef<'AsanaPosture', 'String'>
    readonly customize_asana: FieldRef<'AsanaPosture', 'String'>
    readonly additional_cues: FieldRef<'AsanaPosture', 'String'>
    readonly joint_action: FieldRef<'AsanaPosture', 'String'>
    readonly muscle_action: FieldRef<'AsanaPosture', 'String'>
    readonly created_by: FieldRef<'AsanaPosture', 'String'>
  }

  // Custom InputTypes
  /**
   * AsanaPosture findUnique
   */
  export type AsanaPostureFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaPostureInclude<ExtArgs> | null
    /**
     * Filter, which AsanaPosture to fetch.
     */
    where: AsanaPostureWhereUniqueInput
  }

  /**
   * AsanaPosture findUniqueOrThrow
   */
  export type AsanaPostureFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaPostureInclude<ExtArgs> | null
    /**
     * Filter, which AsanaPosture to fetch.
     */
    where: AsanaPostureWhereUniqueInput
  }

  /**
   * AsanaPosture findFirst
   */
  export type AsanaPostureFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaPostureInclude<ExtArgs> | null
    /**
     * Filter, which AsanaPosture to fetch.
     */
    where?: AsanaPostureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AsanaPostures to fetch.
     */
    orderBy?:
      | AsanaPostureOrderByWithRelationInput
      | AsanaPostureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AsanaPostures.
     */
    cursor?: AsanaPostureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AsanaPostures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AsanaPostures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AsanaPostures.
     */
    distinct?: AsanaPostureScalarFieldEnum | AsanaPostureScalarFieldEnum[]
  }

  /**
   * AsanaPosture findFirstOrThrow
   */
  export type AsanaPostureFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaPostureInclude<ExtArgs> | null
    /**
     * Filter, which AsanaPosture to fetch.
     */
    where?: AsanaPostureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AsanaPostures to fetch.
     */
    orderBy?:
      | AsanaPostureOrderByWithRelationInput
      | AsanaPostureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AsanaPostures.
     */
    cursor?: AsanaPostureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AsanaPostures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AsanaPostures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AsanaPostures.
     */
    distinct?: AsanaPostureScalarFieldEnum | AsanaPostureScalarFieldEnum[]
  }

  /**
   * AsanaPosture findMany
   */
  export type AsanaPostureFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaPostureInclude<ExtArgs> | null
    /**
     * Filter, which AsanaPostures to fetch.
     */
    where?: AsanaPostureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AsanaPostures to fetch.
     */
    orderBy?:
      | AsanaPostureOrderByWithRelationInput
      | AsanaPostureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AsanaPostures.
     */
    cursor?: AsanaPostureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AsanaPostures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AsanaPostures.
     */
    skip?: number
    distinct?: AsanaPostureScalarFieldEnum | AsanaPostureScalarFieldEnum[]
  }

  /**
   * AsanaPosture create
   */
  export type AsanaPostureCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaPostureInclude<ExtArgs> | null
    /**
     * The data needed to create a AsanaPosture.
     */
    data: XOR<AsanaPostureCreateInput, AsanaPostureUncheckedCreateInput>
  }

  /**
   * AsanaPosture createMany
   */
  export type AsanaPostureCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many AsanaPostures.
     */
    data: AsanaPostureCreateManyInput | AsanaPostureCreateManyInput[]
  }

  /**
   * AsanaPosture update
   */
  export type AsanaPostureUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaPostureInclude<ExtArgs> | null
    /**
     * The data needed to update a AsanaPosture.
     */
    data: XOR<AsanaPostureUpdateInput, AsanaPostureUncheckedUpdateInput>
    /**
     * Choose, which AsanaPosture to update.
     */
    where: AsanaPostureWhereUniqueInput
  }

  /**
   * AsanaPosture updateMany
   */
  export type AsanaPostureUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update AsanaPostures.
     */
    data: XOR<
      AsanaPostureUpdateManyMutationInput,
      AsanaPostureUncheckedUpdateManyInput
    >
    /**
     * Filter which AsanaPostures to update
     */
    where?: AsanaPostureWhereInput
  }

  /**
   * AsanaPosture upsert
   */
  export type AsanaPostureUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaPostureInclude<ExtArgs> | null
    /**
     * The filter to search for the AsanaPosture to update in case it exists.
     */
    where: AsanaPostureWhereUniqueInput
    /**
     * In case the AsanaPosture found by the `where` argument doesn't exist, create a new AsanaPosture with this data.
     */
    create: XOR<AsanaPostureCreateInput, AsanaPostureUncheckedCreateInput>
    /**
     * In case the AsanaPosture was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AsanaPostureUpdateInput, AsanaPostureUncheckedUpdateInput>
  }

  /**
   * AsanaPosture delete
   */
  export type AsanaPostureDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaPostureInclude<ExtArgs> | null
    /**
     * Filter which AsanaPosture to delete.
     */
    where: AsanaPostureWhereUniqueInput
  }

  /**
   * AsanaPosture deleteMany
   */
  export type AsanaPostureDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AsanaPostures to delete
     */
    where?: AsanaPostureWhereInput
  }

  /**
   * AsanaPosture findRaw
   */
  export type AsanaPostureFindRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * AsanaPosture aggregateRaw
   */
  export type AsanaPostureAggregateRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * AsanaPosture.asanaActivities
   */
  export type AsanaPosture$asanaActivitiesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaActivity
     */
    select?: AsanaActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaActivityInclude<ExtArgs> | null
    where?: AsanaActivityWhereInput
    orderBy?:
      | AsanaActivityOrderByWithRelationInput
      | AsanaActivityOrderByWithRelationInput[]
    cursor?: AsanaActivityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AsanaActivityScalarFieldEnum | AsanaActivityScalarFieldEnum[]
  }

  /**
   * AsanaPosture.poseImages
   */
  export type AsanaPosture$poseImagesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PoseImage
     */
    select?: PoseImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoseImageInclude<ExtArgs> | null
    where?: PoseImageWhereInput
    orderBy?:
      | PoseImageOrderByWithRelationInput
      | PoseImageOrderByWithRelationInput[]
    cursor?: PoseImageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PoseImageScalarFieldEnum | PoseImageScalarFieldEnum[]
  }

  /**
   * AsanaPosture without action
   */
  export type AsanaPostureDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaPostureInclude<ExtArgs> | null
  }

  /**
   * Model AsanaSeries
   */

  export type AggregateAsanaSeries = {
    _count: AsanaSeriesCountAggregateOutputType | null
    _min: AsanaSeriesMinAggregateOutputType | null
    _max: AsanaSeriesMaxAggregateOutputType | null
  }

  export type AsanaSeriesMinAggregateOutputType = {
    id: string | null
    seriesName: string | null
    description: string | null
    durationSeries: string | null
    image: string | null
    created_by: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AsanaSeriesMaxAggregateOutputType = {
    id: string | null
    seriesName: string | null
    description: string | null
    durationSeries: string | null
    image: string | null
    created_by: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AsanaSeriesCountAggregateOutputType = {
    id: number
    seriesName: number
    seriesPostures: number
    breathSeries: number
    description: number
    durationSeries: number
    image: number
    images: number
    created_by: number
    createdAt: number
    updatedAt: number
    _all: number
  }

  export type AsanaSeriesMinAggregateInputType = {
    id?: true
    seriesName?: true
    description?: true
    durationSeries?: true
    image?: true
    created_by?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AsanaSeriesMaxAggregateInputType = {
    id?: true
    seriesName?: true
    description?: true
    durationSeries?: true
    image?: true
    created_by?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AsanaSeriesCountAggregateInputType = {
    id?: true
    seriesName?: true
    seriesPostures?: true
    breathSeries?: true
    description?: true
    durationSeries?: true
    image?: true
    images?: true
    created_by?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AsanaSeriesAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AsanaSeries to aggregate.
     */
    where?: AsanaSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AsanaSeries to fetch.
     */
    orderBy?:
      | AsanaSeriesOrderByWithRelationInput
      | AsanaSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AsanaSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AsanaSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AsanaSeries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AsanaSeries
     **/
    _count?: true | AsanaSeriesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AsanaSeriesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AsanaSeriesMaxAggregateInputType
  }

  export type GetAsanaSeriesAggregateType<T extends AsanaSeriesAggregateArgs> =
    {
      [P in keyof T & keyof AggregateAsanaSeries]: P extends '_count' | 'count'
        ? T[P] extends true
          ? number
          : GetScalarType<T[P], AggregateAsanaSeries[P]>
        : GetScalarType<T[P], AggregateAsanaSeries[P]>
    }

  export type AsanaSeriesGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AsanaSeriesWhereInput
    orderBy?:
      | AsanaSeriesOrderByWithAggregationInput
      | AsanaSeriesOrderByWithAggregationInput[]
    by: AsanaSeriesScalarFieldEnum[] | AsanaSeriesScalarFieldEnum
    having?: AsanaSeriesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AsanaSeriesCountAggregateInputType | true
    _min?: AsanaSeriesMinAggregateInputType
    _max?: AsanaSeriesMaxAggregateInputType
  }

  export type AsanaSeriesGroupByOutputType = {
    id: string
    seriesName: string
    seriesPostures: string[]
    breathSeries: string[]
    description: string | null
    durationSeries: string | null
    image: string | null
    images: string[]
    created_by: string
    createdAt: Date | null
    updatedAt: Date | null
    _count: AsanaSeriesCountAggregateOutputType | null
    _min: AsanaSeriesMinAggregateOutputType | null
    _max: AsanaSeriesMaxAggregateOutputType | null
  }

  type GetAsanaSeriesGroupByPayload<T extends AsanaSeriesGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<AsanaSeriesGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof AsanaSeriesGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AsanaSeriesGroupByOutputType[P]>
            : GetScalarType<T[P], AsanaSeriesGroupByOutputType[P]>
        }
      >
    >

  export type AsanaSeriesSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      seriesName?: boolean
      seriesPostures?: boolean
      breathSeries?: boolean
      description?: boolean
      durationSeries?: boolean
      image?: boolean
      images?: boolean
      created_by?: boolean
      createdAt?: boolean
      updatedAt?: boolean
    },
    ExtArgs['result']['asanaSeries']
  >

  export type AsanaSeriesSelectScalar = {
    id?: boolean
    seriesName?: boolean
    seriesPostures?: boolean
    breathSeries?: boolean
    description?: boolean
    durationSeries?: boolean
    image?: boolean
    images?: boolean
    created_by?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type $AsanaSeriesPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'AsanaSeries'
    objects: {}
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        seriesName: string
        seriesPostures: string[]
        breathSeries: string[]
        description: string | null
        durationSeries: string | null
        image: string | null
        images: string[]
        created_by: string
        createdAt: Date | null
        updatedAt: Date | null
      },
      ExtArgs['result']['asanaSeries']
    >
    composites: {}
  }

  type AsanaSeriesGetPayload<
    S extends boolean | null | undefined | AsanaSeriesDefaultArgs,
  > = $Result.GetResult<Prisma.$AsanaSeriesPayload, S>

  type AsanaSeriesCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<AsanaSeriesFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: AsanaSeriesCountAggregateInputType | true
  }

  export interface AsanaSeriesDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['AsanaSeries']
      meta: { name: 'AsanaSeries' }
    }
    /**
     * Find zero or one AsanaSeries that matches the filter.
     * @param {AsanaSeriesFindUniqueArgs} args - Arguments to find a AsanaSeries
     * @example
     * // Get one AsanaSeries
     * const asanaSeries = await prisma.asanaSeries.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AsanaSeriesFindUniqueArgs>(
      args: SelectSubset<T, AsanaSeriesFindUniqueArgs<ExtArgs>>
    ): Prisma__AsanaSeriesClient<
      $Result.GetResult<
        Prisma.$AsanaSeriesPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find one AsanaSeries that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AsanaSeriesFindUniqueOrThrowArgs} args - Arguments to find a AsanaSeries
     * @example
     * // Get one AsanaSeries
     * const asanaSeries = await prisma.asanaSeries.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AsanaSeriesFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AsanaSeriesFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AsanaSeriesClient<
      $Result.GetResult<
        Prisma.$AsanaSeriesPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find the first AsanaSeries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaSeriesFindFirstArgs} args - Arguments to find a AsanaSeries
     * @example
     * // Get one AsanaSeries
     * const asanaSeries = await prisma.asanaSeries.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AsanaSeriesFindFirstArgs>(
      args?: SelectSubset<T, AsanaSeriesFindFirstArgs<ExtArgs>>
    ): Prisma__AsanaSeriesClient<
      $Result.GetResult<
        Prisma.$AsanaSeriesPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find the first AsanaSeries that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaSeriesFindFirstOrThrowArgs} args - Arguments to find a AsanaSeries
     * @example
     * // Get one AsanaSeries
     * const asanaSeries = await prisma.asanaSeries.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AsanaSeriesFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AsanaSeriesFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AsanaSeriesClient<
      $Result.GetResult<
        Prisma.$AsanaSeriesPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find zero or more AsanaSeries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaSeriesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AsanaSeries
     * const asanaSeries = await prisma.asanaSeries.findMany()
     *
     * // Get first 10 AsanaSeries
     * const asanaSeries = await prisma.asanaSeries.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const asanaSeriesWithIdOnly = await prisma.asanaSeries.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AsanaSeriesFindManyArgs>(
      args?: SelectSubset<T, AsanaSeriesFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AsanaSeriesPayload<ExtArgs>, T, 'findMany'>
    >

    /**
     * Create a AsanaSeries.
     * @param {AsanaSeriesCreateArgs} args - Arguments to create a AsanaSeries.
     * @example
     * // Create one AsanaSeries
     * const AsanaSeries = await prisma.asanaSeries.create({
     *   data: {
     *     // ... data to create a AsanaSeries
     *   }
     * })
     *
     */
    create<T extends AsanaSeriesCreateArgs>(
      args: SelectSubset<T, AsanaSeriesCreateArgs<ExtArgs>>
    ): Prisma__AsanaSeriesClient<
      $Result.GetResult<Prisma.$AsanaSeriesPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >

    /**
     * Create many AsanaSeries.
     * @param {AsanaSeriesCreateManyArgs} args - Arguments to create many AsanaSeries.
     * @example
     * // Create many AsanaSeries
     * const asanaSeries = await prisma.asanaSeries.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AsanaSeriesCreateManyArgs>(
      args?: SelectSubset<T, AsanaSeriesCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AsanaSeries.
     * @param {AsanaSeriesDeleteArgs} args - Arguments to delete one AsanaSeries.
     * @example
     * // Delete one AsanaSeries
     * const AsanaSeries = await prisma.asanaSeries.delete({
     *   where: {
     *     // ... filter to delete one AsanaSeries
     *   }
     * })
     *
     */
    delete<T extends AsanaSeriesDeleteArgs>(
      args: SelectSubset<T, AsanaSeriesDeleteArgs<ExtArgs>>
    ): Prisma__AsanaSeriesClient<
      $Result.GetResult<Prisma.$AsanaSeriesPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >

    /**
     * Update one AsanaSeries.
     * @param {AsanaSeriesUpdateArgs} args - Arguments to update one AsanaSeries.
     * @example
     * // Update one AsanaSeries
     * const asanaSeries = await prisma.asanaSeries.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AsanaSeriesUpdateArgs>(
      args: SelectSubset<T, AsanaSeriesUpdateArgs<ExtArgs>>
    ): Prisma__AsanaSeriesClient<
      $Result.GetResult<Prisma.$AsanaSeriesPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >

    /**
     * Delete zero or more AsanaSeries.
     * @param {AsanaSeriesDeleteManyArgs} args - Arguments to filter AsanaSeries to delete.
     * @example
     * // Delete a few AsanaSeries
     * const { count } = await prisma.asanaSeries.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AsanaSeriesDeleteManyArgs>(
      args?: SelectSubset<T, AsanaSeriesDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AsanaSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaSeriesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AsanaSeries
     * const asanaSeries = await prisma.asanaSeries.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AsanaSeriesUpdateManyArgs>(
      args: SelectSubset<T, AsanaSeriesUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AsanaSeries.
     * @param {AsanaSeriesUpsertArgs} args - Arguments to update or create a AsanaSeries.
     * @example
     * // Update or create a AsanaSeries
     * const asanaSeries = await prisma.asanaSeries.upsert({
     *   create: {
     *     // ... data to create a AsanaSeries
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AsanaSeries we want to update
     *   }
     * })
     */
    upsert<T extends AsanaSeriesUpsertArgs>(
      args: SelectSubset<T, AsanaSeriesUpsertArgs<ExtArgs>>
    ): Prisma__AsanaSeriesClient<
      $Result.GetResult<Prisma.$AsanaSeriesPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >

    /**
     * Find zero or more AsanaSeries that matches the filter.
     * @param {AsanaSeriesFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const asanaSeries = await prisma.asanaSeries.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: AsanaSeriesFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a AsanaSeries.
     * @param {AsanaSeriesAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const asanaSeries = await prisma.asanaSeries.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(
      args?: AsanaSeriesAggregateRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Count the number of AsanaSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaSeriesCountArgs} args - Arguments to filter AsanaSeries to count.
     * @example
     * // Count the number of AsanaSeries
     * const count = await prisma.asanaSeries.count({
     *   where: {
     *     // ... the filter for the AsanaSeries we want to count
     *   }
     * })
     **/
    count<T extends AsanaSeriesCountArgs>(
      args?: Subset<T, AsanaSeriesCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AsanaSeriesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AsanaSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaSeriesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AsanaSeriesAggregateArgs>(
      args: Subset<T, AsanaSeriesAggregateArgs>
    ): Prisma.PrismaPromise<GetAsanaSeriesAggregateType<T>>

    /**
     * Group by AsanaSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaSeriesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AsanaSeriesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AsanaSeriesGroupByArgs['orderBy'] }
        : { orderBy?: AsanaSeriesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AsanaSeriesGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetAsanaSeriesGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the AsanaSeries model
     */
    readonly fields: AsanaSeriesFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for AsanaSeries.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AsanaSeriesClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the AsanaSeries model
   */
  interface AsanaSeriesFieldRefs {
    readonly id: FieldRef<'AsanaSeries', 'String'>
    readonly seriesName: FieldRef<'AsanaSeries', 'String'>
    readonly seriesPostures: FieldRef<'AsanaSeries', 'String[]'>
    readonly breathSeries: FieldRef<'AsanaSeries', 'String[]'>
    readonly description: FieldRef<'AsanaSeries', 'String'>
    readonly durationSeries: FieldRef<'AsanaSeries', 'String'>
    readonly image: FieldRef<'AsanaSeries', 'String'>
    readonly images: FieldRef<'AsanaSeries', 'String[]'>
    readonly created_by: FieldRef<'AsanaSeries', 'String'>
    readonly createdAt: FieldRef<'AsanaSeries', 'DateTime'>
    readonly updatedAt: FieldRef<'AsanaSeries', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * AsanaSeries findUnique
   */
  export type AsanaSeriesFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSeries
     */
    select?: AsanaSeriesSelect<ExtArgs> | null
    /**
     * Filter, which AsanaSeries to fetch.
     */
    where: AsanaSeriesWhereUniqueInput
  }

  /**
   * AsanaSeries findUniqueOrThrow
   */
  export type AsanaSeriesFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSeries
     */
    select?: AsanaSeriesSelect<ExtArgs> | null
    /**
     * Filter, which AsanaSeries to fetch.
     */
    where: AsanaSeriesWhereUniqueInput
  }

  /**
   * AsanaSeries findFirst
   */
  export type AsanaSeriesFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSeries
     */
    select?: AsanaSeriesSelect<ExtArgs> | null
    /**
     * Filter, which AsanaSeries to fetch.
     */
    where?: AsanaSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AsanaSeries to fetch.
     */
    orderBy?:
      | AsanaSeriesOrderByWithRelationInput
      | AsanaSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AsanaSeries.
     */
    cursor?: AsanaSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AsanaSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AsanaSeries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AsanaSeries.
     */
    distinct?: AsanaSeriesScalarFieldEnum | AsanaSeriesScalarFieldEnum[]
  }

  /**
   * AsanaSeries findFirstOrThrow
   */
  export type AsanaSeriesFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSeries
     */
    select?: AsanaSeriesSelect<ExtArgs> | null
    /**
     * Filter, which AsanaSeries to fetch.
     */
    where?: AsanaSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AsanaSeries to fetch.
     */
    orderBy?:
      | AsanaSeriesOrderByWithRelationInput
      | AsanaSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AsanaSeries.
     */
    cursor?: AsanaSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AsanaSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AsanaSeries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AsanaSeries.
     */
    distinct?: AsanaSeriesScalarFieldEnum | AsanaSeriesScalarFieldEnum[]
  }

  /**
   * AsanaSeries findMany
   */
  export type AsanaSeriesFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSeries
     */
    select?: AsanaSeriesSelect<ExtArgs> | null
    /**
     * Filter, which AsanaSeries to fetch.
     */
    where?: AsanaSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AsanaSeries to fetch.
     */
    orderBy?:
      | AsanaSeriesOrderByWithRelationInput
      | AsanaSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AsanaSeries.
     */
    cursor?: AsanaSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AsanaSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AsanaSeries.
     */
    skip?: number
    distinct?: AsanaSeriesScalarFieldEnum | AsanaSeriesScalarFieldEnum[]
  }

  /**
   * AsanaSeries create
   */
  export type AsanaSeriesCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSeries
     */
    select?: AsanaSeriesSelect<ExtArgs> | null
    /**
     * The data needed to create a AsanaSeries.
     */
    data: XOR<AsanaSeriesCreateInput, AsanaSeriesUncheckedCreateInput>
  }

  /**
   * AsanaSeries createMany
   */
  export type AsanaSeriesCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many AsanaSeries.
     */
    data: AsanaSeriesCreateManyInput | AsanaSeriesCreateManyInput[]
  }

  /**
   * AsanaSeries update
   */
  export type AsanaSeriesUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSeries
     */
    select?: AsanaSeriesSelect<ExtArgs> | null
    /**
     * The data needed to update a AsanaSeries.
     */
    data: XOR<AsanaSeriesUpdateInput, AsanaSeriesUncheckedUpdateInput>
    /**
     * Choose, which AsanaSeries to update.
     */
    where: AsanaSeriesWhereUniqueInput
  }

  /**
   * AsanaSeries updateMany
   */
  export type AsanaSeriesUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update AsanaSeries.
     */
    data: XOR<
      AsanaSeriesUpdateManyMutationInput,
      AsanaSeriesUncheckedUpdateManyInput
    >
    /**
     * Filter which AsanaSeries to update
     */
    where?: AsanaSeriesWhereInput
  }

  /**
   * AsanaSeries upsert
   */
  export type AsanaSeriesUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSeries
     */
    select?: AsanaSeriesSelect<ExtArgs> | null
    /**
     * The filter to search for the AsanaSeries to update in case it exists.
     */
    where: AsanaSeriesWhereUniqueInput
    /**
     * In case the AsanaSeries found by the `where` argument doesn't exist, create a new AsanaSeries with this data.
     */
    create: XOR<AsanaSeriesCreateInput, AsanaSeriesUncheckedCreateInput>
    /**
     * In case the AsanaSeries was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AsanaSeriesUpdateInput, AsanaSeriesUncheckedUpdateInput>
  }

  /**
   * AsanaSeries delete
   */
  export type AsanaSeriesDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSeries
     */
    select?: AsanaSeriesSelect<ExtArgs> | null
    /**
     * Filter which AsanaSeries to delete.
     */
    where: AsanaSeriesWhereUniqueInput
  }

  /**
   * AsanaSeries deleteMany
   */
  export type AsanaSeriesDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AsanaSeries to delete
     */
    where?: AsanaSeriesWhereInput
  }

  /**
   * AsanaSeries findRaw
   */
  export type AsanaSeriesFindRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * AsanaSeries aggregateRaw
   */
  export type AsanaSeriesAggregateRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * AsanaSeries without action
   */
  export type AsanaSeriesDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSeries
     */
    select?: AsanaSeriesSelect<ExtArgs> | null
  }

  /**
   * Model AsanaSequence
   */

  export type AggregateAsanaSequence = {
    _count: AsanaSequenceCountAggregateOutputType | null
    _min: AsanaSequenceMinAggregateOutputType | null
    _max: AsanaSequenceMaxAggregateOutputType | null
  }

  export type AsanaSequenceMinAggregateOutputType = {
    id: string | null
    nameSequence: string | null
    description: string | null
    durationSequence: string | null
    image: string | null
    breath_direction: string | null
    created_by: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AsanaSequenceMaxAggregateOutputType = {
    id: string | null
    nameSequence: string | null
    description: string | null
    durationSequence: string | null
    image: string | null
    breath_direction: string | null
    created_by: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AsanaSequenceCountAggregateOutputType = {
    id: number
    nameSequence: number
    sequencesSeries: number
    description: number
    durationSequence: number
    image: number
    breath_direction: number
    created_by: number
    createdAt: number
    updatedAt: number
    _all: number
  }

  export type AsanaSequenceMinAggregateInputType = {
    id?: true
    nameSequence?: true
    description?: true
    durationSequence?: true
    image?: true
    breath_direction?: true
    created_by?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AsanaSequenceMaxAggregateInputType = {
    id?: true
    nameSequence?: true
    description?: true
    durationSequence?: true
    image?: true
    breath_direction?: true
    created_by?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AsanaSequenceCountAggregateInputType = {
    id?: true
    nameSequence?: true
    sequencesSeries?: true
    description?: true
    durationSequence?: true
    image?: true
    breath_direction?: true
    created_by?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AsanaSequenceAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AsanaSequence to aggregate.
     */
    where?: AsanaSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AsanaSequences to fetch.
     */
    orderBy?:
      | AsanaSequenceOrderByWithRelationInput
      | AsanaSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AsanaSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AsanaSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AsanaSequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AsanaSequences
     **/
    _count?: true | AsanaSequenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AsanaSequenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AsanaSequenceMaxAggregateInputType
  }

  export type GetAsanaSequenceAggregateType<
    T extends AsanaSequenceAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateAsanaSequence]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAsanaSequence[P]>
      : GetScalarType<T[P], AggregateAsanaSequence[P]>
  }

  export type AsanaSequenceGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AsanaSequenceWhereInput
    orderBy?:
      | AsanaSequenceOrderByWithAggregationInput
      | AsanaSequenceOrderByWithAggregationInput[]
    by: AsanaSequenceScalarFieldEnum[] | AsanaSequenceScalarFieldEnum
    having?: AsanaSequenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AsanaSequenceCountAggregateInputType | true
    _min?: AsanaSequenceMinAggregateInputType
    _max?: AsanaSequenceMaxAggregateInputType
  }

  export type AsanaSequenceGroupByOutputType = {
    id: string
    nameSequence: string
    sequencesSeries: JsonValue[]
    description: string | null
    durationSequence: string | null
    image: string | null
    breath_direction: string | null
    created_by: string | null
    createdAt: Date | null
    updatedAt: Date | null
    _count: AsanaSequenceCountAggregateOutputType | null
    _min: AsanaSequenceMinAggregateOutputType | null
    _max: AsanaSequenceMaxAggregateOutputType | null
  }

  type GetAsanaSequenceGroupByPayload<T extends AsanaSequenceGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<AsanaSequenceGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof AsanaSequenceGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AsanaSequenceGroupByOutputType[P]>
            : GetScalarType<T[P], AsanaSequenceGroupByOutputType[P]>
        }
      >
    >

  export type AsanaSequenceSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      nameSequence?: boolean
      sequencesSeries?: boolean
      description?: boolean
      durationSequence?: boolean
      image?: boolean
      breath_direction?: boolean
      created_by?: boolean
      createdAt?: boolean
      updatedAt?: boolean
    },
    ExtArgs['result']['asanaSequence']
  >

  export type AsanaSequenceSelectScalar = {
    id?: boolean
    nameSequence?: boolean
    sequencesSeries?: boolean
    description?: boolean
    durationSequence?: boolean
    image?: boolean
    breath_direction?: boolean
    created_by?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type $AsanaSequencePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'AsanaSequence'
    objects: {}
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        nameSequence: string
        sequencesSeries: Prisma.JsonValue[]
        description: string | null
        durationSequence: string | null
        image: string | null
        breath_direction: string | null
        created_by: string | null
        createdAt: Date | null
        updatedAt: Date | null
      },
      ExtArgs['result']['asanaSequence']
    >
    composites: {}
  }

  type AsanaSequenceGetPayload<
    S extends boolean | null | undefined | AsanaSequenceDefaultArgs,
  > = $Result.GetResult<Prisma.$AsanaSequencePayload, S>

  type AsanaSequenceCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<AsanaSequenceFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: AsanaSequenceCountAggregateInputType | true
  }

  export interface AsanaSequenceDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['AsanaSequence']
      meta: { name: 'AsanaSequence' }
    }
    /**
     * Find zero or one AsanaSequence that matches the filter.
     * @param {AsanaSequenceFindUniqueArgs} args - Arguments to find a AsanaSequence
     * @example
     * // Get one AsanaSequence
     * const asanaSequence = await prisma.asanaSequence.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AsanaSequenceFindUniqueArgs>(
      args: SelectSubset<T, AsanaSequenceFindUniqueArgs<ExtArgs>>
    ): Prisma__AsanaSequenceClient<
      $Result.GetResult<
        Prisma.$AsanaSequencePayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find one AsanaSequence that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AsanaSequenceFindUniqueOrThrowArgs} args - Arguments to find a AsanaSequence
     * @example
     * // Get one AsanaSequence
     * const asanaSequence = await prisma.asanaSequence.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AsanaSequenceFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AsanaSequenceFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AsanaSequenceClient<
      $Result.GetResult<
        Prisma.$AsanaSequencePayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find the first AsanaSequence that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaSequenceFindFirstArgs} args - Arguments to find a AsanaSequence
     * @example
     * // Get one AsanaSequence
     * const asanaSequence = await prisma.asanaSequence.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AsanaSequenceFindFirstArgs>(
      args?: SelectSubset<T, AsanaSequenceFindFirstArgs<ExtArgs>>
    ): Prisma__AsanaSequenceClient<
      $Result.GetResult<
        Prisma.$AsanaSequencePayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find the first AsanaSequence that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaSequenceFindFirstOrThrowArgs} args - Arguments to find a AsanaSequence
     * @example
     * // Get one AsanaSequence
     * const asanaSequence = await prisma.asanaSequence.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AsanaSequenceFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AsanaSequenceFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AsanaSequenceClient<
      $Result.GetResult<
        Prisma.$AsanaSequencePayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find zero or more AsanaSequences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaSequenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AsanaSequences
     * const asanaSequences = await prisma.asanaSequence.findMany()
     *
     * // Get first 10 AsanaSequences
     * const asanaSequences = await prisma.asanaSequence.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const asanaSequenceWithIdOnly = await prisma.asanaSequence.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AsanaSequenceFindManyArgs>(
      args?: SelectSubset<T, AsanaSequenceFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AsanaSequencePayload<ExtArgs>, T, 'findMany'>
    >

    /**
     * Create a AsanaSequence.
     * @param {AsanaSequenceCreateArgs} args - Arguments to create a AsanaSequence.
     * @example
     * // Create one AsanaSequence
     * const AsanaSequence = await prisma.asanaSequence.create({
     *   data: {
     *     // ... data to create a AsanaSequence
     *   }
     * })
     *
     */
    create<T extends AsanaSequenceCreateArgs>(
      args: SelectSubset<T, AsanaSequenceCreateArgs<ExtArgs>>
    ): Prisma__AsanaSequenceClient<
      $Result.GetResult<Prisma.$AsanaSequencePayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >

    /**
     * Create many AsanaSequences.
     * @param {AsanaSequenceCreateManyArgs} args - Arguments to create many AsanaSequences.
     * @example
     * // Create many AsanaSequences
     * const asanaSequence = await prisma.asanaSequence.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AsanaSequenceCreateManyArgs>(
      args?: SelectSubset<T, AsanaSequenceCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AsanaSequence.
     * @param {AsanaSequenceDeleteArgs} args - Arguments to delete one AsanaSequence.
     * @example
     * // Delete one AsanaSequence
     * const AsanaSequence = await prisma.asanaSequence.delete({
     *   where: {
     *     // ... filter to delete one AsanaSequence
     *   }
     * })
     *
     */
    delete<T extends AsanaSequenceDeleteArgs>(
      args: SelectSubset<T, AsanaSequenceDeleteArgs<ExtArgs>>
    ): Prisma__AsanaSequenceClient<
      $Result.GetResult<Prisma.$AsanaSequencePayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >

    /**
     * Update one AsanaSequence.
     * @param {AsanaSequenceUpdateArgs} args - Arguments to update one AsanaSequence.
     * @example
     * // Update one AsanaSequence
     * const asanaSequence = await prisma.asanaSequence.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AsanaSequenceUpdateArgs>(
      args: SelectSubset<T, AsanaSequenceUpdateArgs<ExtArgs>>
    ): Prisma__AsanaSequenceClient<
      $Result.GetResult<Prisma.$AsanaSequencePayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >

    /**
     * Delete zero or more AsanaSequences.
     * @param {AsanaSequenceDeleteManyArgs} args - Arguments to filter AsanaSequences to delete.
     * @example
     * // Delete a few AsanaSequences
     * const { count } = await prisma.asanaSequence.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AsanaSequenceDeleteManyArgs>(
      args?: SelectSubset<T, AsanaSequenceDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AsanaSequences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaSequenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AsanaSequences
     * const asanaSequence = await prisma.asanaSequence.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AsanaSequenceUpdateManyArgs>(
      args: SelectSubset<T, AsanaSequenceUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AsanaSequence.
     * @param {AsanaSequenceUpsertArgs} args - Arguments to update or create a AsanaSequence.
     * @example
     * // Update or create a AsanaSequence
     * const asanaSequence = await prisma.asanaSequence.upsert({
     *   create: {
     *     // ... data to create a AsanaSequence
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AsanaSequence we want to update
     *   }
     * })
     */
    upsert<T extends AsanaSequenceUpsertArgs>(
      args: SelectSubset<T, AsanaSequenceUpsertArgs<ExtArgs>>
    ): Prisma__AsanaSequenceClient<
      $Result.GetResult<Prisma.$AsanaSequencePayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >

    /**
     * Find zero or more AsanaSequences that matches the filter.
     * @param {AsanaSequenceFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const asanaSequence = await prisma.asanaSequence.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: AsanaSequenceFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a AsanaSequence.
     * @param {AsanaSequenceAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const asanaSequence = await prisma.asanaSequence.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(
      args?: AsanaSequenceAggregateRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Count the number of AsanaSequences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaSequenceCountArgs} args - Arguments to filter AsanaSequences to count.
     * @example
     * // Count the number of AsanaSequences
     * const count = await prisma.asanaSequence.count({
     *   where: {
     *     // ... the filter for the AsanaSequences we want to count
     *   }
     * })
     **/
    count<T extends AsanaSequenceCountArgs>(
      args?: Subset<T, AsanaSequenceCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AsanaSequenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AsanaSequence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaSequenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AsanaSequenceAggregateArgs>(
      args: Subset<T, AsanaSequenceAggregateArgs>
    ): Prisma.PrismaPromise<GetAsanaSequenceAggregateType<T>>

    /**
     * Group by AsanaSequence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaSequenceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AsanaSequenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AsanaSequenceGroupByArgs['orderBy'] }
        : { orderBy?: AsanaSequenceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AsanaSequenceGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetAsanaSequenceGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the AsanaSequence model
     */
    readonly fields: AsanaSequenceFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for AsanaSequence.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AsanaSequenceClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the AsanaSequence model
   */
  interface AsanaSequenceFieldRefs {
    readonly id: FieldRef<'AsanaSequence', 'String'>
    readonly nameSequence: FieldRef<'AsanaSequence', 'String'>
    readonly sequencesSeries: FieldRef<'AsanaSequence', 'Json[]'>
    readonly description: FieldRef<'AsanaSequence', 'String'>
    readonly durationSequence: FieldRef<'AsanaSequence', 'String'>
    readonly image: FieldRef<'AsanaSequence', 'String'>
    readonly breath_direction: FieldRef<'AsanaSequence', 'String'>
    readonly created_by: FieldRef<'AsanaSequence', 'String'>
    readonly createdAt: FieldRef<'AsanaSequence', 'DateTime'>
    readonly updatedAt: FieldRef<'AsanaSequence', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * AsanaSequence findUnique
   */
  export type AsanaSequenceFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSequence
     */
    select?: AsanaSequenceSelect<ExtArgs> | null
    /**
     * Filter, which AsanaSequence to fetch.
     */
    where: AsanaSequenceWhereUniqueInput
  }

  /**
   * AsanaSequence findUniqueOrThrow
   */
  export type AsanaSequenceFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSequence
     */
    select?: AsanaSequenceSelect<ExtArgs> | null
    /**
     * Filter, which AsanaSequence to fetch.
     */
    where: AsanaSequenceWhereUniqueInput
  }

  /**
   * AsanaSequence findFirst
   */
  export type AsanaSequenceFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSequence
     */
    select?: AsanaSequenceSelect<ExtArgs> | null
    /**
     * Filter, which AsanaSequence to fetch.
     */
    where?: AsanaSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AsanaSequences to fetch.
     */
    orderBy?:
      | AsanaSequenceOrderByWithRelationInput
      | AsanaSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AsanaSequences.
     */
    cursor?: AsanaSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AsanaSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AsanaSequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AsanaSequences.
     */
    distinct?: AsanaSequenceScalarFieldEnum | AsanaSequenceScalarFieldEnum[]
  }

  /**
   * AsanaSequence findFirstOrThrow
   */
  export type AsanaSequenceFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSequence
     */
    select?: AsanaSequenceSelect<ExtArgs> | null
    /**
     * Filter, which AsanaSequence to fetch.
     */
    where?: AsanaSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AsanaSequences to fetch.
     */
    orderBy?:
      | AsanaSequenceOrderByWithRelationInput
      | AsanaSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AsanaSequences.
     */
    cursor?: AsanaSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AsanaSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AsanaSequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AsanaSequences.
     */
    distinct?: AsanaSequenceScalarFieldEnum | AsanaSequenceScalarFieldEnum[]
  }

  /**
   * AsanaSequence findMany
   */
  export type AsanaSequenceFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSequence
     */
    select?: AsanaSequenceSelect<ExtArgs> | null
    /**
     * Filter, which AsanaSequences to fetch.
     */
    where?: AsanaSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AsanaSequences to fetch.
     */
    orderBy?:
      | AsanaSequenceOrderByWithRelationInput
      | AsanaSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AsanaSequences.
     */
    cursor?: AsanaSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AsanaSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AsanaSequences.
     */
    skip?: number
    distinct?: AsanaSequenceScalarFieldEnum | AsanaSequenceScalarFieldEnum[]
  }

  /**
   * AsanaSequence create
   */
  export type AsanaSequenceCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSequence
     */
    select?: AsanaSequenceSelect<ExtArgs> | null
    /**
     * The data needed to create a AsanaSequence.
     */
    data: XOR<AsanaSequenceCreateInput, AsanaSequenceUncheckedCreateInput>
  }

  /**
   * AsanaSequence createMany
   */
  export type AsanaSequenceCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many AsanaSequences.
     */
    data: AsanaSequenceCreateManyInput | AsanaSequenceCreateManyInput[]
  }

  /**
   * AsanaSequence update
   */
  export type AsanaSequenceUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSequence
     */
    select?: AsanaSequenceSelect<ExtArgs> | null
    /**
     * The data needed to update a AsanaSequence.
     */
    data: XOR<AsanaSequenceUpdateInput, AsanaSequenceUncheckedUpdateInput>
    /**
     * Choose, which AsanaSequence to update.
     */
    where: AsanaSequenceWhereUniqueInput
  }

  /**
   * AsanaSequence updateMany
   */
  export type AsanaSequenceUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update AsanaSequences.
     */
    data: XOR<
      AsanaSequenceUpdateManyMutationInput,
      AsanaSequenceUncheckedUpdateManyInput
    >
    /**
     * Filter which AsanaSequences to update
     */
    where?: AsanaSequenceWhereInput
  }

  /**
   * AsanaSequence upsert
   */
  export type AsanaSequenceUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSequence
     */
    select?: AsanaSequenceSelect<ExtArgs> | null
    /**
     * The filter to search for the AsanaSequence to update in case it exists.
     */
    where: AsanaSequenceWhereUniqueInput
    /**
     * In case the AsanaSequence found by the `where` argument doesn't exist, create a new AsanaSequence with this data.
     */
    create: XOR<AsanaSequenceCreateInput, AsanaSequenceUncheckedCreateInput>
    /**
     * In case the AsanaSequence was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AsanaSequenceUpdateInput, AsanaSequenceUncheckedUpdateInput>
  }

  /**
   * AsanaSequence delete
   */
  export type AsanaSequenceDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSequence
     */
    select?: AsanaSequenceSelect<ExtArgs> | null
    /**
     * Filter which AsanaSequence to delete.
     */
    where: AsanaSequenceWhereUniqueInput
  }

  /**
   * AsanaSequence deleteMany
   */
  export type AsanaSequenceDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AsanaSequences to delete
     */
    where?: AsanaSequenceWhereInput
  }

  /**
   * AsanaSequence findRaw
   */
  export type AsanaSequenceFindRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * AsanaSequence aggregateRaw
   */
  export type AsanaSequenceAggregateRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * AsanaSequence without action
   */
  export type AsanaSequenceDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaSequence
     */
    select?: AsanaSequenceSelect<ExtArgs> | null
  }

  /**
   * Model AsanaActivity
   */

  export type AggregateAsanaActivity = {
    _count: AsanaActivityCountAggregateOutputType | null
    _avg: AsanaActivityAvgAggregateOutputType | null
    _sum: AsanaActivitySumAggregateOutputType | null
    _min: AsanaActivityMinAggregateOutputType | null
    _max: AsanaActivityMaxAggregateOutputType | null
  }

  export type AsanaActivityAvgAggregateOutputType = {
    duration: number | null
  }

  export type AsanaActivitySumAggregateOutputType = {
    duration: number | null
  }

  export type AsanaActivityMinAggregateOutputType = {
    id: string | null
    userId: string | null
    postureId: string | null
    postureName: string | null
    sort_english_name: string | null
    duration: number | null
    datePerformed: Date | null
    notes: string | null
    sensations: string | null
    completionStatus: string | null
    difficulty: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AsanaActivityMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    postureId: string | null
    postureName: string | null
    sort_english_name: string | null
    duration: number | null
    datePerformed: Date | null
    notes: string | null
    sensations: string | null
    completionStatus: string | null
    difficulty: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AsanaActivityCountAggregateOutputType = {
    id: number
    userId: number
    postureId: number
    postureName: number
    sort_english_name: number
    duration: number
    datePerformed: number
    notes: number
    sensations: number
    completionStatus: number
    difficulty: number
    createdAt: number
    updatedAt: number
    _all: number
  }

  export type AsanaActivityAvgAggregateInputType = {
    duration?: true
  }

  export type AsanaActivitySumAggregateInputType = {
    duration?: true
  }

  export type AsanaActivityMinAggregateInputType = {
    id?: true
    userId?: true
    postureId?: true
    postureName?: true
    sort_english_name?: true
    duration?: true
    datePerformed?: true
    notes?: true
    sensations?: true
    completionStatus?: true
    difficulty?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AsanaActivityMaxAggregateInputType = {
    id?: true
    userId?: true
    postureId?: true
    postureName?: true
    sort_english_name?: true
    duration?: true
    datePerformed?: true
    notes?: true
    sensations?: true
    completionStatus?: true
    difficulty?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AsanaActivityCountAggregateInputType = {
    id?: true
    userId?: true
    postureId?: true
    postureName?: true
    sort_english_name?: true
    duration?: true
    datePerformed?: true
    notes?: true
    sensations?: true
    completionStatus?: true
    difficulty?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AsanaActivityAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AsanaActivity to aggregate.
     */
    where?: AsanaActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AsanaActivities to fetch.
     */
    orderBy?:
      | AsanaActivityOrderByWithRelationInput
      | AsanaActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AsanaActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AsanaActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AsanaActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AsanaActivities
     **/
    _count?: true | AsanaActivityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: AsanaActivityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: AsanaActivitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AsanaActivityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AsanaActivityMaxAggregateInputType
  }

  export type GetAsanaActivityAggregateType<
    T extends AsanaActivityAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateAsanaActivity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAsanaActivity[P]>
      : GetScalarType<T[P], AggregateAsanaActivity[P]>
  }

  export type AsanaActivityGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AsanaActivityWhereInput
    orderBy?:
      | AsanaActivityOrderByWithAggregationInput
      | AsanaActivityOrderByWithAggregationInput[]
    by: AsanaActivityScalarFieldEnum[] | AsanaActivityScalarFieldEnum
    having?: AsanaActivityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AsanaActivityCountAggregateInputType | true
    _avg?: AsanaActivityAvgAggregateInputType
    _sum?: AsanaActivitySumAggregateInputType
    _min?: AsanaActivityMinAggregateInputType
    _max?: AsanaActivityMaxAggregateInputType
  }

  export type AsanaActivityGroupByOutputType = {
    id: string
    userId: string
    postureId: string
    postureName: string
    sort_english_name: string
    duration: number
    datePerformed: Date
    notes: string | null
    sensations: string | null
    completionStatus: string
    difficulty: string | null
    createdAt: Date
    updatedAt: Date
    _count: AsanaActivityCountAggregateOutputType | null
    _avg: AsanaActivityAvgAggregateOutputType | null
    _sum: AsanaActivitySumAggregateOutputType | null
    _min: AsanaActivityMinAggregateOutputType | null
    _max: AsanaActivityMaxAggregateOutputType | null
  }

  type GetAsanaActivityGroupByPayload<T extends AsanaActivityGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<AsanaActivityGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof AsanaActivityGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AsanaActivityGroupByOutputType[P]>
            : GetScalarType<T[P], AsanaActivityGroupByOutputType[P]>
        }
      >
    >

  export type AsanaActivitySelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      userId?: boolean
      postureId?: boolean
      postureName?: boolean
      sort_english_name?: boolean
      duration?: boolean
      datePerformed?: boolean
      notes?: boolean
      sensations?: boolean
      completionStatus?: boolean
      difficulty?: boolean
      createdAt?: boolean
      updatedAt?: boolean
      user?: boolean | UserDataDefaultArgs<ExtArgs>
      posture?: boolean | AsanaPostureDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['asanaActivity']
  >

  export type AsanaActivitySelectScalar = {
    id?: boolean
    userId?: boolean
    postureId?: boolean
    postureName?: boolean
    sort_english_name?: boolean
    duration?: boolean
    datePerformed?: boolean
    notes?: boolean
    sensations?: boolean
    completionStatus?: boolean
    difficulty?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AsanaActivityInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDataDefaultArgs<ExtArgs>
    posture?: boolean | AsanaPostureDefaultArgs<ExtArgs>
  }

  export type $AsanaActivityPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'AsanaActivity'
    objects: {
      user: Prisma.$UserDataPayload<ExtArgs>
      posture: Prisma.$AsanaPosturePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        userId: string
        postureId: string
        postureName: string
        sort_english_name: string
        duration: number
        datePerformed: Date
        notes: string | null
        sensations: string | null
        completionStatus: string
        difficulty: string | null
        createdAt: Date
        updatedAt: Date
      },
      ExtArgs['result']['asanaActivity']
    >
    composites: {}
  }

  type AsanaActivityGetPayload<
    S extends boolean | null | undefined | AsanaActivityDefaultArgs,
  > = $Result.GetResult<Prisma.$AsanaActivityPayload, S>

  type AsanaActivityCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<AsanaActivityFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: AsanaActivityCountAggregateInputType | true
  }

  export interface AsanaActivityDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['AsanaActivity']
      meta: { name: 'AsanaActivity' }
    }
    /**
     * Find zero or one AsanaActivity that matches the filter.
     * @param {AsanaActivityFindUniqueArgs} args - Arguments to find a AsanaActivity
     * @example
     * // Get one AsanaActivity
     * const asanaActivity = await prisma.asanaActivity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AsanaActivityFindUniqueArgs>(
      args: SelectSubset<T, AsanaActivityFindUniqueArgs<ExtArgs>>
    ): Prisma__AsanaActivityClient<
      $Result.GetResult<
        Prisma.$AsanaActivityPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find one AsanaActivity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AsanaActivityFindUniqueOrThrowArgs} args - Arguments to find a AsanaActivity
     * @example
     * // Get one AsanaActivity
     * const asanaActivity = await prisma.asanaActivity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AsanaActivityFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AsanaActivityFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AsanaActivityClient<
      $Result.GetResult<
        Prisma.$AsanaActivityPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find the first AsanaActivity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaActivityFindFirstArgs} args - Arguments to find a AsanaActivity
     * @example
     * // Get one AsanaActivity
     * const asanaActivity = await prisma.asanaActivity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AsanaActivityFindFirstArgs>(
      args?: SelectSubset<T, AsanaActivityFindFirstArgs<ExtArgs>>
    ): Prisma__AsanaActivityClient<
      $Result.GetResult<
        Prisma.$AsanaActivityPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find the first AsanaActivity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaActivityFindFirstOrThrowArgs} args - Arguments to find a AsanaActivity
     * @example
     * // Get one AsanaActivity
     * const asanaActivity = await prisma.asanaActivity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AsanaActivityFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AsanaActivityFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AsanaActivityClient<
      $Result.GetResult<
        Prisma.$AsanaActivityPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find zero or more AsanaActivities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaActivityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AsanaActivities
     * const asanaActivities = await prisma.asanaActivity.findMany()
     *
     * // Get first 10 AsanaActivities
     * const asanaActivities = await prisma.asanaActivity.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const asanaActivityWithIdOnly = await prisma.asanaActivity.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AsanaActivityFindManyArgs>(
      args?: SelectSubset<T, AsanaActivityFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AsanaActivityPayload<ExtArgs>, T, 'findMany'>
    >

    /**
     * Create a AsanaActivity.
     * @param {AsanaActivityCreateArgs} args - Arguments to create a AsanaActivity.
     * @example
     * // Create one AsanaActivity
     * const AsanaActivity = await prisma.asanaActivity.create({
     *   data: {
     *     // ... data to create a AsanaActivity
     *   }
     * })
     *
     */
    create<T extends AsanaActivityCreateArgs>(
      args: SelectSubset<T, AsanaActivityCreateArgs<ExtArgs>>
    ): Prisma__AsanaActivityClient<
      $Result.GetResult<Prisma.$AsanaActivityPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >

    /**
     * Create many AsanaActivities.
     * @param {AsanaActivityCreateManyArgs} args - Arguments to create many AsanaActivities.
     * @example
     * // Create many AsanaActivities
     * const asanaActivity = await prisma.asanaActivity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AsanaActivityCreateManyArgs>(
      args?: SelectSubset<T, AsanaActivityCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AsanaActivity.
     * @param {AsanaActivityDeleteArgs} args - Arguments to delete one AsanaActivity.
     * @example
     * // Delete one AsanaActivity
     * const AsanaActivity = await prisma.asanaActivity.delete({
     *   where: {
     *     // ... filter to delete one AsanaActivity
     *   }
     * })
     *
     */
    delete<T extends AsanaActivityDeleteArgs>(
      args: SelectSubset<T, AsanaActivityDeleteArgs<ExtArgs>>
    ): Prisma__AsanaActivityClient<
      $Result.GetResult<Prisma.$AsanaActivityPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >

    /**
     * Update one AsanaActivity.
     * @param {AsanaActivityUpdateArgs} args - Arguments to update one AsanaActivity.
     * @example
     * // Update one AsanaActivity
     * const asanaActivity = await prisma.asanaActivity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AsanaActivityUpdateArgs>(
      args: SelectSubset<T, AsanaActivityUpdateArgs<ExtArgs>>
    ): Prisma__AsanaActivityClient<
      $Result.GetResult<Prisma.$AsanaActivityPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >

    /**
     * Delete zero or more AsanaActivities.
     * @param {AsanaActivityDeleteManyArgs} args - Arguments to filter AsanaActivities to delete.
     * @example
     * // Delete a few AsanaActivities
     * const { count } = await prisma.asanaActivity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AsanaActivityDeleteManyArgs>(
      args?: SelectSubset<T, AsanaActivityDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AsanaActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaActivityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AsanaActivities
     * const asanaActivity = await prisma.asanaActivity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AsanaActivityUpdateManyArgs>(
      args: SelectSubset<T, AsanaActivityUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AsanaActivity.
     * @param {AsanaActivityUpsertArgs} args - Arguments to update or create a AsanaActivity.
     * @example
     * // Update or create a AsanaActivity
     * const asanaActivity = await prisma.asanaActivity.upsert({
     *   create: {
     *     // ... data to create a AsanaActivity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AsanaActivity we want to update
     *   }
     * })
     */
    upsert<T extends AsanaActivityUpsertArgs>(
      args: SelectSubset<T, AsanaActivityUpsertArgs<ExtArgs>>
    ): Prisma__AsanaActivityClient<
      $Result.GetResult<Prisma.$AsanaActivityPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >

    /**
     * Find zero or more AsanaActivities that matches the filter.
     * @param {AsanaActivityFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const asanaActivity = await prisma.asanaActivity.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: AsanaActivityFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a AsanaActivity.
     * @param {AsanaActivityAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const asanaActivity = await prisma.asanaActivity.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(
      args?: AsanaActivityAggregateRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Count the number of AsanaActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaActivityCountArgs} args - Arguments to filter AsanaActivities to count.
     * @example
     * // Count the number of AsanaActivities
     * const count = await prisma.asanaActivity.count({
     *   where: {
     *     // ... the filter for the AsanaActivities we want to count
     *   }
     * })
     **/
    count<T extends AsanaActivityCountArgs>(
      args?: Subset<T, AsanaActivityCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AsanaActivityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AsanaActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaActivityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AsanaActivityAggregateArgs>(
      args: Subset<T, AsanaActivityAggregateArgs>
    ): Prisma.PrismaPromise<GetAsanaActivityAggregateType<T>>

    /**
     * Group by AsanaActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsanaActivityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AsanaActivityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AsanaActivityGroupByArgs['orderBy'] }
        : { orderBy?: AsanaActivityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AsanaActivityGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetAsanaActivityGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the AsanaActivity model
     */
    readonly fields: AsanaActivityFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for AsanaActivity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AsanaActivityClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    user<T extends UserDataDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDataDefaultArgs<ExtArgs>>
    ): Prisma__UserDataClient<
      | $Result.GetResult<
          Prisma.$UserDataPayload<ExtArgs>,
          T,
          'findUniqueOrThrow'
        >
      | Null,
      Null,
      ExtArgs
    >
    posture<T extends AsanaPostureDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, AsanaPostureDefaultArgs<ExtArgs>>
    ): Prisma__AsanaPostureClient<
      | $Result.GetResult<
          Prisma.$AsanaPosturePayload<ExtArgs>,
          T,
          'findUniqueOrThrow'
        >
      | Null,
      Null,
      ExtArgs
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the AsanaActivity model
   */
  interface AsanaActivityFieldRefs {
    readonly id: FieldRef<'AsanaActivity', 'String'>
    readonly userId: FieldRef<'AsanaActivity', 'String'>
    readonly postureId: FieldRef<'AsanaActivity', 'String'>
    readonly postureName: FieldRef<'AsanaActivity', 'String'>
    readonly sort_english_name: FieldRef<'AsanaActivity', 'String'>
    readonly duration: FieldRef<'AsanaActivity', 'Int'>
    readonly datePerformed: FieldRef<'AsanaActivity', 'DateTime'>
    readonly notes: FieldRef<'AsanaActivity', 'String'>
    readonly sensations: FieldRef<'AsanaActivity', 'String'>
    readonly completionStatus: FieldRef<'AsanaActivity', 'String'>
    readonly difficulty: FieldRef<'AsanaActivity', 'String'>
    readonly createdAt: FieldRef<'AsanaActivity', 'DateTime'>
    readonly updatedAt: FieldRef<'AsanaActivity', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * AsanaActivity findUnique
   */
  export type AsanaActivityFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaActivity
     */
    select?: AsanaActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaActivityInclude<ExtArgs> | null
    /**
     * Filter, which AsanaActivity to fetch.
     */
    where: AsanaActivityWhereUniqueInput
  }

  /**
   * AsanaActivity findUniqueOrThrow
   */
  export type AsanaActivityFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaActivity
     */
    select?: AsanaActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaActivityInclude<ExtArgs> | null
    /**
     * Filter, which AsanaActivity to fetch.
     */
    where: AsanaActivityWhereUniqueInput
  }

  /**
   * AsanaActivity findFirst
   */
  export type AsanaActivityFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaActivity
     */
    select?: AsanaActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaActivityInclude<ExtArgs> | null
    /**
     * Filter, which AsanaActivity to fetch.
     */
    where?: AsanaActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AsanaActivities to fetch.
     */
    orderBy?:
      | AsanaActivityOrderByWithRelationInput
      | AsanaActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AsanaActivities.
     */
    cursor?: AsanaActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AsanaActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AsanaActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AsanaActivities.
     */
    distinct?: AsanaActivityScalarFieldEnum | AsanaActivityScalarFieldEnum[]
  }

  /**
   * AsanaActivity findFirstOrThrow
   */
  export type AsanaActivityFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaActivity
     */
    select?: AsanaActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaActivityInclude<ExtArgs> | null
    /**
     * Filter, which AsanaActivity to fetch.
     */
    where?: AsanaActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AsanaActivities to fetch.
     */
    orderBy?:
      | AsanaActivityOrderByWithRelationInput
      | AsanaActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AsanaActivities.
     */
    cursor?: AsanaActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AsanaActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AsanaActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AsanaActivities.
     */
    distinct?: AsanaActivityScalarFieldEnum | AsanaActivityScalarFieldEnum[]
  }

  /**
   * AsanaActivity findMany
   */
  export type AsanaActivityFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaActivity
     */
    select?: AsanaActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaActivityInclude<ExtArgs> | null
    /**
     * Filter, which AsanaActivities to fetch.
     */
    where?: AsanaActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AsanaActivities to fetch.
     */
    orderBy?:
      | AsanaActivityOrderByWithRelationInput
      | AsanaActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AsanaActivities.
     */
    cursor?: AsanaActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AsanaActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AsanaActivities.
     */
    skip?: number
    distinct?: AsanaActivityScalarFieldEnum | AsanaActivityScalarFieldEnum[]
  }

  /**
   * AsanaActivity create
   */
  export type AsanaActivityCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaActivity
     */
    select?: AsanaActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaActivityInclude<ExtArgs> | null
    /**
     * The data needed to create a AsanaActivity.
     */
    data: XOR<AsanaActivityCreateInput, AsanaActivityUncheckedCreateInput>
  }

  /**
   * AsanaActivity createMany
   */
  export type AsanaActivityCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many AsanaActivities.
     */
    data: AsanaActivityCreateManyInput | AsanaActivityCreateManyInput[]
  }

  /**
   * AsanaActivity update
   */
  export type AsanaActivityUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaActivity
     */
    select?: AsanaActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaActivityInclude<ExtArgs> | null
    /**
     * The data needed to update a AsanaActivity.
     */
    data: XOR<AsanaActivityUpdateInput, AsanaActivityUncheckedUpdateInput>
    /**
     * Choose, which AsanaActivity to update.
     */
    where: AsanaActivityWhereUniqueInput
  }

  /**
   * AsanaActivity updateMany
   */
  export type AsanaActivityUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update AsanaActivities.
     */
    data: XOR<
      AsanaActivityUpdateManyMutationInput,
      AsanaActivityUncheckedUpdateManyInput
    >
    /**
     * Filter which AsanaActivities to update
     */
    where?: AsanaActivityWhereInput
  }

  /**
   * AsanaActivity upsert
   */
  export type AsanaActivityUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaActivity
     */
    select?: AsanaActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaActivityInclude<ExtArgs> | null
    /**
     * The filter to search for the AsanaActivity to update in case it exists.
     */
    where: AsanaActivityWhereUniqueInput
    /**
     * In case the AsanaActivity found by the `where` argument doesn't exist, create a new AsanaActivity with this data.
     */
    create: XOR<AsanaActivityCreateInput, AsanaActivityUncheckedCreateInput>
    /**
     * In case the AsanaActivity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AsanaActivityUpdateInput, AsanaActivityUncheckedUpdateInput>
  }

  /**
   * AsanaActivity delete
   */
  export type AsanaActivityDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaActivity
     */
    select?: AsanaActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaActivityInclude<ExtArgs> | null
    /**
     * Filter which AsanaActivity to delete.
     */
    where: AsanaActivityWhereUniqueInput
  }

  /**
   * AsanaActivity deleteMany
   */
  export type AsanaActivityDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AsanaActivities to delete
     */
    where?: AsanaActivityWhereInput
  }

  /**
   * AsanaActivity findRaw
   */
  export type AsanaActivityFindRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * AsanaActivity aggregateRaw
   */
  export type AsanaActivityAggregateRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * AsanaActivity without action
   */
  export type AsanaActivityDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaActivity
     */
    select?: AsanaActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaActivityInclude<ExtArgs> | null
  }

  /**
   * Model SeriesActivity
   */

  export type AggregateSeriesActivity = {
    _count: SeriesActivityCountAggregateOutputType | null
    _avg: SeriesActivityAvgAggregateOutputType | null
    _sum: SeriesActivitySumAggregateOutputType | null
    _min: SeriesActivityMinAggregateOutputType | null
    _max: SeriesActivityMaxAggregateOutputType | null
  }

  export type SeriesActivityAvgAggregateOutputType = {
    duration: number | null
  }

  export type SeriesActivitySumAggregateOutputType = {
    duration: number | null
  }

  export type SeriesActivityMinAggregateOutputType = {
    id: string | null
    userId: string | null
    seriesId: string | null
    seriesName: string | null
    datePerformed: Date | null
    difficulty: string | null
    completionStatus: string | null
    duration: number | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SeriesActivityMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    seriesId: string | null
    seriesName: string | null
    datePerformed: Date | null
    difficulty: string | null
    completionStatus: string | null
    duration: number | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SeriesActivityCountAggregateOutputType = {
    id: number
    userId: number
    seriesId: number
    seriesName: number
    datePerformed: number
    difficulty: number
    completionStatus: number
    duration: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }

  export type SeriesActivityAvgAggregateInputType = {
    duration?: true
  }

  export type SeriesActivitySumAggregateInputType = {
    duration?: true
  }

  export type SeriesActivityMinAggregateInputType = {
    id?: true
    userId?: true
    seriesId?: true
    seriesName?: true
    datePerformed?: true
    difficulty?: true
    completionStatus?: true
    duration?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SeriesActivityMaxAggregateInputType = {
    id?: true
    userId?: true
    seriesId?: true
    seriesName?: true
    datePerformed?: true
    difficulty?: true
    completionStatus?: true
    duration?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SeriesActivityCountAggregateInputType = {
    id?: true
    userId?: true
    seriesId?: true
    seriesName?: true
    datePerformed?: true
    difficulty?: true
    completionStatus?: true
    duration?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SeriesActivityAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which SeriesActivity to aggregate.
     */
    where?: SeriesActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeriesActivities to fetch.
     */
    orderBy?:
      | SeriesActivityOrderByWithRelationInput
      | SeriesActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: SeriesActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeriesActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeriesActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned SeriesActivities
     **/
    _count?: true | SeriesActivityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: SeriesActivityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: SeriesActivitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: SeriesActivityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: SeriesActivityMaxAggregateInputType
  }

  export type GetSeriesActivityAggregateType<
    T extends SeriesActivityAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateSeriesActivity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSeriesActivity[P]>
      : GetScalarType<T[P], AggregateSeriesActivity[P]>
  }

  export type SeriesActivityGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: SeriesActivityWhereInput
    orderBy?:
      | SeriesActivityOrderByWithAggregationInput
      | SeriesActivityOrderByWithAggregationInput[]
    by: SeriesActivityScalarFieldEnum[] | SeriesActivityScalarFieldEnum
    having?: SeriesActivityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SeriesActivityCountAggregateInputType | true
    _avg?: SeriesActivityAvgAggregateInputType
    _sum?: SeriesActivitySumAggregateInputType
    _min?: SeriesActivityMinAggregateInputType
    _max?: SeriesActivityMaxAggregateInputType
  }

  export type SeriesActivityGroupByOutputType = {
    id: string
    userId: string
    seriesId: string
    seriesName: string
    datePerformed: Date
    difficulty: string | null
    completionStatus: string
    duration: number
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: SeriesActivityCountAggregateOutputType | null
    _avg: SeriesActivityAvgAggregateOutputType | null
    _sum: SeriesActivitySumAggregateOutputType | null
    _min: SeriesActivityMinAggregateOutputType | null
    _max: SeriesActivityMaxAggregateOutputType | null
  }

  type GetSeriesActivityGroupByPayload<T extends SeriesActivityGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<SeriesActivityGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof SeriesActivityGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SeriesActivityGroupByOutputType[P]>
            : GetScalarType<T[P], SeriesActivityGroupByOutputType[P]>
        }
      >
    >

  export type SeriesActivitySelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      userId?: boolean
      seriesId?: boolean
      seriesName?: boolean
      datePerformed?: boolean
      difficulty?: boolean
      completionStatus?: boolean
      duration?: boolean
      notes?: boolean
      createdAt?: boolean
      updatedAt?: boolean
      user?: boolean | UserDataDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['seriesActivity']
  >

  export type SeriesActivitySelectScalar = {
    id?: boolean
    userId?: boolean
    seriesId?: boolean
    seriesName?: boolean
    datePerformed?: boolean
    difficulty?: boolean
    completionStatus?: boolean
    duration?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SeriesActivityInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDataDefaultArgs<ExtArgs>
  }

  export type $SeriesActivityPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'SeriesActivity'
    objects: {
      user: Prisma.$UserDataPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        userId: string
        seriesId: string
        seriesName: string
        datePerformed: Date
        difficulty: string | null
        completionStatus: string
        duration: number
        notes: string | null
        createdAt: Date
        updatedAt: Date
      },
      ExtArgs['result']['seriesActivity']
    >
    composites: {}
  }

  type SeriesActivityGetPayload<
    S extends boolean | null | undefined | SeriesActivityDefaultArgs,
  > = $Result.GetResult<Prisma.$SeriesActivityPayload, S>

  type SeriesActivityCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<SeriesActivityFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: SeriesActivityCountAggregateInputType | true
  }

  export interface SeriesActivityDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['SeriesActivity']
      meta: { name: 'SeriesActivity' }
    }
    /**
     * Find zero or one SeriesActivity that matches the filter.
     * @param {SeriesActivityFindUniqueArgs} args - Arguments to find a SeriesActivity
     * @example
     * // Get one SeriesActivity
     * const seriesActivity = await prisma.seriesActivity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SeriesActivityFindUniqueArgs>(
      args: SelectSubset<T, SeriesActivityFindUniqueArgs<ExtArgs>>
    ): Prisma__SeriesActivityClient<
      $Result.GetResult<
        Prisma.$SeriesActivityPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find one SeriesActivity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SeriesActivityFindUniqueOrThrowArgs} args - Arguments to find a SeriesActivity
     * @example
     * // Get one SeriesActivity
     * const seriesActivity = await prisma.seriesActivity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SeriesActivityFindUniqueOrThrowArgs>(
      args: SelectSubset<T, SeriesActivityFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SeriesActivityClient<
      $Result.GetResult<
        Prisma.$SeriesActivityPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find the first SeriesActivity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesActivityFindFirstArgs} args - Arguments to find a SeriesActivity
     * @example
     * // Get one SeriesActivity
     * const seriesActivity = await prisma.seriesActivity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SeriesActivityFindFirstArgs>(
      args?: SelectSubset<T, SeriesActivityFindFirstArgs<ExtArgs>>
    ): Prisma__SeriesActivityClient<
      $Result.GetResult<
        Prisma.$SeriesActivityPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find the first SeriesActivity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesActivityFindFirstOrThrowArgs} args - Arguments to find a SeriesActivity
     * @example
     * // Get one SeriesActivity
     * const seriesActivity = await prisma.seriesActivity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SeriesActivityFindFirstOrThrowArgs>(
      args?: SelectSubset<T, SeriesActivityFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SeriesActivityClient<
      $Result.GetResult<
        Prisma.$SeriesActivityPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find zero or more SeriesActivities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesActivityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SeriesActivities
     * const seriesActivities = await prisma.seriesActivity.findMany()
     *
     * // Get first 10 SeriesActivities
     * const seriesActivities = await prisma.seriesActivity.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const seriesActivityWithIdOnly = await prisma.seriesActivity.findMany({ select: { id: true } })
     *
     */
    findMany<T extends SeriesActivityFindManyArgs>(
      args?: SelectSubset<T, SeriesActivityFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$SeriesActivityPayload<ExtArgs>, T, 'findMany'>
    >

    /**
     * Create a SeriesActivity.
     * @param {SeriesActivityCreateArgs} args - Arguments to create a SeriesActivity.
     * @example
     * // Create one SeriesActivity
     * const SeriesActivity = await prisma.seriesActivity.create({
     *   data: {
     *     // ... data to create a SeriesActivity
     *   }
     * })
     *
     */
    create<T extends SeriesActivityCreateArgs>(
      args: SelectSubset<T, SeriesActivityCreateArgs<ExtArgs>>
    ): Prisma__SeriesActivityClient<
      $Result.GetResult<Prisma.$SeriesActivityPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >

    /**
     * Create many SeriesActivities.
     * @param {SeriesActivityCreateManyArgs} args - Arguments to create many SeriesActivities.
     * @example
     * // Create many SeriesActivities
     * const seriesActivity = await prisma.seriesActivity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SeriesActivityCreateManyArgs>(
      args?: SelectSubset<T, SeriesActivityCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SeriesActivity.
     * @param {SeriesActivityDeleteArgs} args - Arguments to delete one SeriesActivity.
     * @example
     * // Delete one SeriesActivity
     * const SeriesActivity = await prisma.seriesActivity.delete({
     *   where: {
     *     // ... filter to delete one SeriesActivity
     *   }
     * })
     *
     */
    delete<T extends SeriesActivityDeleteArgs>(
      args: SelectSubset<T, SeriesActivityDeleteArgs<ExtArgs>>
    ): Prisma__SeriesActivityClient<
      $Result.GetResult<Prisma.$SeriesActivityPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >

    /**
     * Update one SeriesActivity.
     * @param {SeriesActivityUpdateArgs} args - Arguments to update one SeriesActivity.
     * @example
     * // Update one SeriesActivity
     * const seriesActivity = await prisma.seriesActivity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SeriesActivityUpdateArgs>(
      args: SelectSubset<T, SeriesActivityUpdateArgs<ExtArgs>>
    ): Prisma__SeriesActivityClient<
      $Result.GetResult<Prisma.$SeriesActivityPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >

    /**
     * Delete zero or more SeriesActivities.
     * @param {SeriesActivityDeleteManyArgs} args - Arguments to filter SeriesActivities to delete.
     * @example
     * // Delete a few SeriesActivities
     * const { count } = await prisma.seriesActivity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SeriesActivityDeleteManyArgs>(
      args?: SelectSubset<T, SeriesActivityDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SeriesActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesActivityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SeriesActivities
     * const seriesActivity = await prisma.seriesActivity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SeriesActivityUpdateManyArgs>(
      args: SelectSubset<T, SeriesActivityUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SeriesActivity.
     * @param {SeriesActivityUpsertArgs} args - Arguments to update or create a SeriesActivity.
     * @example
     * // Update or create a SeriesActivity
     * const seriesActivity = await prisma.seriesActivity.upsert({
     *   create: {
     *     // ... data to create a SeriesActivity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SeriesActivity we want to update
     *   }
     * })
     */
    upsert<T extends SeriesActivityUpsertArgs>(
      args: SelectSubset<T, SeriesActivityUpsertArgs<ExtArgs>>
    ): Prisma__SeriesActivityClient<
      $Result.GetResult<Prisma.$SeriesActivityPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >

    /**
     * Find zero or more SeriesActivities that matches the filter.
     * @param {SeriesActivityFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const seriesActivity = await prisma.seriesActivity.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: SeriesActivityFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a SeriesActivity.
     * @param {SeriesActivityAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const seriesActivity = await prisma.seriesActivity.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(
      args?: SeriesActivityAggregateRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Count the number of SeriesActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesActivityCountArgs} args - Arguments to filter SeriesActivities to count.
     * @example
     * // Count the number of SeriesActivities
     * const count = await prisma.seriesActivity.count({
     *   where: {
     *     // ... the filter for the SeriesActivities we want to count
     *   }
     * })
     **/
    count<T extends SeriesActivityCountArgs>(
      args?: Subset<T, SeriesActivityCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SeriesActivityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SeriesActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesActivityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends SeriesActivityAggregateArgs>(
      args: Subset<T, SeriesActivityAggregateArgs>
    ): Prisma.PrismaPromise<GetSeriesActivityAggregateType<T>>

    /**
     * Group by SeriesActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesActivityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends SeriesActivityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SeriesActivityGroupByArgs['orderBy'] }
        : { orderBy?: SeriesActivityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, SeriesActivityGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetSeriesActivityGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the SeriesActivity model
     */
    readonly fields: SeriesActivityFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for SeriesActivity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SeriesActivityClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    user<T extends UserDataDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDataDefaultArgs<ExtArgs>>
    ): Prisma__UserDataClient<
      | $Result.GetResult<
          Prisma.$UserDataPayload<ExtArgs>,
          T,
          'findUniqueOrThrow'
        >
      | Null,
      Null,
      ExtArgs
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the SeriesActivity model
   */
  interface SeriesActivityFieldRefs {
    readonly id: FieldRef<'SeriesActivity', 'String'>
    readonly userId: FieldRef<'SeriesActivity', 'String'>
    readonly seriesId: FieldRef<'SeriesActivity', 'String'>
    readonly seriesName: FieldRef<'SeriesActivity', 'String'>
    readonly datePerformed: FieldRef<'SeriesActivity', 'DateTime'>
    readonly difficulty: FieldRef<'SeriesActivity', 'String'>
    readonly completionStatus: FieldRef<'SeriesActivity', 'String'>
    readonly duration: FieldRef<'SeriesActivity', 'Int'>
    readonly notes: FieldRef<'SeriesActivity', 'String'>
    readonly createdAt: FieldRef<'SeriesActivity', 'DateTime'>
    readonly updatedAt: FieldRef<'SeriesActivity', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * SeriesActivity findUnique
   */
  export type SeriesActivityFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SeriesActivity
     */
    select?: SeriesActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesActivityInclude<ExtArgs> | null
    /**
     * Filter, which SeriesActivity to fetch.
     */
    where: SeriesActivityWhereUniqueInput
  }

  /**
   * SeriesActivity findUniqueOrThrow
   */
  export type SeriesActivityFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SeriesActivity
     */
    select?: SeriesActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesActivityInclude<ExtArgs> | null
    /**
     * Filter, which SeriesActivity to fetch.
     */
    where: SeriesActivityWhereUniqueInput
  }

  /**
   * SeriesActivity findFirst
   */
  export type SeriesActivityFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SeriesActivity
     */
    select?: SeriesActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesActivityInclude<ExtArgs> | null
    /**
     * Filter, which SeriesActivity to fetch.
     */
    where?: SeriesActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeriesActivities to fetch.
     */
    orderBy?:
      | SeriesActivityOrderByWithRelationInput
      | SeriesActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SeriesActivities.
     */
    cursor?: SeriesActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeriesActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeriesActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SeriesActivities.
     */
    distinct?: SeriesActivityScalarFieldEnum | SeriesActivityScalarFieldEnum[]
  }

  /**
   * SeriesActivity findFirstOrThrow
   */
  export type SeriesActivityFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SeriesActivity
     */
    select?: SeriesActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesActivityInclude<ExtArgs> | null
    /**
     * Filter, which SeriesActivity to fetch.
     */
    where?: SeriesActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeriesActivities to fetch.
     */
    orderBy?:
      | SeriesActivityOrderByWithRelationInput
      | SeriesActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SeriesActivities.
     */
    cursor?: SeriesActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeriesActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeriesActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SeriesActivities.
     */
    distinct?: SeriesActivityScalarFieldEnum | SeriesActivityScalarFieldEnum[]
  }

  /**
   * SeriesActivity findMany
   */
  export type SeriesActivityFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SeriesActivity
     */
    select?: SeriesActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesActivityInclude<ExtArgs> | null
    /**
     * Filter, which SeriesActivities to fetch.
     */
    where?: SeriesActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SeriesActivities to fetch.
     */
    orderBy?:
      | SeriesActivityOrderByWithRelationInput
      | SeriesActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing SeriesActivities.
     */
    cursor?: SeriesActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SeriesActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SeriesActivities.
     */
    skip?: number
    distinct?: SeriesActivityScalarFieldEnum | SeriesActivityScalarFieldEnum[]
  }

  /**
   * SeriesActivity create
   */
  export type SeriesActivityCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SeriesActivity
     */
    select?: SeriesActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesActivityInclude<ExtArgs> | null
    /**
     * The data needed to create a SeriesActivity.
     */
    data: XOR<SeriesActivityCreateInput, SeriesActivityUncheckedCreateInput>
  }

  /**
   * SeriesActivity createMany
   */
  export type SeriesActivityCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many SeriesActivities.
     */
    data: SeriesActivityCreateManyInput | SeriesActivityCreateManyInput[]
  }

  /**
   * SeriesActivity update
   */
  export type SeriesActivityUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SeriesActivity
     */
    select?: SeriesActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesActivityInclude<ExtArgs> | null
    /**
     * The data needed to update a SeriesActivity.
     */
    data: XOR<SeriesActivityUpdateInput, SeriesActivityUncheckedUpdateInput>
    /**
     * Choose, which SeriesActivity to update.
     */
    where: SeriesActivityWhereUniqueInput
  }

  /**
   * SeriesActivity updateMany
   */
  export type SeriesActivityUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update SeriesActivities.
     */
    data: XOR<
      SeriesActivityUpdateManyMutationInput,
      SeriesActivityUncheckedUpdateManyInput
    >
    /**
     * Filter which SeriesActivities to update
     */
    where?: SeriesActivityWhereInput
  }

  /**
   * SeriesActivity upsert
   */
  export type SeriesActivityUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SeriesActivity
     */
    select?: SeriesActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesActivityInclude<ExtArgs> | null
    /**
     * The filter to search for the SeriesActivity to update in case it exists.
     */
    where: SeriesActivityWhereUniqueInput
    /**
     * In case the SeriesActivity found by the `where` argument doesn't exist, create a new SeriesActivity with this data.
     */
    create: XOR<SeriesActivityCreateInput, SeriesActivityUncheckedCreateInput>
    /**
     * In case the SeriesActivity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SeriesActivityUpdateInput, SeriesActivityUncheckedUpdateInput>
  }

  /**
   * SeriesActivity delete
   */
  export type SeriesActivityDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SeriesActivity
     */
    select?: SeriesActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesActivityInclude<ExtArgs> | null
    /**
     * Filter which SeriesActivity to delete.
     */
    where: SeriesActivityWhereUniqueInput
  }

  /**
   * SeriesActivity deleteMany
   */
  export type SeriesActivityDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which SeriesActivities to delete
     */
    where?: SeriesActivityWhereInput
  }

  /**
   * SeriesActivity findRaw
   */
  export type SeriesActivityFindRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * SeriesActivity aggregateRaw
   */
  export type SeriesActivityAggregateRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * SeriesActivity without action
   */
  export type SeriesActivityDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SeriesActivity
     */
    select?: SeriesActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesActivityInclude<ExtArgs> | null
  }

  /**
   * Model SequenceActivity
   */

  export type AggregateSequenceActivity = {
    _count: SequenceActivityCountAggregateOutputType | null
    _avg: SequenceActivityAvgAggregateOutputType | null
    _sum: SequenceActivitySumAggregateOutputType | null
    _min: SequenceActivityMinAggregateOutputType | null
    _max: SequenceActivityMaxAggregateOutputType | null
  }

  export type SequenceActivityAvgAggregateOutputType = {
    duration: number | null
  }

  export type SequenceActivitySumAggregateOutputType = {
    duration: number | null
  }

  export type SequenceActivityMinAggregateOutputType = {
    id: string | null
    userId: string | null
    sequenceId: string | null
    sequenceName: string | null
    datePerformed: Date | null
    difficulty: string | null
    completionStatus: string | null
    duration: number | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SequenceActivityMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    sequenceId: string | null
    sequenceName: string | null
    datePerformed: Date | null
    difficulty: string | null
    completionStatus: string | null
    duration: number | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SequenceActivityCountAggregateOutputType = {
    id: number
    userId: number
    sequenceId: number
    sequenceName: number
    datePerformed: number
    difficulty: number
    completionStatus: number
    duration: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }

  export type SequenceActivityAvgAggregateInputType = {
    duration?: true
  }

  export type SequenceActivitySumAggregateInputType = {
    duration?: true
  }

  export type SequenceActivityMinAggregateInputType = {
    id?: true
    userId?: true
    sequenceId?: true
    sequenceName?: true
    datePerformed?: true
    difficulty?: true
    completionStatus?: true
    duration?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SequenceActivityMaxAggregateInputType = {
    id?: true
    userId?: true
    sequenceId?: true
    sequenceName?: true
    datePerformed?: true
    difficulty?: true
    completionStatus?: true
    duration?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SequenceActivityCountAggregateInputType = {
    id?: true
    userId?: true
    sequenceId?: true
    sequenceName?: true
    datePerformed?: true
    difficulty?: true
    completionStatus?: true
    duration?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SequenceActivityAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which SequenceActivity to aggregate.
     */
    where?: SequenceActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SequenceActivities to fetch.
     */
    orderBy?:
      | SequenceActivityOrderByWithRelationInput
      | SequenceActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: SequenceActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SequenceActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SequenceActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned SequenceActivities
     **/
    _count?: true | SequenceActivityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: SequenceActivityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: SequenceActivitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: SequenceActivityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: SequenceActivityMaxAggregateInputType
  }

  export type GetSequenceActivityAggregateType<
    T extends SequenceActivityAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateSequenceActivity]: P extends
      | '_count'
      | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSequenceActivity[P]>
      : GetScalarType<T[P], AggregateSequenceActivity[P]>
  }

  export type SequenceActivityGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: SequenceActivityWhereInput
    orderBy?:
      | SequenceActivityOrderByWithAggregationInput
      | SequenceActivityOrderByWithAggregationInput[]
    by: SequenceActivityScalarFieldEnum[] | SequenceActivityScalarFieldEnum
    having?: SequenceActivityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SequenceActivityCountAggregateInputType | true
    _avg?: SequenceActivityAvgAggregateInputType
    _sum?: SequenceActivitySumAggregateInputType
    _min?: SequenceActivityMinAggregateInputType
    _max?: SequenceActivityMaxAggregateInputType
  }

  export type SequenceActivityGroupByOutputType = {
    id: string
    userId: string
    sequenceId: string
    sequenceName: string
    datePerformed: Date
    difficulty: string | null
    completionStatus: string
    duration: number
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: SequenceActivityCountAggregateOutputType | null
    _avg: SequenceActivityAvgAggregateOutputType | null
    _sum: SequenceActivitySumAggregateOutputType | null
    _min: SequenceActivityMinAggregateOutputType | null
    _max: SequenceActivityMaxAggregateOutputType | null
  }

  type GetSequenceActivityGroupByPayload<
    T extends SequenceActivityGroupByArgs,
  > = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SequenceActivityGroupByOutputType, T['by']> & {
        [P in keyof T &
          keyof SequenceActivityGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], SequenceActivityGroupByOutputType[P]>
          : GetScalarType<T[P], SequenceActivityGroupByOutputType[P]>
      }
    >
  >

  export type SequenceActivitySelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      userId?: boolean
      sequenceId?: boolean
      sequenceName?: boolean
      datePerformed?: boolean
      difficulty?: boolean
      completionStatus?: boolean
      duration?: boolean
      notes?: boolean
      createdAt?: boolean
      updatedAt?: boolean
      user?: boolean | UserDataDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['sequenceActivity']
  >

  export type SequenceActivitySelectScalar = {
    id?: boolean
    userId?: boolean
    sequenceId?: boolean
    sequenceName?: boolean
    datePerformed?: boolean
    difficulty?: boolean
    completionStatus?: boolean
    duration?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SequenceActivityInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDataDefaultArgs<ExtArgs>
  }

  export type $SequenceActivityPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'SequenceActivity'
    objects: {
      user: Prisma.$UserDataPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        userId: string
        sequenceId: string
        sequenceName: string
        datePerformed: Date
        difficulty: string | null
        completionStatus: string
        duration: number
        notes: string | null
        createdAt: Date
        updatedAt: Date
      },
      ExtArgs['result']['sequenceActivity']
    >
    composites: {}
  }

  type SequenceActivityGetPayload<
    S extends boolean | null | undefined | SequenceActivityDefaultArgs,
  > = $Result.GetResult<Prisma.$SequenceActivityPayload, S>

  type SequenceActivityCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<SequenceActivityFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: SequenceActivityCountAggregateInputType | true
  }

  export interface SequenceActivityDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['SequenceActivity']
      meta: { name: 'SequenceActivity' }
    }
    /**
     * Find zero or one SequenceActivity that matches the filter.
     * @param {SequenceActivityFindUniqueArgs} args - Arguments to find a SequenceActivity
     * @example
     * // Get one SequenceActivity
     * const sequenceActivity = await prisma.sequenceActivity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SequenceActivityFindUniqueArgs>(
      args: SelectSubset<T, SequenceActivityFindUniqueArgs<ExtArgs>>
    ): Prisma__SequenceActivityClient<
      $Result.GetResult<
        Prisma.$SequenceActivityPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find one SequenceActivity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SequenceActivityFindUniqueOrThrowArgs} args - Arguments to find a SequenceActivity
     * @example
     * // Get one SequenceActivity
     * const sequenceActivity = await prisma.sequenceActivity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SequenceActivityFindUniqueOrThrowArgs>(
      args: SelectSubset<T, SequenceActivityFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SequenceActivityClient<
      $Result.GetResult<
        Prisma.$SequenceActivityPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find the first SequenceActivity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequenceActivityFindFirstArgs} args - Arguments to find a SequenceActivity
     * @example
     * // Get one SequenceActivity
     * const sequenceActivity = await prisma.sequenceActivity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SequenceActivityFindFirstArgs>(
      args?: SelectSubset<T, SequenceActivityFindFirstArgs<ExtArgs>>
    ): Prisma__SequenceActivityClient<
      $Result.GetResult<
        Prisma.$SequenceActivityPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find the first SequenceActivity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequenceActivityFindFirstOrThrowArgs} args - Arguments to find a SequenceActivity
     * @example
     * // Get one SequenceActivity
     * const sequenceActivity = await prisma.sequenceActivity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SequenceActivityFindFirstOrThrowArgs>(
      args?: SelectSubset<T, SequenceActivityFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SequenceActivityClient<
      $Result.GetResult<
        Prisma.$SequenceActivityPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find zero or more SequenceActivities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequenceActivityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SequenceActivities
     * const sequenceActivities = await prisma.sequenceActivity.findMany()
     *
     * // Get first 10 SequenceActivities
     * const sequenceActivities = await prisma.sequenceActivity.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const sequenceActivityWithIdOnly = await prisma.sequenceActivity.findMany({ select: { id: true } })
     *
     */
    findMany<T extends SequenceActivityFindManyArgs>(
      args?: SelectSubset<T, SequenceActivityFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$SequenceActivityPayload<ExtArgs>, T, 'findMany'>
    >

    /**
     * Create a SequenceActivity.
     * @param {SequenceActivityCreateArgs} args - Arguments to create a SequenceActivity.
     * @example
     * // Create one SequenceActivity
     * const SequenceActivity = await prisma.sequenceActivity.create({
     *   data: {
     *     // ... data to create a SequenceActivity
     *   }
     * })
     *
     */
    create<T extends SequenceActivityCreateArgs>(
      args: SelectSubset<T, SequenceActivityCreateArgs<ExtArgs>>
    ): Prisma__SequenceActivityClient<
      $Result.GetResult<Prisma.$SequenceActivityPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >

    /**
     * Create many SequenceActivities.
     * @param {SequenceActivityCreateManyArgs} args - Arguments to create many SequenceActivities.
     * @example
     * // Create many SequenceActivities
     * const sequenceActivity = await prisma.sequenceActivity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SequenceActivityCreateManyArgs>(
      args?: SelectSubset<T, SequenceActivityCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SequenceActivity.
     * @param {SequenceActivityDeleteArgs} args - Arguments to delete one SequenceActivity.
     * @example
     * // Delete one SequenceActivity
     * const SequenceActivity = await prisma.sequenceActivity.delete({
     *   where: {
     *     // ... filter to delete one SequenceActivity
     *   }
     * })
     *
     */
    delete<T extends SequenceActivityDeleteArgs>(
      args: SelectSubset<T, SequenceActivityDeleteArgs<ExtArgs>>
    ): Prisma__SequenceActivityClient<
      $Result.GetResult<Prisma.$SequenceActivityPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >

    /**
     * Update one SequenceActivity.
     * @param {SequenceActivityUpdateArgs} args - Arguments to update one SequenceActivity.
     * @example
     * // Update one SequenceActivity
     * const sequenceActivity = await prisma.sequenceActivity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SequenceActivityUpdateArgs>(
      args: SelectSubset<T, SequenceActivityUpdateArgs<ExtArgs>>
    ): Prisma__SequenceActivityClient<
      $Result.GetResult<Prisma.$SequenceActivityPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >

    /**
     * Delete zero or more SequenceActivities.
     * @param {SequenceActivityDeleteManyArgs} args - Arguments to filter SequenceActivities to delete.
     * @example
     * // Delete a few SequenceActivities
     * const { count } = await prisma.sequenceActivity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SequenceActivityDeleteManyArgs>(
      args?: SelectSubset<T, SequenceActivityDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SequenceActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequenceActivityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SequenceActivities
     * const sequenceActivity = await prisma.sequenceActivity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SequenceActivityUpdateManyArgs>(
      args: SelectSubset<T, SequenceActivityUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SequenceActivity.
     * @param {SequenceActivityUpsertArgs} args - Arguments to update or create a SequenceActivity.
     * @example
     * // Update or create a SequenceActivity
     * const sequenceActivity = await prisma.sequenceActivity.upsert({
     *   create: {
     *     // ... data to create a SequenceActivity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SequenceActivity we want to update
     *   }
     * })
     */
    upsert<T extends SequenceActivityUpsertArgs>(
      args: SelectSubset<T, SequenceActivityUpsertArgs<ExtArgs>>
    ): Prisma__SequenceActivityClient<
      $Result.GetResult<Prisma.$SequenceActivityPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >

    /**
     * Find zero or more SequenceActivities that matches the filter.
     * @param {SequenceActivityFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const sequenceActivity = await prisma.sequenceActivity.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(
      args?: SequenceActivityFindRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a SequenceActivity.
     * @param {SequenceActivityAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const sequenceActivity = await prisma.sequenceActivity.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(
      args?: SequenceActivityAggregateRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Count the number of SequenceActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequenceActivityCountArgs} args - Arguments to filter SequenceActivities to count.
     * @example
     * // Count the number of SequenceActivities
     * const count = await prisma.sequenceActivity.count({
     *   where: {
     *     // ... the filter for the SequenceActivities we want to count
     *   }
     * })
     **/
    count<T extends SequenceActivityCountArgs>(
      args?: Subset<T, SequenceActivityCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SequenceActivityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SequenceActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequenceActivityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends SequenceActivityAggregateArgs>(
      args: Subset<T, SequenceActivityAggregateArgs>
    ): Prisma.PrismaPromise<GetSequenceActivityAggregateType<T>>

    /**
     * Group by SequenceActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequenceActivityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends SequenceActivityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SequenceActivityGroupByArgs['orderBy'] }
        : { orderBy?: SequenceActivityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, SequenceActivityGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetSequenceActivityGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the SequenceActivity model
     */
    readonly fields: SequenceActivityFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for SequenceActivity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SequenceActivityClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    user<T extends UserDataDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDataDefaultArgs<ExtArgs>>
    ): Prisma__UserDataClient<
      | $Result.GetResult<
          Prisma.$UserDataPayload<ExtArgs>,
          T,
          'findUniqueOrThrow'
        >
      | Null,
      Null,
      ExtArgs
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the SequenceActivity model
   */
  interface SequenceActivityFieldRefs {
    readonly id: FieldRef<'SequenceActivity', 'String'>
    readonly userId: FieldRef<'SequenceActivity', 'String'>
    readonly sequenceId: FieldRef<'SequenceActivity', 'String'>
    readonly sequenceName: FieldRef<'SequenceActivity', 'String'>
    readonly datePerformed: FieldRef<'SequenceActivity', 'DateTime'>
    readonly difficulty: FieldRef<'SequenceActivity', 'String'>
    readonly completionStatus: FieldRef<'SequenceActivity', 'String'>
    readonly duration: FieldRef<'SequenceActivity', 'Int'>
    readonly notes: FieldRef<'SequenceActivity', 'String'>
    readonly createdAt: FieldRef<'SequenceActivity', 'DateTime'>
    readonly updatedAt: FieldRef<'SequenceActivity', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * SequenceActivity findUnique
   */
  export type SequenceActivityFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SequenceActivity
     */
    select?: SequenceActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceActivityInclude<ExtArgs> | null
    /**
     * Filter, which SequenceActivity to fetch.
     */
    where: SequenceActivityWhereUniqueInput
  }

  /**
   * SequenceActivity findUniqueOrThrow
   */
  export type SequenceActivityFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SequenceActivity
     */
    select?: SequenceActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceActivityInclude<ExtArgs> | null
    /**
     * Filter, which SequenceActivity to fetch.
     */
    where: SequenceActivityWhereUniqueInput
  }

  /**
   * SequenceActivity findFirst
   */
  export type SequenceActivityFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SequenceActivity
     */
    select?: SequenceActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceActivityInclude<ExtArgs> | null
    /**
     * Filter, which SequenceActivity to fetch.
     */
    where?: SequenceActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SequenceActivities to fetch.
     */
    orderBy?:
      | SequenceActivityOrderByWithRelationInput
      | SequenceActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SequenceActivities.
     */
    cursor?: SequenceActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SequenceActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SequenceActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SequenceActivities.
     */
    distinct?:
      | SequenceActivityScalarFieldEnum
      | SequenceActivityScalarFieldEnum[]
  }

  /**
   * SequenceActivity findFirstOrThrow
   */
  export type SequenceActivityFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SequenceActivity
     */
    select?: SequenceActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceActivityInclude<ExtArgs> | null
    /**
     * Filter, which SequenceActivity to fetch.
     */
    where?: SequenceActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SequenceActivities to fetch.
     */
    orderBy?:
      | SequenceActivityOrderByWithRelationInput
      | SequenceActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SequenceActivities.
     */
    cursor?: SequenceActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SequenceActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SequenceActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SequenceActivities.
     */
    distinct?:
      | SequenceActivityScalarFieldEnum
      | SequenceActivityScalarFieldEnum[]
  }

  /**
   * SequenceActivity findMany
   */
  export type SequenceActivityFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SequenceActivity
     */
    select?: SequenceActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceActivityInclude<ExtArgs> | null
    /**
     * Filter, which SequenceActivities to fetch.
     */
    where?: SequenceActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SequenceActivities to fetch.
     */
    orderBy?:
      | SequenceActivityOrderByWithRelationInput
      | SequenceActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing SequenceActivities.
     */
    cursor?: SequenceActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SequenceActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SequenceActivities.
     */
    skip?: number
    distinct?:
      | SequenceActivityScalarFieldEnum
      | SequenceActivityScalarFieldEnum[]
  }

  /**
   * SequenceActivity create
   */
  export type SequenceActivityCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SequenceActivity
     */
    select?: SequenceActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceActivityInclude<ExtArgs> | null
    /**
     * The data needed to create a SequenceActivity.
     */
    data: XOR<SequenceActivityCreateInput, SequenceActivityUncheckedCreateInput>
  }

  /**
   * SequenceActivity createMany
   */
  export type SequenceActivityCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many SequenceActivities.
     */
    data: SequenceActivityCreateManyInput | SequenceActivityCreateManyInput[]
  }

  /**
   * SequenceActivity update
   */
  export type SequenceActivityUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SequenceActivity
     */
    select?: SequenceActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceActivityInclude<ExtArgs> | null
    /**
     * The data needed to update a SequenceActivity.
     */
    data: XOR<SequenceActivityUpdateInput, SequenceActivityUncheckedUpdateInput>
    /**
     * Choose, which SequenceActivity to update.
     */
    where: SequenceActivityWhereUniqueInput
  }

  /**
   * SequenceActivity updateMany
   */
  export type SequenceActivityUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update SequenceActivities.
     */
    data: XOR<
      SequenceActivityUpdateManyMutationInput,
      SequenceActivityUncheckedUpdateManyInput
    >
    /**
     * Filter which SequenceActivities to update
     */
    where?: SequenceActivityWhereInput
  }

  /**
   * SequenceActivity upsert
   */
  export type SequenceActivityUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SequenceActivity
     */
    select?: SequenceActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceActivityInclude<ExtArgs> | null
    /**
     * The filter to search for the SequenceActivity to update in case it exists.
     */
    where: SequenceActivityWhereUniqueInput
    /**
     * In case the SequenceActivity found by the `where` argument doesn't exist, create a new SequenceActivity with this data.
     */
    create: XOR<
      SequenceActivityCreateInput,
      SequenceActivityUncheckedCreateInput
    >
    /**
     * In case the SequenceActivity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<
      SequenceActivityUpdateInput,
      SequenceActivityUncheckedUpdateInput
    >
  }

  /**
   * SequenceActivity delete
   */
  export type SequenceActivityDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SequenceActivity
     */
    select?: SequenceActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceActivityInclude<ExtArgs> | null
    /**
     * Filter which SequenceActivity to delete.
     */
    where: SequenceActivityWhereUniqueInput
  }

  /**
   * SequenceActivity deleteMany
   */
  export type SequenceActivityDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which SequenceActivities to delete
     */
    where?: SequenceActivityWhereInput
  }

  /**
   * SequenceActivity findRaw
   */
  export type SequenceActivityFindRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * SequenceActivity aggregateRaw
   */
  export type SequenceActivityAggregateRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * SequenceActivity without action
   */
  export type SequenceActivityDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SequenceActivity
     */
    select?: SequenceActivitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceActivityInclude<ExtArgs> | null
  }

  /**
   * Model UserLogin
   */

  export type AggregateUserLogin = {
    _count: UserLoginCountAggregateOutputType | null
    _min: UserLoginMinAggregateOutputType | null
    _max: UserLoginMaxAggregateOutputType | null
  }

  export type UserLoginMinAggregateOutputType = {
    id: string | null
    userId: string | null
    loginDate: Date | null
    ipAddress: string | null
    userAgent: string | null
    provider: string | null
    createdAt: Date | null
  }

  export type UserLoginMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    loginDate: Date | null
    ipAddress: string | null
    userAgent: string | null
    provider: string | null
    createdAt: Date | null
  }

  export type UserLoginCountAggregateOutputType = {
    id: number
    userId: number
    loginDate: number
    ipAddress: number
    userAgent: number
    provider: number
    createdAt: number
    _all: number
  }

  export type UserLoginMinAggregateInputType = {
    id?: true
    userId?: true
    loginDate?: true
    ipAddress?: true
    userAgent?: true
    provider?: true
    createdAt?: true
  }

  export type UserLoginMaxAggregateInputType = {
    id?: true
    userId?: true
    loginDate?: true
    ipAddress?: true
    userAgent?: true
    provider?: true
    createdAt?: true
  }

  export type UserLoginCountAggregateInputType = {
    id?: true
    userId?: true
    loginDate?: true
    ipAddress?: true
    userAgent?: true
    provider?: true
    createdAt?: true
    _all?: true
  }

  export type UserLoginAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which UserLogin to aggregate.
     */
    where?: UserLoginWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserLogins to fetch.
     */
    orderBy?:
      | UserLoginOrderByWithRelationInput
      | UserLoginOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: UserLoginWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserLogins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserLogins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned UserLogins
     **/
    _count?: true | UserLoginCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: UserLoginMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: UserLoginMaxAggregateInputType
  }

  export type GetUserLoginAggregateType<T extends UserLoginAggregateArgs> = {
    [P in keyof T & keyof AggregateUserLogin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserLogin[P]>
      : GetScalarType<T[P], AggregateUserLogin[P]>
  }

  export type UserLoginGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: UserLoginWhereInput
    orderBy?:
      | UserLoginOrderByWithAggregationInput
      | UserLoginOrderByWithAggregationInput[]
    by: UserLoginScalarFieldEnum[] | UserLoginScalarFieldEnum
    having?: UserLoginScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserLoginCountAggregateInputType | true
    _min?: UserLoginMinAggregateInputType
    _max?: UserLoginMaxAggregateInputType
  }

  export type UserLoginGroupByOutputType = {
    id: string
    userId: string
    loginDate: Date
    ipAddress: string | null
    userAgent: string | null
    provider: string | null
    createdAt: Date
    _count: UserLoginCountAggregateOutputType | null
    _min: UserLoginMinAggregateOutputType | null
    _max: UserLoginMaxAggregateOutputType | null
  }

  type GetUserLoginGroupByPayload<T extends UserLoginGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<UserLoginGroupByOutputType, T['by']> & {
          [P in keyof T & keyof UserLoginGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserLoginGroupByOutputType[P]>
            : GetScalarType<T[P], UserLoginGroupByOutputType[P]>
        }
      >
    >

  export type UserLoginSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      userId?: boolean
      loginDate?: boolean
      ipAddress?: boolean
      userAgent?: boolean
      provider?: boolean
      createdAt?: boolean
      user?: boolean | UserDataDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['userLogin']
  >

  export type UserLoginSelectScalar = {
    id?: boolean
    userId?: boolean
    loginDate?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    provider?: boolean
    createdAt?: boolean
  }

  export type UserLoginInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDataDefaultArgs<ExtArgs>
  }

  export type $UserLoginPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'UserLogin'
    objects: {
      user: Prisma.$UserDataPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        userId: string
        loginDate: Date
        ipAddress: string | null
        userAgent: string | null
        provider: string | null
        createdAt: Date
      },
      ExtArgs['result']['userLogin']
    >
    composites: {}
  }

  type UserLoginGetPayload<
    S extends boolean | null | undefined | UserLoginDefaultArgs,
  > = $Result.GetResult<Prisma.$UserLoginPayload, S>

  type UserLoginCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<UserLoginFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: UserLoginCountAggregateInputType | true
  }

  export interface UserLoginDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['UserLogin']
      meta: { name: 'UserLogin' }
    }
    /**
     * Find zero or one UserLogin that matches the filter.
     * @param {UserLoginFindUniqueArgs} args - Arguments to find a UserLogin
     * @example
     * // Get one UserLogin
     * const userLogin = await prisma.userLogin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserLoginFindUniqueArgs>(
      args: SelectSubset<T, UserLoginFindUniqueArgs<ExtArgs>>
    ): Prisma__UserLoginClient<
      $Result.GetResult<
        Prisma.$UserLoginPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find one UserLogin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserLoginFindUniqueOrThrowArgs} args - Arguments to find a UserLogin
     * @example
     * // Get one UserLogin
     * const userLogin = await prisma.userLogin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserLoginFindUniqueOrThrowArgs>(
      args: SelectSubset<T, UserLoginFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UserLoginClient<
      $Result.GetResult<
        Prisma.$UserLoginPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find the first UserLogin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLoginFindFirstArgs} args - Arguments to find a UserLogin
     * @example
     * // Get one UserLogin
     * const userLogin = await prisma.userLogin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserLoginFindFirstArgs>(
      args?: SelectSubset<T, UserLoginFindFirstArgs<ExtArgs>>
    ): Prisma__UserLoginClient<
      $Result.GetResult<
        Prisma.$UserLoginPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find the first UserLogin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLoginFindFirstOrThrowArgs} args - Arguments to find a UserLogin
     * @example
     * // Get one UserLogin
     * const userLogin = await prisma.userLogin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserLoginFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserLoginFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UserLoginClient<
      $Result.GetResult<
        Prisma.$UserLoginPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find zero or more UserLogins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLoginFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserLogins
     * const userLogins = await prisma.userLogin.findMany()
     *
     * // Get first 10 UserLogins
     * const userLogins = await prisma.userLogin.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userLoginWithIdOnly = await prisma.userLogin.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserLoginFindManyArgs>(
      args?: SelectSubset<T, UserLoginFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserLoginPayload<ExtArgs>, T, 'findMany'>
    >

    /**
     * Create a UserLogin.
     * @param {UserLoginCreateArgs} args - Arguments to create a UserLogin.
     * @example
     * // Create one UserLogin
     * const UserLogin = await prisma.userLogin.create({
     *   data: {
     *     // ... data to create a UserLogin
     *   }
     * })
     *
     */
    create<T extends UserLoginCreateArgs>(
      args: SelectSubset<T, UserLoginCreateArgs<ExtArgs>>
    ): Prisma__UserLoginClient<
      $Result.GetResult<Prisma.$UserLoginPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >

    /**
     * Create many UserLogins.
     * @param {UserLoginCreateManyArgs} args - Arguments to create many UserLogins.
     * @example
     * // Create many UserLogins
     * const userLogin = await prisma.userLogin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserLoginCreateManyArgs>(
      args?: SelectSubset<T, UserLoginCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a UserLogin.
     * @param {UserLoginDeleteArgs} args - Arguments to delete one UserLogin.
     * @example
     * // Delete one UserLogin
     * const UserLogin = await prisma.userLogin.delete({
     *   where: {
     *     // ... filter to delete one UserLogin
     *   }
     * })
     *
     */
    delete<T extends UserLoginDeleteArgs>(
      args: SelectSubset<T, UserLoginDeleteArgs<ExtArgs>>
    ): Prisma__UserLoginClient<
      $Result.GetResult<Prisma.$UserLoginPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >

    /**
     * Update one UserLogin.
     * @param {UserLoginUpdateArgs} args - Arguments to update one UserLogin.
     * @example
     * // Update one UserLogin
     * const userLogin = await prisma.userLogin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserLoginUpdateArgs>(
      args: SelectSubset<T, UserLoginUpdateArgs<ExtArgs>>
    ): Prisma__UserLoginClient<
      $Result.GetResult<Prisma.$UserLoginPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >

    /**
     * Delete zero or more UserLogins.
     * @param {UserLoginDeleteManyArgs} args - Arguments to filter UserLogins to delete.
     * @example
     * // Delete a few UserLogins
     * const { count } = await prisma.userLogin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserLoginDeleteManyArgs>(
      args?: SelectSubset<T, UserLoginDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserLogins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLoginUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserLogins
     * const userLogin = await prisma.userLogin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserLoginUpdateManyArgs>(
      args: SelectSubset<T, UserLoginUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserLogin.
     * @param {UserLoginUpsertArgs} args - Arguments to update or create a UserLogin.
     * @example
     * // Update or create a UserLogin
     * const userLogin = await prisma.userLogin.upsert({
     *   create: {
     *     // ... data to create a UserLogin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserLogin we want to update
     *   }
     * })
     */
    upsert<T extends UserLoginUpsertArgs>(
      args: SelectSubset<T, UserLoginUpsertArgs<ExtArgs>>
    ): Prisma__UserLoginClient<
      $Result.GetResult<Prisma.$UserLoginPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >

    /**
     * Find zero or more UserLogins that matches the filter.
     * @param {UserLoginFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const userLogin = await prisma.userLogin.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: UserLoginFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a UserLogin.
     * @param {UserLoginAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const userLogin = await prisma.userLogin.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(
      args?: UserLoginAggregateRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Count the number of UserLogins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLoginCountArgs} args - Arguments to filter UserLogins to count.
     * @example
     * // Count the number of UserLogins
     * const count = await prisma.userLogin.count({
     *   where: {
     *     // ... the filter for the UserLogins we want to count
     *   }
     * })
     **/
    count<T extends UserLoginCountArgs>(
      args?: Subset<T, UserLoginCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserLoginCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserLogin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLoginAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends UserLoginAggregateArgs>(
      args: Subset<T, UserLoginAggregateArgs>
    ): Prisma.PrismaPromise<GetUserLoginAggregateType<T>>

    /**
     * Group by UserLogin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLoginGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends UserLoginGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserLoginGroupByArgs['orderBy'] }
        : { orderBy?: UserLoginGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, UserLoginGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetUserLoginGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the UserLogin model
     */
    readonly fields: UserLoginFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserLogin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserLoginClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    user<T extends UserDataDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDataDefaultArgs<ExtArgs>>
    ): Prisma__UserDataClient<
      | $Result.GetResult<
          Prisma.$UserDataPayload<ExtArgs>,
          T,
          'findUniqueOrThrow'
        >
      | Null,
      Null,
      ExtArgs
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the UserLogin model
   */
  interface UserLoginFieldRefs {
    readonly id: FieldRef<'UserLogin', 'String'>
    readonly userId: FieldRef<'UserLogin', 'String'>
    readonly loginDate: FieldRef<'UserLogin', 'DateTime'>
    readonly ipAddress: FieldRef<'UserLogin', 'String'>
    readonly userAgent: FieldRef<'UserLogin', 'String'>
    readonly provider: FieldRef<'UserLogin', 'String'>
    readonly createdAt: FieldRef<'UserLogin', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * UserLogin findUnique
   */
  export type UserLoginFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserLogin
     */
    select?: UserLoginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLoginInclude<ExtArgs> | null
    /**
     * Filter, which UserLogin to fetch.
     */
    where: UserLoginWhereUniqueInput
  }

  /**
   * UserLogin findUniqueOrThrow
   */
  export type UserLoginFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserLogin
     */
    select?: UserLoginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLoginInclude<ExtArgs> | null
    /**
     * Filter, which UserLogin to fetch.
     */
    where: UserLoginWhereUniqueInput
  }

  /**
   * UserLogin findFirst
   */
  export type UserLoginFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserLogin
     */
    select?: UserLoginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLoginInclude<ExtArgs> | null
    /**
     * Filter, which UserLogin to fetch.
     */
    where?: UserLoginWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserLogins to fetch.
     */
    orderBy?:
      | UserLoginOrderByWithRelationInput
      | UserLoginOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserLogins.
     */
    cursor?: UserLoginWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserLogins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserLogins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserLogins.
     */
    distinct?: UserLoginScalarFieldEnum | UserLoginScalarFieldEnum[]
  }

  /**
   * UserLogin findFirstOrThrow
   */
  export type UserLoginFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserLogin
     */
    select?: UserLoginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLoginInclude<ExtArgs> | null
    /**
     * Filter, which UserLogin to fetch.
     */
    where?: UserLoginWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserLogins to fetch.
     */
    orderBy?:
      | UserLoginOrderByWithRelationInput
      | UserLoginOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserLogins.
     */
    cursor?: UserLoginWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserLogins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserLogins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserLogins.
     */
    distinct?: UserLoginScalarFieldEnum | UserLoginScalarFieldEnum[]
  }

  /**
   * UserLogin findMany
   */
  export type UserLoginFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserLogin
     */
    select?: UserLoginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLoginInclude<ExtArgs> | null
    /**
     * Filter, which UserLogins to fetch.
     */
    where?: UserLoginWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserLogins to fetch.
     */
    orderBy?:
      | UserLoginOrderByWithRelationInput
      | UserLoginOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing UserLogins.
     */
    cursor?: UserLoginWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserLogins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserLogins.
     */
    skip?: number
    distinct?: UserLoginScalarFieldEnum | UserLoginScalarFieldEnum[]
  }

  /**
   * UserLogin create
   */
  export type UserLoginCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserLogin
     */
    select?: UserLoginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLoginInclude<ExtArgs> | null
    /**
     * The data needed to create a UserLogin.
     */
    data: XOR<UserLoginCreateInput, UserLoginUncheckedCreateInput>
  }

  /**
   * UserLogin createMany
   */
  export type UserLoginCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many UserLogins.
     */
    data: UserLoginCreateManyInput | UserLoginCreateManyInput[]
  }

  /**
   * UserLogin update
   */
  export type UserLoginUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserLogin
     */
    select?: UserLoginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLoginInclude<ExtArgs> | null
    /**
     * The data needed to update a UserLogin.
     */
    data: XOR<UserLoginUpdateInput, UserLoginUncheckedUpdateInput>
    /**
     * Choose, which UserLogin to update.
     */
    where: UserLoginWhereUniqueInput
  }

  /**
   * UserLogin updateMany
   */
  export type UserLoginUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update UserLogins.
     */
    data: XOR<
      UserLoginUpdateManyMutationInput,
      UserLoginUncheckedUpdateManyInput
    >
    /**
     * Filter which UserLogins to update
     */
    where?: UserLoginWhereInput
  }

  /**
   * UserLogin upsert
   */
  export type UserLoginUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserLogin
     */
    select?: UserLoginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLoginInclude<ExtArgs> | null
    /**
     * The filter to search for the UserLogin to update in case it exists.
     */
    where: UserLoginWhereUniqueInput
    /**
     * In case the UserLogin found by the `where` argument doesn't exist, create a new UserLogin with this data.
     */
    create: XOR<UserLoginCreateInput, UserLoginUncheckedCreateInput>
    /**
     * In case the UserLogin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserLoginUpdateInput, UserLoginUncheckedUpdateInput>
  }

  /**
   * UserLogin delete
   */
  export type UserLoginDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserLogin
     */
    select?: UserLoginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLoginInclude<ExtArgs> | null
    /**
     * Filter which UserLogin to delete.
     */
    where: UserLoginWhereUniqueInput
  }

  /**
   * UserLogin deleteMany
   */
  export type UserLoginDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which UserLogins to delete
     */
    where?: UserLoginWhereInput
  }

  /**
   * UserLogin findRaw
   */
  export type UserLoginFindRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * UserLogin aggregateRaw
   */
  export type UserLoginAggregateRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * UserLogin without action
   */
  export type UserLoginDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserLogin
     */
    select?: UserLoginSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLoginInclude<ExtArgs> | null
  }

  /**
   * Model PoseImage
   */

  export type AggregatePoseImage = {
    _count: PoseImageCountAggregateOutputType | null
    _avg: PoseImageAvgAggregateOutputType | null
    _sum: PoseImageSumAggregateOutputType | null
    _min: PoseImageMinAggregateOutputType | null
    _max: PoseImageMaxAggregateOutputType | null
  }

  export type PoseImageAvgAggregateOutputType = {
    fileSize: number | null
  }

  export type PoseImageSumAggregateOutputType = {
    fileSize: number | null
  }

  export type PoseImageMinAggregateOutputType = {
    id: string | null
    userId: string | null
    postureId: string | null
    postureName: string | null
    url: string | null
    altText: string | null
    fileName: string | null
    fileSize: number | null
    uploadedAt: Date | null
    storageType: $Enums.StorageType | null
    localStorageId: string | null
    cloudflareId: string | null
    isOffline: boolean | null
    imageType: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PoseImageMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    postureId: string | null
    postureName: string | null
    url: string | null
    altText: string | null
    fileName: string | null
    fileSize: number | null
    uploadedAt: Date | null
    storageType: $Enums.StorageType | null
    localStorageId: string | null
    cloudflareId: string | null
    isOffline: boolean | null
    imageType: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PoseImageCountAggregateOutputType = {
    id: number
    userId: number
    postureId: number
    postureName: number
    url: number
    altText: number
    fileName: number
    fileSize: number
    uploadedAt: number
    storageType: number
    localStorageId: number
    cloudflareId: number
    isOffline: number
    imageType: number
    createdAt: number
    updatedAt: number
    _all: number
  }

  export type PoseImageAvgAggregateInputType = {
    fileSize?: true
  }

  export type PoseImageSumAggregateInputType = {
    fileSize?: true
  }

  export type PoseImageMinAggregateInputType = {
    id?: true
    userId?: true
    postureId?: true
    postureName?: true
    url?: true
    altText?: true
    fileName?: true
    fileSize?: true
    uploadedAt?: true
    storageType?: true
    localStorageId?: true
    cloudflareId?: true
    isOffline?: true
    imageType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PoseImageMaxAggregateInputType = {
    id?: true
    userId?: true
    postureId?: true
    postureName?: true
    url?: true
    altText?: true
    fileName?: true
    fileSize?: true
    uploadedAt?: true
    storageType?: true
    localStorageId?: true
    cloudflareId?: true
    isOffline?: true
    imageType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PoseImageCountAggregateInputType = {
    id?: true
    userId?: true
    postureId?: true
    postureName?: true
    url?: true
    altText?: true
    fileName?: true
    fileSize?: true
    uploadedAt?: true
    storageType?: true
    localStorageId?: true
    cloudflareId?: true
    isOffline?: true
    imageType?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PoseImageAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which PoseImage to aggregate.
     */
    where?: PoseImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PoseImages to fetch.
     */
    orderBy?:
      | PoseImageOrderByWithRelationInput
      | PoseImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: PoseImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PoseImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PoseImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned PoseImages
     **/
    _count?: true | PoseImageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: PoseImageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: PoseImageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: PoseImageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: PoseImageMaxAggregateInputType
  }

  export type GetPoseImageAggregateType<T extends PoseImageAggregateArgs> = {
    [P in keyof T & keyof AggregatePoseImage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePoseImage[P]>
      : GetScalarType<T[P], AggregatePoseImage[P]>
  }

  export type PoseImageGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PoseImageWhereInput
    orderBy?:
      | PoseImageOrderByWithAggregationInput
      | PoseImageOrderByWithAggregationInput[]
    by: PoseImageScalarFieldEnum[] | PoseImageScalarFieldEnum
    having?: PoseImageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PoseImageCountAggregateInputType | true
    _avg?: PoseImageAvgAggregateInputType
    _sum?: PoseImageSumAggregateInputType
    _min?: PoseImageMinAggregateInputType
    _max?: PoseImageMaxAggregateInputType
  }

  export type PoseImageGroupByOutputType = {
    id: string
    userId: string
    postureId: string | null
    postureName: string | null
    url: string
    altText: string | null
    fileName: string | null
    fileSize: number | null
    uploadedAt: Date
    storageType: $Enums.StorageType
    localStorageId: string | null
    cloudflareId: string | null
    isOffline: boolean
    imageType: string
    createdAt: Date
    updatedAt: Date
    _count: PoseImageCountAggregateOutputType | null
    _avg: PoseImageAvgAggregateOutputType | null
    _sum: PoseImageSumAggregateOutputType | null
    _min: PoseImageMinAggregateOutputType | null
    _max: PoseImageMaxAggregateOutputType | null
  }

  type GetPoseImageGroupByPayload<T extends PoseImageGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<PoseImageGroupByOutputType, T['by']> & {
          [P in keyof T & keyof PoseImageGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PoseImageGroupByOutputType[P]>
            : GetScalarType<T[P], PoseImageGroupByOutputType[P]>
        }
      >
    >

  export type PoseImageSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      userId?: boolean
      postureId?: boolean
      postureName?: boolean
      url?: boolean
      altText?: boolean
      fileName?: boolean
      fileSize?: boolean
      uploadedAt?: boolean
      storageType?: boolean
      localStorageId?: boolean
      cloudflareId?: boolean
      isOffline?: boolean
      imageType?: boolean
      createdAt?: boolean
      updatedAt?: boolean
      user?: boolean | UserDataDefaultArgs<ExtArgs>
      posture?: boolean | PoseImage$postureArgs<ExtArgs>
    },
    ExtArgs['result']['poseImage']
  >

  export type PoseImageSelectScalar = {
    id?: boolean
    userId?: boolean
    postureId?: boolean
    postureName?: boolean
    url?: boolean
    altText?: boolean
    fileName?: boolean
    fileSize?: boolean
    uploadedAt?: boolean
    storageType?: boolean
    localStorageId?: boolean
    cloudflareId?: boolean
    isOffline?: boolean
    imageType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PoseImageInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDataDefaultArgs<ExtArgs>
    posture?: boolean | PoseImage$postureArgs<ExtArgs>
  }

  export type $PoseImagePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'PoseImage'
    objects: {
      user: Prisma.$UserDataPayload<ExtArgs>
      posture: Prisma.$AsanaPosturePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        userId: string
        postureId: string | null
        postureName: string | null
        url: string
        altText: string | null
        fileName: string | null
        fileSize: number | null
        uploadedAt: Date
        storageType: $Enums.StorageType
        localStorageId: string | null
        cloudflareId: string | null
        isOffline: boolean
        imageType: string
        createdAt: Date
        updatedAt: Date
      },
      ExtArgs['result']['poseImage']
    >
    composites: {}
  }

  type PoseImageGetPayload<
    S extends boolean | null | undefined | PoseImageDefaultArgs,
  > = $Result.GetResult<Prisma.$PoseImagePayload, S>

  type PoseImageCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<PoseImageFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: PoseImageCountAggregateInputType | true
  }

  export interface PoseImageDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['PoseImage']
      meta: { name: 'PoseImage' }
    }
    /**
     * Find zero or one PoseImage that matches the filter.
     * @param {PoseImageFindUniqueArgs} args - Arguments to find a PoseImage
     * @example
     * // Get one PoseImage
     * const poseImage = await prisma.poseImage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PoseImageFindUniqueArgs>(
      args: SelectSubset<T, PoseImageFindUniqueArgs<ExtArgs>>
    ): Prisma__PoseImageClient<
      $Result.GetResult<
        Prisma.$PoseImagePayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find one PoseImage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PoseImageFindUniqueOrThrowArgs} args - Arguments to find a PoseImage
     * @example
     * // Get one PoseImage
     * const poseImage = await prisma.poseImage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PoseImageFindUniqueOrThrowArgs>(
      args: SelectSubset<T, PoseImageFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__PoseImageClient<
      $Result.GetResult<
        Prisma.$PoseImagePayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find the first PoseImage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PoseImageFindFirstArgs} args - Arguments to find a PoseImage
     * @example
     * // Get one PoseImage
     * const poseImage = await prisma.poseImage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PoseImageFindFirstArgs>(
      args?: SelectSubset<T, PoseImageFindFirstArgs<ExtArgs>>
    ): Prisma__PoseImageClient<
      $Result.GetResult<
        Prisma.$PoseImagePayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find the first PoseImage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PoseImageFindFirstOrThrowArgs} args - Arguments to find a PoseImage
     * @example
     * // Get one PoseImage
     * const poseImage = await prisma.poseImage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PoseImageFindFirstOrThrowArgs>(
      args?: SelectSubset<T, PoseImageFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__PoseImageClient<
      $Result.GetResult<
        Prisma.$PoseImagePayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find zero or more PoseImages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PoseImageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PoseImages
     * const poseImages = await prisma.poseImage.findMany()
     *
     * // Get first 10 PoseImages
     * const poseImages = await prisma.poseImage.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const poseImageWithIdOnly = await prisma.poseImage.findMany({ select: { id: true } })
     *
     */
    findMany<T extends PoseImageFindManyArgs>(
      args?: SelectSubset<T, PoseImageFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$PoseImagePayload<ExtArgs>, T, 'findMany'>
    >

    /**
     * Create a PoseImage.
     * @param {PoseImageCreateArgs} args - Arguments to create a PoseImage.
     * @example
     * // Create one PoseImage
     * const PoseImage = await prisma.poseImage.create({
     *   data: {
     *     // ... data to create a PoseImage
     *   }
     * })
     *
     */
    create<T extends PoseImageCreateArgs>(
      args: SelectSubset<T, PoseImageCreateArgs<ExtArgs>>
    ): Prisma__PoseImageClient<
      $Result.GetResult<Prisma.$PoseImagePayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >

    /**
     * Create many PoseImages.
     * @param {PoseImageCreateManyArgs} args - Arguments to create many PoseImages.
     * @example
     * // Create many PoseImages
     * const poseImage = await prisma.poseImage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends PoseImageCreateManyArgs>(
      args?: SelectSubset<T, PoseImageCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PoseImage.
     * @param {PoseImageDeleteArgs} args - Arguments to delete one PoseImage.
     * @example
     * // Delete one PoseImage
     * const PoseImage = await prisma.poseImage.delete({
     *   where: {
     *     // ... filter to delete one PoseImage
     *   }
     * })
     *
     */
    delete<T extends PoseImageDeleteArgs>(
      args: SelectSubset<T, PoseImageDeleteArgs<ExtArgs>>
    ): Prisma__PoseImageClient<
      $Result.GetResult<Prisma.$PoseImagePayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >

    /**
     * Update one PoseImage.
     * @param {PoseImageUpdateArgs} args - Arguments to update one PoseImage.
     * @example
     * // Update one PoseImage
     * const poseImage = await prisma.poseImage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends PoseImageUpdateArgs>(
      args: SelectSubset<T, PoseImageUpdateArgs<ExtArgs>>
    ): Prisma__PoseImageClient<
      $Result.GetResult<Prisma.$PoseImagePayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >

    /**
     * Delete zero or more PoseImages.
     * @param {PoseImageDeleteManyArgs} args - Arguments to filter PoseImages to delete.
     * @example
     * // Delete a few PoseImages
     * const { count } = await prisma.poseImage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends PoseImageDeleteManyArgs>(
      args?: SelectSubset<T, PoseImageDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PoseImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PoseImageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PoseImages
     * const poseImage = await prisma.poseImage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends PoseImageUpdateManyArgs>(
      args: SelectSubset<T, PoseImageUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PoseImage.
     * @param {PoseImageUpsertArgs} args - Arguments to update or create a PoseImage.
     * @example
     * // Update or create a PoseImage
     * const poseImage = await prisma.poseImage.upsert({
     *   create: {
     *     // ... data to create a PoseImage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PoseImage we want to update
     *   }
     * })
     */
    upsert<T extends PoseImageUpsertArgs>(
      args: SelectSubset<T, PoseImageUpsertArgs<ExtArgs>>
    ): Prisma__PoseImageClient<
      $Result.GetResult<Prisma.$PoseImagePayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >

    /**
     * Find zero or more PoseImages that matches the filter.
     * @param {PoseImageFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const poseImage = await prisma.poseImage.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PoseImageFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PoseImage.
     * @param {PoseImageAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const poseImage = await prisma.poseImage.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(
      args?: PoseImageAggregateRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Count the number of PoseImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PoseImageCountArgs} args - Arguments to filter PoseImages to count.
     * @example
     * // Count the number of PoseImages
     * const count = await prisma.poseImage.count({
     *   where: {
     *     // ... the filter for the PoseImages we want to count
     *   }
     * })
     **/
    count<T extends PoseImageCountArgs>(
      args?: Subset<T, PoseImageCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PoseImageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PoseImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PoseImageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends PoseImageAggregateArgs>(
      args: Subset<T, PoseImageAggregateArgs>
    ): Prisma.PrismaPromise<GetPoseImageAggregateType<T>>

    /**
     * Group by PoseImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PoseImageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends PoseImageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PoseImageGroupByArgs['orderBy'] }
        : { orderBy?: PoseImageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, PoseImageGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetPoseImageGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the PoseImage model
     */
    readonly fields: PoseImageFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for PoseImage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PoseImageClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    user<T extends UserDataDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDataDefaultArgs<ExtArgs>>
    ): Prisma__UserDataClient<
      | $Result.GetResult<
          Prisma.$UserDataPayload<ExtArgs>,
          T,
          'findUniqueOrThrow'
        >
      | Null,
      Null,
      ExtArgs
    >
    posture<T extends PoseImage$postureArgs<ExtArgs> = {}>(
      args?: Subset<T, PoseImage$postureArgs<ExtArgs>>
    ): Prisma__AsanaPostureClient<
      $Result.GetResult<
        Prisma.$AsanaPosturePayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      > | null,
      null,
      ExtArgs
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the PoseImage model
   */
  interface PoseImageFieldRefs {
    readonly id: FieldRef<'PoseImage', 'String'>
    readonly userId: FieldRef<'PoseImage', 'String'>
    readonly postureId: FieldRef<'PoseImage', 'String'>
    readonly postureName: FieldRef<'PoseImage', 'String'>
    readonly url: FieldRef<'PoseImage', 'String'>
    readonly altText: FieldRef<'PoseImage', 'String'>
    readonly fileName: FieldRef<'PoseImage', 'String'>
    readonly fileSize: FieldRef<'PoseImage', 'Int'>
    readonly uploadedAt: FieldRef<'PoseImage', 'DateTime'>
    readonly storageType: FieldRef<'PoseImage', 'StorageType'>
    readonly localStorageId: FieldRef<'PoseImage', 'String'>
    readonly cloudflareId: FieldRef<'PoseImage', 'String'>
    readonly isOffline: FieldRef<'PoseImage', 'Boolean'>
    readonly imageType: FieldRef<'PoseImage', 'String'>
    readonly createdAt: FieldRef<'PoseImage', 'DateTime'>
    readonly updatedAt: FieldRef<'PoseImage', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * PoseImage findUnique
   */
  export type PoseImageFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PoseImage
     */
    select?: PoseImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoseImageInclude<ExtArgs> | null
    /**
     * Filter, which PoseImage to fetch.
     */
    where: PoseImageWhereUniqueInput
  }

  /**
   * PoseImage findUniqueOrThrow
   */
  export type PoseImageFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PoseImage
     */
    select?: PoseImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoseImageInclude<ExtArgs> | null
    /**
     * Filter, which PoseImage to fetch.
     */
    where: PoseImageWhereUniqueInput
  }

  /**
   * PoseImage findFirst
   */
  export type PoseImageFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PoseImage
     */
    select?: PoseImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoseImageInclude<ExtArgs> | null
    /**
     * Filter, which PoseImage to fetch.
     */
    where?: PoseImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PoseImages to fetch.
     */
    orderBy?:
      | PoseImageOrderByWithRelationInput
      | PoseImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PoseImages.
     */
    cursor?: PoseImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PoseImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PoseImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PoseImages.
     */
    distinct?: PoseImageScalarFieldEnum | PoseImageScalarFieldEnum[]
  }

  /**
   * PoseImage findFirstOrThrow
   */
  export type PoseImageFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PoseImage
     */
    select?: PoseImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoseImageInclude<ExtArgs> | null
    /**
     * Filter, which PoseImage to fetch.
     */
    where?: PoseImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PoseImages to fetch.
     */
    orderBy?:
      | PoseImageOrderByWithRelationInput
      | PoseImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PoseImages.
     */
    cursor?: PoseImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PoseImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PoseImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PoseImages.
     */
    distinct?: PoseImageScalarFieldEnum | PoseImageScalarFieldEnum[]
  }

  /**
   * PoseImage findMany
   */
  export type PoseImageFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PoseImage
     */
    select?: PoseImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoseImageInclude<ExtArgs> | null
    /**
     * Filter, which PoseImages to fetch.
     */
    where?: PoseImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PoseImages to fetch.
     */
    orderBy?:
      | PoseImageOrderByWithRelationInput
      | PoseImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing PoseImages.
     */
    cursor?: PoseImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PoseImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PoseImages.
     */
    skip?: number
    distinct?: PoseImageScalarFieldEnum | PoseImageScalarFieldEnum[]
  }

  /**
   * PoseImage create
   */
  export type PoseImageCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PoseImage
     */
    select?: PoseImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoseImageInclude<ExtArgs> | null
    /**
     * The data needed to create a PoseImage.
     */
    data: XOR<PoseImageCreateInput, PoseImageUncheckedCreateInput>
  }

  /**
   * PoseImage createMany
   */
  export type PoseImageCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many PoseImages.
     */
    data: PoseImageCreateManyInput | PoseImageCreateManyInput[]
  }

  /**
   * PoseImage update
   */
  export type PoseImageUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PoseImage
     */
    select?: PoseImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoseImageInclude<ExtArgs> | null
    /**
     * The data needed to update a PoseImage.
     */
    data: XOR<PoseImageUpdateInput, PoseImageUncheckedUpdateInput>
    /**
     * Choose, which PoseImage to update.
     */
    where: PoseImageWhereUniqueInput
  }

  /**
   * PoseImage updateMany
   */
  export type PoseImageUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update PoseImages.
     */
    data: XOR<
      PoseImageUpdateManyMutationInput,
      PoseImageUncheckedUpdateManyInput
    >
    /**
     * Filter which PoseImages to update
     */
    where?: PoseImageWhereInput
  }

  /**
   * PoseImage upsert
   */
  export type PoseImageUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PoseImage
     */
    select?: PoseImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoseImageInclude<ExtArgs> | null
    /**
     * The filter to search for the PoseImage to update in case it exists.
     */
    where: PoseImageWhereUniqueInput
    /**
     * In case the PoseImage found by the `where` argument doesn't exist, create a new PoseImage with this data.
     */
    create: XOR<PoseImageCreateInput, PoseImageUncheckedCreateInput>
    /**
     * In case the PoseImage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PoseImageUpdateInput, PoseImageUncheckedUpdateInput>
  }

  /**
   * PoseImage delete
   */
  export type PoseImageDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PoseImage
     */
    select?: PoseImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoseImageInclude<ExtArgs> | null
    /**
     * Filter which PoseImage to delete.
     */
    where: PoseImageWhereUniqueInput
  }

  /**
   * PoseImage deleteMany
   */
  export type PoseImageDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which PoseImages to delete
     */
    where?: PoseImageWhereInput
  }

  /**
   * PoseImage findRaw
   */
  export type PoseImageFindRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PoseImage aggregateRaw
   */
  export type PoseImageAggregateRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PoseImage.posture
   */
  export type PoseImage$postureArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsanaPostureInclude<ExtArgs> | null
    where?: AsanaPostureWhereInput
  }

  /**
   * PoseImage without action
   */
  export type PoseImageDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PoseImage
     */
    select?: PoseImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoseImageInclude<ExtArgs> | null
  }

  /**
   * Model GlossaryTerm
   */

  export type AggregateGlossaryTerm = {
    _count: GlossaryTermCountAggregateOutputType | null
    _min: GlossaryTermMinAggregateOutputType | null
    _max: GlossaryTermMaxAggregateOutputType | null
  }

  export type GlossaryTermMinAggregateOutputType = {
    id: string | null
    term: string | null
    meaning: string | null
    whyMatters: string | null
    category: string | null
    sanskrit: string | null
    pronunciation: string | null
    source: $Enums.GlossarySource | null
    userId: string | null
    readOnly: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GlossaryTermMaxAggregateOutputType = {
    id: string | null
    term: string | null
    meaning: string | null
    whyMatters: string | null
    category: string | null
    sanskrit: string | null
    pronunciation: string | null
    source: $Enums.GlossarySource | null
    userId: string | null
    readOnly: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GlossaryTermCountAggregateOutputType = {
    id: number
    term: number
    meaning: number
    whyMatters: number
    category: number
    sanskrit: number
    pronunciation: number
    source: number
    userId: number
    readOnly: number
    createdAt: number
    updatedAt: number
    _all: number
  }

  export type GlossaryTermMinAggregateInputType = {
    id?: true
    term?: true
    meaning?: true
    whyMatters?: true
    category?: true
    sanskrit?: true
    pronunciation?: true
    source?: true
    userId?: true
    readOnly?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GlossaryTermMaxAggregateInputType = {
    id?: true
    term?: true
    meaning?: true
    whyMatters?: true
    category?: true
    sanskrit?: true
    pronunciation?: true
    source?: true
    userId?: true
    readOnly?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GlossaryTermCountAggregateInputType = {
    id?: true
    term?: true
    meaning?: true
    whyMatters?: true
    category?: true
    sanskrit?: true
    pronunciation?: true
    source?: true
    userId?: true
    readOnly?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GlossaryTermAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which GlossaryTerm to aggregate.
     */
    where?: GlossaryTermWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of GlossaryTerms to fetch.
     */
    orderBy?:
      | GlossaryTermOrderByWithRelationInput
      | GlossaryTermOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: GlossaryTermWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` GlossaryTerms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` GlossaryTerms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned GlossaryTerms
     **/
    _count?: true | GlossaryTermCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: GlossaryTermMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: GlossaryTermMaxAggregateInputType
  }

  export type GetGlossaryTermAggregateType<
    T extends GlossaryTermAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateGlossaryTerm]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGlossaryTerm[P]>
      : GetScalarType<T[P], AggregateGlossaryTerm[P]>
  }

  export type GlossaryTermGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: GlossaryTermWhereInput
    orderBy?:
      | GlossaryTermOrderByWithAggregationInput
      | GlossaryTermOrderByWithAggregationInput[]
    by: GlossaryTermScalarFieldEnum[] | GlossaryTermScalarFieldEnum
    having?: GlossaryTermScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GlossaryTermCountAggregateInputType | true
    _min?: GlossaryTermMinAggregateInputType
    _max?: GlossaryTermMaxAggregateInputType
  }

  export type GlossaryTermGroupByOutputType = {
    id: string
    term: string
    meaning: string
    whyMatters: string
    category: string | null
    sanskrit: string | null
    pronunciation: string | null
    source: $Enums.GlossarySource
    userId: string | null
    readOnly: boolean
    createdAt: Date
    updatedAt: Date
    _count: GlossaryTermCountAggregateOutputType | null
    _min: GlossaryTermMinAggregateOutputType | null
    _max: GlossaryTermMaxAggregateOutputType | null
  }

  type GetGlossaryTermGroupByPayload<T extends GlossaryTermGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<GlossaryTermGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof GlossaryTermGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GlossaryTermGroupByOutputType[P]>
            : GetScalarType<T[P], GlossaryTermGroupByOutputType[P]>
        }
      >
    >

  export type GlossaryTermSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      term?: boolean
      meaning?: boolean
      whyMatters?: boolean
      category?: boolean
      sanskrit?: boolean
      pronunciation?: boolean
      source?: boolean
      userId?: boolean
      readOnly?: boolean
      createdAt?: boolean
      updatedAt?: boolean
      user?: boolean | GlossaryTerm$userArgs<ExtArgs>
    },
    ExtArgs['result']['glossaryTerm']
  >

  export type GlossaryTermSelectScalar = {
    id?: boolean
    term?: boolean
    meaning?: boolean
    whyMatters?: boolean
    category?: boolean
    sanskrit?: boolean
    pronunciation?: boolean
    source?: boolean
    userId?: boolean
    readOnly?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GlossaryTermInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | GlossaryTerm$userArgs<ExtArgs>
  }

  export type $GlossaryTermPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'GlossaryTerm'
    objects: {
      user: Prisma.$UserDataPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        term: string
        meaning: string
        whyMatters: string
        category: string | null
        sanskrit: string | null
        pronunciation: string | null
        source: $Enums.GlossarySource
        userId: string | null
        readOnly: boolean
        createdAt: Date
        updatedAt: Date
      },
      ExtArgs['result']['glossaryTerm']
    >
    composites: {}
  }

  type GlossaryTermGetPayload<
    S extends boolean | null | undefined | GlossaryTermDefaultArgs,
  > = $Result.GetResult<Prisma.$GlossaryTermPayload, S>

  type GlossaryTermCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<GlossaryTermFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: GlossaryTermCountAggregateInputType | true
  }

  export interface GlossaryTermDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['GlossaryTerm']
      meta: { name: 'GlossaryTerm' }
    }
    /**
     * Find zero or one GlossaryTerm that matches the filter.
     * @param {GlossaryTermFindUniqueArgs} args - Arguments to find a GlossaryTerm
     * @example
     * // Get one GlossaryTerm
     * const glossaryTerm = await prisma.glossaryTerm.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GlossaryTermFindUniqueArgs>(
      args: SelectSubset<T, GlossaryTermFindUniqueArgs<ExtArgs>>
    ): Prisma__GlossaryTermClient<
      $Result.GetResult<
        Prisma.$GlossaryTermPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find one GlossaryTerm that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GlossaryTermFindUniqueOrThrowArgs} args - Arguments to find a GlossaryTerm
     * @example
     * // Get one GlossaryTerm
     * const glossaryTerm = await prisma.glossaryTerm.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GlossaryTermFindUniqueOrThrowArgs>(
      args: SelectSubset<T, GlossaryTermFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__GlossaryTermClient<
      $Result.GetResult<
        Prisma.$GlossaryTermPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find the first GlossaryTerm that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlossaryTermFindFirstArgs} args - Arguments to find a GlossaryTerm
     * @example
     * // Get one GlossaryTerm
     * const glossaryTerm = await prisma.glossaryTerm.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GlossaryTermFindFirstArgs>(
      args?: SelectSubset<T, GlossaryTermFindFirstArgs<ExtArgs>>
    ): Prisma__GlossaryTermClient<
      $Result.GetResult<
        Prisma.$GlossaryTermPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >

    /**
     * Find the first GlossaryTerm that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlossaryTermFindFirstOrThrowArgs} args - Arguments to find a GlossaryTerm
     * @example
     * // Get one GlossaryTerm
     * const glossaryTerm = await prisma.glossaryTerm.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GlossaryTermFindFirstOrThrowArgs>(
      args?: SelectSubset<T, GlossaryTermFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__GlossaryTermClient<
      $Result.GetResult<
        Prisma.$GlossaryTermPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >

    /**
     * Find zero or more GlossaryTerms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlossaryTermFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GlossaryTerms
     * const glossaryTerms = await prisma.glossaryTerm.findMany()
     *
     * // Get first 10 GlossaryTerms
     * const glossaryTerms = await prisma.glossaryTerm.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const glossaryTermWithIdOnly = await prisma.glossaryTerm.findMany({ select: { id: true } })
     *
     */
    findMany<T extends GlossaryTermFindManyArgs>(
      args?: SelectSubset<T, GlossaryTermFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$GlossaryTermPayload<ExtArgs>, T, 'findMany'>
    >

    /**
     * Create a GlossaryTerm.
     * @param {GlossaryTermCreateArgs} args - Arguments to create a GlossaryTerm.
     * @example
     * // Create one GlossaryTerm
     * const GlossaryTerm = await prisma.glossaryTerm.create({
     *   data: {
     *     // ... data to create a GlossaryTerm
     *   }
     * })
     *
     */
    create<T extends GlossaryTermCreateArgs>(
      args: SelectSubset<T, GlossaryTermCreateArgs<ExtArgs>>
    ): Prisma__GlossaryTermClient<
      $Result.GetResult<Prisma.$GlossaryTermPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >

    /**
     * Create many GlossaryTerms.
     * @param {GlossaryTermCreateManyArgs} args - Arguments to create many GlossaryTerms.
     * @example
     * // Create many GlossaryTerms
     * const glossaryTerm = await prisma.glossaryTerm.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends GlossaryTermCreateManyArgs>(
      args?: SelectSubset<T, GlossaryTermCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a GlossaryTerm.
     * @param {GlossaryTermDeleteArgs} args - Arguments to delete one GlossaryTerm.
     * @example
     * // Delete one GlossaryTerm
     * const GlossaryTerm = await prisma.glossaryTerm.delete({
     *   where: {
     *     // ... filter to delete one GlossaryTerm
     *   }
     * })
     *
     */
    delete<T extends GlossaryTermDeleteArgs>(
      args: SelectSubset<T, GlossaryTermDeleteArgs<ExtArgs>>
    ): Prisma__GlossaryTermClient<
      $Result.GetResult<Prisma.$GlossaryTermPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >

    /**
     * Update one GlossaryTerm.
     * @param {GlossaryTermUpdateArgs} args - Arguments to update one GlossaryTerm.
     * @example
     * // Update one GlossaryTerm
     * const glossaryTerm = await prisma.glossaryTerm.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends GlossaryTermUpdateArgs>(
      args: SelectSubset<T, GlossaryTermUpdateArgs<ExtArgs>>
    ): Prisma__GlossaryTermClient<
      $Result.GetResult<Prisma.$GlossaryTermPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >

    /**
     * Delete zero or more GlossaryTerms.
     * @param {GlossaryTermDeleteManyArgs} args - Arguments to filter GlossaryTerms to delete.
     * @example
     * // Delete a few GlossaryTerms
     * const { count } = await prisma.glossaryTerm.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends GlossaryTermDeleteManyArgs>(
      args?: SelectSubset<T, GlossaryTermDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GlossaryTerms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlossaryTermUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GlossaryTerms
     * const glossaryTerm = await prisma.glossaryTerm.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends GlossaryTermUpdateManyArgs>(
      args: SelectSubset<T, GlossaryTermUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GlossaryTerm.
     * @param {GlossaryTermUpsertArgs} args - Arguments to update or create a GlossaryTerm.
     * @example
     * // Update or create a GlossaryTerm
     * const glossaryTerm = await prisma.glossaryTerm.upsert({
     *   create: {
     *     // ... data to create a GlossaryTerm
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GlossaryTerm we want to update
     *   }
     * })
     */
    upsert<T extends GlossaryTermUpsertArgs>(
      args: SelectSubset<T, GlossaryTermUpsertArgs<ExtArgs>>
    ): Prisma__GlossaryTermClient<
      $Result.GetResult<Prisma.$GlossaryTermPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >

    /**
     * Find zero or more GlossaryTerms that matches the filter.
     * @param {GlossaryTermFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const glossaryTerm = await prisma.glossaryTerm.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: GlossaryTermFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a GlossaryTerm.
     * @param {GlossaryTermAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const glossaryTerm = await prisma.glossaryTerm.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(
      args?: GlossaryTermAggregateRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Count the number of GlossaryTerms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlossaryTermCountArgs} args - Arguments to filter GlossaryTerms to count.
     * @example
     * // Count the number of GlossaryTerms
     * const count = await prisma.glossaryTerm.count({
     *   where: {
     *     // ... the filter for the GlossaryTerms we want to count
     *   }
     * })
     **/
    count<T extends GlossaryTermCountArgs>(
      args?: Subset<T, GlossaryTermCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GlossaryTermCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GlossaryTerm.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlossaryTermAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends GlossaryTermAggregateArgs>(
      args: Subset<T, GlossaryTermAggregateArgs>
    ): Prisma.PrismaPromise<GetGlossaryTermAggregateType<T>>

    /**
     * Group by GlossaryTerm.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlossaryTermGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends GlossaryTermGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GlossaryTermGroupByArgs['orderBy'] }
        : { orderBy?: GlossaryTermGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, GlossaryTermGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetGlossaryTermGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the GlossaryTerm model
     */
    readonly fields: GlossaryTermFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for GlossaryTerm.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GlossaryTermClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    user<T extends GlossaryTerm$userArgs<ExtArgs> = {}>(
      args?: Subset<T, GlossaryTerm$userArgs<ExtArgs>>
    ): Prisma__UserDataClient<
      $Result.GetResult<
        Prisma.$UserDataPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      > | null,
      null,
      ExtArgs
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the GlossaryTerm model
   */
  interface GlossaryTermFieldRefs {
    readonly id: FieldRef<'GlossaryTerm', 'String'>
    readonly term: FieldRef<'GlossaryTerm', 'String'>
    readonly meaning: FieldRef<'GlossaryTerm', 'String'>
    readonly whyMatters: FieldRef<'GlossaryTerm', 'String'>
    readonly category: FieldRef<'GlossaryTerm', 'String'>
    readonly sanskrit: FieldRef<'GlossaryTerm', 'String'>
    readonly pronunciation: FieldRef<'GlossaryTerm', 'String'>
    readonly source: FieldRef<'GlossaryTerm', 'GlossarySource'>
    readonly userId: FieldRef<'GlossaryTerm', 'String'>
    readonly readOnly: FieldRef<'GlossaryTerm', 'Boolean'>
    readonly createdAt: FieldRef<'GlossaryTerm', 'DateTime'>
    readonly updatedAt: FieldRef<'GlossaryTerm', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * GlossaryTerm findUnique
   */
  export type GlossaryTermFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the GlossaryTerm
     */
    select?: GlossaryTermSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlossaryTermInclude<ExtArgs> | null
    /**
     * Filter, which GlossaryTerm to fetch.
     */
    where: GlossaryTermWhereUniqueInput
  }

  /**
   * GlossaryTerm findUniqueOrThrow
   */
  export type GlossaryTermFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the GlossaryTerm
     */
    select?: GlossaryTermSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlossaryTermInclude<ExtArgs> | null
    /**
     * Filter, which GlossaryTerm to fetch.
     */
    where: GlossaryTermWhereUniqueInput
  }

  /**
   * GlossaryTerm findFirst
   */
  export type GlossaryTermFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the GlossaryTerm
     */
    select?: GlossaryTermSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlossaryTermInclude<ExtArgs> | null
    /**
     * Filter, which GlossaryTerm to fetch.
     */
    where?: GlossaryTermWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of GlossaryTerms to fetch.
     */
    orderBy?:
      | GlossaryTermOrderByWithRelationInput
      | GlossaryTermOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for GlossaryTerms.
     */
    cursor?: GlossaryTermWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` GlossaryTerms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` GlossaryTerms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of GlossaryTerms.
     */
    distinct?: GlossaryTermScalarFieldEnum | GlossaryTermScalarFieldEnum[]
  }

  /**
   * GlossaryTerm findFirstOrThrow
   */
  export type GlossaryTermFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the GlossaryTerm
     */
    select?: GlossaryTermSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlossaryTermInclude<ExtArgs> | null
    /**
     * Filter, which GlossaryTerm to fetch.
     */
    where?: GlossaryTermWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of GlossaryTerms to fetch.
     */
    orderBy?:
      | GlossaryTermOrderByWithRelationInput
      | GlossaryTermOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for GlossaryTerms.
     */
    cursor?: GlossaryTermWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` GlossaryTerms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` GlossaryTerms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of GlossaryTerms.
     */
    distinct?: GlossaryTermScalarFieldEnum | GlossaryTermScalarFieldEnum[]
  }

  /**
   * GlossaryTerm findMany
   */
  export type GlossaryTermFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the GlossaryTerm
     */
    select?: GlossaryTermSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlossaryTermInclude<ExtArgs> | null
    /**
     * Filter, which GlossaryTerms to fetch.
     */
    where?: GlossaryTermWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of GlossaryTerms to fetch.
     */
    orderBy?:
      | GlossaryTermOrderByWithRelationInput
      | GlossaryTermOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing GlossaryTerms.
     */
    cursor?: GlossaryTermWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` GlossaryTerms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` GlossaryTerms.
     */
    skip?: number
    distinct?: GlossaryTermScalarFieldEnum | GlossaryTermScalarFieldEnum[]
  }

  /**
   * GlossaryTerm create
   */
  export type GlossaryTermCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the GlossaryTerm
     */
    select?: GlossaryTermSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlossaryTermInclude<ExtArgs> | null
    /**
     * The data needed to create a GlossaryTerm.
     */
    data: XOR<GlossaryTermCreateInput, GlossaryTermUncheckedCreateInput>
  }

  /**
   * GlossaryTerm createMany
   */
  export type GlossaryTermCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many GlossaryTerms.
     */
    data: GlossaryTermCreateManyInput | GlossaryTermCreateManyInput[]
  }

  /**
   * GlossaryTerm update
   */
  export type GlossaryTermUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the GlossaryTerm
     */
    select?: GlossaryTermSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlossaryTermInclude<ExtArgs> | null
    /**
     * The data needed to update a GlossaryTerm.
     */
    data: XOR<GlossaryTermUpdateInput, GlossaryTermUncheckedUpdateInput>
    /**
     * Choose, which GlossaryTerm to update.
     */
    where: GlossaryTermWhereUniqueInput
  }

  /**
   * GlossaryTerm updateMany
   */
  export type GlossaryTermUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update GlossaryTerms.
     */
    data: XOR<
      GlossaryTermUpdateManyMutationInput,
      GlossaryTermUncheckedUpdateManyInput
    >
    /**
     * Filter which GlossaryTerms to update
     */
    where?: GlossaryTermWhereInput
  }

  /**
   * GlossaryTerm upsert
   */
  export type GlossaryTermUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the GlossaryTerm
     */
    select?: GlossaryTermSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlossaryTermInclude<ExtArgs> | null
    /**
     * The filter to search for the GlossaryTerm to update in case it exists.
     */
    where: GlossaryTermWhereUniqueInput
    /**
     * In case the GlossaryTerm found by the `where` argument doesn't exist, create a new GlossaryTerm with this data.
     */
    create: XOR<GlossaryTermCreateInput, GlossaryTermUncheckedCreateInput>
    /**
     * In case the GlossaryTerm was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GlossaryTermUpdateInput, GlossaryTermUncheckedUpdateInput>
  }

  /**
   * GlossaryTerm delete
   */
  export type GlossaryTermDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the GlossaryTerm
     */
    select?: GlossaryTermSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlossaryTermInclude<ExtArgs> | null
    /**
     * Filter which GlossaryTerm to delete.
     */
    where: GlossaryTermWhereUniqueInput
  }

  /**
   * GlossaryTerm deleteMany
   */
  export type GlossaryTermDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which GlossaryTerms to delete
     */
    where?: GlossaryTermWhereInput
  }

  /**
   * GlossaryTerm findRaw
   */
  export type GlossaryTermFindRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * GlossaryTerm aggregateRaw
   */
  export type GlossaryTermAggregateRawArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * GlossaryTerm.user
   */
  export type GlossaryTerm$userArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserData
     */
    select?: UserDataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserDataInclude<ExtArgs> | null
    where?: UserDataWhereInput
  }

  /**
   * GlossaryTerm without action
   */
  export type GlossaryTermDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the GlossaryTerm
     */
    select?: GlossaryTermSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlossaryTermInclude<ExtArgs> | null
  }

  /**
   * Enums
   */

  export const UserDataScalarFieldEnum: {
    id: 'id'
    provider_id: 'provider_id'
    name: 'name'
    email: 'email'
    emailVerified: 'emailVerified'
    image: 'image'
    pronouns: 'pronouns'
    profile: 'profile'
    createdAt: 'createdAt'
    updatedAt: 'updatedAt'
    firstName: 'firstName'
    lastName: 'lastName'
    bio: 'bio'
    headline: 'headline'
    location: 'location'
    websiteURL: 'websiteURL'
    shareQuick: 'shareQuick'
    yogaStyle: 'yogaStyle'
    yogaExperience: 'yogaExperience'
    company: 'company'
    socialURL: 'socialURL'
    isLocationPublic: 'isLocationPublic'
    role: 'role'
    profileImages: 'profileImages'
    activeProfileImage: 'activeProfileImage'
    tz: 'tz'
  }

  export type UserDataScalarFieldEnum =
    (typeof UserDataScalarFieldEnum)[keyof typeof UserDataScalarFieldEnum]

  export const ReminderScalarFieldEnum: {
    id: 'id'
    userId: 'userId'
    timeOfDay: 'timeOfDay'
    days: 'days'
    enabled: 'enabled'
    message: 'message'
    lastSent: 'lastSent'
    emailNotificationsEnabled: 'emailNotificationsEnabled'
  }

  export type ReminderScalarFieldEnum =
    (typeof ReminderScalarFieldEnum)[keyof typeof ReminderScalarFieldEnum]

  export const PushSubscriptionScalarFieldEnum: {
    id: 'id'
    userId: 'userId'
    endpoint: 'endpoint'
    p256dh: 'p256dh'
    auth: 'auth'
    createdAt: 'createdAt'
  }

  export type PushSubscriptionScalarFieldEnum =
    (typeof PushSubscriptionScalarFieldEnum)[keyof typeof PushSubscriptionScalarFieldEnum]

  export const ProviderAccountScalarFieldEnum: {
    id: 'id'
    userId: 'userId'
    type: 'type'
    provider: 'provider'
    providerAccountId: 'providerAccountId'
    refresh_token: 'refresh_token'
    access_token: 'access_token'
    expires_at: 'expires_at'
    token_type: 'token_type'
    scope: 'scope'
    id_token: 'id_token'
    session_state: 'session_state'
    credentials_password: 'credentials_password'
    createdAt: 'createdAt'
    updatedAt: 'updatedAt'
  }

  export type ProviderAccountScalarFieldEnum =
    (typeof ProviderAccountScalarFieldEnum)[keyof typeof ProviderAccountScalarFieldEnum]

  export const AsanaPostureScalarFieldEnum: {
    id: 'id'
    english_names: 'english_names'
    sanskrit_names: 'sanskrit_names'
    sort_english_name: 'sort_english_name'
    description: 'description'
    benefits: 'benefits'
    category: 'category'
    difficulty: 'difficulty'
    lore: 'lore'
    breath_direction_default: 'breath_direction_default'
    dristi: 'dristi'
    variations: 'variations'
    modifications: 'modifications'
    label: 'label'
    suggested_postures: 'suggested_postures'
    preparatory_postures: 'preparatory_postures'
    preferred_side: 'preferred_side'
    sideways: 'sideways'
    image: 'image'
    created_on: 'created_on'
    updated_on: 'updated_on'
    acitivity_completed: 'acitivity_completed'
    acitivity_practice: 'acitivity_practice'
    posture_intent: 'posture_intent'
    breath_series: 'breath_series'
    duration_asana: 'duration_asana'
    transition_cues_out: 'transition_cues_out'
    transition_cues_in: 'transition_cues_in'
    setup_cues: 'setup_cues'
    deepening_cues: 'deepening_cues'
    customize_asana: 'customize_asana'
    additional_cues: 'additional_cues'
    joint_action: 'joint_action'
    muscle_action: 'muscle_action'
    created_by: 'created_by'
  }

  export type AsanaPostureScalarFieldEnum =
    (typeof AsanaPostureScalarFieldEnum)[keyof typeof AsanaPostureScalarFieldEnum]

  export const AsanaSeriesScalarFieldEnum: {
    id: 'id'
    seriesName: 'seriesName'
    seriesPostures: 'seriesPostures'
    breathSeries: 'breathSeries'
    description: 'description'
    durationSeries: 'durationSeries'
    image: 'image'
    images: 'images'
    created_by: 'created_by'
    createdAt: 'createdAt'
    updatedAt: 'updatedAt'
  }

  export type AsanaSeriesScalarFieldEnum =
    (typeof AsanaSeriesScalarFieldEnum)[keyof typeof AsanaSeriesScalarFieldEnum]

  export const AsanaSequenceScalarFieldEnum: {
    id: 'id'
    nameSequence: 'nameSequence'
    sequencesSeries: 'sequencesSeries'
    description: 'description'
    durationSequence: 'durationSequence'
    image: 'image'
    breath_direction: 'breath_direction'
    created_by: 'created_by'
    createdAt: 'createdAt'
    updatedAt: 'updatedAt'
  }

  export type AsanaSequenceScalarFieldEnum =
    (typeof AsanaSequenceScalarFieldEnum)[keyof typeof AsanaSequenceScalarFieldEnum]

  export const AsanaActivityScalarFieldEnum: {
    id: 'id'
    userId: 'userId'
    postureId: 'postureId'
    postureName: 'postureName'
    sort_english_name: 'sort_english_name'
    duration: 'duration'
    datePerformed: 'datePerformed'
    notes: 'notes'
    sensations: 'sensations'
    completionStatus: 'completionStatus'
    difficulty: 'difficulty'
    createdAt: 'createdAt'
    updatedAt: 'updatedAt'
  }

  export type AsanaActivityScalarFieldEnum =
    (typeof AsanaActivityScalarFieldEnum)[keyof typeof AsanaActivityScalarFieldEnum]

  export const SeriesActivityScalarFieldEnum: {
    id: 'id'
    userId: 'userId'
    seriesId: 'seriesId'
    seriesName: 'seriesName'
    datePerformed: 'datePerformed'
    difficulty: 'difficulty'
    completionStatus: 'completionStatus'
    duration: 'duration'
    notes: 'notes'
    createdAt: 'createdAt'
    updatedAt: 'updatedAt'
  }

  export type SeriesActivityScalarFieldEnum =
    (typeof SeriesActivityScalarFieldEnum)[keyof typeof SeriesActivityScalarFieldEnum]

  export const SequenceActivityScalarFieldEnum: {
    id: 'id'
    userId: 'userId'
    sequenceId: 'sequenceId'
    sequenceName: 'sequenceName'
    datePerformed: 'datePerformed'
    difficulty: 'difficulty'
    completionStatus: 'completionStatus'
    duration: 'duration'
    notes: 'notes'
    createdAt: 'createdAt'
    updatedAt: 'updatedAt'
  }

  export type SequenceActivityScalarFieldEnum =
    (typeof SequenceActivityScalarFieldEnum)[keyof typeof SequenceActivityScalarFieldEnum]

  export const UserLoginScalarFieldEnum: {
    id: 'id'
    userId: 'userId'
    loginDate: 'loginDate'
    ipAddress: 'ipAddress'
    userAgent: 'userAgent'
    provider: 'provider'
    createdAt: 'createdAt'
  }

  export type UserLoginScalarFieldEnum =
    (typeof UserLoginScalarFieldEnum)[keyof typeof UserLoginScalarFieldEnum]

  export const PoseImageScalarFieldEnum: {
    id: 'id'
    userId: 'userId'
    postureId: 'postureId'
    postureName: 'postureName'
    url: 'url'
    altText: 'altText'
    fileName: 'fileName'
    fileSize: 'fileSize'
    uploadedAt: 'uploadedAt'
    storageType: 'storageType'
    localStorageId: 'localStorageId'
    cloudflareId: 'cloudflareId'
    isOffline: 'isOffline'
    imageType: 'imageType'
    createdAt: 'createdAt'
    updatedAt: 'updatedAt'
  }

  export type PoseImageScalarFieldEnum =
    (typeof PoseImageScalarFieldEnum)[keyof typeof PoseImageScalarFieldEnum]

  export const GlossaryTermScalarFieldEnum: {
    id: 'id'
    term: 'term'
    meaning: 'meaning'
    whyMatters: 'whyMatters'
    category: 'category'
    sanskrit: 'sanskrit'
    pronunciation: 'pronunciation'
    source: 'source'
    userId: 'userId'
    readOnly: 'readOnly'
    createdAt: 'createdAt'
    updatedAt: 'updatedAt'
  }

  export type GlossaryTermScalarFieldEnum =
    (typeof GlossaryTermScalarFieldEnum)[keyof typeof GlossaryTermScalarFieldEnum]

  export const SortOrder: {
    asc: 'asc'
    desc: 'desc'
  }

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]

  export const QueryMode: {
    default: 'default'
    insensitive: 'insensitive'
  }

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String'
  >

  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String[]'
  >

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime'
  >

  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime[]'
  >

  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Json'
  >

  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Boolean'
  >

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int'
  >

  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int[]'
  >

  /**
   * Reference to a field of type 'Json[]'
   */
  export type ListJsonFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Json[]'
  >

  /**
   * Reference to a field of type 'StorageType'
   */
  export type EnumStorageTypeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'StorageType'
  >

  /**
   * Reference to a field of type 'StorageType[]'
   */
  export type ListEnumStorageTypeFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'StorageType[]'>

  /**
   * Reference to a field of type 'GlossarySource'
   */
  export type EnumGlossarySourceFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'GlossarySource'
  >

  /**
   * Reference to a field of type 'GlossarySource[]'
   */
  export type ListEnumGlossarySourceFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'GlossarySource[]'>

  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Float'
  >

  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Float[]'
  >

  /**
   * Deep Input Types
   */

  export type UserDataWhereInput = {
    AND?: UserDataWhereInput | UserDataWhereInput[]
    OR?: UserDataWhereInput[]
    NOT?: UserDataWhereInput | UserDataWhereInput[]
    id?: StringFilter<'UserData'> | string
    provider_id?: StringNullableFilter<'UserData'> | string | null
    name?: StringNullableFilter<'UserData'> | string | null
    email?: StringNullableFilter<'UserData'> | string | null
    emailVerified?: DateTimeNullableFilter<'UserData'> | Date | string | null
    image?: StringNullableFilter<'UserData'> | string | null
    pronouns?: StringNullableFilter<'UserData'> | string | null
    profile?: JsonNullableFilter<'UserData'>
    createdAt?: DateTimeFilter<'UserData'> | Date | string
    updatedAt?: DateTimeFilter<'UserData'> | Date | string
    firstName?: StringFilter<'UserData'> | string
    lastName?: StringFilter<'UserData'> | string
    bio?: StringFilter<'UserData'> | string
    headline?: StringFilter<'UserData'> | string
    location?: StringFilter<'UserData'> | string
    websiteURL?: StringFilter<'UserData'> | string
    shareQuick?: StringNullableFilter<'UserData'> | string | null
    yogaStyle?: StringNullableFilter<'UserData'> | string | null
    yogaExperience?: StringNullableFilter<'UserData'> | string | null
    company?: StringNullableFilter<'UserData'> | string | null
    socialURL?: StringNullableFilter<'UserData'> | string | null
    isLocationPublic?: StringNullableFilter<'UserData'> | string | null
    role?: StringNullableFilter<'UserData'> | string | null
    profileImages?: StringNullableListFilter<'UserData'>
    activeProfileImage?: StringNullableFilter<'UserData'> | string | null
    tz?: StringFilter<'UserData'> | string
    providerAccounts?: ProviderAccountListRelationFilter
    asanaActivities?: AsanaActivityListRelationFilter
    seriesActivities?: SeriesActivityListRelationFilter
    sequenceActivities?: SequenceActivityListRelationFilter
    userLogins?: UserLoginListRelationFilter
    poseImages?: PoseImageListRelationFilter
    glossaryTerms?: GlossaryTermListRelationFilter
    reminders?: ReminderListRelationFilter
    pushSubscriptions?: PushSubscriptionListRelationFilter
  }

  export type UserDataOrderByWithRelationInput = {
    id?: SortOrder
    provider_id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    pronouns?: SortOrder
    profile?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    bio?: SortOrder
    headline?: SortOrder
    location?: SortOrder
    websiteURL?: SortOrder
    shareQuick?: SortOrder
    yogaStyle?: SortOrder
    yogaExperience?: SortOrder
    company?: SortOrder
    socialURL?: SortOrder
    isLocationPublic?: SortOrder
    role?: SortOrder
    profileImages?: SortOrder
    activeProfileImage?: SortOrder
    tz?: SortOrder
    providerAccounts?: ProviderAccountOrderByRelationAggregateInput
    asanaActivities?: AsanaActivityOrderByRelationAggregateInput
    seriesActivities?: SeriesActivityOrderByRelationAggregateInput
    sequenceActivities?: SequenceActivityOrderByRelationAggregateInput
    userLogins?: UserLoginOrderByRelationAggregateInput
    poseImages?: PoseImageOrderByRelationAggregateInput
    glossaryTerms?: GlossaryTermOrderByRelationAggregateInput
    reminders?: ReminderOrderByRelationAggregateInput
    pushSubscriptions?: PushSubscriptionOrderByRelationAggregateInput
  }

  export type UserDataWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      provider_id?: string
      email?: string
      AND?: UserDataWhereInput | UserDataWhereInput[]
      OR?: UserDataWhereInput[]
      NOT?: UserDataWhereInput | UserDataWhereInput[]
      name?: StringNullableFilter<'UserData'> | string | null
      emailVerified?: DateTimeNullableFilter<'UserData'> | Date | string | null
      image?: StringNullableFilter<'UserData'> | string | null
      pronouns?: StringNullableFilter<'UserData'> | string | null
      profile?: JsonNullableFilter<'UserData'>
      createdAt?: DateTimeFilter<'UserData'> | Date | string
      updatedAt?: DateTimeFilter<'UserData'> | Date | string
      firstName?: StringFilter<'UserData'> | string
      lastName?: StringFilter<'UserData'> | string
      bio?: StringFilter<'UserData'> | string
      headline?: StringFilter<'UserData'> | string
      location?: StringFilter<'UserData'> | string
      websiteURL?: StringFilter<'UserData'> | string
      shareQuick?: StringNullableFilter<'UserData'> | string | null
      yogaStyle?: StringNullableFilter<'UserData'> | string | null
      yogaExperience?: StringNullableFilter<'UserData'> | string | null
      company?: StringNullableFilter<'UserData'> | string | null
      socialURL?: StringNullableFilter<'UserData'> | string | null
      isLocationPublic?: StringNullableFilter<'UserData'> | string | null
      role?: StringNullableFilter<'UserData'> | string | null
      profileImages?: StringNullableListFilter<'UserData'>
      activeProfileImage?: StringNullableFilter<'UserData'> | string | null
      tz?: StringFilter<'UserData'> | string
      providerAccounts?: ProviderAccountListRelationFilter
      asanaActivities?: AsanaActivityListRelationFilter
      seriesActivities?: SeriesActivityListRelationFilter
      sequenceActivities?: SequenceActivityListRelationFilter
      userLogins?: UserLoginListRelationFilter
      poseImages?: PoseImageListRelationFilter
      glossaryTerms?: GlossaryTermListRelationFilter
      reminders?: ReminderListRelationFilter
      pushSubscriptions?: PushSubscriptionListRelationFilter
    },
    'id' | 'provider_id' | 'email'
  >

  export type UserDataOrderByWithAggregationInput = {
    id?: SortOrder
    provider_id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    pronouns?: SortOrder
    profile?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    bio?: SortOrder
    headline?: SortOrder
    location?: SortOrder
    websiteURL?: SortOrder
    shareQuick?: SortOrder
    yogaStyle?: SortOrder
    yogaExperience?: SortOrder
    company?: SortOrder
    socialURL?: SortOrder
    isLocationPublic?: SortOrder
    role?: SortOrder
    profileImages?: SortOrder
    activeProfileImage?: SortOrder
    tz?: SortOrder
    _count?: UserDataCountOrderByAggregateInput
    _max?: UserDataMaxOrderByAggregateInput
    _min?: UserDataMinOrderByAggregateInput
  }

  export type UserDataScalarWhereWithAggregatesInput = {
    AND?:
      | UserDataScalarWhereWithAggregatesInput
      | UserDataScalarWhereWithAggregatesInput[]
    OR?: UserDataScalarWhereWithAggregatesInput[]
    NOT?:
      | UserDataScalarWhereWithAggregatesInput
      | UserDataScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'UserData'> | string
    provider_id?: StringNullableWithAggregatesFilter<'UserData'> | string | null
    name?: StringNullableWithAggregatesFilter<'UserData'> | string | null
    email?: StringNullableWithAggregatesFilter<'UserData'> | string | null
    emailVerified?:
      | DateTimeNullableWithAggregatesFilter<'UserData'>
      | Date
      | string
      | null
    image?: StringNullableWithAggregatesFilter<'UserData'> | string | null
    pronouns?: StringNullableWithAggregatesFilter<'UserData'> | string | null
    profile?: JsonNullableWithAggregatesFilter<'UserData'>
    createdAt?: DateTimeWithAggregatesFilter<'UserData'> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<'UserData'> | Date | string
    firstName?: StringWithAggregatesFilter<'UserData'> | string
    lastName?: StringWithAggregatesFilter<'UserData'> | string
    bio?: StringWithAggregatesFilter<'UserData'> | string
    headline?: StringWithAggregatesFilter<'UserData'> | string
    location?: StringWithAggregatesFilter<'UserData'> | string
    websiteURL?: StringWithAggregatesFilter<'UserData'> | string
    shareQuick?: StringNullableWithAggregatesFilter<'UserData'> | string | null
    yogaStyle?: StringNullableWithAggregatesFilter<'UserData'> | string | null
    yogaExperience?:
      | StringNullableWithAggregatesFilter<'UserData'>
      | string
      | null
    company?: StringNullableWithAggregatesFilter<'UserData'> | string | null
    socialURL?: StringNullableWithAggregatesFilter<'UserData'> | string | null
    isLocationPublic?:
      | StringNullableWithAggregatesFilter<'UserData'>
      | string
      | null
    role?: StringNullableWithAggregatesFilter<'UserData'> | string | null
    profileImages?: StringNullableListFilter<'UserData'>
    activeProfileImage?:
      | StringNullableWithAggregatesFilter<'UserData'>
      | string
      | null
    tz?: StringWithAggregatesFilter<'UserData'> | string
  }

  export type ReminderWhereInput = {
    AND?: ReminderWhereInput | ReminderWhereInput[]
    OR?: ReminderWhereInput[]
    NOT?: ReminderWhereInput | ReminderWhereInput[]
    id?: StringFilter<'Reminder'> | string
    userId?: StringFilter<'Reminder'> | string
    timeOfDay?: StringFilter<'Reminder'> | string
    days?: StringNullableListFilter<'Reminder'>
    enabled?: BoolFilter<'Reminder'> | boolean
    message?: StringFilter<'Reminder'> | string
    lastSent?: DateTimeNullableFilter<'Reminder'> | Date | string | null
    emailNotificationsEnabled?: BoolFilter<'Reminder'> | boolean
    user?: XOR<UserDataRelationFilter, UserDataWhereInput>
  }

  export type ReminderOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    timeOfDay?: SortOrder
    days?: SortOrder
    enabled?: SortOrder
    message?: SortOrder
    lastSent?: SortOrder
    emailNotificationsEnabled?: SortOrder
    user?: UserDataOrderByWithRelationInput
  }

  export type ReminderWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      AND?: ReminderWhereInput | ReminderWhereInput[]
      OR?: ReminderWhereInput[]
      NOT?: ReminderWhereInput | ReminderWhereInput[]
      userId?: StringFilter<'Reminder'> | string
      timeOfDay?: StringFilter<'Reminder'> | string
      days?: StringNullableListFilter<'Reminder'>
      enabled?: BoolFilter<'Reminder'> | boolean
      message?: StringFilter<'Reminder'> | string
      lastSent?: DateTimeNullableFilter<'Reminder'> | Date | string | null
      emailNotificationsEnabled?: BoolFilter<'Reminder'> | boolean
      user?: XOR<UserDataRelationFilter, UserDataWhereInput>
    },
    'id'
  >

  export type ReminderOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    timeOfDay?: SortOrder
    days?: SortOrder
    enabled?: SortOrder
    message?: SortOrder
    lastSent?: SortOrder
    emailNotificationsEnabled?: SortOrder
    _count?: ReminderCountOrderByAggregateInput
    _max?: ReminderMaxOrderByAggregateInput
    _min?: ReminderMinOrderByAggregateInput
  }

  export type ReminderScalarWhereWithAggregatesInput = {
    AND?:
      | ReminderScalarWhereWithAggregatesInput
      | ReminderScalarWhereWithAggregatesInput[]
    OR?: ReminderScalarWhereWithAggregatesInput[]
    NOT?:
      | ReminderScalarWhereWithAggregatesInput
      | ReminderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'Reminder'> | string
    userId?: StringWithAggregatesFilter<'Reminder'> | string
    timeOfDay?: StringWithAggregatesFilter<'Reminder'> | string
    days?: StringNullableListFilter<'Reminder'>
    enabled?: BoolWithAggregatesFilter<'Reminder'> | boolean
    message?: StringWithAggregatesFilter<'Reminder'> | string
    lastSent?:
      | DateTimeNullableWithAggregatesFilter<'Reminder'>
      | Date
      | string
      | null
    emailNotificationsEnabled?: BoolWithAggregatesFilter<'Reminder'> | boolean
  }

  export type PushSubscriptionWhereInput = {
    AND?: PushSubscriptionWhereInput | PushSubscriptionWhereInput[]
    OR?: PushSubscriptionWhereInput[]
    NOT?: PushSubscriptionWhereInput | PushSubscriptionWhereInput[]
    id?: StringFilter<'PushSubscription'> | string
    userId?: StringFilter<'PushSubscription'> | string
    endpoint?: StringFilter<'PushSubscription'> | string
    p256dh?: StringFilter<'PushSubscription'> | string
    auth?: StringFilter<'PushSubscription'> | string
    createdAt?: DateTimeFilter<'PushSubscription'> | Date | string
    user?: XOR<UserDataRelationFilter, UserDataWhereInput>
  }

  export type PushSubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    endpoint?: SortOrder
    p256dh?: SortOrder
    auth?: SortOrder
    createdAt?: SortOrder
    user?: UserDataOrderByWithRelationInput
  }

  export type PushSubscriptionWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      endpoint?: string
      AND?: PushSubscriptionWhereInput | PushSubscriptionWhereInput[]
      OR?: PushSubscriptionWhereInput[]
      NOT?: PushSubscriptionWhereInput | PushSubscriptionWhereInput[]
      userId?: StringFilter<'PushSubscription'> | string
      p256dh?: StringFilter<'PushSubscription'> | string
      auth?: StringFilter<'PushSubscription'> | string
      createdAt?: DateTimeFilter<'PushSubscription'> | Date | string
      user?: XOR<UserDataRelationFilter, UserDataWhereInput>
    },
    'id' | 'endpoint'
  >

  export type PushSubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    endpoint?: SortOrder
    p256dh?: SortOrder
    auth?: SortOrder
    createdAt?: SortOrder
    _count?: PushSubscriptionCountOrderByAggregateInput
    _max?: PushSubscriptionMaxOrderByAggregateInput
    _min?: PushSubscriptionMinOrderByAggregateInput
  }

  export type PushSubscriptionScalarWhereWithAggregatesInput = {
    AND?:
      | PushSubscriptionScalarWhereWithAggregatesInput
      | PushSubscriptionScalarWhereWithAggregatesInput[]
    OR?: PushSubscriptionScalarWhereWithAggregatesInput[]
    NOT?:
      | PushSubscriptionScalarWhereWithAggregatesInput
      | PushSubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'PushSubscription'> | string
    userId?: StringWithAggregatesFilter<'PushSubscription'> | string
    endpoint?: StringWithAggregatesFilter<'PushSubscription'> | string
    p256dh?: StringWithAggregatesFilter<'PushSubscription'> | string
    auth?: StringWithAggregatesFilter<'PushSubscription'> | string
    createdAt?: DateTimeWithAggregatesFilter<'PushSubscription'> | Date | string
  }

  export type ProviderAccountWhereInput = {
    AND?: ProviderAccountWhereInput | ProviderAccountWhereInput[]
    OR?: ProviderAccountWhereInput[]
    NOT?: ProviderAccountWhereInput | ProviderAccountWhereInput[]
    id?: StringFilter<'ProviderAccount'> | string
    userId?: StringFilter<'ProviderAccount'> | string
    type?: StringFilter<'ProviderAccount'> | string
    provider?: StringFilter<'ProviderAccount'> | string
    providerAccountId?: StringFilter<'ProviderAccount'> | string
    refresh_token?: StringNullableFilter<'ProviderAccount'> | string | null
    access_token?: StringNullableFilter<'ProviderAccount'> | string | null
    expires_at?: IntNullableFilter<'ProviderAccount'> | number | null
    token_type?: StringNullableFilter<'ProviderAccount'> | string | null
    scope?: StringNullableFilter<'ProviderAccount'> | string | null
    id_token?: StringNullableFilter<'ProviderAccount'> | string | null
    session_state?: JsonNullableFilter<'ProviderAccount'>
    credentials_password?:
      | StringNullableFilter<'ProviderAccount'>
      | string
      | null
    createdAt?: DateTimeFilter<'ProviderAccount'> | Date | string
    updatedAt?: DateTimeFilter<'ProviderAccount'> | Date | string
    user?: XOR<UserDataRelationFilter, UserDataWhereInput>
  }

  export type ProviderAccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
    credentials_password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserDataOrderByWithRelationInput
  }

  export type ProviderAccountWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      userId?: string
      AND?: ProviderAccountWhereInput | ProviderAccountWhereInput[]
      OR?: ProviderAccountWhereInput[]
      NOT?: ProviderAccountWhereInput | ProviderAccountWhereInput[]
      type?: StringFilter<'ProviderAccount'> | string
      provider?: StringFilter<'ProviderAccount'> | string
      providerAccountId?: StringFilter<'ProviderAccount'> | string
      refresh_token?: StringNullableFilter<'ProviderAccount'> | string | null
      access_token?: StringNullableFilter<'ProviderAccount'> | string | null
      expires_at?: IntNullableFilter<'ProviderAccount'> | number | null
      token_type?: StringNullableFilter<'ProviderAccount'> | string | null
      scope?: StringNullableFilter<'ProviderAccount'> | string | null
      id_token?: StringNullableFilter<'ProviderAccount'> | string | null
      session_state?: JsonNullableFilter<'ProviderAccount'>
      credentials_password?:
        | StringNullableFilter<'ProviderAccount'>
        | string
        | null
      createdAt?: DateTimeFilter<'ProviderAccount'> | Date | string
      updatedAt?: DateTimeFilter<'ProviderAccount'> | Date | string
      user?: XOR<UserDataRelationFilter, UserDataWhereInput>
    },
    'id' | 'userId'
  >

  export type ProviderAccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
    credentials_password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProviderAccountCountOrderByAggregateInput
    _avg?: ProviderAccountAvgOrderByAggregateInput
    _max?: ProviderAccountMaxOrderByAggregateInput
    _min?: ProviderAccountMinOrderByAggregateInput
    _sum?: ProviderAccountSumOrderByAggregateInput
  }

  export type ProviderAccountScalarWhereWithAggregatesInput = {
    AND?:
      | ProviderAccountScalarWhereWithAggregatesInput
      | ProviderAccountScalarWhereWithAggregatesInput[]
    OR?: ProviderAccountScalarWhereWithAggregatesInput[]
    NOT?:
      | ProviderAccountScalarWhereWithAggregatesInput
      | ProviderAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'ProviderAccount'> | string
    userId?: StringWithAggregatesFilter<'ProviderAccount'> | string
    type?: StringWithAggregatesFilter<'ProviderAccount'> | string
    provider?: StringWithAggregatesFilter<'ProviderAccount'> | string
    providerAccountId?: StringWithAggregatesFilter<'ProviderAccount'> | string
    refresh_token?:
      | StringNullableWithAggregatesFilter<'ProviderAccount'>
      | string
      | null
    access_token?:
      | StringNullableWithAggregatesFilter<'ProviderAccount'>
      | string
      | null
    expires_at?:
      | IntNullableWithAggregatesFilter<'ProviderAccount'>
      | number
      | null
    token_type?:
      | StringNullableWithAggregatesFilter<'ProviderAccount'>
      | string
      | null
    scope?:
      | StringNullableWithAggregatesFilter<'ProviderAccount'>
      | string
      | null
    id_token?:
      | StringNullableWithAggregatesFilter<'ProviderAccount'>
      | string
      | null
    session_state?: JsonNullableWithAggregatesFilter<'ProviderAccount'>
    credentials_password?:
      | StringNullableWithAggregatesFilter<'ProviderAccount'>
      | string
      | null
    createdAt?: DateTimeWithAggregatesFilter<'ProviderAccount'> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<'ProviderAccount'> | Date | string
  }

  export type AsanaPostureWhereInput = {
    AND?: AsanaPostureWhereInput | AsanaPostureWhereInput[]
    OR?: AsanaPostureWhereInput[]
    NOT?: AsanaPostureWhereInput | AsanaPostureWhereInput[]
    id?: StringFilter<'AsanaPosture'> | string
    english_names?: StringNullableListFilter<'AsanaPosture'>
    sanskrit_names?: JsonNullableFilter<'AsanaPosture'>
    sort_english_name?: StringFilter<'AsanaPosture'> | string
    description?: StringNullableFilter<'AsanaPosture'> | string | null
    benefits?: StringNullableFilter<'AsanaPosture'> | string | null
    category?: StringNullableFilter<'AsanaPosture'> | string | null
    difficulty?: StringNullableFilter<'AsanaPosture'> | string | null
    lore?: StringNullableFilter<'AsanaPosture'> | string | null
    breath_direction_default?:
      | StringNullableFilter<'AsanaPosture'>
      | string
      | null
    dristi?: StringNullableFilter<'AsanaPosture'> | string | null
    variations?: StringNullableListFilter<'AsanaPosture'>
    modifications?: StringNullableListFilter<'AsanaPosture'>
    label?: StringNullableFilter<'AsanaPosture'> | string | null
    suggested_postures?: StringNullableListFilter<'AsanaPosture'>
    preparatory_postures?: StringNullableListFilter<'AsanaPosture'>
    preferred_side?: StringNullableFilter<'AsanaPosture'> | string | null
    sideways?: BoolNullableFilter<'AsanaPosture'> | boolean | null
    image?: StringNullableFilter<'AsanaPosture'> | string | null
    created_on?: DateTimeNullableFilter<'AsanaPosture'> | Date | string | null
    updated_on?: DateTimeNullableFilter<'AsanaPosture'> | Date | string | null
    acitivity_completed?: BoolNullableFilter<'AsanaPosture'> | boolean | null
    acitivity_practice?: BoolNullableFilter<'AsanaPosture'> | boolean | null
    posture_intent?: StringNullableFilter<'AsanaPosture'> | string | null
    breath_series?: StringNullableListFilter<'AsanaPosture'>
    duration_asana?: StringNullableFilter<'AsanaPosture'> | string | null
    transition_cues_out?: StringNullableFilter<'AsanaPosture'> | string | null
    transition_cues_in?: StringNullableFilter<'AsanaPosture'> | string | null
    setup_cues?: StringNullableFilter<'AsanaPosture'> | string | null
    deepening_cues?: StringNullableFilter<'AsanaPosture'> | string | null
    customize_asana?: StringNullableFilter<'AsanaPosture'> | string | null
    additional_cues?: StringNullableFilter<'AsanaPosture'> | string | null
    joint_action?: StringNullableFilter<'AsanaPosture'> | string | null
    muscle_action?: StringNullableFilter<'AsanaPosture'> | string | null
    created_by?: StringNullableFilter<'AsanaPosture'> | string | null
    asanaActivities?: AsanaActivityListRelationFilter
    poseImages?: PoseImageListRelationFilter
  }

  export type AsanaPostureOrderByWithRelationInput = {
    id?: SortOrder
    english_names?: SortOrder
    sanskrit_names?: SortOrder
    sort_english_name?: SortOrder
    description?: SortOrder
    benefits?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    lore?: SortOrder
    breath_direction_default?: SortOrder
    dristi?: SortOrder
    variations?: SortOrder
    modifications?: SortOrder
    label?: SortOrder
    suggested_postures?: SortOrder
    preparatory_postures?: SortOrder
    preferred_side?: SortOrder
    sideways?: SortOrder
    image?: SortOrder
    created_on?: SortOrder
    updated_on?: SortOrder
    acitivity_completed?: SortOrder
    acitivity_practice?: SortOrder
    posture_intent?: SortOrder
    breath_series?: SortOrder
    duration_asana?: SortOrder
    transition_cues_out?: SortOrder
    transition_cues_in?: SortOrder
    setup_cues?: SortOrder
    deepening_cues?: SortOrder
    customize_asana?: SortOrder
    additional_cues?: SortOrder
    joint_action?: SortOrder
    muscle_action?: SortOrder
    created_by?: SortOrder
    asanaActivities?: AsanaActivityOrderByRelationAggregateInput
    poseImages?: PoseImageOrderByRelationAggregateInput
  }

  export type AsanaPostureWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      sort_english_name?: string
      AND?: AsanaPostureWhereInput | AsanaPostureWhereInput[]
      OR?: AsanaPostureWhereInput[]
      NOT?: AsanaPostureWhereInput | AsanaPostureWhereInput[]
      english_names?: StringNullableListFilter<'AsanaPosture'>
      sanskrit_names?: JsonNullableFilter<'AsanaPosture'>
      description?: StringNullableFilter<'AsanaPosture'> | string | null
      benefits?: StringNullableFilter<'AsanaPosture'> | string | null
      category?: StringNullableFilter<'AsanaPosture'> | string | null
      difficulty?: StringNullableFilter<'AsanaPosture'> | string | null
      lore?: StringNullableFilter<'AsanaPosture'> | string | null
      breath_direction_default?:
        | StringNullableFilter<'AsanaPosture'>
        | string
        | null
      dristi?: StringNullableFilter<'AsanaPosture'> | string | null
      variations?: StringNullableListFilter<'AsanaPosture'>
      modifications?: StringNullableListFilter<'AsanaPosture'>
      label?: StringNullableFilter<'AsanaPosture'> | string | null
      suggested_postures?: StringNullableListFilter<'AsanaPosture'>
      preparatory_postures?: StringNullableListFilter<'AsanaPosture'>
      preferred_side?: StringNullableFilter<'AsanaPosture'> | string | null
      sideways?: BoolNullableFilter<'AsanaPosture'> | boolean | null
      image?: StringNullableFilter<'AsanaPosture'> | string | null
      created_on?: DateTimeNullableFilter<'AsanaPosture'> | Date | string | null
      updated_on?: DateTimeNullableFilter<'AsanaPosture'> | Date | string | null
      acitivity_completed?: BoolNullableFilter<'AsanaPosture'> | boolean | null
      acitivity_practice?: BoolNullableFilter<'AsanaPosture'> | boolean | null
      posture_intent?: StringNullableFilter<'AsanaPosture'> | string | null
      breath_series?: StringNullableListFilter<'AsanaPosture'>
      duration_asana?: StringNullableFilter<'AsanaPosture'> | string | null
      transition_cues_out?: StringNullableFilter<'AsanaPosture'> | string | null
      transition_cues_in?: StringNullableFilter<'AsanaPosture'> | string | null
      setup_cues?: StringNullableFilter<'AsanaPosture'> | string | null
      deepening_cues?: StringNullableFilter<'AsanaPosture'> | string | null
      customize_asana?: StringNullableFilter<'AsanaPosture'> | string | null
      additional_cues?: StringNullableFilter<'AsanaPosture'> | string | null
      joint_action?: StringNullableFilter<'AsanaPosture'> | string | null
      muscle_action?: StringNullableFilter<'AsanaPosture'> | string | null
      created_by?: StringNullableFilter<'AsanaPosture'> | string | null
      asanaActivities?: AsanaActivityListRelationFilter
      poseImages?: PoseImageListRelationFilter
    },
    'id' | 'sort_english_name'
  >

  export type AsanaPostureOrderByWithAggregationInput = {
    id?: SortOrder
    english_names?: SortOrder
    sanskrit_names?: SortOrder
    sort_english_name?: SortOrder
    description?: SortOrder
    benefits?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    lore?: SortOrder
    breath_direction_default?: SortOrder
    dristi?: SortOrder
    variations?: SortOrder
    modifications?: SortOrder
    label?: SortOrder
    suggested_postures?: SortOrder
    preparatory_postures?: SortOrder
    preferred_side?: SortOrder
    sideways?: SortOrder
    image?: SortOrder
    created_on?: SortOrder
    updated_on?: SortOrder
    acitivity_completed?: SortOrder
    acitivity_practice?: SortOrder
    posture_intent?: SortOrder
    breath_series?: SortOrder
    duration_asana?: SortOrder
    transition_cues_out?: SortOrder
    transition_cues_in?: SortOrder
    setup_cues?: SortOrder
    deepening_cues?: SortOrder
    customize_asana?: SortOrder
    additional_cues?: SortOrder
    joint_action?: SortOrder
    muscle_action?: SortOrder
    created_by?: SortOrder
    _count?: AsanaPostureCountOrderByAggregateInput
    _max?: AsanaPostureMaxOrderByAggregateInput
    _min?: AsanaPostureMinOrderByAggregateInput
  }

  export type AsanaPostureScalarWhereWithAggregatesInput = {
    AND?:
      | AsanaPostureScalarWhereWithAggregatesInput
      | AsanaPostureScalarWhereWithAggregatesInput[]
    OR?: AsanaPostureScalarWhereWithAggregatesInput[]
    NOT?:
      | AsanaPostureScalarWhereWithAggregatesInput
      | AsanaPostureScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'AsanaPosture'> | string
    english_names?: StringNullableListFilter<'AsanaPosture'>
    sanskrit_names?: JsonNullableWithAggregatesFilter<'AsanaPosture'>
    sort_english_name?: StringWithAggregatesFilter<'AsanaPosture'> | string
    description?:
      | StringNullableWithAggregatesFilter<'AsanaPosture'>
      | string
      | null
    benefits?:
      | StringNullableWithAggregatesFilter<'AsanaPosture'>
      | string
      | null
    category?:
      | StringNullableWithAggregatesFilter<'AsanaPosture'>
      | string
      | null
    difficulty?:
      | StringNullableWithAggregatesFilter<'AsanaPosture'>
      | string
      | null
    lore?: StringNullableWithAggregatesFilter<'AsanaPosture'> | string | null
    breath_direction_default?:
      | StringNullableWithAggregatesFilter<'AsanaPosture'>
      | string
      | null
    dristi?: StringNullableWithAggregatesFilter<'AsanaPosture'> | string | null
    variations?: StringNullableListFilter<'AsanaPosture'>
    modifications?: StringNullableListFilter<'AsanaPosture'>
    label?: StringNullableWithAggregatesFilter<'AsanaPosture'> | string | null
    suggested_postures?: StringNullableListFilter<'AsanaPosture'>
    preparatory_postures?: StringNullableListFilter<'AsanaPosture'>
    preferred_side?:
      | StringNullableWithAggregatesFilter<'AsanaPosture'>
      | string
      | null
    sideways?: BoolNullableWithAggregatesFilter<'AsanaPosture'> | boolean | null
    image?: StringNullableWithAggregatesFilter<'AsanaPosture'> | string | null
    created_on?:
      | DateTimeNullableWithAggregatesFilter<'AsanaPosture'>
      | Date
      | string
      | null
    updated_on?:
      | DateTimeNullableWithAggregatesFilter<'AsanaPosture'>
      | Date
      | string
      | null
    acitivity_completed?:
      | BoolNullableWithAggregatesFilter<'AsanaPosture'>
      | boolean
      | null
    acitivity_practice?:
      | BoolNullableWithAggregatesFilter<'AsanaPosture'>
      | boolean
      | null
    posture_intent?:
      | StringNullableWithAggregatesFilter<'AsanaPosture'>
      | string
      | null
    breath_series?: StringNullableListFilter<'AsanaPosture'>
    duration_asana?:
      | StringNullableWithAggregatesFilter<'AsanaPosture'>
      | string
      | null
    transition_cues_out?:
      | StringNullableWithAggregatesFilter<'AsanaPosture'>
      | string
      | null
    transition_cues_in?:
      | StringNullableWithAggregatesFilter<'AsanaPosture'>
      | string
      | null
    setup_cues?:
      | StringNullableWithAggregatesFilter<'AsanaPosture'>
      | string
      | null
    deepening_cues?:
      | StringNullableWithAggregatesFilter<'AsanaPosture'>
      | string
      | null
    customize_asana?:
      | StringNullableWithAggregatesFilter<'AsanaPosture'>
      | string
      | null
    additional_cues?:
      | StringNullableWithAggregatesFilter<'AsanaPosture'>
      | string
      | null
    joint_action?:
      | StringNullableWithAggregatesFilter<'AsanaPosture'>
      | string
      | null
    muscle_action?:
      | StringNullableWithAggregatesFilter<'AsanaPosture'>
      | string
      | null
    created_by?:
      | StringNullableWithAggregatesFilter<'AsanaPosture'>
      | string
      | null
  }

  export type AsanaSeriesWhereInput = {
    AND?: AsanaSeriesWhereInput | AsanaSeriesWhereInput[]
    OR?: AsanaSeriesWhereInput[]
    NOT?: AsanaSeriesWhereInput | AsanaSeriesWhereInput[]
    id?: StringFilter<'AsanaSeries'> | string
    seriesName?: StringFilter<'AsanaSeries'> | string
    seriesPostures?: StringNullableListFilter<'AsanaSeries'>
    breathSeries?: StringNullableListFilter<'AsanaSeries'>
    description?: StringNullableFilter<'AsanaSeries'> | string | null
    durationSeries?: StringNullableFilter<'AsanaSeries'> | string | null
    image?: StringNullableFilter<'AsanaSeries'> | string | null
    images?: StringNullableListFilter<'AsanaSeries'>
    created_by?: StringFilter<'AsanaSeries'> | string
    createdAt?: DateTimeNullableFilter<'AsanaSeries'> | Date | string | null
    updatedAt?: DateTimeNullableFilter<'AsanaSeries'> | Date | string | null
  }

  export type AsanaSeriesOrderByWithRelationInput = {
    id?: SortOrder
    seriesName?: SortOrder
    seriesPostures?: SortOrder
    breathSeries?: SortOrder
    description?: SortOrder
    durationSeries?: SortOrder
    image?: SortOrder
    images?: SortOrder
    created_by?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AsanaSeriesWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      AND?: AsanaSeriesWhereInput | AsanaSeriesWhereInput[]
      OR?: AsanaSeriesWhereInput[]
      NOT?: AsanaSeriesWhereInput | AsanaSeriesWhereInput[]
      seriesName?: StringFilter<'AsanaSeries'> | string
      seriesPostures?: StringNullableListFilter<'AsanaSeries'>
      breathSeries?: StringNullableListFilter<'AsanaSeries'>
      description?: StringNullableFilter<'AsanaSeries'> | string | null
      durationSeries?: StringNullableFilter<'AsanaSeries'> | string | null
      image?: StringNullableFilter<'AsanaSeries'> | string | null
      images?: StringNullableListFilter<'AsanaSeries'>
      created_by?: StringFilter<'AsanaSeries'> | string
      createdAt?: DateTimeNullableFilter<'AsanaSeries'> | Date | string | null
      updatedAt?: DateTimeNullableFilter<'AsanaSeries'> | Date | string | null
    },
    'id'
  >

  export type AsanaSeriesOrderByWithAggregationInput = {
    id?: SortOrder
    seriesName?: SortOrder
    seriesPostures?: SortOrder
    breathSeries?: SortOrder
    description?: SortOrder
    durationSeries?: SortOrder
    image?: SortOrder
    images?: SortOrder
    created_by?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AsanaSeriesCountOrderByAggregateInput
    _max?: AsanaSeriesMaxOrderByAggregateInput
    _min?: AsanaSeriesMinOrderByAggregateInput
  }

  export type AsanaSeriesScalarWhereWithAggregatesInput = {
    AND?:
      | AsanaSeriesScalarWhereWithAggregatesInput
      | AsanaSeriesScalarWhereWithAggregatesInput[]
    OR?: AsanaSeriesScalarWhereWithAggregatesInput[]
    NOT?:
      | AsanaSeriesScalarWhereWithAggregatesInput
      | AsanaSeriesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'AsanaSeries'> | string
    seriesName?: StringWithAggregatesFilter<'AsanaSeries'> | string
    seriesPostures?: StringNullableListFilter<'AsanaSeries'>
    breathSeries?: StringNullableListFilter<'AsanaSeries'>
    description?:
      | StringNullableWithAggregatesFilter<'AsanaSeries'>
      | string
      | null
    durationSeries?:
      | StringNullableWithAggregatesFilter<'AsanaSeries'>
      | string
      | null
    image?: StringNullableWithAggregatesFilter<'AsanaSeries'> | string | null
    images?: StringNullableListFilter<'AsanaSeries'>
    created_by?: StringWithAggregatesFilter<'AsanaSeries'> | string
    createdAt?:
      | DateTimeNullableWithAggregatesFilter<'AsanaSeries'>
      | Date
      | string
      | null
    updatedAt?:
      | DateTimeNullableWithAggregatesFilter<'AsanaSeries'>
      | Date
      | string
      | null
  }

  export type AsanaSequenceWhereInput = {
    AND?: AsanaSequenceWhereInput | AsanaSequenceWhereInput[]
    OR?: AsanaSequenceWhereInput[]
    NOT?: AsanaSequenceWhereInput | AsanaSequenceWhereInput[]
    id?: StringFilter<'AsanaSequence'> | string
    nameSequence?: StringFilter<'AsanaSequence'> | string
    sequencesSeries?: JsonNullableListFilter<'AsanaSequence'>
    description?: StringNullableFilter<'AsanaSequence'> | string | null
    durationSequence?: StringNullableFilter<'AsanaSequence'> | string | null
    image?: StringNullableFilter<'AsanaSequence'> | string | null
    breath_direction?: StringNullableFilter<'AsanaSequence'> | string | null
    created_by?: StringNullableFilter<'AsanaSequence'> | string | null
    createdAt?: DateTimeNullableFilter<'AsanaSequence'> | Date | string | null
    updatedAt?: DateTimeNullableFilter<'AsanaSequence'> | Date | string | null
  }

  export type AsanaSequenceOrderByWithRelationInput = {
    id?: SortOrder
    nameSequence?: SortOrder
    sequencesSeries?: SortOrder
    description?: SortOrder
    durationSequence?: SortOrder
    image?: SortOrder
    breath_direction?: SortOrder
    created_by?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AsanaSequenceWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      AND?: AsanaSequenceWhereInput | AsanaSequenceWhereInput[]
      OR?: AsanaSequenceWhereInput[]
      NOT?: AsanaSequenceWhereInput | AsanaSequenceWhereInput[]
      nameSequence?: StringFilter<'AsanaSequence'> | string
      sequencesSeries?: JsonNullableListFilter<'AsanaSequence'>
      description?: StringNullableFilter<'AsanaSequence'> | string | null
      durationSequence?: StringNullableFilter<'AsanaSequence'> | string | null
      image?: StringNullableFilter<'AsanaSequence'> | string | null
      breath_direction?: StringNullableFilter<'AsanaSequence'> | string | null
      created_by?: StringNullableFilter<'AsanaSequence'> | string | null
      createdAt?: DateTimeNullableFilter<'AsanaSequence'> | Date | string | null
      updatedAt?: DateTimeNullableFilter<'AsanaSequence'> | Date | string | null
    },
    'id'
  >

  export type AsanaSequenceOrderByWithAggregationInput = {
    id?: SortOrder
    nameSequence?: SortOrder
    sequencesSeries?: SortOrder
    description?: SortOrder
    durationSequence?: SortOrder
    image?: SortOrder
    breath_direction?: SortOrder
    created_by?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AsanaSequenceCountOrderByAggregateInput
    _max?: AsanaSequenceMaxOrderByAggregateInput
    _min?: AsanaSequenceMinOrderByAggregateInput
  }

  export type AsanaSequenceScalarWhereWithAggregatesInput = {
    AND?:
      | AsanaSequenceScalarWhereWithAggregatesInput
      | AsanaSequenceScalarWhereWithAggregatesInput[]
    OR?: AsanaSequenceScalarWhereWithAggregatesInput[]
    NOT?:
      | AsanaSequenceScalarWhereWithAggregatesInput
      | AsanaSequenceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'AsanaSequence'> | string
    nameSequence?: StringWithAggregatesFilter<'AsanaSequence'> | string
    sequencesSeries?: JsonNullableListFilter<'AsanaSequence'>
    description?:
      | StringNullableWithAggregatesFilter<'AsanaSequence'>
      | string
      | null
    durationSequence?:
      | StringNullableWithAggregatesFilter<'AsanaSequence'>
      | string
      | null
    image?: StringNullableWithAggregatesFilter<'AsanaSequence'> | string | null
    breath_direction?:
      | StringNullableWithAggregatesFilter<'AsanaSequence'>
      | string
      | null
    created_by?:
      | StringNullableWithAggregatesFilter<'AsanaSequence'>
      | string
      | null
    createdAt?:
      | DateTimeNullableWithAggregatesFilter<'AsanaSequence'>
      | Date
      | string
      | null
    updatedAt?:
      | DateTimeNullableWithAggregatesFilter<'AsanaSequence'>
      | Date
      | string
      | null
  }

  export type AsanaActivityWhereInput = {
    AND?: AsanaActivityWhereInput | AsanaActivityWhereInput[]
    OR?: AsanaActivityWhereInput[]
    NOT?: AsanaActivityWhereInput | AsanaActivityWhereInput[]
    id?: StringFilter<'AsanaActivity'> | string
    userId?: StringFilter<'AsanaActivity'> | string
    postureId?: StringFilter<'AsanaActivity'> | string
    postureName?: StringFilter<'AsanaActivity'> | string
    sort_english_name?: StringFilter<'AsanaActivity'> | string
    duration?: IntFilter<'AsanaActivity'> | number
    datePerformed?: DateTimeFilter<'AsanaActivity'> | Date | string
    notes?: StringNullableFilter<'AsanaActivity'> | string | null
    sensations?: StringNullableFilter<'AsanaActivity'> | string | null
    completionStatus?: StringFilter<'AsanaActivity'> | string
    difficulty?: StringNullableFilter<'AsanaActivity'> | string | null
    createdAt?: DateTimeFilter<'AsanaActivity'> | Date | string
    updatedAt?: DateTimeFilter<'AsanaActivity'> | Date | string
    user?: XOR<UserDataRelationFilter, UserDataWhereInput>
    posture?: XOR<AsanaPostureRelationFilter, AsanaPostureWhereInput>
  }

  export type AsanaActivityOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    postureId?: SortOrder
    postureName?: SortOrder
    sort_english_name?: SortOrder
    duration?: SortOrder
    datePerformed?: SortOrder
    notes?: SortOrder
    sensations?: SortOrder
    completionStatus?: SortOrder
    difficulty?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserDataOrderByWithRelationInput
    posture?: AsanaPostureOrderByWithRelationInput
  }

  export type AsanaActivityWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      AND?: AsanaActivityWhereInput | AsanaActivityWhereInput[]
      OR?: AsanaActivityWhereInput[]
      NOT?: AsanaActivityWhereInput | AsanaActivityWhereInput[]
      userId?: StringFilter<'AsanaActivity'> | string
      postureId?: StringFilter<'AsanaActivity'> | string
      postureName?: StringFilter<'AsanaActivity'> | string
      sort_english_name?: StringFilter<'AsanaActivity'> | string
      duration?: IntFilter<'AsanaActivity'> | number
      datePerformed?: DateTimeFilter<'AsanaActivity'> | Date | string
      notes?: StringNullableFilter<'AsanaActivity'> | string | null
      sensations?: StringNullableFilter<'AsanaActivity'> | string | null
      completionStatus?: StringFilter<'AsanaActivity'> | string
      difficulty?: StringNullableFilter<'AsanaActivity'> | string | null
      createdAt?: DateTimeFilter<'AsanaActivity'> | Date | string
      updatedAt?: DateTimeFilter<'AsanaActivity'> | Date | string
      user?: XOR<UserDataRelationFilter, UserDataWhereInput>
      posture?: XOR<AsanaPostureRelationFilter, AsanaPostureWhereInput>
    },
    'id'
  >

  export type AsanaActivityOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    postureId?: SortOrder
    postureName?: SortOrder
    sort_english_name?: SortOrder
    duration?: SortOrder
    datePerformed?: SortOrder
    notes?: SortOrder
    sensations?: SortOrder
    completionStatus?: SortOrder
    difficulty?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AsanaActivityCountOrderByAggregateInput
    _avg?: AsanaActivityAvgOrderByAggregateInput
    _max?: AsanaActivityMaxOrderByAggregateInput
    _min?: AsanaActivityMinOrderByAggregateInput
    _sum?: AsanaActivitySumOrderByAggregateInput
  }

  export type AsanaActivityScalarWhereWithAggregatesInput = {
    AND?:
      | AsanaActivityScalarWhereWithAggregatesInput
      | AsanaActivityScalarWhereWithAggregatesInput[]
    OR?: AsanaActivityScalarWhereWithAggregatesInput[]
    NOT?:
      | AsanaActivityScalarWhereWithAggregatesInput
      | AsanaActivityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'AsanaActivity'> | string
    userId?: StringWithAggregatesFilter<'AsanaActivity'> | string
    postureId?: StringWithAggregatesFilter<'AsanaActivity'> | string
    postureName?: StringWithAggregatesFilter<'AsanaActivity'> | string
    sort_english_name?: StringWithAggregatesFilter<'AsanaActivity'> | string
    duration?: IntWithAggregatesFilter<'AsanaActivity'> | number
    datePerformed?:
      | DateTimeWithAggregatesFilter<'AsanaActivity'>
      | Date
      | string
    notes?: StringNullableWithAggregatesFilter<'AsanaActivity'> | string | null
    sensations?:
      | StringNullableWithAggregatesFilter<'AsanaActivity'>
      | string
      | null
    completionStatus?: StringWithAggregatesFilter<'AsanaActivity'> | string
    difficulty?:
      | StringNullableWithAggregatesFilter<'AsanaActivity'>
      | string
      | null
    createdAt?: DateTimeWithAggregatesFilter<'AsanaActivity'> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<'AsanaActivity'> | Date | string
  }

  export type SeriesActivityWhereInput = {
    AND?: SeriesActivityWhereInput | SeriesActivityWhereInput[]
    OR?: SeriesActivityWhereInput[]
    NOT?: SeriesActivityWhereInput | SeriesActivityWhereInput[]
    id?: StringFilter<'SeriesActivity'> | string
    userId?: StringFilter<'SeriesActivity'> | string
    seriesId?: StringFilter<'SeriesActivity'> | string
    seriesName?: StringFilter<'SeriesActivity'> | string
    datePerformed?: DateTimeFilter<'SeriesActivity'> | Date | string
    difficulty?: StringNullableFilter<'SeriesActivity'> | string | null
    completionStatus?: StringFilter<'SeriesActivity'> | string
    duration?: IntFilter<'SeriesActivity'> | number
    notes?: StringNullableFilter<'SeriesActivity'> | string | null
    createdAt?: DateTimeFilter<'SeriesActivity'> | Date | string
    updatedAt?: DateTimeFilter<'SeriesActivity'> | Date | string
    user?: XOR<UserDataRelationFilter, UserDataWhereInput>
  }

  export type SeriesActivityOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    seriesId?: SortOrder
    seriesName?: SortOrder
    datePerformed?: SortOrder
    difficulty?: SortOrder
    completionStatus?: SortOrder
    duration?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserDataOrderByWithRelationInput
  }

  export type SeriesActivityWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      AND?: SeriesActivityWhereInput | SeriesActivityWhereInput[]
      OR?: SeriesActivityWhereInput[]
      NOT?: SeriesActivityWhereInput | SeriesActivityWhereInput[]
      userId?: StringFilter<'SeriesActivity'> | string
      seriesId?: StringFilter<'SeriesActivity'> | string
      seriesName?: StringFilter<'SeriesActivity'> | string
      datePerformed?: DateTimeFilter<'SeriesActivity'> | Date | string
      difficulty?: StringNullableFilter<'SeriesActivity'> | string | null
      completionStatus?: StringFilter<'SeriesActivity'> | string
      duration?: IntFilter<'SeriesActivity'> | number
      notes?: StringNullableFilter<'SeriesActivity'> | string | null
      createdAt?: DateTimeFilter<'SeriesActivity'> | Date | string
      updatedAt?: DateTimeFilter<'SeriesActivity'> | Date | string
      user?: XOR<UserDataRelationFilter, UserDataWhereInput>
    },
    'id'
  >

  export type SeriesActivityOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    seriesId?: SortOrder
    seriesName?: SortOrder
    datePerformed?: SortOrder
    difficulty?: SortOrder
    completionStatus?: SortOrder
    duration?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SeriesActivityCountOrderByAggregateInput
    _avg?: SeriesActivityAvgOrderByAggregateInput
    _max?: SeriesActivityMaxOrderByAggregateInput
    _min?: SeriesActivityMinOrderByAggregateInput
    _sum?: SeriesActivitySumOrderByAggregateInput
  }

  export type SeriesActivityScalarWhereWithAggregatesInput = {
    AND?:
      | SeriesActivityScalarWhereWithAggregatesInput
      | SeriesActivityScalarWhereWithAggregatesInput[]
    OR?: SeriesActivityScalarWhereWithAggregatesInput[]
    NOT?:
      | SeriesActivityScalarWhereWithAggregatesInput
      | SeriesActivityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'SeriesActivity'> | string
    userId?: StringWithAggregatesFilter<'SeriesActivity'> | string
    seriesId?: StringWithAggregatesFilter<'SeriesActivity'> | string
    seriesName?: StringWithAggregatesFilter<'SeriesActivity'> | string
    datePerformed?:
      | DateTimeWithAggregatesFilter<'SeriesActivity'>
      | Date
      | string
    difficulty?:
      | StringNullableWithAggregatesFilter<'SeriesActivity'>
      | string
      | null
    completionStatus?: StringWithAggregatesFilter<'SeriesActivity'> | string
    duration?: IntWithAggregatesFilter<'SeriesActivity'> | number
    notes?: StringNullableWithAggregatesFilter<'SeriesActivity'> | string | null
    createdAt?: DateTimeWithAggregatesFilter<'SeriesActivity'> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<'SeriesActivity'> | Date | string
  }

  export type SequenceActivityWhereInput = {
    AND?: SequenceActivityWhereInput | SequenceActivityWhereInput[]
    OR?: SequenceActivityWhereInput[]
    NOT?: SequenceActivityWhereInput | SequenceActivityWhereInput[]
    id?: StringFilter<'SequenceActivity'> | string
    userId?: StringFilter<'SequenceActivity'> | string
    sequenceId?: StringFilter<'SequenceActivity'> | string
    sequenceName?: StringFilter<'SequenceActivity'> | string
    datePerformed?: DateTimeFilter<'SequenceActivity'> | Date | string
    difficulty?: StringNullableFilter<'SequenceActivity'> | string | null
    completionStatus?: StringFilter<'SequenceActivity'> | string
    duration?: IntFilter<'SequenceActivity'> | number
    notes?: StringNullableFilter<'SequenceActivity'> | string | null
    createdAt?: DateTimeFilter<'SequenceActivity'> | Date | string
    updatedAt?: DateTimeFilter<'SequenceActivity'> | Date | string
    user?: XOR<UserDataRelationFilter, UserDataWhereInput>
  }

  export type SequenceActivityOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    sequenceId?: SortOrder
    sequenceName?: SortOrder
    datePerformed?: SortOrder
    difficulty?: SortOrder
    completionStatus?: SortOrder
    duration?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserDataOrderByWithRelationInput
  }

  export type SequenceActivityWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      AND?: SequenceActivityWhereInput | SequenceActivityWhereInput[]
      OR?: SequenceActivityWhereInput[]
      NOT?: SequenceActivityWhereInput | SequenceActivityWhereInput[]
      userId?: StringFilter<'SequenceActivity'> | string
      sequenceId?: StringFilter<'SequenceActivity'> | string
      sequenceName?: StringFilter<'SequenceActivity'> | string
      datePerformed?: DateTimeFilter<'SequenceActivity'> | Date | string
      difficulty?: StringNullableFilter<'SequenceActivity'> | string | null
      completionStatus?: StringFilter<'SequenceActivity'> | string
      duration?: IntFilter<'SequenceActivity'> | number
      notes?: StringNullableFilter<'SequenceActivity'> | string | null
      createdAt?: DateTimeFilter<'SequenceActivity'> | Date | string
      updatedAt?: DateTimeFilter<'SequenceActivity'> | Date | string
      user?: XOR<UserDataRelationFilter, UserDataWhereInput>
    },
    'id'
  >

  export type SequenceActivityOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    sequenceId?: SortOrder
    sequenceName?: SortOrder
    datePerformed?: SortOrder
    difficulty?: SortOrder
    completionStatus?: SortOrder
    duration?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SequenceActivityCountOrderByAggregateInput
    _avg?: SequenceActivityAvgOrderByAggregateInput
    _max?: SequenceActivityMaxOrderByAggregateInput
    _min?: SequenceActivityMinOrderByAggregateInput
    _sum?: SequenceActivitySumOrderByAggregateInput
  }

  export type SequenceActivityScalarWhereWithAggregatesInput = {
    AND?:
      | SequenceActivityScalarWhereWithAggregatesInput
      | SequenceActivityScalarWhereWithAggregatesInput[]
    OR?: SequenceActivityScalarWhereWithAggregatesInput[]
    NOT?:
      | SequenceActivityScalarWhereWithAggregatesInput
      | SequenceActivityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'SequenceActivity'> | string
    userId?: StringWithAggregatesFilter<'SequenceActivity'> | string
    sequenceId?: StringWithAggregatesFilter<'SequenceActivity'> | string
    sequenceName?: StringWithAggregatesFilter<'SequenceActivity'> | string
    datePerformed?:
      | DateTimeWithAggregatesFilter<'SequenceActivity'>
      | Date
      | string
    difficulty?:
      | StringNullableWithAggregatesFilter<'SequenceActivity'>
      | string
      | null
    completionStatus?: StringWithAggregatesFilter<'SequenceActivity'> | string
    duration?: IntWithAggregatesFilter<'SequenceActivity'> | number
    notes?:
      | StringNullableWithAggregatesFilter<'SequenceActivity'>
      | string
      | null
    createdAt?: DateTimeWithAggregatesFilter<'SequenceActivity'> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<'SequenceActivity'> | Date | string
  }

  export type UserLoginWhereInput = {
    AND?: UserLoginWhereInput | UserLoginWhereInput[]
    OR?: UserLoginWhereInput[]
    NOT?: UserLoginWhereInput | UserLoginWhereInput[]
    id?: StringFilter<'UserLogin'> | string
    userId?: StringFilter<'UserLogin'> | string
    loginDate?: DateTimeFilter<'UserLogin'> | Date | string
    ipAddress?: StringNullableFilter<'UserLogin'> | string | null
    userAgent?: StringNullableFilter<'UserLogin'> | string | null
    provider?: StringNullableFilter<'UserLogin'> | string | null
    createdAt?: DateTimeFilter<'UserLogin'> | Date | string
    user?: XOR<UserDataRelationFilter, UserDataWhereInput>
  }

  export type UserLoginOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    loginDate?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    provider?: SortOrder
    createdAt?: SortOrder
    user?: UserDataOrderByWithRelationInput
  }

  export type UserLoginWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      AND?: UserLoginWhereInput | UserLoginWhereInput[]
      OR?: UserLoginWhereInput[]
      NOT?: UserLoginWhereInput | UserLoginWhereInput[]
      userId?: StringFilter<'UserLogin'> | string
      loginDate?: DateTimeFilter<'UserLogin'> | Date | string
      ipAddress?: StringNullableFilter<'UserLogin'> | string | null
      userAgent?: StringNullableFilter<'UserLogin'> | string | null
      provider?: StringNullableFilter<'UserLogin'> | string | null
      createdAt?: DateTimeFilter<'UserLogin'> | Date | string
      user?: XOR<UserDataRelationFilter, UserDataWhereInput>
    },
    'id'
  >

  export type UserLoginOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    loginDate?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    provider?: SortOrder
    createdAt?: SortOrder
    _count?: UserLoginCountOrderByAggregateInput
    _max?: UserLoginMaxOrderByAggregateInput
    _min?: UserLoginMinOrderByAggregateInput
  }

  export type UserLoginScalarWhereWithAggregatesInput = {
    AND?:
      | UserLoginScalarWhereWithAggregatesInput
      | UserLoginScalarWhereWithAggregatesInput[]
    OR?: UserLoginScalarWhereWithAggregatesInput[]
    NOT?:
      | UserLoginScalarWhereWithAggregatesInput
      | UserLoginScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'UserLogin'> | string
    userId?: StringWithAggregatesFilter<'UserLogin'> | string
    loginDate?: DateTimeWithAggregatesFilter<'UserLogin'> | Date | string
    ipAddress?: StringNullableWithAggregatesFilter<'UserLogin'> | string | null
    userAgent?: StringNullableWithAggregatesFilter<'UserLogin'> | string | null
    provider?: StringNullableWithAggregatesFilter<'UserLogin'> | string | null
    createdAt?: DateTimeWithAggregatesFilter<'UserLogin'> | Date | string
  }

  export type PoseImageWhereInput = {
    AND?: PoseImageWhereInput | PoseImageWhereInput[]
    OR?: PoseImageWhereInput[]
    NOT?: PoseImageWhereInput | PoseImageWhereInput[]
    id?: StringFilter<'PoseImage'> | string
    userId?: StringFilter<'PoseImage'> | string
    postureId?: StringNullableFilter<'PoseImage'> | string | null
    postureName?: StringNullableFilter<'PoseImage'> | string | null
    url?: StringFilter<'PoseImage'> | string
    altText?: StringNullableFilter<'PoseImage'> | string | null
    fileName?: StringNullableFilter<'PoseImage'> | string | null
    fileSize?: IntNullableFilter<'PoseImage'> | number | null
    uploadedAt?: DateTimeFilter<'PoseImage'> | Date | string
    storageType?: EnumStorageTypeFilter<'PoseImage'> | $Enums.StorageType
    localStorageId?: StringNullableFilter<'PoseImage'> | string | null
    cloudflareId?: StringNullableFilter<'PoseImage'> | string | null
    isOffline?: BoolFilter<'PoseImage'> | boolean
    imageType?: StringFilter<'PoseImage'> | string
    createdAt?: DateTimeFilter<'PoseImage'> | Date | string
    updatedAt?: DateTimeFilter<'PoseImage'> | Date | string
    user?: XOR<UserDataRelationFilter, UserDataWhereInput>
    posture?: XOR<
      AsanaPostureNullableRelationFilter,
      AsanaPostureWhereInput
    > | null
  }

  export type PoseImageOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    postureId?: SortOrder
    postureName?: SortOrder
    url?: SortOrder
    altText?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    uploadedAt?: SortOrder
    storageType?: SortOrder
    localStorageId?: SortOrder
    cloudflareId?: SortOrder
    isOffline?: SortOrder
    imageType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserDataOrderByWithRelationInput
    posture?: AsanaPostureOrderByWithRelationInput
  }

  export type PoseImageWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      AND?: PoseImageWhereInput | PoseImageWhereInput[]
      OR?: PoseImageWhereInput[]
      NOT?: PoseImageWhereInput | PoseImageWhereInput[]
      userId?: StringFilter<'PoseImage'> | string
      postureId?: StringNullableFilter<'PoseImage'> | string | null
      postureName?: StringNullableFilter<'PoseImage'> | string | null
      url?: StringFilter<'PoseImage'> | string
      altText?: StringNullableFilter<'PoseImage'> | string | null
      fileName?: StringNullableFilter<'PoseImage'> | string | null
      fileSize?: IntNullableFilter<'PoseImage'> | number | null
      uploadedAt?: DateTimeFilter<'PoseImage'> | Date | string
      storageType?: EnumStorageTypeFilter<'PoseImage'> | $Enums.StorageType
      localStorageId?: StringNullableFilter<'PoseImage'> | string | null
      cloudflareId?: StringNullableFilter<'PoseImage'> | string | null
      isOffline?: BoolFilter<'PoseImage'> | boolean
      imageType?: StringFilter<'PoseImage'> | string
      createdAt?: DateTimeFilter<'PoseImage'> | Date | string
      updatedAt?: DateTimeFilter<'PoseImage'> | Date | string
      user?: XOR<UserDataRelationFilter, UserDataWhereInput>
      posture?: XOR<
        AsanaPostureNullableRelationFilter,
        AsanaPostureWhereInput
      > | null
    },
    'id'
  >

  export type PoseImageOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    postureId?: SortOrder
    postureName?: SortOrder
    url?: SortOrder
    altText?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    uploadedAt?: SortOrder
    storageType?: SortOrder
    localStorageId?: SortOrder
    cloudflareId?: SortOrder
    isOffline?: SortOrder
    imageType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PoseImageCountOrderByAggregateInput
    _avg?: PoseImageAvgOrderByAggregateInput
    _max?: PoseImageMaxOrderByAggregateInput
    _min?: PoseImageMinOrderByAggregateInput
    _sum?: PoseImageSumOrderByAggregateInput
  }

  export type PoseImageScalarWhereWithAggregatesInput = {
    AND?:
      | PoseImageScalarWhereWithAggregatesInput
      | PoseImageScalarWhereWithAggregatesInput[]
    OR?: PoseImageScalarWhereWithAggregatesInput[]
    NOT?:
      | PoseImageScalarWhereWithAggregatesInput
      | PoseImageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'PoseImage'> | string
    userId?: StringWithAggregatesFilter<'PoseImage'> | string
    postureId?: StringNullableWithAggregatesFilter<'PoseImage'> | string | null
    postureName?:
      | StringNullableWithAggregatesFilter<'PoseImage'>
      | string
      | null
    url?: StringWithAggregatesFilter<'PoseImage'> | string
    altText?: StringNullableWithAggregatesFilter<'PoseImage'> | string | null
    fileName?: StringNullableWithAggregatesFilter<'PoseImage'> | string | null
    fileSize?: IntNullableWithAggregatesFilter<'PoseImage'> | number | null
    uploadedAt?: DateTimeWithAggregatesFilter<'PoseImage'> | Date | string
    storageType?:
      | EnumStorageTypeWithAggregatesFilter<'PoseImage'>
      | $Enums.StorageType
    localStorageId?:
      | StringNullableWithAggregatesFilter<'PoseImage'>
      | string
      | null
    cloudflareId?:
      | StringNullableWithAggregatesFilter<'PoseImage'>
      | string
      | null
    isOffline?: BoolWithAggregatesFilter<'PoseImage'> | boolean
    imageType?: StringWithAggregatesFilter<'PoseImage'> | string
    createdAt?: DateTimeWithAggregatesFilter<'PoseImage'> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<'PoseImage'> | Date | string
  }

  export type GlossaryTermWhereInput = {
    AND?: GlossaryTermWhereInput | GlossaryTermWhereInput[]
    OR?: GlossaryTermWhereInput[]
    NOT?: GlossaryTermWhereInput | GlossaryTermWhereInput[]
    id?: StringFilter<'GlossaryTerm'> | string
    term?: StringFilter<'GlossaryTerm'> | string
    meaning?: StringFilter<'GlossaryTerm'> | string
    whyMatters?: StringFilter<'GlossaryTerm'> | string
    category?: StringNullableFilter<'GlossaryTerm'> | string | null
    sanskrit?: StringNullableFilter<'GlossaryTerm'> | string | null
    pronunciation?: StringNullableFilter<'GlossaryTerm'> | string | null
    source?: EnumGlossarySourceFilter<'GlossaryTerm'> | $Enums.GlossarySource
    userId?: StringNullableFilter<'GlossaryTerm'> | string | null
    readOnly?: BoolFilter<'GlossaryTerm'> | boolean
    createdAt?: DateTimeFilter<'GlossaryTerm'> | Date | string
    updatedAt?: DateTimeFilter<'GlossaryTerm'> | Date | string
    user?: XOR<UserDataNullableRelationFilter, UserDataWhereInput> | null
  }

  export type GlossaryTermOrderByWithRelationInput = {
    id?: SortOrder
    term?: SortOrder
    meaning?: SortOrder
    whyMatters?: SortOrder
    category?: SortOrder
    sanskrit?: SortOrder
    pronunciation?: SortOrder
    source?: SortOrder
    userId?: SortOrder
    readOnly?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserDataOrderByWithRelationInput
  }

  export type GlossaryTermWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      term?: string
      AND?: GlossaryTermWhereInput | GlossaryTermWhereInput[]
      OR?: GlossaryTermWhereInput[]
      NOT?: GlossaryTermWhereInput | GlossaryTermWhereInput[]
      meaning?: StringFilter<'GlossaryTerm'> | string
      whyMatters?: StringFilter<'GlossaryTerm'> | string
      category?: StringNullableFilter<'GlossaryTerm'> | string | null
      sanskrit?: StringNullableFilter<'GlossaryTerm'> | string | null
      pronunciation?: StringNullableFilter<'GlossaryTerm'> | string | null
      source?: EnumGlossarySourceFilter<'GlossaryTerm'> | $Enums.GlossarySource
      userId?: StringNullableFilter<'GlossaryTerm'> | string | null
      readOnly?: BoolFilter<'GlossaryTerm'> | boolean
      createdAt?: DateTimeFilter<'GlossaryTerm'> | Date | string
      updatedAt?: DateTimeFilter<'GlossaryTerm'> | Date | string
      user?: XOR<UserDataNullableRelationFilter, UserDataWhereInput> | null
    },
    'id' | 'term'
  >

  export type GlossaryTermOrderByWithAggregationInput = {
    id?: SortOrder
    term?: SortOrder
    meaning?: SortOrder
    whyMatters?: SortOrder
    category?: SortOrder
    sanskrit?: SortOrder
    pronunciation?: SortOrder
    source?: SortOrder
    userId?: SortOrder
    readOnly?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GlossaryTermCountOrderByAggregateInput
    _max?: GlossaryTermMaxOrderByAggregateInput
    _min?: GlossaryTermMinOrderByAggregateInput
  }

  export type GlossaryTermScalarWhereWithAggregatesInput = {
    AND?:
      | GlossaryTermScalarWhereWithAggregatesInput
      | GlossaryTermScalarWhereWithAggregatesInput[]
    OR?: GlossaryTermScalarWhereWithAggregatesInput[]
    NOT?:
      | GlossaryTermScalarWhereWithAggregatesInput
      | GlossaryTermScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'GlossaryTerm'> | string
    term?: StringWithAggregatesFilter<'GlossaryTerm'> | string
    meaning?: StringWithAggregatesFilter<'GlossaryTerm'> | string
    whyMatters?: StringWithAggregatesFilter<'GlossaryTerm'> | string
    category?:
      | StringNullableWithAggregatesFilter<'GlossaryTerm'>
      | string
      | null
    sanskrit?:
      | StringNullableWithAggregatesFilter<'GlossaryTerm'>
      | string
      | null
    pronunciation?:
      | StringNullableWithAggregatesFilter<'GlossaryTerm'>
      | string
      | null
    source?:
      | EnumGlossarySourceWithAggregatesFilter<'GlossaryTerm'>
      | $Enums.GlossarySource
    userId?: StringNullableWithAggregatesFilter<'GlossaryTerm'> | string | null
    readOnly?: BoolWithAggregatesFilter<'GlossaryTerm'> | boolean
    createdAt?: DateTimeWithAggregatesFilter<'GlossaryTerm'> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<'GlossaryTerm'> | Date | string
  }

  export type UserDataCreateInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    providerAccounts?: ProviderAccountCreateNestedManyWithoutUserInput
    asanaActivities?: AsanaActivityCreateNestedManyWithoutUserInput
    seriesActivities?: SeriesActivityCreateNestedManyWithoutUserInput
    sequenceActivities?: SequenceActivityCreateNestedManyWithoutUserInput
    userLogins?: UserLoginCreateNestedManyWithoutUserInput
    poseImages?: PoseImageCreateNestedManyWithoutUserInput
    glossaryTerms?: GlossaryTermCreateNestedManyWithoutUserInput
    reminders?: ReminderCreateNestedManyWithoutUserInput
    pushSubscriptions?: PushSubscriptionCreateNestedManyWithoutUserInput
  }

  export type UserDataUncheckedCreateInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    providerAccounts?: ProviderAccountUncheckedCreateNestedManyWithoutUserInput
    asanaActivities?: AsanaActivityUncheckedCreateNestedManyWithoutUserInput
    seriesActivities?: SeriesActivityUncheckedCreateNestedManyWithoutUserInput
    sequenceActivities?: SequenceActivityUncheckedCreateNestedManyWithoutUserInput
    userLogins?: UserLoginUncheckedCreateNestedManyWithoutUserInput
    poseImages?: PoseImageUncheckedCreateNestedManyWithoutUserInput
    glossaryTerms?: GlossaryTermUncheckedCreateNestedManyWithoutUserInput
    reminders?: ReminderUncheckedCreateNestedManyWithoutUserInput
    pushSubscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserDataUpdateInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUpdateManyWithoutUserNestedInput
    asanaActivities?: AsanaActivityUpdateManyWithoutUserNestedInput
    seriesActivities?: SeriesActivityUpdateManyWithoutUserNestedInput
    sequenceActivities?: SequenceActivityUpdateManyWithoutUserNestedInput
    userLogins?: UserLoginUpdateManyWithoutUserNestedInput
    poseImages?: PoseImageUpdateManyWithoutUserNestedInput
    glossaryTerms?: GlossaryTermUpdateManyWithoutUserNestedInput
    reminders?: ReminderUpdateManyWithoutUserNestedInput
    pushSubscriptions?: PushSubscriptionUpdateManyWithoutUserNestedInput
  }

  export type UserDataUncheckedUpdateInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUncheckedUpdateManyWithoutUserNestedInput
    asanaActivities?: AsanaActivityUncheckedUpdateManyWithoutUserNestedInput
    seriesActivities?: SeriesActivityUncheckedUpdateManyWithoutUserNestedInput
    sequenceActivities?: SequenceActivityUncheckedUpdateManyWithoutUserNestedInput
    userLogins?: UserLoginUncheckedUpdateManyWithoutUserNestedInput
    poseImages?: PoseImageUncheckedUpdateManyWithoutUserNestedInput
    glossaryTerms?: GlossaryTermUncheckedUpdateManyWithoutUserNestedInput
    reminders?: ReminderUncheckedUpdateManyWithoutUserNestedInput
    pushSubscriptions?: PushSubscriptionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserDataCreateManyInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
  }

  export type UserDataUpdateManyMutationInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
  }

  export type UserDataUncheckedUpdateManyInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
  }

  export type ReminderCreateInput = {
    id?: string
    timeOfDay: string
    days?: ReminderCreatedaysInput | string[]
    enabled?: boolean
    message?: string
    lastSent?: Date | string | null
    emailNotificationsEnabled?: boolean
    user: UserDataCreateNestedOneWithoutRemindersInput
  }

  export type ReminderUncheckedCreateInput = {
    id?: string
    userId: string
    timeOfDay: string
    days?: ReminderCreatedaysInput | string[]
    enabled?: boolean
    message?: string
    lastSent?: Date | string | null
    emailNotificationsEnabled?: boolean
  }

  export type ReminderUpdateInput = {
    timeOfDay?: StringFieldUpdateOperationsInput | string
    days?: ReminderUpdatedaysInput | string[]
    enabled?: BoolFieldUpdateOperationsInput | boolean
    message?: StringFieldUpdateOperationsInput | string
    lastSent?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailNotificationsEnabled?: BoolFieldUpdateOperationsInput | boolean
    user?: UserDataUpdateOneRequiredWithoutRemindersNestedInput
  }

  export type ReminderUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    timeOfDay?: StringFieldUpdateOperationsInput | string
    days?: ReminderUpdatedaysInput | string[]
    enabled?: BoolFieldUpdateOperationsInput | boolean
    message?: StringFieldUpdateOperationsInput | string
    lastSent?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailNotificationsEnabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ReminderCreateManyInput = {
    id?: string
    userId: string
    timeOfDay: string
    days?: ReminderCreatedaysInput | string[]
    enabled?: boolean
    message?: string
    lastSent?: Date | string | null
    emailNotificationsEnabled?: boolean
  }

  export type ReminderUpdateManyMutationInput = {
    timeOfDay?: StringFieldUpdateOperationsInput | string
    days?: ReminderUpdatedaysInput | string[]
    enabled?: BoolFieldUpdateOperationsInput | boolean
    message?: StringFieldUpdateOperationsInput | string
    lastSent?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailNotificationsEnabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ReminderUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    timeOfDay?: StringFieldUpdateOperationsInput | string
    days?: ReminderUpdatedaysInput | string[]
    enabled?: BoolFieldUpdateOperationsInput | boolean
    message?: StringFieldUpdateOperationsInput | string
    lastSent?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailNotificationsEnabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PushSubscriptionCreateInput = {
    id?: string
    endpoint: string
    p256dh: string
    auth: string
    createdAt?: Date | string
    user: UserDataCreateNestedOneWithoutPushSubscriptionsInput
  }

  export type PushSubscriptionUncheckedCreateInput = {
    id?: string
    userId: string
    endpoint: string
    p256dh: string
    auth: string
    createdAt?: Date | string
  }

  export type PushSubscriptionUpdateInput = {
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dh?: StringFieldUpdateOperationsInput | string
    auth?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserDataUpdateOneRequiredWithoutPushSubscriptionsNestedInput
  }

  export type PushSubscriptionUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dh?: StringFieldUpdateOperationsInput | string
    auth?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushSubscriptionCreateManyInput = {
    id?: string
    userId: string
    endpoint: string
    p256dh: string
    auth: string
    createdAt?: Date | string
  }

  export type PushSubscriptionUpdateManyMutationInput = {
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dh?: StringFieldUpdateOperationsInput | string
    auth?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushSubscriptionUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dh?: StringFieldUpdateOperationsInput | string
    auth?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderAccountCreateInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: InputJsonValue | null
    credentials_password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserDataCreateNestedOneWithoutProviderAccountsInput
  }

  export type ProviderAccountUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: InputJsonValue | null
    credentials_password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProviderAccountUpdateInput = {
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: InputJsonValue | InputJsonValue | null
    credentials_password?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserDataUpdateOneRequiredWithoutProviderAccountsNestedInput
  }

  export type ProviderAccountUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: InputJsonValue | InputJsonValue | null
    credentials_password?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderAccountCreateManyInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: InputJsonValue | null
    credentials_password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProviderAccountUpdateManyMutationInput = {
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: InputJsonValue | InputJsonValue | null
    credentials_password?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderAccountUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: InputJsonValue | InputJsonValue | null
    credentials_password?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsanaPostureCreateInput = {
    id?: string
    english_names?: AsanaPostureCreateenglish_namesInput | string[]
    sanskrit_names?: InputJsonValue | null
    sort_english_name: string
    description?: string | null
    benefits?: string | null
    category?: string | null
    difficulty?: string | null
    lore?: string | null
    breath_direction_default?: string | null
    dristi?: string | null
    variations?: AsanaPostureCreatevariationsInput | string[]
    modifications?: AsanaPostureCreatemodificationsInput | string[]
    label?: string | null
    suggested_postures?: AsanaPostureCreatesuggested_posturesInput | string[]
    preparatory_postures?:
      | AsanaPostureCreatepreparatory_posturesInput
      | string[]
    preferred_side?: string | null
    sideways?: boolean | null
    image?: string | null
    created_on?: Date | string | null
    updated_on?: Date | string | null
    acitivity_completed?: boolean | null
    acitivity_practice?: boolean | null
    posture_intent?: string | null
    breath_series?: AsanaPostureCreatebreath_seriesInput | string[]
    duration_asana?: string | null
    transition_cues_out?: string | null
    transition_cues_in?: string | null
    setup_cues?: string | null
    deepening_cues?: string | null
    customize_asana?: string | null
    additional_cues?: string | null
    joint_action?: string | null
    muscle_action?: string | null
    created_by?: string | null
    asanaActivities?: AsanaActivityCreateNestedManyWithoutPostureInput
    poseImages?: PoseImageCreateNestedManyWithoutPostureInput
  }

  export type AsanaPostureUncheckedCreateInput = {
    id?: string
    english_names?: AsanaPostureCreateenglish_namesInput | string[]
    sanskrit_names?: InputJsonValue | null
    sort_english_name: string
    description?: string | null
    benefits?: string | null
    category?: string | null
    difficulty?: string | null
    lore?: string | null
    breath_direction_default?: string | null
    dristi?: string | null
    variations?: AsanaPostureCreatevariationsInput | string[]
    modifications?: AsanaPostureCreatemodificationsInput | string[]
    label?: string | null
    suggested_postures?: AsanaPostureCreatesuggested_posturesInput | string[]
    preparatory_postures?:
      | AsanaPostureCreatepreparatory_posturesInput
      | string[]
    preferred_side?: string | null
    sideways?: boolean | null
    image?: string | null
    created_on?: Date | string | null
    updated_on?: Date | string | null
    acitivity_completed?: boolean | null
    acitivity_practice?: boolean | null
    posture_intent?: string | null
    breath_series?: AsanaPostureCreatebreath_seriesInput | string[]
    duration_asana?: string | null
    transition_cues_out?: string | null
    transition_cues_in?: string | null
    setup_cues?: string | null
    deepening_cues?: string | null
    customize_asana?: string | null
    additional_cues?: string | null
    joint_action?: string | null
    muscle_action?: string | null
    created_by?: string | null
    asanaActivities?: AsanaActivityUncheckedCreateNestedManyWithoutPostureInput
    poseImages?: PoseImageUncheckedCreateNestedManyWithoutPostureInput
  }

  export type AsanaPostureUpdateInput = {
    english_names?: AsanaPostureUpdateenglish_namesInput | string[]
    sanskrit_names?: InputJsonValue | InputJsonValue | null
    sort_english_name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    benefits?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    lore?: NullableStringFieldUpdateOperationsInput | string | null
    breath_direction_default?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    dristi?: NullableStringFieldUpdateOperationsInput | string | null
    variations?: AsanaPostureUpdatevariationsInput | string[]
    modifications?: AsanaPostureUpdatemodificationsInput | string[]
    label?: NullableStringFieldUpdateOperationsInput | string | null
    suggested_postures?: AsanaPostureUpdatesuggested_posturesInput | string[]
    preparatory_postures?:
      | AsanaPostureUpdatepreparatory_posturesInput
      | string[]
    preferred_side?: NullableStringFieldUpdateOperationsInput | string | null
    sideways?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    created_on?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    updated_on?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    acitivity_completed?:
      | NullableBoolFieldUpdateOperationsInput
      | boolean
      | null
    acitivity_practice?: NullableBoolFieldUpdateOperationsInput | boolean | null
    posture_intent?: NullableStringFieldUpdateOperationsInput | string | null
    breath_series?: AsanaPostureUpdatebreath_seriesInput | string[]
    duration_asana?: NullableStringFieldUpdateOperationsInput | string | null
    transition_cues_out?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    transition_cues_in?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    setup_cues?: NullableStringFieldUpdateOperationsInput | string | null
    deepening_cues?: NullableStringFieldUpdateOperationsInput | string | null
    customize_asana?: NullableStringFieldUpdateOperationsInput | string | null
    additional_cues?: NullableStringFieldUpdateOperationsInput | string | null
    joint_action?: NullableStringFieldUpdateOperationsInput | string | null
    muscle_action?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    asanaActivities?: AsanaActivityUpdateManyWithoutPostureNestedInput
    poseImages?: PoseImageUpdateManyWithoutPostureNestedInput
  }

  export type AsanaPostureUncheckedUpdateInput = {
    english_names?: AsanaPostureUpdateenglish_namesInput | string[]
    sanskrit_names?: InputJsonValue | InputJsonValue | null
    sort_english_name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    benefits?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    lore?: NullableStringFieldUpdateOperationsInput | string | null
    breath_direction_default?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    dristi?: NullableStringFieldUpdateOperationsInput | string | null
    variations?: AsanaPostureUpdatevariationsInput | string[]
    modifications?: AsanaPostureUpdatemodificationsInput | string[]
    label?: NullableStringFieldUpdateOperationsInput | string | null
    suggested_postures?: AsanaPostureUpdatesuggested_posturesInput | string[]
    preparatory_postures?:
      | AsanaPostureUpdatepreparatory_posturesInput
      | string[]
    preferred_side?: NullableStringFieldUpdateOperationsInput | string | null
    sideways?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    created_on?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    updated_on?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    acitivity_completed?:
      | NullableBoolFieldUpdateOperationsInput
      | boolean
      | null
    acitivity_practice?: NullableBoolFieldUpdateOperationsInput | boolean | null
    posture_intent?: NullableStringFieldUpdateOperationsInput | string | null
    breath_series?: AsanaPostureUpdatebreath_seriesInput | string[]
    duration_asana?: NullableStringFieldUpdateOperationsInput | string | null
    transition_cues_out?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    transition_cues_in?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    setup_cues?: NullableStringFieldUpdateOperationsInput | string | null
    deepening_cues?: NullableStringFieldUpdateOperationsInput | string | null
    customize_asana?: NullableStringFieldUpdateOperationsInput | string | null
    additional_cues?: NullableStringFieldUpdateOperationsInput | string | null
    joint_action?: NullableStringFieldUpdateOperationsInput | string | null
    muscle_action?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    asanaActivities?: AsanaActivityUncheckedUpdateManyWithoutPostureNestedInput
    poseImages?: PoseImageUncheckedUpdateManyWithoutPostureNestedInput
  }

  export type AsanaPostureCreateManyInput = {
    id?: string
    english_names?: AsanaPostureCreateenglish_namesInput | string[]
    sanskrit_names?: InputJsonValue | null
    sort_english_name: string
    description?: string | null
    benefits?: string | null
    category?: string | null
    difficulty?: string | null
    lore?: string | null
    breath_direction_default?: string | null
    dristi?: string | null
    variations?: AsanaPostureCreatevariationsInput | string[]
    modifications?: AsanaPostureCreatemodificationsInput | string[]
    label?: string | null
    suggested_postures?: AsanaPostureCreatesuggested_posturesInput | string[]
    preparatory_postures?:
      | AsanaPostureCreatepreparatory_posturesInput
      | string[]
    preferred_side?: string | null
    sideways?: boolean | null
    image?: string | null
    created_on?: Date | string | null
    updated_on?: Date | string | null
    acitivity_completed?: boolean | null
    acitivity_practice?: boolean | null
    posture_intent?: string | null
    breath_series?: AsanaPostureCreatebreath_seriesInput | string[]
    duration_asana?: string | null
    transition_cues_out?: string | null
    transition_cues_in?: string | null
    setup_cues?: string | null
    deepening_cues?: string | null
    customize_asana?: string | null
    additional_cues?: string | null
    joint_action?: string | null
    muscle_action?: string | null
    created_by?: string | null
  }

  export type AsanaPostureUpdateManyMutationInput = {
    english_names?: AsanaPostureUpdateenglish_namesInput | string[]
    sanskrit_names?: InputJsonValue | InputJsonValue | null
    sort_english_name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    benefits?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    lore?: NullableStringFieldUpdateOperationsInput | string | null
    breath_direction_default?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    dristi?: NullableStringFieldUpdateOperationsInput | string | null
    variations?: AsanaPostureUpdatevariationsInput | string[]
    modifications?: AsanaPostureUpdatemodificationsInput | string[]
    label?: NullableStringFieldUpdateOperationsInput | string | null
    suggested_postures?: AsanaPostureUpdatesuggested_posturesInput | string[]
    preparatory_postures?:
      | AsanaPostureUpdatepreparatory_posturesInput
      | string[]
    preferred_side?: NullableStringFieldUpdateOperationsInput | string | null
    sideways?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    created_on?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    updated_on?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    acitivity_completed?:
      | NullableBoolFieldUpdateOperationsInput
      | boolean
      | null
    acitivity_practice?: NullableBoolFieldUpdateOperationsInput | boolean | null
    posture_intent?: NullableStringFieldUpdateOperationsInput | string | null
    breath_series?: AsanaPostureUpdatebreath_seriesInput | string[]
    duration_asana?: NullableStringFieldUpdateOperationsInput | string | null
    transition_cues_out?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    transition_cues_in?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    setup_cues?: NullableStringFieldUpdateOperationsInput | string | null
    deepening_cues?: NullableStringFieldUpdateOperationsInput | string | null
    customize_asana?: NullableStringFieldUpdateOperationsInput | string | null
    additional_cues?: NullableStringFieldUpdateOperationsInput | string | null
    joint_action?: NullableStringFieldUpdateOperationsInput | string | null
    muscle_action?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AsanaPostureUncheckedUpdateManyInput = {
    english_names?: AsanaPostureUpdateenglish_namesInput | string[]
    sanskrit_names?: InputJsonValue | InputJsonValue | null
    sort_english_name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    benefits?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    lore?: NullableStringFieldUpdateOperationsInput | string | null
    breath_direction_default?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    dristi?: NullableStringFieldUpdateOperationsInput | string | null
    variations?: AsanaPostureUpdatevariationsInput | string[]
    modifications?: AsanaPostureUpdatemodificationsInput | string[]
    label?: NullableStringFieldUpdateOperationsInput | string | null
    suggested_postures?: AsanaPostureUpdatesuggested_posturesInput | string[]
    preparatory_postures?:
      | AsanaPostureUpdatepreparatory_posturesInput
      | string[]
    preferred_side?: NullableStringFieldUpdateOperationsInput | string | null
    sideways?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    created_on?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    updated_on?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    acitivity_completed?:
      | NullableBoolFieldUpdateOperationsInput
      | boolean
      | null
    acitivity_practice?: NullableBoolFieldUpdateOperationsInput | boolean | null
    posture_intent?: NullableStringFieldUpdateOperationsInput | string | null
    breath_series?: AsanaPostureUpdatebreath_seriesInput | string[]
    duration_asana?: NullableStringFieldUpdateOperationsInput | string | null
    transition_cues_out?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    transition_cues_in?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    setup_cues?: NullableStringFieldUpdateOperationsInput | string | null
    deepening_cues?: NullableStringFieldUpdateOperationsInput | string | null
    customize_asana?: NullableStringFieldUpdateOperationsInput | string | null
    additional_cues?: NullableStringFieldUpdateOperationsInput | string | null
    joint_action?: NullableStringFieldUpdateOperationsInput | string | null
    muscle_action?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AsanaSeriesCreateInput = {
    id?: string
    seriesName: string
    seriesPostures?: AsanaSeriesCreateseriesPosturesInput | string[]
    breathSeries?: AsanaSeriesCreatebreathSeriesInput | string[]
    description?: string | null
    durationSeries?: string | null
    image?: string | null
    images?: AsanaSeriesCreateimagesInput | string[]
    created_by: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type AsanaSeriesUncheckedCreateInput = {
    id?: string
    seriesName: string
    seriesPostures?: AsanaSeriesCreateseriesPosturesInput | string[]
    breathSeries?: AsanaSeriesCreatebreathSeriesInput | string[]
    description?: string | null
    durationSeries?: string | null
    image?: string | null
    images?: AsanaSeriesCreateimagesInput | string[]
    created_by: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type AsanaSeriesUpdateInput = {
    seriesName?: StringFieldUpdateOperationsInput | string
    seriesPostures?: AsanaSeriesUpdateseriesPosturesInput | string[]
    breathSeries?: AsanaSeriesUpdatebreathSeriesInput | string[]
    description?: NullableStringFieldUpdateOperationsInput | string | null
    durationSeries?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    images?: AsanaSeriesUpdateimagesInput | string[]
    created_by?: StringFieldUpdateOperationsInput | string
    createdAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
  }

  export type AsanaSeriesUncheckedUpdateInput = {
    seriesName?: StringFieldUpdateOperationsInput | string
    seriesPostures?: AsanaSeriesUpdateseriesPosturesInput | string[]
    breathSeries?: AsanaSeriesUpdatebreathSeriesInput | string[]
    description?: NullableStringFieldUpdateOperationsInput | string | null
    durationSeries?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    images?: AsanaSeriesUpdateimagesInput | string[]
    created_by?: StringFieldUpdateOperationsInput | string
    createdAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
  }

  export type AsanaSeriesCreateManyInput = {
    id?: string
    seriesName: string
    seriesPostures?: AsanaSeriesCreateseriesPosturesInput | string[]
    breathSeries?: AsanaSeriesCreatebreathSeriesInput | string[]
    description?: string | null
    durationSeries?: string | null
    image?: string | null
    images?: AsanaSeriesCreateimagesInput | string[]
    created_by: string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type AsanaSeriesUpdateManyMutationInput = {
    seriesName?: StringFieldUpdateOperationsInput | string
    seriesPostures?: AsanaSeriesUpdateseriesPosturesInput | string[]
    breathSeries?: AsanaSeriesUpdatebreathSeriesInput | string[]
    description?: NullableStringFieldUpdateOperationsInput | string | null
    durationSeries?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    images?: AsanaSeriesUpdateimagesInput | string[]
    created_by?: StringFieldUpdateOperationsInput | string
    createdAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
  }

  export type AsanaSeriesUncheckedUpdateManyInput = {
    seriesName?: StringFieldUpdateOperationsInput | string
    seriesPostures?: AsanaSeriesUpdateseriesPosturesInput | string[]
    breathSeries?: AsanaSeriesUpdatebreathSeriesInput | string[]
    description?: NullableStringFieldUpdateOperationsInput | string | null
    durationSeries?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    images?: AsanaSeriesUpdateimagesInput | string[]
    created_by?: StringFieldUpdateOperationsInput | string
    createdAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
  }

  export type AsanaSequenceCreateInput = {
    id?: string
    nameSequence: string
    sequencesSeries?: AsanaSequenceCreatesequencesSeriesInput | InputJsonValue[]
    description?: string | null
    durationSequence?: string | null
    image?: string | null
    breath_direction?: string | null
    created_by?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type AsanaSequenceUncheckedCreateInput = {
    id?: string
    nameSequence: string
    sequencesSeries?: AsanaSequenceCreatesequencesSeriesInput | InputJsonValue[]
    description?: string | null
    durationSequence?: string | null
    image?: string | null
    breath_direction?: string | null
    created_by?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type AsanaSequenceUpdateInput = {
    nameSequence?: StringFieldUpdateOperationsInput | string
    sequencesSeries?: AsanaSequenceUpdatesequencesSeriesInput | InputJsonValue[]
    description?: NullableStringFieldUpdateOperationsInput | string | null
    durationSequence?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    breath_direction?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
  }

  export type AsanaSequenceUncheckedUpdateInput = {
    nameSequence?: StringFieldUpdateOperationsInput | string
    sequencesSeries?: AsanaSequenceUpdatesequencesSeriesInput | InputJsonValue[]
    description?: NullableStringFieldUpdateOperationsInput | string | null
    durationSequence?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    breath_direction?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
  }

  export type AsanaSequenceCreateManyInput = {
    id?: string
    nameSequence: string
    sequencesSeries?: AsanaSequenceCreatesequencesSeriesInput | InputJsonValue[]
    description?: string | null
    durationSequence?: string | null
    image?: string | null
    breath_direction?: string | null
    created_by?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type AsanaSequenceUpdateManyMutationInput = {
    nameSequence?: StringFieldUpdateOperationsInput | string
    sequencesSeries?: AsanaSequenceUpdatesequencesSeriesInput | InputJsonValue[]
    description?: NullableStringFieldUpdateOperationsInput | string | null
    durationSequence?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    breath_direction?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
  }

  export type AsanaSequenceUncheckedUpdateManyInput = {
    nameSequence?: StringFieldUpdateOperationsInput | string
    sequencesSeries?: AsanaSequenceUpdatesequencesSeriesInput | InputJsonValue[]
    description?: NullableStringFieldUpdateOperationsInput | string | null
    durationSequence?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    breath_direction?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
  }

  export type AsanaActivityCreateInput = {
    id?: string
    postureName: string
    sort_english_name: string
    duration: number
    datePerformed: Date | string
    notes?: string | null
    sensations?: string | null
    completionStatus: string
    difficulty?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserDataCreateNestedOneWithoutAsanaActivitiesInput
    posture: AsanaPostureCreateNestedOneWithoutAsanaActivitiesInput
  }

  export type AsanaActivityUncheckedCreateInput = {
    id?: string
    userId: string
    postureId: string
    postureName: string
    sort_english_name: string
    duration: number
    datePerformed: Date | string
    notes?: string | null
    sensations?: string | null
    completionStatus: string
    difficulty?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AsanaActivityUpdateInput = {
    postureName?: StringFieldUpdateOperationsInput | string
    sort_english_name?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    sensations?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserDataUpdateOneRequiredWithoutAsanaActivitiesNestedInput
    posture?: AsanaPostureUpdateOneRequiredWithoutAsanaActivitiesNestedInput
  }

  export type AsanaActivityUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    postureId?: StringFieldUpdateOperationsInput | string
    postureName?: StringFieldUpdateOperationsInput | string
    sort_english_name?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    sensations?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsanaActivityCreateManyInput = {
    id?: string
    userId: string
    postureId: string
    postureName: string
    sort_english_name: string
    duration: number
    datePerformed: Date | string
    notes?: string | null
    sensations?: string | null
    completionStatus: string
    difficulty?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AsanaActivityUpdateManyMutationInput = {
    postureName?: StringFieldUpdateOperationsInput | string
    sort_english_name?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    sensations?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsanaActivityUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    postureId?: StringFieldUpdateOperationsInput | string
    postureName?: StringFieldUpdateOperationsInput | string
    sort_english_name?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    sensations?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeriesActivityCreateInput = {
    id?: string
    seriesId: string
    seriesName: string
    datePerformed: Date | string
    difficulty?: string | null
    completionStatus?: string
    duration?: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserDataCreateNestedOneWithoutSeriesActivitiesInput
  }

  export type SeriesActivityUncheckedCreateInput = {
    id?: string
    userId: string
    seriesId: string
    seriesName: string
    datePerformed: Date | string
    difficulty?: string | null
    completionStatus?: string
    duration?: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeriesActivityUpdateInput = {
    seriesId?: StringFieldUpdateOperationsInput | string
    seriesName?: StringFieldUpdateOperationsInput | string
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserDataUpdateOneRequiredWithoutSeriesActivitiesNestedInput
  }

  export type SeriesActivityUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    seriesId?: StringFieldUpdateOperationsInput | string
    seriesName?: StringFieldUpdateOperationsInput | string
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeriesActivityCreateManyInput = {
    id?: string
    userId: string
    seriesId: string
    seriesName: string
    datePerformed: Date | string
    difficulty?: string | null
    completionStatus?: string
    duration?: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeriesActivityUpdateManyMutationInput = {
    seriesId?: StringFieldUpdateOperationsInput | string
    seriesName?: StringFieldUpdateOperationsInput | string
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeriesActivityUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    seriesId?: StringFieldUpdateOperationsInput | string
    seriesName?: StringFieldUpdateOperationsInput | string
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SequenceActivityCreateInput = {
    id?: string
    sequenceId: string
    sequenceName: string
    datePerformed: Date | string
    difficulty?: string | null
    completionStatus?: string
    duration?: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserDataCreateNestedOneWithoutSequenceActivitiesInput
  }

  export type SequenceActivityUncheckedCreateInput = {
    id?: string
    userId: string
    sequenceId: string
    sequenceName: string
    datePerformed: Date | string
    difficulty?: string | null
    completionStatus?: string
    duration?: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SequenceActivityUpdateInput = {
    sequenceId?: StringFieldUpdateOperationsInput | string
    sequenceName?: StringFieldUpdateOperationsInput | string
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserDataUpdateOneRequiredWithoutSequenceActivitiesNestedInput
  }

  export type SequenceActivityUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    sequenceId?: StringFieldUpdateOperationsInput | string
    sequenceName?: StringFieldUpdateOperationsInput | string
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SequenceActivityCreateManyInput = {
    id?: string
    userId: string
    sequenceId: string
    sequenceName: string
    datePerformed: Date | string
    difficulty?: string | null
    completionStatus?: string
    duration?: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SequenceActivityUpdateManyMutationInput = {
    sequenceId?: StringFieldUpdateOperationsInput | string
    sequenceName?: StringFieldUpdateOperationsInput | string
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SequenceActivityUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    sequenceId?: StringFieldUpdateOperationsInput | string
    sequenceName?: StringFieldUpdateOperationsInput | string
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLoginCreateInput = {
    id?: string
    loginDate?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    provider?: string | null
    createdAt?: Date | string
    user: UserDataCreateNestedOneWithoutUserLoginsInput
  }

  export type UserLoginUncheckedCreateInput = {
    id?: string
    userId: string
    loginDate?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    provider?: string | null
    createdAt?: Date | string
  }

  export type UserLoginUpdateInput = {
    loginDate?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserDataUpdateOneRequiredWithoutUserLoginsNestedInput
  }

  export type UserLoginUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    loginDate?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLoginCreateManyInput = {
    id?: string
    userId: string
    loginDate?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    provider?: string | null
    createdAt?: Date | string
  }

  export type UserLoginUpdateManyMutationInput = {
    loginDate?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLoginUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    loginDate?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PoseImageCreateInput = {
    id?: string
    postureName?: string | null
    url: string
    altText?: string | null
    fileName?: string | null
    fileSize?: number | null
    uploadedAt?: Date | string
    storageType?: $Enums.StorageType
    localStorageId?: string | null
    cloudflareId?: string | null
    isOffline?: boolean
    imageType?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserDataCreateNestedOneWithoutPoseImagesInput
    posture?: AsanaPostureCreateNestedOneWithoutPoseImagesInput
  }

  export type PoseImageUncheckedCreateInput = {
    id?: string
    userId: string
    postureId?: string | null
    postureName?: string | null
    url: string
    altText?: string | null
    fileName?: string | null
    fileSize?: number | null
    uploadedAt?: Date | string
    storageType?: $Enums.StorageType
    localStorageId?: string | null
    cloudflareId?: string | null
    isOffline?: boolean
    imageType?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PoseImageUpdateInput = {
    postureName?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageType?: EnumStorageTypeFieldUpdateOperationsInput | $Enums.StorageType
    localStorageId?: NullableStringFieldUpdateOperationsInput | string | null
    cloudflareId?: NullableStringFieldUpdateOperationsInput | string | null
    isOffline?: BoolFieldUpdateOperationsInput | boolean
    imageType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserDataUpdateOneRequiredWithoutPoseImagesNestedInput
    posture?: AsanaPostureUpdateOneWithoutPoseImagesNestedInput
  }

  export type PoseImageUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    postureId?: NullableStringFieldUpdateOperationsInput | string | null
    postureName?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageType?: EnumStorageTypeFieldUpdateOperationsInput | $Enums.StorageType
    localStorageId?: NullableStringFieldUpdateOperationsInput | string | null
    cloudflareId?: NullableStringFieldUpdateOperationsInput | string | null
    isOffline?: BoolFieldUpdateOperationsInput | boolean
    imageType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PoseImageCreateManyInput = {
    id?: string
    userId: string
    postureId?: string | null
    postureName?: string | null
    url: string
    altText?: string | null
    fileName?: string | null
    fileSize?: number | null
    uploadedAt?: Date | string
    storageType?: $Enums.StorageType
    localStorageId?: string | null
    cloudflareId?: string | null
    isOffline?: boolean
    imageType?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PoseImageUpdateManyMutationInput = {
    postureName?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageType?: EnumStorageTypeFieldUpdateOperationsInput | $Enums.StorageType
    localStorageId?: NullableStringFieldUpdateOperationsInput | string | null
    cloudflareId?: NullableStringFieldUpdateOperationsInput | string | null
    isOffline?: BoolFieldUpdateOperationsInput | boolean
    imageType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PoseImageUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    postureId?: NullableStringFieldUpdateOperationsInput | string | null
    postureName?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageType?: EnumStorageTypeFieldUpdateOperationsInput | $Enums.StorageType
    localStorageId?: NullableStringFieldUpdateOperationsInput | string | null
    cloudflareId?: NullableStringFieldUpdateOperationsInput | string | null
    isOffline?: BoolFieldUpdateOperationsInput | boolean
    imageType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GlossaryTermCreateInput = {
    id?: string
    term: string
    meaning: string
    whyMatters: string
    category?: string | null
    sanskrit?: string | null
    pronunciation?: string | null
    source?: $Enums.GlossarySource
    readOnly?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserDataCreateNestedOneWithoutGlossaryTermsInput
  }

  export type GlossaryTermUncheckedCreateInput = {
    id?: string
    term: string
    meaning: string
    whyMatters: string
    category?: string | null
    sanskrit?: string | null
    pronunciation?: string | null
    source?: $Enums.GlossarySource
    userId?: string | null
    readOnly?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GlossaryTermUpdateInput = {
    term?: StringFieldUpdateOperationsInput | string
    meaning?: StringFieldUpdateOperationsInput | string
    whyMatters?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sanskrit?: NullableStringFieldUpdateOperationsInput | string | null
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    source?:
      | EnumGlossarySourceFieldUpdateOperationsInput
      | $Enums.GlossarySource
    readOnly?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserDataUpdateOneWithoutGlossaryTermsNestedInput
  }

  export type GlossaryTermUncheckedUpdateInput = {
    term?: StringFieldUpdateOperationsInput | string
    meaning?: StringFieldUpdateOperationsInput | string
    whyMatters?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sanskrit?: NullableStringFieldUpdateOperationsInput | string | null
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    source?:
      | EnumGlossarySourceFieldUpdateOperationsInput
      | $Enums.GlossarySource
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    readOnly?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GlossaryTermCreateManyInput = {
    id?: string
    term: string
    meaning: string
    whyMatters: string
    category?: string | null
    sanskrit?: string | null
    pronunciation?: string | null
    source?: $Enums.GlossarySource
    userId?: string | null
    readOnly?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GlossaryTermUpdateManyMutationInput = {
    term?: StringFieldUpdateOperationsInput | string
    meaning?: StringFieldUpdateOperationsInput | string
    whyMatters?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sanskrit?: NullableStringFieldUpdateOperationsInput | string | null
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    source?:
      | EnumGlossarySourceFieldUpdateOperationsInput
      | $Enums.GlossarySource
    readOnly?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GlossaryTermUncheckedUpdateManyInput = {
    term?: StringFieldUpdateOperationsInput | string
    meaning?: StringFieldUpdateOperationsInput | string
    whyMatters?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sanskrit?: NullableStringFieldUpdateOperationsInput | string | null
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    source?:
      | EnumGlossarySourceFieldUpdateOperationsInput
      | $Enums.GlossarySource
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    readOnly?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
    isSet?: boolean
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonNullableFilterBase<$PrismaModel>>,
          Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    isSet?: boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type ProviderAccountListRelationFilter = {
    every?: ProviderAccountWhereInput
    some?: ProviderAccountWhereInput
    none?: ProviderAccountWhereInput
  }

  export type AsanaActivityListRelationFilter = {
    every?: AsanaActivityWhereInput
    some?: AsanaActivityWhereInput
    none?: AsanaActivityWhereInput
  }

  export type SeriesActivityListRelationFilter = {
    every?: SeriesActivityWhereInput
    some?: SeriesActivityWhereInput
    none?: SeriesActivityWhereInput
  }

  export type SequenceActivityListRelationFilter = {
    every?: SequenceActivityWhereInput
    some?: SequenceActivityWhereInput
    none?: SequenceActivityWhereInput
  }

  export type UserLoginListRelationFilter = {
    every?: UserLoginWhereInput
    some?: UserLoginWhereInput
    none?: UserLoginWhereInput
  }

  export type PoseImageListRelationFilter = {
    every?: PoseImageWhereInput
    some?: PoseImageWhereInput
    none?: PoseImageWhereInput
  }

  export type GlossaryTermListRelationFilter = {
    every?: GlossaryTermWhereInput
    some?: GlossaryTermWhereInput
    none?: GlossaryTermWhereInput
  }

  export type ReminderListRelationFilter = {
    every?: ReminderWhereInput
    some?: ReminderWhereInput
    none?: ReminderWhereInput
  }

  export type PushSubscriptionListRelationFilter = {
    every?: PushSubscriptionWhereInput
    some?: PushSubscriptionWhereInput
    none?: PushSubscriptionWhereInput
  }

  export type ProviderAccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AsanaActivityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SeriesActivityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SequenceActivityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserLoginOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PoseImageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GlossaryTermOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReminderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PushSubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserDataCountOrderByAggregateInput = {
    id?: SortOrder
    provider_id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    pronouns?: SortOrder
    profile?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    bio?: SortOrder
    headline?: SortOrder
    location?: SortOrder
    websiteURL?: SortOrder
    shareQuick?: SortOrder
    yogaStyle?: SortOrder
    yogaExperience?: SortOrder
    company?: SortOrder
    socialURL?: SortOrder
    isLocationPublic?: SortOrder
    role?: SortOrder
    profileImages?: SortOrder
    activeProfileImage?: SortOrder
    tz?: SortOrder
  }

  export type UserDataMaxOrderByAggregateInput = {
    id?: SortOrder
    provider_id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    pronouns?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    bio?: SortOrder
    headline?: SortOrder
    location?: SortOrder
    websiteURL?: SortOrder
    shareQuick?: SortOrder
    yogaStyle?: SortOrder
    yogaExperience?: SortOrder
    company?: SortOrder
    socialURL?: SortOrder
    isLocationPublic?: SortOrder
    role?: SortOrder
    activeProfileImage?: SortOrder
    tz?: SortOrder
  }

  export type UserDataMinOrderByAggregateInput = {
    id?: SortOrder
    provider_id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    pronouns?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    bio?: SortOrder
    headline?: SortOrder
    location?: SortOrder
    websiteURL?: SortOrder
    shareQuick?: SortOrder
    yogaStyle?: SortOrder
    yogaExperience?: SortOrder
    company?: SortOrder
    socialURL?: SortOrder
    isLocationPublic?: SortOrder
    role?: SortOrder
    activeProfileImage?: SortOrder
    tz?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?:
      | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
      | Date
      | string
      | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
    isSet?: boolean
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
          Exclude<
            keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
            'path'
          >
        >,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<
          Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
          'path'
        >
      >

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserDataRelationFilter = {
    is?: UserDataWhereInput
    isNot?: UserDataWhereInput
  }

  export type ReminderCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    timeOfDay?: SortOrder
    days?: SortOrder
    enabled?: SortOrder
    message?: SortOrder
    lastSent?: SortOrder
    emailNotificationsEnabled?: SortOrder
  }

  export type ReminderMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    timeOfDay?: SortOrder
    enabled?: SortOrder
    message?: SortOrder
    lastSent?: SortOrder
    emailNotificationsEnabled?: SortOrder
  }

  export type ReminderMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    timeOfDay?: SortOrder
    enabled?: SortOrder
    message?: SortOrder
    lastSent?: SortOrder
    emailNotificationsEnabled?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type PushSubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    endpoint?: SortOrder
    p256dh?: SortOrder
    auth?: SortOrder
    createdAt?: SortOrder
  }

  export type PushSubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    endpoint?: SortOrder
    p256dh?: SortOrder
    auth?: SortOrder
    createdAt?: SortOrder
  }

  export type PushSubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    endpoint?: SortOrder
    p256dh?: SortOrder
    auth?: SortOrder
    createdAt?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type ProviderAccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
    credentials_password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProviderAccountAvgOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type ProviderAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    credentials_password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProviderAccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    credentials_password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProviderAccountSumOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
    isSet?: boolean
  }

  export type AsanaPostureCountOrderByAggregateInput = {
    id?: SortOrder
    english_names?: SortOrder
    sanskrit_names?: SortOrder
    sort_english_name?: SortOrder
    description?: SortOrder
    benefits?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    lore?: SortOrder
    breath_direction_default?: SortOrder
    dristi?: SortOrder
    variations?: SortOrder
    modifications?: SortOrder
    label?: SortOrder
    suggested_postures?: SortOrder
    preparatory_postures?: SortOrder
    preferred_side?: SortOrder
    sideways?: SortOrder
    image?: SortOrder
    created_on?: SortOrder
    updated_on?: SortOrder
    acitivity_completed?: SortOrder
    acitivity_practice?: SortOrder
    posture_intent?: SortOrder
    breath_series?: SortOrder
    duration_asana?: SortOrder
    transition_cues_out?: SortOrder
    transition_cues_in?: SortOrder
    setup_cues?: SortOrder
    deepening_cues?: SortOrder
    customize_asana?: SortOrder
    additional_cues?: SortOrder
    joint_action?: SortOrder
    muscle_action?: SortOrder
    created_by?: SortOrder
  }

  export type AsanaPostureMaxOrderByAggregateInput = {
    id?: SortOrder
    sort_english_name?: SortOrder
    description?: SortOrder
    benefits?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    lore?: SortOrder
    breath_direction_default?: SortOrder
    dristi?: SortOrder
    label?: SortOrder
    preferred_side?: SortOrder
    sideways?: SortOrder
    image?: SortOrder
    created_on?: SortOrder
    updated_on?: SortOrder
    acitivity_completed?: SortOrder
    acitivity_practice?: SortOrder
    posture_intent?: SortOrder
    duration_asana?: SortOrder
    transition_cues_out?: SortOrder
    transition_cues_in?: SortOrder
    setup_cues?: SortOrder
    deepening_cues?: SortOrder
    customize_asana?: SortOrder
    additional_cues?: SortOrder
    joint_action?: SortOrder
    muscle_action?: SortOrder
    created_by?: SortOrder
  }

  export type AsanaPostureMinOrderByAggregateInput = {
    id?: SortOrder
    sort_english_name?: SortOrder
    description?: SortOrder
    benefits?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    lore?: SortOrder
    breath_direction_default?: SortOrder
    dristi?: SortOrder
    label?: SortOrder
    preferred_side?: SortOrder
    sideways?: SortOrder
    image?: SortOrder
    created_on?: SortOrder
    updated_on?: SortOrder
    acitivity_completed?: SortOrder
    acitivity_practice?: SortOrder
    posture_intent?: SortOrder
    duration_asana?: SortOrder
    transition_cues_out?: SortOrder
    transition_cues_in?: SortOrder
    setup_cues?: SortOrder
    deepening_cues?: SortOrder
    customize_asana?: SortOrder
    additional_cues?: SortOrder
    joint_action?: SortOrder
    muscle_action?: SortOrder
    created_by?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type AsanaSeriesCountOrderByAggregateInput = {
    id?: SortOrder
    seriesName?: SortOrder
    seriesPostures?: SortOrder
    breathSeries?: SortOrder
    description?: SortOrder
    durationSeries?: SortOrder
    image?: SortOrder
    images?: SortOrder
    created_by?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AsanaSeriesMaxOrderByAggregateInput = {
    id?: SortOrder
    seriesName?: SortOrder
    description?: SortOrder
    durationSeries?: SortOrder
    image?: SortOrder
    created_by?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AsanaSeriesMinOrderByAggregateInput = {
    id?: SortOrder
    seriesName?: SortOrder
    description?: SortOrder
    durationSeries?: SortOrder
    image?: SortOrder
    created_by?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonNullableListFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonNullableListFilterBase<$PrismaModel>>,
          Exclude<
            keyof Required<JsonNullableListFilterBase<$PrismaModel>>,
            'path'
          >
        >,
        Required<JsonNullableListFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<Required<JsonNullableListFilterBase<$PrismaModel>>, 'path'>
      >

  export type JsonNullableListFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue[] | ListJsonFieldRefInput<$PrismaModel> | null
    has?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    hasEvery?: InputJsonValue[] | ListJsonFieldRefInput<$PrismaModel>
    hasSome?: InputJsonValue[] | ListJsonFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type AsanaSequenceCountOrderByAggregateInput = {
    id?: SortOrder
    nameSequence?: SortOrder
    sequencesSeries?: SortOrder
    description?: SortOrder
    durationSequence?: SortOrder
    image?: SortOrder
    breath_direction?: SortOrder
    created_by?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AsanaSequenceMaxOrderByAggregateInput = {
    id?: SortOrder
    nameSequence?: SortOrder
    description?: SortOrder
    durationSequence?: SortOrder
    image?: SortOrder
    breath_direction?: SortOrder
    created_by?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AsanaSequenceMinOrderByAggregateInput = {
    id?: SortOrder
    nameSequence?: SortOrder
    description?: SortOrder
    durationSequence?: SortOrder
    image?: SortOrder
    breath_direction?: SortOrder
    created_by?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type AsanaPostureRelationFilter = {
    is?: AsanaPostureWhereInput
    isNot?: AsanaPostureWhereInput
  }

  export type AsanaActivityCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    postureId?: SortOrder
    postureName?: SortOrder
    sort_english_name?: SortOrder
    duration?: SortOrder
    datePerformed?: SortOrder
    notes?: SortOrder
    sensations?: SortOrder
    completionStatus?: SortOrder
    difficulty?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AsanaActivityAvgOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type AsanaActivityMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    postureId?: SortOrder
    postureName?: SortOrder
    sort_english_name?: SortOrder
    duration?: SortOrder
    datePerformed?: SortOrder
    notes?: SortOrder
    sensations?: SortOrder
    completionStatus?: SortOrder
    difficulty?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AsanaActivityMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    postureId?: SortOrder
    postureName?: SortOrder
    sort_english_name?: SortOrder
    duration?: SortOrder
    datePerformed?: SortOrder
    notes?: SortOrder
    sensations?: SortOrder
    completionStatus?: SortOrder
    difficulty?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AsanaActivitySumOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type SeriesActivityCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    seriesId?: SortOrder
    seriesName?: SortOrder
    datePerformed?: SortOrder
    difficulty?: SortOrder
    completionStatus?: SortOrder
    duration?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SeriesActivityAvgOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type SeriesActivityMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    seriesId?: SortOrder
    seriesName?: SortOrder
    datePerformed?: SortOrder
    difficulty?: SortOrder
    completionStatus?: SortOrder
    duration?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SeriesActivityMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    seriesId?: SortOrder
    seriesName?: SortOrder
    datePerformed?: SortOrder
    difficulty?: SortOrder
    completionStatus?: SortOrder
    duration?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SeriesActivitySumOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type SequenceActivityCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sequenceId?: SortOrder
    sequenceName?: SortOrder
    datePerformed?: SortOrder
    difficulty?: SortOrder
    completionStatus?: SortOrder
    duration?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SequenceActivityAvgOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type SequenceActivityMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sequenceId?: SortOrder
    sequenceName?: SortOrder
    datePerformed?: SortOrder
    difficulty?: SortOrder
    completionStatus?: SortOrder
    duration?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SequenceActivityMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sequenceId?: SortOrder
    sequenceName?: SortOrder
    datePerformed?: SortOrder
    difficulty?: SortOrder
    completionStatus?: SortOrder
    duration?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SequenceActivitySumOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type UserLoginCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    loginDate?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    provider?: SortOrder
    createdAt?: SortOrder
  }

  export type UserLoginMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    loginDate?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    provider?: SortOrder
    createdAt?: SortOrder
  }

  export type UserLoginMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    loginDate?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    provider?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumStorageTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.StorageType | EnumStorageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.StorageType[] | ListEnumStorageTypeFieldRefInput<$PrismaModel>
    notIn?:
      | $Enums.StorageType[]
      | ListEnumStorageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumStorageTypeFilter<$PrismaModel> | $Enums.StorageType
  }

  export type AsanaPostureNullableRelationFilter = {
    is?: AsanaPostureWhereInput | null
    isNot?: AsanaPostureWhereInput | null
  }

  export type PoseImageCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    postureId?: SortOrder
    postureName?: SortOrder
    url?: SortOrder
    altText?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    uploadedAt?: SortOrder
    storageType?: SortOrder
    localStorageId?: SortOrder
    cloudflareId?: SortOrder
    isOffline?: SortOrder
    imageType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PoseImageAvgOrderByAggregateInput = {
    fileSize?: SortOrder
  }

  export type PoseImageMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    postureId?: SortOrder
    postureName?: SortOrder
    url?: SortOrder
    altText?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    uploadedAt?: SortOrder
    storageType?: SortOrder
    localStorageId?: SortOrder
    cloudflareId?: SortOrder
    isOffline?: SortOrder
    imageType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PoseImageMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    postureId?: SortOrder
    postureName?: SortOrder
    url?: SortOrder
    altText?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    uploadedAt?: SortOrder
    storageType?: SortOrder
    localStorageId?: SortOrder
    cloudflareId?: SortOrder
    isOffline?: SortOrder
    imageType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PoseImageSumOrderByAggregateInput = {
    fileSize?: SortOrder
  }

  export type EnumStorageTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StorageType | EnumStorageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.StorageType[] | ListEnumStorageTypeFieldRefInput<$PrismaModel>
    notIn?:
      | $Enums.StorageType[]
      | ListEnumStorageTypeFieldRefInput<$PrismaModel>
    not?:
      | NestedEnumStorageTypeWithAggregatesFilter<$PrismaModel>
      | $Enums.StorageType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStorageTypeFilter<$PrismaModel>
    _max?: NestedEnumStorageTypeFilter<$PrismaModel>
  }

  export type EnumGlossarySourceFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.GlossarySource
      | EnumGlossarySourceFieldRefInput<$PrismaModel>
    in?:
      | $Enums.GlossarySource[]
      | ListEnumGlossarySourceFieldRefInput<$PrismaModel>
    notIn?:
      | $Enums.GlossarySource[]
      | ListEnumGlossarySourceFieldRefInput<$PrismaModel>
    not?: NestedEnumGlossarySourceFilter<$PrismaModel> | $Enums.GlossarySource
  }

  export type UserDataNullableRelationFilter = {
    is?: UserDataWhereInput | null
    isNot?: UserDataWhereInput | null
  }

  export type GlossaryTermCountOrderByAggregateInput = {
    id?: SortOrder
    term?: SortOrder
    meaning?: SortOrder
    whyMatters?: SortOrder
    category?: SortOrder
    sanskrit?: SortOrder
    pronunciation?: SortOrder
    source?: SortOrder
    userId?: SortOrder
    readOnly?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GlossaryTermMaxOrderByAggregateInput = {
    id?: SortOrder
    term?: SortOrder
    meaning?: SortOrder
    whyMatters?: SortOrder
    category?: SortOrder
    sanskrit?: SortOrder
    pronunciation?: SortOrder
    source?: SortOrder
    userId?: SortOrder
    readOnly?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GlossaryTermMinOrderByAggregateInput = {
    id?: SortOrder
    term?: SortOrder
    meaning?: SortOrder
    whyMatters?: SortOrder
    category?: SortOrder
    sanskrit?: SortOrder
    pronunciation?: SortOrder
    source?: SortOrder
    userId?: SortOrder
    readOnly?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumGlossarySourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.GlossarySource
      | EnumGlossarySourceFieldRefInput<$PrismaModel>
    in?:
      | $Enums.GlossarySource[]
      | ListEnumGlossarySourceFieldRefInput<$PrismaModel>
    notIn?:
      | $Enums.GlossarySource[]
      | ListEnumGlossarySourceFieldRefInput<$PrismaModel>
    not?:
      | NestedEnumGlossarySourceWithAggregatesFilter<$PrismaModel>
      | $Enums.GlossarySource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGlossarySourceFilter<$PrismaModel>
    _max?: NestedEnumGlossarySourceFilter<$PrismaModel>
  }

  export type UserDataCreateprofileImagesInput = {
    set: string[]
  }

  export type ProviderAccountCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          ProviderAccountCreateWithoutUserInput,
          ProviderAccountUncheckedCreateWithoutUserInput
        >
      | ProviderAccountCreateWithoutUserInput[]
      | ProviderAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | ProviderAccountCreateOrConnectWithoutUserInput
      | ProviderAccountCreateOrConnectWithoutUserInput[]
    createMany?: ProviderAccountCreateManyUserInputEnvelope
    connect?:
      | ProviderAccountWhereUniqueInput
      | ProviderAccountWhereUniqueInput[]
  }

  export type AsanaActivityCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          AsanaActivityCreateWithoutUserInput,
          AsanaActivityUncheckedCreateWithoutUserInput
        >
      | AsanaActivityCreateWithoutUserInput[]
      | AsanaActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | AsanaActivityCreateOrConnectWithoutUserInput
      | AsanaActivityCreateOrConnectWithoutUserInput[]
    createMany?: AsanaActivityCreateManyUserInputEnvelope
    connect?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
  }

  export type SeriesActivityCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          SeriesActivityCreateWithoutUserInput,
          SeriesActivityUncheckedCreateWithoutUserInput
        >
      | SeriesActivityCreateWithoutUserInput[]
      | SeriesActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | SeriesActivityCreateOrConnectWithoutUserInput
      | SeriesActivityCreateOrConnectWithoutUserInput[]
    createMany?: SeriesActivityCreateManyUserInputEnvelope
    connect?: SeriesActivityWhereUniqueInput | SeriesActivityWhereUniqueInput[]
  }

  export type SequenceActivityCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          SequenceActivityCreateWithoutUserInput,
          SequenceActivityUncheckedCreateWithoutUserInput
        >
      | SequenceActivityCreateWithoutUserInput[]
      | SequenceActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | SequenceActivityCreateOrConnectWithoutUserInput
      | SequenceActivityCreateOrConnectWithoutUserInput[]
    createMany?: SequenceActivityCreateManyUserInputEnvelope
    connect?:
      | SequenceActivityWhereUniqueInput
      | SequenceActivityWhereUniqueInput[]
  }

  export type UserLoginCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          UserLoginCreateWithoutUserInput,
          UserLoginUncheckedCreateWithoutUserInput
        >
      | UserLoginCreateWithoutUserInput[]
      | UserLoginUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | UserLoginCreateOrConnectWithoutUserInput
      | UserLoginCreateOrConnectWithoutUserInput[]
    createMany?: UserLoginCreateManyUserInputEnvelope
    connect?: UserLoginWhereUniqueInput | UserLoginWhereUniqueInput[]
  }

  export type PoseImageCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          PoseImageCreateWithoutUserInput,
          PoseImageUncheckedCreateWithoutUserInput
        >
      | PoseImageCreateWithoutUserInput[]
      | PoseImageUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | PoseImageCreateOrConnectWithoutUserInput
      | PoseImageCreateOrConnectWithoutUserInput[]
    createMany?: PoseImageCreateManyUserInputEnvelope
    connect?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
  }

  export type GlossaryTermCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          GlossaryTermCreateWithoutUserInput,
          GlossaryTermUncheckedCreateWithoutUserInput
        >
      | GlossaryTermCreateWithoutUserInput[]
      | GlossaryTermUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | GlossaryTermCreateOrConnectWithoutUserInput
      | GlossaryTermCreateOrConnectWithoutUserInput[]
    createMany?: GlossaryTermCreateManyUserInputEnvelope
    connect?: GlossaryTermWhereUniqueInput | GlossaryTermWhereUniqueInput[]
  }

  export type ReminderCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          ReminderCreateWithoutUserInput,
          ReminderUncheckedCreateWithoutUserInput
        >
      | ReminderCreateWithoutUserInput[]
      | ReminderUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | ReminderCreateOrConnectWithoutUserInput
      | ReminderCreateOrConnectWithoutUserInput[]
    createMany?: ReminderCreateManyUserInputEnvelope
    connect?: ReminderWhereUniqueInput | ReminderWhereUniqueInput[]
  }

  export type PushSubscriptionCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          PushSubscriptionCreateWithoutUserInput,
          PushSubscriptionUncheckedCreateWithoutUserInput
        >
      | PushSubscriptionCreateWithoutUserInput[]
      | PushSubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | PushSubscriptionCreateOrConnectWithoutUserInput
      | PushSubscriptionCreateOrConnectWithoutUserInput[]
    createMany?: PushSubscriptionCreateManyUserInputEnvelope
    connect?:
      | PushSubscriptionWhereUniqueInput
      | PushSubscriptionWhereUniqueInput[]
  }

  export type ProviderAccountUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          ProviderAccountCreateWithoutUserInput,
          ProviderAccountUncheckedCreateWithoutUserInput
        >
      | ProviderAccountCreateWithoutUserInput[]
      | ProviderAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | ProviderAccountCreateOrConnectWithoutUserInput
      | ProviderAccountCreateOrConnectWithoutUserInput[]
    createMany?: ProviderAccountCreateManyUserInputEnvelope
    connect?:
      | ProviderAccountWhereUniqueInput
      | ProviderAccountWhereUniqueInput[]
  }

  export type AsanaActivityUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          AsanaActivityCreateWithoutUserInput,
          AsanaActivityUncheckedCreateWithoutUserInput
        >
      | AsanaActivityCreateWithoutUserInput[]
      | AsanaActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | AsanaActivityCreateOrConnectWithoutUserInput
      | AsanaActivityCreateOrConnectWithoutUserInput[]
    createMany?: AsanaActivityCreateManyUserInputEnvelope
    connect?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
  }

  export type SeriesActivityUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          SeriesActivityCreateWithoutUserInput,
          SeriesActivityUncheckedCreateWithoutUserInput
        >
      | SeriesActivityCreateWithoutUserInput[]
      | SeriesActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | SeriesActivityCreateOrConnectWithoutUserInput
      | SeriesActivityCreateOrConnectWithoutUserInput[]
    createMany?: SeriesActivityCreateManyUserInputEnvelope
    connect?: SeriesActivityWhereUniqueInput | SeriesActivityWhereUniqueInput[]
  }

  export type SequenceActivityUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          SequenceActivityCreateWithoutUserInput,
          SequenceActivityUncheckedCreateWithoutUserInput
        >
      | SequenceActivityCreateWithoutUserInput[]
      | SequenceActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | SequenceActivityCreateOrConnectWithoutUserInput
      | SequenceActivityCreateOrConnectWithoutUserInput[]
    createMany?: SequenceActivityCreateManyUserInputEnvelope
    connect?:
      | SequenceActivityWhereUniqueInput
      | SequenceActivityWhereUniqueInput[]
  }

  export type UserLoginUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          UserLoginCreateWithoutUserInput,
          UserLoginUncheckedCreateWithoutUserInput
        >
      | UserLoginCreateWithoutUserInput[]
      | UserLoginUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | UserLoginCreateOrConnectWithoutUserInput
      | UserLoginCreateOrConnectWithoutUserInput[]
    createMany?: UserLoginCreateManyUserInputEnvelope
    connect?: UserLoginWhereUniqueInput | UserLoginWhereUniqueInput[]
  }

  export type PoseImageUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          PoseImageCreateWithoutUserInput,
          PoseImageUncheckedCreateWithoutUserInput
        >
      | PoseImageCreateWithoutUserInput[]
      | PoseImageUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | PoseImageCreateOrConnectWithoutUserInput
      | PoseImageCreateOrConnectWithoutUserInput[]
    createMany?: PoseImageCreateManyUserInputEnvelope
    connect?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
  }

  export type GlossaryTermUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          GlossaryTermCreateWithoutUserInput,
          GlossaryTermUncheckedCreateWithoutUserInput
        >
      | GlossaryTermCreateWithoutUserInput[]
      | GlossaryTermUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | GlossaryTermCreateOrConnectWithoutUserInput
      | GlossaryTermCreateOrConnectWithoutUserInput[]
    createMany?: GlossaryTermCreateManyUserInputEnvelope
    connect?: GlossaryTermWhereUniqueInput | GlossaryTermWhereUniqueInput[]
  }

  export type ReminderUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          ReminderCreateWithoutUserInput,
          ReminderUncheckedCreateWithoutUserInput
        >
      | ReminderCreateWithoutUserInput[]
      | ReminderUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | ReminderCreateOrConnectWithoutUserInput
      | ReminderCreateOrConnectWithoutUserInput[]
    createMany?: ReminderCreateManyUserInputEnvelope
    connect?: ReminderWhereUniqueInput | ReminderWhereUniqueInput[]
  }

  export type PushSubscriptionUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          PushSubscriptionCreateWithoutUserInput,
          PushSubscriptionUncheckedCreateWithoutUserInput
        >
      | PushSubscriptionCreateWithoutUserInput[]
      | PushSubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | PushSubscriptionCreateOrConnectWithoutUserInput
      | PushSubscriptionCreateOrConnectWithoutUserInput[]
    createMany?: PushSubscriptionCreateManyUserInputEnvelope
    connect?:
      | PushSubscriptionWhereUniqueInput
      | PushSubscriptionWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
    unset?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
    unset?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type UserDataUpdateprofileImagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ProviderAccountUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          ProviderAccountCreateWithoutUserInput,
          ProviderAccountUncheckedCreateWithoutUserInput
        >
      | ProviderAccountCreateWithoutUserInput[]
      | ProviderAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | ProviderAccountCreateOrConnectWithoutUserInput
      | ProviderAccountCreateOrConnectWithoutUserInput[]
    upsert?:
      | ProviderAccountUpsertWithWhereUniqueWithoutUserInput
      | ProviderAccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProviderAccountCreateManyUserInputEnvelope
    set?: ProviderAccountWhereUniqueInput | ProviderAccountWhereUniqueInput[]
    disconnect?:
      | ProviderAccountWhereUniqueInput
      | ProviderAccountWhereUniqueInput[]
    delete?: ProviderAccountWhereUniqueInput | ProviderAccountWhereUniqueInput[]
    connect?:
      | ProviderAccountWhereUniqueInput
      | ProviderAccountWhereUniqueInput[]
    update?:
      | ProviderAccountUpdateWithWhereUniqueWithoutUserInput
      | ProviderAccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?:
      | ProviderAccountUpdateManyWithWhereWithoutUserInput
      | ProviderAccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?:
      | ProviderAccountScalarWhereInput
      | ProviderAccountScalarWhereInput[]
  }

  export type AsanaActivityUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          AsanaActivityCreateWithoutUserInput,
          AsanaActivityUncheckedCreateWithoutUserInput
        >
      | AsanaActivityCreateWithoutUserInput[]
      | AsanaActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | AsanaActivityCreateOrConnectWithoutUserInput
      | AsanaActivityCreateOrConnectWithoutUserInput[]
    upsert?:
      | AsanaActivityUpsertWithWhereUniqueWithoutUserInput
      | AsanaActivityUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AsanaActivityCreateManyUserInputEnvelope
    set?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
    disconnect?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
    delete?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
    connect?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
    update?:
      | AsanaActivityUpdateWithWhereUniqueWithoutUserInput
      | AsanaActivityUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?:
      | AsanaActivityUpdateManyWithWhereWithoutUserInput
      | AsanaActivityUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AsanaActivityScalarWhereInput | AsanaActivityScalarWhereInput[]
  }

  export type SeriesActivityUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          SeriesActivityCreateWithoutUserInput,
          SeriesActivityUncheckedCreateWithoutUserInput
        >
      | SeriesActivityCreateWithoutUserInput[]
      | SeriesActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | SeriesActivityCreateOrConnectWithoutUserInput
      | SeriesActivityCreateOrConnectWithoutUserInput[]
    upsert?:
      | SeriesActivityUpsertWithWhereUniqueWithoutUserInput
      | SeriesActivityUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SeriesActivityCreateManyUserInputEnvelope
    set?: SeriesActivityWhereUniqueInput | SeriesActivityWhereUniqueInput[]
    disconnect?:
      | SeriesActivityWhereUniqueInput
      | SeriesActivityWhereUniqueInput[]
    delete?: SeriesActivityWhereUniqueInput | SeriesActivityWhereUniqueInput[]
    connect?: SeriesActivityWhereUniqueInput | SeriesActivityWhereUniqueInput[]
    update?:
      | SeriesActivityUpdateWithWhereUniqueWithoutUserInput
      | SeriesActivityUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?:
      | SeriesActivityUpdateManyWithWhereWithoutUserInput
      | SeriesActivityUpdateManyWithWhereWithoutUserInput[]
    deleteMany?:
      | SeriesActivityScalarWhereInput
      | SeriesActivityScalarWhereInput[]
  }

  export type SequenceActivityUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          SequenceActivityCreateWithoutUserInput,
          SequenceActivityUncheckedCreateWithoutUserInput
        >
      | SequenceActivityCreateWithoutUserInput[]
      | SequenceActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | SequenceActivityCreateOrConnectWithoutUserInput
      | SequenceActivityCreateOrConnectWithoutUserInput[]
    upsert?:
      | SequenceActivityUpsertWithWhereUniqueWithoutUserInput
      | SequenceActivityUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SequenceActivityCreateManyUserInputEnvelope
    set?: SequenceActivityWhereUniqueInput | SequenceActivityWhereUniqueInput[]
    disconnect?:
      | SequenceActivityWhereUniqueInput
      | SequenceActivityWhereUniqueInput[]
    delete?:
      | SequenceActivityWhereUniqueInput
      | SequenceActivityWhereUniqueInput[]
    connect?:
      | SequenceActivityWhereUniqueInput
      | SequenceActivityWhereUniqueInput[]
    update?:
      | SequenceActivityUpdateWithWhereUniqueWithoutUserInput
      | SequenceActivityUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?:
      | SequenceActivityUpdateManyWithWhereWithoutUserInput
      | SequenceActivityUpdateManyWithWhereWithoutUserInput[]
    deleteMany?:
      | SequenceActivityScalarWhereInput
      | SequenceActivityScalarWhereInput[]
  }

  export type UserLoginUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          UserLoginCreateWithoutUserInput,
          UserLoginUncheckedCreateWithoutUserInput
        >
      | UserLoginCreateWithoutUserInput[]
      | UserLoginUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | UserLoginCreateOrConnectWithoutUserInput
      | UserLoginCreateOrConnectWithoutUserInput[]
    upsert?:
      | UserLoginUpsertWithWhereUniqueWithoutUserInput
      | UserLoginUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserLoginCreateManyUserInputEnvelope
    set?: UserLoginWhereUniqueInput | UserLoginWhereUniqueInput[]
    disconnect?: UserLoginWhereUniqueInput | UserLoginWhereUniqueInput[]
    delete?: UserLoginWhereUniqueInput | UserLoginWhereUniqueInput[]
    connect?: UserLoginWhereUniqueInput | UserLoginWhereUniqueInput[]
    update?:
      | UserLoginUpdateWithWhereUniqueWithoutUserInput
      | UserLoginUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?:
      | UserLoginUpdateManyWithWhereWithoutUserInput
      | UserLoginUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserLoginScalarWhereInput | UserLoginScalarWhereInput[]
  }

  export type PoseImageUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          PoseImageCreateWithoutUserInput,
          PoseImageUncheckedCreateWithoutUserInput
        >
      | PoseImageCreateWithoutUserInput[]
      | PoseImageUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | PoseImageCreateOrConnectWithoutUserInput
      | PoseImageCreateOrConnectWithoutUserInput[]
    upsert?:
      | PoseImageUpsertWithWhereUniqueWithoutUserInput
      | PoseImageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PoseImageCreateManyUserInputEnvelope
    set?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
    disconnect?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
    delete?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
    connect?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
    update?:
      | PoseImageUpdateWithWhereUniqueWithoutUserInput
      | PoseImageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?:
      | PoseImageUpdateManyWithWhereWithoutUserInput
      | PoseImageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PoseImageScalarWhereInput | PoseImageScalarWhereInput[]
  }

  export type GlossaryTermUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          GlossaryTermCreateWithoutUserInput,
          GlossaryTermUncheckedCreateWithoutUserInput
        >
      | GlossaryTermCreateWithoutUserInput[]
      | GlossaryTermUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | GlossaryTermCreateOrConnectWithoutUserInput
      | GlossaryTermCreateOrConnectWithoutUserInput[]
    upsert?:
      | GlossaryTermUpsertWithWhereUniqueWithoutUserInput
      | GlossaryTermUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GlossaryTermCreateManyUserInputEnvelope
    set?: GlossaryTermWhereUniqueInput | GlossaryTermWhereUniqueInput[]
    disconnect?: GlossaryTermWhereUniqueInput | GlossaryTermWhereUniqueInput[]
    delete?: GlossaryTermWhereUniqueInput | GlossaryTermWhereUniqueInput[]
    connect?: GlossaryTermWhereUniqueInput | GlossaryTermWhereUniqueInput[]
    update?:
      | GlossaryTermUpdateWithWhereUniqueWithoutUserInput
      | GlossaryTermUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?:
      | GlossaryTermUpdateManyWithWhereWithoutUserInput
      | GlossaryTermUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GlossaryTermScalarWhereInput | GlossaryTermScalarWhereInput[]
  }

  export type ReminderUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          ReminderCreateWithoutUserInput,
          ReminderUncheckedCreateWithoutUserInput
        >
      | ReminderCreateWithoutUserInput[]
      | ReminderUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | ReminderCreateOrConnectWithoutUserInput
      | ReminderCreateOrConnectWithoutUserInput[]
    upsert?:
      | ReminderUpsertWithWhereUniqueWithoutUserInput
      | ReminderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReminderCreateManyUserInputEnvelope
    set?: ReminderWhereUniqueInput | ReminderWhereUniqueInput[]
    disconnect?: ReminderWhereUniqueInput | ReminderWhereUniqueInput[]
    delete?: ReminderWhereUniqueInput | ReminderWhereUniqueInput[]
    connect?: ReminderWhereUniqueInput | ReminderWhereUniqueInput[]
    update?:
      | ReminderUpdateWithWhereUniqueWithoutUserInput
      | ReminderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?:
      | ReminderUpdateManyWithWhereWithoutUserInput
      | ReminderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReminderScalarWhereInput | ReminderScalarWhereInput[]
  }

  export type PushSubscriptionUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          PushSubscriptionCreateWithoutUserInput,
          PushSubscriptionUncheckedCreateWithoutUserInput
        >
      | PushSubscriptionCreateWithoutUserInput[]
      | PushSubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | PushSubscriptionCreateOrConnectWithoutUserInput
      | PushSubscriptionCreateOrConnectWithoutUserInput[]
    upsert?:
      | PushSubscriptionUpsertWithWhereUniqueWithoutUserInput
      | PushSubscriptionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PushSubscriptionCreateManyUserInputEnvelope
    set?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
    disconnect?:
      | PushSubscriptionWhereUniqueInput
      | PushSubscriptionWhereUniqueInput[]
    delete?:
      | PushSubscriptionWhereUniqueInput
      | PushSubscriptionWhereUniqueInput[]
    connect?:
      | PushSubscriptionWhereUniqueInput
      | PushSubscriptionWhereUniqueInput[]
    update?:
      | PushSubscriptionUpdateWithWhereUniqueWithoutUserInput
      | PushSubscriptionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?:
      | PushSubscriptionUpdateManyWithWhereWithoutUserInput
      | PushSubscriptionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?:
      | PushSubscriptionScalarWhereInput
      | PushSubscriptionScalarWhereInput[]
  }

  export type ProviderAccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          ProviderAccountCreateWithoutUserInput,
          ProviderAccountUncheckedCreateWithoutUserInput
        >
      | ProviderAccountCreateWithoutUserInput[]
      | ProviderAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | ProviderAccountCreateOrConnectWithoutUserInput
      | ProviderAccountCreateOrConnectWithoutUserInput[]
    upsert?:
      | ProviderAccountUpsertWithWhereUniqueWithoutUserInput
      | ProviderAccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProviderAccountCreateManyUserInputEnvelope
    set?: ProviderAccountWhereUniqueInput | ProviderAccountWhereUniqueInput[]
    disconnect?:
      | ProviderAccountWhereUniqueInput
      | ProviderAccountWhereUniqueInput[]
    delete?: ProviderAccountWhereUniqueInput | ProviderAccountWhereUniqueInput[]
    connect?:
      | ProviderAccountWhereUniqueInput
      | ProviderAccountWhereUniqueInput[]
    update?:
      | ProviderAccountUpdateWithWhereUniqueWithoutUserInput
      | ProviderAccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?:
      | ProviderAccountUpdateManyWithWhereWithoutUserInput
      | ProviderAccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?:
      | ProviderAccountScalarWhereInput
      | ProviderAccountScalarWhereInput[]
  }

  export type AsanaActivityUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          AsanaActivityCreateWithoutUserInput,
          AsanaActivityUncheckedCreateWithoutUserInput
        >
      | AsanaActivityCreateWithoutUserInput[]
      | AsanaActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | AsanaActivityCreateOrConnectWithoutUserInput
      | AsanaActivityCreateOrConnectWithoutUserInput[]
    upsert?:
      | AsanaActivityUpsertWithWhereUniqueWithoutUserInput
      | AsanaActivityUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AsanaActivityCreateManyUserInputEnvelope
    set?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
    disconnect?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
    delete?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
    connect?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
    update?:
      | AsanaActivityUpdateWithWhereUniqueWithoutUserInput
      | AsanaActivityUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?:
      | AsanaActivityUpdateManyWithWhereWithoutUserInput
      | AsanaActivityUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AsanaActivityScalarWhereInput | AsanaActivityScalarWhereInput[]
  }

  export type SeriesActivityUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          SeriesActivityCreateWithoutUserInput,
          SeriesActivityUncheckedCreateWithoutUserInput
        >
      | SeriesActivityCreateWithoutUserInput[]
      | SeriesActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | SeriesActivityCreateOrConnectWithoutUserInput
      | SeriesActivityCreateOrConnectWithoutUserInput[]
    upsert?:
      | SeriesActivityUpsertWithWhereUniqueWithoutUserInput
      | SeriesActivityUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SeriesActivityCreateManyUserInputEnvelope
    set?: SeriesActivityWhereUniqueInput | SeriesActivityWhereUniqueInput[]
    disconnect?:
      | SeriesActivityWhereUniqueInput
      | SeriesActivityWhereUniqueInput[]
    delete?: SeriesActivityWhereUniqueInput | SeriesActivityWhereUniqueInput[]
    connect?: SeriesActivityWhereUniqueInput | SeriesActivityWhereUniqueInput[]
    update?:
      | SeriesActivityUpdateWithWhereUniqueWithoutUserInput
      | SeriesActivityUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?:
      | SeriesActivityUpdateManyWithWhereWithoutUserInput
      | SeriesActivityUpdateManyWithWhereWithoutUserInput[]
    deleteMany?:
      | SeriesActivityScalarWhereInput
      | SeriesActivityScalarWhereInput[]
  }

  export type SequenceActivityUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          SequenceActivityCreateWithoutUserInput,
          SequenceActivityUncheckedCreateWithoutUserInput
        >
      | SequenceActivityCreateWithoutUserInput[]
      | SequenceActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | SequenceActivityCreateOrConnectWithoutUserInput
      | SequenceActivityCreateOrConnectWithoutUserInput[]
    upsert?:
      | SequenceActivityUpsertWithWhereUniqueWithoutUserInput
      | SequenceActivityUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SequenceActivityCreateManyUserInputEnvelope
    set?: SequenceActivityWhereUniqueInput | SequenceActivityWhereUniqueInput[]
    disconnect?:
      | SequenceActivityWhereUniqueInput
      | SequenceActivityWhereUniqueInput[]
    delete?:
      | SequenceActivityWhereUniqueInput
      | SequenceActivityWhereUniqueInput[]
    connect?:
      | SequenceActivityWhereUniqueInput
      | SequenceActivityWhereUniqueInput[]
    update?:
      | SequenceActivityUpdateWithWhereUniqueWithoutUserInput
      | SequenceActivityUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?:
      | SequenceActivityUpdateManyWithWhereWithoutUserInput
      | SequenceActivityUpdateManyWithWhereWithoutUserInput[]
    deleteMany?:
      | SequenceActivityScalarWhereInput
      | SequenceActivityScalarWhereInput[]
  }

  export type UserLoginUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          UserLoginCreateWithoutUserInput,
          UserLoginUncheckedCreateWithoutUserInput
        >
      | UserLoginCreateWithoutUserInput[]
      | UserLoginUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | UserLoginCreateOrConnectWithoutUserInput
      | UserLoginCreateOrConnectWithoutUserInput[]
    upsert?:
      | UserLoginUpsertWithWhereUniqueWithoutUserInput
      | UserLoginUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserLoginCreateManyUserInputEnvelope
    set?: UserLoginWhereUniqueInput | UserLoginWhereUniqueInput[]
    disconnect?: UserLoginWhereUniqueInput | UserLoginWhereUniqueInput[]
    delete?: UserLoginWhereUniqueInput | UserLoginWhereUniqueInput[]
    connect?: UserLoginWhereUniqueInput | UserLoginWhereUniqueInput[]
    update?:
      | UserLoginUpdateWithWhereUniqueWithoutUserInput
      | UserLoginUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?:
      | UserLoginUpdateManyWithWhereWithoutUserInput
      | UserLoginUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserLoginScalarWhereInput | UserLoginScalarWhereInput[]
  }

  export type PoseImageUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          PoseImageCreateWithoutUserInput,
          PoseImageUncheckedCreateWithoutUserInput
        >
      | PoseImageCreateWithoutUserInput[]
      | PoseImageUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | PoseImageCreateOrConnectWithoutUserInput
      | PoseImageCreateOrConnectWithoutUserInput[]
    upsert?:
      | PoseImageUpsertWithWhereUniqueWithoutUserInput
      | PoseImageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PoseImageCreateManyUserInputEnvelope
    set?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
    disconnect?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
    delete?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
    connect?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
    update?:
      | PoseImageUpdateWithWhereUniqueWithoutUserInput
      | PoseImageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?:
      | PoseImageUpdateManyWithWhereWithoutUserInput
      | PoseImageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PoseImageScalarWhereInput | PoseImageScalarWhereInput[]
  }

  export type GlossaryTermUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          GlossaryTermCreateWithoutUserInput,
          GlossaryTermUncheckedCreateWithoutUserInput
        >
      | GlossaryTermCreateWithoutUserInput[]
      | GlossaryTermUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | GlossaryTermCreateOrConnectWithoutUserInput
      | GlossaryTermCreateOrConnectWithoutUserInput[]
    upsert?:
      | GlossaryTermUpsertWithWhereUniqueWithoutUserInput
      | GlossaryTermUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GlossaryTermCreateManyUserInputEnvelope
    set?: GlossaryTermWhereUniqueInput | GlossaryTermWhereUniqueInput[]
    disconnect?: GlossaryTermWhereUniqueInput | GlossaryTermWhereUniqueInput[]
    delete?: GlossaryTermWhereUniqueInput | GlossaryTermWhereUniqueInput[]
    connect?: GlossaryTermWhereUniqueInput | GlossaryTermWhereUniqueInput[]
    update?:
      | GlossaryTermUpdateWithWhereUniqueWithoutUserInput
      | GlossaryTermUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?:
      | GlossaryTermUpdateManyWithWhereWithoutUserInput
      | GlossaryTermUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GlossaryTermScalarWhereInput | GlossaryTermScalarWhereInput[]
  }

  export type ReminderUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          ReminderCreateWithoutUserInput,
          ReminderUncheckedCreateWithoutUserInput
        >
      | ReminderCreateWithoutUserInput[]
      | ReminderUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | ReminderCreateOrConnectWithoutUserInput
      | ReminderCreateOrConnectWithoutUserInput[]
    upsert?:
      | ReminderUpsertWithWhereUniqueWithoutUserInput
      | ReminderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReminderCreateManyUserInputEnvelope
    set?: ReminderWhereUniqueInput | ReminderWhereUniqueInput[]
    disconnect?: ReminderWhereUniqueInput | ReminderWhereUniqueInput[]
    delete?: ReminderWhereUniqueInput | ReminderWhereUniqueInput[]
    connect?: ReminderWhereUniqueInput | ReminderWhereUniqueInput[]
    update?:
      | ReminderUpdateWithWhereUniqueWithoutUserInput
      | ReminderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?:
      | ReminderUpdateManyWithWhereWithoutUserInput
      | ReminderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReminderScalarWhereInput | ReminderScalarWhereInput[]
  }

  export type PushSubscriptionUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          PushSubscriptionCreateWithoutUserInput,
          PushSubscriptionUncheckedCreateWithoutUserInput
        >
      | PushSubscriptionCreateWithoutUserInput[]
      | PushSubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?:
      | PushSubscriptionCreateOrConnectWithoutUserInput
      | PushSubscriptionCreateOrConnectWithoutUserInput[]
    upsert?:
      | PushSubscriptionUpsertWithWhereUniqueWithoutUserInput
      | PushSubscriptionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PushSubscriptionCreateManyUserInputEnvelope
    set?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
    disconnect?:
      | PushSubscriptionWhereUniqueInput
      | PushSubscriptionWhereUniqueInput[]
    delete?:
      | PushSubscriptionWhereUniqueInput
      | PushSubscriptionWhereUniqueInput[]
    connect?:
      | PushSubscriptionWhereUniqueInput
      | PushSubscriptionWhereUniqueInput[]
    update?:
      | PushSubscriptionUpdateWithWhereUniqueWithoutUserInput
      | PushSubscriptionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?:
      | PushSubscriptionUpdateManyWithWhereWithoutUserInput
      | PushSubscriptionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?:
      | PushSubscriptionScalarWhereInput
      | PushSubscriptionScalarWhereInput[]
  }

  export type ReminderCreatedaysInput = {
    set: string[]
  }

  export type UserDataCreateNestedOneWithoutRemindersInput = {
    create?: XOR<
      UserDataCreateWithoutRemindersInput,
      UserDataUncheckedCreateWithoutRemindersInput
    >
    connectOrCreate?: UserDataCreateOrConnectWithoutRemindersInput
    connect?: UserDataWhereUniqueInput
  }

  export type ReminderUpdatedaysInput = {
    set?: string[]
    push?: string | string[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserDataUpdateOneRequiredWithoutRemindersNestedInput = {
    create?: XOR<
      UserDataCreateWithoutRemindersInput,
      UserDataUncheckedCreateWithoutRemindersInput
    >
    connectOrCreate?: UserDataCreateOrConnectWithoutRemindersInput
    upsert?: UserDataUpsertWithoutRemindersInput
    connect?: UserDataWhereUniqueInput
    update?: XOR<
      XOR<
        UserDataUpdateToOneWithWhereWithoutRemindersInput,
        UserDataUpdateWithoutRemindersInput
      >,
      UserDataUncheckedUpdateWithoutRemindersInput
    >
  }

  export type UserDataCreateNestedOneWithoutPushSubscriptionsInput = {
    create?: XOR<
      UserDataCreateWithoutPushSubscriptionsInput,
      UserDataUncheckedCreateWithoutPushSubscriptionsInput
    >
    connectOrCreate?: UserDataCreateOrConnectWithoutPushSubscriptionsInput
    connect?: UserDataWhereUniqueInput
  }

  export type UserDataUpdateOneRequiredWithoutPushSubscriptionsNestedInput = {
    create?: XOR<
      UserDataCreateWithoutPushSubscriptionsInput,
      UserDataUncheckedCreateWithoutPushSubscriptionsInput
    >
    connectOrCreate?: UserDataCreateOrConnectWithoutPushSubscriptionsInput
    upsert?: UserDataUpsertWithoutPushSubscriptionsInput
    connect?: UserDataWhereUniqueInput
    update?: XOR<
      XOR<
        UserDataUpdateToOneWithWhereWithoutPushSubscriptionsInput,
        UserDataUpdateWithoutPushSubscriptionsInput
      >,
      UserDataUncheckedUpdateWithoutPushSubscriptionsInput
    >
  }

  export type UserDataCreateNestedOneWithoutProviderAccountsInput = {
    create?: XOR<
      UserDataCreateWithoutProviderAccountsInput,
      UserDataUncheckedCreateWithoutProviderAccountsInput
    >
    connectOrCreate?: UserDataCreateOrConnectWithoutProviderAccountsInput
    connect?: UserDataWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
    unset?: boolean
  }

  export type UserDataUpdateOneRequiredWithoutProviderAccountsNestedInput = {
    create?: XOR<
      UserDataCreateWithoutProviderAccountsInput,
      UserDataUncheckedCreateWithoutProviderAccountsInput
    >
    connectOrCreate?: UserDataCreateOrConnectWithoutProviderAccountsInput
    upsert?: UserDataUpsertWithoutProviderAccountsInput
    connect?: UserDataWhereUniqueInput
    update?: XOR<
      XOR<
        UserDataUpdateToOneWithWhereWithoutProviderAccountsInput,
        UserDataUpdateWithoutProviderAccountsInput
      >,
      UserDataUncheckedUpdateWithoutProviderAccountsInput
    >
  }

  export type AsanaPostureCreateenglish_namesInput = {
    set: string[]
  }

  export type AsanaPostureCreatevariationsInput = {
    set: string[]
  }

  export type AsanaPostureCreatemodificationsInput = {
    set: string[]
  }

  export type AsanaPostureCreatesuggested_posturesInput = {
    set: string[]
  }

  export type AsanaPostureCreatepreparatory_posturesInput = {
    set: string[]
  }

  export type AsanaPostureCreatebreath_seriesInput = {
    set: string[]
  }

  export type AsanaActivityCreateNestedManyWithoutPostureInput = {
    create?:
      | XOR<
          AsanaActivityCreateWithoutPostureInput,
          AsanaActivityUncheckedCreateWithoutPostureInput
        >
      | AsanaActivityCreateWithoutPostureInput[]
      | AsanaActivityUncheckedCreateWithoutPostureInput[]
    connectOrCreate?:
      | AsanaActivityCreateOrConnectWithoutPostureInput
      | AsanaActivityCreateOrConnectWithoutPostureInput[]
    createMany?: AsanaActivityCreateManyPostureInputEnvelope
    connect?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
  }

  export type PoseImageCreateNestedManyWithoutPostureInput = {
    create?:
      | XOR<
          PoseImageCreateWithoutPostureInput,
          PoseImageUncheckedCreateWithoutPostureInput
        >
      | PoseImageCreateWithoutPostureInput[]
      | PoseImageUncheckedCreateWithoutPostureInput[]
    connectOrCreate?:
      | PoseImageCreateOrConnectWithoutPostureInput
      | PoseImageCreateOrConnectWithoutPostureInput[]
    createMany?: PoseImageCreateManyPostureInputEnvelope
    connect?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
  }

  export type AsanaActivityUncheckedCreateNestedManyWithoutPostureInput = {
    create?:
      | XOR<
          AsanaActivityCreateWithoutPostureInput,
          AsanaActivityUncheckedCreateWithoutPostureInput
        >
      | AsanaActivityCreateWithoutPostureInput[]
      | AsanaActivityUncheckedCreateWithoutPostureInput[]
    connectOrCreate?:
      | AsanaActivityCreateOrConnectWithoutPostureInput
      | AsanaActivityCreateOrConnectWithoutPostureInput[]
    createMany?: AsanaActivityCreateManyPostureInputEnvelope
    connect?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
  }

  export type PoseImageUncheckedCreateNestedManyWithoutPostureInput = {
    create?:
      | XOR<
          PoseImageCreateWithoutPostureInput,
          PoseImageUncheckedCreateWithoutPostureInput
        >
      | PoseImageCreateWithoutPostureInput[]
      | PoseImageUncheckedCreateWithoutPostureInput[]
    connectOrCreate?:
      | PoseImageCreateOrConnectWithoutPostureInput
      | PoseImageCreateOrConnectWithoutPostureInput[]
    createMany?: PoseImageCreateManyPostureInputEnvelope
    connect?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
  }

  export type AsanaPostureUpdateenglish_namesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AsanaPostureUpdatevariationsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AsanaPostureUpdatemodificationsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AsanaPostureUpdatesuggested_posturesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AsanaPostureUpdatepreparatory_posturesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
    unset?: boolean
  }

  export type AsanaPostureUpdatebreath_seriesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AsanaActivityUpdateManyWithoutPostureNestedInput = {
    create?:
      | XOR<
          AsanaActivityCreateWithoutPostureInput,
          AsanaActivityUncheckedCreateWithoutPostureInput
        >
      | AsanaActivityCreateWithoutPostureInput[]
      | AsanaActivityUncheckedCreateWithoutPostureInput[]
    connectOrCreate?:
      | AsanaActivityCreateOrConnectWithoutPostureInput
      | AsanaActivityCreateOrConnectWithoutPostureInput[]
    upsert?:
      | AsanaActivityUpsertWithWhereUniqueWithoutPostureInput
      | AsanaActivityUpsertWithWhereUniqueWithoutPostureInput[]
    createMany?: AsanaActivityCreateManyPostureInputEnvelope
    set?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
    disconnect?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
    delete?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
    connect?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
    update?:
      | AsanaActivityUpdateWithWhereUniqueWithoutPostureInput
      | AsanaActivityUpdateWithWhereUniqueWithoutPostureInput[]
    updateMany?:
      | AsanaActivityUpdateManyWithWhereWithoutPostureInput
      | AsanaActivityUpdateManyWithWhereWithoutPostureInput[]
    deleteMany?: AsanaActivityScalarWhereInput | AsanaActivityScalarWhereInput[]
  }

  export type PoseImageUpdateManyWithoutPostureNestedInput = {
    create?:
      | XOR<
          PoseImageCreateWithoutPostureInput,
          PoseImageUncheckedCreateWithoutPostureInput
        >
      | PoseImageCreateWithoutPostureInput[]
      | PoseImageUncheckedCreateWithoutPostureInput[]
    connectOrCreate?:
      | PoseImageCreateOrConnectWithoutPostureInput
      | PoseImageCreateOrConnectWithoutPostureInput[]
    upsert?:
      | PoseImageUpsertWithWhereUniqueWithoutPostureInput
      | PoseImageUpsertWithWhereUniqueWithoutPostureInput[]
    createMany?: PoseImageCreateManyPostureInputEnvelope
    set?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
    disconnect?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
    delete?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
    connect?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
    update?:
      | PoseImageUpdateWithWhereUniqueWithoutPostureInput
      | PoseImageUpdateWithWhereUniqueWithoutPostureInput[]
    updateMany?:
      | PoseImageUpdateManyWithWhereWithoutPostureInput
      | PoseImageUpdateManyWithWhereWithoutPostureInput[]
    deleteMany?: PoseImageScalarWhereInput | PoseImageScalarWhereInput[]
  }

  export type AsanaActivityUncheckedUpdateManyWithoutPostureNestedInput = {
    create?:
      | XOR<
          AsanaActivityCreateWithoutPostureInput,
          AsanaActivityUncheckedCreateWithoutPostureInput
        >
      | AsanaActivityCreateWithoutPostureInput[]
      | AsanaActivityUncheckedCreateWithoutPostureInput[]
    connectOrCreate?:
      | AsanaActivityCreateOrConnectWithoutPostureInput
      | AsanaActivityCreateOrConnectWithoutPostureInput[]
    upsert?:
      | AsanaActivityUpsertWithWhereUniqueWithoutPostureInput
      | AsanaActivityUpsertWithWhereUniqueWithoutPostureInput[]
    createMany?: AsanaActivityCreateManyPostureInputEnvelope
    set?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
    disconnect?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
    delete?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
    connect?: AsanaActivityWhereUniqueInput | AsanaActivityWhereUniqueInput[]
    update?:
      | AsanaActivityUpdateWithWhereUniqueWithoutPostureInput
      | AsanaActivityUpdateWithWhereUniqueWithoutPostureInput[]
    updateMany?:
      | AsanaActivityUpdateManyWithWhereWithoutPostureInput
      | AsanaActivityUpdateManyWithWhereWithoutPostureInput[]
    deleteMany?: AsanaActivityScalarWhereInput | AsanaActivityScalarWhereInput[]
  }

  export type PoseImageUncheckedUpdateManyWithoutPostureNestedInput = {
    create?:
      | XOR<
          PoseImageCreateWithoutPostureInput,
          PoseImageUncheckedCreateWithoutPostureInput
        >
      | PoseImageCreateWithoutPostureInput[]
      | PoseImageUncheckedCreateWithoutPostureInput[]
    connectOrCreate?:
      | PoseImageCreateOrConnectWithoutPostureInput
      | PoseImageCreateOrConnectWithoutPostureInput[]
    upsert?:
      | PoseImageUpsertWithWhereUniqueWithoutPostureInput
      | PoseImageUpsertWithWhereUniqueWithoutPostureInput[]
    createMany?: PoseImageCreateManyPostureInputEnvelope
    set?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
    disconnect?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
    delete?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
    connect?: PoseImageWhereUniqueInput | PoseImageWhereUniqueInput[]
    update?:
      | PoseImageUpdateWithWhereUniqueWithoutPostureInput
      | PoseImageUpdateWithWhereUniqueWithoutPostureInput[]
    updateMany?:
      | PoseImageUpdateManyWithWhereWithoutPostureInput
      | PoseImageUpdateManyWithWhereWithoutPostureInput[]
    deleteMany?: PoseImageScalarWhereInput | PoseImageScalarWhereInput[]
  }

  export type AsanaSeriesCreateseriesPosturesInput = {
    set: string[]
  }

  export type AsanaSeriesCreatebreathSeriesInput = {
    set: string[]
  }

  export type AsanaSeriesCreateimagesInput = {
    set: string[]
  }

  export type AsanaSeriesUpdateseriesPosturesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AsanaSeriesUpdatebreathSeriesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AsanaSeriesUpdateimagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AsanaSequenceCreatesequencesSeriesInput = {
    set: InputJsonValue[]
  }

  export type AsanaSequenceUpdatesequencesSeriesInput = {
    set?: InputJsonValue[]
    push?: InputJsonValue | InputJsonValue[]
  }

  export type UserDataCreateNestedOneWithoutAsanaActivitiesInput = {
    create?: XOR<
      UserDataCreateWithoutAsanaActivitiesInput,
      UserDataUncheckedCreateWithoutAsanaActivitiesInput
    >
    connectOrCreate?: UserDataCreateOrConnectWithoutAsanaActivitiesInput
    connect?: UserDataWhereUniqueInput
  }

  export type AsanaPostureCreateNestedOneWithoutAsanaActivitiesInput = {
    create?: XOR<
      AsanaPostureCreateWithoutAsanaActivitiesInput,
      AsanaPostureUncheckedCreateWithoutAsanaActivitiesInput
    >
    connectOrCreate?: AsanaPostureCreateOrConnectWithoutAsanaActivitiesInput
    connect?: AsanaPostureWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserDataUpdateOneRequiredWithoutAsanaActivitiesNestedInput = {
    create?: XOR<
      UserDataCreateWithoutAsanaActivitiesInput,
      UserDataUncheckedCreateWithoutAsanaActivitiesInput
    >
    connectOrCreate?: UserDataCreateOrConnectWithoutAsanaActivitiesInput
    upsert?: UserDataUpsertWithoutAsanaActivitiesInput
    connect?: UserDataWhereUniqueInput
    update?: XOR<
      XOR<
        UserDataUpdateToOneWithWhereWithoutAsanaActivitiesInput,
        UserDataUpdateWithoutAsanaActivitiesInput
      >,
      UserDataUncheckedUpdateWithoutAsanaActivitiesInput
    >
  }

  export type AsanaPostureUpdateOneRequiredWithoutAsanaActivitiesNestedInput = {
    create?: XOR<
      AsanaPostureCreateWithoutAsanaActivitiesInput,
      AsanaPostureUncheckedCreateWithoutAsanaActivitiesInput
    >
    connectOrCreate?: AsanaPostureCreateOrConnectWithoutAsanaActivitiesInput
    upsert?: AsanaPostureUpsertWithoutAsanaActivitiesInput
    connect?: AsanaPostureWhereUniqueInput
    update?: XOR<
      XOR<
        AsanaPostureUpdateToOneWithWhereWithoutAsanaActivitiesInput,
        AsanaPostureUpdateWithoutAsanaActivitiesInput
      >,
      AsanaPostureUncheckedUpdateWithoutAsanaActivitiesInput
    >
  }

  export type UserDataCreateNestedOneWithoutSeriesActivitiesInput = {
    create?: XOR<
      UserDataCreateWithoutSeriesActivitiesInput,
      UserDataUncheckedCreateWithoutSeriesActivitiesInput
    >
    connectOrCreate?: UserDataCreateOrConnectWithoutSeriesActivitiesInput
    connect?: UserDataWhereUniqueInput
  }

  export type UserDataUpdateOneRequiredWithoutSeriesActivitiesNestedInput = {
    create?: XOR<
      UserDataCreateWithoutSeriesActivitiesInput,
      UserDataUncheckedCreateWithoutSeriesActivitiesInput
    >
    connectOrCreate?: UserDataCreateOrConnectWithoutSeriesActivitiesInput
    upsert?: UserDataUpsertWithoutSeriesActivitiesInput
    connect?: UserDataWhereUniqueInput
    update?: XOR<
      XOR<
        UserDataUpdateToOneWithWhereWithoutSeriesActivitiesInput,
        UserDataUpdateWithoutSeriesActivitiesInput
      >,
      UserDataUncheckedUpdateWithoutSeriesActivitiesInput
    >
  }

  export type UserDataCreateNestedOneWithoutSequenceActivitiesInput = {
    create?: XOR<
      UserDataCreateWithoutSequenceActivitiesInput,
      UserDataUncheckedCreateWithoutSequenceActivitiesInput
    >
    connectOrCreate?: UserDataCreateOrConnectWithoutSequenceActivitiesInput
    connect?: UserDataWhereUniqueInput
  }

  export type UserDataUpdateOneRequiredWithoutSequenceActivitiesNestedInput = {
    create?: XOR<
      UserDataCreateWithoutSequenceActivitiesInput,
      UserDataUncheckedCreateWithoutSequenceActivitiesInput
    >
    connectOrCreate?: UserDataCreateOrConnectWithoutSequenceActivitiesInput
    upsert?: UserDataUpsertWithoutSequenceActivitiesInput
    connect?: UserDataWhereUniqueInput
    update?: XOR<
      XOR<
        UserDataUpdateToOneWithWhereWithoutSequenceActivitiesInput,
        UserDataUpdateWithoutSequenceActivitiesInput
      >,
      UserDataUncheckedUpdateWithoutSequenceActivitiesInput
    >
  }

  export type UserDataCreateNestedOneWithoutUserLoginsInput = {
    create?: XOR<
      UserDataCreateWithoutUserLoginsInput,
      UserDataUncheckedCreateWithoutUserLoginsInput
    >
    connectOrCreate?: UserDataCreateOrConnectWithoutUserLoginsInput
    connect?: UserDataWhereUniqueInput
  }

  export type UserDataUpdateOneRequiredWithoutUserLoginsNestedInput = {
    create?: XOR<
      UserDataCreateWithoutUserLoginsInput,
      UserDataUncheckedCreateWithoutUserLoginsInput
    >
    connectOrCreate?: UserDataCreateOrConnectWithoutUserLoginsInput
    upsert?: UserDataUpsertWithoutUserLoginsInput
    connect?: UserDataWhereUniqueInput
    update?: XOR<
      XOR<
        UserDataUpdateToOneWithWhereWithoutUserLoginsInput,
        UserDataUpdateWithoutUserLoginsInput
      >,
      UserDataUncheckedUpdateWithoutUserLoginsInput
    >
  }

  export type UserDataCreateNestedOneWithoutPoseImagesInput = {
    create?: XOR<
      UserDataCreateWithoutPoseImagesInput,
      UserDataUncheckedCreateWithoutPoseImagesInput
    >
    connectOrCreate?: UserDataCreateOrConnectWithoutPoseImagesInput
    connect?: UserDataWhereUniqueInput
  }

  export type AsanaPostureCreateNestedOneWithoutPoseImagesInput = {
    create?: XOR<
      AsanaPostureCreateWithoutPoseImagesInput,
      AsanaPostureUncheckedCreateWithoutPoseImagesInput
    >
    connectOrCreate?: AsanaPostureCreateOrConnectWithoutPoseImagesInput
    connect?: AsanaPostureWhereUniqueInput
  }

  export type EnumStorageTypeFieldUpdateOperationsInput = {
    set?: $Enums.StorageType
  }

  export type UserDataUpdateOneRequiredWithoutPoseImagesNestedInput = {
    create?: XOR<
      UserDataCreateWithoutPoseImagesInput,
      UserDataUncheckedCreateWithoutPoseImagesInput
    >
    connectOrCreate?: UserDataCreateOrConnectWithoutPoseImagesInput
    upsert?: UserDataUpsertWithoutPoseImagesInput
    connect?: UserDataWhereUniqueInput
    update?: XOR<
      XOR<
        UserDataUpdateToOneWithWhereWithoutPoseImagesInput,
        UserDataUpdateWithoutPoseImagesInput
      >,
      UserDataUncheckedUpdateWithoutPoseImagesInput
    >
  }

  export type AsanaPostureUpdateOneWithoutPoseImagesNestedInput = {
    create?: XOR<
      AsanaPostureCreateWithoutPoseImagesInput,
      AsanaPostureUncheckedCreateWithoutPoseImagesInput
    >
    connectOrCreate?: AsanaPostureCreateOrConnectWithoutPoseImagesInput
    upsert?: AsanaPostureUpsertWithoutPoseImagesInput
    disconnect?: boolean
    delete?: AsanaPostureWhereInput | boolean
    connect?: AsanaPostureWhereUniqueInput
    update?: XOR<
      XOR<
        AsanaPostureUpdateToOneWithWhereWithoutPoseImagesInput,
        AsanaPostureUpdateWithoutPoseImagesInput
      >,
      AsanaPostureUncheckedUpdateWithoutPoseImagesInput
    >
  }

  export type UserDataCreateNestedOneWithoutGlossaryTermsInput = {
    create?: XOR<
      UserDataCreateWithoutGlossaryTermsInput,
      UserDataUncheckedCreateWithoutGlossaryTermsInput
    >
    connectOrCreate?: UserDataCreateOrConnectWithoutGlossaryTermsInput
    connect?: UserDataWhereUniqueInput
  }

  export type EnumGlossarySourceFieldUpdateOperationsInput = {
    set?: $Enums.GlossarySource
  }

  export type UserDataUpdateOneWithoutGlossaryTermsNestedInput = {
    create?: XOR<
      UserDataCreateWithoutGlossaryTermsInput,
      UserDataUncheckedCreateWithoutGlossaryTermsInput
    >
    connectOrCreate?: UserDataCreateOrConnectWithoutGlossaryTermsInput
    upsert?: UserDataUpsertWithoutGlossaryTermsInput
    disconnect?: boolean
    delete?: UserDataWhereInput | boolean
    connect?: UserDataWhereUniqueInput
    update?: XOR<
      XOR<
        UserDataUpdateToOneWithWhereWithoutGlossaryTermsInput,
        UserDataUpdateWithoutGlossaryTermsInput
      >,
      UserDataUncheckedUpdateWithoutGlossaryTermsInput
    >
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
    isSet?: boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> =
    {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
      notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
      not?:
        | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
        | Date
        | string
        | null
      _count?: NestedIntNullableFilter<$PrismaModel>
      _min?: NestedDateTimeNullableFilter<$PrismaModel>
      _max?: NestedDateTimeNullableFilter<$PrismaModel>
      isSet?: boolean
    }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<NestedJsonNullableFilterBase<$PrismaModel>>,
          Exclude<
            keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>,
            'path'
          >
        >,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>
      >

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    isSet?: boolean
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
    isSet?: boolean
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumStorageTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.StorageType | EnumStorageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.StorageType[] | ListEnumStorageTypeFieldRefInput<$PrismaModel>
    notIn?:
      | $Enums.StorageType[]
      | ListEnumStorageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumStorageTypeFilter<$PrismaModel> | $Enums.StorageType
  }

  export type NestedEnumStorageTypeWithAggregatesFilter<$PrismaModel = never> =
    {
      equals?: $Enums.StorageType | EnumStorageTypeFieldRefInput<$PrismaModel>
      in?: $Enums.StorageType[] | ListEnumStorageTypeFieldRefInput<$PrismaModel>
      notIn?:
        | $Enums.StorageType[]
        | ListEnumStorageTypeFieldRefInput<$PrismaModel>
      not?:
        | NestedEnumStorageTypeWithAggregatesFilter<$PrismaModel>
        | $Enums.StorageType
      _count?: NestedIntFilter<$PrismaModel>
      _min?: NestedEnumStorageTypeFilter<$PrismaModel>
      _max?: NestedEnumStorageTypeFilter<$PrismaModel>
    }

  export type NestedEnumGlossarySourceFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.GlossarySource
      | EnumGlossarySourceFieldRefInput<$PrismaModel>
    in?:
      | $Enums.GlossarySource[]
      | ListEnumGlossarySourceFieldRefInput<$PrismaModel>
    notIn?:
      | $Enums.GlossarySource[]
      | ListEnumGlossarySourceFieldRefInput<$PrismaModel>
    not?: NestedEnumGlossarySourceFilter<$PrismaModel> | $Enums.GlossarySource
  }

  export type NestedEnumGlossarySourceWithAggregatesFilter<
    $PrismaModel = never,
  > = {
    equals?:
      | $Enums.GlossarySource
      | EnumGlossarySourceFieldRefInput<$PrismaModel>
    in?:
      | $Enums.GlossarySource[]
      | ListEnumGlossarySourceFieldRefInput<$PrismaModel>
    notIn?:
      | $Enums.GlossarySource[]
      | ListEnumGlossarySourceFieldRefInput<$PrismaModel>
    not?:
      | NestedEnumGlossarySourceWithAggregatesFilter<$PrismaModel>
      | $Enums.GlossarySource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGlossarySourceFilter<$PrismaModel>
    _max?: NestedEnumGlossarySourceFilter<$PrismaModel>
  }

  export type ProviderAccountCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: InputJsonValue | null
    credentials_password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProviderAccountUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: InputJsonValue | null
    credentials_password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProviderAccountCreateOrConnectWithoutUserInput = {
    where: ProviderAccountWhereUniqueInput
    create: XOR<
      ProviderAccountCreateWithoutUserInput,
      ProviderAccountUncheckedCreateWithoutUserInput
    >
  }

  export type ProviderAccountCreateManyUserInputEnvelope = {
    data:
      | ProviderAccountCreateManyUserInput
      | ProviderAccountCreateManyUserInput[]
  }

  export type AsanaActivityCreateWithoutUserInput = {
    id?: string
    postureName: string
    sort_english_name: string
    duration: number
    datePerformed: Date | string
    notes?: string | null
    sensations?: string | null
    completionStatus: string
    difficulty?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    posture: AsanaPostureCreateNestedOneWithoutAsanaActivitiesInput
  }

  export type AsanaActivityUncheckedCreateWithoutUserInput = {
    id?: string
    postureId: string
    postureName: string
    sort_english_name: string
    duration: number
    datePerformed: Date | string
    notes?: string | null
    sensations?: string | null
    completionStatus: string
    difficulty?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AsanaActivityCreateOrConnectWithoutUserInput = {
    where: AsanaActivityWhereUniqueInput
    create: XOR<
      AsanaActivityCreateWithoutUserInput,
      AsanaActivityUncheckedCreateWithoutUserInput
    >
  }

  export type AsanaActivityCreateManyUserInputEnvelope = {
    data: AsanaActivityCreateManyUserInput | AsanaActivityCreateManyUserInput[]
  }

  export type SeriesActivityCreateWithoutUserInput = {
    id?: string
    seriesId: string
    seriesName: string
    datePerformed: Date | string
    difficulty?: string | null
    completionStatus?: string
    duration?: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeriesActivityUncheckedCreateWithoutUserInput = {
    id?: string
    seriesId: string
    seriesName: string
    datePerformed: Date | string
    difficulty?: string | null
    completionStatus?: string
    duration?: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeriesActivityCreateOrConnectWithoutUserInput = {
    where: SeriesActivityWhereUniqueInput
    create: XOR<
      SeriesActivityCreateWithoutUserInput,
      SeriesActivityUncheckedCreateWithoutUserInput
    >
  }

  export type SeriesActivityCreateManyUserInputEnvelope = {
    data:
      | SeriesActivityCreateManyUserInput
      | SeriesActivityCreateManyUserInput[]
  }

  export type SequenceActivityCreateWithoutUserInput = {
    id?: string
    sequenceId: string
    sequenceName: string
    datePerformed: Date | string
    difficulty?: string | null
    completionStatus?: string
    duration?: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SequenceActivityUncheckedCreateWithoutUserInput = {
    id?: string
    sequenceId: string
    sequenceName: string
    datePerformed: Date | string
    difficulty?: string | null
    completionStatus?: string
    duration?: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SequenceActivityCreateOrConnectWithoutUserInput = {
    where: SequenceActivityWhereUniqueInput
    create: XOR<
      SequenceActivityCreateWithoutUserInput,
      SequenceActivityUncheckedCreateWithoutUserInput
    >
  }

  export type SequenceActivityCreateManyUserInputEnvelope = {
    data:
      | SequenceActivityCreateManyUserInput
      | SequenceActivityCreateManyUserInput[]
  }

  export type UserLoginCreateWithoutUserInput = {
    id?: string
    loginDate?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    provider?: string | null
    createdAt?: Date | string
  }

  export type UserLoginUncheckedCreateWithoutUserInput = {
    id?: string
    loginDate?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    provider?: string | null
    createdAt?: Date | string
  }

  export type UserLoginCreateOrConnectWithoutUserInput = {
    where: UserLoginWhereUniqueInput
    create: XOR<
      UserLoginCreateWithoutUserInput,
      UserLoginUncheckedCreateWithoutUserInput
    >
  }

  export type UserLoginCreateManyUserInputEnvelope = {
    data: UserLoginCreateManyUserInput | UserLoginCreateManyUserInput[]
  }

  export type PoseImageCreateWithoutUserInput = {
    id?: string
    postureName?: string | null
    url: string
    altText?: string | null
    fileName?: string | null
    fileSize?: number | null
    uploadedAt?: Date | string
    storageType?: $Enums.StorageType
    localStorageId?: string | null
    cloudflareId?: string | null
    isOffline?: boolean
    imageType?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    posture?: AsanaPostureCreateNestedOneWithoutPoseImagesInput
  }

  export type PoseImageUncheckedCreateWithoutUserInput = {
    id?: string
    postureId?: string | null
    postureName?: string | null
    url: string
    altText?: string | null
    fileName?: string | null
    fileSize?: number | null
    uploadedAt?: Date | string
    storageType?: $Enums.StorageType
    localStorageId?: string | null
    cloudflareId?: string | null
    isOffline?: boolean
    imageType?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PoseImageCreateOrConnectWithoutUserInput = {
    where: PoseImageWhereUniqueInput
    create: XOR<
      PoseImageCreateWithoutUserInput,
      PoseImageUncheckedCreateWithoutUserInput
    >
  }

  export type PoseImageCreateManyUserInputEnvelope = {
    data: PoseImageCreateManyUserInput | PoseImageCreateManyUserInput[]
  }

  export type GlossaryTermCreateWithoutUserInput = {
    id?: string
    term: string
    meaning: string
    whyMatters: string
    category?: string | null
    sanskrit?: string | null
    pronunciation?: string | null
    source?: $Enums.GlossarySource
    readOnly?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GlossaryTermUncheckedCreateWithoutUserInput = {
    id?: string
    term: string
    meaning: string
    whyMatters: string
    category?: string | null
    sanskrit?: string | null
    pronunciation?: string | null
    source?: $Enums.GlossarySource
    readOnly?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GlossaryTermCreateOrConnectWithoutUserInput = {
    where: GlossaryTermWhereUniqueInput
    create: XOR<
      GlossaryTermCreateWithoutUserInput,
      GlossaryTermUncheckedCreateWithoutUserInput
    >
  }

  export type GlossaryTermCreateManyUserInputEnvelope = {
    data: GlossaryTermCreateManyUserInput | GlossaryTermCreateManyUserInput[]
  }

  export type ReminderCreateWithoutUserInput = {
    id?: string
    timeOfDay: string
    days?: ReminderCreatedaysInput | string[]
    enabled?: boolean
    message?: string
    lastSent?: Date | string | null
    emailNotificationsEnabled?: boolean
  }

  export type ReminderUncheckedCreateWithoutUserInput = {
    id?: string
    timeOfDay: string
    days?: ReminderCreatedaysInput | string[]
    enabled?: boolean
    message?: string
    lastSent?: Date | string | null
    emailNotificationsEnabled?: boolean
  }

  export type ReminderCreateOrConnectWithoutUserInput = {
    where: ReminderWhereUniqueInput
    create: XOR<
      ReminderCreateWithoutUserInput,
      ReminderUncheckedCreateWithoutUserInput
    >
  }

  export type ReminderCreateManyUserInputEnvelope = {
    data: ReminderCreateManyUserInput | ReminderCreateManyUserInput[]
  }

  export type PushSubscriptionCreateWithoutUserInput = {
    id?: string
    endpoint: string
    p256dh: string
    auth: string
    createdAt?: Date | string
  }

  export type PushSubscriptionUncheckedCreateWithoutUserInput = {
    id?: string
    endpoint: string
    p256dh: string
    auth: string
    createdAt?: Date | string
  }

  export type PushSubscriptionCreateOrConnectWithoutUserInput = {
    where: PushSubscriptionWhereUniqueInput
    create: XOR<
      PushSubscriptionCreateWithoutUserInput,
      PushSubscriptionUncheckedCreateWithoutUserInput
    >
  }

  export type PushSubscriptionCreateManyUserInputEnvelope = {
    data:
      | PushSubscriptionCreateManyUserInput
      | PushSubscriptionCreateManyUserInput[]
  }

  export type ProviderAccountUpsertWithWhereUniqueWithoutUserInput = {
    where: ProviderAccountWhereUniqueInput
    update: XOR<
      ProviderAccountUpdateWithoutUserInput,
      ProviderAccountUncheckedUpdateWithoutUserInput
    >
    create: XOR<
      ProviderAccountCreateWithoutUserInput,
      ProviderAccountUncheckedCreateWithoutUserInput
    >
  }

  export type ProviderAccountUpdateWithWhereUniqueWithoutUserInput = {
    where: ProviderAccountWhereUniqueInput
    data: XOR<
      ProviderAccountUpdateWithoutUserInput,
      ProviderAccountUncheckedUpdateWithoutUserInput
    >
  }

  export type ProviderAccountUpdateManyWithWhereWithoutUserInput = {
    where: ProviderAccountScalarWhereInput
    data: XOR<
      ProviderAccountUpdateManyMutationInput,
      ProviderAccountUncheckedUpdateManyWithoutUserInput
    >
  }

  export type ProviderAccountScalarWhereInput = {
    AND?: ProviderAccountScalarWhereInput | ProviderAccountScalarWhereInput[]
    OR?: ProviderAccountScalarWhereInput[]
    NOT?: ProviderAccountScalarWhereInput | ProviderAccountScalarWhereInput[]
    id?: StringFilter<'ProviderAccount'> | string
    userId?: StringFilter<'ProviderAccount'> | string
    type?: StringFilter<'ProviderAccount'> | string
    provider?: StringFilter<'ProviderAccount'> | string
    providerAccountId?: StringFilter<'ProviderAccount'> | string
    refresh_token?: StringNullableFilter<'ProviderAccount'> | string | null
    access_token?: StringNullableFilter<'ProviderAccount'> | string | null
    expires_at?: IntNullableFilter<'ProviderAccount'> | number | null
    token_type?: StringNullableFilter<'ProviderAccount'> | string | null
    scope?: StringNullableFilter<'ProviderAccount'> | string | null
    id_token?: StringNullableFilter<'ProviderAccount'> | string | null
    session_state?: JsonNullableFilter<'ProviderAccount'>
    credentials_password?:
      | StringNullableFilter<'ProviderAccount'>
      | string
      | null
    createdAt?: DateTimeFilter<'ProviderAccount'> | Date | string
    updatedAt?: DateTimeFilter<'ProviderAccount'> | Date | string
  }

  export type AsanaActivityUpsertWithWhereUniqueWithoutUserInput = {
    where: AsanaActivityWhereUniqueInput
    update: XOR<
      AsanaActivityUpdateWithoutUserInput,
      AsanaActivityUncheckedUpdateWithoutUserInput
    >
    create: XOR<
      AsanaActivityCreateWithoutUserInput,
      AsanaActivityUncheckedCreateWithoutUserInput
    >
  }

  export type AsanaActivityUpdateWithWhereUniqueWithoutUserInput = {
    where: AsanaActivityWhereUniqueInput
    data: XOR<
      AsanaActivityUpdateWithoutUserInput,
      AsanaActivityUncheckedUpdateWithoutUserInput
    >
  }

  export type AsanaActivityUpdateManyWithWhereWithoutUserInput = {
    where: AsanaActivityScalarWhereInput
    data: XOR<
      AsanaActivityUpdateManyMutationInput,
      AsanaActivityUncheckedUpdateManyWithoutUserInput
    >
  }

  export type AsanaActivityScalarWhereInput = {
    AND?: AsanaActivityScalarWhereInput | AsanaActivityScalarWhereInput[]
    OR?: AsanaActivityScalarWhereInput[]
    NOT?: AsanaActivityScalarWhereInput | AsanaActivityScalarWhereInput[]
    id?: StringFilter<'AsanaActivity'> | string
    userId?: StringFilter<'AsanaActivity'> | string
    postureId?: StringFilter<'AsanaActivity'> | string
    postureName?: StringFilter<'AsanaActivity'> | string
    sort_english_name?: StringFilter<'AsanaActivity'> | string
    duration?: IntFilter<'AsanaActivity'> | number
    datePerformed?: DateTimeFilter<'AsanaActivity'> | Date | string
    notes?: StringNullableFilter<'AsanaActivity'> | string | null
    sensations?: StringNullableFilter<'AsanaActivity'> | string | null
    completionStatus?: StringFilter<'AsanaActivity'> | string
    difficulty?: StringNullableFilter<'AsanaActivity'> | string | null
    createdAt?: DateTimeFilter<'AsanaActivity'> | Date | string
    updatedAt?: DateTimeFilter<'AsanaActivity'> | Date | string
  }

  export type SeriesActivityUpsertWithWhereUniqueWithoutUserInput = {
    where: SeriesActivityWhereUniqueInput
    update: XOR<
      SeriesActivityUpdateWithoutUserInput,
      SeriesActivityUncheckedUpdateWithoutUserInput
    >
    create: XOR<
      SeriesActivityCreateWithoutUserInput,
      SeriesActivityUncheckedCreateWithoutUserInput
    >
  }

  export type SeriesActivityUpdateWithWhereUniqueWithoutUserInput = {
    where: SeriesActivityWhereUniqueInput
    data: XOR<
      SeriesActivityUpdateWithoutUserInput,
      SeriesActivityUncheckedUpdateWithoutUserInput
    >
  }

  export type SeriesActivityUpdateManyWithWhereWithoutUserInput = {
    where: SeriesActivityScalarWhereInput
    data: XOR<
      SeriesActivityUpdateManyMutationInput,
      SeriesActivityUncheckedUpdateManyWithoutUserInput
    >
  }

  export type SeriesActivityScalarWhereInput = {
    AND?: SeriesActivityScalarWhereInput | SeriesActivityScalarWhereInput[]
    OR?: SeriesActivityScalarWhereInput[]
    NOT?: SeriesActivityScalarWhereInput | SeriesActivityScalarWhereInput[]
    id?: StringFilter<'SeriesActivity'> | string
    userId?: StringFilter<'SeriesActivity'> | string
    seriesId?: StringFilter<'SeriesActivity'> | string
    seriesName?: StringFilter<'SeriesActivity'> | string
    datePerformed?: DateTimeFilter<'SeriesActivity'> | Date | string
    difficulty?: StringNullableFilter<'SeriesActivity'> | string | null
    completionStatus?: StringFilter<'SeriesActivity'> | string
    duration?: IntFilter<'SeriesActivity'> | number
    notes?: StringNullableFilter<'SeriesActivity'> | string | null
    createdAt?: DateTimeFilter<'SeriesActivity'> | Date | string
    updatedAt?: DateTimeFilter<'SeriesActivity'> | Date | string
  }

  export type SequenceActivityUpsertWithWhereUniqueWithoutUserInput = {
    where: SequenceActivityWhereUniqueInput
    update: XOR<
      SequenceActivityUpdateWithoutUserInput,
      SequenceActivityUncheckedUpdateWithoutUserInput
    >
    create: XOR<
      SequenceActivityCreateWithoutUserInput,
      SequenceActivityUncheckedCreateWithoutUserInput
    >
  }

  export type SequenceActivityUpdateWithWhereUniqueWithoutUserInput = {
    where: SequenceActivityWhereUniqueInput
    data: XOR<
      SequenceActivityUpdateWithoutUserInput,
      SequenceActivityUncheckedUpdateWithoutUserInput
    >
  }

  export type SequenceActivityUpdateManyWithWhereWithoutUserInput = {
    where: SequenceActivityScalarWhereInput
    data: XOR<
      SequenceActivityUpdateManyMutationInput,
      SequenceActivityUncheckedUpdateManyWithoutUserInput
    >
  }

  export type SequenceActivityScalarWhereInput = {
    AND?: SequenceActivityScalarWhereInput | SequenceActivityScalarWhereInput[]
    OR?: SequenceActivityScalarWhereInput[]
    NOT?: SequenceActivityScalarWhereInput | SequenceActivityScalarWhereInput[]
    id?: StringFilter<'SequenceActivity'> | string
    userId?: StringFilter<'SequenceActivity'> | string
    sequenceId?: StringFilter<'SequenceActivity'> | string
    sequenceName?: StringFilter<'SequenceActivity'> | string
    datePerformed?: DateTimeFilter<'SequenceActivity'> | Date | string
    difficulty?: StringNullableFilter<'SequenceActivity'> | string | null
    completionStatus?: StringFilter<'SequenceActivity'> | string
    duration?: IntFilter<'SequenceActivity'> | number
    notes?: StringNullableFilter<'SequenceActivity'> | string | null
    createdAt?: DateTimeFilter<'SequenceActivity'> | Date | string
    updatedAt?: DateTimeFilter<'SequenceActivity'> | Date | string
  }

  export type UserLoginUpsertWithWhereUniqueWithoutUserInput = {
    where: UserLoginWhereUniqueInput
    update: XOR<
      UserLoginUpdateWithoutUserInput,
      UserLoginUncheckedUpdateWithoutUserInput
    >
    create: XOR<
      UserLoginCreateWithoutUserInput,
      UserLoginUncheckedCreateWithoutUserInput
    >
  }

  export type UserLoginUpdateWithWhereUniqueWithoutUserInput = {
    where: UserLoginWhereUniqueInput
    data: XOR<
      UserLoginUpdateWithoutUserInput,
      UserLoginUncheckedUpdateWithoutUserInput
    >
  }

  export type UserLoginUpdateManyWithWhereWithoutUserInput = {
    where: UserLoginScalarWhereInput
    data: XOR<
      UserLoginUpdateManyMutationInput,
      UserLoginUncheckedUpdateManyWithoutUserInput
    >
  }

  export type UserLoginScalarWhereInput = {
    AND?: UserLoginScalarWhereInput | UserLoginScalarWhereInput[]
    OR?: UserLoginScalarWhereInput[]
    NOT?: UserLoginScalarWhereInput | UserLoginScalarWhereInput[]
    id?: StringFilter<'UserLogin'> | string
    userId?: StringFilter<'UserLogin'> | string
    loginDate?: DateTimeFilter<'UserLogin'> | Date | string
    ipAddress?: StringNullableFilter<'UserLogin'> | string | null
    userAgent?: StringNullableFilter<'UserLogin'> | string | null
    provider?: StringNullableFilter<'UserLogin'> | string | null
    createdAt?: DateTimeFilter<'UserLogin'> | Date | string
  }

  export type PoseImageUpsertWithWhereUniqueWithoutUserInput = {
    where: PoseImageWhereUniqueInput
    update: XOR<
      PoseImageUpdateWithoutUserInput,
      PoseImageUncheckedUpdateWithoutUserInput
    >
    create: XOR<
      PoseImageCreateWithoutUserInput,
      PoseImageUncheckedCreateWithoutUserInput
    >
  }

  export type PoseImageUpdateWithWhereUniqueWithoutUserInput = {
    where: PoseImageWhereUniqueInput
    data: XOR<
      PoseImageUpdateWithoutUserInput,
      PoseImageUncheckedUpdateWithoutUserInput
    >
  }

  export type PoseImageUpdateManyWithWhereWithoutUserInput = {
    where: PoseImageScalarWhereInput
    data: XOR<
      PoseImageUpdateManyMutationInput,
      PoseImageUncheckedUpdateManyWithoutUserInput
    >
  }

  export type PoseImageScalarWhereInput = {
    AND?: PoseImageScalarWhereInput | PoseImageScalarWhereInput[]
    OR?: PoseImageScalarWhereInput[]
    NOT?: PoseImageScalarWhereInput | PoseImageScalarWhereInput[]
    id?: StringFilter<'PoseImage'> | string
    userId?: StringFilter<'PoseImage'> | string
    postureId?: StringNullableFilter<'PoseImage'> | string | null
    postureName?: StringNullableFilter<'PoseImage'> | string | null
    url?: StringFilter<'PoseImage'> | string
    altText?: StringNullableFilter<'PoseImage'> | string | null
    fileName?: StringNullableFilter<'PoseImage'> | string | null
    fileSize?: IntNullableFilter<'PoseImage'> | number | null
    uploadedAt?: DateTimeFilter<'PoseImage'> | Date | string
    storageType?: EnumStorageTypeFilter<'PoseImage'> | $Enums.StorageType
    localStorageId?: StringNullableFilter<'PoseImage'> | string | null
    cloudflareId?: StringNullableFilter<'PoseImage'> | string | null
    isOffline?: BoolFilter<'PoseImage'> | boolean
    imageType?: StringFilter<'PoseImage'> | string
    createdAt?: DateTimeFilter<'PoseImage'> | Date | string
    updatedAt?: DateTimeFilter<'PoseImage'> | Date | string
  }

  export type GlossaryTermUpsertWithWhereUniqueWithoutUserInput = {
    where: GlossaryTermWhereUniqueInput
    update: XOR<
      GlossaryTermUpdateWithoutUserInput,
      GlossaryTermUncheckedUpdateWithoutUserInput
    >
    create: XOR<
      GlossaryTermCreateWithoutUserInput,
      GlossaryTermUncheckedCreateWithoutUserInput
    >
  }

  export type GlossaryTermUpdateWithWhereUniqueWithoutUserInput = {
    where: GlossaryTermWhereUniqueInput
    data: XOR<
      GlossaryTermUpdateWithoutUserInput,
      GlossaryTermUncheckedUpdateWithoutUserInput
    >
  }

  export type GlossaryTermUpdateManyWithWhereWithoutUserInput = {
    where: GlossaryTermScalarWhereInput
    data: XOR<
      GlossaryTermUpdateManyMutationInput,
      GlossaryTermUncheckedUpdateManyWithoutUserInput
    >
  }

  export type GlossaryTermScalarWhereInput = {
    AND?: GlossaryTermScalarWhereInput | GlossaryTermScalarWhereInput[]
    OR?: GlossaryTermScalarWhereInput[]
    NOT?: GlossaryTermScalarWhereInput | GlossaryTermScalarWhereInput[]
    id?: StringFilter<'GlossaryTerm'> | string
    term?: StringFilter<'GlossaryTerm'> | string
    meaning?: StringFilter<'GlossaryTerm'> | string
    whyMatters?: StringFilter<'GlossaryTerm'> | string
    category?: StringNullableFilter<'GlossaryTerm'> | string | null
    sanskrit?: StringNullableFilter<'GlossaryTerm'> | string | null
    pronunciation?: StringNullableFilter<'GlossaryTerm'> | string | null
    source?: EnumGlossarySourceFilter<'GlossaryTerm'> | $Enums.GlossarySource
    userId?: StringNullableFilter<'GlossaryTerm'> | string | null
    readOnly?: BoolFilter<'GlossaryTerm'> | boolean
    createdAt?: DateTimeFilter<'GlossaryTerm'> | Date | string
    updatedAt?: DateTimeFilter<'GlossaryTerm'> | Date | string
  }

  export type ReminderUpsertWithWhereUniqueWithoutUserInput = {
    where: ReminderWhereUniqueInput
    update: XOR<
      ReminderUpdateWithoutUserInput,
      ReminderUncheckedUpdateWithoutUserInput
    >
    create: XOR<
      ReminderCreateWithoutUserInput,
      ReminderUncheckedCreateWithoutUserInput
    >
  }

  export type ReminderUpdateWithWhereUniqueWithoutUserInput = {
    where: ReminderWhereUniqueInput
    data: XOR<
      ReminderUpdateWithoutUserInput,
      ReminderUncheckedUpdateWithoutUserInput
    >
  }

  export type ReminderUpdateManyWithWhereWithoutUserInput = {
    where: ReminderScalarWhereInput
    data: XOR<
      ReminderUpdateManyMutationInput,
      ReminderUncheckedUpdateManyWithoutUserInput
    >
  }

  export type ReminderScalarWhereInput = {
    AND?: ReminderScalarWhereInput | ReminderScalarWhereInput[]
    OR?: ReminderScalarWhereInput[]
    NOT?: ReminderScalarWhereInput | ReminderScalarWhereInput[]
    id?: StringFilter<'Reminder'> | string
    userId?: StringFilter<'Reminder'> | string
    timeOfDay?: StringFilter<'Reminder'> | string
    days?: StringNullableListFilter<'Reminder'>
    enabled?: BoolFilter<'Reminder'> | boolean
    message?: StringFilter<'Reminder'> | string
    lastSent?: DateTimeNullableFilter<'Reminder'> | Date | string | null
    emailNotificationsEnabled?: BoolFilter<'Reminder'> | boolean
  }

  export type PushSubscriptionUpsertWithWhereUniqueWithoutUserInput = {
    where: PushSubscriptionWhereUniqueInput
    update: XOR<
      PushSubscriptionUpdateWithoutUserInput,
      PushSubscriptionUncheckedUpdateWithoutUserInput
    >
    create: XOR<
      PushSubscriptionCreateWithoutUserInput,
      PushSubscriptionUncheckedCreateWithoutUserInput
    >
  }

  export type PushSubscriptionUpdateWithWhereUniqueWithoutUserInput = {
    where: PushSubscriptionWhereUniqueInput
    data: XOR<
      PushSubscriptionUpdateWithoutUserInput,
      PushSubscriptionUncheckedUpdateWithoutUserInput
    >
  }

  export type PushSubscriptionUpdateManyWithWhereWithoutUserInput = {
    where: PushSubscriptionScalarWhereInput
    data: XOR<
      PushSubscriptionUpdateManyMutationInput,
      PushSubscriptionUncheckedUpdateManyWithoutUserInput
    >
  }

  export type PushSubscriptionScalarWhereInput = {
    AND?: PushSubscriptionScalarWhereInput | PushSubscriptionScalarWhereInput[]
    OR?: PushSubscriptionScalarWhereInput[]
    NOT?: PushSubscriptionScalarWhereInput | PushSubscriptionScalarWhereInput[]
    id?: StringFilter<'PushSubscription'> | string
    userId?: StringFilter<'PushSubscription'> | string
    endpoint?: StringFilter<'PushSubscription'> | string
    p256dh?: StringFilter<'PushSubscription'> | string
    auth?: StringFilter<'PushSubscription'> | string
    createdAt?: DateTimeFilter<'PushSubscription'> | Date | string
  }

  export type UserDataCreateWithoutRemindersInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    providerAccounts?: ProviderAccountCreateNestedManyWithoutUserInput
    asanaActivities?: AsanaActivityCreateNestedManyWithoutUserInput
    seriesActivities?: SeriesActivityCreateNestedManyWithoutUserInput
    sequenceActivities?: SequenceActivityCreateNestedManyWithoutUserInput
    userLogins?: UserLoginCreateNestedManyWithoutUserInput
    poseImages?: PoseImageCreateNestedManyWithoutUserInput
    glossaryTerms?: GlossaryTermCreateNestedManyWithoutUserInput
    pushSubscriptions?: PushSubscriptionCreateNestedManyWithoutUserInput
  }

  export type UserDataUncheckedCreateWithoutRemindersInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    providerAccounts?: ProviderAccountUncheckedCreateNestedManyWithoutUserInput
    asanaActivities?: AsanaActivityUncheckedCreateNestedManyWithoutUserInput
    seriesActivities?: SeriesActivityUncheckedCreateNestedManyWithoutUserInput
    sequenceActivities?: SequenceActivityUncheckedCreateNestedManyWithoutUserInput
    userLogins?: UserLoginUncheckedCreateNestedManyWithoutUserInput
    poseImages?: PoseImageUncheckedCreateNestedManyWithoutUserInput
    glossaryTerms?: GlossaryTermUncheckedCreateNestedManyWithoutUserInput
    pushSubscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserDataCreateOrConnectWithoutRemindersInput = {
    where: UserDataWhereUniqueInput
    create: XOR<
      UserDataCreateWithoutRemindersInput,
      UserDataUncheckedCreateWithoutRemindersInput
    >
  }

  export type UserDataUpsertWithoutRemindersInput = {
    update: XOR<
      UserDataUpdateWithoutRemindersInput,
      UserDataUncheckedUpdateWithoutRemindersInput
    >
    create: XOR<
      UserDataCreateWithoutRemindersInput,
      UserDataUncheckedCreateWithoutRemindersInput
    >
    where?: UserDataWhereInput
  }

  export type UserDataUpdateToOneWithWhereWithoutRemindersInput = {
    where?: UserDataWhereInput
    data: XOR<
      UserDataUpdateWithoutRemindersInput,
      UserDataUncheckedUpdateWithoutRemindersInput
    >
  }

  export type UserDataUpdateWithoutRemindersInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUpdateManyWithoutUserNestedInput
    asanaActivities?: AsanaActivityUpdateManyWithoutUserNestedInput
    seriesActivities?: SeriesActivityUpdateManyWithoutUserNestedInput
    sequenceActivities?: SequenceActivityUpdateManyWithoutUserNestedInput
    userLogins?: UserLoginUpdateManyWithoutUserNestedInput
    poseImages?: PoseImageUpdateManyWithoutUserNestedInput
    glossaryTerms?: GlossaryTermUpdateManyWithoutUserNestedInput
    pushSubscriptions?: PushSubscriptionUpdateManyWithoutUserNestedInput
  }

  export type UserDataUncheckedUpdateWithoutRemindersInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUncheckedUpdateManyWithoutUserNestedInput
    asanaActivities?: AsanaActivityUncheckedUpdateManyWithoutUserNestedInput
    seriesActivities?: SeriesActivityUncheckedUpdateManyWithoutUserNestedInput
    sequenceActivities?: SequenceActivityUncheckedUpdateManyWithoutUserNestedInput
    userLogins?: UserLoginUncheckedUpdateManyWithoutUserNestedInput
    poseImages?: PoseImageUncheckedUpdateManyWithoutUserNestedInput
    glossaryTerms?: GlossaryTermUncheckedUpdateManyWithoutUserNestedInput
    pushSubscriptions?: PushSubscriptionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserDataCreateWithoutPushSubscriptionsInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    providerAccounts?: ProviderAccountCreateNestedManyWithoutUserInput
    asanaActivities?: AsanaActivityCreateNestedManyWithoutUserInput
    seriesActivities?: SeriesActivityCreateNestedManyWithoutUserInput
    sequenceActivities?: SequenceActivityCreateNestedManyWithoutUserInput
    userLogins?: UserLoginCreateNestedManyWithoutUserInput
    poseImages?: PoseImageCreateNestedManyWithoutUserInput
    glossaryTerms?: GlossaryTermCreateNestedManyWithoutUserInput
    reminders?: ReminderCreateNestedManyWithoutUserInput
  }

  export type UserDataUncheckedCreateWithoutPushSubscriptionsInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    providerAccounts?: ProviderAccountUncheckedCreateNestedManyWithoutUserInput
    asanaActivities?: AsanaActivityUncheckedCreateNestedManyWithoutUserInput
    seriesActivities?: SeriesActivityUncheckedCreateNestedManyWithoutUserInput
    sequenceActivities?: SequenceActivityUncheckedCreateNestedManyWithoutUserInput
    userLogins?: UserLoginUncheckedCreateNestedManyWithoutUserInput
    poseImages?: PoseImageUncheckedCreateNestedManyWithoutUserInput
    glossaryTerms?: GlossaryTermUncheckedCreateNestedManyWithoutUserInput
    reminders?: ReminderUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserDataCreateOrConnectWithoutPushSubscriptionsInput = {
    where: UserDataWhereUniqueInput
    create: XOR<
      UserDataCreateWithoutPushSubscriptionsInput,
      UserDataUncheckedCreateWithoutPushSubscriptionsInput
    >
  }

  export type UserDataUpsertWithoutPushSubscriptionsInput = {
    update: XOR<
      UserDataUpdateWithoutPushSubscriptionsInput,
      UserDataUncheckedUpdateWithoutPushSubscriptionsInput
    >
    create: XOR<
      UserDataCreateWithoutPushSubscriptionsInput,
      UserDataUncheckedCreateWithoutPushSubscriptionsInput
    >
    where?: UserDataWhereInput
  }

  export type UserDataUpdateToOneWithWhereWithoutPushSubscriptionsInput = {
    where?: UserDataWhereInput
    data: XOR<
      UserDataUpdateWithoutPushSubscriptionsInput,
      UserDataUncheckedUpdateWithoutPushSubscriptionsInput
    >
  }

  export type UserDataUpdateWithoutPushSubscriptionsInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUpdateManyWithoutUserNestedInput
    asanaActivities?: AsanaActivityUpdateManyWithoutUserNestedInput
    seriesActivities?: SeriesActivityUpdateManyWithoutUserNestedInput
    sequenceActivities?: SequenceActivityUpdateManyWithoutUserNestedInput
    userLogins?: UserLoginUpdateManyWithoutUserNestedInput
    poseImages?: PoseImageUpdateManyWithoutUserNestedInput
    glossaryTerms?: GlossaryTermUpdateManyWithoutUserNestedInput
    reminders?: ReminderUpdateManyWithoutUserNestedInput
  }

  export type UserDataUncheckedUpdateWithoutPushSubscriptionsInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUncheckedUpdateManyWithoutUserNestedInput
    asanaActivities?: AsanaActivityUncheckedUpdateManyWithoutUserNestedInput
    seriesActivities?: SeriesActivityUncheckedUpdateManyWithoutUserNestedInput
    sequenceActivities?: SequenceActivityUncheckedUpdateManyWithoutUserNestedInput
    userLogins?: UserLoginUncheckedUpdateManyWithoutUserNestedInput
    poseImages?: PoseImageUncheckedUpdateManyWithoutUserNestedInput
    glossaryTerms?: GlossaryTermUncheckedUpdateManyWithoutUserNestedInput
    reminders?: ReminderUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserDataCreateWithoutProviderAccountsInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    asanaActivities?: AsanaActivityCreateNestedManyWithoutUserInput
    seriesActivities?: SeriesActivityCreateNestedManyWithoutUserInput
    sequenceActivities?: SequenceActivityCreateNestedManyWithoutUserInput
    userLogins?: UserLoginCreateNestedManyWithoutUserInput
    poseImages?: PoseImageCreateNestedManyWithoutUserInput
    glossaryTerms?: GlossaryTermCreateNestedManyWithoutUserInput
    reminders?: ReminderCreateNestedManyWithoutUserInput
    pushSubscriptions?: PushSubscriptionCreateNestedManyWithoutUserInput
  }

  export type UserDataUncheckedCreateWithoutProviderAccountsInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    asanaActivities?: AsanaActivityUncheckedCreateNestedManyWithoutUserInput
    seriesActivities?: SeriesActivityUncheckedCreateNestedManyWithoutUserInput
    sequenceActivities?: SequenceActivityUncheckedCreateNestedManyWithoutUserInput
    userLogins?: UserLoginUncheckedCreateNestedManyWithoutUserInput
    poseImages?: PoseImageUncheckedCreateNestedManyWithoutUserInput
    glossaryTerms?: GlossaryTermUncheckedCreateNestedManyWithoutUserInput
    reminders?: ReminderUncheckedCreateNestedManyWithoutUserInput
    pushSubscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserDataCreateOrConnectWithoutProviderAccountsInput = {
    where: UserDataWhereUniqueInput
    create: XOR<
      UserDataCreateWithoutProviderAccountsInput,
      UserDataUncheckedCreateWithoutProviderAccountsInput
    >
  }

  export type UserDataUpsertWithoutProviderAccountsInput = {
    update: XOR<
      UserDataUpdateWithoutProviderAccountsInput,
      UserDataUncheckedUpdateWithoutProviderAccountsInput
    >
    create: XOR<
      UserDataCreateWithoutProviderAccountsInput,
      UserDataUncheckedCreateWithoutProviderAccountsInput
    >
    where?: UserDataWhereInput
  }

  export type UserDataUpdateToOneWithWhereWithoutProviderAccountsInput = {
    where?: UserDataWhereInput
    data: XOR<
      UserDataUpdateWithoutProviderAccountsInput,
      UserDataUncheckedUpdateWithoutProviderAccountsInput
    >
  }

  export type UserDataUpdateWithoutProviderAccountsInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    asanaActivities?: AsanaActivityUpdateManyWithoutUserNestedInput
    seriesActivities?: SeriesActivityUpdateManyWithoutUserNestedInput
    sequenceActivities?: SequenceActivityUpdateManyWithoutUserNestedInput
    userLogins?: UserLoginUpdateManyWithoutUserNestedInput
    poseImages?: PoseImageUpdateManyWithoutUserNestedInput
    glossaryTerms?: GlossaryTermUpdateManyWithoutUserNestedInput
    reminders?: ReminderUpdateManyWithoutUserNestedInput
    pushSubscriptions?: PushSubscriptionUpdateManyWithoutUserNestedInput
  }

  export type UserDataUncheckedUpdateWithoutProviderAccountsInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    asanaActivities?: AsanaActivityUncheckedUpdateManyWithoutUserNestedInput
    seriesActivities?: SeriesActivityUncheckedUpdateManyWithoutUserNestedInput
    sequenceActivities?: SequenceActivityUncheckedUpdateManyWithoutUserNestedInput
    userLogins?: UserLoginUncheckedUpdateManyWithoutUserNestedInput
    poseImages?: PoseImageUncheckedUpdateManyWithoutUserNestedInput
    glossaryTerms?: GlossaryTermUncheckedUpdateManyWithoutUserNestedInput
    reminders?: ReminderUncheckedUpdateManyWithoutUserNestedInput
    pushSubscriptions?: PushSubscriptionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AsanaActivityCreateWithoutPostureInput = {
    id?: string
    postureName: string
    sort_english_name: string
    duration: number
    datePerformed: Date | string
    notes?: string | null
    sensations?: string | null
    completionStatus: string
    difficulty?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserDataCreateNestedOneWithoutAsanaActivitiesInput
  }

  export type AsanaActivityUncheckedCreateWithoutPostureInput = {
    id?: string
    userId: string
    postureName: string
    sort_english_name: string
    duration: number
    datePerformed: Date | string
    notes?: string | null
    sensations?: string | null
    completionStatus: string
    difficulty?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AsanaActivityCreateOrConnectWithoutPostureInput = {
    where: AsanaActivityWhereUniqueInput
    create: XOR<
      AsanaActivityCreateWithoutPostureInput,
      AsanaActivityUncheckedCreateWithoutPostureInput
    >
  }

  export type AsanaActivityCreateManyPostureInputEnvelope = {
    data:
      | AsanaActivityCreateManyPostureInput
      | AsanaActivityCreateManyPostureInput[]
  }

  export type PoseImageCreateWithoutPostureInput = {
    id?: string
    postureName?: string | null
    url: string
    altText?: string | null
    fileName?: string | null
    fileSize?: number | null
    uploadedAt?: Date | string
    storageType?: $Enums.StorageType
    localStorageId?: string | null
    cloudflareId?: string | null
    isOffline?: boolean
    imageType?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserDataCreateNestedOneWithoutPoseImagesInput
  }

  export type PoseImageUncheckedCreateWithoutPostureInput = {
    id?: string
    userId: string
    postureName?: string | null
    url: string
    altText?: string | null
    fileName?: string | null
    fileSize?: number | null
    uploadedAt?: Date | string
    storageType?: $Enums.StorageType
    localStorageId?: string | null
    cloudflareId?: string | null
    isOffline?: boolean
    imageType?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PoseImageCreateOrConnectWithoutPostureInput = {
    where: PoseImageWhereUniqueInput
    create: XOR<
      PoseImageCreateWithoutPostureInput,
      PoseImageUncheckedCreateWithoutPostureInput
    >
  }

  export type PoseImageCreateManyPostureInputEnvelope = {
    data: PoseImageCreateManyPostureInput | PoseImageCreateManyPostureInput[]
  }

  export type AsanaActivityUpsertWithWhereUniqueWithoutPostureInput = {
    where: AsanaActivityWhereUniqueInput
    update: XOR<
      AsanaActivityUpdateWithoutPostureInput,
      AsanaActivityUncheckedUpdateWithoutPostureInput
    >
    create: XOR<
      AsanaActivityCreateWithoutPostureInput,
      AsanaActivityUncheckedCreateWithoutPostureInput
    >
  }

  export type AsanaActivityUpdateWithWhereUniqueWithoutPostureInput = {
    where: AsanaActivityWhereUniqueInput
    data: XOR<
      AsanaActivityUpdateWithoutPostureInput,
      AsanaActivityUncheckedUpdateWithoutPostureInput
    >
  }

  export type AsanaActivityUpdateManyWithWhereWithoutPostureInput = {
    where: AsanaActivityScalarWhereInput
    data: XOR<
      AsanaActivityUpdateManyMutationInput,
      AsanaActivityUncheckedUpdateManyWithoutPostureInput
    >
  }

  export type PoseImageUpsertWithWhereUniqueWithoutPostureInput = {
    where: PoseImageWhereUniqueInput
    update: XOR<
      PoseImageUpdateWithoutPostureInput,
      PoseImageUncheckedUpdateWithoutPostureInput
    >
    create: XOR<
      PoseImageCreateWithoutPostureInput,
      PoseImageUncheckedCreateWithoutPostureInput
    >
  }

  export type PoseImageUpdateWithWhereUniqueWithoutPostureInput = {
    where: PoseImageWhereUniqueInput
    data: XOR<
      PoseImageUpdateWithoutPostureInput,
      PoseImageUncheckedUpdateWithoutPostureInput
    >
  }

  export type PoseImageUpdateManyWithWhereWithoutPostureInput = {
    where: PoseImageScalarWhereInput
    data: XOR<
      PoseImageUpdateManyMutationInput,
      PoseImageUncheckedUpdateManyWithoutPostureInput
    >
  }

  export type UserDataCreateWithoutAsanaActivitiesInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    providerAccounts?: ProviderAccountCreateNestedManyWithoutUserInput
    seriesActivities?: SeriesActivityCreateNestedManyWithoutUserInput
    sequenceActivities?: SequenceActivityCreateNestedManyWithoutUserInput
    userLogins?: UserLoginCreateNestedManyWithoutUserInput
    poseImages?: PoseImageCreateNestedManyWithoutUserInput
    glossaryTerms?: GlossaryTermCreateNestedManyWithoutUserInput
    reminders?: ReminderCreateNestedManyWithoutUserInput
    pushSubscriptions?: PushSubscriptionCreateNestedManyWithoutUserInput
  }

  export type UserDataUncheckedCreateWithoutAsanaActivitiesInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    providerAccounts?: ProviderAccountUncheckedCreateNestedManyWithoutUserInput
    seriesActivities?: SeriesActivityUncheckedCreateNestedManyWithoutUserInput
    sequenceActivities?: SequenceActivityUncheckedCreateNestedManyWithoutUserInput
    userLogins?: UserLoginUncheckedCreateNestedManyWithoutUserInput
    poseImages?: PoseImageUncheckedCreateNestedManyWithoutUserInput
    glossaryTerms?: GlossaryTermUncheckedCreateNestedManyWithoutUserInput
    reminders?: ReminderUncheckedCreateNestedManyWithoutUserInput
    pushSubscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserDataCreateOrConnectWithoutAsanaActivitiesInput = {
    where: UserDataWhereUniqueInput
    create: XOR<
      UserDataCreateWithoutAsanaActivitiesInput,
      UserDataUncheckedCreateWithoutAsanaActivitiesInput
    >
  }

  export type AsanaPostureCreateWithoutAsanaActivitiesInput = {
    id?: string
    english_names?: AsanaPostureCreateenglish_namesInput | string[]
    sanskrit_names?: InputJsonValue | null
    sort_english_name: string
    description?: string | null
    benefits?: string | null
    category?: string | null
    difficulty?: string | null
    lore?: string | null
    breath_direction_default?: string | null
    dristi?: string | null
    variations?: AsanaPostureCreatevariationsInput | string[]
    modifications?: AsanaPostureCreatemodificationsInput | string[]
    label?: string | null
    suggested_postures?: AsanaPostureCreatesuggested_posturesInput | string[]
    preparatory_postures?:
      | AsanaPostureCreatepreparatory_posturesInput
      | string[]
    preferred_side?: string | null
    sideways?: boolean | null
    image?: string | null
    created_on?: Date | string | null
    updated_on?: Date | string | null
    acitivity_completed?: boolean | null
    acitivity_practice?: boolean | null
    posture_intent?: string | null
    breath_series?: AsanaPostureCreatebreath_seriesInput | string[]
    duration_asana?: string | null
    transition_cues_out?: string | null
    transition_cues_in?: string | null
    setup_cues?: string | null
    deepening_cues?: string | null
    customize_asana?: string | null
    additional_cues?: string | null
    joint_action?: string | null
    muscle_action?: string | null
    created_by?: string | null
    poseImages?: PoseImageCreateNestedManyWithoutPostureInput
  }

  export type AsanaPostureUncheckedCreateWithoutAsanaActivitiesInput = {
    id?: string
    english_names?: AsanaPostureCreateenglish_namesInput | string[]
    sanskrit_names?: InputJsonValue | null
    sort_english_name: string
    description?: string | null
    benefits?: string | null
    category?: string | null
    difficulty?: string | null
    lore?: string | null
    breath_direction_default?: string | null
    dristi?: string | null
    variations?: AsanaPostureCreatevariationsInput | string[]
    modifications?: AsanaPostureCreatemodificationsInput | string[]
    label?: string | null
    suggested_postures?: AsanaPostureCreatesuggested_posturesInput | string[]
    preparatory_postures?:
      | AsanaPostureCreatepreparatory_posturesInput
      | string[]
    preferred_side?: string | null
    sideways?: boolean | null
    image?: string | null
    created_on?: Date | string | null
    updated_on?: Date | string | null
    acitivity_completed?: boolean | null
    acitivity_practice?: boolean | null
    posture_intent?: string | null
    breath_series?: AsanaPostureCreatebreath_seriesInput | string[]
    duration_asana?: string | null
    transition_cues_out?: string | null
    transition_cues_in?: string | null
    setup_cues?: string | null
    deepening_cues?: string | null
    customize_asana?: string | null
    additional_cues?: string | null
    joint_action?: string | null
    muscle_action?: string | null
    created_by?: string | null
    poseImages?: PoseImageUncheckedCreateNestedManyWithoutPostureInput
  }

  export type AsanaPostureCreateOrConnectWithoutAsanaActivitiesInput = {
    where: AsanaPostureWhereUniqueInput
    create: XOR<
      AsanaPostureCreateWithoutAsanaActivitiesInput,
      AsanaPostureUncheckedCreateWithoutAsanaActivitiesInput
    >
  }

  export type UserDataUpsertWithoutAsanaActivitiesInput = {
    update: XOR<
      UserDataUpdateWithoutAsanaActivitiesInput,
      UserDataUncheckedUpdateWithoutAsanaActivitiesInput
    >
    create: XOR<
      UserDataCreateWithoutAsanaActivitiesInput,
      UserDataUncheckedCreateWithoutAsanaActivitiesInput
    >
    where?: UserDataWhereInput
  }

  export type UserDataUpdateToOneWithWhereWithoutAsanaActivitiesInput = {
    where?: UserDataWhereInput
    data: XOR<
      UserDataUpdateWithoutAsanaActivitiesInput,
      UserDataUncheckedUpdateWithoutAsanaActivitiesInput
    >
  }

  export type UserDataUpdateWithoutAsanaActivitiesInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUpdateManyWithoutUserNestedInput
    seriesActivities?: SeriesActivityUpdateManyWithoutUserNestedInput
    sequenceActivities?: SequenceActivityUpdateManyWithoutUserNestedInput
    userLogins?: UserLoginUpdateManyWithoutUserNestedInput
    poseImages?: PoseImageUpdateManyWithoutUserNestedInput
    glossaryTerms?: GlossaryTermUpdateManyWithoutUserNestedInput
    reminders?: ReminderUpdateManyWithoutUserNestedInput
    pushSubscriptions?: PushSubscriptionUpdateManyWithoutUserNestedInput
  }

  export type UserDataUncheckedUpdateWithoutAsanaActivitiesInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUncheckedUpdateManyWithoutUserNestedInput
    seriesActivities?: SeriesActivityUncheckedUpdateManyWithoutUserNestedInput
    sequenceActivities?: SequenceActivityUncheckedUpdateManyWithoutUserNestedInput
    userLogins?: UserLoginUncheckedUpdateManyWithoutUserNestedInput
    poseImages?: PoseImageUncheckedUpdateManyWithoutUserNestedInput
    glossaryTerms?: GlossaryTermUncheckedUpdateManyWithoutUserNestedInput
    reminders?: ReminderUncheckedUpdateManyWithoutUserNestedInput
    pushSubscriptions?: PushSubscriptionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AsanaPostureUpsertWithoutAsanaActivitiesInput = {
    update: XOR<
      AsanaPostureUpdateWithoutAsanaActivitiesInput,
      AsanaPostureUncheckedUpdateWithoutAsanaActivitiesInput
    >
    create: XOR<
      AsanaPostureCreateWithoutAsanaActivitiesInput,
      AsanaPostureUncheckedCreateWithoutAsanaActivitiesInput
    >
    where?: AsanaPostureWhereInput
  }

  export type AsanaPostureUpdateToOneWithWhereWithoutAsanaActivitiesInput = {
    where?: AsanaPostureWhereInput
    data: XOR<
      AsanaPostureUpdateWithoutAsanaActivitiesInput,
      AsanaPostureUncheckedUpdateWithoutAsanaActivitiesInput
    >
  }

  export type AsanaPostureUpdateWithoutAsanaActivitiesInput = {
    english_names?: AsanaPostureUpdateenglish_namesInput | string[]
    sanskrit_names?: InputJsonValue | InputJsonValue | null
    sort_english_name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    benefits?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    lore?: NullableStringFieldUpdateOperationsInput | string | null
    breath_direction_default?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    dristi?: NullableStringFieldUpdateOperationsInput | string | null
    variations?: AsanaPostureUpdatevariationsInput | string[]
    modifications?: AsanaPostureUpdatemodificationsInput | string[]
    label?: NullableStringFieldUpdateOperationsInput | string | null
    suggested_postures?: AsanaPostureUpdatesuggested_posturesInput | string[]
    preparatory_postures?:
      | AsanaPostureUpdatepreparatory_posturesInput
      | string[]
    preferred_side?: NullableStringFieldUpdateOperationsInput | string | null
    sideways?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    created_on?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    updated_on?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    acitivity_completed?:
      | NullableBoolFieldUpdateOperationsInput
      | boolean
      | null
    acitivity_practice?: NullableBoolFieldUpdateOperationsInput | boolean | null
    posture_intent?: NullableStringFieldUpdateOperationsInput | string | null
    breath_series?: AsanaPostureUpdatebreath_seriesInput | string[]
    duration_asana?: NullableStringFieldUpdateOperationsInput | string | null
    transition_cues_out?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    transition_cues_in?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    setup_cues?: NullableStringFieldUpdateOperationsInput | string | null
    deepening_cues?: NullableStringFieldUpdateOperationsInput | string | null
    customize_asana?: NullableStringFieldUpdateOperationsInput | string | null
    additional_cues?: NullableStringFieldUpdateOperationsInput | string | null
    joint_action?: NullableStringFieldUpdateOperationsInput | string | null
    muscle_action?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    poseImages?: PoseImageUpdateManyWithoutPostureNestedInput
  }

  export type AsanaPostureUncheckedUpdateWithoutAsanaActivitiesInput = {
    english_names?: AsanaPostureUpdateenglish_namesInput | string[]
    sanskrit_names?: InputJsonValue | InputJsonValue | null
    sort_english_name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    benefits?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    lore?: NullableStringFieldUpdateOperationsInput | string | null
    breath_direction_default?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    dristi?: NullableStringFieldUpdateOperationsInput | string | null
    variations?: AsanaPostureUpdatevariationsInput | string[]
    modifications?: AsanaPostureUpdatemodificationsInput | string[]
    label?: NullableStringFieldUpdateOperationsInput | string | null
    suggested_postures?: AsanaPostureUpdatesuggested_posturesInput | string[]
    preparatory_postures?:
      | AsanaPostureUpdatepreparatory_posturesInput
      | string[]
    preferred_side?: NullableStringFieldUpdateOperationsInput | string | null
    sideways?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    created_on?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    updated_on?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    acitivity_completed?:
      | NullableBoolFieldUpdateOperationsInput
      | boolean
      | null
    acitivity_practice?: NullableBoolFieldUpdateOperationsInput | boolean | null
    posture_intent?: NullableStringFieldUpdateOperationsInput | string | null
    breath_series?: AsanaPostureUpdatebreath_seriesInput | string[]
    duration_asana?: NullableStringFieldUpdateOperationsInput | string | null
    transition_cues_out?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    transition_cues_in?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    setup_cues?: NullableStringFieldUpdateOperationsInput | string | null
    deepening_cues?: NullableStringFieldUpdateOperationsInput | string | null
    customize_asana?: NullableStringFieldUpdateOperationsInput | string | null
    additional_cues?: NullableStringFieldUpdateOperationsInput | string | null
    joint_action?: NullableStringFieldUpdateOperationsInput | string | null
    muscle_action?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    poseImages?: PoseImageUncheckedUpdateManyWithoutPostureNestedInput
  }

  export type UserDataCreateWithoutSeriesActivitiesInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    providerAccounts?: ProviderAccountCreateNestedManyWithoutUserInput
    asanaActivities?: AsanaActivityCreateNestedManyWithoutUserInput
    sequenceActivities?: SequenceActivityCreateNestedManyWithoutUserInput
    userLogins?: UserLoginCreateNestedManyWithoutUserInput
    poseImages?: PoseImageCreateNestedManyWithoutUserInput
    glossaryTerms?: GlossaryTermCreateNestedManyWithoutUserInput
    reminders?: ReminderCreateNestedManyWithoutUserInput
    pushSubscriptions?: PushSubscriptionCreateNestedManyWithoutUserInput
  }

  export type UserDataUncheckedCreateWithoutSeriesActivitiesInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    providerAccounts?: ProviderAccountUncheckedCreateNestedManyWithoutUserInput
    asanaActivities?: AsanaActivityUncheckedCreateNestedManyWithoutUserInput
    sequenceActivities?: SequenceActivityUncheckedCreateNestedManyWithoutUserInput
    userLogins?: UserLoginUncheckedCreateNestedManyWithoutUserInput
    poseImages?: PoseImageUncheckedCreateNestedManyWithoutUserInput
    glossaryTerms?: GlossaryTermUncheckedCreateNestedManyWithoutUserInput
    reminders?: ReminderUncheckedCreateNestedManyWithoutUserInput
    pushSubscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserDataCreateOrConnectWithoutSeriesActivitiesInput = {
    where: UserDataWhereUniqueInput
    create: XOR<
      UserDataCreateWithoutSeriesActivitiesInput,
      UserDataUncheckedCreateWithoutSeriesActivitiesInput
    >
  }

  export type UserDataUpsertWithoutSeriesActivitiesInput = {
    update: XOR<
      UserDataUpdateWithoutSeriesActivitiesInput,
      UserDataUncheckedUpdateWithoutSeriesActivitiesInput
    >
    create: XOR<
      UserDataCreateWithoutSeriesActivitiesInput,
      UserDataUncheckedCreateWithoutSeriesActivitiesInput
    >
    where?: UserDataWhereInput
  }

  export type UserDataUpdateToOneWithWhereWithoutSeriesActivitiesInput = {
    where?: UserDataWhereInput
    data: XOR<
      UserDataUpdateWithoutSeriesActivitiesInput,
      UserDataUncheckedUpdateWithoutSeriesActivitiesInput
    >
  }

  export type UserDataUpdateWithoutSeriesActivitiesInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUpdateManyWithoutUserNestedInput
    asanaActivities?: AsanaActivityUpdateManyWithoutUserNestedInput
    sequenceActivities?: SequenceActivityUpdateManyWithoutUserNestedInput
    userLogins?: UserLoginUpdateManyWithoutUserNestedInput
    poseImages?: PoseImageUpdateManyWithoutUserNestedInput
    glossaryTerms?: GlossaryTermUpdateManyWithoutUserNestedInput
    reminders?: ReminderUpdateManyWithoutUserNestedInput
    pushSubscriptions?: PushSubscriptionUpdateManyWithoutUserNestedInput
  }

  export type UserDataUncheckedUpdateWithoutSeriesActivitiesInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUncheckedUpdateManyWithoutUserNestedInput
    asanaActivities?: AsanaActivityUncheckedUpdateManyWithoutUserNestedInput
    sequenceActivities?: SequenceActivityUncheckedUpdateManyWithoutUserNestedInput
    userLogins?: UserLoginUncheckedUpdateManyWithoutUserNestedInput
    poseImages?: PoseImageUncheckedUpdateManyWithoutUserNestedInput
    glossaryTerms?: GlossaryTermUncheckedUpdateManyWithoutUserNestedInput
    reminders?: ReminderUncheckedUpdateManyWithoutUserNestedInput
    pushSubscriptions?: PushSubscriptionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserDataCreateWithoutSequenceActivitiesInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    providerAccounts?: ProviderAccountCreateNestedManyWithoutUserInput
    asanaActivities?: AsanaActivityCreateNestedManyWithoutUserInput
    seriesActivities?: SeriesActivityCreateNestedManyWithoutUserInput
    userLogins?: UserLoginCreateNestedManyWithoutUserInput
    poseImages?: PoseImageCreateNestedManyWithoutUserInput
    glossaryTerms?: GlossaryTermCreateNestedManyWithoutUserInput
    reminders?: ReminderCreateNestedManyWithoutUserInput
    pushSubscriptions?: PushSubscriptionCreateNestedManyWithoutUserInput
  }

  export type UserDataUncheckedCreateWithoutSequenceActivitiesInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    providerAccounts?: ProviderAccountUncheckedCreateNestedManyWithoutUserInput
    asanaActivities?: AsanaActivityUncheckedCreateNestedManyWithoutUserInput
    seriesActivities?: SeriesActivityUncheckedCreateNestedManyWithoutUserInput
    userLogins?: UserLoginUncheckedCreateNestedManyWithoutUserInput
    poseImages?: PoseImageUncheckedCreateNestedManyWithoutUserInput
    glossaryTerms?: GlossaryTermUncheckedCreateNestedManyWithoutUserInput
    reminders?: ReminderUncheckedCreateNestedManyWithoutUserInput
    pushSubscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserDataCreateOrConnectWithoutSequenceActivitiesInput = {
    where: UserDataWhereUniqueInput
    create: XOR<
      UserDataCreateWithoutSequenceActivitiesInput,
      UserDataUncheckedCreateWithoutSequenceActivitiesInput
    >
  }

  export type UserDataUpsertWithoutSequenceActivitiesInput = {
    update: XOR<
      UserDataUpdateWithoutSequenceActivitiesInput,
      UserDataUncheckedUpdateWithoutSequenceActivitiesInput
    >
    create: XOR<
      UserDataCreateWithoutSequenceActivitiesInput,
      UserDataUncheckedCreateWithoutSequenceActivitiesInput
    >
    where?: UserDataWhereInput
  }

  export type UserDataUpdateToOneWithWhereWithoutSequenceActivitiesInput = {
    where?: UserDataWhereInput
    data: XOR<
      UserDataUpdateWithoutSequenceActivitiesInput,
      UserDataUncheckedUpdateWithoutSequenceActivitiesInput
    >
  }

  export type UserDataUpdateWithoutSequenceActivitiesInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUpdateManyWithoutUserNestedInput
    asanaActivities?: AsanaActivityUpdateManyWithoutUserNestedInput
    seriesActivities?: SeriesActivityUpdateManyWithoutUserNestedInput
    userLogins?: UserLoginUpdateManyWithoutUserNestedInput
    poseImages?: PoseImageUpdateManyWithoutUserNestedInput
    glossaryTerms?: GlossaryTermUpdateManyWithoutUserNestedInput
    reminders?: ReminderUpdateManyWithoutUserNestedInput
    pushSubscriptions?: PushSubscriptionUpdateManyWithoutUserNestedInput
  }

  export type UserDataUncheckedUpdateWithoutSequenceActivitiesInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUncheckedUpdateManyWithoutUserNestedInput
    asanaActivities?: AsanaActivityUncheckedUpdateManyWithoutUserNestedInput
    seriesActivities?: SeriesActivityUncheckedUpdateManyWithoutUserNestedInput
    userLogins?: UserLoginUncheckedUpdateManyWithoutUserNestedInput
    poseImages?: PoseImageUncheckedUpdateManyWithoutUserNestedInput
    glossaryTerms?: GlossaryTermUncheckedUpdateManyWithoutUserNestedInput
    reminders?: ReminderUncheckedUpdateManyWithoutUserNestedInput
    pushSubscriptions?: PushSubscriptionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserDataCreateWithoutUserLoginsInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    providerAccounts?: ProviderAccountCreateNestedManyWithoutUserInput
    asanaActivities?: AsanaActivityCreateNestedManyWithoutUserInput
    seriesActivities?: SeriesActivityCreateNestedManyWithoutUserInput
    sequenceActivities?: SequenceActivityCreateNestedManyWithoutUserInput
    poseImages?: PoseImageCreateNestedManyWithoutUserInput
    glossaryTerms?: GlossaryTermCreateNestedManyWithoutUserInput
    reminders?: ReminderCreateNestedManyWithoutUserInput
    pushSubscriptions?: PushSubscriptionCreateNestedManyWithoutUserInput
  }

  export type UserDataUncheckedCreateWithoutUserLoginsInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    providerAccounts?: ProviderAccountUncheckedCreateNestedManyWithoutUserInput
    asanaActivities?: AsanaActivityUncheckedCreateNestedManyWithoutUserInput
    seriesActivities?: SeriesActivityUncheckedCreateNestedManyWithoutUserInput
    sequenceActivities?: SequenceActivityUncheckedCreateNestedManyWithoutUserInput
    poseImages?: PoseImageUncheckedCreateNestedManyWithoutUserInput
    glossaryTerms?: GlossaryTermUncheckedCreateNestedManyWithoutUserInput
    reminders?: ReminderUncheckedCreateNestedManyWithoutUserInput
    pushSubscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserDataCreateOrConnectWithoutUserLoginsInput = {
    where: UserDataWhereUniqueInput
    create: XOR<
      UserDataCreateWithoutUserLoginsInput,
      UserDataUncheckedCreateWithoutUserLoginsInput
    >
  }

  export type UserDataUpsertWithoutUserLoginsInput = {
    update: XOR<
      UserDataUpdateWithoutUserLoginsInput,
      UserDataUncheckedUpdateWithoutUserLoginsInput
    >
    create: XOR<
      UserDataCreateWithoutUserLoginsInput,
      UserDataUncheckedCreateWithoutUserLoginsInput
    >
    where?: UserDataWhereInput
  }

  export type UserDataUpdateToOneWithWhereWithoutUserLoginsInput = {
    where?: UserDataWhereInput
    data: XOR<
      UserDataUpdateWithoutUserLoginsInput,
      UserDataUncheckedUpdateWithoutUserLoginsInput
    >
  }

  export type UserDataUpdateWithoutUserLoginsInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUpdateManyWithoutUserNestedInput
    asanaActivities?: AsanaActivityUpdateManyWithoutUserNestedInput
    seriesActivities?: SeriesActivityUpdateManyWithoutUserNestedInput
    sequenceActivities?: SequenceActivityUpdateManyWithoutUserNestedInput
    poseImages?: PoseImageUpdateManyWithoutUserNestedInput
    glossaryTerms?: GlossaryTermUpdateManyWithoutUserNestedInput
    reminders?: ReminderUpdateManyWithoutUserNestedInput
    pushSubscriptions?: PushSubscriptionUpdateManyWithoutUserNestedInput
  }

  export type UserDataUncheckedUpdateWithoutUserLoginsInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUncheckedUpdateManyWithoutUserNestedInput
    asanaActivities?: AsanaActivityUncheckedUpdateManyWithoutUserNestedInput
    seriesActivities?: SeriesActivityUncheckedUpdateManyWithoutUserNestedInput
    sequenceActivities?: SequenceActivityUncheckedUpdateManyWithoutUserNestedInput
    poseImages?: PoseImageUncheckedUpdateManyWithoutUserNestedInput
    glossaryTerms?: GlossaryTermUncheckedUpdateManyWithoutUserNestedInput
    reminders?: ReminderUncheckedUpdateManyWithoutUserNestedInput
    pushSubscriptions?: PushSubscriptionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserDataCreateWithoutPoseImagesInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    providerAccounts?: ProviderAccountCreateNestedManyWithoutUserInput
    asanaActivities?: AsanaActivityCreateNestedManyWithoutUserInput
    seriesActivities?: SeriesActivityCreateNestedManyWithoutUserInput
    sequenceActivities?: SequenceActivityCreateNestedManyWithoutUserInput
    userLogins?: UserLoginCreateNestedManyWithoutUserInput
    glossaryTerms?: GlossaryTermCreateNestedManyWithoutUserInput
    reminders?: ReminderCreateNestedManyWithoutUserInput
    pushSubscriptions?: PushSubscriptionCreateNestedManyWithoutUserInput
  }

  export type UserDataUncheckedCreateWithoutPoseImagesInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    providerAccounts?: ProviderAccountUncheckedCreateNestedManyWithoutUserInput
    asanaActivities?: AsanaActivityUncheckedCreateNestedManyWithoutUserInput
    seriesActivities?: SeriesActivityUncheckedCreateNestedManyWithoutUserInput
    sequenceActivities?: SequenceActivityUncheckedCreateNestedManyWithoutUserInput
    userLogins?: UserLoginUncheckedCreateNestedManyWithoutUserInput
    glossaryTerms?: GlossaryTermUncheckedCreateNestedManyWithoutUserInput
    reminders?: ReminderUncheckedCreateNestedManyWithoutUserInput
    pushSubscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserDataCreateOrConnectWithoutPoseImagesInput = {
    where: UserDataWhereUniqueInput
    create: XOR<
      UserDataCreateWithoutPoseImagesInput,
      UserDataUncheckedCreateWithoutPoseImagesInput
    >
  }

  export type AsanaPostureCreateWithoutPoseImagesInput = {
    id?: string
    english_names?: AsanaPostureCreateenglish_namesInput | string[]
    sanskrit_names?: InputJsonValue | null
    sort_english_name: string
    description?: string | null
    benefits?: string | null
    category?: string | null
    difficulty?: string | null
    lore?: string | null
    breath_direction_default?: string | null
    dristi?: string | null
    variations?: AsanaPostureCreatevariationsInput | string[]
    modifications?: AsanaPostureCreatemodificationsInput | string[]
    label?: string | null
    suggested_postures?: AsanaPostureCreatesuggested_posturesInput | string[]
    preparatory_postures?:
      | AsanaPostureCreatepreparatory_posturesInput
      | string[]
    preferred_side?: string | null
    sideways?: boolean | null
    image?: string | null
    created_on?: Date | string | null
    updated_on?: Date | string | null
    acitivity_completed?: boolean | null
    acitivity_practice?: boolean | null
    posture_intent?: string | null
    breath_series?: AsanaPostureCreatebreath_seriesInput | string[]
    duration_asana?: string | null
    transition_cues_out?: string | null
    transition_cues_in?: string | null
    setup_cues?: string | null
    deepening_cues?: string | null
    customize_asana?: string | null
    additional_cues?: string | null
    joint_action?: string | null
    muscle_action?: string | null
    created_by?: string | null
    asanaActivities?: AsanaActivityCreateNestedManyWithoutPostureInput
  }

  export type AsanaPostureUncheckedCreateWithoutPoseImagesInput = {
    id?: string
    english_names?: AsanaPostureCreateenglish_namesInput | string[]
    sanskrit_names?: InputJsonValue | null
    sort_english_name: string
    description?: string | null
    benefits?: string | null
    category?: string | null
    difficulty?: string | null
    lore?: string | null
    breath_direction_default?: string | null
    dristi?: string | null
    variations?: AsanaPostureCreatevariationsInput | string[]
    modifications?: AsanaPostureCreatemodificationsInput | string[]
    label?: string | null
    suggested_postures?: AsanaPostureCreatesuggested_posturesInput | string[]
    preparatory_postures?:
      | AsanaPostureCreatepreparatory_posturesInput
      | string[]
    preferred_side?: string | null
    sideways?: boolean | null
    image?: string | null
    created_on?: Date | string | null
    updated_on?: Date | string | null
    acitivity_completed?: boolean | null
    acitivity_practice?: boolean | null
    posture_intent?: string | null
    breath_series?: AsanaPostureCreatebreath_seriesInput | string[]
    duration_asana?: string | null
    transition_cues_out?: string | null
    transition_cues_in?: string | null
    setup_cues?: string | null
    deepening_cues?: string | null
    customize_asana?: string | null
    additional_cues?: string | null
    joint_action?: string | null
    muscle_action?: string | null
    created_by?: string | null
    asanaActivities?: AsanaActivityUncheckedCreateNestedManyWithoutPostureInput
  }

  export type AsanaPostureCreateOrConnectWithoutPoseImagesInput = {
    where: AsanaPostureWhereUniqueInput
    create: XOR<
      AsanaPostureCreateWithoutPoseImagesInput,
      AsanaPostureUncheckedCreateWithoutPoseImagesInput
    >
  }

  export type UserDataUpsertWithoutPoseImagesInput = {
    update: XOR<
      UserDataUpdateWithoutPoseImagesInput,
      UserDataUncheckedUpdateWithoutPoseImagesInput
    >
    create: XOR<
      UserDataCreateWithoutPoseImagesInput,
      UserDataUncheckedCreateWithoutPoseImagesInput
    >
    where?: UserDataWhereInput
  }

  export type UserDataUpdateToOneWithWhereWithoutPoseImagesInput = {
    where?: UserDataWhereInput
    data: XOR<
      UserDataUpdateWithoutPoseImagesInput,
      UserDataUncheckedUpdateWithoutPoseImagesInput
    >
  }

  export type UserDataUpdateWithoutPoseImagesInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUpdateManyWithoutUserNestedInput
    asanaActivities?: AsanaActivityUpdateManyWithoutUserNestedInput
    seriesActivities?: SeriesActivityUpdateManyWithoutUserNestedInput
    sequenceActivities?: SequenceActivityUpdateManyWithoutUserNestedInput
    userLogins?: UserLoginUpdateManyWithoutUserNestedInput
    glossaryTerms?: GlossaryTermUpdateManyWithoutUserNestedInput
    reminders?: ReminderUpdateManyWithoutUserNestedInput
    pushSubscriptions?: PushSubscriptionUpdateManyWithoutUserNestedInput
  }

  export type UserDataUncheckedUpdateWithoutPoseImagesInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUncheckedUpdateManyWithoutUserNestedInput
    asanaActivities?: AsanaActivityUncheckedUpdateManyWithoutUserNestedInput
    seriesActivities?: SeriesActivityUncheckedUpdateManyWithoutUserNestedInput
    sequenceActivities?: SequenceActivityUncheckedUpdateManyWithoutUserNestedInput
    userLogins?: UserLoginUncheckedUpdateManyWithoutUserNestedInput
    glossaryTerms?: GlossaryTermUncheckedUpdateManyWithoutUserNestedInput
    reminders?: ReminderUncheckedUpdateManyWithoutUserNestedInput
    pushSubscriptions?: PushSubscriptionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AsanaPostureUpsertWithoutPoseImagesInput = {
    update: XOR<
      AsanaPostureUpdateWithoutPoseImagesInput,
      AsanaPostureUncheckedUpdateWithoutPoseImagesInput
    >
    create: XOR<
      AsanaPostureCreateWithoutPoseImagesInput,
      AsanaPostureUncheckedCreateWithoutPoseImagesInput
    >
    where?: AsanaPostureWhereInput
  }

  export type AsanaPostureUpdateToOneWithWhereWithoutPoseImagesInput = {
    where?: AsanaPostureWhereInput
    data: XOR<
      AsanaPostureUpdateWithoutPoseImagesInput,
      AsanaPostureUncheckedUpdateWithoutPoseImagesInput
    >
  }

  export type AsanaPostureUpdateWithoutPoseImagesInput = {
    english_names?: AsanaPostureUpdateenglish_namesInput | string[]
    sanskrit_names?: InputJsonValue | InputJsonValue | null
    sort_english_name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    benefits?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    lore?: NullableStringFieldUpdateOperationsInput | string | null
    breath_direction_default?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    dristi?: NullableStringFieldUpdateOperationsInput | string | null
    variations?: AsanaPostureUpdatevariationsInput | string[]
    modifications?: AsanaPostureUpdatemodificationsInput | string[]
    label?: NullableStringFieldUpdateOperationsInput | string | null
    suggested_postures?: AsanaPostureUpdatesuggested_posturesInput | string[]
    preparatory_postures?:
      | AsanaPostureUpdatepreparatory_posturesInput
      | string[]
    preferred_side?: NullableStringFieldUpdateOperationsInput | string | null
    sideways?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    created_on?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    updated_on?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    acitivity_completed?:
      | NullableBoolFieldUpdateOperationsInput
      | boolean
      | null
    acitivity_practice?: NullableBoolFieldUpdateOperationsInput | boolean | null
    posture_intent?: NullableStringFieldUpdateOperationsInput | string | null
    breath_series?: AsanaPostureUpdatebreath_seriesInput | string[]
    duration_asana?: NullableStringFieldUpdateOperationsInput | string | null
    transition_cues_out?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    transition_cues_in?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    setup_cues?: NullableStringFieldUpdateOperationsInput | string | null
    deepening_cues?: NullableStringFieldUpdateOperationsInput | string | null
    customize_asana?: NullableStringFieldUpdateOperationsInput | string | null
    additional_cues?: NullableStringFieldUpdateOperationsInput | string | null
    joint_action?: NullableStringFieldUpdateOperationsInput | string | null
    muscle_action?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    asanaActivities?: AsanaActivityUpdateManyWithoutPostureNestedInput
  }

  export type AsanaPostureUncheckedUpdateWithoutPoseImagesInput = {
    english_names?: AsanaPostureUpdateenglish_namesInput | string[]
    sanskrit_names?: InputJsonValue | InputJsonValue | null
    sort_english_name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    benefits?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    lore?: NullableStringFieldUpdateOperationsInput | string | null
    breath_direction_default?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    dristi?: NullableStringFieldUpdateOperationsInput | string | null
    variations?: AsanaPostureUpdatevariationsInput | string[]
    modifications?: AsanaPostureUpdatemodificationsInput | string[]
    label?: NullableStringFieldUpdateOperationsInput | string | null
    suggested_postures?: AsanaPostureUpdatesuggested_posturesInput | string[]
    preparatory_postures?:
      | AsanaPostureUpdatepreparatory_posturesInput
      | string[]
    preferred_side?: NullableStringFieldUpdateOperationsInput | string | null
    sideways?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    created_on?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    updated_on?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    acitivity_completed?:
      | NullableBoolFieldUpdateOperationsInput
      | boolean
      | null
    acitivity_practice?: NullableBoolFieldUpdateOperationsInput | boolean | null
    posture_intent?: NullableStringFieldUpdateOperationsInput | string | null
    breath_series?: AsanaPostureUpdatebreath_seriesInput | string[]
    duration_asana?: NullableStringFieldUpdateOperationsInput | string | null
    transition_cues_out?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    transition_cues_in?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    setup_cues?: NullableStringFieldUpdateOperationsInput | string | null
    deepening_cues?: NullableStringFieldUpdateOperationsInput | string | null
    customize_asana?: NullableStringFieldUpdateOperationsInput | string | null
    additional_cues?: NullableStringFieldUpdateOperationsInput | string | null
    joint_action?: NullableStringFieldUpdateOperationsInput | string | null
    muscle_action?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    asanaActivities?: AsanaActivityUncheckedUpdateManyWithoutPostureNestedInput
  }

  export type UserDataCreateWithoutGlossaryTermsInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    providerAccounts?: ProviderAccountCreateNestedManyWithoutUserInput
    asanaActivities?: AsanaActivityCreateNestedManyWithoutUserInput
    seriesActivities?: SeriesActivityCreateNestedManyWithoutUserInput
    sequenceActivities?: SequenceActivityCreateNestedManyWithoutUserInput
    userLogins?: UserLoginCreateNestedManyWithoutUserInput
    poseImages?: PoseImageCreateNestedManyWithoutUserInput
    reminders?: ReminderCreateNestedManyWithoutUserInput
    pushSubscriptions?: PushSubscriptionCreateNestedManyWithoutUserInput
  }

  export type UserDataUncheckedCreateWithoutGlossaryTermsInput = {
    id?: string
    provider_id?: string | null
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    pronouns?: string | null
    profile?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
    shareQuick?: string | null
    yogaStyle?: string | null
    yogaExperience?: string | null
    company?: string | null
    socialURL?: string | null
    isLocationPublic?: string | null
    role?: string | null
    profileImages?: UserDataCreateprofileImagesInput | string[]
    activeProfileImage?: string | null
    tz?: string
    providerAccounts?: ProviderAccountUncheckedCreateNestedManyWithoutUserInput
    asanaActivities?: AsanaActivityUncheckedCreateNestedManyWithoutUserInput
    seriesActivities?: SeriesActivityUncheckedCreateNestedManyWithoutUserInput
    sequenceActivities?: SequenceActivityUncheckedCreateNestedManyWithoutUserInput
    userLogins?: UserLoginUncheckedCreateNestedManyWithoutUserInput
    poseImages?: PoseImageUncheckedCreateNestedManyWithoutUserInput
    reminders?: ReminderUncheckedCreateNestedManyWithoutUserInput
    pushSubscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserDataCreateOrConnectWithoutGlossaryTermsInput = {
    where: UserDataWhereUniqueInput
    create: XOR<
      UserDataCreateWithoutGlossaryTermsInput,
      UserDataUncheckedCreateWithoutGlossaryTermsInput
    >
  }

  export type UserDataUpsertWithoutGlossaryTermsInput = {
    update: XOR<
      UserDataUpdateWithoutGlossaryTermsInput,
      UserDataUncheckedUpdateWithoutGlossaryTermsInput
    >
    create: XOR<
      UserDataCreateWithoutGlossaryTermsInput,
      UserDataUncheckedCreateWithoutGlossaryTermsInput
    >
    where?: UserDataWhereInput
  }

  export type UserDataUpdateToOneWithWhereWithoutGlossaryTermsInput = {
    where?: UserDataWhereInput
    data: XOR<
      UserDataUpdateWithoutGlossaryTermsInput,
      UserDataUncheckedUpdateWithoutGlossaryTermsInput
    >
  }

  export type UserDataUpdateWithoutGlossaryTermsInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUpdateManyWithoutUserNestedInput
    asanaActivities?: AsanaActivityUpdateManyWithoutUserNestedInput
    seriesActivities?: SeriesActivityUpdateManyWithoutUserNestedInput
    sequenceActivities?: SequenceActivityUpdateManyWithoutUserNestedInput
    userLogins?: UserLoginUpdateManyWithoutUserNestedInput
    poseImages?: PoseImageUpdateManyWithoutUserNestedInput
    reminders?: ReminderUpdateManyWithoutUserNestedInput
    pushSubscriptions?: PushSubscriptionUpdateManyWithoutUserNestedInput
  }

  export type UserDataUncheckedUpdateWithoutGlossaryTermsInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    shareQuick?: NullableStringFieldUpdateOperationsInput | string | null
    yogaStyle?: NullableStringFieldUpdateOperationsInput | string | null
    yogaExperience?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    socialURL?: NullableStringFieldUpdateOperationsInput | string | null
    isLocationPublic?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    profileImages?: UserDataUpdateprofileImagesInput | string[]
    activeProfileImage?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    tz?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUncheckedUpdateManyWithoutUserNestedInput
    asanaActivities?: AsanaActivityUncheckedUpdateManyWithoutUserNestedInput
    seriesActivities?: SeriesActivityUncheckedUpdateManyWithoutUserNestedInput
    sequenceActivities?: SequenceActivityUncheckedUpdateManyWithoutUserNestedInput
    userLogins?: UserLoginUncheckedUpdateManyWithoutUserNestedInput
    poseImages?: PoseImageUncheckedUpdateManyWithoutUserNestedInput
    reminders?: ReminderUncheckedUpdateManyWithoutUserNestedInput
    pushSubscriptions?: PushSubscriptionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProviderAccountCreateManyUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: InputJsonValue | null
    credentials_password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AsanaActivityCreateManyUserInput = {
    id?: string
    postureId: string
    postureName: string
    sort_english_name: string
    duration: number
    datePerformed: Date | string
    notes?: string | null
    sensations?: string | null
    completionStatus: string
    difficulty?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeriesActivityCreateManyUserInput = {
    id?: string
    seriesId: string
    seriesName: string
    datePerformed: Date | string
    difficulty?: string | null
    completionStatus?: string
    duration?: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SequenceActivityCreateManyUserInput = {
    id?: string
    sequenceId: string
    sequenceName: string
    datePerformed: Date | string
    difficulty?: string | null
    completionStatus?: string
    duration?: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserLoginCreateManyUserInput = {
    id?: string
    loginDate?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    provider?: string | null
    createdAt?: Date | string
  }

  export type PoseImageCreateManyUserInput = {
    id?: string
    postureId?: string | null
    postureName?: string | null
    url: string
    altText?: string | null
    fileName?: string | null
    fileSize?: number | null
    uploadedAt?: Date | string
    storageType?: $Enums.StorageType
    localStorageId?: string | null
    cloudflareId?: string | null
    isOffline?: boolean
    imageType?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GlossaryTermCreateManyUserInput = {
    id?: string
    term: string
    meaning: string
    whyMatters: string
    category?: string | null
    sanskrit?: string | null
    pronunciation?: string | null
    source?: $Enums.GlossarySource
    readOnly?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReminderCreateManyUserInput = {
    id?: string
    timeOfDay: string
    days?: ReminderCreatedaysInput | string[]
    enabled?: boolean
    message?: string
    lastSent?: Date | string | null
    emailNotificationsEnabled?: boolean
  }

  export type PushSubscriptionCreateManyUserInput = {
    id?: string
    endpoint: string
    p256dh: string
    auth: string
    createdAt?: Date | string
  }

  export type ProviderAccountUpdateWithoutUserInput = {
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: InputJsonValue | InputJsonValue | null
    credentials_password?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderAccountUncheckedUpdateWithoutUserInput = {
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: InputJsonValue | InputJsonValue | null
    credentials_password?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderAccountUncheckedUpdateManyWithoutUserInput = {
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: InputJsonValue | InputJsonValue | null
    credentials_password?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsanaActivityUpdateWithoutUserInput = {
    postureName?: StringFieldUpdateOperationsInput | string
    sort_english_name?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    sensations?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posture?: AsanaPostureUpdateOneRequiredWithoutAsanaActivitiesNestedInput
  }

  export type AsanaActivityUncheckedUpdateWithoutUserInput = {
    postureId?: StringFieldUpdateOperationsInput | string
    postureName?: StringFieldUpdateOperationsInput | string
    sort_english_name?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    sensations?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsanaActivityUncheckedUpdateManyWithoutUserInput = {
    postureId?: StringFieldUpdateOperationsInput | string
    postureName?: StringFieldUpdateOperationsInput | string
    sort_english_name?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    sensations?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeriesActivityUpdateWithoutUserInput = {
    seriesId?: StringFieldUpdateOperationsInput | string
    seriesName?: StringFieldUpdateOperationsInput | string
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeriesActivityUncheckedUpdateWithoutUserInput = {
    seriesId?: StringFieldUpdateOperationsInput | string
    seriesName?: StringFieldUpdateOperationsInput | string
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeriesActivityUncheckedUpdateManyWithoutUserInput = {
    seriesId?: StringFieldUpdateOperationsInput | string
    seriesName?: StringFieldUpdateOperationsInput | string
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SequenceActivityUpdateWithoutUserInput = {
    sequenceId?: StringFieldUpdateOperationsInput | string
    sequenceName?: StringFieldUpdateOperationsInput | string
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SequenceActivityUncheckedUpdateWithoutUserInput = {
    sequenceId?: StringFieldUpdateOperationsInput | string
    sequenceName?: StringFieldUpdateOperationsInput | string
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SequenceActivityUncheckedUpdateManyWithoutUserInput = {
    sequenceId?: StringFieldUpdateOperationsInput | string
    sequenceName?: StringFieldUpdateOperationsInput | string
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLoginUpdateWithoutUserInput = {
    loginDate?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLoginUncheckedUpdateWithoutUserInput = {
    loginDate?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLoginUncheckedUpdateManyWithoutUserInput = {
    loginDate?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PoseImageUpdateWithoutUserInput = {
    postureName?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageType?: EnumStorageTypeFieldUpdateOperationsInput | $Enums.StorageType
    localStorageId?: NullableStringFieldUpdateOperationsInput | string | null
    cloudflareId?: NullableStringFieldUpdateOperationsInput | string | null
    isOffline?: BoolFieldUpdateOperationsInput | boolean
    imageType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posture?: AsanaPostureUpdateOneWithoutPoseImagesNestedInput
  }

  export type PoseImageUncheckedUpdateWithoutUserInput = {
    postureId?: NullableStringFieldUpdateOperationsInput | string | null
    postureName?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageType?: EnumStorageTypeFieldUpdateOperationsInput | $Enums.StorageType
    localStorageId?: NullableStringFieldUpdateOperationsInput | string | null
    cloudflareId?: NullableStringFieldUpdateOperationsInput | string | null
    isOffline?: BoolFieldUpdateOperationsInput | boolean
    imageType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PoseImageUncheckedUpdateManyWithoutUserInput = {
    postureId?: NullableStringFieldUpdateOperationsInput | string | null
    postureName?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageType?: EnumStorageTypeFieldUpdateOperationsInput | $Enums.StorageType
    localStorageId?: NullableStringFieldUpdateOperationsInput | string | null
    cloudflareId?: NullableStringFieldUpdateOperationsInput | string | null
    isOffline?: BoolFieldUpdateOperationsInput | boolean
    imageType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GlossaryTermUpdateWithoutUserInput = {
    term?: StringFieldUpdateOperationsInput | string
    meaning?: StringFieldUpdateOperationsInput | string
    whyMatters?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sanskrit?: NullableStringFieldUpdateOperationsInput | string | null
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    source?:
      | EnumGlossarySourceFieldUpdateOperationsInput
      | $Enums.GlossarySource
    readOnly?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GlossaryTermUncheckedUpdateWithoutUserInput = {
    term?: StringFieldUpdateOperationsInput | string
    meaning?: StringFieldUpdateOperationsInput | string
    whyMatters?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sanskrit?: NullableStringFieldUpdateOperationsInput | string | null
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    source?:
      | EnumGlossarySourceFieldUpdateOperationsInput
      | $Enums.GlossarySource
    readOnly?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GlossaryTermUncheckedUpdateManyWithoutUserInput = {
    term?: StringFieldUpdateOperationsInput | string
    meaning?: StringFieldUpdateOperationsInput | string
    whyMatters?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sanskrit?: NullableStringFieldUpdateOperationsInput | string | null
    pronunciation?: NullableStringFieldUpdateOperationsInput | string | null
    source?:
      | EnumGlossarySourceFieldUpdateOperationsInput
      | $Enums.GlossarySource
    readOnly?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReminderUpdateWithoutUserInput = {
    timeOfDay?: StringFieldUpdateOperationsInput | string
    days?: ReminderUpdatedaysInput | string[]
    enabled?: BoolFieldUpdateOperationsInput | boolean
    message?: StringFieldUpdateOperationsInput | string
    lastSent?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailNotificationsEnabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ReminderUncheckedUpdateWithoutUserInput = {
    timeOfDay?: StringFieldUpdateOperationsInput | string
    days?: ReminderUpdatedaysInput | string[]
    enabled?: BoolFieldUpdateOperationsInput | boolean
    message?: StringFieldUpdateOperationsInput | string
    lastSent?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailNotificationsEnabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ReminderUncheckedUpdateManyWithoutUserInput = {
    timeOfDay?: StringFieldUpdateOperationsInput | string
    days?: ReminderUpdatedaysInput | string[]
    enabled?: BoolFieldUpdateOperationsInput | boolean
    message?: StringFieldUpdateOperationsInput | string
    lastSent?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    emailNotificationsEnabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PushSubscriptionUpdateWithoutUserInput = {
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dh?: StringFieldUpdateOperationsInput | string
    auth?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushSubscriptionUncheckedUpdateWithoutUserInput = {
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dh?: StringFieldUpdateOperationsInput | string
    auth?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushSubscriptionUncheckedUpdateManyWithoutUserInput = {
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dh?: StringFieldUpdateOperationsInput | string
    auth?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsanaActivityCreateManyPostureInput = {
    id?: string
    userId: string
    postureName: string
    sort_english_name: string
    duration: number
    datePerformed: Date | string
    notes?: string | null
    sensations?: string | null
    completionStatus: string
    difficulty?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PoseImageCreateManyPostureInput = {
    id?: string
    userId: string
    postureName?: string | null
    url: string
    altText?: string | null
    fileName?: string | null
    fileSize?: number | null
    uploadedAt?: Date | string
    storageType?: $Enums.StorageType
    localStorageId?: string | null
    cloudflareId?: string | null
    isOffline?: boolean
    imageType?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AsanaActivityUpdateWithoutPostureInput = {
    postureName?: StringFieldUpdateOperationsInput | string
    sort_english_name?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    sensations?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserDataUpdateOneRequiredWithoutAsanaActivitiesNestedInput
  }

  export type AsanaActivityUncheckedUpdateWithoutPostureInput = {
    userId?: StringFieldUpdateOperationsInput | string
    postureName?: StringFieldUpdateOperationsInput | string
    sort_english_name?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    sensations?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsanaActivityUncheckedUpdateManyWithoutPostureInput = {
    userId?: StringFieldUpdateOperationsInput | string
    postureName?: StringFieldUpdateOperationsInput | string
    sort_english_name?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    datePerformed?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    sensations?: NullableStringFieldUpdateOperationsInput | string | null
    completionStatus?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PoseImageUpdateWithoutPostureInput = {
    postureName?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageType?: EnumStorageTypeFieldUpdateOperationsInput | $Enums.StorageType
    localStorageId?: NullableStringFieldUpdateOperationsInput | string | null
    cloudflareId?: NullableStringFieldUpdateOperationsInput | string | null
    isOffline?: BoolFieldUpdateOperationsInput | boolean
    imageType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserDataUpdateOneRequiredWithoutPoseImagesNestedInput
  }

  export type PoseImageUncheckedUpdateWithoutPostureInput = {
    userId?: StringFieldUpdateOperationsInput | string
    postureName?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageType?: EnumStorageTypeFieldUpdateOperationsInput | $Enums.StorageType
    localStorageId?: NullableStringFieldUpdateOperationsInput | string | null
    cloudflareId?: NullableStringFieldUpdateOperationsInput | string | null
    isOffline?: BoolFieldUpdateOperationsInput | boolean
    imageType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PoseImageUncheckedUpdateManyWithoutPostureInput = {
    userId?: StringFieldUpdateOperationsInput | string
    postureName?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageType?: EnumStorageTypeFieldUpdateOperationsInput | $Enums.StorageType
    localStorageId?: NullableStringFieldUpdateOperationsInput | string | null
    cloudflareId?: NullableStringFieldUpdateOperationsInput | string | null
    isOffline?: BoolFieldUpdateOperationsInput | boolean
    imageType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  /**
   * Aliases for legacy arg types
   */
  /**
   * @deprecated Use UserDataCountOutputTypeDefaultArgs instead
   */
  export type UserDataCountOutputTypeArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = UserDataCountOutputTypeDefaultArgs<ExtArgs>
  /**
   * @deprecated Use AsanaPostureCountOutputTypeDefaultArgs instead
   */
  export type AsanaPostureCountOutputTypeArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = AsanaPostureCountOutputTypeDefaultArgs<ExtArgs>
  /**
   * @deprecated Use UserDataDefaultArgs instead
   */
  export type UserDataArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = UserDataDefaultArgs<ExtArgs>
  /**
   * @deprecated Use ReminderDefaultArgs instead
   */
  export type ReminderArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = ReminderDefaultArgs<ExtArgs>
  /**
   * @deprecated Use PushSubscriptionDefaultArgs instead
   */
  export type PushSubscriptionArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = PushSubscriptionDefaultArgs<ExtArgs>
  /**
   * @deprecated Use ProviderAccountDefaultArgs instead
   */
  export type ProviderAccountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = ProviderAccountDefaultArgs<ExtArgs>
  /**
   * @deprecated Use AsanaPostureDefaultArgs instead
   */
  export type AsanaPostureArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = AsanaPostureDefaultArgs<ExtArgs>
  /**
   * @deprecated Use AsanaSeriesDefaultArgs instead
   */
  export type AsanaSeriesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = AsanaSeriesDefaultArgs<ExtArgs>
  /**
   * @deprecated Use AsanaSequenceDefaultArgs instead
   */
  export type AsanaSequenceArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = AsanaSequenceDefaultArgs<ExtArgs>
  /**
   * @deprecated Use AsanaActivityDefaultArgs instead
   */
  export type AsanaActivityArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = AsanaActivityDefaultArgs<ExtArgs>
  /**
   * @deprecated Use SeriesActivityDefaultArgs instead
   */
  export type SeriesActivityArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = SeriesActivityDefaultArgs<ExtArgs>
  /**
   * @deprecated Use SequenceActivityDefaultArgs instead
   */
  export type SequenceActivityArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = SequenceActivityDefaultArgs<ExtArgs>
  /**
   * @deprecated Use UserLoginDefaultArgs instead
   */
  export type UserLoginArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = UserLoginDefaultArgs<ExtArgs>
  /**
   * @deprecated Use PoseImageDefaultArgs instead
   */
  export type PoseImageArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = PoseImageDefaultArgs<ExtArgs>
  /**
   * @deprecated Use GlossaryTermDefaultArgs instead
   */
  export type GlossaryTermArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = GlossaryTermDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
