
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
 * Model ProviderAccount
 * 
 */
export type ProviderAccount = $Result.DefaultSelection<Prisma.$ProviderAccountPayload>
/**
 * Model AsanaPosture
 * 
 */
export type AsanaPosture = $Result.DefaultSelection<Prisma.$AsanaPosturePayload>

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
   * `prisma.providerAccount`: Exposes CRUD operations for the **ProviderAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProviderAccounts
    * const providerAccounts = await prisma.providerAccount.findMany()
    * ```
    */
  get providerAccount(): Prisma.ProviderAccountDelegate<ExtArgs>;

  /**
   * `prisma.asanaPosture`: Exposes CRUD operations for the **AsanaPosture** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AsanaPostures
    * const asanaPostures = await prisma.asanaPosture.findMany()
    * ```
    */
  get asanaPosture(): Prisma.AsanaPostureDelegate<ExtArgs>;
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
    ProviderAccount: 'ProviderAccount',
    AsanaPosture: 'AsanaPosture'
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
      modelProps: "userData" | "providerAccount" | "asanaPosture"
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
            result: $Utils.Optional<ProviderAccountCountAggregateOutputType> | number
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
            result: $Utils.Optional<AsanaPostureCountAggregateOutputType> | number
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
    providerAccounts: number
  }

  export type UserDataCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    providerAccounts?: boolean | UserDataCountOutputTypeCountProviderAccountsArgs
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
  export type UserDataCountOutputTypeCountProviderAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProviderAccountWhereInput
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
    firstName: string
    lastName: string
    bio: string
    headline: string
    location: string
    websiteURL: string
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
    firstName?: boolean
    lastName?: boolean
    bio?: boolean
    headline?: boolean
    location?: boolean
    websiteURL?: boolean
    providerAccounts?: boolean | UserData$providerAccountsArgs<ExtArgs>
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
    firstName?: boolean
    lastName?: boolean
    bio?: boolean
    headline?: boolean
    location?: boolean
    websiteURL?: boolean
  }

  export type UserDataInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    providerAccounts?: boolean | UserData$providerAccountsArgs<ExtArgs>
    _count?: boolean | UserDataCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserDataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserData"
    objects: {
      providerAccounts: Prisma.$ProviderAccountPayload<ExtArgs>[]
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
      firstName: string
      lastName: string
      bio: string
      headline: string
      location: string
      websiteURL: string
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
    providerAccounts<T extends UserData$providerAccountsArgs<ExtArgs> = {}>(args?: Subset<T, UserData$providerAccountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProviderAccountPayload<ExtArgs>, T, "findMany"> | Null>
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
    readonly firstName: FieldRef<"UserData", 'String'>
    readonly lastName: FieldRef<"UserData", 'String'>
    readonly bio: FieldRef<"UserData", 'String'>
    readonly headline: FieldRef<"UserData", 'String'>
    readonly location: FieldRef<"UserData", 'String'>
    readonly websiteURL: FieldRef<"UserData", 'String'>
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
   * UserData.providerAccounts
   */
  export type UserData$providerAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderAccount
     */
    select?: ProviderAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderAccountInclude<ExtArgs> | null
    where?: ProviderAccountWhereInput
    orderBy?: ProviderAccountOrderByWithRelationInput | ProviderAccountOrderByWithRelationInput[]
    cursor?: ProviderAccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProviderAccountScalarFieldEnum | ProviderAccountScalarFieldEnum[]
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
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProviderAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProviderAccount to aggregate.
     */
    where?: ProviderAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderAccounts to fetch.
     */
    orderBy?: ProviderAccountOrderByWithRelationInput | ProviderAccountOrderByWithRelationInput[]
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

  export type GetProviderAccountAggregateType<T extends ProviderAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateProviderAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProviderAccount[P]>
      : GetScalarType<T[P], AggregateProviderAccount[P]>
  }




  export type ProviderAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProviderAccountWhereInput
    orderBy?: ProviderAccountOrderByWithAggregationInput | ProviderAccountOrderByWithAggregationInput[]
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
    createdAt: Date
    updatedAt: Date
    _count: ProviderAccountCountAggregateOutputType | null
    _avg: ProviderAccountAvgAggregateOutputType | null
    _sum: ProviderAccountSumAggregateOutputType | null
    _min: ProviderAccountMinAggregateOutputType | null
    _max: ProviderAccountMaxAggregateOutputType | null
  }

  type GetProviderAccountGroupByPayload<T extends ProviderAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProviderAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProviderAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProviderAccountGroupByOutputType[P]>
            : GetScalarType<T[P], ProviderAccountGroupByOutputType[P]>
        }
      >
    >


  export type ProviderAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
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
  }, ExtArgs["result"]["providerAccount"]>


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
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProviderAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDataDefaultArgs<ExtArgs>
  }

  export type $ProviderAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProviderAccount"
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
    }, ExtArgs["result"]["providerAccount"]>
    composites: {}
  }

  type ProviderAccountGetPayload<S extends boolean | null | undefined | ProviderAccountDefaultArgs> = $Result.GetResult<Prisma.$ProviderAccountPayload, S>

  type ProviderAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProviderAccountFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProviderAccountCountAggregateInputType | true
    }

  export interface ProviderAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProviderAccount'], meta: { name: 'ProviderAccount' } }
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
    findUnique<T extends ProviderAccountFindUniqueArgs>(args: SelectSubset<T, ProviderAccountFindUniqueArgs<ExtArgs>>): Prisma__ProviderAccountClient<$Result.GetResult<Prisma.$ProviderAccountPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

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
    findUniqueOrThrow<T extends ProviderAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, ProviderAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProviderAccountClient<$Result.GetResult<Prisma.$ProviderAccountPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

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
    findFirst<T extends ProviderAccountFindFirstArgs>(args?: SelectSubset<T, ProviderAccountFindFirstArgs<ExtArgs>>): Prisma__ProviderAccountClient<$Result.GetResult<Prisma.$ProviderAccountPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

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
    findFirstOrThrow<T extends ProviderAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, ProviderAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProviderAccountClient<$Result.GetResult<Prisma.$ProviderAccountPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

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
    findMany<T extends ProviderAccountFindManyArgs>(args?: SelectSubset<T, ProviderAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProviderAccountPayload<ExtArgs>, T, "findMany">>

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
    create<T extends ProviderAccountCreateArgs>(args: SelectSubset<T, ProviderAccountCreateArgs<ExtArgs>>): Prisma__ProviderAccountClient<$Result.GetResult<Prisma.$ProviderAccountPayload<ExtArgs>, T, "create">, never, ExtArgs>

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
    createMany<T extends ProviderAccountCreateManyArgs>(args?: SelectSubset<T, ProviderAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

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
    delete<T extends ProviderAccountDeleteArgs>(args: SelectSubset<T, ProviderAccountDeleteArgs<ExtArgs>>): Prisma__ProviderAccountClient<$Result.GetResult<Prisma.$ProviderAccountPayload<ExtArgs>, T, "delete">, never, ExtArgs>

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
    update<T extends ProviderAccountUpdateArgs>(args: SelectSubset<T, ProviderAccountUpdateArgs<ExtArgs>>): Prisma__ProviderAccountClient<$Result.GetResult<Prisma.$ProviderAccountPayload<ExtArgs>, T, "update">, never, ExtArgs>

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
    deleteMany<T extends ProviderAccountDeleteManyArgs>(args?: SelectSubset<T, ProviderAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

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
    updateMany<T extends ProviderAccountUpdateManyArgs>(args: SelectSubset<T, ProviderAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

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
    upsert<T extends ProviderAccountUpsertArgs>(args: SelectSubset<T, ProviderAccountUpsertArgs<ExtArgs>>): Prisma__ProviderAccountClient<$Result.GetResult<Prisma.$ProviderAccountPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

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
    aggregateRaw(args?: ProviderAccountAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


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
      args?: Subset<T, ProviderAccountCountArgs>,
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
    aggregate<T extends ProviderAccountAggregateArgs>(args: Subset<T, ProviderAccountAggregateArgs>): Prisma.PrismaPromise<GetProviderAccountAggregateType<T>>

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
    >(args: SubsetIntersection<T, ProviderAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProviderAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProviderAccount model
   */
  readonly fields: ProviderAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProviderAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProviderAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ProviderAccount model
   */ 
  interface ProviderAccountFieldRefs {
    readonly id: FieldRef<"ProviderAccount", 'String'>
    readonly userId: FieldRef<"ProviderAccount", 'String'>
    readonly type: FieldRef<"ProviderAccount", 'String'>
    readonly provider: FieldRef<"ProviderAccount", 'String'>
    readonly providerAccountId: FieldRef<"ProviderAccount", 'String'>
    readonly refresh_token: FieldRef<"ProviderAccount", 'String'>
    readonly access_token: FieldRef<"ProviderAccount", 'String'>
    readonly expires_at: FieldRef<"ProviderAccount", 'Int'>
    readonly token_type: FieldRef<"ProviderAccount", 'String'>
    readonly scope: FieldRef<"ProviderAccount", 'String'>
    readonly id_token: FieldRef<"ProviderAccount", 'String'>
    readonly session_state: FieldRef<"ProviderAccount", 'Json'>
    readonly createdAt: FieldRef<"ProviderAccount", 'DateTime'>
    readonly updatedAt: FieldRef<"ProviderAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProviderAccount findUnique
   */
  export type ProviderAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
  export type ProviderAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
  export type ProviderAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
    orderBy?: ProviderAccountOrderByWithRelationInput | ProviderAccountOrderByWithRelationInput[]
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
  export type ProviderAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
    orderBy?: ProviderAccountOrderByWithRelationInput | ProviderAccountOrderByWithRelationInput[]
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
  export type ProviderAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
    orderBy?: ProviderAccountOrderByWithRelationInput | ProviderAccountOrderByWithRelationInput[]
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
  export type ProviderAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
  export type ProviderAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProviderAccounts.
     */
    data: ProviderAccountCreateManyInput | ProviderAccountCreateManyInput[]
  }

  /**
   * ProviderAccount update
   */
  export type ProviderAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
  export type ProviderAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProviderAccounts.
     */
    data: XOR<ProviderAccountUpdateManyMutationInput, ProviderAccountUncheckedUpdateManyInput>
    /**
     * Filter which ProviderAccounts to update
     */
    where?: ProviderAccountWhereInput
  }

  /**
   * ProviderAccount upsert
   */
  export type ProviderAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
  export type ProviderAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
  export type ProviderAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProviderAccounts to delete
     */
    where?: ProviderAccountWhereInput
  }

  /**
   * ProviderAccount findRaw
   */
  export type ProviderAccountFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
  export type ProviderAccountAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
  export type ProviderAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
    alternate_english_name: string | null
    benefits: string | null
    category: string | null
    description: string | null
    difficulty: string | null
    simplified_english_name: string | null
    english_name: string | null
    next_poses: string | null
    preferred_side: string | null
    previous_poses: string | null
    sanskrit_names: string | null
    sideways: boolean | null
    sort_english_name: string | null
    subcategory: string | null
    two_sided: boolean | null
    variations_english_name: string | null
    visibility: string | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
    acitivity_completed: boolean | null
    acitivity_easy: boolean | null
    acitivity_difficult: boolean | null
    acitivity_practice: boolean | null
    posture_intent: string | null
    posture_meaning: string | null
    dristi: string | null
    breath: string | null
    duration: string | null
  }

  export type AsanaPostureMaxAggregateOutputType = {
    id: string | null
    alternate_english_name: string | null
    benefits: string | null
    category: string | null
    description: string | null
    difficulty: string | null
    simplified_english_name: string | null
    english_name: string | null
    next_poses: string | null
    preferred_side: string | null
    previous_poses: string | null
    sanskrit_names: string | null
    sideways: boolean | null
    sort_english_name: string | null
    subcategory: string | null
    two_sided: boolean | null
    variations_english_name: string | null
    visibility: string | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
    acitivity_completed: boolean | null
    acitivity_easy: boolean | null
    acitivity_difficult: boolean | null
    acitivity_practice: boolean | null
    posture_intent: string | null
    posture_meaning: string | null
    dristi: string | null
    breath: string | null
    duration: string | null
  }

  export type AsanaPostureCountAggregateOutputType = {
    id: number
    alternate_english_name: number
    benefits: number
    category: number
    description: number
    difficulty: number
    simplified_english_name: number
    english_name: number
    next_poses: number
    preferred_side: number
    previous_poses: number
    sanskrit_names: number
    sideways: number
    sort_english_name: number
    subcategory: number
    two_sided: number
    variations_english_name: number
    visibility: number
    image: number
    createdAt: number
    updatedAt: number
    acitivity_completed: number
    acitivity_easy: number
    acitivity_difficult: number
    acitivity_practice: number
    posture_intent: number
    posture_meaning: number
    dristi: number
    breath: number
    duration: number
    _all: number
  }


  export type AsanaPostureMinAggregateInputType = {
    id?: true
    alternate_english_name?: true
    benefits?: true
    category?: true
    description?: true
    difficulty?: true
    simplified_english_name?: true
    english_name?: true
    next_poses?: true
    preferred_side?: true
    previous_poses?: true
    sanskrit_names?: true
    sideways?: true
    sort_english_name?: true
    subcategory?: true
    two_sided?: true
    variations_english_name?: true
    visibility?: true
    image?: true
    createdAt?: true
    updatedAt?: true
    acitivity_completed?: true
    acitivity_easy?: true
    acitivity_difficult?: true
    acitivity_practice?: true
    posture_intent?: true
    posture_meaning?: true
    dristi?: true
    breath?: true
    duration?: true
  }

  export type AsanaPostureMaxAggregateInputType = {
    id?: true
    alternate_english_name?: true
    benefits?: true
    category?: true
    description?: true
    difficulty?: true
    simplified_english_name?: true
    english_name?: true
    next_poses?: true
    preferred_side?: true
    previous_poses?: true
    sanskrit_names?: true
    sideways?: true
    sort_english_name?: true
    subcategory?: true
    two_sided?: true
    variations_english_name?: true
    visibility?: true
    image?: true
    createdAt?: true
    updatedAt?: true
    acitivity_completed?: true
    acitivity_easy?: true
    acitivity_difficult?: true
    acitivity_practice?: true
    posture_intent?: true
    posture_meaning?: true
    dristi?: true
    breath?: true
    duration?: true
  }

  export type AsanaPostureCountAggregateInputType = {
    id?: true
    alternate_english_name?: true
    benefits?: true
    category?: true
    description?: true
    difficulty?: true
    simplified_english_name?: true
    english_name?: true
    next_poses?: true
    preferred_side?: true
    previous_poses?: true
    sanskrit_names?: true
    sideways?: true
    sort_english_name?: true
    subcategory?: true
    two_sided?: true
    variations_english_name?: true
    visibility?: true
    image?: true
    createdAt?: true
    updatedAt?: true
    acitivity_completed?: true
    acitivity_easy?: true
    acitivity_difficult?: true
    acitivity_practice?: true
    posture_intent?: true
    posture_meaning?: true
    dristi?: true
    breath?: true
    duration?: true
    _all?: true
  }

  export type AsanaPostureAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AsanaPosture to aggregate.
     */
    where?: AsanaPostureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AsanaPostures to fetch.
     */
    orderBy?: AsanaPostureOrderByWithRelationInput | AsanaPostureOrderByWithRelationInput[]
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

  export type GetAsanaPostureAggregateType<T extends AsanaPostureAggregateArgs> = {
        [P in keyof T & keyof AggregateAsanaPosture]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAsanaPosture[P]>
      : GetScalarType<T[P], AggregateAsanaPosture[P]>
  }




  export type AsanaPostureGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AsanaPostureWhereInput
    orderBy?: AsanaPostureOrderByWithAggregationInput | AsanaPostureOrderByWithAggregationInput[]
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
    alternate_english_name: string
    benefits: string
    category: string
    description: string
    difficulty: string
    simplified_english_name: string
    english_name: string
    next_poses: string
    preferred_side: string
    previous_poses: string
    sanskrit_names: string
    sideways: boolean
    sort_english_name: string
    subcategory: string
    two_sided: boolean
    variations_english_name: string
    visibility: string
    image: string
    createdAt: Date
    updatedAt: Date
    acitivity_completed: boolean
    acitivity_easy: boolean
    acitivity_difficult: boolean
    acitivity_practice: boolean
    posture_intent: string
    posture_meaning: string
    dristi: string
    breath: string
    duration: string
    _count: AsanaPostureCountAggregateOutputType | null
    _min: AsanaPostureMinAggregateOutputType | null
    _max: AsanaPostureMaxAggregateOutputType | null
  }

  type GetAsanaPostureGroupByPayload<T extends AsanaPostureGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AsanaPostureGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AsanaPostureGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AsanaPostureGroupByOutputType[P]>
            : GetScalarType<T[P], AsanaPostureGroupByOutputType[P]>
        }
      >
    >


  export type AsanaPostureSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    alternate_english_name?: boolean
    benefits?: boolean
    category?: boolean
    description?: boolean
    difficulty?: boolean
    simplified_english_name?: boolean
    english_name?: boolean
    next_poses?: boolean
    preferred_side?: boolean
    previous_poses?: boolean
    sanskrit_names?: boolean
    sideways?: boolean
    sort_english_name?: boolean
    subcategory?: boolean
    two_sided?: boolean
    variations_english_name?: boolean
    visibility?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    acitivity_completed?: boolean
    acitivity_easy?: boolean
    acitivity_difficult?: boolean
    acitivity_practice?: boolean
    posture_intent?: boolean
    posture_meaning?: boolean
    dristi?: boolean
    breath?: boolean
    duration?: boolean
  }, ExtArgs["result"]["asanaPosture"]>


  export type AsanaPostureSelectScalar = {
    id?: boolean
    alternate_english_name?: boolean
    benefits?: boolean
    category?: boolean
    description?: boolean
    difficulty?: boolean
    simplified_english_name?: boolean
    english_name?: boolean
    next_poses?: boolean
    preferred_side?: boolean
    previous_poses?: boolean
    sanskrit_names?: boolean
    sideways?: boolean
    sort_english_name?: boolean
    subcategory?: boolean
    two_sided?: boolean
    variations_english_name?: boolean
    visibility?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    acitivity_completed?: boolean
    acitivity_easy?: boolean
    acitivity_difficult?: boolean
    acitivity_practice?: boolean
    posture_intent?: boolean
    posture_meaning?: boolean
    dristi?: boolean
    breath?: boolean
    duration?: boolean
  }


  export type $AsanaPosturePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AsanaPosture"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      alternate_english_name: string
      benefits: string
      category: string
      description: string
      difficulty: string
      simplified_english_name: string
      english_name: string
      next_poses: string
      preferred_side: string
      previous_poses: string
      sanskrit_names: string
      sideways: boolean
      sort_english_name: string
      subcategory: string
      two_sided: boolean
      variations_english_name: string
      visibility: string
      image: string
      createdAt: Date
      updatedAt: Date
      acitivity_completed: boolean
      acitivity_easy: boolean
      acitivity_difficult: boolean
      acitivity_practice: boolean
      posture_intent: string
      posture_meaning: string
      dristi: string
      breath: string
      duration: string
    }, ExtArgs["result"]["asanaPosture"]>
    composites: {}
  }

  type AsanaPostureGetPayload<S extends boolean | null | undefined | AsanaPostureDefaultArgs> = $Result.GetResult<Prisma.$AsanaPosturePayload, S>

  type AsanaPostureCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AsanaPostureFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AsanaPostureCountAggregateInputType | true
    }

  export interface AsanaPostureDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AsanaPosture'], meta: { name: 'AsanaPosture' } }
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
    findUnique<T extends AsanaPostureFindUniqueArgs>(args: SelectSubset<T, AsanaPostureFindUniqueArgs<ExtArgs>>): Prisma__AsanaPostureClient<$Result.GetResult<Prisma.$AsanaPosturePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

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
    findUniqueOrThrow<T extends AsanaPostureFindUniqueOrThrowArgs>(args: SelectSubset<T, AsanaPostureFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AsanaPostureClient<$Result.GetResult<Prisma.$AsanaPosturePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

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
    findFirst<T extends AsanaPostureFindFirstArgs>(args?: SelectSubset<T, AsanaPostureFindFirstArgs<ExtArgs>>): Prisma__AsanaPostureClient<$Result.GetResult<Prisma.$AsanaPosturePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

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
    findFirstOrThrow<T extends AsanaPostureFindFirstOrThrowArgs>(args?: SelectSubset<T, AsanaPostureFindFirstOrThrowArgs<ExtArgs>>): Prisma__AsanaPostureClient<$Result.GetResult<Prisma.$AsanaPosturePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

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
    findMany<T extends AsanaPostureFindManyArgs>(args?: SelectSubset<T, AsanaPostureFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AsanaPosturePayload<ExtArgs>, T, "findMany">>

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
    create<T extends AsanaPostureCreateArgs>(args: SelectSubset<T, AsanaPostureCreateArgs<ExtArgs>>): Prisma__AsanaPostureClient<$Result.GetResult<Prisma.$AsanaPosturePayload<ExtArgs>, T, "create">, never, ExtArgs>

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
    createMany<T extends AsanaPostureCreateManyArgs>(args?: SelectSubset<T, AsanaPostureCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

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
    delete<T extends AsanaPostureDeleteArgs>(args: SelectSubset<T, AsanaPostureDeleteArgs<ExtArgs>>): Prisma__AsanaPostureClient<$Result.GetResult<Prisma.$AsanaPosturePayload<ExtArgs>, T, "delete">, never, ExtArgs>

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
    update<T extends AsanaPostureUpdateArgs>(args: SelectSubset<T, AsanaPostureUpdateArgs<ExtArgs>>): Prisma__AsanaPostureClient<$Result.GetResult<Prisma.$AsanaPosturePayload<ExtArgs>, T, "update">, never, ExtArgs>

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
    deleteMany<T extends AsanaPostureDeleteManyArgs>(args?: SelectSubset<T, AsanaPostureDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

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
    updateMany<T extends AsanaPostureUpdateManyArgs>(args: SelectSubset<T, AsanaPostureUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

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
    upsert<T extends AsanaPostureUpsertArgs>(args: SelectSubset<T, AsanaPostureUpsertArgs<ExtArgs>>): Prisma__AsanaPostureClient<$Result.GetResult<Prisma.$AsanaPosturePayload<ExtArgs>, T, "upsert">, never, ExtArgs>

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
    aggregateRaw(args?: AsanaPostureAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


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
      args?: Subset<T, AsanaPostureCountArgs>,
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
    aggregate<T extends AsanaPostureAggregateArgs>(args: Subset<T, AsanaPostureAggregateArgs>): Prisma.PrismaPromise<GetAsanaPostureAggregateType<T>>

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
    >(args: SubsetIntersection<T, AsanaPostureGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAsanaPostureGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AsanaPosture model
   */
  readonly fields: AsanaPostureFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AsanaPosture.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AsanaPostureClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the AsanaPosture model
   */ 
  interface AsanaPostureFieldRefs {
    readonly id: FieldRef<"AsanaPosture", 'String'>
    readonly alternate_english_name: FieldRef<"AsanaPosture", 'String'>
    readonly benefits: FieldRef<"AsanaPosture", 'String'>
    readonly category: FieldRef<"AsanaPosture", 'String'>
    readonly description: FieldRef<"AsanaPosture", 'String'>
    readonly difficulty: FieldRef<"AsanaPosture", 'String'>
    readonly simplified_english_name: FieldRef<"AsanaPosture", 'String'>
    readonly english_name: FieldRef<"AsanaPosture", 'String'>
    readonly next_poses: FieldRef<"AsanaPosture", 'String'>
    readonly preferred_side: FieldRef<"AsanaPosture", 'String'>
    readonly previous_poses: FieldRef<"AsanaPosture", 'String'>
    readonly sanskrit_names: FieldRef<"AsanaPosture", 'String'>
    readonly sideways: FieldRef<"AsanaPosture", 'Boolean'>
    readonly sort_english_name: FieldRef<"AsanaPosture", 'String'>
    readonly subcategory: FieldRef<"AsanaPosture", 'String'>
    readonly two_sided: FieldRef<"AsanaPosture", 'Boolean'>
    readonly variations_english_name: FieldRef<"AsanaPosture", 'String'>
    readonly visibility: FieldRef<"AsanaPosture", 'String'>
    readonly image: FieldRef<"AsanaPosture", 'String'>
    readonly createdAt: FieldRef<"AsanaPosture", 'DateTime'>
    readonly updatedAt: FieldRef<"AsanaPosture", 'DateTime'>
    readonly acitivity_completed: FieldRef<"AsanaPosture", 'Boolean'>
    readonly acitivity_easy: FieldRef<"AsanaPosture", 'Boolean'>
    readonly acitivity_difficult: FieldRef<"AsanaPosture", 'Boolean'>
    readonly acitivity_practice: FieldRef<"AsanaPosture", 'Boolean'>
    readonly posture_intent: FieldRef<"AsanaPosture", 'String'>
    readonly posture_meaning: FieldRef<"AsanaPosture", 'String'>
    readonly dristi: FieldRef<"AsanaPosture", 'String'>
    readonly breath: FieldRef<"AsanaPosture", 'String'>
    readonly duration: FieldRef<"AsanaPosture", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AsanaPosture findUnique
   */
  export type AsanaPostureFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
    /**
     * Filter, which AsanaPosture to fetch.
     */
    where: AsanaPostureWhereUniqueInput
  }

  /**
   * AsanaPosture findUniqueOrThrow
   */
  export type AsanaPostureFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
    /**
     * Filter, which AsanaPosture to fetch.
     */
    where: AsanaPostureWhereUniqueInput
  }

  /**
   * AsanaPosture findFirst
   */
  export type AsanaPostureFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
    /**
     * Filter, which AsanaPosture to fetch.
     */
    where?: AsanaPostureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AsanaPostures to fetch.
     */
    orderBy?: AsanaPostureOrderByWithRelationInput | AsanaPostureOrderByWithRelationInput[]
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
  export type AsanaPostureFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
    /**
     * Filter, which AsanaPosture to fetch.
     */
    where?: AsanaPostureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AsanaPostures to fetch.
     */
    orderBy?: AsanaPostureOrderByWithRelationInput | AsanaPostureOrderByWithRelationInput[]
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
  export type AsanaPostureFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
    /**
     * Filter, which AsanaPostures to fetch.
     */
    where?: AsanaPostureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AsanaPostures to fetch.
     */
    orderBy?: AsanaPostureOrderByWithRelationInput | AsanaPostureOrderByWithRelationInput[]
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
  export type AsanaPostureCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
    /**
     * The data needed to create a AsanaPosture.
     */
    data: XOR<AsanaPostureCreateInput, AsanaPostureUncheckedCreateInput>
  }

  /**
   * AsanaPosture createMany
   */
  export type AsanaPostureCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AsanaPostures.
     */
    data: AsanaPostureCreateManyInput | AsanaPostureCreateManyInput[]
  }

  /**
   * AsanaPosture update
   */
  export type AsanaPostureUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
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
  export type AsanaPostureUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AsanaPostures.
     */
    data: XOR<AsanaPostureUpdateManyMutationInput, AsanaPostureUncheckedUpdateManyInput>
    /**
     * Filter which AsanaPostures to update
     */
    where?: AsanaPostureWhereInput
  }

  /**
   * AsanaPosture upsert
   */
  export type AsanaPostureUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
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
  export type AsanaPostureDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
    /**
     * Filter which AsanaPosture to delete.
     */
    where: AsanaPostureWhereUniqueInput
  }

  /**
   * AsanaPosture deleteMany
   */
  export type AsanaPostureDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AsanaPostures to delete
     */
    where?: AsanaPostureWhereInput
  }

  /**
   * AsanaPosture findRaw
   */
  export type AsanaPostureFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
  export type AsanaPostureAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * AsanaPosture without action
   */
  export type AsanaPostureDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AsanaPosture
     */
    select?: AsanaPostureSelect<ExtArgs> | null
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
    updatedAt: 'updatedAt',
    firstName: 'firstName',
    lastName: 'lastName',
    bio: 'bio',
    headline: 'headline',
    location: 'location',
    websiteURL: 'websiteURL'
  };

  export type UserDataScalarFieldEnum = (typeof UserDataScalarFieldEnum)[keyof typeof UserDataScalarFieldEnum]


  export const ProviderAccountScalarFieldEnum: {
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

  export type ProviderAccountScalarFieldEnum = (typeof ProviderAccountScalarFieldEnum)[keyof typeof ProviderAccountScalarFieldEnum]


  export const AsanaPostureScalarFieldEnum: {
    id: 'id',
    alternate_english_name: 'alternate_english_name',
    benefits: 'benefits',
    category: 'category',
    description: 'description',
    difficulty: 'difficulty',
    simplified_english_name: 'simplified_english_name',
    english_name: 'english_name',
    next_poses: 'next_poses',
    preferred_side: 'preferred_side',
    previous_poses: 'previous_poses',
    sanskrit_names: 'sanskrit_names',
    sideways: 'sideways',
    sort_english_name: 'sort_english_name',
    subcategory: 'subcategory',
    two_sided: 'two_sided',
    variations_english_name: 'variations_english_name',
    visibility: 'visibility',
    image: 'image',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    acitivity_completed: 'acitivity_completed',
    acitivity_easy: 'acitivity_easy',
    acitivity_difficult: 'acitivity_difficult',
    acitivity_practice: 'acitivity_practice',
    posture_intent: 'posture_intent',
    posture_meaning: 'posture_meaning',
    dristi: 'dristi',
    breath: 'breath',
    duration: 'duration'
  };

  export type AsanaPostureScalarFieldEnum = (typeof AsanaPostureScalarFieldEnum)[keyof typeof AsanaPostureScalarFieldEnum]


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
    firstName?: StringFilter<"UserData"> | string
    lastName?: StringFilter<"UserData"> | string
    bio?: StringFilter<"UserData"> | string
    headline?: StringFilter<"UserData"> | string
    location?: StringFilter<"UserData"> | string
    websiteURL?: StringFilter<"UserData"> | string
    providerAccounts?: ProviderAccountListRelationFilter
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
    providerAccounts?: ProviderAccountOrderByRelationAggregateInput
  }

  export type UserDataWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_id?: string
    email?: string
    AND?: UserDataWhereInput | UserDataWhereInput[]
    OR?: UserDataWhereInput[]
    NOT?: UserDataWhereInput | UserDataWhereInput[]
    name?: StringNullableFilter<"UserData"> | string | null
    emailVerified?: DateTimeNullableFilter<"UserData"> | Date | string | null
    image?: StringNullableFilter<"UserData"> | string | null
    pronouns?: StringNullableFilter<"UserData"> | string | null
    profile?: JsonNullableFilter<"UserData">
    createdAt?: DateTimeFilter<"UserData"> | Date | string
    updatedAt?: DateTimeFilter<"UserData"> | Date | string
    firstName?: StringFilter<"UserData"> | string
    lastName?: StringFilter<"UserData"> | string
    bio?: StringFilter<"UserData"> | string
    headline?: StringFilter<"UserData"> | string
    location?: StringFilter<"UserData"> | string
    websiteURL?: StringFilter<"UserData"> | string
    providerAccounts?: ProviderAccountListRelationFilter
  }, "id" | "provider_id" | "email">

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
    firstName?: StringWithAggregatesFilter<"UserData"> | string
    lastName?: StringWithAggregatesFilter<"UserData"> | string
    bio?: StringWithAggregatesFilter<"UserData"> | string
    headline?: StringWithAggregatesFilter<"UserData"> | string
    location?: StringWithAggregatesFilter<"UserData"> | string
    websiteURL?: StringWithAggregatesFilter<"UserData"> | string
  }

  export type ProviderAccountWhereInput = {
    AND?: ProviderAccountWhereInput | ProviderAccountWhereInput[]
    OR?: ProviderAccountWhereInput[]
    NOT?: ProviderAccountWhereInput | ProviderAccountWhereInput[]
    id?: StringFilter<"ProviderAccount"> | string
    userId?: StringFilter<"ProviderAccount"> | string
    type?: StringFilter<"ProviderAccount"> | string
    provider?: StringFilter<"ProviderAccount"> | string
    providerAccountId?: StringFilter<"ProviderAccount"> | string
    refresh_token?: StringNullableFilter<"ProviderAccount"> | string | null
    access_token?: StringNullableFilter<"ProviderAccount"> | string | null
    expires_at?: IntNullableFilter<"ProviderAccount"> | number | null
    token_type?: StringNullableFilter<"ProviderAccount"> | string | null
    scope?: StringNullableFilter<"ProviderAccount"> | string | null
    id_token?: StringNullableFilter<"ProviderAccount"> | string | null
    session_state?: JsonNullableFilter<"ProviderAccount">
    createdAt?: DateTimeFilter<"ProviderAccount"> | Date | string
    updatedAt?: DateTimeFilter<"ProviderAccount"> | Date | string
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
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserDataOrderByWithRelationInput
  }

  export type ProviderAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: ProviderAccountWhereInput | ProviderAccountWhereInput[]
    OR?: ProviderAccountWhereInput[]
    NOT?: ProviderAccountWhereInput | ProviderAccountWhereInput[]
    type?: StringFilter<"ProviderAccount"> | string
    provider?: StringFilter<"ProviderAccount"> | string
    providerAccountId?: StringFilter<"ProviderAccount"> | string
    refresh_token?: StringNullableFilter<"ProviderAccount"> | string | null
    access_token?: StringNullableFilter<"ProviderAccount"> | string | null
    expires_at?: IntNullableFilter<"ProviderAccount"> | number | null
    token_type?: StringNullableFilter<"ProviderAccount"> | string | null
    scope?: StringNullableFilter<"ProviderAccount"> | string | null
    id_token?: StringNullableFilter<"ProviderAccount"> | string | null
    session_state?: JsonNullableFilter<"ProviderAccount">
    createdAt?: DateTimeFilter<"ProviderAccount"> | Date | string
    updatedAt?: DateTimeFilter<"ProviderAccount"> | Date | string
    user?: XOR<UserDataRelationFilter, UserDataWhereInput>
  }, "id" | "userId">

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
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProviderAccountCountOrderByAggregateInput
    _avg?: ProviderAccountAvgOrderByAggregateInput
    _max?: ProviderAccountMaxOrderByAggregateInput
    _min?: ProviderAccountMinOrderByAggregateInput
    _sum?: ProviderAccountSumOrderByAggregateInput
  }

  export type ProviderAccountScalarWhereWithAggregatesInput = {
    AND?: ProviderAccountScalarWhereWithAggregatesInput | ProviderAccountScalarWhereWithAggregatesInput[]
    OR?: ProviderAccountScalarWhereWithAggregatesInput[]
    NOT?: ProviderAccountScalarWhereWithAggregatesInput | ProviderAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProviderAccount"> | string
    userId?: StringWithAggregatesFilter<"ProviderAccount"> | string
    type?: StringWithAggregatesFilter<"ProviderAccount"> | string
    provider?: StringWithAggregatesFilter<"ProviderAccount"> | string
    providerAccountId?: StringWithAggregatesFilter<"ProviderAccount"> | string
    refresh_token?: StringNullableWithAggregatesFilter<"ProviderAccount"> | string | null
    access_token?: StringNullableWithAggregatesFilter<"ProviderAccount"> | string | null
    expires_at?: IntNullableWithAggregatesFilter<"ProviderAccount"> | number | null
    token_type?: StringNullableWithAggregatesFilter<"ProviderAccount"> | string | null
    scope?: StringNullableWithAggregatesFilter<"ProviderAccount"> | string | null
    id_token?: StringNullableWithAggregatesFilter<"ProviderAccount"> | string | null
    session_state?: JsonNullableWithAggregatesFilter<"ProviderAccount">
    createdAt?: DateTimeWithAggregatesFilter<"ProviderAccount"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProviderAccount"> | Date | string
  }

  export type AsanaPostureWhereInput = {
    AND?: AsanaPostureWhereInput | AsanaPostureWhereInput[]
    OR?: AsanaPostureWhereInput[]
    NOT?: AsanaPostureWhereInput | AsanaPostureWhereInput[]
    id?: StringFilter<"AsanaPosture"> | string
    alternate_english_name?: StringFilter<"AsanaPosture"> | string
    benefits?: StringFilter<"AsanaPosture"> | string
    category?: StringFilter<"AsanaPosture"> | string
    description?: StringFilter<"AsanaPosture"> | string
    difficulty?: StringFilter<"AsanaPosture"> | string
    simplified_english_name?: StringFilter<"AsanaPosture"> | string
    english_name?: StringFilter<"AsanaPosture"> | string
    next_poses?: StringFilter<"AsanaPosture"> | string
    preferred_side?: StringFilter<"AsanaPosture"> | string
    previous_poses?: StringFilter<"AsanaPosture"> | string
    sanskrit_names?: StringFilter<"AsanaPosture"> | string
    sideways?: BoolFilter<"AsanaPosture"> | boolean
    sort_english_name?: StringFilter<"AsanaPosture"> | string
    subcategory?: StringFilter<"AsanaPosture"> | string
    two_sided?: BoolFilter<"AsanaPosture"> | boolean
    variations_english_name?: StringFilter<"AsanaPosture"> | string
    visibility?: StringFilter<"AsanaPosture"> | string
    image?: StringFilter<"AsanaPosture"> | string
    createdAt?: DateTimeFilter<"AsanaPosture"> | Date | string
    updatedAt?: DateTimeFilter<"AsanaPosture"> | Date | string
    acitivity_completed?: BoolFilter<"AsanaPosture"> | boolean
    acitivity_easy?: BoolFilter<"AsanaPosture"> | boolean
    acitivity_difficult?: BoolFilter<"AsanaPosture"> | boolean
    acitivity_practice?: BoolFilter<"AsanaPosture"> | boolean
    posture_intent?: StringFilter<"AsanaPosture"> | string
    posture_meaning?: StringFilter<"AsanaPosture"> | string
    dristi?: StringFilter<"AsanaPosture"> | string
    breath?: StringFilter<"AsanaPosture"> | string
    duration?: StringFilter<"AsanaPosture"> | string
  }

  export type AsanaPostureOrderByWithRelationInput = {
    id?: SortOrder
    alternate_english_name?: SortOrder
    benefits?: SortOrder
    category?: SortOrder
    description?: SortOrder
    difficulty?: SortOrder
    simplified_english_name?: SortOrder
    english_name?: SortOrder
    next_poses?: SortOrder
    preferred_side?: SortOrder
    previous_poses?: SortOrder
    sanskrit_names?: SortOrder
    sideways?: SortOrder
    sort_english_name?: SortOrder
    subcategory?: SortOrder
    two_sided?: SortOrder
    variations_english_name?: SortOrder
    visibility?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    acitivity_completed?: SortOrder
    acitivity_easy?: SortOrder
    acitivity_difficult?: SortOrder
    acitivity_practice?: SortOrder
    posture_intent?: SortOrder
    posture_meaning?: SortOrder
    dristi?: SortOrder
    breath?: SortOrder
    duration?: SortOrder
  }

  export type AsanaPostureWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AsanaPostureWhereInput | AsanaPostureWhereInput[]
    OR?: AsanaPostureWhereInput[]
    NOT?: AsanaPostureWhereInput | AsanaPostureWhereInput[]
    alternate_english_name?: StringFilter<"AsanaPosture"> | string
    benefits?: StringFilter<"AsanaPosture"> | string
    category?: StringFilter<"AsanaPosture"> | string
    description?: StringFilter<"AsanaPosture"> | string
    difficulty?: StringFilter<"AsanaPosture"> | string
    simplified_english_name?: StringFilter<"AsanaPosture"> | string
    english_name?: StringFilter<"AsanaPosture"> | string
    next_poses?: StringFilter<"AsanaPosture"> | string
    preferred_side?: StringFilter<"AsanaPosture"> | string
    previous_poses?: StringFilter<"AsanaPosture"> | string
    sanskrit_names?: StringFilter<"AsanaPosture"> | string
    sideways?: BoolFilter<"AsanaPosture"> | boolean
    sort_english_name?: StringFilter<"AsanaPosture"> | string
    subcategory?: StringFilter<"AsanaPosture"> | string
    two_sided?: BoolFilter<"AsanaPosture"> | boolean
    variations_english_name?: StringFilter<"AsanaPosture"> | string
    visibility?: StringFilter<"AsanaPosture"> | string
    image?: StringFilter<"AsanaPosture"> | string
    createdAt?: DateTimeFilter<"AsanaPosture"> | Date | string
    updatedAt?: DateTimeFilter<"AsanaPosture"> | Date | string
    acitivity_completed?: BoolFilter<"AsanaPosture"> | boolean
    acitivity_easy?: BoolFilter<"AsanaPosture"> | boolean
    acitivity_difficult?: BoolFilter<"AsanaPosture"> | boolean
    acitivity_practice?: BoolFilter<"AsanaPosture"> | boolean
    posture_intent?: StringFilter<"AsanaPosture"> | string
    posture_meaning?: StringFilter<"AsanaPosture"> | string
    dristi?: StringFilter<"AsanaPosture"> | string
    breath?: StringFilter<"AsanaPosture"> | string
    duration?: StringFilter<"AsanaPosture"> | string
  }, "id">

  export type AsanaPostureOrderByWithAggregationInput = {
    id?: SortOrder
    alternate_english_name?: SortOrder
    benefits?: SortOrder
    category?: SortOrder
    description?: SortOrder
    difficulty?: SortOrder
    simplified_english_name?: SortOrder
    english_name?: SortOrder
    next_poses?: SortOrder
    preferred_side?: SortOrder
    previous_poses?: SortOrder
    sanskrit_names?: SortOrder
    sideways?: SortOrder
    sort_english_name?: SortOrder
    subcategory?: SortOrder
    two_sided?: SortOrder
    variations_english_name?: SortOrder
    visibility?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    acitivity_completed?: SortOrder
    acitivity_easy?: SortOrder
    acitivity_difficult?: SortOrder
    acitivity_practice?: SortOrder
    posture_intent?: SortOrder
    posture_meaning?: SortOrder
    dristi?: SortOrder
    breath?: SortOrder
    duration?: SortOrder
    _count?: AsanaPostureCountOrderByAggregateInput
    _max?: AsanaPostureMaxOrderByAggregateInput
    _min?: AsanaPostureMinOrderByAggregateInput
  }

  export type AsanaPostureScalarWhereWithAggregatesInput = {
    AND?: AsanaPostureScalarWhereWithAggregatesInput | AsanaPostureScalarWhereWithAggregatesInput[]
    OR?: AsanaPostureScalarWhereWithAggregatesInput[]
    NOT?: AsanaPostureScalarWhereWithAggregatesInput | AsanaPostureScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AsanaPosture"> | string
    alternate_english_name?: StringWithAggregatesFilter<"AsanaPosture"> | string
    benefits?: StringWithAggregatesFilter<"AsanaPosture"> | string
    category?: StringWithAggregatesFilter<"AsanaPosture"> | string
    description?: StringWithAggregatesFilter<"AsanaPosture"> | string
    difficulty?: StringWithAggregatesFilter<"AsanaPosture"> | string
    simplified_english_name?: StringWithAggregatesFilter<"AsanaPosture"> | string
    english_name?: StringWithAggregatesFilter<"AsanaPosture"> | string
    next_poses?: StringWithAggregatesFilter<"AsanaPosture"> | string
    preferred_side?: StringWithAggregatesFilter<"AsanaPosture"> | string
    previous_poses?: StringWithAggregatesFilter<"AsanaPosture"> | string
    sanskrit_names?: StringWithAggregatesFilter<"AsanaPosture"> | string
    sideways?: BoolWithAggregatesFilter<"AsanaPosture"> | boolean
    sort_english_name?: StringWithAggregatesFilter<"AsanaPosture"> | string
    subcategory?: StringWithAggregatesFilter<"AsanaPosture"> | string
    two_sided?: BoolWithAggregatesFilter<"AsanaPosture"> | boolean
    variations_english_name?: StringWithAggregatesFilter<"AsanaPosture"> | string
    visibility?: StringWithAggregatesFilter<"AsanaPosture"> | string
    image?: StringWithAggregatesFilter<"AsanaPosture"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AsanaPosture"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AsanaPosture"> | Date | string
    acitivity_completed?: BoolWithAggregatesFilter<"AsanaPosture"> | boolean
    acitivity_easy?: BoolWithAggregatesFilter<"AsanaPosture"> | boolean
    acitivity_difficult?: BoolWithAggregatesFilter<"AsanaPosture"> | boolean
    acitivity_practice?: BoolWithAggregatesFilter<"AsanaPosture"> | boolean
    posture_intent?: StringWithAggregatesFilter<"AsanaPosture"> | string
    posture_meaning?: StringWithAggregatesFilter<"AsanaPosture"> | string
    dristi?: StringWithAggregatesFilter<"AsanaPosture"> | string
    breath?: StringWithAggregatesFilter<"AsanaPosture"> | string
    duration?: StringWithAggregatesFilter<"AsanaPosture"> | string
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
    providerAccounts?: ProviderAccountCreateNestedManyWithoutUserInput
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
    providerAccounts?: ProviderAccountUncheckedCreateNestedManyWithoutUserInput
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
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUpdateManyWithoutUserNestedInput
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
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
    providerAccounts?: ProviderAccountUncheckedUpdateManyWithoutUserNestedInput
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
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
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
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    websiteURL?: StringFieldUpdateOperationsInput | string
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsanaPostureCreateInput = {
    id?: string
    alternate_english_name: string
    benefits: string
    category: string
    description: string
    difficulty: string
    simplified_english_name: string
    english_name: string
    next_poses: string
    preferred_side: string
    previous_poses: string
    sanskrit_names: string
    sideways: boolean
    sort_english_name: string
    subcategory: string
    two_sided: boolean
    variations_english_name: string
    visibility: string
    image: string
    createdAt?: Date | string
    updatedAt?: Date | string
    acitivity_completed: boolean
    acitivity_easy: boolean
    acitivity_difficult: boolean
    acitivity_practice: boolean
    posture_intent: string
    posture_meaning: string
    dristi: string
    breath: string
    duration: string
  }

  export type AsanaPostureUncheckedCreateInput = {
    id?: string
    alternate_english_name: string
    benefits: string
    category: string
    description: string
    difficulty: string
    simplified_english_name: string
    english_name: string
    next_poses: string
    preferred_side: string
    previous_poses: string
    sanskrit_names: string
    sideways: boolean
    sort_english_name: string
    subcategory: string
    two_sided: boolean
    variations_english_name: string
    visibility: string
    image: string
    createdAt?: Date | string
    updatedAt?: Date | string
    acitivity_completed: boolean
    acitivity_easy: boolean
    acitivity_difficult: boolean
    acitivity_practice: boolean
    posture_intent: string
    posture_meaning: string
    dristi: string
    breath: string
    duration: string
  }

  export type AsanaPostureUpdateInput = {
    alternate_english_name?: StringFieldUpdateOperationsInput | string
    benefits?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    simplified_english_name?: StringFieldUpdateOperationsInput | string
    english_name?: StringFieldUpdateOperationsInput | string
    next_poses?: StringFieldUpdateOperationsInput | string
    preferred_side?: StringFieldUpdateOperationsInput | string
    previous_poses?: StringFieldUpdateOperationsInput | string
    sanskrit_names?: StringFieldUpdateOperationsInput | string
    sideways?: BoolFieldUpdateOperationsInput | boolean
    sort_english_name?: StringFieldUpdateOperationsInput | string
    subcategory?: StringFieldUpdateOperationsInput | string
    two_sided?: BoolFieldUpdateOperationsInput | boolean
    variations_english_name?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acitivity_completed?: BoolFieldUpdateOperationsInput | boolean
    acitivity_easy?: BoolFieldUpdateOperationsInput | boolean
    acitivity_difficult?: BoolFieldUpdateOperationsInput | boolean
    acitivity_practice?: BoolFieldUpdateOperationsInput | boolean
    posture_intent?: StringFieldUpdateOperationsInput | string
    posture_meaning?: StringFieldUpdateOperationsInput | string
    dristi?: StringFieldUpdateOperationsInput | string
    breath?: StringFieldUpdateOperationsInput | string
    duration?: StringFieldUpdateOperationsInput | string
  }

  export type AsanaPostureUncheckedUpdateInput = {
    alternate_english_name?: StringFieldUpdateOperationsInput | string
    benefits?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    simplified_english_name?: StringFieldUpdateOperationsInput | string
    english_name?: StringFieldUpdateOperationsInput | string
    next_poses?: StringFieldUpdateOperationsInput | string
    preferred_side?: StringFieldUpdateOperationsInput | string
    previous_poses?: StringFieldUpdateOperationsInput | string
    sanskrit_names?: StringFieldUpdateOperationsInput | string
    sideways?: BoolFieldUpdateOperationsInput | boolean
    sort_english_name?: StringFieldUpdateOperationsInput | string
    subcategory?: StringFieldUpdateOperationsInput | string
    two_sided?: BoolFieldUpdateOperationsInput | boolean
    variations_english_name?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acitivity_completed?: BoolFieldUpdateOperationsInput | boolean
    acitivity_easy?: BoolFieldUpdateOperationsInput | boolean
    acitivity_difficult?: BoolFieldUpdateOperationsInput | boolean
    acitivity_practice?: BoolFieldUpdateOperationsInput | boolean
    posture_intent?: StringFieldUpdateOperationsInput | string
    posture_meaning?: StringFieldUpdateOperationsInput | string
    dristi?: StringFieldUpdateOperationsInput | string
    breath?: StringFieldUpdateOperationsInput | string
    duration?: StringFieldUpdateOperationsInput | string
  }

  export type AsanaPostureCreateManyInput = {
    id?: string
    alternate_english_name: string
    benefits: string
    category: string
    description: string
    difficulty: string
    simplified_english_name: string
    english_name: string
    next_poses: string
    preferred_side: string
    previous_poses: string
    sanskrit_names: string
    sideways: boolean
    sort_english_name: string
    subcategory: string
    two_sided: boolean
    variations_english_name: string
    visibility: string
    image: string
    createdAt?: Date | string
    updatedAt?: Date | string
    acitivity_completed: boolean
    acitivity_easy: boolean
    acitivity_difficult: boolean
    acitivity_practice: boolean
    posture_intent: string
    posture_meaning: string
    dristi: string
    breath: string
    duration: string
  }

  export type AsanaPostureUpdateManyMutationInput = {
    alternate_english_name?: StringFieldUpdateOperationsInput | string
    benefits?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    simplified_english_name?: StringFieldUpdateOperationsInput | string
    english_name?: StringFieldUpdateOperationsInput | string
    next_poses?: StringFieldUpdateOperationsInput | string
    preferred_side?: StringFieldUpdateOperationsInput | string
    previous_poses?: StringFieldUpdateOperationsInput | string
    sanskrit_names?: StringFieldUpdateOperationsInput | string
    sideways?: BoolFieldUpdateOperationsInput | boolean
    sort_english_name?: StringFieldUpdateOperationsInput | string
    subcategory?: StringFieldUpdateOperationsInput | string
    two_sided?: BoolFieldUpdateOperationsInput | boolean
    variations_english_name?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acitivity_completed?: BoolFieldUpdateOperationsInput | boolean
    acitivity_easy?: BoolFieldUpdateOperationsInput | boolean
    acitivity_difficult?: BoolFieldUpdateOperationsInput | boolean
    acitivity_practice?: BoolFieldUpdateOperationsInput | boolean
    posture_intent?: StringFieldUpdateOperationsInput | string
    posture_meaning?: StringFieldUpdateOperationsInput | string
    dristi?: StringFieldUpdateOperationsInput | string
    breath?: StringFieldUpdateOperationsInput | string
    duration?: StringFieldUpdateOperationsInput | string
  }

  export type AsanaPostureUncheckedUpdateManyInput = {
    alternate_english_name?: StringFieldUpdateOperationsInput | string
    benefits?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    simplified_english_name?: StringFieldUpdateOperationsInput | string
    english_name?: StringFieldUpdateOperationsInput | string
    next_poses?: StringFieldUpdateOperationsInput | string
    preferred_side?: StringFieldUpdateOperationsInput | string
    previous_poses?: StringFieldUpdateOperationsInput | string
    sanskrit_names?: StringFieldUpdateOperationsInput | string
    sideways?: BoolFieldUpdateOperationsInput | boolean
    sort_english_name?: StringFieldUpdateOperationsInput | string
    subcategory?: StringFieldUpdateOperationsInput | string
    two_sided?: BoolFieldUpdateOperationsInput | boolean
    variations_english_name?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    image?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acitivity_completed?: BoolFieldUpdateOperationsInput | boolean
    acitivity_easy?: BoolFieldUpdateOperationsInput | boolean
    acitivity_difficult?: BoolFieldUpdateOperationsInput | boolean
    acitivity_practice?: BoolFieldUpdateOperationsInput | boolean
    posture_intent?: StringFieldUpdateOperationsInput | string
    posture_meaning?: StringFieldUpdateOperationsInput | string
    dristi?: StringFieldUpdateOperationsInput | string
    breath?: StringFieldUpdateOperationsInput | string
    duration?: StringFieldUpdateOperationsInput | string
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

  export type ProviderAccountListRelationFilter = {
    every?: ProviderAccountWhereInput
    some?: ProviderAccountWhereInput
    none?: ProviderAccountWhereInput
  }

  export type ProviderAccountOrderByRelationAggregateInput = {
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type AsanaPostureCountOrderByAggregateInput = {
    id?: SortOrder
    alternate_english_name?: SortOrder
    benefits?: SortOrder
    category?: SortOrder
    description?: SortOrder
    difficulty?: SortOrder
    simplified_english_name?: SortOrder
    english_name?: SortOrder
    next_poses?: SortOrder
    preferred_side?: SortOrder
    previous_poses?: SortOrder
    sanskrit_names?: SortOrder
    sideways?: SortOrder
    sort_english_name?: SortOrder
    subcategory?: SortOrder
    two_sided?: SortOrder
    variations_english_name?: SortOrder
    visibility?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    acitivity_completed?: SortOrder
    acitivity_easy?: SortOrder
    acitivity_difficult?: SortOrder
    acitivity_practice?: SortOrder
    posture_intent?: SortOrder
    posture_meaning?: SortOrder
    dristi?: SortOrder
    breath?: SortOrder
    duration?: SortOrder
  }

  export type AsanaPostureMaxOrderByAggregateInput = {
    id?: SortOrder
    alternate_english_name?: SortOrder
    benefits?: SortOrder
    category?: SortOrder
    description?: SortOrder
    difficulty?: SortOrder
    simplified_english_name?: SortOrder
    english_name?: SortOrder
    next_poses?: SortOrder
    preferred_side?: SortOrder
    previous_poses?: SortOrder
    sanskrit_names?: SortOrder
    sideways?: SortOrder
    sort_english_name?: SortOrder
    subcategory?: SortOrder
    two_sided?: SortOrder
    variations_english_name?: SortOrder
    visibility?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    acitivity_completed?: SortOrder
    acitivity_easy?: SortOrder
    acitivity_difficult?: SortOrder
    acitivity_practice?: SortOrder
    posture_intent?: SortOrder
    posture_meaning?: SortOrder
    dristi?: SortOrder
    breath?: SortOrder
    duration?: SortOrder
  }

  export type AsanaPostureMinOrderByAggregateInput = {
    id?: SortOrder
    alternate_english_name?: SortOrder
    benefits?: SortOrder
    category?: SortOrder
    description?: SortOrder
    difficulty?: SortOrder
    simplified_english_name?: SortOrder
    english_name?: SortOrder
    next_poses?: SortOrder
    preferred_side?: SortOrder
    previous_poses?: SortOrder
    sanskrit_names?: SortOrder
    sideways?: SortOrder
    sort_english_name?: SortOrder
    subcategory?: SortOrder
    two_sided?: SortOrder
    variations_english_name?: SortOrder
    visibility?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    acitivity_completed?: SortOrder
    acitivity_easy?: SortOrder
    acitivity_difficult?: SortOrder
    acitivity_practice?: SortOrder
    posture_intent?: SortOrder
    posture_meaning?: SortOrder
    dristi?: SortOrder
    breath?: SortOrder
    duration?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ProviderAccountCreateNestedManyWithoutUserInput = {
    create?: XOR<ProviderAccountCreateWithoutUserInput, ProviderAccountUncheckedCreateWithoutUserInput> | ProviderAccountCreateWithoutUserInput[] | ProviderAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProviderAccountCreateOrConnectWithoutUserInput | ProviderAccountCreateOrConnectWithoutUserInput[]
    createMany?: ProviderAccountCreateManyUserInputEnvelope
    connect?: ProviderAccountWhereUniqueInput | ProviderAccountWhereUniqueInput[]
  }

  export type ProviderAccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ProviderAccountCreateWithoutUserInput, ProviderAccountUncheckedCreateWithoutUserInput> | ProviderAccountCreateWithoutUserInput[] | ProviderAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProviderAccountCreateOrConnectWithoutUserInput | ProviderAccountCreateOrConnectWithoutUserInput[]
    createMany?: ProviderAccountCreateManyUserInputEnvelope
    connect?: ProviderAccountWhereUniqueInput | ProviderAccountWhereUniqueInput[]
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

  export type ProviderAccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProviderAccountCreateWithoutUserInput, ProviderAccountUncheckedCreateWithoutUserInput> | ProviderAccountCreateWithoutUserInput[] | ProviderAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProviderAccountCreateOrConnectWithoutUserInput | ProviderAccountCreateOrConnectWithoutUserInput[]
    upsert?: ProviderAccountUpsertWithWhereUniqueWithoutUserInput | ProviderAccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProviderAccountCreateManyUserInputEnvelope
    set?: ProviderAccountWhereUniqueInput | ProviderAccountWhereUniqueInput[]
    disconnect?: ProviderAccountWhereUniqueInput | ProviderAccountWhereUniqueInput[]
    delete?: ProviderAccountWhereUniqueInput | ProviderAccountWhereUniqueInput[]
    connect?: ProviderAccountWhereUniqueInput | ProviderAccountWhereUniqueInput[]
    update?: ProviderAccountUpdateWithWhereUniqueWithoutUserInput | ProviderAccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProviderAccountUpdateManyWithWhereWithoutUserInput | ProviderAccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProviderAccountScalarWhereInput | ProviderAccountScalarWhereInput[]
  }

  export type ProviderAccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProviderAccountCreateWithoutUserInput, ProviderAccountUncheckedCreateWithoutUserInput> | ProviderAccountCreateWithoutUserInput[] | ProviderAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProviderAccountCreateOrConnectWithoutUserInput | ProviderAccountCreateOrConnectWithoutUserInput[]
    upsert?: ProviderAccountUpsertWithWhereUniqueWithoutUserInput | ProviderAccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProviderAccountCreateManyUserInputEnvelope
    set?: ProviderAccountWhereUniqueInput | ProviderAccountWhereUniqueInput[]
    disconnect?: ProviderAccountWhereUniqueInput | ProviderAccountWhereUniqueInput[]
    delete?: ProviderAccountWhereUniqueInput | ProviderAccountWhereUniqueInput[]
    connect?: ProviderAccountWhereUniqueInput | ProviderAccountWhereUniqueInput[]
    update?: ProviderAccountUpdateWithWhereUniqueWithoutUserInput | ProviderAccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProviderAccountUpdateManyWithWhereWithoutUserInput | ProviderAccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProviderAccountScalarWhereInput | ProviderAccountScalarWhereInput[]
  }

  export type UserDataCreateNestedOneWithoutProviderAccountsInput = {
    create?: XOR<UserDataCreateWithoutProviderAccountsInput, UserDataUncheckedCreateWithoutProviderAccountsInput>
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
    create?: XOR<UserDataCreateWithoutProviderAccountsInput, UserDataUncheckedCreateWithoutProviderAccountsInput>
    connectOrCreate?: UserDataCreateOrConnectWithoutProviderAccountsInput
    upsert?: UserDataUpsertWithoutProviderAccountsInput
    connect?: UserDataWhereUniqueInput
    update?: XOR<XOR<UserDataUpdateToOneWithWhereWithoutProviderAccountsInput, UserDataUpdateWithoutProviderAccountsInput>, UserDataUncheckedUpdateWithoutProviderAccountsInput>
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProviderAccountCreateOrConnectWithoutUserInput = {
    where: ProviderAccountWhereUniqueInput
    create: XOR<ProviderAccountCreateWithoutUserInput, ProviderAccountUncheckedCreateWithoutUserInput>
  }

  export type ProviderAccountCreateManyUserInputEnvelope = {
    data: ProviderAccountCreateManyUserInput | ProviderAccountCreateManyUserInput[]
  }

  export type ProviderAccountUpsertWithWhereUniqueWithoutUserInput = {
    where: ProviderAccountWhereUniqueInput
    update: XOR<ProviderAccountUpdateWithoutUserInput, ProviderAccountUncheckedUpdateWithoutUserInput>
    create: XOR<ProviderAccountCreateWithoutUserInput, ProviderAccountUncheckedCreateWithoutUserInput>
  }

  export type ProviderAccountUpdateWithWhereUniqueWithoutUserInput = {
    where: ProviderAccountWhereUniqueInput
    data: XOR<ProviderAccountUpdateWithoutUserInput, ProviderAccountUncheckedUpdateWithoutUserInput>
  }

  export type ProviderAccountUpdateManyWithWhereWithoutUserInput = {
    where: ProviderAccountScalarWhereInput
    data: XOR<ProviderAccountUpdateManyMutationInput, ProviderAccountUncheckedUpdateManyWithoutUserInput>
  }

  export type ProviderAccountScalarWhereInput = {
    AND?: ProviderAccountScalarWhereInput | ProviderAccountScalarWhereInput[]
    OR?: ProviderAccountScalarWhereInput[]
    NOT?: ProviderAccountScalarWhereInput | ProviderAccountScalarWhereInput[]
    id?: StringFilter<"ProviderAccount"> | string
    userId?: StringFilter<"ProviderAccount"> | string
    type?: StringFilter<"ProviderAccount"> | string
    provider?: StringFilter<"ProviderAccount"> | string
    providerAccountId?: StringFilter<"ProviderAccount"> | string
    refresh_token?: StringNullableFilter<"ProviderAccount"> | string | null
    access_token?: StringNullableFilter<"ProviderAccount"> | string | null
    expires_at?: IntNullableFilter<"ProviderAccount"> | number | null
    token_type?: StringNullableFilter<"ProviderAccount"> | string | null
    scope?: StringNullableFilter<"ProviderAccount"> | string | null
    id_token?: StringNullableFilter<"ProviderAccount"> | string | null
    session_state?: JsonNullableFilter<"ProviderAccount">
    createdAt?: DateTimeFilter<"ProviderAccount"> | Date | string
    updatedAt?: DateTimeFilter<"ProviderAccount"> | Date | string
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
  }

  export type UserDataCreateOrConnectWithoutProviderAccountsInput = {
    where: UserDataWhereUniqueInput
    create: XOR<UserDataCreateWithoutProviderAccountsInput, UserDataUncheckedCreateWithoutProviderAccountsInput>
  }

  export type UserDataUpsertWithoutProviderAccountsInput = {
    update: XOR<UserDataUpdateWithoutProviderAccountsInput, UserDataUncheckedUpdateWithoutProviderAccountsInput>
    create: XOR<UserDataCreateWithoutProviderAccountsInput, UserDataUncheckedCreateWithoutProviderAccountsInput>
    where?: UserDataWhereInput
  }

  export type UserDataUpdateToOneWithWhereWithoutProviderAccountsInput = {
    where?: UserDataWhereInput
    data: XOR<UserDataUpdateWithoutProviderAccountsInput, UserDataUncheckedUpdateWithoutProviderAccountsInput>
  }

  export type UserDataUpdateWithoutProviderAccountsInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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
  }

  export type UserDataUncheckedUpdateWithoutProviderAccountsInput = {
    provider_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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
    createdAt?: Date | string
    updatedAt?: Date | string
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserDataCountOutputTypeDefaultArgs instead
     */
    export type UserDataCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDataCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDataDefaultArgs instead
     */
    export type UserDataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDataDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProviderAccountDefaultArgs instead
     */
    export type ProviderAccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProviderAccountDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AsanaPostureDefaultArgs instead
     */
    export type AsanaPostureArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AsanaPostureDefaultArgs<ExtArgs>

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