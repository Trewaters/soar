
/**
 * Client
**/

import * as runtime from './runtime/library.js';
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
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model VerificationToken
 * 
 */
export type VerificationToken = $Result.DefaultSelection<Prisma.$VerificationTokenPayload>
/**
 * Model Authenticator
 * 
 */
export type Authenticator = $Result.DefaultSelection<Prisma.$AuthenticatorPayload>
/**
 * Model Practitioner
 * 
 */
export type Practitioner = $Result.DefaultSelection<Prisma.$PractitionerPayload>
/**
 * Model Series
 * 
 */
export type Series = $Result.DefaultSelection<Prisma.$SeriesPayload>
/**
 * Model FlowSeries
 * 
 */
export type FlowSeries = $Result.DefaultSelection<Prisma.$FlowSeriesPayload>
/**
 * Model Sequence
 * 
 */
export type Sequence = $Result.DefaultSelection<Prisma.$SequencePayload>
/**
 * Model SequencesSeries
 * 
 */
export type SequencesSeries = $Result.DefaultSelection<Prisma.$SequencesSeriesPayload>
/**
 * Model Posture
 * 
 */
export type Posture = $Result.DefaultSelection<Prisma.$PosturePayload>
/**
 * Model SanskritName
 * 
 */
export type SanskritName = $Result.DefaultSelection<Prisma.$SanskritNamePayload>
/**
 * Model Translation
 * 
 */
