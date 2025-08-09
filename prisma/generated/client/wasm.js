
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.16.1
 * Query Engine version: 34ace0eb2704183d2c05b60b52fba5c43c13f303
 */
Prisma.prismaVersion = {
  client: "5.16.1",
  engine: "34ace0eb2704183d2c05b60b52fba5c43c13f303"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.UserDataScalarFieldEnum = {
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
  websiteURL: 'websiteURL',
  shareQuick: 'shareQuick',
  yogaStyle: 'yogaStyle',
  yogaExperience: 'yogaExperience',
  company: 'company',
  socialURL: 'socialURL',
  isLocationPublic: 'isLocationPublic',
  role: 'role',
  profileImages: 'profileImages',
  activeProfileImage: 'activeProfileImage'
};

exports.Prisma.ProviderAccountScalarFieldEnum = {
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
  credentials_password: 'credentials_password',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AsanaPostureScalarFieldEnum = {
  id: 'id',
  english_names: 'english_names',
  sanskrit_names: 'sanskrit_names',
  sort_english_name: 'sort_english_name',
  description: 'description',
  benefits: 'benefits',
  category: 'category',
  difficulty: 'difficulty',
  lore: 'lore',
  breath_direction_default: 'breath_direction_default',
  dristi: 'dristi',
  variations: 'variations',
  modifications: 'modifications',
  label: 'label',
  suggested_postures: 'suggested_postures',
  preparatory_postures: 'preparatory_postures',
  preferred_side: 'preferred_side',
  sideways: 'sideways',
  image: 'image',
  created_on: 'created_on',
  updated_on: 'updated_on',
  acitivity_completed: 'acitivity_completed',
  acitivity_practice: 'acitivity_practice',
  posture_intent: 'posture_intent',
  breath_series: 'breath_series',
  duration_asana: 'duration_asana',
  transition_cues_out: 'transition_cues_out',
  transition_cues_in: 'transition_cues_in',
  setup_cues: 'setup_cues',
  deepening_cues: 'deepening_cues',
  customize_asana: 'customize_asana',
  additional_cues: 'additional_cues',
  joint_action: 'joint_action',
  muscle_action: 'muscle_action',
  created_by: 'created_by'
};

exports.Prisma.AsanaSeriesScalarFieldEnum = {
  id: 'id',
  seriesName: 'seriesName',
  seriesPostures: 'seriesPostures',
  breathSeries: 'breathSeries',
  description: 'description',
  durationSeries: 'durationSeries',
  image: 'image',
  created_by: 'created_by',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AsanaSequenceScalarFieldEnum = {
  id: 'id',
  nameSequence: 'nameSequence',
  sequencesSeries: 'sequencesSeries',
  description: 'description',
  durationSequence: 'durationSequence',
  image: 'image',
  breath_direction: 'breath_direction',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AsanaActivityScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  postureId: 'postureId',
  postureName: 'postureName',
  sort_english_name: 'sort_english_name',
  duration: 'duration',
  datePerformed: 'datePerformed',
  notes: 'notes',
  sensations: 'sensations',
  completionStatus: 'completionStatus',
  difficulty: 'difficulty',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SeriesActivityScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  seriesId: 'seriesId',
  seriesName: 'seriesName',
  datePerformed: 'datePerformed',
  difficulty: 'difficulty',
  completionStatus: 'completionStatus',
  duration: 'duration',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SequenceActivityScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  sequenceId: 'sequenceId',
  sequenceName: 'sequenceName',
  datePerformed: 'datePerformed',
  difficulty: 'difficulty',
  completionStatus: 'completionStatus',
  duration: 'duration',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserLoginScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  loginDate: 'loginDate',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  provider: 'provider',
  createdAt: 'createdAt'
};

exports.Prisma.PoseImageScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  postureId: 'postureId',
  postureName: 'postureName',
  url: 'url',
  altText: 'altText',
  fileName: 'fileName',
  fileSize: 'fileSize',
  uploadedAt: 'uploadedAt',
  storageType: 'storageType',
  localStorageId: 'localStorageId',
  cloudflareId: 'cloudflareId',
  isOffline: 'isOffline',
  imageType: 'imageType',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GlossaryTermScalarFieldEnum = {
  id: 'id',
  term: 'term',
  meaning: 'meaning',
  whyMatters: 'whyMatters',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};
exports.StorageType = exports.$Enums.StorageType = {
  CLOUD: 'CLOUD',
  LOCAL: 'LOCAL',
  HYBRID: 'HYBRID'
};

exports.Prisma.ModelName = {
  UserData: 'UserData',
  ProviderAccount: 'ProviderAccount',
  AsanaPosture: 'AsanaPosture',
  AsanaSeries: 'AsanaSeries',
  AsanaSequence: 'AsanaSequence',
  AsanaActivity: 'AsanaActivity',
  SeriesActivity: 'SeriesActivity',
  SequenceActivity: 'SequenceActivity',
  UserLogin: 'UserLogin',
  PoseImage: 'PoseImage',
  GlossaryTerm: 'GlossaryTerm'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
