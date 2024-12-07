Object.defineProperty(exports, "__esModule", { value: true })

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
} = require("./runtime/edge.js")

const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.16.1
 * Query Engine version: 34ace0eb2704183d2c05b60b52fba5c43c13f303
 */
Prisma.prismaVersion = {
  client: "5.16.1",
  engine: "34ace0eb2704183d2c05b60b52fba5c43c13f303",
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
 * Extensions
 */
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull,
}

/**
 * Enums
 */
exports.Prisma.UserDataScalarFieldEnum = {
  id: "id",
  provider_id: "provider_id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  pronouns: "pronouns",
  profile: "profile",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  firstName: "firstName",
  lastName: "lastName",
  bio: "bio",
  headline: "headline",
  location: "location",
  websiteURL: "websiteURL",
  shareQuick: "shareQuick",
  yogaStyle: "yogaStyle",
  yogaExperience: "yogaExperience",
  company: "company",
  socialURL: "socialURL",
  isLocationPublic: "isLocationPublic",
  role: "role",
}

exports.Prisma.ProviderAccountScalarFieldEnum = {
  id: "id",
  userId: "userId",
  type: "type",
  provider: "provider",
  providerAccountId: "providerAccountId",
  refresh_token: "refresh_token",
  access_token: "access_token",
  expires_at: "expires_at",
  token_type: "token_type",
  scope: "scope",
  id_token: "id_token",
  session_state: "session_state",
  credentials_password: "credentials_password",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
}

exports.Prisma.AsanaPostureScalarFieldEnum = {
  id: "id",
  english_names: "english_names",
  sanskrit_names: "sanskrit_names",
  sort_english_name: "sort_english_name",
  description: "description",
  benefits: "benefits",
  category: "category",
  difficulty: "difficulty",
  lore: "lore",
  breath_direction_default: "breath_direction_default",
  dristi: "dristi",
  variations: "variations",
  modifications: "modifications",
  suggested_postures: "suggested_postures",
  preparatory_postures: "preparatory_postures",
  preferred_side: "preferred_side",
  sideways: "sideways",
  image: "image",
  created_on: "created_on",
  updated_on: "updated_on",
  acitivity_completed: "acitivity_completed",
  acitivity_practice: "acitivity_practice",
  posture_intent: "posture_intent",
  breath_series: "breath_series",
  duration_asana: "duration_asana",
  transition_cues_out: "transition_cues_out",
  transition_cues_in: "transition_cues_in",
  setup_cues: "setup_cues",
  deepening_cues: "deepening_cues",
  customize_asana: "customize_asana",
  additional_cues: "additional_cues",
  joint_action: "joint_action",
  muscle_action: "muscle_action",
  created_by: "created_by",
}

exports.Prisma.AsanaSeriesScalarFieldEnum = {
  id: "id",
  seriesName: "seriesName",
  seriesPostures: "seriesPostures",
  breathSeries: "breathSeries",
  description: "description",
  durationSeries: "durationSeries",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
}

exports.Prisma.AsanaSequenceScalarFieldEnum = {
  id: "id",
  nameSequence: "nameSequence",
  sequencesSeries: "sequencesSeries",
  description: "description",
  durationSequence: "durationSequence",
  image: "image",
  breath_direction: "breath_direction",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
}

exports.Prisma.SortOrder = {
  asc: "asc",
  desc: "desc",
}

exports.Prisma.QueryMode = {
  default: "default",
  insensitive: "insensitive",
}

exports.Prisma.ModelName = {
  UserData: "UserData",
  ProviderAccount: "ProviderAccount",
  AsanaPosture: "AsanaPosture",
  AsanaSeries: "AsanaSeries",
  AsanaSequence: "AsanaSequence",
}
/**
 * Create the Client
 */