export type Translation = $Result.DefaultSelection<Prisma.$TranslationPayload>

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
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
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

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

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
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P]): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number }): $Utils.JsPromise<R>

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
  $runCommandRaw(command: Prisma.InputJsonObject): Prisma.PrismaPromise<Prisma.JsonObject>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.userData`: Exposes CRUD operations for the **UserData** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserData
    * const userData = await prisma.userData.findMany()
    * ```
    */
  get userData(): Prisma.UserDataDelegate<ExtArgs>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs>;

  /**
   * `prisma.verificationToken`: Exposes CRUD operations for the **VerificationToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VerificationTokens
    * const verificationTokens = await prisma.verificationToken.findMany()
    * ```
    */
  get verificationToken(): Prisma.VerificationTokenDelegate<ExtArgs>;

  /**
   * `prisma.authenticator`: Exposes CRUD operations for the **Authenticator** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Authenticators
    * const authenticators = await prisma.authenticator.findMany()
    * ```
    */
  get authenticator(): Prisma.AuthenticatorDelegate<ExtArgs>;

  /**
   * `prisma.practitioner`: Exposes CRUD operations for the **Practitioner** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Practitioners
    * const practitioners = await prisma.practitioner.findMany()
    * ```
    */
  get practitioner(): Prisma.PractitionerDelegate<ExtArgs>;

  /**
   * `prisma.series`: Exposes CRUD operations for the **Series** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Series
    * const series = await prisma.series.findMany()
    * ```
    */
  get series(): Prisma.SeriesDelegate<ExtArgs>;

  /**
   * `prisma.flowSeries`: Exposes CRUD operations for the **FlowSeries** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FlowSeries
    * const flowSeries = await prisma.flowSeries.findMany()
    * ```
    */
  get flowSeries(): Prisma.FlowSeriesDelegate<ExtArgs>;

  /**
   * `prisma.sequence`: Exposes CRUD operations for the **Sequence** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sequences
    * const sequences = await prisma.sequence.findMany()
    * ```
    */
  get sequence(): Prisma.SequenceDelegate<ExtArgs>;

  /**
   * `prisma.sequencesSeries`: Exposes CRUD operations for the **SequencesSeries** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SequencesSeries
    * const sequencesSeries = await prisma.sequencesSeries.findMany()
    * ```
    */
  get sequencesSeries(): Prisma.SequencesSeriesDelegate<ExtArgs>;

  /**
   * `prisma.posture`: Exposes CRUD operations for the **Posture** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Postures
    * const postures = await prisma.posture.findMany()
    * ```
    */
  get posture(): Prisma.PostureDelegate<ExtArgs>;

  /**
   * `prisma.sanskritName`: Exposes CRUD operations for the **SanskritName** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SanskritNames
    * const sanskritNames = await prisma.sanskritName.findMany()
    * ```
    */
  get sanskritName(): Prisma.SanskritNameDelegate<ExtArgs>;

  /**
   * `prisma.translation`: Exposes CRUD operations for the **Translation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Translations
    * const translations = await prisma.translation.findMany()
    * ```
    */
  get translation(): Prisma.TranslationDelegate<ExtArgs>;
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
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

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
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray | { toJSON(): unknown }

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
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

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
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
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
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
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

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
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
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

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

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
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
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
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
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    UserData: 'UserData',
    Account: 'Account',
    Session: 'Session',
    VerificationToken: 'VerificationToken',
    Authenticator: 'Authenticator',
    Practitioner: 'Practitioner',
    Series: 'Series',
    FlowSeries: 'FlowSeries',
    Sequence: 'Sequence',
    SequencesSeries: 'SequencesSeries',
    Posture: 'Posture',
    SanskritName: 'SanskritName',
    Translation: 'Translation'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "userData" | "account" | "session" | "verificationToken" | "authenticator" | "practitioner" | "series" | "flowSeries" | "sequence" | "sequencesSeries" | "posture" | "sanskritName" | "translation"
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
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.AccountFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.AccountAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.SessionFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.SessionAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      VerificationToken: {
        payload: Prisma.$VerificationTokenPayload<ExtArgs>
        fields: Prisma.VerificationTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findFirst: {
            args: Prisma.VerificationTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findMany: {
            args: Prisma.VerificationTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          create: {
            args: Prisma.VerificationTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          createMany: {
            args: Prisma.VerificationTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.VerificationTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          update: {
            args: Prisma.VerificationTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          deleteMany: {
            args: Prisma.VerificationTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.VerificationTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          aggregate: {
            args: Prisma.VerificationTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerificationToken>
          }
          groupBy: {
            args: Prisma.VerificationTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.VerificationTokenFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.VerificationTokenAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.VerificationTokenCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenCountAggregateOutputType> | number
          }
        }
      }
      Authenticator: {
        payload: Prisma.$AuthenticatorPayload<ExtArgs>
        fields: Prisma.AuthenticatorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuthenticatorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuthenticatorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>
          }
          findFirst: {
            args: Prisma.AuthenticatorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuthenticatorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>
          }
          findMany: {
            args: Prisma.AuthenticatorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>[]
          }
          create: {
            args: Prisma.AuthenticatorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>
          }
          createMany: {
            args: Prisma.AuthenticatorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AuthenticatorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>
          }
          update: {
            args: Prisma.AuthenticatorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>
          }
          deleteMany: {
            args: Prisma.AuthenticatorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuthenticatorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AuthenticatorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>
          }
          aggregate: {
            args: Prisma.AuthenticatorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuthenticator>
          }
          groupBy: {
            args: Prisma.AuthenticatorGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuthenticatorGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.AuthenticatorFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.AuthenticatorAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.AuthenticatorCountArgs<ExtArgs>
            result: $Utils.Optional<AuthenticatorCountAggregateOutputType> | number
          }
        }
      }
      Practitioner: {
        payload: Prisma.$PractitionerPayload<ExtArgs>
        fields: Prisma.PractitionerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PractitionerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PractitionerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload>
          }
          findFirst: {
            args: Prisma.PractitionerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PractitionerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload>
          }
          findMany: {
            args: Prisma.PractitionerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload>[]
          }
          create: {
            args: Prisma.PractitionerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload>
          }
          createMany: {
            args: Prisma.PractitionerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PractitionerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload>
          }
          update: {
            args: Prisma.PractitionerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload>
          }
          deleteMany: {
            args: Prisma.PractitionerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PractitionerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PractitionerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload>
          }
          aggregate: {
            args: Prisma.PractitionerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePractitioner>
          }
          groupBy: {
            args: Prisma.PractitionerGroupByArgs<ExtArgs>
            result: $Utils.Optional<PractitionerGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PractitionerFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PractitionerAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PractitionerCountArgs<ExtArgs>
            result: $Utils.Optional<PractitionerCountAggregateOutputType> | number
          }
        }
      }
      Series: {
        payload: Prisma.$SeriesPayload<ExtArgs>
        fields: Prisma.SeriesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SeriesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SeriesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload>
          }
          findFirst: {
            args: Prisma.SeriesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SeriesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload>
          }
          findMany: {
            args: Prisma.SeriesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload>[]
          }
          create: {
            args: Prisma.SeriesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload>
          }
          createMany: {
            args: Prisma.SeriesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SeriesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload>
          }
          update: {
            args: Prisma.SeriesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload>
          }
          deleteMany: {
            args: Prisma.SeriesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SeriesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SeriesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload>
          }
          aggregate: {
            args: Prisma.SeriesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSeries>
          }
          groupBy: {
            args: Prisma.SeriesGroupByArgs<ExtArgs>
            result: $Utils.Optional<SeriesGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.SeriesFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.SeriesAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.SeriesCountArgs<ExtArgs>
            result: $Utils.Optional<SeriesCountAggregateOutputType> | number
          }
        }
      }
      FlowSeries: {
        payload: Prisma.$FlowSeriesPayload<ExtArgs>
        fields: Prisma.FlowSeriesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FlowSeriesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowSeriesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FlowSeriesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowSeriesPayload>
          }
          findFirst: {
            args: Prisma.FlowSeriesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowSeriesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FlowSeriesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowSeriesPayload>
          }
          findMany: {
            args: Prisma.FlowSeriesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowSeriesPayload>[]
          }
          create: {
            args: Prisma.FlowSeriesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowSeriesPayload>
          }
          createMany: {
            args: Prisma.FlowSeriesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.FlowSeriesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowSeriesPayload>
          }
          update: {
            args: Prisma.FlowSeriesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowSeriesPayload>
          }
          deleteMany: {
            args: Prisma.FlowSeriesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FlowSeriesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FlowSeriesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowSeriesPayload>
          }
          aggregate: {
            args: Prisma.FlowSeriesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFlowSeries>
          }
          groupBy: {
            args: Prisma.FlowSeriesGroupByArgs<ExtArgs>
            result: $Utils.Optional<FlowSeriesGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.FlowSeriesFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.FlowSeriesAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.FlowSeriesCountArgs<ExtArgs>
            result: $Utils.Optional<FlowSeriesCountAggregateOutputType> | number
          }
        }
      }
      Sequence: {
        payload: Prisma.$SequencePayload<ExtArgs>
        fields: Prisma.SequenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SequenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SequenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequencePayload>
          }
          findFirst: {
            args: Prisma.SequenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SequenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequencePayload>
          }
          findMany: {
            args: Prisma.SequenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequencePayload>[]
          }
          create: {
            args: Prisma.SequenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequencePayload>
          }
          createMany: {
            args: Prisma.SequenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SequenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequencePayload>
          }
          update: {
            args: Prisma.SequenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequencePayload>
          }
          deleteMany: {
            args: Prisma.SequenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SequenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SequenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequencePayload>
          }
          aggregate: {
            args: Prisma.SequenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSequence>
          }
          groupBy: {
            args: Prisma.SequenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<SequenceGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.SequenceFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.SequenceAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.SequenceCountArgs<ExtArgs>
            result: $Utils.Optional<SequenceCountAggregateOutputType> | number
          }
        }
      }
      SequencesSeries: {
        payload: Prisma.$SequencesSeriesPayload<ExtArgs>
        fields: Prisma.SequencesSeriesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SequencesSeriesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequencesSeriesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SequencesSeriesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequencesSeriesPayload>
          }
          findFirst: {
            args: Prisma.SequencesSeriesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequencesSeriesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SequencesSeriesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequencesSeriesPayload>
          }
          findMany: {
            args: Prisma.SequencesSeriesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequencesSeriesPayload>[]
          }
          create: {
            args: Prisma.SequencesSeriesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequencesSeriesPayload>
          }
          createMany: {
            args: Prisma.SequencesSeriesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SequencesSeriesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequencesSeriesPayload>
          }
          update: {
            args: Prisma.SequencesSeriesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequencesSeriesPayload>
          }
          deleteMany: {
            args: Prisma.SequencesSeriesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SequencesSeriesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SequencesSeriesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SequencesSeriesPayload>
          }
          aggregate: {
            args: Prisma.SequencesSeriesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSequencesSeries>
          }
          groupBy: {
            args: Prisma.SequencesSeriesGroupByArgs<ExtArgs>
            result: $Utils.Optional<SequencesSeriesGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.SequencesSeriesFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.SequencesSeriesAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.SequencesSeriesCountArgs<ExtArgs>
            result: $Utils.Optional<SequencesSeriesCountAggregateOutputType> | number
          }
        }
      }
      Posture: {
        payload: Prisma.$PosturePayload<ExtArgs>
        fields: Prisma.PostureFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PostureFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PosturePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PostureFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PosturePayload>
          }
          findFirst: {
            args: Prisma.PostureFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PosturePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PostureFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PosturePayload>
          }
          findMany: {
            args: Prisma.PostureFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PosturePayload>[]
          }
          create: {
            args: Prisma.PostureCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PosturePayload>
          }
          createMany: {
            args: Prisma.PostureCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PostureDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PosturePayload>
          }
          update: {
            args: Prisma.PostureUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PosturePayload>
          }
          deleteMany: {
            args: Prisma.PostureDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PostureUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PostureUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PosturePayload>
          }
          aggregate: {
            args: Prisma.PostureAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePosture>
          }
          groupBy: {
            args: Prisma.PostureGroupByArgs<ExtArgs>
            result: $Utils.Optional<PostureGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PostureFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PostureAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PostureCountArgs<ExtArgs>
            result: $Utils.Optional<PostureCountAggregateOutputType> | number
          }
        }
      }
      SanskritName: {
        payload: Prisma.$SanskritNamePayload<ExtArgs>
        fields: Prisma.SanskritNameFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SanskritNameFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SanskritNamePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SanskritNameFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SanskritNamePayload>
          }
          findFirst: {
            args: Prisma.SanskritNameFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SanskritNamePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SanskritNameFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SanskritNamePayload>
          }
          findMany: {
            args: Prisma.SanskritNameFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SanskritNamePayload>[]
          }
          create: {
            args: Prisma.SanskritNameCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SanskritNamePayload>
          }
          createMany: {
            args: Prisma.SanskritNameCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SanskritNameDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SanskritNamePayload>
          }
          update: {
            args: Prisma.SanskritNameUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SanskritNamePayload>
          }
          deleteMany: {
            args: Prisma.SanskritNameDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SanskritNameUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SanskritNameUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SanskritNamePayload>
          }
          aggregate: {
            args: Prisma.SanskritNameAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSanskritName>
          }
          groupBy: {
            args: Prisma.SanskritNameGroupByArgs<ExtArgs>
            result: $Utils.Optional<SanskritNameGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.SanskritNameFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.SanskritNameAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.SanskritNameCountArgs<ExtArgs>
            result: $Utils.Optional<SanskritNameCountAggregateOutputType> | number
          }
        }
      }
      Translation: {
        payload: Prisma.$TranslationPayload<ExtArgs>
        fields: Prisma.TranslationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TranslationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TranslationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload>
          }
          findFirst: {
            args: Prisma.TranslationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TranslationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload>
          }
          findMany: {
            args: Prisma.TranslationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload>[]
          }
          create: {
            args: Prisma.TranslationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload>
          }
          createMany: {
            args: Prisma.TranslationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TranslationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload>
          }
          update: {
            args: Prisma.TranslationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload>
          }
          deleteMany: {
            args: Prisma.TranslationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TranslationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TranslationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslationPayload>
          }
          aggregate: {
            args: Prisma.TranslationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTranslation>
          }
          groupBy: {
            args: Prisma.TranslationGroupByArgs<ExtArgs>
            result: $Utils.Optional<TranslationGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.TranslationFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.TranslationAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.TranslationCountArgs<ExtArgs>
            result: $Utils.Optional<TranslationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $runCommandRaw: {
          args: Prisma.InputJsonObject,
          result: Prisma.JsonObject
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
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

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
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
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

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
    accounts: number
    sessions: number
    Authenticator: number
    Practitioner: number
  }

  export type UserDataCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | UserDataCountOutputTypeCountAccountsArgs
    sessions?: boolean | UserDataCountOutputTypeCountSessionsArgs
    Authenticator?: boolean | UserDataCountOutputTypeCountAuthenticatorArgs
    Practitioner?: boolean | UserDataCountOutputTypeCountPractitionerArgs
  }

  // Custom InputTypes
  /**
   * UserDataCountOutputType without action
   */
  export type UserDataCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserDataCountOutputType
     */
    select?: UserDataCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserDataCountOutputType without action
   */
  export type UserDataCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserDataCountOutputType without action
   */
  export type UserDataCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserDataCountOutputType without action
   */
  export type UserDataCountOutputTypeCountAuthenticatorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthenticatorWhereInput
  }

  /**
   * UserDataCountOutputType without action
   */
  export type UserDataCountOutputTypeCountPractitionerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PractitionerWhereInput
  }


  /**
   * Count Type SequenceCountOutputType
   */

  export type SequenceCountOutputType = {
    sequencesSeries: number
  }

  export type SequenceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sequencesSeries?: boolean | SequenceCountOutputTypeCountSequencesSeriesArgs
  }

  // Custom InputTypes
  /**
   * SequenceCountOutputType without action
   */
  export type SequenceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SequenceCountOutputType
     */
    select?: SequenceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SequenceCountOutputType without action
   */
  export type SequenceCountOutputTypeCountSequencesSeriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SequencesSeriesWhereInput
  }


  /**
   * Count Type PostureCountOutputType
   */

  export type PostureCountOutputType = {
    sanskrit_names: number
  }

  export type PostureCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sanskrit_names?: boolean | PostureCountOutputTypeCountSanskrit_namesArgs
  }

  // Custom InputTypes
  /**
   * PostureCountOutputType without action
   */
  export type PostureCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostureCountOutputType
     */
    select?: PostureCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PostureCountOutputType without action
   */
  export type PostureCountOutputTypeCountSanskrit_namesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SanskritNameWhereInput
  }


  /**
   * Count Type SanskritNameCountOutputType
   */

  export type SanskritNameCountOutputType = {
    translation: number
  }

  export type SanskritNameCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    translation?: boolean | SanskritNameCountOutputTypeCountTranslationArgs
  }

  // Custom InputTypes
  /**
   * SanskritNameCountOutputType without action
   */
  export type SanskritNameCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SanskritNameCountOutputType
     */
    select?: SanskritNameCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SanskritNameCountOutputType without action
   */
  export type SanskritNameCountOutputTypeCountTranslationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranslationWhereInput
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
    _all?: true
  }

  export type UserDataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserData to aggregate.
     */
    where?: UserDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserData to fetch.
     */
    orderBy?: UserDataOrderByWithRelationInput | UserDataOrderByWithRelationInput[]
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




  export type UserDataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserDataWhereInput
    orderBy?: UserDataOrderByWithAggregationInput | UserDataOrderByWithAggregationInput[]
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
    _count: UserDataCountAggregateOutputType | null
    _min: UserDataMinAggregateOutputType | null
    _max: UserDataMaxAggregateOutputType | null
  }

  type GetUserDataGroupByPayload<T extends UserDataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserDataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserDataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserDataGroupByOutputType[P]>
            : GetScalarType<T[P], UserDataGroupByOutputType[P]>
        }
      >
    >


  export type UserDataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
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
    accounts?: boolean | UserData$accountsArgs<ExtArgs>
    sessions?: boolean | UserData$sessionsArgs<ExtArgs>
    Authenticator?: boolean | UserData$AuthenticatorArgs<ExtArgs>
    Practitioner?: boolean | UserData$PractitionerArgs<ExtArgs>
    _count?: boolean | UserDataCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userData"]>


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
  }

  export type UserDataInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | UserData$accountsArgs<ExtArgs>
    sessions?: boolean | UserData$sessionsArgs<ExtArgs>
    Authenticator?: boolean | UserData$AuthenticatorArgs<ExtArgs>
    Practitioner?: boolean | UserData$PractitionerArgs<ExtArgs>
    _count?: boolean | UserDataCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserDataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserData"
    objects: {
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      Authenticator: Prisma.$AuthenticatorPayload<ExtArgs>[]
      Practitioner: Prisma.$PractitionerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
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
    }, ExtArgs["result"]["userData"]>
    composites: {}
  }

  type UserDataGetPayload<S extends boolean | null | undefined | UserDataDefaultArgs> = $Result.GetResult<Prisma.$UserDataPayload, S>

  type UserDataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserDataFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserDataCountAggregateInputType | true
    }

  export interface UserDataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserData'], meta: { name: 'UserData' } }
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
    findUnique<T extends UserDataFindUniqueArgs>(args: SelectSubset<T, UserDataFindUniqueArgs<ExtArgs>>): Prisma__UserDataClient<$Result.GetResult<Prisma.$UserDataPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

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
    findUniqueOrThrow<T extends UserDataFindUniqueOrThrowArgs>(args: SelectSubset<T, UserDataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserDataClient<$Result.GetResult<Prisma.$UserDataPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

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
    findFirst<T extends UserDataFindFirstArgs>(args?: SelectSubset<T, UserDataFindFirstArgs<ExtArgs>>): Prisma__UserDataClient<$Result.GetResult<Prisma.$UserDataPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

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
    findFirstOrThrow<T extends UserDataFindFirstOrThrowArgs>(args?: SelectSubset<T, UserDataFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserDataClient<$Result.GetResult<Prisma.$UserDataPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

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
    findMany<T extends UserDataFindManyArgs>(args?: SelectSubset<T, UserDataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserDataPayload<ExtArgs>, T, "findMany">>

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
    create<T extends UserDataCreateArgs>(args: SelectSubset<T, UserDataCreateArgs<ExtArgs>>): Prisma__UserDataClient<$Result.GetResult<Prisma.$UserDataPayload<ExtArgs>, T, "create">, never, ExtArgs>

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
    createMany<T extends UserDataCreateManyArgs>(args?: SelectSubset<T, UserDataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

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
    delete<T extends UserDataDeleteArgs>(args: SelectSubset<T, UserDataDeleteArgs<ExtArgs>>): Prisma__UserDataClient<$Result.GetResult<Prisma.$UserDataPayload<ExtArgs>, T, "delete">, never, ExtArgs>

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
    update<T extends UserDataUpdateArgs>(args: SelectSubset<T, UserDataUpdateArgs<ExtArgs>>): Prisma__UserDataClient<$Result.GetResult<Prisma.$UserDataPayload<ExtArgs>, T, "update">, never, ExtArgs>

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
    deleteMany<T extends UserDataDeleteManyArgs>(args?: SelectSubset<T, UserDataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

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
    updateMany<T extends UserDataUpdateManyArgs>(args: SelectSubset<T, UserDataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

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
    upsert<T extends UserDataUpsertArgs>(args: SelectSubset<T, UserDataUpsertArgs<ExtArgs>>): Prisma__UserDataClient<$Result.GetResult<Prisma.$UserDataPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

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
    aggregateRaw(args?: UserDataAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


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
      args?: Subset<T, UserDataCountArgs>,
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
    aggregate<T extends UserDataAggregateArgs>(args: Subset<T, UserDataAggregateArgs>): Prisma.PrismaPromise<GetUserDataAggregateType<T>>

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
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
        }[OrderFields]
    >(args: SubsetIntersection<T, UserDataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserDataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserData model
   */
  readonly fields: UserDataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserData.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserDataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends UserData$accountsArgs<ExtArgs> = {}>(args?: Subset<T, UserData$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany"> | Null>
    sessions<T extends UserData$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, UserData$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany"> | Null>
    Authenticator<T extends UserData$AuthenticatorArgs<ExtArgs> = {}>(args?: Subset<T, UserData$AuthenticatorArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "findMany"> | Null>
    Practitioner<T extends UserData$PractitionerArgs<ExtArgs> = {}>(args?: Subset<T, UserData$PractitionerArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
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
    readonly id: FieldRef<"UserData", 'String'>
    readonly provider_id: FieldRef<"UserData", 'String'>
    readonly name: FieldRef<"UserData", 'String'>
    readonly email: FieldRef<"UserData", 'String'>
    readonly emailVerified: FieldRef<"UserData", 'DateTime'>
    readonly image: FieldRef<"UserData", 'String'>
    readonly pronouns: FieldRef<"UserData", 'String'>
    readonly profile: FieldRef<"UserData", 'Json'>
    readonly createdAt: FieldRef<"UserData", 'DateTime'>
    readonly updatedAt: FieldRef<"UserData", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserData findUnique
   */
  export type UserDataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
  export type UserDataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
  export type UserDataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
    orderBy?: UserDataOrderByWithRelationInput | UserDataOrderByWithRelationInput[]
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
  export type UserDataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
    orderBy?: UserDataOrderByWithRelationInput | UserDataOrderByWithRelationInput[]
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
  export type UserDataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
    orderBy?: UserDataOrderByWithRelationInput | UserDataOrderByWithRelationInput[]
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
  export type UserDataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
  export type UserDataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserData.
     */
    data: UserDataCreateManyInput | UserDataCreateManyInput[]
  }

  /**
   * UserData update
   */
  export type UserDataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
  export type UserDataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
  export type UserDataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
  export type UserDataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
  export type UserDataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserData to delete
     */
    where?: UserDataWhereInput
  }

  /**
   * UserData findRaw
   */
  export type UserDataFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
  export type UserDataAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * UserData.accounts
   */
  export type UserData$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * UserData.sessions
   */
  export type UserData$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * UserData.Authenticator
   */
  export type UserData$AuthenticatorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    where?: AuthenticatorWhereInput
    orderBy?: AuthenticatorOrderByWithRelationInput | AuthenticatorOrderByWithRelationInput[]
    cursor?: AuthenticatorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuthenticatorScalarFieldEnum | AuthenticatorScalarFieldEnum[]
  }

  /**
   * UserData.Practitioner
   */
  export type UserData$PractitionerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    where?: PractitionerWhereInput
    orderBy?: PractitionerOrderByWithRelationInput | PractitionerOrderByWithRelationInput[]
    cursor?: PractitionerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PractitionerScalarFieldEnum | PractitionerScalarFieldEnum[]
  }

  /**
   * UserData without action
   */
  export type UserDataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountSumAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountMinAggregateOutputType = {
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
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
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
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
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
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    expires_at?: true
  }

  export type AccountSumAggregateInputType = {
    expires_at?: true
  }

  export type AccountMinAggregateInputType = {
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
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
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
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
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
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
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
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
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
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDataDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>


  export type AccountSelectScalar = {
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
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDataDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserDataPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
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
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more Accounts that matches the filter.
     * @param {AccountFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const account = await prisma.account.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: AccountFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Account.
     * @param {AccountAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const account = await prisma.account.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: AccountAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
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
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDataDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDataDefaultArgs<ExtArgs>>): Prisma__UserDataClient<$Result.GetResult<Prisma.$UserDataPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */ 
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly type: FieldRef<"Account", 'String'>
    readonly provider: FieldRef<"Account", 'String'>
    readonly providerAccountId: FieldRef<"Account", 'String'>
    readonly refresh_token: FieldRef<"Account", 'String'>
    readonly access_token: FieldRef<"Account", 'String'>
    readonly expires_at: FieldRef<"Account", 'Int'>
    readonly token_type: FieldRef<"Account", 'String'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly id_token: FieldRef<"Account", 'String'>
    readonly session_state: FieldRef<"Account", 'Json'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
  }

  /**
   * Account findRaw
   */
  export type AccountFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Account aggregateRaw
   */
  export type AccountAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    sessionToken: number
    userId: number
    expires: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    sessionToken: string
    userId: string
    expires: Date
    createdAt: Date
    updatedAt: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDataDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>


  export type SessionSelectScalar = {
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDataDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserDataPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionToken: string
      userId: string
      expires: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more Sessions that matches the filter.
     * @param {SessionFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const session = await prisma.session.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: SessionFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Session.
     * @param {SessionAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const session = await prisma.session.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: SessionAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
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
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDataDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDataDefaultArgs<ExtArgs>>): Prisma__UserDataClient<$Result.GetResult<Prisma.$UserDataPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */ 
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly sessionToken: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly expires: FieldRef<"Session", 'DateTime'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly updatedAt: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
  }

  /**
   * Session findRaw
   */
  export type SessionFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Session aggregateRaw
   */
  export type SessionAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model VerificationToken
   */

  export type AggregateVerificationToken = {
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  export type VerificationTokenMinAggregateOutputType = {
    id: string | null
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenMaxAggregateOutputType = {
    id: string | null
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenCountAggregateOutputType = {
    id: number
    identifier: number
    token: number
    expires: number
    _all: number
  }


  export type VerificationTokenMinAggregateInputType = {
    id?: true
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenMaxAggregateInputType = {
    id?: true
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenCountAggregateInputType = {
    id?: true
    identifier?: true
    token?: true
    expires?: true
    _all?: true
  }

  export type VerificationTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationToken to aggregate.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VerificationTokens
    **/
    _count?: true | VerificationTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type GetVerificationTokenAggregateType<T extends VerificationTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateVerificationToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerificationToken[P]>
      : GetScalarType<T[P], AggregateVerificationToken[P]>
  }




  export type VerificationTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationTokenWhereInput
    orderBy?: VerificationTokenOrderByWithAggregationInput | VerificationTokenOrderByWithAggregationInput[]
    by: VerificationTokenScalarFieldEnum[] | VerificationTokenScalarFieldEnum
    having?: VerificationTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationTokenCountAggregateInputType | true
    _min?: VerificationTokenMinAggregateInputType
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type VerificationTokenGroupByOutputType = {
    id: string
    identifier: string
    token: string
    expires: Date
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  type GetVerificationTokenGroupByPayload<T extends VerificationTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
        }
      >
    >


  export type VerificationTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>


  export type VerificationTokenSelectScalar = {
    id?: boolean
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }


  export type $VerificationTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VerificationToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      identifier: string
      token: string
      expires: Date
    }, ExtArgs["result"]["verificationToken"]>
    composites: {}
  }

  type VerificationTokenGetPayload<S extends boolean | null | undefined | VerificationTokenDefaultArgs> = $Result.GetResult<Prisma.$VerificationTokenPayload, S>

  type VerificationTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<VerificationTokenFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: VerificationTokenCountAggregateInputType | true
    }

  export interface VerificationTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VerificationToken'], meta: { name: 'VerificationToken' } }
    /**
     * Find zero or one VerificationToken that matches the filter.
     * @param {VerificationTokenFindUniqueArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationTokenFindUniqueArgs>(args: SelectSubset<T, VerificationTokenFindUniqueArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one VerificationToken that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {VerificationTokenFindUniqueOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first VerificationToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationTokenFindFirstArgs>(args?: SelectSubset<T, VerificationTokenFindFirstArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first VerificationToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more VerificationTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany()
     * 
     * // Get first 10 VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const verificationTokenWithIdOnly = await prisma.verificationToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VerificationTokenFindManyArgs>(args?: SelectSubset<T, VerificationTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a VerificationToken.
     * @param {VerificationTokenCreateArgs} args - Arguments to create a VerificationToken.
     * @example
     * // Create one VerificationToken
     * const VerificationToken = await prisma.verificationToken.create({
     *   data: {
     *     // ... data to create a VerificationToken
     *   }
     * })
     * 
     */
    create<T extends VerificationTokenCreateArgs>(args: SelectSubset<T, VerificationTokenCreateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many VerificationTokens.
     * @param {VerificationTokenCreateManyArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationTokenCreateManyArgs>(args?: SelectSubset<T, VerificationTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a VerificationToken.
     * @param {VerificationTokenDeleteArgs} args - Arguments to delete one VerificationToken.
     * @example
     * // Delete one VerificationToken
     * const VerificationToken = await prisma.verificationToken.delete({
     *   where: {
     *     // ... filter to delete one VerificationToken
     *   }
     * })
     * 
     */
    delete<T extends VerificationTokenDeleteArgs>(args: SelectSubset<T, VerificationTokenDeleteArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one VerificationToken.
     * @param {VerificationTokenUpdateArgs} args - Arguments to update one VerificationToken.
     * @example
     * // Update one VerificationToken
     * const verificationToken = await prisma.verificationToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationTokenUpdateArgs>(args: SelectSubset<T, VerificationTokenUpdateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more VerificationTokens.
     * @param {VerificationTokenDeleteManyArgs} args - Arguments to filter VerificationTokens to delete.
     * @example
     * // Delete a few VerificationTokens
     * const { count } = await prisma.verificationToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationTokenDeleteManyArgs>(args?: SelectSubset<T, VerificationTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationTokenUpdateManyArgs>(args: SelectSubset<T, VerificationTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one VerificationToken.
     * @param {VerificationTokenUpsertArgs} args - Arguments to update or create a VerificationToken.
     * @example
     * // Update or create a VerificationToken
     * const verificationToken = await prisma.verificationToken.upsert({
     *   create: {
     *     // ... data to create a VerificationToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VerificationToken we want to update
     *   }
     * })
     */
    upsert<T extends VerificationTokenUpsertArgs>(args: SelectSubset<T, VerificationTokenUpsertArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more VerificationTokens that matches the filter.
     * @param {VerificationTokenFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const verificationToken = await prisma.verificationToken.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: VerificationTokenFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a VerificationToken.
     * @param {VerificationTokenAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const verificationToken = await prisma.verificationToken.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: VerificationTokenAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenCountArgs} args - Arguments to filter VerificationTokens to count.
     * @example
     * // Count the number of VerificationTokens
     * const count = await prisma.verificationToken.count({
     *   where: {
     *     // ... the filter for the VerificationTokens we want to count
     *   }
     * })
    **/
    count<T extends VerificationTokenCountArgs>(
      args?: Subset<T, VerificationTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VerificationTokenAggregateArgs>(args: Subset<T, VerificationTokenAggregateArgs>): Prisma.PrismaPromise<GetVerificationTokenAggregateType<T>>

    /**
     * Group by VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenGroupByArgs} args - Group by arguments.
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
      T extends VerificationTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationTokenGroupByArgs['orderBy'] }
        : { orderBy?: VerificationTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
        }[OrderFields]
    >(args: SubsetIntersection<T, VerificationTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VerificationToken model
   */
  readonly fields: VerificationTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VerificationToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VerificationToken model
   */ 
  interface VerificationTokenFieldRefs {
    readonly id: FieldRef<"VerificationToken", 'String'>
    readonly identifier: FieldRef<"VerificationToken", 'String'>
    readonly token: FieldRef<"VerificationToken", 'String'>
    readonly expires: FieldRef<"VerificationToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VerificationToken findUnique
   */
  export type VerificationTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findUniqueOrThrow
   */
  export type VerificationTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findFirst
   */
  export type VerificationTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findFirstOrThrow
   */
  export type VerificationTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findMany
   */
  export type VerificationTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Filter, which VerificationTokens to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken create
   */
  export type VerificationTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * The data needed to create a VerificationToken.
     */
    data: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
  }

  /**
   * VerificationToken createMany
   */
  export type VerificationTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
  }

  /**
   * VerificationToken update
   */
  export type VerificationTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * The data needed to update a VerificationToken.
     */
    data: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
    /**
     * Choose, which VerificationToken to update.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken updateMany
   */
  export type VerificationTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
  }

  /**
   * VerificationToken upsert
   */
  export type VerificationTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * The filter to search for the VerificationToken to update in case it exists.
     */
    where: VerificationTokenWhereUniqueInput
    /**
     * In case the VerificationToken found by the `where` argument doesn't exist, create a new VerificationToken with this data.
     */
    create: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
    /**
     * In case the VerificationToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
  }

  /**
   * VerificationToken delete
   */
  export type VerificationTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Filter which VerificationToken to delete.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken deleteMany
   */
  export type VerificationTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationTokens to delete
     */
    where?: VerificationTokenWhereInput
  }

  /**
   * VerificationToken findRaw
   */
  export type VerificationTokenFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * VerificationToken aggregateRaw
   */
  export type VerificationTokenAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * VerificationToken without action
   */
  export type VerificationTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
  }


  /**
   * Model Authenticator
   */

  export type AggregateAuthenticator = {
    _count: AuthenticatorCountAggregateOutputType | null
    _avg: AuthenticatorAvgAggregateOutputType | null
    _sum: AuthenticatorSumAggregateOutputType | null
    _min: AuthenticatorMinAggregateOutputType | null
    _max: AuthenticatorMaxAggregateOutputType | null
  }

  export type AuthenticatorAvgAggregateOutputType = {
    counter: number | null
  }

  export type AuthenticatorSumAggregateOutputType = {
    counter: number | null
  }

  export type AuthenticatorMinAggregateOutputType = {
    credentialID: string | null
    userId: string | null
    providerAccountId: string | null
    credentialPublicKey: string | null
    counter: number | null
    credentialDeviceType: string | null
    credentialBackedUp: boolean | null
    transports: string | null
  }

  export type AuthenticatorMaxAggregateOutputType = {
    credentialID: string | null
    userId: string | null
    providerAccountId: string | null
    credentialPublicKey: string | null
    counter: number | null
    credentialDeviceType: string | null
    credentialBackedUp: boolean | null
    transports: string | null
  }

  export type AuthenticatorCountAggregateOutputType = {
    credentialID: number
    userId: number
    providerAccountId: number
    credentialPublicKey: number
    counter: number
    credentialDeviceType: number
    credentialBackedUp: number
    transports: number
    _all: number
  }


  export type AuthenticatorAvgAggregateInputType = {
    counter?: true
  }

  export type AuthenticatorSumAggregateInputType = {
    counter?: true
  }

  export type AuthenticatorMinAggregateInputType = {
    credentialID?: true
    userId?: true
    providerAccountId?: true
    credentialPublicKey?: true
    counter?: true
    credentialDeviceType?: true
    credentialBackedUp?: true
    transports?: true
  }

  export type AuthenticatorMaxAggregateInputType = {
    credentialID?: true
    userId?: true
    providerAccountId?: true
    credentialPublicKey?: true
    counter?: true
    credentialDeviceType?: true
    credentialBackedUp?: true
    transports?: true
  }

  export type AuthenticatorCountAggregateInputType = {
    credentialID?: true
    userId?: true
    providerAccountId?: true
    credentialPublicKey?: true
    counter?: true
    credentialDeviceType?: true
    credentialBackedUp?: true
    transports?: true
    _all?: true
  }

  export type AuthenticatorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Authenticator to aggregate.
     */
    where?: AuthenticatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Authenticators to fetch.
     */
    orderBy?: AuthenticatorOrderByWithRelationInput | AuthenticatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuthenticatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Authenticators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Authenticators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Authenticators
    **/
    _count?: true | AuthenticatorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuthenticatorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuthenticatorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuthenticatorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuthenticatorMaxAggregateInputType
  }

  export type GetAuthenticatorAggregateType<T extends AuthenticatorAggregateArgs> = {
        [P in keyof T & keyof AggregateAuthenticator]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuthenticator[P]>
      : GetScalarType<T[P], AggregateAuthenticator[P]>
  }




  export type AuthenticatorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthenticatorWhereInput
    orderBy?: AuthenticatorOrderByWithAggregationInput | AuthenticatorOrderByWithAggregationInput[]
    by: AuthenticatorScalarFieldEnum[] | AuthenticatorScalarFieldEnum
    having?: AuthenticatorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuthenticatorCountAggregateInputType | true
    _avg?: AuthenticatorAvgAggregateInputType
    _sum?: AuthenticatorSumAggregateInputType
    _min?: AuthenticatorMinAggregateInputType
    _max?: AuthenticatorMaxAggregateInputType
  }

  export type AuthenticatorGroupByOutputType = {
    credentialID: string
    userId: string
    providerAccountId: string
    credentialPublicKey: string
    counter: number
    credentialDeviceType: string
    credentialBackedUp: boolean
    transports: string | null
    _count: AuthenticatorCountAggregateOutputType | null
    _avg: AuthenticatorAvgAggregateOutputType | null
    _sum: AuthenticatorSumAggregateOutputType | null
    _min: AuthenticatorMinAggregateOutputType | null
    _max: AuthenticatorMaxAggregateOutputType | null
  }

  type GetAuthenticatorGroupByPayload<T extends AuthenticatorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuthenticatorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuthenticatorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuthenticatorGroupByOutputType[P]>
            : GetScalarType<T[P], AuthenticatorGroupByOutputType[P]>
        }
      >
    >


  export type AuthenticatorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    credentialID?: boolean
    userId?: boolean
    providerAccountId?: boolean
    credentialPublicKey?: boolean
    counter?: boolean
    credentialDeviceType?: boolean
    credentialBackedUp?: boolean
    transports?: boolean
    user?: boolean | UserDataDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authenticator"]>


  export type AuthenticatorSelectScalar = {
    credentialID?: boolean
    userId?: boolean
    providerAccountId?: boolean
    credentialPublicKey?: boolean
    counter?: boolean
    credentialDeviceType?: boolean
    credentialBackedUp?: boolean
    transports?: boolean
  }

  export type AuthenticatorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDataDefaultArgs<ExtArgs>
  }

  export type $AuthenticatorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Authenticator"
    objects: {
      user: Prisma.$UserDataPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      credentialID: string
      userId: string
      providerAccountId: string
      credentialPublicKey: string
      counter: number
      credentialDeviceType: string
      credentialBackedUp: boolean
      transports: string | null
    }, ExtArgs["result"]["authenticator"]>
    composites: {}
  }

  type AuthenticatorGetPayload<S extends boolean | null | undefined | AuthenticatorDefaultArgs> = $Result.GetResult<Prisma.$AuthenticatorPayload, S>

  type AuthenticatorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AuthenticatorFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AuthenticatorCountAggregateInputType | true
    }

  export interface AuthenticatorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Authenticator'], meta: { name: 'Authenticator' } }
    /**
     * Find zero or one Authenticator that matches the filter.
     * @param {AuthenticatorFindUniqueArgs} args - Arguments to find a Authenticator
     * @example
     * // Get one Authenticator
     * const authenticator = await prisma.authenticator.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuthenticatorFindUniqueArgs>(args: SelectSubset<T, AuthenticatorFindUniqueArgs<ExtArgs>>): Prisma__AuthenticatorClient<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Authenticator that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AuthenticatorFindUniqueOrThrowArgs} args - Arguments to find a Authenticator
     * @example
     * // Get one Authenticator
     * const authenticator = await prisma.authenticator.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuthenticatorFindUniqueOrThrowArgs>(args: SelectSubset<T, AuthenticatorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuthenticatorClient<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Authenticator that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticatorFindFirstArgs} args - Arguments to find a Authenticator
     * @example
     * // Get one Authenticator
     * const authenticator = await prisma.authenticator.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuthenticatorFindFirstArgs>(args?: SelectSubset<T, AuthenticatorFindFirstArgs<ExtArgs>>): Prisma__AuthenticatorClient<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Authenticator that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticatorFindFirstOrThrowArgs} args - Arguments to find a Authenticator
     * @example
     * // Get one Authenticator
     * const authenticator = await prisma.authenticator.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuthenticatorFindFirstOrThrowArgs>(args?: SelectSubset<T, AuthenticatorFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuthenticatorClient<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Authenticators that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticatorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Authenticators
     * const authenticators = await prisma.authenticator.findMany()
     * 
     * // Get first 10 Authenticators
     * const authenticators = await prisma.authenticator.findMany({ take: 10 })
     * 
     * // Only select the `credentialID`
     * const authenticatorWithCredentialIDOnly = await prisma.authenticator.findMany({ select: { credentialID: true } })
     * 
     */
    findMany<T extends AuthenticatorFindManyArgs>(args?: SelectSubset<T, AuthenticatorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Authenticator.
     * @param {AuthenticatorCreateArgs} args - Arguments to create a Authenticator.
     * @example
     * // Create one Authenticator
     * const Authenticator = await prisma.authenticator.create({
     *   data: {
     *     // ... data to create a Authenticator
     *   }
     * })
     * 
     */
    create<T extends AuthenticatorCreateArgs>(args: SelectSubset<T, AuthenticatorCreateArgs<ExtArgs>>): Prisma__AuthenticatorClient<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Authenticators.
     * @param {AuthenticatorCreateManyArgs} args - Arguments to create many Authenticators.
     * @example
     * // Create many Authenticators
     * const authenticator = await prisma.authenticator.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuthenticatorCreateManyArgs>(args?: SelectSubset<T, AuthenticatorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Authenticator.
     * @param {AuthenticatorDeleteArgs} args - Arguments to delete one Authenticator.
     * @example
     * // Delete one Authenticator
     * const Authenticator = await prisma.authenticator.delete({
     *   where: {
     *     // ... filter to delete one Authenticator
     *   }
     * })
     * 
     */
    delete<T extends AuthenticatorDeleteArgs>(args: SelectSubset<T, AuthenticatorDeleteArgs<ExtArgs>>): Prisma__AuthenticatorClient<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Authenticator.
     * @param {AuthenticatorUpdateArgs} args - Arguments to update one Authenticator.
     * @example
     * // Update one Authenticator
     * const authenticator = await prisma.authenticator.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuthenticatorUpdateArgs>(args: SelectSubset<T, AuthenticatorUpdateArgs<ExtArgs>>): Prisma__AuthenticatorClient<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Authenticators.
     * @param {AuthenticatorDeleteManyArgs} args - Arguments to filter Authenticators to delete.
     * @example
     * // Delete a few Authenticators
     * const { count } = await prisma.authenticator.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuthenticatorDeleteManyArgs>(args?: SelectSubset<T, AuthenticatorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Authenticators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticatorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Authenticators
     * const authenticator = await prisma.authenticator.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuthenticatorUpdateManyArgs>(args: SelectSubset<T, AuthenticatorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Authenticator.
     * @param {AuthenticatorUpsertArgs} args - Arguments to update or create a Authenticator.
     * @example
     * // Update or create a Authenticator
     * const authenticator = await prisma.authenticator.upsert({
     *   create: {
     *     // ... data to create a Authenticator
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Authenticator we want to update
     *   }
     * })
     */
    upsert<T extends AuthenticatorUpsertArgs>(args: SelectSubset<T, AuthenticatorUpsertArgs<ExtArgs>>): Prisma__AuthenticatorClient<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more Authenticators that matches the filter.
     * @param {AuthenticatorFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const authenticator = await prisma.authenticator.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: AuthenticatorFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Authenticator.
     * @param {AuthenticatorAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const authenticator = await prisma.authenticator.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: AuthenticatorAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Authenticators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticatorCountArgs} args - Arguments to filter Authenticators to count.
     * @example
     * // Count the number of Authenticators
     * const count = await prisma.authenticator.count({
     *   where: {
     *     // ... the filter for the Authenticators we want to count
     *   }
     * })
    **/
    count<T extends AuthenticatorCountArgs>(
      args?: Subset<T, AuthenticatorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuthenticatorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Authenticator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticatorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AuthenticatorAggregateArgs>(args: Subset<T, AuthenticatorAggregateArgs>): Prisma.PrismaPromise<GetAuthenticatorAggregateType<T>>

    /**
     * Group by Authenticator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticatorGroupByArgs} args - Group by arguments.
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
      T extends AuthenticatorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuthenticatorGroupByArgs['orderBy'] }
        : { orderBy?: AuthenticatorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
        }[OrderFields]
    >(args: SubsetIntersection<T, AuthenticatorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthenticatorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Authenticator model
   */
  readonly fields: AuthenticatorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Authenticator.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuthenticatorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDataDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDataDefaultArgs<ExtArgs>>): Prisma__UserDataClient<$Result.GetResult<Prisma.$UserDataPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Authenticator model
   */ 
  interface AuthenticatorFieldRefs {
    readonly credentialID: FieldRef<"Authenticator", 'String'>
    readonly userId: FieldRef<"Authenticator", 'String'>
    readonly providerAccountId: FieldRef<"Authenticator", 'String'>
    readonly credentialPublicKey: FieldRef<"Authenticator", 'String'>
    readonly counter: FieldRef<"Authenticator", 'Int'>
    readonly credentialDeviceType: FieldRef<"Authenticator", 'String'>
    readonly credentialBackedUp: FieldRef<"Authenticator", 'Boolean'>
    readonly transports: FieldRef<"Authenticator", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Authenticator findUnique
   */
  export type AuthenticatorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    /**
     * Filter, which Authenticator to fetch.
     */
    where: AuthenticatorWhereUniqueInput
  }

  /**
   * Authenticator findUniqueOrThrow
   */
  export type AuthenticatorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    /**
     * Filter, which Authenticator to fetch.
     */
    where: AuthenticatorWhereUniqueInput
  }

  /**
   * Authenticator findFirst
   */
  export type AuthenticatorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    /**
     * Filter, which Authenticator to fetch.
     */
    where?: AuthenticatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Authenticators to fetch.
     */
    orderBy?: AuthenticatorOrderByWithRelationInput | AuthenticatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Authenticators.
     */
    cursor?: AuthenticatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Authenticators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Authenticators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Authenticators.
     */
    distinct?: AuthenticatorScalarFieldEnum | AuthenticatorScalarFieldEnum[]
  }

  /**
   * Authenticator findFirstOrThrow
   */
  export type AuthenticatorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    /**
     * Filter, which Authenticator to fetch.
     */
    where?: AuthenticatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Authenticators to fetch.
     */
    orderBy?: AuthenticatorOrderByWithRelationInput | AuthenticatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Authenticators.
     */
    cursor?: AuthenticatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Authenticators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Authenticators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Authenticators.
     */
    distinct?: AuthenticatorScalarFieldEnum | AuthenticatorScalarFieldEnum[]
  }

  /**
   * Authenticator findMany
   */
  export type AuthenticatorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    /**
     * Filter, which Authenticators to fetch.
     */
    where?: AuthenticatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Authenticators to fetch.
     */
    orderBy?: AuthenticatorOrderByWithRelationInput | AuthenticatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Authenticators.
     */
    cursor?: AuthenticatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Authenticators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Authenticators.
     */
    skip?: number
    distinct?: AuthenticatorScalarFieldEnum | AuthenticatorScalarFieldEnum[]
  }

  /**
   * Authenticator create
   */
  export type AuthenticatorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    /**
     * The data needed to create a Authenticator.
     */
    data: XOR<AuthenticatorCreateInput, AuthenticatorUncheckedCreateInput>
  }

  /**
   * Authenticator createMany
   */
  export type AuthenticatorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Authenticators.
     */
    data: AuthenticatorCreateManyInput | AuthenticatorCreateManyInput[]
  }

  /**
   * Authenticator update
   */
  export type AuthenticatorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    /**
     * The data needed to update a Authenticator.
     */
    data: XOR<AuthenticatorUpdateInput, AuthenticatorUncheckedUpdateInput>
    /**
     * Choose, which Authenticator to update.
     */
    where: AuthenticatorWhereUniqueInput
  }

  /**
   * Authenticator updateMany
   */
  export type AuthenticatorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Authenticators.
     */
    data: XOR<AuthenticatorUpdateManyMutationInput, AuthenticatorUncheckedUpdateManyInput>
    /**
     * Filter which Authenticators to update
     */
    where?: AuthenticatorWhereInput
  }

  /**
   * Authenticator upsert
   */
  export type AuthenticatorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    /**
     * The filter to search for the Authenticator to update in case it exists.
     */
    where: AuthenticatorWhereUniqueInput
    /**
     * In case the Authenticator found by the `where` argument doesn't exist, create a new Authenticator with this data.
     */
    create: XOR<AuthenticatorCreateInput, AuthenticatorUncheckedCreateInput>
    /**
     * In case the Authenticator was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuthenticatorUpdateInput, AuthenticatorUncheckedUpdateInput>
  }

  /**
   * Authenticator delete
   */
  export type AuthenticatorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    /**
     * Filter which Authenticator to delete.
     */
    where: AuthenticatorWhereUniqueInput
  }

  /**
   * Authenticator deleteMany
   */
  export type AuthenticatorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Authenticators to delete
     */
    where?: AuthenticatorWhereInput
  }

  /**
   * Authenticator findRaw
   */
  export type AuthenticatorFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Authenticator aggregateRaw
   */
  export type AuthenticatorAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Authenticator without action
   */
  export type AuthenticatorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
  }


  /**
   * Model Practitioner
   */

  export type AggregatePractitioner = {
    _count: PractitionerCountAggregateOutputType | null
    _min: PractitionerMinAggregateOutputType | null
    _max: PractitionerMaxAggregateOutputType | null
  }

  export type PractitionerMinAggregateOutputType = {
    id: string | null
    firstName: string | null
    lastName: string | null
    pronouns: string | null
    emailPublic: string | null
    emailInternal: string | null
    emailAlternate: string | null
    phoneContact: string | null
    bio: string | null
    headline: string | null
    yogaStyle: string | null
    yogaExperience: string | null
    Facebook: string | null
    Google: string | null
    Patreon: string | null
    Twitch: string | null
    Twitter: string | null
    websiteURL: string | null
    blogURL: string | null
    socialURL: string | null
    streamingURL: string | null
    isInstructor: string | null
    isStudent: string | null
    isPrivate: string | null
    calendar: string | null
    timezone: string | null
    location: string | null
    isLocationPublic: string | null
    exportAccountInfo: string | null
    deleteAccountInfo: string | null
    company: string | null
    userId: string | null
  }

  export type PractitionerMaxAggregateOutputType = {
    id: string | null
    firstName: string | null
    lastName: string | null
    pronouns: string | null
    emailPublic: string | null
    emailInternal: string | null
    emailAlternate: string | null
    phoneContact: string | null
    bio: string | null
    headline: string | null
    yogaStyle: string | null
    yogaExperience: string | null
    Facebook: string | null
    Google: string | null
    Patreon: string | null
    Twitch: string | null
    Twitter: string | null
    websiteURL: string | null
    blogURL: string | null
    socialURL: string | null
    streamingURL: string | null
    isInstructor: string | null
    isStudent: string | null
    isPrivate: string | null
    calendar: string | null
    timezone: string | null
    location: string | null
    isLocationPublic: string | null
    exportAccountInfo: string | null
    deleteAccountInfo: string | null
    company: string | null
    userId: string | null
  }

  export type PractitionerCountAggregateOutputType = {
    id: number
    firstName: number
    lastName: number
    pronouns: number
    emailPublic: number
    emailInternal: number
    emailAlternate: number
    phoneContact: number
    bio: number
    headline: number
    yogaStyle: number
    yogaExperience: number
    Facebook: number
    Google: number
    Patreon: number
    Twitch: number
    Twitter: number
    websiteURL: number
    blogURL: number
    socialURL: number
    streamingURL: number
    isInstructor: number
    isStudent: number
    isPrivate: number
    calendar: number
    timezone: number
    location: number
    isLocationPublic: number
    exportAccountInfo: number
    deleteAccountInfo: number
    company: number
    userId: number
    _all: number
  }


  export type PractitionerMinAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    pronouns?: true
    emailPublic?: true
    emailInternal?: true
    emailAlternate?: true
    phoneContact?: true
    bio?: true
    headline?: true
    yogaStyle?: true
    yogaExperience?: true
    Facebook?: true
    Google?: true
    Patreon?: true
    Twitch?: true
    Twitter?: true
    websiteURL?: true
    blogURL?: true
    socialURL?: true
    streamingURL?: true
    isInstructor?: true
    isStudent?: true
    isPrivate?: true
    calendar?: true
    timezone?: true
    location?: true
    isLocationPublic?: true
    exportAccountInfo?: true
    deleteAccountInfo?: true
    company?: true
    userId?: true
  }

  export type PractitionerMaxAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    pronouns?: true
    emailPublic?: true
    emailInternal?: true
    emailAlternate?: true
    phoneContact?: true
    bio?: true
    headline?: true
    yogaStyle?: true
    yogaExperience?: true
    Facebook?: true
    Google?: true
    Patreon?: true
    Twitch?: true
    Twitter?: true
    websiteURL?: true
    blogURL?: true
    socialURL?: true
    streamingURL?: true
    isInstructor?: true
    isStudent?: true
    isPrivate?: true
    calendar?: true
    timezone?: true
    location?: true
    isLocationPublic?: true
    exportAccountInfo?: true
    deleteAccountInfo?: true
    company?: true
    userId?: true
  }

  export type PractitionerCountAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    pronouns?: true
    emailPublic?: true
    emailInternal?: true
    emailAlternate?: true
    phoneContact?: true
    bio?: true
    headline?: true
    yogaStyle?: true
    yogaExperience?: true
    Facebook?: true
    Google?: true
    Patreon?: true
    Twitch?: true
    Twitter?: true
    websiteURL?: true
    blogURL?: true
    socialURL?: true
    streamingURL?: true
    isInstructor?: true
    isStudent?: true
    isPrivate?: true
    calendar?: true
    timezone?: true
    location?: true
    isLocationPublic?: true
    exportAccountInfo?: true
    deleteAccountInfo?: true
    company?: true
    userId?: true
    _all?: true
  }

  export type PractitionerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Practitioner to aggregate.
     */
    where?: PractitionerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Practitioners to fetch.
     */
    orderBy?: PractitionerOrderByWithRelationInput | PractitionerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PractitionerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Practitioners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Practitioners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Practitioners
    **/
    _count?: true | PractitionerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PractitionerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PractitionerMaxAggregateInputType
  }

  export type GetPractitionerAggregateType<T extends PractitionerAggregateArgs> = {
        [P in keyof T & keyof AggregatePractitioner]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePractitioner[P]>
      : GetScalarType<T[P], AggregatePractitioner[P]>
  }




  export type PractitionerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PractitionerWhereInput
    orderBy?: PractitionerOrderByWithAggregationInput | PractitionerOrderByWithAggregationInput[]
    by: PractitionerScalarFieldEnum[] | PractitionerScalarFieldEnum
    having?: PractitionerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PractitionerCountAggregateInputType | true
    _min?: PractitionerMinAggregateInputType
    _max?: PractitionerMaxAggregateInputType
  }

  export type PractitionerGroupByOutputType = {
    id: string
    firstName: string
    lastName: string
    pronouns: string
    emailPublic: string
    emailInternal: string
    emailAlternate: string
    phoneContact: string
    bio: string
    headline: string
    yogaStyle: string
    yogaExperience: string
    Facebook: string
    Google: string
    Patreon: string
    Twitch: string
    Twitter: string
    websiteURL: string
    blogURL: string
    socialURL: string
    streamingURL: string
    isInstructor: string
    isStudent: string
    isPrivate: string
    calendar: string
    timezone: string
    location: string
    isLocationPublic: string
    exportAccountInfo: string
    deleteAccountInfo: string
    company: string
    userId: string
    _count: PractitionerCountAggregateOutputType | null
    _min: PractitionerMinAggregateOutputType | null
    _max: PractitionerMaxAggregateOutputType | null
  }

  type GetPractitionerGroupByPayload<T extends PractitionerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PractitionerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PractitionerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PractitionerGroupByOutputType[P]>
            : GetScalarType<T[P], PractitionerGroupByOutputType[P]>
        }
      >
    >


  export type PractitionerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    pronouns?: boolean
    emailPublic?: boolean
    emailInternal?: boolean
    emailAlternate?: boolean
    phoneContact?: boolean
    bio?: boolean
    headline?: boolean
    yogaStyle?: boolean
    yogaExperience?: boolean
    Facebook?: boolean
    Google?: boolean
    Patreon?: boolean
    Twitch?: boolean
    Twitter?: boolean
    websiteURL?: boolean
    blogURL?: boolean
    socialURL?: boolean
    streamingURL?: boolean
    isInstructor?: boolean
    isStudent?: boolean
    isPrivate?: boolean
    calendar?: boolean
    timezone?: boolean
    location?: boolean
    isLocationPublic?: boolean
    exportAccountInfo?: boolean
    deleteAccountInfo?: boolean
    company?: boolean
    userId?: boolean
    user?: boolean | UserDataDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["practitioner"]>


  export type PractitionerSelectScalar = {
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    pronouns?: boolean
    emailPublic?: boolean
    emailInternal?: boolean
    emailAlternate?: boolean
    phoneContact?: boolean
    bio?: boolean
    headline?: boolean
    yogaStyle?: boolean
    yogaExperience?: boolean
    Facebook?: boolean
    Google?: boolean
    Patreon?: boolean
    Twitch?: boolean
    Twitter?: boolean
    websiteURL?: boolean
    blogURL?: boolean
    socialURL?: boolean
    streamingURL?: boolean
    isInstructor?: boolean
    isStudent?: boolean
    isPrivate?: boolean
    calendar?: boolean
    timezone?: boolean
    location?: boolean
    isLocationPublic?: boolean
    exportAccountInfo?: boolean
    deleteAccountInfo?: boolean
    company?: boolean
    userId?: boolean
  }

  export type PractitionerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDataDefaultArgs<ExtArgs>
  }

  export type $PractitionerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Practitioner"
    objects: {
      user: Prisma.$UserDataPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      firstName: string
      lastName: string
      pronouns: string
      emailPublic: string
      emailInternal: string
      emailAlternate: string
      phoneContact: string
      bio: string
      headline: string
      yogaStyle: string
      yogaExperience: string
      Facebook: string
      Google: string
      Patreon: string
      Twitch: string
      Twitter: string
      websiteURL: string
      blogURL: string
      socialURL: string
      streamingURL: string
      isInstructor: string
      isStudent: string
      isPrivate: string
      calendar: string
      timezone: string
      location: string
      isLocationPublic: string
      exportAccountInfo: string
      deleteAccountInfo: string
      company: string
      userId: string
    }, ExtArgs["result"]["practitioner"]>
    composites: {}
  }

  type PractitionerGetPayload<S extends boolean | null | undefined | PractitionerDefaultArgs> = $Result.GetResult<Prisma.$PractitionerPayload, S>

  type PractitionerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PractitionerFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PractitionerCountAggregateInputType | true
    }

  export interface PractitionerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Practitioner'], meta: { name: 'Practitioner' } }
    /**
     * Find zero or one Practitioner that matches the filter.
     * @param {PractitionerFindUniqueArgs} args - Arguments to find a Practitioner
     * @example
     * // Get one Practitioner
     * const practitioner = await prisma.practitioner.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PractitionerFindUniqueArgs>(args: SelectSubset<T, PractitionerFindUniqueArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Practitioner that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PractitionerFindUniqueOrThrowArgs} args - Arguments to find a Practitioner
     * @example
     * // Get one Practitioner
     * const practitioner = await prisma.practitioner.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PractitionerFindUniqueOrThrowArgs>(args: SelectSubset<T, PractitionerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Practitioner that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerFindFirstArgs} args - Arguments to find a Practitioner
     * @example
     * // Get one Practitioner
     * const practitioner = await prisma.practitioner.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PractitionerFindFirstArgs>(args?: SelectSubset<T, PractitionerFindFirstArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Practitioner that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerFindFirstOrThrowArgs} args - Arguments to find a Practitioner
     * @example
     * // Get one Practitioner
     * const practitioner = await prisma.practitioner.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PractitionerFindFirstOrThrowArgs>(args?: SelectSubset<T, PractitionerFindFirstOrThrowArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Practitioners that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Practitioners
     * const practitioners = await prisma.practitioner.findMany()
     * 
     * // Get first 10 Practitioners
     * const practitioners = await prisma.practitioner.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const practitionerWithIdOnly = await prisma.practitioner.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PractitionerFindManyArgs>(args?: SelectSubset<T, PractitionerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Practitioner.
     * @param {PractitionerCreateArgs} args - Arguments to create a Practitioner.
     * @example
     * // Create one Practitioner
     * const Practitioner = await prisma.practitioner.create({
     *   data: {
     *     // ... data to create a Practitioner
     *   }
     * })
     * 
     */
    create<T extends PractitionerCreateArgs>(args: SelectSubset<T, PractitionerCreateArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Practitioners.
     * @param {PractitionerCreateManyArgs} args - Arguments to create many Practitioners.
     * @example
     * // Create many Practitioners
     * const practitioner = await prisma.practitioner.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PractitionerCreateManyArgs>(args?: SelectSubset<T, PractitionerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Practitioner.
     * @param {PractitionerDeleteArgs} args - Arguments to delete one Practitioner.
     * @example
     * // Delete one Practitioner
     * const Practitioner = await prisma.practitioner.delete({
     *   where: {
     *     // ... filter to delete one Practitioner
     *   }
     * })
     * 
     */
    delete<T extends PractitionerDeleteArgs>(args: SelectSubset<T, PractitionerDeleteArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Practitioner.
     * @param {PractitionerUpdateArgs} args - Arguments to update one Practitioner.
     * @example
     * // Update one Practitioner
     * const practitioner = await prisma.practitioner.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PractitionerUpdateArgs>(args: SelectSubset<T, PractitionerUpdateArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Practitioners.
     * @param {PractitionerDeleteManyArgs} args - Arguments to filter Practitioners to delete.
     * @example
     * // Delete a few Practitioners
     * const { count } = await prisma.practitioner.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PractitionerDeleteManyArgs>(args?: SelectSubset<T, PractitionerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Practitioners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Practitioners
     * const practitioner = await prisma.practitioner.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PractitionerUpdateManyArgs>(args: SelectSubset<T, PractitionerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Practitioner.
     * @param {PractitionerUpsertArgs} args - Arguments to update or create a Practitioner.
     * @example
     * // Update or create a Practitioner
     * const practitioner = await prisma.practitioner.upsert({
     *   create: {
     *     // ... data to create a Practitioner
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Practitioner we want to update
     *   }
     * })
     */
    upsert<T extends PractitionerUpsertArgs>(args: SelectSubset<T, PractitionerUpsertArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more Practitioners that matches the filter.
     * @param {PractitionerFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const practitioner = await prisma.practitioner.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: PractitionerFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Practitioner.
     * @param {PractitionerAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const practitioner = await prisma.practitioner.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PractitionerAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Practitioners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerCountArgs} args - Arguments to filter Practitioners to count.
     * @example
     * // Count the number of Practitioners
     * const count = await prisma.practitioner.count({
     *   where: {
     *     // ... the filter for the Practitioners we want to count
     *   }
     * })
    **/
    count<T extends PractitionerCountArgs>(
      args?: Subset<T, PractitionerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PractitionerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Practitioner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PractitionerAggregateArgs>(args: Subset<T, PractitionerAggregateArgs>): Prisma.PrismaPromise<GetPractitionerAggregateType<T>>

    /**
     * Group by Practitioner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerGroupByArgs} args - Group by arguments.
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
      T extends PractitionerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PractitionerGroupByArgs['orderBy'] }
        : { orderBy?: PractitionerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
        }[OrderFields]
    >(args: SubsetIntersection<T, PractitionerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPractitionerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Practitioner model
   */
  readonly fields: PractitionerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Practitioner.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PractitionerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDataDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDataDefaultArgs<ExtArgs>>): Prisma__UserDataClient<$Result.GetResult<Prisma.$UserDataPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Practitioner model
   */ 
  interface PractitionerFieldRefs {
    readonly id: FieldRef<"Practitioner", 'String'>
    readonly firstName: FieldRef<"Practitioner", 'String'>
    readonly lastName: FieldRef<"Practitioner", 'String'>
    readonly pronouns: FieldRef<"Practitioner", 'String'>
    readonly emailPublic: FieldRef<"Practitioner", 'String'>
    readonly emailInternal: FieldRef<"Practitioner", 'String'>
    readonly emailAlternate: FieldRef<"Practitioner", 'String'>
    readonly phoneContact: FieldRef<"Practitioner", 'String'>
    readonly bio: FieldRef<"Practitioner", 'String'>
    readonly headline: FieldRef<"Practitioner", 'String'>
    readonly yogaStyle: FieldRef<"Practitioner", 'String'>
    readonly yogaExperience: FieldRef<"Practitioner", 'String'>
    readonly Facebook: FieldRef<"Practitioner", 'String'>
    readonly Google: FieldRef<"Practitioner", 'String'>
    readonly Patreon: FieldRef<"Practitioner", 'String'>
    readonly Twitch: FieldRef<"Practitioner", 'String'>
    readonly Twitter: FieldRef<"Practitioner", 'String'>
    readonly websiteURL: FieldRef<"Practitioner", 'String'>
    readonly blogURL: FieldRef<"Practitioner", 'String'>
    readonly socialURL: FieldRef<"Practitioner", 'String'>
    readonly streamingURL: FieldRef<"Practitioner", 'String'>
    readonly isInstructor: FieldRef<"Practitioner", 'String'>
    readonly isStudent: FieldRef<"Practitioner", 'String'>
    readonly isPrivate: FieldRef<"Practitioner", 'String'>
    readonly calendar: FieldRef<"Practitioner", 'String'>
    readonly timezone: FieldRef<"Practitioner", 'String'>
    readonly location: FieldRef<"Practitioner", 'String'>
    readonly isLocationPublic: FieldRef<"Practitioner", 'String'>
    readonly exportAccountInfo: FieldRef<"Practitioner", 'String'>
    readonly deleteAccountInfo: FieldRef<"Practitioner", 'String'>
    readonly company: FieldRef<"Practitioner", 'String'>
    readonly userId: FieldRef<"Practitioner", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Practitioner findUnique
   */
  export type PractitionerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    /**
     * Filter, which Practitioner to fetch.
     */
    where: PractitionerWhereUniqueInput
  }

  /**
   * Practitioner findUniqueOrThrow
   */
  export type PractitionerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    /**
     * Filter, which Practitioner to fetch.
     */
    where: PractitionerWhereUniqueInput
  }

  /**
   * Practitioner findFirst
   */
  export type PractitionerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    /**
     * Filter, which Practitioner to fetch.
     */
    where?: PractitionerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Practitioners to fetch.
     */
    orderBy?: PractitionerOrderByWithRelationInput | PractitionerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Practitioners.
     */
    cursor?: PractitionerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Practitioners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Practitioners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Practitioners.
     */
    distinct?: PractitionerScalarFieldEnum | PractitionerScalarFieldEnum[]
  }

  /**
   * Practitioner findFirstOrThrow
   */
  export type PractitionerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    /**
     * Filter, which Practitioner to fetch.
     */
    where?: PractitionerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Practitioners to fetch.
     */
    orderBy?: PractitionerOrderByWithRelationInput | PractitionerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Practitioners.
     */
    cursor?: PractitionerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Practitioners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Practitioners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Practitioners.
     */
    distinct?: PractitionerScalarFieldEnum | PractitionerScalarFieldEnum[]
  }

  /**
   * Practitioner findMany
   */
  export type PractitionerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    /**
     * Filter, which Practitioners to fetch.
     */
    where?: PractitionerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Practitioners to fetch.
     */
    orderBy?: PractitionerOrderByWithRelationInput | PractitionerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Practitioners.
     */
    cursor?: PractitionerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Practitioners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Practitioners.
     */
    skip?: number
    distinct?: PractitionerScalarFieldEnum | PractitionerScalarFieldEnum[]
  }

  /**
   * Practitioner create
   */
  export type PractitionerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    /**
     * The data needed to create a Practitioner.
     */
    data: XOR<PractitionerCreateInput, PractitionerUncheckedCreateInput>
  }

  /**
   * Practitioner createMany
   */
  export type PractitionerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Practitioners.
     */
    data: PractitionerCreateManyInput | PractitionerCreateManyInput[]
  }

  /**
   * Practitioner update
   */
  export type PractitionerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    /**
     * The data needed to update a Practitioner.
     */
    data: XOR<PractitionerUpdateInput, PractitionerUncheckedUpdateInput>
    /**
     * Choose, which Practitioner to update.
     */
    where: PractitionerWhereUniqueInput
  }

  /**
   * Practitioner updateMany
   */
  export type PractitionerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Practitioners.
     */
    data: XOR<PractitionerUpdateManyMutationInput, PractitionerUncheckedUpdateManyInput>
    /**
     * Filter which Practitioners to update
     */
    where?: PractitionerWhereInput
  }

  /**
   * Practitioner upsert
   */
  export type PractitionerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    /**
     * The filter to search for the Practitioner to update in case it exists.
     */
    where: PractitionerWhereUniqueInput
    /**
     * In case the Practitioner found by the `where` argument doesn't exist, create a new Practitioner with this data.
     */
    create: XOR<PractitionerCreateInput, PractitionerUncheckedCreateInput>
    /**
     * In case the Practitioner was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PractitionerUpdateInput, PractitionerUncheckedUpdateInput>
  }

  /**
   * Practitioner delete
   */
  export type PractitionerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    /**
     * Filter which Practitioner to delete.
     */
    where: PractitionerWhereUniqueInput
  }

  /**
   * Practitioner deleteMany
   */
  export type PractitionerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Practitioners to delete
     */
    where?: PractitionerWhereInput
  }

  /**
   * Practitioner findRaw
   */
  export type PractitionerFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Practitioner aggregateRaw
   */
  export type PractitionerAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Practitioner without action
   */
  export type PractitionerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
  }


  /**
   * Model Series
   */

  export type AggregateSeries = {
    _count: SeriesCountAggregateOutputType | null
    _min: SeriesMinAggregateOutputType | null
    _max: SeriesMaxAggregateOutputType | null
  }

  export type SeriesMinAggregateOutputType = {
    id: string | null
    seriesName: string | null
  }

  export type SeriesMaxAggregateOutputType = {
    id: string | null
    seriesName: string | null
  }

  export type SeriesCountAggregateOutputType = {
    id: number
    seriesName: number
    seriesPostures: number
    _all: number
  }


  export type SeriesMinAggregateInputType = {
    id?: true
    seriesName?: true
  }

  export type SeriesMaxAggregateInputType = {
    id?: true
    seriesName?: true
  }

  export type SeriesCountAggregateInputType = {
    id?: true
    seriesName?: true
    seriesPostures?: true
    _all?: true
  }

  export type SeriesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Series to aggregate.
     */
    where?: SeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Series to fetch.
     */
    orderBy?: SeriesOrderByWithRelationInput | SeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Series from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Series.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Series
    **/
    _count?: true | SeriesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SeriesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SeriesMaxAggregateInputType
  }

  export type GetSeriesAggregateType<T extends SeriesAggregateArgs> = {
        [P in keyof T & keyof AggregateSeries]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSeries[P]>
      : GetScalarType<T[P], AggregateSeries[P]>
  }




  export type SeriesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeriesWhereInput
    orderBy?: SeriesOrderByWithAggregationInput | SeriesOrderByWithAggregationInput[]
    by: SeriesScalarFieldEnum[] | SeriesScalarFieldEnum
    having?: SeriesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SeriesCountAggregateInputType | true
    _min?: SeriesMinAggregateInputType
    _max?: SeriesMaxAggregateInputType
  }

  export type SeriesGroupByOutputType = {
    id: string
    seriesName: string
    seriesPostures: string[]
    _count: SeriesCountAggregateOutputType | null
    _min: SeriesMinAggregateOutputType | null
    _max: SeriesMaxAggregateOutputType | null
  }

  type GetSeriesGroupByPayload<T extends SeriesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SeriesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SeriesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SeriesGroupByOutputType[P]>
            : GetScalarType<T[P], SeriesGroupByOutputType[P]>
        }
      >
    >


  export type SeriesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    seriesName?: boolean
    seriesPostures?: boolean
  }, ExtArgs["result"]["series"]>


  export type SeriesSelectScalar = {
    id?: boolean
    seriesName?: boolean
    seriesPostures?: boolean
  }


  export type $SeriesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Series"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      seriesName: string
      seriesPostures: string[]
    }, ExtArgs["result"]["series"]>
    composites: {}
  }

  type SeriesGetPayload<S extends boolean | null | undefined | SeriesDefaultArgs> = $Result.GetResult<Prisma.$SeriesPayload, S>

  type SeriesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SeriesFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SeriesCountAggregateInputType | true
    }

  export interface SeriesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Series'], meta: { name: 'Series' } }
    /**
     * Find zero or one Series that matches the filter.
     * @param {SeriesFindUniqueArgs} args - Arguments to find a Series
     * @example
     * // Get one Series
     * const series = await prisma.series.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SeriesFindUniqueArgs>(args: SelectSubset<T, SeriesFindUniqueArgs<ExtArgs>>): Prisma__SeriesClient<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Series that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SeriesFindUniqueOrThrowArgs} args - Arguments to find a Series
     * @example
     * // Get one Series
     * const series = await prisma.series.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SeriesFindUniqueOrThrowArgs>(args: SelectSubset<T, SeriesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SeriesClient<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Series that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesFindFirstArgs} args - Arguments to find a Series
     * @example
     * // Get one Series
     * const series = await prisma.series.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SeriesFindFirstArgs>(args?: SelectSubset<T, SeriesFindFirstArgs<ExtArgs>>): Prisma__SeriesClient<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Series that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesFindFirstOrThrowArgs} args - Arguments to find a Series
     * @example
     * // Get one Series
     * const series = await prisma.series.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SeriesFindFirstOrThrowArgs>(args?: SelectSubset<T, SeriesFindFirstOrThrowArgs<ExtArgs>>): Prisma__SeriesClient<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Series that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Series
     * const series = await prisma.series.findMany()
     * 
     * // Get first 10 Series
     * const series = await prisma.series.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const seriesWithIdOnly = await prisma.series.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SeriesFindManyArgs>(args?: SelectSubset<T, SeriesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Series.
     * @param {SeriesCreateArgs} args - Arguments to create a Series.
     * @example
     * // Create one Series
     * const Series = await prisma.series.create({
     *   data: {
     *     // ... data to create a Series
     *   }
     * })
     * 
     */
    create<T extends SeriesCreateArgs>(args: SelectSubset<T, SeriesCreateArgs<ExtArgs>>): Prisma__SeriesClient<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Series.
     * @param {SeriesCreateManyArgs} args - Arguments to create many Series.
     * @example
     * // Create many Series
     * const series = await prisma.series.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SeriesCreateManyArgs>(args?: SelectSubset<T, SeriesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Series.
     * @param {SeriesDeleteArgs} args - Arguments to delete one Series.
     * @example
     * // Delete one Series
     * const Series = await prisma.series.delete({
     *   where: {
     *     // ... filter to delete one Series
     *   }
     * })
     * 
     */
    delete<T extends SeriesDeleteArgs>(args: SelectSubset<T, SeriesDeleteArgs<ExtArgs>>): Prisma__SeriesClient<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Series.
     * @param {SeriesUpdateArgs} args - Arguments to update one Series.
     * @example
     * // Update one Series
     * const series = await prisma.series.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SeriesUpdateArgs>(args: SelectSubset<T, SeriesUpdateArgs<ExtArgs>>): Prisma__SeriesClient<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Series.
     * @param {SeriesDeleteManyArgs} args - Arguments to filter Series to delete.
     * @example
     * // Delete a few Series
     * const { count } = await prisma.series.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SeriesDeleteManyArgs>(args?: SelectSubset<T, SeriesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Series.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Series
     * const series = await prisma.series.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SeriesUpdateManyArgs>(args: SelectSubset<T, SeriesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Series.
     * @param {SeriesUpsertArgs} args - Arguments to update or create a Series.
     * @example
     * // Update or create a Series
     * const series = await prisma.series.upsert({
     *   create: {
     *     // ... data to create a Series
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Series we want to update
     *   }
     * })
     */
    upsert<T extends SeriesUpsertArgs>(args: SelectSubset<T, SeriesUpsertArgs<ExtArgs>>): Prisma__SeriesClient<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more Series that matches the filter.
     * @param {SeriesFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const series = await prisma.series.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: SeriesFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Series.
     * @param {SeriesAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const series = await prisma.series.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: SeriesAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Series.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesCountArgs} args - Arguments to filter Series to count.
     * @example
     * // Count the number of Series
     * const count = await prisma.series.count({
     *   where: {
     *     // ... the filter for the Series we want to count
     *   }
     * })
    **/
    count<T extends SeriesCountArgs>(
      args?: Subset<T, SeriesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SeriesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Series.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SeriesAggregateArgs>(args: Subset<T, SeriesAggregateArgs>): Prisma.PrismaPromise<GetSeriesAggregateType<T>>

    /**
     * Group by Series.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesGroupByArgs} args - Group by arguments.
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
      T extends SeriesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SeriesGroupByArgs['orderBy'] }
        : { orderBy?: SeriesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
        }[OrderFields]
    >(args: SubsetIntersection<T, SeriesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSeriesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Series model
   */
  readonly fields: SeriesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Series.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SeriesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Series model
   */ 
  interface SeriesFieldRefs {
    readonly id: FieldRef<"Series", 'String'>
    readonly seriesName: FieldRef<"Series", 'String'>
    readonly seriesPostures: FieldRef<"Series", 'String[]'>
  }
    

  // Custom InputTypes
  /**
   * Series findUnique
   */
  export type SeriesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * Filter, which Series to fetch.
     */
    where: SeriesWhereUniqueInput
  }

  /**
   * Series findUniqueOrThrow
   */
  export type SeriesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * Filter, which Series to fetch.
     */
    where: SeriesWhereUniqueInput
  }

  /**
   * Series findFirst
   */
  export type SeriesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * Filter, which Series to fetch.
     */
    where?: SeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Series to fetch.
     */
    orderBy?: SeriesOrderByWithRelationInput | SeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Series.
     */
    cursor?: SeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Series from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Series.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Series.
     */
    distinct?: SeriesScalarFieldEnum | SeriesScalarFieldEnum[]
  }

  /**
   * Series findFirstOrThrow
   */
  export type SeriesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * Filter, which Series to fetch.
     */
    where?: SeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Series to fetch.
     */
    orderBy?: SeriesOrderByWithRelationInput | SeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Series.
     */
    cursor?: SeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Series from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Series.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Series.
     */
    distinct?: SeriesScalarFieldEnum | SeriesScalarFieldEnum[]
  }

  /**
   * Series findMany
   */
  export type SeriesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * Filter, which Series to fetch.
     */
    where?: SeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Series to fetch.
     */
    orderBy?: SeriesOrderByWithRelationInput | SeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Series.
     */
    cursor?: SeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Series from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Series.
     */
    skip?: number
    distinct?: SeriesScalarFieldEnum | SeriesScalarFieldEnum[]
  }

  /**
   * Series create
   */
  export type SeriesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * The data needed to create a Series.
     */
    data: XOR<SeriesCreateInput, SeriesUncheckedCreateInput>
  }

  /**
   * Series createMany
   */
  export type SeriesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Series.
     */
    data: SeriesCreateManyInput | SeriesCreateManyInput[]
  }

  /**
   * Series update
   */
  export type SeriesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * The data needed to update a Series.
     */
    data: XOR<SeriesUpdateInput, SeriesUncheckedUpdateInput>
    /**
     * Choose, which Series to update.
     */
    where: SeriesWhereUniqueInput
  }

  /**
   * Series updateMany
   */
  export type SeriesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Series.
     */
    data: XOR<SeriesUpdateManyMutationInput, SeriesUncheckedUpdateManyInput>
    /**
     * Filter which Series to update
     */
    where?: SeriesWhereInput
  }

  /**
   * Series upsert
   */
  export type SeriesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * The filter to search for the Series to update in case it exists.
     */
    where: SeriesWhereUniqueInput
    /**
     * In case the Series found by the `where` argument doesn't exist, create a new Series with this data.
     */
    create: XOR<SeriesCreateInput, SeriesUncheckedCreateInput>
    /**
     * In case the Series was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SeriesUpdateInput, SeriesUncheckedUpdateInput>
  }

  /**
   * Series delete
   */
  export type SeriesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * Filter which Series to delete.
     */
    where: SeriesWhereUniqueInput
  }

  /**
   * Series deleteMany
   */
  export type SeriesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Series to delete
     */
    where?: SeriesWhereInput
  }

  /**
   * Series findRaw
   */
  export type SeriesFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Series aggregateRaw
   */
  export type SeriesAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Series without action
   */
  export type SeriesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
  }


  /**
   * Model FlowSeries
   */

  export type AggregateFlowSeries = {
    _count: FlowSeriesCountAggregateOutputType | null
    _min: FlowSeriesMinAggregateOutputType | null
    _max: FlowSeriesMaxAggregateOutputType | null
  }

  export type FlowSeriesMinAggregateOutputType = {
    id: string | null
    seriesName: string | null
    seriesSet: string | null
  }

  export type FlowSeriesMaxAggregateOutputType = {
    id: string | null
    seriesName: string | null
    seriesSet: string | null
  }

  export type FlowSeriesCountAggregateOutputType = {
    id: number
    seriesName: number
    seriesSet: number
    _all: number
  }


  export type FlowSeriesMinAggregateInputType = {
    id?: true
    seriesName?: true
    seriesSet?: true
  }

  export type FlowSeriesMaxAggregateInputType = {
    id?: true
    seriesName?: true
    seriesSet?: true
  }

  export type FlowSeriesCountAggregateInputType = {
    id?: true
    seriesName?: true
    seriesSet?: true
    _all?: true
  }

  export type FlowSeriesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FlowSeries to aggregate.
     */
    where?: FlowSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlowSeries to fetch.
     */
    orderBy?: FlowSeriesOrderByWithRelationInput | FlowSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FlowSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlowSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlowSeries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FlowSeries
    **/
    _count?: true | FlowSeriesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FlowSeriesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FlowSeriesMaxAggregateInputType
  }

  export type GetFlowSeriesAggregateType<T extends FlowSeriesAggregateArgs> = {
        [P in keyof T & keyof AggregateFlowSeries]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFlowSeries[P]>
      : GetScalarType<T[P], AggregateFlowSeries[P]>
  }




  export type FlowSeriesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlowSeriesWhereInput
    orderBy?: FlowSeriesOrderByWithAggregationInput | FlowSeriesOrderByWithAggregationInput[]
    by: FlowSeriesScalarFieldEnum[] | FlowSeriesScalarFieldEnum
    having?: FlowSeriesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FlowSeriesCountAggregateInputType | true
    _min?: FlowSeriesMinAggregateInputType
    _max?: FlowSeriesMaxAggregateInputType
  }

  export type FlowSeriesGroupByOutputType = {
    id: string
    seriesName: string
    seriesSet: string
    _count: FlowSeriesCountAggregateOutputType | null
    _min: FlowSeriesMinAggregateOutputType | null
    _max: FlowSeriesMaxAggregateOutputType | null
  }

  type GetFlowSeriesGroupByPayload<T extends FlowSeriesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FlowSeriesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FlowSeriesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FlowSeriesGroupByOutputType[P]>
            : GetScalarType<T[P], FlowSeriesGroupByOutputType[P]>
        }
      >
    >


  export type FlowSeriesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    seriesName?: boolean
    seriesSet?: boolean
  }, ExtArgs["result"]["flowSeries"]>


  export type FlowSeriesSelectScalar = {
    id?: boolean
    seriesName?: boolean
    seriesSet?: boolean
  }


  export type $FlowSeriesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FlowSeries"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      seriesName: string
      seriesSet: string
    }, ExtArgs["result"]["flowSeries"]>
    composites: {}
  }

  type FlowSeriesGetPayload<S extends boolean | null | undefined | FlowSeriesDefaultArgs> = $Result.GetResult<Prisma.$FlowSeriesPayload, S>

  type FlowSeriesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FlowSeriesFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FlowSeriesCountAggregateInputType | true
    }

  export interface FlowSeriesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FlowSeries'], meta: { name: 'FlowSeries' } }
    /**
     * Find zero or one FlowSeries that matches the filter.
     * @param {FlowSeriesFindUniqueArgs} args - Arguments to find a FlowSeries
     * @example
     * // Get one FlowSeries
     * const flowSeries = await prisma.flowSeries.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FlowSeriesFindUniqueArgs>(args: SelectSubset<T, FlowSeriesFindUniqueArgs<ExtArgs>>): Prisma__FlowSeriesClient<$Result.GetResult<Prisma.$FlowSeriesPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one FlowSeries that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FlowSeriesFindUniqueOrThrowArgs} args - Arguments to find a FlowSeries
     * @example
     * // Get one FlowSeries
     * const flowSeries = await prisma.flowSeries.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FlowSeriesFindUniqueOrThrowArgs>(args: SelectSubset<T, FlowSeriesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FlowSeriesClient<$Result.GetResult<Prisma.$FlowSeriesPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first FlowSeries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowSeriesFindFirstArgs} args - Arguments to find a FlowSeries
     * @example
     * // Get one FlowSeries
     * const flowSeries = await prisma.flowSeries.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FlowSeriesFindFirstArgs>(args?: SelectSubset<T, FlowSeriesFindFirstArgs<ExtArgs>>): Prisma__FlowSeriesClient<$Result.GetResult<Prisma.$FlowSeriesPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first FlowSeries that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowSeriesFindFirstOrThrowArgs} args - Arguments to find a FlowSeries
     * @example
     * // Get one FlowSeries
     * const flowSeries = await prisma.flowSeries.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FlowSeriesFindFirstOrThrowArgs>(args?: SelectSubset<T, FlowSeriesFindFirstOrThrowArgs<ExtArgs>>): Prisma__FlowSeriesClient<$Result.GetResult<Prisma.$FlowSeriesPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more FlowSeries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowSeriesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FlowSeries
     * const flowSeries = await prisma.flowSeries.findMany()
     * 
     * // Get first 10 FlowSeries
     * const flowSeries = await prisma.flowSeries.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const flowSeriesWithIdOnly = await prisma.flowSeries.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FlowSeriesFindManyArgs>(args?: SelectSubset<T, FlowSeriesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlowSeriesPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a FlowSeries.
     * @param {FlowSeriesCreateArgs} args - Arguments to create a FlowSeries.
     * @example
     * // Create one FlowSeries
     * const FlowSeries = await prisma.flowSeries.create({
     *   data: {
     *     // ... data to create a FlowSeries
     *   }
     * })
     * 
     */
    create<T extends FlowSeriesCreateArgs>(args: SelectSubset<T, FlowSeriesCreateArgs<ExtArgs>>): Prisma__FlowSeriesClient<$Result.GetResult<Prisma.$FlowSeriesPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many FlowSeries.
     * @param {FlowSeriesCreateManyArgs} args - Arguments to create many FlowSeries.
     * @example
     * // Create many FlowSeries
     * const flowSeries = await prisma.flowSeries.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FlowSeriesCreateManyArgs>(args?: SelectSubset<T, FlowSeriesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a FlowSeries.
     * @param {FlowSeriesDeleteArgs} args - Arguments to delete one FlowSeries.
     * @example
     * // Delete one FlowSeries
     * const FlowSeries = await prisma.flowSeries.delete({
     *   where: {
     *     // ... filter to delete one FlowSeries
     *   }
     * })
     * 
     */
    delete<T extends FlowSeriesDeleteArgs>(args: SelectSubset<T, FlowSeriesDeleteArgs<ExtArgs>>): Prisma__FlowSeriesClient<$Result.GetResult<Prisma.$FlowSeriesPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one FlowSeries.
     * @param {FlowSeriesUpdateArgs} args - Arguments to update one FlowSeries.
     * @example
     * // Update one FlowSeries
     * const flowSeries = await prisma.flowSeries.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FlowSeriesUpdateArgs>(args: SelectSubset<T, FlowSeriesUpdateArgs<ExtArgs>>): Prisma__FlowSeriesClient<$Result.GetResult<Prisma.$FlowSeriesPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more FlowSeries.
     * @param {FlowSeriesDeleteManyArgs} args - Arguments to filter FlowSeries to delete.
     * @example
     * // Delete a few FlowSeries
     * const { count } = await prisma.flowSeries.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FlowSeriesDeleteManyArgs>(args?: SelectSubset<T, FlowSeriesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FlowSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowSeriesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FlowSeries
     * const flowSeries = await prisma.flowSeries.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FlowSeriesUpdateManyArgs>(args: SelectSubset<T, FlowSeriesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FlowSeries.
     * @param {FlowSeriesUpsertArgs} args - Arguments to update or create a FlowSeries.
     * @example
     * // Update or create a FlowSeries
     * const flowSeries = await prisma.flowSeries.upsert({
     *   create: {
     *     // ... data to create a FlowSeries
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FlowSeries we want to update
     *   }
     * })
     */
    upsert<T extends FlowSeriesUpsertArgs>(args: SelectSubset<T, FlowSeriesUpsertArgs<ExtArgs>>): Prisma__FlowSeriesClient<$Result.GetResult<Prisma.$FlowSeriesPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more FlowSeries that matches the filter.
     * @param {FlowSeriesFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const flowSeries = await prisma.flowSeries.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: FlowSeriesFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a FlowSeries.
     * @param {FlowSeriesAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const flowSeries = await prisma.flowSeries.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: FlowSeriesAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of FlowSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowSeriesCountArgs} args - Arguments to filter FlowSeries to count.
     * @example
     * // Count the number of FlowSeries
     * const count = await prisma.flowSeries.count({
     *   where: {
     *     // ... the filter for the FlowSeries we want to count
     *   }
     * })
    **/
    count<T extends FlowSeriesCountArgs>(
      args?: Subset<T, FlowSeriesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FlowSeriesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FlowSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowSeriesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FlowSeriesAggregateArgs>(args: Subset<T, FlowSeriesAggregateArgs>): Prisma.PrismaPromise<GetFlowSeriesAggregateType<T>>

    /**
     * Group by FlowSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowSeriesGroupByArgs} args - Group by arguments.
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
      T extends FlowSeriesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FlowSeriesGroupByArgs['orderBy'] }
        : { orderBy?: FlowSeriesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
        }[OrderFields]
    >(args: SubsetIntersection<T, FlowSeriesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFlowSeriesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FlowSeries model
   */
  readonly fields: FlowSeriesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FlowSeries.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FlowSeriesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FlowSeries model
   */ 
  interface FlowSeriesFieldRefs {
    readonly id: FieldRef<"FlowSeries", 'String'>
    readonly seriesName: FieldRef<"FlowSeries", 'String'>
    readonly seriesSet: FieldRef<"FlowSeries", 'String'>
  }
    

  // Custom InputTypes
  /**
   * FlowSeries findUnique
   */
  export type FlowSeriesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowSeries
     */
    select?: FlowSeriesSelect<ExtArgs> | null
    /**
     * Filter, which FlowSeries to fetch.
     */
    where: FlowSeriesWhereUniqueInput
  }

  /**
   * FlowSeries findUniqueOrThrow
   */
  export type FlowSeriesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowSeries
     */
    select?: FlowSeriesSelect<ExtArgs> | null
    /**
     * Filter, which FlowSeries to fetch.
     */
    where: FlowSeriesWhereUniqueInput
  }

  /**
   * FlowSeries findFirst
   */
  export type FlowSeriesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowSeries
     */
    select?: FlowSeriesSelect<ExtArgs> | null
    /**
     * Filter, which FlowSeries to fetch.
     */
    where?: FlowSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlowSeries to fetch.
     */
    orderBy?: FlowSeriesOrderByWithRelationInput | FlowSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FlowSeries.
     */
    cursor?: FlowSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlowSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlowSeries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FlowSeries.
     */
    distinct?: FlowSeriesScalarFieldEnum | FlowSeriesScalarFieldEnum[]
  }

  /**
   * FlowSeries findFirstOrThrow
   */
  export type FlowSeriesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowSeries
     */
    select?: FlowSeriesSelect<ExtArgs> | null
    /**
     * Filter, which FlowSeries to fetch.
     */
    where?: FlowSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlowSeries to fetch.
     */
    orderBy?: FlowSeriesOrderByWithRelationInput | FlowSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FlowSeries.
     */
    cursor?: FlowSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlowSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlowSeries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FlowSeries.
     */
    distinct?: FlowSeriesScalarFieldEnum | FlowSeriesScalarFieldEnum[]
  }

  /**
   * FlowSeries findMany
   */
  export type FlowSeriesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowSeries
     */
    select?: FlowSeriesSelect<ExtArgs> | null
    /**
     * Filter, which FlowSeries to fetch.
     */
    where?: FlowSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlowSeries to fetch.
     */
    orderBy?: FlowSeriesOrderByWithRelationInput | FlowSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FlowSeries.
     */
    cursor?: FlowSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlowSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlowSeries.
     */
    skip?: number
    distinct?: FlowSeriesScalarFieldEnum | FlowSeriesScalarFieldEnum[]
  }

  /**
   * FlowSeries create
   */
  export type FlowSeriesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowSeries
     */
    select?: FlowSeriesSelect<ExtArgs> | null
    /**
     * The data needed to create a FlowSeries.
     */
    data: XOR<FlowSeriesCreateInput, FlowSeriesUncheckedCreateInput>
  }

  /**
   * FlowSeries createMany
   */
  export type FlowSeriesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FlowSeries.
     */
    data: FlowSeriesCreateManyInput | FlowSeriesCreateManyInput[]
  }

  /**
   * FlowSeries update
   */
  export type FlowSeriesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowSeries
     */
    select?: FlowSeriesSelect<ExtArgs> | null
    /**
     * The data needed to update a FlowSeries.
     */
    data: XOR<FlowSeriesUpdateInput, FlowSeriesUncheckedUpdateInput>
    /**
     * Choose, which FlowSeries to update.
     */
    where: FlowSeriesWhereUniqueInput
  }

  /**
   * FlowSeries updateMany
   */
  export type FlowSeriesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FlowSeries.
     */
    data: XOR<FlowSeriesUpdateManyMutationInput, FlowSeriesUncheckedUpdateManyInput>
    /**
     * Filter which FlowSeries to update
     */
    where?: FlowSeriesWhereInput
  }

  /**
   * FlowSeries upsert
   */
  export type FlowSeriesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowSeries
     */
    select?: FlowSeriesSelect<ExtArgs> | null
    /**
     * The filter to search for the FlowSeries to update in case it exists.
     */
    where: FlowSeriesWhereUniqueInput
    /**
     * In case the FlowSeries found by the `where` argument doesn't exist, create a new FlowSeries with this data.
     */
    create: XOR<FlowSeriesCreateInput, FlowSeriesUncheckedCreateInput>
    /**
     * In case the FlowSeries was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FlowSeriesUpdateInput, FlowSeriesUncheckedUpdateInput>
  }

  /**
   * FlowSeries delete
   */
  export type FlowSeriesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowSeries
     */
    select?: FlowSeriesSelect<ExtArgs> | null
    /**
     * Filter which FlowSeries to delete.
     */
    where: FlowSeriesWhereUniqueInput
  }

  /**
   * FlowSeries deleteMany
   */
  export type FlowSeriesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FlowSeries to delete
     */
    where?: FlowSeriesWhereInput
  }

  /**
   * FlowSeries findRaw
   */
  export type FlowSeriesFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * FlowSeries aggregateRaw
   */
  export type FlowSeriesAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * FlowSeries without action
   */
  export type FlowSeriesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowSeries
     */
    select?: FlowSeriesSelect<ExtArgs> | null
  }


  /**
   * Model Sequence
   */

  export type AggregateSequence = {
    _count: SequenceCountAggregateOutputType | null
    _min: SequenceMinAggregateOutputType | null
    _max: SequenceMaxAggregateOutputType | null
  }

  export type SequenceMinAggregateOutputType = {
    id: string | null
    nameSequence: string | null
  }

  export type SequenceMaxAggregateOutputType = {
    id: string | null
    nameSequence: string | null
  }

  export type SequenceCountAggregateOutputType = {
    id: number
    nameSequence: number
    _all: number
  }


  export type SequenceMinAggregateInputType = {
    id?: true
    nameSequence?: true
  }

  export type SequenceMaxAggregateInputType = {
    id?: true
    nameSequence?: true
  }

  export type SequenceCountAggregateInputType = {
    id?: true
    nameSequence?: true
    _all?: true
  }

  export type SequenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sequence to aggregate.
     */
    where?: SequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sequences to fetch.
     */
    orderBy?: SequenceOrderByWithRelationInput | SequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sequences
    **/
    _count?: true | SequenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SequenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SequenceMaxAggregateInputType
  }

  export type GetSequenceAggregateType<T extends SequenceAggregateArgs> = {
        [P in keyof T & keyof AggregateSequence]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSequence[P]>
      : GetScalarType<T[P], AggregateSequence[P]>
  }




  export type SequenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SequenceWhereInput
    orderBy?: SequenceOrderByWithAggregationInput | SequenceOrderByWithAggregationInput[]
    by: SequenceScalarFieldEnum[] | SequenceScalarFieldEnum
    having?: SequenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SequenceCountAggregateInputType | true
    _min?: SequenceMinAggregateInputType
    _max?: SequenceMaxAggregateInputType
  }

  export type SequenceGroupByOutputType = {
    id: string
    nameSequence: string
    _count: SequenceCountAggregateOutputType | null
    _min: SequenceMinAggregateOutputType | null
    _max: SequenceMaxAggregateOutputType | null
  }

  type GetSequenceGroupByPayload<T extends SequenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SequenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SequenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SequenceGroupByOutputType[P]>
            : GetScalarType<T[P], SequenceGroupByOutputType[P]>
        }
      >
    >


  export type SequenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nameSequence?: boolean
    sequencesSeries?: boolean | Sequence$sequencesSeriesArgs<ExtArgs>
    _count?: boolean | SequenceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sequence"]>


  export type SequenceSelectScalar = {
    id?: boolean
    nameSequence?: boolean
  }

  export type SequenceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sequencesSeries?: boolean | Sequence$sequencesSeriesArgs<ExtArgs>
    _count?: boolean | SequenceCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $SequencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Sequence"
    objects: {
      sequencesSeries: Prisma.$SequencesSeriesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nameSequence: string
    }, ExtArgs["result"]["sequence"]>
    composites: {}
  }

  type SequenceGetPayload<S extends boolean | null | undefined | SequenceDefaultArgs> = $Result.GetResult<Prisma.$SequencePayload, S>

  type SequenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SequenceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SequenceCountAggregateInputType | true
    }

  export interface SequenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Sequence'], meta: { name: 'Sequence' } }
    /**
     * Find zero or one Sequence that matches the filter.
     * @param {SequenceFindUniqueArgs} args - Arguments to find a Sequence
     * @example
     * // Get one Sequence
     * const sequence = await prisma.sequence.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SequenceFindUniqueArgs>(args: SelectSubset<T, SequenceFindUniqueArgs<ExtArgs>>): Prisma__SequenceClient<$Result.GetResult<Prisma.$SequencePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Sequence that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SequenceFindUniqueOrThrowArgs} args - Arguments to find a Sequence
     * @example
     * // Get one Sequence
     * const sequence = await prisma.sequence.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SequenceFindUniqueOrThrowArgs>(args: SelectSubset<T, SequenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SequenceClient<$Result.GetResult<Prisma.$SequencePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Sequence that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequenceFindFirstArgs} args - Arguments to find a Sequence
     * @example
     * // Get one Sequence
     * const sequence = await prisma.sequence.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SequenceFindFirstArgs>(args?: SelectSubset<T, SequenceFindFirstArgs<ExtArgs>>): Prisma__SequenceClient<$Result.GetResult<Prisma.$SequencePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Sequence that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequenceFindFirstOrThrowArgs} args - Arguments to find a Sequence
     * @example
     * // Get one Sequence
     * const sequence = await prisma.sequence.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SequenceFindFirstOrThrowArgs>(args?: SelectSubset<T, SequenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__SequenceClient<$Result.GetResult<Prisma.$SequencePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Sequences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sequences
     * const sequences = await prisma.sequence.findMany()
     * 
     * // Get first 10 Sequences
     * const sequences = await prisma.sequence.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sequenceWithIdOnly = await prisma.sequence.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SequenceFindManyArgs>(args?: SelectSubset<T, SequenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SequencePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Sequence.
     * @param {SequenceCreateArgs} args - Arguments to create a Sequence.
     * @example
     * // Create one Sequence
     * const Sequence = await prisma.sequence.create({
     *   data: {
     *     // ... data to create a Sequence
     *   }
     * })
     * 
     */
    create<T extends SequenceCreateArgs>(args: SelectSubset<T, SequenceCreateArgs<ExtArgs>>): Prisma__SequenceClient<$Result.GetResult<Prisma.$SequencePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Sequences.
     * @param {SequenceCreateManyArgs} args - Arguments to create many Sequences.
     * @example
     * // Create many Sequences
     * const sequence = await prisma.sequence.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SequenceCreateManyArgs>(args?: SelectSubset<T, SequenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Sequence.
     * @param {SequenceDeleteArgs} args - Arguments to delete one Sequence.
     * @example
     * // Delete one Sequence
     * const Sequence = await prisma.sequence.delete({
     *   where: {
     *     // ... filter to delete one Sequence
     *   }
     * })
     * 
     */
    delete<T extends SequenceDeleteArgs>(args: SelectSubset<T, SequenceDeleteArgs<ExtArgs>>): Prisma__SequenceClient<$Result.GetResult<Prisma.$SequencePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Sequence.
     * @param {SequenceUpdateArgs} args - Arguments to update one Sequence.
     * @example
     * // Update one Sequence
     * const sequence = await prisma.sequence.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SequenceUpdateArgs>(args: SelectSubset<T, SequenceUpdateArgs<ExtArgs>>): Prisma__SequenceClient<$Result.GetResult<Prisma.$SequencePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Sequences.
     * @param {SequenceDeleteManyArgs} args - Arguments to filter Sequences to delete.
     * @example
     * // Delete a few Sequences
     * const { count } = await prisma.sequence.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SequenceDeleteManyArgs>(args?: SelectSubset<T, SequenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sequences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sequences
     * const sequence = await prisma.sequence.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SequenceUpdateManyArgs>(args: SelectSubset<T, SequenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Sequence.
     * @param {SequenceUpsertArgs} args - Arguments to update or create a Sequence.
     * @example
     * // Update or create a Sequence
     * const sequence = await prisma.sequence.upsert({
     *   create: {
     *     // ... data to create a Sequence
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sequence we want to update
     *   }
     * })
     */
    upsert<T extends SequenceUpsertArgs>(args: SelectSubset<T, SequenceUpsertArgs<ExtArgs>>): Prisma__SequenceClient<$Result.GetResult<Prisma.$SequencePayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more Sequences that matches the filter.
     * @param {SequenceFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const sequence = await prisma.sequence.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: SequenceFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Sequence.
     * @param {SequenceAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const sequence = await prisma.sequence.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: SequenceAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Sequences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequenceCountArgs} args - Arguments to filter Sequences to count.
     * @example
     * // Count the number of Sequences
     * const count = await prisma.sequence.count({
     *   where: {
     *     // ... the filter for the Sequences we want to count
     *   }
     * })
    **/
    count<T extends SequenceCountArgs>(
      args?: Subset<T, SequenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SequenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sequence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SequenceAggregateArgs>(args: Subset<T, SequenceAggregateArgs>): Prisma.PrismaPromise<GetSequenceAggregateType<T>>

    /**
     * Group by Sequence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequenceGroupByArgs} args - Group by arguments.
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
      T extends SequenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SequenceGroupByArgs['orderBy'] }
        : { orderBy?: SequenceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
        }[OrderFields]
    >(args: SubsetIntersection<T, SequenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSequenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Sequence model
   */
  readonly fields: SequenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Sequence.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SequenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sequencesSeries<T extends Sequence$sequencesSeriesArgs<ExtArgs> = {}>(args?: Subset<T, Sequence$sequencesSeriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SequencesSeriesPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Sequence model
   */ 
  interface SequenceFieldRefs {
    readonly id: FieldRef<"Sequence", 'String'>
    readonly nameSequence: FieldRef<"Sequence", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Sequence findUnique
   */
  export type SequenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sequence
     */
    select?: SequenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceInclude<ExtArgs> | null
    /**
     * Filter, which Sequence to fetch.
     */
    where: SequenceWhereUniqueInput
  }

  /**
   * Sequence findUniqueOrThrow
   */
  export type SequenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sequence
     */
    select?: SequenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceInclude<ExtArgs> | null
    /**
     * Filter, which Sequence to fetch.
     */
    where: SequenceWhereUniqueInput
  }

  /**
   * Sequence findFirst
   */
  export type SequenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sequence
     */
    select?: SequenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceInclude<ExtArgs> | null
    /**
     * Filter, which Sequence to fetch.
     */
    where?: SequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sequences to fetch.
     */
    orderBy?: SequenceOrderByWithRelationInput | SequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sequences.
     */
    cursor?: SequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sequences.
     */
    distinct?: SequenceScalarFieldEnum | SequenceScalarFieldEnum[]
  }

  /**
   * Sequence findFirstOrThrow
   */
  export type SequenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sequence
     */
    select?: SequenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceInclude<ExtArgs> | null
    /**
     * Filter, which Sequence to fetch.
     */
    where?: SequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sequences to fetch.
     */
    orderBy?: SequenceOrderByWithRelationInput | SequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sequences.
     */
    cursor?: SequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sequences.
     */
    distinct?: SequenceScalarFieldEnum | SequenceScalarFieldEnum[]
  }

  /**
   * Sequence findMany
   */
  export type SequenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sequence
     */
    select?: SequenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceInclude<ExtArgs> | null
    /**
     * Filter, which Sequences to fetch.
     */
    where?: SequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sequences to fetch.
     */
    orderBy?: SequenceOrderByWithRelationInput | SequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sequences.
     */
    cursor?: SequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sequences.
     */
    skip?: number
    distinct?: SequenceScalarFieldEnum | SequenceScalarFieldEnum[]
  }

  /**
   * Sequence create
   */
  export type SequenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sequence
     */
    select?: SequenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceInclude<ExtArgs> | null
    /**
     * The data needed to create a Sequence.
     */
    data: XOR<SequenceCreateInput, SequenceUncheckedCreateInput>
  }

  /**
   * Sequence createMany
   */
  export type SequenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sequences.
     */
    data: SequenceCreateManyInput | SequenceCreateManyInput[]
  }

  /**
   * Sequence update
   */
  export type SequenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sequence
     */
    select?: SequenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceInclude<ExtArgs> | null
    /**
     * The data needed to update a Sequence.
     */
    data: XOR<SequenceUpdateInput, SequenceUncheckedUpdateInput>
    /**
     * Choose, which Sequence to update.
     */
    where: SequenceWhereUniqueInput
  }

  /**
   * Sequence updateMany
   */
  export type SequenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sequences.
     */
    data: XOR<SequenceUpdateManyMutationInput, SequenceUncheckedUpdateManyInput>
    /**
     * Filter which Sequences to update
     */
    where?: SequenceWhereInput
  }

  /**
   * Sequence upsert
   */
  export type SequenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sequence
     */
    select?: SequenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceInclude<ExtArgs> | null
    /**
     * The filter to search for the Sequence to update in case it exists.
     */
    where: SequenceWhereUniqueInput
    /**
     * In case the Sequence found by the `where` argument doesn't exist, create a new Sequence with this data.
     */
    create: XOR<SequenceCreateInput, SequenceUncheckedCreateInput>
    /**
     * In case the Sequence was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SequenceUpdateInput, SequenceUncheckedUpdateInput>
  }

  /**
   * Sequence delete
   */
  export type SequenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sequence
     */
    select?: SequenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceInclude<ExtArgs> | null
    /**
     * Filter which Sequence to delete.
     */
    where: SequenceWhereUniqueInput
  }

  /**
   * Sequence deleteMany
   */
  export type SequenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sequences to delete
     */
    where?: SequenceWhereInput
  }

  /**
   * Sequence findRaw
   */
  export type SequenceFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Sequence aggregateRaw
   */
  export type SequenceAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Sequence.sequencesSeries
   */
  export type Sequence$sequencesSeriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SequencesSeries
     */
    select?: SequencesSeriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequencesSeriesInclude<ExtArgs> | null
    where?: SequencesSeriesWhereInput
    orderBy?: SequencesSeriesOrderByWithRelationInput | SequencesSeriesOrderByWithRelationInput[]
    cursor?: SequencesSeriesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SequencesSeriesScalarFieldEnum | SequencesSeriesScalarFieldEnum[]
  }

  /**
   * Sequence without action
   */
  export type SequenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sequence
     */
    select?: SequenceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequenceInclude<ExtArgs> | null
  }


  /**
   * Model SequencesSeries
   */

  export type AggregateSequencesSeries = {
    _count: SequencesSeriesCountAggregateOutputType | null
    _min: SequencesSeriesMinAggregateOutputType | null
    _max: SequencesSeriesMaxAggregateOutputType | null
  }

  export type SequencesSeriesMinAggregateOutputType = {
    id: string | null
    seriesName: string | null
    sequenceId: string | null
  }

  export type SequencesSeriesMaxAggregateOutputType = {
    id: string | null
    seriesName: string | null
    sequenceId: string | null
  }

  export type SequencesSeriesCountAggregateOutputType = {
    id: number
    seriesName: number
    seriesSet: number
    sequenceId: number
    _all: number
  }


  export type SequencesSeriesMinAggregateInputType = {
    id?: true
    seriesName?: true
    sequenceId?: true
  }

  export type SequencesSeriesMaxAggregateInputType = {
    id?: true
    seriesName?: true
    sequenceId?: true
  }

  export type SequencesSeriesCountAggregateInputType = {
    id?: true
    seriesName?: true
    seriesSet?: true
    sequenceId?: true
    _all?: true
  }

  export type SequencesSeriesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SequencesSeries to aggregate.
     */
    where?: SequencesSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SequencesSeries to fetch.
     */
    orderBy?: SequencesSeriesOrderByWithRelationInput | SequencesSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SequencesSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SequencesSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SequencesSeries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SequencesSeries
    **/
    _count?: true | SequencesSeriesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SequencesSeriesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SequencesSeriesMaxAggregateInputType
  }

  export type GetSequencesSeriesAggregateType<T extends SequencesSeriesAggregateArgs> = {
        [P in keyof T & keyof AggregateSequencesSeries]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSequencesSeries[P]>
      : GetScalarType<T[P], AggregateSequencesSeries[P]>
  }




  export type SequencesSeriesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SequencesSeriesWhereInput
    orderBy?: SequencesSeriesOrderByWithAggregationInput | SequencesSeriesOrderByWithAggregationInput[]
    by: SequencesSeriesScalarFieldEnum[] | SequencesSeriesScalarFieldEnum
    having?: SequencesSeriesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SequencesSeriesCountAggregateInputType | true
    _min?: SequencesSeriesMinAggregateInputType
    _max?: SequencesSeriesMaxAggregateInputType
  }

  export type SequencesSeriesGroupByOutputType = {
    id: string
    seriesName: string
    seriesSet: string[]
    sequenceId: string
    _count: SequencesSeriesCountAggregateOutputType | null
    _min: SequencesSeriesMinAggregateOutputType | null
    _max: SequencesSeriesMaxAggregateOutputType | null
  }

  type GetSequencesSeriesGroupByPayload<T extends SequencesSeriesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SequencesSeriesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SequencesSeriesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SequencesSeriesGroupByOutputType[P]>
            : GetScalarType<T[P], SequencesSeriesGroupByOutputType[P]>
        }
      >
    >


  export type SequencesSeriesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    seriesName?: boolean
    seriesSet?: boolean
    sequenceId?: boolean
    sequence?: boolean | SequenceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sequencesSeries"]>


  export type SequencesSeriesSelectScalar = {
    id?: boolean
    seriesName?: boolean
    seriesSet?: boolean
    sequenceId?: boolean
  }

  export type SequencesSeriesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sequence?: boolean | SequenceDefaultArgs<ExtArgs>
  }

  export type $SequencesSeriesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SequencesSeries"
    objects: {
      sequence: Prisma.$SequencePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      seriesName: string
      seriesSet: string[]
      sequenceId: string
    }, ExtArgs["result"]["sequencesSeries"]>
    composites: {}
  }

  type SequencesSeriesGetPayload<S extends boolean | null | undefined | SequencesSeriesDefaultArgs> = $Result.GetResult<Prisma.$SequencesSeriesPayload, S>

  type SequencesSeriesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SequencesSeriesFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SequencesSeriesCountAggregateInputType | true
    }

  export interface SequencesSeriesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SequencesSeries'], meta: { name: 'SequencesSeries' } }
    /**
     * Find zero or one SequencesSeries that matches the filter.
     * @param {SequencesSeriesFindUniqueArgs} args - Arguments to find a SequencesSeries
     * @example
     * // Get one SequencesSeries
     * const sequencesSeries = await prisma.sequencesSeries.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SequencesSeriesFindUniqueArgs>(args: SelectSubset<T, SequencesSeriesFindUniqueArgs<ExtArgs>>): Prisma__SequencesSeriesClient<$Result.GetResult<Prisma.$SequencesSeriesPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SequencesSeries that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SequencesSeriesFindUniqueOrThrowArgs} args - Arguments to find a SequencesSeries
     * @example
     * // Get one SequencesSeries
     * const sequencesSeries = await prisma.sequencesSeries.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SequencesSeriesFindUniqueOrThrowArgs>(args: SelectSubset<T, SequencesSeriesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SequencesSeriesClient<$Result.GetResult<Prisma.$SequencesSeriesPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SequencesSeries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequencesSeriesFindFirstArgs} args - Arguments to find a SequencesSeries
     * @example
     * // Get one SequencesSeries
     * const sequencesSeries = await prisma.sequencesSeries.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SequencesSeriesFindFirstArgs>(args?: SelectSubset<T, SequencesSeriesFindFirstArgs<ExtArgs>>): Prisma__SequencesSeriesClient<$Result.GetResult<Prisma.$SequencesSeriesPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SequencesSeries that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequencesSeriesFindFirstOrThrowArgs} args - Arguments to find a SequencesSeries
     * @example
     * // Get one SequencesSeries
     * const sequencesSeries = await prisma.sequencesSeries.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SequencesSeriesFindFirstOrThrowArgs>(args?: SelectSubset<T, SequencesSeriesFindFirstOrThrowArgs<ExtArgs>>): Prisma__SequencesSeriesClient<$Result.GetResult<Prisma.$SequencesSeriesPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SequencesSeries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequencesSeriesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SequencesSeries
     * const sequencesSeries = await prisma.sequencesSeries.findMany()
     * 
     * // Get first 10 SequencesSeries
     * const sequencesSeries = await prisma.sequencesSeries.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sequencesSeriesWithIdOnly = await prisma.sequencesSeries.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SequencesSeriesFindManyArgs>(args?: SelectSubset<T, SequencesSeriesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SequencesSeriesPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SequencesSeries.
     * @param {SequencesSeriesCreateArgs} args - Arguments to create a SequencesSeries.
     * @example
     * // Create one SequencesSeries
     * const SequencesSeries = await prisma.sequencesSeries.create({
     *   data: {
     *     // ... data to create a SequencesSeries
     *   }
     * })
     * 
     */
    create<T extends SequencesSeriesCreateArgs>(args: SelectSubset<T, SequencesSeriesCreateArgs<ExtArgs>>): Prisma__SequencesSeriesClient<$Result.GetResult<Prisma.$SequencesSeriesPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SequencesSeries.
     * @param {SequencesSeriesCreateManyArgs} args - Arguments to create many SequencesSeries.
     * @example
     * // Create many SequencesSeries
     * const sequencesSeries = await prisma.sequencesSeries.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SequencesSeriesCreateManyArgs>(args?: SelectSubset<T, SequencesSeriesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SequencesSeries.
     * @param {SequencesSeriesDeleteArgs} args - Arguments to delete one SequencesSeries.
     * @example
     * // Delete one SequencesSeries
     * const SequencesSeries = await prisma.sequencesSeries.delete({
     *   where: {
     *     // ... filter to delete one SequencesSeries
     *   }
     * })
     * 
     */
    delete<T extends SequencesSeriesDeleteArgs>(args: SelectSubset<T, SequencesSeriesDeleteArgs<ExtArgs>>): Prisma__SequencesSeriesClient<$Result.GetResult<Prisma.$SequencesSeriesPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SequencesSeries.
     * @param {SequencesSeriesUpdateArgs} args - Arguments to update one SequencesSeries.
     * @example
     * // Update one SequencesSeries
     * const sequencesSeries = await prisma.sequencesSeries.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SequencesSeriesUpdateArgs>(args: SelectSubset<T, SequencesSeriesUpdateArgs<ExtArgs>>): Prisma__SequencesSeriesClient<$Result.GetResult<Prisma.$SequencesSeriesPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SequencesSeries.
     * @param {SequencesSeriesDeleteManyArgs} args - Arguments to filter SequencesSeries to delete.
     * @example
     * // Delete a few SequencesSeries
     * const { count } = await prisma.sequencesSeries.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SequencesSeriesDeleteManyArgs>(args?: SelectSubset<T, SequencesSeriesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SequencesSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequencesSeriesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SequencesSeries
     * const sequencesSeries = await prisma.sequencesSeries.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SequencesSeriesUpdateManyArgs>(args: SelectSubset<T, SequencesSeriesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SequencesSeries.
     * @param {SequencesSeriesUpsertArgs} args - Arguments to update or create a SequencesSeries.
     * @example
     * // Update or create a SequencesSeries
     * const sequencesSeries = await prisma.sequencesSeries.upsert({
     *   create: {
     *     // ... data to create a SequencesSeries
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SequencesSeries we want to update
     *   }
     * })
     */
    upsert<T extends SequencesSeriesUpsertArgs>(args: SelectSubset<T, SequencesSeriesUpsertArgs<ExtArgs>>): Prisma__SequencesSeriesClient<$Result.GetResult<Prisma.$SequencesSeriesPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more SequencesSeries that matches the filter.
     * @param {SequencesSeriesFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const sequencesSeries = await prisma.sequencesSeries.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: SequencesSeriesFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a SequencesSeries.
     * @param {SequencesSeriesAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const sequencesSeries = await prisma.sequencesSeries.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: SequencesSeriesAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of SequencesSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequencesSeriesCountArgs} args - Arguments to filter SequencesSeries to count.
     * @example
     * // Count the number of SequencesSeries
     * const count = await prisma.sequencesSeries.count({
     *   where: {
     *     // ... the filter for the SequencesSeries we want to count
     *   }
     * })
    **/
    count<T extends SequencesSeriesCountArgs>(
      args?: Subset<T, SequencesSeriesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SequencesSeriesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SequencesSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequencesSeriesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SequencesSeriesAggregateArgs>(args: Subset<T, SequencesSeriesAggregateArgs>): Prisma.PrismaPromise<GetSequencesSeriesAggregateType<T>>

    /**
     * Group by SequencesSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SequencesSeriesGroupByArgs} args - Group by arguments.
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
      T extends SequencesSeriesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SequencesSeriesGroupByArgs['orderBy'] }
        : { orderBy?: SequencesSeriesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
        }[OrderFields]
    >(args: SubsetIntersection<T, SequencesSeriesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSequencesSeriesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SequencesSeries model
   */
  readonly fields: SequencesSeriesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SequencesSeries.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SequencesSeriesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sequence<T extends SequenceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SequenceDefaultArgs<ExtArgs>>): Prisma__SequenceClient<$Result.GetResult<Prisma.$SequencePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SequencesSeries model
   */ 
  interface SequencesSeriesFieldRefs {
    readonly id: FieldRef<"SequencesSeries", 'String'>
    readonly seriesName: FieldRef<"SequencesSeries", 'String'>
    readonly seriesSet: FieldRef<"SequencesSeries", 'String[]'>
    readonly sequenceId: FieldRef<"SequencesSeries", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SequencesSeries findUnique
   */
  export type SequencesSeriesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SequencesSeries
     */
    select?: SequencesSeriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequencesSeriesInclude<ExtArgs> | null
    /**
     * Filter, which SequencesSeries to fetch.
     */
    where: SequencesSeriesWhereUniqueInput
  }

  /**
   * SequencesSeries findUniqueOrThrow
   */
  export type SequencesSeriesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SequencesSeries
     */
    select?: SequencesSeriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequencesSeriesInclude<ExtArgs> | null
    /**
     * Filter, which SequencesSeries to fetch.
     */
    where: SequencesSeriesWhereUniqueInput
  }

  /**
   * SequencesSeries findFirst
   */
  export type SequencesSeriesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SequencesSeries
     */
    select?: SequencesSeriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequencesSeriesInclude<ExtArgs> | null
    /**
     * Filter, which SequencesSeries to fetch.
     */
    where?: SequencesSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SequencesSeries to fetch.
     */
    orderBy?: SequencesSeriesOrderByWithRelationInput | SequencesSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SequencesSeries.
     */
    cursor?: SequencesSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SequencesSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SequencesSeries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SequencesSeries.
     */
    distinct?: SequencesSeriesScalarFieldEnum | SequencesSeriesScalarFieldEnum[]
  }

  /**
   * SequencesSeries findFirstOrThrow
   */
  export type SequencesSeriesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SequencesSeries
     */
    select?: SequencesSeriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequencesSeriesInclude<ExtArgs> | null
    /**
     * Filter, which SequencesSeries to fetch.
     */
    where?: SequencesSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SequencesSeries to fetch.
     */
    orderBy?: SequencesSeriesOrderByWithRelationInput | SequencesSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SequencesSeries.
     */
    cursor?: SequencesSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SequencesSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SequencesSeries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SequencesSeries.
     */
    distinct?: SequencesSeriesScalarFieldEnum | SequencesSeriesScalarFieldEnum[]
  }

  /**
   * SequencesSeries findMany
   */
  export type SequencesSeriesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SequencesSeries
     */
    select?: SequencesSeriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequencesSeriesInclude<ExtArgs> | null
    /**
     * Filter, which SequencesSeries to fetch.
     */
    where?: SequencesSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SequencesSeries to fetch.
     */
    orderBy?: SequencesSeriesOrderByWithRelationInput | SequencesSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SequencesSeries.
     */
    cursor?: SequencesSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SequencesSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SequencesSeries.
     */
    skip?: number
    distinct?: SequencesSeriesScalarFieldEnum | SequencesSeriesScalarFieldEnum[]
  }

  /**
   * SequencesSeries create
   */
  export type SequencesSeriesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SequencesSeries
     */
    select?: SequencesSeriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequencesSeriesInclude<ExtArgs> | null
    /**
     * The data needed to create a SequencesSeries.
     */
    data: XOR<SequencesSeriesCreateInput, SequencesSeriesUncheckedCreateInput>
  }

  /**
   * SequencesSeries createMany
   */
  export type SequencesSeriesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SequencesSeries.
     */
    data: SequencesSeriesCreateManyInput | SequencesSeriesCreateManyInput[]
  }

  /**
   * SequencesSeries update
   */
  export type SequencesSeriesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SequencesSeries
     */
    select?: SequencesSeriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequencesSeriesInclude<ExtArgs> | null
    /**
     * The data needed to update a SequencesSeries.
     */
    data: XOR<SequencesSeriesUpdateInput, SequencesSeriesUncheckedUpdateInput>
    /**
     * Choose, which SequencesSeries to update.
     */
    where: SequencesSeriesWhereUniqueInput
  }

  /**
   * SequencesSeries updateMany
   */
  export type SequencesSeriesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SequencesSeries.
     */
    data: XOR<SequencesSeriesUpdateManyMutationInput, SequencesSeriesUncheckedUpdateManyInput>
    /**
     * Filter which SequencesSeries to update
     */
    where?: SequencesSeriesWhereInput
  }

  /**
   * SequencesSeries upsert
   */
  export type SequencesSeriesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SequencesSeries
     */
    select?: SequencesSeriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequencesSeriesInclude<ExtArgs> | null
    /**
     * The filter to search for the SequencesSeries to update in case it exists.
     */
    where: SequencesSeriesWhereUniqueInput
    /**
     * In case the SequencesSeries found by the `where` argument doesn't exist, create a new SequencesSeries with this data.
     */
    create: XOR<SequencesSeriesCreateInput, SequencesSeriesUncheckedCreateInput>
    /**
     * In case the SequencesSeries was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SequencesSeriesUpdateInput, SequencesSeriesUncheckedUpdateInput>
  }

  /**
   * SequencesSeries delete
   */
  export type SequencesSeriesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SequencesSeries
     */
    select?: SequencesSeriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequencesSeriesInclude<ExtArgs> | null
    /**
     * Filter which SequencesSeries to delete.
     */
    where: SequencesSeriesWhereUniqueInput
  }

  /**
   * SequencesSeries deleteMany
   */
  export type SequencesSeriesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SequencesSeries to delete
     */
    where?: SequencesSeriesWhereInput
  }

  /**
   * SequencesSeries findRaw
   */
  export type SequencesSeriesFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * SequencesSeries aggregateRaw
   */
  export type SequencesSeriesAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * SequencesSeries without action
   */
  export type SequencesSeriesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SequencesSeries
     */
    select?: SequencesSeriesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SequencesSeriesInclude<ExtArgs> | null
  }


  /**
   * Model Posture
   */

  export type AggregatePosture = {
    _count: PostureCountAggregateOutputType | null
    _min: PostureMinAggregateOutputType | null
    _max: PostureMaxAggregateOutputType | null
  }

  export type PostureMinAggregateOutputType = {
    id: string | null
    benefits: string | null
    category: string | null
    description: string | null
    difficulty: string | null
    display_name: string | null
    name: string | null
    preferred_side: string | null
    sideways: boolean | null
    sort_name: string | null
    subcategory: string | null
    two_sided: boolean | null
    visibility: string | null
  }

  export type PostureMaxAggregateOutputType = {
    id: string | null
    benefits: string | null
    category: string | null
    description: string | null
    difficulty: string | null
    display_name: string | null
    name: string | null
    preferred_side: string | null
    sideways: boolean | null
    sort_name: string | null
    subcategory: string | null
    two_sided: boolean | null
    visibility: string | null
  }

  export type PostureCountAggregateOutputType = {
    id: number
    aka: number
    benefits: number
    category: number
    description: number
    difficulty: number
    display_name: number
    name: number
    next_poses: number
    preferred_side: number
    previous_poses: number
    sideways: number
    sort_name: number
    subcategory: number
    two_sided: number
    variations: number
    visibility: number
    _all: number
  }


  export type PostureMinAggregateInputType = {
    id?: true
    benefits?: true
    category?: true
    description?: true
    difficulty?: true
    display_name?: true
    name?: true
    preferred_side?: true
    sideways?: true
    sort_name?: true
    subcategory?: true
    two_sided?: true
    visibility?: true
  }

  export type PostureMaxAggregateInputType = {
    id?: true
    benefits?: true
    category?: true
    description?: true
    difficulty?: true
    display_name?: true
    name?: true
    preferred_side?: true
    sideways?: true
    sort_name?: true
    subcategory?: true
    two_sided?: true
    visibility?: true
  }

  export type PostureCountAggregateInputType = {
    id?: true
    aka?: true
    benefits?: true
    category?: true
    description?: true
    difficulty?: true
    display_name?: true
    name?: true
    next_poses?: true
    preferred_side?: true
    previous_poses?: true
    sideways?: true
    sort_name?: true
    subcategory?: true
    two_sided?: true
    variations?: true
    visibility?: true
    _all?: true
  }

  export type PostureAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Posture to aggregate.
     */
    where?: PostureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Postures to fetch.
     */
    orderBy?: PostureOrderByWithRelationInput | PostureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PostureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Postures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Postures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Postures
    **/
    _count?: true | PostureCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PostureMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PostureMaxAggregateInputType
  }

  export type GetPostureAggregateType<T extends PostureAggregateArgs> = {
        [P in keyof T & keyof AggregatePosture]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePosture[P]>
      : GetScalarType<T[P], AggregatePosture[P]>
  }




  export type PostureGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostureWhereInput
    orderBy?: PostureOrderByWithAggregationInput | PostureOrderByWithAggregationInput[]
    by: PostureScalarFieldEnum[] | PostureScalarFieldEnum
    having?: PostureScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PostureCountAggregateInputType | true
    _min?: PostureMinAggregateInputType
    _max?: PostureMaxAggregateInputType
  }

  export type PostureGroupByOutputType = {
    id: string
    aka: string[]
    benefits: string
    category: string
    description: string
    difficulty: string
    display_name: string
    name: string
    next_poses: string[]
    preferred_side: string
    previous_poses: string[]
    sideways: boolean
    sort_name: string
    subcategory: string
    two_sided: boolean
    variations: JsonValue | null
    visibility: string
    _count: PostureCountAggregateOutputType | null
    _min: PostureMinAggregateOutputType | null
    _max: PostureMaxAggregateOutputType | null
  }

  type GetPostureGroupByPayload<T extends PostureGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostureGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PostureGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PostureGroupByOutputType[P]>
            : GetScalarType<T[P], PostureGroupByOutputType[P]>
        }
      >
    >


  export type PostureSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    aka?: boolean
    benefits?: boolean
    category?: boolean
    description?: boolean
    difficulty?: boolean
    display_name?: boolean
    name?: boolean
    next_poses?: boolean
    preferred_side?: boolean
    previous_poses?: boolean
    sideways?: boolean
    sort_name?: boolean
    subcategory?: boolean
    two_sided?: boolean
    variations?: boolean
    visibility?: boolean
    sanskrit_names?: boolean | Posture$sanskrit_namesArgs<ExtArgs>
    _count?: boolean | PostureCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["posture"]>


  export type PostureSelectScalar = {
    id?: boolean
    aka?: boolean
    benefits?: boolean
    category?: boolean
    description?: boolean
    difficulty?: boolean
    display_name?: boolean
    name?: boolean
    next_poses?: boolean
    preferred_side?: boolean
    previous_poses?: boolean
    sideways?: boolean
    sort_name?: boolean
    subcategory?: boolean
    two_sided?: boolean
    variations?: boolean
    visibility?: boolean
  }

  export type PostureInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sanskrit_names?: boolean | Posture$sanskrit_namesArgs<ExtArgs>
    _count?: boolean | PostureCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $PosturePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Posture"
    objects: {
      sanskrit_names: Prisma.$SanskritNamePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      aka: string[]
      benefits: string
      category: string
      description: string
      difficulty: string
      display_name: string
      name: string
      next_poses: string[]
      preferred_side: string
      previous_poses: string[]
      sideways: boolean
      sort_name: string
      subcategory: string
      two_sided: boolean
      variations: Prisma.JsonValue | null
      visibility: string
    }, ExtArgs["result"]["posture"]>
    composites: {}
  }

  type PostureGetPayload<S extends boolean | null | undefined | PostureDefaultArgs> = $Result.GetResult<Prisma.$PosturePayload, S>

  type PostureCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PostureFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PostureCountAggregateInputType | true
    }

  export interface PostureDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Posture'], meta: { name: 'Posture' } }
    /**
     * Find zero or one Posture that matches the filter.
     * @param {PostureFindUniqueArgs} args - Arguments to find a Posture
     * @example
     * // Get one Posture
     * const posture = await prisma.posture.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PostureFindUniqueArgs>(args: SelectSubset<T, PostureFindUniqueArgs<ExtArgs>>): Prisma__PostureClient<$Result.GetResult<Prisma.$PosturePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Posture that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PostureFindUniqueOrThrowArgs} args - Arguments to find a Posture
     * @example
     * // Get one Posture
     * const posture = await prisma.posture.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PostureFindUniqueOrThrowArgs>(args: SelectSubset<T, PostureFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PostureClient<$Result.GetResult<Prisma.$PosturePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Posture that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostureFindFirstArgs} args - Arguments to find a Posture
     * @example
     * // Get one Posture
     * const posture = await prisma.posture.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PostureFindFirstArgs>(args?: SelectSubset<T, PostureFindFirstArgs<ExtArgs>>): Prisma__PostureClient<$Result.GetResult<Prisma.$PosturePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Posture that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostureFindFirstOrThrowArgs} args - Arguments to find a Posture
     * @example
     * // Get one Posture
     * const posture = await prisma.posture.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PostureFindFirstOrThrowArgs>(args?: SelectSubset<T, PostureFindFirstOrThrowArgs<ExtArgs>>): Prisma__PostureClient<$Result.GetResult<Prisma.$PosturePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Postures that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostureFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Postures
     * const postures = await prisma.posture.findMany()
     * 
     * // Get first 10 Postures
     * const postures = await prisma.posture.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const postureWithIdOnly = await prisma.posture.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PostureFindManyArgs>(args?: SelectSubset<T, PostureFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PosturePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Posture.
     * @param {PostureCreateArgs} args - Arguments to create a Posture.
     * @example
     * // Create one Posture
     * const Posture = await prisma.posture.create({
     *   data: {
     *     // ... data to create a Posture
     *   }
     * })
     * 
     */
    create<T extends PostureCreateArgs>(args: SelectSubset<T, PostureCreateArgs<ExtArgs>>): Prisma__PostureClient<$Result.GetResult<Prisma.$PosturePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Postures.
     * @param {PostureCreateManyArgs} args - Arguments to create many Postures.
     * @example
     * // Create many Postures
     * const posture = await prisma.posture.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PostureCreateManyArgs>(args?: SelectSubset<T, PostureCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Posture.
     * @param {PostureDeleteArgs} args - Arguments to delete one Posture.
     * @example
     * // Delete one Posture
     * const Posture = await prisma.posture.delete({
     *   where: {
     *     // ... filter to delete one Posture
     *   }
     * })
     * 
     */
    delete<T extends PostureDeleteArgs>(args: SelectSubset<T, PostureDeleteArgs<ExtArgs>>): Prisma__PostureClient<$Result.GetResult<Prisma.$PosturePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Posture.
     * @param {PostureUpdateArgs} args - Arguments to update one Posture.
     * @example
     * // Update one Posture
     * const posture = await prisma.posture.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PostureUpdateArgs>(args: SelectSubset<T, PostureUpdateArgs<ExtArgs>>): Prisma__PostureClient<$Result.GetResult<Prisma.$PosturePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Postures.
     * @param {PostureDeleteManyArgs} args - Arguments to filter Postures to delete.
     * @example
     * // Delete a few Postures
     * const { count } = await prisma.posture.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PostureDeleteManyArgs>(args?: SelectSubset<T, PostureDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Postures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostureUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Postures
     * const posture = await prisma.posture.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PostureUpdateManyArgs>(args: SelectSubset<T, PostureUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Posture.
     * @param {PostureUpsertArgs} args - Arguments to update or create a Posture.
     * @example
     * // Update or create a Posture
     * const posture = await prisma.posture.upsert({
     *   create: {
     *     // ... data to create a Posture
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Posture we want to update
     *   }
     * })
     */
    upsert<T extends PostureUpsertArgs>(args: SelectSubset<T, PostureUpsertArgs<ExtArgs>>): Prisma__PostureClient<$Result.GetResult<Prisma.$PosturePayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more Postures that matches the filter.
     * @param {PostureFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const posture = await prisma.posture.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: PostureFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Posture.
     * @param {PostureAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const posture = await prisma.posture.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PostureAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Postures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostureCountArgs} args - Arguments to filter Postures to count.
     * @example
     * // Count the number of Postures
     * const count = await prisma.posture.count({
     *   where: {
     *     // ... the filter for the Postures we want to count
     *   }
     * })
    **/
    count<T extends PostureCountArgs>(
      args?: Subset<T, PostureCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostureCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Posture.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostureAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PostureAggregateArgs>(args: Subset<T, PostureAggregateArgs>): Prisma.PrismaPromise<GetPostureAggregateType<T>>

    /**
     * Group by Posture.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostureGroupByArgs} args - Group by arguments.
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
      T extends PostureGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PostureGroupByArgs['orderBy'] }
        : { orderBy?: PostureGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
        }[OrderFields]
    >(args: SubsetIntersection<T, PostureGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostureGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Posture model
   */
  readonly fields: PostureFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Posture.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PostureClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sanskrit_names<T extends Posture$sanskrit_namesArgs<ExtArgs> = {}>(args?: Subset<T, Posture$sanskrit_namesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SanskritNamePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Posture model
   */ 
  interface PostureFieldRefs {
    readonly id: FieldRef<"Posture", 'String'>
    readonly aka: FieldRef<"Posture", 'String[]'>
    readonly benefits: FieldRef<"Posture", 'String'>
    readonly category: FieldRef<"Posture", 'String'>
    readonly description: FieldRef<"Posture", 'String'>
    readonly difficulty: FieldRef<"Posture", 'String'>
    readonly display_name: FieldRef<"Posture", 'String'>
    readonly name: FieldRef<"Posture", 'String'>
    readonly next_poses: FieldRef<"Posture", 'String[]'>
    readonly preferred_side: FieldRef<"Posture", 'String'>
    readonly previous_poses: FieldRef<"Posture", 'String[]'>
    readonly sideways: FieldRef<"Posture", 'Boolean'>
    readonly sort_name: FieldRef<"Posture", 'String'>
    readonly subcategory: FieldRef<"Posture", 'String'>
    readonly two_sided: FieldRef<"Posture", 'Boolean'>
    readonly variations: FieldRef<"Posture", 'Json'>
    readonly visibility: FieldRef<"Posture", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Posture findUnique
   */
  export type PostureFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Posture
     */
    select?: PostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostureInclude<ExtArgs> | null
    /**
     * Filter, which Posture to fetch.
     */
    where: PostureWhereUniqueInput
  }

  /**
   * Posture findUniqueOrThrow
   */
  export type PostureFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Posture
     */
    select?: PostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostureInclude<ExtArgs> | null
    /**
     * Filter, which Posture to fetch.
     */
    where: PostureWhereUniqueInput
  }

  /**
   * Posture findFirst
   */
  export type PostureFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Posture
     */
    select?: PostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostureInclude<ExtArgs> | null
    /**
     * Filter, which Posture to fetch.
     */
    where?: PostureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Postures to fetch.
     */
    orderBy?: PostureOrderByWithRelationInput | PostureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Postures.
     */
    cursor?: PostureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Postures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Postures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Postures.
     */
    distinct?: PostureScalarFieldEnum | PostureScalarFieldEnum[]
  }

  /**
   * Posture findFirstOrThrow
   */
  export type PostureFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Posture
     */
    select?: PostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostureInclude<ExtArgs> | null
    /**
     * Filter, which Posture to fetch.
     */
    where?: PostureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Postures to fetch.
     */
    orderBy?: PostureOrderByWithRelationInput | PostureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Postures.
     */
    cursor?: PostureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Postures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Postures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Postures.
     */
    distinct?: PostureScalarFieldEnum | PostureScalarFieldEnum[]
  }

  /**
   * Posture findMany
   */
  export type PostureFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Posture
     */
    select?: PostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostureInclude<ExtArgs> | null
    /**
     * Filter, which Postures to fetch.
     */
    where?: PostureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Postures to fetch.
     */
    orderBy?: PostureOrderByWithRelationInput | PostureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Postures.
     */
    cursor?: PostureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Postures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Postures.
     */
    skip?: number
    distinct?: PostureScalarFieldEnum | PostureScalarFieldEnum[]
  }

  /**
   * Posture create
   */
  export type PostureCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Posture
     */
    select?: PostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostureInclude<ExtArgs> | null
    /**
     * The data needed to create a Posture.
     */
    data: XOR<PostureCreateInput, PostureUncheckedCreateInput>
  }

  /**
   * Posture createMany
   */
  export type PostureCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Postures.
     */
    data: PostureCreateManyInput | PostureCreateManyInput[]
  }

  /**
   * Posture update
   */
  export type PostureUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Posture
     */
    select?: PostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostureInclude<ExtArgs> | null
    /**
     * The data needed to update a Posture.
     */
    data: XOR<PostureUpdateInput, PostureUncheckedUpdateInput>
    /**
     * Choose, which Posture to update.
     */
    where: PostureWhereUniqueInput
  }

  /**
   * Posture updateMany
   */
  export type PostureUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Postures.
     */
    data: XOR<PostureUpdateManyMutationInput, PostureUncheckedUpdateManyInput>
    /**
     * Filter which Postures to update
     */
    where?: PostureWhereInput
  }

  /**
   * Posture upsert
   */
  export type PostureUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Posture
     */
    select?: PostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostureInclude<ExtArgs> | null
    /**
     * The filter to search for the Posture to update in case it exists.
     */
    where: PostureWhereUniqueInput
    /**
     * In case the Posture found by the `where` argument doesn't exist, create a new Posture with this data.
     */
    create: XOR<PostureCreateInput, PostureUncheckedCreateInput>
    /**
     * In case the Posture was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PostureUpdateInput, PostureUncheckedUpdateInput>
  }

  /**
   * Posture delete
   */
  export type PostureDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Posture
     */
    select?: PostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostureInclude<ExtArgs> | null
    /**
     * Filter which Posture to delete.
     */
    where: PostureWhereUniqueInput
  }

  /**
   * Posture deleteMany
   */
  export type PostureDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Postures to delete
     */
    where?: PostureWhereInput
  }

  /**
   * Posture findRaw
   */
  export type PostureFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Posture aggregateRaw
   */
  export type PostureAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Posture.sanskrit_names
   */
  export type Posture$sanskrit_namesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SanskritName
     */
    select?: SanskritNameSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SanskritNameInclude<ExtArgs> | null
    where?: SanskritNameWhereInput
    orderBy?: SanskritNameOrderByWithRelationInput | SanskritNameOrderByWithRelationInput[]
    cursor?: SanskritNameWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SanskritNameScalarFieldEnum | SanskritNameScalarFieldEnum[]
  }

  /**
   * Posture without action
   */
  export type PostureDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Posture
     */
    select?: PostureSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostureInclude<ExtArgs> | null
  }


  /**
   * Model SanskritName
   */

  export type AggregateSanskritName = {
    _count: SanskritNameCountAggregateOutputType | null
    _min: SanskritNameMinAggregateOutputType | null
    _max: SanskritNameMaxAggregateOutputType | null
  }

  export type SanskritNameMinAggregateOutputType = {
    id: string | null
    latin: string | null
    devanagari: string | null
    simplified: string | null
    postureId: string | null
  }

  export type SanskritNameMaxAggregateOutputType = {
    id: string | null
    latin: string | null
    devanagari: string | null
    simplified: string | null
    postureId: string | null
  }

  export type SanskritNameCountAggregateOutputType = {
    id: number
    latin: number
    devanagari: number
    simplified: number
    postureId: number
    _all: number
  }


  export type SanskritNameMinAggregateInputType = {
    id?: true
    latin?: true
    devanagari?: true
    simplified?: true
    postureId?: true
  }

  export type SanskritNameMaxAggregateInputType = {
    id?: true
    latin?: true
    devanagari?: true
    simplified?: true
    postureId?: true
  }

  export type SanskritNameCountAggregateInputType = {
    id?: true
    latin?: true
    devanagari?: true
    simplified?: true
    postureId?: true
    _all?: true
  }

  export type SanskritNameAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SanskritName to aggregate.
     */
    where?: SanskritNameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SanskritNames to fetch.
     */
    orderBy?: SanskritNameOrderByWithRelationInput | SanskritNameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SanskritNameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SanskritNames from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SanskritNames.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SanskritNames
    **/
    _count?: true | SanskritNameCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SanskritNameMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SanskritNameMaxAggregateInputType
  }

  export type GetSanskritNameAggregateType<T extends SanskritNameAggregateArgs> = {
        [P in keyof T & keyof AggregateSanskritName]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSanskritName[P]>
      : GetScalarType<T[P], AggregateSanskritName[P]>
  }




  export type SanskritNameGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SanskritNameWhereInput
    orderBy?: SanskritNameOrderByWithAggregationInput | SanskritNameOrderByWithAggregationInput[]
    by: SanskritNameScalarFieldEnum[] | SanskritNameScalarFieldEnum
    having?: SanskritNameScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SanskritNameCountAggregateInputType | true
    _min?: SanskritNameMinAggregateInputType
    _max?: SanskritNameMaxAggregateInputType
  }

  export type SanskritNameGroupByOutputType = {
    id: string
    latin: string
    devanagari: string
    simplified: string
    postureId: string
    _count: SanskritNameCountAggregateOutputType | null
    _min: SanskritNameMinAggregateOutputType | null
    _max: SanskritNameMaxAggregateOutputType | null
  }

  type GetSanskritNameGroupByPayload<T extends SanskritNameGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SanskritNameGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SanskritNameGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SanskritNameGroupByOutputType[P]>
            : GetScalarType<T[P], SanskritNameGroupByOutputType[P]>
        }
      >
    >


  export type SanskritNameSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    latin?: boolean
    devanagari?: boolean
    simplified?: boolean
    postureId?: boolean
    translation?: boolean | SanskritName$translationArgs<ExtArgs>
    posture?: boolean | PostureDefaultArgs<ExtArgs>
    _count?: boolean | SanskritNameCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sanskritName"]>


  export type SanskritNameSelectScalar = {
    id?: boolean
    latin?: boolean
    devanagari?: boolean
    simplified?: boolean
    postureId?: boolean
  }

  export type SanskritNameInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    translation?: boolean | SanskritName$translationArgs<ExtArgs>
    posture?: boolean | PostureDefaultArgs<ExtArgs>
    _count?: boolean | SanskritNameCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $SanskritNamePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SanskritName"
    objects: {
      translation: Prisma.$TranslationPayload<ExtArgs>[]
      posture: Prisma.$PosturePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      latin: string
      devanagari: string
      simplified: string
      postureId: string
    }, ExtArgs["result"]["sanskritName"]>
    composites: {}
  }

  type SanskritNameGetPayload<S extends boolean | null | undefined | SanskritNameDefaultArgs> = $Result.GetResult<Prisma.$SanskritNamePayload, S>

  type SanskritNameCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SanskritNameFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SanskritNameCountAggregateInputType | true
    }

  export interface SanskritNameDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SanskritName'], meta: { name: 'SanskritName' } }
    /**
     * Find zero or one SanskritName that matches the filter.
     * @param {SanskritNameFindUniqueArgs} args - Arguments to find a SanskritName
     * @example
     * // Get one SanskritName
     * const sanskritName = await prisma.sanskritName.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SanskritNameFindUniqueArgs>(args: SelectSubset<T, SanskritNameFindUniqueArgs<ExtArgs>>): Prisma__SanskritNameClient<$Result.GetResult<Prisma.$SanskritNamePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SanskritName that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SanskritNameFindUniqueOrThrowArgs} args - Arguments to find a SanskritName
     * @example
     * // Get one SanskritName
     * const sanskritName = await prisma.sanskritName.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SanskritNameFindUniqueOrThrowArgs>(args: SelectSubset<T, SanskritNameFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SanskritNameClient<$Result.GetResult<Prisma.$SanskritNamePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SanskritName that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SanskritNameFindFirstArgs} args - Arguments to find a SanskritName
     * @example
     * // Get one SanskritName
     * const sanskritName = await prisma.sanskritName.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SanskritNameFindFirstArgs>(args?: SelectSubset<T, SanskritNameFindFirstArgs<ExtArgs>>): Prisma__SanskritNameClient<$Result.GetResult<Prisma.$SanskritNamePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SanskritName that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SanskritNameFindFirstOrThrowArgs} args - Arguments to find a SanskritName
     * @example
     * // Get one SanskritName
     * const sanskritName = await prisma.sanskritName.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SanskritNameFindFirstOrThrowArgs>(args?: SelectSubset<T, SanskritNameFindFirstOrThrowArgs<ExtArgs>>): Prisma__SanskritNameClient<$Result.GetResult<Prisma.$SanskritNamePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SanskritNames that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SanskritNameFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SanskritNames
     * const sanskritNames = await prisma.sanskritName.findMany()
     * 
     * // Get first 10 SanskritNames
     * const sanskritNames = await prisma.sanskritName.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sanskritNameWithIdOnly = await prisma.sanskritName.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SanskritNameFindManyArgs>(args?: SelectSubset<T, SanskritNameFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SanskritNamePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SanskritName.
     * @param {SanskritNameCreateArgs} args - Arguments to create a SanskritName.
     * @example
     * // Create one SanskritName
     * const SanskritName = await prisma.sanskritName.create({
     *   data: {
     *     // ... data to create a SanskritName
     *   }
     * })
     * 
     */
    create<T extends SanskritNameCreateArgs>(args: SelectSubset<T, SanskritNameCreateArgs<ExtArgs>>): Prisma__SanskritNameClient<$Result.GetResult<Prisma.$SanskritNamePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SanskritNames.
     * @param {SanskritNameCreateManyArgs} args - Arguments to create many SanskritNames.
     * @example
     * // Create many SanskritNames
     * const sanskritName = await prisma.sanskritName.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SanskritNameCreateManyArgs>(args?: SelectSubset<T, SanskritNameCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SanskritName.
     * @param {SanskritNameDeleteArgs} args - Arguments to delete one SanskritName.
     * @example
     * // Delete one SanskritName
     * const SanskritName = await prisma.sanskritName.delete({
     *   where: {
     *     // ... filter to delete one SanskritName
     *   }
     * })
     * 
     */
    delete<T extends SanskritNameDeleteArgs>(args: SelectSubset<T, SanskritNameDeleteArgs<ExtArgs>>): Prisma__SanskritNameClient<$Result.GetResult<Prisma.$SanskritNamePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SanskritName.
     * @param {SanskritNameUpdateArgs} args - Arguments to update one SanskritName.
     * @example
     * // Update one SanskritName
     * const sanskritName = await prisma.sanskritName.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SanskritNameUpdateArgs>(args: SelectSubset<T, SanskritNameUpdateArgs<ExtArgs>>): Prisma__SanskritNameClient<$Result.GetResult<Prisma.$SanskritNamePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SanskritNames.
     * @param {SanskritNameDeleteManyArgs} args - Arguments to filter SanskritNames to delete.
     * @example
     * // Delete a few SanskritNames
     * const { count } = await prisma.sanskritName.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SanskritNameDeleteManyArgs>(args?: SelectSubset<T, SanskritNameDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SanskritNames.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SanskritNameUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SanskritNames
     * const sanskritName = await prisma.sanskritName.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SanskritNameUpdateManyArgs>(args: SelectSubset<T, SanskritNameUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SanskritName.
     * @param {SanskritNameUpsertArgs} args - Arguments to update or create a SanskritName.
     * @example
     * // Update or create a SanskritName
     * const sanskritName = await prisma.sanskritName.upsert({
     *   create: {
     *     // ... data to create a SanskritName
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SanskritName we want to update
     *   }
     * })
     */
    upsert<T extends SanskritNameUpsertArgs>(args: SelectSubset<T, SanskritNameUpsertArgs<ExtArgs>>): Prisma__SanskritNameClient<$Result.GetResult<Prisma.$SanskritNamePayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more SanskritNames that matches the filter.
     * @param {SanskritNameFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const sanskritName = await prisma.sanskritName.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: SanskritNameFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a SanskritName.
     * @param {SanskritNameAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const sanskritName = await prisma.sanskritName.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: SanskritNameAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of SanskritNames.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SanskritNameCountArgs} args - Arguments to filter SanskritNames to count.
     * @example
     * // Count the number of SanskritNames
     * const count = await prisma.sanskritName.count({
     *   where: {
     *     // ... the filter for the SanskritNames we want to count
     *   }
     * })
    **/
    count<T extends SanskritNameCountArgs>(
      args?: Subset<T, SanskritNameCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SanskritNameCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SanskritName.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SanskritNameAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SanskritNameAggregateArgs>(args: Subset<T, SanskritNameAggregateArgs>): Prisma.PrismaPromise<GetSanskritNameAggregateType<T>>

    /**
     * Group by SanskritName.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SanskritNameGroupByArgs} args - Group by arguments.
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
      T extends SanskritNameGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SanskritNameGroupByArgs['orderBy'] }
        : { orderBy?: SanskritNameGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
        }[OrderFields]
    >(args: SubsetIntersection<T, SanskritNameGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSanskritNameGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SanskritName model
   */
  readonly fields: SanskritNameFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SanskritName.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SanskritNameClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    translation<T extends SanskritName$translationArgs<ExtArgs> = {}>(args?: Subset<T, SanskritName$translationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "findMany"> | Null>
    posture<T extends PostureDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PostureDefaultArgs<ExtArgs>>): Prisma__PostureClient<$Result.GetResult<Prisma.$PosturePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SanskritName model
   */ 
  interface SanskritNameFieldRefs {
    readonly id: FieldRef<"SanskritName", 'String'>
    readonly latin: FieldRef<"SanskritName", 'String'>
    readonly devanagari: FieldRef<"SanskritName", 'String'>
    readonly simplified: FieldRef<"SanskritName", 'String'>
    readonly postureId: FieldRef<"SanskritName", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SanskritName findUnique
   */
  export type SanskritNameFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SanskritName
     */
    select?: SanskritNameSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SanskritNameInclude<ExtArgs> | null
    /**
     * Filter, which SanskritName to fetch.
     */
    where: SanskritNameWhereUniqueInput
  }

  /**
   * SanskritName findUniqueOrThrow
   */
  export type SanskritNameFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SanskritName
     */
    select?: SanskritNameSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SanskritNameInclude<ExtArgs> | null
    /**
     * Filter, which SanskritName to fetch.
     */
    where: SanskritNameWhereUniqueInput
  }

  /**
   * SanskritName findFirst
   */
  export type SanskritNameFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SanskritName
     */
    select?: SanskritNameSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SanskritNameInclude<ExtArgs> | null
    /**
     * Filter, which SanskritName to fetch.
     */
    where?: SanskritNameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SanskritNames to fetch.
     */
    orderBy?: SanskritNameOrderByWithRelationInput | SanskritNameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SanskritNames.
     */
    cursor?: SanskritNameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SanskritNames from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SanskritNames.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SanskritNames.
     */
    distinct?: SanskritNameScalarFieldEnum | SanskritNameScalarFieldEnum[]
  }

  /**
   * SanskritName findFirstOrThrow
   */
  export type SanskritNameFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SanskritName
     */
    select?: SanskritNameSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SanskritNameInclude<ExtArgs> | null
    /**
     * Filter, which SanskritName to fetch.
     */
    where?: SanskritNameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SanskritNames to fetch.
     */
    orderBy?: SanskritNameOrderByWithRelationInput | SanskritNameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SanskritNames.
     */
    cursor?: SanskritNameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SanskritNames from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SanskritNames.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SanskritNames.
     */
    distinct?: SanskritNameScalarFieldEnum | SanskritNameScalarFieldEnum[]
  }

  /**
   * SanskritName findMany
   */
  export type SanskritNameFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SanskritName
     */
    select?: SanskritNameSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SanskritNameInclude<ExtArgs> | null
    /**
     * Filter, which SanskritNames to fetch.
     */
    where?: SanskritNameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SanskritNames to fetch.
     */
    orderBy?: SanskritNameOrderByWithRelationInput | SanskritNameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SanskritNames.
     */
    cursor?: SanskritNameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SanskritNames from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SanskritNames.
     */
    skip?: number
    distinct?: SanskritNameScalarFieldEnum | SanskritNameScalarFieldEnum[]
  }

  /**
   * SanskritName create
   */
  export type SanskritNameCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SanskritName
     */
    select?: SanskritNameSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SanskritNameInclude<ExtArgs> | null
    /**
     * The data needed to create a SanskritName.
     */
    data: XOR<SanskritNameCreateInput, SanskritNameUncheckedCreateInput>
  }

  /**
   * SanskritName createMany
   */
  export type SanskritNameCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SanskritNames.
     */
    data: SanskritNameCreateManyInput | SanskritNameCreateManyInput[]
  }

  /**
   * SanskritName update
   */
  export type SanskritNameUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SanskritName
     */
    select?: SanskritNameSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SanskritNameInclude<ExtArgs> | null
    /**
     * The data needed to update a SanskritName.
     */
    data: XOR<SanskritNameUpdateInput, SanskritNameUncheckedUpdateInput>
    /**
     * Choose, which SanskritName to update.
     */
    where: SanskritNameWhereUniqueInput
  }

  /**
   * SanskritName updateMany
   */
  export type SanskritNameUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SanskritNames.
     */
    data: XOR<SanskritNameUpdateManyMutationInput, SanskritNameUncheckedUpdateManyInput>
    /**
     * Filter which SanskritNames to update
     */
    where?: SanskritNameWhereInput
  }

  /**
   * SanskritName upsert
   */
  export type SanskritNameUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SanskritName
     */
    select?: SanskritNameSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SanskritNameInclude<ExtArgs> | null
    /**
     * The filter to search for the SanskritName to update in case it exists.
     */
    where: SanskritNameWhereUniqueInput
    /**
     * In case the SanskritName found by the `where` argument doesn't exist, create a new SanskritName with this data.
     */
    create: XOR<SanskritNameCreateInput, SanskritNameUncheckedCreateInput>
    /**
     * In case the SanskritName was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SanskritNameUpdateInput, SanskritNameUncheckedUpdateInput>
  }

  /**
   * SanskritName delete
   */
  export type SanskritNameDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SanskritName
     */
    select?: SanskritNameSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SanskritNameInclude<ExtArgs> | null
    /**
     * Filter which SanskritName to delete.
     */
    where: SanskritNameWhereUniqueInput
  }

  /**
   * SanskritName deleteMany
   */
  export type SanskritNameDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SanskritNames to delete
     */
    where?: SanskritNameWhereInput
  }

  /**
   * SanskritName findRaw
   */
  export type SanskritNameFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * SanskritName aggregateRaw
   */
  export type SanskritNameAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * SanskritName.translation
   */
  export type SanskritName$translationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    where?: TranslationWhereInput
    orderBy?: TranslationOrderByWithRelationInput | TranslationOrderByWithRelationInput[]
    cursor?: TranslationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TranslationScalarFieldEnum | TranslationScalarFieldEnum[]
  }

  /**
   * SanskritName without action
   */
  export type SanskritNameDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SanskritName
     */
    select?: SanskritNameSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SanskritNameInclude<ExtArgs> | null
  }


  /**
   * Model Translation
   */

  export type AggregateTranslation = {
    _count: TranslationCountAggregateOutputType | null
    _min: TranslationMinAggregateOutputType | null
    _max: TranslationMaxAggregateOutputType | null
  }

  export type TranslationMinAggregateOutputType = {
    id: string | null
    latin: string | null
    devanagari: string | null
    simplified: string | null
    description: string | null
    sanskritNameId: string | null
  }

  export type TranslationMaxAggregateOutputType = {
    id: string | null
    latin: string | null
    devanagari: string | null
    simplified: string | null
    description: string | null
    sanskritNameId: string | null
  }

  export type TranslationCountAggregateOutputType = {
    id: number
    latin: number
    devanagari: number
    simplified: number
    description: number
    sanskritNameId: number
    _all: number
  }


  export type TranslationMinAggregateInputType = {
    id?: true
    latin?: true
    devanagari?: true
    simplified?: true
    description?: true
    sanskritNameId?: true
  }

  export type TranslationMaxAggregateInputType = {
    id?: true
    latin?: true
    devanagari?: true
    simplified?: true
    description?: true
    sanskritNameId?: true
  }

  export type TranslationCountAggregateInputType = {
    id?: true
    latin?: true
    devanagari?: true
    simplified?: true
    description?: true
    sanskritNameId?: true
    _all?: true
  }

  export type TranslationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Translation to aggregate.
     */
    where?: TranslationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Translations to fetch.
     */
    orderBy?: TranslationOrderByWithRelationInput | TranslationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TranslationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Translations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Translations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Translations
    **/
    _count?: true | TranslationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TranslationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TranslationMaxAggregateInputType
  }

  export type GetTranslationAggregateType<T extends TranslationAggregateArgs> = {
        [P in keyof T & keyof AggregateTranslation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTranslation[P]>
      : GetScalarType<T[P], AggregateTranslation[P]>
  }




  export type TranslationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranslationWhereInput
    orderBy?: TranslationOrderByWithAggregationInput | TranslationOrderByWithAggregationInput[]
    by: TranslationScalarFieldEnum[] | TranslationScalarFieldEnum
    having?: TranslationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TranslationCountAggregateInputType | true
    _min?: TranslationMinAggregateInputType
    _max?: TranslationMaxAggregateInputType
  }

  export type TranslationGroupByOutputType = {
    id: string
    latin: string
    devanagari: string
    simplified: string
    description: string
    sanskritNameId: string
    _count: TranslationCountAggregateOutputType | null
    _min: TranslationMinAggregateOutputType | null
    _max: TranslationMaxAggregateOutputType | null
  }

  type GetTranslationGroupByPayload<T extends TranslationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TranslationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TranslationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TranslationGroupByOutputType[P]>
            : GetScalarType<T[P], TranslationGroupByOutputType[P]>
        }
      >
    >


  export type TranslationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    latin?: boolean
    devanagari?: boolean
    simplified?: boolean
    description?: boolean
    sanskritNameId?: boolean
    sanskritName?: boolean | SanskritNameDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["translation"]>


  export type TranslationSelectScalar = {
    id?: boolean
    latin?: boolean
    devanagari?: boolean
    simplified?: boolean
    description?: boolean
    sanskritNameId?: boolean
  }

  export type TranslationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sanskritName?: boolean | SanskritNameDefaultArgs<ExtArgs>
  }

  export type $TranslationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Translation"
    objects: {
      sanskritName: Prisma.$SanskritNamePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      latin: string
      devanagari: string
      simplified: string
      description: string
      sanskritNameId: string
    }, ExtArgs["result"]["translation"]>
    composites: {}
  }

  type TranslationGetPayload<S extends boolean | null | undefined | TranslationDefaultArgs> = $Result.GetResult<Prisma.$TranslationPayload, S>

  type TranslationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TranslationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TranslationCountAggregateInputType | true
    }

  export interface TranslationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Translation'], meta: { name: 'Translation' } }
    /**
     * Find zero or one Translation that matches the filter.
     * @param {TranslationFindUniqueArgs} args - Arguments to find a Translation
     * @example
     * // Get one Translation
     * const translation = await prisma.translation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TranslationFindUniqueArgs>(args: SelectSubset<T, TranslationFindUniqueArgs<ExtArgs>>): Prisma__TranslationClient<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Translation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TranslationFindUniqueOrThrowArgs} args - Arguments to find a Translation
     * @example
     * // Get one Translation
     * const translation = await prisma.translation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TranslationFindUniqueOrThrowArgs>(args: SelectSubset<T, TranslationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TranslationClient<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Translation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslationFindFirstArgs} args - Arguments to find a Translation
     * @example
     * // Get one Translation
     * const translation = await prisma.translation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TranslationFindFirstArgs>(args?: SelectSubset<T, TranslationFindFirstArgs<ExtArgs>>): Prisma__TranslationClient<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Translation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslationFindFirstOrThrowArgs} args - Arguments to find a Translation
     * @example
     * // Get one Translation
     * const translation = await prisma.translation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TranslationFindFirstOrThrowArgs>(args?: SelectSubset<T, TranslationFindFirstOrThrowArgs<ExtArgs>>): Prisma__TranslationClient<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Translations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Translations
     * const translations = await prisma.translation.findMany()
     * 
     * // Get first 10 Translations
     * const translations = await prisma.translation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const translationWithIdOnly = await prisma.translation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TranslationFindManyArgs>(args?: SelectSubset<T, TranslationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Translation.
     * @param {TranslationCreateArgs} args - Arguments to create a Translation.
     * @example
     * // Create one Translation
     * const Translation = await prisma.translation.create({
     *   data: {
     *     // ... data to create a Translation
     *   }
     * })
     * 
     */
    create<T extends TranslationCreateArgs>(args: SelectSubset<T, TranslationCreateArgs<ExtArgs>>): Prisma__TranslationClient<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Translations.
     * @param {TranslationCreateManyArgs} args - Arguments to create many Translations.
     * @example
     * // Create many Translations
     * const translation = await prisma.translation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TranslationCreateManyArgs>(args?: SelectSubset<T, TranslationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Translation.
     * @param {TranslationDeleteArgs} args - Arguments to delete one Translation.
     * @example
     * // Delete one Translation
     * const Translation = await prisma.translation.delete({
     *   where: {
     *     // ... filter to delete one Translation
     *   }
     * })
     * 
     */
    delete<T extends TranslationDeleteArgs>(args: SelectSubset<T, TranslationDeleteArgs<ExtArgs>>): Prisma__TranslationClient<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Translation.
     * @param {TranslationUpdateArgs} args - Arguments to update one Translation.
     * @example
     * // Update one Translation
     * const translation = await prisma.translation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TranslationUpdateArgs>(args: SelectSubset<T, TranslationUpdateArgs<ExtArgs>>): Prisma__TranslationClient<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Translations.
     * @param {TranslationDeleteManyArgs} args - Arguments to filter Translations to delete.
     * @example
     * // Delete a few Translations
     * const { count } = await prisma.translation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TranslationDeleteManyArgs>(args?: SelectSubset<T, TranslationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Translations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Translations
     * const translation = await prisma.translation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TranslationUpdateManyArgs>(args: SelectSubset<T, TranslationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Translation.
     * @param {TranslationUpsertArgs} args - Arguments to update or create a Translation.
     * @example
     * // Update or create a Translation
     * const translation = await prisma.translation.upsert({
     *   create: {
     *     // ... data to create a Translation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Translation we want to update
     *   }
     * })
     */
    upsert<T extends TranslationUpsertArgs>(args: SelectSubset<T, TranslationUpsertArgs<ExtArgs>>): Prisma__TranslationClient<$Result.GetResult<Prisma.$TranslationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more Translations that matches the filter.
     * @param {TranslationFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const translation = await prisma.translation.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: TranslationFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Translation.
     * @param {TranslationAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const translation = await prisma.translation.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: TranslationAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Translations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslationCountArgs} args - Arguments to filter Translations to count.
     * @example
     * // Count the number of Translations
     * const count = await prisma.translation.count({
     *   where: {
     *     // ... the filter for the Translations we want to count
     *   }
     * })
    **/
    count<T extends TranslationCountArgs>(
      args?: Subset<T, TranslationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TranslationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Translation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TranslationAggregateArgs>(args: Subset<T, TranslationAggregateArgs>): Prisma.PrismaPromise<GetTranslationAggregateType<T>>

    /**
     * Group by Translation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslationGroupByArgs} args - Group by arguments.
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
      T extends TranslationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TranslationGroupByArgs['orderBy'] }
        : { orderBy?: TranslationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
        }[OrderFields]
    >(args: SubsetIntersection<T, TranslationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTranslationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Translation model
   */
  readonly fields: TranslationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Translation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TranslationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sanskritName<T extends SanskritNameDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SanskritNameDefaultArgs<ExtArgs>>): Prisma__SanskritNameClient<$Result.GetResult<Prisma.$SanskritNamePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Translation model
   */ 
  interface TranslationFieldRefs {
    readonly id: FieldRef<"Translation", 'String'>
    readonly latin: FieldRef<"Translation", 'String'>
    readonly devanagari: FieldRef<"Translation", 'String'>
    readonly simplified: FieldRef<"Translation", 'String'>
    readonly description: FieldRef<"Translation", 'String'>
    readonly sanskritNameId: FieldRef<"Translation", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Translation findUnique
   */
  export type TranslationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    /**
     * Filter, which Translation to fetch.
     */
    where: TranslationWhereUniqueInput
  }

  /**
   * Translation findUniqueOrThrow
   */
  export type TranslationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    /**
     * Filter, which Translation to fetch.
     */
    where: TranslationWhereUniqueInput
  }

  /**
   * Translation findFirst
   */
  export type TranslationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    /**
     * Filter, which Translation to fetch.
     */
    where?: TranslationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Translations to fetch.
     */
    orderBy?: TranslationOrderByWithRelationInput | TranslationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Translations.
     */
    cursor?: TranslationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Translations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Translations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Translations.
     */
    distinct?: TranslationScalarFieldEnum | TranslationScalarFieldEnum[]
  }

  /**
   * Translation findFirstOrThrow
   */
  export type TranslationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    /**
     * Filter, which Translation to fetch.
     */
    where?: TranslationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Translations to fetch.
     */
    orderBy?: TranslationOrderByWithRelationInput | TranslationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Translations.
     */
    cursor?: TranslationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Translations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Translations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Translations.
     */
    distinct?: TranslationScalarFieldEnum | TranslationScalarFieldEnum[]
  }

  /**
   * Translation findMany
   */
  export type TranslationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    /**
     * Filter, which Translations to fetch.
     */
    where?: TranslationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Translations to fetch.
     */
    orderBy?: TranslationOrderByWithRelationInput | TranslationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Translations.
     */
    cursor?: TranslationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Translations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Translations.
     */
    skip?: number
    distinct?: TranslationScalarFieldEnum | TranslationScalarFieldEnum[]
  }

  /**
   * Translation create
   */
  export type TranslationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    /**
     * The data needed to create a Translation.
     */
    data: XOR<TranslationCreateInput, TranslationUncheckedCreateInput>
  }

  /**
   * Translation createMany
   */
  export type TranslationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Translations.
     */
    data: TranslationCreateManyInput | TranslationCreateManyInput[]
  }

  /**
   * Translation update
   */
  export type TranslationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    /**
     * The data needed to update a Translation.
     */
    data: XOR<TranslationUpdateInput, TranslationUncheckedUpdateInput>
    /**
     * Choose, which Translation to update.
     */
    where: TranslationWhereUniqueInput
  }

  /**
   * Translation updateMany
   */
  export type TranslationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Translations.
     */
    data: XOR<TranslationUpdateManyMutationInput, TranslationUncheckedUpdateManyInput>
    /**
     * Filter which Translations to update
     */
    where?: TranslationWhereInput
  }

  /**
   * Translation upsert
   */
  export type TranslationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    /**
     * The filter to search for the Translation to update in case it exists.
     */
    where: TranslationWhereUniqueInput
    /**
     * In case the Translation found by the `where` argument doesn't exist, create a new Translation with this data.
     */
    create: XOR<TranslationCreateInput, TranslationUncheckedCreateInput>
    /**
     * In case the Translation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TranslationUpdateInput, TranslationUncheckedUpdateInput>
  }

  /**
   * Translation delete
   */
  export type TranslationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
    /**
     * Filter which Translation to delete.
     */
    where: TranslationWhereUniqueInput
  }

  /**
   * Translation deleteMany
   */
  export type TranslationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Translations to delete
     */
    where?: TranslationWhereInput
  }

  /**
   * Translation findRaw
   */
  export type TranslationFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Translation aggregateRaw
   */
  export type TranslationAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Translation without action
   */
  export type TranslationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Translation
     */
    select?: TranslationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslationInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const UserDataScalarFieldEnum: {
    id: 'id',
    provider_id: 'provider_id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    pronouns: 'pronouns',
    profile: 'profile',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserDataScalarFieldEnum = (typeof UserDataScalarFieldEnum)[keyof typeof UserDataScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    sessionToken: 'sessionToken',
    userId: 'userId',
    expires: 'expires',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const VerificationTokenScalarFieldEnum: {
    id: 'id',
    identifier: 'identifier',
    token: 'token',
    expires: 'expires'
  };

  export type VerificationTokenScalarFieldEnum = (typeof VerificationTokenScalarFieldEnum)[keyof typeof VerificationTokenScalarFieldEnum]


  export const AuthenticatorScalarFieldEnum: {
    credentialID: 'credentialID',
    userId: 'userId',
    providerAccountId: 'providerAccountId',
    credentialPublicKey: 'credentialPublicKey',
    counter: 'counter',
    credentialDeviceType: 'credentialDeviceType',
    credentialBackedUp: 'credentialBackedUp',
    transports: 'transports'
  };

  export type AuthenticatorScalarFieldEnum = (typeof AuthenticatorScalarFieldEnum)[keyof typeof AuthenticatorScalarFieldEnum]


  export const PractitionerScalarFieldEnum: {
    id: 'id',
    firstName: 'firstName',
    lastName: 'lastName',
    pronouns: 'pronouns',
    emailPublic: 'emailPublic',
    emailInternal: 'emailInternal',
    emailAlternate: 'emailAlternate',
    phoneContact: 'phoneContact',
    bio: 'bio',
    headline: 'headline',
    yogaStyle: 'yogaStyle',
    yogaExperience: 'yogaExperience',
    Facebook: 'Facebook',
    Google: 'Google',
    Patreon: 'Patreon',
    Twitch: 'Twitch',
    Twitter: 'Twitter',
    websiteURL: 'websiteURL',
    blogURL: 'blogURL',
    socialURL: 'socialURL',
    streamingURL: 'streamingURL',
    isInstructor: 'isInstructor',
    isStudent: 'isStudent',
    isPrivate: 'isPrivate',
    calendar: 'calendar',
    timezone: 'timezone',
    location: 'location',
    isLocationPublic: 'isLocationPublic',
    exportAccountInfo: 'exportAccountInfo',
    deleteAccountInfo: 'deleteAccountInfo',
    company: 'company',
    userId: 'userId'
  };

  export type PractitionerScalarFieldEnum = (typeof PractitionerScalarFieldEnum)[keyof typeof PractitionerScalarFieldEnum]


  export const SeriesScalarFieldEnum: {
    id: 'id',
    seriesName: 'seriesName',
    seriesPostures: 'seriesPostures'
  };

  export type SeriesScalarFieldEnum = (typeof SeriesScalarFieldEnum)[keyof typeof SeriesScalarFieldEnum]


  export const FlowSeriesScalarFieldEnum: {
    id: 'id',
    seriesName: 'seriesName',
    seriesSet: 'seriesSet'
  };

  export type FlowSeriesScalarFieldEnum = (typeof FlowSeriesScalarFieldEnum)[keyof typeof FlowSeriesScalarFieldEnum]


  export const SequenceScalarFieldEnum: {
    id: 'id',
    nameSequence: 'nameSequence'
  };

  export type SequenceScalarFieldEnum = (typeof SequenceScalarFieldEnum)[keyof typeof SequenceScalarFieldEnum]


  export const SequencesSeriesScalarFieldEnum: {
    id: 'id',
    seriesName: 'seriesName',
    seriesSet: 'seriesSet',
    sequenceId: 'sequenceId'
  };

  export type SequencesSeriesScalarFieldEnum = (typeof SequencesSeriesScalarFieldEnum)[keyof typeof SequencesSeriesScalarFieldEnum]


  export const PostureScalarFieldEnum: {
    id: 'id',
    aka: 'aka',
    benefits: 'benefits',
    category: 'category',
    description: 'description',
    difficulty: 'difficulty',
    display_name: 'display_name',
    name: 'name',
    next_poses: 'next_poses',
    preferred_side: 'preferred_side',
    previous_poses: 'previous_poses',
    sideways: 'sideways',
    sort_name: 'sort_name',
    subcategory: 'subcategory',
    two_sided: 'two_sided',
    variations: 'variations',
    visibility: 'visibility'
  };

  export type PostureScalarFieldEnum = (typeof PostureScalarFieldEnum)[keyof typeof PostureScalarFieldEnum]


  export const SanskritNameScalarFieldEnum: {
    id: 'id',
    latin: 'latin',
    devanagari: 'devanagari',
    simplified: 'simplified',
    postureId: 'postureId'
  };

  export type SanskritNameScalarFieldEnum = (typeof SanskritNameScalarFieldEnum)[keyof typeof SanskritNameScalarFieldEnum]


  export const TranslationScalarFieldEnum: {
    id: 'id',
    latin: 'latin',
    devanagari: 'devanagari',
    simplified: 'simplified',
    description: 'description',
    sanskritNameId: 'sanskritNameId'
  };

  export type TranslationScalarFieldEnum = (typeof TranslationScalarFieldEnum)[keyof typeof TranslationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserDataWhereInput = {
    AND?: UserDataWhereInput | UserDataWhereInput[]
    OR?: UserDataWhereInput[]
    NOT?: UserDataWhereInput | UserDataWhereInput[]
    id?: StringFilter<"UserData"> | string
    provider_id?: StringNullableFilter<"UserData"> | string | null
    name?: StringNullableFilter<"UserData"> | string | null
    email?: StringNullableFilter<"UserData"> | string | null
    emailVerified?: DateTimeNullableFilter<"UserData"> | Date | string | null
    image?: StringNullableFilter<"UserData"> | string | null
    pronouns?: StringNullableFilter<"UserData"> | string | null
    profile?: JsonNullableFilter<"UserData">
    createdAt?: DateTimeFilter<"UserData"> | Date | string
    updatedAt?: DateTimeFilter<"UserData"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    Authenticator?: AuthenticatorListRelationFilter
    Practitioner?: PractitionerListRelationFilter
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
    accounts?: AccountOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
    Authenticator?: AuthenticatorOrderByRelationAggregateInput
    Practitioner?: PractitionerOrderByRelationAggregateInput
  }

  export type UserDataWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserDataWhereInput | UserDataWhereInput[]
    OR?: UserDataWhereInput[]
    NOT?: UserDataWhereInput | UserDataWhereInput[]
    provider_id?: StringNullableFilter<"UserData"> | string | null
    name?: StringNullableFilter<"UserData"> | string | null
    emailVerified?: DateTimeNullableFilter<"UserData"> | Date | string | null
    image?: StringNullableFilter<"UserData"> | string | null
    pronouns?: StringNullableFilter<"UserData"> | string | null
    profile?: JsonNullableFilter<"UserData">
    createdAt?: DateTimeFilter<"UserData"> | Date | string
    updatedAt?: DateTimeFilter<"UserData"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    Authenticator?: AuthenticatorListRelationFilter
    Practitioner?: PractitionerListRelationFilter
  }, "id" | "email">

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
    _count?: UserDataCountOrderByAggregateInput
    _max?: UserDataMaxOrderByAggregateInput
    _min?: UserDataMinOrderByAggregateInput
  }

  export type UserDataScalarWhereWithAggregatesInput = {
    AND?: UserDataScalarWhereWithAggregatesInput | UserDataScalarWhereWithAggregatesInput[]
    OR?: UserDataScalarWhereWithAggregatesInput[]
    NOT?: UserDataScalarWhereWithAggregatesInput | UserDataScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserData"> | string
    provider_id?: StringNullableWithAggregatesFilter<"UserData"> | string | null
    name?: StringNullableWithAggregatesFilter<"UserData"> | string | null
    email?: StringNullableWithAggregatesFilter<"UserData"> | string | null
    emailVerified?: DateTimeNullableWithAggregatesFilter<"UserData"> | Date | string | null
    image?: StringNullableWithAggregatesFilter<"UserData"> | string | null
    pronouns?: StringNullableWithAggregatesFilter<"UserData"> | string | null
    profile?: JsonNullableWithAggregatesFilter<"UserData">
    createdAt?: DateTimeWithAggregatesFilter<"UserData"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserData"> | Date | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: JsonNullableFilter<"Account">
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserDataRelationFilter, UserDataWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
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
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserDataOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: JsonNullableFilter<"Account">
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserDataRelationFilter, UserDataWhereInput>
  }, "id">

  export type AccountOrderByWithAggregationInput = {
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
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    type?: StringWithAggregatesFilter<"Account"> | string
    provider?: StringWithAggregatesFilter<"Account"> | string
    providerAccountId?: StringWithAggregatesFilter<"Account"> | string
    refresh_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    access_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    expires_at?: IntNullableWithAggregatesFilter<"Account"> | number | null
    token_type?: StringNullableWithAggregatesFilter<"Account"> | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    id_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    session_state?: JsonNullableWithAggregatesFilter<"Account">
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserDataRelationFilter, UserDataWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserDataOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionToken?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserDataRelationFilter, UserDataWhereInput>
  }, "id" | "sessionToken">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    sessionToken?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    expires?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type VerificationTokenWhereInput = {
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    id?: StringFilter<"VerificationToken"> | string
    identifier?: StringFilter<"VerificationToken"> | string
    token?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }

  export type VerificationTokenOrderByWithRelationInput = {
    id?: SortOrder
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    identifier_token?: VerificationTokenIdentifierTokenCompoundUniqueInput
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    token?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }, "id" | "identifier_token">

  export type VerificationTokenOrderByWithAggregationInput = {
    id?: SortOrder
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
    _count?: VerificationTokenCountOrderByAggregateInput
    _max?: VerificationTokenMaxOrderByAggregateInput
    _min?: VerificationTokenMinOrderByAggregateInput
  }

  export type VerificationTokenScalarWhereWithAggregatesInput = {
    AND?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    OR?: VerificationTokenScalarWhereWithAggregatesInput[]
    NOT?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VerificationToken"> | string
    identifier?: StringWithAggregatesFilter<"VerificationToken"> | string
    token?: StringWithAggregatesFilter<"VerificationToken"> | string
    expires?: DateTimeWithAggregatesFilter<"VerificationToken"> | Date | string
  }

  export type AuthenticatorWhereInput = {
    AND?: AuthenticatorWhereInput | AuthenticatorWhereInput[]
    OR?: AuthenticatorWhereInput[]
    NOT?: AuthenticatorWhereInput | AuthenticatorWhereInput[]
    credentialID?: StringFilter<"Authenticator"> | string
    userId?: StringFilter<"Authenticator"> | string
    providerAccountId?: StringFilter<"Authenticator"> | string
    credentialPublicKey?: StringFilter<"Authenticator"> | string
    counter?: IntFilter<"Authenticator"> | number
    credentialDeviceType?: StringFilter<"Authenticator"> | string
    credentialBackedUp?: BoolFilter<"Authenticator"> | boolean
    transports?: StringNullableFilter<"Authenticator"> | string | null
    user?: XOR<UserDataRelationFilter, UserDataWhereInput>
  }

  export type AuthenticatorOrderByWithRelationInput = {
    credentialID?: SortOrder
    userId?: SortOrder
    providerAccountId?: SortOrder
    credentialPublicKey?: SortOrder
    counter?: SortOrder
    credentialDeviceType?: SortOrder
    credentialBackedUp?: SortOrder
    transports?: SortOrder
    user?: UserDataOrderByWithRelationInput
  }

  export type AuthenticatorWhereUniqueInput = Prisma.AtLeast<{
    credentialID?: string
    userId_credentialID?: AuthenticatorUserIdCredentialIDCompoundUniqueInput
    AND?: AuthenticatorWhereInput | AuthenticatorWhereInput[]
    OR?: AuthenticatorWhereInput[]
    NOT?: AuthenticatorWhereInput | AuthenticatorWhereInput[]
    userId?: StringFilter<"Authenticator"> | string
    providerAccountId?: StringFilter<"Authenticator"> | string
    credentialPublicKey?: StringFilter<"Authenticator"> | string
    counter?: IntFilter<"Authenticator"> | number
    credentialDeviceType?: StringFilter<"Authenticator"> | string
    credentialBackedUp?: BoolFilter<"Authenticator"> | boolean
    transports?: StringNullableFilter<"Authenticator"> | string | null
    user?: XOR<UserDataRelationFilter, UserDataWhereInput>
  }, "credentialID" | "userId_credentialID">

  export type AuthenticatorOrderByWithAggregationInput = {
    credentialID?: SortOrder
    userId?: SortOrder
    providerAccountId?: SortOrder
    credentialPublicKey?: SortOrder
    counter?: SortOrder
    credentialDeviceType?: SortOrder
    credentialBackedUp?: SortOrder
    transports?: SortOrder
    _count?: AuthenticatorCountOrderByAggregateInput
    _avg?: AuthenticatorAvgOrderByAggregateInput
    _max?: AuthenticatorMaxOrderByAggregateInput
    _min?: AuthenticatorMinOrderByAggregateInput
    _sum?: AuthenticatorSumOrderByAggregateInput
  }

  export type AuthenticatorScalarWhereWithAggregatesInput = {
    AND?: AuthenticatorScalarWhereWithAggregatesInput | AuthenticatorScalarWhereWithAggregatesInput[]
    OR?: AuthenticatorScalarWhereWithAggregatesInput[]
    NOT?: AuthenticatorScalarWhereWithAggregatesInput | AuthenticatorScalarWhereWithAggregatesInput[]
    credentialID?: StringWithAggregatesFilter<"Authenticator"> | string
    userId?: StringWithAggregatesFilter<"Authenticator"> | string
    providerAccountId?: StringWithAggregatesFilter<"Authenticator"> | string
    credentialPublicKey?: StringWithAggregatesFilter<"Authenticator"> | string
    counter?: IntWithAggregatesFilter<"Authenticator"> | number
    credentialDeviceType?: StringWithAggregatesFilter<"Authenticator"> | string
    credentialBackedUp?: BoolWithAggregatesFilter<"Authenticator"> | boolean
    transports?: StringNullableWithAggregatesFilter<"Authenticator"> | string | null
  }

  export type PractitionerWhereInput = {
    AND?: PractitionerWhereInput | PractitionerWhereInput[]
    OR?: PractitionerWhereInput[]
    NOT?: PractitionerWhereInput | PractitionerWhereInput[]
    id?: StringFilter<"Practitioner"> | string
    firstName?: StringFilter<"Practitioner"> | string
    lastName?: StringFilter<"Practitioner"> | string
    pronouns?: StringFilter<"Practitioner"> | string
    emailPublic?: StringFilter<"Practitioner"> | string
    emailInternal?: StringFilter<"Practitioner"> | string
    emailAlternate?: StringFilter<"Practitioner"> | string
    phoneContact?: StringFilter<"Practitioner"> | string
    bio?: StringFilter<"Practitioner"> | string
    headline?: StringFilter<"Practitioner"> | string
    yogaStyle?: StringFilter<"Practitioner"> | string
    yogaExperience?: StringFilter<"Practitioner"> | string
    Facebook?: StringFilter<"Practitioner"> | string
    Google?: StringFilter<"Practitioner"> | string
    Patreon?: StringFilter<"Practitioner"> | string
    Twitch?: StringFilter<"Practitioner"> | string
    Twitter?: StringFilter<"Practitioner"> | string
    websiteURL?: StringFilter<"Practitioner"> | string
    blogURL?: StringFilter<"Practitioner"> | string
    socialURL?: StringFilter<"Practitioner"> | string
    streamingURL?: StringFilter<"Practitioner"> | string
    isInstructor?: StringFilter<"Practitioner"> | string
    isStudent?: StringFilter<"Practitioner"> | string
    isPrivate?: StringFilter<"Practitioner"> | string
    calendar?: StringFilter<"Practitioner"> | string
    timezone?: StringFilter<"Practitioner"> | string
    location?: StringFilter<"Practitioner"> | string
    isLocationPublic?: StringFilter<"Practitioner"> | string
    exportAccountInfo?: StringFilter<"Practitioner"> | string
    deleteAccountInfo?: StringFilter<"Practitioner"> | string
    company?: StringFilter<"Practitioner"> | string
    userId?: StringFilter<"Practitioner"> | string
    user?: XOR<UserDataRelationFilter, UserDataWhereInput>
  }

  export type PractitionerOrderByWithRelationInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    pronouns?: SortOrder
    emailPublic?: SortOrder
    emailInternal?: SortOrder
    emailAlternate?: SortOrder
    phoneContact?: SortOrder
    bio?: SortOrder
    headline?: SortOrder
    yogaStyle?: SortOrder
    yogaExperience?: SortOrder
    Facebook?: SortOrder
    Google?: SortOrder
    Patreon?: SortOrder
    Twitch?: SortOrder
    Twitter?: SortOrder
    websiteURL?: SortOrder
    blogURL?: SortOrder
    socialURL?: SortOrder
    streamingURL?: SortOrder
    isInstructor?: SortOrder
    isStudent?: SortOrder
    isPrivate?: SortOrder
    calendar?: SortOrder
    timezone?: SortOrder
    location?: SortOrder
    isLocationPublic?: SortOrder
    exportAccountInfo?: SortOrder
    deleteAccountInfo?: SortOrder
    company?: SortOrder
    userId?: SortOrder
    user?: UserDataOrderByWithRelationInput
  }

  export type PractitionerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PractitionerWhereInput | PractitionerWhereInput[]
    OR?: PractitionerWhereInput[]
    NOT?: PractitionerWhereInput | PractitionerWhereInput[]
    firstName?: StringFilter<"Practitioner"> | string
    lastName?: StringFilter<"Practitioner"> | string
    pronouns?: StringFilter<"Practitioner"> | string
    emailPublic?: StringFilter<"Practitioner"> | string
    emailInternal?: StringFilter<"Practitioner"> | string
    emailAlternate?: StringFilter<"Practitioner"> | string
    phoneContact?: StringFilter<"Practitioner"> | string
    bio?: StringFilter<"Practitioner"> | string
    headline?: StringFilter<"Practitioner"> | string
    yogaStyle?: StringFilter<"Practitioner"> | string
    yogaExperience?: StringFilter<"Practitioner"> | string
    Facebook?: StringFilter<"Practitioner"> | string
    Google?: StringFilter<"Practitioner"> | string
    Patreon?: StringFilter<"Practitioner"> | string
    Twitch?: StringFilter<"Practitioner"> | string
    Twitter?: StringFilter<"Practitioner"> | string
    websiteURL?: StringFilter<"Practitioner"> | string
    blogURL?: StringFilter<"Practitioner"> | string
    socialURL?: StringFilter<"Practitioner"> | string
    streamingURL?: StringFilter<"Practitioner"> | string
    isInstructor?: StringFilter<"Practitioner"> | string
    isStudent?: StringFilter<"Practitioner"> | string
    isPrivate?: StringFilter<"Practitioner"> | string
    calendar?: StringFilter<"Practitioner"> | string
    timezone?: StringFilter<"Practitioner"> | string
    location?: StringFilter<"Practitioner"> | string
    isLocationPublic?: StringFilter<"Practitioner"> | string
    exportAccountInfo?: StringFilter<"Practitioner"> | string
    deleteAccountInfo?: StringFilter<"Practitioner"> | string
    company?: StringFilter<"Practitioner"> | string
    userId?: StringFilter<"Practitioner"> | string
    user?: XOR<UserDataRelationFilter, UserDataWhereInput>
  }, "id">

  export type PractitionerOrderByWithAggregationInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    pronouns?: SortOrder
    emailPublic?: SortOrder
    emailInternal?: SortOrder
    emailAlternate?: SortOrder
    phoneContact?: SortOrder
    bio?: SortOrder
    headline?: SortOrder
    yogaStyle?: SortOrder
    yogaExperience?: SortOrder
    Facebook?: SortOrder
    Google?: SortOrder
    Patreon?: SortOrder
    Twitch?: SortOrder
    Twitter?: SortOrder
    websiteURL?: SortOrder
    blogURL?: SortOrder
    socialURL?: SortOrder
    streamingURL?: SortOrder
    isInstructor?: SortOrder
    isStudent?: SortOrder
    isPrivate?: SortOrder
    calendar?: SortOrder
    timezone?: SortOrder
    location?: SortOrder
    isLocationPublic?: SortOrder
    exportAccountInfo?: SortOrder
    deleteAccountInfo?: SortOrder
    company?: SortOrder
    userId?: SortOrder
    _count?: PractitionerCountOrderByAggregateInput
    _max?: PractitionerMaxOrderByAggregateInput
    _min?: PractitionerMinOrderByAggregateInput
  }

  export type PractitionerScalarWhereWithAggregatesInput = {
    AND?: PractitionerScalarWhereWithAggregatesInput | PractitionerScalarWhereWithAggregatesInput[]
    OR?: PractitionerScalarWhereWithAggregatesInput[]
    NOT?: PractitionerScalarWhereWithAggregatesInput | PractitionerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Practitioner"> | string
    firstName?: StringWithAggregatesFilter<"Practitioner"> | string
    lastName?: StringWithAggregatesFilter<"Practitioner"> | string
    pronouns?: StringWithAggregatesFilter<"Practitioner"> | string
    emailPublic?: StringWithAggregatesFilter<"Practitioner"> | string
    emailInternal?: StringWithAggregatesFilter<"Practitioner"> | string
    emailAlternate?: StringWithAggregatesFilter<"Practitioner"> | string
    phoneContact?: StringWithAggregatesFilter<"Practitioner"> | string
    bio?: StringWithAggregatesFilter<"Practitioner"> | string
    headline?: StringWithAggregatesFilter<"Practitioner"> | string
    yogaStyle?: StringWithAggregatesFilter<"Practitioner"> | string
    yogaExperience?: StringWithAggregatesFilter<"Practitioner"> | string
    Facebook?: StringWithAggregatesFilter<"Practitioner"> | string
    Google?: StringWithAggregatesFilter<"Practitioner"> | string
    Patreon?: StringWithAggregatesFilter<"Practitioner"> | string
    Twitch?: StringWithAggregatesFilter<"Practitioner"> | string
    Twitter?: StringWithAggregatesFilter<"Practitioner"> | string
    websiteURL?: StringWithAggregatesFilter<"Practitioner"> | string
    blogURL?: StringWithAggregatesFilter<"Practitioner"> | string
    socialURL?: StringWithAggregatesFilter<"Practitioner"> | string
    streamingURL?: StringWithAggregatesFilter<"Practitioner"> | string
    isInstructor?: StringWithAggregatesFilter<"Practitioner"> | string
    isStudent?: StringWithAggregatesFilter<"Practitioner"> | string
    isPrivate?: StringWithAggregatesFilter<"Practitioner"> | string
    calendar?: StringWithAggregatesFilter<"Practitioner"> | string
    timezone?: StringWithAggregatesFilter<"Practitioner"> | string
    location?: StringWithAggregatesFilter<"Practitioner"> | string
    isLocationPublic?: StringWithAggregatesFilter<"Practitioner"> | string
    exportAccountInfo?: StringWithAggregatesFilter<"Practitioner"> | string
    deleteAccountInfo?: StringWithAggregatesFilter<"Practitioner"> | string
    company?: StringWithAggregatesFilter<"Practitioner"> | string
    userId?: StringWithAggregatesFilter<"Practitioner"> | string
  }

  export type SeriesWhereInput = {
    AND?: SeriesWhereInput | SeriesWhereInput[]
    OR?: SeriesWhereInput[]
    NOT?: SeriesWhereInput | SeriesWhereInput[]
    id?: StringFilter<"Series"> | string
    seriesName?: StringFilter<"Series"> | string
    seriesPostures?: StringNullableListFilter<"Series">
  }

  export type SeriesOrderByWithRelationInput = {
    id?: SortOrder
    seriesName?: SortOrder
    seriesPostures?: SortOrder
  }

  export type SeriesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SeriesWhereInput | SeriesWhereInput[]
    OR?: SeriesWhereInput[]
    NOT?: SeriesWhereInput | SeriesWhereInput[]
    seriesName?: StringFilter<"Series"> | string
    seriesPostures?: StringNullableListFilter<"Series">
  }, "id">

  export type SeriesOrderByWithAggregationInput = {
    id?: SortOrder
    seriesName?: SortOrder
    seriesPostures?: SortOrder
    _count?: SeriesCountOrderByAggregateInput
    _max?: SeriesMaxOrderByAggregateInput
    _min?: SeriesMinOrderByAggregateInput
  }

  export type SeriesScalarWhereWithAggregatesInput = {
    AND?: SeriesScalarWhereWithAggregatesInput | SeriesScalarWhereWithAggregatesInput[]
    OR?: SeriesScalarWhereWithAggregatesInput[]
    NOT?: SeriesScalarWhereWithAggregatesInput | SeriesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Series"> | string
    seriesName?: StringWithAggregatesFilter<"Series"> | string
    seriesPostures?: StringNullableListFilter<"Series">
  }

  export type FlowSeriesWhereInput = {
    AND?: FlowSeriesWhereInput | FlowSeriesWhereInput[]
    OR?: FlowSeriesWhereInput[]
    NOT?: FlowSeriesWhereInput | FlowSeriesWhereInput[]
    id?: StringFilter<"FlowSeries"> | string
    seriesName?: StringFilter<"FlowSeries"> | string
    seriesSet?: StringFilter<"FlowSeries"> | string
  }

  export type FlowSeriesOrderByWithRelationInput = {
    id?: SortOrder
    seriesName?: SortOrder
    seriesSet?: SortOrder
  }

  export type FlowSeriesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FlowSeriesWhereInput | FlowSeriesWhereInput[]
    OR?: FlowSeriesWhereInput[]
    NOT?: FlowSeriesWhereInput | FlowSeriesWhereInput[]
    seriesName?: StringFilter<"FlowSeries"> | string
    seriesSet?: StringFilter<"FlowSeries"> | string
  }, "id">

  export type FlowSeriesOrderByWithAggregationInput = {
    id?: SortOrder
    seriesName?: SortOrder
    seriesSet?: SortOrder
    _count?: FlowSeriesCountOrderByAggregateInput
    _max?: FlowSeriesMaxOrderByAggregateInput
    _min?: FlowSeriesMinOrderByAggregateInput
  }

  export type FlowSeriesScalarWhereWithAggregatesInput = {
    AND?: FlowSeriesScalarWhereWithAggregatesInput | FlowSeriesScalarWhereWithAggregatesInput[]
    OR?: FlowSeriesScalarWhereWithAggregatesInput[]
    NOT?: FlowSeriesScalarWhereWithAggregatesInput | FlowSeriesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FlowSeries"> | string
    seriesName?: StringWithAggregatesFilter<"FlowSeries"> | string
    seriesSet?: StringWithAggregatesFilter<"FlowSeries"> | string
  }

  export type SequenceWhereInput = {
    AND?: SequenceWhereInput | SequenceWhereInput[]
    OR?: SequenceWhereInput[]
    NOT?: SequenceWhereInput | SequenceWhereInput[]
    id?: StringFilter<"Sequence"> | string
    nameSequence?: StringFilter<"Sequence"> | string
    sequencesSeries?: SequencesSeriesListRelationFilter
  }

  export type SequenceOrderByWithRelationInput = {
    id?: SortOrder
    nameSequence?: SortOrder
    sequencesSeries?: SequencesSeriesOrderByRelationAggregateInput
  }

  export type SequenceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SequenceWhereInput | SequenceWhereInput[]
    OR?: SequenceWhereInput[]
    NOT?: SequenceWhereInput | SequenceWhereInput[]
    nameSequence?: StringFilter<"Sequence"> | string
    sequencesSeries?: SequencesSeriesListRelationFilter
  }, "id">

  export type SequenceOrderByWithAggregationInput = {
    id?: SortOrder
    nameSequence?: SortOrder
    _count?: SequenceCountOrderByAggregateInput
    _max?: SequenceMaxOrderByAggregateInput
    _min?: SequenceMinOrderByAggregateInput
  }

  export type SequenceScalarWhereWithAggregatesInput = {
    AND?: SequenceScalarWhereWithAggregatesInput | SequenceScalarWhereWithAggregatesInput[]
    OR?: SequenceScalarWhereWithAggregatesInput[]
    NOT?: SequenceScalarWhereWithAggregatesInput | SequenceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Sequence"> | string
    nameSequence?: StringWithAggregatesFilter<"Sequence"> | string
  }

  export type SequencesSeriesWhereInput = {
    AND?: SequencesSeriesWhereInput | SequencesSeriesWhereInput[]
    OR?: SequencesSeriesWhereInput[]
    NOT?: SequencesSeriesWhereInput | SequencesSeriesWhereInput[]
    id?: StringFilter<"SequencesSeries"> | string
    seriesName?: StringFilter<"SequencesSeries"> | string
    seriesSet?: StringNullableListFilter<"SequencesSeries">
    sequenceId?: StringFilter<"SequencesSeries"> | string
    sequence?: XOR<SequenceRelationFilter, SequenceWhereInput>
  }

  export type SequencesSeriesOrderByWithRelationInput = {
    id?: SortOrder
    seriesName?: SortOrder
    seriesSet?: SortOrder
    sequenceId?: SortOrder
    sequence?: SequenceOrderByWithRelationInput
  }

  export type SequencesSeriesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SequencesSeriesWhereInput | SequencesSeriesWhereInput[]
    OR?: SequencesSeriesWhereInput[]
    NOT?: SequencesSeriesWhereInput | SequencesSeriesWhereInput[]
    seriesName?: StringFilter<"SequencesSeries"> | string
    seriesSet?: StringNullableListFilter<"SequencesSeries">
    sequenceId?: StringFilter<"SequencesSeries"> | string
    sequence?: XOR<SequenceRelationFilter, SequenceWhereInput>
  }, "id">

  export type SequencesSeriesOrderByWithAggregationInput = {
    id?: SortOrder
    seriesName?: SortOrder
    seriesSet?: SortOrder
    sequenceId?: SortOrder
    _count?: SequencesSeriesCountOrderByAggregateInput
    _max?: SequencesSeriesMaxOrderByAggregateInput
    _min?: SequencesSeriesMinOrderByAggregateInput
  }

  export type SequencesSeriesScalarWhereWithAggregatesInput = {
    AND?: SequencesSeriesScalarWhereWithAggregatesInput | SequencesSeriesScalarWhereWithAggregatesInput[]
    OR?: SequencesSeriesScalarWhereWithAggregatesInput[]
    NOT?: SequencesSeriesScalarWhereWithAggregatesInput | SequencesSeriesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SequencesSeries"> | string
    seriesName?: StringWithAggregatesFilter<"SequencesSeries"> | string
    seriesSet?: StringNullableListFilter<"SequencesSeries">
    sequenceId?: StringWithAggregatesFilter<"SequencesSeries"> | string
  }

  export type PostureWhereInput = {
    AND?: PostureWhereInput | PostureWhereInput[]
    OR?: PostureWhereInput[]
    NOT?: PostureWhereInput | PostureWhereInput[]
    id?: StringFilter<"Posture"> | string
    aka?: StringNullableListFilter<"Posture">
    benefits?: StringFilter<"Posture"> | string
    category?: StringFilter<"Posture"> | string
    description?: StringFilter<"Posture"> | string
    difficulty?: StringFilter<"Posture"> | string
    display_name?: StringFilter<"Posture"> | string
    name?: StringFilter<"Posture"> | string
    next_poses?: StringNullableListFilter<"Posture">
    preferred_side?: StringFilter<"Posture"> | string
    previous_poses?: StringNullableListFilter<"Posture">
    sideways?: BoolFilter<"Posture"> | boolean
    sort_name?: StringFilter<"Posture"> | string
    subcategory?: StringFilter<"Posture"> | string
    two_sided?: BoolFilter<"Posture"> | boolean
    variations?: JsonNullableFilter<"Posture">
    visibility?: StringFilter<"Posture"> | string
    sanskrit_names?: SanskritNameListRelationFilter
  }

  export type PostureOrderByWithRelationInput = {
    id?: SortOrder
    aka?: SortOrder
    benefits?: SortOrder
    category?: SortOrder
    description?: SortOrder
    difficulty?: SortOrder
    display_name?: SortOrder
    name?: SortOrder
    next_poses?: SortOrder
    preferred_side?: SortOrder
    previous_poses?: SortOrder
    sideways?: SortOrder
    sort_name?: SortOrder
    subcategory?: SortOrder
    two_sided?: SortOrder
    variations?: SortOrder
    visibility?: SortOrder
    sanskrit_names?: SanskritNameOrderByRelationAggregateInput
  }

  export type PostureWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PostureWhereInput | PostureWhereInput[]
    OR?: PostureWhereInput[]
    NOT?: PostureWhereInput | PostureWhereInput[]
    aka?: StringNullableListFilter<"Posture">
    benefits?: StringFilter<"Posture"> | string
    category?: StringFilter<"Posture"> | string
    description?: StringFilter<"Posture"> | string
    difficulty?: StringFilter<"Posture"> | string
    display_name?: StringFilter<"Posture"> | string
    name?: StringFilter<"Posture"> | string
    next_poses?: StringNullableListFilter<"Posture">
    preferred_side?: StringFilter<"Posture"> | string
    previous_poses?: StringNullableListFilter<"Posture">
    sideways?: BoolFilter<"Posture"> | boolean
    sort_name?: StringFilter<"Posture"> | string
    subcategory?: StringFilter<"Posture"> | string
    two_sided?: BoolFilter<"Posture"> | boolean
    variations?: JsonNullableFilter<"Posture">
    visibility?: StringFilter<"Posture"> | string
    sanskrit_names?: SanskritNameListRelationFilter
  }, "id">

  export type PostureOrderByWithAggregationInput = {
    id?: SortOrder
    aka?: SortOrder
    benefits?: SortOrder
    category?: SortOrder
    description?: SortOrder
    difficulty?: SortOrder
    display_name?: SortOrder
    name?: SortOrder
    next_poses?: SortOrder
    preferred_side?: SortOrder
    previous_poses?: SortOrder
    sideways?: SortOrder
    sort_name?: SortOrder
    subcategory?: SortOrder
    two_sided?: SortOrder
    variations?: SortOrder
    visibility?: SortOrder
    _count?: PostureCountOrderByAggregateInput
    _max?: PostureMaxOrderByAggregateInput
    _min?: PostureMinOrderByAggregateInput
  }

  export type PostureScalarWhereWithAggregatesInput = {
    AND?: PostureScalarWhereWithAggregatesInput | PostureScalarWhereWithAggregatesInput[]
    OR?: PostureScalarWhereWithAggregatesInput[]
    NOT?: PostureScalarWhereWithAggregatesInput | PostureScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Posture"> | string
    aka?: StringNullableListFilter<"Posture">
    benefits?: StringWithAggregatesFilter<"Posture"> | string
    category?: StringWithAggregatesFilter<"Posture"> | string
    description?: StringWithAggregatesFilter<"Posture"> | string
    difficulty?: StringWithAggregatesFilter<"Posture"> | string
    display_name?: StringWithAggregatesFilter<"Posture"> | string
    name?: StringWithAggregatesFilter<"Posture"> | string
    next_poses?: StringNullableListFilter<"Posture">
    preferred_side?: StringWithAggregatesFilter<"Posture"> | string
    previous_poses?: StringNullableListFilter<"Posture">
    sideways?: BoolWithAggregatesFilter<"Posture"> | boolean
    sort_name?: StringWithAggregatesFilter<"Posture"> | string
    subcategory?: StringWithAggregatesFilter<"Posture"> | string
    two_sided?: BoolWithAggregatesFilter<"Posture"> | boolean
    variations?: JsonNullableWithAggregatesFilter<"Posture">
    visibility?: StringWithAggregatesFilter<"Posture"> | string
  }

  export type SanskritNameWhereInput = {
    AND?: SanskritNameWhereInput | SanskritNameWhereInput[]
    OR?: SanskritNameWhereInput[]
    NOT?: SanskritNameWhereInput | SanskritNameWhereInput[]
    id?: StringFilter<"SanskritName"> | string
    latin?: StringFilter<"SanskritName"> | string
    devanagari?: StringFilter<"SanskritName"> | string
    simplified?: StringFilter<"SanskritName"> | string
    postureId?: StringFilter<"SanskritName"> | string
    translation?: TranslationListRelationFilter
    posture?: XOR<PostureRelationFilter, PostureWhereInput>
  }

  export type SanskritNameOrderByWithRelationInput = {
    id?: SortOrder
    latin?: SortOrder
    devanagari?: SortOrder
    simplified?: SortOrder
    postureId?: SortOrder
    translation?: TranslationOrderByRelationAggregateInput
    posture?: PostureOrderByWithRelationInput
  }

  export type SanskritNameWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SanskritNameWhereInput | SanskritNameWhereInput[]
    OR?: SanskritNameWhereInput[]
    NOT?: SanskritNameWhereInput | SanskritNameWhereInput[]
    latin?: StringFilter<"SanskritName"> | string
    devanagari?: StringFilter<"SanskritName"> | string
    simplified?: StringFilter<"SanskritName"> | string
    postureId?: StringFilter<"SanskritName"> | string
    translation?: TranslationListRelationFilter
    posture?: XOR<PostureRelationFilter, PostureWhereInput>
  }, "id">

  export type SanskritNameOrderByWithAggregationInput = {
    id?: SortOrder
    latin?: SortOrder
    devanagari?: SortOrder
    simplified?: SortOrder
    postureId?: SortOrder
    _count?: SanskritNameCountOrderByAggregateInput
    _max?: SanskritNameMaxOrderByAggregateInput
    _min?: SanskritNameMinOrderByAggregateInput
  }

  export type SanskritNameScalarWhereWithAggregatesInput = {
    AND?: SanskritNameScalarWhereWithAggregatesInput | SanskritNameScalarWhereWithAggregatesInput[]
    OR?: SanskritNameScalarWhereWithAggregatesInput[]
    NOT?: SanskritNameScalarWhereWithAggregatesInput | SanskritNameScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SanskritName"> | string
    latin?: StringWithAggregatesFilter<"SanskritName"> | string
    devanagari?: StringWithAggregatesFilter<"SanskritName"> | string
    simplified?: StringWithAggregatesFilter<"SanskritName"> | string
    postureId?: StringWithAggregatesFilter<"SanskritName"> | string
  }

  export type TranslationWhereInput = {
    AND?: TranslationWhereInput | TranslationWhereInput[]
    OR?: TranslationWhereInput[]
    NOT?: TranslationWhereInput | TranslationWhereInput[]
    id?: StringFilter<"Translation"> | string
    latin?: StringFilter<"Translation"> | string
    devanagari?: StringFilter<"Translation"> | string
    simplified?: StringFilter<"Translation"> | string
    description?: StringFilter<"Translation"> | string
    sanskritNameId?: StringFilter<"Translation"> | string
    sanskritName?: XOR<SanskritNameRelationFilter, SanskritNameWhereInput>
  }

  export type TranslationOrderByWithRelationInput = {
    id?: SortOrder
    latin?: SortOrder
    devanagari?: SortOrder
    simplified?: SortOrder
    description?: SortOrder
    sanskritNameId?: SortOrder
    sanskritName?: SanskritNameOrderByWithRelationInput
  }

  export type TranslationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TranslationWhereInput | TranslationWhereInput[]
    OR?: TranslationWhereInput[]
    NOT?: TranslationWhereInput | TranslationWhereInput[]
    latin?: StringFilter<"Translation"> | string
    devanagari?: StringFilter<"Translation"> | string
    simplified?: StringFilter<"Translation"> | string
    description?: StringFilter<"Translation"> | string
    sanskritNameId?: StringFilter<"Translation"> | string
    sanskritName?: XOR<SanskritNameRelationFilter, SanskritNameWhereInput>
  }, "id">

  export type TranslationOrderByWithAggregationInput = {
    id?: SortOrder
    latin?: SortOrder
    devanagari?: SortOrder
    simplified?: SortOrder
    description?: SortOrder
    sanskritNameId?: SortOrder
    _count?: TranslationCountOrderByAggregateInput
    _max?: TranslationMaxOrderByAggregateInput
    _min?: TranslationMinOrderByAggregateInput
  }

  export type TranslationScalarWhereWithAggregatesInput = {
    AND?: TranslationScalarWhereWithAggregatesInput | TranslationScalarWhereWithAggregatesInput[]
    OR?: TranslationScalarWhereWithAggregatesInput[]
    NOT?: TranslationScalarWhereWithAggregatesInput | TranslationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Translation"> | string
    latin?: StringWithAggregatesFilter<"Translation"> | string
    devanagari?: StringWithAggregatesFilter<"Translation"> | string
    simplified?: StringWithAggregatesFilter<"Translation"> | string
    description?: StringWithAggregatesFilter<"Translation"> | string
    sanskritNameId?: StringWithAggregatesFilter<"Translation"> | string
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
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput
    Practitioner?: PractitionerCreateNestedManyWithoutUserInput
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
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput
    Practitioner?: PractitionerUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserDataUpdateInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput
    Practitioner?: PractitionerUpdateManyWithoutUserNestedInput
  }

  export type UserDataUncheckedUpdateInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput
    Practitioner?: PractitionerUncheckedUpdateManyWithoutUserNestedInput
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
  }

  export type UserDataUpdateManyMutationInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserDataUncheckedUpdateManyInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateInput = {
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
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserDataCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
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
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateInput = {
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserDataUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyInput = {
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
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateManyMutationInput = {
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserDataCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserDataUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateInput = {
    id?: string
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUncheckedCreateInput = {
    id?: string
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateManyInput = {
    id?: string
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateManyMutationInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateManyInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthenticatorCreateInput = {
    credentialID: string
    providerAccountId: string
    credentialPublicKey: string
    counter: number
    credentialDeviceType: string
    credentialBackedUp: boolean
    transports?: string | null
    user: UserDataCreateNestedOneWithoutAuthenticatorInput
  }

  export type AuthenticatorUncheckedCreateInput = {
    credentialID: string
    userId: string
    providerAccountId: string
    credentialPublicKey: string
    counter: number
    credentialDeviceType: string
    credentialBackedUp: boolean
    transports?: string | null
  }

  export type AuthenticatorUpdateInput = {
    providerAccountId?: StringFieldUpdateOperationsInput | string
    credentialPublicKey?: StringFieldUpdateOperationsInput | string
    counter?: IntFieldUpdateOperationsInput | number
    credentialDeviceType?: StringFieldUpdateOperationsInput | string
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean
    transports?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserDataUpdateOneRequiredWithoutAuthenticatorNestedInput
  }

  export type AuthenticatorUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    credentialPublicKey?: StringFieldUpdateOperationsInput | string
    counter?: IntFieldUpdateOperationsInput | number
    credentialDeviceType?: StringFieldUpdateOperationsInput | string
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean
    transports?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuthenticatorCreateManyInput = {
    credentialID: string
    userId: string
    providerAccountId: string
    credentialPublicKey: string
    counter: number
    credentialDeviceType: string
    credentialBackedUp: boolean
    transports?: string | null
  }

  export type AuthenticatorUpdateManyMutationInput = {
    providerAccountId?: StringFieldUpdateOperationsInput | string
    credentialPublicKey?: StringFieldUpdateOperationsInput | string
    counter?: IntFieldUpdateOperationsInput | number
    credentialDeviceType?: StringFieldUpdateOperationsInput | string
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean
    transports?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuthenticatorUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    credentialPublicKey?: StringFieldUpdateOperationsInput | string
    counter?: IntFieldUpdateOperationsInput | number
    credentialDeviceType?: StringFieldUpdateOperationsInput | string
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean
    transports?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PractitionerCreateInput = {
    id?: string
    firstName: string
    lastName: string
    pronouns: string
    emailPublic: string
    emailInternal: string
    emailAlternate: string
    phoneContact: string
    bio: string
    headline: string
    yogaStyle: string
    yogaExperience: string
    Facebook: string
    Google: string
    Patreon: string
    Twitch: string
    Twitter: string
    websiteURL: string
    blogURL: string
    socialURL: string
    streamingURL: string
    isInstructor: string
    isStudent: string
    isPrivate: string
    calendar: string
    timezone: string
    location: string
    isLocationPublic: string
    exportAccountInfo: string
    deleteAccountInfo: string
    company: string
    user: UserDataCreateNestedOneWithoutPractitionerInput
  }

  export type PractitionerUncheckedCreateInput = {
    id?: string
    firstName: string
    lastName: string
    pronouns: string
    emailPublic: string
    emailInternal: string
    emailAlternate: string
    phoneContact: string
    bio: string
    headline: string
    yogaStyle: string
    yogaExperience: string
    Facebook: string
    Google: string
    Patreon: string
    Twitch: string
    Twitter: string
    websiteURL: string
    blogURL: string
    socialURL: string
    streamingURL: string
    isInstructor: string
    isStudent: string
    isPrivate: string
    calendar: string
    timezone: string
    location: string
    isLocationPublic: string
    exportAccountInfo: string
    deleteAccountInfo: string
    company: string
    userId: string
  }

  export type PractitionerUpdateInput = {
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    pronouns?: StringFieldUpdateOperationsInput | string
    emailPublic?: StringFieldUpdateOperationsInput | string
    emailInternal?: StringFieldUpdateOperationsInput | string
    emailAlternate?: StringFieldUpdateOperationsInput | string
    phoneContact?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    yogaStyle?: StringFieldUpdateOperationsInput | string
    yogaExperience?: StringFieldUpdateOperationsInput | string
    Facebook?: StringFieldUpdateOperationsInput | string
    Google?: StringFieldUpdateOperationsInput | string
    Patreon?: StringFieldUpdateOperationsInput | string
    Twitch?: StringFieldUpdateOperationsInput | string
    Twitter?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    blogURL?: StringFieldUpdateOperationsInput | string
    socialURL?: StringFieldUpdateOperationsInput | string
    streamingURL?: StringFieldUpdateOperationsInput | string
    isInstructor?: StringFieldUpdateOperationsInput | string
    isStudent?: StringFieldUpdateOperationsInput | string
    isPrivate?: StringFieldUpdateOperationsInput | string
    calendar?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    isLocationPublic?: StringFieldUpdateOperationsInput | string
    exportAccountInfo?: StringFieldUpdateOperationsInput | string
    deleteAccountInfo?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    user?: UserDataUpdateOneRequiredWithoutPractitionerNestedInput
  }

  export type PractitionerUncheckedUpdateInput = {
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    pronouns?: StringFieldUpdateOperationsInput | string
    emailPublic?: StringFieldUpdateOperationsInput | string
    emailInternal?: StringFieldUpdateOperationsInput | string
    emailAlternate?: StringFieldUpdateOperationsInput | string
    phoneContact?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    yogaStyle?: StringFieldUpdateOperationsInput | string
    yogaExperience?: StringFieldUpdateOperationsInput | string
    Facebook?: StringFieldUpdateOperationsInput | string
    Google?: StringFieldUpdateOperationsInput | string
    Patreon?: StringFieldUpdateOperationsInput | string
    Twitch?: StringFieldUpdateOperationsInput | string
    Twitter?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    blogURL?: StringFieldUpdateOperationsInput | string
    socialURL?: StringFieldUpdateOperationsInput | string
    streamingURL?: StringFieldUpdateOperationsInput | string
    isInstructor?: StringFieldUpdateOperationsInput | string
    isStudent?: StringFieldUpdateOperationsInput | string
    isPrivate?: StringFieldUpdateOperationsInput | string
    calendar?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    isLocationPublic?: StringFieldUpdateOperationsInput | string
    exportAccountInfo?: StringFieldUpdateOperationsInput | string
    deleteAccountInfo?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type PractitionerCreateManyInput = {
    id?: string
    firstName: string
    lastName: string
    pronouns: string
    emailPublic: string
    emailInternal: string
    emailAlternate: string
    phoneContact: string
    bio: string
    headline: string
    yogaStyle: string
    yogaExperience: string
    Facebook: string
    Google: string
    Patreon: string
    Twitch: string
    Twitter: string
    websiteURL: string
    blogURL: string
    socialURL: string
    streamingURL: string
    isInstructor: string
    isStudent: string
    isPrivate: string
    calendar: string
    timezone: string
    location: string
    isLocationPublic: string
    exportAccountInfo: string
    deleteAccountInfo: string
    company: string
    userId: string
  }

  export type PractitionerUpdateManyMutationInput = {
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    pronouns?: StringFieldUpdateOperationsInput | string
    emailPublic?: StringFieldUpdateOperationsInput | string
    emailInternal?: StringFieldUpdateOperationsInput | string
    emailAlternate?: StringFieldUpdateOperationsInput | string
    phoneContact?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    yogaStyle?: StringFieldUpdateOperationsInput | string
    yogaExperience?: StringFieldUpdateOperationsInput | string
    Facebook?: StringFieldUpdateOperationsInput | string
    Google?: StringFieldUpdateOperationsInput | string
    Patreon?: StringFieldUpdateOperationsInput | string
    Twitch?: StringFieldUpdateOperationsInput | string
    Twitter?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    blogURL?: StringFieldUpdateOperationsInput | string
    socialURL?: StringFieldUpdateOperationsInput | string
    streamingURL?: StringFieldUpdateOperationsInput | string
    isInstructor?: StringFieldUpdateOperationsInput | string
    isStudent?: StringFieldUpdateOperationsInput | string
    isPrivate?: StringFieldUpdateOperationsInput | string
    calendar?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    isLocationPublic?: StringFieldUpdateOperationsInput | string
    exportAccountInfo?: StringFieldUpdateOperationsInput | string
    deleteAccountInfo?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
  }

  export type PractitionerUncheckedUpdateManyInput = {
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    pronouns?: StringFieldUpdateOperationsInput | string
    emailPublic?: StringFieldUpdateOperationsInput | string
    emailInternal?: StringFieldUpdateOperationsInput | string
    emailAlternate?: StringFieldUpdateOperationsInput | string
    phoneContact?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    yogaStyle?: StringFieldUpdateOperationsInput | string
    yogaExperience?: StringFieldUpdateOperationsInput | string
    Facebook?: StringFieldUpdateOperationsInput | string
    Google?: StringFieldUpdateOperationsInput | string
    Patreon?: StringFieldUpdateOperationsInput | string
    Twitch?: StringFieldUpdateOperationsInput | string
    Twitter?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    blogURL?: StringFieldUpdateOperationsInput | string
    socialURL?: StringFieldUpdateOperationsInput | string
    streamingURL?: StringFieldUpdateOperationsInput | string
    isInstructor?: StringFieldUpdateOperationsInput | string
    isStudent?: StringFieldUpdateOperationsInput | string
    isPrivate?: StringFieldUpdateOperationsInput | string
    calendar?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    isLocationPublic?: StringFieldUpdateOperationsInput | string
    exportAccountInfo?: StringFieldUpdateOperationsInput | string
    deleteAccountInfo?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type SeriesCreateInput = {
    id?: string
    seriesName: string
    seriesPostures?: SeriesCreateseriesPosturesInput | string[]
  }

  export type SeriesUncheckedCreateInput = {
    id?: string
    seriesName: string
    seriesPostures?: SeriesCreateseriesPosturesInput | string[]
  }

  export type SeriesUpdateInput = {
    seriesName?: StringFieldUpdateOperationsInput | string
    seriesPostures?: SeriesUpdateseriesPosturesInput | string[]
  }

  export type SeriesUncheckedUpdateInput = {
    seriesName?: StringFieldUpdateOperationsInput | string
    seriesPostures?: SeriesUpdateseriesPosturesInput | string[]
  }

  export type SeriesCreateManyInput = {
    id?: string
    seriesName: string
    seriesPostures?: SeriesCreateseriesPosturesInput | string[]
  }

  export type SeriesUpdateManyMutationInput = {
    seriesName?: StringFieldUpdateOperationsInput | string
    seriesPostures?: SeriesUpdateseriesPosturesInput | string[]
  }

  export type SeriesUncheckedUpdateManyInput = {
    seriesName?: StringFieldUpdateOperationsInput | string
    seriesPostures?: SeriesUpdateseriesPosturesInput | string[]
  }

  export type FlowSeriesCreateInput = {
    id?: string
    seriesName: string
    seriesSet: string
  }

  export type FlowSeriesUncheckedCreateInput = {
    id?: string
    seriesName: string
    seriesSet: string
  }

  export type FlowSeriesUpdateInput = {
    seriesName?: StringFieldUpdateOperationsInput | string
    seriesSet?: StringFieldUpdateOperationsInput | string
  }

  export type FlowSeriesUncheckedUpdateInput = {
    seriesName?: StringFieldUpdateOperationsInput | string
    seriesSet?: StringFieldUpdateOperationsInput | string
  }

  export type FlowSeriesCreateManyInput = {
    id?: string
    seriesName: string
    seriesSet: string
  }

  export type FlowSeriesUpdateManyMutationInput = {
    seriesName?: StringFieldUpdateOperationsInput | string
    seriesSet?: StringFieldUpdateOperationsInput | string
  }

  export type FlowSeriesUncheckedUpdateManyInput = {
    seriesName?: StringFieldUpdateOperationsInput | string
    seriesSet?: StringFieldUpdateOperationsInput | string
  }

  export type SequenceCreateInput = {
    id?: string
    nameSequence: string
    sequencesSeries?: SequencesSeriesCreateNestedManyWithoutSequenceInput
  }

  export type SequenceUncheckedCreateInput = {
    id?: string
    nameSequence: string
    sequencesSeries?: SequencesSeriesUncheckedCreateNestedManyWithoutSequenceInput
  }

  export type SequenceUpdateInput = {
    nameSequence?: StringFieldUpdateOperationsInput | string
    sequencesSeries?: SequencesSeriesUpdateManyWithoutSequenceNestedInput
  }

  export type SequenceUncheckedUpdateInput = {
    nameSequence?: StringFieldUpdateOperationsInput | string
    sequencesSeries?: SequencesSeriesUncheckedUpdateManyWithoutSequenceNestedInput
  }

  export type SequenceCreateManyInput = {
    id?: string
    nameSequence: string
  }

  export type SequenceUpdateManyMutationInput = {
    nameSequence?: StringFieldUpdateOperationsInput | string
  }

  export type SequenceUncheckedUpdateManyInput = {
    nameSequence?: StringFieldUpdateOperationsInput | string
  }

  export type SequencesSeriesCreateInput = {
    id?: string
    seriesName: string
    seriesSet?: SequencesSeriesCreateseriesSetInput | string[]
    sequence: SequenceCreateNestedOneWithoutSequencesSeriesInput
  }

  export type SequencesSeriesUncheckedCreateInput = {
    id?: string
    seriesName: string
    seriesSet?: SequencesSeriesCreateseriesSetInput | string[]
    sequenceId: string
  }

  export type SequencesSeriesUpdateInput = {
    seriesName?: StringFieldUpdateOperationsInput | string
    seriesSet?: SequencesSeriesUpdateseriesSetInput | string[]
    sequence?: SequenceUpdateOneRequiredWithoutSequencesSeriesNestedInput
  }

  export type SequencesSeriesUncheckedUpdateInput = {
    seriesName?: StringFieldUpdateOperationsInput | string
    seriesSet?: SequencesSeriesUpdateseriesSetInput | string[]
    sequenceId?: StringFieldUpdateOperationsInput | string
  }

  export type SequencesSeriesCreateManyInput = {
    id?: string
    seriesName: string
    seriesSet?: SequencesSeriesCreateseriesSetInput | string[]
    sequenceId: string
  }

  export type SequencesSeriesUpdateManyMutationInput = {
    seriesName?: StringFieldUpdateOperationsInput | string
    seriesSet?: SequencesSeriesUpdateseriesSetInput | string[]
  }

  export type SequencesSeriesUncheckedUpdateManyInput = {
    seriesName?: StringFieldUpdateOperationsInput | string
    seriesSet?: SequencesSeriesUpdateseriesSetInput | string[]
    sequenceId?: StringFieldUpdateOperationsInput | string
  }

  export type PostureCreateInput = {
    id?: string
    aka?: PostureCreateakaInput | string[]
    benefits: string
    category: string
    description: string
    difficulty: string
    display_name: string
    name: string
    next_poses?: PostureCreatenext_posesInput | string[]
    preferred_side: string
    previous_poses?: PostureCreateprevious_posesInput | string[]
    sideways: boolean
    sort_name: string
    subcategory: string
    two_sided: boolean
    variations?: InputJsonValue | null
    visibility: string
    sanskrit_names?: SanskritNameCreateNestedManyWithoutPostureInput
  }

  export type PostureUncheckedCreateInput = {
    id?: string
    aka?: PostureCreateakaInput | string[]
    benefits: string
    category: string
    description: string
    difficulty: string
    display_name: string
    name: string
    next_poses?: PostureCreatenext_posesInput | string[]
    preferred_side: string
    previous_poses?: PostureCreateprevious_posesInput | string[]
    sideways: boolean
    sort_name: string
    subcategory: string
    two_sided: boolean
    variations?: InputJsonValue | null
    visibility: string
    sanskrit_names?: SanskritNameUncheckedCreateNestedManyWithoutPostureInput
  }

  export type PostureUpdateInput = {
    aka?: PostureUpdateakaInput | string[]
    benefits?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    display_name?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    next_poses?: PostureUpdatenext_posesInput | string[]
    preferred_side?: StringFieldUpdateOperationsInput | string
    previous_poses?: PostureUpdateprevious_posesInput | string[]
    sideways?: BoolFieldUpdateOperationsInput | boolean
    sort_name?: StringFieldUpdateOperationsInput | string
    subcategory?: StringFieldUpdateOperationsInput | string
    two_sided?: BoolFieldUpdateOperationsInput | boolean
    variations?: InputJsonValue | InputJsonValue | null
    visibility?: StringFieldUpdateOperationsInput | string
    sanskrit_names?: SanskritNameUpdateManyWithoutPostureNestedInput
  }

  export type PostureUncheckedUpdateInput = {
    aka?: PostureUpdateakaInput | string[]
    benefits?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    display_name?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    next_poses?: PostureUpdatenext_posesInput | string[]
    preferred_side?: StringFieldUpdateOperationsInput | string
    previous_poses?: PostureUpdateprevious_posesInput | string[]
    sideways?: BoolFieldUpdateOperationsInput | boolean
    sort_name?: StringFieldUpdateOperationsInput | string
    subcategory?: StringFieldUpdateOperationsInput | string
    two_sided?: BoolFieldUpdateOperationsInput | boolean
    variations?: InputJsonValue | InputJsonValue | null
    visibility?: StringFieldUpdateOperationsInput | string
    sanskrit_names?: SanskritNameUncheckedUpdateManyWithoutPostureNestedInput
  }

  export type PostureCreateManyInput = {
    id?: string
    aka?: PostureCreateakaInput | string[]
    benefits: string
    category: string
    description: string
    difficulty: string
    display_name: string
    name: string
    next_poses?: PostureCreatenext_posesInput | string[]
    preferred_side: string
    previous_poses?: PostureCreateprevious_posesInput | string[]
    sideways: boolean
    sort_name: string
    subcategory: string
    two_sided: boolean
    variations?: InputJsonValue | null
    visibility: string
  }

  export type PostureUpdateManyMutationInput = {
    aka?: PostureUpdateakaInput | string[]
    benefits?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    display_name?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    next_poses?: PostureUpdatenext_posesInput | string[]
    preferred_side?: StringFieldUpdateOperationsInput | string
    previous_poses?: PostureUpdateprevious_posesInput | string[]
    sideways?: BoolFieldUpdateOperationsInput | boolean
    sort_name?: StringFieldUpdateOperationsInput | string
    subcategory?: StringFieldUpdateOperationsInput | string
    two_sided?: BoolFieldUpdateOperationsInput | boolean
    variations?: InputJsonValue | InputJsonValue | null
    visibility?: StringFieldUpdateOperationsInput | string
  }

  export type PostureUncheckedUpdateManyInput = {
    aka?: PostureUpdateakaInput | string[]
    benefits?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    display_name?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    next_poses?: PostureUpdatenext_posesInput | string[]
    preferred_side?: StringFieldUpdateOperationsInput | string
    previous_poses?: PostureUpdateprevious_posesInput | string[]
    sideways?: BoolFieldUpdateOperationsInput | boolean
    sort_name?: StringFieldUpdateOperationsInput | string
    subcategory?: StringFieldUpdateOperationsInput | string
    two_sided?: BoolFieldUpdateOperationsInput | boolean
    variations?: InputJsonValue | InputJsonValue | null
    visibility?: StringFieldUpdateOperationsInput | string
  }

  export type SanskritNameCreateInput = {
    id?: string
    latin: string
    devanagari: string
    simplified: string
    translation?: TranslationCreateNestedManyWithoutSanskritNameInput
    posture: PostureCreateNestedOneWithoutSanskrit_namesInput
  }

  export type SanskritNameUncheckedCreateInput = {
    id?: string
    latin: string
    devanagari: string
    simplified: string
    postureId: string
    translation?: TranslationUncheckedCreateNestedManyWithoutSanskritNameInput
  }

  export type SanskritNameUpdateInput = {
    latin?: StringFieldUpdateOperationsInput | string
    devanagari?: StringFieldUpdateOperationsInput | string
    simplified?: StringFieldUpdateOperationsInput | string
    translation?: TranslationUpdateManyWithoutSanskritNameNestedInput
    posture?: PostureUpdateOneRequiredWithoutSanskrit_namesNestedInput
  }

  export type SanskritNameUncheckedUpdateInput = {
    latin?: StringFieldUpdateOperationsInput | string
    devanagari?: StringFieldUpdateOperationsInput | string
    simplified?: StringFieldUpdateOperationsInput | string
    postureId?: StringFieldUpdateOperationsInput | string
    translation?: TranslationUncheckedUpdateManyWithoutSanskritNameNestedInput
  }

  export type SanskritNameCreateManyInput = {
    id?: string
    latin: string
    devanagari: string
    simplified: string
    postureId: string
  }

  export type SanskritNameUpdateManyMutationInput = {
    latin?: StringFieldUpdateOperationsInput | string
    devanagari?: StringFieldUpdateOperationsInput | string
    simplified?: StringFieldUpdateOperationsInput | string
  }

  export type SanskritNameUncheckedUpdateManyInput = {
    latin?: StringFieldUpdateOperationsInput | string
    devanagari?: StringFieldUpdateOperationsInput | string
    simplified?: StringFieldUpdateOperationsInput | string
    postureId?: StringFieldUpdateOperationsInput | string
  }

  export type TranslationCreateInput = {
    id?: string
    latin: string
    devanagari: string
    simplified: string
    description: string
    sanskritName: SanskritNameCreateNestedOneWithoutTranslationInput
  }

  export type TranslationUncheckedCreateInput = {
    id?: string
    latin: string
    devanagari: string
    simplified: string
    description: string
    sanskritNameId: string
  }

  export type TranslationUpdateInput = {
    latin?: StringFieldUpdateOperationsInput | string
    devanagari?: StringFieldUpdateOperationsInput | string
    simplified?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    sanskritName?: SanskritNameUpdateOneRequiredWithoutTranslationNestedInput
  }

  export type TranslationUncheckedUpdateInput = {
    latin?: StringFieldUpdateOperationsInput | string
    devanagari?: StringFieldUpdateOperationsInput | string
    simplified?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    sanskritNameId?: StringFieldUpdateOperationsInput | string
  }

  export type TranslationCreateManyInput = {
    id?: string
    latin: string
    devanagari: string
    simplified: string
    description: string
    sanskritNameId: string
  }

  export type TranslationUpdateManyMutationInput = {
    latin?: StringFieldUpdateOperationsInput | string
    devanagari?: StringFieldUpdateOperationsInput | string
    simplified?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
  }

  export type TranslationUncheckedUpdateManyInput = {
    latin?: StringFieldUpdateOperationsInput | string
    devanagari?: StringFieldUpdateOperationsInput | string
    simplified?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    sanskritNameId?: StringFieldUpdateOperationsInput | string
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
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
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

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type AuthenticatorListRelationFilter = {
    every?: AuthenticatorWhereInput
    some?: AuthenticatorWhereInput
    none?: AuthenticatorWhereInput
  }

  export type PractitionerListRelationFilter = {
    every?: PractitionerWhereInput
    some?: PractitionerWhereInput
    none?: PractitionerWhereInput
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuthenticatorOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PractitionerOrderByRelationAggregateInput = {
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
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
    isSet?: boolean
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

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

  export type UserDataRelationFilter = {
    is?: UserDataWhereInput
    isNot?: UserDataWhereInput
  }

  export type AccountCountOrderByAggregateInput = {
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
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
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
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
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
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
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

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationTokenIdentifierTokenCompoundUniqueInput = {
    identifier: string
    token: string
  }

  export type VerificationTokenCountOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMinOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type AuthenticatorUserIdCredentialIDCompoundUniqueInput = {
    userId: string
    credentialID: string
  }

  export type AuthenticatorCountOrderByAggregateInput = {
    credentialID?: SortOrder
    userId?: SortOrder
    providerAccountId?: SortOrder
    credentialPublicKey?: SortOrder
    counter?: SortOrder
    credentialDeviceType?: SortOrder
    credentialBackedUp?: SortOrder
    transports?: SortOrder
  }

  export type AuthenticatorAvgOrderByAggregateInput = {
    counter?: SortOrder
  }

  export type AuthenticatorMaxOrderByAggregateInput = {
    credentialID?: SortOrder
    userId?: SortOrder
    providerAccountId?: SortOrder
    credentialPublicKey?: SortOrder
    counter?: SortOrder
    credentialDeviceType?: SortOrder
    credentialBackedUp?: SortOrder
    transports?: SortOrder
  }

  export type AuthenticatorMinOrderByAggregateInput = {
    credentialID?: SortOrder
    userId?: SortOrder
    providerAccountId?: SortOrder
    credentialPublicKey?: SortOrder
    counter?: SortOrder
    credentialDeviceType?: SortOrder
    credentialBackedUp?: SortOrder
    transports?: SortOrder
  }

  export type AuthenticatorSumOrderByAggregateInput = {
    counter?: SortOrder
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type PractitionerCountOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    pronouns?: SortOrder
    emailPublic?: SortOrder
    emailInternal?: SortOrder
    emailAlternate?: SortOrder
    phoneContact?: SortOrder
    bio?: SortOrder
    headline?: SortOrder
    yogaStyle?: SortOrder
    yogaExperience?: SortOrder
    Facebook?: SortOrder
    Google?: SortOrder
    Patreon?: SortOrder
    Twitch?: SortOrder
    Twitter?: SortOrder
    websiteURL?: SortOrder
    blogURL?: SortOrder
    socialURL?: SortOrder
    streamingURL?: SortOrder
    isInstructor?: SortOrder
    isStudent?: SortOrder
    isPrivate?: SortOrder
    calendar?: SortOrder
    timezone?: SortOrder
    location?: SortOrder
    isLocationPublic?: SortOrder
    exportAccountInfo?: SortOrder
    deleteAccountInfo?: SortOrder
    company?: SortOrder
    userId?: SortOrder
  }

  export type PractitionerMaxOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    pronouns?: SortOrder
    emailPublic?: SortOrder
    emailInternal?: SortOrder
    emailAlternate?: SortOrder
    phoneContact?: SortOrder
    bio?: SortOrder
    headline?: SortOrder
    yogaStyle?: SortOrder
    yogaExperience?: SortOrder
    Facebook?: SortOrder
    Google?: SortOrder
    Patreon?: SortOrder
    Twitch?: SortOrder
    Twitter?: SortOrder
    websiteURL?: SortOrder
    blogURL?: SortOrder
    socialURL?: SortOrder
    streamingURL?: SortOrder
    isInstructor?: SortOrder
    isStudent?: SortOrder
    isPrivate?: SortOrder
    calendar?: SortOrder
    timezone?: SortOrder
    location?: SortOrder
    isLocationPublic?: SortOrder
    exportAccountInfo?: SortOrder
    deleteAccountInfo?: SortOrder
    company?: SortOrder
    userId?: SortOrder
  }

  export type PractitionerMinOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    pronouns?: SortOrder
    emailPublic?: SortOrder
    emailInternal?: SortOrder
    emailAlternate?: SortOrder
    phoneContact?: SortOrder
    bio?: SortOrder
    headline?: SortOrder
    yogaStyle?: SortOrder
    yogaExperience?: SortOrder
    Facebook?: SortOrder
    Google?: SortOrder
    Patreon?: SortOrder
    Twitch?: SortOrder
    Twitter?: SortOrder
    websiteURL?: SortOrder
    blogURL?: SortOrder
    socialURL?: SortOrder
    streamingURL?: SortOrder
    isInstructor?: SortOrder
    isStudent?: SortOrder
    isPrivate?: SortOrder
    calendar?: SortOrder
    timezone?: SortOrder
    location?: SortOrder
    isLocationPublic?: SortOrder
    exportAccountInfo?: SortOrder
    deleteAccountInfo?: SortOrder
    company?: SortOrder
    userId?: SortOrder
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type SeriesCountOrderByAggregateInput = {
    id?: SortOrder
    seriesName?: SortOrder
    seriesPostures?: SortOrder
  }

  export type SeriesMaxOrderByAggregateInput = {
    id?: SortOrder
    seriesName?: SortOrder
  }

  export type SeriesMinOrderByAggregateInput = {
    id?: SortOrder
    seriesName?: SortOrder
  }

  export type FlowSeriesCountOrderByAggregateInput = {
    id?: SortOrder
    seriesName?: SortOrder
    seriesSet?: SortOrder
  }

  export type FlowSeriesMaxOrderByAggregateInput = {
    id?: SortOrder
    seriesName?: SortOrder
    seriesSet?: SortOrder
  }

  export type FlowSeriesMinOrderByAggregateInput = {
    id?: SortOrder
    seriesName?: SortOrder
    seriesSet?: SortOrder
  }

  export type SequencesSeriesListRelationFilter = {
    every?: SequencesSeriesWhereInput
    some?: SequencesSeriesWhereInput
    none?: SequencesSeriesWhereInput
  }

  export type SequencesSeriesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SequenceCountOrderByAggregateInput = {
    id?: SortOrder
    nameSequence?: SortOrder
  }

  export type SequenceMaxOrderByAggregateInput = {
    id?: SortOrder
    nameSequence?: SortOrder
  }

  export type SequenceMinOrderByAggregateInput = {
    id?: SortOrder
    nameSequence?: SortOrder
  }

  export type SequenceRelationFilter = {
    is?: SequenceWhereInput
    isNot?: SequenceWhereInput
  }

  export type SequencesSeriesCountOrderByAggregateInput = {
    id?: SortOrder
    seriesName?: SortOrder
    seriesSet?: SortOrder
    sequenceId?: SortOrder
  }

  export type SequencesSeriesMaxOrderByAggregateInput = {
    id?: SortOrder
    seriesName?: SortOrder
    sequenceId?: SortOrder
  }

  export type SequencesSeriesMinOrderByAggregateInput = {
    id?: SortOrder
    seriesName?: SortOrder
    sequenceId?: SortOrder
  }

  export type SanskritNameListRelationFilter = {
    every?: SanskritNameWhereInput
    some?: SanskritNameWhereInput
    none?: SanskritNameWhereInput
  }

  export type SanskritNameOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PostureCountOrderByAggregateInput = {
    id?: SortOrder
    aka?: SortOrder
    benefits?: SortOrder
    category?: SortOrder
    description?: SortOrder
    difficulty?: SortOrder
    display_name?: SortOrder
    name?: SortOrder
    next_poses?: SortOrder
    preferred_side?: SortOrder
    previous_poses?: SortOrder
    sideways?: SortOrder
    sort_name?: SortOrder
    subcategory?: SortOrder
    two_sided?: SortOrder
    variations?: SortOrder
    visibility?: SortOrder
  }

  export type PostureMaxOrderByAggregateInput = {
    id?: SortOrder
    benefits?: SortOrder
    category?: SortOrder
    description?: SortOrder
    difficulty?: SortOrder
    display_name?: SortOrder
    name?: SortOrder
    preferred_side?: SortOrder
    sideways?: SortOrder
    sort_name?: SortOrder
    subcategory?: SortOrder
    two_sided?: SortOrder
    visibility?: SortOrder
  }

  export type PostureMinOrderByAggregateInput = {
    id?: SortOrder
    benefits?: SortOrder
    category?: SortOrder
    description?: SortOrder
    difficulty?: SortOrder
    display_name?: SortOrder
    name?: SortOrder
    preferred_side?: SortOrder
    sideways?: SortOrder
    sort_name?: SortOrder
    subcategory?: SortOrder
    two_sided?: SortOrder
    visibility?: SortOrder
  }

  export type TranslationListRelationFilter = {
    every?: TranslationWhereInput
    some?: TranslationWhereInput
    none?: TranslationWhereInput
  }

  export type PostureRelationFilter = {
    is?: PostureWhereInput
    isNot?: PostureWhereInput
  }

  export type TranslationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SanskritNameCountOrderByAggregateInput = {
    id?: SortOrder
    latin?: SortOrder
    devanagari?: SortOrder
    simplified?: SortOrder
    postureId?: SortOrder
  }

  export type SanskritNameMaxOrderByAggregateInput = {
    id?: SortOrder
    latin?: SortOrder
    devanagari?: SortOrder
    simplified?: SortOrder
    postureId?: SortOrder
  }

  export type SanskritNameMinOrderByAggregateInput = {
    id?: SortOrder
    latin?: SortOrder
    devanagari?: SortOrder
    simplified?: SortOrder
    postureId?: SortOrder
  }

  export type SanskritNameRelationFilter = {
    is?: SanskritNameWhereInput
    isNot?: SanskritNameWhereInput
  }

  export type TranslationCountOrderByAggregateInput = {
    id?: SortOrder
    latin?: SortOrder
    devanagari?: SortOrder
    simplified?: SortOrder
    description?: SortOrder
    sanskritNameId?: SortOrder
  }

  export type TranslationMaxOrderByAggregateInput = {
    id?: SortOrder
    latin?: SortOrder
    devanagari?: SortOrder
    simplified?: SortOrder
    description?: SortOrder
    sanskritNameId?: SortOrder
  }

  export type TranslationMinOrderByAggregateInput = {
    id?: SortOrder
    latin?: SortOrder
    devanagari?: SortOrder
    simplified?: SortOrder
    description?: SortOrder
    sanskritNameId?: SortOrder
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AuthenticatorCreateNestedManyWithoutUserInput = {
    create?: XOR<AuthenticatorCreateWithoutUserInput, AuthenticatorUncheckedCreateWithoutUserInput> | AuthenticatorCreateWithoutUserInput[] | AuthenticatorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthenticatorCreateOrConnectWithoutUserInput | AuthenticatorCreateOrConnectWithoutUserInput[]
    createMany?: AuthenticatorCreateManyUserInputEnvelope
    connect?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
  }

  export type PractitionerCreateNestedManyWithoutUserInput = {
    create?: XOR<PractitionerCreateWithoutUserInput, PractitionerUncheckedCreateWithoutUserInput> | PractitionerCreateWithoutUserInput[] | PractitionerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PractitionerCreateOrConnectWithoutUserInput | PractitionerCreateOrConnectWithoutUserInput[]
    createMany?: PractitionerCreateManyUserInputEnvelope
    connect?: PractitionerWhereUniqueInput | PractitionerWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AuthenticatorUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuthenticatorCreateWithoutUserInput, AuthenticatorUncheckedCreateWithoutUserInput> | AuthenticatorCreateWithoutUserInput[] | AuthenticatorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthenticatorCreateOrConnectWithoutUserInput | AuthenticatorCreateOrConnectWithoutUserInput[]
    createMany?: AuthenticatorCreateManyUserInputEnvelope
    connect?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
  }

  export type PractitionerUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PractitionerCreateWithoutUserInput, PractitionerUncheckedCreateWithoutUserInput> | PractitionerCreateWithoutUserInput[] | PractitionerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PractitionerCreateOrConnectWithoutUserInput | PractitionerCreateOrConnectWithoutUserInput[]
    createMany?: PractitionerCreateManyUserInputEnvelope
    connect?: PractitionerWhereUniqueInput | PractitionerWhereUniqueInput[]
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

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AuthenticatorUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuthenticatorCreateWithoutUserInput, AuthenticatorUncheckedCreateWithoutUserInput> | AuthenticatorCreateWithoutUserInput[] | AuthenticatorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthenticatorCreateOrConnectWithoutUserInput | AuthenticatorCreateOrConnectWithoutUserInput[]
    upsert?: AuthenticatorUpsertWithWhereUniqueWithoutUserInput | AuthenticatorUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuthenticatorCreateManyUserInputEnvelope
    set?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
    disconnect?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
    delete?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
    connect?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
    update?: AuthenticatorUpdateWithWhereUniqueWithoutUserInput | AuthenticatorUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuthenticatorUpdateManyWithWhereWithoutUserInput | AuthenticatorUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuthenticatorScalarWhereInput | AuthenticatorScalarWhereInput[]
  }

  export type PractitionerUpdateManyWithoutUserNestedInput = {
    create?: XOR<PractitionerCreateWithoutUserInput, PractitionerUncheckedCreateWithoutUserInput> | PractitionerCreateWithoutUserInput[] | PractitionerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PractitionerCreateOrConnectWithoutUserInput | PractitionerCreateOrConnectWithoutUserInput[]
    upsert?: PractitionerUpsertWithWhereUniqueWithoutUserInput | PractitionerUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PractitionerCreateManyUserInputEnvelope
    set?: PractitionerWhereUniqueInput | PractitionerWhereUniqueInput[]
    disconnect?: PractitionerWhereUniqueInput | PractitionerWhereUniqueInput[]
    delete?: PractitionerWhereUniqueInput | PractitionerWhereUniqueInput[]
    connect?: PractitionerWhereUniqueInput | PractitionerWhereUniqueInput[]
    update?: PractitionerUpdateWithWhereUniqueWithoutUserInput | PractitionerUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PractitionerUpdateManyWithWhereWithoutUserInput | PractitionerUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PractitionerScalarWhereInput | PractitionerScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AuthenticatorUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuthenticatorCreateWithoutUserInput, AuthenticatorUncheckedCreateWithoutUserInput> | AuthenticatorCreateWithoutUserInput[] | AuthenticatorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthenticatorCreateOrConnectWithoutUserInput | AuthenticatorCreateOrConnectWithoutUserInput[]
    upsert?: AuthenticatorUpsertWithWhereUniqueWithoutUserInput | AuthenticatorUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuthenticatorCreateManyUserInputEnvelope
    set?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
    disconnect?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
    delete?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
    connect?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
    update?: AuthenticatorUpdateWithWhereUniqueWithoutUserInput | AuthenticatorUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuthenticatorUpdateManyWithWhereWithoutUserInput | AuthenticatorUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuthenticatorScalarWhereInput | AuthenticatorScalarWhereInput[]
  }

  export type PractitionerUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PractitionerCreateWithoutUserInput, PractitionerUncheckedCreateWithoutUserInput> | PractitionerCreateWithoutUserInput[] | PractitionerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PractitionerCreateOrConnectWithoutUserInput | PractitionerCreateOrConnectWithoutUserInput[]
    upsert?: PractitionerUpsertWithWhereUniqueWithoutUserInput | PractitionerUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PractitionerCreateManyUserInputEnvelope
    set?: PractitionerWhereUniqueInput | PractitionerWhereUniqueInput[]
    disconnect?: PractitionerWhereUniqueInput | PractitionerWhereUniqueInput[]
    delete?: PractitionerWhereUniqueInput | PractitionerWhereUniqueInput[]
    connect?: PractitionerWhereUniqueInput | PractitionerWhereUniqueInput[]
    update?: PractitionerUpdateWithWhereUniqueWithoutUserInput | PractitionerUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PractitionerUpdateManyWithWhereWithoutUserInput | PractitionerUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PractitionerScalarWhereInput | PractitionerScalarWhereInput[]
  }

  export type UserDataCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserDataCreateWithoutAccountsInput, UserDataUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserDataCreateOrConnectWithoutAccountsInput
    connect?: UserDataWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
    unset?: boolean
  }

  export type UserDataUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserDataCreateWithoutAccountsInput, UserDataUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserDataCreateOrConnectWithoutAccountsInput
    upsert?: UserDataUpsertWithoutAccountsInput
    connect?: UserDataWhereUniqueInput
    update?: XOR<XOR<UserDataUpdateToOneWithWhereWithoutAccountsInput, UserDataUpdateWithoutAccountsInput>, UserDataUncheckedUpdateWithoutAccountsInput>
  }

  export type UserDataCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserDataCreateWithoutSessionsInput, UserDataUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserDataCreateOrConnectWithoutSessionsInput
    connect?: UserDataWhereUniqueInput
  }

  export type UserDataUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserDataCreateWithoutSessionsInput, UserDataUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserDataCreateOrConnectWithoutSessionsInput
    upsert?: UserDataUpsertWithoutSessionsInput
    connect?: UserDataWhereUniqueInput
    update?: XOR<XOR<UserDataUpdateToOneWithWhereWithoutSessionsInput, UserDataUpdateWithoutSessionsInput>, UserDataUncheckedUpdateWithoutSessionsInput>
  }

  export type UserDataCreateNestedOneWithoutAuthenticatorInput = {
    create?: XOR<UserDataCreateWithoutAuthenticatorInput, UserDataUncheckedCreateWithoutAuthenticatorInput>
    connectOrCreate?: UserDataCreateOrConnectWithoutAuthenticatorInput
    connect?: UserDataWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserDataUpdateOneRequiredWithoutAuthenticatorNestedInput = {
    create?: XOR<UserDataCreateWithoutAuthenticatorInput, UserDataUncheckedCreateWithoutAuthenticatorInput>
    connectOrCreate?: UserDataCreateOrConnectWithoutAuthenticatorInput
    upsert?: UserDataUpsertWithoutAuthenticatorInput
    connect?: UserDataWhereUniqueInput
    update?: XOR<XOR<UserDataUpdateToOneWithWhereWithoutAuthenticatorInput, UserDataUpdateWithoutAuthenticatorInput>, UserDataUncheckedUpdateWithoutAuthenticatorInput>
  }

  export type UserDataCreateNestedOneWithoutPractitionerInput = {
    create?: XOR<UserDataCreateWithoutPractitionerInput, UserDataUncheckedCreateWithoutPractitionerInput>
    connectOrCreate?: UserDataCreateOrConnectWithoutPractitionerInput
    connect?: UserDataWhereUniqueInput
  }

  export type UserDataUpdateOneRequiredWithoutPractitionerNestedInput = {
    create?: XOR<UserDataCreateWithoutPractitionerInput, UserDataUncheckedCreateWithoutPractitionerInput>
    connectOrCreate?: UserDataCreateOrConnectWithoutPractitionerInput
    upsert?: UserDataUpsertWithoutPractitionerInput
    connect?: UserDataWhereUniqueInput
    update?: XOR<XOR<UserDataUpdateToOneWithWhereWithoutPractitionerInput, UserDataUpdateWithoutPractitionerInput>, UserDataUncheckedUpdateWithoutPractitionerInput>
  }

  export type SeriesCreateseriesPosturesInput = {
    set: string[]
  }

  export type SeriesUpdateseriesPosturesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type SequencesSeriesCreateNestedManyWithoutSequenceInput = {
    create?: XOR<SequencesSeriesCreateWithoutSequenceInput, SequencesSeriesUncheckedCreateWithoutSequenceInput> | SequencesSeriesCreateWithoutSequenceInput[] | SequencesSeriesUncheckedCreateWithoutSequenceInput[]
    connectOrCreate?: SequencesSeriesCreateOrConnectWithoutSequenceInput | SequencesSeriesCreateOrConnectWithoutSequenceInput[]
    createMany?: SequencesSeriesCreateManySequenceInputEnvelope
    connect?: SequencesSeriesWhereUniqueInput | SequencesSeriesWhereUniqueInput[]
  }

  export type SequencesSeriesUncheckedCreateNestedManyWithoutSequenceInput = {
    create?: XOR<SequencesSeriesCreateWithoutSequenceInput, SequencesSeriesUncheckedCreateWithoutSequenceInput> | SequencesSeriesCreateWithoutSequenceInput[] | SequencesSeriesUncheckedCreateWithoutSequenceInput[]
    connectOrCreate?: SequencesSeriesCreateOrConnectWithoutSequenceInput | SequencesSeriesCreateOrConnectWithoutSequenceInput[]
    createMany?: SequencesSeriesCreateManySequenceInputEnvelope
    connect?: SequencesSeriesWhereUniqueInput | SequencesSeriesWhereUniqueInput[]
  }

  export type SequencesSeriesUpdateManyWithoutSequenceNestedInput = {
    create?: XOR<SequencesSeriesCreateWithoutSequenceInput, SequencesSeriesUncheckedCreateWithoutSequenceInput> | SequencesSeriesCreateWithoutSequenceInput[] | SequencesSeriesUncheckedCreateWithoutSequenceInput[]
    connectOrCreate?: SequencesSeriesCreateOrConnectWithoutSequenceInput | SequencesSeriesCreateOrConnectWithoutSequenceInput[]
    upsert?: SequencesSeriesUpsertWithWhereUniqueWithoutSequenceInput | SequencesSeriesUpsertWithWhereUniqueWithoutSequenceInput[]
    createMany?: SequencesSeriesCreateManySequenceInputEnvelope
    set?: SequencesSeriesWhereUniqueInput | SequencesSeriesWhereUniqueInput[]
    disconnect?: SequencesSeriesWhereUniqueInput | SequencesSeriesWhereUniqueInput[]
    delete?: SequencesSeriesWhereUniqueInput | SequencesSeriesWhereUniqueInput[]
    connect?: SequencesSeriesWhereUniqueInput | SequencesSeriesWhereUniqueInput[]
    update?: SequencesSeriesUpdateWithWhereUniqueWithoutSequenceInput | SequencesSeriesUpdateWithWhereUniqueWithoutSequenceInput[]
    updateMany?: SequencesSeriesUpdateManyWithWhereWithoutSequenceInput | SequencesSeriesUpdateManyWithWhereWithoutSequenceInput[]
    deleteMany?: SequencesSeriesScalarWhereInput | SequencesSeriesScalarWhereInput[]
  }

  export type SequencesSeriesUncheckedUpdateManyWithoutSequenceNestedInput = {
    create?: XOR<SequencesSeriesCreateWithoutSequenceInput, SequencesSeriesUncheckedCreateWithoutSequenceInput> | SequencesSeriesCreateWithoutSequenceInput[] | SequencesSeriesUncheckedCreateWithoutSequenceInput[]
    connectOrCreate?: SequencesSeriesCreateOrConnectWithoutSequenceInput | SequencesSeriesCreateOrConnectWithoutSequenceInput[]
    upsert?: SequencesSeriesUpsertWithWhereUniqueWithoutSequenceInput | SequencesSeriesUpsertWithWhereUniqueWithoutSequenceInput[]
    createMany?: SequencesSeriesCreateManySequenceInputEnvelope
    set?: SequencesSeriesWhereUniqueInput | SequencesSeriesWhereUniqueInput[]
    disconnect?: SequencesSeriesWhereUniqueInput | SequencesSeriesWhereUniqueInput[]
    delete?: SequencesSeriesWhereUniqueInput | SequencesSeriesWhereUniqueInput[]
    connect?: SequencesSeriesWhereUniqueInput | SequencesSeriesWhereUniqueInput[]
    update?: SequencesSeriesUpdateWithWhereUniqueWithoutSequenceInput | SequencesSeriesUpdateWithWhereUniqueWithoutSequenceInput[]
    updateMany?: SequencesSeriesUpdateManyWithWhereWithoutSequenceInput | SequencesSeriesUpdateManyWithWhereWithoutSequenceInput[]
    deleteMany?: SequencesSeriesScalarWhereInput | SequencesSeriesScalarWhereInput[]
  }

  export type SequencesSeriesCreateseriesSetInput = {
    set: string[]
  }

  export type SequenceCreateNestedOneWithoutSequencesSeriesInput = {
    create?: XOR<SequenceCreateWithoutSequencesSeriesInput, SequenceUncheckedCreateWithoutSequencesSeriesInput>
    connectOrCreate?: SequenceCreateOrConnectWithoutSequencesSeriesInput
    connect?: SequenceWhereUniqueInput
  }

  export type SequencesSeriesUpdateseriesSetInput = {
    set?: string[]
    push?: string | string[]
  }

  export type SequenceUpdateOneRequiredWithoutSequencesSeriesNestedInput = {
    create?: XOR<SequenceCreateWithoutSequencesSeriesInput, SequenceUncheckedCreateWithoutSequencesSeriesInput>
    connectOrCreate?: SequenceCreateOrConnectWithoutSequencesSeriesInput
    upsert?: SequenceUpsertWithoutSequencesSeriesInput
    connect?: SequenceWhereUniqueInput
    update?: XOR<XOR<SequenceUpdateToOneWithWhereWithoutSequencesSeriesInput, SequenceUpdateWithoutSequencesSeriesInput>, SequenceUncheckedUpdateWithoutSequencesSeriesInput>
  }

  export type PostureCreateakaInput = {
    set: string[]
  }

  export type PostureCreatenext_posesInput = {
    set: string[]
  }

  export type PostureCreateprevious_posesInput = {
    set: string[]
  }

  export type SanskritNameCreateNestedManyWithoutPostureInput = {
    create?: XOR<SanskritNameCreateWithoutPostureInput, SanskritNameUncheckedCreateWithoutPostureInput> | SanskritNameCreateWithoutPostureInput[] | SanskritNameUncheckedCreateWithoutPostureInput[]
    connectOrCreate?: SanskritNameCreateOrConnectWithoutPostureInput | SanskritNameCreateOrConnectWithoutPostureInput[]
    createMany?: SanskritNameCreateManyPostureInputEnvelope
    connect?: SanskritNameWhereUniqueInput | SanskritNameWhereUniqueInput[]
  }

  export type SanskritNameUncheckedCreateNestedManyWithoutPostureInput = {
    create?: XOR<SanskritNameCreateWithoutPostureInput, SanskritNameUncheckedCreateWithoutPostureInput> | SanskritNameCreateWithoutPostureInput[] | SanskritNameUncheckedCreateWithoutPostureInput[]
    connectOrCreate?: SanskritNameCreateOrConnectWithoutPostureInput | SanskritNameCreateOrConnectWithoutPostureInput[]
    createMany?: SanskritNameCreateManyPostureInputEnvelope
    connect?: SanskritNameWhereUniqueInput | SanskritNameWhereUniqueInput[]
  }

  export type PostureUpdateakaInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PostureUpdatenext_posesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PostureUpdateprevious_posesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type SanskritNameUpdateManyWithoutPostureNestedInput = {
    create?: XOR<SanskritNameCreateWithoutPostureInput, SanskritNameUncheckedCreateWithoutPostureInput> | SanskritNameCreateWithoutPostureInput[] | SanskritNameUncheckedCreateWithoutPostureInput[]
    connectOrCreate?: SanskritNameCreateOrConnectWithoutPostureInput | SanskritNameCreateOrConnectWithoutPostureInput[]
    upsert?: SanskritNameUpsertWithWhereUniqueWithoutPostureInput | SanskritNameUpsertWithWhereUniqueWithoutPostureInput[]
    createMany?: SanskritNameCreateManyPostureInputEnvelope
    set?: SanskritNameWhereUniqueInput | SanskritNameWhereUniqueInput[]
    disconnect?: SanskritNameWhereUniqueInput | SanskritNameWhereUniqueInput[]
    delete?: SanskritNameWhereUniqueInput | SanskritNameWhereUniqueInput[]
    connect?: SanskritNameWhereUniqueInput | SanskritNameWhereUniqueInput[]
    update?: SanskritNameUpdateWithWhereUniqueWithoutPostureInput | SanskritNameUpdateWithWhereUniqueWithoutPostureInput[]
    updateMany?: SanskritNameUpdateManyWithWhereWithoutPostureInput | SanskritNameUpdateManyWithWhereWithoutPostureInput[]
    deleteMany?: SanskritNameScalarWhereInput | SanskritNameScalarWhereInput[]
  }

  export type SanskritNameUncheckedUpdateManyWithoutPostureNestedInput = {
    create?: XOR<SanskritNameCreateWithoutPostureInput, SanskritNameUncheckedCreateWithoutPostureInput> | SanskritNameCreateWithoutPostureInput[] | SanskritNameUncheckedCreateWithoutPostureInput[]
    connectOrCreate?: SanskritNameCreateOrConnectWithoutPostureInput | SanskritNameCreateOrConnectWithoutPostureInput[]
    upsert?: SanskritNameUpsertWithWhereUniqueWithoutPostureInput | SanskritNameUpsertWithWhereUniqueWithoutPostureInput[]
    createMany?: SanskritNameCreateManyPostureInputEnvelope
    set?: SanskritNameWhereUniqueInput | SanskritNameWhereUniqueInput[]
    disconnect?: SanskritNameWhereUniqueInput | SanskritNameWhereUniqueInput[]
    delete?: SanskritNameWhereUniqueInput | SanskritNameWhereUniqueInput[]
    connect?: SanskritNameWhereUniqueInput | SanskritNameWhereUniqueInput[]
    update?: SanskritNameUpdateWithWhereUniqueWithoutPostureInput | SanskritNameUpdateWithWhereUniqueWithoutPostureInput[]
    updateMany?: SanskritNameUpdateManyWithWhereWithoutPostureInput | SanskritNameUpdateManyWithWhereWithoutPostureInput[]
    deleteMany?: SanskritNameScalarWhereInput | SanskritNameScalarWhereInput[]
  }

  export type TranslationCreateNestedManyWithoutSanskritNameInput = {
    create?: XOR<TranslationCreateWithoutSanskritNameInput, TranslationUncheckedCreateWithoutSanskritNameInput> | TranslationCreateWithoutSanskritNameInput[] | TranslationUncheckedCreateWithoutSanskritNameInput[]
    connectOrCreate?: TranslationCreateOrConnectWithoutSanskritNameInput | TranslationCreateOrConnectWithoutSanskritNameInput[]
    createMany?: TranslationCreateManySanskritNameInputEnvelope
    connect?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
  }

  export type PostureCreateNestedOneWithoutSanskrit_namesInput = {
    create?: XOR<PostureCreateWithoutSanskrit_namesInput, PostureUncheckedCreateWithoutSanskrit_namesInput>
    connectOrCreate?: PostureCreateOrConnectWithoutSanskrit_namesInput
    connect?: PostureWhereUniqueInput
  }

  export type TranslationUncheckedCreateNestedManyWithoutSanskritNameInput = {
    create?: XOR<TranslationCreateWithoutSanskritNameInput, TranslationUncheckedCreateWithoutSanskritNameInput> | TranslationCreateWithoutSanskritNameInput[] | TranslationUncheckedCreateWithoutSanskritNameInput[]
    connectOrCreate?: TranslationCreateOrConnectWithoutSanskritNameInput | TranslationCreateOrConnectWithoutSanskritNameInput[]
    createMany?: TranslationCreateManySanskritNameInputEnvelope
    connect?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
  }

  export type TranslationUpdateManyWithoutSanskritNameNestedInput = {
    create?: XOR<TranslationCreateWithoutSanskritNameInput, TranslationUncheckedCreateWithoutSanskritNameInput> | TranslationCreateWithoutSanskritNameInput[] | TranslationUncheckedCreateWithoutSanskritNameInput[]
    connectOrCreate?: TranslationCreateOrConnectWithoutSanskritNameInput | TranslationCreateOrConnectWithoutSanskritNameInput[]
    upsert?: TranslationUpsertWithWhereUniqueWithoutSanskritNameInput | TranslationUpsertWithWhereUniqueWithoutSanskritNameInput[]
    createMany?: TranslationCreateManySanskritNameInputEnvelope
    set?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    disconnect?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    delete?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    connect?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    update?: TranslationUpdateWithWhereUniqueWithoutSanskritNameInput | TranslationUpdateWithWhereUniqueWithoutSanskritNameInput[]
    updateMany?: TranslationUpdateManyWithWhereWithoutSanskritNameInput | TranslationUpdateManyWithWhereWithoutSanskritNameInput[]
    deleteMany?: TranslationScalarWhereInput | TranslationScalarWhereInput[]
  }

  export type PostureUpdateOneRequiredWithoutSanskrit_namesNestedInput = {
    create?: XOR<PostureCreateWithoutSanskrit_namesInput, PostureUncheckedCreateWithoutSanskrit_namesInput>
    connectOrCreate?: PostureCreateOrConnectWithoutSanskrit_namesInput
    upsert?: PostureUpsertWithoutSanskrit_namesInput
    connect?: PostureWhereUniqueInput
    update?: XOR<XOR<PostureUpdateToOneWithWhereWithoutSanskrit_namesInput, PostureUpdateWithoutSanskrit_namesInput>, PostureUncheckedUpdateWithoutSanskrit_namesInput>
  }

  export type TranslationUncheckedUpdateManyWithoutSanskritNameNestedInput = {
    create?: XOR<TranslationCreateWithoutSanskritNameInput, TranslationUncheckedCreateWithoutSanskritNameInput> | TranslationCreateWithoutSanskritNameInput[] | TranslationUncheckedCreateWithoutSanskritNameInput[]
    connectOrCreate?: TranslationCreateOrConnectWithoutSanskritNameInput | TranslationCreateOrConnectWithoutSanskritNameInput[]
    upsert?: TranslationUpsertWithWhereUniqueWithoutSanskritNameInput | TranslationUpsertWithWhereUniqueWithoutSanskritNameInput[]
    createMany?: TranslationCreateManySanskritNameInputEnvelope
    set?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    disconnect?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    delete?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    connect?: TranslationWhereUniqueInput | TranslationWhereUniqueInput[]
    update?: TranslationUpdateWithWhereUniqueWithoutSanskritNameInput | TranslationUpdateWithWhereUniqueWithoutSanskritNameInput[]
    updateMany?: TranslationUpdateManyWithWhereWithoutSanskritNameInput | TranslationUpdateManyWithWhereWithoutSanskritNameInput[]
    deleteMany?: TranslationScalarWhereInput | TranslationScalarWhereInput[]
  }

  export type SanskritNameCreateNestedOneWithoutTranslationInput = {
    create?: XOR<SanskritNameCreateWithoutTranslationInput, SanskritNameUncheckedCreateWithoutTranslationInput>
    connectOrCreate?: SanskritNameCreateOrConnectWithoutTranslationInput
    connect?: SanskritNameWhereUniqueInput
  }

  export type SanskritNameUpdateOneRequiredWithoutTranslationNestedInput = {
    create?: XOR<SanskritNameCreateWithoutTranslationInput, SanskritNameUncheckedCreateWithoutTranslationInput>
    connectOrCreate?: SanskritNameCreateOrConnectWithoutTranslationInput
    upsert?: SanskritNameUpsertWithoutTranslationInput
    connect?: SanskritNameWhereUniqueInput
    update?: XOR<XOR<SanskritNameUpdateToOneWithWhereWithoutTranslationInput, SanskritNameUpdateWithoutTranslationInput>, SanskritNameUncheckedUpdateWithoutTranslationInput>
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

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
    isSet?: boolean
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type AccountCreateWithoutUserInput = {
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
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUncheckedCreateWithoutUserInput = {
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
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
  }

  export type AuthenticatorCreateWithoutUserInput = {
    credentialID: string
    providerAccountId: string
    credentialPublicKey: string
    counter: number
    credentialDeviceType: string
    credentialBackedUp: boolean
    transports?: string | null
  }

  export type AuthenticatorUncheckedCreateWithoutUserInput = {
    credentialID: string
    providerAccountId: string
    credentialPublicKey: string
    counter: number
    credentialDeviceType: string
    credentialBackedUp: boolean
    transports?: string | null
  }

  export type AuthenticatorCreateOrConnectWithoutUserInput = {
    where: AuthenticatorWhereUniqueInput
    create: XOR<AuthenticatorCreateWithoutUserInput, AuthenticatorUncheckedCreateWithoutUserInput>
  }

  export type AuthenticatorCreateManyUserInputEnvelope = {
    data: AuthenticatorCreateManyUserInput | AuthenticatorCreateManyUserInput[]
  }

  export type PractitionerCreateWithoutUserInput = {
    id?: string
    firstName: string
    lastName: string
    pronouns: string
    emailPublic: string
    emailInternal: string
    emailAlternate: string
    phoneContact: string
    bio: string
    headline: string
    yogaStyle: string
    yogaExperience: string
    Facebook: string
    Google: string
    Patreon: string
    Twitch: string
    Twitter: string
    websiteURL: string
    blogURL: string
    socialURL: string
    streamingURL: string
    isInstructor: string
    isStudent: string
    isPrivate: string
    calendar: string
    timezone: string
    location: string
    isLocationPublic: string
    exportAccountInfo: string
    deleteAccountInfo: string
    company: string
  }

  export type PractitionerUncheckedCreateWithoutUserInput = {
    id?: string
    firstName: string
    lastName: string
    pronouns: string
    emailPublic: string
    emailInternal: string
    emailAlternate: string
    phoneContact: string
    bio: string
    headline: string
    yogaStyle: string
    yogaExperience: string
    Facebook: string
    Google: string
    Patreon: string
    Twitch: string
    Twitter: string
    websiteURL: string
    blogURL: string
    socialURL: string
    streamingURL: string
    isInstructor: string
    isStudent: string
    isPrivate: string
    calendar: string
    timezone: string
    location: string
    isLocationPublic: string
    exportAccountInfo: string
    deleteAccountInfo: string
    company: string
  }

  export type PractitionerCreateOrConnectWithoutUserInput = {
    where: PractitionerWhereUniqueInput
    create: XOR<PractitionerCreateWithoutUserInput, PractitionerUncheckedCreateWithoutUserInput>
  }

  export type PractitionerCreateManyUserInputEnvelope = {
    data: PractitionerCreateManyUserInput | PractitionerCreateManyUserInput[]
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: JsonNullableFilter<"Account">
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
  }

  export type AuthenticatorUpsertWithWhereUniqueWithoutUserInput = {
    where: AuthenticatorWhereUniqueInput
    update: XOR<AuthenticatorUpdateWithoutUserInput, AuthenticatorUncheckedUpdateWithoutUserInput>
    create: XOR<AuthenticatorCreateWithoutUserInput, AuthenticatorUncheckedCreateWithoutUserInput>
  }

  export type AuthenticatorUpdateWithWhereUniqueWithoutUserInput = {
    where: AuthenticatorWhereUniqueInput
    data: XOR<AuthenticatorUpdateWithoutUserInput, AuthenticatorUncheckedUpdateWithoutUserInput>
  }

  export type AuthenticatorUpdateManyWithWhereWithoutUserInput = {
    where: AuthenticatorScalarWhereInput
    data: XOR<AuthenticatorUpdateManyMutationInput, AuthenticatorUncheckedUpdateManyWithoutUserInput>
  }

  export type AuthenticatorScalarWhereInput = {
    AND?: AuthenticatorScalarWhereInput | AuthenticatorScalarWhereInput[]
    OR?: AuthenticatorScalarWhereInput[]
    NOT?: AuthenticatorScalarWhereInput | AuthenticatorScalarWhereInput[]
    credentialID?: StringFilter<"Authenticator"> | string
    userId?: StringFilter<"Authenticator"> | string
    providerAccountId?: StringFilter<"Authenticator"> | string
    credentialPublicKey?: StringFilter<"Authenticator"> | string
    counter?: IntFilter<"Authenticator"> | number
    credentialDeviceType?: StringFilter<"Authenticator"> | string
    credentialBackedUp?: BoolFilter<"Authenticator"> | boolean
    transports?: StringNullableFilter<"Authenticator"> | string | null
  }

  export type PractitionerUpsertWithWhereUniqueWithoutUserInput = {
    where: PractitionerWhereUniqueInput
    update: XOR<PractitionerUpdateWithoutUserInput, PractitionerUncheckedUpdateWithoutUserInput>
    create: XOR<PractitionerCreateWithoutUserInput, PractitionerUncheckedCreateWithoutUserInput>
  }

  export type PractitionerUpdateWithWhereUniqueWithoutUserInput = {
    where: PractitionerWhereUniqueInput
    data: XOR<PractitionerUpdateWithoutUserInput, PractitionerUncheckedUpdateWithoutUserInput>
  }

  export type PractitionerUpdateManyWithWhereWithoutUserInput = {
    where: PractitionerScalarWhereInput
    data: XOR<PractitionerUpdateManyMutationInput, PractitionerUncheckedUpdateManyWithoutUserInput>
  }

  export type PractitionerScalarWhereInput = {
    AND?: PractitionerScalarWhereInput | PractitionerScalarWhereInput[]
    OR?: PractitionerScalarWhereInput[]
    NOT?: PractitionerScalarWhereInput | PractitionerScalarWhereInput[]
    id?: StringFilter<"Practitioner"> | string
    firstName?: StringFilter<"Practitioner"> | string
    lastName?: StringFilter<"Practitioner"> | string
    pronouns?: StringFilter<"Practitioner"> | string
    emailPublic?: StringFilter<"Practitioner"> | string
    emailInternal?: StringFilter<"Practitioner"> | string
    emailAlternate?: StringFilter<"Practitioner"> | string
    phoneContact?: StringFilter<"Practitioner"> | string
    bio?: StringFilter<"Practitioner"> | string
    headline?: StringFilter<"Practitioner"> | string
    yogaStyle?: StringFilter<"Practitioner"> | string
    yogaExperience?: StringFilter<"Practitioner"> | string
    Facebook?: StringFilter<"Practitioner"> | string
    Google?: StringFilter<"Practitioner"> | string
    Patreon?: StringFilter<"Practitioner"> | string
    Twitch?: StringFilter<"Practitioner"> | string
    Twitter?: StringFilter<"Practitioner"> | string
    websiteURL?: StringFilter<"Practitioner"> | string
    blogURL?: StringFilter<"Practitioner"> | string
    socialURL?: StringFilter<"Practitioner"> | string
    streamingURL?: StringFilter<"Practitioner"> | string
    isInstructor?: StringFilter<"Practitioner"> | string
    isStudent?: StringFilter<"Practitioner"> | string
    isPrivate?: StringFilter<"Practitioner"> | string
    calendar?: StringFilter<"Practitioner"> | string
    timezone?: StringFilter<"Practitioner"> | string
    location?: StringFilter<"Practitioner"> | string
    isLocationPublic?: StringFilter<"Practitioner"> | string
    exportAccountInfo?: StringFilter<"Practitioner"> | string
    deleteAccountInfo?: StringFilter<"Practitioner"> | string
    company?: StringFilter<"Practitioner"> | string
    userId?: StringFilter<"Practitioner"> | string
  }

  export type UserDataCreateWithoutAccountsInput = {
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
    sessions?: SessionCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput
    Practitioner?: PractitionerCreateNestedManyWithoutUserInput
  }

  export type UserDataUncheckedCreateWithoutAccountsInput = {
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
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput
    Practitioner?: PractitionerUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserDataCreateOrConnectWithoutAccountsInput = {
    where: UserDataWhereUniqueInput
    create: XOR<UserDataCreateWithoutAccountsInput, UserDataUncheckedCreateWithoutAccountsInput>
  }

  export type UserDataUpsertWithoutAccountsInput = {
    update: XOR<UserDataUpdateWithoutAccountsInput, UserDataUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserDataCreateWithoutAccountsInput, UserDataUncheckedCreateWithoutAccountsInput>
    where?: UserDataWhereInput
  }

  export type UserDataUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserDataWhereInput
    data: XOR<UserDataUpdateWithoutAccountsInput, UserDataUncheckedUpdateWithoutAccountsInput>
  }

  export type UserDataUpdateWithoutAccountsInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput
    Practitioner?: PractitionerUpdateManyWithoutUserNestedInput
  }

  export type UserDataUncheckedUpdateWithoutAccountsInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput
    Practitioner?: PractitionerUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserDataCreateWithoutSessionsInput = {
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
    accounts?: AccountCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput
    Practitioner?: PractitionerCreateNestedManyWithoutUserInput
  }

  export type UserDataUncheckedCreateWithoutSessionsInput = {
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
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput
    Practitioner?: PractitionerUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserDataCreateOrConnectWithoutSessionsInput = {
    where: UserDataWhereUniqueInput
    create: XOR<UserDataCreateWithoutSessionsInput, UserDataUncheckedCreateWithoutSessionsInput>
  }

  export type UserDataUpsertWithoutSessionsInput = {
    update: XOR<UserDataUpdateWithoutSessionsInput, UserDataUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserDataCreateWithoutSessionsInput, UserDataUncheckedCreateWithoutSessionsInput>
    where?: UserDataWhereInput
  }

  export type UserDataUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserDataWhereInput
    data: XOR<UserDataUpdateWithoutSessionsInput, UserDataUncheckedUpdateWithoutSessionsInput>
  }

  export type UserDataUpdateWithoutSessionsInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput
    Practitioner?: PractitionerUpdateManyWithoutUserNestedInput
  }

  export type UserDataUncheckedUpdateWithoutSessionsInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput
    Practitioner?: PractitionerUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserDataCreateWithoutAuthenticatorInput = {
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
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    Practitioner?: PractitionerCreateNestedManyWithoutUserInput
  }

  export type UserDataUncheckedCreateWithoutAuthenticatorInput = {
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
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    Practitioner?: PractitionerUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserDataCreateOrConnectWithoutAuthenticatorInput = {
    where: UserDataWhereUniqueInput
    create: XOR<UserDataCreateWithoutAuthenticatorInput, UserDataUncheckedCreateWithoutAuthenticatorInput>
  }

  export type UserDataUpsertWithoutAuthenticatorInput = {
    update: XOR<UserDataUpdateWithoutAuthenticatorInput, UserDataUncheckedUpdateWithoutAuthenticatorInput>
    create: XOR<UserDataCreateWithoutAuthenticatorInput, UserDataUncheckedCreateWithoutAuthenticatorInput>
    where?: UserDataWhereInput
  }

  export type UserDataUpdateToOneWithWhereWithoutAuthenticatorInput = {
    where?: UserDataWhereInput
    data: XOR<UserDataUpdateWithoutAuthenticatorInput, UserDataUncheckedUpdateWithoutAuthenticatorInput>
  }

  export type UserDataUpdateWithoutAuthenticatorInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    Practitioner?: PractitionerUpdateManyWithoutUserNestedInput
  }

  export type UserDataUncheckedUpdateWithoutAuthenticatorInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    Practitioner?: PractitionerUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserDataCreateWithoutPractitionerInput = {
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
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput
  }

  export type UserDataUncheckedCreateWithoutPractitionerInput = {
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
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserDataCreateOrConnectWithoutPractitionerInput = {
    where: UserDataWhereUniqueInput
    create: XOR<UserDataCreateWithoutPractitionerInput, UserDataUncheckedCreateWithoutPractitionerInput>
  }

  export type UserDataUpsertWithoutPractitionerInput = {
    update: XOR<UserDataUpdateWithoutPractitionerInput, UserDataUncheckedUpdateWithoutPractitionerInput>
    create: XOR<UserDataCreateWithoutPractitionerInput, UserDataUncheckedCreateWithoutPractitionerInput>
    where?: UserDataWhereInput
  }

  export type UserDataUpdateToOneWithWhereWithoutPractitionerInput = {
    where?: UserDataWhereInput
    data: XOR<UserDataUpdateWithoutPractitionerInput, UserDataUncheckedUpdateWithoutPractitionerInput>
  }

  export type UserDataUpdateWithoutPractitionerInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput
  }

  export type UserDataUncheckedUpdateWithoutPractitionerInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pronouns?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput
  }

  export type SequencesSeriesCreateWithoutSequenceInput = {
    id?: string
    seriesName: string
    seriesSet?: SequencesSeriesCreateseriesSetInput | string[]
  }

  export type SequencesSeriesUncheckedCreateWithoutSequenceInput = {
    id?: string
    seriesName: string
    seriesSet?: SequencesSeriesCreateseriesSetInput | string[]
  }

  export type SequencesSeriesCreateOrConnectWithoutSequenceInput = {
    where: SequencesSeriesWhereUniqueInput
    create: XOR<SequencesSeriesCreateWithoutSequenceInput, SequencesSeriesUncheckedCreateWithoutSequenceInput>
  }

  export type SequencesSeriesCreateManySequenceInputEnvelope = {
    data: SequencesSeriesCreateManySequenceInput | SequencesSeriesCreateManySequenceInput[]
  }

  export type SequencesSeriesUpsertWithWhereUniqueWithoutSequenceInput = {
    where: SequencesSeriesWhereUniqueInput
    update: XOR<SequencesSeriesUpdateWithoutSequenceInput, SequencesSeriesUncheckedUpdateWithoutSequenceInput>
    create: XOR<SequencesSeriesCreateWithoutSequenceInput, SequencesSeriesUncheckedCreateWithoutSequenceInput>
  }

  export type SequencesSeriesUpdateWithWhereUniqueWithoutSequenceInput = {
    where: SequencesSeriesWhereUniqueInput
    data: XOR<SequencesSeriesUpdateWithoutSequenceInput, SequencesSeriesUncheckedUpdateWithoutSequenceInput>
  }

  export type SequencesSeriesUpdateManyWithWhereWithoutSequenceInput = {
    where: SequencesSeriesScalarWhereInput
    data: XOR<SequencesSeriesUpdateManyMutationInput, SequencesSeriesUncheckedUpdateManyWithoutSequenceInput>
  }

  export type SequencesSeriesScalarWhereInput = {
    AND?: SequencesSeriesScalarWhereInput | SequencesSeriesScalarWhereInput[]
    OR?: SequencesSeriesScalarWhereInput[]
    NOT?: SequencesSeriesScalarWhereInput | SequencesSeriesScalarWhereInput[]
    id?: StringFilter<"SequencesSeries"> | string
    seriesName?: StringFilter<"SequencesSeries"> | string
    seriesSet?: StringNullableListFilter<"SequencesSeries">
    sequenceId?: StringFilter<"SequencesSeries"> | string
  }

  export type SequenceCreateWithoutSequencesSeriesInput = {
    id?: string
    nameSequence: string
  }

  export type SequenceUncheckedCreateWithoutSequencesSeriesInput = {
    id?: string
    nameSequence: string
  }

  export type SequenceCreateOrConnectWithoutSequencesSeriesInput = {
    where: SequenceWhereUniqueInput
    create: XOR<SequenceCreateWithoutSequencesSeriesInput, SequenceUncheckedCreateWithoutSequencesSeriesInput>
  }

  export type SequenceUpsertWithoutSequencesSeriesInput = {
    update: XOR<SequenceUpdateWithoutSequencesSeriesInput, SequenceUncheckedUpdateWithoutSequencesSeriesInput>
    create: XOR<SequenceCreateWithoutSequencesSeriesInput, SequenceUncheckedCreateWithoutSequencesSeriesInput>
    where?: SequenceWhereInput
  }

  export type SequenceUpdateToOneWithWhereWithoutSequencesSeriesInput = {
    where?: SequenceWhereInput
    data: XOR<SequenceUpdateWithoutSequencesSeriesInput, SequenceUncheckedUpdateWithoutSequencesSeriesInput>
  }

  export type SequenceUpdateWithoutSequencesSeriesInput = {
    nameSequence?: StringFieldUpdateOperationsInput | string
  }

  export type SequenceUncheckedUpdateWithoutSequencesSeriesInput = {
    nameSequence?: StringFieldUpdateOperationsInput | string
  }

  export type SanskritNameCreateWithoutPostureInput = {
    id?: string
    latin: string
    devanagari: string
    simplified: string
    translation?: TranslationCreateNestedManyWithoutSanskritNameInput
  }

  export type SanskritNameUncheckedCreateWithoutPostureInput = {
    id?: string
    latin: string
    devanagari: string
    simplified: string
    translation?: TranslationUncheckedCreateNestedManyWithoutSanskritNameInput
  }

  export type SanskritNameCreateOrConnectWithoutPostureInput = {
    where: SanskritNameWhereUniqueInput
    create: XOR<SanskritNameCreateWithoutPostureInput, SanskritNameUncheckedCreateWithoutPostureInput>
  }

  export type SanskritNameCreateManyPostureInputEnvelope = {
    data: SanskritNameCreateManyPostureInput | SanskritNameCreateManyPostureInput[]
  }

  export type SanskritNameUpsertWithWhereUniqueWithoutPostureInput = {
    where: SanskritNameWhereUniqueInput
    update: XOR<SanskritNameUpdateWithoutPostureInput, SanskritNameUncheckedUpdateWithoutPostureInput>
    create: XOR<SanskritNameCreateWithoutPostureInput, SanskritNameUncheckedCreateWithoutPostureInput>
  }

  export type SanskritNameUpdateWithWhereUniqueWithoutPostureInput = {
    where: SanskritNameWhereUniqueInput
    data: XOR<SanskritNameUpdateWithoutPostureInput, SanskritNameUncheckedUpdateWithoutPostureInput>
  }

  export type SanskritNameUpdateManyWithWhereWithoutPostureInput = {
    where: SanskritNameScalarWhereInput
    data: XOR<SanskritNameUpdateManyMutationInput, SanskritNameUncheckedUpdateManyWithoutPostureInput>
  }

  export type SanskritNameScalarWhereInput = {
    AND?: SanskritNameScalarWhereInput | SanskritNameScalarWhereInput[]
    OR?: SanskritNameScalarWhereInput[]
    NOT?: SanskritNameScalarWhereInput | SanskritNameScalarWhereInput[]
    id?: StringFilter<"SanskritName"> | string
    latin?: StringFilter<"SanskritName"> | string
    devanagari?: StringFilter<"SanskritName"> | string
    simplified?: StringFilter<"SanskritName"> | string
    postureId?: StringFilter<"SanskritName"> | string
  }

  export type TranslationCreateWithoutSanskritNameInput = {
    id?: string
    latin: string
    devanagari: string
    simplified: string
    description: string
  }

  export type TranslationUncheckedCreateWithoutSanskritNameInput = {
    id?: string
    latin: string
    devanagari: string
    simplified: string
    description: string
  }

  export type TranslationCreateOrConnectWithoutSanskritNameInput = {
    where: TranslationWhereUniqueInput
    create: XOR<TranslationCreateWithoutSanskritNameInput, TranslationUncheckedCreateWithoutSanskritNameInput>
  }

  export type TranslationCreateManySanskritNameInputEnvelope = {
    data: TranslationCreateManySanskritNameInput | TranslationCreateManySanskritNameInput[]
  }

  export type PostureCreateWithoutSanskrit_namesInput = {
    id?: string
    aka?: PostureCreateakaInput | string[]
    benefits: string
    category: string
    description: string
    difficulty: string
    display_name: string
    name: string
    next_poses?: PostureCreatenext_posesInput | string[]
    preferred_side: string
    previous_poses?: PostureCreateprevious_posesInput | string[]
    sideways: boolean
    sort_name: string
    subcategory: string
    two_sided: boolean
    variations?: InputJsonValue | null
    visibility: string
  }

  export type PostureUncheckedCreateWithoutSanskrit_namesInput = {
    id?: string
    aka?: PostureCreateakaInput | string[]
    benefits: string
    category: string
    description: string
    difficulty: string
    display_name: string
    name: string
    next_poses?: PostureCreatenext_posesInput | string[]
    preferred_side: string
    previous_poses?: PostureCreateprevious_posesInput | string[]
    sideways: boolean
    sort_name: string
    subcategory: string
    two_sided: boolean
    variations?: InputJsonValue | null
    visibility: string
  }

  export type PostureCreateOrConnectWithoutSanskrit_namesInput = {
    where: PostureWhereUniqueInput
    create: XOR<PostureCreateWithoutSanskrit_namesInput, PostureUncheckedCreateWithoutSanskrit_namesInput>
  }

  export type TranslationUpsertWithWhereUniqueWithoutSanskritNameInput = {
    where: TranslationWhereUniqueInput
    update: XOR<TranslationUpdateWithoutSanskritNameInput, TranslationUncheckedUpdateWithoutSanskritNameInput>
    create: XOR<TranslationCreateWithoutSanskritNameInput, TranslationUncheckedCreateWithoutSanskritNameInput>
  }

  export type TranslationUpdateWithWhereUniqueWithoutSanskritNameInput = {
    where: TranslationWhereUniqueInput
    data: XOR<TranslationUpdateWithoutSanskritNameInput, TranslationUncheckedUpdateWithoutSanskritNameInput>
  }

  export type TranslationUpdateManyWithWhereWithoutSanskritNameInput = {
    where: TranslationScalarWhereInput
    data: XOR<TranslationUpdateManyMutationInput, TranslationUncheckedUpdateManyWithoutSanskritNameInput>
  }

  export type TranslationScalarWhereInput = {
    AND?: TranslationScalarWhereInput | TranslationScalarWhereInput[]
    OR?: TranslationScalarWhereInput[]
    NOT?: TranslationScalarWhereInput | TranslationScalarWhereInput[]
    id?: StringFilter<"Translation"> | string
    latin?: StringFilter<"Translation"> | string
    devanagari?: StringFilter<"Translation"> | string
    simplified?: StringFilter<"Translation"> | string
    description?: StringFilter<"Translation"> | string
    sanskritNameId?: StringFilter<"Translation"> | string
  }

  export type PostureUpsertWithoutSanskrit_namesInput = {
    update: XOR<PostureUpdateWithoutSanskrit_namesInput, PostureUncheckedUpdateWithoutSanskrit_namesInput>
    create: XOR<PostureCreateWithoutSanskrit_namesInput, PostureUncheckedCreateWithoutSanskrit_namesInput>
    where?: PostureWhereInput
  }

  export type PostureUpdateToOneWithWhereWithoutSanskrit_namesInput = {
    where?: PostureWhereInput
    data: XOR<PostureUpdateWithoutSanskrit_namesInput, PostureUncheckedUpdateWithoutSanskrit_namesInput>
  }

  export type PostureUpdateWithoutSanskrit_namesInput = {
    aka?: PostureUpdateakaInput | string[]
    benefits?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    display_name?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    next_poses?: PostureUpdatenext_posesInput | string[]
    preferred_side?: StringFieldUpdateOperationsInput | string
    previous_poses?: PostureUpdateprevious_posesInput | string[]
    sideways?: BoolFieldUpdateOperationsInput | boolean
    sort_name?: StringFieldUpdateOperationsInput | string
    subcategory?: StringFieldUpdateOperationsInput | string
    two_sided?: BoolFieldUpdateOperationsInput | boolean
    variations?: InputJsonValue | InputJsonValue | null
    visibility?: StringFieldUpdateOperationsInput | string
  }

  export type PostureUncheckedUpdateWithoutSanskrit_namesInput = {
    aka?: PostureUpdateakaInput | string[]
    benefits?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    display_name?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    next_poses?: PostureUpdatenext_posesInput | string[]
    preferred_side?: StringFieldUpdateOperationsInput | string
    previous_poses?: PostureUpdateprevious_posesInput | string[]
    sideways?: BoolFieldUpdateOperationsInput | boolean
    sort_name?: StringFieldUpdateOperationsInput | string
    subcategory?: StringFieldUpdateOperationsInput | string
    two_sided?: BoolFieldUpdateOperationsInput | boolean
    variations?: InputJsonValue | InputJsonValue | null
    visibility?: StringFieldUpdateOperationsInput | string
  }

  export type SanskritNameCreateWithoutTranslationInput = {
    id?: string
    latin: string
    devanagari: string
    simplified: string
    posture: PostureCreateNestedOneWithoutSanskrit_namesInput
  }

  export type SanskritNameUncheckedCreateWithoutTranslationInput = {
    id?: string
    latin: string
    devanagari: string
    simplified: string
    postureId: string
  }

  export type SanskritNameCreateOrConnectWithoutTranslationInput = {
    where: SanskritNameWhereUniqueInput
    create: XOR<SanskritNameCreateWithoutTranslationInput, SanskritNameUncheckedCreateWithoutTranslationInput>
  }

  export type SanskritNameUpsertWithoutTranslationInput = {
    update: XOR<SanskritNameUpdateWithoutTranslationInput, SanskritNameUncheckedUpdateWithoutTranslationInput>
    create: XOR<SanskritNameCreateWithoutTranslationInput, SanskritNameUncheckedCreateWithoutTranslationInput>
    where?: SanskritNameWhereInput
  }

  export type SanskritNameUpdateToOneWithWhereWithoutTranslationInput = {
    where?: SanskritNameWhereInput
    data: XOR<SanskritNameUpdateWithoutTranslationInput, SanskritNameUncheckedUpdateWithoutTranslationInput>
  }

  export type SanskritNameUpdateWithoutTranslationInput = {
    latin?: StringFieldUpdateOperationsInput | string
    devanagari?: StringFieldUpdateOperationsInput | string
    simplified?: StringFieldUpdateOperationsInput | string
    posture?: PostureUpdateOneRequiredWithoutSanskrit_namesNestedInput
  }

  export type SanskritNameUncheckedUpdateWithoutTranslationInput = {
    latin?: StringFieldUpdateOperationsInput | string
    devanagari?: StringFieldUpdateOperationsInput | string
    simplified?: StringFieldUpdateOperationsInput | string
    postureId?: StringFieldUpdateOperationsInput | string
  }

  export type AccountCreateManyUserInput = {
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
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateManyUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthenticatorCreateManyUserInput = {
    credentialID: string
    providerAccountId: string
    credentialPublicKey: string
    counter: number
    credentialDeviceType: string
    credentialBackedUp: boolean
    transports?: string | null
  }

  export type PractitionerCreateManyUserInput = {
    id?: string
    firstName: string
    lastName: string
    pronouns: string
    emailPublic: string
    emailInternal: string
    emailAlternate: string
    phoneContact: string
    bio: string
    headline: string
    yogaStyle: string
    yogaExperience: string
    Facebook: string
    Google: string
    Patreon: string
    Twitch: string
    Twitter: string
    websiteURL: string
    blogURL: string
    socialURL: string
    streamingURL: string
    isInstructor: string
    isStudent: string
    isPrivate: string
    calendar: string
    timezone: string
    location: string
    isLocationPublic: string
    exportAccountInfo: string
    deleteAccountInfo: string
    company: string
  }

  export type AccountUpdateWithoutUserInput = {
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthenticatorUpdateWithoutUserInput = {
    providerAccountId?: StringFieldUpdateOperationsInput | string
    credentialPublicKey?: StringFieldUpdateOperationsInput | string
    counter?: IntFieldUpdateOperationsInput | number
    credentialDeviceType?: StringFieldUpdateOperationsInput | string
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean
    transports?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuthenticatorUncheckedUpdateWithoutUserInput = {
    providerAccountId?: StringFieldUpdateOperationsInput | string
    credentialPublicKey?: StringFieldUpdateOperationsInput | string
    counter?: IntFieldUpdateOperationsInput | number
    credentialDeviceType?: StringFieldUpdateOperationsInput | string
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean
    transports?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuthenticatorUncheckedUpdateManyWithoutUserInput = {
    providerAccountId?: StringFieldUpdateOperationsInput | string
    credentialPublicKey?: StringFieldUpdateOperationsInput | string
    counter?: IntFieldUpdateOperationsInput | number
    credentialDeviceType?: StringFieldUpdateOperationsInput | string
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean
    transports?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PractitionerUpdateWithoutUserInput = {
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    pronouns?: StringFieldUpdateOperationsInput | string
    emailPublic?: StringFieldUpdateOperationsInput | string
    emailInternal?: StringFieldUpdateOperationsInput | string
    emailAlternate?: StringFieldUpdateOperationsInput | string
    phoneContact?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    yogaStyle?: StringFieldUpdateOperationsInput | string
    yogaExperience?: StringFieldUpdateOperationsInput | string
    Facebook?: StringFieldUpdateOperationsInput | string
    Google?: StringFieldUpdateOperationsInput | string
    Patreon?: StringFieldUpdateOperationsInput | string
    Twitch?: StringFieldUpdateOperationsInput | string
    Twitter?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    blogURL?: StringFieldUpdateOperationsInput | string
    socialURL?: StringFieldUpdateOperationsInput | string
    streamingURL?: StringFieldUpdateOperationsInput | string
    isInstructor?: StringFieldUpdateOperationsInput | string
    isStudent?: StringFieldUpdateOperationsInput | string
    isPrivate?: StringFieldUpdateOperationsInput | string
    calendar?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    isLocationPublic?: StringFieldUpdateOperationsInput | string
    exportAccountInfo?: StringFieldUpdateOperationsInput | string
    deleteAccountInfo?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
  }

  export type PractitionerUncheckedUpdateWithoutUserInput = {
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    pronouns?: StringFieldUpdateOperationsInput | string
    emailPublic?: StringFieldUpdateOperationsInput | string
    emailInternal?: StringFieldUpdateOperationsInput | string
    emailAlternate?: StringFieldUpdateOperationsInput | string
    phoneContact?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    yogaStyle?: StringFieldUpdateOperationsInput | string
    yogaExperience?: StringFieldUpdateOperationsInput | string
    Facebook?: StringFieldUpdateOperationsInput | string
    Google?: StringFieldUpdateOperationsInput | string
    Patreon?: StringFieldUpdateOperationsInput | string
    Twitch?: StringFieldUpdateOperationsInput | string
    Twitter?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    blogURL?: StringFieldUpdateOperationsInput | string
    socialURL?: StringFieldUpdateOperationsInput | string
    streamingURL?: StringFieldUpdateOperationsInput | string
    isInstructor?: StringFieldUpdateOperationsInput | string
    isStudent?: StringFieldUpdateOperationsInput | string
    isPrivate?: StringFieldUpdateOperationsInput | string
    calendar?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    isLocationPublic?: StringFieldUpdateOperationsInput | string
    exportAccountInfo?: StringFieldUpdateOperationsInput | string
    deleteAccountInfo?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
  }

  export type PractitionerUncheckedUpdateManyWithoutUserInput = {
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    pronouns?: StringFieldUpdateOperationsInput | string
    emailPublic?: StringFieldUpdateOperationsInput | string
    emailInternal?: StringFieldUpdateOperationsInput | string
    emailAlternate?: StringFieldUpdateOperationsInput | string
    phoneContact?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    yogaStyle?: StringFieldUpdateOperationsInput | string
    yogaExperience?: StringFieldUpdateOperationsInput | string
    Facebook?: StringFieldUpdateOperationsInput | string
    Google?: StringFieldUpdateOperationsInput | string
    Patreon?: StringFieldUpdateOperationsInput | string
    Twitch?: StringFieldUpdateOperationsInput | string
    Twitter?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    blogURL?: StringFieldUpdateOperationsInput | string
    socialURL?: StringFieldUpdateOperationsInput | string
    streamingURL?: StringFieldUpdateOperationsInput | string
    isInstructor?: StringFieldUpdateOperationsInput | string
    isStudent?: StringFieldUpdateOperationsInput | string
    isPrivate?: StringFieldUpdateOperationsInput | string
    calendar?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    isLocationPublic?: StringFieldUpdateOperationsInput | string
    exportAccountInfo?: StringFieldUpdateOperationsInput | string
    deleteAccountInfo?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
  }

  export type SequencesSeriesCreateManySequenceInput = {
    id?: string
    seriesName: string
    seriesSet?: SequencesSeriesCreateseriesSetInput | string[]
  }

  export type SequencesSeriesUpdateWithoutSequenceInput = {
    seriesName?: StringFieldUpdateOperationsInput | string
    seriesSet?: SequencesSeriesUpdateseriesSetInput | string[]
  }

  export type SequencesSeriesUncheckedUpdateWithoutSequenceInput = {
    seriesName?: StringFieldUpdateOperationsInput | string
    seriesSet?: SequencesSeriesUpdateseriesSetInput | string[]
  }

  export type SequencesSeriesUncheckedUpdateManyWithoutSequenceInput = {
    seriesName?: StringFieldUpdateOperationsInput | string
    seriesSet?: SequencesSeriesUpdateseriesSetInput | string[]
  }

  export type SanskritNameCreateManyPostureInput = {
    id?: string
    latin: string
    devanagari: string
    simplified: string
  }

  export type SanskritNameUpdateWithoutPostureInput = {
    latin?: StringFieldUpdateOperationsInput | string
    devanagari?: StringFieldUpdateOperationsInput | string
    simplified?: StringFieldUpdateOperationsInput | string
    translation?: TranslationUpdateManyWithoutSanskritNameNestedInput
  }

  export type SanskritNameUncheckedUpdateWithoutPostureInput = {
    latin?: StringFieldUpdateOperationsInput | string
    devanagari?: StringFieldUpdateOperationsInput | string
    simplified?: StringFieldUpdateOperationsInput | string
    translation?: TranslationUncheckedUpdateManyWithoutSanskritNameNestedInput
  }

  export type SanskritNameUncheckedUpdateManyWithoutPostureInput = {
    latin?: StringFieldUpdateOperationsInput | string
    devanagari?: StringFieldUpdateOperationsInput | string
    simplified?: StringFieldUpdateOperationsInput | string
  }

  export type TranslationCreateManySanskritNameInput = {
    id?: string
    latin: string
    devanagari: string
    simplified: string
    description: string
  }

  export type TranslationUpdateWithoutSanskritNameInput = {
    latin?: StringFieldUpdateOperationsInput | string
    devanagari?: StringFieldUpdateOperationsInput | string
    simplified?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
  }

  export type TranslationUncheckedUpdateWithoutSanskritNameInput = {
    latin?: StringFieldUpdateOperationsInput | string
    devanagari?: StringFieldUpdateOperationsInput | string
    simplified?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
  }

  export type TranslationUncheckedUpdateManyWithoutSanskritNameInput = {
    latin?: StringFieldUpdateOperationsInput | string
    devanagari?: StringFieldUpdateOperationsInput | string
    simplified?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserDataCountOutputTypeDefaultArgs instead
     */
    export type UserDataCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDataCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SequenceCountOutputTypeDefaultArgs instead
     */
    export type SequenceCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SequenceCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PostureCountOutputTypeDefaultArgs instead
     */
    export type PostureCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PostureCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SanskritNameCountOutputTypeDefaultArgs instead
     */
    export type SanskritNameCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SanskritNameCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDataDefaultArgs instead
     */
    export type UserDataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDataDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AccountDefaultArgs instead
     */
    export type AccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AccountDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SessionDefaultArgs instead
     */
    export type SessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SessionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VerificationTokenDefaultArgs instead
     */
    export type VerificationTokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VerificationTokenDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AuthenticatorDefaultArgs instead
     */
    export type AuthenticatorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AuthenticatorDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PractitionerDefaultArgs instead
     */
    export type PractitionerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PractitionerDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SeriesDefaultArgs instead
     */
    export type SeriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SeriesDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FlowSeriesDefaultArgs instead
     */
    export type FlowSeriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FlowSeriesDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SequenceDefaultArgs instead
     */
    export type SequenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SequenceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SequencesSeriesDefaultArgs instead
     */
    export type SequencesSeriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SequencesSeriesDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PostureDefaultArgs instead
     */
    export type PostureArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PostureDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SanskritNameDefaultArgs instead
     */
    export type SanskritNameArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SanskritNameDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TranslationDefaultArgs instead
     */
    export type TranslationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TranslationDefaultArgs<ExtArgs>

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