const config = {
  generator: {
    name: "client",
    provider: {
      fromEnvVar: null,
      value: "prisma-client-js",
    },
    output: {
      value:
        "C:\\Users\\trewa\\Documents\\Github\\NextJS tutorials\\soar\\prisma\\generated\\client",
      fromEnvVar: null,
    },
    config: {
      engineType: "library",
    },
    binaryTargets: [
      {
        fromEnvVar: null,
        value: "windows",
        native: true,
      },
      {
        fromEnvVar: null,
        value: "rhel-openssl-3.0.x",
      },
    ],
    previewFeatures: [],
    sourceFilePath:
      "C:\\Users\\trewa\\Documents\\Github\\NextJS tutorials\\soar\\prisma\\schema.prisma",
    isCustomOutput: true,
  },
  relativeEnvPaths: {
    rootEnvPath: null,
    schemaEnvPath: "../../../.env",
  },
  relativePath: "../..",
  clientVersion: "5.16.1",
  engineVersion: "34ace0eb2704183d2c05b60b52fba5c43c13f303",
  datasourceNames: ["db"],
  activeProvider: "mongodb",
  inlineDatasources: {
    db: {
      url: {
        fromEnvVar: "MONGODB_URI_v2",
        value: null,
      },
    },
  },
  inlineSchema:
    'datasource db {\n  provider = "mongodb"\n  url      = env("MONGODB_URI_v2")\n}\n\ngenerator client {\n  provider      = "prisma-client-js"\n  output        = "./generated/client"\n  binaryTargets = ["native", "rhel-openssl-3.0.x"]\n}\n\nmodel UserData {\n  id               String    @id @default(auto()) @map("_id") @db.ObjectId\n  provider_id      String?   @unique\n  name             String?\n  email            String?   @unique\n  emailVerified    DateTime?\n  image            String?\n  pronouns         String?\n  profile          Json?\n  createdAt        DateTime  @default(now())\n  updatedAt        DateTime  @updatedAt\n  firstName        String\n  lastName         String\n  bio              String\n  headline         String\n  location         String\n  websiteURL       String\n  shareQuick       String?\n  yogaStyle        String?\n  yogaExperience   String?\n  company          String?\n  socialURL        String?\n  isLocationPublic String?\n  role             String?\n\n  // emailPublic       String\n  // emailInternal     String\n  // emailAlternate    String\n  // phoneContact      String\n  // Facebook          String\n  // Google            String\n  // Patreon           String\n  // Twitch            String\n  // Twitter           String\n  // blogURL           String\n  // streamingURL      String\n  // isInstructor      String\n  // isStudent         String\n  // isPrivate         String\n  // calendar          String\n  // timezone          String\n  // exportAccountInfo String\n  // deleteAccountInfo String\n  providerAccounts ProviderAccount[]\n}\n\nmodel ProviderAccount {\n  id                   String  @id @default(auto()) @map("_id") @db.ObjectId\n  userId               String  @unique @db.ObjectId\n  type                 String\n  provider             String\n  providerAccountId    String\n  refresh_token        String?\n  access_token         String?\n  expires_at           Int?\n  token_type           String?\n  scope                String?\n  id_token             String?\n  session_state        Json?\n  credentials_password String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user UserData @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  // @@unique([provider, providerAccountId])\n}\n\n/// Represents a yoga Asana in the app.\nmodel AsanaPosture {\n  id                       String    @id @default(auto()) @map("_id") @db.ObjectId\n  english_names            String[]\n  sanskrit_names           Json?\n  sort_english_name        String    @unique\n  description              String?\n  benefits                 String?\n  category                 String?\n  difficulty               String?\n  lore                     String?\n  breath_direction_default String?\n  dristi                   String?\n  variations               String[]\n  modifications            String[]\n  suggested_postures       String[]\n  preparatory_postures     String[]\n  preferred_side           String?\n  sideways                 Boolean?\n  image                    String?\n  created_on               DateTime? @default(now())\n  updated_on               DateTime? @updatedAt\n  acitivity_completed      Boolean?\n  acitivity_practice       Boolean?\n  posture_intent           String?\n  breath_series            String[]\n  duration_asana           String?\n  transition_cues_out      String?\n  transition_cues_in       String?\n  setup_cues               String?\n  deepening_cues           String?\n  customize_asana          String?\n  additional_cues          String?\n  joint_action             String?\n  muscle_action            String?\n  created_by               String?\n}\n\nmodel AsanaSeries {\n  id             String    @id @default(auto()) @map("_id") @db.ObjectId\n  seriesName     String\n  seriesPostures String[]\n  // breath           String?\n  // breath specified for the series\n  breathSeries   String[]\n  description    String?\n  durationSeries String?\n  image          String?\n  createdAt      DateTime? @default(now())\n  updatedAt      DateTime? @updatedAt\n}\n\nmodel AsanaSequence {\n  id               String    @id @default(auto()) @map("_id") @db.ObjectId\n  nameSequence     String\n  sequencesSeries  Json[]\n  description      String?\n  durationSequence String?\n  image            String?\n  breath_direction String?\n  createdAt        DateTime? @default(now())\n  updatedAt        DateTime? @updatedAt\n}\n',
  inlineSchemaHash:
    "bd099632b3c93ab418cc79e84acdda715e9c02768cc02e30635dd7790423537a",
  copyEngine: true,
}
config.dirname = "/"

config.runtimeDataModel = JSON.parse(
  '{"models":{"UserData":{"dbName":null,"fields":[{"name":"id","dbName":"_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"auto","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"provider_id","kind":"scalar","isList":false,"isRequired":false,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"email","kind":"scalar","isList":false,"isRequired":false,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"emailVerified","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"image","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"pronouns","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"profile","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"firstName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"lastName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"bio","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"headline","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"location","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"websiteURL","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"shareQuick","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"yogaStyle","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"yogaExperience","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"company","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"socialURL","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"isLocationPublic","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"role","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"providerAccounts","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ProviderAccount","relationName":"ProviderAccountToUserData","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"ProviderAccount":{"dbName":null,"fields":[{"name":"id","dbName":"_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"auto","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"type","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"provider","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"providerAccountId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"refresh_token","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"access_token","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"expires_at","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"token_type","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"scope","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"id_token","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"session_state","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","isGenerated":false,"isUpdatedAt":false},{"name":"credentials_password","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"UserData","relationName":"ProviderAccountToUserData","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"AsanaPosture":{"dbName":null,"fields":[{"name":"id","dbName":"_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"auto","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"english_names","kind":"scalar","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"sanskrit_names","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","isGenerated":false,"isUpdatedAt":false},{"name":"sort_english_name","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"benefits","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"category","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"difficulty","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"lore","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"breath_direction_default","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"dristi","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"variations","kind":"scalar","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"modifications","kind":"scalar","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"suggested_postures","kind":"scalar","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"preparatory_postures","kind":"scalar","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"preferred_side","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"sideways","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Boolean","isGenerated":false,"isUpdatedAt":false},{"name":"image","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"created_on","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updated_on","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"acitivity_completed","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Boolean","isGenerated":false,"isUpdatedAt":false},{"name":"acitivity_practice","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Boolean","isGenerated":false,"isUpdatedAt":false},{"name":"posture_intent","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"breath_series","kind":"scalar","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"duration_asana","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"transition_cues_out","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"transition_cues_in","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"setup_cues","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"deepening_cues","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"customize_asana","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"additional_cues","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"joint_action","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"muscle_action","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"created_by","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false,"documentation":"Represents a yoga Asana in the app."},"AsanaSeries":{"dbName":null,"fields":[{"name":"id","dbName":"_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"auto","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"seriesName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"seriesPostures","kind":"scalar","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"breathSeries","kind":"scalar","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"durationSeries","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"image","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"AsanaSequence":{"dbName":null,"fields":[{"name":"id","dbName":"_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"auto","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"nameSequence","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"sequencesSeries","kind":"scalar","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"durationSequence","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"image","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"breath_direction","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false}},"enums":{},"types":{}}'
)
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    MONGODB_URI_v2:
      (typeof globalThis !== "undefined" && globalThis["MONGODB_URI_v2"]) ||
      (typeof process !== "undefined" &&
        process.env &&
        process.env.MONGODB_URI_v2) ||
      undefined,
  },
})

if (
  (typeof globalThis !== "undefined" && globalThis["DEBUG"]) ||
  (typeof process !== "undefined" && process.env && process.env.DEBUG) ||
  undefined
) {
  Debug.enable(
    (typeof globalThis !== "undefined" && globalThis["DEBUG"]) ||
      (typeof process !== "undefined" && process.env && process.env.DEBUG) ||
      undefined
  )
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)
